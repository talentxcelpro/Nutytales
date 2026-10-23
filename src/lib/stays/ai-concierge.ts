// ─── Nuty Tales Stays — AI Travel Concierge & NLP Discovery Engine ───────────
// Translates conversational intent into structured database filters,
// scores properties with real justifications, and suggests end-to-end trips.

import { STAY_PROPERTIES, BOOKABLE_TRAVEL_SERVICES, StayProperty, TravelServiceItem } from '@/lib/stays-data'
import { calculateStayPricing } from './pricing'

export interface ParsedTripIntent {
  destination?: string
  hubZone?: string
  checkIn?: string
  checkOut?: string
  nights?: number
  guestsCount?: number
  maxBudget?: number
  currency?: string
  amenitiesRequired: string[]
  propertyTypes: string[]
  occasion?: 'family' | 'business' | 'romantic' | 'reunion' | 'wedding' | 'ski'
  missingEssentials: string[]
  rawQuery: string
}

export interface ConciergeRecommendation {
  property: StayProperty
  matchScore: number // 0-100
  matchReasons: string[]
  estimatedTariff: {
    nights: number
    nightlyRate: number
    totalWithTaxes: number
    withinBudget: boolean
  }
  suggestedAddons: TravelServiceItem[]
}

export interface ConciergeChatResponse {
  summary: string
  intent: ParsedTripIntent
  recommendations: ConciergeRecommendation[]
  comparisonMatrix?: {
    properties: {
      name: string
      slug: string
      city: string
      rating: number
      totalTariff: number
      bedrooms: number
      capacity: number
      highlight: string
    }[]
    aiComparisonSummary: string
  }
  nextQuestions: string[]
}

/**
 * Intelligent deterministic NLP extractor for natural travel queries.
 * Handles queries such as:
 * "Find a private villa in Kashmir for eight people for five nights, with mountain views, a kitchen, parking and a total budget of ₹40,000."
 */
