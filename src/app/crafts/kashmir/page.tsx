'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CRAFT_PRODUCTS, CRAFT_CATEGORIES, CraftProduct } from '@/lib/crafts-data'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'

export default function KashmirCraftsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CraftProduct | undefined>()

  const products =
    activeCategory === 'all'
      ? CRAFT_PRODUCTS
      : CRAFT_PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/crafts" className="hover:text-[#176B68]">Crafts & Heritage</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Kashmir — Crafted by Heritage</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#17233B]/10 pb-8">
            <div className="max-w-3xl space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
                The Living Soul of the Valley
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
                Kashmir — Crafted by Heritage
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                From the high looms of Kanihama to the woodcarving workshops of Shehr-e-Khaas, every piece
                embodies centuries of tradition. We work directly with master artisan cooperatives to bring
                genuine, GI-verified heirlooms to your wardrobe and home.
              </p>
            </div>

            <button
              onClick={() => setSiModalOpen(true)}
              className="px-6 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 flex-shrink-0"
            >
              <span>✨</span>
              <span>Launch Try with SI</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#17233B] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Kashmir Crafts ({CRAFT_PRODUCTS.length})
          </button>
          {CRAFT_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setActiveCategory(c.slug)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                activeCategory === c.slug
                  ? 'bg-[#17233B] text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-[#17233B]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                      {p.provenance.craftTradition}
                    </span>
                    {p.provenance.giTagCertified && (
                      <span className="bg-[#C9A45C] text-[#17233B] px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider w-max shadow-sm">
                        GI Certified
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#704B32] font-semibold">
                    <span className="uppercase tracking-wider">{p.provenance.origin}</span>
                    <span>{p.provenance.artisanHours} hrs handcraft</span>
                  </div>

                  <Link href={`/crafts/product/${p.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-[#17233B] group-hover:text-[#176B68] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-stone-600 font-light line-clamp-2 leading-relaxed">
                    {p.shortDesc}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#17233B]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.mrp > p.price && (
                        <span className="ml-2 text-xs text-stone-400 line-through">
                          ₹{p.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      GI Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-2">
                {p.tryWithSiSupported && (
                  <button
                    onClick={() => {
                      setSelectedProduct(p)
                      setSiModalOpen(true)
                    }}
                    className="w-full py-2.5 bg-[#C9A45C]/15 hover:bg-[#C9A45C]/25 text-[#704B32] border border-[#C9A45C]/40 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>✨ Try with SI</span>
                  </button>
                )}
                <Link
                  href={`/crafts/product/${p.slug}`}
                  className="block w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                >
                  View Details & Provenance →
                </Link>
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
    </main>
  )
}
