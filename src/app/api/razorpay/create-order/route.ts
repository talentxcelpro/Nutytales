// ─── Nuty Tales — Razorpay Order Creation ────────────────────────────────────
// POST /api/razorpay/create-order
//
// Creates a Razorpay order server-side. The client must call this first,
// then open the Razorpay checkout modal with the returned order_id.
// All secrets remain server-side; only the public key is sent to the client.
//
// Idempotency: callers should include a unique idempotencyKey per cart session.
// Duplicate calls with the same key return the existing order without re-creating it.

import { NextResponse } from 'next/server'
import crypto from 'crypto'

// ── Environment validation ────────────────────────────────────────────────────
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? ''
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? ''

function ensureRazorpayConfigured() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
  }
}

// ── Simple in-process idempotency store ─────────────────────────────────────
// For multi-instance deployments, replace with a Redis/Supabase-backed store.
// This is intentionally lightweight for the pre-launch phase.
const idempotencyCache = new Map<string, { orderId: string; amount: number; currency: string }>()

// ── Razorpay REST helper ──────────────────────────────────────────────────────
async function createRazorpayOrder(params: {
  amount: number       // in paise (INR * 100)
  currency: string
  receipt: string
  notes?: Record<string, string>
}) {
  ensureRazorpayConfigured()

  const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const errBody = await response.text()
    throw new Error(`Razorpay order creation failed (${response.status}): ${errBody}`)
  }

  return response.json() as Promise<{
    id: string
    entity: string
    amount: number
    amount_paid: number
    amount_due: number
    currency: string
    receipt: string
    status: string
    created_at: number
  }>
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    ensureRazorpayConfigured()

    const body = await request.json()
    const { amountInr, currency = 'INR', receipt, notes, idempotencyKey } = body

    // ── Input validation ──────────────────────────────────────────────────────
    if (!amountInr || typeof amountInr !== 'number' || amountInr <= 0) {
      return NextResponse.json(
        { success: false, error: 'amountInr must be a positive number (INR, not paise).' },
        { status: 400 }
      )
    }

    if (amountInr < 1) {
      return NextResponse.json(
        { success: false, error: 'Minimum order amount is ₹1.' },
        { status: 400 }
      )
    }

    if (!receipt || typeof receipt !== 'string' || receipt.length > 40) {
      return NextResponse.json(
        { success: false, error: 'receipt is required and must be ≤ 40 characters.' },
        { status: 400 }
      )
    }

    // ── Idempotency check ────────────────────────────────────────────────────
    if (idempotencyKey && typeof idempotencyKey === 'string') {
      const existing = idempotencyCache.get(idempotencyKey)
      if (existing) {
        return NextResponse.json({
          success: true,
          orderId: existing.orderId,
          amount: existing.amount,
          currency: existing.currency,
          keyId: RAZORPAY_KEY_ID,
          idempotent: true,
        })
      }
    }

    // ── Create Razorpay order ─────────────────────────────────────────────────
    const amountInPaise = Math.round(amountInr * 100)

    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      currency,
      receipt,
      notes: notes ?? {},
    })

    // ── Store idempotency key ────────────────────────────────────────────────
    if (idempotencyKey && typeof idempotencyKey === 'string') {
      idempotencyCache.set(idempotencyKey, {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      })
      // Evict after 30 minutes to prevent unbounded memory growth
      setTimeout(() => idempotencyCache.delete(idempotencyKey), 30 * 60 * 1000)
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      // Send the PUBLIC key to the client so it can open the Razorpay modal.
      // The secret key is NEVER returned.
      keyId: RAZORPAY_KEY_ID,
    })
  } catch (err: any) {
    console.error('[Razorpay CreateOrder]', err?.message ?? err)
    const isConfigError = err?.message?.includes('keys are not configured')
    return NextResponse.json(
      {
        success: false,
        error: isConfigError
          ? 'Payment gateway not configured. Please contact support.'
          : 'Could not initiate payment. Please try again.',
      },
      { status: isConfigError ? 503 : 500 }
    )
  }
}
