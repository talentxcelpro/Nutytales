// ─── Nuty Tales — Global Multi-Vertical Platform Core Architecture ─────────
// Single backend core shared across all 6 verticals:
// business.nutytales.com · gifting.nutytales.com · weddings.nutytales.com · crafts.nutytales.com · stays.nutytales.com · travel.nutytales.com

export type PlatformVertical =
  | 'business'
  | 'gifting'
  | 'weddings'
  | 'crafts'
  | 'stays'
  | 'travel'
  | 'discovery'

export type BusinessType =
  | 'hotel'
  | 'resort'
  | 'boutique_stay'
  | 'restaurant'
  | 'cafe'
  | 'bakery'
  | 'sweet_shop'
  | 'manufacturer'
  | 'retailer'
  | 'supplier'
  | 'wholesaler'
  | 'travel_agency'
  | 'tour_operator'
  | 'dmc'
  | 'wedding_planner'
  | 'event_company'
  | 'fashion_brand'
  | 'artisan_guild'
  | 'gift_company'
  | 'service_provider'
  | 'd2c_brand'
  | 'enterprise'

export type VerificationLevel =
  | 'unverified'
  | 'basic_verified'
  | 'business_verified'
  | 'premium_partner'

export interface BusinessEntity {
  id: string
  legalName: string
  displayName: string
  slug: string
  businessType: BusinessType
  verticals: PlatformVertical[]
  description: string
  logo?: string
  coverImage?: string
  country: string
  countryCode: string // IN, AE, UK, US, SA
  city: string
  address: string
  currency: string
  timezone: string
  website?: string
  phone: string
  email: string
  verificationStatus: VerificationLevel
  fssaiNumber?: string
  gstin?: string
  rating: number
  reviewCount: number
  operatingHours?: string
  deliveryAreas?: string[]
  featured?: boolean
  badges: string[]
  createdAt: string
}

export interface PlatformService {
  id: string
  businessId: string
  businessName: string
  title: string
  slug: string
  category: string
  vertical: PlatformVertical
  pricingType:
    | 'fixed'
    | 'starting_at'
    | 'quote_required'
    | 'hourly'
    | 'per_day'
    | 'per_person'
    | 'per_room'
    | 'custom'
  priceAmount: number
  currency: string
  description: string
  serviceArea: string
  instantBooking: boolean
  rating: number
  reviewsCount: number
}

export type OpportunityType =
  | 'b2b_rfq'
  | 'corporate_gifting'
  | 'wedding_inquiry'
  | 'hotel_booking'
  | 'travel_tour'
  | 'craft_wholesale'
  | 'sourcing_request'
  | 'business_signup'

export type OpportunityStatus =
  | 'NEW'
  | 'QUALIFIED'
  | 'MATCHING'
  | 'CONTACTED'
  | 'QUOTE_SENT'
  | 'NEGOTIATION'
  | 'CONVERTED'
  | 'LOST'
  | 'NURTURE'

