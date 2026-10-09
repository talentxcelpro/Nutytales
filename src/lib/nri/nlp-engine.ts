// ─── Nuty Tales NRI — Natural Language Request Interpretation Engine ───────────
// Operating Platform for Indians Living Abroad | nri.nutytales.com

import { ExtractedPlan, ServiceCategoryKey, RequestStatus } from './types'
import { NRI_CATEGORIES } from './nri-data'

export interface ParsedRequestResult {
  plan: ExtractedPlan
  confidence: number
  identifiedEntities: {
    intent: string
    locations: string[]
    urgency: string
    frequency: string
    familyOrPropertyTerms: string[]
  }
}

/**
 * Parses user natural language request into a structured India Execution Plan
 */
export function interpretNaturalLanguageRequest(
  prompt: string,
  userCountry: string = 'United States',
  userPreferredCity: string = 'Srinagar'
): ParsedRequestResult {
  const p = prompt.trim()
  const lower = p.toLowerCase()

  // 1. Detect Category
  let category: ServiceCategoryKey = 'property_management'
  let confidence = 0.85

  if (
    lower.includes('inspect') ||
    lower.includes('inspection') ||
    lower.includes('property') ||
    lower.includes('house') ||
    lower.includes('flat') ||
    lower.includes('apartment') ||
    lower.includes('tenant') ||
    lower.includes('caretaker') ||
    lower.includes('rent') ||
    lower.includes('meter')
  ) {
    category = 'property_management'
  } else if (
    lower.includes('doctor') ||
    lower.includes('hospital') ||
    lower.includes('opd') ||
    lower.includes('blood test') ||
    lower.includes('diagnostic') ||
    lower.includes('caregiver') ||
    lower.includes('physician')
  ) {
    category = 'healthcare'
  } else if (
    lower.includes('parent') ||
    lower.includes('father') ||
    lower.includes('mother') ||
    lower.includes('elder') ||
    lower.includes('senior') ||
    lower.includes('visit them') ||
    lower.includes('companion') ||
    lower.includes('medicine pickup') ||
    lower.includes('grocery')
  ) {
    category = 'parent_care'
  } else if (
    lower.includes('poa') ||
    lower.includes('power of attorney') ||
    lower.includes('notary') ||
    lower.includes('legal') ||
    lower.includes('deed') ||
    lower.includes('encumbrance') ||
    lower.includes('registry') ||
    lower.includes('sub-registrar') ||
    lower.includes('revenue') ||
    lower.includes('fard') ||
    lower.includes('jamabandi')
  ) {
    category = 'legal_documents'
  } else if (
    lower.includes('tax') ||
    lower.includes('itr') ||
    lower.includes('15ca') ||
    lower.includes('15cb') ||
    lower.includes('fema') ||
    lower.includes('ca') ||
    lower.includes('capital gain') ||
    lower.includes('repatriat')
  ) {
    category = 'tax_finance'
  } else if (
    lower.includes('repair') ||
    lower.includes('leak') ||
    lower.includes('paint') ||
    lower.includes('clean') ||
    lower.includes('renovat') ||
    lower.includes('plumb') ||
    lower.includes('electr') ||
    lower.includes('waterproof')
  ) {
    category = 'home_services'
  } else if (
    lower.includes('travel') ||
    lower.includes('holiday') ||
    lower.includes('stay') ||
    lower.includes('villa') ||
    lower.includes('airport') ||
    lower.includes('chauffeur') ||
    lower.includes('car') ||
    lower.includes('tour') ||
    lower.includes('flight')
  ) {
    category = 'travel_stays'
  } else if (
    lower.includes('wedding') ||
    lower.includes('wazwan') ||
    lower.includes('nikah') ||
    lower.includes('marriage') ||
    lower.includes('bride') ||
    lower.includes('groom')
  ) {
    category = 'weddings_events'
  } else if (
    lower.includes('gift') ||
    lower.includes('hamper') ||
    lower.includes('deliver') ||
    lower.includes('birthday') ||
    lower.includes('anniversary') ||
    lower.includes('saffron box') ||
    lower.includes('almond box')
  ) {
    category = 'gifting_deliveries'
  } else if (
    lower.includes('pashmina') ||
    lower.includes('shawl') ||
    lower.includes('carpet') ||
    lower.includes('craft') ||
    lower.includes('rug') ||
    lower.includes('wood')
  ) {
    category = 'crafts_heritage'
  } else if (
    lower.includes('business') ||
    lower.includes('factory') ||
    lower.includes('supplier') ||
    lower.includes('incorporat') ||
    lower.includes('procurement')
  ) {
    category = 'business_procurement'
  }

  // 2. Detect Indian Location
  let city = userPreferredCity || 'Srinagar'
  let state = 'Jammu & Kashmir'

  if (lower.includes('srinagar') || lower.includes('kashmir') || lower.includes('gulmarg') || lower.includes('pahalgam')) {
    city = 'Srinagar'
    state = 'Jammu & Kashmir'
  } else if (lower.includes('delhi') || lower.includes('ncr') || lower.includes('noida') || lower.includes('gurugram') || lower.includes('gurgaon')) {
    city = 'Delhi NCR'
    state = 'Delhi / Haryana'
  } else if (lower.includes('mumbai') || lower.includes('thane') || lower.includes('navi mumbai')) {
    city = 'Mumbai'
    state = 'Maharashtra'
  } else if (lower.includes('bengaluru') || lower.includes('bangalore')) {
    city = 'Bengaluru'
    state = 'Karnataka'
  } else if (lower.includes('chandigarh') || lower.includes('mohali') || lower.includes('panchkula')) {
    city = 'Chandigarh'
    state = 'Punjab & Haryana'
  } else if (lower.includes('amritsar') || lower.includes('jalandhar') || lower.includes('ludhiana')) {
    city = 'Amritsar'
    state = 'Punjab'
  } else if (lower.includes('hyderabad')) {
    city = 'Hyderabad'
    state = 'Telangana'
  } else if (lower.includes('pune')) {
    city = 'Pune'
    state = 'Maharashtra'
  }

  // 2b. Detect Overseas Country of Residence
  let detectedCountry = userCountry && userCountry !== 'Global' ? userCountry : ''
  if (!detectedCountry) {
    if (lower.includes('london') || lower.includes('uk') || lower.includes('united kingdom') || lower.includes('england')) {
      detectedCountry = 'United Kingdom'
    } else if (lower.includes('dubai') || lower.includes('uae') || lower.includes('abu dhabi') || lower.includes('sharjah')) {
      detectedCountry = 'United Arab Emirates'
    } else if (lower.includes('canada') || lower.includes('toronto') || lower.includes('vancouver')) {
      detectedCountry = 'Canada'
    } else if (lower.includes('usa') || lower.includes('us') || lower.includes('united states') || lower.includes('california') || lower.includes('new york') || lower.includes('texas')) {
      detectedCountry = 'United States'
    } else if (lower.includes('australia') || lower.includes('sydney') || lower.includes('melbourne')) {
      detectedCountry = 'Australia'
    } else if (lower.includes('singapore')) {
      detectedCountry = 'Singapore'
    } else if (lower.includes('germany') || lower.includes('europe') || lower.includes('frankfurt')) {
      detectedCountry = 'Germany / Europe'
    } else if (lower.includes('saudi') || lower.includes('riyadh') || lower.includes('jeddah')) {
      detectedCountry = 'Saudi Arabia'
    } else if (lower.includes('qatar') || lower.includes('doha')) {
      detectedCountry = 'Qatar'
    } else {
      detectedCountry = 'Global (Overseas)'
    }
  }

  // 3. Detect Frequency & Urgency
  let frequency: ExtractedPlan['frequency'] = 'one_time'
  if (lower.includes('every month') || lower.includes('monthly') || lower.includes('once a month')) {
    frequency = 'monthly'
  } else if (lower.includes('every week') || lower.includes('weekly') || lower.includes('twice a week')) {
    frequency = 'weekly'
  } else if (lower.includes('twice a month') || lower.includes('bi-weekly') || lower.includes('every two weeks')) {
    frequency = 'bi_weekly'
  } else if (lower.includes('quarterly') || lower.includes('every 3 months')) {
    frequency = 'quarterly'
  }

  let urgency: ExtractedPlan['urgency'] = 'normal'
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('immediately') || lower.includes('emergency')) {
    urgency = 'priority'
  }

  // 4. Inclusions & Budget Calculations
  const catDetails = NRI_CATEGORIES[category]
  let estimatedBudget = {
    min: 3500,
    max: 6500,
    currency: 'INR',
    is_illustrative: true,
    disclaimer: 'Illustrative planning estimate. Final quotation provided by verified local partner upon scope review.',
  }

  if (category === 'property_management') {
    if (frequency === 'monthly') {
      estimatedBudget = { min: 4999, max: 8500, currency: 'INR', is_illustrative: true, disclaimer: 'Monthly recurring plan estimate based on standard 2 visits + utility checks.' }
    } else {
      estimatedBudget = { min: 3499, max: 4999, currency: 'INR', is_illustrative: false, disclaimer: 'Standard single physical inspection with 42-point photographic dossier.' }
    }
  } else if (category === 'parent_care') {
    if (frequency === 'weekly') {
      estimatedBudget = { min: 8999, max: 12000, currency: 'INR', is_illustrative: true, disclaimer: 'Plus care plan estimate (4 companion visits/month + medicine pickup).' }
    } else {
      estimatedBudget = { min: 4999, max: 6500, currency: 'INR', is_illustrative: true, disclaimer: 'Essential care plan estimate (2 companion visits/month + pharmacy logistics).' }
    }
  } else if (category === 'legal_documents') {
    estimatedBudget = { min: 7500, max: 14000, currency: 'INR', is_illustrative: true, disclaimer: 'Consulate-compliant POA drafting and Sub-Registrar execution fee (excl. Govt stamp duty).' }
  } else if (category === 'tax_finance') {
    estimatedBudget = { min: 4999, max: 9999, currency: 'INR', is_illustrative: false, disclaimer: 'Standard NRI ITR-2 return preparation and e-filing with ICAI Chartered Accountant.' }
  } else if (category === 'travel_stays') {
    estimatedBudget = { min: 15000, max: 45000, currency: 'INR', is_illustrative: true, disclaimer: 'Curated itinerary estimate based on vehicle chauffeur days and accommodation tiers.' }
  }

  // 5. Clarification Needs
  const clarifications: string[] = []
  if (!lower.includes('srinagar') && !lower.includes('delhi') && !lower.includes('mumbai') && !lower.includes('bengaluru') && !lower.includes('chandigarh')) {
    clarifications.push(`Target city defaulted to ${city}. Confirm exact locality or address in India.`)
  }
  if (category === 'property_management' && !lower.includes('tenant') && !lower.includes('vacant')) {
    clarifications.push('Is the property currently vacant or tenant-occupied?')
  }
  if (category === 'parent_care' && !lower.includes('father') && !lower.includes('mother') && !lower.includes('parents')) {
    clarifications.push('Specify names and emergency contacts of family members receiving assistance.')
  }

  const title = `India ${catDetails.shortTitle} Plan — ${city}`
  const summary = `Coordination of ${catDetails.title.toLowerCase()} in ${city}, ${state}. Executed by vetted local specialists with timestamped proof-of-work delivered to your overseas portal.`

  return {
    confidence,
    identifiedEntities: {
      intent: catDetails.title,
      locations: [city, state],
      urgency,
      frequency,
      familyOrPropertyTerms: [category],
    },
    plan: {
      title,
      summary,
      category,
      categoryLabel: catDetails.title,
      destination_city: city,
      destination_state: state,
      country_of_residence: detectedCountry,
      frequency,
      urgency,
      estimated_budget: estimatedBudget,
      inclusions: catDetails.inclusions.slice(0, 4),
      deliverables: catDetails.sampleServices.map((s) => s.deliverable).slice(0, 3),
      clarification_needed: clarifications,
    },
  }
}

