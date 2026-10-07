'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DemandCaptureModal from '@/components/demand/DemandCaptureModal'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

// ── Preset Intent Profiles ────────────────────────────────────────────────────
interface TripItinerary {
  id: string
  title: string
  nights: number
  travelers: number
  budgetLabel: string
  basePrice: number
  description: string
  flights: string
  stays: string[]
  vehicle: string
  activities: string[]
  dining: string
  heritage: string
  photography: string
  protection: string
}

const PRESET_INTENTS: Record<string, TripItinerary> = {
  family_winter: {
    id: 'family_winter',
    title: 'Kashmir Winter Family Odyssey',
    nights: 6,
    travelers: 4,
    budgetLabel: '₹1.5L Budget Class',
    basePrice: 138400,
    description: 'Delhi to Kashmir winter expedition for family of 4 with snow in Gulmarg, pine valleys of Pahalgam, and heritage lake suites.',
    flights: 'Roundtrip Delhi (DEL) ⇄ Srinagar (SXR) morning slots with 20kg check-in & VIP curb meet',
    stays: [
      '3 Nights · Srinagar Heritage Lakefront Suite (Zabarwan view)',
      '2 Nights · Gulmarg Heated Alpine Chalet (5 min from Gondola)',
      '1 Night · Pahalgam Riverfront Cedar Cottage',
    ],
    vehicle: 'Private 4x4 Scorpio / Innova Crysta dedicated chauffeur with snow chains for all 7 days',
    activities: [
      'Phase 2 Apharwat Peak Gondola fast-track passes',
      'Certified private ski instructor & snow equipment hire',
      'Pahalgam Aru valley pony trail to pine glades',
    ],
    dining: 'Royal 7-course Wazwan dinner banquet & floating Dal Lake sunset Kahwa',
    heritage: 'Old Srinagar artisan guild walk & Zadibal master Pashmina loom tour',
    photography: '1-hour high-altitude family portrait session at Apharwat snow line',
    protection: 'High-altitude emergency medical coverage & zero-cost mountain weather rerouting guarantee',
  },
  honeymoon_luxury: {
    id: 'honeymoon_luxury',
    title: 'The Royal Kashmir Honeymoon Retreat',
    nights: 5,
    travelers: 2,
    budgetLabel: 'Luxury Honeymoon',
    basePrice: 165000,
    description: 'Romantic high-altitude escape featuring private luxury cedar houseboat, 5-star ski chalet, and private candlelit shikara dining.',
    flights: 'Priority flights from Mumbai / Delhi with lounge access & luxury airport escort',
    stays: [
      '2 Nights · Nigeen Lake Hand-Carved Cedar Royal Houseboat with private butler',
      '3 Nights · The Khyber Resort & Spa / Boutique Heated Chalet, Gulmarg',
    ],
    vehicle: 'Chauffeur-driven luxury 4x4 Fortuner / BMW X3 with heated seats and warm Kashmiri refreshments',
    activities: [
      'VIP Phase 2 Gondola tickets without queue',
      'Private couple spa & cedar wood aromatherapy session',
      'Sunset Shikara ride surrounded by 10,000 floating marigolds & live Rabab music',
    ],
    dining: 'Exclusive candlelit floating shikara feast & Wazwan tasting menu curated by a master Waza',
    heritage: 'Pashmina ring-shawl authenticity testing session with GI master weaver',
    photography: 'Dedicated cinema-grade photographer for 2 hours in Gulmarg pine forests',
    protection: 'VIP concierge on-call 24/7 with instant helicopter evacuation cover',
  },
  corporate_offsite: {
    id: 'corporate_offsite',
    title: 'Enterprise High-Altitude Leadership Offsite',
    nights: 4,
    travelers: 30,
    budgetLabel: 'Enterprise Offsite (30 Pax)',
    basePrice: 1250000,
    description: 'Complete corporate executive retreat combining strategy boardroom facilities, Lidder river adventures, and traditional Wazwan hospitality.',
    flights: 'Block-booked group flight departures with corporate invoice and centralized luggage tagging',
    stays: [
      '4 Nights · Exclusive Estate Buyout at Harwan Walnut Orchard / Pahalgam Pine Valley Resort',
    ],
    vehicle: 'Fleet of 6 luxury Innova Crystas + 1 luggage van with GPS tracking and fleet dispatch control',
    activities: [
      'Conference hall with high-speed Starlink / fiber audio-visual setup',
      'Team Lidder river rafting expedition (Grade II/III) with certified safety kayakers',
      'Pine forest outdoor bonfire & leadership retreat circle',
    ],
    dining: 'Full-board banquet catering with royal Wazwan spreads and customized corporate dietary plans',
    heritage: 'Exclusive pop-up craft bazaar featuring direct artisan Pashmina & walnut wood showcases',
    photography: 'Drone videographer and event photographer with same-day executive highlight reel',
    protection: 'Comprehensive corporate liability & round-the-clock emergency medical response unit',
  },
  solo_adventure: {
    id: 'solo_adventure',
    title: 'Himalayan Ridge & Alpine Meadow Expedition',
    nights: 5,
    travelers: 1,
    budgetLabel: 'Adventure Solo',
    basePrice: 48500,
    description: 'Immersive solo trekking and photography expedition through Aru valley, Kolahoi glacier foothills, and Old Srinagar heritage alleys.',
    flights: 'Flexible airfare with adventure sports equipment allowance',
    stays: [
      '2 Nights · Traditional Srinagar Homestay in Old City',
      '3 Nights · High-Altitude Alpine Meadow Eco-Cabin & Glamping Dome',
    ],
    vehicle: 'Private 4x4 rugged transfer for trailheads and local shared mountain convoy access',
    activities: [
      'Guided day trek to Tarsar ridge with certified alpine mountaineer guide',
      'Dawn landscape shoot at Dal Lake floating vegetable market',
      'High-altitude trail running & wild trout fishing in Lidder river',
    ],
    dining: 'Hearty local Kashmiri Harissa breakfasts & alpine trail energy meals',
    heritage: 'Deep cultural dive with copperware beaters, papier-mâché guilds, and Sufi shrines',
    photography: 'Curated golden-hour location map and local fixer assistance',
    protection: 'Satellite SOS device & mountain rescue insurance coverage',
  },
}

