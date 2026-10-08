'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllMarketplaceItems, MarketplaceItem } from '@/lib/marketplace-graph'
import { formatGlobalPrice } from '@/lib/global-config'

export default function ExplorePage() {
  const [selectedTag, setSelectedTag] = useState('all')
  const allItems = getAllMarketplaceItems()

  const categories = [
    { id: 'all', label: 'All Curations', count: allItems.length },
    { id: 'stays', label: 'Stays & Estates', count: allItems.filter((i) => i.vertical === 'stays').length },
    { id: 'crafts', label: 'Heritage Crafts', count: allItems.filter((i) => i.vertical === 'crafts').length },
    { id: 'travel', label: 'Travel & Expeditions', count: allItems.filter((i) => i.vertical === 'travel').length },
    { id: 'gifting', label: 'Bespoke Gifts', count: allItems.filter((i) => i.vertical === 'gifting').length },
    { id: 'weddings', label: 'Royal Weddings', count: allItems.filter((i) => i.vertical === 'weddings').length },
    { id: 'business', label: 'B2B Sourcing', count: allItems.filter((i) => i.vertical === 'business').length },
  ]

  const filteredItems = selectedTag === 'all'
    ? allItems
    : allItems.filter((i) => i.vertical === selectedTag)

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B]">
      <main className="pt-28 pb-24 space-y-16">
        {/* ── 1. Editorial Header ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold uppercase tracking-widest text-[#704B32]">
            <span>🌐</span> Nuty Tales Discovery Engine
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
            <div className="space-y-2 max-w-3xl">
              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#17233B]">
                Explore Without Boundaries
              </h1>
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                A single canvas connecting products, places, boutique stays, artisan looms, and institutional procurement.
              </p>
            </div>

            <Link
              href="/search"
              className="px-6 py-3.5 bg-[#17233B] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-[#203050] transition whitespace-nowrap self-start md:self-auto"
            >
              Intelligent Search Desk →
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedTag(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  selectedTag === c.id
                    ? 'bg-[#17233B] text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                }`}
              >
                <span>{c.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedTag === c.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── 2. Curated Items Grid ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <h2 className="font-bold text-sm text-[#17233B] line-clamp-1 group-hover:text-amber-800 transition">
                      {item.title}
                    </h2>
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
                      Experience →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 3. Six Doors Banner Strip ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#17233B] text-white rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-bold">
                Interconnected Verticals
              </span>
              <h2 className="font-serif text-3xl font-bold">
                Six Pathways. One Technology Core.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                Each vertical functions as an independent flagship destination while sharing inventory, customer accounts, global payments, and intelligent recommendations.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {[
                { title: 'Shop Gourmet', href: '/shop', desc: 'Direct farm dry fruits & saffron' },
                { title: 'Private Stays', href: '/stays', desc: 'Orchard villas & houseboats' },
                { title: 'Travel Tours', href: '/travel', desc: 'Alpine journeys & heli-ski' },
                { title: 'Gifting Studio', href: '/gifting', desc: 'Corporate & luxury hampers' },
                { title: 'Artisan Crafts', href: '/crafts', desc: 'Pashmina, wood & rugs' },
                { title: 'B2B Sourcing', href: '/b2b', desc: 'Institutional wholesale supply' },
              ].map((v, i) => (
                <Link
                  key={i}
                  href={v.href}
                  className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition block space-y-1 group"
                >
                  <p className="font-bold text-white group-hover:text-[#C9A45C] transition">{v.title}</p>
                  <p className="text-[11px] text-stone-400 font-light line-clamp-2">{v.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
