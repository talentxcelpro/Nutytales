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

export interface CityNormalization {
  city: string
  state: string
  region: 'North' | 'West' | 'South' | 'East' | 'Central'
}

export const CITY_ALIASES: Record<string, CityNormalization> = {
  // North India
  'delhi': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'delhi ncr': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'new delhi': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'noida': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'greater noida': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'gurgaon': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'gurugram': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'faridabad': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'ghaziabad': { city: 'Delhi NCR', state: 'Delhi / Haryana / UP', region: 'North' },
  'chandigarh': { city: 'Chandigarh / Tricity', state: 'Punjab & Haryana', region: 'North' },
  'mohali': { city: 'Chandigarh / Tricity', state: 'Punjab & Haryana', region: 'North' },
  'panchkula': { city: 'Chandigarh / Tricity', state: 'Punjab & Haryana', region: 'North' },
  'amritsar': { city: 'Amritsar', state: 'Punjab', region: 'North' },
  'jalandhar': { city: 'Amritsar', state: 'Punjab', region: 'North' },
  'ludhiana': { city: 'Amritsar', state: 'Punjab', region: 'North' },
  'punjab': { city: 'Amritsar', state: 'Punjab', region: 'North' },
  'jaipur': { city: 'Jaipur', state: 'Rajasthan', region: 'North' },
  'rajasthan': { city: 'Jaipur', state: 'Rajasthan', region: 'North' },
  'udaipur': { city: 'Jaipur', state: 'Rajasthan', region: 'North' },
  'jodhpur': { city: 'Jaipur', state: 'Rajasthan', region: 'North' },
  'lucknow': { city: 'Lucknow', state: 'Uttar Pradesh', region: 'North' },
  'kanpur': { city: 'Lucknow', state: 'Uttar Pradesh', region: 'North' },
  'srinagar': { city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North' },
  'kashmir': { city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North' },
  'gulmarg': { city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North' },
  'pahalgam': { city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North' },
  'jammu': { city: 'Jammu', state: 'Jammu & Kashmir', region: 'North' },
  'dehradun': { city: 'Dehradun', state: 'Uttarakhand', region: 'North' },

  // West India
  'mumbai': { city: 'Mumbai', state: 'Maharashtra', region: 'West' },
  'bombay': { city: 'Mumbai', state: 'Maharashtra', region: 'West' },
  'thane': { city: 'Mumbai', state: 'Maharashtra', region: 'West' },
  'navi mumbai': { city: 'Mumbai', state: 'Maharashtra', region: 'West' },
  'bandra': { city: 'Mumbai', state: 'Maharashtra', region: 'West' },
  'pune': { city: 'Pune', state: 'Maharashtra', region: 'West' },
  'poona': { city: 'Pune', state: 'Maharashtra', region: 'West' },
  'ahmedabad': { city: 'Ahmedabad', state: 'Gujarat', region: 'West' },
  'gujarat': { city: 'Ahmedabad', state: 'Gujarat', region: 'West' },
  'surat': { city: 'Ahmedabad', state: 'Gujarat', region: 'West' },
  'goa': { city: 'Goa', state: 'Goa', region: 'West' },
  'panaji': { city: 'Goa', state: 'Goa', region: 'West' },

  // South India
  'bengaluru': { city: 'Bengaluru', state: 'Karnataka', region: 'South' },
  'bangalore': { city: 'Bengaluru', state: 'Karnataka', region: 'South' },
  'whitefield': { city: 'Bengaluru', state: 'Karnataka', region: 'South' },
  'chennai': { city: 'Chennai', state: 'Tamil Nadu', region: 'South' },
  'madras': { city: 'Chennai', state: 'Tamil Nadu', region: 'South' },
  'tamil nadu': { city: 'Chennai', state: 'Tamil Nadu', region: 'South' },
  'hyderabad': { city: 'Hyderabad', state: 'Telangana', region: 'South' },
  'secunderabad': { city: 'Hyderabad', state: 'Telangana', region: 'South' },
  'telangana': { city: 'Hyderabad', state: 'Telangana', region: 'South' },
  'kochi': { city: 'Kochi & Kerala', state: 'Kerala', region: 'South' },
  'cochin': { city: 'Kochi & Kerala', state: 'Kerala', region: 'South' },
  'kerala': { city: 'Kochi & Kerala', state: 'Kerala', region: 'South' },
  'trivandrum': { city: 'Kochi & Kerala', state: 'Kerala', region: 'South' },
  'thiruvananthapuram': { city: 'Kochi & Kerala', state: 'Kerala', region: 'South' },

  // East India
  'kolkata': { city: 'Kolkata', state: 'West Bengal', region: 'East' },
  'calcutta': { city: 'Kolkata', state: 'West Bengal', region: 'East' },
  'bengal': { city: 'Kolkata', state: 'West Bengal', region: 'East' },
  'patna': { city: 'Patna & Bihar', state: 'Bihar', region: 'East' },
  'bihar': { city: 'Patna & Bihar', state: 'Bihar', region: 'East' },
  'bhubaneswar': { city: 'Bhubaneswar', state: 'Odisha', region: 'East' },

  // Central India
  'bhopal': { city: 'Bhopal', state: 'Madhya Pradesh', region: 'Central' },
  'indore': { city: 'Indore', state: 'Madhya Pradesh', region: 'Central' },
}

/**
 * Parses user natural language request into a structured India Execution Plan
 */
export function interpretNaturalLanguageRequest(
  prompt: string,
  userCountry: string = 'United States',
  userPreferredCity: string = ''
): ParsedRequestResult {
  const p = prompt.trim()
  const lower = p.toLowerCase()

  // 1. Detect Category
  let category: ServiceCategoryKey = 'property_management'
  let confidence = 0.85

  if (
    lower.includes('electrician') ||
    lower.includes('plumber') ||
    lower.includes('carpenter') ||
    lower.includes('repair') ||
    lower.includes('leak') ||
    lower.includes('paint') ||
    lower.includes('clean') ||
    lower.includes('renovat') ||
    lower.includes('plumb') ||
    lower.includes('electr') ||
    lower.includes('waterproof') ||
    lower.includes('seepage') ||
    lower.includes('fix ')
  ) {
    category = 'home_services'
  } else if (
    lower.includes('doctor') ||
    lower.includes('hospital') ||
    lower.includes('opd') ||
    lower.includes('blood test') ||
    lower.includes('diagnostic') ||
    lower.includes('caregiver') ||
    lower.includes('physician') ||
    lower.includes('clinic') ||
    lower.includes('health')
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
    lower.includes('grocer') ||
    lower.includes('family')
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
    lower.includes('jamabandi') ||
    lower.includes('khata') ||
    lower.includes('mutation')
  ) {
    category = 'legal_documents'
  } else if (
    lower.includes('tax') ||
    lower.includes('itr') ||
    lower.includes('15ca') ||
    lower.includes('15cb') ||
    lower.includes('fema') ||
    lower.includes('ca ') ||
    lower.includes('chartered accountant') ||
    lower.includes('capital gain') ||
    lower.includes('repatriat')
  ) {
    category = 'tax_finance'
  } else if (
    lower.includes('travel') ||
    lower.includes('holiday') ||
    lower.includes('stay') ||
    lower.includes('villa stay') ||
    lower.includes('airport pickup') ||
    lower.includes('chauffeur') ||
    lower.includes('suv') ||
    lower.includes('tour') ||
    lower.includes('itinerary')
  ) {
    category = 'travel_stays'
  } else if (
    lower.includes('wedding') ||
    lower.includes('marriage') ||
    lower.includes('reception') ||
    lower.includes('venue') ||
    lower.includes('cater') ||
    lower.includes('wazwan') ||
    lower.includes('nikah')
  ) {
    category = 'weddings_events'
  } else if (
    lower.includes('gift') ||
    lower.includes('hamper') ||
    lower.includes('deliver') ||
    lower.includes('birthday') ||
    lower.includes('anniversary') ||
    lower.includes('sweets') ||
    lower.includes('dry fruit box')
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
    lower.includes('procurement') ||
    lower.includes('vendor audit')
  ) {
    category = 'business_procurement'
  } else if (
    lower.includes('inspect') ||
    lower.includes('inspection') ||
    lower.includes('property') ||
    lower.includes('house') ||
    lower.includes('flat') ||
    lower.includes('apartment') ||
    lower.includes('tenant') ||
    lower.includes('caretaker') ||
    lower.includes('meter') ||
    lower.includes('lock')
  ) {
    category = 'property_management'
  }

  // 2. Intelligent Context-Aware Location Extraction
  // Find all matching locations and their roles in the sentence
  const matchedLocations: { key: string; index: number; data: CityNormalization }[] = []
  for (const [alias, data] of Object.entries(CITY_ALIASES)) {
    const idx = lower.indexOf(alias)
    if (idx !== -1) {
      // Ensure it's not a substring of a larger word
      const prevChar = idx > 0 ? lower[idx - 1] : ' '
      const nextChar = idx + alias.length < lower.length ? lower[idx + alias.length] : ' '
      if (/[\s,.;!?()-]/.test(prevChar) && /[\s,.;!?()-]/.test(nextChar)) {
        matchedLocations.push({ key: alias, index: idx, data })
      }
    }
  }

  // Sort by appearance index
  matchedLocations.sort((a, b) => a.index - b.index)

  let destinationCity = userPreferredCity || ''
  let destinationState = 'Pan-India'
  let familyCity: string | undefined = undefined

  if (matchedLocations.length === 1) {
    destinationCity = matchedLocations[0].data.city
    destinationState = matchedLocations[0].data.state
  } else if (matchedLocations.length > 1) {
    // Multi-location prompt detected (e.g. "My parents live in Delhi, but the property I need inspected is in Jaipur")
    // Identify which location is associated with the property vs family
    let propertyTarget: CityNormalization | null = null
    let familyTarget: CityNormalization | null = null

    for (const loc of matchedLocations) {
      const windowBefore = lower.substring(Math.max(0, loc.index - 35), loc.index)
      const windowAfter = lower.substring(loc.index, Math.min(lower.length, loc.index + loc.key.length + 35))

      if (
        windowBefore.includes('property') ||
        windowBefore.includes('flat') ||
        windowBefore.includes('house') ||
        windowBefore.includes('apartment') ||
        windowBefore.includes('plot') ||
        windowBefore.includes('inspected') ||
        windowAfter.includes('property') ||
        windowAfter.includes('flat') ||
        windowAfter.includes('house') ||
        windowAfter.includes('apartment')
      ) {
        propertyTarget = loc.data
      }

      if (
        windowBefore.includes('parent') ||
        windowBefore.includes('father') ||
        windowBefore.includes('mother') ||
        windowBefore.includes('family') ||
        windowAfter.includes('parent') ||
        windowAfter.includes('father') ||
        windowAfter.includes('mother') ||
        windowAfter.includes('family')
      ) {
        familyTarget = loc.data
      }
    }

    if (propertyTarget && (category === 'property_management' || category === 'home_services')) {
      destinationCity = propertyTarget.city
      destinationState = propertyTarget.state
      if (familyTarget && familyTarget.city !== propertyTarget.city) {
        familyCity = familyTarget.city
      }
    } else if (familyTarget && (category === 'parent_care' || category === 'healthcare')) {
      destinationCity = familyTarget.city
      destinationState = familyTarget.state
    } else {
      // Default to the last mentioned location (usually the action destination)
      const lastLoc = matchedLocations[matchedLocations.length - 1]
      destinationCity = lastLoc.data.city
      destinationState = lastLoc.data.state
      familyCity = matchedLocations[0].data.city
    }
  }

  // If no city detected in prompt and no user preference, default to neutral central hub
  if (!destinationCity) {
    destinationCity = 'Delhi NCR'
    destinationState = 'Delhi / Haryana / UP'
  }

  // 3. Detect Overseas Country of Residence
  let detectedCountry = userCountry && userCountry !== 'Global' ? userCountry : ''
  if (!detectedCountry) {
    if (lower.includes('london') || lower.includes('uk') || lower.includes('united kingdom') || lower.includes('england') || lower.includes('birmingham') || lower.includes('manchester')) {
      detectedCountry = 'United Kingdom'
    } else if (lower.includes('dubai') || lower.includes('uae') || lower.includes('abu dhabi') || lower.includes('sharjah') || lower.includes('emirates')) {
      detectedCountry = 'United Arab Emirates'
    } else if (lower.includes('canada') || lower.includes('toronto') || lower.includes('vancouver') || lower.includes('calgary') || lower.includes('brampton')) {
      detectedCountry = 'Canada'
    } else if (lower.includes('usa') || lower.includes('us ') || lower.includes('united states') || lower.includes('california') || lower.includes('new york') || lower.includes('texas') || lower.includes('new jersey') || lower.includes('chicago')) {
      detectedCountry = 'United States'
    } else if (lower.includes('australia') || lower.includes('sydney') || lower.includes('melbourne') || lower.includes('brisbane')) {
      detectedCountry = 'Australia'
    } else if (lower.includes('singapore')) {
      detectedCountry = 'Singapore'
    } else if (lower.includes('germany') || lower.includes('europe') || lower.includes('frankfurt') || lower.includes('berlin')) {
      detectedCountry = 'Germany / Europe'
    } else if (lower.includes('saudi') || lower.includes('riyadh') || lower.includes('jeddah')) {
      detectedCountry = 'Saudi Arabia'
    } else if (lower.includes('qatar') || lower.includes('doha')) {
      detectedCountry = 'Qatar'
    } else {
      detectedCountry = 'Global (Overseas)'
    }
  }

  // 4. Detect Frequency & Urgency
  let frequency: ExtractedPlan['frequency'] = 'one_time'
  if (lower.includes('every month') || lower.includes('monthly') || lower.includes('once a month')) {
    frequency = 'monthly'
  } else if (lower.includes('every week') || lower.includes('weekly') || lower.includes('twice a week')) {
    frequency = 'weekly'
  } else if (lower.includes('twice a month') || lower.includes('bi-weekly') || lower.includes('every two weeks') || lower.includes('regular visits') || lower.includes('regular visit') || lower.includes('regularly')) {
    frequency = 'bi_weekly'
  } else if (lower.includes('quarterly') || lower.includes('every 3 months')) {
    frequency = 'quarterly'
  }

  let urgency: ExtractedPlan['urgency'] = 'normal'
  if (lower.includes('urgent') || lower.includes('asap') || lower.includes('immediately') || lower.includes('emergency') || lower.includes('within 48')) {
    urgency = 'priority'
  }

  // 5. Inclusions & Budget Calculations
  const catDetails = NRI_CATEGORIES[category] || NRI_CATEGORIES['property_management']
  let estimatedBudget = {
    min: 3500,
    max: 6500,
    currency: 'INR',
    is_illustrative: true,
    disclaimer: 'System-calculated planning estimate. Formal quotation confirmed by on-ground supervisor after scope verification.',
  }

  if (category === 'property_management') {
    if (frequency === 'monthly') {
      estimatedBudget = { min: 4999, max: 8500, currency: 'INR', is_illustrative: true, disclaimer: 'Monthly recurring plan estimate based on 2 physical walkthroughs + utility ledgers.' }
    } else {
      estimatedBudget = { min: 3499, max: 4999, currency: 'INR', is_illustrative: true, disclaimer: 'Single physical inspection with 42-point photographic dossier & meter verification.' }
    }
  } else if (category === 'parent_care') {
    if (frequency === 'weekly') {
      estimatedBudget = { min: 8999, max: 12000, currency: 'INR', is_illustrative: true, disclaimer: 'Comprehensive elder assistance plan (4 companion visits/month + pharmacy logistics).' }
    } else {
      estimatedBudget = { min: 4999, max: 6500, currency: 'INR', is_illustrative: true, disclaimer: 'Essential elder assistance plan (2 companion visits/month + medicine delivery).' }
    }
  } else if (category === 'legal_documents') {
    estimatedBudget = { min: 7500, max: 14000, currency: 'INR', is_illustrative: true, disclaimer: 'Drafting & Sub-Registrar liaison by Bar Council advocate (excl. official stamp duty).' }
  } else if (category === 'tax_finance') {
    estimatedBudget = { min: 4999, max: 9999, currency: 'INR', is_illustrative: true, disclaimer: 'Standard NRI ITR preparation / 15CA certification with ICAI Chartered Accountant.' }
  } else if (category === 'travel_stays') {
    estimatedBudget = { min: 15000, max: 45000, currency: 'INR', is_illustrative: true, disclaimer: 'Bespoke itinerary estimate based on chauffeur days and private accommodation.' }
  } else if (category === 'home_services') {
    estimatedBudget = { min: 1999, max: 5999, currency: 'INR', is_illustrative: true, disclaimer: 'Standard technician visit + scope audit (material charges invoiced separately).' }
  }

  // 6. Clarification Needs
  const clarifications: string[] = []
  if (familyCity) {
    clarifications.push(`Family residence noted in ${familyCity}. Target property service mapped to ${destinationCity}.`)
  }
  if (category === 'property_management' && !lower.includes('tenant') && !lower.includes('vacant')) {
    clarifications.push('Is the property currently vacant or tenant-occupied?')
  }
  if (category === 'parent_care' && !lower.includes('father') && !lower.includes('mother') && !lower.includes('parents')) {
    clarifications.push('Specify names and emergency contact details for receiving family members.')
  }
  if (category === 'home_services' && !lower.includes('electric') && !lower.includes('plumb') && !lower.includes('paint')) {
    clarifications.push('Clarify specific trade requirement (electrical, plumbing, carpentry, or civil masonry).')
  }

  const title = `India ${catDetails.shortTitle} Plan — ${destinationCity}`
  const summary = `Coordination of ${catDetails.title.toLowerCase()} in ${destinationCity}, ${destinationState}. Executed by vetted specialists with GPS-timestamped photographic proof delivered to your overseas dashboard.`

  return {
    confidence,
    identifiedEntities: {
      intent: catDetails.title,
      locations: [destinationCity, destinationState],
      urgency,
      frequency,
      familyOrPropertyTerms: [category],
    },
    plan: {
      title,
      summary,
      category,
      categoryLabel: catDetails.title,
      destination_city: destinationCity,
      destination_state: destinationState,
      family_city: familyCity,
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
export function extractLocationsFromPrompt(prompt: string): { country?: string; city?: string; familyCity?: string } {
  const result = interpretNaturalLanguageRequest(prompt)
  return {
    country: result.plan.country_of_residence,
    city: result.plan.destination_city,
    familyCity: result.plan.family_city,
  }
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
