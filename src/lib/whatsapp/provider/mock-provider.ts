// ─── Nuty Tales — Mock WhatsApp Provider Adapter (Sandbox & Testing) ──────────
import {
  WhatsAppProviderAdapter,
  ProviderHealthCheck,
  ParsedInboundMessage,
  ParsedStatusCallback,
} from './adapter'
import {
  SendTextMessageOptions,
  SendTemplateMessageOptions,
  SendInteractiveMessageOptions,
  ProviderSendResult,
  MetaWebhookPayload,
} from '../types'
import { toWhatsAppRecipientId } from '../phone'

export interface MockSentMessage {
  id: string
  to: string
  type: 'text' | 'template' | 'interactive'
  content: any
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

export class MockWhatsAppProvider implements WhatsAppProviderAdapter {
  readonly providerType = 'mock_sandbox' as const
  public sentQueue: MockSentMessage[] = []
  public shouldFail: boolean = false
  public failureMessage: string = 'Simulated mock provider failure'

  async getHealthStatus(): Promise<ProviderHealthCheck> {
    return {
      isConfigured: true,
      provider: 'mock_sandbox',
      mode: 'sandbox',
      phoneNumberId: 'mock_phone_number_id_919717161809',
      businessAccountId: 'mock_waba_id_nutytales',
      displayPhoneNumber: '+91 97171 61809',
      status: this.shouldFail ? 'DEGRADED' : 'ONLINE',
      message: 'Mock WhatsApp Provider active for automated tests and sandbox simulation.',
    }
  }

  async sendTextMessage(
    options: SendTextMessageOptions
  ): Promise<ProviderSendResult> {
    if (this.shouldFail) {
      return {
        success: false,
        messageId: '',
        provider: 'mock_sandbox',
        timestamp: new Date().toISOString(),
        error: this.failureMessage,
      }
    }

    const recipient = toWhatsAppRecipientId(options.to)
    const wamid = `wamid.MOCK_TXT_${Date.now()}_${Math.floor(Math.random() * 10000)}`

    this.sentQueue.push({
      id: wamid,
      to: recipient,
      type: 'text',
      content: options.text,
      timestamp: new Date().toISOString(),
      status: 'sent',
    })

    return {
      success: true,
      messageId: wamid,
      provider: 'mock_sandbox',
      timestamp: new Date().toISOString(),
    }
  }

  async sendTemplateMessage(
    options: SendTemplateMessageOptions
  ): Promise<ProviderSendResult> {
    if (this.shouldFail) {
      return {
        success: false,
        messageId: '',
        provider: 'mock_sandbox',
        timestamp: new Date().toISOString(),
        error: this.failureMessage,
      }
    }

    const recipient = toWhatsAppRecipientId(options.to)
    const wamid = `wamid.MOCK_TMPL_${Date.now()}_${Math.floor(Math.random() * 10000)}`

    this.sentQueue.push({
      id: wamid,
      to: recipient,
      type: 'template',
      content: {
        template: options.templateName,
        language: options.languageCode || 'en',
        components: options.components,
      },
      timestamp: new Date().toISOString(),
      status: 'sent',
    })

    return {
      success: true,
      messageId: wamid,
      provider: 'mock_sandbox',
      timestamp: new Date().toISOString(),
    }
  }

  async sendInteractiveMessage(
    options: SendInteractiveMessageOptions
  ): Promise<ProviderSendResult> {
    if (this.shouldFail) {
      return {
        success: false,
        messageId: '',
        provider: 'mock_sandbox',
        timestamp: new Date().toISOString(),
        error: this.failureMessage,
      }
    }

    const recipient = toWhatsAppRecipientId(options.to)
    const wamid = `wamid.MOCK_INT_${Date.now()}_${Math.floor(Math.random() * 10000)}`

    this.sentQueue.push({
      id: wamid,
      to: recipient,
      type: 'interactive',
      content: {
        body: options.bodyText,
        buttons: options.buttons,
      },
      timestamp: new Date().toISOString(),
      status: 'sent',
    })

    return {
      success: true,
      messageId: wamid,
      provider: 'mock_sandbox',
      timestamp: new Date().toISOString(),
    }
  }

  verifyWebhookSignature(
    rawBody: string,
    signatureHeader?: string | null
  ): boolean {
    if (!signatureHeader) return false
    const secret = process.env.META_APP_SECRET
    if (secret) {
      try {
        const parts = signatureHeader.split('=')
        if (parts.length !== 2 || parts[0] !== 'sha256') return false
        const signatureHex = parts[1]
        const crypto = require('crypto')
        const expected = crypto
          .createHmac('sha256', secret)
          .update(rawBody)
          .digest('hex')
        const sigBuffer = Buffer.from(signatureHex, 'hex')
        const expBuffer = Buffer.from(expected, 'hex')
        if (sigBuffer.length !== expBuffer.length) return false
        return crypto.timingSafeEqual(sigBuffer, expBuffer)
      } catch {
        return false
      }
    }
    // In mock mode without secret configured, recognize valid sha256 prefix
    return signatureHeader.startsWith('sha256=')
  }

