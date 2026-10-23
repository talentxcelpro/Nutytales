// ─── /api/stays/ical/import ───────────────────────────────────────────────
// Ingests external iCal feeds from Airbnb, Booking.com, VRBO to block conflicting dates.

import { NextRequest, NextResponse } from 'next/server'
import {
  importExternalIcalFeed,
  getBlockedDatesForProperty,
  getIcalSubscriptions,
} from '@/lib/stays/ical-sync'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Property slug is required.' }, { status: 400 })
    }

    const subscriptions = getIcalSubscriptions(slug)
    const blockedDates = getBlockedDatesForProperty(slug)

    return NextResponse.json({
      success: true,
      slug,
      subscriptions,
      blockedDates,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to get iCal subscriptions.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertySlug, icalUrl, sourceName } = body

    if (!propertySlug || !icalUrl) {
      return NextResponse.json(
        { error: 'Property slug and icalUrl (or raw .ics text) are required.' },
        { status: 400 },
      )
    }

    const result = await importExternalIcalFeed(
      propertySlug,
      icalUrl,
      sourceName || 'airbnb',
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to import iCal feed.' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      importedCount: result.importedCount,
      blockedRanges: result.blockedRanges,
      message: `Successfully synchronized ${result.importedCount} blocked date ranges from ${sourceName || 'external feed'}.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error processing iCal import.' }, { status: 500 })
  }
}
