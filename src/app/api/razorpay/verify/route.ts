// ─── Nuty Tales — Razorpay Payment Verification ──────────────────────────────
// POST /api/razorpay/verify
//
// Verifies the Razorpay payment signature using HMAC-SHA256.
// Called after the client successfully completes the Razorpay checkout modal.
//
// Security: only after this endpoint returns { success: true } should the
// application create an order record or dispatch fulfillment.
//
// Reference: https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/#verify-payment-signature

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { WhatsAppAutomationEngine } from '@/lib/whatsapp/automations'

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? ''

function ensureSecretConfigured() {
  if (!RAZORPAY_KEY_SECRET) {
    throw new Error('RAZORPAY_KEY_SECRET is not configured.')
  }
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    ensureSecretConfigured()

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Application-level order data to persist after verification
      orderData,
    } = body

    // ── Input validation ──────────────────────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required Razorpay payment fields.',
        },
        { status: 400 }
      )
    }

    // ── HMAC signature verification ───────────────────────────────────────────
    // Razorpay signs: razorpay_order_id + "|" + razorpay_payment_id
    // using HMAC-SHA256 with the key secret.
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const signaturesMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    )

    if (!signaturesMatch) {
      console.warn('[Razorpay Verify] Signature mismatch for order:', razorpay_order_id)
      return NextResponse.json(
        {
          success: false,
          error: 'Payment signature verification failed. Do not fulfill this order.',
        },
        { status: 400 }
      )
    }

    // ── Signature verified — persist order ───────────────────────────────────
    let orderId: string | null = null
    try {
      const { getSupabaseAdmin } = await import('@/lib/supabase')
      const supabase = getSupabaseAdmin()
      if (supabase && orderData) {
        const customer = orderData.customer ?? {}
        const insertResult = await supabase.from('leads').insert({
          name: customer.fullName ?? customer.name ?? 'Customer',
          phone: customer.phone ?? '',
          email: customer.email ?? '',
          city: customer.city ?? '',
          business_name: `[PAID-ORDER]`,
          source: 'nutytales.com/checkout/razorpay',
          message: `[VERIFIED PAYMENT] razorpay_order_id=${razorpay_order_id} | razorpay_payment_id=${razorpay_payment_id} | total=₹${orderData.total ?? 'unknown'} | items=${JSON.stringify(orderData.items ?? [])}`,
          metadata: {
            razorpay_order_id,
            razorpay_payment_id,
            verified: true,
            orderData,
          },
        }).select('id')

        if (insertResult.data?.[0]?.id) {
          orderId = String(insertResult.data[0].id)
        }
      }
    } catch (dbErr: any) {
      console.error('[Razorpay Verify] DB persist error (payment still verified):', dbErr?.message)
    }

    // ── Non-blocking WhatsApp Commerce OS Payment Notification ────────────────
    const customerPhone = orderData?.customer?.phone || orderData?.customerPhone || ''
    const customerName = orderData?.customer?.fullName || orderData?.customer?.name || 'Customer'
    const totalAmount = Number(orderData?.total || 0)

    if (customerPhone) {
      WhatsAppAutomationEngine.handlePaymentConfirmation({
        orderId: orderId || razorpay_order_id,
        paymentId: razorpay_payment_id,
        gateway: 'razorpay',
        amount: totalAmount,
        customerPhone,
        customerName,
      }).catch((waErr) => {
        console.warn('[Razorpay Verify] Non-blocking WhatsApp payment alert error:', waErr?.message)
      })
    }

    return NextResponse.json({
      success: true,
      verified: true,
      razorpay_order_id,
      razorpay_payment_id,
      orderId,
      message: 'Payment verified successfully.',
    })
  } catch (err: any) {
    console.error('[Razorpay Verify]', err?.message ?? err)
    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed. Please contact support.',
      },
      { status: 500 }
    )
  }
}