export interface CommercialOpportunity {
  id: string
  type: OpportunityType
  vertical: PlatformVertical
  customerName: string
  customerEmail?: string
  customerPhone: string
  companyName?: string
  businessId?: string
  itemOrService: string
  quantity?: number | string
  budget?: number
  currency: string
  requiredDate?: string
  deliveryCity?: string
  intentScore: number // 1-100
  status: OpportunityStatus
  source: string
  assignedTo?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SourcingRequest {
  id: string
  vertical: PlatformVertical
  requestedItem: string
  specifications: string
  quantity: string
  targetBudget: string
  currency: string
  targetDeliveryDate: string
  clientName: string
  clientContact: string
  status: 'SOURCING_ACTIVE' | 'SUPPLIERS_CONTACTED' | 'QUOTES_RECEIVED' | 'FULFILLED'
  createdAt: string
}

// ── Currency Localization Service ───────────────────────────────────────────
export const SUPPORTED_CURRENCIES: Record<string, { symbol: string; label: string; rateToINR: number }> = {
  INR: { symbol: '₹', label: 'Indian Rupee', rateToINR: 1 },
  AED: { symbol: 'AED ', label: 'UAE Dirham', rateToINR: 22.8 },
  USD: { symbol: '$', label: 'US Dollar', rateToINR: 83.5 },
  GBP: { symbol: '£', label: 'British Pound', rateToINR: 108.2 },
  EUR: { symbol: '€', label: 'Euro', rateToINR: 92.4 },
  SAR: { symbol: 'SAR ', label: 'Saudi Riyal', rateToINR: 22.3 },
  CAD: { symbol: 'CA$', label: 'Canadian Dollar', rateToINR: 61.2 },
  AUD: { symbol: 'A$', label: 'Australian Dollar', rateToINR: 55.4 },
}

export function formatLocalizedPrice(amountINR: number, currencyCode = 'INR'): string {
  const curr = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.INR
  const converted = Math.round(amountINR / curr.rateToINR)
  return `${curr.symbol}${converted.toLocaleString()}`
}

// ── Verified First-Party & Marketplace Platform Businesses ───────────────────
export const PLATFORM_BUSINESSES: BusinessEntity[] = [
  // 1. Direct First-Party Business Engine
  {
    id: 'biz-nutytales-hq',
    legalName: 'Nuty Tales Foods & Crafts Private Limited',
    displayName: 'Nuty Tales Official Direct',
    slug: 'nuty-tales-official',
    businessType: 'enterprise',
    verticals: ['business', 'gifting', 'weddings', 'crafts'],
    description:
      'Direct grower aggregation, cold-chain walnut & almond processing, vacuum packaging, and certified Kashmiri GI Mongra saffron vaults.',
    country: 'India',
    countryCode: 'IN',
    city: 'Noida & Srinagar',
    address: 'Sector 63 Logistics Corridor, Noida UP & Pampore Highway, Kashmir',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    phone: '+91 9717161809',
    email: 'procurement@nutytales.com',
    verificationStatus: 'premium_partner',
    fssaiNumber: '22724441000048',
    gstin: '07AAAAA0000A1Z5',
    rating: 4.95,
    reviewCount: 382,
    operatingHours: '08:00 - 20:00 IST',
    deliveryAreas: ['PAN-India', 'UAE (Dubai & Abu Dhabi)', 'United Kingdom', 'North America'],
    featured: true,
    badges: ['FSSAI Central Certified', 'NABL Lab Tested', 'Direct Orchard Source', 'Trade Assurance Guaranteed'],
    createdAt: '2024-01-15T00:00:00Z',
  },

  // 2. Verified Stays & Hospitality Partner
  {
    id: 'biz-kashmir-orchard-retreat',
    legalName: 'The Heritage Chinar & Orchard Villas',
    displayName: 'The Heritage Chinar Luxury Stays',
    slug: 'heritage-chinar-kashmir',
    businessType: 'boutique_stay',
    verticals: ['stays', 'travel', 'weddings'],
    description:
      'Private 4-acre walnut orchard estate overlooking the Zabarwan range in Srinagar. Curated private chef, saffron tea sessions, and destination wedding lawns.',
    country: 'India',
    countryCode: 'IN',
    city: 'Srinagar',
    address: 'Boulevard Road & Harwan Foothills, Srinagar, J&K 190019',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    phone: '+91 9717161809',
    email: 'stays@nutytales.com',
    verificationStatus: 'premium_partner',
    rating: 4.98,
    reviewCount: 84,
    operatingHours: '24/7 Concierge',
    deliveryAreas: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    featured: true,
    badges: ['Verified Heritage Property', 'Private Chef On-Site', 'Bespoke Wedding Venue'],
    createdAt: '2024-03-20T00:00:00Z',
  },

  // 3. Verified Kashmir Craft & Fashion Guild
  {
    id: 'biz-kashmiri-craft-artisans',
    legalName: 'Pampore Silk & Pashmina Heritage Cooperative',
    displayName: 'Royal Kashmir Craft Guild',
    slug: 'royal-kashmir-craft-guild',
    businessType: 'artisan_guild',
    verticals: ['crafts', 'gifting', 'weddings'],
    description:
      'Master weavers producing GI-tagged Hand-spun Kani Pashmina shawls, Sozni needlework velvet pherans, and walnut wood carved wedding trousseau boxes.',
    country: 'India',
    countryCode: 'IN',
    city: 'Srinagar',
    address: 'Old City Shehr-e-Khaas Artisan Center, Srinagar 190002',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    phone: '+91 9717161809',
    email: 'crafts@nutytales.com',
    verificationStatus: 'business_verified',
    rating: 4.92,
    reviewCount: 147,
    operatingHours: '09:00 - 18:00 IST',
    deliveryAreas: ['Global Shipping Available'],
    featured: true,
    badges: ['Authentic Provenance Certified', '100% Handloom Pashmina', 'Zero Synthetic Blend'],
    createdAt: '2024-02-10T00:00:00Z',
  },

  // 4. Verified Travel & Destination Partner
  {
    id: 'biz-kashmir-alpine-journeys',
    legalName: 'Alpine Valleys Travel & Expedition Co.',
    displayName: 'Kashmir Alpine Experiences',
    slug: 'kashmir-alpine-experiences',
    businessType: 'tour_operator',
    verticals: ['travel', 'stays'],
    description:
      'Curated private luxury expeditions across Gulmarg heli-skiing, Sonamarg glacier treks, Shikara sunset high teas, and Dachigam wildlife sanctuary walks.',
    country: 'India',
    countryCode: 'IN',
    city: 'Srinagar',
    address: 'TRC Complex, Residency Road, Srinagar 190001',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    phone: '+91 9717161809',
    email: 'travel@nutytales.com',
    verificationStatus: 'business_verified',
    rating: 4.96,
    reviewCount: 96,
    operatingHours: '07:00 - 22:00 IST',
    deliveryAreas: ['Jammu & Kashmir', 'Ladakh'],
    featured: true,
    badges: ['Department of Tourism Certified', 'Private Luxury Fleet', 'English & Arabic Speaking Guides'],
    createdAt: '2024-04-01T00:00:00Z',
  },

  // 5. Verified Wedding Luxury Planner
  {
    id: 'biz-kashmiri-wedding-couture',
    legalName: 'Zafraan & Chinar Wedding Curators',
    displayName: 'Zafraan Bespoke Wedding Planners',
    slug: 'zafraan-bespoke-weddings',
    businessType: 'wedding_planner',
    verticals: ['weddings', 'gifting', 'stays'],
    description:
      'Destination wedding planners specializing in Kashmiri royal weddings, Wazwan banquets, bespoke silver dry fruit favours, and luxury lakeside venues.',
    country: 'India',
    countryCode: 'IN',
    city: 'Delhi NCR & Srinagar',
    address: 'Mehrauli Heritage Quarter, New Delhi & Boulevard, Srinagar',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    phone: '+91 9717161809',
    email: 'weddings@nutytales.com',
    verificationStatus: 'premium_partner',
    rating: 4.99,
    reviewCount: 63,
    operatingHours: '10:00 - 19:00 IST',
    deliveryAreas: ['Delhi NCR', 'Rajasthan', 'Kashmir', 'Goa', 'UAE (Dubai)'],
    featured: true,
    badges: ['Top Destination Wedding Curator', 'Full-Scale Production', 'Custom Silver Hampers'],
    createdAt: '2024-05-12T00:00:00Z',
  },
]
