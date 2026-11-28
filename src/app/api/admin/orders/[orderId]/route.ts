import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth/jwt-verifier'
import { getSupabaseAdmin } from '@/lib/supabase'
import { canTransitionOrderStatus, type OrderStatus } from '@/lib/orders/types'
import { recordOrderNotification } from '@/lib/orders/notifications'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const cookieStore = await cookies()
  const authResult = await verifyAdminToken(cookieStore.get('nt_uid')?.value)
  if (!authResult.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { orderId } = await params
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }

  const { data: order, error } = await supabase
    .from('store_orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle()

  if (error || !order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  }

  const [{ data: items }, { data: shipments }, { data: events }, { data: auditLogs }] =
    await Promise.all([
      supabase.from('store_order_items').select('*').eq('order_id', order.id),
      supabase
        .from('store_shipments')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('order_tracking_events')
        .select('*')
        .eq('order_id', order.id)
        .order('event_timestamp', { ascending: true }),
      supabase
        .from('order_audit_logs')
        .select('*')
        .eq('order_id', order.id)
        .order('created_at', { ascending: false }),
    ])

  return NextResponse.json({
    success: true,
    order,
    items: items || [],
    shipments: shipments || [],
    events: events || [],
    auditLogs: auditLogs || [],
  })
}

export async function PATCH(
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
  const nextStatus = body?.orderStatus as OrderStatus | undefined

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }

  const { data: existing, error } = await supabase
    .from('store_orders')
    .select('id, order_number, user_id, customer_email, order_status')
    .eq('id', orderId)
    .maybeSingle()

  if (error || !existing) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  }

  if (!nextStatus || !canTransitionOrderStatus(existing.order_status as OrderStatus, nextStatus)) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid status transition from ${existing.order_status} to ${nextStatus}`,
      },
      { status: 400 }
    )
  }

  const updates: Record<string, unknown> = {
    order_status: nextStatus,
    updated_at: new Date().toISOString(),
  }
  if (nextStatus === 'confirmed') updates.confirmed_at = new Date().toISOString()
  if (nextStatus === 'cancelled') updates.cancelled_at = new Date().toISOString()
  if (nextStatus === 'delivered') updates.delivered_at = new Date().toISOString()

  const { error: updateErr } = await supabase
    .from('store_orders')
    .update(updates)
    .eq('id', orderId)

  if (updateErr) {
    return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 })
  }

  const actorId = authResult.payload?.email || authResult.payload?.uid || 'admin'

  await Promise.all([
    supabase.from('order_tracking_events').insert({
      order_id: orderId,
      status: nextStatus,
      title: `Order ${nextStatus.replace(/_/g, ' ')}`,
      description: body?.note || `Order status updated to ${nextStatus.replace(/_/g, ' ')}.`,
      source: 'admin',
      is_customer_visible: true,
    }),
    supabase.from('order_audit_logs').insert({
      order_id: orderId,
      actor_id: actorId,
      action: 'order_status_updated',
      old_value: { order_status: existing.order_status },
      new_value: { order_status: nextStatus },
      metadata: { note: body?.note || null },
    }),
  ])

  if (existing.customer_email) {
    await recordOrderNotification({
      orderId,
      customerId: existing.user_id,
      notificationType:
        nextStatus === 'delivered'
          ? 'delivered'
          : nextStatus === 'cancelled'
            ? 'cancelled'
            : 'order_confirmed',
      channel: 'email',
      recipient: existing.customer_email,
    })
  }

  return NextResponse.json({ success: true, orderStatus: nextStatus })
}
