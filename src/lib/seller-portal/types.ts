// ─── Nuty Tales Seller Central — Global Marketplace Domain Models ─────────────
// Positioning: "Sell Anywhere. Grow Everywhere."
// Central commerce dashboard for domestic and international vendors, manufacturers,
// wholesalers, independent brands, artisans, farmers, and retailers worldwide.

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'AED' | 'INR' | 'CAD' | 'AUD' | 'SGD'

export const EXCHANGE_RATES_TO_USD: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 1.087,   // 1 EUR = 1.087 USD
  GBP: 1.282,   // 1 GBP = 1.282 USD
  AED: 0.272,   // 1 AED = 0.272 USD
  INR: 0.01156, // 1 INR = 0.01156 USD (approx 1 USD = 86.5 INR)
  CAD: 0.719,   // 1 CAD = 0.719 USD
  AUD: 0.658,   // 1 AUD = 0.658 USD
  SGD: 0.746,   // 1 SGD = 0.746 USD
}

export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount
  const inUSD = amount * (EXCHANGE_RATES_TO_USD[from] || 1)
  const targetRate = EXCHANGE_RATES_TO_USD[to] || 1
  return Number((inUSD / targetRate).toFixed(2))
}

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  INR: '₹',
  CAD: 'CA$',
  AUD: 'A$',
  SGD: 'S$',
}

export type SellerBusinessType =
  | 'brand'
  | 'manufacturer'
  | 'wholesaler'
  | 'artisan'
  | 'farmer'
  | 'retailer'
  | 'services_hospitality'

export type SellerStatus =
  | 'draft'
  | 'submitted'
  | 'under_verification'
  | 'approved'
  | 'rejected'
  | 'suspended'

export type StorefrontDomain =
  | 'nutytales.com'
  | 'crafts.nutytales.com'
  | 'gifting.nutytales.com'
  | 'weddings.nutytales.com'
  | 'stays.nutytales.com'
  | 'travel.nutytales.com'
  | 'nri.nutytales.com'
  | 'europe.nutytales.com'
  | 'middleeast.nutytales.com'
  | 'america.nutytales.com'

export interface TaxIdentifiers {
  countryCode: string // US, GB, AE, IN, DE, CA, AU, etc.
  // India
  panNumber?: string
  gstin?: string
  fssaiNumber?: string
  // USA
  einOrSsn?: string
  stateTaxPermit?: string
  // UK & Europe
  vatNumber?: string
  companyNumber?: string // CRN
  // UAE & GCC
  trnNumber?: string
  tradeLicenseNumber?: string
  // General / Other countries
  businessRegistrationNumber?: string
  taxIdNumber?: string
  documentUrls?: string[]
}

export interface BankDetails {
  bankName: string
  accountNumberMasked: string
  routingCode: string // Routing / Sort code / IFSC / SWIFT / IBAN
  ifscCode?: string
  beneficiaryName: string
  countryCode: string
  currency: SupportedCurrency
  accountType?: 'checking' | 'savings' | 'current'
  ibanOrSwift?: string
}

export interface StorefrontProfile {
  displayName: string
  tagline: string
  bio: string
  logoUrl?: string
  bannerUrl?: string
  ratingAverage: number
  totalReviews: number
  shipsInternationally: boolean
  returnPolicyDays: number
  warrantyPolicy?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
    website?: string
  }
}

export interface SellerProfile {
  id: string
  userId?: string
  storeName: string
  slug: string
  legalName: string
  businessType: SellerBusinessType
  email: string
  phone: string
  whatsapp?: string
  website?: string
  country: string
  countryCode: string // US, GB, AE, IN, DE, etc.
  pickupAddress: string
  city: string
  state: string
  pincode: string
  preferredCurrency: SupportedCurrency
  supportedMarkets: string[] // 'Domestic', 'North America', 'Europe', 'Middle East', 'Global'
  taxIdentifiers: TaxIdentifiers
  bankDetails: BankDetails
  storefront: StorefrontProfile
  status: SellerStatus
  approvedCategories: string[]
  approvedStorefronts: StorefrontDomain[]
  defaultCommissionRate: number // e.g. 8%
  settlementHoldDays: number // e.g. 7 or 14 days
  panNumber?: string
  gstin?: string
  fssaiNumber?: string
  giCertifications?: string[]
  rejectionReason?: string
  verificationNotes?: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
}

