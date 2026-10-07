import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { coupleNames, destination, weddingDate, guestCount, budgetInr, phone, email } = body

    if (!coupleNames || !phone) {
      return NextResponse.json({ error: 'Couple names and phone are required' }, { status: 400 })
    }

    const workspaceId = `WED-2026-${Date.now().toString().slice(-4)}`

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        name: coupleNames,
        phone,
        email: email || '',
        business_name: `[WEDDINGS] ${coupleNames}`,
        city: destination || 'Kashmir',
        message: `[WORKSPACE: ${workspaceId}] Date: ${weddingDate} | Guests: ${guestCount} | Budget: ₹${budgetInr || 'Custom'}`,
        source: 'weddings.nutytales.com',
      })
    }

    return NextResponse.json({
      success: true,
      workspaceId,
      message: 'Wedding workspace blueprint recorded. Dedicated concierge assigned.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
