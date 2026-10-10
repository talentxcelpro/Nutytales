// ─── Nuty Tales NRI — Transparent Service Provider Matching Engine ─────────────
// Operating Platform for Indians Living Abroad | nri.nutytales.com

import { NriProvider, ServiceCategoryKey, ExtractedPlan } from './types'
import { VERIFIED_PROVIDERS, OPERATIONAL_CITIES } from './nri-data'

export interface MatchScoreResult {
  provider: NriProvider
  matchScore: number // 0-100 calibrated
  fitLabel: 'Direct Fulfillment Hub' | 'Scoped RFQ Sourcing' | 'Feasibility Review Required' | 'Best Match' | 'Strong Fit'
  transparentReasons: string[]
  isVerified: boolean
  isDirectHub: boolean
  isRfqOnly: boolean
}

/**
 * Evaluates and ranks verified providers against an extracted plan with strict location awareness
 */
export function matchProvidersForPlan(
  plan: ExtractedPlan,
  allProviders: NriProvider[] = VERIFIED_PROVIDERS
): MatchScoreResult[] {
  const results: MatchScoreResult[] = []
  const destLower = plan.destination_city.toLowerCase()

  // 1. First search genuine verified registered providers
  for (const provider of allProviders) {
    // A. Category Compatibility
    const categoryMatch = provider.categories.includes(plan.category)
    if (!categoryMatch) continue

    // B. Strict City Coverage - Provider MUST genuinely cover this city
    const cityMatch = provider.cities.some((c) => {
      const cLow = c.toLowerCase()
      return cLow === destLower || destLower.includes(cLow) || cLow.includes(destLower)
    })

    if (!cityMatch) {
      // Strictly skip provider if they do not operate in the requested destination city
      continue
    }

    let score = 35 // Base category score
    const reasons: string[] = [`Specializes in ${plan.categoryLabel}`]

    score += 25
    reasons.push(`Direct on-ground coverage in ${plan.destination_city}`)

    // Verification & Accreditations (20 points)
    if (provider.verificationStatus === 'verified') {
      score += 15
      reasons.push(`Verified ${provider.verificationLevel}`)
    }
    if (provider.panGstDeclared) {
      score += 5
    }

    // Experience & Rating Calibration (15 points)
    if (provider.rating >= 4.9 && provider.completedJobs > 0) {
      score += 10
      reasons.push(`Client satisfaction rating of ${provider.rating.toFixed(1)}`)
    } else {
      score += 5
    }

    if (provider.experienceYears >= 5) {
      score += 5
      reasons.push(`${provider.experienceYears}+ years verified industry experience`)
    }

    // NRI Specific Experience
    if (provider.nriExperience) {
      score += 5
      reasons.push('Substantiated overseas family coordination experience')
    }

    const finalScore = Math.min(100, Math.max(20, score))
    const fitLabel: MatchScoreResult['fitLabel'] = finalScore >= 80 ? 'Best Match' : 'Strong Fit'

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
      isDirectHub: true,
      isRfqOnly: false,
    })
  }

  // 2. If no direct provider in catalog, evaluate against Platform Operational Registry
  if (results.length === 0) {
    const cityMeta = OPERATIONAL_CITIES.find((c) => {
      const cLow = c.name.toLowerCase()
      return cLow === destLower || destLower.includes(cLow) || cLow.includes(destLower)
    })

    const citySlug = plan.destination_city.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    if (cityMeta && (cityMeta.operationalTier.includes('Tier 1') || cityMeta.coverageStatus === 'Available to Book')) {
      // Tier 1 Direct Fulfillment Hub
      const deskProvider: NriProvider = {
        id: `desk-${citySlug}`,
        name: `Nuty Tales Ground Operations (${plan.destination_city})`,
        businessName: 'Nuty Tales Central Ground Operations',
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
        languages: ['English', 'Hindi'],
        bio: `Direct execution supervised by Nuty Tales on-ground coordinators in ${plan.destination_city}. All milestones protected by timestamped photographic proof.`,
        phone: '+91-11-23382020',
        email: 'operations@nutytales.com',
        panGstDeclared: true,
        sampleRate: `${plan.estimated_budget.currency} ${plan.estimated_budget.min.toLocaleString()} – ${plan.estimated_budget.max.toLocaleString()}`,
      }

      results.push({
        provider: {
          ...deskProvider,
          matchScore: 90,
          matchReason: `Direct Ground Execution in ${plan.destination_city} • Supervisor Monitored • Milestone Custody Protected`,
        },
        matchScore: 90,
        fitLabel: 'Direct Fulfillment Hub',
        transparentReasons: [
          `Direct ground coordinator assignment active in ${plan.destination_city}`,
          'Supervised execution by Nuty Tales Central Operations Desk',
          'GPS-timestamped photographic proof required for milestone sign-off',
        ],
        isVerified: true,
        isDirectHub: true,
        isRfqOnly: false,
      })
    } else if (cityMeta && (cityMeta.operationalTier.includes('Tier 2') || cityMeta.coverageStatus === 'Request a Quote')) {
      // Tier 2 Scoped RFQ Dispatch
      const rfqProvider: NriProvider = {
        id: `rfq-${citySlug}`,
        name: `Custom Sourcing Desk (${plan.destination_city})`,
        businessName: 'Nuty Tales Partner Sourcing Network',
        avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
        categories: [plan.category],
        cities: [plan.destination_city],
        experienceYears: 5,
        verificationStatus: 'verified',
        verificationLevel: 'Platform Managed',
        rating: 5.0,
        reviewCount: 0,
        completedJobs: 0,
        nriExperience: 'Custom partner dispatch and vetting for regional Indian hubs.',
        languages: ['English', 'Hindi'],
        bio: `Scoped RFQ dispatch desk. We match your request with credentialed local partners in ${plan.destination_city} within 24–48 hours.`,
        phone: '+91-11-23382020',
        email: 'sourcing@nutytales.com',
        panGstDeclared: true,
        sampleRate: 'Custom Scoped Quotation',
      }

      results.push({
        provider: {
          ...rfqProvider,
          matchScore: 75,
          matchReason: `Custom Partner Scoping in ${plan.destination_city} • 24–48h Feasibility Check • Milestone Custody`,
        },
        matchScore: 75,
        fitLabel: 'Scoped RFQ Sourcing',
        transparentReasons: [
          `Custom vendor scoping active in ${plan.destination_city}`,
          'Itemized quotation and feasibility confirmation within 24–48 hours',
          'Payments held in contractual milestone custody until proof approval',
        ],
        isVerified: true,
        isDirectHub: false,
        isRfqOnly: true,
      })
    } else {
      // Tier 3 or Outside Network - Honest Feasibility Disclosure
      const reviewProvider: NriProvider = {
        id: `review-${citySlug}`,
        name: `Feasibility Desk (${plan.destination_city})`,
        businessName: 'Nuty Tales Network Expansion Desk',
        avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
        categories: [plan.category],
        cities: [plan.destination_city],
        experienceYears: 0,
        verificationStatus: 'under_review',
        verificationLevel: 'Identity Verified',
        rating: 0,
        reviewCount: 0,
        completedJobs: 0,
        nriExperience: 'New location inquiry handling.',
        languages: ['English', 'Hindi'],
        bio: `Direct automated booking is not currently operational in ${plan.destination_city}. Submit request for custom feasibility evaluation.`,
        phone: '+91-11-23382020',
        email: 'expansion@nutytales.com',
        panGstDeclared: true,
        sampleRate: 'Feasibility Assessment on Demand',
      }

      results.push({
        provider: {
          ...reviewProvider,
          matchScore: 40,
          matchReason: `Location Outside Direct Network (${plan.destination_city}) • Feasibility Review Required`,
        },
        matchScore: 40,
        fitLabel: 'Feasibility Review Required',
        transparentReasons: [
          `Direct provider network not currently active in ${plan.destination_city}`,
          'Our operations team will review ground partner availability manually',
          'No booking commitment or upfront payment required until confirmed',
        ],
        isVerified: false,
        isDirectHub: false,
        isRfqOnly: true,
      })
    }
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
    isIllustrative: true,
    quoteNotice: 'Illustrative quotation estimate based on standard package parameters. Binding quotation confirmed upon on-ground scope review.',
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
            title: 'Initial Mobilization Deposit (40%)',
            percentage: 40,
            amount: Math.round(basePrice * 0.4),
            status: 'pending' as const,
            due_condition: 'Released to mobilize local coordinator and schedule site visit',
          },
          {
            id: 'm2',
            title: 'Final Milestone Release (60%)',
            percentage: 60,
            amount: Math.round(basePrice * 0.6),
            status: 'pending' as const,
            due_condition: 'Released only after you inspect and approve photo/document proof on your dashboard',
          },
        ],
    estimatedDays: plan.urgency === 'priority' ? 2 : 5,
    proposalNote: `Hello, your request for ${plan.destination_city} has been routed to our operations coordination desk. We ensure thorough ground execution, itemized checklists, and timestamped photographic proof.`,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    status: 'pending' as const,
  }
}
