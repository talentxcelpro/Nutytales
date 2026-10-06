'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CLOTHING_PRODUCTS,
  ClothingProduct,
} from '@/lib/clothing-data'
import ClothingNavbarStrip from '@/components/crafts/ClothingNavbarStrip'
import ClothingProductCard from '@/components/crafts/ClothingProductCard'
import QuickAddModal from '@/components/crafts/QuickAddModal'
import GarmentViewer3DModal from '@/components/crafts/GarmentViewer3DModal'

export default function HeritageHomePage() {
  const [selectedProductForQuickAdd, setSelectedProductForQuickAdd] = useState<ClothingProduct | null>(null)
  const [selectedProductFor3D, setSelectedProductFor3D] = useState<ClothingProduct | null>(null)

  const homeProducts = useMemo(() => {
    return CLOTHING_PRODUCTS.filter(
      (p) =>
        p.primaryCategory === 'heritage-home' ||
        p.tags.includes('home-heritage') ||
        p.tags.includes('walnut-wood') ||
        p.tags.includes('papier-mache') ||
        p.tags.includes('gifting')
    )
  }, [])

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
            <span className="text-[#17233B] font-semibold">Heritage Home</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
                Living Traditions &amp; Decor
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
                Heritage Home &amp; Keepsakes
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-2xl">
                Deep-relief carved Kashmiri walnut root wood chests, 24k gold leaf hand-painted Papier-mâché, and curated executive gift hampers pairing valley foods with artisanal crafts.
              </p>
            </div>

            <div className="lg:col-span-4 relative aspect-[4/3] rounded-2xl overflow-hidden border border-stone-200 bg-[#FAF6EE] shadow-sm">
              <Image
                src="/images/dark-wood-gourmet-tray.jpg"
                alt="Kashmiri Walnut Wood & Heritage Keepsakes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {homeProducts.map((product) => (
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
        onOpenSizeGuide={() => setSelectedProductForQuickAdd(null)}
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
