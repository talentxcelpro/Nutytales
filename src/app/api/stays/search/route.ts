import { NextResponse } from 'next/server'
import { STAY_PROPERTIES, StayProperty } from '@/lib/stays-data'
import { calculateStayPricing } from '@/lib/stays/pricing'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const destination = (searchParams.get('destination') || '').trim().toLowerCase()
    const hubZone = searchParams.get('hubZone') || ''
    const category = searchParams.get('category') || 'all'
    const discovery = searchParams.get('discovery') || ''
    const checkIn = searchParams.get('checkIn') || ''
    const checkOut = searchParams.get('checkOut') || ''
    const guests = parseInt(searchParams.get('guests') || '1', 10)
    const bedrooms = parseInt(searchParams.get('bedrooms') || '0', 10)
    const propertyType = searchParams.get('propertyType') || ''
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000000')
    const maxTotalTripBudget = parseFloat(searchParams.get('maxTotalTripBudget') || '0')
    const instantBookOnly = searchParams.get('instantBook') === 'true'
    const freeCancellationOnly = searchParams.get('freeCancellation') === 'true'
    const verifiedHostOnly = searchParams.get('verifiedHost') === 'true'
    const workFriendlyOnly = searchParams.get('workFriendly') === 'true'
    const minRating = parseFloat(searchParams.get('minRating') || '0')
    const amenitiesParam = searchParams.get('amenities') || ''
    const accessibilityParam = searchParams.get('accessibility') || ''
    const sort = searchParams.get('sort') || 'relevance' // relevance, price_asc, price_desc, rating_desc

    const selectedAmenities = amenitiesParam
      ? amenitiesParam.split(',').map((s) => s.trim().toLowerCase())
      : []
    const selectedAccessibility = accessibilityParam
      ? accessibilityParam.split(',').map((s) => s.trim().toLowerCase())
      : []

    // 1. Filter Properties
    let filtered = STAY_PROPERTIES.filter((prop) => {
      // Destination / text search
      if (destination) {
        const matchLocation =
          prop.city.toLowerCase().includes(destination) ||
          prop.state.toLowerCase().includes(destination) ||
          prop.country.toLowerCase().includes(destination) ||
          prop.hubZone.toLowerCase().includes(destination) ||
          prop.name.toLowerCase().includes(destination) ||
          prop.tagline.toLowerCase().includes(destination)
        if (!matchLocation) return false
      }

      // Hub zone filter
      if (hubZone && hubZone !== 'All' && prop.hubZone !== hubZone) {
        return false
      }

      // Category filter
      if (category && category !== 'all') {
        const matchesCat =
          prop.category === category || prop.secondaryCategories.includes(category as any)
        if (!matchesCat) return false
      }

      // Discovery collection filter
      if (discovery && !prop.discoveryCollections.includes(discovery as any)) {
        return false
      }

      // Guests capacity
      if (guests > 0 && prop.maxTotalGuests < guests) {
        return false
      }

      // Bedrooms
      if (bedrooms > 0 && prop.bedrooms < bedrooms) {
        return false
      }

      // Property type
      if (propertyType && prop.propertyType !== propertyType) {
        return false
      }

      // Nightly base price filter
      const effectiveNightly = prop.estateBuyoutPrice
      if (effectiveNightly < minPrice || effectiveNightly > maxPrice) {
        return false
      }

      // Instant book
      if (instantBookOnly && !prop.instantBook) {
        return false
      }

      // Free cancellation
      if (freeCancellationOnly && !prop.freeCancellation) {
        return false
      }

      // Verified host
      if (verifiedHostOnly && !prop.host.verified) {
        return false
      }

      // Work friendly
      if (workFriendlyOnly && (!prop.workFriendly || prop.wifiSpeedMbps < 100)) {
        return false
      }

      // Min rating
      if (minRating > 0 && prop.rating < minRating) {
        return false
      }

      // Amenities filter
      if (selectedAmenities.length > 0) {
        const allAmenityText = prop.propertyAmenities.join(' ').toLowerCase()
        const hasAll = selectedAmenities.every((amenity) => allAmenityText.includes(amenity))
        if (!hasAll) return false
      }

      // Accessibility filter
      if (selectedAccessibility.length > 0) {
        const allAccessText = prop.accessibilityFeatures.join(' ').toLowerCase()
        const hasAccess = selectedAccessibility.every((acc) => allAccessText.includes(acc))
        if (!hasAccess) return false
      }

      return true
    })

    // 2. Compute dynamic pricing for results
    const results = filtered.map((prop) => {
      const pricing = calculateStayPricing({
        property: prop,
        checkIn: checkIn || new Date().toISOString().split('T')[0],
        checkOut: checkOut || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        guestsCount: guests,
        isBuyout: guests > 4 || prop.rooms.length === 0,
      })
      return {
        ...prop,
        calculatedPricing: pricing,
      }
    })

    // Filter by total trip budget if specified
    let finalResults = results
    if (maxTotalTripBudget > 0) {
      finalResults = results.filter((r) => r.calculatedPricing.grandTotal <= maxTotalTripBudget)
    }

    // 3. Sorting
    if (sort === 'price_asc') {
      finalResults.sort((a, b) => a.estateBuyoutPrice - b.estateBuyoutPrice)
    } else if (sort === 'price_desc') {
      finalResults.sort((a, b) => b.estateBuyoutPrice - a.estateBuyoutPrice)
    } else if (sort === 'rating_desc') {
      finalResults.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
    }

    return NextResponse.json({
      success: true,
      totalCount: finalResults.length,
      properties: finalResults,
      meta: {
        destination,
        hubZone,
        category,
        checkIn,
        checkOut,
        guests,
        sort,
      },
    })
  } catch (err: any) {
    console.error('[API Stays Search] Error:', err)
    return NextResponse.json({ error: err.message || 'Search failed.' }, { status: 500 })
  }
}
