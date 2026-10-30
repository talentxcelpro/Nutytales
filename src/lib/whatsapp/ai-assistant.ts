// ─── Nuty Tales — AI Shopping & Customer Assistant ───────────────────────────
// Factual, catalogue-grounded conversational agent supporting English & Hindi
// Safe, deterministic boundaries for transactions with instant human escalation

import { PRODUCTS, Product } from '@/lib/products-data'
import { getSupabaseAdmin } from '@/lib/supabase'
import { WhatsAppDbService } from './db'
import {
  AiShoppingAssistantResponse,
  WhatsAppConversationStatus,
} from './types'

export class NutyTalesAiAssistant {
  /**
   * Processes an incoming customer message, matches intent, checks catalogue,
   * generates contextual answer, or escalates to human desk.
   */
  static async processMessage(params: {
    contactId: string
    conversationId: string
    incomingText: string
    customerPhone: string
    customerName?: string
  }): Promise<AiShoppingAssistantResponse> {
    const raw = (params.incomingText || '').trim()
    const lower = raw.toLowerCase()

    // 1. Check for Human Handover Requests or Escalation Triggers
    if (this.isHumanHandoverRequest(lower)) {
      await WhatsAppDbService.updateConversationStatus(
        params.conversationId,
        'HUMAN_TAKEOVER',
        undefined,
        `Customer requested human representative: "${raw}"`
      )

      return {
        replyText:
          'I am connecting you to a senior Nuty Tales concierge executive right away. 👨‍💼 ' +
          'Our team has been notified and will assist you shortly on this thread. You can also reach us at +91 97171 61809.',
        detectedIntent: 'human_handover',
        requiresHumanHandover: true,
        handoverReason: 'Customer requested human support',
      }
    }

    // 2. Detect Language: Hindi or English
    const isHindi = this.detectHindi(lower)

    // 3. Match Order Status & Tracking Enquiries (extract preserving uppercase from raw)
    const rawOrderMatch = raw.match(/NT-ORD-[A-Za-z0-9\-]+/i) || raw.match(/order\s*#?([A-Za-z0-9\-]{5,})/i)
    if (
      rawOrderMatch ||
      lower.includes('order') ||
      lower.includes('track') ||
      lower.includes('status') ||
      lower.includes('kahan hai') ||
      lower.includes('kab aayega')
    ) {
      const orderId = rawOrderMatch
        ? (rawOrderMatch[0].toUpperCase().startsWith('NT-ORD-') ? rawOrderMatch[0].toUpperCase() : (rawOrderMatch[1] || rawOrderMatch[0]).toUpperCase())
        : null

      if (orderId) {
        return {
          replyText: isHindi
            ? `Namaste! Aapke order #${orderId} ka live status dekhne ke liye kripya is link par click karein: https://nutytales.com/orders/track?id=${encodeURIComponent(orderId)}. Hamari team express courier se pack karke bhejti hai.`
            : `Hello! 📦 You can check real-time tracking for order #${orderId} here: https://nutytales.com/orders/track?id=${encodeURIComponent(orderId)}. Packages typically reach within 2-4 business days.`,
          detectedIntent: 'order_tracking',
          requiresHumanHandover: false,
        }
      } else {
        return {
          replyText: isHindi
            ? 'Kripya apna Order ID (jaise NT-ORD-2026-XXXXXX) share karein taaki main aapka live courier status check kar sakoon.'
            : 'Please share your Order ID (e.g. NT-ORD-2026-XXXXXX) so I can retrieve your live tracking information for you.',
          detectedIntent: 'order_tracking_query',
          requiresHumanHandover: false,
        }
      }
    }

    // 4. Match Wedding Hampers & Corporate Gifting
    if (
      lower.includes('wedding') ||
      lower.includes('shaadi') ||
      lower.includes('hamper') ||
      lower.includes('gifting') ||
      lower.includes('corporate') ||
      lower.includes('trousseau')
    ) {
      return {
        replyText: isHindi
          ? 'Nuty Tales Wedding & Corporate Gifting Desk mein aapka swagat hai! 🎁 Hum Kashmiri walnut wood, velvet trunks, aur custom foil-embossed boxes mein shuddh dry fruit hampers taiyaar karte hain (Starting ₹450 to ₹3,500+ per box). Minimum order 25 boxes hai. Kya aap hamara digital catalogue dekhna chahenge?'
          : 'Welcome to Nuty Tales Bespoke Gifting Desk! 🎁 We curate luxury dry fruit hampers, Kashmiri carved walnut boxes, and personalized velvet trunks for weddings and corporate celebrations (₹450 to ₹3,500+ per box, MOQ 25 boxes). View our collections: https://nutytales.com/gifting or reply with your expected box count and date!',
        detectedIntent: 'wedding_corporate_gifting',
        requiresHumanHandover: false,
      }
    }

    // 5. Match Bulk / Wholesale / B2B Queries
    if (
      lower.includes('wholesale') ||
      lower.includes('bulk') ||
      lower.includes('b2b') ||
      lower.includes('dealer') ||
      lower.includes('distributor') ||
      lower.includes('commercial')
    ) {
      return {
        replyText: isHindi
          ? 'Nuty Tales B2B Wholesale Division: Hum direct farm-sourced California Almonds, Kashmiri Mamra Badam, Jumbo Makhana, aur W240 Cashews 10kg se 100+ kg batch mein supply karte hain with GST invoice aur FSSAI test certificate. B2B rates dekhne ke liye click karein: https://nutytales.com/b2b ya batayein kaun sa product chahiye.'
          : 'Nuty Tales B2B Wholesale Division supplies direct-sourced California Almonds, Kashmiri Mamra Badam, Jumbo 6 Suta Makhana, and Cashews in 10kg to 100+ kg tiers with verified GST billing and FSSAI certification (#22724441000048). Explore B2B pricing: https://nutytales.com/b2b or let me know the product & required quantity.',
        detectedIntent: 'wholesale_inquiry',
        requiresHumanHandover: false,
      }
    }

    // 6. Match Refund / Return / Cancellation Enquiries (Safety Boundary: No independent financial commits)
    if (
      lower.includes('refund') ||
      lower.includes('return') ||
      lower.includes('cancel') ||
      lower.includes('damaged') ||
      lower.includes('kharaab') ||
      lower.includes('paise wapas')
    ) {
      await WhatsAppDbService.updateConversationStatus(
        params.conversationId,
        'HUMAN_TAKEOVER',
        undefined,
        `Customer grievance / refund enquiry: "${raw}"`
      )

      return {
        replyText: isHindi
          ? 'Nuty Tales mein 100% Quality Guarantee hai! 🛡️ Agar packaging ya product mein koi samasya hai, to hamari Customer Support desk 48 ghante ke andar replacement ya refund process karti hai. Maine hamare senior support manager ko assign kar diya hai, wo aapse turant connect karenge.'
          : 'At Nuty Tales, we offer a 100% Freshness & Quality Guarantee. 🛡️ If there is any packaging damage or quality issue, our support team resolves it within 48 hours with an immediate replacement or refund. I have flagged your conversation to our senior support manager for priority review.',
        detectedIntent: 'refund_complaint',
        requiresHumanHandover: true,
        handoverReason: 'Refund / Return inquiry requires human desk review',
      }
    }

    // 7. Match Shipping / Delivery Timeline / Charges
    if (
      lower.includes('delivery') ||
      lower.includes('shipping') ||
      lower.includes('charge') ||
      lower.includes('kitne din') ||
      lower.includes('courier')
    ) {
      return {
        replyText: isHindi
          ? 'Delivery Information: 🚚\n• Metro cities: 2-3 business days\n• Rest of India: 3-5 business days\n• ₹999 se upar ke sabhi orders par FREE Shipping hai! (₹999 se kam par ₹99 standard charge).\n• Sabhi packets nitrogen-flushed seal ke saath deliver hote hain.'
          : 'Delivery Information: 🚚\n• Metro cities (Delhi-NCR, Mumbai, Bengaluru): 2-3 business days\n• Rest of India: 3-5 business days\n• FREE Express Shipping on all orders above ₹999! (Standard ₹99 charge for orders under ₹999).\n• All packs are vacuum or nitrogen-sealed to lock in crispness.',
        detectedIntent: 'delivery_info',
        requiresHumanHandover: false,
      }
    }

    // 8. Match Payment Methods
    if (
      lower.includes('payment') ||
      lower.includes('cod') ||
      lower.includes('cash on delivery') ||
      lower.includes('pay') ||
      lower.includes('upi') ||
      lower.includes('card')
    ) {
      return {
        replyText: isHindi
          ? 'Payment Options: 💳 Hum Razorpay ke zariye sabhi UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, aur NetBanking accept karte hain. NEFT/RTGS bhi available hai for large orders.'
          : 'Payment Options: 💳 We accept all major payment modes via Razorpay including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking. B2B bank transfers (NEFT/RTGS) are also supported for wholesale quantities.',
        detectedIntent: 'payment_methods',
        requiresHumanHandover: false,
      }
    }

    // 9. Match Specific Products from Catalogue
    const matchedProduct = this.findMatchingProduct(lower)
    if (matchedProduct) {
      const priceFormatted = matchedProduct.retailPrice.toLocaleString('en-IN')
      const variantsText = matchedProduct.variants
        .map((v) => `${v.label}: ₹${v.retailPrice.toLocaleString('en-IN')}`)
        .join(' | ')

      const reply = isHindi
        ? `*${matchedProduct.name}*\n` +
          `Origin: ${matchedProduct.origin}\n` +
          `Grade: ${matchedProduct.grade}\n` +
          `Price: ₹${priceFormatted}/kg (Pack options: ${variantsText})\n\n` +
          `${matchedProduct.shortDesc}\n\n` +
          `Aap ise direct hamari website par order kar sakte hain: https://nutytales.com/shop/${matchedProduct.slug}`
        : `*${matchedProduct.name}*\n` +
          `📍 Origin: ${matchedProduct.origin}\n` +
          `⭐ Grade: ${matchedProduct.grade}\n` +
          `💰 Price: ₹${priceFormatted}/kg (Available in: ${variantsText})\n\n` +
          `Description: ${matchedProduct.shortDesc}\n\n` +
          `Order online with fast delivery: https://nutytales.com/shop/${matchedProduct.slug}`

      return {
        replyText: reply,
        detectedIntent: 'product_enquiry',
        suggestedProducts: [
          {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.retailPrice,
            url: `https://nutytales.com/shop/${matchedProduct.slug}`,
          },
        ],
        requiresHumanHandover: false,
      }
    }

    // 10. General / Greeting / Fallback
    return {
      replyText: isHindi
        ? 'Namaste! 🙏 Nuty Tales mein aapka swagat hai. Main aapki kya sahayata kar sakta hoon?\n\n' +
          '• Dry fruits ke bhaav ya pack sizes (Makhana, Badam, Akhrot, Kesar)\n' +
          '• Order tracking\n' +
          '• Wedding hampers & gifting\n' +
          '• Wholesale bulk quotes\n\n' +
          'Aap apna prashna yahan likh sakte hain ya "Agent" type karke human support se baat kar sakte hain.'
        : 'Hello & Welcome to Nuty Tales! 🌿 How may I assist you today?\n\n' +
          '1. Product details & pricing (Makhana, Almonds, Walnuts, Saffron, Honey)\n' +
          '2. Track an order\n' +
          '3. Wedding hampers & corporate gifting\n' +
          '4. Wholesale B2B bulk supply\n\n' +
          'Feel free to type your question, or reply "Agent" to speak directly with our team.',
      detectedIntent: 'general_greeting',
      requiresHumanHandover: false,
    }
  }

  private static isHumanHandoverRequest(lower: string): boolean {
    return (
      lower === 'agent' ||
      lower === 'human' ||
      lower === 'support' ||
      lower === 'call me' ||
      lower === 'representative' ||
      lower.includes('agent') ||
      lower.includes('representative') ||
      lower.includes('talk to human') ||
      lower.includes('speak to human') ||
      lower.includes('speak with an agent') ||
      lower.includes('talk with an agent') ||
      lower.includes('baat karni hai') ||
      lower.includes('customer care')
    )
  }

  private static detectHindi(lower: string): boolean {
    const hindiWords = [
      'namaste',
      'kya',
      'kaise',
      'bhaav',
      'rate',
      'daam',
      'shuddh',
      'kahan',
      'kab',
      'chahiye',
      'bhejo',
      'shaadi',
      'badam',
      'akhrot',
      'kesar',
      'paise',
      'kitna',
    ]
    return hindiWords.some((w) => lower.includes(w))
  }

  private static findMatchingProduct(lower: string): Product | null {
    if (lower.includes('makhana') || lower.includes('fox nut') || lower.includes('lotus seed')) {
      return PRODUCTS.find((p) => p.categorySlug === 'makhana') || PRODUCTS[0]
    }
    if (lower.includes('mamra') || lower.includes('kashmiri badam')) {
      return PRODUCTS.find((p) => p.slug.includes('mamra')) || null
    }
    if (lower.includes('almond') || lower.includes('badam')) {
      return PRODUCTS.find((p) => p.slug.includes('almonds') || p.categorySlug === 'almonds') || null
    }
    if (lower.includes('saffron') || lower.includes('kesar') || lower.includes('mongra')) {
      return PRODUCTS.find((p) => p.slug.includes('saffron') || p.categorySlug === 'saffron') || null
    }
    if (lower.includes('walnut') || lower.includes('akhrot')) {
      return PRODUCTS.find((p) => p.slug.includes('walnut') || p.categorySlug === 'walnuts') || null
    }
    if (lower.includes('cashew') || lower.includes('kaju')) {
      return PRODUCTS.find((p) => p.slug.includes('cashew') || p.categorySlug === 'cashews') || null
    }
    if (lower.includes('fig') || lower.includes('anjeer')) {
      return PRODUCTS.find((p) => p.slug.includes('anjeer') || p.slug.includes('fig')) || null
    }
    if (lower.includes('honey') || lower.includes('shehed') || lower.includes('acacia')) {
      return PRODUCTS.find((p) => p.slug.includes('honey')) || null
    }
    if (lower.includes('date') || lower.includes('khajoor') || lower.includes('ajwa')) {
      return PRODUCTS.find((p) => p.slug.includes('date') || p.slug.includes('ajwa')) || null
    }
    if (lower.includes('pista') || lower.includes('pistachio')) {
      return PRODUCTS.find((p) => p.slug.includes('pista') || p.slug.includes('pistachio')) || null
    }
    return null
  }

  /**
   * Records incoming message into AI session context ledger and checks escalation triggers
   * without sending an outbound reply (used when auto-reply is disabled).
   */
  static async recordInboundContext(params: {
    contactId: string
    conversationId: string
    incomingText: string
    customerPhone: string
    customerName?: string
  }): Promise<{
    detectedIntent: string
    requiresHumanHandover: boolean
    language: 'en' | 'hi'
  }> {
    const raw = (params.incomingText || '').trim()
    const lower = raw.toLowerCase()
    const isEscalation = this.isHumanHandoverRequest(lower)
    const language = this.detectHindi(lower) ? 'hi' : 'en'

    let detectedIntent = 'general_enquiry'
    if (isEscalation) {
      detectedIntent = 'human_handover'
    } else if (raw.match(/NT-ORD-[A-Za-z0-9\-]+/i) || lower.includes('order') || lower.includes('track')) {
      detectedIntent = 'order_status'
    } else if (lower.includes('wedding') || lower.includes('hamper') || lower.includes('gifting')) {
      detectedIntent = 'wedding_hamper'
    } else if (lower.includes('bulk') || lower.includes('wholesale') || lower.includes('b2b')) {
      detectedIntent = 'bulk_rfq'
    } else if (lower.includes('complaint') || lower.includes('damaged') || lower.includes('issue')) {
      detectedIntent = 'complaint'
    } else if (this.findMatchingProduct(lower)) {
      detectedIntent = 'product_enquiry'
    }

    if (isEscalation) {
      await WhatsAppDbService.updateConversationStatus(
        params.conversationId,
        'HUMAN_TAKEOVER',
        undefined,
        `Customer requested human support: "${raw}"`
      )
    }

    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data: existingSession } = await admin
          .from('whatsapp_ai_sessions')
          .select('*')
          .eq('conversation_id', params.conversationId)
          .maybeSingle()

        const now = new Date().toISOString()
        const newEntry = {
          role: 'user',
          content: raw,
          timestamp: now,
        }

        if (existingSession) {
          const currentWindow = Array.isArray(existingSession.context_window)
            ? existingSession.context_window
            : []
          const updatedWindow = [...currentWindow.slice(-9), newEntry]

          await admin
            .from('whatsapp_ai_sessions')
            .update({
              context_window: updatedWindow,
              detected_intent: detectedIntent,
              language,
              turn_count: (existingSession.turn_count || 0) + 1,
              escalated_to_human: isEscalation || Boolean(existingSession.escalated_to_human),
              last_interaction_at: now,
              updated_at: now,
            })
            .eq('id', existingSession.id)
        } else {
          await admin.from('whatsapp_ai_sessions').insert({
            conversation_id: params.conversationId,
            contact_id: params.contactId,
            context_window: [newEntry],
            detected_intent: detectedIntent,
            language,
            turn_count: 1,
            escalated_to_human: isEscalation,
            last_interaction_at: now,
            created_at: now,
            updated_at: now,
          })
        }
      } catch (err) {
        console.warn('[NutyTalesAiAssistant] Session recording fallback:', err)
      }
    }

    return {
      detectedIntent,
      requiresHumanHandover: isEscalation,
      language,
    }
  }
}
