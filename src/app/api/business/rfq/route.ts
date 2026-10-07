import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { buyerName, companyName, phone, email, commodity, volumeKg, targetRate, notes } = body

    if (!companyName || !phone) {
      return NextResponse.json({ error: 'Company name and phone are required' }, { status: 400 })
    }

    const refId = `NT-B2B-${Date.now().toString().slice(-6)}`
    const score = (volumeKg > 1000 ? 40 : 20) + (targetRate ? 25 : 10) + (email ? 20 : 10)

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        name: buyerName || companyName,
        phone,
        email: email || '',
        business_name: `[B2B] ${companyName}`,
        city: 'PAN-India',
        message: `[REF: ${refId}] Commodity: ${commodity || 'General B2B'} | Volume: ${volumeKg || 'Unspecified'} kg | Target Rate: ${targetRate || 'Market'} | Notes: ${notes || ''}`,
        source: 'business.nutytales.com',
      })
    }

    return NextResponse.json({
      success: true,
      rfqId: refId,
      intentScore: score,
      message: 'B2B RFQ registered and routed to Noida/Kashmir processing hub.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
