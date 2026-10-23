// ─── GET /api/stays/ical/export ───────────────────────────────────────────────
// RFC 5545 iCalendar feed export endpoint for Airbnb, Booking.com, VRBO, Apple & Google Cal.

import { NextRequest, NextResponse } from 'next/server'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { getConfirmedReservationsForProperty } from '@/lib/stays/stays-store'
import { generatePropertyIcalFeed } from '@/lib/stays/ical-sync'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return new NextResponse('Property slug query parameter is required (?slug=...)', { status: 400 })
    }

    const property = STAY_PROPERTIES.find((p) => p.slug === slug)
    if (!property) {
      return new NextResponse('Property not found', { status: 404 })
    }

    // Retrieve active confirmed bookings
    const confirmedReservations = getConfirmedReservationsForProperty(slug)
    const bookings = confirmedReservations.map((res) => ({
      bookingRef: res.bookingRef,
      checkIn: res.checkIn,
      checkOut: res.checkOut,
      guestName: res.guestName,
    }))

    // Generate strict RFC 5545 feed
    const icsText = generatePropertyIcalFeed(slug, bookings)

    return new NextResponse(icsText, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `inline; filename="nutytales-${slug}.ics"`,
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
      },
    })
  } catch (err: any) {
    return new NextResponse(`Error generating iCal feed: ${err.message}`, { status: 500 })
  }
}