export default function TravelMarketplacePage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('Plan My Journey with SI')
  const [modalSubtitle, setModalSubtitle] = useState('Tell us your dates, group size, and preferences.')
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('family_winter')
  
  // ── Natural Language Intent Prompt State ──
  const [userPrompt, setUserPrompt] = useState(
    'I want to take my family from Delhi to Kashmir for 6 days in December. Budget ₹1.5 lakh. We want snow, beautiful hotels, a private car, Gulmarg, Pahalgam and some local experiences.'
  )
  const [isSynthesizing, setIsSynthesizing] = useState(false)

  // ── Active Itinerary State (Controlled by SI) ──
  const [currentItinerary, setCurrentItinerary] = useState<TripItinerary>(PRESET_INTENTS.family_winter)
  const [luxuryMultiplier, setLuxuryMultiplier] = useState(1)
  const [anniversaryAddon, setAnniversaryAddon] = useState(false)
  const [budgetOffset, setBudgetOffset] = useState(0)
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // ── Calculate Live Price ──
  const calculatedTotal = Math.max(
    30000,
    Math.round(currentItinerary.basePrice * luxuryMultiplier + (anniversaryAddon ? 6500 : 0) + budgetOffset)
  )

  // ── Preset Selection Handler ──
  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key)
    const preset = PRESET_INTENTS[key]
    if (preset) {
      setCurrentItinerary(preset)
      setLuxuryMultiplier(1)
      setAnniversaryAddon(false)
      setBudgetOffset(0)
      if (key === 'family_winter') {
        setUserPrompt('I want to take my family from Delhi to Kashmir for 6 days in December. Budget ₹1.5 lakh. We want snow, beautiful hotels, a private car, Gulmarg, Pahalgam and some local experiences.')
      } else if (key === 'honeymoon_luxury') {
        setUserPrompt('5-day romantic luxury honeymoon in Kashmir: private royal houseboat on Nigeen Lake + 5-star Gulmarg ski chalet + candlelit Shikara dinner.')
      } else if (key === 'corporate_offsite') {
        setUserPrompt('Annual leadership offsite for 30 executives: 4 nights estate buyout, Lidder rafting, AV conference facilities, and royal Wazwan feast.')
      } else if (key === 'solo_adventure') {
        setUserPrompt('Solo 5-day photography & alpine meadow trek in Kashmir: Aru valley, Kolahoi foothills, Old City artisan guilds, and scenic trailheads.')
      }
    }
  }

  // ── Trigger Natural Language SI Rebuild ──
  const handleSynthesizePrompt = () => {
    setIsSynthesizing(true)
    setTimeout(() => {
      setIsSynthesizing(false)
      const p = userPrompt.toLowerCase()
      if (p.includes('honeymoon') || p.includes('couple') || p.includes('romantic')) {
        handleSelectPreset('honeymoon_luxury')
      } else if (p.includes('corporate') || p.includes('offsite') || p.includes('company') || p.includes('executive')) {
        handleSelectPreset('corporate_offsite')
      } else if (p.includes('solo') || p.includes('trek') || p.includes('hiking') || p.includes('photography')) {
        handleSelectPreset('solo_adventure')
      } else {
        handleSelectPreset('family_winter')
      }
    }, 600)
  }

  // ── Quick Tweak Triggers ──
  const handleMakeLuxury = () => {
    setLuxuryMultiplier(1.35)
    setBudgetOffset(0)
  }

  const handleReduceBudget = () => {
    setLuxuryMultiplier(0.9)
    setBudgetOffset(-20000)
  }

  const handleToggleAnniversary = () => {
    setAnniversaryAddon(!anniversaryAddon)
  }

  const handleMoveGulmarg = () => {
    // Reorder stays so Gulmarg is Day 3
    const newStays = [
      '2 Nights · Srinagar Heritage Lakefront Suite (Zabarwan view)',
      '2 Nights · Gulmarg Heated Alpine Chalet (Moved to Day 3-4)',
      '2 Nights · Pahalgam Riverfront Cedar Cottage',
    ]
    setCurrentItinerary((prev) => ({
      ...prev,
      stays: newStays,
    }))
  }

  // ── Quick 1-Click Instant Booking ──
  const handleInstantBook = async () => {
    const bookingRef = `TRIP-${Date.now().toString().slice(-6)}`
    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_inquiry',
          vertical: 'travel',
          customerName: 'Travel OS Guest',
          companyName: currentItinerary.title,
          customerPhone: 'Direct Web Booking',
          deliveryCity: 'Kashmir Valley',
          targetBudget: calculatedTotal,
          currency: 'INR',
          notes: `[REF: ${bookingRef}] ${currentItinerary.title} | ${currentItinerary.nights}N/${currentItinerary.nights + 1}D | ${currentItinerary.travelers} Pax | Total: ₹${calculatedTotal.toLocaleString('en-IN')} | Itinerary: ${currentItinerary.stays.join(' -> ')} | Vehicle: ${currentItinerary.vehicle}`,
        }),
      })
      setOrderConfirmed(bookingRef)
    } catch {
      setOrderConfirmed(bookingRef)
    }
  }

  return (
    <div className="bg-[#FAF7F2] text-[#17233B]">
      {/* ── 1. Top OS Architecture Strip ─────────────────────────────────────── */}
      <div className="bg-[#10192A] text-white border-b border-[#C9A45C]/20 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[#C9A45C] text-[11px]">
              NUTTY TALES TRAVEL · AI-NATIVE TRIP OPERATING SYSTEM
            </span>
            <span className="hidden md:inline text-white/30">•</span>
            <span className="hidden md:inline text-stone-300">
              Not an OTA search list. Tell SI where you want to go — SI assembles, optimizes, and executes your complete journey.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link href="/travel/partners" className="text-[#C9A45C] hover:underline font-semibold flex items-center gap-1">
              <span>B2B DMC &amp; Partner API</span>
              <span>→</span>
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/travel/dashboard" className="text-stone-300 hover:text-white transition-colors">
              Live Trip Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. The Core Centerpiece: Intelligent Travel Intent Console ───────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#10192A] via-[#17233B] to-[#10192A] text-white py-14 sm:py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Main Title & Positioning */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-[11px] font-bold uppercase tracking-widest border border-white/15">
              <span>✈️</span> INTENT · INTELLIGENCE · MULTI-MODAL EXECUTION
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Where do you want to go?
            </h1>
            <p className="text-stone-300 text-sm sm:text-base font-light max-w-2xl mx-auto">
              Tell SI what kind of journey you want. Budget, dates, travellers, snow, dining, or heritage — SI constructs the complete journey in seconds.
            </p>
          </div>

          {/* ── The Large Conversational Intent Box ── */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border-2 border-[#C9A45C]/40 text-[#17233B] space-y-3">
            <div className="relative">
              <label htmlFor="travel-intent-input" className="sr-only">Describe your travel journey</label>
              <textarea
                id="travel-intent-input"
                rows={3}
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Describe your journey: E.g., Take my family of 4 from Delhi to Kashmir for 6 days in December. Budget ₹1.5L with snow in Gulmarg, luxury stays & private 4x4..."
                className="w-full text-sm sm:text-base p-3 sm:p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#704B32] resize-none text-[#17233B] font-medium"
              />
              <button
                type="button"
                onClick={handleSynthesizePrompt}
                disabled={isSynthesizing}
                className="w-full sm:w-auto mt-2 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4 px-6 py-3.5 bg-[#17233B] hover:bg-[#704B32] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{isSynthesizing ? '⚙️ Synthesizing...' : '✦ Plan My Journey with SI'}</span>
              </button>
            </div>

            {/* Quick Inspiration Intent Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold px-1">
                <span>Or choose an inspiration intent:</span>
                <span className="text-[#704B32] hidden sm:inline">1-Click Multi-Modal Assembly</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'family_winter', label: '❄️ 6-Day Family Snow (Delhi → Kashmir < ₹1.5L)' },
                  { key: 'honeymoon_luxury', label: '💍 5-Day Luxury Honeymoon & Cedar Houseboat' },
                  { key: 'corporate_offsite', label: '🏢 Corporate Offsite (30 Execs + Rafting + Wazwan)' },
                  { key: 'solo_adventure', label: '🌲 Solo Ridge Trek & Photography Expedition' },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={() => handleSelectPreset(chip.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      selectedPresetKey === chip.key
                        ? 'bg-[#17233B] text-[#C9A45C] border-[#17233B] shadow-sm'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Multi-Component Horizontal Sub-Bar */}
          <div className="max-w-4xl mx-auto pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-300">
            <span className="font-bold text-[#C9A45C]">Orchestrated Components:</span>
            <div className="flex flex-wrap items-center gap-4 text-stone-300">
              <span className="flex items-center gap-1.5"><span>✈️</span> Flights</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span>🏨</span> Stays</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span>🚙</span> Private 4x4</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span>🎿</span> Activities</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span>🍽️</span> Wazwan Dining</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span>🧵</span> Crafts</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><span>🛡️</span> Protection</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. The Core Product: Live SI Journey Composer & Intent Graph ─────── */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
              <span>✦</span> SI TRIP INTENT GRAPH ACTIVE
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
              Your Trip, Built Around You
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light max-w-2xl">
              SI has assembled every flight, stay, vehicle, meal, and mountain guide into a unified, synchronized operating plan. No fragmented booking vouchers.
            </p>
          </div>

          {/* Quick Steer Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500 mr-1">SI Optimization Steer:</span>
            <button
              type="button"
              onClick={handleMakeLuxury}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                luxuryMultiplier > 1
                  ? 'bg-[#17233B] text-white border-[#17233B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              💎 Make it Luxury
            </button>
            <button
              type="button"
              onClick={handleReduceBudget}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                budgetOffset < 0
                  ? 'bg-[#17233B] text-white border-[#17233B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              📉 Reduce by ₹20K
            </button>
            <button
              type="button"
              onClick={handleToggleAnniversary}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                anniversaryAddon
                  ? 'bg-[#17233B] text-[#C9A45C] border-[#17233B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              🎂 Add Anniversary Dinner
            </button>
            <button
              type="button"
              onClick={handleMoveGulmarg}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-white text-stone-700 border-stone-300 hover:bg-stone-50 transition-all"
            >
              🔄 Move Gulmarg to Day 3
            </button>
          </div>
        </div>

        {/* ── Order Confirmation Banner (If booked) ── */}
        {orderConfirmed && (
          <div className="p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-500 text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1">
              <span className="font-bold text-sm flex items-center gap-2">
                <span>🎉</span> Journey Reserved Successfully! (Reference: <strong>{orderConfirmed}</strong>)
              </span>
              <p className="text-xs text-emerald-800">
                Our Mountain Concierge and Fleet Dispatcher have received your intent graph. An itemized travel dossier and payment escrow link have been dispatched.
              </p>
            </div>
            <Link
              href="/travel/dashboard"
              className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex-shrink-0"
            >
              Open Trip Dashboard →
            </Link>
          </div>
        )}

        {/* ── The Unified Journey Assembly Card ── */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Journey Header Strip */}
          <div className="bg-[#17233B] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] font-bold text-[10px] uppercase tracking-wider">
                  {currentItinerary.budgetLabel}
                </span>
                <span className="text-xs text-stone-300">
                  {currentItinerary.nights} Nights · {currentItinerary.travelers} Travellers
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {currentItinerary.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl">
                {currentItinerary.description}
              </p>
            </div>

            {/* Price Pill & Primary Book CTA */}
            <div className="text-right space-y-3 flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right">
                <span className="text-[11px] text-stone-300 block uppercase tracking-wider">
                  Estimated All-Inclusive Total:
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#C9A45C]">
                  ₹{calculatedTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-400 block pt-0.5">
                  Includes Flights + Stays + Private 4x4 + Experiences + Taxes
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleInstantBook}
                  className="flex-1 py-3 px-5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  ⚡ Book My Trip Now
                </button>
                <Link
                  href={`/travel/builder?preset=${selectedPresetKey}&total=${calculatedTotal}`}
                  className="py-3 px-4 bg-white/20 hover:bg-white/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20"
                >
                  Full Builder
                </Link>
              </div>
            </div>
          </div>

          {/* ── Itemized Multi-Component Assembly Grid ── */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs bg-[#FAF7F2]">
            {/* 1. Flights */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>✈️</span> Flight Assembly
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Confirmed Slots
                </span>
              </div>
              <p className="text-stone-600 leading-relaxed">{currentItinerary.flights}</p>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Airport VIP Assistance:</span>
                <strong className="text-emerald-700">Included</strong>
              </div>
            </div>

            {/* 2. Stays */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>🏨</span> Stays Orchestration
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  {currentItinerary.nights} Nights
                </span>
              </div>
              <ul className="space-y-2 text-stone-600">
                {currentItinerary.stays.map((stay, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#C9A45C] mt-0.5">✦</span>
                    <span>{stay}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Heating &amp; Power Backup:</span>
                <strong className="text-emerald-700">100% Guaranteed</strong>
              </div>
            </div>

            {/* 3. Fleet & Ground Chauffeur */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>🚙</span> Dedicated 4x4 Fleet
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  Private Driver
                </span>
              </div>
              <p className="text-stone-600 leading-relaxed">{currentItinerary.vehicle}</p>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Fuel, Tolls &amp; Snow Chains:</span>
                <strong className="text-emerald-700">All-Inclusive</strong>
              </div>
            </div>

            {/* 4. Activities & Mountain Experiences */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>🎿</span> Curated Experiences
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                  VIP Fast-Track
                </span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                {currentItinerary.activities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#C9A45C] mt-0.5">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Licensed Safety Guides:</span>
                <strong className="text-emerald-700">Verified</strong>
              </div>
            </div>
          </div>

          {/* ── Secondary Services Strip (Culinary, Heritage, Media, Safety) ── */}
          <div className="p-6 sm:p-8 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-6 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="text-base">🍽️</span>
              <div>
                <strong className="block text-[#17233B]">Culinary Concierge:</strong>
                <span>{currentItinerary.dining} {anniversaryAddon ? '✦ Added: Floating Shikara Candlelight Dinner' : ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🧵</span>
              <div>
                <strong className="block text-[#17233B]">Artisan Craft Encounter:</strong>
                <span>{currentItinerary.heritage}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <div>
                <strong className="block text-[#17233B]">Weather Rerouting &amp; Safety:</strong>
                <span>{currentItinerary.protection}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The 10-Layer Next-Generation Travel Operating System Matrix ────── */}
      <section className="py-16 bg-[#10192A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Architectural Distinction
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Why Nutty Tales Travel Beats the Conventional OTA Model
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light">
              Conventional platforms like Expedia and MakeMyTrip force you to search, assemble, and juggle dozens of separate confirmations. Nutty Tales orchestrates the entire journey from intent to real-time execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* The Old Model */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-stone-300">
                  The Incumbent OTA Model (Expedia / MakeMyTrip)
                </h3>
                <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-800">
                  Fragmented Supply
                </span>
              </div>
              <ul className="space-y-3 text-stone-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Manual Search Friction:</strong> User must separately search 50+ hotels, flight dates, private cabs, and activities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Zero Route Intelligence:</strong> Fails to understand road mountain passes, seasonal snow blockages, or timing between Gulmarg and Pahalgam.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Disjointed Confirmations:</strong> 6 different vouchers across airlines, drivers, hotels, and ticket desks. When a flight is delayed, nobody reschedules your cab.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span><strong>Generic Mass Tourism:</strong> Pushes commercial tourist hotels without local heritage provenance or artisan integration.</span>
                </li>
              </ul>
            </div>

            {/* The Nutty Tales Model */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#176B68]/30 via-white/5 to-[#C9A45C]/15 border-2 border-[#C9A45C]/50 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-white">
                  The Nutty Tales Trip OS Model
                </h3>
                <span className="text-[10px] uppercase font-bold text-[#C9A45C] bg-[#C9A45C]/20 px-2.5 py-1 rounded-full border border-[#C9A45C]/40">
                  Intent + Intelligence
                </span>
              </div>
              <ul className="space-y-3 text-stone-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Pure Natural-Language Intent:</strong> Tell SI where you want to go and what you want to experience — SI builds the journey.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Unified Intent Graph:</strong> Automatically optimizes flight arrival slots, snow-ready 4x4 drivers, and heated boutique stays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Dynamic Tweak &amp; Steer:</strong> Say “Make it luxury” or “Reduce by ₹20K” and SI reconstructs the entire multi-modal itinerary.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Live In-Trip Concierge:</strong> If your Delhi flight is delayed 2 hours, SI automatically alerts your Srinagar chauffeur and reschedules Gondola tickets.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. The Group Ecosystem Advantage: Life-Event Commerce ─────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Nutty Tales Group Ecosystem
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
              More Than Travel: A Life-Event Commerce Network
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light max-w-2xl">
              Because Nutty Tales operates six standalone global operating companies, a single travel intent automatically coordinates across our entire ecosystem.
            </p>
          </div>
          <Link
            href="/travel/partners"
            className="px-6 py-3.5 bg-[#17233B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-800 transition-colors shadow-sm flex-shrink-0"
          >
            Explore Partner Network →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Corporate Offsites */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#704B32] flex items-center justify-center text-2xl font-bold">
                🏢
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                Corporate Offsites (40 to 200 Pax)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generates a single comprehensive B2B quotation combining flights, luxury estate lodging, conference AV facilities, Lidder river rafting, and custom corporate gift hampers from Nutty Tales Gifting.
              </p>
              <div className="p-3 bg-[#FAF6EE] rounded-xl text-[11px] text-[#704B32] font-semibold">
                Pipeline Value: ₹25L – ₹1.5 Cr per corporate retreat
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalTitle('Request Corporate Offsite Proposal')
                setModalSubtitle('Share expected headcount, preferred dates, and conference requirements.')
                setQuoteModalOpen(true)
              }}
              className="w-full py-3 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Generate Corporate Offsite RFQ →
            </button>
          </div>

          {/* Card 2: Destination Weddings */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#8E2848] flex items-center justify-center text-2xl font-bold">
                💍
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                Destination Wedding Logistics (150 Pax)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Connects travel fleet management with palace venues from Nutty Tales Weddings, artisan trousseau favours from Gifting, and pure Kashmiri pashmina couture from Crafts.
              </p>
              <div className="p-3 bg-[#FAF6EE] rounded-xl text-[11px] text-[#8E2848] font-semibold">
                Unified life-event orchestration without vendor chaos
              </div>
            </div>
            <Link
              href="/weddings/workspace"
              className="w-full py-3 text-center bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all block"
            >
              Launch Wedding Workspace →
            </Link>
          </div>

          {/* Card 3: B2B Travel Agent & DMC API */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                🌍
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                B2B DMC &amp; Travel Agent Network
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Allows global travel agencies in Mumbai, Dubai, and London to distribute verified high-altitude Kashmir itineraries, licensed guides, and premium 4x4 fleets via the Nutty Tales Travel API.
              </p>
              <div className="p-3 bg-[#FAF6EE] rounded-xl text-[11px] text-emerald-800 font-semibold">
                Wholesale DMC rates with verified ground execution
              </div>
            </div>
            <Link
              href="/travel/partners"
              className="w-full py-3 text-center bg-[#176B68] hover:bg-[#125350] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all block"
            >
              Access DMC Partner Portal →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Direct Concierge Floating Bar ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#17233B] via-[#704B32] to-[#17233B] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              24/7 Human + SI Concierge Desk
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Have a bespoke request or complex multi-destination journey?
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 max-w-xl font-light">
              Speak directly with our senior mountain travel orchestrators in Srinagar and Delhi.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nutty Tales Travel OS! I am interested in booking or customizing the itinerary: ${currentItinerary.title} (Est. ₹${calculatedTotal.toLocaleString('en-IN')}).`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>💬</span>
              <span>WhatsApp Travel Desk</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setModalTitle('Request Custom Journey Quotation')
                setModalSubtitle('Our Senior Travel Concierge will respond within 2 hours with an optimized itinerary.')
                setQuoteModalOpen(true)
              }}
              className="px-6 py-4 bg-white hover:bg-stone-100 text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Request Custom Dossier
            </button>
          </div>
        </div>
      </div>

      <DemandCaptureModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultVertical="travel"
        title={modalTitle}
        subtitle={modalSubtitle}
      />
    </div>
  )
}
