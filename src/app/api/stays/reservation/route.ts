import { NextResponse } from 'next/server'
import { createStayReservation, checkDateAvailability } from '@/lib/stays/stays-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      propertySlug,
      roomId,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      infants = 0,
      isBuyout = false,
      guestName,
      guestEmail,
      guestPhone,
      companyName,
      gstin,
      specialRequests,
      paymentMode = 'advance-token',
      selectedAddOnIds = [],
      promoCode,
      guestUserId,
    } = body

    if (!propertySlug || !guestName || !guestPhone || !guestEmail) {
      return NextResponse.json(
        { error: 'Property, guest name, email and phone number are required.' },
        { status: 400 },
      )
    }

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Check-in and check-out dates are required.' },
        { status: 400 },
      )
    }

    // 1. Transactional Availability Check (Prevents Double-Booking)
    const avail = await checkDateAvailability(
      propertySlug,
      checkIn,
      checkOut,
      isBuyout,
      roomId,
    )

    if (!avail.available) {
      return NextResponse.json(
        { error: avail.conflictReason || 'Selected dates are unavailable.' },
        { status: 409 },
      )
    }

    // 2. Create authoritative reservation with server-verified pricing
    const result = await createStayReservation({
      propertySlug,
      roomId,
      checkIn,
      checkOut,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      infants: Number(infants) || 0,
      isBuyout: Boolean(isBuyout),
      guestName,
      guestEmail,
      guestPhone,
      companyName,
      gstin,
      specialRequests,
      paymentMode,
      selectedAddOnIds,
      promoCode,
      guestUserId,
    })

    if (!result.success || !result.reservation) {
      return NextResponse.json(
        { error: result.error || 'Failed to process reservation.' },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      bookingRef: result.reservation.bookingRef,
      reservation: result.reservation,
      message: 'Reservation confirmed. Vouchers and check-in instructions dispatched.',
    })
  } catch (err: any) {
    console.error('[API Stays Reservation] Error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error processing stay reservation.' },
      { status: 500 },
    )
  }
}
