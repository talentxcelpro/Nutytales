import { NextResponse } from 'next/server'
import { cancelStayReservation } from '@/lib/stays/stays-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingRef, reason = 'Guest requested cancellation' } = body

    if (!bookingRef) {
      return NextResponse.json({ error: 'Booking reference is required.' }, { status: 400 })
    }

    const result = await cancelStayReservation(bookingRef, reason)
    if (!result.success) {
      return NextResponse.json({ error: result.message || 'Cancellation failed.' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      refundAmount: result.refundAmount,
      message: result.message,
    })
  } catch (err: any) {
    console.error('[API Stays Cancel] Error:', err)
    return NextResponse.json({ error: err.message || 'Server error cancelling reservation.' }, { status: 500 })
  }
}
