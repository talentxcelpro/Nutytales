/**
 * Google Analytics 4 event-tracking helpers.
 *
 * All functions are safe to call from any context:
 * - No-ops on the server (no window object).
 * - No-ops when gtag is not loaded (script not yet present).
 *
 * GA4 measurement ID is read from NEXT_PUBLIC_GA_MEASUREMENT_ID.
 */

// ─── Type Declarations ─────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export interface CartTrackItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  weightG: number
}

export interface CartSummary {
  items: CartTrackItem[]
  totalAmount: number
  couponCode?: string
}

export interface OrderSummary {
  orderId: string
  totalAmount: number
  items: CartTrackItem[]
  couponCode?: string
  paymentMethod?: string
}

export interface QuoteSummary {
  quoteId: string
  businessType: string
  location: string
  itemCount: number
  estimatedValueMin?: number
}

// ─── Internal Helper ───────────────────────────────────────────────────────────

function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag !== 'function') return
  window.gtag(...args)
}

// ─── Core Tracking Functions ───────────────────────────────────────────────────

/**
 * Fire a custom GA4 event.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>,
): void {
  gtag('event', eventName, params ?? {})
}

/**
 * Manually fire a page_view event (useful for SPA navigation).
 */
export function trackPageView(url: string): void {
  gtag('event', 'page_view', {
    page_location: url,
    send_to: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  })
}

// ─── Ecommerce Events ──────────────────────────────────────────────────────────

/**
 * Fire view_item when a customer views a product detail page.
 */
export function trackProductView(product: {
  id: string
  name: string
  category: string
  price: number
}): void {
  gtag('event', 'view_item', {
    currency: 'INR',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1,
      },
    ],
  })
}

/**
 * Fire add_to_cart when an item is added to the cart.
 */
export function trackAddToCart(item: CartTrackItem): void {
  gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: item.price * item.quantity,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_category: item.category,
        price: item.price,
        quantity: item.quantity,
      },
    ],
  })
}

/**
 * Fire begin_checkout when the customer starts checkout.
 */
export function trackBeginCheckout(cart: CartSummary): void {
  gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: cart.totalAmount,
    coupon: cart.couponCode,
    items: cart.items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      item_category: i.category,
      price: i.price,
      quantity: i.quantity,
    })),
  })
}

/**
 * Fire purchase after a successful order.
 */
export function trackPurchase(order: OrderSummary): void {
  gtag('event', 'purchase', {
    currency: 'INR',
    transaction_id: order.orderId,
    value: order.totalAmount,
    coupon: order.couponCode,
    payment_type: order.paymentMethod,
    items: order.items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      item_category: i.category,
      price: i.price,
      quantity: i.quantity,
    })),
  })
}

// ─── B2B / Lead Events ─────────────────────────────────────────────────────────

/**
 * Fire when a B2B bulk quote request form is submitted.
 */
export function trackQuoteSubmitted(quote: QuoteSummary): void {
  gtag('event', 'quote_submitted', {
    quote_id: quote.quoteId,
    business_type: quote.businessType,
    location: quote.location,
    item_count: quote.itemCount,
    estimated_value_min: quote.estimatedValueMin,
  })
}

/**
 * Fire when a business registers for a B2B account.
 */
export function trackB2BSignup(
  businessType: string,
  location: string,
): void {
  gtag('event', 'b2b_signup', {
    business_type: businessType,
    location,
  })
}

// ─── Engagement Events ─────────────────────────────────────────────────────────

/**
 * Fire when a visitor clicks a WhatsApp CTA.
 */
export function trackWhatsAppClick(location: string): void {
  gtag('event', 'whatsapp_click', {
    location,
    event_category: 'engagement',
    event_label: `whatsapp_${location.toLowerCase()}`,
  })
}

/**
 * Fire when a visitor clicks a phone number.
 */
export function trackPhoneClick(location: string): void {
  gtag('event', 'phone_click', {
    location,
    event_category: 'engagement',
    event_label: `phone_${location.toLowerCase()}`,
  })
}

/**
 * Fire when the visitor selects a delivery / sourcing location.
 */
export function trackLocationSelected(location: string): void {
  gtag('event', 'location_selected', {
    location,
    event_category: 'navigation',
  })
}
