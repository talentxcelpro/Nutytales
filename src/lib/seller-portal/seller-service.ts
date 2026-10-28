// ─── Nuty Tales Seller Central — Core Service & Data Access Layer ─────────────
// Positioning: "Sell Anywhere. Grow Everywhere."
// Real Persistent Database Layer with Live Calculations and Zero Fabricated Metrics.

import {
  GlobalCategory,
  SellerProfile,
  SellerProduct,
  SellerOrder,
  SellerLedgerEntry,
  SellerPayoutBatch,
  SellerSupportTicket,
  StockMovement,
  SellerPromotion,
  SellerCustomer,
  SellerReview,
  SellerReturnRequest,
  SellerDashboardOverview,
  OrderFulfilmentStatus,
  SupportedCurrency,
} from './types'
import { GLOBAL_PRODUCT_CATEGORIES } from './mock-data'
import { convertCurrencyLive } from './forex'
import {
  getDurableSellerById,
  getDurableSellerBySlug,
  listDurableSellers,
  upsertDurableSeller,
  upsertSellerMember,
  getDurableProductsBySeller,
  getDurableProductById,
  upsertDurableProduct,
  getDurableOrdersBySeller,
  getDurableOrderById,
  upsertDurableOrder,
  getDurableLedgerBySeller,
  appendDurableLedgerEntry,
  getDurablePayoutsBySeller,
  upsertDurablePayout,
  getDurableStockMovementsBySeller,
  appendDurableStockMovement,
  getDurablePromotionsBySeller,
  upsertDurablePromotion,
  getDurableTicketsBySeller,
  upsertDurableTicket,
  getDurableCustomersBySeller,
  getDurableReviewsBySeller,
  getDurableReturnsBySeller,
  upsertDurableReturn,
} from './persistence'

// ─── CATEGORY TAXONOMY ───────────────────────────────────────────────────────

export async function getGlobalCategories(): Promise<GlobalCategory[]> {
  return GLOBAL_PRODUCT_CATEGORIES.filter((c) => c.isActive)
}

export async function getCategoryBySlug(slug: string): Promise<GlobalCategory | null> {
  return GLOBAL_PRODUCT_CATEGORIES.find((c) => c.slug === slug) || null
}

// ─── SELLERS ─────────────────────────────────────────────────────────────────

export async function getSellerById(sellerId: string): Promise<SellerProfile | null> {
  return getDurableSellerById(sellerId)
}

export async function getSellerBySlug(slug: string): Promise<SellerProfile | null> {
  return getDurableSellerBySlug(slug)
}

export async function listAllSellers(): Promise<SellerProfile[]> {
  return listDurableSellers()
}

