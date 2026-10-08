'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface BundleItem {
  name: string
  weight: string
  image: string
}

interface Bundle {
  id: string
  title: string
  tagline: string
  badge: string
  items: BundleItem[]
  originalPrice: number
  bundlePrice: number
  savings: number
  cartPayload: Array<{
    productId: string
    name: string
    slug: string
    sizeLabel: string
    unitPrice: number
    quantity: number
    totalPrice: number
    image: string
  }>
}

const BUNDLES: Bundle[] = [
  {
    id: 'bnd-himalayan-trio',
    title: 'Royal Himalayan Breakfast Trio',
    tagline: 'High-altitude Kashmiri Mamra + Snow Walnuts + Raw Acacia Honey',
    badge: '👑 MOST POPULAR',
    originalPrice: 3474,
    bundlePrice: 2899,
    savings: 575,
    items: [
      { name: 'Kashmiri Mamra Almonds', weight: '500g', image: '/images/mamra-almonds-pouch-250g.jpg' },
      { name: 'Kashmir Kagzi Akhrot', weight: '500g', image: '/images/kashmir-kagzi-akhrot-250g.jpg' },
      { name: 'Pure Acacia Honey', weight: '500g', image: '/images/kashmir-honey-jar-500g.jpg' },
    ],
    cartPayload: [
      {
        productId: 'alm-002',
        name: 'Mamra Almonds (Kashmiri Badam)',
        slug: 'mamra-almonds-kashmiri-badam',
        sizeLabel: '500g (Bundle)',
        unitPrice: 2184,
        quantity: 1,
        totalPrice: 2184,
        image: '/images/mamra-almonds-pouch-250g.jpg',
      },
      {
        productId: 'wln-001',
        name: 'Kashmiri Kagzi Akhrot (Paper Shell)',
        slug: 'walnut-kernels-halves-pieces',
        sizeLabel: '500g (Bundle)',
        unitPrice: 510,
        quantity: 1,
        totalPrice: 510,
        image: '/images/kashmir-kagzi-akhrot-250g.jpg',
      },
      {
        productId: 'hny-001',
        name: 'Pure Kashmiri Acacia Honey',
        slug: 'pure-kashmiri-acacia-honey',
        sizeLabel: '500g (Bundle)',
        unitPrice: 780,
        quantity: 1,
        totalPrice: 780,
        image: '/images/kashmir-honey-jar-500g.jpg',
      },
    ],
  },
  {
    id: 'bnd-daily-vitality',
    title: 'The Daily Vitality Power Pack',
    tagline: 'California Almonds + W240 Cashews + Jumbo Makhana + Afghan Kishmish',
    badge: '⚡ BEST VALUE',
    originalPrice: 2257,
    bundlePrice: 1899,
    savings: 358,
    items: [
      { name: 'California Almonds', weight: '500g', image: '/images/almonds-pouch-250g.jpg' },
      { name: 'W240 Jumbo Cashews', weight: '500g', image: '/images/cashews-pouch-250g.jpg' },
      { name: 'Bihar Jumbo Makhana', weight: '250g', image: '/images/makhana-pouch-250g.jpg' },
      { name: 'Afghan Green Kishmish', weight: '500g', image: '/images/raisins-pouch-250g.jpg' },
    ],
    cartPayload: [
      {
        productId: 'alm-001',
        name: 'California Almonds Premium',
        slug: 'california-almonds-premium',
        sizeLabel: '500g (Bundle)',
        unitPrice: 650,
        quantity: 1,
        totalPrice: 650,
        image: '/images/almonds-pouch-250g.jpg',
      },
      {
        productId: 'csw-001',
        name: 'W240 Premium Cashews',
        slug: 'w240-premium-cashews',
        sizeLabel: '500g (Bundle)',
        unitPrice: 754,
        quantity: 1,
        totalPrice: 754,
        image: '/images/cashews-pouch-250g.jpg',
      },
      {
        productId: 'mkh-001',
        name: 'Makhana Grade A (Fox Nuts)',
        slug: 'makhana-grade-a-fox-nuts',
        sizeLabel: '250g (Bundle)',
        unitPrice: 551,
        quantity: 1,
        totalPrice: 551,
        image: '/images/makhana-pouch-250g.jpg',
      },
      {
        productId: 'rsn-001',
        name: 'Kishmish Green (Afghan Raisins)',
        slug: 'kishmish-green-afghan-raisins',
        sizeLabel: '500g (Bundle)',
        unitPrice: 302,
        quantity: 1,
        totalPrice: 302,
        image: '/images/raisins-pouch-250g.jpg',
      },
    ],
  },
  {
    id: 'bnd-saffron-royal',
    title: 'The Kashmir Saffron & Akhrot Connoisseur Box',
    tagline: 'Pure Mongra Saffron (5g) + Kagzi Akhrot (500g) + Mamra Badam (250g)',
    badge: '🏆 LUXURY RESERVE',
    originalPrice: 3563,
    bundlePrice: 2999,
    savings: 564,
    items: [
      { name: 'Pure Mongra Saffron', weight: '5g Jar', image: '/images/saffron-jar-5g.jpg' },
      { name: 'Kashmir Kagzi Akhrot', weight: '500g', image: '/images/kashmir-kagzi-akhrot-250g.jpg' },
      { name: 'Mamra Almonds', weight: '250g', image: '/images/mamra-almonds-pouch-250g.jpg' },
    ],
    cartPayload: [
      {
        productId: 'saf-001',
        name: 'Pure Kashmiri Mongra Saffron',
        slug: 'pure-kashmiri-mongra-saffron',
        sizeLabel: '5g (Bundle)',
        unitPrice: 1950,
        quantity: 1,
        totalPrice: 1950,
        image: '/images/saffron-jar-5g.jpg',
      },
      {
        productId: 'wln-001',
        name: 'Kashmiri Kagzi Akhrot (Paper Shell)',
        slug: 'walnut-kernels-halves-pieces',
        sizeLabel: '500g (Bundle)',
        unitPrice: 510,
        quantity: 1,
        totalPrice: 510,
        image: '/images/kashmir-kagzi-akhrot-250g.jpg',
      },
      {
        productId: 'alm-002',
        name: 'Mamra Almonds (Kashmiri Badam)',
        slug: 'mamra-almonds-kashmiri-badam',
        sizeLabel: '250g (Bundle)',
        unitPrice: 1103,
        quantity: 1,
        totalPrice: 1103,
        image: '/images/mamra-almonds-pouch-250g.jpg',
      },
    ],
  },
]

