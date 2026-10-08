'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  getAllMarketplaceItems,
  parseCustomerIntent,
  MarketplaceItem,
  IntentResolution,
} from '@/lib/marketplace-graph'
import { PlatformVertical } from '@/lib/platform-core'
import { formatGlobalPrice, CurrencyCode, SUPPORTED_CURRENCIES } from '@/lib/global-config'
import { trackRevenueEvent } from '@/lib/revenue-os'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const initialVertical = (searchParams.get('vertical') as PlatformVertical) || 'all'

  const [query, setQuery] = useState(initialQuery)
  const [selectedVertical, setSelectedVertical] = useState<string>(initialVertical)
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR')
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(0) // 0 = no limit

  const allItems = useMemo(() => getAllMarketplaceItems(), [])

  // Natural language intent detection
  const intent: IntentResolution | null = useMemo(() => {
    if (!query.trim()) return null
    return parseCustomerIntent(query)
  }, [query])

  // Track search query telemetry on debounce
  useEffect(() => {
    if (!query.trim()) return
    const timeout = setTimeout(() => {
      trackRevenueEvent({
        type: 'SEARCH',
        vertical: (selectedVertical === 'all' ? 'discovery' : selectedVertical) as PlatformVertical,
        countryCode: 'IN',
        currency: selectedCurrency,
        searchQuery: query,
        valueINR: 0,
        commissionINR: 0,
      })
    }, 800)
    return () => clearTimeout(timeout)
  }, [query, selectedVertical, selectedCurrency])

  // Filter items
  const filteredItems = useMemo(() => {
    let result = allItems

    // 1. Vertical filter
    if (selectedVertical !== 'all') {
      result = result.filter((item) => item.vertical === selectedVertical)
    }

    // 2. Text query matching
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.vertical.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          item.badges.some((b) => b.toLowerCase().includes(q))
        )
      })
    }

    // 3. Price max filter
    if (maxPriceFilter > 0) {
      result = result.filter((item) => item.priceINR <= maxPriceFilter)
    }

    return result
  }, [allItems, selectedVertical, query, maxPriceFilter])

  const suggestedQueries = [
    { label: 'Corporate Diwali gifts under ₹2,000', q: 'corporate gifting hampers under 2000' },
    { label: 'Authentic GI Pashmina Shawls', q: 'handwoven pashmina shawl' },
    { label: 'Luxury Dal Lake Houseboats', q: 'dal lake houseboat stay' },
    { label: 'Gulmarg Ski Expeditions', q: 'gulmarg ski travel package' },
    { label: 'Wholesale Mongra Saffron 10kg', q: 'wholesale bulk mongra saffron' },
    { label: 'Destination Wedding Favors', q: 'wedding return gifts favors' },
  ]

  const verticalsList: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Verticals', icon: '🌐' },
    { id: 'gifting', label: 'Taste & Gifting', icon: '🎁' },
    { id: 'crafts', label: 'Pashmina & Crafts', icon: '🪡' },
    { id: 'stays', label: 'Boutique Stays', icon: '🏡' },
    { id: 'travel', label: 'Travel Expeditions', icon: '🏔️' },
    { id: 'weddings', label: 'Weddings & Favors', icon: '💍' },
    { id: 'business', label: 'Wholesale & B2B', icon: '📦' },
  ]

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B] pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ── Search Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold tracking-wider uppercase text-[#17233B]">
            <span>🔍</span> Nuty Tales Unified Commercial Search
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
            Search the Global Marketplace
          </h1>
          <p className="text-stone-600 text-sm sm:text-base">
            Find gourmet dry fruits, artisan pashmina shawls, boutique heritage stays, ski expeditions, and wholesale sourcing.
          </p>
        </div>

        {/* ── Main Search Input Bar ── */}
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="relative flex items-center bg-white rounded-2xl border-2 border-stone-200 focus-within:border-[#17233B] shadow-md overflow-hidden transition">
            <span className="pl-5 text-xl text-stone-400">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, stays, pashmina, wedding favors, travel or type 'under ₹2,000'..."
              className="w-full py-4 px-4 text-sm sm:text-base text-[#17233B] placeholder-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="pr-4 text-stone-400 hover:text-stone-600 font-bold text-sm"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Try:</span>
            {suggestedQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => setQuery(sq.q)}
                className="text-xs bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 px-3 py-1 rounded-full transition shadow-sm"
              >
                {sq.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Intent Resolver Box (If user query contains commercial intent) ── */}
        {intent && query.trim().length > 3 && (
          <div className="max-w-4xl mx-auto bg-[#17233B] text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#C9A45C] text-[#17233B] text-[10px] font-bold uppercase tracking-wider">
                <span>🧠</span> System Intelligence Intent Match
              </div>
              <p className="text-sm font-medium text-stone-200">
                Identified Commercial Intent:{' '}
                <strong className="text-white capitalize">
                  {intent.parsedVerticals.join(' & ')}
                </strong>
                {intent.location && ` in ${intent.location}`}
                {intent.budgetMaxINR && ` (Budget cap: ₹${intent.budgetMaxINR.toLocaleString()})`}
              </p>
            </div>
            <Link
              href={intent.suggestedAction.href}
              className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#d6b26d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition whitespace-nowrap shadow"
            >
              {intent.suggestedAction.label} →
            </Link>
          </div>
        )}

        {/* ── Controls Strip: Vertical Tabs + Currency + Price Filter ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-200 pb-5">
          {/* Vertical Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {verticalsList.map((vert) => (
              <button
                key={vert.id}
                onClick={() => setSelectedVertical(vert.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  selectedVertical === vert.id
                    ? 'bg-[#17233B] text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                <span>{vert.icon}</span>
                <span>{vert.label}</span>
              </button>
            ))}
          </div>

          {/* Right Controls: Currency Selector & Price Filter */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-sm text-xs">
              <span className="text-stone-400 font-semibold">Currency:</span>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent font-bold text-[#17233B] focus:outline-none cursor-pointer"
              >
                {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((c) => (
                  <option key={c} value={c}>
                    {c} ({SUPPORTED_CURRENCIES[c].symbol.trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-sm text-xs">
              <span className="text-stone-400 font-semibold">Budget:</span>
              <select
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                className="bg-transparent font-bold text-[#17233B] focus:outline-none cursor-pointer"
              >
                <option value={0}>Any Budget</option>
                <option value={2000}>Under ₹2,000</option>
                <option value={5000}>Under ₹5,000</option>
                <option value={15000}>Under ₹15,000</option>
                <option value={50000}>Under ₹50,000</option>
              </select>
            </div>

            <span className="text-xs text-stone-500 font-medium">
              Showing <strong>{filteredItems.length}</strong> items
            </span>
          </div>
        </div>

        {/* ── Results Grid ── */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 max-w-xl mx-auto shadow-sm">
            <span className="text-4xl">🔎</span>
            <h2 className="font-serif text-xl font-bold text-[#17233B]">No results match your criteria</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn’t find an exact item matching &ldquo;{query}&rdquo; in this category. Try adjusting your search term, clearing budget filters, or connecting with our concierge desk.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setQuery('')
                  setSelectedVertical('all')
                  setMaxPriceFilter(0)
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 transition"
              >
                Reset Filters
              </button>
              <Link
                href="/shop"
                className="px-4 py-2 bg-[#17233B] text-white rounded-xl text-xs font-bold hover:bg-[#203050] transition"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const formattedPrice = formatGlobalPrice(item.priceINR, selectedCurrency)
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col group"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-md bg-[#17233B]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                        {item.vertical}
                      </span>
                      {item.badges.slice(0, 1).map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold backdrop-blur-sm"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h2 className="font-bold text-sm text-[#17233B] line-clamp-1 group-hover:text-amber-800 transition">
                        {item.title}
                      </h2>
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-stone-400 block uppercase">
                          {item.type === 'b2b_commodity' ? 'Wholesale / kg' : item.type === 'stay' ? 'Per Night' : 'Price'}
                        </span>
                        <span className="font-serif font-bold text-base text-[#17233B]">
                          {formattedPrice}
                        </span>
                      </div>

                      <Link
                        href={item.href}
                        className="px-3.5 py-1.5 bg-[#17233B] group-hover:bg-[#C9A45C] group-hover:text-[#17233B] text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-sm text-stone-500">
          Loading Nuty Tales commercial search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
