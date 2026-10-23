'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { calculateDiscount, DYNAMIC_COUPONS } from '@/lib/coupons'

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

export default function GiftingCartPage() {
  const [cart, setCart] = useState<GiftingCartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const loadCart = () => {
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
  }

  useEffect(() => {
    loadCart()
    const handleCartUpdate = () => loadCart()
    window.addEventListener('nt_cart_updated', handleCartUpdate)
    return () => window.removeEventListener('nt_cart_updated', handleCartUpdate)
  }, [])

  const updateCart = (newCart: GiftingCartItem[]) => {
    setCart(newCart)
    localStorage.setItem('nt_cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('nt_cart_updated'))
  }

  const handleQuantity = (idx: number, delta: number) => {
    const updated = [...cart]
    const newQty = updated[idx].quantity + delta
    if (newQty <= 0) {
      updated.splice(idx, 1)
    } else {
      updated[idx].quantity = newQty
      const unit = updated[idx].unitPrice || updated[idx].price || 0
      updated[idx].totalPrice = unit * newQty
    }
    updateCart(updated)
  }

  const handleRemove = (idx: number) => {
    const updated = cart.filter((_, i) => i !== idx)
    updateCart(updated)
  }

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase()
    const valid = DYNAMIC_COUPONS.find((c) => c.code === clean)
    if (valid) {
      localStorage.setItem('nt_applied_coupon', clean)
      setAppliedCoupon(clean)
      setCouponMsg(`✓ Coupon ${clean} applied!`)
      window.dispatchEvent(new Event('nt_cart_updated'))
      setTimeout(() => setCouponMsg(''), 2500)
    } else {
      setCouponMsg('Invalid coupon code')
      setTimeout(() => setCouponMsg(''), 2500)
    }
  }

  const handleRemoveCoupon = () => {
    localStorage.removeItem('nt_applied_coupon')
    setAppliedCoupon(null)
    setCouponMsg('Coupon removed')
    window.dispatchEvent(new Event('nt_cart_updated'))
    setTimeout(() => setCouponMsg(''), 2000)
  }

  const subtotal = cart.reduce((acc, item) => {
    const itemTotal = item.totalPrice ?? ((item.unitPrice ?? item.price ?? 0) * item.quantity)
    return acc + itemTotal
  }, 0)

  const discount = calculateDiscount(subtotal, appliedCoupon)
  const isFreeShip = subtotal >= 999 || appliedCoupon === 'FREESHIP'
  const shippingAmount = isFreeShip ? 0 : 99
  const finalTotal = Math.max(0, subtotal - discount + shippingAmount)
  const remainingForFreeShip = Math.max(0, 999 - subtotal)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  if (!isLoaded) {
    return <div className="py-20 text-center text-xs text-stone-500">Loading your shopping basket...</div>
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <Link href="/gifting" className="hover:text-[#0B2521]">Gifting</Link>
          <span>/</span>
          <span className="text-[#0B2521] font-semibold">Shopping Basket</span>
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-[#17233B]">
          Your Gifting Basket
        </h1>
        <p className="text-xs text-stone-500 font-light mt-0.5">
          {cart.length} {cart.length === 1 ? 'item' : 'items'} selected for celebration
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-lg mx-auto space-y-4">
          <span className="text-4xl">🎁</span>
          <h2 className="font-serif text-xl font-bold text-[#17233B]">Your basket is currently empty</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Discover our luxury dry fruit hampers, handcrafted walnut wood keepsakes, and personalized gift boxes.
          </p>
          <div className="pt-2">
            <Link
              href="/gifting/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              <span>Explore All Gifts</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Strip */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs">
              {remainingForFreeShip > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold text-[#0B2521]">
                    <span>Add ₹{remainingForFreeShip} more for Free Air Express Shipping!</span>
                    <span>{Math.min(100, Math.round((subtotal / 999) * 100))}%</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C9A45C] h-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((subtotal / 999) * 100))}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-emerald-800 font-bold flex items-center gap-1.5">
                  <span>✨</span>
                  <span>Unlocked: Complimentary Express Air Dispatch across India!</span>
                </p>
              )}
            </div>

            {/* Items Cards */}
            <div className="space-y-3">
              {cart.map((item, idx) => {
                const itemUnit = item.unitPrice ?? item.price ?? 0
                const itemTotal = item.totalPrice ?? itemUnit * item.quantity

                return (
                  <div
                    key={`${item.productId}-${idx}`}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7F2] border border-stone-200 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <span className="text-2xl flex items-center justify-center h-full">🎁</span>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/gifting/product/${item.slug}`}
                          className="font-serif text-sm font-bold text-[#17233B] hover:text-[#C9A45C] block leading-tight truncate"
                        >
                          {item.name}
                        </Link>
                        <span className="text-[11px] text-[#704B32] block font-medium">
                          Edition: {item.variant || 'Standard Pack'}
                        </span>

                        {/* Personalization Info */}
                        {item.recipientName && (
                          <div className="text-[10px] text-stone-500 bg-[#FAF7F2] px-2 py-0.5 rounded-md inline-block">
                            Inscribed: <strong>{item.recipientName}</strong>
                          </div>
                        )}

                        <div className="pt-1">
                          <span className="font-mono font-bold text-sm text-[#0B2521]">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400 ml-1.5">
                            (₹{itemUnit.toLocaleString('en-IN')} / unit)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls and delete */}
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                        <button
                          type="button"
                          onClick={() => handleQuantity(idx, -1)}
                          className="w-7 h-8 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-white rounded-l-xl transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono text-[#17233B]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantity(idx, 1)}
                          className="w-7 h-8 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-white rounded-r-xl transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors text-sm"
                        title="Remove gift"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3">
                Order Summary
              </h3>

              {/* Promo Code Input */}
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-emerald-700 font-mono text-xs block">🎟️ {appliedCoupon}</strong>
                      <span className="text-[10px] text-emerald-800">Saved ₹{discount}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-rose-600 text-[11px] underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Discount code (e.g. NUTY10)"
                        className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono uppercase focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleApplyCoupon(couponInput)
                          setCouponInput('')
                        }}
                        className="px-3 py-1.5 bg-[#0B2521] text-white rounded-lg text-xs font-bold hover:bg-[#176B68]"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <p className={`text-[10px] ${couponMsg.includes('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {couponMsg}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-[#17233B]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
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
                  <span>Total Amount</span>
                  <span className="font-serif text-xl font-black text-[#0B2521]">
                    ₹{finalTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="pt-2 space-y-2">
                <Link
                  href="/gifting/checkout"
                  className="w-full py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl text-center block shadow-md transition-all active:scale-98"
                >
                  Proceed to Secure Checkout →
                </Link>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales! I want to confirm my gifting basket order: Total ₹${finalTotal}. Please dispatch!`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>💬 Instant WhatsApp Order</span>
                </a>
              </div>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
              <div>🔒 <strong>100% Secure Checkout:</strong> 256-bit encryption.</div>
              <div>✈️ <strong>Air Cargo SLA:</strong> Trackable consignments via Bluedart.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
