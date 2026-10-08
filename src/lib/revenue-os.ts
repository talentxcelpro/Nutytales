// ─── Nuty Tales — Revenue OS & Unified Commercial Telemetry Engine ───────────
// Central commercial intelligence engine tracking the global funnel:
// TRAFFIC → DISCOVERY → ENGAGEMENT → LEAD → CART → CHECKOUT → BOOKING → REPEAT PURCHASE → REFERRAL

import { PlatformVertical } from '@/lib/platform-core'
import { SUPPORTED_COUNTRIES, SUPPORTED_CURRENCIES, formatGlobalPrice, CurrencyCode } from '@/lib/global-config'

export type RevenueEventType =
  | 'PAGE_VIEW'
  | 'UNIQUE_VISITOR'
  | 'SESSION_START'
  | 'PRODUCT_VIEW'
  | 'SEARCH'
  | 'WISHLIST'
  | 'ADD_TO_CART'
  | 'CHECKOUT_STARTED'
  | 'PURCHASE'
  | 'BOOKING'
  | 'RFQ'
  | 'LEAD'
  | 'WHATSAPP_CLICK'
  | 'PHONE_CALL'
  | 'ACCOUNT_CREATION'
  | 'VENDOR_SIGNUP'
  | 'SELLER_SIGNUP'
  | 'HOST_SIGNUP'
  | 'PARTNER_SIGNUP'
  | 'REPEAT_PURCHASE'
  | 'REFERRAL'

export type TrafficSource =
  | 'direct'
  | 'organic_search'
  | 'social'
  | 'cpc'
  | 'referral'
  | 'email'
  | 'whatsapp'
  | 'b2b_outbound'

export interface RevenueTelemetryEvent {
  id: string
  timestamp: string // ISO
  type: RevenueEventType
  vertical: PlatformVertical | 'global'
  countryCode: string // IN, AE, GB, US, CA, AU, SG, SA
  city?: string
  currency: CurrencyCode
  device?: 'mobile' | 'desktop' | 'tablet'
  trafficSource?: TrafficSource
  landingPage?: string
  searchQuery?: string
  valueINR: number // Transaction or estimated pipeline value in INR
  commissionINR: number // Net revenue / commission cut to platform
  metadata?: Record<string, unknown>
  userId?: string
  sessionId?: string
}

export type TimeframeFilter = 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'ytd'

export interface VerticalFinancialSummary {
  vertical: PlatformVertical
  verticalName: string
  gmvINR: number
  netRevenueINR: number
  takeRatePercent: number
  transactionsCount: number
  leadsAndRfqsCount: number
  aovINR: number
  conversionRatePercent: number
  cacINR: number
  ltvINR: number
  topCategoryOrCommodity: string
}

export interface RegionalFinancialSummary {
  countryCode: string
  countryName: string
  currency: CurrencyCode
  gmvINR: number
  netRevenueINR: number
  ordersCount: number
  shareOfTotalPercent: number
}

export interface FunnelStageMetric {
  stage: string
  count: number
  conversionFromPrevious: number // percent
  dropoffRate: number // percent
}

export interface RevenueOSDashboardMetrics {
  timeframe: TimeframeFilter
  totalVisitors: number
  uniqueVisitors: number
  totalSessions: number
  totalGMVINR: number
  totalNetRevenueINR: number
  blendedTakeRatePercent: number
  totalOrdersAndBookings: number
  totalLeadsAndRFQs: number
  blendedAOVINR: number
  blendedCACINR: number
  estimatedLTVINR: number
  funnel: FunnelStageMetric[]
  verticalSummaries: VerticalFinancialSummary[]
  regionalSummaries: RegionalFinancialSummary[]
  channelAttributions: {
    source: TrafficSource
    label: string
    sharePercent: number
    revenueINR: number
  }[]
  recentEvents: RevenueTelemetryEvent[]
}

// ── Baseline Marketplace Take Rates ───────────────────────────────────────────
export const VERTICAL_TAKE_RATES: Record<PlatformVertical, { averageTakeRate: number; label: string }> = {
  business: { averageTakeRate: 0.065, label: 'Nuty Tales Business (B2B Supply)' },
  gifting: { averageTakeRate: 0.22, label: 'Nuty Tales Gifting (Corporate & VIP)' },
  weddings: { averageTakeRate: 0.14, label: 'Nuty Tales Weddings (Concierge & Venues)' },
  crafts: { averageTakeRate: 0.24, label: 'Nuty Tales Crafts (Artisan Marketplace)' },
  stays: { averageTakeRate: 0.16, label: 'Nuty Tales Stays (Residences & Estates)' },
  travel: { averageTakeRate: 0.18, label: 'Nuty Tales Travel (Curated DMCs)' },
  discovery: { averageTakeRate: 0.15, label: 'Master Gateway Discovery' },
}

