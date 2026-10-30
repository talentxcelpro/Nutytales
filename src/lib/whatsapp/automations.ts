// ─── Nuty Tales — Event-Driven Commerce Automation Engine ─────────────────────
import { WhatsAppDbService } from './db'
import { getWhatsAppProvider } from './provider'
import { WhatsAppConsentManager } from './consent'
import { normalizePhoneNumber } from './phone'

export interface OrderConfirmationEvent {
  orderId: string
  orderNumber?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  totalAmount: number
  itemCount?: number
  itemsSummary?: string
  shippingAddressCity?: string
}

export interface PaymentConfirmationEvent {
  orderId: string
  paymentId: string
  gateway: 'razorpay' | 'neft'
  amount: number
  customerPhone: string
  customerName?: string
  verifiedAt?: string
}

export interface DispatchNotificationEvent {
  orderId: string
  customerPhone: string
  customerName: string
  carrierName: string
  trackingNumber: string
  trackingUrl?: string
}

export interface DeliveryConfirmationEvent {
  orderId: string
  customerPhone: string
  customerName: string
  deliveredAt?: string
}

export interface AbandonedCartEvent {
  cartSessionId: string
  customerPhone: string
  customerName?: string
  abandonedItemNames: string[]
  cartTotal: number
  checkoutUrl?: string
}

export interface RepeatPurchaseNudgeEvent {
  customerPhone: string
  customerName?: string
  lastOrderProduct?: string
  recommendedProduct?: string
  discountCode?: string
}

