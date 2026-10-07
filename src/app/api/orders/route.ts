import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customer,
      items,
      total,
      paymentMethod = 'razorpay',
      vertical = 'retail',
      type = 'order',
      referenceId,
      notes,
    } = body

    const orderId =
      referenceId ||
      `NT-ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`

    const customerName = customer?.fullName || customer?.name || 'Customer'
    const phone = customer?.phone || ''
    const email = customer?.email || ''
    const city = customer?.city || 'PAN-India'
    const company = customer?.companyName || ''

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      await supabaseAdmin.from('leads').insert({
        name: customerName,
        phone,
        email,
        business_name: company ? `[${vertical.toUpperCase()}] ${company}` : `[${vertical.toUpperCase()}]`,
        city,
        message: `[ORDER: ${orderId}] Total: ₹${total} | Payment: ${paymentMethod} | Type: ${type} | Items: ${JSON.stringify(items || [])} | Notes: ${notes || ''}`,
        source: `nutytales.com/${vertical}`,
      })
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: total,
      paymentMethod,
      message: 'Order recorded successfully.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing order' },
      { status: 500 }
    )
  }
}
