'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface CartItem {
  productId: string
  name: string
  slug: string
  mode: 'retail' | 'wholesale'
  sizeLabel: string
  unitPrice: number
  quantity: number
  totalPrice: number
  image?: string
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nt_cart')
      if (stored) {
        setCart(JSON.parse(stored))
      }
    } catch {
      // fallback
    }
    setIsLoaded(true)
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem('nt_cart', JSON.stringify(newCart))
  }

  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(index)
      return
    }
    const updated = [...cart]
    updated[index].quantity = newQty
    updated[index].totalPrice = updated[index].unitPrice * newQty
    updateCart(updated)
  }

  const handleRemove = (index: number) => {
    const updated = cart.filter((_, i) => i !== index)
    updateCart(updated)
  }

  const handleClear = () => {
    updateCart([])
  }

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0)
  const hasWholesale = cart.some((item) => item.mode === 'wholesale')
  const freeShippingThreshold = 999
  const shipping = subtotal > freeShippingThreshold || subtotal === 0 ? 0 : 99
  const estimatedTotal = subtotal + shipping

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappSummary = cart
    .map((item) => `• ${item.name} (${item.sizeLabel}) × ${item.quantity} = ₹${item.totalPrice}`)
    .join('\n')

  const whatsappMessage = encodeURIComponent(
    `Hello Nutty Tales! 👋\n\nI would like to place an order for the following items:\n\n${whatsappSummary}\n\n*Estimated Total:* ₹${estimatedTotal}\n\nPlease confirm availability and payment details. Thank you!`
  )

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#F7F2E8] pt-32 pb-24 flex items-center justify-center">
        <div className="text-center text-[#17233B]/60 text-sm">Loading your shopping basket...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F2E8] pt-28 sm:pt-36 pb-24 text-[#17233B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-[#17233B]/10 pb-6 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
              Your Selection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17233B] mt-1">
              Shopping Basket
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs uppercase tracking-wider text-[#704B32] hover:text-red-700 font-semibold underline underline-offset-4"
            >
              Clear Basket
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#17233B]/10 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#F7F2E8] mx-auto flex items-center justify-center text-3xl">
              🧺
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">Your basket is empty</h2>
              <p className="text-sm text-[#17233B]/70 max-w-md mx-auto leading-relaxed">
                Explore our handpicked collection of Kashmiri almonds, premium cashews, Mithila makhana, and corporate gift hampers.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
              >
                Browse Collection
              </Link>
              <Link
                href="/corporate-gifting"
                className="px-8 py-3.5 bg-white border border-[#17233B]/20 hover:border-[#176B68] text-[#17233B] hover:text-[#176B68] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Corporate Hampers
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Items Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {hasWholesale && (
                <div className="p-4 rounded-2xl bg-[#176B68]/10 border border-[#176B68]/30 flex items-start gap-3 text-xs text-[#17233B]">
                  <span className="text-base">📦</span>
                  <div>
                    <strong className="font-semibold block text-[#176B68]">Wholesale Order Notice</strong>
                    You have bulk wholesale tiers in your cart. A formal B2B invoice with your GSTIN and dispatch logistics will be verified at checkout.
                  </div>
                </div>
              )}

              {cart.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.sizeLabel}-${idx}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-[#17233B]/10 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 transition-all hover:border-[#176B68]/40"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F7F2E8] border border-[#17233B]/10 flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-[#17233B]/30">
                        🥜
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="font-serif text-base font-bold text-[#17233B] hover:text-[#176B68] transition-colors truncate"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="text-stone-400 hover:text-red-600 text-sm p-1"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-xs text-[#704B32] font-semibold mt-0.5">
                      {item.sizeLabel}{' '}
                      {item.mode === 'wholesale' && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold">
                          Wholesale
                        </span>
                      )}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-[#17233B]/20 rounded-lg overflow-hidden bg-[#F7F2E8]">
                        <button
                          onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs font-bold text-[#17233B] hover:bg-[#17233B]/10"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold bg-white min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs font-bold text-[#17233B] hover:bg-[#17233B]/10"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 block">₹{item.unitPrice} each</span>
                        <span className="text-base font-bold text-[#17233B]">
                          ₹{item.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-[#176B68] hover:text-[#125350]"
                >
                  ← Continue Shopping Collection
                </Link>
              </div>
            </div>

            {/* Summary Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#17233B]/10 shadow-sm sticky top-28 space-y-6">
                <h2 className="font-serif text-xl font-bold text-[#17233B] border-b border-[#17233B]/10 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-[#17233B]/80">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#17233B]">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#17233B]/80">
                    <span>Standard Logistics</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-700 font-semibold">Complimentary</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-[11px] text-[#704B32] bg-[#F7F2E8] p-2.5 rounded-xl border border-[#17233B]/5">
                      Add ₹{(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more to unlock complimentary Pan-India shipping.
                    </div>
                  )}

                  <div className="flex justify-between text-[#17233B]/80">
                    <span>Taxes & GST</span>
                    <span className="text-xs text-stone-500">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-[#17233B]/10 pt-4 flex justify-between items-baseline">
                    <div>
                      <span className="font-serif text-lg font-bold text-[#17233B]">Estimated Total</span>
                      <span className="block text-[10px] text-stone-500 uppercase tracking-wider">
                        INR (Indian Rupees)
                      </span>
                    </div>
                    <span className="font-serif text-2xl font-bold text-[#176B68]">
                      ₹{estimatedTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout CTAs */}
                <div className="space-y-3 pt-2">
                  <Link
                    href="/checkout"
                    className="block w-full py-4 bg-[#176B68] hover:bg-[#125350] text-white text-center font-bold rounded-2xl text-xs uppercase tracking-widest shadow-md transition-colors"
                  >
                    Proceed to Checkout
                  </Link>

                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 border border-[#176B68] text-[#176B68] hover:bg-[#176B68]/5 text-center font-semibold rounded-2xl text-xs uppercase tracking-wider transition-colors"
                  >
                    💬 Quick Order via WhatsApp
                  </a>
                </div>

                {/* Assurance points */}
                <div className="pt-4 border-t border-[#17233B]/10 space-y-2.5 text-xs text-[#17233B]/70">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>FSSAI Certified Packaging (Lic. 22724441000048)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>100% Sourced & Inspected Origins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Direct GST Invoices Available for Corporate & B2B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
