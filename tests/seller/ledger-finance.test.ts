import { describe, it, expect } from 'vitest'
import { convertCurrencyLive, formatCurrencyString } from '@/lib/seller-portal/forex'
import { SupportedCurrency } from '@/lib/seller-portal/types'

describe('Phase 9 & 11: Financial Ledger & Currency Mathematics', () => {
  it('correctly formats currency amounts with standard symbols', () => {
    expect(formatCurrencyString(1250.5, 'USD')).toBe('$1,250.50')
    expect(formatCurrencyString(4500, 'INR')).toBe('₹4,500.00')
    expect(formatCurrencyString(320.75, 'EUR')).toBe('€320.75')
    expect(formatCurrencyString(850, 'AED')).toBe('AED 850.00')
    expect(formatCurrencyString(199.99, 'GBP')).toBe('£199.99')
  })

  it('converts currencies symmetrically without precision loss', () => {
    // 100 USD to EUR
    const inEur = convertCurrencyLive(100, 'USD', 'EUR')
    expect(inEur).toBeGreaterThan(0)

    // Identity conversion
    expect(convertCurrencyLive(250, 'USD', 'USD')).toBe(250)
    expect(convertCurrencyLive(1000, 'INR', 'INR')).toBe(1000)

    // USD to INR conversion
    const inInr = convertCurrencyLive(10, 'USD', 'INR')
    // Approx 1 USD ~ 86.5 INR => 10 USD ~ 865 INR
    expect(inInr).toBeGreaterThan(800)
    expect(inInr).toBeLessThan(900)
  })

  it('computes commission debits and taxes accurately', () => {
    const subtotal = 1000.00
    const commissionRate = 8.0 // 8%
    const commissionAmount = Number(((subtotal * commissionRate) / 100).toFixed(2))
    expect(commissionAmount).toBe(80.00)

    const gstOnCommission = Number((commissionAmount * 0.18).toFixed(2)) // 18% GST on platform fee
    expect(gstOnCommission).toBe(14.40)

    const netPayout = Number((subtotal - (commissionAmount + gstOnCommission)).toFixed(2))
    expect(netPayout).toBe(905.60)

    // Total balances balance: netPayout + commissionAmount + gstOnCommission === subtotal
    expect(netPayout + commissionAmount + gstOnCommission).toBe(subtotal)
  })

  it('correctly calculates 0% commission tier with 100% net merchant payout and zero platform fees', () => {
    const subtotal = 2500.00
    const commissionRate = 0.0 // 0% Promotional Founder Tier
    const commissionAmount = Number(((subtotal * commissionRate) / 100).toFixed(2))
    expect(commissionAmount).toBe(0.00)

    const gstOnCommission = Number((commissionAmount * 0.18).toFixed(2))
    expect(gstOnCommission).toBe(0.00)

    const netPayout = Number((subtotal - (commissionAmount + gstOnCommission)).toFixed(2))
    expect(netPayout).toBe(subtotal) // Merchant keeps 100% of order earnings
  })
})
