// ─── Nuty Tales Stays — Transparent Pricing Engine & Fee Ledger ───────────────
// No hidden charges. Transparent breakdown of nights, fees, taxes and net host payouts.

import { StayProperty } from '@/lib/stays-data'

export interface PricingCalculationParams {
  property: StayProperty
  checkIn: string
  checkOut: string
  guestsCount: number
  isBuyout: boolean
  roomId?: string
  selectedAddOnIds?: string[]
  paymentMode?: 'advance-token' | 'full-prepay' | 'corporate-po'
  promoCode?: string
}

export interface DetailedStayPriceBreakdown {
  nights: number
  nightlyBaseRate: number
  grossRoomTariff: number
  seasonalAdjustment: number
  lengthOfStayDiscount: number
  lengthOfStayDiscountPercent: number
  netAccommodationTariff: number
  
  cleaningFee: number
  guestServiceFee: number // 5% platform operations fee
  gstTax: number          // 18% hospitality GST
  
  addOnsBreakdown: { id: string; title: string; price: number; quantity: number; total: number }[]
  addOnsTotal: number
  
  prepaymentDiscount: number // 5% discount if 100% prepaid
  grandTotal: number
  
  // Payment split
  immediateDepositDue: number // 20% if advance-token, 100% if full-prepay, 0 if corporate-po
  balanceDueAtCheckIn: number
  
  // Host commercial ledger (Platform monetisation)
  hostGrossEarnings: number
  hostPlatformFee: number // 3% host commission
  hostEstimatedNetPayout: number
}

export function calculateStayPricing(params: PricingCalculationParams): DetailedStayPriceBreakdown {
  const {
    property,
    checkIn,
    checkOut,
    guestsCount,
    isBuyout,
    roomId,
    selectedAddOnIds = [],
    paymentMode = 'advance-token',
    promoCode = '',
  } = params

  // 1. Calculate Nights
  let nights = 1
  if (checkIn && checkOut) {
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diff = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
    nights = diff > 0 ? diff : 1
  }

  // 2. Determine base nightly rate
  let nightlyBaseRate = property.estateBuyoutPrice
  if (!isBuyout && roomId) {
    const room = property.rooms.find((r) => r.id === roomId)
    if (room) {
      nightlyBaseRate = room.basePricePerNight
    } else if (property.rooms.length > 0) {
      nightlyBaseRate = property.rooms[0].basePricePerNight
    }
  } else if (!isBuyout && property.rooms.length > 0) {
    nightlyBaseRate = property.rooms[0].basePricePerNight
  }

  // 3. Seasonal Multiplier
  const inMonth = checkIn
    ? new Date(checkIn).toLocaleString('en-US', { month: 'long' })
    : 'October'
  const isPeak = property.seasonalRates.peakMonths.includes(inMonth)
  const seasonalMultiplier = isPeak ? property.seasonalRates.peakSeasonMultiplier : 1.0

  const grossRoomTariff = Math.round(nightlyBaseRate * nights * seasonalMultiplier)
  const seasonalAdjustment = Math.round(grossRoomTariff - nightlyBaseRate * nights)

  // 4. Length of Stay Discount
  let lengthOfStayDiscountPercent = 0
  if (nights >= 28) {
    lengthOfStayDiscountPercent = 25
  } else if (nights >= 7) {
    lengthOfStayDiscountPercent = 10
  }
  const lengthOfStayDiscount = Math.round((grossRoomTariff * lengthOfStayDiscountPercent) / 100)
  const netAccommodationTariff = grossRoomTariff - lengthOfStayDiscount

  // 5. Mandatory Fees
  const cleaningFee = property.cleaningFee || 0
  // Platform service fee = 5% of net accommodation
  const guestServiceFee = Math.round(netAccommodationTariff * 0.05)

  // 6. Experience Add-Ons
  const addOnsBreakdown = (property.experienceAddOns || [])
    .filter((addon) => selectedAddOnIds.includes(addon.id))
    .map((addon) => {
      const quantity = Math.max(1, guestsCount)
      const total = addon.pricePerPerson * quantity
      return {
        id: addon.id,
        title: addon.title,
        price: addon.pricePerPerson,
        quantity,
        total,
      }
    })
  const addOnsTotal = addOnsBreakdown.reduce((sum, item) => sum + item.total, 0)

  // 7. Subtotal before Tax
  const taxableSubtotal = netAccommodationTariff + cleaningFee + guestServiceFee + addOnsTotal

  // 8. 18% Hospitality GST in India
  const gstTax = Math.round(taxableSubtotal * 0.18)

  let intermediateTotal = taxableSubtotal + gstTax

  // Optional Promo Code Discount
  if (promoCode.trim().toUpperCase() === 'FIRSTSTAY' || promoCode.trim().toUpperCase() === 'NUTY2026') {
    intermediateTotal = Math.round(intermediateTotal * 0.95) // 5% promo rebate
  }

  // 9. Prepayment Discount (5% rebate if 100% upfront prepaid)
  let prepaymentDiscount = 0
  if (paymentMode === 'full-prepay') {
    prepaymentDiscount = Math.round(intermediateTotal * 0.05)
  }

  const grandTotal = Math.max(0, intermediateTotal - prepaymentDiscount)

  // 10. Deposits Due
  let immediateDepositDue = 0
  let balanceDueAtCheckIn = 0

  if (paymentMode === 'full-prepay') {
    immediateDepositDue = grandTotal
    balanceDueAtCheckIn = 0
  } else if (paymentMode === 'corporate-po') {
    immediateDepositDue = 0
    balanceDueAtCheckIn = grandTotal
  } else {
    // 20% advance token
    immediateDepositDue = Math.round(grandTotal * 0.2)
    balanceDueAtCheckIn = grandTotal - immediateDepositDue
  }

  // 11. Host Payout Ledger
  // Host earns gross accommodation tariff + cleaning fee - 3% host commission
  const hostGrossEarnings = netAccommodationTariff + cleaningFee
  const hostPlatformFee = Math.round(hostGrossEarnings * 0.03) // 3% host commission
  const hostEstimatedNetPayout = hostGrossEarnings - hostPlatformFee

  return {
    nights,
    nightlyBaseRate,
    grossRoomTariff,
    seasonalAdjustment,
    lengthOfStayDiscount,
    lengthOfStayDiscountPercent,
    netAccommodationTariff,
    cleaningFee,
    guestServiceFee,
    gstTax,
    addOnsBreakdown,
    addOnsTotal,
    prepaymentDiscount,
    grandTotal,
    immediateDepositDue,
    balanceDueAtCheckIn,
    hostGrossEarnings,
    hostPlatformFee,
    hostEstimatedNetPayout,
  }
}
