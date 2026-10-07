/**
 * Nutty Tales Global SEO & Demand Engine — Master Coordinator
 *
 * This engine unifies:
 * 1. Demand signal ingestion & clustering
 * 2. Supply verification (honest checking, zero fake inventory)
 * 3. Indexation Governor evaluation
 * 4. Multi-business sitemap generation
 * 5. Revenue attribution & dual-touch conversion tracking
 * 6. Internal linking graph validation
 */

import type {
  NutyBusiness,
  SeoPageCandidate,
  GovernorDecision,
  DemandSignal,
  SupplyGap,
} from './types';
import { BUSINESS_DOMAINS } from './types';
import { runIndexationGovernor, summarizeBatch, BatchGovernorSummary } from './governor';
import { SEED_DEMAND_CLUSTERS, signalToCandidate, createDemandSignal, detectSupplyGaps } from './demand';
import { computeSitemapStats, buildRootCoreSitemap, SitemapStats } from './sitemap';
import { PRODUCTS } from '@/lib/products-data';
import { CRAFT_PRODUCTS } from '@/lib/crafts-data';
import { STAY_PROPERTIES } from '@/lib/stays-data';
import { KASHMIR_TRAVEL_PACKAGES } from '@/lib/travel-data';
import { INDUSTRIES } from '@/lib/business-supply-data';

export interface SeoEngineTelemetry {
  timestamp: Date;
  summary: BatchGovernorSummary;
  businessBreakdown: Record<NutyBusiness, {
    domain: string;
    candidates: number;
    published: number;
    indexable: number;
    noindex: number;
    blocked: number;
    sitemapUrls: number;
    supplyGaps: number;
  }>;
  overallStats: {
    totalCandidates: number;
    totalPublished: number;
    totalIndexable: number;
    totalSitemapUrls: number;
    totalVerifiedCatalogEntities: number;
    supplyGapsIdentified: number;
  };
}

/**
 * Compiles the live candidate database from seed clusters and verified catalog entities.
 */
export function buildAllCandidates(): SeoPageCandidate[] {
  const candidates: SeoPageCandidate[] = [];

  // 1. Process known high-intent demand clusters
  for (const item of SEED_DEMAND_CLUSTERS) {
    const signal = createDemandSignal({
      query: item.keywordCluster[0],
      frequency: item.demandScore,
    });

    const candidate = signalToCandidate(signal, item.pageType, item.slug, {
      supplyScore: item.supplyScore,
      dataQualityScore: item.supplyScore > 60 ? 85 : 45,
      uniquenessScore: 85,
      conversionScore: item.commercialScore,
      freshnessScore: 90,
      trustScore: 85,
      internalLinkScore: 80,
      thinContentRisk: item.supplyScore < 50 ? 55 : 10,
      duplicationRisk: 10,
      spamRisk: 5,
      revenueScore: item.commercialScore,
      sitemapGroup: item.sitemapGroup,
    });

    // Run governor to determine status & directive
    const decision = runIndexationGovernor(candidate);
    candidate.qualityScore = decision.qualityScore;
    candidate.status = decision.status;
    candidate.robotsDirective = decision.robotsDirective;

    candidates.push(candidate);
  }

  // 2. Verified Product Candidates (Wholesale / Retail)
  for (const product of PRODUCTS) {
    const signal = createDemandSignal({
      query: `buy ${product.name}`,
      frequency: 80,
    });

    const candidate = signalToCandidate(signal, 'product', `/shop/${product.slug}`, {
      supplyScore: 95,
      dataQualityScore: 95,
      uniquenessScore: 90,
      conversionScore: 90,
      freshnessScore: 90,
      trustScore: 95,
      internalLinkScore: 85,
      thinContentRisk: 5,
      duplicationRisk: 5,
      spamRisk: 2,
      revenueScore: 92,
      sitemapGroup: 'products',
    });

    const decision = runIndexationGovernor(candidate);
    candidate.qualityScore = decision.qualityScore;
    candidate.status = decision.status;
    candidate.robotsDirective = decision.robotsDirective;
    candidates.push(candidate);
  }

  // 3. Verified Craft Candidates
  for (const craft of CRAFT_PRODUCTS) {
    const signal = createDemandSignal({
      query: craft.name,
      frequency: 70,
    });

    const candidate = signalToCandidate(signal, 'craft', `/crafts/product/${craft.slug}`, {
      supplyScore: 90,
      dataQualityScore: 95,
      uniquenessScore: 95,
      conversionScore: 85,
      freshnessScore: 85,
      trustScore: 95,
      internalLinkScore: 80,
      thinContentRisk: 5,
      duplicationRisk: 5,
      spamRisk: 2,
      revenueScore: 88,
      sitemapGroup: 'products',
    });
    candidate.business = 'crafts';

    const decision = runIndexationGovernor(candidate);
    candidate.qualityScore = decision.qualityScore;
    candidate.status = decision.status;
    candidate.robotsDirective = decision.robotsDirective;
    candidates.push(candidate);
  }

  // 4. Verified Stay Candidates
  for (const stay of STAY_PROPERTIES) {
    const signal = createDemandSignal({
      query: `stay at ${stay.name}`,
      frequency: 75,
    });

    const candidate = signalToCandidate(signal, 'property', `/stays/${stay.slug}`, {
      supplyScore: 90,
      dataQualityScore: 90,
      uniquenessScore: 95,
      conversionScore: 90,
      freshnessScore: 85,
      trustScore: 90,
      internalLinkScore: 80,
      thinContentRisk: 5,
      duplicationRisk: 5,
      spamRisk: 2,
      revenueScore: 90,
      sitemapGroup: 'properties',
    });
    candidate.business = 'stays';

    const decision = runIndexationGovernor(candidate);
    candidate.qualityScore = decision.qualityScore;
    candidate.status = decision.status;
    candidate.robotsDirective = decision.robotsDirective;
    candidates.push(candidate);
  }

  // 5. Verified Travel Packages
  for (const pkg of KASHMIR_TRAVEL_PACKAGES) {
    const signal = createDemandSignal({
      query: pkg.title,
      frequency: 85,
    });

    const candidate = signalToCandidate(signal, 'package', `/travel/kashmir/${pkg.slug}`, {
      supplyScore: 90,
      dataQualityScore: 92,
      uniquenessScore: 92,
      conversionScore: 90,
      freshnessScore: 85,
      trustScore: 90,
      internalLinkScore: 85,
      thinContentRisk: 5,
      duplicationRisk: 5,
      spamRisk: 2,
      revenueScore: 92,
      sitemapGroup: 'trips',
    });
    candidate.business = 'travel';

    const decision = runIndexationGovernor(candidate);
    candidate.qualityScore = decision.qualityScore;
    candidate.status = decision.status;
    candidate.robotsDirective = decision.robotsDirective;
    candidates.push(candidate);
  }

  // 6. Verified B2B Industry Sectors
  for (const ind of INDUSTRIES) {
    const signal = createDemandSignal({
      query: `dry fruits for ${ind.name}`,
      frequency: 75,
    });

    const candidate = signalToCandidate(signal, 'audience', `/wholesale-dry-fruits/${ind.slug}`, {
      supplyScore: 85,
      dataQualityScore: 90,
      uniquenessScore: 90,
      conversionScore: 88,
      freshnessScore: 85,
      trustScore: 90,
      internalLinkScore: 80,
      thinContentRisk: 5,
      duplicationRisk: 5,
      spamRisk: 2,
      revenueScore: 88,
      sitemapGroup: 'industries',
    });
    candidate.business = 'business';

    const decision = runIndexationGovernor(candidate);
    candidate.qualityScore = decision.qualityScore;
    candidate.status = decision.status;
    candidate.robotsDirective = decision.robotsDirective;
    candidates.push(candidate);
  }

  return candidates;
}

