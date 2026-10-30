// ─── Nuty Tales — WhatsApp Commerce OS Type Definitions ───────────────────────

export type WhatsAppProviderType = 'meta_cloud_api' | 'mock_sandbox' | 'baileys_experimental'

export type WhatsAppSenderType = 'CUSTOMER' | 'AI' | 'AGENT' | 'SYSTEM'

export type WhatsAppDirection = 'INBOUND' | 'OUTBOUND'

export type WhatsAppMessageType =
  | 'text'
  | 'template'
  | 'image'
  | 'document'
  | 'audio'
  | 'video'
  | 'location'
  | 'interactive'

export type WhatsAppDeliveryStatus =
  | 'PENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'

export type WhatsAppConversationStatus =
  | 'OPEN'
  | 'AI_ACTIVE'
  | 'HUMAN_TAKEOVER'
  | 'RESOLVED'
  | 'ARCHIVED'

export type WhatsAppConsentStatus = 'OPTED_IN' | 'OPTED_OUT' | 'PENDING'

export type WhatsAppCustomerSegment =
  | 'new_customer'
  | 'first_time_buyer'
  | 'repeat_customer'
  | 'high_value'
  | 'inactive'
  | 'abandoned_checkout'
  | 'wedding_gifting'
  | 'wholesale'

export type WhatsAppAutomationTrigger =
  | 'ORDER_CONFIRMED'
  | 'PAYMENT_CAPTURED'
  | 'ORDER_DISPATCHED'
  | 'ORDER_DELIVERED'
  | 'CART_ABANDONED'
  | 'REPEAT_PURCHASE_NUDGE'

export type WhatsAppCampaignCategory =
  | 'seasonal_promotion'
  | 'dry_fruits_nuts'
  | 'kashmiri_products'
  | 'wedding_hampers'
  | 'corporate_gifting'
  | 'repeat_purchase'

export type WhatsAppCampaignStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'PAUSED'
  | 'CANCELLED'

// ── Contact ───────────────────────────────────────────────────────────────────
export interface WhatsAppContact {
  id: string
  phoneNumber: string // E.164 format, e.g. +919717161809
  formattedPhone?: string
  name: string
  email?: string
  userId?: string
  source: string
  segment: WhatsAppCustomerSegment
  preferredLanguage: 'en' | 'hi'
  totalOrders: number
  totalSpend: number
  lastOrderId?: string
  lastOrderAt?: string
  consentStatus: WhatsAppConsentStatus
  consentTimestamp?: string
  optOutTimestamp?: string
  notes?: string
  tags: string[]
  firstInteractionAt: string
  lastInteractionAt: string
  createdAt: string
  updatedAt: string
}

// ── Conversation ──────────────────────────────────────────────────────────────
export interface WhatsAppConversation {
  id: string
  contactId: string
  status: WhatsAppConversationStatus
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  assignedTo?: string
  unreadCount: number
  lastMessagePreview?: string
  lastMessageAt: string
  isPinned: boolean
  labels: string[]
  internalNotes?: string
  closedAt?: string
  contact?: WhatsAppContact
  messages?: WhatsAppMessage[]
  createdAt: string
  updatedAt: string
}

// ── Message ───────────────────────────────────────────────────────────────────
export interface WhatsAppMessage {
  id: string
  conversationId: string
  contactId: string
  metaMessageId?: string
  direction: WhatsAppDirection
  senderType: WhatsAppSenderType
  senderName?: string
  messageType: WhatsAppMessageType
  body: string
  templateName?: string
  templateParams?: Record<string, any>
  mediaUrl?: string
  mediaType?: string
  deliveryStatus: WhatsAppDeliveryStatus
  errorCode?: string
  errorMessage?: string
  sentAt: string
  deliveredAt?: string
  readAt?: string
  createdAt: string
}

// ── Message Template ──────────────────────────────────────────────────────────
export interface WhatsAppTemplateButton {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER'
  text: string
  url?: string
  phoneNumber?: string
}

export interface WhatsAppMessageTemplate {
  id: string
  name: string
  displayTitle: string
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION'
  language: 'en' | 'hi'
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'PAUSED'
  headerType?: 'NONE' | 'TEXT' | 'IMAGE' | 'DOCUMENT'
  headerContent?: string
  bodyText: string
  footerText?: string
  buttons: WhatsAppTemplateButton[]
  variableMapping?: string[]
}

