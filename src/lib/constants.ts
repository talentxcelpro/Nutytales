// ─── App Identity ──────────────────────────────────────────────────────────────
export const APP_NAME = 'Nutty Tales'
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.nuttytales.com'
export const APP_DESCRIPTION =
  'Premium dry fruits — wholesale & retail. Sourced from Kashmir, delivered across India. FSSAI certified.'

// ─── FSSAI ─────────────────────────────────────────────────────────────────────
export const FSSAI_NUMBER = '22724441000048'

// ─── Locations ─────────────────────────────────────────────────────────────────
export interface Location {
  code: string
  name: string
  city: string
  state: string
  pincode?: string
  address?: string
  isHQ: boolean
}

export const LOCATIONS: Record<string, Location> = {
  NOIDA: {
    code: 'NOIDA',
    name: 'Noida (HQ)',
    city: 'Noida',
    state: 'Uttar Pradesh',
    isHQ: true,
  },
  KASHMIR: {
    code: 'KASHMIR',
    name: 'Srinagar, Kashmir',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    isHQ: false,
  },
  PATNA: {
    code: 'PATNA',
    name: 'Patna, Bihar',
    city: 'Patna',
    state: 'Bihar',
    isHQ: false,
  },
} as const

export type LocationCode = keyof typeof LOCATIONS

// ─── Product Categories ────────────────────────────────────────────────────────
export interface ProductCategory {
  name: string
  slug: string
  icon: string
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { name: 'Almonds', slug: 'almonds', icon: '🌰' },
  { name: 'Cashews', slug: 'cashews', icon: '🥜' },
  { name: 'Raisins', slug: 'raisins', icon: '🍇' },
  { name: 'Pistachios', slug: 'pistachios', icon: '🫘' },
  { name: 'Walnuts', slug: 'walnuts', icon: '🌰' },
  { name: 'Anjeer', slug: 'anjeer', icon: '🍈' },
  { name: 'Dates', slug: 'dates', icon: '🌴' },
  { name: 'Makhana', slug: 'makhana', icon: '⚪' },
  { name: 'Seeds', slug: 'seeds', icon: '🌱' },
  { name: 'Mixed Nuts', slug: 'mixed-nuts', icon: '🥗' },
  { name: 'Healthy Snacks', slug: 'healthy-snacks', icon: '🍿' },
  { name: 'Gift Packs', slug: 'gift-packs', icon: '🎁' },
]

// ─── Order & Quote Statuses ────────────────────────────────────────────────────
export const ORDER_STATUS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  REFUND_INITIATED: 'Refund Initiated',
  REFUNDED: 'Refunded',
}

export const QUOTE_STATUS: Record<string, string> = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  QUOTED: 'Quoted',
  NEGOTIATING: 'Negotiating',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
  CONVERTED: 'Converted to Order',
}

// ─── GST Rates ─────────────────────────────────────────────────────────────────
/** All rates are percentages (e.g. 5 = 5%). Dry fruits attract 5% GST in India. */
export const GST_RATES = {
  dryFruits: 5,
  processedSnacks: 12,
  giftPacks: 12,
} as const

// ─── Pack Sizes (grams) ────────────────────────────────────────────────────────
export const B2C_PACK_SIZES_G = [250, 500, 1000] as const
export const B2B_PACK_SIZES_G = [5000, 10000, 25000, 50000, 100000] as const

/** Threshold above which a quantity is considered B2B / wholesale */
export const B2B_QUANTITY_THRESHOLD_G = 5000

// ─── Contact / WhatsApp ────────────────────────────────────────────────────────
/**
 * All phone numbers are injected via environment variables.
 * Never hardcode phone numbers in source code.
 */
export const DEFAULT_CONTACT_PHONE = '+919717161809'

export const WHATSAPP_NUMBERS = {
  NOIDA: process.env.NEXT_PUBLIC_WHATSAPP_NOIDA ?? DEFAULT_CONTACT_PHONE,
  KASHMIR: process.env.NEXT_PUBLIC_WHATSAPP_KASHMIR ?? DEFAULT_CONTACT_PHONE,
  PATNA: process.env.NEXT_PUBLIC_WHATSAPP_PATNA ?? DEFAULT_CONTACT_PHONE,
  SUPPORT: process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT ?? DEFAULT_CONTACT_PHONE,
  CORPORATE: process.env.NEXT_PUBLIC_WHATSAPP_CORPORATE ?? DEFAULT_CONTACT_PHONE,
  STAYS: process.env.NEXT_PUBLIC_WHATSAPP_STAYS ?? DEFAULT_CONTACT_PHONE,
} as const

export const PHONE_NUMBERS = {
  NOIDA: process.env.NEXT_PUBLIC_PHONE_NOIDA ?? DEFAULT_CONTACT_PHONE,
  KASHMIR: process.env.NEXT_PUBLIC_PHONE_KASHMIR ?? DEFAULT_CONTACT_PHONE,
  PATNA: process.env.NEXT_PUBLIC_PHONE_PATNA ?? DEFAULT_CONTACT_PHONE,
  SUPPORT: process.env.NEXT_PUBLIC_PHONE_SUPPORT ?? DEFAULT_CONTACT_PHONE,
  CORPORATE: process.env.NEXT_PUBLIC_PHONE_CORPORATE ?? DEFAULT_CONTACT_PHONE,
  STAYS: process.env.NEXT_PUBLIC_PHONE_STAYS ?? DEFAULT_CONTACT_PHONE,
} as const

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nuttytales.com'
export const SALES_EMAIL =
  process.env.NEXT_PUBLIC_SALES_EMAIL ?? 'sales@nuttytales.com'
export const CORPORATE_EMAIL =
  process.env.NEXT_PUBLIC_CORPORATE_EMAIL ?? 'corporate@nuttytales.com'
export const STAYS_EMAIL =
  process.env.NEXT_PUBLIC_STAYS_EMAIL ?? 'stays@nuttytales.com'

// ─── Shipping Estimation ───────────────────────────────────────────────────────
/** Estimated delivery days from each dispatch location */
export const SHIPPING_ESTIMATION_DAYS: Record<
  string,
  { min: number; max: number }
> = {
  NOIDA: { min: 1, max: 3 },
  KASHMIR: { min: 4, max: 7 },
  PATNA: { min: 2, max: 4 },
  DEFAULT: { min: 3, max: 7 },
}

// ─── Pagination ────────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

// ─── Image Dimensions ─────────────────────────────────────────────────────────
export const PRODUCT_IMAGE_WIDTH = 800
export const PRODUCT_IMAGE_HEIGHT = 800
export const THUMBNAIL_WIDTH = 300
export const THUMBNAIL_HEIGHT = 300

// ─── Razorpay ─────────────────────────────────────────────────────────────────
export const RAZORPAY_CURRENCY = 'INR'
export const RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? ''
