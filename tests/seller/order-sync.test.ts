import { describe, it, expect, beforeEach } from 'vitest'
import { syncConsumerOrderToSellers, ConsumerOrderPayload } from '@/lib/seller-portal/order-sync'
import {
  upsertDurableSeller,
  upsertDurableProduct,
  getDurableProductById,
  getDurableOrdersBySeller,
  getDurableStockMovementsBySeller,
} from '@/lib/seller-portal/persistence'
import { SellerProfile, SellerProduct } from '@/lib/seller-portal/types'

describe('Phase 6 & 7: Storefront Checkout Order Splitting & Inventory Reservation', () => {
  const testSeller: SellerProfile = {
    id: 'SLR-TEST-001',
    storeName: 'Test Organic Farm',
    slug: 'test-organic-farm',
    legalName: 'Test Organic Farm Ltd',
    businessType: 'farmer',
    email: 'farmer@test.com',
    phone: '+919876543210',
    country: 'India',
    countryCode: 'IN',
    pickupAddress: 'Farm Road 1',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    pincode: '190001',
    preferredCurrency: 'INR',
    supportedMarkets: ['Domestic'],
    taxIdentifiers: { countryCode: 'IN' },
    bankDetails: {
      bankName: 'Test Bank',
      accountNumberMasked: '****1234',
      routingCode: 'TEST0001',
      beneficiaryName: 'Test Organic Farm',
      countryCode: 'IN',
      currency: 'INR',
    },
    storefront: {
      displayName: 'Test Organic Farm',
      tagline: 'Fresh harvest',
      bio: 'Farm to table',
      ratingAverage: 5.0,
      totalReviews: 0,
      shipsInternationally: false,
      returnPolicyDays: 7,
    },
    status: 'approved',
    approvedCategories: ['food-pantry'],
    approvedStorefronts: ['nutytales.com'],
    defaultCommissionRate: 5.0,
    settlementHoldDays: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const testProduct: SellerProduct = {
    id: 'SPROD-TEST-WALNUT',
    sellerId: 'SLR-TEST-001',
    sellerStoreName: 'Test Organic Farm',
    sellerCountry: 'India',
    currency: 'INR',
    title: 'Organic Kashmiri Walnuts',
    slug: 'organic-kashmiri-walnuts',
    sku: 'SKU-TEST-WAL-500',
    categorySlug: 'food-pantry',
    categoryName: 'Food, Dry Fruits & Pantry',
    packSizes: [],
    weightGrams: 500,
    dimensionsCm: { length: 10, width: 10, height: 10 },
    shippingClass: 'standard',
    countryOfOrigin: 'India',
    mrp: 600,
    sellingPrice: 500,
    stockAvailable: 50,
    stockReserved: 0,
    lowStockThreshold: 5,
    fulfillmentType: 'both',
    status: 'approved',
    images: [{ url: '/images/products/walnut.png', isPrimary: true }],
    taxRatePercent: 5.0,
    attributes: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  beforeEach(async () => {
    await upsertDurableSeller(testSeller)
    await upsertDurableProduct(testProduct)
  })

  it('splits a consumer checkout order and allocates items to the owning merchant', async () => {
    const consumerOrder: ConsumerOrderPayload = {
      orderId: 'NT-ORD-TEST-999',
      orderNumber: 'NT-ORD-TEST-999',
      customer: {
        fullName: 'Jane Customer',
        email: 'jane@example.com',
        phone: '+919999888877',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        address: 'Connaught Place 12',
      },
      items: [
        {
          productId: 'SPROD-TEST-WALNUT',
          sku: 'SKU-TEST-WAL-500',
          title: 'Organic Kashmiri Walnuts',
          quantity: 2,
          price: 500,
          gstPercent: 5,
        },
      ],
      total: 1000,
      currency: 'INR',
    }

    const createdSubOrders = await syncConsumerOrderToSellers(consumerOrder)
    expect(createdSubOrders.length).toBe(1)

    const subOrder = createdSubOrders[0]
    expect(subOrder.sellerId).toBe('SLR-TEST-001')
    expect(subOrder.subtotal).toBe(1000)
    expect(subOrder.commissionRate).toBe(5.0)
    expect(subOrder.commissionAmount).toBe(50.0) // 5% of 1000
    expect(subOrder.taxOnCommission).toBe(9.0) // 18% of 50
    expect(subOrder.netPayout).toBe(941.0) // 1000 - 59

    // Customer PII is sanitized (phone masked)
    expect(subOrder.customerPhoneMasked).toContain('****')

    // Inventory was atomically deducted from available and added to reserved
    const updatedProduct = await getDurableProductById('SPROD-TEST-WALNUT')
    expect(updatedProduct?.stockAvailable).toBe(48) // 50 - 2
    expect(updatedProduct?.stockReserved).toBe(2)

    // Stock movement was recorded in the audit ledger
    const movements = await getDurableStockMovementsBySeller('SLR-TEST-001')
    const lastMovement = movements[0]
    expect(lastMovement.changeQty).toBe(-2)
    expect(lastMovement.movementType).toBe('order_reservation')
    expect(lastMovement.balanceAfter).toBe(48)
  })
})
