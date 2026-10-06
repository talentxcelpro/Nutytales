'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { CRAFT_PRODUCTS, CRAFT_CATEGORIES, CraftCategory, CraftProduct } from '@/lib/crafts-data'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'

export default function KashmirCategoryPage() {
  const params = useParams()
  const categoryParam = params?.category as string

  const matchedCategory = CRAFT_CATEGORIES.find((c) => c.slug === categoryParam) || CRAFT_CATEGORIES[0]
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CraftProduct | undefined>()

  const products = CRAFT_PRODUCTS.filter(
    (p) => p.category === (matchedCategory.slug as CraftCategory)
  )

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/crafts" className="hover:text-[#176B68]">Crafts & Heritage</Link>
            <span>/</span>
            <Link href="/crafts/kashmir" className="hover:text-[#176B68]">Kashmir</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">{matchedCategory.label}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#17233B]/10 pb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
                Kashmir Heritage Collection
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#17233B] mt-1">
                Kashmiri {matchedCategory.label}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
                {matchedCategory.sub} — Handcrafted with verified single-origin provenance and authentic GI certification.
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(products[0])
                setSiModalOpen(true)
              }}
              className="px-6 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2 flex-shrink-0"
            >
              <span>✨</span>
              <span>Try on with SI</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-2 text-xs">
          {CRAFT_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/crafts/kashmir/${c.slug}`}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                c.slug === matchedCategory.slug
                  ? 'bg-[#17233B] text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
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
                      In Stock
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