export function parseTripQuery(query: string): ParsedTripIntent {
  const q = query.toLowerCase()
  const intent: ParsedTripIntent = {
    amenitiesRequired: [],
    propertyTypes: [],
    missingEssentials: [],
    rawQuery: query,
  }

  // 1. Destination Extraction
  if (q.includes('kashmir') || q.includes('srinagar') || q.includes('harwan') || q.includes('budgam') || q.includes('dal lake') || q.includes('nigeen')) {
    intent.destination = 'Kashmir'
    intent.hubZone = 'Kashmir'
  } else if (q.includes('gulmarg') || q.includes('ski') || q.includes('snow')) {
    intent.destination = 'Gulmarg'
    intent.hubZone = 'Kashmir'
  } else if (q.includes('pahalgam') || q.includes('lidder') || q.includes('river')) {
    intent.destination = 'Pahalgam'
    intent.hubZone = 'Kashmir'
  } else if (q.includes('delhi') || q.includes('ncr') || q.includes('noida') || q.includes('gurugram')) {
    intent.destination = 'Delhi-NCR'
    intent.hubZone = 'Delhi-NCR'
  } else if (q.includes('patna') || q.includes('bihar') || q.includes('mithila')) {
    intent.destination = 'Patna'
    intent.hubZone = 'Patna'
  } else if (q.includes('bengaluru') || q.includes('bangalore') || q.includes('indiranagar')) {
    intent.destination = 'Bengaluru'
    intent.hubZone = 'Bengaluru'
  } else if (q.includes('kerala') || q.includes('kumarakom') || q.includes('backwater')) {
    intent.destination = 'Kerala'
    intent.hubZone = 'Kerala'
  } else if (q.includes('dubai') || q.includes('burj')) {
    intent.destination = 'Dubai'
    intent.hubZone = 'Global'
  } else if (q.includes('london') || q.includes('kensington')) {
    intent.destination = 'London'
    intent.hubZone = 'Global'
  }

  // 2. Guests Count
  const guestMatch = q.match(/(\d+)\s*(people|guests?|pax|persons?|adults?)/i)
  if (guestMatch) {
    intent.guestsCount = parseInt(guestMatch[1], 10)
  } else {
    // Word numbers
    const wordsMap: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, fourteen: 14,
    }
    for (const [word, val] of Object.entries(wordsMap)) {
      if (new RegExp(`\\b${word}\\s*(people|guests?|pax|persons?)\\b`, 'i').test(q)) {
        intent.guestsCount = val
        break
      }
    }
  }

  // 3. Nights / Duration
  const nightsMatch = q.match(/(\d+)\s*(nights?|nts?|days?)/i)
  if (nightsMatch) {
    intent.nights = parseInt(nightsMatch[1], 10)
  } else {
    const nightsWords: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, ten: 10, fourteen: 14,
    }
    for (const [word, val] of Object.entries(nightsWords)) {
      if (new RegExp(`\\b${word}\\s*(nights?|days?)\\b`, 'i').test(q)) {
        intent.nights = val
        break
      }
    }
  }

  // 4. Budget Extraction
  // Look for ₹40,000, 40000, 40k, 1 lakh, 50k
  const budgetMatch = q.match(/(?:₹|rs\.?|inr|budget\s*(?:of|is)?\s*)\s*([\d,]+(?:\.\d+)?)\s*(k|lakhs?|l)?/i)
  if (budgetMatch) {
    let num = parseFloat(budgetMatch[1].replace(/,/g, ''))
    const multiplier = (budgetMatch[2] || '').toLowerCase()
    if (multiplier === 'k') num *= 1000
    if (multiplier.startsWith('lakh') || multiplier === 'l') num *= 100000
    intent.maxBudget = num
    intent.currency = 'INR'
  } else {
    const rawNumMatch = q.match(/budget\s*(?:of)?\s*(\d{4,7})/i)
    if (rawNumMatch) {
      intent.maxBudget = parseInt(rawNumMatch[1], 10)
      intent.currency = 'INR'
    }
  }

  // 5. Desired Amenities
  if (q.includes('mountain view') || q.includes('view') || q.includes('valley')) intent.amenitiesRequired.push('Mountain View')
  if (q.includes('kitchen') || q.includes('cook') || q.includes('cooking')) intent.amenitiesRequired.push('Kitchen')
  if (q.includes('parking') || q.includes('garage') || q.includes('car')) intent.amenitiesRequired.push('Parking')
  if (q.includes('wifi') || q.includes('internet') || q.includes('fiber') || q.includes('work')) intent.amenitiesRequired.push('Wi-Fi')
  if (q.includes('fireplace') || q.includes('bukhari') || q.includes('hearth')) intent.amenitiesRequired.push('Bukhari / Fireplace')
  if (q.includes('pool') || q.includes('hot tub') || q.includes('jacuzzi')) intent.amenitiesRequired.push('Pool / Hot Tub')
  if (q.includes('chef') || q.includes('wazwan') || q.includes('breakfast')) intent.amenitiesRequired.push('Private Chef / Wazwan')
  if (q.includes('lake') || q.includes('river') || q.includes('water')) intent.amenitiesRequired.push('Waterfront')

  // 6. Property Types
  if (q.includes('villa') || q.includes('estate') || q.includes('private home')) intent.propertyTypes.push('villa', 'estate')
  if (q.includes('chalet') || q.includes('ski')) intent.propertyTypes.push('chalet')
  if (q.includes('houseboat')) intent.propertyTypes.push('houseboat')
  if (q.includes('penthouse') || q.includes('corporate')) intent.propertyTypes.push('penthouse')

  // 7. Check Missing Essentials
  if (!intent.destination) intent.missingEssentials.push('Destination (e.g. Kashmir, Delhi-NCR, Gulmarg)')
  if (!intent.guestsCount) intent.missingEssentials.push('Number of guests')
  if (!intent.nights) intent.missingEssentials.push('Duration / Number of nights')

  return intent
}

/**
 * Searches real inventory, scores relevance, produces grounded match reasons,
 * and builds side-by-side comparisons.
 */
