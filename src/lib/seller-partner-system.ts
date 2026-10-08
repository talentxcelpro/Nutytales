// ─── Nuty Tales — Global Marketplace Seller & Partner Infrastructure ─────────
// Unified onboarding & verification engine connecting:
// Farmers, Artisans, Brands, Wholesalers, Hotels, Hosts, DMCs, Wedding Vendors, Logistics Partners

import { PlatformVertical } from '@/lib/platform-core'

export type PartnerType =
  | 'farmer'
  | 'artisan'
  | 'brand'
  | 'wholesaler'
  | 'hotel'
  | 'host'
  | 'dmc'
  | 'wedding_vendor'
  | 'logistics_partner'

export type PartnerStatus =
  | 'PENDING_REVIEW'
  | 'KYC_SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'

export interface PartnerCommissionTerms {
  standardTakeRatePercent: number
  payoutCycleDays: number
  listingFeeINR: number
  minimumOrderValueINR: number
}

export interface PartnerApplication {
  id: string
  businessName: string
  contactPerson: string
  email: string
  phone: string
  whatsapp: string
  partnerType: PartnerType
  verticals: PlatformVertical[]
  country: string
  countryCode: string // IN, AE, US, GB, etc.
  city: string
  address: string
  websiteOrCatalog?: string
  taxId?: string // GSTIN / VAT / TRN / EIN
  fssaiNumber?: string
  craftCertifications?: string[]
  annualTurnover?: string
  status: PartnerStatus
  commissionTier: PartnerCommissionTerms
  notes?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export const PARTNER_TYPE_META: Record<
  PartnerType,
  {
    title: string
    subtitle: string
    verticals: PlatformVertical[]
    commissionPercent: number
    kycRequirements: string[]
    badge: string
    icon: string
  }
> = {
  farmer: {
    title: 'Farmer & Orchard Producer',
    subtitle: 'Direct-source saffron, walnuts, almonds, apples & organic produce',
    verticals: ['business', 'gifting'],
    commissionPercent: 5.0,
    kycRequirements: ['Land Record / Kisan Card', 'Bank Passbook / Cancelled Cheque', 'Aadhaar / ID Card'],
    badge: 'Grower Direct',
    icon: '🌱',
  },
  artisan: {
    title: 'Heritage Artisan & Guild',
    subtitle: 'Master weavers of GI Pashmina, walnut wood carvers, papier-mâché artisans',
    verticals: ['crafts', 'gifting', 'weddings'],
    commissionPercent: 12.0,
    kycRequirements: ['Artisan ID / Pehchan Card', 'GI Tag Certification (if applicable)', 'Bank Details'],
    badge: 'GI Artisan Guild',
    icon: '🪡',
  },
  brand: {
    title: 'Independent Brand / D2C Label',
    subtitle: 'Curated luxury lifestyle, organic wellness, gourmet regional delicacies',
    verticals: ['gifting', 'crafts', 'business'],
    commissionPercent: 18.0,
    kycRequirements: ['GSTIN / VAT Certificate', 'Trademark Registration (optional)', 'Lab Test / FSSAI (if food)'],
    badge: 'Curated Brand',
    icon: '✨',
  },
  wholesaler: {
    title: 'B2B Sourcing & Wholesaler',
    subtitle: 'Institutional supply of raw almonds, jumbo cashews, cold storage stock',
    verticals: ['business'],
    commissionPercent: 4.5,
    kycRequirements: ['Company Registration / Incorporation', 'GSTIN / TRN', 'FSSAI Central / State License'],
    badge: 'Bulk Sourcing Host',
    icon: '📦',
  },
  hotel: {
    title: 'Luxury Hotel & Heritage Resort',
    subtitle: 'Palaces, 5-star properties, boutique suites, mountain retreats',
    verticals: ['stays', 'weddings'],
    commissionPercent: 14.0,
    kycRequirements: ['Trade License / Hotel Permit', 'GSTIN / Commercial Tax', 'Property Insurance'],
    badge: 'Verified Hospitality',
    icon: '🏨',
  },
  host: {
    title: 'Private Residence & Houseboat Host',
    subtitle: 'Orchard villas, Dal Lake cedar houseboats, alpine cottages',
    verticals: ['stays', 'travel'],
    commissionPercent: 12.0,
    kycRequirements: ['Houseboat / Stay Tourism Registration', 'ID Proof of Host', 'Property Photos'],
    badge: 'Curated Host',
    icon: '🏡',
  },
  dmc: {
    title: 'Destination Management Company (DMC)',
    subtitle: 'Licensed tour operators, heli-ski operators, high-altitude expedition leaders',
    verticals: ['travel', 'weddings'],
    commissionPercent: 15.0,
    kycRequirements: ['Dept of Tourism Registration Certificate', 'IATA / TAAI Membership (optional)', 'Fleet Fitness'],
    badge: 'Licensed DMC',
    icon: '🏔️',
  },
  wedding_vendor: {
    title: 'Wedding Planner & Royal Atelier',
    subtitle: 'Luxury planners, floral architects, bridal couture stylists, cinematic videography',
    verticals: ['weddings'],
    commissionPercent: 10.0,
    kycRequirements: ['Portfolio Documentation', 'Business Registration', 'Client References'],
    badge: 'Couture Partner',
    icon: '💍',
  },
  logistics_partner: {
    title: 'Cold Chain & International Courier',
    subtitle: 'Temperature-controlled reefer fleet, cross-border air freight to GCC/UK/US',
    verticals: ['business', 'gifting', 'crafts'],
    commissionPercent: 5.0,
    kycRequirements: ['Logistics Carrier Permit', 'IATA / Customs Broker License', 'Cargo Insurance'],
    badge: 'Carrier Network',
    icon: '✈️',
  },
}

// ── Seed Partners for Immediate Live Operations ──────────────────────────────
export const INITIAL_PARTNER_APPLICATIONS: PartnerApplication[] = [
  {
    id: 'partner-app-101',
    businessName: 'Pampore Golden Saffron Farmers Cooperative',
    contactPerson: 'Bashir Ahmad Reshi',
    email: 'reshi.saffron@coop.kashmir.in',
    phone: '+91 94190 12847',
    whatsapp: '+91 94190 12847',
    partnerType: 'farmer',
    verticals: ['business', 'gifting'],
    country: 'India',
    countryCode: 'IN',
    city: 'Pampore',
    address: 'Karewa Highlands Saffron Hub, Pampore, Pulwama 192121',
    taxId: '01AABCP1928K1Z5',
    fssaiNumber: '21021441000889',
    craftCertifications: ['GI Registration Kashmir Saffron #GI-535', 'Organic Harvest Certified'],
    annualTurnover: '₹4.8 Crores',
    status: 'APPROVED',
    commissionTier: {
      standardTakeRatePercent: 5.0,
      payoutCycleDays: 7,
      listingFeeINR: 0,
      minimumOrderValueINR: 25000,
    },
    notes: 'Primary GI Mongra Saffron collective covering 42 farming families across Pampore Karewas.',
    createdAt: '2026-09-12T08:30:00Z',
    updatedAt: '2026-09-15T11:00:00Z',
  },
  {
    id: 'partner-app-102',
    businessName: 'Hazratbal Walnut Wood Guild & Master Carvers',
    contactPerson: 'Ghulam Mohiuddin Mir',
    email: 'mohiuddin.carvings@guild.org',
    phone: '+91 97970 88291',
    whatsapp: '+91 97970 88291',
    partnerType: 'artisan',
    verticals: ['crafts', 'gifting', 'weddings'],
    country: 'India',
    countryCode: 'IN',
    city: 'Srinagar',
    address: 'Crafts Enclave, Hazratbal Canal Road, Srinagar 190006',
    craftCertifications: ['National Award Handicrafts 2018', 'GI Tag Certified Walnut Wood Carving'],
    annualTurnover: '₹1.2 Crores',
    status: 'APPROVED',
    commissionTier: {
      standardTakeRatePercent: 12.0,
      payoutCycleDays: 14,
      listingFeeINR: 0,
      minimumOrderValueINR: 5000,
    },
    notes: 'Crafts bespoke royal trousseau chests, jewellery caskets, and floral-embossed serving bowls.',
    createdAt: '2026-09-18T10:15:00Z',
    updatedAt: '2026-09-20T14:20:00Z',
  },
  {
    id: 'partner-app-103',
    businessName: 'The Khyber Himalayan Retreat & Spa',
    contactPerson: 'Simran Khosla (Reservations & Alliances)',
    email: 'alliances@khyberresort.com',
    phone: '+91 1954 254 666',
    whatsapp: '+91 98110 33451',
    partnerType: 'hotel',
    verticals: ['stays', 'weddings'],
    country: 'India',
    countryCode: 'IN',
    city: 'Gulmarg',
    address: 'Pir Panjal Range, Gulmarg Meadow, Baramulla 193403',
    taxId: '01AAACK9928P1Z8',
    annualTurnover: '₹35 Crores',
    status: 'APPROVED',
    commissionTier: {
      standardTakeRatePercent: 14.0,
      payoutCycleDays: 14,
      listingFeeINR: 0,
      minimumOrderValueINR: 28000,
    },
    notes: 'Premier 5-star alpine destination partner for luxury ski buyouts and high-net-worth wedding room blocks.',
    createdAt: '2026-09-25T14:40:00Z',
    updatedAt: '2026-09-28T09:10:00Z',
  },
  {
    id: 'partner-app-104',
    businessName: 'Al-Barakah Fine Foods & Spices LLC',
    contactPerson: 'Tariq Al-Hashemi',
    email: 'procurement@albarakah-dubai.ae',
    phone: '+971 4 338 9201',
    whatsapp: '+971 50 812 7744',
    partnerType: 'wholesaler',
    verticals: ['business'],
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    address: 'Deira Spice Souk Trading Zone, Warehouse 44, Dubai UAE',
    taxId: 'TRN 100293847500003',
    fssaiNumber: 'Dubai Municipality Food Control Approved',
    annualTurnover: 'AED 18 Million',
    status: 'PENDING_REVIEW',
    commissionTier: {
      standardTakeRatePercent: 4.5,
      payoutCycleDays: 7,
      listingFeeINR: 0,
      minimumOrderValueINR: 500000,
    },
    notes: 'Requesting bulk import partner channel for GCC distribution of Nuty Tales vacuum-packed saffron & walnut halves.',
    createdAt: '2026-10-06T11:20:00Z',
    updatedAt: '2026-10-06T11:20:00Z',
  },
  {
    id: 'partner-app-105',
    businessName: 'Sheen Mountain Heli-Ski & Expeditions',
    contactPerson: 'Farooq Lone',
    email: 'concierge@sheenheliski.com',
    phone: '+91 94191 77209',
    whatsapp: '+91 94191 77209',
    partnerType: 'dmc',
    verticals: ['travel'],
    country: 'India',
    countryCode: 'IN',
    city: 'Gulmarg',
    address: 'Apharwat Peak Staging Post, Gulmarg, Kashmir 193403',
    craftCertifications: ['JK Tourism Certified Grade A Operator', 'International Heli-Ski Guides Association'],
    annualTurnover: '₹3.2 Crores',
    status: 'PENDING_REVIEW',
    commissionTier: {
      standardTakeRatePercent: 15.0,
      payoutCycleDays: 14,
      listingFeeINR: 0,
      minimumOrderValueINR: 85000,
    },
    notes: 'Specialist backcountry heli-ski itineraries and private mountain guiding for international travellers.',
    createdAt: '2026-10-07T09:45:00Z',
    updatedAt: '2026-10-07T09:45:00Z',
  },
]
