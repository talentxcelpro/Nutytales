/**
 * Nutty Tales SEO — Indexation Governor
 *
 * This module is the central quality gate for all SEO pages.
 *
 * Before ANY page is published to the sitemap or marked as indexable,
 * it MUST pass this governor. The governor computes a quality score
 * and returns a governed decision: publish, noindex, block, or candidate.
 *
 * Quality thresholds are configurable via environment variables.
 */

import type {
  SeoPageCandidate,
  GovernorDecision,
  QualityThresholds,
  SeoPageStatus,
  RobotsDirective,
  SitemapTier,
} from './types';
import { DEFAULT_QUALITY_THRESHOLDS } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURABLE THRESHOLDS
// ─────────────────────────────────────────────────────────────────────────────

function getThresholds(): QualityThresholds {
  return {
    indexThreshold: parseInt(process.env.SEO_INDEX_THRESHOLD ?? '80', 10),
    publishTestThreshold: parseInt(process.env.SEO_PUBLISH_TEST_THRESHOLD ?? '60', 10),
    internalOnlyThreshold: parseInt(process.env.SEO_INTERNAL_ONLY_THRESHOLD ?? '40', 10),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// QUALITY SCORE COMPUTATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Computes a weighted composite quality score (0–100) from candidate signals.
 *
 * Positive factors (sum to ~100 before weighting):
 *   demand            × 0.20
 *   commercialIntent  × 0.20
 *   supply            × 0.20
 *   dataQuality       × 0.15
 *   uniqueness        × 0.10
 *   conversion        × 0.10
 *   freshness         × 0.03
 *   trust             × 0.02
 *
 * Negative factors (subtracted):
 *   duplicationRisk   × 0.30
 *   thinContentRisk   × 0.25
 *   spamRisk          × 0.20
 */
export function computeQualityScore(candidate: SeoPageCandidate): number {
  const positive =
    candidate.demandScore        * 0.20 +
    candidate.commercialScore    * 0.20 +
    candidate.supplyScore        * 0.20 +
    candidate.dataQualityScore   * 0.15 +
    candidate.uniquenessScore    * 0.10 +
    candidate.conversionScore    * 0.10 +
    candidate.freshnessScore     * 0.03 +
    candidate.trustScore         * 0.02;

  const negative =
    candidate.duplicationRisk    * 0.30 +
    candidate.thinContentRisk    * 0.25 +
    candidate.spamRisk           * 0.20;

  const raw = positive - (negative * 0.5); // negative is attenuating, not directly subtracted
  return Math.max(0, Math.min(100, Math.round(raw)));
}

// ─────────────────────────────────────────────────────────────────────────────
// HARD BLOCKERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hard blockers are conditions that immediately prevent indexation
 * regardless of the quality score.
 */
function checkHardBlockers(candidate: SeoPageCandidate): string[] {
  const blockers: string[] = [];

  // No real supply and no sourcing path
  if (candidate.supplyScore < 10 && candidate.commercialScore > 40) {
    blockers.push(
      'No real supply exists for a commercial intent page. ' +
      'Convert to a sourcing/RFQ opportunity instead of faking availability.'
    );
  }

  // Duplicate content risk is critical
  if (candidate.duplicationRisk > 80) {
    blockers.push(
      'Extreme duplication risk. This page would be near-identical to an existing page. ' +
      'Consolidate or redirect instead.'
    );
  }

  // Spam pattern detected
  if (candidate.spamRisk > 70) {
    blockers.push(
      'High programmatic spam risk detected. ' +
      'This appears to be a keyword-combination URL with no differentiated value.'
    );
  }

  // Thin content with no commercial intent
  if (candidate.thinContentRisk > 70 && candidate.commercialScore < 30) {
    blockers.push(
      'Thin content with no commercial intent. ' +
      'This page has no user or business value.'
    );
  }

  // No demand AND no commercial intent
  if (candidate.demandScore < 10 && candidate.commercialScore < 10) {
    blockers.push(
      'No measurable demand and no commercial intent. ' +
      'Do not create pages that serve no user or business purpose.'
    );
  }

  return blockers;
}

// ─────────────────────────────────────────────────────────────────────────────
// WARNINGS
// ─────────────────────────────────────────────────────────────────────────────

function checkWarnings(candidate: SeoPageCandidate, qualityScore: number): string[] {
  const warnings: string[] = [];

  if (candidate.supplyScore < 40 && candidate.commercialScore > 60) {
    warnings.push(
      'Commercial intent page with limited supply. ' +
      'Consider adding a sourcing CTA and supply gap notification.'
    );
  }

  if (candidate.internalLinkScore < 30) {
    warnings.push(
      'This page has few internal links pointing to it. ' +
      'Improve internal linking before declaring it fully optimized.'
    );
  }

  if (!candidate.lastEvaluatedAt ||
    Date.now() - candidate.lastEvaluatedAt.getTime() > 30 * 24 * 60 * 60 * 1000) {
    warnings.push(
      'Page has not been re-evaluated in over 30 days. ' +
      'Demand and supply signals may be stale.'
    );
  }

  if (qualityScore < 70 && qualityScore >= 60) {
    warnings.push(
      'Quality score is borderline. ' +
      'Consider publishing as noindex until data quality improves.'
    );
  }

  return warnings;
}

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP TIER DETERMINATION
// ─────────────────────────────────────────────────────────────────────────────

export function determineSitemapTier(candidate: SeoPageCandidate): SitemapTier {
  const { commercialScore, demandScore, revenueScore } = candidate;
  const combined = (commercialScore * 0.4) + (demandScore * 0.35) + (revenueScore * 0.25);

  if (combined >= 75) return 1;
  if (combined >= 55) return 2;
  if (combined >= 40) return 3;
  if (combined >= 25) return 4;
  return 5;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GOVERNOR FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The central indexation gate.
 *
 * Call this before publishing ANY page to the sitemap or marking it indexable.
 * The governor returns a binding decision and the caller must respect it.
 *
 * @param candidate  - The SEO page candidate to evaluate
 * @param thresholds - Optional override of quality thresholds (for testing)
 * @returns          - A GovernorDecision with the full ruling
 */
export function runIndexationGovernor(
  candidate: SeoPageCandidate,
  thresholds: QualityThresholds = getThresholds()
): GovernorDecision {
  const qualityScore = computeQualityScore(candidate);
  const blockers = checkHardBlockers(candidate);
  const warnings = checkWarnings(candidate, qualityScore);

  // Hard blockers always override score
  if (blockers.length > 0) {
    return {
      approved: false,
      status: 'blocked',
      robotsDirective: 'noindex,nofollow',
      inSitemap: false,
      qualityScore,
      blockers,
      warnings,
    };
  }

  // Score-based decisions
  if (qualityScore >= thresholds.indexThreshold) {
    return {
      approved: true,
      status: 'indexable',
      robotsDirective: 'index,follow',
      inSitemap: true,
      qualityScore,
      blockers: [],
      warnings,
    };
  }

  if (qualityScore >= thresholds.publishTestThreshold) {
    // Publish but noindex for now — monitor and improve
    return {
      approved: true,
      status: 'noindex',
      robotsDirective: 'noindex,follow',
      inSitemap: false,
      qualityScore,
      blockers: [],
      warnings: [
        ...warnings,
        `Quality score ${qualityScore} is below index threshold (${thresholds.indexThreshold}). ` +
        'Published with noindex. Improve data quality and supply to earn indexation.',
      ],
    };
  }

  if (qualityScore >= thresholds.internalOnlyThreshold) {
    return {
      approved: false,
      status: 'candidate',
      robotsDirective: 'noindex,nofollow',
      inSitemap: false,
      qualityScore,
      blockers: [],
      warnings: [
        ...warnings,
        `Quality score ${qualityScore} is below publish threshold (${thresholds.publishTestThreshold}). ` +
        'Keep as internal candidate. Do not publish.',
      ],
    };
  }

  // Below all thresholds — do not create
  return {
    approved: false,
    status: 'blocked',
    robotsDirective: 'noindex,nofollow',
    inSitemap: false,
    qualityScore,
    blockers: [
      `Quality score ${qualityScore} is below the minimum threshold (${thresholds.internalOnlyThreshold}). ` +
      'Do not create this page.',
    ],
    warnings,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BATCH EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluates a batch of candidates and returns only those approved for indexation.
 * Use this to build sitemap entries from the candidate pool.
 */
export function filterIndexableCandidates(
  candidates: SeoPageCandidate[],
  thresholds?: QualityThresholds
): SeoPageCandidate[] {
  const t = thresholds ?? getThresholds();
  return candidates.filter((c) => {
    const decision = runIndexationGovernor(c, t);
    return decision.inSitemap && decision.status === 'indexable';
  });
}

/**
 * Returns a structured summary of the governor's assessment of a batch.
 * Useful for SEO monitoring dashboards.
 */
export interface BatchGovernorSummary {
  total: number;
  indexable: number;
  noindex: number;
  candidate: number;
  blocked: number;
  averageQualityScore: number;
  supplyGaps: number;           // Pages with supply score < 30 and commercial score > 50
  topBlockers: Record<string, number>;  // Blocker message → count
}

export function summarizeBatch(
  candidates: SeoPageCandidate[],
  thresholds?: QualityThresholds
): BatchGovernorSummary {
  const t = thresholds ?? getThresholds();
  const results = candidates.map((c) => ({
    candidate: c,
    decision: runIndexationGovernor(c, t),
  }));

  const statusCounts = { indexable: 0, noindex: 0, candidate: 0, blocked: 0 };
  const blockerCounts: Record<string, number> = {};
  let totalScore = 0;
  let supplyGaps = 0;

  for (const { candidate, decision } of results) {
    const s = decision.status;
    if (s === 'indexable') statusCounts.indexable++;
    else if (s === 'noindex') statusCounts.noindex++;
    else if (s === 'candidate') statusCounts.candidate++;
    else statusCounts.blocked++;

    totalScore += decision.qualityScore;

    if (candidate.supplyScore < 30 && candidate.commercialScore > 50) {
      supplyGaps++;
    }

    for (const blocker of decision.blockers) {
      const key = blocker.substring(0, 60);
      blockerCounts[key] = (blockerCounts[key] ?? 0) + 1;
    }
  }

  return {
    total: candidates.length,
    ...statusCounts,
    averageQualityScore: candidates.length > 0
      ? Math.round(totalScore / candidates.length)
      : 0,
    supplyGaps,
    topBlockers: blockerCounts,
  };
}