export default function BestsellerBundles() {
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null)

  const handleAddBundle = (bundle: Bundle) => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      // Push all bundle items to cart
      bundle.cartPayload.forEach((item) => {
        existing.push(item)
      })
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setAddedBundleId(bundle.id)
      setTimeout(() => setAddedBundleId(null), 2500)
    } catch {
      // fallback
    }
  }

  return (
    <section className="mb-12 bg-linear-to-b from-stone-900 to-[#17233B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#176B68]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#C9A45C] text-[#17233B] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              SAVE UP TO 25%
            </span>
            <span className="text-stone-300 text-xs font-semibold">
              ⚡ Curated by Nuty Tales Sommeliers
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Curated Bestseller Bundles — Add in 1 Click
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mt-1">
            Complete daily wellness routines paired for maximum nutrition and exceptional savings. Free Pan-India insured delivery included.
          </p>
        </div>

        <div className="text-xs text-stone-300 flex items-center gap-2">
          <span>📦 Free Gift Packaging</span>
          <span>•</span>
          <span>🚚 Same-Day Dispatch</span>
        </div>
      </div>

      {/* 3 Bundles Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {BUNDLES.map((bundle) => {
          const isAdded = addedBundleId === bundle.id
          return (
            <div
              key={bundle.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 flex flex-col justify-between hover:border-[#C9A45C]/60 hover:bg-white/15 transition-all duration-300 group"
            >
              <div>
                {/* Badge & Savings */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#C9A45C] uppercase bg-black/40 px-2 py-0.5 rounded-md">
                    {bundle.badge}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-400/30">
                    Save ₹{bundle.savings}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#C9A45C] transition-colors leading-snug">
                  {bundle.title}
                </h3>
                <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                  {bundle.tagline}
                </p>

                {/* Items previews with HD thumbs */}
                <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-white/10">
                  {bundle.items.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white/10 rounded-xl p-2 flex flex-col items-center text-center"
                    >
                      <div className="relative w-12 h-12 mb-1">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                          sizes="48px"
                        />
                      </div>
                      <span className="text-[10px] text-stone-200 font-bold truncate w-full">
                        {item.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-[#C9A45C] font-semibold">
                        {item.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & 1-Click CTA */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-white">
                      ₹{bundle.bundlePrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400 line-through ml-2">
                      ₹{bundle.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300">
                    {bundle.items.length} Full Jars/Packs
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddBundle(bundle)}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#C9A45C] hover:bg-white text-[#17233B]'
                  }`}
                >
                  <span>
                    {isAdded ? '✓ Bundle Added to Basket!' : '⚡ Add Complete Bundle to Basket'}
                  </span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
