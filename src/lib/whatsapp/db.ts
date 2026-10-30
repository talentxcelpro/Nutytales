// ─── Nuty Tales — WhatsApp Commerce OS Database Persistence Layer ────────────
import { getSupabaseAdmin } from '@/lib/supabase'
import {
  WhatsAppContact,
  WhatsAppConversation,
  WhatsAppMessage,
  WhatsAppConsentStatus,
  WhatsAppCustomerSegment,
  WhatsAppConversationStatus,
  WhatsAppDeliveryStatus,
  WhatsAppCampaign,
  WhatsAppAnalyticsOverview,
} from './types'
import { normalizePhoneNumber } from './phone'

// ── In-Memory Resilient Store (Local Fallback & Testing) ──────────────────────
const memContacts = new Map<string, WhatsAppContact>()
const memConversations = new Map<string, WhatsAppConversation>()
const memMessages = new Map<string, WhatsAppMessage>()
const memProcessedWebhooks = new Set<string>()
const memAutomationExecutions = new Map<string, any>()
const memCampaigns = new Map<string, WhatsAppCampaign>()
const memConsentRecords: any[] = []

export class WhatsAppDbService {
  /**
   * Upsert a contact by normalized E.164 phone number.
   * Updates total spend and order counts if provided.
   */
  static async upsertContact(params: {
    phoneNumber: string
    name?: string
    email?: string
    userId?: string
    source?: string
    segment?: WhatsAppCustomerSegment
    preferredLanguage?: 'en' | 'hi'
    orderAmountToAdd?: number
    orderId?: string
    consentStatus?: WhatsAppConsentStatus
    notes?: string
    tags?: string[]
  }): Promise<WhatsAppContact> {
    const normalized = normalizePhoneNumber(params.phoneNumber)
    const phone = normalized.e164 || params.phoneNumber
    const now = new Date().toISOString()

    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data: existing } = await admin
          .from('whatsapp_contacts')
          .select('*')
          .eq('phone_number', phone)
          .maybeSingle()

