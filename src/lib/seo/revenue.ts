/**
 * Nuty Tales SEO — Revenue Attribution System
 *
 * Every SEO page has a revenue pathway. This module:
 *
 * 1. Assigns seo_page_id to every page so conversions can be attributed
 * 2. Defines the conversion tracking schema
 * 3. Provides utility functions to calculate SEO-driven revenue metrics
 * 4. Powers the SEO KPI dashboard
 *
 * Attribution model: First-touch + Last-touch dual-credit model.
 * Both the first SEO page that brought the user AND the last SEO page
 * before conversion are credited.
 *
 * NEVER report "indexed" unless GSC confirms it.
 * NEVER report "revenue from SEO" unless analytics confirms attribution.
 */

import type { NutyBusiness, ConversionType, SeoConversion } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// REVENUE KPI MODEL
// ─────────────────────────────────────────────────────────────────────────────

export interface SeoRevenueKpis {
  // Primary KPIs — these are the REAL metrics
  organicRevenue: number;
  organicGmv: number;
  organicLeads: number;
  organicRfqs: number;
  organicBookings: number;
  organicOrders: number;
  organicQuotes: number;
  organicConversionRate: number;
  currency: string;

  // Secondary KPIs
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  indexedPages: number;
  indexationRate: number;

  // Diagnostic
  pagesPublished: number;
  pagesIndexed: number;
  pagesWithTraffic: number;
  pagesWithConversion: number;
  pagesWithRevenue: number;

  // Never report these as primary:
  // urlCount, generatedPageCount, sitemapUrlCount
  // These are diagnostic only — not success metrics.
  diagnosticUrlCount: number;
  diagnosticCandidateCount: number;
  diagnosticIndexableCount: number;

