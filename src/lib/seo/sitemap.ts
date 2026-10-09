/**
 * Nuty Tales SEO — Sitemap Architecture
 *
 * Scalable sitemap generation supporting 10M+ page candidates.
 *
 * Architecture:
 * - Each business has its own sitemap index
 * - Sitemaps are sharded by type (products, locations, occasions, etc.)
 * - Maximum 50,000 URLs per sitemap file (Google limit)
 * - Only indexable, canonical, 200-status pages are included
 * - Prioritized by tier (Tier 1 = highest commercial value)
 * - lastmod reflects actual content change, not sitemap regeneration
 *
 * Sitemap Index Hierarchy:
 *   /sitemap.xml (root)
 *     → /sitemaps/businesses.xml
 *     → /sitemaps/products.xml
 *     → /sitemaps/core.xml
 *
 *   Each subdomain independently:
 *     /sitemap.xml → shard indexes
 */

import type { MetadataRoute } from 'next';
import type { SeoPageCandidate, NutyBusiness, SitemapTier, SitemapEntry } from './types';
import { BUSINESS_DOMAINS } from './types';
import { filterIndexableCandidates } from './governor';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const SITEMAP_MAX_URLS = 50_000;

// Changefreq by tier
const TIER_CHANGEFREQ: Record<SitemapTier, MetadataRoute.Sitemap[number]['changeFrequency']> = {
  1: 'daily',
  2: 'weekly',
  3: 'weekly',
  4: 'monthly',
  5: 'monthly',
};

// Priority by tier
const TIER_PRIORITY: Record<SitemapTier, number> = {
  1: 1.0,
  2: 0.9,
  3: 0.8,
  4: 0.7,
  5: 0.6,
};

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP ENTRY BUILDER
// ─────────────────────────────────────────────────────────────────────────────

