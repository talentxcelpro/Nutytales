import { describe, it, expect, beforeEach } from 'vitest'
import crypto from 'crypto'
import {
  MockWhatsAppProvider,
  MetaCloudApiAdapter,
} from '@/lib/whatsapp/provider'
import { MetaWebhookPayload } from '@/lib/whatsapp/types'

describe('WhatsApp Provider Adapters & Webhook Verification', () => {
  let mockProvider: MockWhatsAppProvider

  beforeEach(() => {
    mockProvider = new MockWhatsAppProvider()
  })

  it('MockProvider successfully dispatches text messages and records in queue', async () => {
    const res = await mockProvider.sendTextMessage({
      to: '+919717161809',
      text: 'Test order notification',
    })

    expect(res.success).toBe(true)
    expect(res.provider).toBe('mock_sandbox')
    expect(res.messageId).toContain('wamid.MOCK_TXT_')
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].to).toBe('919717161809')
    expect(mockProvider.sentQueue[0].content).toBe('Test order notification')
  })

  it('MockProvider successfully dispatches template messages with components', async () => {
    const res = await mockProvider.sendTemplateMessage({
      to: '+919717161809',
      templateName: 'order_confirmation_v1',
      components: [
        {
          type: 'body',
          parameters: [{ type: 'text', text: 'Arshid' }, { type: 'text', text: 'NT-ORD-101' }],
        },
      ],
    })

    expect(res.success).toBe(true)
    expect(res.messageId).toContain('wamid.MOCK_TMPL_')
    expect(mockProvider.sentQueue.length).toBe(1)
    expect(mockProvider.sentQueue[0].content.template).toBe('order_confirmation_v1')
  })

  it('MetaCloudApiAdapter correctly verifies valid HMAC-SHA256 signatures', () => {
    const appSecret = 'test_secret_key_12345'
    const adapter = new MetaCloudApiAdapter({ appSecret })

    const rawBody = JSON.stringify({ object: 'whatsapp_business_account', entry: [] })
    const validSignature = crypto
      .createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex')

    const verified = adapter.verifyWebhookSignature(rawBody, `sha256=${validSignature}`)
    expect(verified).toBe(true)
  })

  it('MetaCloudApiAdapter rejects forged or mismatched HMAC signatures', () => {
    const appSecret = 'test_secret_key_12345'
    const adapter = new MetaCloudApiAdapter({ appSecret })

    const rawBody = JSON.stringify({ object: 'whatsapp_business_account', entry: [] })
    const forgedSignature = 'sha256=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'

    expect(adapter.verifyWebhookSignature(rawBody, forgedSignature)).toBe(false)
    expect(adapter.verifyWebhookSignature(rawBody, null)).toBe(false)
    expect(adapter.verifyWebhookSignature(rawBody, 'invalid-prefix-no-sha256')).toBe(false)
  })

  it('correctly parses inbound customer messages and interactive clicks from Meta webhook payload', () => {
    const adapter = new MetaCloudApiAdapter()
    const mockPayload: MetaWebhookPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '10928374',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '+91 97171 61809',
                  phone_number_id: '1234567890',
                },
                contacts: [
                  {
                    profile: { name: 'Rahul Sharma' },
                    wa_id: '919876543210',
                  },
                ],
                messages: [
                  {
                    from: '919876543210',
                    id: 'wamid.HBgLMTEwNTA0MTkyMzQ1FQIAEhgUM0VCMDcxM0U4Q0U3NTNENDMzMEEA',
                    timestamp: '1730278900',
                    type: 'text',
                    text: { body: 'What is the price of 1kg California Almonds?' },
                  },
                  {
                    from: '919876543210',
                    id: 'wamid.HBgLMTEwNTA0MTkyMzQ2FQIAEhgUM0VCMDcxM0U4Q0U3NTNENDMzMEEB',
                    timestamp: '1730278920',
                    type: 'interactive',
                    interactive: {
                      type: 'button_reply',
                      button_reply: {
                        id: 'track_order_btn',
                        title: 'Track My Order',
                      },
                    },
                  },
                ],
                statuses: [
                  {
                    id: 'wamid.HBgLMTEwNTA0MTkyMzQ3FQIAEhgUM0VCMDcxM0U4Q0U3NTNENDMzMEEC',
                    status: 'delivered',
                    timestamp: '1730278910',
                    recipient_id: '919876543210',
                  },
                  {
                    id: 'wamid.HBgLMTEwNTA0MTkyMzQ4FQIAEhgUM0VCMDcxM0U4Q0U3NTNENDMzMEED',
                    status: 'read',
                    timestamp: '1730278915',
                    recipient_id: '919876543210',
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    const { inboundMessages, statusCallbacks } = adapter.parseWebhookPayload(mockPayload)

    expect(inboundMessages.length).toBe(2)
    expect(inboundMessages[0].from).toBe('919876543210')
    expect(inboundMessages[0].text).toBe('What is the price of 1kg California Almonds?')
    expect(inboundMessages[0].contactName).toBe('Rahul Sharma')

    expect(inboundMessages[1].interactiveReply?.id).toBe('track_order_btn')
    expect(inboundMessages[1].interactiveReply?.title).toBe('Track My Order')

    expect(statusCallbacks.length).toBe(2)
    expect(statusCallbacks[0].status).toBe('delivered')
    expect(statusCallbacks[1].status).toBe('read')
  })
})
