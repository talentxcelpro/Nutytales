// ─── Nuty Tales — WhatsApp Consent & Opt-Out Suppression Manager ──────────────
import { WhatsAppDbService } from './db'
import { normalizePhoneNumber } from './phone'
import { getWhatsAppProvider } from './provider'
import { WhatsAppConsentStatus } from './types'

// Global keywords that trigger immediate automated opt-out
const OPT_OUT_KEYWORDS = [
  'stop',
  'unsubscribe',
  'optout',
  'opt-out',
  'opt out',
  'cancel',
  'quit',
  'roko',
  'band karo',
  'mat bhejo',
]

// Keywords that re-enable promotional messaging
const OPT_IN_KEYWORDS = ['start', 'unstop', 'shuru', 'subscribe']

export class WhatsAppConsentManager {
  /**
   * Evaluates inbound message text for compliance keywords (STOP / START).
   * Automatically executes suppression or re-activation.
   * Returns true if a keyword was intercepted and processed.
   */
  static async handleInboundKeyword(params: {
    phoneNumber: string
    text: string
    source?: string
    ipAddress?: string
  }): Promise<{ intercepted: boolean; newStatus?: WhatsAppConsentStatus; replyText?: string }> {
    const raw = (params.text || '').trim().toLowerCase()
    const normalized = normalizePhoneNumber(params.phoneNumber).e164 || params.phoneNumber

    // Check Opt-Out Keywords
    if (OPT_OUT_KEYWORDS.includes(raw)) {
      const contact = await WhatsAppDbService.upsertContact({
        phoneNumber: normalized,
        consentStatus: 'OPTED_OUT',
      })

      await WhatsAppDbService.recordConsentChange({
        contactId: contact.id,
        phoneNumber: normalized,
        consentType: 'OPT_OUT',
        source: params.source || 'inbound_chat_keyword',
        ipAddress: params.ipAddress,
        notes: `User sent opt-out keyword: "${params.text}"`,
      })

      const replyText =
        'You have been unsubscribed from Nuty Tales promotional messages. 🛑 You will still receive essential order and shipping updates. Reply START anytime to re-enable offers.'

      // Auto-reply confirmation via provider
      try {
        const provider = getWhatsAppProvider()
        await provider.sendTextMessage({
          to: normalized,
          text: replyText,
        })
      } catch (err) {
        console.warn('[WhatsAppConsentManager] Failed sending opt-out confirmation:', err)
      }

      return { intercepted: true, newStatus: 'OPTED_OUT', replyText }
    }

    // Check Opt-In Keywords
    if (OPT_IN_KEYWORDS.includes(raw)) {
      const contact = await WhatsAppDbService.upsertContact({
        phoneNumber: normalized,
        consentStatus: 'OPTED_IN',
      })

      await WhatsAppDbService.recordConsentChange({
        contactId: contact.id,
        phoneNumber: normalized,
        consentType: 'OPT_IN',
        source: params.source || 'inbound_chat_keyword',
        ipAddress: params.ipAddress,
        notes: `User sent opt-in keyword: "${params.text}"`,
      })

      const replyText =
        'Welcome back to Nuty Tales VIP updates! 🎉 You will now receive our fresh harvest announcements, special festival deals, and restock alerts. Reply STOP anytime to opt out.'

      try {
        const provider = getWhatsAppProvider()
        await provider.sendTextMessage({
          to: normalized,
          text: replyText,
        })
      } catch (err) {
        console.warn('[WhatsAppConsentManager] Failed sending opt-in confirmation:', err)
      }

      return { intercepted: true, newStatus: 'OPTED_IN', replyText }
    }

    return { intercepted: false }
  }

  /**
   * Verifies if a recipient can be sent a message of the given category.
   * - UTILITY / AUTHENTICATION: Permitted for active transactional customers.
   * - MARKETING: Strictly requires OPTED_IN status.
   */
  static async verifyConsentForCategory(
    phoneNumber: string,
    category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION'
  ): Promise<{ allowed: boolean; reason?: string; status: WhatsAppConsentStatus }> {
    const contact = await WhatsAppDbService.getContactByPhone(phoneNumber)
    const status = contact?.consentStatus || 'PENDING'

    if (category === 'MARKETING') {
      if (status === 'OPTED_OUT') {
        return {
          allowed: false,
          status,
          reason: 'Recipient explicitly opted out of marketing broadcasts (STOP keyword or preference).',
        }
      }
      if (status === 'PENDING') {
        return {
          allowed: false,
          status,
          reason: 'Recipient has not provided verified marketing opt-in consent.',
        }
      }
    }

    // Transactional utility messages are allowed unless number is blocked
    return { allowed: true, status }
  }

  /**
   * Records explicit opt-in from checkout form checkbox or website form.
   */
  static async recordCheckoutOptIn(params: {
    phoneNumber: string
    name?: string
    email?: string
    source?: string
    ipAddress?: string
  }) {
    const normalized = normalizePhoneNumber(params.phoneNumber).e164 || params.phoneNumber
    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: normalized,
      name: params.name,
      email: params.email,
      source: params.source || 'checkout_optin',
      consentStatus: 'OPTED_IN',
    })

    await WhatsAppDbService.recordConsentChange({
      contactId: contact.id,
      phoneNumber: normalized,
      consentType: 'OPT_IN',
      source: params.source || 'checkout_optin',
      ipAddress: params.ipAddress,
      notes: 'Customer checked WhatsApp order updates & deals at checkout',
    })

    return contact
  }
}