// ── Provider Payload Formats ─────────────────────────────────────────────────
export interface SendTextMessageOptions {
  to: string // E.164
  text: string
  previewUrl?: boolean
}

export interface SendTemplateMessageOptions {
  to: string // E.164
  templateName: string
  languageCode?: string
  components?: Array<{
    type: 'header' | 'body' | 'button'
    parameters: Array<{
      type: 'text' | 'image' | 'payload'
      text?: string
      image?: { link: string }
      payload?: string
    }>
    sub_type?: 'quick_reply' | 'url'
    index?: number
  }>
}

export interface SendInteractiveMessageOptions {
  to: string
  bodyText: string
  headerText?: string
  footerText?: string
  buttons: Array<{ id: string; title: string }>
}

export interface ProviderSendResult {
  success: boolean
  messageId: string
  provider: WhatsAppProviderType
  timestamp: string
  error?: string
}

// ── Webhook Formats (Meta Graph API) ──────────────────────────────────────────
export interface MetaWebhookPayload {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      field: string
      value: {
        messaging_product: 'whatsapp'
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        contacts?: Array<{
          profile: { name: string }
          wa_id: string
        }>
        messages?: Array<{
          from: string
          id: string
          timestamp: string
          type: string
          text?: { body: string }
          interactive?: {
            type: string
            button_reply?: { id: string; title: string }
            list_reply?: { id: string; title: string; description?: string }
          }
          button?: { text: string; payload?: string }
          image?: { id: string; mime_type: string; sha256?: string; caption?: string }
          document?: { id: string; mime_type: string; sha256?: string; filename?: string; caption?: string }
          audio?: { id: string; mime_type: string }
          video?: { id: string; mime_type: string; sha256?: string; caption?: string }
          location?: { latitude: number; longitude: number; name?: string; address?: string }
          [key: string]: any
        }>
        statuses?: Array<{
          id: string
          status: 'sent' | 'delivered' | 'read' | 'failed'
          timestamp: string
          recipient_id: string
          errors?: Array<{ code: number; title: string; message: string }>
        }>
      }
    }>
  }>
}

// ── Automation Execution ──────────────────────────────────────────────────────
export interface WhatsAppAutomationExecution {
  id: string
  ruleId?: string
  triggerEvent: WhatsAppAutomationTrigger
  entityId: string
  contactId: string
  idempotencyKey: string
  status: 'PENDING' | 'EXECUTED' | 'SKIPPED_NO_CONSENT' | 'SKIPPED_ALREADY_PURCHASED' | 'FAILED'
  messageId?: string
  executionDetails?: Record<string, any>
  executedAt: string
}

// ── Campaign ──────────────────────────────────────────────────────────────────
export interface WhatsAppCampaign {
  id: string
  name: string
  category: WhatsAppCampaignCategory
  targetSegment: string
  templateName: string
  status: WhatsAppCampaignStatus
  scheduledFor?: string
  startedAt?: string
  completedAt?: string
  audienceCount: number
  sentCount: number
  deliveredCount: number
  readCount: number
  failedCount: number
  convertedCount: number
  totalRevenueAttributed: number
  estimatedCost: number
  notes?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

// ── AI Assistant ──────────────────────────────────────────────────────────────
export interface WhatsAppAiSession {
  id: string
  conversationId: string
  contactId: string
  contextWindow: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  detectedIntent?: string
  language: 'en' | 'hi'
  turnCount: number
  escalatedToHuman: boolean
  lastInteractionAt: string
}

export interface AiShoppingAssistantResponse {
  replyText: string
  detectedIntent: string
  suggestedProducts?: Array<{
    id: string
    name: string
    price: number
    url: string
  }>
  requiresHumanHandover: boolean
  handoverReason?: string
}

// ── Analytics Overview ────────────────────────────────────────────────────────
export interface WhatsAppAnalyticsOverview {
  totalContacts: number
  newCustomers: number
  activeConversations: number
  messagesSent: number
  messagesReceived: number
  deliveredMessages: number
  readMessages: number
  failedMessages: number
  deliveryRatePercent: number
  readRatePercent: number
  activeCampaigns: number
  campaignConversions: number
  ordersAttributed: number
  revenueAttributed: number
  customerResponseRatePercent: number
  estimatedCosts: number
  roiMultiple: number
}
