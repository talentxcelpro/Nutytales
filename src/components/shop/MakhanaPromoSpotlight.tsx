'use client'

import React, { useState, useRef } from 'react'
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

  // Media switcher state: 'poster' | 'video' | 'pouch'
  const [activeMedia, setActiveMedia] = useState<'poster' | 'video' | 'pouch'>('poster')
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayVideo = () => {
    setActiveMedia('video')
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {})
      }
    }, 100)
  }

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
          {/* Left Column: Visual Media Showcase (Poster + HD Farm Video + Packaging) */}
          <div className="lg:col-span-5 relative space-y-3">
            {/* Media Selector Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMedia('poster')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeMedia === 'poster'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>📸</span>
                <span>Offer Poster</span>
              </button>

              <button
                type="button"
                onClick={handlePlayVideo}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeMedia === 'video'
                    ? 'bg-[#17233B] text-emerald-400 shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>🎬 Watch Video (HD)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMedia('pouch')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeMedia === 'pouch'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>📦</span>
                <span>Packaging</span>
              </button>
            </div>

            {/* Main Media Stage (Strictly 1:1 Aspect Ratio to Guarantee Zero Cropping of Poster) */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C9A45C]/40 bg-[#0B1528] group transition-all">
              {activeMedia === 'poster' && (
                <>
                  <Image
                    src="/images/promo-makhana-899.png"
                    alt="NutyTales Premium Makhana Jumbo 6 Suta - ₹899 per kg only"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  {/* Top-Right Price Ribbon */}
                  <div className="absolute top-3 right-3 bg-[#0A1830]/95 backdrop-blur-md text-[#C9A45C] border border-[#C9A45C]/50 px-3 py-1 rounded-full shadow-lg text-[11px] font-bold font-mono tracking-wide z-10">
                    ₹899 / kg ONLY
                  </div>
                  {/* Quick-switch to Video CTA Button */}
                  <button
                    type="button"
                    onClick={handlePlayVideo}
                    className="absolute bottom-3 left-3 bg-[#17233B]/95 hover:bg-[#17233B] text-white hover:text-emerald-300 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105 z-10 group/btn"
                  >
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center text-[10px] font-bold group-hover/btn:scale-110 transition-transform">
                      ▶
                    </span>
                    <span>Watch Harvest Video</span>
                  </button>
                </>
              )}

              {activeMedia === 'video' && (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src="/videos/makhana-showcase.mp4"
                    poster="/images/promo-makhana-899.png"
                    autoPlay
                    playsInline
                    loop
                    muted={isMuted}
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                  {/* Top-Left HD Tag */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 pointer-events-none z-10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>HD Farm Video</span>
                  </div>
                  {/* Sound Toggle Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !videoRef.current.muted
                        setIsMuted(videoRef.current.muted)
                      }
                    }}
                    className="absolute top-3 right-3 bg-black/80 hover:bg-black text-white border border-white/20 px-3 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-all shadow-md z-10"
                  >
                    <span>{isMuted ? '🔇 Tap for Sound' : '🔊 Sound On'}</span>
                  </button>
                </div>
              )}

              {activeMedia === 'pouch' && (
                <div className="relative w-full h-full bg-[#FBF9F5] flex items-center justify-center p-6">
                  <Image
                    src="/images/makhana-pouch-250g.jpg"
                    alt="NutyTales Premium Makhana Nitrogen-Sealed Fresh Pouch"
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-900/90 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs">
                    Fresh Nitrogen Seal
                  </div>
                </div>
              )}
            </div>

            {/* Quick-Switch Thumbnails Row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveMedia('poster')}
                className={`rounded-xl border p-1.5 bg-white text-left transition-all flex items-center gap-2 ${
                  activeMedia === 'poster'
                    ? 'border-[#17233B] bg-stone-50 ring-2 ring-[#17233B]/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-stone-900">
                  <Image src="/images/promo-makhana-899.png" alt="Offer Poster" fill className="object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold text-stone-800 truncate">Offer Poster</span>
                  <span className="block text-[9px] text-emerald-700 font-semibold">₹899 Special</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handlePlayVideo}
                className={`rounded-xl border p-1.5 bg-white text-left transition-all flex items-center gap-2 ${
                  activeMedia === 'video'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-stone-950 flex items-center justify-center text-emerald-400 font-bold">
                  ▶
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold text-stone-800 truncate">Harvest Video</span>
                  <span className="block text-[9px] text-emerald-700 font-semibold">Watch in HD</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMedia('pouch')}
                className={`rounded-xl border p-1.5 bg-white text-left transition-all flex items-center gap-2 ${
                  activeMedia === 'pouch'
                    ? 'border-[#17233B] bg-stone-50 ring-2 ring-[#17233B]/20 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100">
                  <Image src="/images/makhana-pouch-250g.jpg" alt="Pouch" fill className="object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold text-stone-800 truncate">Retail Pack</span>
                  <span className="block text-[9px] text-stone-500">Nitrogen Sealed</span>
                </div>
              </button>
            </div>

            {/* Sub-strip with 4 Recipe Ideas from Poster */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center text-[10px]">
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
