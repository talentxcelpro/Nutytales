'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CRAFT_CATEGORIES, CRAFT_PRODUCTS, CraftProduct } from '@/lib/crafts-data'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'

export default function WinterCraftsSpotlight() {
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CraftProduct | undefined>()

  const handleOpenSi = (product?: CraftProduct) => {
    setSelectedProduct(product || CRAFT_PRODUCTS[2])
    setSiModalOpen(true)
  }

  return (
    <section className="py-24 bg-[#17233B] text-[#FAF6EE] relative overflow-hidden border-t border-b border-[#C9A45C]/20">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#176B68]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[11px] font-bold tracking-widest uppercase">
              <span>❄️</span> Kashmir — Autumn &amp; Winter Collections
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Wear the story.
            </h2>
            <p className="text-sm sm:text-base text-[#FAF6EE]/80 font-light leading-relaxed">
              Discover Kashmir&apos;s winter wardrobe, curated by SI. Handcrafted Pherans, genuine Changthangi Pashmina shawls, embroidered stoles, and velvet long coats from the valleys of Kashmir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenSi()}
              className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>✨</span>
              <span>Try with SI — Virtual Drape</span>
            </button>
            <Link
              href="/crafts"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
            >
              Explore All Crafts →
            </Link>
          </div>
        </div>

        {/* 6 Category Tiles from Campaign Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-16">
          {CRAFT_CATEGORIES.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              href={`/crafts/kashmir/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-[#101A2C] border border-white/15 aspect-[4/5] flex flex-col justify-end p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10 space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-[#C9A45C] font-bold block">
                  Kashmir Autumn &amp; Winter
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-white group-hover:text-[#C9A45C] transition-colors leading-tight">
                  {cat.label}
                </h3>
                <p className="text-[10px] text-stone-300 truncate font-light">{cat.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* 3 Featured Signature Garments with Direct Try with SI triggers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {CRAFT_PRODUCTS.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="bg-[#10192A] rounded-2xl overflow-hidden border border-white/15 p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-stone-900">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#17233B]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {prod.provenance.craftTradition}
                  </div>
                  {prod.provenance.giTagCertified && (
                    <div className="absolute top-3 right-3 bg-[#C9A45C] text-[#17233B] px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider shadow-sm">
                      GI Certified
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                    {prod.provenance.origin}
                  </span>
                  <Link href={`/crafts/product/${prod.slug}`}>
                    <h4 className="font-serif text-lg font-bold text-white group-hover:text-[#C9A45C] transition-colors mt-0.5 line-clamp-1">
                      {prod.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-stone-300 font-light mt-1 line-clamp-2">
                    {prod.shortDesc}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-white">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{prod.mrp.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenSi(prod)}
                    className="py-2.5 bg-[#C9A45C]/20 hover:bg-[#C9A45C]/30 text-[#C9A45C] border border-[#C9A45C]/40 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <span>✨ Try with SI</span>
                  </button>
                  <Link
                    href={`/crafts/product/${prod.slug}`}
                    className="py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold uppercase tracking-wider text-center transition-colors"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TryWithSIModal
        isOpen={siModalOpen}
        onClose={() => setSiModalOpen(false)}
        initialProduct={selectedProduct}
      />
    </section>
  )
}