        if (existing) {
          const totalOrders = (existing.total_orders || 0) + (params.orderAmountToAdd ? 1 : 0)
          const totalSpend = (Number(existing.total_spend) || 0) + (params.orderAmountToAdd || 0)
          
          let segment = params.segment || existing.segment
          if (!params.segment) {
            if (totalOrders > 1) segment = 'repeat_customer'
            else if (totalOrders === 1) segment = 'first_time_buyer'
            if (totalSpend >= 5000) segment = 'high_value'
          }

          const updatePayload: any = {
            total_orders: totalOrders,
            total_spend: totalSpend,
            last_interaction_at: now,
            updated_at: now,
          }

          if (params.name && params.name !== 'Valued Customer') updatePayload.name = params.name
          if (params.email) updatePayload.email = params.email
          if (params.orderId) {
            updatePayload.last_order_id = params.orderId
            updatePayload.last_order_at = now
          }
          if (params.consentStatus) {
            updatePayload.consent_status = params.consentStatus
            if (params.consentStatus === 'OPTED_IN') updatePayload.consent_timestamp = now
            if (params.consentStatus === 'OPTED_OUT') updatePayload.opt_out_timestamp = now
          }
          if (params.notes) updatePayload.notes = params.notes
          if (segment) updatePayload.segment = segment

          const { data: updated, error } = await admin
            .from('whatsapp_contacts')
            .update(updatePayload)
            .eq('id', existing.id)
            .select()
            .single()

          if (!error && updated) {
            return this.mapDbContact(updated)
          }
        } else {
          // New contact
          const initialSegment: WhatsAppCustomerSegment = params.segment || (params.orderAmountToAdd ? 'first_time_buyer' : 'new_customer')
          const insertPayload: any = {
            phone_number: phone,
            formatted_phone: normalized.formattedDisplay,
            name: params.name || 'Valued Customer',
            email: params.email || null,
            user_id: params.userId || null,
            source: params.source || 'website_checkout',
            segment: initialSegment,
            preferred_language: params.preferredLanguage || 'en',
            total_orders: params.orderAmountToAdd ? 1 : 0,
            total_spend: params.orderAmountToAdd || 0,
            last_order_id: params.orderId || null,
            last_order_at: params.orderId ? now : null,
            consent_status: params.consentStatus || 'PENDING',
            consent_timestamp: params.consentStatus === 'OPTED_IN' ? now : null,
            notes: params.notes || null,
            tags: params.tags || [],
            first_interaction_at: now,
            last_interaction_at: now,
            created_at: now,
            updated_at: now,
          }

          const { data: created, error } = await admin
            .from('whatsapp_contacts')
            .insert(insertPayload)
            .select()
            .single()

          if (!error && created) {
            return this.mapDbContact(created)
          }
        }
      } catch (err) {
        console.warn('[WhatsAppDbService] Supabase contact sync fallback:', err)
      }
    }

    // In-Memory Fallback
    let contact = memContacts.get(phone)
    if (contact) {
      contact.totalOrders += params.orderAmountToAdd ? 1 : 0
      contact.totalSpend += params.orderAmountToAdd || 0
      if (params.name && params.name !== 'Valued Customer') contact.name = params.name
      if (params.email) contact.email = params.email
      if (params.orderId) {
        contact.lastOrderId = params.orderId
        contact.lastOrderAt = now
      }
      if (params.consentStatus) {
        contact.consentStatus = params.consentStatus
        if (params.consentStatus === 'OPTED_IN') contact.consentTimestamp = now
        if (params.consentStatus === 'OPTED_OUT') contact.optOutTimestamp = now
      }
      contact.lastInteractionAt = now
      contact.updatedAt = now
    } else {
      contact = {
        id: `WAC-${Math.floor(100000 + Math.random() * 900000)}`,
        phoneNumber: phone,
        formattedPhone: normalized.formattedDisplay,
        name: params.name || 'Valued Customer',
        email: params.email,
        userId: params.userId,
        source: params.source || 'website_checkout',
        segment: params.segment || (params.orderAmountToAdd ? 'first_time_buyer' : 'new_customer'),
        preferredLanguage: params.preferredLanguage || 'en',
        totalOrders: params.orderAmountToAdd ? 1 : 0,
        totalSpend: params.orderAmountToAdd || 0,
        lastOrderId: params.orderId,
        lastOrderAt: params.orderId ? now : undefined,
        consentStatus: params.consentStatus || 'PENDING',
        consentTimestamp: params.consentStatus === 'OPTED_IN' ? now : undefined,
        notes: params.notes,
        tags: params.tags || [],
        firstInteractionAt: now,
        lastInteractionAt: now,
        createdAt: now,
        updatedAt: now,
      }
      memContacts.set(phone, contact)
    }

    return contact
  }

  static async getContactByPhone(phone: string): Promise<WhatsAppContact | null> {
    const normalized = normalizePhoneNumber(phone).e164 || phone
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data, error } = await admin
          .from('whatsapp_contacts')
          .select('*')
          .eq('phone_number', normalized)
          .maybeSingle()
        if (!error && data) return this.mapDbContact(data)
      } catch (err) {
        console.warn('[WhatsAppDbService] Fetch contact fallback:', err)
      }
    }
    return memContacts.get(normalized) || null
  }

  static async getOrCreateConversation(contactId: string): Promise<WhatsAppConversation> {
    const admin = getSupabaseAdmin()
    const now = new Date().toISOString()

    if (admin) {
      try {
        const { data: existing } = await admin
          .from('whatsapp_conversations')
          .select('*, contact:whatsapp_contacts(*)')
          .eq('contact_id', contactId)
          .neq('status', 'ARCHIVED')
          .order('last_message_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (existing) {
          return this.mapDbConversation(existing)
        }

        const { data: created, error } = await admin
          .from('whatsapp_conversations')
          .insert({
            contact_id: contactId,
            status: 'OPEN',
            priority: 'NORMAL',
            unread_count: 0,
            last_message_at: now,
            created_at: now,
            updated_at: now,
          })
          .select('*, contact:whatsapp_contacts(*)')
          .single()

        if (!error && created) {
          return this.mapDbConversation(created)
        }
      } catch (err) {
        console.warn('[WhatsAppDbService] Conversation sync fallback:', err)
      }
    }

    // In-Memory Fallback
    for (const conv of memConversations.values()) {
      if (conv.contactId === contactId && conv.status !== 'ARCHIVED') {
        return conv
      }
    }

    const newConv: WhatsAppConversation = {
      id: `WACV-${Math.floor(100000 + Math.random() * 900000)}`,
      contactId,
      status: 'OPEN',
      priority: 'NORMAL',
      unreadCount: 0,
      lastMessageAt: now,
      isPinned: false,
      labels: [],
      createdAt: now,
      updatedAt: now,
    }
    memConversations.set(newConv.id, newConv)
    return newConv
  }

  static async recordMessage(params: {
    conversationId: string
    contactId: string
    direction: 'INBOUND' | 'OUTBOUND'
    senderType: 'CUSTOMER' | 'AI' | 'AGENT' | 'SYSTEM'
    senderName?: string
    messageType?: 'text' | 'template' | 'image' | 'document' | 'audio' | 'video' | 'location' | 'interactive' | string
    body: string
    templateName?: string
    templateParams?: Record<string, any>
    metaMessageId?: string
    mediaUrl?: string
    mediaType?: string
    deliveryStatus?: WhatsAppDeliveryStatus
    errorCode?: string
    errorMessage?: string
  }): Promise<WhatsAppMessage> {
    const now = new Date().toISOString()
    const deliveryStatus = params.deliveryStatus || (params.direction === 'INBOUND' ? 'DELIVERED' : 'SENT')

    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data: msg, error } = await admin
          .from('whatsapp_messages')
          .insert({
            conversation_id: params.conversationId,
            contact_id: params.contactId,
            direction: params.direction,
            sender_type: params.senderType,
            sender_name: params.senderName || null,
            message_type: params.messageType || 'text',
            body: params.body,
            template_name: params.templateName || null,
            template_params: params.templateParams || {},
            meta_message_id: params.metaMessageId || null,
            media_url: params.mediaUrl || null,
            media_type: params.mediaType || null,
            delivery_status: deliveryStatus,
            error_code: params.errorCode || null,
            error_message: params.errorMessage || null,
            sent_at: now,
            created_at: now,
          })
          .select()
          .single()

        if (!error && msg) {
          // Update conversation last message preview & unread count
          await admin
            .from('whatsapp_conversations')
            .update({
              last_message_preview: params.body.substring(0, 100),
              last_message_at: now,
              unread_count: params.direction === 'INBOUND' ? 1 : 0,
              updated_at: now,
            })
            .eq('id', params.conversationId)

          return this.mapDbMessage(msg)
        }
      } catch (err) {
        console.warn('[WhatsAppDbService] Insert message fallback:', err)
      }
    }

    // In-Memory Fallback
    const memMsg: WhatsAppMessage = {
      id: `WAM-${Math.floor(1000000 + Math.random() * 9000000)}`,
      conversationId: params.conversationId,
      contactId: params.contactId,
      metaMessageId: params.metaMessageId,
      direction: params.direction,
      senderType: params.senderType,
      senderName: params.senderName,
      messageType: params.messageType || 'text',
      body: params.body,
      templateName: params.templateName,
      templateParams: params.templateParams,
      mediaUrl: params.mediaUrl,
      deliveryStatus,
      errorCode: params.errorCode,
      errorMessage: params.errorMessage,
      sentAt: now,
      createdAt: now,
    }
    memMessages.set(memMsg.id, memMsg)

    const conv = memConversations.get(params.conversationId)
    if (conv) {
      conv.lastMessagePreview = params.body.substring(0, 100)
      conv.lastMessageAt = now
      if (params.direction === 'INBOUND') conv.unreadCount += 1
      conv.updatedAt = now
    }

    return memMsg
  }

  static async updateMessageDeliveryStatus(
    metaMessageId: string,
    status: WhatsAppDeliveryStatus,
    errorDetails?: { code?: string; message?: string }
  ) {
    const now = new Date().toISOString()
    const admin = getSupabaseAdmin()

    if (admin) {
      try {
        const updatePayload: any = {
          delivery_status: status,
        }
        if (status === 'DELIVERED') updatePayload.delivered_at = now
        if (status === 'READ') updatePayload.read_at = now
        if (errorDetails?.code) updatePayload.error_code = errorDetails.code
        if (errorDetails?.message) updatePayload.error_message = errorDetails.message

        await admin
          .from('whatsapp_messages')
          .update(updatePayload)
          .eq('meta_message_id', metaMessageId)
      } catch (err) {
        console.warn('[WhatsAppDbService] Status update fallback:', err)
      }
    }

    // In-Memory Fallback
    for (const msg of memMessages.values()) {
      if (msg.metaMessageId === metaMessageId) {
        msg.deliveryStatus = status
        if (status === 'DELIVERED') msg.deliveredAt = now
        if (status === 'READ') msg.readAt = now
        if (errorDetails?.code) msg.errorCode = errorDetails.code
        if (errorDetails?.message) msg.errorMessage = errorDetails.message
        break
      }
    }
  }

  static async recordWebhookEvent(
    eventId: string,
    provider: string,
    eventType: string,
    rawPayload: any
  ): Promise<{ isDuplicate: boolean }> {
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data: existing } = await admin
          .from('whatsapp_webhook_events')
          .select('id')
          .eq('event_id', eventId)
          .maybeSingle()

        if (existing) {
          return { isDuplicate: true }
        }

        await admin.from('whatsapp_webhook_events').insert({
          event_id: eventId,
          provider,
          event_type: eventType,
          raw_payload: rawPayload || {},
          processed: true,
          processed_at: new Date().toISOString(),
        })

        return { isDuplicate: false }
      } catch (err) {
        console.warn('[WhatsAppDbService] Webhook deduplication fallback:', err)
      }
    }

    // In-Memory Fallback
    if (memProcessedWebhooks.has(eventId)) {
      return { isDuplicate: true }
    }
    memProcessedWebhooks.add(eventId)
    if (memProcessedWebhooks.size > 10000) {
      const first = memProcessedWebhooks.values().next().value
      if (first) memProcessedWebhooks.delete(first)
    }
    return { isDuplicate: false }
  }

  static async recordConsentChange(params: {
    contactId: string
    phoneNumber: string
    consentType: 'OPT_IN' | 'OPT_OUT'
    source: string
    ipAddress?: string
    notes?: string
  }) {
    const admin = getSupabaseAdmin()
    const now = new Date().toISOString()

    if (admin) {
      try {
        await admin.from('whatsapp_consent_records').insert({
          contact_id: params.contactId,
          phone_number: params.phoneNumber,
          consent_type: params.consentType,
          source: params.source,
          ip_address: params.ipAddress || null,
          notes: params.notes || null,
          recorded_at: now,
        })

        await admin
          .from('whatsapp_contacts')
          .update({
            consent_status: params.consentType === 'OPT_IN' ? 'OPTED_IN' : 'OPTED_OUT',
            ...(params.consentType === 'OPT_IN'
              ? { consent_timestamp: now }
              : { opt_out_timestamp: now }),
            updated_at: now,
          })
          .eq('id', params.contactId)
      } catch (err) {
        console.warn('[WhatsAppDbService] Record consent fallback:', err)
      }
    }

    memConsentRecords.push({ ...params, recordedAt: now })
    const contact = memContacts.get(params.phoneNumber)
    if (contact) {
      contact.consentStatus = params.consentType === 'OPT_IN' ? 'OPTED_IN' : 'OPTED_OUT'
      if (params.consentType === 'OPT_IN') contact.consentTimestamp = now
      else contact.optOutTimestamp = now
      contact.updatedAt = now
    }
  }

  static async checkAutomationExecution(idempotencyKey: string): Promise<boolean> {
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data } = await admin
          .from('whatsapp_automation_executions')
          .select('id')
          .eq('idempotency_key', idempotencyKey)
          .maybeSingle()
        if (data) return true
      } catch (err) {
        console.warn('[WhatsAppDbService] Check automation execution fallback:', err)
      }
    }
    return memAutomationExecutions.has(idempotencyKey)
  }

  static async recordAutomationExecution(params: {
    ruleId?: string
    triggerEvent: string
    entityId: string
    contactId: string
    idempotencyKey: string
    status: 'PENDING' | 'EXECUTED' | 'SKIPPED_NO_CONSENT' | 'SKIPPED_ALREADY_PURCHASED' | 'FAILED'
    messageId?: string
    details?: Record<string, any>
  }) {
    const now = new Date().toISOString()
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        await admin.from('whatsapp_automation_executions').insert({
          rule_id: params.ruleId || null,
          trigger_event: params.triggerEvent,
          entity_id: params.entityId,
          contact_id: params.contactId,
          idempotency_key: params.idempotencyKey,
          status: params.status,
          message_id: params.messageId || null,
          execution_details: params.details || {},
          executed_at: now,
        })
      } catch (err) {
        console.warn('[WhatsAppDbService] Record automation execution fallback:', err)
      }
    }
    memAutomationExecutions.set(params.idempotencyKey, { ...params, executedAt: now })
  }

  static async getConversations(filter?: {
    status?: WhatsAppConversationStatus
    limit?: number
  }): Promise<WhatsAppConversation[]> {
    const admin = getSupabaseAdmin()
    const limit = filter?.limit || 50

    if (admin) {
      try {
        let query = admin
          .from('whatsapp_conversations')
          .select('*, contact:whatsapp_contacts(*)')
          .order('last_message_at', { ascending: false })
          .limit(limit)

        if (filter?.status) {
          query = query.eq('status', filter.status)
        }

        const { data, error } = await query
        if (!error && data) {
          return data.map((d) => this.mapDbConversation(d))
        }
      } catch (err) {
        console.warn('[WhatsAppDbService] Get conversations fallback:', err)
      }
    }

    // In-Memory Fallback
    const list = Array.from(memConversations.values())
      .filter((c) => !filter?.status || c.status === filter.status)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
      .slice(0, limit)

    for (const c of list) {
      for (const ct of memContacts.values()) {
        if (ct.id === c.contactId) {
          c.contact = ct
          break
        }
      }
    }
    return list
  }

  static async getConversationMessages(
    conversationId: string,
    limit = 100
  ): Promise<WhatsAppMessage[]> {
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data, error } = await admin
          .from('whatsapp_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('sent_at', { ascending: true })
          .limit(limit)

        if (!error && data) {
          return data.map((d) => this.mapDbMessage(d))
        }
      } catch (err) {
        console.warn('[WhatsAppDbService] Get messages fallback:', err)
      }
    }

    return Array.from(memMessages.values())
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
      .slice(-limit)
  }

  static async updateConversationStatus(
    conversationId: string,
    status: WhatsAppConversationStatus,
    assignedTo?: string,
    internalNotes?: string
  ) {
    const now = new Date().toISOString()
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const updatePayload: any = {
          status,
          updated_at: now,
        }
        if (assignedTo !== undefined) updatePayload.assigned_to = assignedTo
        if (internalNotes !== undefined) updatePayload.internal_notes = internalNotes
        if (status === 'RESOLVED') updatePayload.closed_at = now

        await admin
          .from('whatsapp_conversations')
          .update(updatePayload)
          .eq('id', conversationId)
      } catch (err) {
        console.warn('[WhatsAppDbService] Update conversation fallback:', err)
      }
    }

    const conv = memConversations.get(conversationId)
    if (conv) {
      conv.status = status
      if (assignedTo !== undefined) conv.assignedTo = assignedTo
      if (internalNotes !== undefined) conv.internalNotes = internalNotes
      if (status === 'RESOLVED') conv.closedAt = now
      conv.updatedAt = now
    }
  }

  static async getCampaigns(): Promise<WhatsAppCampaign[]> {
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data, error } = await admin
          .from('whatsapp_campaigns')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (!error && data) {
          return data.map((d) => this.mapDbCampaign(d))
        }
      } catch (err) {
        console.warn('[WhatsAppDbService] Get campaigns fallback:', err)
      }
    }

    return Array.from(memCampaigns.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  static async createCampaign(campaign: Partial<WhatsAppCampaign>): Promise<WhatsAppCampaign> {
    const now = new Date().toISOString()
    const id = campaign.id || `CMP-${Math.floor(10000 + Math.random() * 90000)}`
    const newCamp: WhatsAppCampaign = {
      id,
      name: campaign.name || 'Unnamed Campaign',
      category: campaign.category || 'seasonal_promotion',
      targetSegment: campaign.targetSegment || 'all_opted_in',
      templateName: campaign.templateName || 'repeat_purchase_v1',
      status: campaign.status || 'DRAFT',
      scheduledFor: campaign.scheduledFor,
      audienceCount: campaign.audienceCount || 0,
      sentCount: campaign.sentCount || 0,
      deliveredCount: campaign.deliveredCount || 0,
      readCount: campaign.readCount || 0,
      failedCount: campaign.failedCount || 0,
      convertedCount: campaign.convertedCount || 0,
      totalRevenueAttributed: campaign.totalRevenueAttributed || 0,
      estimatedCost: campaign.estimatedCost || 0,
      notes: campaign.notes,
      createdBy: campaign.createdBy || 'Admin',
      createdAt: now,
      updatedAt: now,
    }

    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        await admin.from('whatsapp_campaigns').insert({
          id: newCamp.id,
          name: newCamp.name,
          category: newCamp.category,
          target_segment: newCamp.targetSegment,
          template_name: newCamp.templateName,
          status: newCamp.status,
          scheduled_for: newCamp.scheduledFor || null,
          audience_count: newCamp.audienceCount,
          sent_count: newCamp.sentCount,
          delivered_count: newCamp.deliveredCount,
          read_count: newCamp.readCount,
          failed_count: newCamp.failedCount,
          converted_count: newCamp.convertedCount,
          total_revenue_attributed: newCamp.totalRevenueAttributed,
          estimated_cost: newCamp.estimatedCost,
          notes: newCamp.notes || null,
          created_by: newCamp.createdBy,
          created_at: now,
          updated_at: now,
        })
      } catch (err) {
        console.warn('[WhatsAppDbService] Create campaign fallback:', err)
      }
    }

    memCampaigns.set(newCamp.id, newCamp)
    return newCamp
  }

  static async getAnalyticsOverview(): Promise<WhatsAppAnalyticsOverview> {
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const [contactsRes, messagesRes, campaignsRes] = await Promise.all([
          admin.from('whatsapp_contacts').select('id, segment, total_orders, total_spend'),
          admin.from('whatsapp_messages').select('id, direction, delivery_status'),
          admin.from('whatsapp_campaigns').select('id, status, total_revenue_attributed, converted_count, estimated_cost'),
        ])

        const contacts = contactsRes.data || []
        const messages = messagesRes.data || []
        const campaigns = campaignsRes.data || []

        const totalContacts = contacts.length
        const newCustomers = contacts.filter((c) => c.segment === 'new_customer').length
        const messagesSent = messages.filter((m) => m.direction === 'OUTBOUND').length
        const messagesReceived = messages.filter((m) => m.direction === 'INBOUND').length
        const deliveredMessages = messages.filter((m) => m.delivery_status === 'DELIVERED' || m.delivery_status === 'READ').length
        const readMessages = messages.filter((m) => m.delivery_status === 'READ').length
        const failedMessages = messages.filter((m) => m.delivery_status === 'FAILED').length

        const deliveryRatePercent = messagesSent > 0 ? Math.round((deliveredMessages / messagesSent) * 100) : 100
        const readRatePercent = deliveredMessages > 0 ? Math.round((readMessages / deliveredMessages) * 100) : 0

        const activeCampaigns = campaigns.filter((c) => c.status === 'RUNNING' || c.status === 'SCHEDULED').length
        const campaignConversions = campaigns.reduce((acc, c) => acc + (c.converted_count || 0), 0)
        const revenueAttributed = campaigns.reduce((acc, c) => acc + (Number(c.total_revenue_attributed) || 0), 0)
        const estimatedCosts = campaigns.reduce((acc, c) => acc + (Number(c.estimated_cost) || 0), 0) + (messagesSent * 0.50)

        const ordersAttributed = contacts.reduce((acc, c) => acc + (c.total_orders || 0), 0)

        const roiMultiple = estimatedCosts > 0 ? Number((revenueAttributed / estimatedCosts).toFixed(2)) : 0

        return {
          totalContacts,
          newCustomers,
          activeConversations: Math.min(totalContacts, 12),
          messagesSent,
          messagesReceived,
          deliveredMessages,
          readMessages,
          failedMessages,
          deliveryRatePercent,
          readRatePercent,
          activeCampaigns,
          campaignConversions,
          ordersAttributed,
          revenueAttributed,
          customerResponseRatePercent: messagesSent > 0 ? Math.round((messagesReceived / messagesSent) * 100) : 0,
          estimatedCosts,
          roiMultiple,
        }
      } catch (err) {
        console.warn('[WhatsAppDbService] Analytics aggregate fallback:', err)
      }
    }

    // In-Memory Calculation
    const totalContacts = memContacts.size
    const newCustomers = Array.from(memContacts.values()).filter((c) => c.segment === 'new_customer').length
    const messages = Array.from(memMessages.values())
    const messagesSent = messages.filter((m) => m.direction === 'OUTBOUND').length
    const messagesReceived = messages.filter((m) => m.direction === 'INBOUND').length
    const deliveredMessages = messages.filter((m) => m.deliveryStatus === 'DELIVERED' || m.deliveryStatus === 'READ').length
    const readMessages = messages.filter((m) => m.deliveryStatus === 'READ').length
    const failedMessages = messages.filter((m) => m.deliveryStatus === 'FAILED').length

    return {
      totalContacts,
      newCustomers,
      activeConversations: memConversations.size,
      messagesSent,
      messagesReceived,
      deliveredMessages,
      readMessages,
      failedMessages,
      deliveryRatePercent: messagesSent > 0 ? Math.round((deliveredMessages / messagesSent) * 100) : 100,
      readRatePercent: deliveredMessages > 0 ? Math.round((readMessages / deliveredMessages) * 100) : 0,
      activeCampaigns: Array.from(memCampaigns.values()).filter((c) => c.status === 'RUNNING').length,
      campaignConversions: 0,
      ordersAttributed: Array.from(memContacts.values()).reduce((acc, c) => acc + c.totalOrders, 0),
      revenueAttributed: Array.from(memContacts.values()).reduce((acc, c) => acc + c.totalSpend, 0),
      customerResponseRatePercent: messagesSent > 0 ? Math.round((messagesReceived / messagesSent) * 100) : 0,
      estimatedCosts: messagesSent * 0.50,
      roiMultiple: 0,
    }
  }

  // ── Database Schema Mapping Helpers ─────────────────────────────────────────
  private static mapDbContact(row: any): WhatsAppContact {
    return {
      id: row.id,
      phoneNumber: row.phone_number,
      formattedPhone: row.formatted_phone,
      name: row.name,
      email: row.email,
      userId: row.user_id,
      source: row.source,
      segment: row.segment,
      preferredLanguage: row.preferred_language,
      totalOrders: row.total_orders || 0,
      totalSpend: Number(row.total_spend) || 0,
      lastOrderId: row.last_order_id,
      lastOrderAt: row.last_order_at,
      consentStatus: row.consent_status,
      consentTimestamp: row.consent_timestamp,
      optOutTimestamp: row.opt_out_timestamp,
      notes: row.notes,
      tags: row.tags || [],
      firstInteractionAt: row.first_interaction_at,
      lastInteractionAt: row.last_interaction_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  private static mapDbConversation(row: any): WhatsAppConversation {
    return {
      id: row.id,
      contactId: row.contact_id,
      status: row.status,
      priority: row.priority,
      assignedTo: row.assigned_to,
      unreadCount: row.unread_count || 0,
      lastMessagePreview: row.last_message_preview,
      lastMessageAt: row.last_message_at,
      isPinned: Boolean(row.is_pinned),
      labels: row.labels || [],
      internalNotes: row.internal_notes,
      closedAt: row.closed_at,
      contact: row.contact ? this.mapDbContact(row.contact) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  private static mapDbMessage(row: any): WhatsAppMessage {
    return {
      id: row.id,
      conversationId: row.conversation_id,
      contactId: row.contact_id,
      metaMessageId: row.meta_message_id,
      direction: row.direction,
      senderType: row.sender_type,
      senderName: row.sender_name,
      messageType: row.message_type,
      body: row.body,
      templateName: row.template_name,
      templateParams: row.template_params,
      mediaUrl: row.media_url,
      deliveryStatus: row.delivery_status,
      errorCode: row.error_code,
      errorMessage: row.error_message,
      sentAt: row.sent_at,
      deliveredAt: row.delivered_at,
      readAt: row.read_at,
      createdAt: row.created_at,
    }
  }

  private static mapDbCampaign(row: any): WhatsAppCampaign {
    return {
      id: row.id,
      name: row.name,
      category: row.category,
      targetSegment: row.target_segment,
      templateName: row.template_name,
      status: row.status,
      scheduledFor: row.scheduled_for,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      audienceCount: row.audience_count || 0,
      sentCount: row.sent_count || 0,
      deliveredCount: row.delivered_count || 0,
      readCount: row.read_count || 0,
      failedCount: row.failed_count || 0,
      convertedCount: row.converted_count || 0,
      totalRevenueAttributed: Number(row.total_revenue_attributed) || 0,
      estimatedCost: Number(row.estimated_cost) || 0,
      notes: row.notes,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}
