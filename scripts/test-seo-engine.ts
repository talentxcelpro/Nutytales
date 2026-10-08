/**
 * Nutty Tales Global SEO & Demand Engine — Comprehensive Verification Test Suite
 *
 * Runs automated tests across:
 * - 1. Indexation Governor Gate (Quality scoring, hard blockers, sitemap tiers)
 * - 2. Search Demand Engine (Query normalization, intent classification, supply gaps)
 * - 3. Geo Entity Hierarchy & Eligibility
 * - 4. Metadata Engine & Structured Data (JSON-LD validation)
 * - 5. Independent Sitemaps Generation & Sharding (All 7 properties)
 * - 6. Internal Linking Graph & Breadcrumbs
 * - 7. Revenue Attribution & Dual-Touch Models
 * - 8. Live Candidate Pool & Governor Telemetry
 */

import {
  computeQualityScore,
  runIndexationGovernor,
  summarizeBatch,
  determineSitemapTier,
} from '../src/lib/seo/governor';
import {
  normalizeQuery,
  classifyIntent,
  classifyBusiness,
  createDemandSignal,
  detectSupplyGaps,
  signalToCandidate,
} from '../src/lib/seo/demand';
import {
  getGeoBySlug,
  getEligibleCities,
  getGeoHierarchy,
} from '../src/lib/seo/geo';
import {
  generatePageMetadata,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildProductSchema,
  buildLocalBusinessSchema,
  buildLodgingSchema,
} from '../src/lib/seo/metadata';
import {
  buildRootCoreSitemap,
  shardSitemap,
} from '../src/lib/seo/sitemap';
import {
  getCrossBizLinks,
  buildBreadcrumbs,
} from '../src/lib/seo/links';
import {
  generateSeoPageId,
  buildWhatsappLink,
  buildEmptyKpiSnapshot,
} from '../src/lib/seo/revenue';
import {
  buildAllCandidates,
  getSeoEngineTelemetry,
} from '../src/lib/seo/engine';
import type { SeoPageCandidate } from '../src/lib/seo/types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✕ FAIL: ${testName}`);
    if (details) console.error(`    Details: ${details}`);
  }
}

console.log('\n============================================================');
console.log('NUTTY TALES SEO & DEMAND ENGINE — VERIFICATION SUITE');
console.log('============================================================\n');

// ─────────────────────────────────────────────────────────────────────────────
// TEST 1: INDEXATION GOVERNOR
// ─────────────────────────────────────────────────────────────────────────────
console.log('[1/8] Testing Indexation Governor & Quality Gate...');