export interface SellerMember {
  id: string
  sellerId: string
  userId?: string
  email: string
  name: string
  role: 'owner' | 'manager' | 'operations' | 'finance'
  status: 'active' | 'invited' | 'suspended'
  createdAt: string
}

// ─── DYNAMIC CATEGORY TAXONOMY ───────────────────────────────────────────────

export interface CategoryAttributeField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean'
  required: boolean
  options?: string[]
  placeholder?: string
  helperText?: string
}

export interface GlobalCategory {
  id: string
  slug: string
  name: string
  icon: string
  description: string
  parentId?: string
  subcategories: string[]
  sortOrder: number
  isActive: boolean
  requiresComplianceApproval: boolean
  complianceRequirements: string[] // e.g. ["FDA Registration", "CE Certificate", "Organic Harvest"]
  attributeSchema: CategoryAttributeField[]
}

export interface ProductPackSize {
  id: string
  name: string // "Small", "Medium", "Large", "500g", "1kg", "Pack of 3"
  sku: string
  mrp: number
  price: number
  wholesalePrice?: number
  stock: number
  weightGrams?: number
  barcode?: string
}

export interface ProductImageItem {
  url: string
  isPrimary: boolean
  alt?: string
}

export interface SellerProduct {
  id: string
  sellerId: string
  sellerStoreName?: string
  sellerCountry?: string
  currency: SupportedCurrency
  title: string
  slug: string
  sku: string
  categorySlug: string
  categoryName: string
  subcategory?: string
  brand?: string
  description?: string
  images: ProductImageItem[]
  packSizes: ProductPackSize[]
  weightGrams: number
  dimensionsCm: { length: number; width: number; height: number }
  shippingClass: 'standard' | 'express' | 'fragile' | 'temperature_controlled' | 'heavy_freight'
  countryOfOrigin: string
  hsnOrTariffCode?: string
  taxRatePercent: number
  mrp: number
  sellingPrice: number
  compareAtPrice?: number
  wholesalePrice?: number
  stockAvailable: number
  stockReserved: number
  lowStockThreshold: number
  fulfillmentType: 'domestic' | 'cross_border' | 'both'
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived'
  rejectionReason?: string
  // Dynamic category custom attributes (food, fashion, jewelry, decor, electronics)
  attributes: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface StockMovement {
  id: string
  sellerId: string
  productId: string
  sku: string
  productTitle?: string
  changeQty: number
  balanceAfter: number
  movementType:
    | 'manual_adjustment'
    | 'order_reservation'
    | 'order_cancelled_release'
    | 'order_fulfilled'
    | 'damaged_loss'
    | 'restock'
  referenceId?: string
  notes?: string
  createdAt: string
}

export type OrderFulfilmentStatus =
  | 'new'
  | 'accepted'
  | 'processing'
  | 'packed'
  | 'ready_for_pickup'
  | 'shipped'
  | 'delivered'
  | 'cancellation_requested'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'disputed'

export interface OrderLineItem {
  productId: string
  sku: string
  title: string
  variantName?: string
  qty?: number
  quantity?: number
  unitPrice: number
  totalPrice: number
  taxRatePercent?: number
  gstPercent?: number
  image?: string
}

export type SellerOrderItem = OrderLineItem

export interface SellerOrder {
  id: string
  parentOrderId: string
  parentOrderNumber: string
  sellerId: string
  currency: SupportedCurrency
  customerName: string
  customerCity: string
  customerState?: string
  customerPincode?: string
  customerCountry?: string
  customerCountryCode?: string
  deliveryAddress: string
  customerPhoneMasked?: string
  isCrossBorder?: boolean
  items: OrderLineItem[]
  itemsCount: number
  subtotal: number
  shippingCharged: number
  commissionRate: number
  commissionAmount: number
  taxOnCommission: number
  gstOnCommission?: number
  withholdingTaxAmount?: number
  tdsAmount?: number
  netPayout: number
  status: OrderFulfilmentStatus
  cancellationReason?: string
  carrierName?: string
  trackingNumber?: string
  awbCode?: string
  labelUrl?: string
  customsDeclaration?: {
    tariffCode: string
    declaredValue: number
    exportReason: string
  }
  pickupScheduledAt?: string
  shippedAt?: string
  deliveredAt?: string
  payoutStatus: 'pending' | 'on_hold' | 'settled' | 'refunded'
  payoutId?: string
  settlementEligibleAt?: string
  createdAt: string
  updatedAt: string
}

export interface SellerLedgerEntry {
  id: string
  sellerId: string
  sellerOrderId?: string
  currency: SupportedCurrency
  entryType:
    | 'order_credit'
    | 'commission_debit'
    | 'shipping_debit'
    | 'tax_debit'
    | 'refund_debit'
    | 'payout_settled'
    | 'adjustment'
  amount: number
  balanceAfter: number
  description: string
  referenceCode?: string
  createdAt: string
}

export interface SellerPayoutBatch {
  id: string
  sellerId: string
  amount: number
  currency: SupportedCurrency
  status: 'scheduled' | 'processing' | 'completed' | 'failed'
  bankRefUtr?: string
  periodStart: string
  periodEnd: string
  processedAt?: string
  notes?: string
  createdAt: string
}

export interface SellerPromotion {
  id: string
  sellerId: string
  code: string
  title: string
  promoType: 'percentage_discount' | 'flat_discount' | 'bulk_discount'
  discountValue: number
  minOrderValue: number
  currency: SupportedCurrency
  startDate: string
  endDate: string
  isActive: boolean
  fundedBy: 'seller' | 'platform'
  usageCount: number
  createdAt: string
}

export interface SupportTicketMessage {
  sender: 'seller' | 'admin'
  senderName: string
  text: string
  sentAt: string
  attachments?: string[]
}

export interface SellerSupportTicket {
  id: string
  sellerId: string
  orderId?: string
  subject: string
  category: 'order_fulfilment' | 'payout' | 'product_approval' | 'compliance' | 'shipping' | 'international' | 'other'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  messages: SupportTicketMessage[]
  resolvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface SellerCustomer {
  id: string
  sellerId?: string
  name: string
  email?: string
  emailMasked?: string
  phone?: string
  city: string
  country?: string
  totalOrders?: number
  ordersCount?: number
  totalSpend?: number
  totalSpent?: number
  currency: SupportedCurrency
  firstOrderDate?: string
  lastOrderDate?: string
  lastOrderAt?: string
}

export interface SellerReview {
  id: string
  sellerId?: string
  productId: string
  productTitle: string
  customerName: string
  customerCountry: string
  rating: number // 1 to 5
  title: string
  comment: string
  verifiedPurchase: boolean
  sellerReply?: string | { text: string; repliedAt: string }
  createdAt: string
}

export interface SellerReturnRequest {
  id: string
  sellerId?: string
  orderId: string
  customerName: string
  customerCountry?: string
  items?: { title: string; qty: number; reason?: string }[]
  refundAmount: number
  currency: SupportedCurrency
  status: 'requested' | 'approved' | 'rejected' | 'refunded' | 'received'
  evidencePhotos?: string[]
  reason?: string
  trackingNumber?: string
  sellerNote?: string
  requestedAt?: string
  resolvedAt?: string
  createdAt?: string
}

export interface SellerDashboardOverview {
  reportingCurrency: SupportedCurrency
  grossMerchandiseValue: number
  netRevenue: number
  ordersTodayCount: number
  ordersAwaitingActionCount: number
  totalOrdersCount: number
  activeProductsCount: number
  productsInReviewCount: number
  lowStockCount: number
  outOfStockCount: number
  pendingSettlementAmount: number
  availablePayoutBalance: number
  settlementHoldDays: number
  returnRatePercent: number
  cancellationRatePercent: number
  salesByRegion: {
    region: string
    revenue: number
    orderCount: number
    percent: number
  }[]
  recentOrders: SellerOrder[]
  topProducts: {
    productId: string
    title: string
    sku: string
    category: string
    unitsSold: number
    revenue: number
    stock: number
  }[]
  actionAlerts: {
    id: string
    type: 'order' | 'inventory' | 'compliance' | 'payout' | 'verification'
    severity: 'critical' | 'warning' | 'info'
    title: string
    message: string
    actionLink: string
  }[]
}
