// ─── Nuty Tales — International Phone Normalization Utility ───────────────────
// Strict E.164 format normalization and validation for WhatsApp delivery

export interface NormalizedPhoneResult {
  isValid: boolean
  e164: string // e.g. +919717161809
  digitsOnly: string // e.g. 919717161809
  countryCode: string // e.g. 91
  nationalNumber: string // e.g. 9717161809
  formattedDisplay: string // e.g. +91 97171 61809
  error?: string
}

/**
 * Normalizes any user-inputted phone number to standard international E.164 format.
 * Defaults to India (+91) if a 10-digit national number is supplied without country code.
 */
export function normalizePhoneNumber(rawPhone?: string | null): NormalizedPhoneResult {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return {
      isValid: false,
      e164: '',
      digitsOnly: '',
      countryCode: '',
      nationalNumber: '',
      formattedDisplay: '',
      error: 'Empty or invalid phone number input',
    }
  }

  // Remove all non-digit characters except leading '+'
  const trimmed = rawPhone.trim()
  const hasLeadingPlus = trimmed.startsWith('+')
  const cleanDigits = trimmed.replace(/\D/g, '')

  if (!cleanDigits) {
    return {
      isValid: false,
      e164: '',
      digitsOnly: '',
      countryCode: '',
      nationalNumber: '',
      formattedDisplay: '',
      error: 'Phone contains no numeric digits',
    }
  }

  let fullDigits = cleanDigits

  // Case 1: Indian 10-digit mobile number (e.g. "9717161809" or "09717161809")
  if (cleanDigits.length === 10 && /^[6-9]\d{9}$/.test(cleanDigits)) {
    fullDigits = `91${cleanDigits}`
  } else if (cleanDigits.length === 11 && cleanDigits.startsWith('0') && /^[6-9]\d{9}$/.test(cleanDigits.substring(1))) {
    fullDigits = `91${cleanDigits.substring(1)}`
  }
  // Case 2: Indian 12-digit number starting with 91 (e.g. "919717161809")
  else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
    fullDigits = cleanDigits
  }
  // Case 3: If explicit leading '+' was present with 11-15 digits (e.g. +14155552671, +971501234567)
  else if (hasLeadingPlus && cleanDigits.length >= 10 && cleanDigits.length <= 15) {
    fullDigits = cleanDigits
  }
  // Case 4: International number without '+' but length >= 11 (e.g. 971501234567, 447911123456)
  else if (cleanDigits.length >= 11 && cleanDigits.length <= 15) {
    fullDigits = cleanDigits
  } else {
    return {
      isValid: false,
      e164: `+${cleanDigits}`,
      digitsOnly: cleanDigits,
      countryCode: '',
      nationalNumber: cleanDigits,
      formattedDisplay: rawPhone,
      error: `Invalid phone length (${cleanDigits.length} digits). Standard E.164 requires 10-15 digits.`,
    }
  }

  // Detect country code and format display
  let countryCode = '91'
  let nationalNumber = fullDigits.substring(2)
  let formattedDisplay = `+${fullDigits}`

  if (fullDigits.startsWith('91') && fullDigits.length === 12) {
    countryCode = '91'
    nationalNumber = fullDigits.substring(2)
    formattedDisplay = `+91 ${nationalNumber.substring(0, 5)} ${nationalNumber.substring(5)}`
  } else if (fullDigits.startsWith('1') && fullDigits.length === 11) {
    countryCode = '1'
    nationalNumber = fullDigits.substring(1)
    formattedDisplay = `+1 (${nationalNumber.substring(0, 3)}) ${nationalNumber.substring(3, 6)}-${nationalNumber.substring(6)}`
  } else if (fullDigits.startsWith('971') && fullDigits.length === 12) {
    countryCode = '971'
    nationalNumber = fullDigits.substring(3)
    formattedDisplay = `+971 ${nationalNumber.substring(0, 2)} ${nationalNumber.substring(2)}`
  } else if (fullDigits.startsWith('44') && fullDigits.length >= 12) {
    countryCode = '44'
    nationalNumber = fullDigits.substring(2)
    formattedDisplay = `+44 ${nationalNumber.substring(0, 4)} ${nationalNumber.substring(4)}`
  }

  return {
    isValid: true,
    e164: `+${fullDigits}`,
    digitsOnly: fullDigits,
    countryCode,
    nationalNumber,
    formattedDisplay,
  }
}

/**
 * Validates whether a phone number string can be safely messaged via WhatsApp.
 */
export function isValidWhatsAppNumber(rawPhone?: string | null): boolean {
  return normalizePhoneNumber(rawPhone).isValid
}

/**
 * Extracts a bare digits string for WhatsApp wa.me links or Meta API parameters.
 * E.g., "+91 97171 61809" -> "919717161809"
 */
export function toWhatsAppRecipientId(rawPhone: string): string {
  const result = normalizePhoneNumber(rawPhone)
  return result.digitsOnly
}
