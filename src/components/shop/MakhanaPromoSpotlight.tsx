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
        image: '/images/promo-makhana-899.webp',
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
        image: '/images/promo-makhana-899.webp',
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
    <section className="relative bg-gradient-to-b from-[#FAF8F5] via-[#FDFBF7] to-white border-b border-stone-200/80 pt-24 sm:pt-28 pb-6 sm:pb-8 overflow-hidden">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[250px] bg-amber-100/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Slimline Trust Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-3 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-[#17233B] tracking-tight uppercase text-[11px] sm:text-xs">
              NutyTales · Mithila Wetland Harvest
            </span>
            <span className="text-stone-300 hidden sm:inline">•</span>
            <span className="text-stone-500 font-normal text-xs hidden sm:inline">
              FSSAI Lic. #{FSSAI_NUMBER}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
            <span className="text-emerald-700 font-semibold">★ 4.9 Rating (2,400+ Verified Orders)</span>
            <span className="text-stone-300">•</span>
            <span className="text-[#8B6D3B] font-medium">Pan-India Express Air Shipping</span>
          </div>
        </div>

        {/* Main Split Grid: Cinema Stage + Buying Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* ──────────────── Left Column: Cinema Media Showcase (Zero Cropping, Crisp Presentation) ──────────────── */}
          <div className="lg:col-span-5 space-y-2.5">
            {/* Media Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={handlePlayVideo}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'video'
                    ? 'bg-[#17233B] text-emerald-400 shadow-xs ring-1 ring-black/10'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80'
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
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'pouch'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80'
                }`}
              >
                <span>📦</span>
                <span>Studio Pack</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMedia('poster')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'poster'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80'
                }`}
              >
                <span>📜</span>
                <span>Offer Flyer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMedia('bowl')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  activeMedia === 'bowl'
                    ? 'bg-[#17233B] text-[#C9A45C] shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80'
                }`}
              >
                <span>🥣</span>
                <span>Lifestyle</span>
              </button>
            </div>

            {/* Main Media Stage (16:10 Ratio, max-h 315px, object-contain to PREVENT ANY CROPPING) */}
            <div className="relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] max-h-[315px] w-full rounded-2xl overflow-hidden shadow-xs border border-stone-200/80 bg-black group transition-all flex items-center justify-center">
              {/* Mode 1: HD Cinematic Video Player (Object-Contain so 100% of text and image is visible!) */}
              {activeMedia === 'video' && (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src="/videos/makhana-showcase.mp4"
                    poster="/images/promo-makhana-899.webp"
                    autoPlay
                    playsInline
                    loop
                    muted={isMuted}
                    controls
                    className="w-full h-full object-contain bg-black"
                  />
                  {/* Floating HD Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 pointer-events-none z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>Live HD Video</span>
                  </div>
                  {/* Sound Toggle Button */}
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all shadow-xs z-10 cursor-pointer"
                  >
                    <span>{isMuted ? '🔇 Sound Off' : '🔊 Sound On'}</span>
                  </button>
                  {/* Corner Ribbon */}
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-[#F3E5C8] border border-white/20 px-3 py-1 rounded-full shadow-xs text-[11px] font-bold font-mono tracking-wide z-10">
                    ₹899 / kg ONLY
                  </div>
                </div>
              )}

              {/* Mode 2: Clean Studio Pouch Shot */}
              {activeMedia === 'pouch' && (
                <div className="relative w-full h-full bg-[#FAF7F2] flex items-center justify-center p-3">
                  <Image
                    src="/images/makhana-pouch-250g.webp"
                    alt="NutyTales Premium Makhana Nitrogen Sealed Fresh Pouch"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-900/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs">
                    Nitrogen Crisp Seal
                  </div>
                  <div className="absolute top-3 right-3 bg-[#0A1830] text-[#C9A45C] px-2.5 py-1 rounded-full text-[10px] font-bold font-mono">
                    Grade: 6 Suta Whole
                  </div>
                </div>
              )}

              {/* Mode 3: Original Offer Flyer (100% Uncropped with Enlarge Option) */}
              {activeMedia === 'poster' && (
                <div className="relative w-full h-full bg-[#0A1628] flex items-center justify-center">
                  <Image
                    src="/images/promo-makhana-899.webp"
                    alt="NutyTales Premium Makhana Jumbo 6 Suta - ₹899 per kg only"
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                  <div className="absolute top-3 right-3 bg-[#0A1830]/95 backdrop-blur-md text-[#C9A45C] border border-[#C9A45C]/50 px-3 py-1 rounded-full shadow-xs text-[11px] font-bold font-mono tracking-wide z-10">
                    ₹899 / kg ONLY
                  </div>
                  {/* Enlarge Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsPosterModalOpen(true)}
                    className="absolute bottom-3 right-3 bg-[#17233B]/90 hover:bg-[#17233B] text-white backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer z-10"
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
                  <div className="absolute bottom-3 left-3 bg-black/75 text-white backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold">
                    🥣 Crisp Cloud Crunch (0% Trans Fat)
                  </div>
                </div>
              )}
            </div>

            {/* 4 Culinary Recipe Chips (Crisp Apple Style Cards) */}
            <div className="grid grid-cols-4 gap-2 text-center pt-1.5">
              <div className="bg-white/80 hover:bg-white p-2 rounded-xl border border-stone-200/70 shadow-2xs hover:shadow-xs transition-all">
                <span className="block font-semibold text-stone-800 text-[11px]">🥣 Roasted Ghee</span>
                <span className="text-[9.5px] text-stone-500 mt-0.5 block">Pure Crunch</span>
              </div>
              <div className="bg-white/80 hover:bg-white p-2 rounded-xl border border-stone-200/70 shadow-2xs hover:shadow-xs transition-all">
                <span className="block font-semibold text-stone-800 text-[11px]">🍮 Kesar Kheer</span>
                <span className="text-[9.5px] text-stone-500 mt-0.5 block">Royal Sweet</span>
              </div>
              <div className="bg-white/80 hover:bg-white p-2 rounded-xl border border-stone-200/70 shadow-2xs hover:shadow-xs transition-all">
                <span className="block font-semibold text-stone-800 text-[11px]">🍛 Curry &amp; Gravy</span>
                <span className="text-[9.5px] text-stone-500 mt-0.5 block">Mithila Feast</span>
              </div>
              <div className="bg-white/80 hover:bg-white p-2 rounded-xl border border-stone-200/70 shadow-2xs hover:shadow-xs transition-all">
                <span className="block font-semibold text-stone-800 text-[11px]">🥗 Clean Snack</span>
                <span className="text-[9.5px] text-stone-500 mt-0.5 block">High Protein</span>
              </div>
            </div>
          </div>

          {/* ──────────────── Right Column: Compact Buying Console (Apple-Grade Typography & Spacing) ──────────────── */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            {/* Offer Callout Banner */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-bold uppercase tracking-wider">
                Special Introductory Offer · 40% OFF
              </span>
              <span className="text-xs font-medium text-stone-500">
                Mithila GI Harvest · Jumbo 6 Suta Whole
              </span>
            </div>

            {/* Product Title & Sensory Subtitle */}
            <div className="space-y-1">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#17233B] tracking-tight leading-tight">
                NutyTales Premium Makhana
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                100% natural, sun-popped jumbo lotus seeds from Mithila. Rich in plant protein &amp; fibre, zero trans fats, and perfect for fasting (vrat), gym nutrition &amp; clean family snacking.
              </p>
            </div>

            {/* Integrated Price & In-Stock Status */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-baseline gap-2.5">
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#17233B] tracking-tight">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-stone-400 line-through font-normal">
                  ₹{totalMrp.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/70 text-[11px] font-semibold">
                  Save ₹{totalSavings.toLocaleString('en-IN')} ({savingsPercent}% OFF)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/60 px-2.5 py-1 rounded-full border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Fresh Harvest In Stock · Dispatches 24h</span>
              </div>
            </div>

            {/* Pack Size Selector Pills */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-[#17233B]">Select Pack Size:</span>
                <span className="text-stone-500 font-medium">Standard Price: ₹899 / kg</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {PACK_OPTIONS.map((pack, idx) => {
                  const isSelected = selectedPackIndex === idx
                  return (
                    <button
                      key={pack.sizeG}
                      type="button"
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                        isSelected
                          ? 'border-[#17233B] bg-[#17233B] text-white shadow-xs ring-1 ring-[#17233B]'
                          : 'border-stone-200/90 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs'
                      }`}
                    >
                      {pack.badge && (
                        <span
                          className={`absolute -top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide shadow-2xs ${
                            isSelected
                              ? 'bg-[#C9A45C] text-[#17233B]'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {pack.badge}
                        </span>
                      )}
                      <div className="font-semibold text-xs">{pack.label}</div>
                      <div
                        className={`text-base font-bold font-sans mt-1 ${
                          isSelected ? 'text-[#F3E5C8]' : 'text-[#17233B]'
                        }`}
                      >
                        ₹{pack.price}
                      </div>
                      <div
                        className={`text-[10px] line-through mt-0.5 ${
                          isSelected ? 'text-white/50' : 'text-stone-400'
                        }`}
                      >
                        ₹{pack.mrp}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ⚡ High-Converting Primary Action Cluster */}
            <div className="space-y-2 pt-0.5">
              <div className="flex items-stretch gap-2.5">
                {/* Quantity Stepper */}
                <div className="flex items-center justify-between border border-stone-200/90 bg-white rounded-xl px-2 h-12 w-24 shrink-0 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-medium text-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="font-sans font-bold text-stone-900 text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 font-medium text-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* 1-Click Buy Now Button */}
                <button
                  type="button"
                  onClick={handleInstantBuy}
                  className="flex-1 h-12 px-5 rounded-xl bg-[#17233B] hover:bg-[#203050] text-[#F3E5C8] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-2 group cursor-pointer border border-[#C9A45C]/35 active:scale-[0.99]"
                >
                  <span className="text-amber-400">⚡</span>
                  <span>BUY NOW — INSTANT CHECKOUT</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={isAdding}
                  className="h-12 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider border border-stone-300 transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-[0.99]"
                >
                  <span>🛒</span>
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
              </div>

              {addedMessage && (
                <div className="p-2 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs font-semibold text-center">
                  ✓ {addedMessage}
                </div>
              )}
            </div>

            {/* Delivery Pincode Checker & WhatsApp Direct Link */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs pt-0.5">
              <div className="sm:col-span-7 bg-white p-2 rounded-xl border border-stone-200/90 shadow-2xs">
                <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                  <span className="text-stone-400 text-xs">🚚</span>
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Pincode (e.g. 110001)"
                    className="flex-1 py-1 px-2.5 rounded-lg border border-stone-200 text-xs focus:outline-none focus:border-[#17233B] focus:ring-1 focus:ring-[#17233B]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p
                    className={`text-[10px] font-medium mt-1 ${
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
                className="sm:col-span-5 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 p-2 rounded-xl border border-emerald-200 shadow-2xs flex items-center justify-center gap-1.5 font-bold text-xs transition-all text-center"
              >
                <span>💬 Order on WhatsApp →</span>
              </a>
            </div>

            {/* Micro Trust Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-xs text-stone-500 font-medium border-t border-stone-200/60">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> 100% Natural · Zero Preservatives
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span> Cash on Delivery Available
              </span>
              <span className="flex items-center gap-1.5">
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
                src="/images/promo-makhana-899.webp"
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