export class WhatsAppAutomationEngine {
  /**
   * Workflow A: ORDER CONFIRMATION
   * Dispatched immediately after order is verified and stored in database.
   */
  static async handleOrderConfirmation(
    event: OrderConfirmationEvent
  ): Promise<{ success: boolean; skipped?: boolean; messageId?: string; reason?: string }> {
    const normalized = normalizePhoneNumber(event.customerPhone)
    if (!normalized.isValid) {
      return { success: false, reason: `Invalid phone format: ${event.customerPhone}` }
    }

    const idempotencyKey = `ORDER_CONFIRMATION_${event.orderId}`
    const alreadyProcessed = await WhatsAppDbService.checkAutomationExecution(idempotencyKey)
    if (alreadyProcessed) {
      return { success: true, skipped: true, reason: 'Order confirmation already dispatched' }
    }

    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: normalized.e164,
      name: event.customerName,
      email: event.customerEmail,
      orderAmountToAdd: event.totalAmount,
      orderId: event.orderId,
      source: 'website_checkout',
    })

    const conversation = await WhatsAppDbService.getOrCreateConversation(contact.id)

    // Build message body
    const orderNum = event.orderNumber || event.orderId
    const formattedTotal = Number(event.totalAmount).toLocaleString('en-IN')
    const body =
      `Hello ${event.customerName}! 🥜 Your Nuty Tales order #${orderNum} of ₹${formattedTotal} is confirmed! ` +
      `Our team is preparing your fresh dry fruits package with nitrogen-sealed preservation. ` +
      `Track your order anytime: https://nutytales.com/orders/track?id=${encodeURIComponent(orderNum)}`

    const provider = getWhatsAppProvider()
    let messageId = ''

    try {
      // 1. Attempt sending approved Utility Template
      const res = await provider.sendTemplateMessage({
        to: normalized.e164,
        templateName: 'order_confirmation_v1',
        languageCode: 'en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: event.customerName },
              { type: 'text', text: orderNum },
              { type: 'text', text: formattedTotal },
            ],
          },
        ],
      })

      if (res.success) {
        messageId = res.messageId
      } else {
        // Fallback to text message if template pending approval in test/dev
        const textRes = await provider.sendTextMessage({
          to: normalized.e164,
          text: body,
        })
        messageId = textRes.messageId
      }
    } catch (sendErr: any) {
      console.warn('[WhatsAppAutomationEngine] Error during provider dispatch:', sendErr)
    }

    // Persist message record
    const recordedMsg = await WhatsAppDbService.recordMessage({
      conversationId: conversation.id,
      contactId: contact.id,
      direction: 'OUTBOUND',
      senderType: 'SYSTEM',
      senderName: 'Nuty Tales Automation',
      messageType: 'template',
      templateName: 'order_confirmation_v1',
      body,
      metaMessageId: messageId || undefined,
    })

    // Record execution for strict idempotency
    await WhatsAppDbService.recordAutomationExecution({
      triggerEvent: 'ORDER_CONFIRMED',
      entityId: event.orderId,
      contactId: contact.id,
      idempotencyKey,
      status: 'EXECUTED',
      messageId: recordedMsg.id,
      details: { orderId: event.orderId, amount: event.totalAmount },
    })

    return { success: true, messageId: recordedMsg.id }
  }

  /**
   * Workflow B: PAYMENT CONFIRMATION
   * Triggered upon verified server-side Razorpay webhook or signature verification.
   */
  static async handlePaymentConfirmation(
    event: PaymentConfirmationEvent
  ): Promise<{ success: boolean; skipped?: boolean; messageId?: string; reason?: string }> {
    const normalized = normalizePhoneNumber(event.customerPhone)
    if (!normalized.isValid) {
      return { success: false, reason: `Invalid phone format: ${event.customerPhone}` }
    }

    const idempotencyKey = `PAYMENT_CAPTURED_${event.paymentId}`
    const alreadyProcessed = await WhatsAppDbService.checkAutomationExecution(idempotencyKey)
    if (alreadyProcessed) {
      return { success: true, skipped: true, reason: 'Payment notification already dispatched' }
    }

    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: normalized.e164,
      name: event.customerName,
      orderId: event.orderId,
    })

    const conversation = await WhatsAppDbService.getOrCreateConversation(contact.id)
    const formattedAmount = Number(event.amount).toLocaleString('en-IN')

    const body =
      `Payment Received! 💳 We successfully verified ₹${formattedAmount} for order #${event.orderId} ` +
      `via ${event.gateway.toUpperCase()} (Txn: ${event.paymentId}). Your official GST invoice has been queued. Thank you for shopping with Nuty Tales!`

    const provider = getWhatsAppProvider()
    let messageId = ''

    try {
      const res = await provider.sendTemplateMessage({
        to: normalized.e164,
        templateName: 'payment_received_v1',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: formattedAmount },
              { type: 'text', text: event.orderId },
            ],
          },
        ],
      })
      messageId = res.messageId
    } catch {
      const textRes = await provider.sendTextMessage({
        to: normalized.e164,
        text: body,
      })
      messageId = textRes.messageId
    }

    const recordedMsg = await WhatsAppDbService.recordMessage({
      conversationId: conversation.id,
      contactId: contact.id,
      direction: 'OUTBOUND',
      senderType: 'SYSTEM',
      senderName: 'Nuty Tales Finance',
      messageType: 'template',
      templateName: 'payment_received_v1',
      body,
      metaMessageId: messageId,
    })

    await WhatsAppDbService.recordAutomationExecution({
      triggerEvent: 'PAYMENT_CAPTURED',
      entityId: event.paymentId,
      contactId: contact.id,
      idempotencyKey,
      status: 'EXECUTED',
      messageId: recordedMsg.id,
      details: { orderId: event.orderId, paymentId: event.paymentId, amount: event.amount },
    })

    return { success: true, messageId: recordedMsg.id }
  }

  /**
   * Workflow C: ORDER DISPATCH
   * Triggered when courier AWB is assigned.
   */
  static async handleOrderDispatch(
    event: DispatchNotificationEvent
  ): Promise<{ success: boolean; skipped?: boolean; messageId?: string; reason?: string }> {
    const normalized = normalizePhoneNumber(event.customerPhone)
    if (!normalized.isValid) return { success: false, reason: 'Invalid phone number' }

    const idempotencyKey = `ORDER_DISPATCH_${event.orderId}_${event.trackingNumber}`
    if (await WhatsAppDbService.checkAutomationExecution(idempotencyKey)) {
      return { success: true, skipped: true, reason: 'Dispatch update already sent' }
    }

    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: normalized.e164,
      name: event.customerName,
      orderId: event.orderId,
    })
    const conversation = await WhatsAppDbService.getOrCreateConversation(contact.id)

    const trackingUrl =
      event.trackingUrl ||
      `https://nutytales.com/orders/track?id=${encodeURIComponent(event.orderId)}`

    const body =
      `Your dry fruits are on the way! 🚚 Order #${event.orderId} has been dispatched via ${event.carrierName} ` +
      `(Tracking Number: ${event.trackingNumber}). Expected delivery in 2-3 business days. Track shipment: ${trackingUrl}`

    const provider = getWhatsAppProvider()
    let messageId = ''

    try {
      const res = await provider.sendTemplateMessage({
        to: normalized.e164,
        templateName: 'order_dispatched_v1',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: event.orderId },
              { type: 'text', text: event.carrierName },
              { type: 'text', text: event.trackingNumber },
              { type: 'text', text: trackingUrl },
            ],
          },
        ],
      })
      messageId = res.messageId
    } catch {
      const textRes = await provider.sendTextMessage({ to: normalized.e164, text: body })
      messageId = textRes.messageId
    }

    const msg = await WhatsAppDbService.recordMessage({
      conversationId: conversation.id,
      contactId: contact.id,
      direction: 'OUTBOUND',
      senderType: 'SYSTEM',
      body,
      metaMessageId: messageId,
    })

    await WhatsAppDbService.recordAutomationExecution({
      triggerEvent: 'ORDER_DISPATCHED',
      entityId: event.orderId,
      contactId: contact.id,
      idempotencyKey,
      status: 'EXECUTED',
      messageId: msg.id,
    })

    return { success: true, messageId: msg.id }
  }

  /**
   * Workflow D: DELIVERY CONFIRMATION & FEEDBACK
   */
  static async handleDeliveryConfirmation(
    event: DeliveryConfirmationEvent
  ): Promise<{ success: boolean; skipped?: boolean; messageId?: string }> {
    const normalized = normalizePhoneNumber(event.customerPhone)
    if (!normalized.isValid) return { success: false }

    const idempotencyKey = `ORDER_DELIVERED_${event.orderId}`
    if (await WhatsAppDbService.checkAutomationExecution(idempotencyKey)) {
      return { success: true, skipped: true }
    }

    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: normalized.e164,
      name: event.customerName,
      orderId: event.orderId,
    })
    const conversation = await WhatsAppDbService.getOrCreateConversation(contact.id)

    const body =
      `Delivered! 📦 Your Nuty Tales package for order #${event.orderId} has reached you. ` +
      `We hope you enjoy the premium quality and crunch. Would you like to share quick feedback? ` +
      `Reply 1 for ⭐⭐⭐⭐⭐ Loved it!, or reply with any question!`

    const provider = getWhatsAppProvider()
    const res = await provider.sendTextMessage({ to: normalized.e164, text: body })

    const msg = await WhatsAppDbService.recordMessage({
      conversationId: conversation.id,
      contactId: contact.id,
      direction: 'OUTBOUND',
      senderType: 'SYSTEM',
      body,
      metaMessageId: res.messageId,
    })

    await WhatsAppDbService.recordAutomationExecution({
      triggerEvent: 'ORDER_DELIVERED',
      entityId: event.orderId,
      contactId: contact.id,
      idempotencyKey,
      status: 'EXECUTED',
      messageId: msg.id,
    })

    return { success: true, messageId: msg.id }
  }

  /**
   * Workflow E: ABANDONED CART RECOVERY
   * Strict consent check, single reminder per cart session, opt-out suppression.
   */
  static async handleAbandonedCartRecovery(
    event: AbandonedCartEvent
  ): Promise<{ success: boolean; skipped?: boolean; reason?: string; messageId?: string }> {
    const normalized = normalizePhoneNumber(event.customerPhone)
    if (!normalized.isValid) return { success: false, reason: 'Invalid recipient phone' }

    // Check Marketing Consent
    const consentCheck = await WhatsAppConsentManager.verifyConsentForCategory(
      normalized.e164,
      'MARKETING'
    )
    if (!consentCheck.allowed) {
      return {
        success: false,
        skipped: true,
        reason: consentCheck.reason || 'Customer opted out of marketing communications.',
      }
    }

    const idempotencyKey = `CART_ABANDONED_${event.cartSessionId}`
    if (await WhatsAppDbService.checkAutomationExecution(idempotencyKey)) {
      return { success: true, skipped: true, reason: 'Cart reminder already dispatched for this session' }
    }

    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: normalized.e164,
      name: event.customerName,
      segment: 'abandoned_checkout',
    })
    const conversation = await WhatsAppDbService.getOrCreateConversation(contact.id)

    const itemName = event.abandonedItemNames[0] || 'premium dry fruits'
    const checkoutLink = event.checkoutUrl || 'https://nutytales.com/checkout?ref=wa_cart'

    const body =
      `Hello ${event.customerName || 'there'}! You left some fresh ${itemName} in your Nuty Tales basket. 🛒 ` +
      `Our batches sell out quickly. Complete your order today and use code NUTY10 at checkout for 10% OFF: ${checkoutLink}`

    const provider = getWhatsAppProvider()
    const res = await provider.sendTextMessage({ to: normalized.e164, text: body })

    const msg = await WhatsAppDbService.recordMessage({
      conversationId: conversation.id,
      contactId: contact.id,
      direction: 'OUTBOUND',
      senderType: 'SYSTEM',
      body,
      metaMessageId: res.messageId,
    })

    await WhatsAppDbService.recordAutomationExecution({
      triggerEvent: 'CART_ABANDONED',
      entityId: event.cartSessionId,
      contactId: contact.id,
      idempotencyKey,
      status: 'EXECUTED',
      messageId: msg.id,
    })

    return { success: true, messageId: msg.id }
  }

  /**
   * Workflow F: REPEAT PURCHASE RECOMMENDATION
   */
  static async handleRepeatPurchaseNudge(
    event: RepeatPurchaseNudgeEvent
  ): Promise<{ success: boolean; skipped?: boolean; reason?: string; messageId?: string }> {
    const normalized = normalizePhoneNumber(event.customerPhone)
    if (!normalized.isValid) return { success: false, reason: 'Invalid phone' }

    const consentCheck = await WhatsAppConsentManager.verifyConsentForCategory(
      normalized.e164,
      'MARKETING'
    )
    if (!consentCheck.allowed) {
      return { success: false, skipped: true, reason: consentCheck.reason }
    }

    const product = event.recommendedProduct || 'Jumbo 6 Suta Makhana'
    const body =
      `Hello ${event.customerName || 'Valued Customer'}! 🌿 Time to restock healthy snacks? ` +
      `Our fresh harvest of ${product} is back in stock at Nuty Tales with express delivery to your doorstep. ` +
      `Order now: https://nutytales.com/shop`

    const contact = await WhatsAppDbService.upsertContact({
      phoneNumber: normalized.e164,
      name: event.customerName,
      segment: 'repeat_customer',
    })
    const conversation = await WhatsAppDbService.getOrCreateConversation(contact.id)

    const provider = getWhatsAppProvider()
    const res = await provider.sendTextMessage({ to: normalized.e164, text: body })

    const msg = await WhatsAppDbService.recordMessage({
      conversationId: conversation.id,
      contactId: contact.id,
      direction: 'OUTBOUND',
      senderType: 'SYSTEM',
      body,
      metaMessageId: res.messageId,
    })

    return { success: true, messageId: msg.id }
  }
}
