// ─── GET /api/stays/availability ──────────────────────────────────────────────
// Returns day-by-day availability heatmap and dynamic pricing matrix for a property.
// Considers booked reservations, external iCal blocks, seasonal rates, and weekend surges.

import { NextRequest, NextResponse } from 'next/server'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { getConfirmedReservationsForProperty } from '@/lib/stays/stays-store'
import { getBlockedDatesForProperty } from '@/lib/stays/ical-sync'
import { calculateStayPricing } from '@/lib/stays/pricing'

export interface DayAvailabilityInfo {
  date: string // YYYY-MM-DD
  dayOfWeek: number // 0 (Sun) - 6 (Sat)
  dayNumber: number // 1 - 31
  month: number // 0 - 11
  year: number
  price: number
  available: boolean
  status: 'available' | 'booked' | 'blocked_ical' | 'past'
  reason?: string
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    const monthParam = searchParams.get('month') // e.g. "2026-11"
    const roomId = searchParams.get('roomId') || undefined
    const isBuyout = searchParams.get('isBuyout') !== 'false'

    if (!slug) {
      return NextResponse.json({ error: 'Property slug is required.' }, { status: 400 })
    }

    const property = STAY_PROPERTIES.find((p) => p.slug === slug)
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 })
    }

    // Determine target start date (today or requested month)
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    let startDate: Date
    if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
      const [year, month] = monthParam.split('-').map(Number)
      startDate = new Date(year, month - 1, 1)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // Generate 60 days (current month + next month)
    const daysCount = 62
    const confirmedBookings = getConfirmedReservationsForProperty(slug)
    const externalBlocks = getBlockedDatesForProperty(slug)

    const days: DayAvailabilityInfo[] = []

    for (let i = 0; i < daysCount; i++) {
      const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i)
      const currentIso = current.toISOString().split('T')[0]
      const curTime = current.getTime()
      const isPast = currentIso < todayStr

      // Check conflict with confirmed Nutytales bookings
      let status: DayAvailabilityInfo['status'] = 'available'
      let reason: string | undefined = undefined

      if (isPast) {
        status = 'past'
        reason = 'Past date'
      } else {
        // Check confirmed bookings
        const booked = confirmedBookings.find((res) => {
          const bIn = new Date(res.checkIn).getTime()
          const bOut = new Date(res.checkOut).getTime()
          // Active on current night if current >= checkIn and current < checkOut
          if (curTime >= bIn && curTime < bOut) {
            if (res.isBuyout || isBuyout) return true
            if (roomId && res.roomId === roomId) return true
            return false
          }
          return false
        })

        if (booked) {
          status = 'booked'
          reason = `Reserved (${booked.bookingRef})`
        } else {
          // Check external iCal blocks
          const icalBlock = externalBlocks.find((b) => {
            const bIn = new Date(b.startDate).getTime()
            const bOut = new Date(b.endDate).getTime()
            return curTime >= bIn && curTime < bOut
          })

          if (icalBlock) {
            status = 'blocked_ical'
            reason = icalBlock.summary || `Blocked via ${icalBlock.source.toUpperCase()}`
          }
        }
      }

      // Compute nightly dynamic price for this day
      // 1-night calculation
      const nextDay = new Date(curTime + 86400000).toISOString().split('T')[0]
      const priceCalculation = calculateStayPricing({
        property,
        checkIn: currentIso,
        checkOut: nextDay,
        guestsCount: 2,
        isBuyout,
        roomId,
      })

      days.push({
        date: currentIso,
        dayOfWeek: current.getDay(),
        dayNumber: current.getDate(),
        month: current.getMonth(),
        year: current.getFullYear(),
        price: priceCalculation.nightlyBaseRate,
        available: status === 'available',
        status,
        reason,
      })
    }

    return NextResponse.json({
      success: true,
      slug: property.slug,
      propertyName: property.name,
      baseBuyoutPrice: property.estateBuyoutPrice,
      minStayNights: property.category === 'buyouts' ? 2 : 1,
      cancellationPolicy: property.cancellationPolicy,
      days,
      bookedRanges: [
        ...confirmedBookings.map((b) => ({
          startDate: b.checkIn,
          endDate: b.checkOut,
          source: 'nutytales',
          summary: `Reserved (${b.bookingRef})`,
        })),
        ...externalBlocks.map((b) => ({
          startDate: b.startDate,
          endDate: b.endDate,
          source: b.source,
          summary: b.summary,
        })),
      ],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch availability.' }, { status: 500 })
  }
}
