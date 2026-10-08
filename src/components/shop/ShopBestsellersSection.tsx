'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PRODUCTS, Product } from '@/lib/products-data'
import ShopProductCard from '@/components/shop/ShopProductCard'
import QuickViewModal from '@/components/shop/QuickViewModal'

export default function ShopBestsellersSection() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Curated bestsellers
  const bestsellers = PRODUCTS.filter((p) => p.isFeatured || p.grade.includes('A')).slice(0, 8)

  return (
    <section id="bestsellers" className="py-20 bg-[#FAF7F2] border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-300/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
              <span>★</span> Customer Favorites
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Trending Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-2xl leading-relaxed">
              Consistently rated 5 stars for sensory crunch, moisture preservation, and direct orchard provenance.
            </p>
          </div>

          <Link
            href="/shop?filter=bestsellers"
            className="text-xs font-bold text-[#17233B] hover:text-[#176B68] uppercase tracking-wider flex items-center gap-1 group"
          >
            <span>Browse Full Catalog</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* 8 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ShopProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>

        {/* Catalog CTA */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#17233B] hover:bg-[#203050] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition"
          >
            <span>Explore All 25+ Harvest SKUs</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={true}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </section>
  )
}