const highQualityCandidate: SeoPageCandidate = {
  id: 'cand-test-1',
  business: 'business',
  pageType: 'product',
  intentType: 'b2b_procurement',
  keywordCluster: ['wholesale almonds noida'],
  slug: '/wholesale-dry-fruits/noida',
  canonicalUrl: 'https://business.nutytales.com/wholesale-dry-fruits/noida',
  demandScore: 85,
  commercialScore: 90,
  supplyScore: 90,
  dataQualityScore: 90,
  uniquenessScore: 85,
  conversionScore: 88,
  freshnessScore: 90,
  trustScore: 90,
  internalLinkScore: 80,
  duplicationRisk: 5,
  thinContentRisk: 5,
  spamRisk: 2,
  qualityScore: 0,
  revenueScore: 90,
  status: 'candidate',
  robotsDirective: 'noindex,nofollow',
  sitemapTier: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const score = computeQualityScore(highQualityCandidate);
assert(score >= 80, `High quality candidate receives score >= 80 (Actual: ${score})`);

const decision = runIndexationGovernor(highQualityCandidate);
assert(decision.approved === true, 'Governor approves high quality page for indexation');
assert(decision.status === 'indexable', 'Status set to indexable');
assert(decision.robotsDirective === 'index,follow', 'Robots directive set to index,follow');
assert(decision.inSitemap === true, 'Page approved for inclusion in sitemap');

// Hard Blocker: Fake supply
const zeroSupplyCandidate: SeoPageCandidate = {
  ...highQualityCandidate,
  id: 'cand-test-fake',
  supplyScore: 5, // No real supply
  commercialScore: 85,
};
const fakeSupplyDecision = runIndexationGovernor(zeroSupplyCandidate);
assert(fakeSupplyDecision.approved === false, 'Hard Blocker: Governor rejects page with zero real supply');
assert(fakeSupplyDecision.status === 'blocked', 'Status set to blocked');
assert(fakeSupplyDecision.blockers.length > 0, 'Governor returns clear explanation blocker');

// Hard Blocker: Spam combination
const spamCandidate: SeoPageCandidate = {
  ...highQualityCandidate,
  id: 'cand-test-spam',
  spamRisk: 85, // High programmatic spam risk
};
const spamDecision = runIndexationGovernor(spamCandidate);
assert(spamDecision.approved === false, 'Hard Blocker: Governor rejects programmatic spam');

// Sitemap Tiering
assert(determineSitemapTier(highQualityCandidate) === 1, 'High commercial intent assigned Tier 1');


// ─────────────────────────────────────────────────────────────────────────────
// TEST 2: DEMAND INTELLIGENCE ENGINE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[2/8] Testing Demand Intelligence Engine...');

const normalized = normalizeQuery('  Buy Wholesale Dry Fruits In Delhi  ');
assert(normalized === 'buy wholesale dry fruits delhi', `Query normalization cleans whitespace & stop words (Got: "${normalized}")`);

const b2bIntent = classifyIntent('wholesale almonds bulk supplier');
assert(b2bIntent.intent === 'b2b_procurement', 'Correctly classifies B2B procurement intent');
assert(b2bIntent.commercialBoost === 30, 'Applies commercial boost for wholesale intent');

const weddingBiz = classifyBusiness('destination wedding venues in kashmir');
assert(weddingBiz === 'weddings', 'Correctly routes to weddings business');

const travelBiz = classifyBusiness('kashmir 7 days family holiday trip');
assert(travelBiz === 'travel', 'Correctly routes to travel business');

// Supply Gap Detection
const testSignals = [
  createDemandSignal({ query: 'corporate gifts dubai', frequency: 50, existingPageId: undefined }),
  createDemandSignal({ query: 'wholesale almonds noida', frequency: 80, existingPageId: 'page-1', existingPageQuality: 88 }),
];
const gaps = detectSupplyGaps(testSignals, { minDemandFrequency: 10, minCommercialScore: 50 });
assert(gaps.length === 1, `Detects exact supply gap (Found: ${gaps.length})`);
assert(gaps[0].query === 'corporate gifts dubai', 'Correctly identifies missing supply opportunity');


// ─────────────────────────────────────────────────────────────────────────────
// TEST 3: GEO ENTITY ENGINE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[3/8] Testing Geo Entity Hierarchy & Eligibility...');

const srinagar = getGeoBySlug('srinagar');
assert(srinagar !== undefined && srinagar.name === 'Srinagar', 'Resolves Srinagar geo entity');
assert(srinagar?.hasSupply === true && srinagar?.hasDemand === true, 'Srinagar has verified supply and demand');

const eligibleCities = getEligibleCities();
assert(eligibleCities.length >= 4, `At least 4 launched cities with supply & demand (Found: ${eligibleCities.length})`);

const hierarchy = getGeoHierarchy('geo-srg');
assert(hierarchy.length === 3, 'Calculates 3-level geo hierarchy (Country -> State -> City)');
assert(hierarchy[0].slug === 'india', 'Hierarchy root is India');


// ─────────────────────────────────────────────────────────────────────────────
// TEST 4: METADATA & STRUCTURED DATA (JSON-LD)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[4/8] Testing Metadata & Structured Data Schema Builders...');

const meta = generatePageMetadata({
  business: 'business',
  pageType: 'location',
  intentType: 'local_commercial',
  slug: '/wholesale-dry-fruits/noida',
  primaryKeyword: 'Wholesale Dry Fruits in Noida',
  location: 'Noida',
});

assert(Boolean(meta.title?.toString().includes('Wholesale Dry Fruits in Noida')), 'Meta title contains intent keyword & location');
assert(meta.alternates?.canonical === 'https://business.nutytales.com/wholesale-dry-fruits/noida', 'Canonical URL matches business domain');

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: 'Home', url: 'https://nutytales.com' },
  { name: 'Wholesale', url: 'https://nutytales.com/wholesale-dry-fruits' },
]);
assert(breadcrumbSchema['@type'] === 'BreadcrumbList', 'Generates valid BreadcrumbList schema');
assert(breadcrumbSchema.itemListElement.length === 2, 'BreadcrumbList contains exact item count');

const productSchema = buildProductSchema({
  name: 'California Almonds 1kg',
  description: 'Premium quality nonpareil almonds',
  image: 'https://nutytales.com/images/almonds-pouch-250g.jpg',
  priceCurrency: 'INR',
  price: 1250,
  availability: 'InStock',
  url: 'https://nutytales.com/shop/california-almonds',
  reviewCount: 42,
  ratingValue: 4.8,
});
assert(productSchema['@type'] === 'Product', 'Generates valid Product schema');
assert((productSchema.offers as any).price === '850', 'Product schema carries exact verified price');
assert(productSchema.aggregateRating !== undefined, 'Includes AggregateRating only when real verified reviews exist');

