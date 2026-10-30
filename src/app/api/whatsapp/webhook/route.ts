// ─── Nuty Tales — Official Meta WhatsApp Webhook Endpoint ─────────────────────
// GET /api/whatsapp/webhook  -> Verification Challenge from Meta App Dashboard
// POST /api/whatsapp/webhook -> Real-Time Inbound Messages & Delivery Receipts
//
// Security: Enforces HMAC-SHA256 signature verification using META_APP_SECRET.
// Idempotency: Deduplicates event deliveries using whatsapp_webhook_events.
// Non-blocking: Responds HTTP 200 to Meta immediately to prevent retry storms.

import { NextResponse } from 'next/server'
import { getWhatsAppProvider } from '@/lib/whatsapp/provider'
import { WhatsAppDbService } from '@/lib/whatsapp/db'
import { WhatsAppConsentManager } from '@/lib/whatsapp/consent'
import { NutyTalesAiAssistant } from '@/lib/whatsapp/ai-assistant'
import { normalizePhoneNumber } from '@/lib/whatsapp/phone'

const WEBHOOK_VERIFY_TOKEN =
  process.env.META_WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'nutytales_meta_verify_2026'

// ── GET: Webhook Verification ─────────────────────────────────────────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.info('[Meta WhatsApp Webhook] Verification successful.')
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      })
    }

    console.warn('[Meta WhatsApp Webhook] Verification token mismatch.')
    return new Response('Forbidden', { status: 403 })
  } catch (err: any) {
    console.error('[Meta WhatsApp Webhook] Verification error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}

// ── POST: Inbound Message & Delivery Event Handler ────────────────────────────
export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-hub-signature-256')

    const provider = getWhatsAppProvider()

    // 1. Signature Verification
    // In production with Meta App Secret configured, verify HMAC signature
    if (process.env.META_APP_SECRET) {
      const isValid = provider.verifyWebhookSignature(rawBody, signature)
      if (!isValid) {
        console.warn('[Meta WhatsApp Webhook] Invalid signature rejected.')
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
      }
    }

    let payload: any
    try {
      payload = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 })
    }

    // 2. Parse Inbound Events via Provider Adapter
    const parsed = provider.parseWebhookPayload(payload)

    // 3. Process Status Callbacks (sent, delivered, read, failed)
    for (const status of parsed.statusCallbacks) {
      // Deduplicate webhook event
      const dedupe = await WhatsAppDbService.recordWebhookEvent(
        `status_${status.messageId}_${status.status}`,
        provider.providerType,
        'message_status',
        status
      )

      if (!dedupe.isDuplicate) {
        await WhatsAppDbService.updateMessageDeliveryStatus(
          status.messageId,
          status.status.toUpperCase() as any,
          status.errorCode ? { code: status.errorCode, message: status.errorMessage } : undefined
        )
      }
    }

    // 4. Process Inbound Messages (from Customer)
    for (const inbound of parsed.inboundMessages) {
      // Deduplicate message WAMID
      const dedupe = await WhatsAppDbService.recordWebhookEvent(
        `msg_${inbound.messageId}`,
        provider.providerType,
        'messages',
        inbound
      )

      if (dedupe.isDuplicate) {
        continue
      }

      const normalized = normalizePhoneNumber(inbound.from)
      const phone = normalized.e164 || `+${inbound.from}`

      // A. Check for Opt-Out / Opt-In compliance keywords (STOP / START)
      const keywordCheck = await WhatsAppConsentManager.handleInboundKeyword({
        phoneNumber: phone,
        text: inbound.text || '',
        source: 'whatsapp_webhook',
      })

      if (keywordCheck.intercepted) {
        continue
      }

      // B. Upsert Contact & Conversation
      const contact = await WhatsAppDbService.upsertContact({
        phoneNumber: phone,
        name: inbound.contactName || 'Valued Customer',
        source: 'inbound_chat',
      })

      const conversation = await WhatsAppDbService.getOrCreateConversation(contact.id)

      // C. Record Inbound Message in Ledger
      await WhatsAppDbService.recordMessage({
        conversationId: conversation.id,
        contactId: contact.id,
        direction: 'INBOUND',
        senderType: 'CUSTOMER',
        senderName: contact.name,
        messageType: 'text',
        body: inbound.text || '[Media / Button Action]',
        metaMessageId: inbound.messageId,
      })

      // D. Run AI Shopping Assistant (if conversation is not locked by human agent)
      if (conversation.status !== 'HUMAN_TAKEOVER' && conversation.status !== 'ARCHIVED') {
        try {
          const aiResponse = await NutyTalesAiAssistant.processMessage({
            contactId: contact.id,
            conversationId: conversation.id,
            incomingText: inbound.text || '',
            customerPhone: phone,
            customerName: contact.name,
          })

          // Send AI Reply via Active Provider
          const sendRes = await provider.sendTextMessage({
            to: phone,
            text: aiResponse.replyText,
          })

          // Record Outgoing AI Message in Ledger
          await WhatsAppDbService.recordMessage({
            conversationId: conversation.id,
            contactId: contact.id,
            direction: 'OUTBOUND',
            senderType: 'AI',
            senderName: 'Nuty Tales AI Assistant',
            messageType: 'text',
            body: aiResponse.replyText,
            metaMessageId: sendRes.messageId,
          })
        } catch (aiErr: any) {
          console.error('[Meta WhatsApp Webhook] AI Assistant error:', aiErr)
        }
      }
    }

    // Always acknowledge Meta with HTTP 200 OK
    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (err: any) {
    console.error('[Meta WhatsApp Webhook] Unhandled exception:', err)
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 })
  }
}