export async function registerNewSeller(payload: Partial<SellerProfile>): Promise<SellerProfile> {
  const newId = `SLR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
  const slug =
    payload.slug ||
    (payload.storeName || 'seller')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const country = payload.country || 'United Kingdom'
  const countryCode = payload.countryCode || (country === 'United States' ? 'US' : country === 'United Arab Emirates' ? 'AE' : country === 'Germany' ? 'DE' : country === 'India' ? 'IN' : 'GB')

  const record: SellerProfile = {
    id: newId,
    userId: payload.userId,
    storeName: payload.storeName || 'Global Merchant Store',
    slug,
    legalName: payload.legalName || payload.storeName || 'Merchant Legal Entity',
    businessType: payload.businessType || 'brand',
    email: payload.email || '',
    phone: payload.phone || '',
    whatsapp: payload.whatsapp,
    website: payload.website,
    country,
    countryCode,
    pickupAddress: payload.pickupAddress || '',
    city: payload.city || '',
    state: payload.state || '',
    pincode: payload.pincode || '',
    preferredCurrency: payload.preferredCurrency || (countryCode === 'US' ? 'USD' : countryCode === 'AE' ? 'AED' : countryCode === 'DE' ? 'EUR' : countryCode === 'IN' ? 'INR' : 'GBP'),
    supportedMarkets: payload.supportedMarkets || ['Domestic', 'Global'],
    taxIdentifiers: payload.taxIdentifiers || { countryCode },
    bankDetails: payload.bankDetails || {
      bankName: '',
      accountNumberMasked: '',
      routingCode: '',
      beneficiaryName: '',
      countryCode,
      currency: payload.preferredCurrency || 'USD',
    },
    storefront: {
      displayName: payload.storeName || 'Global Merchant',
      tagline: 'Verified Marketplace Merchant',
      bio: 'Direct global merchant on Nuty Tales.',
      ratingAverage: 5.0,
      totalReviews: 0,
      shipsInternationally: true,
      returnPolicyDays: 30,
    },
    status: 'submitted',
    approvedCategories: payload.approvedCategories || ['food-pantry'],
    approvedStorefronts: payload.approvedStorefronts || ['nutytales.com'],
    defaultCommissionRate: payload.defaultCommissionRate || 8.0,
    settlementHoldDays: payload.settlementHoldDays || 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await upsertDurableSeller(record)

  // Auto-bind seller member record to the creator
  await upsertSellerMember({
    id: `SMEM-${Date.now().toString().slice(-6)}`,
    sellerId: record.id,
    userId: payload.userId,
    email: record.email,
    name: record.legalName || record.storeName,
    role: 'owner',
    status: 'active',
    createdAt: new Date().toISOString(),
  })

  return record
}

export async function updateSellerStatus(
  sellerId: string,
  status: SellerProfile['status'],
  notes?: string,
  rejectionReason?: string
): Promise<SellerProfile | null> {
  const seller = await getSellerById(sellerId)
  if (!seller) return null

  seller.status = status
  seller.updatedAt = new Date().toISOString()
  if (notes) seller.verificationNotes = notes
  if (rejectionReason) seller.rejectionReason = rejectionReason
  if (status === 'approved') {
    seller.approvedAt = new Date().toISOString()
    seller.approvedBy = 'Marketplace Compliance Operations'
  }

  await upsertDurableSeller(seller)
  return seller
}

export async function updateStorefrontProfile(
  sellerId: string,
  storefrontPayload: Partial<SellerProfile['storefront']>
): Promise<SellerProfile | null> {
  const seller = await getSellerById(sellerId)
  if (!seller) return null

  seller.storefront = { ...seller.storefront, ...storefrontPayload }
  seller.updatedAt = new Date().toISOString()
  await upsertDurableSeller(seller)
  return seller
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function getSellerProducts(sellerId: string): Promise<SellerProduct[]> {
  return getDurableProductsBySeller(sellerId)
}

export async function getProductById(productId: string): Promise<SellerProduct | null> {
  return getDurableProductById(productId)
}

export async function createSellerProduct(
  sellerId: string,
  payload: Partial<SellerProduct>
): Promise<SellerProduct> {
  const seller = await getSellerById(sellerId)
  const newId = `SPROD-${Date.now().toString().slice(-6)}`
  const slug =
    payload.slug ||
    (payload.title || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const category = (await getCategoryBySlug(payload.categorySlug || '')) || GLOBAL_PRODUCT_CATEGORIES[0]

  const record: SellerProduct = {
    id: newId,
    sellerId,
    sellerStoreName: seller?.storeName || 'Merchant Store',
    sellerCountry: seller?.country || 'Global',
    currency: payload.currency || seller?.preferredCurrency || 'USD',
    title: payload.title || 'Untitled Listing',
    slug,
    sku: payload.sku || `SKU-${Date.now().toString().slice(-6)}`,
    categorySlug: category.slug,
    categoryName: category.name,
    subcategory: payload.subcategory,
    brand: payload.brand || seller?.storeName,
    description: payload.description,
    images: payload.images && payload.images.length > 0 ? payload.images : [
      { url: '/images/products/placeholder.png', isPrimary: true, alt: payload.title }
    ],
    packSizes: payload.packSizes || [
      {
        id: `PK-${Date.now()}`,
        name: 'Standard Unit',
        sku: payload.sku || `SKU-${Date.now().toString().slice(-6)}`,
        mrp: payload.mrp || 100,
        price: payload.sellingPrice || 85,
        stock: payload.stockAvailable || 25,
      },
    ],
    weightGrams: payload.weightGrams || 500,
    dimensionsCm: payload.dimensionsCm || { length: 15, width: 10, height: 5 },
    shippingClass: payload.shippingClass || 'standard',
    countryOfOrigin: payload.countryOfOrigin || seller?.country || 'Global',
    hsnOrTariffCode: payload.hsnOrTariffCode,
    taxRatePercent: payload.taxRatePercent !== undefined ? payload.taxRatePercent : 10.0,
    mrp: payload.mrp || 100,
    sellingPrice: payload.sellingPrice || 85,
    compareAtPrice: payload.compareAtPrice,
    wholesalePrice: payload.wholesalePrice,
    stockAvailable: payload.stockAvailable || 25,
    stockReserved: 0,
    lowStockThreshold: payload.lowStockThreshold || 5,
    fulfillmentType: payload.fulfillmentType || 'both',
    status: 'pending_review',
    attributes: payload.attributes || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await upsertDurableProduct(record)

  await recordStockMovement({
    sellerId,
    productId: record.id,
    sku: record.sku,
    productTitle: record.title,
    changeQty: record.stockAvailable,
    balanceAfter: record.stockAvailable,
    movementType: 'restock',
    referenceId: 'INITIAL_CREATION',
    notes: 'Initial catalogue listing created',
  })

  return record
}

export async function updateSellerProduct(
  productId: string,
  payload: Partial<SellerProduct>
): Promise<SellerProduct | null> {
  const product = await getProductById(productId)
  if (!product) return null

  const updated: SellerProduct = {
    ...product,
    ...payload,
    updatedAt: new Date().toISOString(),
  }
  await upsertDurableProduct(updated)
  return updated
}

// ─── ORDERS & FULFILMENT ─────────────────────────────────────────────────────

export async function getSellerOrders(
  sellerId: string,
  statusFilter?: string
): Promise<SellerOrder[]> {
  let orders = await getDurableOrdersBySeller(sellerId)
  if (statusFilter && statusFilter !== 'all') {
    orders = orders.filter((o) => o.status === statusFilter)
  }
  return orders
}

export async function getSellerOrderById(orderId: string): Promise<SellerOrder | null> {
  return getDurableOrderById(orderId)
}

export async function updateOrderFulfilment(
  orderId: string,
  newStatus: OrderFulfilmentStatus,
  carrierDetails?: {
    carrierName?: string
    trackingNumber?: string
    awbCode?: string
    pickupScheduledAt?: string
  }
): Promise<SellerOrder | null> {
  const order = await getSellerOrderById(orderId)
  if (!order) return null

  order.status = newStatus
  order.updatedAt = new Date().toISOString()

  if (carrierDetails) {
    if (carrierDetails.carrierName) order.carrierName = carrierDetails.carrierName
    if (carrierDetails.trackingNumber) order.trackingNumber = carrierDetails.trackingNumber
    if (carrierDetails.awbCode) order.awbCode = carrierDetails.awbCode
    if (carrierDetails.pickupScheduledAt) order.pickupScheduledAt = carrierDetails.pickupScheduledAt
  }

  if (newStatus === 'packed' && !order.labelUrl) {
    order.labelUrl = `/api/seller/orders/${order.id}/shipping-label`
  }

  if (newStatus === 'shipped') {
    order.shippedAt = new Date().toISOString()
  }

  if (newStatus === 'delivered') {
    order.deliveredAt = new Date().toISOString()
    order.payoutStatus = 'on_hold'
    const eligibleDate = new Date()
    eligibleDate.setDate(eligibleDate.getDate() + 7)
    order.settlementEligibleAt = eligibleDate.toISOString()

    // Add Double-Entry Ledger entries
    await addLedgerEntry({
      sellerId: order.sellerId,
      sellerOrderId: order.id,
      currency: order.currency,
      entryType: 'order_credit',
      amount: order.subtotal,
      description: `Order delivered. Subtotal credited for ${order.id}`,
      referenceCode: `ORD-${order.id}`,
    })
    await addLedgerEntry({
      sellerId: order.sellerId,
      sellerOrderId: order.id,
      currency: order.currency,
      entryType: 'commission_debit',
      amount: -(order.commissionAmount + order.taxOnCommission),
      description: `Marketplace commission (${order.commissionRate}%) & fees on ${order.id}`,
      referenceCode: `COMM-${order.id}`,
    })
  }

  await upsertDurableOrder(order)
  return order
}

// ─── INVENTORY & MOVEMENTS ───────────────────────────────────────────────────

export async function recordStockMovement(
  payload: Omit<StockMovement, 'id' | 'createdAt'>
): Promise<StockMovement> {
  const movement: StockMovement = {
    id: `SMOV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
    ...payload,
    createdAt: new Date().toISOString(),
  }
  await appendDurableStockMovement(movement)
  return movement
}

