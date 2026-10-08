/**
 * Nuty Tales SEO — Demand Intelligence Engine
 *
 * This module maintains and analyzes the SEO demand signals that power
 * the page candidate discovery system.
 *
 * Inputs:
 *   - Google Search Console (via API integration)
 *   - Internal site search queries
 *   - SI (Smart Intelligence) assistant queries
 *   - RFQ submissions
 *   - WhatsApp enquiry text
 *   - Customer order patterns
 *   - Phone/support enquiries
 *   - Seasonal and market trends
 *
 * The engine:
 *   1. Normalizes and deduplicates queries
 *   2. Assigns intent and business
 *   3. Scores commercial potential
 *   4. Identifies existing page coverage
 *   5. Flags supply gaps
 *   6. Creates qualified SEO page candidates
 *
 * IMPORTANT: This engine discovers opportunities.
 * It does NOT automatically publish pages.
 * The Indexation Governor makes the final call.
 */

import type {
  DemandSignal,
  SupplyGap,
  SeoPageCandidate,
  NutyBusiness,
  SeoIntentType,
  SeoPageType,
  SeoPageStatus,
} from './types';
import { determineSitemapTier } from './governor';

// ─────────────────────────────────────────────────────────────────────────────
// QUERY NORMALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalizes a raw search query for deduplication and intent matching.
 * Converts to lowercase, removes stop words, and standardizes spacing.
 */