// ── Synthetic Realistic Multi-Timeframe Telemetry Generator ────────────────────
// Provides immediate realistic reporting across all 6 verticals and 8 global territories
export function getRevenueOSMetrics(timeframe: TimeframeFilter = '7d'): RevenueOSDashboardMetrics {
  const multipliers: Record<TimeframeFilter, number> = {
    today: 0.14,
    yesterday: 0.13,
    '7d': 1.0,
    '30d': 4.2,
    '90d': 12.5,
    ytd: 48.0,
  }

  const factor = multipliers[timeframe]

  const baseVisitors = Math.round(48500 * factor)
  const baseUnique = Math.round(39800 * factor)
  const baseSessions = Math.round(56200 * factor)

  // GMV & Revenue base per vertical for 7D benchmark:
  const verticalData: VerticalFinancialSummary[] = [
    {
      vertical: 'business',
      verticalName: 'Nuty Tales Business',
      gmvINR: Math.round(18500000 * factor),
      netRevenueINR: Math.round(18500000 * factor * 0.065),
      takeRatePercent: 6.5,
      transactionsCount: Math.round(42 * factor),
      leadsAndRfqsCount: Math.round(118 * factor),
      aovINR: 440476,
      conversionRatePercent: 3.2,
      cacINR: 8500,
      ltvINR: 980000,
      topCategoryOrCommodity: 'Kashmiri Mongra Saffron (GI) & Single-Origin Halves',
    },
    {
      vertical: 'gifting',
      verticalName: 'Nuty Tales Gifting',
      gmvINR: Math.round(8200000 * factor),
      netRevenueINR: Math.round(8200000 * factor * 0.22),
      takeRatePercent: 22.0,
      transactionsCount: Math.round(380 * factor),
      leadsAndRfqsCount: Math.round(240 * factor),
      aovINR: 21578,
      conversionRatePercent: 4.8,
      cacINR: 1250,
      ltvINR: 65000,
      topCategoryOrCommodity: 'Royal Zabarwan Walnut Wood Casket & Festive Boxes',
    },
    {
      vertical: 'weddings',
      verticalName: 'Nuty Tales Weddings',
      gmvINR: Math.round(6400000 * factor),
      netRevenueINR: Math.round(6400000 * factor * 0.14),
      takeRatePercent: 14.0,
      transactionsCount: Math.round(18 * factor),
      leadsAndRfqsCount: Math.round(86 * factor),
      aovINR: 355555,
      conversionRatePercent: 2.1,
      cacINR: 9200,
      ltvINR: 480000,
      topCategoryOrCommodity: 'Destination Palaces, Return Favors & Trousseau Stoles',
    },
    {
      vertical: 'crafts',
      verticalName: 'Nuty Tales Crafts',
      gmvINR: Math.round(3900000 * factor),
      netRevenueINR: Math.round(3900000 * factor * 0.24),
      takeRatePercent: 24.0,
      transactionsCount: Math.round(145 * factor),
      leadsAndRfqsCount: Math.round(52 * factor),
      aovINR: 26896,
      conversionRatePercent: 3.4,
      cacINR: 2100,
      ltvINR: 72000,
      topCategoryOrCommodity: 'Changthangi Handspun Pashmina & Sozni Needlework',
    },
    {
      vertical: 'stays',
      verticalName: 'Nuty Tales Stays',
      gmvINR: Math.round(4100000 * factor),
      netRevenueINR: Math.round(4100000 * factor * 0.16),
      takeRatePercent: 16.0,
      transactionsCount: Math.round(62 * factor),
      leadsAndRfqsCount: Math.round(94 * factor),
      aovINR: 66129,
      conversionRatePercent: 2.8,
      cacINR: 2800,
      ltvINR: 124000,
      topCategoryOrCommodity: 'Private Orchard Villas & Dal Lake Heritage Houseboats',
    },
    {
      vertical: 'travel',
      verticalName: 'Nuty Tales Travel',
      gmvINR: Math.round(5300000 * factor),
      netRevenueINR: Math.round(5300000 * factor * 0.18),
      takeRatePercent: 18.0,
      transactionsCount: Math.round(74 * factor),
      leadsAndRfqsCount: Math.round(135 * factor),
      aovINR: 71621,
      conversionRatePercent: 3.1,
      cacINR: 3100,
      ltvINR: 145000,
      topCategoryOrCommodity: 'Gulmarg Heli-Ski & Great Lakes Highland Treks',
    },
  ]

  const totalGMVINR = verticalData.reduce((acc, v) => acc + v.gmvINR, 0)
  const totalNetRevenueINR = verticalData.reduce((acc, v) => acc + v.netRevenueINR, 0)
  const totalOrdersAndBookings = verticalData.reduce((acc, v) => acc + v.transactionsCount, 0)
  const totalLeadsAndRFQs = verticalData.reduce((acc, v) => acc + v.leadsAndRfqsCount, 0)
  const blendedTakeRatePercent = Number(((totalNetRevenueINR / totalGMVINR) * 100).toFixed(1))
  const blendedAOVINR = Math.round(totalGMVINR / Math.max(1, totalOrdersAndBookings))
  const blendedCACINR = 2850
  const estimatedLTVINR = 185000

  // Regional breakdown
  const regionalSummaries: RegionalFinancialSummary[] = [
    {
      countryCode: 'IN',
      countryName: 'India',
      currency: 'INR',
      gmvINR: Math.round(totalGMVINR * 0.52),
      netRevenueINR: Math.round(totalNetRevenueINR * 0.50),
      ordersCount: Math.round(totalOrdersAndBookings * 0.62),
      shareOfTotalPercent: 52,
    },
    {
      countryCode: 'AE',
      countryName: 'United Arab Emirates',
      currency: 'AED',
      gmvINR: Math.round(totalGMVINR * 0.22),
      netRevenueINR: Math.round(totalNetRevenueINR * 0.23),
      ordersCount: Math.round(totalOrdersAndBookings * 0.18),
      shareOfTotalPercent: 22,
    },
    {
      countryCode: 'US',
      countryName: 'United States',
      currency: 'USD',
      gmvINR: Math.round(totalGMVINR * 0.12),
      netRevenueINR: Math.round(totalNetRevenueINR * 0.13),
      ordersCount: Math.round(totalOrdersAndBookings * 0.09),
      shareOfTotalPercent: 12,
    },
    {
      countryCode: 'GB',
      countryName: 'United Kingdom',
      currency: 'GBP',
      gmvINR: Math.round(totalGMVINR * 0.08),
      netRevenueINR: Math.round(totalNetRevenueINR * 0.08),
      ordersCount: Math.round(totalOrdersAndBookings * 0.06),
      shareOfTotalPercent: 8,
    },
    {
      countryCode: 'SA',
      countryName: 'Saudi Arabia',
      currency: 'SAR',
      gmvINR: Math.round(totalGMVINR * 0.04),
      netRevenueINR: Math.round(totalNetRevenueINR * 0.04),
      ordersCount: Math.round(totalOrdersAndBookings * 0.03),
      shareOfTotalPercent: 4,
    },
    {
      countryCode: 'SG',
      countryName: 'Singapore',
      currency: 'SGD',
      gmvINR: Math.round(totalGMVINR * 0.02),
      netRevenueINR: Math.round(totalNetRevenueINR * 0.02),
      ordersCount: Math.round(totalOrdersAndBookings * 0.02),
      shareOfTotalPercent: 2,
    },
  ]

  // Funnel analytics
  const discoveryCount = baseVisitors
  const engagementCount = Math.round(discoveryCount * 0.42)
  const leadCount = Math.round(discoveryCount * 0.085)
  const cartOrCheckout = Math.round(discoveryCount * 0.045)
  const converted = totalOrdersAndBookings

  const funnel: FunnelStageMetric[] = [
    {
      stage: '1. Traffic & Discovery',
      count: discoveryCount,
      conversionFromPrevious: 100,
      dropoffRate: 0,
    },
    {
      stage: '2. Catalog & Item Engagement',
      count: engagementCount,
      conversionFromPrevious: 42,
      dropoffRate: 58,
    },
    {
      stage: '3. Lead / RFQ / Customization',
      count: leadCount,
      conversionFromPrevious: 20.2,
      dropoffRate: 79.8,
    },
    {
      stage: '4. Cart & Checkout Started',
      count: cartOrCheckout,
      conversionFromPrevious: 52.9,
      dropoffRate: 47.1,
    },
    {
      stage: '5. Purchase & Bookings Completed',
      count: converted,
      conversionFromPrevious: 36.8,
      dropoffRate: 63.2,
    },
  ]

  const channelAttributions = [
    { source: 'organic_search' as TrafficSource, label: 'Global Organic & SEO', sharePercent: 36, revenueINR: Math.round(totalGMVINR * 0.36) },
    { source: 'direct' as TrafficSource, label: 'Direct & Brand Portals', sharePercent: 24, revenueINR: Math.round(totalGMVINR * 0.24) },
    { source: 'b2b_outbound' as TrafficSource, label: 'Institutional & Corporate Procurement', sharePercent: 22, revenueINR: Math.round(totalGMVINR * 0.22) },
    { source: 'referral' as TrafficSource, label: 'Luxury Hotel / Wedding Planner Network', sharePercent: 11, revenueINR: Math.round(totalGMVINR * 0.11) },
    { source: 'whatsapp' as TrafficSource, label: 'WhatsApp High-Intent Concierge', sharePercent: 7, revenueINR: Math.round(totalGMVINR * 0.07) },
  ]

  const recentEvents: RevenueTelemetryEvent[] = [
    {
      id: 'rev-evt-1',
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      type: 'RFQ',
      vertical: 'business',
      countryCode: 'AE',
      city: 'Dubai',
      currency: 'AED',
      device: 'desktop',
      trafficSource: 'direct',
      valueINR: 850000,
      commissionINR: 55250,
      metadata: { commodity: 'Mongra Saffron 10kg export', buyer: 'Al-Farooq Gourmet LLC' },
    },
    {
      id: 'rev-evt-2',
      timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      type: 'PURCHASE',
      vertical: 'gifting',
      countryCode: 'IN',
      city: 'Mumbai',
      currency: 'INR',
      device: 'mobile',
      trafficSource: 'whatsapp',
      valueINR: 145000,
      commissionINR: 31900,
      metadata: { package: '30x Walnut Wood Festive Caskets' },
    },
    {
      id: 'rev-evt-3',
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      type: 'BOOKING',
      vertical: 'stays',
      countryCode: 'GB',
      city: 'London',
      currency: 'GBP',
      device: 'desktop',
      trafficSource: 'organic_search',
      valueINR: 198000,
      commissionINR: 31680,
      metadata: { stay: 'Nigeen Lake Lotus Suite — 5 nights' },
    },
    {
      id: 'rev-evt-4',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      type: 'PURCHASE',
      vertical: 'crafts',
      countryCode: 'US',
      city: 'San Francisco',
      currency: 'USD',
      device: 'desktop',
      trafficSource: 'referral',
      valueINR: 88500,
      commissionINR: 21240,
      metadata: { craft: 'Antique Shah-i-Hamadan Pashmina Shawl' },
    },
    {
      id: 'rev-evt-5',
      timestamp: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
      type: 'LEAD',
      vertical: 'weddings',
      countryCode: 'IN',
      city: 'Delhi NCR',
      currency: 'INR',
      device: 'mobile',
      trafficSource: 'social',
      valueINR: 450000,
      commissionINR: 63000,
      metadata: { event: '350 Trousseau Return Favors' },
    },
  ]

  return {
    timeframe,
    totalVisitors: baseVisitors,
    uniqueVisitors: baseUnique,
    totalSessions: baseSessions,
    totalGMVINR,
    totalNetRevenueINR,
    blendedTakeRatePercent,
    totalOrdersAndBookings,
    totalLeadsAndRFQs,
    blendedAOVINR,
    blendedCACINR,
    estimatedLTVINR,
    funnel,
    verticalSummaries: verticalData,
    regionalSummaries,
    channelAttributions,
    recentEvents,
  }
}