  parseWebhookPayload(payload: MetaWebhookPayload): {
    inboundMessages: ParsedInboundMessage[]
    statusCallbacks: ParsedStatusCallback[]
  } {
    const inboundMessages: ParsedInboundMessage[] = []
    const statusCallbacks: ParsedStatusCallback[] = []

    if (!payload?.entry || !Array.isArray(payload.entry)) {
      return { inboundMessages, statusCallbacks }
    }

    const configuredWabaId = process.env.META_WHATSAPP_BUSINESS_ACCOUNT_ID
    const configuredPhoneId = process.env.META_WHATSAPP_PHONE_NUMBER_ID

    for (const entry of payload.entry) {
      const entryWabaId = entry.id
      if (configuredWabaId && entryWabaId && entryWabaId !== configuredWabaId) {
        continue
      }

      for (const change of entry.changes || []) {
        const value = change.value
        if (!value) continue

        const metadataPhoneId = value.metadata?.phone_number_id
        if (
          configuredPhoneId &&
          metadataPhoneId &&
          metadataPhoneId !== configuredPhoneId
        ) {
          continue
        }

        for (const msg of value.messages || []) {
          let bodyText = ''
          let buttonPayload = msg.button?.payload || msg.interactive?.button_reply?.id || ''
          let interactiveReply: { id: string; title: string } | undefined = undefined
          let mediaId: string | undefined = undefined
          let mimeType: string | undefined = undefined
          let filename: string | undefined = undefined

          switch (msg.type) {
            case 'text':
              bodyText = msg.text?.body || ''
              break
            case 'image':
              mediaId = msg.image?.id
              mimeType = msg.image?.mime_type
              bodyText = msg.image?.caption || '[Image]'
              break
            case 'document':
              mediaId = msg.document?.id
              mimeType = msg.document?.mime_type
              filename = msg.document?.filename
              bodyText = msg.document?.caption || filename || '[Document]'
              break
            case 'audio':
              mediaId = msg.audio?.id
              mimeType = msg.audio?.mime_type
              bodyText = '[Audio Message]'
              break
            case 'video':
              mediaId = msg.video?.id
              mimeType = msg.video?.mime_type
              bodyText = msg.video?.caption || '[Video]'
              break
            case 'location': {
              const loc = msg.location
              bodyText = `[Location: ${loc?.name || ''} ${loc?.address || ''} (${loc?.latitude}, ${loc?.longitude})]`.trim()
              break
            }
            case 'button':
              bodyText = msg.button?.text || buttonPayload || '[Button Click]'
              break
            case 'interactive':
              if (msg.interactive?.button_reply) {
                interactiveReply = {
                  id: msg.interactive.button_reply.id,
                  title: msg.interactive.button_reply.title,
                }
                bodyText = msg.interactive.button_reply.title
              } else if (msg.interactive?.list_reply) {
                interactiveReply = {
                  id: msg.interactive.list_reply.id,
                  title: msg.interactive.list_reply.title,
                }
                bodyText = msg.interactive.list_reply.title
              } else {
                bodyText = '[Interactive Reply]'
              }
              break
            default:
              bodyText = msg.text?.body || `[Unsupported Message Type: ${msg.type}]`
              break
          }

          inboundMessages.push({
            from: msg.from,
            messageId: msg.id,
            timestamp: msg.timestamp,
            type: msg.type,
            text: bodyText,
            buttonPayload,
            interactiveReply,
            mediaId,
            mimeType,
            filename,
            contactName: value.contacts?.[0]?.profile?.name || 'Customer',
            phoneNumberId: metadataPhoneId,
            businessAccountId: entryWabaId,
          })
        }

        for (const status of value.statuses || []) {
          statusCallbacks.push({
            messageId: status.id,
            status: status.status,
            timestamp: status.timestamp,
            recipientId: status.recipient_id,
            errorCode: status.errors?.[0]?.code ? String(status.errors[0].code) : undefined,
            errorMessage: status.errors?.[0]?.message,
            phoneNumberId: metadataPhoneId,
            businessAccountId: entryWabaId,
          })
        }
      }
    }

    return { inboundMessages, statusCallbacks }
  }

  clearQueue() {
    this.sentQueue = []
    this.shouldFail = false
  }
}