/**
 * Returns complete system telemetry for all 6 businesses + root.
 */
export function getSeoEngineTelemetry(): SeoEngineTelemetry {
  const candidates = buildAllCandidates();
  const summary = summarizeBatch(candidates);

  const businesses: NutyBusiness[] = ['root', 'business', 'gifting', 'weddings', 'crafts', 'stays', 'travel'];
  const breakdown: SeoEngineTelemetry['businessBreakdown'] = {} as any;

  for (const biz of businesses) {
    const bizCandidates = candidates.filter((c) => c.business === biz);
    const published = bizCandidates.filter((c) => c.status === 'published' || c.status === 'indexable');
    const indexable = bizCandidates.filter((c) => c.status === 'indexable');
    const noindex   = bizCandidates.filter((c) => c.status === 'noindex');
    const blocked   = bizCandidates.filter((c) => c.status === 'blocked');
    const supplyGaps = bizCandidates.filter((c) => c.supplyScore < 40 && c.commercialScore > 60).length;

    breakdown[biz] = {
      domain: BUSINESS_DOMAINS[biz],
      candidates: bizCandidates.length,
      published: published.length,
      indexable: indexable.length,
      noindex: noindex.length,
      blocked: blocked.length,
      sitemapUrls: indexable.length,
      supplyGaps,
    };
  }

  const totalVerifiedCatalogEntities =
    PRODUCTS.length + CRAFT_PRODUCTS.length + STAY_PROPERTIES.length + KASHMIR_TRAVEL_PACKAGES.length + INDUSTRIES.length;

  return {
    timestamp: new Date(),
    summary,
    businessBreakdown: breakdown,
    overallStats: {
      totalCandidates: candidates.length,
      totalPublished: candidates.filter((c) => c.status === 'published' || c.status === 'indexable').length,
      totalIndexable: summary.indexable,
      totalSitemapUrls: summary.indexable,
      totalVerifiedCatalogEntities,
      supplyGapsIdentified: summary.supplyGaps,
    },
  };
}