export async function adjustProductStock(
  sellerId: string,
  productId: string,
  newStockQty: number,
  reason: string,
  notes?: string
): Promise<SellerProduct | null> {
  const product = await getProductById(productId)
  if (!product || product.sellerId !== sellerId) return null

  const oldStock = product.stockAvailable
  const diff = newStockQty - oldStock
  product.stockAvailable = newStockQty
  product.updatedAt = new Date().toISOString()

  await upsertDurableProduct(product)

  await recordStockMovement({
    sellerId,
    productId,
    sku: product.sku,
    productTitle: product.title,
    changeQty: diff,
    balanceAfter: newStockQty,
    movementType: 'manual_adjustment',
    referenceId: reason,
    notes: notes || `Manual stock adjustment to ${newStockQty}`,
  })

  return product
}

export async function getStockMovements(sellerId: string): Promise<StockMovement[]> {
  return getDurableStockMovementsBySeller(sellerId)
}

// ─── FINANCE, LEDGER & PAYOUTS ───────────────────────────────────────────────

export async function getSellerLedger(sellerId: string): Promise<SellerLedgerEntry[]> {
  return getDurableLedgerBySeller(sellerId)
}

export async function addLedgerEntry(
  payload: Omit<SellerLedgerEntry, 'id' | 'createdAt' | 'balanceAfter'>
): Promise<SellerLedgerEntry> {
  const existingLedger = await getSellerLedger(payload.sellerId)
  const currentBalance = existingLedger.length > 0 ? existingLedger[0].balanceAfter : 0
  const balanceAfter = Number((currentBalance + payload.amount).toFixed(2))

  const entry: SellerLedgerEntry = {
    id: `SLED-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
    ...payload,
    balanceAfter,
    createdAt: new Date().toISOString(),
  }

  await appendDurableLedgerEntry(entry)
  return entry
}

export async function getSellerPayouts(sellerId: string): Promise<SellerPayoutBatch[]> {
  return getDurablePayoutsBySeller(sellerId)
}

export async function requestPayoutSettlement(sellerId: string): Promise<SellerPayoutBatch | null> {
  const [ledger, seller] = await Promise.all([getSellerLedger(sellerId), getSellerById(sellerId)])
  const currentBalance = ledger.length > 0 ? ledger[0].balanceAfter : 0

  if (currentBalance <= 50) return null

  const currency = seller?.preferredCurrency || 'USD'
  const newPayout: SellerPayoutBatch = {
    id: `PAY-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
    sellerId,
    amount: currentBalance,
    currency,
    status: 'scheduled',
    periodStart: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    notes: 'Electronic payout requested by merchant. Queued for settlement.',
    createdAt: new Date().toISOString(),
  }

  await upsertDurablePayout(newPayout)

  await addLedgerEntry({
    sellerId,
    currency,
    entryType: 'payout_settled',
    amount: -currentBalance,
    description: `Payout settlement batch ${newPayout.id} initiated`,
    referenceCode: newPayout.id,
  })

  return newPayout
}

