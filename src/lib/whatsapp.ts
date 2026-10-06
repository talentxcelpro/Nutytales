/**
 * WhatsApp integration helpers for NuttyTales.com.
 *
 * All phone numbers are read exclusively from environment variables.
 * Never hardcode phone numbers in source code.
 */

import { LocationCode, WHATSAPP_NUMBERS } from '@/lib/constants'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type WhatsAppLocation = Extract<
  LocationCode,
  'NOIDA' | 'KASHMIR' | 'PATNA'
>

export type WhatsAppMessageType =
  | 'bulk_quote'
  | 'order_support'
  | 'track_order'
  | 'product_inquiry'
  | 'corporate_gifting'
  | 'stays_booking'

// ─── Core Helpers ──────────────────────────────────────────────────────────────

/**
 * Build a WhatsApp click-to-chat URL.
 * @param phone - E.164 format without '+' (e.g. '919876543210')
 * @param message - Pre-filled message text (will be URI-encoded)
 */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const sanitized = phone.replace(/\D/g, '')
  return `https://wa.me/${sanitized}?text=${encodeURIComponent(message)}`
}

/**
 * Return the WhatsApp number for a given sales location.
 * Reads from NEXT_PUBLIC_WHATSAPP_{LOCATION} env vars.
 */
export function getB2BSalesWhatsApp(location: WhatsAppLocation): string {
  const number = WHATSAPP_NUMBERS[location]
  if (!number) {
    console.warn(
      `[NuttyTales] WhatsApp number for ${location} is not configured. ` +
        `Set NEXT_PUBLIC_WHATSAPP_${location} in your environment.`,
    )
  }
  return number
}

// ─── Message Templates ─────────────────────────────────────────────────────────

/**
 * Build a pre-filled WhatsApp message based on intent type.
 * @param type  - The intent / conversation type
 * @param data  - Optional dynamic substitution values
 */
export function buildWhatsAppMessage(
  type: WhatsAppMessageType,
  data?: Record<string, string>,
): string {
  switch (type) {
    case 'bulk_quote': {
      const product = data?.product ?? 'dry fruits'
      const qty = data?.quantity ?? ''
      const city = data?.city ?? ''
      return (
        `Hello Nutty Tales! 👋\n\n` +
        `I'm interested in a *bulk quote* for:\n` +
        `📦 Product: ${product}\n` +
        (qty ? `⚖️ Quantity: ${qty}\n` : '') +
        (city ? `📍 Delivery to: ${city}\n` : '') +
        `\nPlease share your best wholesale pricing. Thank you!`
      )
    }

    case 'order_support': {
      const orderId = data?.orderId ?? 'N/A'
      return (
        `Hello Nutty Tales Support! 🛎️\n\n` +
        `I need help with my order:\n` +
        `🧾 Order ID: *${orderId}*\n` +
        (data?.issue ? `❓ Issue: ${data.issue}\n` : '') +
        `\nPlease assist me. Thank you!`
      )
    }

    case 'track_order': {
      const orderId = data?.orderId ?? 'N/A'
      return (
        `Hello Nutty Tales! 📦\n\n` +
        `I'd like to track my order:\n` +
        `🧾 Order ID: *${orderId}*\n\n` +
        `Could you please share the current delivery status? Thank you!`
      )
    }

    case 'product_inquiry': {
      const product = data?.product ?? 'your products'
      return (
        `Hello Nutty Tales! 👋\n\n` +
        `I have a question about *${product}*.\n` +
        (data?.question ? `❓ ${data.question}\n` : '') +
        `\nLooking forward to your response!`
      )
    }

    case 'corporate_gifting': {
      const company = data?.company ?? ''
      const hampers = data?.hampers ?? ''
      const budget = data?.budget ?? ''
      return (
        `Hello Nutty Tales Corporate Gifting Team! 🎁\n\n` +
        `I'd like to request a *Diwali / Corporate Gift Hampers Quote*:\n` +
        (company ? `🏢 Company: ${company}\n` : '') +
        (hampers ? `📦 Number of Hampers: ${hampers}\n` : '') +
        (budget ? `💰 Budget per Hamper: ${budget}\n` : '') +
        `\nPlease share your corporate catalog and quotation. Thank you!`
      )
    }

    case 'stays_booking': {
      const property = data?.property ?? 'Kashmir / Noida / Patna'
      const dates = data?.dates ?? ''
      const guests = data?.guests ?? ''
      return (
        `Hello Nutty Tales Stays & Travel! 🏔️\n\n` +
        `I would like to enquire about staying at your *${property}* property:\n` +
        (dates ? `📅 Dates: ${dates}\n` : '') +
        (guests ? `👥 Guests: ${guests}\n` : '') +
        `\nPlease share availability and booking details. Thank you!`
      )
    }

    default:
      return `Hello Nutty Tales! 👋 I'd like to know more about your products and stays.`
  }
}

// ─── Convenience Builders ──────────────────────────────────────────────────────

/**
 * Build a full WhatsApp URL for a B2B bulk quote enquiry directed at the
 * nearest sales location.
 */
export function buildBulkQuoteWhatsAppUrl(
  location: WhatsAppLocation,
  data?: Record<string, string>,
): string {
  const phone = getB2BSalesWhatsApp(location)
  const message = buildWhatsAppMessage('bulk_quote', data)
  return buildWhatsAppUrl(phone, message)
}

/**
 * Build a WhatsApp URL for order support.
 */
export function buildOrderSupportWhatsAppUrl(orderId: string): string {
  const phone = WHATSAPP_NUMBERS.SUPPORT
  const message = buildWhatsAppMessage('order_support', { orderId })
  return buildWhatsAppUrl(phone, message)
}

/**
 * Build a WhatsApp URL for order tracking.
 */
export function buildTrackOrderWhatsAppUrl(orderId: string): string {
  const phone = WHATSAPP_NUMBERS.SUPPORT
  const message = buildWhatsAppMessage('track_order', { orderId })
  return buildWhatsAppUrl(phone, message)
}
