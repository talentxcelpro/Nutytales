// ─── Nuty Tales — Razorpay Order Creation ────────────────────────────────────
// POST /api/razorpay/create-order
//
// Creates a Razorpay order server-side with durable persistent idempotency.
// All secrets remain server-side; only the public key is sent to the client.

import { NextResponse } from 'next/server'
import {
  acquireIdempotencyLock,
  completeIdempotency,
  failIdempotency,
} from '@/lib/payments/idempotency'

// ── Environment validation ────────────────────────────────────────────────────
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? ''
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? ''

function ensureRazorpayConfigured() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.')
  }
}

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
  let activeIdempotencyKey: string | null = null

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

    // ── Durable Idempotency check ────────────────────────────────────────────
    if (idempotencyKey && typeof idempotencyKey === 'string') {
      activeIdempotencyKey = idempotencyKey
      const lock = await acquireIdempotencyLock(idempotencyKey, { ttlSeconds: 60 })

      if (!lock.acquired) {
        if (lock.state === 'COMPLETED' && lock.cachedResponse) {
          return NextResponse.json({
            ...lock.cachedResponse,
            idempotent: true,
          })
        }

        if (lock.state === 'PROCESSING') {
          return NextResponse.json(
            { success: false, error: 'Order creation in progress. Please do not submit duplicate requests.' },
            { status: 409 }
          )
        }
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

    const responsePayload = {
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: RAZORPAY_KEY_ID,
    }

    // ── Complete durable idempotency record ──────────────────────────────────
    if (activeIdempotencyKey) {
      await completeIdempotency(activeIdempotencyKey, responsePayload)
    }

    return NextResponse.json(responsePayload)
  } catch (err: any) {
    console.error('[Razorpay CreateOrder]', err?.message ?? err)
    if (activeIdempotencyKey) {
      await failIdempotency(activeIdempotencyKey, err?.message || 'Server error')
    }

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
