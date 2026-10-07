/**
 * Nutty Tales Global SEO Infrastructure — Core Type Definitions
 *
 * This module defines the shared type system used across the entire SEO
 * demand engine, indexation governor, page quality scorer, sitemap
 * architecture, revenue attribution layer, and entity graph.
 *
 * Architecture rule: NO page is created purely for URL count.
 * Every type here reflects a business, commercial, or user-value dimension.
 */

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS IDENTITY
// ─────────────────────────────────────────────────────────────────────────────

export type NutyBusiness =
  | 'root'       // nutytales.com
  | 'business'   // business.nutytales.com (wholesale / B2B procurement)
  | 'gifting'    // gifting.nutytales.com
  | 'weddings'   // weddings.nutytales.com
  | 'crafts'     // crafts.nutytales.com
  | 'stays'      // stays.nutytales.com
  | 'travel';    // travel.nutytales.com

export const BUSINESS_DOMAINS: Record<NutyBusiness, string> = {
  root:     'https://nutytales.com',
  business: 'https://business.nutytales.com',
  gifting:  'https://gifting.nutytales.com',
  weddings: 'https://weddings.nutytales.com',
  crafts:   'https://crafts.nutytales.com',
  stays:    'https://stays.nutytales.com',
  travel:   'https://travel.nutytales.com',
};

// ─────────────────────────────────────────────────────────────────────────────
// SEO PAGE CANDIDATE STATUS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Every SEO page moves through a governed state machine.
 * Pages are never blindly published — they must pass the governor.
 */
export type SeoPageStatus =
  | 'candidate'    // Identified opportunity; not yet qualified
  | 'qualified'    // Passed demand + intent checks; ready for content creation
  | 'draft'        // Content generated but not reviewed
  | 'published'    // Live on site; may be noindex
  | 'indexable'    // Live + passes quality threshold; in sitemap
  | 'noindex'      // Published but intentionally noindex
  | 'deprecated'   // Page removed / replaced
  | 'redirected'   // 301 redirect in place
  | 'blocked';     // Blocked by governor (thin/no supply/duplicate)

// ─────────────────────────────────────────────────────────────────────────────
// INTENT TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type SeoIntentType =
  | 'transactional'      // Ready to buy / book / order
  | 'commercial'         // Researching, comparing, considering
  | 'informational'      // Learning, understanding
  | 'navigational'       // Looking for a specific brand/page
  | 'local_commercial'   // Want X near me / in Y city
  | 'b2b_procurement'    // Wholesale, bulk, supplier
  | 'rfq'                // Request for quotation
  | 'lead_generation';   // Enquiry-based

// ─────────────────────────────────────────────────────────────────────────────
// PAGE TYPE
// ─────────────────────────────────────────────────────────────────────────────

export type SeoPageType =
  | 'hub'                // Top-level category / business hub
  | 'category'           // Product or service category
  | 'subcategory'        // Sub-category
  | 'product'            // Individual purchasable product
  | 'service'            // Service offering page
  | 'destination'        // Geographic destination (travel/stays)
  | 'location'           // City / region commercial page
  | 'occasion'           // Occasion-based (Diwali gifts, wedding gifts)
  | 'audience'           // Audience-based (hotels, bakeries, corporates)
  | 'supplier'           // Supplier profile
  | 'property'           // Stay property
  | 'experience'         // Travel experience
  | 'package'            // Travel / wedding package
  | 'guide'              // Buyer/destination guide (high-quality informational)
  | 'comparison'         // Comparison page
  | 'faq_hub'            // FAQ aggregation page
  | 'vendor'             // Wedding vendor profile
  | 'craft'              // Craft / artisan product page
  | 'corporate';         // B2B / corporate commercial page

// ─────────────────────────────────────────────────────────────────────────────
// SEO PAGE CANDIDATE — CORE DATA MODEL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A candidate is an SEO page opportunity that has been identified but may not
 * yet be published. The system maintains millions of candidates and publishes
 * only those that pass quality scoring.
 */
