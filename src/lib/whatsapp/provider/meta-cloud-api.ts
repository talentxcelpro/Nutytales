// ─── Nuty Tales — Meta WhatsApp Business Cloud API Adapter ────────────────────
import crypto from 'crypto'
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

export interface MetaCloudApiConfig {
  phoneNumberId?: string
  businessAccountId?: string
  accessToken?: string
  appSecret?: string
  webhookVerifyToken?: string
  apiVersion?: string
  baseUrl?: string
}

export class MetaCloudApiAdapter implements WhatsAppProviderAdapter {
  readonly providerType = 'meta_cloud_api' as const
  private config: Required<MetaCloudApiConfig>

  constructor(customConfig?: MetaCloudApiConfig) {
    this.config = {
      phoneNumberId:
        customConfig?.phoneNumberId ||
        process.env.META_WHATSAPP_PHONE_NUMBER_ID ||
        '',
      businessAccountId:
        customConfig?.businessAccountId ||
        process.env.META_WHATSAPP_BUSINESS_ACCOUNT_ID ||
        '',
      accessToken:
        customConfig?.accessToken ||
        process.env.META_WHATSAPP_ACCESS_TOKEN ||
        '',
      appSecret:
        customConfig?.appSecret ||
        process.env.META_APP_SECRET ||
        '',
      webhookVerifyToken:
        customConfig?.webhookVerifyToken ||
        process.env.META_WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
        'nutytales_meta_verify_2026',
      apiVersion:
        customConfig?.apiVersion ||
        process.env.META_WHATSAPP_API_VERSION ||
        'v21.0',
      baseUrl: customConfig?.baseUrl || 'https://graph.facebook.com',
    }
  }

