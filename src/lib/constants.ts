// ─── App Identity ──────────────────────────────────────────────────────────────
export const APP_NAME = 'Nuty Tales Foods & Crafts'
export const BRAND_NAME = 'Nuty Tales Foods & Crafts'
export const PARENT_ORGANIZATION = 'Nexgenn Services'
export const SUBSIDIARY_STATEMENT = 'A subsidiary of Nexgenn Services'
export const BUSINESS_FOCUS =
  'Dry fruits, nuts, healthy snacks, corporate gifting, wedding hampers and crafts.'
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.nutytales.com'
export const APP_DESCRIPTION =
  'Nuty Tales Foods & Crafts — A subsidiary of Nexgenn Services. Premium single-origin dry fruits, nuts, healthy snacks, corporate gifting, wedding hampers, and artisanal crafts. FSSAI: 22724441000048.'

// ─── FSSAI ─────────────────────────────────────────────────────────────────────
export const FSSAI_NUMBER = '22724441000048'

// ─── Locations ─────────────────────────────────────────────────────────────────
export interface Location {
  code: string
  name: string
  city: string
  state: string
  pincode: string
  address: string
  mapUrl: string
  isHQ: boolean
  note?: string
}

export const LOCATIONS: Record<string, Location> = {
  NOIDA: {
    code: 'NOIDA',
    name: 'Noida (Official Registered Office & HQ)',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201304',
    address: 'PC-12, 003, Jaypee Wishtown, Sector 128, Noida, Uttar Pradesh 201304, India',
    mapUrl:
      'https://www.google.com/maps/place/Nuty+Tales+(Dry+fruits)/@28.5209169,77.3539445,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce7f48d890b99:0x17d4f4be831d96c1!8m2!3d28.5209122!4d77.3565248!16s%2Fg%2F11vyp7r8k6?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D',
    isHQ: true,
    note: 'The official registered office and FSSAI-associated address.',
  },
  KASHMIR: {
    code: 'KASHMIR',
    name: 'Kashmir — Arshid House',
    city: 'Budgam',
    state: 'Jammu & Kashmir',
    pincode: '191111',
    address: 'Arshid House, Budgam–Gojra Road, Dadna, Budgam, Jammu and Kashmir 191111, India',
    mapUrl:
      'https://www.google.com/maps/place/Arshid+House/@34.0087558,74.7060736,17z/data=!4m6!3m5!1s0x38e191f6e26e2615:0x437d1ccd908b0d4a!8m2!3d34.0087701!4d74.7086101!16s%2Fg%2F11t2ssyygj?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D',
    isHQ: false,
    note: 'Valley procurement, property, and Himalayan business hub.',
  },
  PATNA: {
    code: 'PATNA',
    name: 'Patna — Nafis Colony',
    city: 'Patna',
    state: 'Bihar',
    pincode: '800004',
    address: 'Nafis Colony, near Noor Plaza, Bari Path, Lalbagh, Patna, Bihar 800004, India',
    mapUrl:
      'https://www.mappls.com/place-noor+plaza-bari+path-lalbagh-patna-bihar-800004-VOK1WN@zdata=MjUuNjE2MzI0Kzg1LjE3MDQxNysxNytWT0sxV04rKw==ed',
    isHQ: false,
    note: 'Mithila Makhana sourcing hub identified near Noor Plaza on Mappls.',
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
  { name: 'Anjeer & Figs', slug: 'anjeer', icon: '🍈' },
  { name: 'Dates', slug: 'dates', icon: '🌴' },
  { name: 'Berries & Superfoods', slug: 'berries', icon: '🫐' },
  { name: 'Pine Nuts & Exotic', slug: 'exotic-nuts', icon: '🌲' },
  { name: 'Apricots & Valley Fruits', slug: 'apricots', icon: '🍑' },
  { name: 'Makhana', slug: 'makhana', icon: '⚪' },
  { name: 'Kashmir Saffron', slug: 'saffron', icon: '🌸' },
  { name: 'Pure Valley Honey', slug: 'honey', icon: '🍯' },
  { name: 'Seeds & Mixes', slug: 'seeds', icon: '🌱' },
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
  TRAVEL: process.env.NEXT_PUBLIC_WHATSAPP_TRAVEL ?? DEFAULT_CONTACT_PHONE,
  WEDDINGS: process.env.NEXT_PUBLIC_WHATSAPP_WEDDINGS ?? DEFAULT_CONTACT_PHONE,
  CRAFTS: process.env.NEXT_PUBLIC_WHATSAPP_CRAFTS ?? DEFAULT_CONTACT_PHONE,
} as const

export const PHONE_NUMBERS = {
  NOIDA: process.env.NEXT_PUBLIC_PHONE_NOIDA ?? DEFAULT_CONTACT_PHONE,
  KASHMIR: process.env.NEXT_PUBLIC_PHONE_KASHMIR ?? DEFAULT_CONTACT_PHONE,
  PATNA: process.env.NEXT_PUBLIC_PHONE_PATNA ?? DEFAULT_CONTACT_PHONE,
  SUPPORT: process.env.NEXT_PUBLIC_PHONE_SUPPORT ?? DEFAULT_CONTACT_PHONE,
  CORPORATE: process.env.NEXT_PUBLIC_PHONE_CORPORATE ?? DEFAULT_CONTACT_PHONE,
  STAYS: process.env.NEXT_PUBLIC_PHONE_STAYS ?? DEFAULT_CONTACT_PHONE,
  TRAVEL: process.env.NEXT_PUBLIC_PHONE_TRAVEL ?? DEFAULT_CONTACT_PHONE,
  WEDDINGS: process.env.NEXT_PUBLIC_PHONE_WEDDINGS ?? DEFAULT_CONTACT_PHONE,
  CRAFTS: process.env.NEXT_PUBLIC_PHONE_CRAFTS ?? DEFAULT_CONTACT_PHONE,
} as const

export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@nutytales.com'
export const SALES_EMAIL =
  process.env.NEXT_PUBLIC_SALES_EMAIL ?? 'sales@nutytales.com'
export const CORPORATE_EMAIL =
  process.env.NEXT_PUBLIC_CORPORATE_EMAIL ?? 'corporate@nutytales.com'
export const STAYS_EMAIL =
  process.env.NEXT_PUBLIC_STAYS_EMAIL ?? 'stays@nutytales.com'

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