function candidateToSitemapEntry(candidate: SeoPageCandidate): MetadataRoute.Sitemap[number] {
  const tier = candidate.sitemapTier;
  return {
    url: candidate.canonicalUrl,
    lastModified: candidate.lastmod ?? candidate.updatedAt,
    changeFrequency: TIER_CHANGEFREQ[tier],
    priority: TIER_PRIORITY[tier],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARD GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Splits a large array of candidates into shards of max 50,000.
 * Returns an array of shards (each shard is an array of MetadataRoute.Sitemap entries).
 *
 * The caller should write each shard to its own file:
 *   /sitemaps/{group}-{shardIndex}.xml
 */
export function shardSitemap(
  candidates: SeoPageCandidate[],
  maxPerShard = SITEMAP_MAX_URLS
): MetadataRoute.Sitemap[] {
  const indexable = filterIndexableCandidates(candidates);

  // Sort by tier (ascending = highest priority first) then by quality score descending
  const sorted = [...indexable].sort((a, b) => {
    if (a.sitemapTier !== b.sitemapTier) return a.sitemapTier - b.sitemapTier;
    return b.qualityScore - a.qualityScore;
  });

  const shards: MetadataRoute.Sitemap[] = [];
  for (let i = 0; i < sorted.length; i += maxPerShard) {
    shards.push(sorted.slice(i, i + maxPerShard).map(candidateToSitemapEntry));
  }

  return shards;
}

// ─────────────────────────────────────────────────────────────────────────────
// BUSINESS-SPECIFIC SITEMAP GROUPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Groups candidates by their sitemapGroup field and returns a map
 * of group name → shards.
 *
 * E.g. for Travel:
 *   { destinations: [[...50k entries...], [...]], trips: [[...]], experiences: [[...]] }
 */
export function buildBusinessSitemapIndex(
  candidates: SeoPageCandidate[],
  business: NutyBusiness
): Map<string, MetadataRoute.Sitemap[]> {
  const businessCandidates = candidates.filter(
    (c) => c.business === business && c.status === 'indexable'
  );

  // Group by sitemapGroup
  const groups = new Map<string, SeoPageCandidate[]>();
  for (const candidate of businessCandidates) {
    const group = candidate.sitemapGroup ?? 'general';
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(candidate);
  }

  // Shard each group
  const result = new Map<string, MetadataRoute.Sitemap[]>();
  for (const [group, groupCandidates] of groups) {
    result.set(group, shardSitemap(groupCandidates));
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT SITEMAP (nutytales.com/sitemap.xml)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The root sitemap points to all business sitemap indexes.
 * Only submit to GSC once the corresponding sitemap exists with real indexable URLs.
 */
export function buildRootSitemapIndex(): Array<{ url: string; lastmod: Date }> {
  const businesses: NutyBusiness[] = ['nri', 'business', 'gifting', 'weddings', 'crafts', 'stays', 'travel'];
  return businesses.map((b) => ({
    url: `${BUSINESS_DOMAINS[b]}/sitemap.xml`,
    lastmod: new Date(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC CORE SITEMAP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The hardcoded core pages sitemap for nutytales.com.
 * These pages exist, are real, and always indexable.
 * DO NOT include checkout, cart, account, login, or API routes.
 *
 * Note: This replaces the previous flat sitemap.ts.
 * Dynamic pages are handled by business-specific sitemaps.
 */
export function buildRootCoreSitemap(): MetadataRoute.Sitemap {
  const base = BUSINESS_DOMAINS.root;
  const now = new Date();

  function entry(
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'weekly',
    lastModified: Date = now
  ): MetadataRoute.Sitemap[number] {
    return { url: `${base}${path}`, lastModified, changeFrequency, priority };
  }

  return [
    // Tier 1 — Core Brand & Commerce Hubs
    entry('/',                               1.0, 'daily'),
    entry('/shop',                           0.95, 'daily'),
    entry('/makhana',                        0.90, 'weekly'),
    entry('/festivals',                      0.85, 'weekly'),
    entry('/festivals/diwali',               0.85, 'weekly'),
    entry('/festivals/eid',                  0.85, 'weekly'),
    entry('/festivals/christmas',            0.85, 'weekly'),
    entry('/festivals/new-year',             0.85, 'weekly'),
    entry('/festivals/raksha-bandhan',       0.85, 'weekly'),
    entry('/festivals/holi',                 0.85, 'weekly'),
    entry('/festivals/karwa-chauth',         0.85, 'weekly'),
    entry('/festivals/navratri',             0.85, 'weekly'),
    entry('/occasions',                      0.85, 'weekly'),
    entry('/occasions/corporate-gifting',    0.85, 'weekly'),
    entry('/occasions/wedding-favors',       0.85, 'weekly'),
    entry('/occasions/employee-recognition', 0.85, 'weekly'),
    entry('/seasons',                        0.85, 'weekly'),
    entry('/seasons/autumn-winter',          0.85, 'weekly'),
    entry('/seasons/spring',                 0.85, 'weekly'),
    entry('/seasons/summer',                 0.85, 'weekly'),
    entry('/life-events',                    0.85, 'weekly'),
    entry('/life-events/weddings',           0.85, 'weekly'),
    entry('/life-events/corporate-retreats', 0.85, 'weekly'),

    // Tier 2 — Trust & Legal
    entry('/founders',                       0.70, 'monthly'),
    entry('/shipping',                       0.70, 'weekly'),
    entry('/privacy',                        0.50, 'monthly'),
    entry('/terms',                          0.50, 'monthly'),
    entry('/sitemap',                        0.60, 'weekly'),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT SITEMAP
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates product sitemap entries from real product slugs.
 * In production, these slugs should come from the database — NOT hardcoded.
 *
 * @param slugs     - Array of real product slugs from the DB
 * @param lastmods  - Optional map of slug → lastModified date
 */
export function buildProductSitemap(
  slugs: string[],
  lastmods?: Map<string, Date>
): MetadataRoute.Sitemap {
  const base = BUSINESS_DOMAINS.root;
  const now = new Date();

  return slugs.map((slug) => ({
    url: `${base}/shop/${slug}`,
    lastModified: lastmods?.get(slug) ?? now,
    changeFrequency: 'weekly' as const,
    priority: 0.80,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP MONITORING STATS
// ─────────────────────────────────────────────────────────────────────────────

export interface SitemapStats {
  business: NutyBusiness;
  totalCandidates: number;
  indexableCount: number;
  noindexCount: number;
  blockedCount: number;
  sitemapGroups: Record<string, number>;  // group → count
  lastGenerated: Date;
}

export function computeSitemapStats(
  candidates: SeoPageCandidate[],
  business: NutyBusiness
): SitemapStats {
  const biz = candidates.filter((c) => c.business === business);
  const indexable = biz.filter((c) => c.status === 'indexable');
  const noindex   = biz.filter((c) => c.status === 'noindex');
  const blocked   = biz.filter((c) => c.status === 'blocked');

  const groups: Record<string, number> = {};
  for (const c of indexable) {
    const g = c.sitemapGroup ?? 'general';
    groups[g] = (groups[g] ?? 0) + 1;
  }

  return {
    business,
    totalCandidates: biz.length,
    indexableCount: indexable.length,
    noindexCount: noindex.length,
    blockedCount: blocked.length,
    sitemapGroups: groups,
    lastGenerated: new Date(),
  };
}
