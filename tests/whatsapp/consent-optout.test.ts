import { describe, it, expect, beforeEach } from 'vitest'
import { WhatsAppConsentManager } from '@/lib/whatsapp/consent'
import { setWhatsAppProviderForTesting, MockWhatsAppProvider } from '@/lib/whatsapp/provider'

describe('WhatsApp Consent & Opt-Out Suppression Manager', () => {
  let mockProvider: MockWhatsAppProvider

  beforeEach(() => {
    mockProvider = new MockWhatsAppProvider()
    setWhatsAppProviderForTesting(mockProvider)
  })

  it('automatically suppresses contacts when customer sends STOP or UNSUBSCRIBE', async () => {
    const phone = '+919876543210'

    const res = await WhatsAppConsentManager.handleInboundKeyword({
      phoneNumber: phone,
      text: 'STOP',
    })

    expect(res.intercepted).toBe(true)
    expect(res.newStatus).toBe('OPTED_OUT')
    expect(res.replyText).toContain('You have been unsubscribed')

    // Verify confirmation message was dispatched to customer
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].content).toContain('unsubscribed from Nuty Tales promotional messages')

    // Verify that marketing check now strictly rejects this customer
    const marketingCheck = await WhatsAppConsentManager.verifyConsentForCategory(
      phone,
      'MARKETING'
    )
    expect(marketingCheck.allowed).toBe(false)
    expect(marketingCheck.status).toBe('OPTED_OUT')

    // But essential transactional utility messages remain allowed
    const utilityCheck = await WhatsAppConsentManager.verifyConsentForCategory(
      phone,
      'UTILITY'
    )
    expect(utilityCheck.allowed).toBe(true)
  })

  it('supports Hindi opt-out keywords (ROKO, BAND KARO)', async () => {
    const phone = '+919988776655'

    const res = await WhatsAppConsentManager.handleInboundKeyword({
      phoneNumber: phone,
      text: 'band karo',
    })

    expect(res.intercepted).toBe(true)
    expect(res.newStatus).toBe('OPTED_OUT')

    const marketingCheck = await WhatsAppConsentManager.verifyConsentForCategory(
      phone,
      'MARKETING'
    )
    expect(marketingCheck.allowed).toBe(false)
  })

  it('re-activates promotional opt-in when customer sends START or SUBSCRIBE', async () => {
    const phone = '+919876543210'

    // Customer sends START to opt back in
    const res = await WhatsAppConsentManager.handleInboundKeyword({
      phoneNumber: phone,
      text: 'START',
    })

    expect(res.intercepted).toBe(true)
    expect(res.newStatus).toBe('OPTED_IN')
    expect(res.replyText).toContain('Welcome back to Nuty Tales VIP updates')

    // Marketing check should now permit campaigns
    const marketingCheck = await WhatsAppConsentManager.verifyConsentForCategory(
      phone,
      'MARKETING'
    )
    expect(marketingCheck.allowed).toBe(true)
    expect(marketingCheck.status).toBe('OPTED_IN')
  })

  it('records explicit checkout opt-in checkbox', async () => {
    const phone = '+919112233445'

    const contact = await WhatsAppConsentManager.recordCheckoutOptIn({
      phoneNumber: phone,
      name: 'Pooja Verma',
      email: 'pooja@example.com',
      source: 'checkout_checkbox',
    })

    expect(contact.consentStatus).toBe('OPTED_IN')
    expect(contact.name).toBe('Pooja Verma')

    const check = await WhatsAppConsentManager.verifyConsentForCategory(phone, 'MARKETING')
    expect(check.allowed).toBe(true)
  })
})
