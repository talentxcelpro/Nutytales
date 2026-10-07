import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyName, contactName, phone, email, occasion, recipientCount, budgetTotal, recipients } = body

    if (!companyName || !phone) {
      return NextResponse.json({ error: 'Company name and phone are required' }, { status: 400 })
    }

    const campaignId = `GIFT-2026-${Date.now().toString().slice(-4)}`

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        name: contactName || companyName,
        phone,
        email: email || '',
        business_name: `[GIFTING] ${companyName}`,
        city: 'Multi-City / Global',
        message: `[CAMPAIGN: ${campaignId}] Occasion: ${occasion || 'Corporate'} | Recipients: ${recipientCount || recipients?.length || 0} boxes | Budget: ₹${budgetTotal || 'Custom'}`,
        source: 'gifting.nutytales.com',
      })
    }

    return NextResponse.json({
      success: true,
      campaignId,
      message: 'Corporate gifting campaign registered. Proforma invoice generated.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
