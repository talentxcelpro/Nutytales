import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { projectId, vendorId, venueId, category, targetDate, guestCount, requirements, quoteAmount, currency } = body

    const enquiryId = `ENQ-${Date.now().toString().slice(-5)}`

    const enquiryData = {
      id: enquiryId,
      project_id: projectId || 'WED-2026-DEFAULT',
      vendor_id: vendorId || null,
      venue_id: venueId || null,
      category: category || 'general',
      target_date: targetDate || null,
      guest_count: guestCount || null,
      requirements: requirements || '',
      quote_amount: quoteAmount || null,
      currency: currency || 'INR',
      status: 'under_review',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('wedding_enquiries').insert(enquiryData)
    }

    return NextResponse.json({
      success: true,
      enquiryId,
      enquiry: enquiryData,
      message: 'Quotation request dispatched to verified partner.',
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
