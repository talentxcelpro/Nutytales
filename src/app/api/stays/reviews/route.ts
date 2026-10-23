// ─── /api/stays/reviews ───────────────────────────────────────────────────────
// Verified Guest Reviews API: submission, 6-factor ratings, and aggregated calculations.

import { NextRequest, NextResponse } from 'next/server'
import { getReviewsForProperty, submitPropertyReview } from '@/lib/stays/reviews-store'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Property slug is required.' }, { status: 400 })
    }

    const data = getReviewsForProperty(slug)
    return NextResponse.json({ success: true, slug, ...data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch reviews.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { propertySlug, guestName, guestCity, title, comment, rating, ratingsBreakdown, travelerType, photos, bookingRef } = body

    if (!propertySlug || !guestName || !title || !comment) {
      return NextResponse.json(
        { error: 'Missing required review fields (propertySlug, guestName, title, comment).' },
        { status: 400 },
      )
    }

    const res = await submitPropertyReview({
      propertySlug,
      bookingRef,
      guestName,
      guestCity: guestCity || 'Verified Guest',
      title,
      comment,
      rating: Number(rating) || 5,
      ratingsBreakdown: ratingsBreakdown || {
        cleanliness: Number(rating) || 5,
        accuracy: Number(rating) || 5,
        communication: Number(rating) || 5,
        location: Number(rating) || 5,
        checkIn: Number(rating) || 5,
        value: Number(rating) || 5,
      },
      travelerType,
      photos,
    })

    if (!res.success) {
      return NextResponse.json({ error: res.error || 'Failed to post review.' }, { status: 400 })
    }

    return NextResponse.json(res, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit review.' }, { status: 500 })
  }
}