export interface SeoPageCandidate {
  id: string;
  business: NutyBusiness;
  pageType: SeoPageType;
  intentType: SeoIntentType;
  keywordCluster: string[];      // Primary keyword + variants
  slug: string;                  // URL path (without domain)
  canonicalUrl: string;          // Full canonical URL
  country?: string;              // ISO 3166-1 alpha-2
  region?: string;               // State / province
  city?: string;
  locationId?: string;           // Reference to geo entity
  categoryId?: string;
  productId?: string;
  serviceId?: string;
  occasion?: string;
  audience?: string;
  attributes?: Record<string, string>; // craft type, duration, budget etc.
  // Quality Scores (0–100)
  demandScore: number;
  commercialScore: number;
  supplyScore: number;
  dataQualityScore: number;
  uniquenessScore: number;
  conversionScore: number;
  freshnessScore: number;
  trustScore: number;
  internalLinkScore: number;
  // Negative factors (0–100, higher = more risk)
  duplicationRisk: number;
  thinContentRisk: number;
  spamRisk: number;
  // Computed
  qualityScore: number;          // Weighted composite
  revenueScore: number;
  status: SeoPageStatus;
  robotsDirective: RobotsDirective;
  sitemapGroup?: string;         // Which sitemap shard
  sitemapTier: SitemapTier;
  createdAt: Date;
  updatedAt: Date;
  lastEvaluatedAt?: Date;
  publishedAt?: Date;
  deprecatedAt?: Date;
  lastmod?: Date;                // For sitemap lastmod
}

// ─────────────────────────────────────────────────────────────────────────────
// FULL SEO PAGE DATA MODEL
// ─────────────────────────────────────────────────────────────────────────────

