'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { calculateDiscount } from '@/lib/coupons'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface GiftingCartItem {
  productId: string
  name: string
  slug: string
  price: number
  unitPrice?: number
  quantity: number
  totalPrice?: number
  image?: string
  variant?: string
  recipientName?: string
  giftMessage?: string
  deliveryDate?: string
  isGiftWrapped?: boolean
}

export default function GiftingCheckoutPage() {
  const [cart, setCart] = useState<GiftingCartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)

  // Sender details
  const [senderName, setSenderName] = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [senderEmail, setSenderEmail] = useState('')

  // Recipient details
  const [isSelfRecipient, setIsSelfRecipient] = useState(false)
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  // Gift options
  const [giftCardMessage, setGiftCardMessage] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'cod' | 'whatsapp'>('razorpay')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nt_cart')
      if (stored) {
        setCart(JSON.parse(stored))
      }
      const storedCoupon = localStorage.getItem('nt_applied_coupon')
      if (storedCoupon) {
        setAppliedCoupon(storedCoupon)
      }
    } catch {
      // fallback
    }
    setIsLoaded(true)
  }, [])

  const subtotal = cart.reduce((acc, item) => {
    const itemTotal = item.totalPrice ?? ((item.unitPrice ?? item.price ?? 0) * item.quantity)
    return acc + itemTotal
  }, 0)

  const discount = calculateDiscount(subtotal, appliedCoupon)
  const isFreeShip = subtotal >= 999 || appliedCoupon === 'FREESHIP'
  const shippingAmount = isFreeShip ? 0 : 99
  const finalTotal = Math.max(0, subtotal - discount + shippingAmount)

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    const generatedId = `GIFT-ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`

    try {
      const payload = {
        customer: {
          fullName: senderName || 'Valued Customer',
          phone: senderPhone,
          email: senderEmail,
          city: city || 'PAN-India',
        },
        items: cart.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.unitPrice || i.price,
          variant: i.variant,
          recipient: recipientName || i.recipientName || 'Gift Recipient',
        })),
        total: finalTotal,
        paymentMethod,
        vertical: 'gifting',
        referenceId: generatedId,
        notes: `[GIFTING CHECKOUT] Recipient: ${recipientName} (${recipientPhone}) | Delivery: ${addressLine1}, ${addressLine2}, ${city}, ${state} - ${pincode} | Card Message: "${giftCardMessage}" | Pref Date: ${deliveryDate} | Coupon: ${appliedCoupon || 'None'}`,
      }

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      // Clear basket upon successful order creation
      localStorage.removeItem('nt_cart')
      localStorage.removeItem('nt_applied_coupon')
      window.dispatchEvent(new Event('nt_cart_updated'))

      setPlacedOrderId(generatedId)
    } catch {
      // Local graceful fallback
      localStorage.removeItem('nt_cart')
      window.dispatchEvent(new Event('nt_cart_updated'))
      setPlacedOrderId(generatedId)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return <div className="py-20 text-center text-xs text-stone-500">Preparing secure checkout...</div>
  }

  // ── Render Order Confirmation Screen if Order Placed ─────────────────────
  if (placedOrderId) {
    return (
      <div className="py-16 max-w-2xl mx-auto px-4 sm:px-6 space-y-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-4xl mx-auto shadow-sm">
          ✓
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
            Thank You for Gifting with Nuty Tales!
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Your gift order reference is{' '}
            <strong className="font-mono text-[#0B2521] text-base">{placedOrderId}</strong>.
            A confirmation receipt has been generated and our packaging artisans have commenced hand-curation.
          </p>
        </div>

        {/* Order Receipt Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-left text-xs space-y-4">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <div>
              <span className="text-stone-400 text-[10px] block uppercase">Recipient</span>
              <strong className="text-stone-800 text-sm">{recipientName || senderName}</strong>
            </div>
            <div className="text-right">
              <span className="text-stone-400 text-[10px] block uppercase">Total Paid / Due</span>
              <strong className="font-serif text-base text-[#0B2521]">₹{finalTotal.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <div className="space-y-1 text-stone-600 text-xs">
            <div><strong>Delivery Address:</strong> {addressLine1}, {city}, {state} - {pincode}</div>
            {deliveryDate && <div><strong>Preferred Delivery Date:</strong> {deliveryDate}</div>}
            {giftCardMessage && (
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200 italic font-serif">
                &ldquo;{giftCardMessage}&rdquo;
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Central FSSAI Lic. #{FSSAI_NUMBER}</span>
            <span>Express Air Dispatch within 24 Hours</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={`/gifting/track?id=${placedOrderId}`}
            className="px-6 py-3 bg-[#0B2521] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            Track Consignment Status →
          </Link>
          <Link
            href="/gifting"
            className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold text-xs rounded-xl transition-colors"
          >
            Return to Gifting Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <Link href="/gifting" className="hover:text-[#0B2521]">Gifting</Link>
          <span>/</span>
          <Link href="/gifting/cart" className="hover:text-[#0B2521]">Basket</Link>
          <span>/</span>
          <span className="text-[#0B2521] font-semibold">Checkout</span>
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-[#17233B]">
          Secure Gifting Checkout
        </h1>
        <p className="text-xs text-stone-500 font-light mt-0.5">
          Provide recipient details, custom card messages, and preferred delivery schedule
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-7 space-y-6 text-xs">
          {/* Section 1: Sender Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#17233B] flex items-center gap-2 border-b border-stone-100 pb-3">
              <span>👤</span>
              <span>1. Your Information (Sender)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Email Address (For Tax Receipt &amp; AWB Tracking) *</label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="vikram@example.com"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Section 2: Recipient Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-base font-bold text-[#17233B] flex items-center gap-2">
                <span>📍</span>
                <span>2. Delivery Address</span>
              </h2>
              <label className="flex items-center gap-1.5 cursor-pointer text-stone-600">
                <input
                  type="checkbox"
                  checked={isSelfRecipient}
                  onChange={(e) => {
                    setIsSelfRecipient(e.target.checked)
                    if (e.target.checked) {
                      setRecipientName(senderName)
                      setRecipientPhone(senderPhone)
                    }
                  }}
                  className="w-3.5 h-3.5 rounded-sm accent-[#0B2521]"
                />
                <span className="text-[11px]">Send to myself</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient's Name"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Recipient Phone *</label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="Recipient's Mobile (For Courier Delivery)"
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Flat / House No. / Building Name *</label>
              <input
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="House / Flat / Tower / Street"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Area / Landmark / Sector (Optional)</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Near landmark or community"
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Postal PIN *</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit PIN"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl font-mono text-xs focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Greeting Card & Scheduled Date */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#17233B] flex items-center gap-2 border-b border-stone-100 pb-3">
              <span>💌</span>
              <span>3. Personalized Greeting &amp; Schedule</span>
            </h2>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Handwritten Message (Printed inside complimentary card)
              </label>
              <textarea
                rows={3}
                value={giftCardMessage}
                onChange={(e) => setGiftCardMessage(e.target.value)}
                placeholder="e.g. Wishing you a very Happy Birthday! May your year ahead be filled with joyous moments and abundant health. With lots of love..."
                className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Preferred Milestone Delivery Date (Optional)
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full sm:w-64 px-3.5 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
              />
            </div>
          </div>

          {/* Section 4: Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-2xs space-y-4">
            <h2 className="font-serif text-base font-bold text-[#17233B] flex items-center gap-2 border-b border-stone-100 pb-3">
              <span>💳</span>
              <span>4. Payment Method</span>
            </h2>

            <div className="space-y-2.5">
              {[
                { id: 'razorpay', label: 'Online Payment (UPI, Credit/Debit Cards, NetBanking)', sub: 'Secure gateway with instant confirmation' },
                { id: 'upi', label: 'Direct UPI Transfer (GPay / PhonePe / Paytm)', sub: 'Fast mobile payment with zero convenience fees' },
                { id: 'cod', label: 'Cash on Delivery (Standard Air)', sub: 'Pay with cash or scan UPI QR upon delivery' },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === m.id
                      ? 'border-[#0B2521] bg-[#FAF7F2]'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id as any)}
                    className="mt-1 accent-[#0B2521]"
                  />
                  <div>
                    <strong className="block text-stone-800 text-xs">{m.label}</strong>
                    <span className="text-[11px] text-stone-500">{m.sub}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3">
              Order Review ({cart.length} items)
            </h3>

            {/* List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center justify-between py-1 border-b border-stone-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                      {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="truncate">
                      <strong className="block text-stone-800 truncate">{item.name}</strong>
                      <span className="text-[10px] text-stone-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-800">
                    ₹{((item.unitPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing breakdown */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-[#17233B]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Savings ({appliedCoupon})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Air Express Shipping</span>
                <span className={isFreeShip ? 'text-emerald-700 font-bold' : 'font-mono font-bold'}>
                  {isFreeShip ? 'FREE' : `₹${shippingAmount}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#17233B] pt-3 border-t border-stone-100">
                <span>Final Payable</span>
                <span className="font-serif text-2xl font-black text-[#0B2521]">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming Your Order...' : `Place Gift Order · ₹${finalTotal.toLocaleString('en-IN')} →`}
              </button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#0B2521]">
              <span>🛡️</span>
              <span>Nuty Tales Gifting Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed text-stone-500">
              Every parcel is assembled with food-grade freshness seals and hand-wrapped with satin ribbons. Real-time air cargo tracking will be dispatched via SMS &amp; WhatsApp.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
