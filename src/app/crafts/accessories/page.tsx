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
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'

export default function AccessoriesPage() {
  const [selectedProductForQuickAdd, setSelectedProductForQuickAdd] = useState<ClothingProduct | null>(null)
  const [selectedProductFor3D, setSelectedProductFor3D] = useState<ClothingProduct | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

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

  const accessoryProducts = useMemo(() => {
    let result = CLOTHING_PRODUCTS.filter(
      (p) => p.primaryCategory === 'accessories' || p.tags.includes('accessories') || p.tags.includes('muffler') || p.tags.includes('gloves')
    )

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.craft.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      )
    }

    if (filters.colour) {
      result = result.filter((p) =>
        p.colorOptions.some((c) => c.name.toLowerCase().includes(filters.colour.toLowerCase()))
      )
    }

    if (filters.inStockOnly) {
      result = result.filter((p) => p.stockStatus === 'IN_STOCK')
    }

    return result
  }, [filters])

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      <ClothingNavbarStrip />

      <section className="bg-white border-b border-stone-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/crafts" className="hover:text-[#176B68]">Crafts &amp; Heritage</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Accessories</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
                Accessories &amp; Cold Essentials
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
                Winter Accessories
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-2xl">
                Reversible two-tone Pashmina mufflers, touch-screen compatible merino gloves, embroidered beanies, and handcrafted mountain travel wraps.
              </p>
            </div>

            {/* Studio Flat Lay Presentation */}
            <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-[#FAF6EE] shadow-sm">
              <Image
                src="/images/crafts-accessories.jpg"
                alt="Kashmiri Accessories Studio Flat Lay"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ClothingFilterBar
          filters={filters}
          onFilterChange={setFilters}
          totalCount={accessoryProducts.length}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
          {accessoryProducts.map((product) => (
            <ClothingProductCard
              key={product.id}
              product={product}
              onQuickAdd={(p) => setSelectedProductForQuickAdd(p)}
              onOpen3D={(p) => setSelectedProductFor3D(p)}
            />
          ))}
        </div>
      </section>

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
    </main>
  )
}
