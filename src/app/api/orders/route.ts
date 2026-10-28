import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { syncConsumerOrderToSellers } from '@/lib/seller-portal/order-sync'

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

    // Synchronize multi-vendor order items to seller fulfilment orders
    let sellerOrders: any[] = []
    try {
      sellerOrders = await syncConsumerOrderToSellers({
        orderId,
        orderNumber: orderId,
        customer: customer || {},
        items: items || [],
        total: Number(total || 0),
        currency: 'INR',
        paymentMethod,
      })
    } catch (syncErr) {
      console.error('[Storefront Checkout] Failed to split seller orders:', syncErr)
    }

    const customerName = customer?.fullName || customer?.name || 'Customer'
    const phone = customer?.phone || ''
    const email = customer?.email || ''
    const city = customer?.city || 'PAN-India'
    const company = customer?.companyName || ''

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      try {
        await supabaseAdmin.from('leads').insert({
          name: customerName,
          phone,
          email,
          business_name: company ? `[${vertical.toUpperCase()}] ${company}` : `[${vertical.toUpperCase()}]`,
          city,
          message: `[ORDER: ${orderId}] Total: ₹${total} | Payment: ${paymentMethod} | Type: ${type} | Items: ${JSON.stringify(items || [])} | SellerOrders: ${sellerOrders.map((so) => so.id).join(', ')} | Notes: ${notes || ''}`,
          source: `nutytales.com/${vertical}`,
        })
      } catch (err) {
        console.warn('[Orders API] Supabase lead insertion error:', err)
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: total,
      paymentMethod,
      sellerOrdersCount: sellerOrders.length,
      message: 'Order recorded and synchronized with seller fulfillment desks.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing order' },
      { status: 500 }
    )
  }
}
