import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, buyerName, phone, email, country, category, volume, notes } = body

    if (!companyName || !phone) {
      return NextResponse.json({ error: 'Company name and phone are required' }, { status: 400 })
    }

    const consignmentId = `CRFT-2026-${Date.now().toString().slice(-4)}`

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        name: buyerName || companyName,
        phone,
        email: email || '',
        business_name: `[CRAFTS WHOLESALE] ${companyName}`,
        city: country || 'International',
        message: `[CONSIGNMENT: ${consignmentId}] Category: ${category} | Volume: ${volume} | Country: ${country} | Specs: ${notes || ''}`,
        source: 'crafts.nutytales.com',
      })
    }

    return NextResponse.json({
      success: true,
      consignmentId,
      message: 'Craft wholesale RFQ routed to master weaver guilds. Swatch box scheduled.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
