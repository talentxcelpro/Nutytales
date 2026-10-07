import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { property, guestName, phone, email, checkIn, nights, guestsCount, totalTariff, addOns } = body

    if (!property || !phone) {
      return NextResponse.json({ error: 'Property and phone are required' }, { status: 400 })
    }

    const bookingRef = `STAY-2026-${Date.now().toString().slice(-4)}`

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        name: guestName || 'Boutique Guest',
        phone,
        email: email || '',
        business_name: `[STAYS] ${property}`,
        city: 'Kashmir / NCR',
        message: `[RESERVATION: ${bookingRef}] Property: ${property} | In: ${checkIn} (${nights} nts) | Guests: ${guestsCount} | Tariff: ₹${totalTariff || 'Custom'} | Add-ons: ${addOns || 'Standard'}`,
        source: 'stays.nutytales.com',
      })
    }

    return NextResponse.json({
      success: true,
      bookingRef,
      message: 'Hospitality reservation recorded. Concierge team dispatched.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
