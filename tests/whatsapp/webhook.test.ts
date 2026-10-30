import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import crypto from 'crypto'
import { GET, POST } from '@/app/api/whatsapp/webhook/route'
import { WhatsAppDbService } from '@/lib/whatsapp/db'
import { setWhatsAppProviderForTesting, MockWhatsAppProvider } from '@/lib/whatsapp/provider'

describe('Meta WhatsApp Cloud API Webhook Integration (Task 002)', () => {
  const TEST_VERIFY_TOKEN = 'test_meta_webhook_secret_verify_token_2026'
  const TEST_APP_SECRET = 'meta_test_app_secret_xyz123'
  const TEST_PHONE_NUMBER_ID = '1418789574652138'
  const TEST_WABA_ID = '1787460769212460'
  const TEST_CUSTOMER_PHONE = '919717161809'

  let mockProvider: MockWhatsAppProvider
  const origEnv = { ...process.env }

  beforeEach(() => {
    process.env.META_WHATSAPP_VERIFY_TOKEN = TEST_VERIFY_TOKEN
    process.env.META_APP_SECRET = TEST_APP_SECRET
    process.env.META_WHATSAPP_PHONE_NUMBER_ID = TEST_PHONE_NUMBER_ID
    process.env.META_WHATSAPP_BUSINESS_ACCOUNT_ID = TEST_WABA_ID
    process.env.WHATSAPP_AUTO_REPLY_ENABLED = 'false' // Default safe mode per Task 002

    mockProvider = new MockWhatsAppProvider()
    setWhatsAppProviderForTesting(mockProvider)
  })

  afterEach(() => {
    process.env = { ...origEnv }
    setWhatsAppProviderForTesting(null)
  })

  function signPayload(payloadString: string, secret = TEST_APP_SECRET): string {
    const hmac = crypto.createHmac('sha256', secret).update(payloadString).digest('hex')
    return `sha256=${hmac}`
  }

  // 1. Valid GET verification
  it('1. GET /api/whatsapp/webhook: successfully verifies challenge with valid token and mode', async () => {
    const challengeCode = '1122334455_CHALLENGE'
    const url = `https://nutytales.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=${TEST_VERIFY_TOKEN}&hub.challenge=${challengeCode}`

    const req = new Request(url, { method: 'GET' })
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/plain')
    const text = await res.text()
    expect(text).toBe(challengeCode)
  })

  // 2. Invalid GET verification
  it('2. GET /api/whatsapp/webhook: rejects invalid token or wrong mode with HTTP 403', async () => {
    // Wrong token
    const reqWrongToken = new Request(
      `https://nutytales.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=xyz`,
      { method: 'GET' }
    )
    const resWrongToken = await GET(reqWrongToken)
    expect(resWrongToken.status).toBe(403)

    // Wrong mode
    const reqWrongMode = new Request(
      `https://nutytales.com/api/whatsapp/webhook?hub.mode=unsubscribe&hub.verify_token=${TEST_VERIFY_TOKEN}&hub.challenge=xyz`,
      { method: 'GET' }
    )
    const resWrongMode = await GET(reqWrongMode)
    expect(resWrongMode.status).toBe(403)
  })

  // 3. Valid POST HMAC-SHA256 signature
  it('3. POST /api/whatsapp/webhook: accepts valid HMAC-SHA256 signed payloads', async () => {
    const payload = {
      object: 'whatsapp_business_account',
      entry: [],
    }
    const rawBody = JSON.stringify(payload)
    const signature = signPayload(rawBody)

    const req = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signature,
      },
      body: rawBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('success')
  })

  // 4. Invalid POST HMAC-SHA256 signature
  it('4. POST /api/whatsapp/webhook: rejects invalid or missing signatures with HTTP 401', async () => {
    const rawBody = JSON.stringify({ object: 'whatsapp_business_account', entry: [] })

    // Forged signature
    const reqForged = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': 'sha256=abcdef0000000000000000000000000000000000000000000000000000000000',
      },
      body: rawBody,
    })
    const resForged = await POST(reqForged)
    expect(resForged.status).toBe(401)
    const dataForged = await resForged.json()
    expect(dataForged.error).toBe('Invalid webhook signature')

    // Missing signature header
    const reqMissing = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: rawBody,
    })
    const resMissing = await POST(reqMissing)
    expect(resMissing.status).toBe(401)
  })

  // 5. Incoming text messages ("Hello nuty tales")
  it('5. POST /api/whatsapp/webhook: persists incoming customer message and creates contact/conversation', async () => {
    const messageWamid = `wamid.TEST_INBOUND_${Date.now()}`
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: TEST_WABA_ID,
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '+91 97171 61809',
                  phone_number_id: TEST_PHONE_NUMBER_ID,
                },
                contacts: [
                  {
                    profile: { name: 'Arshid Wani' },
                    wa_id: TEST_CUSTOMER_PHONE,
                  },
                ],
                messages: [
                  {
                    from: TEST_CUSTOMER_PHONE,
                    id: messageWamid,
                    timestamp: String(Math.floor(Date.now() / 1000)),
                    type: 'text',
                    text: {
                      body: 'Hello nuty tales',
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    const rawBody = JSON.stringify(payload)
    const req = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    // Verify contact upserted
    const contact = await WhatsAppDbService.getContactByPhone('+919717161809')
    expect(contact).not.toBeNull()
    expect(contact?.name).toBe('Arshid Wani')

    // Verify conversation created
    const conv = await WhatsAppDbService.getOrCreateConversation(contact!.id)
    expect(conv).not.toBeNull()
    expect(conv.status).toBe('OPEN')

    // Verify message persisted in ledger
    const messages = await WhatsAppDbService.getConversationMessages(conv.id)
    const savedMsg = messages.find((m) => m.metaMessageId === messageWamid)
    expect(savedMsg).toBeDefined()
    expect(savedMsg?.body).toBe('Hello nuty tales')
    expect(savedMsg?.direction).toBe('INBOUND')
    expect(savedMsg?.senderType).toBe('CUSTOMER')
  })

  // 6. Duplicate message events
  it('6. POST /api/whatsapp/webhook: deduplicates repeated delivery of identical WAMID', async () => {
    const duplicateWamid = `wamid.TEST_DEDUP_${Date.now()}`
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: TEST_WABA_ID,
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  phone_number_id: TEST_PHONE_NUMBER_ID,
                },
                contacts: [{ profile: { name: 'Dedup Tester' }, wa_id: '919876543210' }],
                messages: [
                  {
                    from: '919876543210',
                    id: duplicateWamid,
                    timestamp: '1761816500',
                    type: 'text',
                    text: { body: 'Message delivered once' },
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    const rawBody = JSON.stringify(payload)

    // First POST
    const req1 = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })
    const res1 = await POST(req1)
    expect(res1.status).toBe(200)

    // Second POST (duplicate replay)
    const req2 = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })
    const res2 = await POST(req2)
    expect(res2.status).toBe(200)

    // Check message count for this contact
    const contact = await WhatsAppDbService.getContactByPhone('+919876543210')
    const conv = await WhatsAppDbService.getOrCreateConversation(contact!.id)
    const messages = await WhatsAppDbService.getConversationMessages(conv.id)
    const matching = messages.filter((m) => m.metaMessageId === duplicateWamid)
    expect(matching.length).toBe(1) // Exactly 1, deduplicated
  })

  // 7. Status updates (sent, delivered, read, failed)
  it('7. POST /api/whatsapp/webhook: updates message delivery status on status callback', async () => {
    // First, register a message in the ledger
    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: '+919999988888',
      name: 'Status Test User',
    })
    const conv = await WhatsAppDbService.getOrCreateConversation(contact.id)
    const testMetaId = `wamid.STATUS_TEST_${Date.now()}`

    await WhatsAppDbService.recordMessage({
      conversationId: conv.id,
      contactId: contact.id,
      direction: 'OUTBOUND',
      senderType: 'SYSTEM',
      body: 'Your shipment has dispatched',
      metaMessageId: testMetaId,
      deliveryStatus: 'SENT',
    })

    // Now send 'delivered' status callback
    const statusPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: TEST_WABA_ID,
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  phone_number_id: TEST_PHONE_NUMBER_ID,
                },
                statuses: [
                  {
                    id: testMetaId,
                    status: 'delivered',
                    timestamp: '1761816600',
                    recipient_id: '919999988888',
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    const rawBody = JSON.stringify(statusPayload)
    const req = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    const updatedMessages = await WhatsAppDbService.getConversationMessages(conv.id)
    const target = updatedMessages.find((m) => m.metaMessageId === testMetaId)
    expect(target?.deliveryStatus).toBe('DELIVERED')
  })

  // 8. Invalid JSON
  it('8. POST /api/whatsapp/webhook: rejects malformed JSON with HTTP 400', async () => {
    const rawBody = '{ broken_json: true, '
    const req = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toBe('Malformed JSON payload')
  })

  // 9. Unsupported event types
  it('9. POST /api/whatsapp/webhook: safely ignores non-WhatsApp business account objects', async () => {
    const payload = {
      object: 'page', // Facebook Page webhook event sent to same endpoint
      entry: [{ id: 'page_123' }],
    }
    const rawBody = JSON.stringify(payload)
    const req = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('ignored_unsupported_object')
  })

  // 10. Phone Number ID or WABA ID mismatch ignored
  it('10. POST /api/whatsapp/webhook: ignores events matching a different Phone Number ID or WABA ID', async () => {
    const foreignWamid = `wamid.FOREIGN_${Date.now()}`
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: '9999999999999999', // Foreign WABA ID
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  phone_number_id: '8888888888888888', // Foreign Phone Number ID
                },
                contacts: [{ profile: { name: 'Foreign User' }, wa_id: '911111111111' }],
                messages: [
                  {
                    from: '911111111111',
                    id: foreignWamid,
                    timestamp: '1761816700',
                    type: 'text',
                    text: { body: 'This should be filtered' },
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    const rawBody = JSON.stringify(payload)
    const req = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    // Verify foreign contact was not upserted
    const foreignContact = await WhatsAppDbService.getContactByPhone('+911111111111')
    expect(foreignContact).toBeNull()
  })

  // 11. Auto-reply suppression when WHATSAPP_AUTO_REPLY_ENABLED is false
  it('11. POST /api/whatsapp/webhook: stores message in ledger without sending outbound auto-reply when disabled', async () => {
    process.env.WHATSAPP_AUTO_REPLY_ENABLED = 'false'
    mockProvider.clearQueue()

    const autoReplyWamid = `wamid.TEST_AUTOREPLY_GATE_${Date.now()}`
    const payload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: TEST_WABA_ID,
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  phone_number_id: TEST_PHONE_NUMBER_ID,
                },
                contacts: [{ profile: { name: 'Gating Tester' }, wa_id: '917777766666' }],
                messages: [
                  {
                    from: '917777766666',
                    id: autoReplyWamid,
                    timestamp: '1761816800',
                    type: 'text',
                    text: { body: 'What is the price of Mamra almonds?' },
                  },
                ],
              },
            },
          ],
        },
      ],
    }

    const rawBody = JSON.stringify(payload)
    const req = new Request('https://nutytales.com/api/whatsapp/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hub-signature-256': signPayload(rawBody),
      },
      body: rawBody,
    })

    const res = await POST(req)
    expect(res.status).toBe(200)

    // Message must be recorded in inbound ledger
    const contact = await WhatsAppDbService.getContactByPhone('+917777766666')
    expect(contact).not.toBeNull()
    const conv = await WhatsAppDbService.getOrCreateConversation(contact!.id)
    const msgs = await WhatsAppDbService.getConversationMessages(conv.id)
    expect(msgs.some((m) => m.metaMessageId === autoReplyWamid)).toBe(true)

    // Outbound queue MUST be empty because auto-reply is disabled
    expect(mockProvider.sentQueue.length).toBe(0)
  })
})
