import { describe, it, expect, beforeEach } from 'vitest'
import { WhatsAppAutomationEngine } from '@/lib/whatsapp/automations'
import { setWhatsAppProviderForTesting, MockWhatsAppProvider } from '@/lib/whatsapp/provider'
import { WhatsAppConsentManager } from '@/lib/whatsapp/consent'

describe('WhatsApp Event-Driven Commerce Automation Workflows', () => {
  let mockProvider: MockWhatsAppProvider

  beforeEach(() => {
    mockProvider = new MockWhatsAppProvider()
    setWhatsAppProviderForTesting(mockProvider)
  })

  it('executes Order Confirmation workflow and enforces strict idempotency', async () => {
    const orderId = `NT-ORD-TEST-${Date.now()}`
    const phone = '+919717161809'

    // First trigger: should execute and send notification
    const res1 = await WhatsAppAutomationEngine.handleOrderConfirmation({
      orderId,
      orderNumber: orderId,
      customerName: 'Aarav Patel',
      customerPhone: phone,
      totalAmount: 2499,
      itemCount: 2,
    })

    expect(res1.success).toBe(true)
    expect(res1.skipped).toBeFalsy()
    expect(res1.messageId).toBeDefined()
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].content.template).toBe('order_confirmation_v1')

    // Second trigger with exact same orderId: should skip duplicate dispatch
    const res2 = await WhatsAppAutomationEngine.handleOrderConfirmation({
      orderId,
      customerName: 'Aarav Patel',
      customerPhone: phone,
      totalAmount: 2499,
    })

    expect(res2.success).toBe(true)
    expect(res2.skipped).toBe(true)
    expect(res2.reason).toContain('already dispatched')
    // Sent queue should NOT increase
    expect(mockProvider.sentQueue.length).toBe(1)
  })

  it('executes Payment Confirmation workflow upon server-side verification', async () => {
    const paymentId = `pay_mock_${Date.now()}`
    const orderId = 'NT-ORD-2026-999'

    const res = await WhatsAppAutomationEngine.handlePaymentConfirmation({
      orderId,
      paymentId,
      gateway: 'razorpay',
      amount: 1899,
      customerPhone: '+919876543210',
      customerName: 'Simran Kaur',
    })

    expect(res.success).toBe(true)
    expect(res.messageId).toBeDefined()
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].content.template).toBe('payment_received_v1')

    // Idempotency check on replayed webhook
    const replay = await WhatsAppAutomationEngine.handlePaymentConfirmation({
      orderId,
      paymentId,
      gateway: 'razorpay',
      amount: 1899,
      customerPhone: '+919876543210',
    })
    expect(replay.skipped).toBe(true)
  })

  it('executes Order Dispatch notification with live tracking URL', async () => {
    const res = await WhatsAppAutomationEngine.handleOrderDispatch({
      orderId: 'NT-ORD-DISP-101',
      customerPhone: '+919876543210',
      customerName: 'Priya Mehta',
      carrierName: 'BlueDart Express',
      trackingNumber: 'BLUEDART123456789',
      trackingUrl: 'https://track.bluedart.com/123456789',
    })

    expect(res.success).toBe(true)
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].content.template).toBe('order_dispatched_v1')
  })

  it('executes Delivery Confirmation & feedback inquiry', async () => {
    const res = await WhatsAppAutomationEngine.handleDeliveryConfirmation({
      orderId: 'NT-ORD-DELIV-202',
      customerPhone: '+919876543210',
      customerName: 'Karan Singh',
    })

    expect(res.success).toBe(true)
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].content).toContain('Delivered! 📦')
  })

  it('Abandoned Cart workflow respects customer opt-out and skips non-consenting users', async () => {
    const phone = '+919999888877'

    // Customer has opted out
    await WhatsAppConsentManager.handleInboundKeyword({
      phoneNumber: phone,
      text: 'STOP',
    })

    mockProvider.clearQueue()

    // Trigger abandoned cart recovery
    const res = await WhatsAppAutomationEngine.handleAbandonedCartRecovery({
      cartSessionId: 'cart_sess_9999',
      customerPhone: phone,
      customerName: 'Vikram',
      abandonedItemNames: ['California Almonds', 'Jumbo Makhana'],
      cartTotal: 1749,
    })

    expect(res.success).toBe(false)
    expect(res.skipped).toBe(true)
    expect(res.reason).toContain('opted out')
    // No promotional message should have been dispatched
    expect(mockProvider.sentQueue.length).toBe(0)
  })

  it('Abandoned Cart workflow delivers recovery code when customer has consented', async () => {
    const phone = '+919555444333'

    // Explicit opt-in at checkout
    await WhatsAppConsentManager.recordCheckoutOptIn({
      phoneNumber: phone,
      name: 'Sneha Roy',
    })

    mockProvider.clearQueue()

    const res = await WhatsAppAutomationEngine.handleAbandonedCartRecovery({
      cartSessionId: `cart_${Date.now()}`,
      customerPhone: phone,
      customerName: 'Sneha Roy',
      abandonedItemNames: ['Jumbo Makhana 6 Suta'],
      cartTotal: 899,
    })

    expect(res.success).toBe(true)
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].content).toContain('NUTY10')
  })
})
