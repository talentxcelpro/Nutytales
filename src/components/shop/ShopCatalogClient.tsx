'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/products-data'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import ShopProductCard from './ShopProductCard'
import QuickViewModal from './QuickViewModal'
import DynamicCouponStrip from './DynamicCouponStrip'

interface ShopCatalogClientProps {
  products: Product[]
  initialCategory?: string
  initialOrigin?: string
  initialSort?: string
}

const ORIGINS = [
  'All Origins',
  'Kashmir, India',
  'California, USA',
  'Iran',
  'Afghanistan',
  'Bihar, India',
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
}: ShopCatalogClientProps) {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'all'
  )
  const [selectedOrigin, setSelectedOrigin] = useState<string>(
    initialOrigin || 'All Origins'
  )
  const [selectedPriceTier, setSelectedPriceTier] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>(initialSort)
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [selectedGrade, setSelectedGrade] = useState<string>('all')

  // UI States
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [promoCopied, setPromoCopied] = useState<boolean>(false)

  const copyPromo = () => {
    navigator.clipboard?.writeText('FIRSTHARVEST')
    setPromoCopied(true)
    setTimeout(() => setPromoCopied(false), 2000)
  }

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
      if (
        selectedOrigin !== 'All Origins' &&
        !p.origin.toLowerCase().includes(selectedOrigin.split(',')[0].toLowerCase())
      ) {
        return false
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
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q))
        if (!matchName && !matchCategory && !matchOrigin && !matchTags) {
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
      // featured first
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return list
  }, [filteredProducts, sortBy])

  // Count active filters
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B] pt-20">
      {/* ── 1. Elegant, Understated Announcement Strip (Bateel / Fortnum Style) ── */}
      <div className="bg-[#FAF5ED] border-b border-[#EAE3D5] text-[#5C4F41] py-2.5 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs tracking-wide">
          <span>
            Complimentary express pan-India delivery on orders over ₹999
          </span>
          <span className="hidden sm:inline text-stone-300">•</span>
          <span className="hidden sm:inline">
            Use code <strong className="font-mono text-[#17233B] font-semibold">FIRSTHARVEST</strong> for 10% off
          </span>
          <button
            type="button"
            onClick={copyPromo}
            className="text-[11px] font-semibold underline underline-offset-2 text-[#176B68] hover:text-[#17233B] transition-colors ml-1"
          >
            {promoCopied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-5 sm:pt-7 pb-24">
        {/* ── Compact Header & Main Controls Strip ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE3D5]">
          {/* Breadcrumb + Title + Count */}
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#17233B] tracking-tight">
              Harvest Collection
            </h1>
            <span className="text-xs text-[#8C7E70] font-normal">
              ({sortedProducts.length} items)
            </span>
          </div>

          {/* Inline Search + Sort + Mobile Filters */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* Search Input */}
            <div className="relative w-44 sm:w-60">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-[#9E9182] text-xs">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search almonds, saffron..."
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

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#EAE3D5] bg-white text-xs font-semibold text-[#17233B]"
            >
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#17233B] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
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
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* ── 2. Dynamic Coupons & Quick Perks Strip ── */}
        <div className="pt-3 pb-1">
          <DynamicCouponStrip />
        </div>

        {/* ── Compact Category Filter Strip (Low-Profile Pills) ── */}
        <div className="py-2.5 mb-5 border-b border-[#EAE3D5]/60 overflow-x-auto scrollbar-hide flex gap-1.5 items-center">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#17233B] text-white shadow-2xs'
                : 'bg-white text-[#6B6055] hover:text-[#17233B] border border-[#EAE3D5]'
            }`}
          >
            All ({products.length})
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

        {/* ── 5. Active Filters Chips ── */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
            <span className="text-[#8C7E70]">Active filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5ED] border border-[#EAE3D5] text-[#17233B] font-medium">
                {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-black font-bold"
                >
                  ✕
                </button>
              </span>
            )}
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
              className="text-[#B8934A] hover:text-[#17233B] font-semibold underline underline-offset-2 ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* ── 6. Main Catalog (Slim Sidebar Filters + Expanded Products Grid) ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Faceted Filters (Desktop Slim Sidebar) */}
          <aside className="hidden lg:block w-52 xl:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[#EAE3D5] p-3.5 space-y-3.5 sticky top-24 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                <h3 className="font-serif font-semibold text-xs tracking-wider uppercase text-[#17233B]">
                  Filter By
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] text-[#B8934A] hover:underline font-medium"
                  >
                    Reset ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7E70] block">
                  Price
                </span>
                <div className="space-y-1">
                  {PRICE_TIERS.map((tier, idx) => (
                    <label
                      key={tier.label}
                      className="flex items-center gap-2 text-[11px] text-[#5C4F41] cursor-pointer hover:text-[#17233B] transition-colors py-0.5"
                    >
                      <input
                        type="radio"
                        name="price-tier"
                        checked={selectedPriceTier === idx}
                        onChange={() => setSelectedPriceTier(idx)}
                        className="text-[#17233B] focus:ring-[#17233B] accent-[#17233B] w-3 h-3"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origin */}
              <div className="space-y-1.5 border-t border-[#F0EBE1] pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7E70] block">
                  Origin
                </span>
                <div className="space-y-1">
                  {ORIGINS.map((orig) => (
                    <label
                      key={orig}
                      className="flex items-center gap-2 text-[11px] text-[#5C4F41] cursor-pointer hover:text-[#17233B] transition-colors py-0.5"
                    >
                      <input
                        type="radio"
                        name="origin-tier"
                        checked={selectedOrigin === orig}
                        onChange={() => setSelectedOrigin(orig)}
                        className="text-[#17233B] focus:ring-[#17233B] accent-[#17233B] w-3 h-3"
                      />
                      <span>{orig}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality Grade */}
              <div className="space-y-1.5 border-t border-[#F0EBE1] pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7E70] block">
                  Grade
                </span>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-[11px] text-[#5C4F41] cursor-pointer hover:text-[#17233B] py-0.5">
                    <input
                      type="radio"
                      name="grade-tier"
                      checked={selectedGrade === 'all'}
                      onChange={() => setSelectedGrade('all')}
                      className="accent-[#17233B] w-3 h-3"
                    />
                    <span>All Grades</span>
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-[#5C4F41] cursor-pointer hover:text-[#17233B] py-0.5">
                    <input
                      type="radio"
                      name="grade-tier"
                      checked={selectedGrade === 'grade-a-plus'}
                      onChange={() => setSelectedGrade('grade-a-plus')}
                      className="accent-[#17233B] w-3 h-3"
                    />
                    <span>Grade A+ (Reserve)</span>
                  </label>
                  <label className="flex items-center gap-2 text-[11px] text-[#5C4F41] cursor-pointer hover:text-[#17233B] py-0.5">
                    <input
                      type="radio"
                      name="grade-tier"
                      checked={selectedGrade === 'grade-a'}
                      onChange={() => setSelectedGrade('grade-a')}
                      className="accent-[#17233B] w-3 h-3"
                    />
                    <span>Grade A (Export)</span>
                  </label>
                </div>
              </div>

              {/* In-Stock */}
              <div className="border-t border-[#F0EBE1] pt-2.5">
                <label className="flex items-center gap-2 text-[11px] font-medium text-[#5C4F41] cursor-pointer hover:text-[#17233B]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded accent-[#17233B] w-3.5 h-3.5"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Wholesale Prompt (Compact) */}
              <div className="bg-[#FAF5ED] p-2.5 rounded-xl border border-[#EAE3D5] text-center space-y-1">
                <p className="text-[10px] font-semibold text-[#17233B]">
                  Wholesale Sacks (5kg+)?
                </p>
                <Link
                  href="/business-supply"
                  className="inline-block text-[10px] font-bold text-[#176B68] hover:underline"
                >
                  Business Supply →
                </Link>
              </div>
            </div>
          </aside>

          {/* Right: Products Grid (Expanded) */}
          <div className="flex-1 min-w-0">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#EAE3D5] p-16 text-center space-y-4">
                <span className="text-4xl text-[#B8934A]">✦</span>
                <h3 className="font-serif text-2xl font-normal text-[#17233B]">
                  No products found
                </h3>
                <p className="text-sm text-[#7A6D5E] max-w-sm mx-auto">
                  Try clearing your filters or search keywords to view our complete collection.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-full bg-[#17233B] text-white font-medium text-xs uppercase tracking-wider hover:bg-[#176B68] transition-colors"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {sortedProducts.map((prod, idx) => (
                  <React.Fragment key={prod.id}>
                    <ShopProductCard
                      product={prod}
                      onQuickView={(p) => setQuickViewProduct(p)}
                    />

                    {/* Editorial Breakout #1: Saffron Terroir Spotlight (rendered after 3rd item when looking at all) */}
                    {idx === 2 && selectedCategory === 'all' && (
                      <div className="bg-[#FAF5ED] rounded-3xl border border-[#EAE3D5] p-6 sm:p-7 flex flex-col justify-between text-[#17233B] relative overflow-hidden group">
                        <div className="space-y-3 relative z-10">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B8934A] block">
                            Terroir Spotlight · Pampore Plateau
                          </span>
                          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#17233B] leading-snug">
                            The Saffron Soils of Karewa
                          </h3>
                          <p className="text-xs text-[#7A6D5E] font-light leading-relaxed">
                            Glacial-alluvial clay at 1,600m altitude imparts Nuty Tales Mongra Saffron with over 300% the natural crocin color index of commercial market grades.
                          </p>
                        </div>
                        <div className="pt-6 relative z-10 border-t border-[#EAE3D5]">
                          <button
                            type="button"
                            onClick={() => setSelectedCategory('saffron')}
                            className="text-xs font-semibold uppercase tracking-wider text-[#17233B] hover:text-[#176B68] flex items-center gap-1"
                          >
                            <span>Explore Saffron Harvest</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Editorial Breakout #2: The Connoisseur Morning Ritual (rendered after 6th item) */}
                    {idx === 5 && selectedCategory === 'all' && (
                      <div className="bg-[#FAF5ED] rounded-3xl border border-[#EAE3D5] p-6 sm:p-7 flex flex-col justify-between text-[#17233B] relative overflow-hidden group">
                        <div className="space-y-3 relative z-10">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B8934A] block">
                            Ayurvedic Connoisseur Ritual
                          </span>
                          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#17233B] leading-snug">
                            The Himalayan Morning Pair
                          </h3>
                          <p className="text-xs text-[#7A6D5E] font-light leading-relaxed">
                            5 water-soaked Kashmiri Mamra almonds paired with a spoonful of raw Acacia honey provides lasting mental acuity and natural morning vitality.
                          </p>
                        </div>
                        <div className="pt-6 relative z-10 border-t border-[#EAE3D5]">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategory('almonds')
                            }}
                            className="text-xs font-semibold uppercase tracking-wider text-[#17233B] hover:text-[#176B68] flex items-center gap-1"
                          >
                            <span>View Kashmiri Mamra</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── 7. Mobile Filter Drawer ── */}
        {isMobileFilterOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[130] bg-black/50 backdrop-blur-xs flex justify-end lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <div
              className="bg-white w-full max-w-xs h-full p-4 overflow-y-auto space-y-4 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#EAE3D5] pb-2.5">
                  <h3 className="font-serif font-semibold text-sm text-[#17233B]">
                    Filters
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7E70] block">
                    Price:
                  </span>
                  {PRICE_TIERS.map((tier, idx) => (
                    <label key={tier.label} className="flex items-center gap-2 text-[11px] text-[#5C4F41] py-0.5">
                      <input
                        type="radio"
                        name="mob-price"
                        checked={selectedPriceTier === idx}
                        onChange={() => setSelectedPriceTier(idx)}
                        className="accent-[#17233B] w-3 h-3"
                      />
                      <span>{tier.label}</span>
                    </label>
                  ))}
                </div>

                {/* Origin */}
                <div className="space-y-1.5 border-t border-[#EAE3D5] pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7E70] block">
                    Origin:
                  </span>
                  {ORIGINS.map((orig) => (
                    <label key={orig} className="flex items-center gap-2 text-[11px] text-[#5C4F41] py-0.5">
                      <input
                        type="radio"
                        name="mob-origin"
                        checked={selectedOrigin === orig}
                        onChange={() => setSelectedOrigin(orig)}
                        className="accent-[#17233B] w-3 h-3"
                      />
                      <span>{orig}</span>
                    </label>
                  ))}
                </div>

                {/* Stock */}
                <div className="border-t border-[#EAE3D5] pt-3">
                  <label className="flex items-center gap-2 text-[11px] font-medium text-[#5C4F41]">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-[#17233B] w-3.5 h-3.5"
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE3D5] flex gap-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex-1 py-2.5 rounded-full border border-[#EAE3D5] text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#17233B] text-white text-xs font-semibold"
                >
                  Apply ({sortedProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 8. Understated Heritage & Quality Guarantee (Fortnum & Mason Style) ── */}
        <section className="mt-24 pt-12 border-t border-[#EAE3D5]">
          <div className="max-w-4xl mx-auto text-center space-y-3 mb-12">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#B8934A]">
              The Nuty Tales Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#17233B] font-normal">
              Purity at Origin. Perfection in Every Pack.
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6D5E] max-w-xl mx-auto font-light leading-relaxed">
              Every nut, kernel, and saffron strand is sorted by size and moisture index before hermetic nitrogen sealing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-2xl text-[#B8934A]">🌱</span>
              <h4 className="font-serif font-semibold text-sm text-[#17233B]">
                Direct Orchard Sourcing
              </h4>
              <p className="text-xs text-[#7A6D5E] font-light leading-relaxed">
                Directly from family growers in Kashmir, California, and Afghanistan.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-2xl text-[#B8934A]">⚡</span>
              <h4 className="font-serif font-semibold text-sm text-[#17233B]">
                Nitrogen Flushed
              </h4>
              <p className="text-xs text-[#7A6D5E] font-light leading-relaxed">
                Hermetically sealed to lock out moisture and prevent natural oil degradation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-2xl text-[#B8934A]">🚚</span>
              <h4 className="font-serif font-semibold text-sm text-[#17233B]">
                Express Pan-India
              </h4>
              <p className="text-xs text-[#7A6D5E] font-light leading-relaxed">
                Insured transit with express air dispatch within 24 hours of packing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EAE3D5] space-y-2">
              <span className="text-2xl text-[#B8934A]">🛡️</span>
              <h4 className="font-serif font-semibold text-sm text-[#17233B]">
                100% Purity Guarantee
              </h4>
              <p className="text-xs text-[#7A6D5E] font-light leading-relaxed">
                FSSAI certified and lab-tested for grade and aflatoxin safety.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Quick View Modal ── */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
