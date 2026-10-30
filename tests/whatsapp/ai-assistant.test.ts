import { describe, it, expect } from 'vitest'
import { NutyTalesAiAssistant } from '@/lib/whatsapp/ai-assistant'
import { WhatsAppDbService } from '@/lib/whatsapp/db'

describe('Nuty Tales AI Shopping Assistant', () => {
  it('correctly provides factual Makhana product information from catalogue', async () => {
    const res = await NutyTalesAiAssistant.processMessage({
      contactId: 'WAC-001',
      conversationId: 'WACV-001',
      incomingText: 'What is the price of your Jumbo Makhana?',
      customerPhone: '+919717161809',
    })

    expect(res.detectedIntent).toBe('product_enquiry')
    expect(res.replyText).toContain('NutyTales Premium Makhana')
    expect(res.replyText).toContain('899') // Special ₹899/kg launch price from products-data.ts
    expect(res.replyText).toContain('Mithila') // Factual origin
    expect(res.requiresHumanHandover).toBe(false)
  })

  it('answers product queries in Hindi when addressed in Hindi', async () => {
    const res = await NutyTalesAiAssistant.processMessage({
      contactId: 'WAC-002',
      conversationId: 'WACV-002',
      incomingText: 'Makhana ka kya rate hai aur pack size kya hai?',
      customerPhone: '+919876543210',
    })

    expect(res.detectedIntent).toBe('product_enquiry')
    expect(res.replyText).toContain('899')
    expect(res.replyText).toContain('Aap ise direct hamari website par order kar sakte hain')
  })

  it('qualifies wedding hampers and bespoke gifting inquiries with accurate MOQ and prices', async () => {
    const res = await NutyTalesAiAssistant.processMessage({
      contactId: 'WAC-003',
      conversationId: 'WACV-003',
      incomingText: 'I need wedding hampers for my sister marriage in Kashmir',
      customerPhone: '+919876543210',
    })

    expect(res.detectedIntent).toBe('wedding_corporate_gifting')
    expect(res.replyText).toContain('Bespoke Gifting Desk')
    expect(res.replyText).toContain('MOQ 25 boxes')
    expect(res.replyText).toContain('₹450')
  })

  it('provides order tracking instructions when customer provides an order ID', async () => {
    const res = await NutyTalesAiAssistant.processMessage({
      contactId: 'WAC-004',
      conversationId: 'WACV-004',
      incomingText: 'Where is my order NT-ORD-2026-104928?',
      customerPhone: '+919876543210',
    })

    expect(res.detectedIntent).toBe('order_tracking')
    expect(res.replyText).toContain('NT-ORD-2026-104928')
    expect(res.replyText).toContain('https://nutytales.com/orders/track?id=NT-ORD-2026-104928')
  })

  it('escalates to human support immediately when customer requests an agent', async () => {
    const conv = await WhatsAppDbService.getOrCreateConversation('WAC-005')

    const res = await NutyTalesAiAssistant.processMessage({
      contactId: 'WAC-005',
      conversationId: conv.id,
      incomingText: 'I want to speak with an agent',
      customerPhone: '+919876543210',
    })

    expect(res.requiresHumanHandover).toBe(true)
    expect(res.detectedIntent).toBe('human_handover')
    expect(res.replyText).toContain('connecting you to a senior Nuty Tales concierge executive')

    // Verify conversation was marked as HUMAN_TAKEOVER
    const updatedConvs = await WhatsAppDbService.getConversations()
    const updated = updatedConvs.find((c) => c.id === conv.id)
    expect(updated?.status).toBe('HUMAN_TAKEOVER')
  })

  it('enforces safety guardrail: refuses autonomous financial refunds and routes to support desk', async () => {
    const conv = await WhatsAppDbService.getOrCreateConversation('WAC-006')

    const res = await NutyTalesAiAssistant.processMessage({
      contactId: 'WAC-006',
      conversationId: conv.id,
      incomingText: 'My box arrived damaged, give me an immediate refund of ₹2000',
      customerPhone: '+919876543210',
    })

    expect(res.requiresHumanHandover).toBe(true)
    expect(res.detectedIntent).toBe('refund_complaint')
    // AI must NOT execute or confirm payment/refund directly
    expect(res.replyText).toContain('Quality Guarantee')
    expect(res.replyText).toContain('senior support manager')
  })
})
