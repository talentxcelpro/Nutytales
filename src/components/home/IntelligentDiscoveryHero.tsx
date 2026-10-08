'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { parseCustomerIntent, IntentResolution } from '@/lib/marketplace-graph'
import { formatGlobalPrice } from '@/lib/global-config'

const ROTATING_PROMPTS = [
  'Find a private villa in Kashmir',
  'Source premium walnuts for your business',
  'Create a luxury corporate gift',
  'Plan a destination wedding',
  'Discover authentic Himalayan crafts',
  'Plan a 10-day luxury journey',
]

const QUICK_EXPLORE_DOORS = [
  { label: 'Shop Gourmet', icon: '🌰', href: '/shop', sub: 'Single-origin dry fruits & saffron' },
  { label: 'Curated Stays', icon: '🏡', href: '/stays', sub: 'Orchard villas & houseboats' },
  { label: 'Travel Expeditions', icon: '🏔️', href: '/travel', sub: 'Alpine journeys & heli-ski' },
  { label: 'Bespoke Gifting', icon: '🎁', href: '/gifting', sub: 'Corporate & personal keepsakes' },
  { label: 'Heritage Crafts', icon: '🪡', href: '/crafts', sub: 'Pashmina, woodcarvings & rugs' },
  { label: 'Royal Weddings', icon: '💍', href: '/weddings', sub: 'Venues, trousseau & guest favours' },
  { label: 'B2B Sourcing', icon: '📦', href: '/b2b', sub: 'Bulk procurement & export contracts' },
]

export default function IntelligentDiscoveryHero() {
  const [promptIndex, setPromptIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeIntent, setActiveIntent] = useState<IntentResolution | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Rotate placeholder prompt every 3.5 seconds when user hasn't typed
  useEffect(() => {
    if (searchQuery.trim()) return
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % ROTATING_PROMPTS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [searchQuery])

  // Run intent resolution when search query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      const resolved = parseCustomerIntent(searchQuery)
      setActiveIntent(resolved)
    } else {
      setActiveIntent(null)
    }
  }, [searchQuery])

  const handleSelectPrompt = (prompt: string) => {
    setSearchQuery(prompt)
  }

  return (
    <section className="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-center items-center bg-[#FDFBF7] text-[#17233B] px-4 sm:px-6 lg:px-8 pt-28 pb-20 overflow-hidden">
      {/* Background Subtle Gradient & Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#17233B_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-amber-100/40 via-stone-100/30 to-emerald-50/30 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full text-center space-y-8 relative z-10">
        {/* Subtle Brand Positioning Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#17233B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C] animate-pulse" />
          <span>The Global Marketplace Platform</span>
        </div>

        {/* Master Vision Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17233B] leading-[1.08]">
            A world of products, places, experiences and possibilities.
          </h1>
          <p className="text-base sm:text-xl text-stone-600 font-light max-w-2xl mx-auto leading-relaxed">
            One intelligent digital ecosystem connecting global travelers, patrons, artisans, growers, luxury hosts, and corporate buyers.
          </p>
        </div>

        {/* ── Central Doorway: Intelligent Discovery Bar ── */}
        <div className="max-w-3xl mx-auto w-full space-y-4">
          <div className="relative bg-white rounded-3xl border-2 border-stone-200/90 shadow-xl focus-within:border-[#17233B] focus-within:ring-4 focus-within:ring-[#17233B]/5 transition-all p-2 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-3 pl-4 w-full">
              <span className="text-xl text-stone-400">✨</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Try: "${ROTATING_PROMPTS[promptIndex]}"`}
                className="w-full py-3.5 text-sm sm:text-base text-[#17233B] placeholder-stone-400 focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-stone-400 hover:text-stone-700 px-2 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <Link
              href={searchQuery.trim() ? `/search?q=${encodeURIComponent(searchQuery)}` : '/search'}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#17233B] hover:bg-[#203050] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore</span>
              <span>→</span>
            </Link>
          </div>

          {/* Dynamic Example Prompts */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold">Suggested Inquiries:</span>
            {ROTATING_PROMPTS.slice(0, 4).map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPrompt(p)}
                className="px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-stone-400 hover:text-[#17233B] transition shadow-2xs text-xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── Visual Intelligence Demonstration (SI Concierge Resolution) ── */}
        {activeIntent && (
          <div className="max-w-3xl mx-auto w-full bg-[#10192A] text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/10 space-y-4 animate-in fade-in duration-300 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#10192A] text-[10px] font-bold uppercase tracking-wider">
                  Nuty Tales Intelligence (SI)
                </span>
                <span className="text-xs text-stone-400 font-mono">Orchestration Active</span>
              </div>
              <Link
                href={activeIntent.suggestedAction.href}
                className="text-xs text-[#C9A45C] hover:underline font-bold"
              >
                {activeIntent.suggestedAction.label} →
              </Link>
            </div>

            {/* Step-by-step Visual Intent Breakdown */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-white/10 text-stone-300">
                INTENT: <strong className="text-white capitalize">{activeIntent.parsedVerticals.join(' & ')}</strong>
              </span>
              {activeIntent.guestCountOrQuantity && (
                <span className="px-2 py-1 rounded bg-white/10 text-stone-300">
                  VOLUME: <strong className="text-white">{activeIntent.guestCountOrQuantity} Units</strong>
                </span>
              )}
              {activeIntent.budgetMaxINR && (
                <span className="px-2 py-1 rounded bg-white/10 text-stone-300">
                  BUDGET: <strong className="text-white">{formatGlobalPrice(activeIntent.budgetMaxINR, 'INR')}</strong>
                </span>
              )}
              {activeIntent.location && (
                <span className="px-2 py-1 rounded bg-white/10 text-stone-300">
                  DESTINATION: <strong className="text-white">{activeIntent.location}</strong>
                </span>
              )}
            </div>

            {/* Recommended Items Quick Carousel */}
            {activeIntent.recommendedItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {activeIntent.recommendedItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition block space-y-1.5 group"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="font-bold text-xs text-white truncate">{item.title}</p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-400 capitalize">{item.vertical}</span>
                      <span className="font-serif font-bold text-[#C9A45C]">
                        {formatGlobalPrice(item.priceINR, 'INR')}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── The 6 Vertical Doors ── */}
        <div className="pt-6 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold block">
            Six Doors into One Connected Platform
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {QUICK_EXPLORE_DOORS.map((door) => (
              <Link
                key={door.href}
                href={door.href}
                className="p-4 bg-white hover:bg-stone-50 rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-md transition-all text-center space-y-1 group"
              >
                <span className="text-2xl block group-hover:scale-110 transition-transform">
                  {door.icon}
                </span>
                <p className="font-bold text-xs text-[#17233B] group-hover:text-amber-800 transition">
                  {door.label}
                </p>
                <p className="text-[10px] text-stone-500 line-clamp-1 font-light leading-tight">
                  {door.sub}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
