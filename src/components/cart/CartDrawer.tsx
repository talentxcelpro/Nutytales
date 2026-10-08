'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { calculateDiscount, DYNAMIC_COUPONS } from '@/lib/coupons'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

export interface CartItem {
  productId: string
  name: string
  slug: string
  mode?: 'retail' | 'wholesale'
  sizeLabel: string
  unitPrice: number
  quantity: number
  totalPrice: number
  image?: string
}

export default function CartDrawer() {
  const { formatPrice } = useMarketCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponInput, setCouponInput] = useState('')
  const [couponMsg, setCouponMsg] = useState('')

  const loadCart = () => {
    try {
      const stored = localStorage.getItem('nt_cart')
      if (stored) {
        setCart(JSON.parse(stored))
      } else {
        setCart([])
      }
    } catch {
      setCart([])
    }
  }

  const loadCoupon = () => {
    try {
      const stored = localStorage.getItem('nt_applied_coupon')
      setAppliedCoupon(stored || null)
    } catch {
      setAppliedCoupon(null)
    }
  }

  useEffect(() => {
    loadCart()
    loadCoupon()

    const handleOpen = () => {
      loadCart()
      loadCoupon()
      setIsOpen(true)
    }

    const handleCartUpdate = () => {
      loadCart()
      loadCoupon()
    }

    window.addEventListener('nt_open_cart', handleOpen)
    window.addEventListener('nt_cart_updated', handleCartUpdate)
    window.addEventListener('nt_coupon_applied', handleCartUpdate)

    return () => {
      window.removeEventListener('nt_open_cart', handleOpen)
      window.removeEventListener('nt_cart_updated', handleCartUpdate)
      window.removeEventListener('nt_coupon_applied', handleCartUpdate)
    }
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('nt_cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('nt_cart_updated'))
  }

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase()
    const valid = DYNAMIC_COUPONS.find((c) => c.code === clean)
    if (valid) {
      localStorage.setItem('nt_applied_coupon', clean)
      setAppliedCoupon(clean)
      setCouponMsg(`✓ ${clean} applied!`)
      window.dispatchEvent(new Event('nt_coupon_applied'))
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
    window.dispatchEvent(new Event('nt_coupon_applied'))
    window.dispatchEvent(new Event('nt_cart_updated'))
    setTimeout(() => setCouponMsg(''), 2000)
  }

  const handleQuantity = (idx: number, delta: number) => {
    const updated = [...cart]
    const newQty = updated[idx].quantity + delta
    if (newQty <= 0) {
      updated.splice(idx, 1)
    } else {
      updated[idx].quantity = newQty
      updated[idx].totalPrice = updated[idx].unitPrice * newQty
    }
    updateCart(updated)
  }

  const handleRemove = (idx: number) => {
    const updated = cart.filter((_, i) => i !== idx)
    updateCart(updated)
  }

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0)
  const discount = calculateDiscount(subtotal, appliedCoupon)
  const freeShippingTarget = 999
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingTarget) * 100))
  const remainingForFreeShipping = Math.max(0, freeShippingTarget - subtotal)
  const isFreeShip = remainingForFreeShipping === 0 || appliedCoupon === 'FREESHIP'
  const estimatedShipping = isFreeShip ? 0 : 99
  const finalTotal = Math.max(0, subtotal - discount + estimatedShipping)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappSummary = cart
    .map((item) => `• ${item.name} (${item.sizeLabel}) × ${item.quantity} = ₹${item.totalPrice}`)
    .join('\n')

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales! 👋\n\nI want to order items from my cart:\n\n${whatsappSummary}\n\n*Subtotal:* ₹${subtotal}${
      appliedCoupon && discount > 0 ? `\n*Coupon (${appliedCoupon}):* -₹${discount}` : ''
    }\n*Shipping:* ${isFreeShip ? 'FREE' : '₹99'}\n*Estimated Total:* ₹${finalTotal}\n\nPlease confirm availability and dispatch date!`
  )}`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17233B]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FAF6EE] shadow-2xl flex flex-col h-full z-10 border-l border-[#17233B]/10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#17233B]/10 flex items-center justify-between bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#17233B]">Shopping Basket</h2>
              <p className="text-[10px] text-[#704B32] uppercase tracking-wider font-semibold">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold transition-colors"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-5 py-3 bg-[#176B68]/10 border-b border-[#176B68]/15">
          {remainingForFreeShipping > 0 ? (
            <div className="space-y-1.5">
              <p className="text-xs text-[#176B68] font-semibold flex items-center justify-between">
                <span>Add {formatPrice(remainingForFreeShipping)} more for Free Express Shipping!</span>
                <span className="text-[10px]">{freeShippingProgress}%</span>
              </p>
              <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#176B68] h-full rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
              <span>✨</span>
              <span>Congratulations! You have unlocked Complimentary Express Delivery!</span>
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm border border-stone-200">
                🥜
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#17233B]">Your basket is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Discover our pure harvest dry fruits, GI saffron, and handcrafted Kashmir heritage garments.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full pt-2">
                <Link
                  href="/shop"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-sm"
                >
                  Shop Dry Fruits
                </Link>
                <Link
                  href="/crafts"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 bg-white hover:bg-stone-50 text-[#17233B] border border-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors"
                >
                  Explore Crafts &amp; Heritage
                </Link>
              </div>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm flex gap-3.5 items-center"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-xl bg-[#FAF6EE] overflow-hidden flex-shrink-0 border border-stone-100 flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <span className="text-2xl">🥜</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#17233B] truncate leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[#704B32] font-medium mt-0.5">
                    {item.sizeLabel}
                  </p>
                  <p className="text-xs font-extrabold text-[#176B68] mt-1">
                    {formatPrice(item.totalPrice)}
                    <span className="text-[10px] text-stone-400 font-normal ml-1">
                      ({formatPrice(item.unitPrice)}/unit)
                    </span>
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleRemove(idx)}
                    className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    🗑
                  </button>
                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                    <button
                      onClick={() => handleQuantity(idx, -1)}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-white rounded-l transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-[#17233B]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantity(idx, 1)}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-white rounded-r transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#17233B]/10 bg-white space-y-3">
            {/* Dynamic Coupon Strip in Drawer */}
            <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200/80">
              {appliedCoupon ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-mono font-bold text-xs">🎟️ {appliedCoupon}</span>
                    <span className="text-[11px] text-emerald-800 font-semibold">(-₹{discount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-[11px] text-stone-400 hover:text-rose-600 underline"
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
                      placeholder="Promo code (e.g. NUTY10)"
                      className="flex-1 bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs uppercase font-mono tracking-wider focus:outline-hidden focus:border-[#17233B]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleApplyCoupon(couponInput)
                        setCouponInput('')
                      }}
                      className="px-3 py-1 bg-[#17233B] text-white rounded-lg text-xs font-semibold hover:bg-[#176B68] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] ${couponMsg.includes('✓') ? 'text-emerald-700 font-semibold' : 'text-rose-600'}`}>
                      {couponMsg}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-bold text-[#17233B]">{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Estimated Shipping</span>
                <span className={isFreeShip ? 'text-emerald-700 font-bold' : 'font-bold'}>
                  {isFreeShip ? 'FREE' : formatPrice(estimatedShipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#17233B] pt-2 border-t border-stone-100">
                <span>Estimated Total (Incl. Taxes)</span>
                <span className="text-[#176B68] text-base">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-all shadow-md active:scale-[0.98]"
              >
                Proceed to Checkout →
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>💬</span>
                <span>Instant Order via WhatsApp</span>
              </a>

              <Link
                href="/cart"
                onClick={() => setIsOpen(false)}
                className="text-[11px] text-stone-500 hover:text-[#176B68] text-center block font-semibold underline underline-offset-2"
              >
                View Full Basket &amp; Add Gift Notes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
