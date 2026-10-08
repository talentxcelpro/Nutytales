'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllMarketplaceItems, MarketplaceItem } from '@/lib/marketplace-graph'
import { INITIAL_PARTNER_APPLICATIONS } from '@/lib/seller-partner-system'
import { formatGlobalPrice } from '@/lib/global-config'

export default function MarketplacePage() {
  const [selectedVertical, setSelectedVertical] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc'>('featured')

  const allItems = useMemo(() => getAllMarketplaceItems(), [])

  const filteredItems = useMemo(() => {
    let list = allItems
    if (selectedVertical !== 'all') {
      list = list.filter((i) => i.vertical === selectedVertical)
    }
    if (selectedType !== 'all') {
      list = list.filter((i) => i.type === selectedType)
    }
    if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => a.priceINR - b.priceINR)
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => b.priceINR - a.priceINR)
    }
    return list
  }, [allItems, selectedVertical, selectedType, sortBy])

  const verifiedPartners = INITIAL_PARTNER_APPLICATIONS.filter((p) => p.status === 'APPROVED')

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B]">
      <main className="pt-28 pb-24 space-y-16">
        {/* ── 1. Hero Header ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold uppercase tracking-widest text-[#704B32]">
            <span>💎</span> Nuty Tales Unified Commerce Network
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-200 pb-8">
            <div className="space-y-2 max-w-3xl">
              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#17233B]">
                The Global Marketplace
              </h1>
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                Directly connecting international consumers and enterprise buyers with verified growers, certified artisan guilds, private residence hosts, and curated travel operators.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto text-xs">
              <Link
                href="/partners"
                className="px-5 py-3 bg-[#17233B] text-white rounded-2xl font-bold uppercase tracking-wider hover:bg-[#203050] transition shadow-xs"
              >
                + Join as Seller / Host ↗
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. Verified Supply Network Showcase ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Verified Producer &amp; Host Guilds
            </h2>
            <Link href="/partners" className="text-xs font-bold text-[#176B68] hover:underline">
              View All Merchant Profiles →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {verifiedPartners.map((partner) => (
              <div
                key={partner.id}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      ✓ Verified Supplier
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {partner.city}, {partner.countryCode}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#17233B]">
                    {partner.businessName}
                  </h3>
                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
                    {partner.notes}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-700 capitalize">
                    {partner.partnerType.replace('_', ' ')}
                  </span>
                  <Link
                    href={`/search?q=${encodeURIComponent(partner.businessName.split(' ')[0])}`}
                    className="font-bold text-[#17233B] hover:text-[#176B68]"
                  >
                    View Offerings →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. Marketplace Inventory with Multi-Vertical Filter ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200 shadow-xs">
            {/* Vertical Filters */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold text-stone-500 mr-1 hidden sm:inline">Vertical:</span>
              {[
                { id: 'all', label: 'All Verticals' },
                { id: 'stays', label: 'Stays' },
                { id: 'crafts', label: 'Crafts' },
                { id: 'travel', label: 'Travel' },
                { id: 'gifting', label: 'Gifting' },
                { id: 'weddings', label: 'Weddings' },
                { id: 'business', label: 'Wholesale' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedVertical(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    selectedVertical === tab.id
                      ? 'bg-[#17233B] text-white shadow-2xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort & Counter */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <span className="text-stone-500">
                <strong>{filteredItems.length}</strong> items listed
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-800"
              >
                <option value="featured">Sort: Curated Placement</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="px-2.5 py-1 rounded-md bg-[#17233B]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {item.vertical}
                    </span>
                    {item.badges.slice(0, 1).map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#C9A45C] text-[#17233B] text-[10px] font-bold backdrop-blur-sm"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-[#17233B] line-clamp-1 group-hover:text-amber-800 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2 font-light leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">
                        {item.type === 'b2b_commodity' ? 'Per kg' : item.type === 'stay' ? 'Per night' : 'Starting at'}
                      </span>
                      <span className="font-serif font-bold text-base text-[#17233B]">
                        {formatGlobalPrice(item.priceINR, 'INR')}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#17233B] group-hover:text-[#176B68] flex items-center gap-1">
                      Explore →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