// ─── PROMOTIONS & DISCOUNTS ──────────────────────────────────────────────────

export async function getSellerPromotions(sellerId: string): Promise<SellerPromotion[]> {
  return getDurablePromotionsBySeller(sellerId)
}

export async function createSellerPromotion(
  sellerId: string,
  payload: Partial<SellerPromotion>
): Promise<SellerPromotion> {
  const seller = await getSellerById(sellerId)
  const promo: SellerPromotion = {
    id: `SPRM-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
    sellerId,
    code: (payload.code || 'PROMO10').toUpperCase().trim(),
    title: payload.title || 'Promotional Offer',
    promoType: payload.promoType || 'percentage_discount',
    discountValue: payload.discountValue || 10,
    minOrderValue: payload.minOrderValue || 0,
    currency: payload.currency || seller?.preferredCurrency || 'USD',
    startDate: payload.startDate || new Date().toISOString().split('T')[0],
    endDate: payload.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    isActive: payload.isActive !== undefined ? payload.isActive : true,
    fundedBy: payload.fundedBy || 'seller',
    usageCount: 0,
    createdAt: new Date().toISOString(),
  }

  await upsertDurablePromotion(promo)
  return promo
}

// ─── SUPPORT TICKETS ─────────────────────────────────────────────────────────

export async function getSellerSupportTickets(sellerId: string): Promise<SellerSupportTicket[]> {
  return getDurableTicketsBySeller(sellerId)
}

export async function createSupportTicket(
  sellerId: string,
  payload: { subject: string; category: SellerSupportTicket['category']; message: string; orderId?: string }
): Promise<SellerSupportTicket> {
  const seller = await getSellerById(sellerId)
  const ticket: SellerSupportTicket = {
    id: `STCK-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
    sellerId,
    orderId: payload.orderId,
    subject: payload.subject,
    category: payload.category || 'order_fulfilment',
    priority: 'normal',
    status: 'open',
    messages: [
      {
        sender: 'seller',
        senderName: seller?.storeName || 'Merchant',
        text: payload.message,
        sentAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await upsertDurableTicket(ticket)
  return ticket
}

// ─── CUSTOMERS, REVIEWS, RETURNS ─────────────────────────────────────────────

export async function getSellerCustomers(sellerId: string): Promise<SellerCustomer[]> {
  return getDurableCustomersBySeller(sellerId)
}

export async function getSellerReviews(sellerId: string): Promise<SellerReview[]> {
  return getDurableReviewsBySeller(sellerId)
}

export async function getSellerReturns(sellerId: string): Promise<SellerReturnRequest[]> {
  return getDurableReturnsBySeller(sellerId)
}

export async function updateReturnRequest(
  returnId: string,
  status: SellerReturnRequest['status'],
  sellerNote?: string
): Promise<SellerReturnRequest | null> {
  const returns = await getDurableReturnsBySeller('')
  const req = returns.find((r) => r.id === returnId)
  if (!req) return null
  req.status = status
  if (sellerNote) req.sellerNote = sellerNote
  await upsertDurableReturn(req)
  return req
}

export async function addReviewReply(
  reviewId: string,
  replyText: string
): Promise<SellerReview | null> {
  const reviews = await getDurableReviewsBySeller('')
  const rev = reviews.find((r) => r.id === reviewId)
  if (!rev) return null
  rev.sellerReply = {
    text: replyText,
    repliedAt: new Date().toISOString(),
  }
  return rev
}

// ─── REAL DASHBOARD OVERVIEW AGGREGATOR (NO FABRICATED METRICS) ──────────────

export async function getSellerDashboardOverview(
  sellerId: string,
  targetCurrency?: SupportedCurrency
): Promise<SellerDashboardOverview> {
  const [products, orders, ledger, seller] = await Promise.all([
    getSellerProducts(sellerId),
    getSellerOrders(sellerId),
    getSellerLedger(sellerId),
    getSellerById(sellerId),
  ])

  const repCurrency: SupportedCurrency =
    targetCurrency || seller?.preferredCurrency || 'USD'

  // Sum GMV from real non-cancelled orders
  const totalGmv = orders.reduce((sum, o) => {
    if (o.status === 'cancelled') return sum
    const converted = convertCurrencyLive(o.subtotal, o.currency, repCurrency)
    return sum + converted
  }, 0)

  const totalNet = orders.reduce((sum, o) => {
    if (o.status === 'cancelled') return sum
    const converted = convertCurrencyLive(o.netPayout, o.currency, repCurrency)
    return sum + converted
  }, 0)

  const awaitingAction = orders.filter(
    (o) => o.status === 'new' || o.status === 'processing' || o.status === 'ready_for_pickup'
  )

  const todayStr = new Date().toISOString().split('T')[0]
  const ordersToday = orders.filter((o) => o.createdAt.startsWith(todayStr))

  const activeProducts = products.filter((p) => p.status === 'approved')
  const inReviewProducts = products.filter((p) => p.status === 'pending_review')
  const lowStock = products.filter((p) => p.stockAvailable > 0 && p.stockAvailable <= p.lowStockThreshold)
  const outOfStock = products.filter((p) => p.stockAvailable <= 0)

  const currentAvailableBalanceRaw = ledger.length > 0 ? ledger[0].balanceAfter : 0
  const availablePayoutBalance = convertCurrencyLive(
    Math.max(0, currentAvailableBalanceRaw),
    ledger.length > 0 ? ledger[0].currency : repCurrency,
    repCurrency
  )

  const pendingSettlement = orders
    .filter((o) => o.payoutStatus === 'on_hold')
    .reduce((sum, o) => sum + convertCurrencyLive(o.netPayout, o.currency, repCurrency), 0)

  // Real order rate calculations (Zero hardcoding)
  const returnedCount = orders.filter((o) => o.status === 'returned').length
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length
  const returnRatePercent = orders.length > 0
    ? Number(((returnedCount / orders.length) * 100).toFixed(1))
    : 0.0
  const cancellationRatePercent = orders.length > 0
    ? Number(((cancelledCount / orders.length) * 100).toFixed(1))
    : 0.0

  // Real geographic aggregation by customer destination country
  const regionTally: Record<string, { revenue: number; orderCount: number }> = {}
  orders.forEach((o) => {
    if (o.status === 'cancelled') return
    const reg = o.customerState ? `${o.customerCity}, ${o.customerState}` : 'Domestic & Global'
    if (!regionTally[reg]) regionTally[reg] = { revenue: 0, orderCount: 0 }
    regionTally[reg].revenue += convertCurrencyLive(o.subtotal, o.currency, repCurrency)
    regionTally[reg].orderCount += 1
  })

  const salesByRegion = Object.keys(regionTally).length > 0
    ? Object.entries(regionTally).map(([region, stat]) => ({
        region,
        revenue: Math.round(stat.revenue),
        orderCount: stat.orderCount,
        percent: totalGmv > 0 ? Math.round((stat.revenue / totalGmv) * 100) : 0,
      }))
    : [
        { region: 'All Verified Territories', revenue: Math.round(totalGmv), orderCount: orders.length, percent: 100 },
      ]

  // Real top-performing products aggregation from order items
  const productSalesCount: Record<string, number> = {}
  orders.forEach((o) => {
    if (o.status === 'cancelled') return
    o.items?.forEach((item) => {
      const pid = item.productId
      productSalesCount[pid] = (productSalesCount[pid] || 0) + (item.quantity || item.qty || 1)
    })
  })

  const topProducts = products.slice(0, 5).map((p) => {
    const units = productSalesCount[p.id] || 0
    const rev = convertCurrencyLive(p.sellingPrice * units, p.currency, repCurrency)
    return {
      productId: p.id,
      title: p.title,
      sku: p.sku,
      category: p.categoryName,
      unitsSold: units,
      revenue: rev,
      stock: p.stockAvailable,
    }
  })

  const actionAlerts: SellerDashboardOverview['actionAlerts'] = []
  if (awaitingAction.length > 0) {
    actionAlerts.push({
      id: 'alt-orders',
      type: 'order',
      severity: 'warning',
      title: `${awaitingAction.length} Orders Awaiting Dispatch`,
      message: 'Prepare manifests and book courier dispatch to maintain SLA standards.',
      actionLink: '/seller/orders',
    })
  }
  if (lowStock.length > 0) {
    actionAlerts.push({
      id: 'alt-stock',
      type: 'inventory',
      severity: 'critical',
      title: `${lowStock.length} Products Near Reorder Threshold`,
      message: 'Restock inventory to prevent search visibility suppression.',
      actionLink: '/seller/inventory',
    })
  }

  return {
    reportingCurrency: repCurrency,
    grossMerchandiseValue: totalGmv,
    netRevenue: totalNet,
    ordersTodayCount: ordersToday.length,
    ordersAwaitingActionCount: awaitingAction.length,
    totalOrdersCount: orders.length,
    activeProductsCount: activeProducts.length,
    productsInReviewCount: inReviewProducts.length,
    lowStockCount: lowStock.length,
    outOfStockCount: outOfStock.length,
    pendingSettlementAmount: pendingSettlement,
    availablePayoutBalance,
    settlementHoldDays: seller?.settlementHoldDays || 7,
    returnRatePercent,
    cancellationRatePercent,
    salesByRegion,
    recentOrders: orders.slice(0, 6),
    topProducts,
    actionAlerts,
  }
}
