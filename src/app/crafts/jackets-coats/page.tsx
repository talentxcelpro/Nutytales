'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CLOTHING_PRODUCTS,
  ClothingProduct,
} from '@/lib/clothing-data'
import ClothingNavbarStrip from '@/components/crafts/ClothingNavbarStrip'
import ClothingFilterBar, { FilterState } from '@/components/crafts/ClothingFilterBar'
import ClothingProductCard from '@/components/crafts/ClothingProductCard'
import QuickAddModal from '@/components/crafts/QuickAddModal'
import SizeGuideModal from '@/components/crafts/SizeGuideModal'
import GarmentViewer3DModal from '@/components/crafts/GarmentViewer3DModal'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'

const JACKET_TYPES = ['All Outerwear', 'Long Coats', 'Nehru Jackets', 'Short Jackets', 'Tweed Coats']

export default function JacketsCoatsPage() {
  const [selectedProductForQuickAdd, setSelectedProductForQuickAdd] = useState<ClothingProduct | null>(null)
  const [selectedProductFor3D, setSelectedProductFor3D] = useState<ClothingProduct | null>(null)
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [activeSiProduct, setActiveSiProduct] = useState<ClothingProduct | undefined>(undefined)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const [activeType, setActiveType] = useState<string>('All Outerwear')
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: '',
    subCategory: '',
    size: '',
    colour: '',
    material: '',
    craft: '',
    warmth: '',
    occasion: '',
    inStockOnly: false,
    sortBy: 'featured',
  })

  const jacketProducts = useMemo(() => {
    let result = CLOTHING_PRODUCTS.filter(
      (p) =>
        p.primaryCategory === 'jackets-coats' ||
        p.tags.includes('jacket') ||
        p.tags.includes('coat') ||
        p.tags.includes('overcoat') ||
        p.tags.includes('nehru')
    )

    if (activeType === 'Long Coats') {
      result = result.filter((p) => p.subCategory === 'Long Coats')
    } else if (activeType === 'Nehru Jackets') {
      result = result.filter((p) => p.subCategory === 'Nehru Jackets')
    } else if (activeType === 'Short Jackets') {
      result = result.filter((p) => p.subCategory === 'Short Jackets')
    } else if (activeType === 'Tweed Coats') {
      result = result.filter((p) => p.material.toLowerCase().includes('tweed') || p.material.toLowerCase().includes('melton'))
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.craft.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      )
    }

    if (filters.size) {
      result = result.filter((p) => p.sizes.includes(filters.size) || p.sizes.includes('Free Size'))
    }

    if (filters.colour) {
      result = result.filter((p) =>
        p.colorOptions.some((c) => c.name.toLowerCase().includes(filters.colour.toLowerCase()))
      )
    }

    if (filters.material) {
      result = result.filter((p) => p.material.toLowerCase().includes(filters.material.toLowerCase()))
    }

    if (filters.craft) {
      result = result.filter((p) => p.craft.toLowerCase().includes(filters.craft.toLowerCase()))
    }

    if (filters.warmth) {
      result = result.filter((p) => p.warmthRating.startsWith(filters.warmth.split(' ')[0]))
    }

    if (filters.occasion) {
      result = result.filter((p) => p.occasion === filters.occasion)
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stockStatus === 'IN_STOCK')
    }

    if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    } else if (filters.sortBy === 'bestselling') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
    } else if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [filters, activeType])

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      <ClothingNavbarStrip />

      {/* ── 1. Editorial Header Banner (Structured Outerwear Visual) ─────────── */}
      <section className="bg-white border-b border-stone-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/crafts" className="hover:text-[#176B68]">Crafts &amp; Heritage</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Jackets &amp; Coats</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-extrabold uppercase tracking-widest">
                <span>✦</span> TAILORED OUTERWEAR
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
                Jackets, Coats &amp; Outerwear
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-2xl">
                Structured virgin wool melton coats with Kani-woven lapels, hand-embroidered velvet crop jackets, and tone-on-tone Sozni bandis. Clean garment presentation with Savile Row precision.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSiProduct(jacketProducts[0])
                    setSiModalOpen(true)
                  }}
                  className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center gap-2"
                >
                  <span>✨</span>
                  <span>Try on Outerwear with SI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border border-stone-300"
                >
                  Chest &amp; Shoulder Size Guide
                </button>
              </div>
            </div>

            {/* Clean Hanging Garment Studio Visual */}
            <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-[#FAF6EE] shadow-sm">
              <Image
                src="/images/crafts-jackets.jpg"
                alt="Kashmiri Jackets & Coats Presentation"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Type Tabs */}
          <div className="pt-4 border-t border-stone-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            {JACKET_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveType(t)}
                className={`px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap border ${
                  activeType === t
                    ? 'bg-[#17233B] text-white border-[#17233B] shadow-xs'
                    : 'bg-[#FAF6EE] hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Product Catalog & Filters ───────────────────────────────────────── */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ClothingFilterBar
          filters={filters}
          onFilterChange={setFilters}
          totalCount={jacketProducts.length}
        />

        {/* 4-Column Ecommerce Grid (Desktop: 4, Tablet: 3, Mobile: 2) */}
        {jacketProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {jacketProducts.map((product) => (
              <ClothingProductCard
                key={product.id}
                product={product}
                onQuickAdd={(p) => setSelectedProductForQuickAdd(p)}
                onTryWithSi={(p) => {
                  setActiveSiProduct(p)
                  setSiModalOpen(true)
                }}
                onOpen3D={(p) => setSelectedProductFor3D(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <span className="text-3xl block">🔍</span>
            <h3 className="font-serif font-bold text-lg text-[#17233B]">No outerwear matched your filters</h3>
            <p className="text-xs text-stone-500">Try adjusting your filter selections.</p>
          </div>
        )}
      </section>

      {/* Modals */}
      <QuickAddModal
        product={selectedProductForQuickAdd}
        isOpen={Boolean(selectedProductForQuickAdd)}
        onClose={() => setSelectedProductForQuickAdd(null)}
        onOpenSizeGuide={() => {
          setSelectedProductForQuickAdd(null)
          setSizeGuideOpen(true)
        }}
      />

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <GarmentViewer3DModal
        product={selectedProductFor3D}
        isOpen={Boolean(selectedProductFor3D)}
        onClose={() => setSelectedProductFor3D(null)}
        onAddToCart={(p) => {
          setSelectedProductFor3D(null)
          setSelectedProductForQuickAdd(p)
        }}
      />

      <TryWithSIModal
        isOpen={siModalOpen}
        onClose={() => setSiModalOpen(false)}
        initialProduct={
          activeSiProduct
            ? CRAFT_PRODUCTS.find((p) => p.slug === activeSiProduct.slug)
            : undefined
        }
      />
    </main>
  )
}
