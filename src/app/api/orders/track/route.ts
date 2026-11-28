import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

// Simple in-memory rate limiter for guest tracking (per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const RATE_LIMIT_MAX = 20

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }
  entry.count += 1
  return true
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(-10)
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many tracking attempts. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const orderNumber = String(body?.orderNumber || '').trim().toUpperCase()
    const contact = String(body?.contact || '').trim()

    if (!orderNumber || !contact) {
      return NextResponse.json(
        { success: false, error: 'Please enter both your order number and email or phone number.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Order tracking service is temporarily unavailable.' },
        { status: 503 }
      )
    }

    const { data: order, error } = await supabase
      .from('store_orders')
      .select(
        'id, order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal, discount_amount, shipping_amount, tax_amount, total_amount, currency, payment_method, payment_status, order_status, fulfillment_status, created_at, confirmed_at, delivered_at'
      )
      .ilike('order_number', orderNumber)
      .maybeSingle()

    const genericError = 'Order not found or verification details do not match.'

    if (error || !order) {
      return NextResponse.json({ success: false, error: genericError }, { status: 404 })
    }

    const isEmailMatch =
      contact.includes('@') &&
      order.customer_email &&
      order.customer_email.toLowerCase() === contact.toLowerCase()

    const normalizedInputPhone = normalizePhone(contact)
    const normalizedOrderPhone = normalizePhone(order.customer_phone || '')
    const isPhoneMatch =
      normalizedInputPhone.length >= 10 &&
      normalizedOrderPhone.length >= 10 &&
      normalizedInputPhone === normalizedOrderPhone

    if (!isEmailMatch && !isPhoneMatch) {
      return NextResponse.json({ success: false, error: genericError }, { status: 404 })
    }

    const [{ data: items }, { data: shipments }, { data: events }] = await Promise.all([
      supabase
        .from('store_order_items')
        .select('id, product_id, product_name, product_image, product_variant, quantity, unit_price, total_price')
        .eq('order_id', order.id),
      supabase
        .from('store_shipments')
        .select('id, courier_name, tracking_number, tracking_url, shipment_status, shipping_method, estimated_delivery, shipped_at, delivered_at')
        .eq('order_id', order.id)
        .order('created_at', { ascending: true }),
      supabase
        .from('order_tracking_events')
        .select('id, shipment_id, status, title, description, location, event_timestamp')
        .eq('order_id', order.id)
        .eq('is_customer_visible', true)
        .order('event_timestamp', { ascending: true }),
    ])

    const addr = (order.shipping_address || {}) as Record<string, unknown>

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.order_number,
        customerFirstName: String(order.customer_name || 'Customer').split(' ')[0],
        orderStatus: order.order_status,
        paymentStatus: order.payment_status,
        fulfillmentStatus: order.fulfillment_status,
        paymentMethod: order.payment_method,
        totalAmount: Number(order.total_amount),
        currency: order.currency,
        createdAt: order.created_at,
        confirmedAt: order.confirmed_at,
        deliveredAt: order.delivered_at,
        // Privacy-controlled shipping summary (no full street/flat exposed to guest lookup)
        shippingSummary: {
          city: String(addr.city || ''),
          state: String(addr.state || ''),
          pincode: String(addr.pincode || ''),
        },
      },
      items: items || [],
      shipments: shipments || [],
      events: events || [],
    })
  } catch (err) {
    console.error('[TrackOrder API]', err)
    return NextResponse.json(
      { success: false, error: 'Unable to process tracking request.' },
      { status: 500 }
    )
  }
}