export interface SeoPage extends SeoPageCandidate {
  // Content
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  contentBlocks: ContentBlock[];
  faqBlocks: FaqBlock[];
  // Entities
  primaryEntity?: EntityReference;
  secondaryEntities?: EntityReference[];
  // Location
  language: string;              // BCP 47 e.g. 'en', 'hi', 'ar'
  currency?: string;             // ISO 4217 e.g. 'INR', 'USD', 'AED'
  // Media
  heroImage?: string;
  // Commerce
  commercialCta: CommercialCta;
  // Supply / Data
  supplierData?: SupplierReference[];
  productData?: ProductReference[];
  serviceData?: ServiceReference[];
  availabilityData?: AvailabilityInfo;
  priceData?: PriceInfo;
  reviewData?: ReviewInfo;
  // Navigation
  breadcrumbs: Breadcrumb[];
  relatedPages: RelatedPage[];
  // SEO Technical
  schemaData: SchemaBlock[];
  openGraph: OpenGraphMeta;
  // Hreflang
  hreflangAlternates?: HreflangEntry[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT BLOCKS
// ─────────────────────────────────────────────────────────────────────────────

export type ContentBlockType =
  | 'intro'
  | 'product_grid'
  | 'service_list'
  | 'supplier_profile'
  | 'destination_info'
  | 'location_guide'
  | 'price_table'
  | 'comparison'
  | 'buyer_guide'
  | 'availability'
  | 'trust_signals'
  | 'related_products'
  | 'nearby_locations'
  | 'seasonal_info'
  | 'operational_info'
  | 'cta_block'
  | 'gallery';

export interface ContentBlock {
  type: ContentBlockType;
  heading?: string;
  content: string;            // Server-rendered, real content only
  data?: Record<string, unknown>;
  lastVerifiedAt?: Date;
}

export interface FaqBlock {
  question: string;
  answer: string;
  schema: boolean;            // Whether to include in FAQPage schema
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTITY GRAPH
// ─────────────────────────────────────────────────────────────────────────────

export type EntityType =
  | 'country'
  | 'state'
  | 'region'
  | 'city'
  | 'neighbourhood'
  | 'destination'
  | 'hotel'
  | 'property'
  | 'vacation_rental'
  | 'supplier'
  | 'product'
  | 'service'
  | 'experience'
  | 'wedding_venue'
  | 'wedding_planner'
  | 'craft'
  | 'artisan'
  | 'gift'
  | 'business_category'
  | 'occasion'
  | 'travel_style'
  | 'audience'
  | 'industry';

export type EntityRelationship =
  | 'located_in'
  | 'near'
  | 'offers'
  | 'supplies'
  | 'serves'
  | 'available_in'
  | 'belongs_to'
  | 'similar_to'
  | 'related_to'
  | 'suitable_for'
  | 'bookable_at'
  | 'delivers_to'
  | 'partners_with';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  slug: string;
  parentId?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  metadata?: Record<string, unknown>;
  isActive: boolean;
}

export interface EntityReference {
  entityId: string;
  entityType: EntityType;
  name: string;
  slug: string;
}

export interface EntityRelation {
  fromEntityId: string;
  toEntityId: string;
  relationship: EntityRelationship;
  weight?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMERCIAL / CONVERSION
// ─────────────────────────────────────────────────────────────────────────────

export type CtaType =
  | 'get_quote'
  | 'request_rfq'
  | 'book_now'
  | 'check_availability'
  | 'design_gift'
  | 'plan_wedding'
  | 'build_trip'
  | 'shop_now'
  | 'request_sourcing'
  | 'contact_us'
  | 'whatsapp'
  | 'call'
  | 'create_account'
  | 'find_supplier'
  | 'request_sample';

export interface CommercialCta {
  primary: {
    type: CtaType;
    label: string;
    href: string;
    isAboveFold: boolean;
  };
  secondary?: {
    type: CtaType;
    label: string;
    href: string;
  };
  whatsappFallback?: string;    // WhatsApp pre-filled message link
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPLY / DATA REFERENCES
// ─────────────────────────────────────────────────────────────────────────────

export interface SupplierReference {
  supplierId: string;
  name: string;
  verified: boolean;
  location?: string;
}

export interface ProductReference {
  productId: string;
  name: string;
  slug: string;
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'sourcing';
}

export interface ServiceReference {
  serviceId: string;
  name: string;
  slug: string;
  priceFrom?: number;
  currency?: string;
}

export interface AvailabilityInfo {
  hasRealAvailability: boolean;  // NEVER fake this
  availabilityNote?: string;
  checkAvailabilityUrl?: string;
  sourcingAvailable: boolean;    // If no supply, show sourcing CTA
}

export interface PriceInfo {
  hasRealPrices: boolean;        // NEVER fake this
  priceFrom?: number;
  priceTo?: number;
  currency?: string;
  priceNote?: string;
  lastVerifiedAt?: Date;
}

export interface ReviewInfo {
  hasRealReviews: boolean;       // NEVER fake this
  count?: number;
  averageRating?: number;        // Only if real, verified reviews exist
  lastReviewDate?: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

export interface Breadcrumb {
  label: string;
  href: string;
}

export interface RelatedPage {
  title: string;
  href: string;
  relationship: 'parent' | 'child' | 'sibling' | 'location' | 'cross_business';
}

// ─────────────────────────────────────────────────────────────────────────────
// METADATA / SEO TECHNICAL
// ─────────────────────────────────────────────────────────────────────────────

export type RobotsDirective =
  | 'index,follow'
  | 'noindex,follow'
  | 'noindex,nofollow'
  | 'index,nofollow';

export interface OpenGraphMeta {
  type: 'website' | 'product' | 'article';
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface HreflangEntry {
  hreflang: string;   // BCP 47 language tag
  href: string;       // Absolute URL of the equivalent page
}

// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURED DATA
// ─────────────────────────────────────────────────────────────────────────────

export type SchemaType =
  | 'Organization'
  | 'LocalBusiness'
  | 'Product'
  | 'Offer'
  | 'AggregateRating'
  | 'BreadcrumbList'
  | 'FAQPage'
  | 'Hotel'
  | 'LodgingBusiness'
  | 'VacationRental'
  | 'TouristTrip'
  | 'TouristAttraction'
  | 'Event'
  | 'Service'
  | 'WebSite'
  | 'WebPage';

export interface SchemaBlock {
  type: SchemaType;
  data: Record<string, unknown>;  // JSON-LD object — only real data
}

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tier 1 = highest commercial intent (most valuable URLs first)
 * Tier 5 = experimental / long-tail
 */
export type SitemapTier = 1 | 2 | 3 | 4 | 5;

export interface SitemapEntry {
  url: string;
  lastmod: Date;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;   // 0.0–1.0
  tier: SitemapTier;
  business: NutyBusiness;
  group: string;      // e.g. 'destinations', 'products', 'locations'
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE QUALITY GOVERNOR
// ─────────────────────────────────────────────────────────────────────────────

export interface QualityThresholds {
  indexThreshold: number;         // Default 80 → INDEX
  publishTestThreshold: number;   // Default 60 → PUBLISH/TEST
  internalOnlyThreshold: number;  // Default 40 → INTERNAL ONLY
  // Anything below internalOnlyThreshold → DO NOT CREATE
}

export const DEFAULT_QUALITY_THRESHOLDS: QualityThresholds = {
  indexThreshold: 80,
  publishTestThreshold: 60,
  internalOnlyThreshold: 40,
};

export interface GovernorDecision {
  approved: boolean;
  status: SeoPageStatus;
  robotsDirective: RobotsDirective;
  inSitemap: boolean;
  qualityScore: number;
  blockers: string[];   // Human-readable reasons if blocked
  warnings: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// DEMAND INTELLIGENCE
// ─────────────────────────────────────────────────────────────────────────────

export interface DemandSignal {
  id: string;
  query: string;
  normalizedQuery: string;
  intentType: SeoIntentType;
  business: NutyBusiness;
  country?: string;
  city?: string;
  productOrService?: string;
  frequency: number;
  commercialScore: number;
  conversionCount: number;
  revenueAttributed: number;
  existingPageId?: string;
  existingPageQuality?: number;
  supplyGap: boolean;            // True if demand exists but no supply
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplyGap {
  id: string;
  query: string;
  business: NutyBusiness;
  demandScore: number;
  country?: string;
  city?: string;
  description: string;
  status: 'open' | 'sourcing' | 'resolved';
  resolvedByPageId?: string;
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// REVENUE ATTRIBUTION
// ─────────────────────────────────────────────────────────────────────────────

export type ConversionType =
  | 'lead'
  | 'rfq'
  | 'order'
  | 'booking'
  | 'quote'
  | 'gifting_order'
  | 'wedding_enquiry'
  | 'travel_booking'
  | 'stay_booking'
  | 'whatsapp_enquiry'
  | 'phone_call'
  | 'account_creation';

export interface SeoConversion {
  id: string;
  firstTouchPageId?: string;
  lastTouchPageId?: string;
  sessionSource: string;
  queryCluster?: string;
  business: NutyBusiness;
  conversionType: ConversionType;
  revenue?: number;
  grossMargin?: number;
  currency: string;
  createdAt: Date;
}

// ─────────────────────────────────────────────────────────────────────────────
// GEO ENTITY (DATABASE-DRIVEN — never hardcoded)
// ─────────────────────────────────────────────────────────────────────────────

export interface GeoEntity {
  id: string;
  slug: string;
  name: string;
  nameLocal?: string;           // Name in local language
  type: 'country' | 'state' | 'region' | 'city' | 'district' | 'neighbourhood';
  country?: string;             // Country name or code
  region?: string;              // Sub-region identifier
  parentId?: string;
  isoCode?: string;             // ISO country/region code
  latitude?: number;
  longitude?: number;
  populationBand?: 'metro' | 'major' | 'mid' | 'small';
  // Business presence
  hasSupply: boolean;           // Do we have real supply here?
  hasDemand: boolean;           // Is there search demand?
  isLaunched: boolean;          // Is the geo page live?
  currencies: string[];         // Relevant currencies for this market
  languages: string[];          // Languages spoken
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL LINK GRAPH
// ─────────────────────────────────────────────────────────────────────────────

export interface InternalLink {
  fromPageId: string;
  fromSlug: string;
  toPageId: string;
  toSlug: string;
  anchorText: string;
  relationship: 'parent' | 'child' | 'sibling' | 'location' | 'cross_business' | 'product' | 'service';
  isDoFollow: boolean;
}
