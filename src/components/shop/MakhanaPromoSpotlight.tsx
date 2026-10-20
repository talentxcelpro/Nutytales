'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface PackOption {
  sizeG: number
  label: string
  price: number
  mrp: number
  badge?: string
}

const PACK_OPTIONS: PackOption[] = [
  { sizeG: 250, label: '250g Trial', price: 249, mrp: 399 },
  { sizeG: 500, label: '500g Family', price: 479, mrp: 799 },
  { sizeG: 1000, label: '1 kg Best Value', price: 899, mrp: 1499, badge: '★ Best Value' },
  { sizeG: 2000, label: '2 kg Mega Saver', price: 1749, mrp: 2998, badge: 'Save ₹1,249' },
]

export default function MakhanaPromoSpotlight() {
  const router = useRouter()
  const [selectedPackIndex, setSelectedPackIndex] = useState(2) // 1kg default
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addedMessage, setAddedMessage] = useState('')

  const selectedPack = PACK_OPTIONS[selectedPackIndex]
  const totalPrice = selectedPack.price * quantity
  const totalMrp = selectedPack.mrp * quantity
  const totalSavings = totalMrp - totalPrice
  const savingsPercent = Math.round(((totalMrp - totalPrice) / totalMrp) * 100)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.')
      return
    }
    const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    const formattedDate = d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    setPincodeStatus(
      `✓ Serviceable! Express Air Delivery to ${pincode.trim()} by ${formattedDate}. Cash on Delivery & Free Shipping Available!`
    )
  }

  const handleAddToCart = (openDrawer = true) => {
    setIsAdding(true)
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const cartItem = {
        productId: 'mkh-001',
        name: 'NutyTales Premium Makhana (Jumbo 6 Suta)',
        slug: 'makhana-grade-a-fox-nuts',
        mode: 'retail',
        sizeLabel: selectedPack.label,
        unitPrice: selectedPack.price,
        quantity,
        totalPrice,
        image: '/images/promo-makhana-899.png',
      }
      existing.push(cartItem)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      if (openDrawer) {
        window.dispatchEvent(new Event('nt_open_cart'))
      }
      setAddedMessage(`Added ${quantity} × ${selectedPack.label} to cart!`)
      setTimeout(() => setAddedMessage(''), 2500)
    } catch {
      // fallback
    } finally {
      setIsAdding(false)
    }
  }

  const handleInstantBuy = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const cartItem = {
        productId: 'mkh-001',
        name: 'NutyTales Premium Makhana (Jumbo 6 Suta)',
        slug: 'makhana-grade-a-fox-nuts',
        mode: 'retail',
        sizeLabel: selectedPack.label,
        unitPrice: selectedPack.price,
        quantity,
        totalPrice,
        image: '/images/promo-makhana-899.png',
      }
      existing.push(cartItem)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      router.push('/checkout')
    } catch {
      router.push('/checkout')
    }
  }

  const whatsappMessage = encodeURIComponent(
    `Hello NutyTales! 👋\n\nI want to order:\n• *Product:* NutyTales Premium Makhana (Jumbo 6 Suta)\n• *Pack Size:* ${selectedPack.label}\n• *Quantity:* ${quantity}\n• *Special Price:* ₹${totalPrice} (Offer: ₹899/kg)\n\nPlease share delivery confirmation and payment QR code!`
  )

  return (
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-white border-b border-stone-200/90 pt-24 sm:pt-28 pb-12 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-amber-200/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tagline Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3 mb-6 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#17233B] tracking-wide uppercase text-[11px]">
              NutyTales Goodness In Every Bite
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-600 font-medium hidden sm:inline">
              Pure. Wholesome. Naturally Yours.
            </span>
          </div>
          <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
            <span>FSSAI Lic. #{FSSAI_NUMBER}</span>
            <span>•</span>
            <span className="text-[#C9A45C] font-bold">Pan-India Express Delivery</span>
          </div>
        </div>

        {/* Main Split Grid: Poster Creative + Interactive Buying Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Visual Poster Display */}
          <div className="lg:col-span-5 relative group">
            <div className="relative aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C9A45C]/30 bg-stone-900 group-hover:border-[#C9A45C] transition-all">
              <Image
                src="/images/promo-makhana-899.png"
                alt="NutyTales Premium Makhana Jumbo 6 Suta - ₹899 per kg only"
                fill
                priority
                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              {/* Corner ribbon */}
              <div className="absolute top-4 right-4 bg-[#0A1830] text-[#C9A45C] border border-[#C9A45C]/40 px-3 py-1.5 rounded-full shadow-lg text-xs font-bold font-mono tracking-wide">
                ₹899 / kg ONLY
              </div>
            </div>

            {/* Sub-strip with 4 Recipe Ideas from Poster */}
            <div className="grid grid-cols-4 gap-2 pt-3 text-center text-[10px]">
              <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-sm block">🥣</span>
                <span className="font-bold text-stone-800 block">Roasted Snack</span>
                <span className="text-[9px] text-stone-500">Pure Ghee</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-sm block">🍮</span>
                <span className="font-bold text-stone-800 block">Delicious Kheer</span>
                <span className="text-[9px] text-stone-500">Kesar Almond</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-sm block">🍛</span>
                <span className="font-bold text-stone-800 block">Curries &amp; Gravy</span>
                <span className="text-[9px] text-stone-500">Royal Feast</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-sm block">🥗</span>
                <span className="font-bold text-stone-800 block">Healthy Bowl</span>
                <span className="text-[9px] text-stone-500">Protein Snack</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Converting Commercial Purchase Terminal */}
          <div className="lg:col-span-7 space-y-6">
            {/* Offer Callout Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SPECIAL INTRODUCTORY OFFER · 40% OFF</span>
              <span className="text-emerald-400">•</span>
              <span className="text-emerald-700">LIMITED HARVEST BATCH</span>
            </div>

            {/* Product Title & Short Hook */}
            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#17233B] tracking-tight leading-[1.12]">
                Premium Makhana
              </h2>
              <div className="text-sm sm:text-base font-semibold text-[#704B32] uppercase tracking-wider">
                JUMBO | 6 SUTA | WHOLE — STRAIGHT FROM NATURE TO YOUR HOME
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                100% natural, handpicked lotus seeds with crisp texture and zero preservatives. Rich in plant protein &amp; fibre, low in calories, heart-friendly, and perfect for fasting (vrat), gym diets, and gourmet cooking.
              </p>
            </div>

            {/* Giant Live Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{totalMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Save ₹{totalSavings.toLocaleString('en-IN')} ({savingsPercent}% OFF)
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  Inclusive of all taxes · <strong>₹899 per kg benchmark price</strong>
                </div>
              </div>

              {/* In-Stock Indicator */}
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Fresh Batch In Stock</span>
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Dispatches within 24 Hours</span>
              </div>
            </div>

            {/* Pack Size Selector Pills */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]">
                Select Pack Size:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PACK_OPTIONS.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx
                  return (
                    <button
                      key={pack.sizeG}
                      type="button"
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? 'border-[#17233B] bg-[#17233B] text-white shadow-md'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {pack.badge && (
                        <span
                          className={`absolute -top-2 right-2 px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            isSelected
                              ? 'bg-[#C9A45C] text-[#17233B]'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {pack.badge}
                        </span>
                      )}
                      <div className="font-bold text-xs">{pack.label}</div>
                      <div
                        className={`text-sm font-bold font-mono mt-0.5 ${
                          isSelected ? 'text-[#C9A45C]' : 'text-[#17233B]'
                        }`}
                      >
                        ₹{pack.price}
                      </div>
                      <div
                        className={`text-[10px] line-through ${
                          isSelected ? 'text-white/60' : 'text-stone-400'
                        }`}
                      >
                        ₹{pack.mrp}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity Selector & Instant Actions */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity Pill */}
                <div className="flex items-center justify-between border-2 border-stone-200 bg-white rounded-xl px-3 py-2 w-32 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-stone-500 hover:text-stone-900 font-bold text-lg px-2"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="font-mono font-bold text-stone-900 text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-stone-500 hover:text-stone-900 font-bold text-lg px-2"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Instant Buy Button (Fast-Track Checkout) */}
                <button
                  type="button"
                  onClick={handleInstantBuy}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#17233B] hover:bg-[#203050] text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>⚡ Buy Now — Instant Checkout</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={isAdding}
                  className="py-3.5 px-5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-stone-300 transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🛒</span>
                  <span>Add to Cart</span>
                </button>
              </div>

              {/* Added Feedback Toast */}
              {addedMessage && (
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs font-bold text-center animate-fadeIn">
                  ✓ {addedMessage}
                </div>
              )}

              {/* Direct WhatsApp Ordering */}
              <div className="flex items-center justify-between gap-3 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <span className="text-stone-600 font-medium">Prefer ordering on WhatsApp?</span>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#176B68] hover:underline flex items-center gap-1"
                >
                  <span>💬 Order on WhatsApp (+91 9717161809) →</span>
                </a>
              </div>
            </div>

            {/* Pincode Delivery Checker */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2 text-xs">
              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <span className="text-stone-400">🚚</span>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter delivery pincode (e.g. 110001, 400001, 560001)"
                  className="flex-1 py-1.5 px-3 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-[#17233B]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
                >
                  Check Delivery
                </button>
              </form>
              {pincodeStatus && (
                <p
                  className={`text-[11px] font-medium ${
                    pincodeStatus.startsWith('✓') ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* 4 Trust Badges from Poster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-stone-600">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Jumbo Size (6 Suta)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Cleaned &amp; Graded</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Hygienically Packed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
