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
    // In mock mode, recognize either valid SHA256 test string or standard header
    return signatureHeader.startsWith('sha256=')
  }

  parseWebhookPayload(payload: MetaWebhookPayload): {
    inboundMessages: ParsedInboundMessage[]
    statusCallbacks: ParsedStatusCallback[]
  } {
    const inboundMessages: ParsedInboundMessage[] = []
    const statusCallbacks: ParsedStatusCallback[] = []

    if (!payload?.entry) return { inboundMessages, statusCallbacks }

    for (const entry of payload.entry) {
      for (const change of entry.changes || []) {
        const value = change.value
        if (!value) continue

        for (const msg of value.messages || []) {
          inboundMessages.push({
            from: msg.from,
            messageId: msg.id,
            timestamp: msg.timestamp,
            type: msg.type,
            text: msg.text?.body || msg.interactive?.button_reply?.title || '',
            buttonPayload: msg.button?.payload || msg.interactive?.button_reply?.id,
            contactName: value.contacts?.[0]?.profile?.name || 'Customer',
          })
        }

        for (const status of value.statuses || []) {
          statusCallbacks.push({
            messageId: status.id,
            status: status.status,
            timestamp: status.timestamp,
            recipientId: status.recipient_id,
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
