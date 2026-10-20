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

type MediaMode = 'video' | 'pouch' | 'poster' | 'bowl'

export default function MakhanaPromoSpotlight() {
  const router = useRouter()
  const [selectedPackIndex, setSelectedPackIndex] = useState(2) // 1kg default
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addedMessage, setAddedMessage] = useState('')

  // Media switcher: defaults to 'video' for ambient cinematic hook
  const [activeMedia, setActiveMedia] = useState<MediaMode>('video')
  const [isMuted, setIsMuted] = useState(true)
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const selectedPack = PACK_OPTIONS[selectedPackIndex]
  const totalPrice = selectedPack.price * quantity
  const totalMrp = selectedPack.mrp * quantity
  const totalSavings = totalMrp - totalPrice
  const savingsPercent = Math.round(((totalMrp - totalPrice) / totalMrp) * 100)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handlePlayVideo = () => {
    setActiveMedia('video')
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {})
      }
    }, 50)
  }

  const handleToggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit PIN code.')
      return
    }
    const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    const formattedDate = d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    setPincodeStatus(`✓ Express Delivery to ${pincode.trim()} by ${formattedDate} (COD Available)`)
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
    <section className="relative bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EB] to-white border-b border-stone-200/90 pt-14 sm:pt-16 pb-3 overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[250px] bg-amber-200/15 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Slimline Trust Bar (Compact, Direct Fit) */}
        <div className="flex flex-wrap items-center justify-between gap-1 border-b border-stone-200/60 pb-1.5 mb-2.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#17233B] tracking-wide uppercase text-[10px] sm:text-[11px]">
              NutyTales · Mithila Wetland Harvest
            </span>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <span className="text-stone-500 font-medium text-[11px] hidden sm:inline">
              FSSAI Lic. #{FSSAI_NUMBER}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-stone-600 font-medium">
            <span className="text-emerald-700 font-bold">★ 4.9 Rating (2,400+ Orders)</span>
            <span className="text-stone-300">•</span>
            <span className="text-[#C9A45C] font-semibold">Pan-India Express Air Shipping</span>
          </div>
        </div>

        {/* Main Split Grid: Responsive Cinema Stage + Compact Buying Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
          {/* ──────────────── Left Column: Cinema Media Showcase (Zero Cropping, Zero Cutoff) ──────────────── */}
          <div className="lg:col-span-5 space-y-2">
            {/* Media Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                type="button"
                onClick={handlePlayVideo}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'video'
                    ? 'bg-[#17233B] text-emerald-400 shadow-sm ring-2 ring-emerald-500/30'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>🎬 Farm Film (HD)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMedia('pouch')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'pouch'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>📦</span>
                <span>Studio Pack</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMedia('poster')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'poster'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>📜</span>
                <span>Offer Flyer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMedia('bowl')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'bowl'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>🥣</span>
                <span>Lifestyle</span>
              </button>
            </div>

            {/* Main Media Stage (16:10 Ratio, max-h 315px, object-contain to PREVENT ANY CROPPING) */}
            <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] max-h-[315px] w-full rounded-2xl overflow-hidden shadow-lg border-2 border-[#C9A45C]/35 bg-black group transition-all flex items-center justify-center">
              {/* Mode 1: HD Cinematic Video Player (Object-Contain so 100% of text and image is visible!) */}
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
                  {/* Floating HD Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md text-white border border-white/20 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1.5 pointer-events-none z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Live HD Video</span>
                  </div>
                  {/* Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className="absolute top-2.5 right-2.5 bg-black/80 hover:bg-black text-white border border-white/20 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all shadow-md z-10 cursor-pointer"
                  >
                    <span>{isMuted ? '🔇 Sound Off' : '🔊 Sound On'}</span>
                  </button>
                  {/* Corner Ribbon */}
                  <div className="absolute bottom-2.5 right-2.5 bg-[#0A1830]/90 backdrop-blur-md text-[#C9A45C] border border-[#C9A45C]/50 px-2 py-0.5 rounded-full shadow-lg text-[10px] font-bold font-mono tracking-wide z-10">
                    ₹899 / kg ONLY
                  </div>
                </div>
              )}

              {/* Mode 2: Clean Studio Pouch Shot */}
              {activeMedia === 'pouch' && (
                <div className="relative w-full h-full bg-[#FAF7F2] flex items-center justify-center p-3">
                  <Image
                    src="/images/makhana-pouch-250g.jpg"
                    alt="NutyTales Premium Makhana Nitrogen Sealed Fresh Pouch"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-emerald-900/90 text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase shadow-xs">
                    Nitrogen Crisp Seal
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-[#0A1830] text-[#C9A45C] px-2 py-0.5 rounded-full text-[9px] font-bold font-mono">
                    Grade: 6 Suta Whole
                  </div>
                </div>
              )}

              {/* Mode 3: Original Offer Flyer (100% Uncropped with Enlarge Option) */}
              {activeMedia === 'poster' && (
                <div className="relative w-full h-full bg-[#0A1628] flex items-center justify-center">
                  <Image
                    src="/images/promo-makhana-899.png"
                    alt="NutyTales Premium Makhana Jumbo 6 Suta - ₹899 per kg only"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-[#0A1830]/95 backdrop-blur-md text-[#C9A45C] border border-[#C9A45C]/50 px-2 py-0.5 rounded-full shadow-lg text-[10px] font-bold font-mono tracking-wide z-10">
                    ₹899 / kg ONLY
                  </div>
                  {/* Enlarge Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsPosterModalOpen(true)}
                    className="absolute bottom-2.5 right-2.5 bg-[#17233B]/90 hover:bg-[#17233B] text-white backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full text-[9px] font-semibold flex items-center gap-1 shadow-md transition-all cursor-pointer z-10"
                  >
                    <span>🔍 Fullscreen Flyer</span>
                  </button>
                </div>
              )}

              {/* Mode 4: Lifestyle Roasted Bowl */}
              {activeMedia === 'bowl' && (
                <div className="relative w-full h-full bg-[#FAF7F2] flex items-center justify-center">
                  <Image
                    src="/images/hero-lifestyle-bowl.png"
                    alt="Bowl of crisp roasted makhana with ghee"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute bottom-2.5 left-2.5 bg-black/75 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] font-bold">
                    🥣 Crisp Cloud Crunch (0% Trans Fat)
                  </div>
                </div>
              )}
            </div>

            {/* 4 Culinary Recipe Chips (Compact Single Row, No Viewport Overflow) */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-0.5">
              <div className="bg-white/90 p-1.5 rounded-lg border border-stone-200/80 shadow-2xs">
                <span className="block font-bold text-stone-800">🥣 Roasted Ghee</span>
                <span className="text-[8.5px] text-stone-500">Pure Crunch</span>
              </div>
              <div className="bg-white/90 p-1.5 rounded-lg border border-stone-200/80 shadow-2xs">
                <span className="block font-bold text-stone-800">🍮 Kesar Kheer</span>
                <span className="text-[8.5px] text-stone-500">Royal Sweet</span>
              </div>
              <div className="bg-white/90 p-1.5 rounded-lg border border-stone-200/80 shadow-2xs">
                <span className="block font-bold text-stone-800">🍛 Curry &amp; Gravy</span>
                <span className="text-[8.5px] text-stone-500">Mithila Feast</span>
              </div>
              <div className="bg-white/90 p-1.5 rounded-lg border border-stone-200/80 shadow-2xs">
                <span className="block font-bold text-stone-800">🥗 Clean Snack</span>
                <span className="text-[8.5px] text-stone-500">High Protein</span>
              </div>
            </div>
          </div>

          {/* ──────────────── Right Column: Compact Buying Console (Fits 100% Above the Fold) ──────────────── */}
          <div className="lg:col-span-7 space-y-2.5">
            {/* Offer Callout Banner */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider">
                Special Introductory Offer · 40% OFF
              </span>
              <span className="text-[11px] font-semibold text-[#8B6D3B]">
                Mithila GI Harvest · Jumbo 6 Suta Whole
              </span>
            </div>

            {/* Product Title & Sensory Subtitle */}
            <div className="space-y-0.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight leading-tight">
                NutyTales Premium Makhana
              </h1>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                100% natural, sun-popped jumbo lotus seeds from Mithila. Rich in plant protein &amp; fibre, zero trans fats, and perfect for fasting (vrat), gym nutrition &amp; clean family snacking.
              </p>
            </div>

            {/* Integrated Price & In-Stock Status */}
            <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  ₹{totalMrp.toLocaleString('en-IN')}
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Save ₹{totalSavings.toLocaleString('en-IN')} ({savingsPercent}% OFF)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Fresh Harvest In Stock · Dispatches 24h</span>
              </div>
            </div>

            {/* Pack Size Selector Pills */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase tracking-wider text-[#17233B]">Select Pack Size:</span>
                <span className="text-stone-500 font-medium">Standard Price: ₹899 / kg</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PACK_OPTIONS.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx
                  return (
                    <button
                      key={pack.sizeG}
                      type="button"
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-1.5 sm:p-2 rounded-xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[#17233B] bg-[#17233B] text-white shadow-md'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {pack.badge && (
                        <span
                          className={`absolute -top-1.5 right-1.5 px-1.5 py-0.2 rounded text-[8px] font-bold ${
                            isSelected
                              ? 'bg-[#C9A45C] text-[#17233B]'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {pack.badge}
                        </span>
                      )}
                      <div className="font-bold text-[11px]">{pack.label}</div>
                      <div
                        className={`text-xs sm:text-sm font-bold font-mono mt-0.5 ${
                          isSelected ? 'text-[#C9A45C]' : 'text-[#17233B]'
                        }`}
                      >
                        ₹{pack.price}
                      </div>
                      <div
                        className={`text-[9px] line-through ${
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

            {/* ⚡ High-Converting Primary Action Cluster (Fully Above Fold) */}
            <div className="space-y-1.5 pt-0.5">
              <div className="flex items-stretch gap-2">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border-2 border-stone-200 bg-white rounded-xl px-2 py-1 w-22 shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="text-stone-500 hover:text-stone-900 font-bold text-base px-1 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="font-mono font-bold text-stone-900 text-xs sm:text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="text-stone-500 hover:text-stone-900 font-bold text-base px-1 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* 1-Click Buy Now Button */}
                <button
                  type="button"
                  onClick={handleInstantBuy}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#17233B] hover:bg-[#203050] text-[#F3E5C8] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer border border-[#C9A45C]/40"
                >
                  <span className="text-amber-400 animate-pulse">⚡</span>
                  <span>BUY NOW — INSTANT CHECKOUT</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={isAdding}
                  className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider border-2 border-stone-300 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>🛒</span>
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
              </div>

              {addedMessage && (
                <div className="p-1.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-xs font-bold text-center">
                  ✓ {addedMessage}
                </div>
              )}
            </div>

            {/* Delivery Pincode Checker & WhatsApp Direct Link */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs pt-0.5">
              <div className="sm:col-span-7 bg-white p-1.5 rounded-xl border border-stone-200/90 shadow-2xs">
                <form onSubmit={handleCheckPincode} className="flex items-center gap-1.5">
                  <span className="text-stone-400 text-xs">🚚</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Pincode (e.g. 110001)"
                    className="flex-1 py-0.5 px-2 rounded border border-stone-200 text-[11px] focus:outline-none focus:border-[#17233B]"
                  />
                  <button
                    type="submit"
                    className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[10px] transition cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p
                    className={`text-[9.5px] font-medium mt-0.5 ${
                      pincodeStatus.startsWith('✓') ? 'text-emerald-700' : 'text-amber-800'
                    }`}
                  >
                    {pincodeStatus}
                  </p>
                )}
              </div>

              <a
                href={`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:col-span-5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 p-1.5 rounded-xl border border-emerald-200 shadow-2xs flex items-center justify-center gap-1 font-bold text-[10px] sm:text-[11px] transition text-center"
              >
                <span>💬 Order on WhatsApp →</span>
              </a>
            </div>

            {/* Micro Trust Strip */}
            <div className="flex flex-wrap items-center justify-between gap-1 pt-1 text-[9.5px] text-stone-500 font-medium border-t border-stone-200/60">
              <span className="flex items-center gap-1">
                <span className="text-emerald-600 font-bold">✓</span> 100% Natural · Zero Preservatives
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-600 font-bold">✓</span> Cash on Delivery Available
              </span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-600 font-bold">✓</span> Free Shipping over ₹999
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Modal: Fullscreen Flyer / Recipe Chart (Option B Lightbox) ──────────────── */}
      {isPosterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsPosterModalOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-[#17233B]">NutyTales Official Promotional Spec Sheet</h3>
              <button
                type="button"
                onClick={() => setIsPosterModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100">
              <Image
                src="/images/promo-makhana-899.png"
                alt="NutyTales Premium Makhana Flyer"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-xs font-bold text-emerald-800">Special Introductory Offer: ₹899 / kg</span>
              <button
                type="button"
                onClick={() => {
                  setIsPosterModalOpen(false)
                  handleInstantBuy()
                }}
                className="py-2 px-4 rounded-xl bg-[#17233B] text-white font-bold text-xs uppercase hover:bg-[#203050] transition cursor-pointer"
              >
                Buy Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
