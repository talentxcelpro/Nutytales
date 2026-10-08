'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function TechnologyPage() {
  const [activeLayer, setActiveLayer] = useState<'si' | 'graph' | 'currency' | 'revenue'>('si')

  const layers = [
    {
      id: 'si' as const,
      name: '1. System Intelligence (SI)',
      subtitle: 'Natural intent parser resolving complex commercial requirements into structured orchestrations.',
      details: [
        'Autonomous entity extraction: resolves budget caps, headcount, destination, and commodity specifications.',
        'Zero prompt fluff: converts prose like "150 corporate gifts under $100 to Dubai" into execution-ready supplier matches.',
        'Continuous optimization: balances supplier inventory levels, shipping windows, and profit margins in real-time.',
      ],
    },
    {
      id: 'graph' as const,
      name: '2. Shared Marketplace Graph',
      subtitle: 'Single connected commercial entity graph uniting six distinct verticals.',
      details: [
        'Unified schema across physical SKUs, boutique stay nights, travel tour legs, and wholesale metric tons.',
        'Contextual cross-selling: seamlessly bundles private estate buyouts with artisan wedding favors and chauffeured convoys.',
        'Dynamic inventory allocation: prevents double-booking between retail luxury packaging and bulk institutional supply.',
      ],
    },
    {
      id: 'currency' as const,
      name: '3. Cross-Border Engine',
      subtitle: 'Multi-currency, localized tax regimes, and carrier-agnostic international routing.',
      details: [
        'Real-time currency localization supporting INR, USD, AED, GBP, EUR, SAR, CAD, AUD, and SGD.',
        'Automated tax calculations: Indian GST (5%, 12%, 18%), UAE VAT (5%), UK VAT (20%), and Saudi VAT (15%).',
        'Carrier abstraction engine: dynamically calculates volumetric weight and schedules air cargo across 8 global trade corridors.',
      ],
    },
    {
      id: 'revenue' as const,
      name: '4. Nuty Tales Revenue OS',
      subtitle: 'Full-funnel commercial telemetry engine tracking multi-vertical marketplace economics.',
      details: [
        'Real-time take-rate calculation across B2B wholesale (4.5%-6.5%), luxury crafts (24%), and private stays (16%).',
        'Unit economics tracking: blended Customer Acquisition Cost (CAC), Lifetime Value (LTV), and Average Order Value (AOV).',
        'Edge telemetry buffer: zero-latency analytics ingestion without third-party tracking overhead or page bloat.',
      ],
    },
  ]

  const activeLayerData = layers.find((l) => l.id === activeLayer) || layers[0]

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B]">
      <main className="pt-28 pb-24 space-y-20">
        {/* ── 1. Hero Header ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-widest">
            <span>🧠</span> THE ARCHITECTURE BEHIND NUTY TALES
          </div>
          <div className="max-w-4xl space-y-4">
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#17233B] leading-[1.1]">
              Technology Built as a Core Business Moat
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed">
              Nuty Tales is not a static storefront or fragmented collection of websites. It is an intelligent, connected commerce engine designed to scale across millions of global visits and transactions.
            </p>
          </div>
        </section>

        {/* ── 2. Interactive Architecture Stack ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-[#10192A] text-white rounded-3xl p-6 sm:p-12 space-y-8 shadow-2xl border border-white/10">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-bold">
                Platform Operating Stack
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Interactive Layer Architecture
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 font-light">
                Click any layer below to inspect its operational mechanics and engineering specifications.
              </p>
            </div>

            {/* Layer Selection Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {layers.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setActiveLayer(l.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    activeLayer === l.id
                      ? 'bg-white text-[#10192A] border-white shadow-lg'
                      : 'bg-white/5 text-white border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-xs font-bold block truncate">{l.name}</span>
                  <span className={`text-[11px] block mt-1 line-clamp-1 ${activeLayer === l.id ? 'text-stone-600' : 'text-stone-400'}`}>
                    {l.subtitle}
                  </span>
                </button>
              ))}
            </div>

            {/* Layer Deep Dive Display */}
            <div className="p-6 sm:p-8 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-bold">
                  Active Inspector
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {activeLayerData.name}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                  {activeLayerData.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Key Capabilities:</p>
                <ul className="space-y-2 text-xs text-stone-200">
                  {activeLayerData.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="text-[#C9A45C] font-bold">✦</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. High-Traffic Engineering Guardrails ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#704B32] font-bold">
              Infrastructure Benchmarks
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Engineered for Global Throughput
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              Designed from first principles to sustain millions of visitors without architectural redesign.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'CDN-First & Edge Delivery',
                desc: 'Static prerendering and edge caching keep Core Web Vitals optimal with sub-second LCP globally.',
              },
              {
                title: 'Clean Stateless Micro-APIs',
                desc: 'Modular Next.js App Router endpoints for opportunities, telemetry, quotes, and partner onboarding.',
              },
              {
                title: 'Unified Entity Schemas',
                desc: 'Products, stays, travel packages, and crafts share isomorphic TypeScript definitions and JSON-LD schemas.',
              },
              {
                title: 'Dual Auth & Security',
                desc: 'Firebase Auth and Supabase Row Level Security ensure seamless OTP login with enterprise compliance.',
              },
              {
                title: 'Zero Bloat Client Bundles',
                desc: 'No heavy UI runtime frameworks. Server Components default with minimal client hydration footprints.',
              },
              {
                title: 'Carrier Logistics Abstraction',
                desc: 'Agnostic dispatch routing supporting Blue Dart, Delhivery, DHL Express, and local refrigerated reefer fleets.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-2"
              >
                <h3 className="font-bold text-sm text-[#17233B]">{card.title}</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Try SI Live Banner ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF7F2] border border-stone-300 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                Experience System Intelligence (SI) Firsthand
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl">
                Test our natural intent engine with complex travel requirements, corporate gift orders, or wholesale commodities.
              </p>
            </div>
            <Link
              href="/search"
              className="px-7 py-3.5 bg-[#17233B] hover:bg-[#203050] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-md"
            >
              Launch Global Search &amp; SI →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
