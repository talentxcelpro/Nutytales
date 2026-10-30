// ─── Nuty Tales — Razorpay Webhook Handler ──────────────────────────────────
// POST /api/razorpay/webhook
//
// Receives asynchronous payment event notifications from Razorpay.
// Verifies HMAC-SHA256 signature using RAZORPAY_WEBHOOK_SECRET against raw request body.
// Enforces durable persistent idempotency across Vercel serverless function instances,
// prevents duplicate order fulfillment, blocks concurrent webhook races,
// and preserves retryability after temporary failures.

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  acquireIdempotencyLock,
  completeIdempotency,
  failIdempotency,
} from '@/lib/payments/idempotency'

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? ''

export async function POST(request: Request) {
  let activeEventId: string | null = null

  try {
    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not configured.')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const signature = request.headers.get('x-razorpay-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing x-razorpay-signature header' }, { status: 400 })
    }

    // Read raw body for exact byte-order HMAC signature verification
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
    const eventId =
      payload.event_id ||
      payload.id ||
      `evt_${payload.event}_${payload.payload?.payment?.entity?.id || payload.created_at}`
    activeEventId = eventId

    // ── Durable Idempotency Enforcement ──────────────────────────────────────
    const lock = await acquireIdempotencyLock(`webhook_${eventId}`, {
      ttlSeconds: 60,
      eventId,
    })

    if (!lock.acquired) {
      if (lock.state === 'COMPLETED') {
        console.info(`[Razorpay Webhook] Duplicate webhook ignored (already completed): ${eventId}`)
        return NextResponse.json({ status: 'already_processed', eventId, duplicate: true })
      }

      if (lock.state === 'PROCESSING') {
        console.warn(`[Razorpay Webhook] Concurrent webhook delivery in progress: ${eventId}`)
        return NextResponse.json({ status: 'processing_concurrent', eventId }, { status: 409 })
      }
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
      const customerName = payment?.notes?.customer_name || 'Webhook Verified Buyer'

      try {
        const { getSupabaseAdmin } = await import('@/lib/supabase')
        const supabase = getSupabaseAdmin()
        if (supabase && razorpayOrderId) {
          // Record confirmed order fulfillment in Supabase
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
        try {
          const { WhatsAppAutomationEngine } = await import('@/lib/whatsapp/automations')
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
        } catch (waErr: any) {
          console.warn('[Razorpay Webhook] WhatsApp engine notice:', waErr?.message)
        }
      }
    }

    // ── Complete durable idempotency record ──────────────────────────────────
    await completeIdempotency(`webhook_${eventId}`, { status: 'ok', eventId })

    return NextResponse.json({ status: 'ok', eventId })
  } catch (err: any) {
    console.error('[Razorpay Webhook] Error processing webhook:', err?.message || err)
    if (activeEventId) {
      await failIdempotency(`webhook_${activeEventId}`, err?.message || 'Webhook processing error')
    }
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 })
  }
}