// ── Client-Side Telemetry Dispatcher ──────────────────────────────────────────
export function trackRevenueEvent(
  event: Omit<RevenueTelemetryEvent, 'id' | 'timestamp'>
): void {
  if (typeof window === 'undefined') return

  const fullEvent: RevenueTelemetryEvent = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...event,
  }

  // 1. Google Analytics 4 dataLayer sync
  try {
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: fullEvent.type,
        vertical: fullEvent.vertical,
        value: fullEvent.valueINR,
        currency: 'INR',
        country: fullEvent.countryCode,
        ...fullEvent.metadata,
      })
    }
  } catch {
    // Non-blocking
  }

  // 2. Local buffer storage for fast offline / executive inspection
  try {
    const raw = localStorage.getItem('nutytales_recent_telemetry')
    const parsed: RevenueTelemetryEvent[] = raw ? JSON.parse(raw) : []
    parsed.unshift(fullEvent)
    localStorage.setItem('nutytales_recent_telemetry', JSON.stringify(parsed.slice(0, 50)))
  } catch {
    // Non-blocking
  }

  // 3. Asynchronous beacon dispatch to Revenue OS API endpoint
  try {
    if (typeof fetch === 'function') {
      fetch('/api/revenue-os/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullEvent),
        keepalive: true,
      }).catch(() => {
        // Silently tolerate backend offline
      })
    }
  } catch {
    // Silently ignore
  }
}
