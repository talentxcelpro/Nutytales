import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth/jwt-verifier'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getShipmentProvider } from '@/lib/orders/courier-provider'
import { recordOrderNotification } from '@/lib/orders/notifications'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const cookieStore = await cookies()
  const authResult = await verifyAdminToken(cookieStore.get('nt_uid')?.value)
  if (!authResult.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId } = await params
  const body = await request.json()
  const courierName = String(body?.courierName || '').trim()
  const trackingNumber = String(body?.trackingNumber || '').trim()
  const trackingUrl = String(body?.trackingUrl || '').trim()
  const shippingMethod = String(body?.shippingMethod || 'express_air')
  const estimatedDelivery = body?.estimatedDelivery || null
  const shippingNotes = body?.shippingNotes || null

  if (!courierName) {
    return NextResponse.json({ success: false, error: 'Courier name is required.' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }

  const { data: order, error: orderErr } = await supabase
    .from('store_orders')
    .select('id, order_number, user_id, customer_email')
    .eq('id', orderId)
    .maybeSingle()

  if (orderErr || !order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  }

  const provider = getShipmentProvider(body?.courierSlug || 'manual')
  const providerRes = await provider.createShipment({
    orderId: order.id,
    orderNumber: order.order_number,
    courierName,
    trackingNumber,
    trackingUrl,
    shippingMethod,
    estimatedDelivery,
    shippingNotes,
  })

  if (!providerRes.success) {
    return NextResponse.json(
      { success: false, error: providerRes.error || 'Failed to create shipment' },
      { status: 500 }
    )
  }

  const { data: shipment, error: shipErr } = await supabase
    .from('store_shipments')
    .insert({
      order_id: order.id,
      courier_name: courierName,
      courier_slug: provider.slug,
      tracking_number: providerRes.trackingNumber || trackingNumber,
      tracking_url: providerRes.trackingUrl || trackingUrl,
      shipment_status: trackingNumber ? 'picked_up' : 'label_created',
      shipping_method: shippingMethod,
      estimated_delivery: estimatedDelivery,
      shipped_at: trackingNumber ? new Date().toISOString() : null,
      shipping_notes: shippingNotes,
      provider_reference: providerRes.providerReference || null,
    })
    .select('*')
    .single()

  if (shipErr) {
    return NextResponse.json({ success: false, error: shipErr.message }, { status: 500 })
  }

  const actorId = authResult.payload?.email || authResult.payload?.uid || 'admin'

  await Promise.all([
    supabase
      .from('store_orders')
      .update({
        order_status: 'shipped',
        fulfillment_status: 'fulfilled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id),
    supabase.from('order_tracking_events').insert({
      order_id: order.id,
      shipment_id: shipment.id,
      status: 'shipped',
      title: 'Order Shipped',
      description: `Dispatched via ${courierName}${trackingNumber ? ` (AWB: ${trackingNumber})` : ''}.`,
      source: 'admin',
      is_customer_visible: true,
    }),
    supabase.from('order_audit_logs').insert({
      order_id: order.id,
      actor_id: actorId,
      action: 'shipment_created',
      new_value: {
        courier_name: courierName,
        tracking_number: trackingNumber,
        shipment_id: shipment.id,
      },
    }),
  ])

  if (order.customer_email) {
    await recordOrderNotification({
      orderId: order.id,
      customerId: order.user_id,
      notificationType: 'order_shipped',
      channel: 'email',
      recipient: order.customer_email,
    })
  }

  return NextResponse.json({ success: true, shipment })
}
