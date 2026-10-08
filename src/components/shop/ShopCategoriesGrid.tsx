'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SHOP_CATEGORIES = [
  {
    name: 'Kashmiri Kagzi Walnuts',
    slug: 'walnuts',
    description: 'Thin-shelled, unbleached, high-oil kernels from Harwan orchards.',
    image: '/images/kashmir-kagzi-akhrot-250g.jpg',
    itemCount: 'In Shell & Kernels',
  },
  {
    name: 'Pampore Mongra Saffron',
    slug: 'saffron',
    description: 'GI-535 certified crocin potency >240, autumn harvest.',
    image: '/images/saffron-jar-5g.jpg',
    itemCount: '1g · 2g · 5g · 10g',
  },
  {
    name: 'Mamra & California Almonds',
    slug: 'almonds',
    description: 'Crisp Nonpareil almonds & traditional high-oil Mamra Badam.',
    image: '/images/mamra-almonds-pouch-250g.jpg',
    itemCount: 'Raw & Roasted Salted',
  },
  {
    name: 'Jumbo Mithila Makhana',
    slug: 'makhana',
    description: 'Optically-sorted giant popped lotus seeds from Bihar wetlands.',
    image: '/images/makhana-pouch-250g.jpg',
    itemCount: 'Jumbo Grade 6-Soot',
  },
  {
    name: 'Raw Himalayan Honey',
    slug: 'honey',
    description: 'Wild single-flower Acacia and Sidr unheated forest honey.',
    image: '/images/kashmir-honey-jar-500g.jpg',
    itemCount: 'Pure Unpasteurized',
  },
  {
    name: 'Jumbo Cashews & Pistachios',
    slug: 'cashews',
    description: 'W180 & W240 whole king cashews & Iranian green pistachios.',
    image: '/images/cashews-pouch-250g.jpg',
    itemCount: 'Grade-A Selects',
  },
]

export default function ShopCategoriesGrid() {
  return (
    <section id="categories" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 text-[#704B32] text-xs font-bold uppercase tracking-wider">
            <span>🌰</span> Shop by Department
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Premium Harvest Categories
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light max-w-2xl leading-relaxed">
            Every product is hand-graded for size, oil content, and sensory snap before vacuum-sealing.
          </p>
        </div>

        <Link
          href="/shop"
          className="text-xs font-bold text-[#17233B] hover:text-[#176B68] uppercase tracking-wider flex items-center gap-1 group"
        >
          <span>View All Products</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOP_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#17233B]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                {cat.itemCount}
              </div>
            </div>

            <div className="p-6 space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#17233B] group-hover:text-amber-800 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                {cat.description}
              </p>
              <div className="pt-2 text-xs font-bold text-[#17233B] group-hover:underline flex items-center gap-1">
                <span>Explore Category</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
