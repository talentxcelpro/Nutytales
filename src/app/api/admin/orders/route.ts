import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth/jwt-verifier'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('nt_uid')?.value
  const authResult = await verifyAdminToken(token)

  if (!authResult.valid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const search = (searchParams.get('search') || '').trim()
  const status = (searchParams.get('status') || '').trim()
  const paymentStatus = (searchParams.get('paymentStatus') || '').trim()
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || 20)))

  let query = supabase
    .from('store_orders')
    .select(
      'id, order_number, customer_name, customer_email, customer_phone, total_amount, currency, payment_method, payment_status, order_status, fulfillment_status, created_at',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (status) query = query.eq('order_status', status)
  if (paymentStatus) query = query.eq('payment_status', paymentStatus)
  if (search) {
    query = query.or(
      `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`
    )
  }

  const { data: orders, count, error } = await query
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  // Real database metrics
  const { data: allStats } = await supabase
    .from('store_orders')
    .select('order_status, payment_status, created_at')

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const rows = allStats || []
  const metrics = {
    totalOrders: rows.length,
    ordersToday: rows.filter((r) => r.created_at >= startOfDay).length,
    ordersThisMonth: rows.filter((r) => r.created_at >= startOfMonth).length,
    pendingPayment: rows.filter((r) => r.payment_status === 'pending').length,
    paid: rows.filter((r) => r.payment_status === 'paid').length,
    processing: rows.filter((r) => r.order_status === 'processing').length,
    readyToDispatch: rows.filter((r) => r.order_status === 'ready_to_ship').length,
    shipped: rows.filter((r) => r.order_status === 'shipped').length,
    delivered: rows.filter((r) => r.order_status === 'delivered').length,
    cancelled: rows.filter((r) => r.order_status === 'cancelled').length,
    returnRequests: rows.filter((r) => r.order_status === 'return_requested').length,
  }

  return NextResponse.json({
    success: true,
    orders: orders || [],
    total: count || 0,
    page,
    pageSize,
    metrics,
  })
}