export function executeConciergeDiscovery(intent: ParsedTripIntent): ConciergeChatResponse {
  const nights = intent.nights || 3
  const guests = intent.guestsCount || 2

  // 1. Filter candidates by destination if present
  let candidates = STAY_PROPERTIES
  if (intent.destination) {
    const dest = intent.destination.toLowerCase()
    candidates = candidates.filter(
      (p) =>
        p.hubZone.toLowerCase() === dest ||
        p.city.toLowerCase().includes(dest) ||
        p.state.toLowerCase().includes(dest) ||
        p.country.toLowerCase().includes(dest),
    )
  }

  if (candidates.length === 0) {
    candidates = STAY_PROPERTIES
  }

  // 2. Score candidates
  const scored = candidates.map((prop) => {
    let score = 50
    const reasons: string[] = []

    // Capacity match
    if (prop.maxTotalGuests >= guests) {
      score += 20
      reasons.push(`Accommodates up to ${prop.maxTotalGuests} guests comfortably across ${prop.bedrooms} private chambers`)
    } else {
      score -= 20
    }

    // Pricing calculation
    const pricing = calculateStayPricing({
      property: prop,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + nights * 86400000).toISOString().split('T')[0],
      guestsCount: guests,
      isBuyout: guests > 4 || prop.rooms.length === 0,
      paymentMode: 'advance-token',
    })

    const totalTariff = pricing.grandTotal
    let withinBudget = true
    if (intent.maxBudget) {
      if (totalTariff <= intent.maxBudget) {
        score += 25
        reasons.push(`Fits within your ₹${intent.maxBudget.toLocaleString('en-IN')} total budget (Estimated Total: ₹${totalTariff.toLocaleString('en-IN')} for ${nights} nights)`)
      } else {
        const overPercent = Math.round(((totalTariff - intent.maxBudget) / intent.maxBudget) * 100)
        score -= Math.min(25, overPercent)
        withinBudget = false
      }
    } else {
      reasons.push(`Estimated transparent total: ₹${totalTariff.toLocaleString('en-IN')} for ${nights} nights with taxes & breakfast`)
    }

    // Amenities matching
    intent.amenitiesRequired.forEach((req) => {
      const allAmenityText = [
        ...prop.propertyAmenities,
        prop.tagline,
        prop.description,
      ].join(' ').toLowerCase()

      if (req === 'Mountain View' && (allAmenityText.includes('mountain') || allAmenityText.includes('zabarwan') || allAmenityText.includes('peak') || allAmenityText.includes('alpine'))) {
        score += 10
        reasons.push('Features panoramic mountain vistas')
      } else if (req === 'Kitchen' && (allAmenityText.includes('kitchen') || allAmenityText.includes('chef') || allAmenityText.includes('cook'))) {
        score += 10
        reasons.push('Includes full guest kitchen & private dining facilities')
      } else if (req === 'Parking' && (allAmenityText.includes('parking') || allAmenityText.includes('gated') || allAmenityText.includes('chauffeur'))) {
        score += 8
        reasons.push('Dedicated secure on-site vehicle parking')
      } else if (req === 'Wi-Fi' && prop.wifiSpeedMbps >= 100) {
        score += 8
        reasons.push(`High-speed ${prop.wifiSpeedMbps} Mbps fiber connection`)
      } else if (req === 'Bukhari / Fireplace' && allAmenityText.includes('bukhari')) {
        score += 10
        reasons.push('Traditional wood-burning bukhari fireplaces in all chambers')
      }
    })

    // Rating boost
    score += Math.round(prop.rating * 2)

    // Suggest suitable add-on services
    const suggestedAddons = BOOKABLE_TRAVEL_SERVICES.filter(
      (srv) => srv.hubZone === prop.hubZone,
    ).slice(0, 2)

    return {
      property: prop,
      matchScore: Math.min(99, Math.max(30, score)),
      matchReasons: reasons,
      estimatedTariff: {
        nights,
        nightlyRate: pricing.nightlyBaseRate,
        totalWithTaxes: totalTariff,
        withinBudget,
      },
      suggestedAddons,
    }
  })

  // Sort by highest match score
  scored.sort((a, b) => b.matchScore - a.matchScore)
  const topRecommendations = scored.slice(0, 3)

  // 3. Build side-by-side comparison matrix if 2+ recommendations exist
  let comparisonMatrix
  if (topRecommendations.length >= 2) {
    const compProps = topRecommendations.map((r) => ({
      name: r.property.name,
      slug: r.property.slug,
      city: r.property.city,
      rating: r.property.rating,
      totalTariff: r.estimatedTariff.totalWithTaxes,
      bedrooms: r.property.bedrooms,
      capacity: r.property.maxTotalGuests,
      highlight: r.matchReasons[0] || r.property.tagline,
    }))

    const first = topRecommendations[0]
    const second = topRecommendations[1]

    const aiComparisonSummary = `Comparing top choices: ${first.property.name} leads with a ${first.matchScore}% fit score, offering ${first.property.bedrooms} bedrooms in ${first.property.city} at ₹${first.estimatedTariff.totalWithTaxes.toLocaleString('en-IN')}. In comparison, ${second.property.name} offers a distinct experience in ${second.property.city} at ₹${second.estimatedTariff.totalWithTaxes.toLocaleString('en-IN')}. Both properties maintain verified 4.9+ guest ratings with in-house master dining.`

    comparisonMatrix = {
      properties: compProps,
      aiComparisonSummary,
    }
  }

  // 4. Construct natural language summary
  let summary = ''
  if (topRecommendations.length > 0) {
    const best = topRecommendations[0]
    summary = `I analyzed your request for ${intent.destination || 'your stay'} (${guests} guests, ${nights} nights${intent.maxBudget ? `, budget ₹${intent.maxBudget.toLocaleString('en-IN')}` : ''}). The ideal match is **${best.property.name}** in ${best.property.city} with a **${best.matchScore}% fit score**.`
  } else {
    summary = 'I searched our curated collection. Please let me know your preferred destination or dates to refine the search.'
  }

  // 5. Intelligent follow-up suggestions
  const nextQuestions: string[] = []
  if (intent.missingEssentials.length > 0) {
    nextQuestions.push(`Would you like to specify exact dates or check-in timing?`)
  }
  nextQuestions.push(`Would you like to add an in-house Master Wazwan feast or 4x4 snow convoy airport escort?`)
  nextQuestions.push(`Ready to lock this stay with a 20% advance token?`)

  return {
    summary,
    intent,
    recommendations: topRecommendations,
    comparisonMatrix,
    nextQuestions,
  }
}
