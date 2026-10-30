'use client'

import React, { useState, useMemo, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Product } from '@/lib/products-data'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import ShopProductCard from './ShopProductCard'

const QuickViewModal = dynamic(() => import('./QuickViewModal'), {
  ssr: false,
})

interface ShopCatalogClientProps {
  products: Product[]
  initialCategory?: string
  initialOrigin?: string
  initialSort?: string
  embedded?: boolean
}

const ORIGINS = [
  'All Origins',
  'Kashmir, India',
  'Afghanistan',
  'Middle East',
  'USA & California',
  'Kerala, India',
  'Himachal Pradesh, India',
  'Bihar & Mithila',
  'Ladakh, India',
  'Turkey',
]

const PRICE_TIERS = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1,000', min: 500, max: 1000 },
  { label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { label: 'Above ₹2,000', min: 2000, max: Infinity },
]

export default function ShopCatalogClient({
  products,
  initialCategory,
  initialOrigin,
  initialSort = 'featured',
  embedded = false,
}: ShopCatalogClientProps) {
  // Static-first filter state (No useSearchParams during initial render to prevent SSR bailout and layout shifts)
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all')
  const [selectedOrigin, setSelectedOrigin] = useState<string>(initialOrigin || 'All Origins')
  const [selectedPriceTier, setSelectedPriceTier] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>(initialSort || 'featured')
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [selectedGrade, setSelectedGrade] = useState<string>('all')

  // Initial pagination limit to optimize DOM size & prevent CPU blocking on mobile devices
  const [visibleCount, setVisibleCount] = useState<number>(embedded ? 12 : 24)

  // UI States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Client-only URL parameter sync after mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const cat = params.get('category')
    const org = params.get('origin')
    const srt = params.get('sort')
    const q = params.get('q')

    if (cat) setSelectedCategory(cat)
    if (org) setSelectedOrigin(org)
    if (srt) setSortBy(srt)
    if (q) setSearchQuery(q)
  }, [])

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (
        selectedCategory !== 'all' &&
        p.categorySlug.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false
      }

      // Origin filter
      if (selectedOrigin !== 'All Origins') {
        const o = (p.origin || '').toLowerCase()
        if (selectedOrigin === 'Middle East') {
          if (!o.includes('saudi') && !o.includes('iran') && !o.includes('madinah') && !o.includes('middle east')) return false
        } else if (selectedOrigin === 'USA & California') {
          if (!o.includes('usa') && !o.includes('california') && !o.includes('wisconsin') && !o.includes('oregon')) return false
        } else if (selectedOrigin === 'Afghanistan') {
          if (!o.includes('afghan')) return false
        } else if (selectedOrigin === 'Kerala, India') {
          if (!o.includes('kerala') && !o.includes('malabar')) return false
        } else if (selectedOrigin === 'Himachal Pradesh, India') {
          if (!o.includes('himachal') && !o.includes('kinnaur')) return false
        } else if (selectedOrigin === 'Bihar & Mithila') {
          if (!o.includes('bihar') && !o.includes('mithila')) return false
        } else if (selectedOrigin === 'Kashmir, India') {
          if (!o.includes('kashmir')) return false
        } else if (selectedOrigin === 'Ladakh, India') {
          if (!o.includes('ladakh')) return false
        } else if (selectedOrigin === 'Turkey') {
          if (!o.includes('turkey') && !o.includes('aydin')) return false
        } else {
          const matchKey = selectedOrigin.split(',')[0].toLowerCase().trim()
          if (!o.includes(matchKey)) return false
        }
      }

      // Price filter
      const tier = PRICE_TIERS[selectedPriceTier]
      if (p.retailPrice < tier.min || p.retailPrice > tier.max) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = p.name.toLowerCase().includes(q)
        const matchCategory = p.category.toLowerCase().includes(q)
        const matchOrigin = p.origin.toLowerCase().includes(q)
        const matchDesc = (p.shortDesc || '').toLowerCase().includes(q)
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q))
        if (!matchName && !matchCategory && !matchOrigin && !matchDesc && !matchTags) {
          return false
        }
      }

      // Stock filter
      if (inStockOnly && p.stockStatus === 'OUT_OF_STOCK') {
        return false
      }

      // Grade filter
      if (selectedGrade !== 'all') {
        if (selectedGrade === 'grade-a-plus' && !p.grade.includes('A+')) return false
        if (selectedGrade === 'grade-a' && !p.grade.includes('Grade A')) return false
      }

      return true
    })
  }, [
    products,
    selectedCategory,
    selectedOrigin,
    selectedPriceTier,
    searchQuery,
    inStockOnly,
    selectedGrade,
  ])

  // Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts]

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.retailPrice - b.retailPrice)
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.retailPrice - a.retailPrice)
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      // Featured first
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }

    return list
  }, [filteredProducts, sortBy])

  // Count active filters
  const activeFiltersCount =
    (selectedOrigin !== 'All Origins' ? 1 : 0) +
    (selectedPriceTier !== 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedGrade !== 'all' ? 1 : 0)

  const resetAllFilters = () => {
    setSelectedCategory('all')
    setSelectedOrigin('All Origins')
    setSelectedPriceTier(0)
    setSearchQuery('')
    setInStockOnly(false)
    setSelectedGrade('all')
    setSortBy('featured')
  }

  const displayedProducts = sortedProducts.slice(0, visibleCount)

  return (
    <div className={`min-h-screen bg-[#FDFBF7] text-[#17233B] ${embedded ? 'pt-8 sm:pt-12' : 'pt-24 sm:pt-28'} pb-24`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* ── 1. Global Luxury Minimalist Header (Single Row: Title + Inline Controls) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D5]">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#17233B] tracking-tight">
              The Harvest Collection
            </h1>
            <span className="text-xs text-stone-400 font-normal">
              {sortedProducts.length} items
            </span>
          </div>

          {/* Inline Controls: Search + Filter Trigger + Sort */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* Search Input */}
            <div className="relative w-40 sm:w-56">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-[#9E9182] text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search harvests..."
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-full bg-white border border-[#EAE3D5] focus:outline-hidden focus:border-[#17233B] text-[#17233B] placeholder-[#9E9182]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-2 text-[#9E9182] hover:text-[#17233B] text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Refine / Filter Drawer Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#EAE3D5] bg-white hover:bg-stone-50 text-xs font-medium text-[#17233B] transition-colors"
            >
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#17233B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium bg-white border border-[#EAE3D5] rounded-full px-3 py-1.5 text-[#17233B] focus:outline-hidden focus:border-[#17233B] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* ── 2. Horizontal Category Navigation Pills (Apple/Bateel Style) ── */}
        <div className="overflow-x-auto scrollbar-hide flex gap-1.5 items-center pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#17233B] text-white shadow-2xs'
                : 'bg-white text-[#6B6055] hover:text-[#17233B] border border-[#EAE3D5]'
            }`}
          >
            All
          </button>
          {PRODUCT_CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.categorySlug === cat.slug).length
            const isSelected = selectedCategory === cat.slug
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#17233B] text-white shadow-2xs'
                    : 'bg-white text-[#6B6055] hover:text-[#17233B] border border-[#EAE3D5]'
                }`}
              >
                <span>{cat.name}</span>
                {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
              </button>
            )
          })}
        </div>

        {/* ── 3. Active Filter Badges (if any active) ── */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[#8C7E70]">Filtered by:</span>
            {selectedOrigin !== 'All Origins' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#EAE3D5] text-[#17233B] font-medium">
                {selectedOrigin.split(',')[0]}
                <button
                  type="button"
                  onClick={() => setSelectedOrigin('All Origins')}
                  className="hover:text-black font-bold"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedPriceTier !== 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#EAE3D5] text-[#17233B] font-medium">
                {PRICE_TIERS[selectedPriceTier].label}
                <button
                  type="button"
                  onClick={() => setSelectedPriceTier(0)}
                  className="hover:text-black font-bold"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#EAE3D5] text-[#17233B] font-medium">
                &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-black font-bold"
                >
                  ✕
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#EAE3D5] text-[#17233B] font-medium">
                In Stock Only
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-black font-bold"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[#B8934A] hover:text-[#17233B] font-semibold underline underline-offset-2 ml-1"
            >
              Reset
            </button>
          </div>
        )}

        {/* ── 4. Generous Full-Width Luxury Product Gallery Grid ── */}
        <div className="pt-2">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE3D5] p-16 text-center space-y-4">
              <span className="text-3xl text-[#B8934A]">✦</span>
              <h3 className="font-serif text-2xl font-normal text-[#17233B]">
                No items found
              </h3>
              <p className="text-xs text-[#7A6D5E] max-w-sm mx-auto">
                Try clearing your search keyword or origin filters.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#17233B] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#176B68] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedProducts.map((prod) => (
                  <ShopProductCard
                    key={prod.id}
                    product={prod}
                    priority={false}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>

              {/* Progressive Load More to protect DOM size and Mobile CPU */}
              {sortedProducts.length > visibleCount && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-10">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    className="px-8 py-3.5 rounded-full bg-[#17233B] hover:bg-[#203050] text-[#F3E5C8] font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer border border-[#C9A45C]/40 flex items-center gap-2"
                  >
                    <span>Load More Harvests ({sortedProducts.length - visibleCount} remaining)</span>
                    <span>↓</span>
                  </button>
                  {embedded && (
                    <Link
                      href="/shop"
                      className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider border border-stone-300 shadow-2xs transition-all flex items-center justify-center"
                    >
                      <span>View Entire Catalog →</span>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── 5. Global Standard Heritage & Quality Guarantee ── */}
        <section className="mt-20 pt-12 border-t border-[#EAE3D5]">
          <div className="max-w-4xl mx-auto text-center space-y-2 mb-10">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B8934A]">
              The Nuty Tales Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#17233B] font-normal">
              Purity at Origin. Perfection in Every Pack.
            </h2>
            <p className="text-xs text-[#7A6D5E] max-w-lg mx-auto font-light leading-relaxed">
              Every harvest is sorted by size and moisture index before hermetic nitrogen sealing under FSSAI license 22724441000048.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 text-center">
            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-xl text-[#B8934A]">🌱</span>
              <h4 className="font-serif font-semibold text-xs text-[#17233B]">
                Direct Orchard Sourcing
              </h4>
              <p className="text-[11px] text-[#7A6D5E] font-light leading-relaxed">
                Directly from family growers in Kashmir, California, and Afghanistan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-xl text-[#B8934A]">⚡</span>
              <h4 className="font-serif font-semibold text-xs text-[#17233B]">
                Nitrogen Flushed
              </h4>
              <p className="text-[11px] text-[#7A6D5E] font-light leading-relaxed">
                Hermetically sealed to lock out moisture and prevent oil degradation.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-xl text-[#B8934A]">🚚</span>
              <h4 className="font-serif font-semibold text-xs text-[#17233B]">
                Express Pan-India
              </h4>
              <p className="text-[11px] text-[#7A6D5E] font-light leading-relaxed">
                Insured air dispatch within 24 hours of packaging.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-xl text-[#B8934A]">🛡️</span>
              <h4 className="font-serif font-semibold text-xs text-[#17233B]">
                100% Purity Guarantee
              </h4>
              <p className="text-[11px] text-[#7A6D5E] font-light leading-relaxed">
                FSSAI certified and lab-tested for grade and aflatoxin safety.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Refine / Filter Drawer (Apple / Luxury Slide-Over) ── */}
      {isFilterDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[130] bg-black/40 backdrop-blur-xs flex justify-end"
          onClick={() => setIsFilterDrawerOpen(false)}
        >
          <div
            className="bg-white w-full max-w-sm h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-3">
                <h3 className="font-serif font-semibold text-base text-[#17233B]">
                  Refine Harvests
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs hover:bg-stone-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7E70] block">
                  Price:
                </span>
                <div className="space-y-1.5">
                  {PRICE_TIERS.map((tier, idx) => (
                    <label key={tier.label} className="flex items-center gap-2.5 text-xs text-[#5C4F41] cursor-pointer hover:text-[#17233B]">
                      <input
                        type="radio"
                        name="mob-price"
                        checked={selectedPriceTier === idx}
                        onChange={() => setSelectedPriceTier(idx)}
                        className="accent-[#17233B] w-3.5 h-3.5"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div className="space-y-2 border-t border-[#EAE3D5] pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7E70] block">
                  Origin:
                </span>
                <div className="space-y-1.5">
                  {ORIGINS.map((orig) => (
                    <label key={orig} className="flex items-center gap-2.5 text-xs text-[#5C4F41] cursor-pointer hover:text-[#17233B]">
                      <input
                        type="radio"
                        name="mob-origin"
                        checked={selectedOrigin === orig}
                        onChange={() => setSelectedOrigin(orig)}
                        className="accent-[#17233B] w-3.5 h-3.5"
                      />
                      <span>{orig}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="border-t border-[#EAE3D5] pt-4">
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#5C4F41] cursor-pointer hover:text-[#17233B]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#17233B] w-4 h-4 rounded"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE3D5] flex gap-2.5">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-2.5 rounded-full border border-[#EAE3D5] text-xs font-semibold hover:bg-stone-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#17233B] text-white text-xs font-semibold hover:bg-[#176B68]"
              >
                View ({sortedProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick View Sensory Modal ── */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