  period: {
    from: Date;
    to: Date;
  };
  business: NutyBusiness | 'all';
  lastUpdated: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVERSION TRACKING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The revenue pathway for each business type.
 *
 * This defines what a "conversion" means for each business — it's NOT
 * just a purchase. Every business has multiple conversion types.
 */
export const BUSINESS_CONVERSION_PATHS: Record<NutyBusiness, ConversionType[]> = {
  root: ['order', 'account_creation'],
  business: ['rfq', 'lead', 'quote', 'order'],
  gifting: ['gifting_order', 'rfq', 'quote', 'lead'],
  weddings: ['wedding_enquiry', 'lead', 'rfq', 'quote'],
  crafts: ['order', 'rfq', 'lead', 'whatsapp_enquiry'],
  stays: ['stay_booking', 'lead', 'rfq', 'phone_call'],
  travel: ['travel_booking', 'rfq', 'lead', 'quote'],
};

// ─────────────────────────────────────────────────────────────────────────────
// CTA REVENUE PATHWAYS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Defines the commercial action and its associated conversion goal for
 * each business. Used to set primary CTA labels and tracking goals.
 *
 * Every commercial SEO page must connect to one of these pathways.
 * Traffic-only pages are not acceptable.
 */
export const BUSINESS_PRIMARY_CTAS: Record<NutyBusiness, {
  label: string;
  conversionType: ConversionType;
  trackingGoal: string;
}> = {
  root: {
    label: 'Shop Now',
    conversionType: 'order',
    trackingGoal: 'root_purchase',
  },
  business: {
    label: 'Get a Bulk Quote',
    conversionType: 'rfq',
    trackingGoal: 'business_rfq_submitted',
  },
  gifting: {
    label: 'Design a Gift',
    conversionType: 'gifting_order',
    trackingGoal: 'gifting_order_started',
  },
  weddings: {
    label: 'Request Wedding Quote',
    conversionType: 'wedding_enquiry',
    trackingGoal: 'wedding_enquiry_submitted',
  },
  crafts: {
    label: 'Shop Now',
    conversionType: 'order',
    trackingGoal: 'crafts_purchase',
  },
  stays: {
    label: 'Check Availability',
    conversionType: 'stay_booking',
    trackingGoal: 'stay_availability_checked',
  },
  travel: {
    label: 'Build My Trip',
    conversionType: 'travel_booking',
    trackingGoal: 'travel_builder_started',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP ENQUIRY LINKS
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+919999999999';

/**
 * Generates a WhatsApp pre-filled message link for a given page context.
 * This is the fallback conversion path for every commercial page.
 */
export function buildWhatsappLink(params: {
  business: NutyBusiness;
  pageContext?: string;  // e.g. "wholesale cashews noida"
  quantity?: string;
  location?: string;
}): string {
  const { business, pageContext, quantity, location } = params;

  const businessMessages: Record<NutyBusiness, string> = {
    root:     `Hi, I found your website and wanted to enquire about${pageContext ? ` ${pageContext}` : ' your products'}.`,
    business: `Hi, I'm interested in${pageContext ? ` ${pageContext}` : ' wholesale dry fruits'}${quantity ? ` (approx. ${quantity})` : ''}${location ? ` for ${location}` : ''}. Please share your B2B price list.`,
    gifting:  `Hi, I'd like to enquire about${pageContext ? ` ${pageContext}` : ' corporate gifting'}${quantity ? ` for ${quantity}` : ''}. Please share your gifting catalogue.`,
    weddings: `Hi, I'm planning a${pageContext ? ` ${pageContext}` : ' wedding'} and would like to get a quote. Can you share your packages?`,
    crafts:   `Hi, I'm interested in${pageContext ? ` ${pageContext}` : ' your Kashmir crafts'}. Can you share more details and pricing?`,
    stays:    `Hi, I'd like to check availability for${pageContext ? ` ${pageContext}` : ' a stay'}${location ? ` in ${location}` : ''}. Can you please assist?`,
    travel:   `Hi, I'm planning a trip${pageContext ? ` to ${pageContext}` : ''}. Can you share your package options and pricing?`,
  };

  const message = encodeURIComponent(businessMessages[business]);
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${message}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SEO PAGE ID GENERATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates a stable, deterministic page ID from the canonical URL.
 * This ID is stored with every conversion for attribution.
 *
 * Format: {business}-{slug-hash}
 * Example: travel-kashmir-7-days-a1b2c3
 *
 * Note: In production this should come from the database (SeoMetadata.id).
 * This utility is for consistent client-side page tracking.
 */
export function generateSeoPageId(canonicalUrl: string): string {
  // Simple deterministic hash from URL
  let hash = 0;
  for (let i = 0; i < canonicalUrl.length; i++) {
    const char = canonicalUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hashHex = Math.abs(hash).toString(16).padStart(8, '0');

  // Extract business and slug for readability
  const url = new URL(canonicalUrl);
  const subdomain = url.hostname.split('.')[0];
  const business  = subdomain === 'nutytales' ? 'root' : subdomain;
  const slugPart  = url.pathname.replace(/\//g, '-').replace(/^-/, '').substring(0, 30);

  return `${business}-${slugPart}-${hashHex}`.replace(/-{2,}/g, '-');
}

// ─────────────────────────────────────────────────────────────────────────────
// GTM / ANALYTICS INTEGRATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Data layer push for SEO page view tracking.
 * Call this in client components when SEO pages are viewed.
 *
 * Sends:
 *   - seo_page_id (for attribution)
 *   - business (which vertical)
 *   - page_type
 *   - intent_type
 *   - quality_score (diagnostic)
 */
export function pushSeoPageView(params: {
  seoPageId: string;
  business: NutyBusiness;
  pageType: string;
  intentType: string;
  qualityScore?: number;
  canonicalUrl: string;
}): void {
  if (typeof window === 'undefined' || !('dataLayer' in window)) return;

  // @ts-ignore — GTM dataLayer
  window.dataLayer = window.dataLayer ?? [];
  // @ts-ignore
  window.dataLayer.push({
    event: 'seo_page_view',
    seo_page_id: params.seoPageId,
    seo_business: params.business,
    seo_page_type: params.pageType,
    seo_intent_type: params.intentType,
    seo_quality_score: params.qualityScore,
    seo_canonical_url: params.canonicalUrl,
  });
}

/**
 * Data layer push for SEO conversion tracking.
 * Call this when a user converts (submits RFQ, books, orders, etc.)
 */
export function pushSeoConversion(params: {
  seoPageId: string;
  business: NutyBusiness;
  conversionType: ConversionType;
  revenue?: number;
  currency?: string;
  orderId?: string;
}): void {
  if (typeof window === 'undefined' || !('dataLayer' in window)) return;

  // @ts-ignore
  window.dataLayer = window.dataLayer ?? [];
  // @ts-ignore
  window.dataLayer.push({
    event: 'seo_conversion',
    seo_page_id: params.seoPageId,
    seo_business: params.business,
    seo_conversion_type: params.conversionType,
    seo_revenue: params.revenue,
    seo_currency: params.currency ?? 'INR',
    seo_order_id: params.orderId,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI COMPUTATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Computes an initial empty KPI snapshot.
 * In production, populate this from database aggregation queries.
 *
 * This structure enforces the correct KPI hierarchy:
 * Revenue first, URL count last (diagnostic only).
 */
export function buildEmptyKpiSnapshot(
  business: NutyBusiness | 'all',
  periodFrom: Date,
  periodTo: Date
): SeoRevenueKpis {
  return {
    organicRevenue:         0,
    organicGmv:             0,
    organicLeads:           0,
    organicRfqs:            0,
    organicBookings:        0,
    organicOrders:          0,
    organicQuotes:          0,
    organicConversionRate:  0,
    currency:               'INR',
    impressions:            0,
    clicks:                 0,
    ctr:                    0,
    averagePosition:        0,
    indexedPages:           0,
    indexationRate:         0,
    pagesPublished:         0,
    pagesIndexed:           0,
    pagesWithTraffic:       0,
    pagesWithConversion:    0,
    pagesWithRevenue:       0,
    diagnosticUrlCount:     0,
    diagnosticCandidateCount: 0,
    diagnosticIndexableCount: 0,
    period:                 { from: periodFrom, to: periodTo },
    business,
    lastUpdated:            new Date(),
  };
}

/**
 * Revenue per page calculation.
 * Use to identify high-performing SEO pages and scale them.
 */
export function revenuePerPage(kpis: SeoRevenueKpis): number {
  if (kpis.pagesWithRevenue === 0) return 0;
  return kpis.organicRevenue / kpis.pagesWithRevenue;
}

/**
 * Indexation efficiency.
 * High-quality pages should have a high indexation rate.
 * Low indexation rate of published pages = quality or technical issue.
 */
export function indexationEfficiency(kpis: SeoRevenueKpis): number {
  if (kpis.pagesPublished === 0) return 0;
  return (kpis.pagesIndexed / kpis.pagesPublished) * 100;
}