const lodgingSchema = buildLodgingSchema({
  name: 'Harwan Orchard Estate',
  url: 'https://stays.nutytales.com/stays/harwan-orchard-estate',
  description: 'Luxury walnut orchard estate in Srinagar',
  image: 'https://stays.nutytales.com/image.jpg',
  addressLocality: 'Srinagar',
  addressCountry: 'IN',
  priceRange: '₹45,000/night',
  reviewCount: 128,
  ratingValue: 4.98,
});
assert(lodgingSchema['@type'] === 'LodgingBusiness', 'Generates valid LodgingBusiness schema for stays');


// ─────────────────────────────────────────────────────────────────────────────
// TEST 5: SITEMAP ARCHITECTURE & SHARDING
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[5/8] Testing Scalable Sitemap Architecture...');

const coreSitemap = buildRootCoreSitemap();
assert(coreSitemap.length >= 25, `Root core sitemap contains essential Tier 1 & Tier 2 URLs (Count: ${coreSitemap.length})`);
assert(coreSitemap.some((u) => u.url === 'https://nutytales.com/wholesale-dry-fruits'), 'Includes B2B wholesale hub');
assert(coreSitemap.some((u) => u.url === 'https://nutytales.com/travel/kashmir/7-days'), 'Includes Kashmir 7-days travel package');

// Sharding verification
const mockCandidates: SeoPageCandidate[] = Array.from({ length: 120 }, (_, i) => ({
  ...highQualityCandidate,
  id: `cand-shard-${i}`,
  canonicalUrl: `https://business.nutytales.com/page-${i}`,
}));
const shards = shardSitemap(mockCandidates, 50);
assert(shards.length === 3, `Sharding creates exact number of shards (Expected 3 for 120 items at 50/shard, Got: ${shards.length})`);
assert(shards[0].length === 50, 'Shard 1 contains exactly 50 URLs');
assert(shards[2].length === 20, 'Shard 3 contains remainder 20 URLs');


// ─────────────────────────────────────────────────────────────────────────────
// TEST 6: INTERNAL LINKING GRAPH
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[6/8] Testing Internal Linking Graph...');

const crossLinks = getCrossBizLinks('/travel/kashmir');
assert(crossLinks.length >= 4, `Kashmir travel links across to Stays, Crafts, Gifting, Weddings (Count: ${crossLinks.length})`);
assert(crossLinks.some((l) => l.business === 'stays'), 'Travel links to stays vertical');
assert(crossLinks.some((l) => l.business === 'crafts'), 'Travel links to crafts vertical');

const breadcrumbs = buildBreadcrumbs('travel', '7-Day Kashmir Tour', [
  { label: 'Kashmir', href: 'https://travel.nutytales.com/travel/kashmir' },
]);
assert(breadcrumbs.length === 4, 'Breadcrumb chain traverses Root -> Business Hub -> Category -> Page');


// ─────────────────────────────────────────────────────────────────────────────
// TEST 7: REVENUE ATTRIBUTION ENGINE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[7/8] Testing Revenue Attribution & Tracking...');

const pageId = generateSeoPageId('https://travel.nutytales.com/travel/kashmir/7-days');
assert(pageId.startsWith('travel-travel-kashmir-7-days'), `Generates deterministic SEO page ID (Got: ${pageId})`);

const waLink = buildWhatsappLink({ business: 'business', pageContext: 'wholesale cashews 500kg', location: 'Noida' });
assert(waLink.includes('wa.me'), 'Generates valid WhatsApp link');
assert(decodeURIComponent(waLink).includes('wholesale cashews 500kg'), 'WhatsApp message contains page context & volume');

const kpiSnapshot = buildEmptyKpiSnapshot('business', new Date(), new Date());
assert(kpiSnapshot.organicRevenue === 0, 'Initializes clean KPI snapshot');
assert(kpiSnapshot.diagnosticUrlCount === 0, 'URL count marked as diagnostic, not success KPI');


// ─────────────────────────────────────────────────────────────────────────────
// TEST 8: LIVE ENGINE TELEMETRY & CANDIDATE COMPILATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[8/8] Testing Live Engine Telemetry across all 7 Properties...');

const allCandidates = buildAllCandidates();
assert(allCandidates.length >= 60, `Candidate database successfully compiled from all 6 verticals (Total: ${allCandidates.length})`);

const telemetry = getSeoEngineTelemetry();
assert(telemetry.overallStats.totalCandidates > 0, 'Telemetry calculates candidate pool');
assert(telemetry.overallStats.totalIndexable > 0, 'Telemetry identifies indexable URLs');
assert(telemetry.overallStats.totalVerifiedCatalogEntities >= 40, `Verifies real supply entities (Count: ${telemetry.overallStats.totalVerifiedCatalogEntities})`);

console.log('\n------------------------------------------------------------');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('------------------------------------------------------------\n');

if (passedTests === totalTests) {
  console.log('✅ ALL SEO ENGINE TECHNICAL CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
