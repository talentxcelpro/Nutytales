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

  // 1. Detect Category via Multi-Signal Weighted Scoring
  const categoryScores: Record<ServiceCategoryKey, number> = {
    property_management: 0,
    parent_care: 0,
    healthcare: 0,
    legal_documents: 0,
    tax_finance: 0,
    home_services: 0,
    travel_stays: 0,
    weddings_events: 0,
    gifting_deliveries: 0,
    crafts_heritage: 0,
    business_procurement: 0,
  }

  // A. Property Management Signals
  if (lower.includes('property i need inspected') || lower.includes('inspect my') || lower.includes('flat inspected') || lower.includes('house inspected') || lower.includes('property inspected')) {
    categoryScores.property_management += 25
  }
  if (lower.includes('inspect') || lower.includes('inspection') || lower.includes('walkthrough') || lower.includes('caretaker') || lower.includes('society maintenance') || lower.includes('tenant') || lower.includes('meter reading') || lower.includes('key hold')) {
    categoryScores.property_management += 12
  }
  if (lower.includes('property') || lower.includes('flat') || lower.includes('apartment') || lower.includes('house') || lower.includes('villa') || lower.includes('vacant') || lower.includes('plot')) {
    categoryScores.property_management += 6
  }

  // B. Parent & Elder Care Signals
  if (lower.includes('visit my elderly') || lower.includes('check on my mother') || lower.includes('check on my father') || lower.includes('elderly mother') || lower.includes('elderly father') || lower.includes('visit them') || lower.includes('companion for')) {
    categoryScores.parent_care += 25
  }
  if (lower.includes('elder') || lower.includes('senior') || lower.includes('companion') || lower.includes('medicine pickup') || lower.includes('grocer')) {
    categoryScores.parent_care += 12
  }
  if (lower.includes('parents') || lower.includes('mother') || lower.includes('father') || lower.includes('family')) {
    if (lower.includes('parents live in') || lower.includes('mother lives in') || lower.includes('father lives in') || lower.includes('family lives in')) {
      categoryScores.parent_care += 2 // Passive residence context
    } else {
      categoryScores.parent_care += 7
    }
  }

  // C. Healthcare Signals
  if (lower.includes('hospital escort') || lower.includes('medical escort') || lower.includes('cardiology') || lower.includes('doctor consultation') || lower.includes('accompanied doctor')) {
    categoryScores.healthcare += 25
  }
  if (lower.includes('doctor') || lower.includes('hospital') || lower.includes('opd') || lower.includes('blood test') || lower.includes('diagnostic') || lower.includes('caregiver') || lower.includes('physician') || lower.includes('clinic')) {
    categoryScores.healthcare += 14
  }

  // D. Legal & Documents Signals
  if (lower.includes('power of attorney') || lower.includes('poa') || lower.includes('lawyer') || lower.includes('advocate') || lower.includes('sub-registrar') || lower.includes('bar council') || lower.includes('encumbrance certificate')) {
    categoryScores.legal_documents += 25
  }
  if (lower.includes('legal') || lower.includes('deed') || lower.includes('notary') || lower.includes('affidavit') || lower.includes('revenue') || lower.includes('fard') || lower.includes('jamabandi') || lower.includes('khata') || lower.includes('mutation') || lower.includes('registry')) {
    categoryScores.legal_documents += 14
  }

  // E. Tax & Finance Signals
  if (lower.includes('15ca') || lower.includes('15cb') || lower.includes('fema') || lower.includes('repatriat') || lower.includes('chartered accountant')) {
    categoryScores.tax_finance += 25
  }
  if (lower.includes('tax') || lower.includes('itr') || lower.includes('capital gain') || lower.includes('ca ')) {
    categoryScores.tax_finance += 12
  }

  // F. Home Services Signals
  if (lower.includes('electrician') || lower.includes('plumber') || lower.includes('carpenter') || lower.includes('deep clean') || lower.includes('waterproofing') || lower.includes('seepage repair')) {
    categoryScores.home_services += 25
  }
  if (lower.includes('repair') || lower.includes('leak') || lower.includes('paint') || lower.includes('clean') || lower.includes('renovat') || lower.includes('fix ')) {
    categoryScores.home_services += 10
  }

  // G. Travel & Stays Signals
  if (lower.includes('chauffeur') || lower.includes('airport pickup') || lower.includes('suv') || lower.includes('itinerary builder') || lower.includes('homestay') || lower.includes('ancestral tour')) {
    categoryScores.travel_stays += 25
  }
  if (lower.includes('travel') || lower.includes('holiday') || lower.includes('tour') || lower.includes('stay') || lower.includes('villa stay')) {
    categoryScores.travel_stays += 10
  }

  // H. Weddings & Events Signals
  if (lower.includes('wedding') || lower.includes('marriage') || lower.includes('reception') || lower.includes('wazwan') || lower.includes('trousseau') || lower.includes('nikah')) {
    categoryScores.weddings_events += 25
  }

  // I. Gifting Signals
  if (lower.includes('gift box') || lower.includes('hamper') || lower.includes('dry fruit box') || lower.includes('sweets delivery') || lower.includes('anniversary gift')) {
    categoryScores.gifting_deliveries += 25
  }
  if (lower.includes('gift') || lower.includes('deliver sweets')) {
    categoryScores.gifting_deliveries += 10
  }

  // J. Crafts & Heritage Signals
  if (lower.includes('pashmina') || lower.includes('kani') || lower.includes('walnut wood') || lower.includes('hand-knotted') || lower.includes('silk rug')) {
    categoryScores.crafts_heritage += 25
  }
  if (lower.includes('shawl') || lower.includes('carpet') || lower.includes('craft') || lower.includes('rug')) {
    categoryScores.crafts_heritage += 10
  }

  // K. Business & Procurement Signals
  if (lower.includes('factory audit') || lower.includes('supplier audit') || lower.includes('vendor audit') || lower.includes('nabl testing')) {
    categoryScores.business_procurement += 25
  }
  if (lower.includes('business') || lower.includes('procurement') || lower.includes('incorporat') || lower.includes('supplier')) {
    categoryScores.business_procurement += 10
  }

  // Determine Winning Category
  let maxScore = 0
  let topCategory: ServiceCategoryKey = 'property_management'
  for (const [catKey, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score
      topCategory = catKey as ServiceCategoryKey
    }
  }

  let category: ServiceCategoryKey = topCategory
  let confidence = maxScore >= 20 ? 0.95 : maxScore >= 10 ? 0.85 : 0.70

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
    // Identify which location is associated with property vs family using clause-safe boundaries
    let propertyTarget: CityNormalization | null = null
    let familyTarget: CityNormalization | null = null

    for (const loc of matchedLocations) {
      // Safe window before
      const rawBefore = lower.substring(0, loc.index)
      const lastBreakBefore = rawBefore.search(/[,;.]\s*(but|while|however|although)\s*$/)
      const windowBefore = lastBreakBefore !== -1
        ? rawBefore.substring(lastBreakBefore)
        : rawBefore.substring(Math.max(0, loc.index - 40))

      // Safe window after (cut off at next clause break)
      const rawAfter = lower.substring(loc.index + loc.key.length)
      const nextBreakAfter = rawAfter.search(/[,;.]\s*(but|while|however|although|and)/)
      const windowAfter = nextBreakAfter !== -1
        ? rawAfter.substring(0, nextBreakAfter)
        : rawAfter.substring(0, Math.min(rawAfter.length, 40))

      const combinedWindow = `${windowBefore} ${windowAfter}`

      if (
        combinedWindow.includes('property') ||
        combinedWindow.includes('flat') ||
        combinedWindow.includes('house') ||
        combinedWindow.includes('apartment') ||
        combinedWindow.includes('plot') ||
        combinedWindow.includes('inspect')
      ) {
        propertyTarget = loc.data
      }

      if (
        combinedWindow.includes('parent') ||
        combinedWindow.includes('father') ||
        combinedWindow.includes('mother') ||
        combinedWindow.includes('family') ||
        combinedWindow.includes('elder')
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
      if (propertyTarget && propertyTarget.city !== familyTarget.city) {
        familyCity = propertyTarget.city
      }
    } else {
      // Default to the last mentioned location (usually the operative destination clause)
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