export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    // Remove common stop words that don't add intent signal
    .replace(/\b(the|a|an|is|are|for|in|on|at|to|of|and|or|but|with)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// INTENT CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

const INTENT_PATTERNS: Array<{
  pattern: RegExp;
  intent: SeoIntentType;
  commercialBoost: number;
}> = [
  // B2B / Wholesale
  { pattern: /\b(wholesale|bulk|b2b|procurement|supplier|manufacturer|private label|distributor|reseller)\b/i, intent: 'b2b_procurement', commercialBoost: 30 },
  // RFQ
  { pattern: /\b(rfq|request.*quote|quote.*request|get.*quote|bulk.*quote|price.*list|rate.*list)\b/i, intent: 'rfq', commercialBoost: 35 },
  // Transactional
  { pattern: /\b(buy|order|purchase|book|reserve|checkout|add.*cart|shop)\b/i, intent: 'transactional', commercialBoost: 25 },
  // Local commercial
  { pattern: /\b(near me|in [a-z]+|[a-z]+ delivery|[a-z]+ supplier|[a-z]+ wholesale)\b/i, intent: 'local_commercial', commercialBoost: 20 },
  // Lead generation
  { pattern: /\b(enquire|enquiry|contact|call|whatsapp|plan|design|custom|bespoke)\b/i, intent: 'lead_generation', commercialBoost: 15 },
  // Commercial research
  { pattern: /\b(best|top|compare|vs|review|price|cost|cheap|affordable|premium|luxury)\b/i, intent: 'commercial', commercialBoost: 10 },
];

export function classifyIntent(query: string): { intent: SeoIntentType; commercialBoost: number } {
  for (const { pattern, intent, commercialBoost } of INTENT_PATTERNS) {
    if (pattern.test(query)) return { intent, commercialBoost };
  }
  return { intent: 'informational', commercialBoost: 0 };
}

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

const BUSINESS_PATTERNS: Array<{ pattern: RegExp; business: NutyBusiness }> = [
  { pattern: /\b(wholesale|bulk|b2b|procurement|dry fruit.*supply|makhana.*wholesale|almond.*wholesale|cashew.*wholesale)\b/i, business: 'business' },
  { pattern: /\b(gift|gifting|hamper|diwali.*gift|corporate.*gift|wedding.*gift|return.*gift|festive.*gift)\b/i, business: 'gifting' },
  { pattern: /\b(wedding|bride|groom|shaadi|nikah|destination.*wedding|wedding.*venue|wedding.*planner)\b/i, business: 'weddings' },
  { pattern: /\b(pashmina|kani|shawl|stole|pheran|kashmiri.*craft|kashmiri.*textile|artisan|handloom|sozni)\b/i, business: 'crafts' },
  { pattern: /\b(hotel|stay|houseboat|resort|villa|lodge|accommodation|room|boutique.*stay)\b/i, business: 'stays' },
  { pattern: /\b(trip|tour|travel|package|itinerary|holiday|vacation|trek|expedition|Kashmir.*tour)\b/i, business: 'travel' },
];

export function classifyBusiness(query: string): NutyBusiness {
  for (const { pattern, business } of BUSINESS_PATTERNS) {
    if (pattern.test(query)) return business;
  }
  return 'root';
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMAND SIGNAL CREATOR
// ─────────────────────────────────────────────────────────────────────────────

let _signalId = 0;

export function createDemandSignal(params: {
  query: string;
  frequency?: number;
  country?: string;
  city?: string;
  productOrService?: string;
  conversionCount?: number;
  revenueAttributed?: number;
  existingPageId?: string;
  existingPageQuality?: number;
}): DemandSignal {
  const normalized = normalizeQuery(params.query);
  const { intent, commercialBoost } = classifyIntent(params.query);
  const business = classifyBusiness(params.query);

  const baseCommercial = 50;
  const commercialScore = Math.min(100, baseCommercial + commercialBoost);
  const supplyGap = (params.existingPageQuality ?? 0) < 40 || !params.existingPageId;

  return {
    id: `sig-${++_signalId}`,
    query: params.query,
    normalizedQuery: normalized,
    intentType: intent,
    business,
    country: params.country,
    city: params.city,
    productOrService: params.productOrService,
    frequency: params.frequency ?? 1,
    commercialScore,
    conversionCount: params.conversionCount ?? 0,
    revenueAttributed: params.revenueAttributed ?? 0,
    existingPageId: params.existingPageId,
    existingPageQuality: params.existingPageQuality,
    supplyGap,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLY GAP DETECTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detects supply gaps from a batch of demand signals.
 * A supply gap exists when demand is high but:
 *   - No page exists (existingPageId is null)
 *   - OR the existing page quality is below threshold
 *   - AND the commercial score is above a minimum
 */
export function detectSupplyGaps(
  signals: DemandSignal[],
  options?: { minDemandFrequency?: number; minCommercialScore?: number; minQualityThreshold?: number }
): SupplyGap[] {
  const minFreq    = options?.minDemandFrequency  ?? 5;
  const minComm    = options?.minCommercialScore   ?? 50;
  const minQuality = options?.minQualityThreshold  ?? 40;

  const gaps: SupplyGap[] = [];
  let _gapId = 0;

  for (const signal of signals) {
    const hasGap =
      signal.frequency >= minFreq &&
      signal.commercialScore >= minComm &&
      (!signal.existingPageId || (signal.existingPageQuality ?? 0) < minQuality);

    if (hasGap) {
      gaps.push({
        id: `gap-${++_gapId}`,
        query: signal.query,
        business: signal.business,
        demandScore: Math.min(100, (signal.frequency / 100) * 50 + signal.commercialScore * 0.5),
        country: signal.country,
        city: signal.city,
        description:
          `High demand for "${signal.query}" (${signal.frequency} searches) ` +
          `with commercial intent (${signal.commercialScore}/100) but ` +
          (signal.existingPageId ? 'low-quality existing page.' : 'no existing page.'),
        status: 'open',
        createdAt: new Date(),
      });
    }
  }

  return gaps;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE CANDIDATE FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a high-quality demand signal into a SEO page candidate.
 * The candidate still needs to pass the Indexation Governor before publishing.
 *
 * This is the bridge between demand intelligence and page creation.
 */
export function signalToCandidate(
  signal: DemandSignal,
  pageType: SeoPageType,
  slug: string,
  options?: {
    supplyScore?: number;
    dataQualityScore?: number;
    uniquenessScore?: number;
    conversionScore?: number;
    freshnessScore?: number;
    trustScore?: number;
    internalLinkScore?: number;
    thinContentRisk?: number;
    duplicationRisk?: number;
    spamRisk?: number;
    revenueScore?: number;
    sitemapGroup?: string;
    attributes?: Record<string, string>;
  }
): SeoPageCandidate {
  const demandScore = Math.min(100, (signal.frequency / 100) * 60 + 40);
  const { business } = signal;

  // Compute canonical URL — in production, resolve against business domain
  const canonicalUrl = `https://${business === 'root' ? 'nutytales.com' : `${business}.nutytales.com`}${slug}`;

  const candidate: SeoPageCandidate = {
    id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    business,
    pageType,
    intentType: signal.intentType,
    keywordCluster: [signal.query],
    slug,
    canonicalUrl,
    country: signal.country,
    city: signal.city,
    occasion: signal.productOrService,
    attributes: options?.attributes,
    // Quality scores
    demandScore,
    commercialScore: signal.commercialScore,
    supplyScore:     options?.supplyScore       ?? 0,
    dataQualityScore: options?.dataQualityScore ?? 0,
    uniquenessScore:  options?.uniquenessScore  ?? 50,
    conversionScore:  options?.conversionScore  ?? 50,
    freshnessScore:   options?.freshnessScore   ?? 70,
    trustScore:       options?.trustScore       ?? 60,
    internalLinkScore: options?.internalLinkScore ?? 30,
    // Negative
    duplicationRisk:  options?.duplicationRisk  ?? 10,
    thinContentRisk:  options?.thinContentRisk  ?? 50,
    spamRisk:         options?.spamRisk         ?? 5,
    // Computed (will be updated by governor)
    qualityScore:    0,
    revenueScore:    options?.revenueScore ?? Math.round(signal.commercialScore * 0.5 + demandScore * 0.3),
    status:          'candidate' as SeoPageStatus,
    robotsDirective: 'noindex,nofollow',
    sitemapGroup:    options?.sitemapGroup,
    sitemapTier:     5,
    createdAt:       new Date(),
    updatedAt:       new Date(),
    lastEvaluatedAt: new Date(),
  };

  return candidate;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMAND DIMENSION EXPANSION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Expands a base opportunity across geographic or attribute dimensions.
 *
 * Example:
 *   expandAcrossDimensions('corporate-gifts/diwali', ['dubai', 'mumbai', 'london'])
 *   → ['/corporate-gifts/diwali/dubai', '/corporate-gifts/diwali/mumbai', ...]
 *
 * IMPORTANT: Only create a candidate for a dimension where:
 *   - genuine demand exists in that dimension
 *   - supply or sourcing is available
 *   - the page would be materially different from the parent
 *
 * This function creates CANDIDATES only — not published pages.
 * Each candidate must still pass the Indexation Governor.
 */
export function expandAcrossDimensions(
  basePath: string,
  dimensions: Array<{
    value: string;
    demandScore: number;
    supplyScore: number;
    commercialScore: number;
  }>,
  business: NutyBusiness,
  pageType: SeoPageType,
  options?: {
    sitemapGroup?: string;
    minDemandToExpand?: number;
  }
): SeoPageCandidate[] {
  const minDemand = options?.minDemandToExpand ?? 30;

  return dimensions
    .filter((d) => d.demandScore >= minDemand)
    .map((d) => {
      const slug = `${basePath}/${d.value}`;
      const canonicalUrl = `https://${business === 'root' ? 'nutytales.com' : `${business}.nutytales.com`}${slug}`;

      const partial: SeoPageCandidate = {
        id:               `cand-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        business,
        pageType,
        intentType:       'commercial',
        keywordCluster:   [slug.replace(/\//g, ' ').trim()],
        slug,
        canonicalUrl,
        attributes:       { dimension: d.value },
        demandScore:      d.demandScore,
        commercialScore:  d.commercialScore,
        supplyScore:      d.supplyScore,
        dataQualityScore: d.supplyScore > 50 ? 60 : 30,
        uniquenessScore:  70,
        conversionScore:  55,
        freshnessScore:   70,
        trustScore:       60,
        internalLinkScore: 40,
        duplicationRisk:  15,
        thinContentRisk:  d.supplyScore < 30 ? 60 : 30,
        spamRisk:         5,
        qualityScore:     0,
        revenueScore:     Math.round(d.commercialScore * 0.6 + d.demandScore * 0.4),
        status:           'candidate',
        robotsDirective:  'noindex,nofollow',
        sitemapGroup:     options?.sitemapGroup ?? 'general',
        sitemapTier:      5,
        createdAt:        new Date(),
        updatedAt:        new Date(),
        lastEvaluatedAt:  new Date(),
      };

      // Assign sitemap tier
      partial.sitemapTier = determineSitemapTier(partial);
      return partial;
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// KNOWN DEMAND CLUSTERS (Seed data for initial candidate generation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Known high-value demand clusters for Nuty Tales.
 * These are based on real business knowledge, not invented.
 *
 * demandScore:     Based on estimated search volume and brand relevance
 * commercialScore: Based on proven buyer intent signals
 * supplyScore:     Based on actual current supply capability (honest assessment)
 *
 * These candidates are created in CANDIDATE status.
 * They must pass governor scoring before becoming indexable.
 */
export const SEED_DEMAND_CLUSTERS: Array<{
  business: NutyBusiness;
  slug: string;
  pageType: SeoPageType;
  intent: SeoIntentType;
  keywordCluster: string[];
  demandScore: number;
  commercialScore: number;
  supplyScore: number;
  sitemapGroup: string;
}> = [
  // ── BUSINESS (wholesale.nutytales.com) ──────────────────────────────────
  { business: 'business', slug: '/wholesale-dry-fruits',              pageType: 'hub',      intent: 'b2b_procurement', keywordCluster: ['wholesale dry fruits', 'bulk dry fruits', 'dry fruits supplier'],            demandScore: 90, commercialScore: 95, supplyScore: 90, sitemapGroup: 'products' },
  { business: 'business', slug: '/almonds-wholesale',                 pageType: 'product',  intent: 'b2b_procurement', keywordCluster: ['wholesale almonds', 'bulk almonds', 'almonds supplier india'],              demandScore: 85, commercialScore: 90, supplyScore: 90, sitemapGroup: 'products' },
  { business: 'business', slug: '/cashews-wholesale',                 pageType: 'product',  intent: 'b2b_procurement', keywordCluster: ['wholesale cashews', 'bulk cashews w240 w320'],                             demandScore: 85, commercialScore: 90, supplyScore: 90, sitemapGroup: 'products' },
  { business: 'business', slug: '/makhana-wholesale',                 pageType: 'product',  intent: 'b2b_procurement', keywordCluster: ['makhana wholesale', 'lotus seeds bulk', 'makhana supplier'],               demandScore: 80, commercialScore: 88, supplyScore: 85, sitemapGroup: 'products' },
  { business: 'business', slug: '/dry-fruits-for-bakeries',           pageType: 'audience', intent: 'b2b_procurement', keywordCluster: ['dry fruits for bakeries', 'bakery dry fruit supplier'],                    demandScore: 70, commercialScore: 85, supplyScore: 85, sitemapGroup: 'industries' },
  { business: 'business', slug: '/dry-fruits-for-hotels',             pageType: 'audience', intent: 'b2b_procurement', keywordCluster: ['dry fruits for hotels', 'hotel dry fruit supply'],                        demandScore: 65, commercialScore: 82, supplyScore: 85, sitemapGroup: 'industries' },
  { business: 'business', slug: '/dry-fruits-for-sweet-shops',        pageType: 'audience', intent: 'b2b_procurement', keywordCluster: ['dry fruits for sweet shops', 'mithai shop dry fruit supplier'],            demandScore: 65, commercialScore: 82, supplyScore: 85, sitemapGroup: 'industries' },
  { business: 'business', slug: '/dry-fruits-for-restaurants',        pageType: 'audience', intent: 'b2b_procurement', keywordCluster: ['dry fruits for restaurants', 'restaurant dry fruit supply'],               demandScore: 60, commercialScore: 80, supplyScore: 80, sitemapGroup: 'industries' },
  { business: 'business', slug: '/almonds-wholesale/dubai',           pageType: 'location', intent: 'local_commercial', keywordCluster: ['almonds wholesale dubai', 'bulk almonds dubai supplier'],                 demandScore: 60, commercialScore: 85, supplyScore: 50, sitemapGroup: 'locations' },
  { business: 'business', slug: '/cashews-wholesale/mumbai',          pageType: 'location', intent: 'local_commercial', keywordCluster: ['cashews wholesale mumbai', 'bulk cashews mumbai'],                        demandScore: 70, commercialScore: 88, supplyScore: 70, sitemapGroup: 'locations' },
  { business: 'business', slug: '/makhana-wholesale/patna',           pageType: 'location', intent: 'local_commercial', keywordCluster: ['makhana wholesale patna', 'lotus seeds bulk patna'],                      demandScore: 75, commercialScore: 90, supplyScore: 85, sitemapGroup: 'locations' },

  // ── GIFTING (gifting.nutytales.com) ─────────────────────────────────────
  { business: 'gifting', slug: '/corporate-gifts',                    pageType: 'hub',      intent: 'commercial',      keywordCluster: ['corporate gifts india', 'corporate gifting', 'bulk corporate gifts'],       demandScore: 88, commercialScore: 90, supplyScore: 85, sitemapGroup: 'corporate' },
  { business: 'gifting', slug: '/corporate-gifts/diwali',             pageType: 'occasion', intent: 'transactional',   keywordCluster: ['diwali corporate gifts', 'diwali gifts for employees', 'diwali hampers'],   demandScore: 92, commercialScore: 95, supplyScore: 85, sitemapGroup: 'occasions' },
  { business: 'gifting', slug: '/corporate-gifts/diwali/dubai',       pageType: 'location', intent: 'transactional',   keywordCluster: ['diwali gifts dubai', 'corporate diwali gifts dubai delivery'],              demandScore: 70, commercialScore: 88, supplyScore: 60, sitemapGroup: 'locations' },
  { business: 'gifting', slug: '/corporate-gifts/diwali/mumbai',      pageType: 'location', intent: 'transactional',   keywordCluster: ['diwali corporate gifts mumbai', 'diwali hampers mumbai'],                   demandScore: 80, commercialScore: 90, supplyScore: 80, sitemapGroup: 'locations' },
  { business: 'gifting', slug: '/corporate-gifts/diwali/london',      pageType: 'location', intent: 'transactional',   keywordCluster: ['diwali gifts london', 'indian corporate gifts uk'],                        demandScore: 55, commercialScore: 78, supplyScore: 50, sitemapGroup: 'locations' },
  { business: 'gifting', slug: '/employee-welcome-gifts',             pageType: 'occasion', intent: 'b2b_procurement', keywordCluster: ['employee welcome gifts', 'new joinee gift', 'onboarding gifts'],           demandScore: 65, commercialScore: 85, supplyScore: 80, sitemapGroup: 'corporate' },
  { business: 'gifting', slug: '/client-gifts',                       pageType: 'occasion', intent: 'b2b_procurement', keywordCluster: ['client gifts india', 'corporate client gifting', 'b2b client gifts'],      demandScore: 70, commercialScore: 87, supplyScore: 82, sitemapGroup: 'corporate' },
  { business: 'gifting', slug: '/executive-gifts',                    pageType: 'occasion', intent: 'transactional',   keywordCluster: ['executive gifts premium', 'luxury corporate gifts india'],                  demandScore: 60, commercialScore: 85, supplyScore: 80, sitemapGroup: 'corporate' },
  { business: 'gifting', slug: '/wedding-return-gifts',               pageType: 'occasion', intent: 'transactional',   keywordCluster: ['wedding return gifts', 'wedding favours india', 'shaadi return gifts'],     demandScore: 80, commercialScore: 88, supplyScore: 85, sitemapGroup: 'occasions' },
  { business: 'gifting', slug: '/wedding-gifts/kashmir',              pageType: 'location', intent: 'transactional',   keywordCluster: ['wedding gifts kashmir', 'kashmiri wedding hampers'],                       demandScore: 55, commercialScore: 80, supplyScore: 82, sitemapGroup: 'locations' },

  // ── WEDDINGS (weddings.nutytales.com) ───────────────────────────────────
  { business: 'weddings', slug: '/destination-weddings',              pageType: 'hub',      intent: 'commercial',      keywordCluster: ['destination wedding india', 'destination wedding planning'],                demandScore: 82, commercialScore: 88, supplyScore: 75, sitemapGroup: 'destinations' },
  { business: 'weddings', slug: '/destination-weddings/kashmir',      pageType: 'destination', intent: 'transactional', keywordCluster: ['kashmir destination wedding', 'wedding in kashmir', 'kashmir wedding venue'], demandScore: 85, commercialScore: 90, supplyScore: 78, sitemapGroup: 'destinations' },
  { business: 'weddings', slug: '/destination-weddings/dubai',        pageType: 'destination', intent: 'transactional', keywordCluster: ['destination wedding dubai', 'indian wedding dubai', 'wedding planner dubai'], demandScore: 72, commercialScore: 87, supplyScore: 50, sitemapGroup: 'destinations' },
  { business: 'weddings', slug: '/wedding-planners/kashmir',          pageType: 'service',  intent: 'lead_generation', keywordCluster: ['wedding planners kashmir', 'kashmir wedding planner', 'srinagar wedding'],   demandScore: 80, commercialScore: 88, supplyScore: 78, sitemapGroup: 'planners' },
  { business: 'weddings', slug: '/wedding-venues/kashmir',            pageType: 'service',  intent: 'commercial',      keywordCluster: ['wedding venues kashmir', 'best wedding venues srinagar', 'dal lake wedding'], demandScore: 78, commercialScore: 85, supplyScore: 75, sitemapGroup: 'venues' },
  { business: 'weddings', slug: '/wedding-catering/kashmir',          pageType: 'service',  intent: 'lead_generation', keywordCluster: ['wedding catering kashmir', 'wazwan wedding catering', 'kashmiri wedding food'], demandScore: 65, commercialScore: 82, supplyScore: 70, sitemapGroup: 'services' },
  { business: 'weddings', slug: '/wedding-gifts/kashmir',             pageType: 'occasion', intent: 'transactional',   keywordCluster: ['wedding gifts kashmir', 'kashmiri dry fruit wedding hamper'],               demandScore: 62, commercialScore: 84, supplyScore: 85, sitemapGroup: 'occasions' },

  // ── CRAFTS (crafts.nutytales.com) ────────────────────────────────────────
  { business: 'crafts', slug: '/pashmina-shawls',                     pageType: 'hub',      intent: 'commercial',      keywordCluster: ['pashmina shawls', 'kashmiri pashmina', 'buy pashmina shawl online'],         demandScore: 88, commercialScore: 85, supplyScore: 90, sitemapGroup: 'products' },
  { business: 'crafts', slug: '/kani-shawls',                         pageType: 'product',  intent: 'transactional',   keywordCluster: ['kani shawl', 'handwoven kani pashmina', 'kani weave kashmir'],               demandScore: 72, commercialScore: 82, supplyScore: 88, sitemapGroup: 'products' },
  { business: 'crafts', slug: '/sozni-shawls',                        pageType: 'product',  intent: 'transactional',   keywordCluster: ['sozni shawl', 'sozni embroidery', 'kashmiri sozni'],                        demandScore: 65, commercialScore: 80, supplyScore: 85, sitemapGroup: 'products' },
  { business: 'crafts', slug: '/kashmir-crafts',                      pageType: 'hub',      intent: 'commercial',      keywordCluster: ['kashmir handicrafts', 'kashmiri crafts', 'buy kashmir crafts online'],       demandScore: 85, commercialScore: 83, supplyScore: 90, sitemapGroup: 'categories' },
  { business: 'crafts', slug: '/kashmir-crafts/dubai',                pageType: 'location', intent: 'local_commercial', keywordCluster: ['kashmir crafts dubai', 'kashmiri shawls dubai', 'buy pashmina dubai'],     demandScore: 58, commercialScore: 80, supplyScore: 70, sitemapGroup: 'locations' },

  // ── STAYS (stays.nutytales.com) ──────────────────────────────────────────
  { business: 'stays', slug: '/stays/kashmir',                        pageType: 'destination', intent: 'commercial',  keywordCluster: ['kashmir stays', 'places to stay in kashmir', 'best hotels kashmir'],          demandScore: 87, commercialScore: 88, supplyScore: 82, sitemapGroup: 'destinations' },
  { business: 'stays', slug: '/hotels/srinagar',                      pageType: 'destination', intent: 'transactional', keywordCluster: ['hotels in srinagar', 'srinagar hotels', 'best hotel srinagar'],            demandScore: 92, commercialScore: 90, supplyScore: 80, sitemapGroup: 'properties' },
  { business: 'stays', slug: '/hotels/gulmarg',                       pageType: 'destination', intent: 'transactional', keywordCluster: ['gulmarg hotels', 'hotels near gulmarg', 'gulmarg stay'],                   demandScore: 80, commercialScore: 88, supplyScore: 78, sitemapGroup: 'properties' },
  { business: 'stays', slug: '/boutique-stays/kashmir',               pageType: 'category', intent: 'commercial',      keywordCluster: ['boutique hotels kashmir', 'boutique stays srinagar', 'unique stays kashmir'], demandScore: 72, commercialScore: 85, supplyScore: 78, sitemapGroup: 'destinations' },
  { business: 'stays', slug: '/luxury-stays/kashmir',                 pageType: 'category', intent: 'transactional',   keywordCluster: ['luxury stays kashmir', 'luxury hotels kashmir', 'premium kashmir resort'],   demandScore: 68, commercialScore: 87, supplyScore: 75, sitemapGroup: 'destinations' },
  { business: 'stays', slug: '/family-stays/srinagar',                pageType: 'audience', intent: 'transactional',   keywordCluster: ['family hotels srinagar', 'family stay kashmir', 'kashmir family packages'],  demandScore: 75, commercialScore: 86, supplyScore: 78, sitemapGroup: 'destinations' },

  // ── TRAVEL (travel.nutytales.com) ────────────────────────────────────────
  { business: 'travel', slug: '/travel/kashmir',                      pageType: 'destination', intent: 'commercial',  keywordCluster: ['kashmir travel', 'kashmir tourism', 'visit kashmir', 'kashmir packages'],      demandScore: 95, commercialScore: 90, supplyScore: 88, sitemapGroup: 'destinations' },
  { business: 'travel', slug: '/travel/kashmir/7-days',               pageType: 'package',  intent: 'transactional',   keywordCluster: ['kashmir 7 day trip', '7 days kashmir package', 'one week kashmir tour'],      demandScore: 88, commercialScore: 88, supplyScore: 88, sitemapGroup: 'trips' },
  { business: 'travel', slug: '/travel/kashmir/5-days',               pageType: 'package',  intent: 'transactional',   keywordCluster: ['kashmir 5 day trip', '5 days kashmir package', 'kashmir 5 day tour'],         demandScore: 85, commercialScore: 87, supplyScore: 88, sitemapGroup: 'trips' },
  { business: 'travel', slug: '/travel/kashmir/family',               pageType: 'audience', intent: 'transactional',   keywordCluster: ['kashmir family trip', 'kashmir family package', 'kashmir with family'],        demandScore: 87, commercialScore: 88, supplyScore: 87, sitemapGroup: 'trips' },
  { business: 'travel', slug: '/travel/kashmir/honeymoon',            pageType: 'audience', intent: 'transactional',   keywordCluster: ['kashmir honeymoon package', 'honeymoon in kashmir', 'kashmir couple trip'],    demandScore: 90, commercialScore: 90, supplyScore: 87, sitemapGroup: 'trips' },
  { business: 'travel', slug: '/travel/kashmir/luxury',               pageType: 'category', intent: 'transactional',   keywordCluster: ['luxury kashmir tour', 'premium kashmir travel', 'luxury kashmir package'],     demandScore: 72, commercialScore: 90, supplyScore: 80, sitemapGroup: 'trips' },
  { business: 'travel', slug: '/travel/kashmir/winter',               pageType: 'audience', intent: 'commercial',      keywordCluster: ['kashmir winter trip', 'kashmir in winter', 'gulmarg snow trip'],               demandScore: 82, commercialScore: 87, supplyScore: 86, sitemapGroup: 'trips' },
  { business: 'travel', slug: '/travel/italy',                        pageType: 'destination', intent: 'commercial',   keywordCluster: ['italy travel package india', 'italy holiday indian tourists'],               demandScore: 40, commercialScore: 65, supplyScore: 30, sitemapGroup: 'destinations' },
  { business: 'travel', slug: '/travel/dubai',                        pageType: 'destination', intent: 'commercial',   keywordCluster: ['dubai travel package india', 'dubai holiday package'],                       demandScore: 45, commercialScore: 68, supplyScore: 30, sitemapGroup: 'destinations' },
];