  async getHealthStatus(): Promise<ProviderHealthCheck> {
    const isConfigured = Boolean(
      this.config.phoneNumberId && this.config.accessToken
    )

    if (!isConfigured) {
      return {
        isConfigured: false,
        provider: 'meta_cloud_api',
        mode: 'production',
        status: 'UNCONFIGURED',
        message:
          'Meta Cloud API credentials pending. Configure META_WHATSAPP_PHONE_NUMBER_ID and META_WHATSAPP_ACCESS_TOKEN.',
      }
    }

    try {
      // Test credentials with Graph API endpoint for the phone number
      const url = `${this.config.baseUrl}/${this.config.apiVersion}/${this.config.phoneNumberId}`
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
        },
      })

      if (!response.ok) {
        return {
          isConfigured: true,
          provider: 'meta_cloud_api',
          mode: 'production',
          status: 'DEGRADED',
          phoneNumberId: this.config.phoneNumberId,
          businessAccountId: this.config.businessAccountId,
          message: `Graph API returned HTTP ${response.status}: ${response.statusText}`,
        }
      }

      const data = await response.json()
      return {
        isConfigured: true,
        provider: 'meta_cloud_api',
        mode: 'production',
        status: 'ONLINE',
        phoneNumberId: this.config.phoneNumberId,
        businessAccountId: this.config.businessAccountId,
        displayPhoneNumber: data.display_phone_number,
        message: 'Connected to Meta WhatsApp Cloud API.',
      }
    } catch (err: any) {
      return {
        isConfigured: true,
        provider: 'meta_cloud_api',
        mode: 'production',
        status: 'DEGRADED',
        phoneNumberId: this.config.phoneNumberId,
        message: `Connection error: ${err.message}`,
      }
    }
  }

  async sendTextMessage(
    options: SendTextMessageOptions
  ): Promise<ProviderSendResult> {
    const recipient = toWhatsAppRecipientId(options.to)
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'text',
      text: {
        preview_url: Boolean(options.previewUrl),
        body: options.text,
      },
    }

    return this.postToGraphApi(payload)
  }

  async sendTemplateMessage(
    options: SendTemplateMessageOptions
  ): Promise<ProviderSendResult> {
    const recipient = toWhatsAppRecipientId(options.to)
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'template',
      template: {
        name: options.templateName,
        language: {
          code: options.languageCode || 'en',
        },
        components: options.components || [],
      },
    }

    return this.postToGraphApi(payload)
  }

  async sendInteractiveMessage(
    options: SendInteractiveMessageOptions
  ): Promise<ProviderSendResult> {
    const recipient = toWhatsAppRecipientId(options.to)
    const buttons = options.buttons.slice(0, 3).map((b) => ({
      type: 'reply',
      reply: {
        id: b.id,
        title: b.title.substring(0, 20), // Meta limit is 20 chars
      },
    }))

    const payload: any = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipient,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: options.bodyText },
        action: { buttons },
      },
    }

    if (options.headerText) {
      payload.interactive.header = {
        type: 'text',
        text: options.headerText,
      }
    }
    if (options.footerText) {
      payload.interactive.footer = {
        text: options.footerText,
      }
    }

    return this.postToGraphApi(payload)
  }

  verifyWebhookSignature(
    rawBody: string,
    signatureHeader?: string | null
  ): boolean {
    const secret = this.config.appSecret || process.env.META_APP_SECRET
    if (!signatureHeader || !secret) {
      // Reject if signature or secret is missing
      return false
    }

    try {
      const parts = signatureHeader.split('=')
      if (parts.length !== 2 || parts[0] !== 'sha256') {
        return false
      }
      const signatureHex = parts[1]

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex')

      const sigBuffer = Buffer.from(signatureHex, 'hex')
      const expBuffer = Buffer.from(expectedSignature, 'hex')

      if (sigBuffer.length !== expBuffer.length) {
        return false
      }

      return crypto.timingSafeEqual(sigBuffer, expBuffer)
    } catch (err) {
      console.error('[MetaCloudApiAdapter] Signature verification error:', err)
      return false
    }
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

    const configuredWabaId =
      this.config.businessAccountId ||
      process.env.META_WHATSAPP_BUSINESS_ACCOUNT_ID
    const configuredPhoneId =
      this.config.phoneNumberId ||
      process.env.META_WHATSAPP_PHONE_NUMBER_ID

    for (const entry of payload.entry) {
      const entryWabaId = entry.id
      if (configuredWabaId && entryWabaId && entryWabaId !== configuredWabaId) {
        console.warn(
          `[MetaCloudApiAdapter] Skipping entry with non-matching WABA ID: ${entryWabaId}`
        )
        continue
      }

      for (const change of entry.changes || []) {
        if (change.field !== 'messages') continue
        const value = change.value
        if (!value) continue

        const metadataPhoneId = value.metadata?.phone_number_id
        if (
          configuredPhoneId &&
          metadataPhoneId &&
          metadataPhoneId !== configuredPhoneId
        ) {
          console.warn(
            `[MetaCloudApiAdapter] Skipping change with non-matching Phone Number ID: ${metadataPhoneId}`
          )
          continue
        }

        // Extract Inbound Messages
        for (const msg of value.messages || []) {
          const contact = value.contacts?.find((c) => c.wa_id === msg.from)
          let bodyText = ''
          let buttonPayload = ''
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
              buttonPayload = msg.button?.payload || ''
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
            contactName: contact?.profile?.name,
            phoneNumberId: metadataPhoneId,
            businessAccountId: entryWabaId,
          })
        }

        // Extract Status Callbacks
        for (const status of value.statuses || []) {
          let errCode: string | undefined = undefined
          let errMsg: string | undefined = undefined
          if (status.errors && status.errors.length > 0) {
            errCode = String(status.errors[0].code)
            errMsg = `${status.errors[0].title || 'Error'}: ${status.errors[0].message || 'Unknown'}`
          }

          statusCallbacks.push({
            messageId: status.id,
            status: status.status,
            timestamp: status.timestamp,
            recipientId: status.recipient_id,
            errorCode: errCode,
            errorMessage: errMsg,
            phoneNumberId: metadataPhoneId,
            businessAccountId: entryWabaId,
          })
        }
      }
    }

    return { inboundMessages, statusCallbacks }
  }

  private async postToGraphApi(payload: any): Promise<ProviderSendResult> {
    if (!this.config.phoneNumberId || !this.config.accessToken) {
      return {
        success: false,
        messageId: '',
        provider: 'meta_cloud_api',
        timestamp: new Date().toISOString(),
        error:
          'Meta Cloud API credentials not configured (META_WHATSAPP_PHONE_NUMBER_ID / META_WHATSAPP_ACCESS_TOKEN).',
      }
    }

    const url = `${this.config.baseUrl}/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg =
          data?.error?.message ||
          `HTTP ${response.status} sending WhatsApp message`
        return {
          success: false,
          messageId: '',
          provider: 'meta_cloud_api',
          timestamp: new Date().toISOString(),
          error: errorMsg,
        }
      }

      const wamid = data?.messages?.[0]?.id || `wamid.${Date.now()}`
      return {
        success: true,
        messageId: wamid,
        provider: 'meta_cloud_api',
        timestamp: new Date().toISOString(),
      }
    } catch (err: any) {
      return {
        success: false,
        messageId: '',
        provider: 'meta_cloud_api',
        timestamp: new Date().toISOString(),
        error: err.message || 'Unknown network error calling Meta Graph API',
      }
    }
  }
}
