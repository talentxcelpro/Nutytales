import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { destination, travelerName, phone, email, daysCount, travelersCount, budgetInr, vehicle, notes } = body

    if (!destination || !phone) {
      return NextResponse.json({ error: 'Destination and phone are required' }, { status: 400 })
    }

    const tripId = `TRV-2026-${Date.now().toString().slice(-4)}`

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        name: travelerName || 'Lead Traveler',
        phone,
        email: email || '',
        business_name: `[TRAVEL] ${destination}`,
        city: destination,
        message: `[TRIP: ${tripId}] Duration: ${daysCount} Days | Travelers: ${travelersCount} | Vehicle: ${vehicle || 'Assigned'} | Budget: ₹${budgetInr || 'Custom'} | Notes: ${notes || ''}`,
        source: 'travel.nutytales.com',
      })
    }

    return NextResponse.json({
      success: true,
      tripId,
      message: 'Travel itinerary structured. DMC and vehicle allocated.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
