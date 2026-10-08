'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllMarketplaceItems, MarketplaceItem } from '@/lib/marketplace-graph'
import { formatGlobalPrice } from '@/lib/global-config'

// ─────────────────────────────────────────────────────────────────────────────
// 1. CURRENTLY DISCOVERING — CROSS-VERTICAL CURATED SHOWCASE
// ─────────────────────────────────────────────────────────────────────────────

export function CurrentlyDiscoveringSection() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const allItems = getAllMarketplaceItems()

  const tabs = [
    { id: 'all', label: 'All Curations' },
    { id: 'stays', label: 'Private Stays' },
    { id: 'crafts', label: 'Heritage Crafts' },
    { id: 'travel', label: 'Expeditions' },
    { id: 'gifting', label: 'Bespoke Gifts' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'business', label: 'B2B Sourcing' },
  ]

  const filtered = activeTab === 'all'
    ? allItems.slice(0, 8)
    : allItems.filter((i) => i.vertical === activeTab).slice(0, 8)

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 text-[#704B32] text-xs font-bold uppercase tracking-wider">
            <span>✦</span> Curated Global Inventory
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Currently Discovering on Nuty Tales
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-2xl leading-relaxed">
            Real private estates, handwoven heirloom shawls, alpine expeditions, and grower-direct commodities currently in demand across global hubs.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#17233B] text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col group"
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
                <span className="px-2 py-0.5 rounded-md bg-[#17233B]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
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

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
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
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center pt-4">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border border-stone-300 hover:border-stone-500 text-[#17233B] rounded-2xl text-xs font-bold uppercase tracking-wider shadow-xs transition"
        >
          <span>Explore Entire Marketplace Catalog</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. EDITORIAL DESTINATIONS
// ─────────────────────────────────────────────────────────────────────────────

export function EditorialDestinationsSection() {
  const destinations = [
    {
      title: 'Srinagar & The Dal Waters',
      tagline: 'Waterfront royal cedar houseboats, floating flower markets & artisan guilds',
      image: '/images/stays/cedar-houseboat.jpg',
      doors: ['Heritage Stays', 'Sozni Crafts', 'Lake Charters'],
      href: '/travel',
    },
    {
      title: 'Gulmarg & Apharwat Peak',
      tagline: 'High-altitude backcountry heli-skiing, snow safaris & heated pine chalets',
      image: '/images/crafts-winter-hero.jpg',
      doors: ['Ski Chalets', 'Tweed Pherans', 'Gondola Expeditions'],
      href: '/travel',
    },
    {
      title: 'Pahalgam & Lidder Valleys',
      tagline: 'Wild walnut orchards, crystalline trout rivers & secluded pine estates',
      image: '/images/brand-showcase-collage.jpg',
      doors: ['Orchard Villas', 'Trout Trails', 'Walnut Harvest'],
      href: '/stays',
    },
    {
      title: 'Pampore Karewa Highlands',
      tagline: 'The world capital of certified GI Mongra Saffron & autumn violet blooms',
      image: '/images/saffron-threads-macro.jpg',
      doors: ['Saffron Vaults', 'Grower Collectives', 'Bulk Sourcing'],
      href: '/b2b',
    },
  ]

  return (
    <section className="py-24 bg-[#10192A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-bold uppercase tracking-wider border border-white/10">
            <span>🏔️</span> Editorial Destinations
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Places Shaped by Nature &amp; Heritage
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
            Every destination within the Nuty Tales universe offers a seamless triad of private stays, curated local expeditions, and authentic artisan crafts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <Link
              key={i}
              href={dest.href}
              className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 aspect-[4/5] flex flex-col justify-end p-6 hover:border-[#C9A45C]/50 transition-all duration-300"
            >
              <Image
                src={dest.image}
                alt={dest.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-[#10192A]/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#C9A45C] transition">
                  {dest.title}
                </h3>
                <p className="text-xs text-stone-300 font-light line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dest.doors.map((d, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-white/15 px-2 py-0.5 rounded-md text-stone-200"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CRAFT, ORIGIN & PROVENANCE
// ─────────────────────────────────────────────────────────────────────────────

export function CraftAndProvenanceSection() {
  const stories = [
    {
      craft: 'The Weavers of Kanihama',
      time: '180 Days per Heirloom',
      desc: 'Hand-interlocked wooden kanis weaving pure Changthangi cashmere into royal floral Jamawars, preserved by verified generational guilds.',
      image: '/images/crafts-shawls.jpg',
      badge: 'GI Tag Certified #GI-46',
      href: '/crafts',
    },
    {
      craft: 'The Saffron Vaults of Pampore',
      time: 'Autumn Harvest (October - November)',
      desc: 'Single-origin Mongra stigmas dried within hours of picking on the Karewa plateau, delivering certified crocin potency above 240.',
      image: '/images/saffron-jar-5g.jpg',
      badge: 'Kashmir Saffron GI-535',
      href: '/shop',
    },
    {
      craft: 'Master Walnut Wood Carvers',
      time: 'Air-Dried Seasoned Roots (5-7 Years)',
      desc: 'Deep relief floral chinar motifs and royal dragon carvings sculptured from seasoned walnut tree trunks in Downtown Srinagar.',
      image: '/images/dark-wood-gourmet-tray.jpg',
      badge: 'GI Craft Certification',
      href: '/crafts',
    },
  ]

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 text-[#704B32] text-xs font-bold uppercase tracking-wider">
          <span>🪡</span> Traceability &amp; Guilds
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
          Authenticity You Can Trace to the Root
        </h2>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Nuty Tales eliminates speculative middlemen by directly connecting registered artisan guilds and agricultural growers to international patrons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, idx) => (
          <Link
            key={idx}
            href={story.href}
            className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className="relative aspect-[16/11] bg-stone-100 overflow-hidden">
              <Image
                src={story.image}
                alt={story.craft}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#17233B] text-white text-[10px] font-bold uppercase tracking-wider">
                {story.badge}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-bold text-amber-700 block">
                  ⏱️ {story.time}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#17233B] group-hover:text-[#176B68] transition">
                  {story.craft}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {story.desc}
                </p>
              </div>

              <span className="text-xs font-bold text-[#17233B] group-hover:underline inline-flex items-center gap-1 pt-2">
                Discover Artisan Guilds →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TECHNOLOGY NARRATIVE SECTION
// ─────────────────────────────────────────────────────────────────────────────

export function TechnologyNarrativeSection() {
  return (
    <section className="py-24 bg-[#FAF7F2] border-y border-stone-300/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
              <span>🧠</span> The Technology Moat
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
              Powered by Nuty Tales Intelligence (SI)
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
              Technology is our central moat. Our connected commerce graph orchestrates complex multi-market supply, dynamic packaging, and cross-vertical itineraries.
            </p>
          </div>

          <Link
            href="/technology"
            className="px-6 py-3 bg-[#17233B] hover:bg-[#203050] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-sm"
          >
            Explore Platform Architecture →
          </Link>
        </div>

        {/* 4 Architecture Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: '🌐',
              title: 'Shared Marketplace Graph',
              desc: 'Intelligently unites stays, travel operators, artisan guilds, and gourmet supply into one unified transaction graph.',
            },
            {
              icon: '💬',
              title: 'Natural Intent Engine',
              desc: 'Understands complex multi-entity requests across budget, group size, and location to return precision orchestrations.',
            },
            {
              icon: '📦',
              title: 'Global Multi-Currency Hub',
              desc: 'Real-time multi-currency pricing, localized tax compliance (GST, VAT), and automated carrier route calculation.',
            },
            {
              icon: '📊',
              title: 'Revenue OS & Telemetry',
              desc: 'High-frequency telemetry tracking discovery, conversion funnels, and take-rates across eight international territories.',
            },
          ].map((pillar, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3"
            >
              <span className="text-3xl block">{pillar.icon}</span>
              <h3 className="font-bold text-base text-[#17233B]">{pillar.title}</h3>
              <p className="text-xs text-stone-500 font-light leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GLOBAL TRUST & INTEGRITY
// ─────────────────────────────────────────────────────────────────────────────

export function GlobalTrustSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#17233B] text-white rounded-3xl p-8 sm:p-14 space-y-10 shadow-2xl">
        <div className="max-w-3xl space-y-3 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A45C]">
            Verified Global Standards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">
            Built on Uncompromising Trust &amp; Governance
          </h2>
          <p className="text-sm text-stone-300 font-light leading-relaxed">
            From single-origin GI Mongra saffron vaults to verified 5-star mountain estates and cold-chain international air couriers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-white/10 text-xs">
          <div className="space-y-1">
            <span className="text-[#C9A45C] font-serif text-2xl font-bold block">100%</span>
            <p className="font-bold text-white">Authentic Provenance</p>
            <p className="text-[11px] text-stone-400 font-light">Every SKU verified with origin testing &amp; GI tags.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#C9A45C] font-serif text-2xl font-bold block">8 Hubs</span>
            <p className="font-bold text-white">Global Dispatch</p>
            <p className="text-[11px] text-stone-400 font-light">Fulfillment across India, UAE, UK, US &amp; Singapore.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#C9A45C] font-serif text-2xl font-bold block">FSSAI</span>
            <p className="font-bold text-white">Central Certification</p>
            <p className="text-[11px] text-stone-400 font-light">Food safety compliance #22724441000048.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#C9A45C] font-serif text-2xl font-bold block">Escrow</span>
            <p className="font-bold text-white">Secure Settlements</p>
            <p className="text-[11px] text-stone-400 font-light">Protected bank payouts and corporate Net-30 invoicing.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
