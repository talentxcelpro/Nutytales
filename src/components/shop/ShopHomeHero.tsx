'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

const SUGGESTED_SEARCHES = [
  'Pampore Mongra Saffron',
  'Kashmiri Kagzi Walnuts',
  'Mamra Badam',
  'Mithila Phool Makhana',
  'Wild Forest Honey',
  'Jumbo Roasted Cashews',
]

export default function ShopHomeHero() {
  const router = useRouter()
  const { formatPrice } = useMarketCurrency()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/shop')
    }
  }

  return (
    <section className="relative bg-[#FDFBF7] text-[#17233B] pt-28 pb-20 overflow-hidden border-b border-stone-200/80">
      {/* Background subtle radial texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#17233B_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-[600px] h-[450px] bg-amber-100/30 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Search */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#704B32]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C] animate-pulse" />
              <span>Pure Himalayan &amp; Global Harvest</span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17233B] leading-[1.08]">
                Discover something exceptional.
              </h1>
              <p className="text-base sm:text-xl text-stone-600 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Direct single-origin harvests from Kashmir orchards and verified grower collectives — vacuum-sealed, lab-tested, and shipped worldwide.
              </p>
            </div>

            {/* Product Search Input Bar */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto lg:mx-0">
              <div className="relative bg-white rounded-2xl border-2 border-stone-200 shadow-md focus-within:border-[#17233B] focus-within:ring-4 focus-within:ring-[#17233B]/5 transition-all p-1.5 flex items-center gap-2">
                <span className="pl-3 text-stone-400 text-lg">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search walnuts, saffron, almonds, or makhana..."
                  className="w-full py-2.5 text-sm text-[#17233B] placeholder-stone-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#17233B] hover:bg-[#203050] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-xs"
                >
                  Shop Now
                </button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 text-xs justify-center lg:justify-start">
                <span className="text-stone-400 font-medium text-[11px] uppercase tracking-wider">Popular:</span>
                {SUGGESTED_SEARCHES.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => router.push(`/shop?q=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:text-[#17233B] text-[11px] transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Trust Markers */}
            <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>100% Single-Origin Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>FSSAI Central Lic. #22724441000048</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Worldwide Air Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Spotlight */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 group bg-stone-100">
              <Image
                src="/images/saffron-jar-5g.jpg"
                alt="Pure Kashmir Mongra Saffron GI-535 - Nuty Tales Shop"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10192A]/90 via-[#10192A]/30 to-transparent" />

              {/* Floating Quality Tag */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/20 text-xs font-bold text-[#17233B] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Harvest Fresh Batch</span>
              </div>

              {/* Bottom Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                    GI-Certified Pampore Harvest
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Pure Mongra Saffron (Grade A+)
                  </h3>
                  <p className="text-xs text-stone-300 font-light line-clamp-2">
                    Deep crimson stigmas hand-harvested on the Pampore Karewa plateau. Certified crocin potency exceeding 240.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/15">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-medium block">Starting from</span>
                    <span className="font-serif text-xl font-bold text-white">{formatPrice(650)}</span>
                  </div>
                  <Link
                    href="/shop/kashmiri-mongra-saffron"
                    className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-md"
                  >
                    Shop Saffron →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
