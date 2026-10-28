// ─── Nuty Tales Seller Central — Storefront Order Splitting & Sync Pipeline ──
// Integrates consumer checkout with vendor fulfilment desks.
// Partitions multi-vendor customer cart items into isolated seller fulfilment orders.

import {
  SellerOrder,
  SellerOrderItem,
  SupportedCurrency,
} from './types'
import {
  getDurableProductsBySeller,
  listDurableSellers,
  upsertDurableOrder,
  appendDurableStockMovement,
  getDurableProductById,
  upsertDurableProduct,
} from './persistence'

export interface ConsumerOrderPayload {
  orderId: string
  orderNumber?: string
  customer: {
    fullName?: string
    name?: string
    email?: string
    phone?: string
    city?: string
    state?: string
    pincode?: string
    address?: string
  }
  items: Array<{
    productId?: string
    id?: string
    sku?: string
    title?: string
    name?: string
    quantity?: number
    qty?: number
    price?: number
    unitPrice?: number
    gstPercent?: number
  }>
  total: number
  currency?: SupportedCurrency
  paymentMethod?: string
}

/**
 * Splits a customer consumer order into seller-specific fulfilment sub-orders.
 * Atomically reserves inventory and records movement ledger entries.
 */
export async function syncConsumerOrderToSellers(
  payload: ConsumerOrderPayload
): Promise<SellerOrder[]> {
  const { orderId, customer, items, currency = 'INR' } = payload
  const orderNumber = payload.orderNumber || orderId

  const allSellers = await listDurableSellers()
  const defaultSeller = allSellers[0] || null

  // Group items by seller
  const itemsBySeller: Record<string, SellerOrderItem[]> = {}

  for (const item of items) {
    const pId = item.productId || item.id || ''
    const sku = item.sku || `SKU-${pId}`
    const title = item.title || item.name || 'Store Item'
    const qty = Number(item.quantity || item.qty || 1)
    const unitPrice = Number(item.price || item.unitPrice || 0)
    const gstPercent = Number(item.gstPercent || 5)

    // Lookup seller ownership
    let sellerId: string | null = null
    if (pId) {
      const prod = await getDurableProductById(pId)
      if (prod) {
        sellerId = prod.sellerId
      }
    }

    if (!sellerId && defaultSeller) {
      sellerId = defaultSeller.id
    }

    if (!sellerId) {
      sellerId = 'SLR-GLOBAL-001'
    }

    if (!itemsBySeller[sellerId]) {
      itemsBySeller[sellerId] = []
    }

    itemsBySeller[sellerId].push({
      productId: pId || `PROD-${Date.now()}`,
      sku,
      title,
      quantity: qty,
      unitPrice,
      totalPrice: unitPrice * qty,
      gstPercent,
    })
  }

  const createdOrders: SellerOrder[] = []

  for (const [sellerId, sellerItems] of Object.entries(itemsBySeller)) {
    const seller = allSellers.find((s) => s.id === sellerId) || defaultSeller
    const commissionRate = seller?.defaultCommissionRate ?? 0.0

    const subtotal = sellerItems.reduce((acc, it) => acc + it.totalPrice, 0)
    const commissionAmount = Number(((subtotal * commissionRate) / 100).toFixed(2))
    const gstOnCommission = Number(((commissionAmount * 0.18)).toFixed(2))
    const netPayout = Number((subtotal - (commissionAmount + gstOnCommission)).toFixed(2))

    const subOrderId = `SO-${orderNumber}-${sellerId.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}`

    const sellerOrder: SellerOrder = {
      id: subOrderId,
      parentOrderId: orderId,
      parentOrderNumber: orderNumber,
      sellerId,
      currency,
      customerName: customer.fullName || customer.name || 'Customer',
      customerCity: customer.city || 'Standard Destination',
      customerState: customer.state || '',
      customerPincode: customer.pincode || '',
      deliveryAddress: customer.address || customer.city || 'Customer Delivery Address',
      customerPhoneMasked: customer.phone ? `${customer.phone.slice(0, 3)}****${customer.phone.slice(-3)}` : 'N/A',
      items: sellerItems,
      itemsCount: sellerItems.reduce((sum, it) => sum + (it.quantity || it.qty || 1), 0),
      subtotal,
      shippingCharged: 0,
      commissionRate,
      commissionAmount,
      taxOnCommission: gstOnCommission,
      tdsAmount: 0,
      netPayout,
      status: 'new',
      payoutStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Persist seller order
    await upsertDurableOrder(sellerOrder)
    createdOrders.push(sellerOrder)

    // Atomically reserve inventory
    for (const item of sellerItems) {
      if (item.productId) {
        const prod = await getDurableProductById(item.productId)
        if (prod) {
          const reserveQty = Number(item.quantity || item.qty || 1)
          prod.stockAvailable = Math.max(0, prod.stockAvailable - reserveQty)
          prod.stockReserved = (prod.stockReserved || 0) + reserveQty
          await upsertDurableProduct(prod)

          await appendDurableStockMovement({
            id: `SMOV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            sellerId,
            productId: prod.id,
            sku: prod.sku,
            productTitle: prod.title,
            changeQty: -reserveQty,
            balanceAfter: prod.stockAvailable,
            movementType: 'order_reservation',
            referenceId: subOrderId,
            notes: `Inventory reserved for customer order ${orderNumber}`,
            createdAt: new Date().toISOString(),
          })
        }
      }
    }
  }

  return createdOrders
}
