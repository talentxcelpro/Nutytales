// ─── Nuty Tales NRI — Transparent Service Provider Matching Engine ─────────────
// Operating Platform for Indians Living Abroad | nri.nutytales.com

import { NriProvider, ServiceCategoryKey, ExtractedPlan } from './types'
import { VERIFIED_PROVIDERS } from './nri-data'

export interface MatchScoreResult {
  provider: NriProvider
  matchScore: number // 0-100 calibrated
  fitLabel: 'Best Match' | 'Strong Fit' | 'Available for Your Location'
  transparentReasons: string[]
  isVerified: boolean
}

/**
 * Evaluates and ranks verified providers against an extracted plan
 */
export function matchProvidersForPlan(
  plan: ExtractedPlan,
  allProviders: NriProvider[] = VERIFIED_PROVIDERS
): MatchScoreResult[] {
  const results: MatchScoreResult[] = []

  for (const provider of allProviders) {
    let score = 0
    const reasons: string[] = []

    // 1. Category Compatibility (35 points)
    const categoryMatch = provider.categories.includes(plan.category)
    if (categoryMatch) {
      score += 35
      reasons.push(`Specializes in ${plan.categoryLabel}`)
    } else {
      // If provider doesn't handle this category, skip
      continue
    }

    // 2. City Coverage (25 points)
    const cityMatch =
      provider.cities.some((c) => c.toLowerCase() === plan.destination_city.toLowerCase()) ||
      provider.cities.some((c) => plan.destination_city.toLowerCase().includes(c.toLowerCase()))

    if (cityMatch) {
      score += 25
      reasons.push(`Direct on-ground coverage in ${plan.destination_city}`)
    } else {
      // Partial points for regional coverage
      score += 10
      reasons.push(`Operates regionally across northern India`)
    }

    // 3. Verification & Accreditations (20 points)
    if (provider.verificationStatus === 'verified') {
      score += 15
      reasons.push(`Verified ${provider.verificationLevel}`)
    }
    if (provider.panGstDeclared) {
      score += 5
    }

    // 4. Experience & Rating Calibration (15 points)
    if (provider.rating >= 4.9) {
      score += 10
      reasons.push(`High satisfaction rating of ${provider.rating.toFixed(2)} (${provider.completedJobs} completed jobs)`)
    } else if (provider.rating >= 4.7) {
      score += 8
    }

    if (provider.experienceYears >= 10) {
      score += 5
      reasons.push(`${provider.experienceYears}+ years local industry experience`)
    }

    // 5. NRI Specific Experience
    if (provider.nriExperience) {
      score += 5
      reasons.push(`Substantiated overseas family management experience`)
    }

    // Cap score at 100
    const finalScore = Math.min(100, Math.max(10, score))

    let fitLabel: MatchScoreResult['fitLabel'] = 'Available for Your Location'
    if (finalScore >= 85) fitLabel = 'Best Match'
    else if (finalScore >= 70) fitLabel = 'Strong Fit'

    results.push({
      provider: {
        ...provider,
        matchScore: finalScore,
        matchReason: reasons.slice(0, 3).join(' • '),
      },
      matchScore: finalScore,
      fitLabel,
      transparentReasons: reasons,
      isVerified: provider.verificationStatus === 'verified',
    })
  }

  // If no 3rd-party providers match or catalog is in onboarding mode, assign to Central Desk
  if (results.length === 0) {
    const citySlug = plan.destination_city.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const deskProvider: NriProvider = {
      id: `desk-${citySlug}`,
      name: `Nuty Tales Ground Operations (${plan.destination_city})`,
      businessName: 'Nuty Tales Central Operations Desk',
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
      categories: [plan.category],
      cities: [plan.destination_city],
      experienceYears: 6,
      verificationStatus: 'verified',
      verificationLevel: 'Platform Managed',
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      nriExperience: 'Direct central concierge execution with dedicated coordinator assignment and supervisor sign-off.',
      languages: ['English', 'Hindi', 'Urdu'],
      bio: `Direct execution supervised by Nuty Tales on-ground coordinators in ${plan.destination_city}. All milestones protected by timestamped photographic proof.`,
      phone: '+91-194-2450001',
      email: 'operations@nutytales.com',
      panGstDeclared: true,
      sampleRate: `${plan.estimated_budget.currency} ${plan.estimated_budget.min.toLocaleString()} – ${plan.estimated_budget.max.toLocaleString()}`,
    }

    results.push({
      provider: {
        ...deskProvider,
        matchScore: 95,
        matchReason: `Direct Ground Execution in ${plan.destination_city} • Supervisor Monitored • Milestone Custody Protected`,
      },
      matchScore: 95,
      fitLabel: 'Best Match',
      transparentReasons: [
        `Direct ground coordinator assignment in ${plan.destination_city}`,
        `Full supervision by Nuty Tales Central Operations Desk`,
        `GPS-timestamped photographic proof required for milestone sign-off`,
      ],
      isVerified: true,
    })
  }

  // Rank by calibrated score descending
  return results.sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Generates an illustrative quote proposal from a matched provider
 */
export function generateIllustrativeQuote(provider: NriProvider, plan: ExtractedPlan) {
  const basePrice = Math.round(plan.estimated_budget.min * 1.05)
  const isMonthly = plan.frequency === 'monthly' || plan.frequency === 'weekly'

  return {
    id: `quote-${provider.id}-${Date.now()}`,
    requestId: 'draft-req',
    providerId: provider.id,
    providerName: provider.name,
    providerAvatar: provider.avatar,
    providerBadge: provider.verificationLevel,
    rating: provider.rating,
    completedJobs: provider.completedJobs,
    totalAmount: basePrice,
    currency: plan.estimated_budget.currency,
    breakdown: [
      { item: `Coordination & Local Execution (${plan.categoryLabel})`, amount: Math.round(basePrice * 0.7) },
      { item: 'Detailed GPS Timestamped Documentation & Reporting', amount: Math.round(basePrice * 0.2) },
      { item: 'Platform Oversight, Milestone Protection & Quality Assurance', amount: Math.round(basePrice * 0.1) },
    ],
    milestones: isMonthly
      ? [
          {
            id: 'm1',
            title: 'Monthly Service Retainer Activation',
            percentage: 50,
            amount: Math.round(basePrice * 0.5),
            status: 'pending' as const,
            due_condition: 'Upon plan initiation and schedule confirmation',
          },
          {
            id: 'm2',
            title: 'Mid-Month Review & Completed Proof Submission',
            percentage: 50,
            amount: Math.round(basePrice * 0.5),
            status: 'pending' as const,
            due_condition: 'Upon verified upload of photo reports and checklist sign-off',
          },
        ]
      : [
          {
            id: 'm1',
            title: 'Initial Deposit & Coordinator Mobilization',
            percentage: 40,
            amount: Math.round(basePrice * 0.4),
            status: 'pending' as const,
            due_condition: 'Released to hold verified coordinator slot',
          },
          {
            id: 'm2',
            title: 'Final Milestone (After Customer Proof Approval)',
            percentage: 60,
            amount: Math.round(basePrice * 0.6),
            status: 'pending' as const,
            due_condition: 'Released only after you inspect and approve photo/document proof',
          },
        ],
    estimatedDays: plan.urgency === 'priority' ? 2 : 5,
    proposalNote: `Hello, I have reviewed your request for ${plan.destination_city}. With ${provider.experienceYears} years of experience and dedicated local coordinators on the ground, I will ensure thorough execution and timestamped photo proof.`,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    status: 'pending' as const,
  }
}
