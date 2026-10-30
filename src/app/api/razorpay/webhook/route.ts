// ─── Nuty Tales — Razorpay Webhook Handler ──────────────────────────────────
// POST /api/razorpay/webhook
//
// Receives asynchronous payment event notifications from Razorpay.
// Verifies HMAC-SHA256 signature using RAZORPAY_WEBHOOK_SECRET.
// Provides duplicate payment prevention and ensures orders are confirmed
// even if the customer's browser closes before the client callback runs.

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { WhatsAppAutomationEngine } from '@/lib/whatsapp/automations'

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

// Lightweight memory cache to track processed event IDs for replay/duplicate protection
const processedEvents = new Set<string>()

export async function POST(request: Request) {
  try {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured.')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const signature = request.headers.get('x-razorpay-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 })
    }

    // Read raw body for exact signature calculation
    const rawBody = await request.text()

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex')

    let signaturesMatch = false
    try {
      signaturesMatch = crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(signature, 'hex')
      )
    } catch {
      signaturesMatch = false
    }

    if (!signaturesMatch) {
      console.warn('[Razorpay Webhook] Invalid webhook signature detected.')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const eventId = payload.event_id || payload.id || `${payload.event}_${payload.created_at}`

    // Duplicate event prevention (Idempotency)
    if (processedEvents.has(eventId)) {
      console.info(`[Razorpay Webhook] Duplicate event ignored: ${eventId}`)
      return NextResponse.json({ status: 'already_processed', eventId })
    }

    processedEvents.add(eventId)
    // Keep set bounded to last 10,000 entries
    if (processedEvents.size > 10000) {
      const firstEntry = processedEvents.values().next().value
      if (firstEntry) processedEvents.delete(firstEntry)
    }

    const event = payload.event
    console.info(`[Razorpay Webhook] Processing event: ${event} (ID: ${eventId})`)

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = payload.payload?.payment?.entity
      const order = payload.payload?.order?.entity
      const razorpayOrderId = payment?.order_id || order?.id
      const razorpayPaymentId = payment?.id
      const amountPaise = payment?.amount || 0
      const customerContact = payment?.contact || ''
      const customerName = payment?.notes?.customer_name || 'Valued Customer'

      try {
        const { getSupabaseAdmin } = await import('@/lib/supabase')
        const supabase = getSupabaseAdmin()
        if (supabase && razorpayOrderId) {
          // Record or update order confirmation lead in Supabase
          await supabase.from('leads').insert({
            name: customerName,
            phone: customerContact,
            email: payment?.email || '',
            city: payment?.notes?.city || 'PAN-India',
            business_name: '[RAZORPAY-WEBHOOK-CAPTURED]',
            source: 'webhook.nutytales.com/razorpay',
            message: `[WEBHOOK CONFIRMED] Event: ${event} | OrderID: ${razorpayOrderId} | PaymentID: ${razorpayPaymentId} | Amount: ₹${amountPaise / 100}`,
            metadata: {
              event,
              eventId,
              razorpayOrderId,
              razorpayPaymentId,
              amount: amountPaise,
              method: payment?.method,
            },
          })
        }
      } catch (dbErr: any) {
        console.error('[Razorpay Webhook] Database update error:', dbErr?.message)
      }

      // Non-blocking WhatsApp Payment Confirmation
      if (customerContact) {
        WhatsAppAutomationEngine.handlePaymentConfirmation({
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          gateway: 'razorpay',
          amount: amountPaise / 100,
          customerPhone: customerContact,
          customerName,
        }).catch((waErr) => {
          console.warn('[Razorpay Webhook] WhatsApp confirmation error:', waErr?.message)
        })
      }
    }

    return NextResponse.json({ status: 'ok', eventId })
  } catch (err: any) {
    console.error('[Razorpay Webhook] Error processing webhook:', err?.message || err)
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 })
  }
}