/**
 * Quick helper to extract mentioned cities and countries from a prompt for UI synchronization
 */
export function extractLocationsFromPrompt(prompt: string): { country?: string; city?: string } {
  const lower = prompt.toLowerCase()
  let city: string | undefined
  let country: string | undefined

  if (lower.includes('srinagar') || lower.includes('kashmir') || lower.includes('gulmarg') || lower.includes('pahalgam')) {
    city = 'Srinagar'
  } else if (lower.includes('delhi') || lower.includes('ncr') || lower.includes('noida') || lower.includes('gurugram') || lower.includes('gurgaon')) {
    city = 'Delhi NCR'
  } else if (lower.includes('mumbai') || lower.includes('thane') || lower.includes('navi mumbai')) {
    city = 'Mumbai'
  } else if (lower.includes('bengaluru') || lower.includes('bangalore')) {
    city = 'Bengaluru'
  } else if (lower.includes('chandigarh') || lower.includes('mohali') || lower.includes('panchkula')) {
    city = 'Chandigarh'
  } else if (lower.includes('amritsar') || lower.includes('jalandhar') || lower.includes('ludhiana')) {
    city = 'Amritsar'
  } else if (lower.includes('hyderabad')) {
    city = 'Hyderabad'
  } else if (lower.includes('pune')) {
    city = 'Pune'
  }

  if (lower.includes('london') || lower.includes('uk') || lower.includes('united kingdom') || lower.includes('england')) {
    country = 'United Kingdom'
  } else if (lower.includes('dubai') || lower.includes('uae') || lower.includes('abu dhabi') || lower.includes('sharjah')) {
    country = 'United Arab Emirates'
  } else if (lower.includes('canada') || lower.includes('toronto') || lower.includes('vancouver')) {
    country = 'Canada'
  } else if (lower.includes('usa') || lower.includes('us') || lower.includes('united states') || lower.includes('california') || lower.includes('new york') || lower.includes('texas')) {
    country = 'United States'
  } else if (lower.includes('australia') || lower.includes('sydney') || lower.includes('melbourne')) {
    country = 'Australia'
  } else if (lower.includes('singapore')) {
    country = 'Singapore'
  } else if (lower.includes('germany') || lower.includes('europe') || lower.includes('frankfurt')) {
    country = 'Germany / Europe'
  } else if (lower.includes('saudi') || lower.includes('riyadh') || lower.includes('jeddah')) {
    country = 'Saudi Arabia'
  } else if (lower.includes('qatar') || lower.includes('doha')) {
    country = 'Qatar'
  }

  return { country, city }
}

/**
 * Validates state transitions for requests
 */
export const VALID_REQUEST_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  draft: ['submitted', 'cancelled'],
  submitted: ['matching', 'cancelled'],
  matching: ['quotes_received', 'cancelled', 'rejected'],
  quotes_received: ['awaiting_customer_decision', 'cancelled', 'expired'],
  awaiting_customer_decision: ['accepted', 'cancelled', 'expired'],
  accepted: ['payment_pending', 'confirmed', 'cancelled'],
  payment_pending: ['confirmed', 'failed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled'],
  in_progress: ['proof_submitted', 'disputed'],
  proof_submitted: ['awaiting_approval', 'disputed'],
  awaiting_approval: ['completed', 'disputed'],
  completed: [],
  cancelled: [],
  rejected: [],
  expired: [],
  disputed: ['resolved' as any, 'refunded', 'in_progress'],
  refunded: [],
  failed: ['payment_pending', 'cancelled'],
}
