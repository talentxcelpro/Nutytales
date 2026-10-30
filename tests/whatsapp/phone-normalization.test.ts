import { describe, it, expect } from 'vitest'
import {
  normalizePhoneNumber,
  isValidWhatsAppNumber,
  toWhatsAppRecipientId,
} from '@/lib/whatsapp/phone'

describe('WhatsApp Phone Normalization & Validation', () => {
  it('correctly normalizes 10-digit Indian numbers to E.164 with +91', () => {
    const res = normalizePhoneNumber('9717161809')
    expect(res.isValid).toBe(true)
    expect(res.e164).toBe('+919717161809')
    expect(res.countryCode).toBe('91')
    expect(res.nationalNumber).toBe('9717161809')
    expect(res.formattedDisplay).toBe('+91 97171 61809')
  })

  it('handles Indian numbers with leading zero', () => {
    const res = normalizePhoneNumber('09717161809')
    expect(res.isValid).toBe(true)
    expect(res.e164).toBe('+919717161809')
    expect(res.nationalNumber).toBe('9717161809')
  })

  it('handles numbers already prefixed with 91 or +91', () => {
    const res1 = normalizePhoneNumber('919717161809')
    expect(res1.isValid).toBe(true)
    expect(res1.e164).toBe('+919717161809')

    const res2 = normalizePhoneNumber('+91 97171 61809')
    expect(res2.isValid).toBe(true)
    expect(res2.e164).toBe('+919717161809')
  })

  it('strips dashes, spaces, brackets, and special characters', () => {
    const res = normalizePhoneNumber('+91 (971) 716-1809')
    expect(res.isValid).toBe(true)
    expect(res.e164).toBe('+919717161809')
  })

  it('supports international numbers (UAE, US, UK)', () => {
    const uae = normalizePhoneNumber('+971501234567')
    expect(uae.isValid).toBe(true)
    expect(uae.e164).toBe('+971501234567')

    const us = normalizePhoneNumber('+14155552671')
    expect(us.isValid).toBe(true)
    expect(us.e164).toBe('+14155552671')

    const uk = normalizePhoneNumber('+447911123456')
    expect(uk.isValid).toBe(true)
    expect(uk.e164).toBe('+447911123456')
  })

  it('rejects invalid, empty, or too short phone numbers', () => {
    expect(normalizePhoneNumber('').isValid).toBe(false)
    expect(normalizePhoneNumber('12345').isValid).toBe(false)
    expect(normalizePhoneNumber('abcd').isValid).toBe(false)
    expect(isValidWhatsAppNumber('not-a-number')).toBe(false)
  })

  it('extracts recipient ID without plus sign for Meta API', () => {
    expect(toWhatsAppRecipientId('+91 97171 61809')).toBe('919717161809')
    expect(toWhatsAppRecipientId('9717161809')).toBe('919717161809')
  })
})
