// ─── Nuty Tales — WhatsApp Provider Adapter Interface ────────────────────────
import {
  WhatsAppProviderType,
  SendTextMessageOptions,
  SendTemplateMessageOptions,
  SendInteractiveMessageOptions,
  ProviderSendResult,
  MetaWebhookPayload,
} from '../types'

export interface ProviderHealthCheck {
  isConfigured: boolean
  provider: WhatsAppProviderType
  mode: 'production' | 'sandbox'
  phoneNumberId?: string
  businessAccountId?: string
  displayPhoneNumber?: string
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED' | 'UNCONFIGURED'
  message?: string
}

export interface ParsedInboundMessage {
  from: string // E.164 without '+'
  messageId: string
  timestamp: string
  type: string
  text?: string
  buttonPayload?: string
  interactiveReply?: { id: string; title: string }
  mediaUrl?: string
  contactName?: string
}

export interface ParsedStatusCallback {
  messageId: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  timestamp: string
  recipientId: string
  errorCode?: string
  errorMessage?: string
}

export interface WhatsAppProviderAdapter {
  readonly providerType: WhatsAppProviderType

  /**
   * Health and configuration inspection
   */
  getHealthStatus(): Promise<ProviderHealthCheck>

  /**
   * Send a freeform plain text message (within 24-hr window)
   */
  sendTextMessage(options: SendTextMessageOptions): Promise<ProviderSendResult>

  /**
   * Send an approved Meta Message Template (Utility, Marketing, Auth)
   */
  sendTemplateMessage(options: SendTemplateMessageOptions): Promise<ProviderSendResult>

  /**
   * Send an interactive button/list message (within 24-hr window)
   */
  sendInteractiveMessage(options: SendInteractiveMessageOptions): Promise<ProviderSendResult>

  /**
   * Cryptographically verify Meta webhook signature (HMAC-SHA256)
   */
  verifyWebhookSignature(rawBody: string, signatureHeader?: string | null): boolean

  /**
   * Parse incoming webhook payload into normalized events
   */
  parseWebhookPayload(payload: MetaWebhookPayload): {
    inboundMessages: ParsedInboundMessage[]
    statusCallbacks: ParsedStatusCallback[]
  }
}
