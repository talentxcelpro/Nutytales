import { NextResponse } from 'next/server'

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? ''
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? ''

export async function POST(request: Request) {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Razorpay credentials not configured.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { amountInr, customer, orderId, notes } = body

    if (!amountInr || typeof amountInr !== 'number' || amountInr <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount.' },
        { status: 400 }
      )
    }

    const amountInPaise = Math.round(amountInr * 100)
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')

    const host = request.headers.get('host') || 'nutytales.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const callbackUrl = `${protocol}://${host}/checkout?payment=success&orderId=${encodeURIComponent(orderId || '')}`

    const cleanPhone = (customer?.phone || '').replace(/\D/g, '').slice(-10)

    const payload = {
      amount: amountInPaise,
      currency: 'INR',
      accept_partial: false,
      description: `Nuty Tales Order ${orderId ? `#${orderId}` : ''}`,
      customer: {
        name: customer?.fullName || customer?.name || 'Customer',
        email: customer?.email || 'care@nutytales.com',
        contact: cleanPhone ? `+91${cleanPhone}` : undefined,
      },
      notify: {
        sms: false,
        email: false,
      },
      reminder_enable: false,
      notes: {
        orderId: orderId || '',
        customerName: customer?.fullName || '',
        customerPhone: cleanPhone || '',
        ...(notes || {}),
      },
      callback_url: callbackUrl,
      callback_method: 'get',
    }

    const res = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok || !data.short_url) {
      console.error('[Razorpay PaymentLink Failed]', data)
      return NextResponse.json(
        {
          success: false,
          error: data?.error?.description || 'Could not generate payment link.',
        },
        { status: res.status }
      )
    }

    return NextResponse.json({
      success: true,
      paymentLink: data.short_url,
      id: data.id,
      amount: data.amount,
    })
  } catch (err: any) {
    console.error('[Razorpay PaymentLink Exception]', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error creating payment link.' },
      { status: 500 }
    )
  }
}
