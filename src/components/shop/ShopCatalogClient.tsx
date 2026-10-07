'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Product } from '@/lib/products-data'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import ShopProductCard from './ShopProductCard'
import QuickViewModal from './QuickViewModal'

interface ShopCatalogClientProps {
  products: Product[]
  initialCategory?: string
  initialOrigin?: string
  initialSort?: string
}

const ORIGIN_OPTIONS = [
  'All Origins',
  'Kashmir',
  'California',
  'Iran',
  'Afghanistan',
  'Bihar',
  'Turkey',
]

const PRICE_RANGES = [
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
  const [selectedPriceRangeIdx, setSelectedPriceRangeIdx] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>(initialSort)
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [selectedGrade, setSelectedGrade] = useState<string>('all')

  // UI States
  const [gridColumns, setGridColumns] = useState<3 | 4>(4)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

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
        !p.origin.toLowerCase().includes(selectedOrigin.toLowerCase())
      ) {
        return false
      }

      // Price filter
      const priceRange = PRICE_RANGES[selectedPriceRangeIdx]
      if (p.retailPrice < priceRange.min || p.retailPrice > priceRange.max) {
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
    selectedPriceRangeIdx,
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
      // featured
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    }
    return list
  }, [filteredProducts, sortBy])

  // Count active filters
  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedOrigin !== 'All Origins' ? 1 : 0) +
    (selectedPriceRangeIdx !== 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedGrade !== 'all' ? 1 : 0)

  const resetAllFilters = () => {
    setSelectedCategory('all')
    setSelectedOrigin('All Origins')
    setSelectedPriceRangeIdx(0)
    setSearchQuery('')
    setInStockOnly(false)
    setSelectedGrade('all')
    setSortBy('featured')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20 sm:pt-24 pb-20">
      {/* ── Top Ecommerce Trust Banner ── */}
      <div className="bg-[#17233B] text-white py-2.5 px-4 text-center border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-around text-[11px] font-semibold tracking-wider uppercase">
          <span className="flex items-center gap-1.5">
            <span>🚚</span>
            <span>Free Express Delivery on ₹1,999+</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <span>🌾</span>
            <span>100% Direct Orchard Harvest</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <span>⚡</span>
            <span>Nitrogen-Flushed Vacuum Freshness</span>
          </span>
          <span className="flex items-center gap-1.5 text-[#C9A45C]">
            <span>🛡️</span>
            <span>FSSAI &amp; GI Tag Certified</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ── Breadcrumb & Category Header ── */}
        <div className="space-y-2 border-b border-stone-200/80 pb-6 mb-6">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Link href="/" className="hover:text-[#176B68]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#17233B] font-bold">Shop</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="capitalize text-[#176B68] font-bold">
                  {selectedCategory}
                </span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#704B32]">
                Certified Origin Harvest · 2026 Collection
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17233B] tracking-tight">
                Premium Dry Fruits &amp; Gourmet Harvest
              </h1>
              <p className="text-sm text-stone-600 max-w-2xl mt-1.5">
                From high-altitude Kashmiri valleys to California orchards — discover raw,
                roasted, and bespoke dry fruit packages delivered sealed in vacuum-preserved HD packaging.
              </p>
            </div>

            {/* Quick Bulk Link */}
            <div className="flex-shrink-0">
              <Link
                href="/business-supply"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-[#17233B] hover:text-white border border-stone-200 text-xs font-bold text-[#17233B] transition-colors shadow-xs"
              >
                <span>🏢</span>
                <span>Wholesale &amp; Institutional Supply (5kg+) →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Visual Category Carousel Bar ── */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#17233B] text-white shadow-sm ring-1 ring-[#17233B]'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-[#176B68]'
              }`}
            >
              <span>🌰</span>
              <span>All Harvest</span>
              <span className="opacity-70 text-[10px]">({products.length})</span>
            </button>

            {PRODUCT_CATEGORIES.map((cat) => {
              const count = products.filter(
                (p) => p.categorySlug === cat.slug
              ).length
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.slug
                      ? 'bg-[#176B68] text-white shadow-sm ring-1 ring-[#176B68]'
                      : 'bg-white border border-stone-200 text-stone-700 hover:border-[#176B68]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="opacity-70 text-[10px]">({count})</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Modern Controls & Sorting Toolbar ── */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-stone-400">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search almonds, saffron, walnuts, makhana..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#176B68] text-[#17233B] placeholder-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 text-stone-400 hover:text-black text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Counts & Mobile Filter Trigger */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-[#17233B]"
            >
              <span>⚙️ Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#176B68] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
              Showing <strong className="text-[#17233B]">{sortedProducts.length}</strong> items
            </span>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-[#17233B] focus:outline-hidden focus:ring-2 focus:ring-[#176B68]"
              >
                <option value="featured">Featured &amp; Bestselling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Grid Switcher (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 border border-stone-200 rounded-xl p-1 bg-stone-50">
              <button
                type="button"
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  gridColumns === 4
                    ? 'bg-white shadow-xs text-[#17233B]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
                title="4 Column Grid"
              >
                ⊞ 4
              </button>
              <button
                type="button"
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  gridColumns === 3
                    ? 'bg-white shadow-xs text-[#17233B]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
                title="3 Column Grid"
              >
                ⊟ 3
              </button>
            </div>
          </div>
        </div>

        {/* ── Active Filters Bar ── */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-stone-500 font-semibold">Active Filters:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#176B68]/10 text-[#176B68] font-bold">
                Category: {selectedCategory}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-black font-extrabold"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedOrigin !== 'All Origins' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#704B32]/10 text-[#704B32] font-bold">
                Origin: {selectedOrigin}
                <button
                  type="button"
                  onClick={() => setSelectedOrigin('All Origins')}
                  className="hover:text-black font-extrabold"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedPriceRangeIdx !== 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-200 text-stone-800 font-bold">
                {PRICE_RANGES[selectedPriceRangeIdx].label}
                <button
                  type="button"
                  onClick={() => setSelectedPriceRangeIdx(0)}
                  className="hover:text-black font-extrabold"
                >
                  ✕
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-black font-extrabold"
                >
                  ✕
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                In Stock Only
                <button
                  type="button"
                  onClick={() => setInStockOnly(false)}
                  className="hover:text-black font-extrabold"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-stone-500 hover:text-red-600 underline font-semibold ml-2"
            >
              Clear All ({activeFiltersCount})
            </button>
          </div>
        )}

        {/* ── Main Catalog Grid + Faceted Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Faceted Filters (Desktop) */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-6 sticky top-28 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif font-bold text-base text-[#17233B]">
                  Refine Harvest
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs text-[#176B68] font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Price Range:
                </span>
                <div className="space-y-1.5">
                  {PRICE_RANGES.map((range, idx) => (
                    <label
                      key={range.label}
                      className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-black"
                    >
                      <input
                        type="radio"
                        name="price-range"
                        checked={selectedPriceRangeIdx === idx}
                        onChange={() => setSelectedPriceRangeIdx(idx)}
                        className="text-[#176B68] focus:ring-[#176B68]"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Origin Selection */}
              <div className="space-y-2.5 border-t border-stone-100 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Procurement Origin:
                </span>
                <div className="space-y-1.5">
                  {ORIGIN_OPTIONS.map((origin) => (
                    <label
                      key={origin}
                      className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-black"
                    >
                      <input
                        type="radio"
                        name="origin-filter"
                        checked={selectedOrigin === origin}
                        onChange={() => setSelectedOrigin(origin)}
                        className="text-[#176B68] focus:ring-[#176B68]"
                      />
                      <span>{origin}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Grade Filter */}
              <div className="space-y-2.5 border-t border-stone-100 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  Quality Grade:
                </span>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="grade-filter"
                      checked={selectedGrade === 'all'}
                      onChange={() => setSelectedGrade('all')}
                      className="text-[#176B68] focus:ring-[#176B68]"
                    />
                    <span>All Grades</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="grade-filter"
                      checked={selectedGrade === 'grade-a-plus'}
                      onChange={() => setSelectedGrade('grade-a-plus')}
                      className="text-[#176B68] focus:ring-[#176B68]"
                    />
                    <span>Grade A+ (Rare / Connoisseur)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-black">
                    <input
                      type="radio"
                      name="grade-filter"
                      checked={selectedGrade === 'grade-a'}
                      onChange={() => setSelectedGrade('grade-a')}
                      className="text-[#176B68] focus:ring-[#176B68]"
                    />
                    <span>Grade A (Export Quality)</span>
                  </label>
                </div>
              </div>

              {/* In Stock Only Checkbox */}
              <div className="border-t border-stone-100 pt-4">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-stone-700 cursor-pointer hover:text-black">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-[#176B68] focus:ring-[#176B68]"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>

              {/* Assurance Mini Card */}
              <div className="bg-[#FAF6EE] p-4 rounded-xl border border-stone-200 text-center space-y-1.5">
                <span className="text-xl">🛡️</span>
                <p className="text-[11px] font-bold text-[#17233B]">
                  Purity Guaranteed
                </p>
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  Every batch tested for moisture content, aflatoxins &amp; kernel grade before hermetic sealing.
                </p>
              </div>
            </div>
          </aside>

          {/* Right: Products Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
                <span className="text-5xl">🔍</span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  No Harvests Match Your Search
                </h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto">
                  Try adjusting your origin, price range, or category filter to discover available dry fruits and gift sets.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#17233B] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#176B68] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridColumns === 4 ? 'lg:grid-cols-3 xl:grid-cols-3' : 'lg:grid-cols-2'
                } gap-5 sm:gap-6`}
              >
                {sortedProducts.map((prod) => (
                  <ShopProductCard
                    key={prod.id}
                    product={prod}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Filter Drawer Modal ── */}
        {isMobileFilterOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[130] bg-black/60 backdrop-blur-xs flex justify-end md:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            <div
              className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#17233B]">
                    Filter Products
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Price Range:
                  </span>
                  {PRICE_RANGES.map((range, idx) => (
                    <label key={range.label} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="mob-price-range"
                        checked={selectedPriceRangeIdx === idx}
                        onChange={() => setSelectedPriceRangeIdx(idx)}
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>

                {/* Origin */}
                <div className="space-y-2 border-t pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Origin:
                  </span>
                  {ORIGIN_OPTIONS.map((orig) => (
                    <label key={orig} className="flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="mob-origin"
                        checked={selectedOrigin === orig}
                        onChange={() => setSelectedOrigin(orig)}
                      />
                      <span>{orig}</span>
                    </label>
                  ))}
                </div>

                {/* In Stock */}
                <div className="border-t pt-4">
                  <label className="flex items-center gap-2 text-xs font-semibold">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <span>In-Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex gap-2">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#17233B] text-white text-xs font-bold"
                >
                  Apply ({sortedProducts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── The Nutty Tales Purity Standard Pillars ── */}
        <section className="mt-20 pt-12 border-t border-stone-200/90">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
              The Nutty Tales Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
              Why Connoisseurs Choose Our Harvest
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Zero chemical polishing. Zero artificial bleaching. Only freshly sorted grade-A
              kernels delivered directly to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-xs">
              <span className="text-3xl">🌱</span>
              <h4 className="font-serif font-bold text-base text-[#17233B]">
                Direct Orchard Procurement
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                We contract directly with family orchards in Kashmir, California, and Nimroz to bypass middlemen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-xs">
              <span className="text-3xl">⚡</span>
              <h4 className="font-serif font-bold text-base text-[#17233B]">
                Nitrogen-Flushed Packaging
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Hermetically sealed with nitrogen flush to lock out moisture and prevent natural oil rancidity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-xs">
              <span className="text-3xl">🚚</span>
              <h4 className="font-serif font-bold text-base text-[#17233B]">
                Express Pan-India Logistics
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Dispatched within 24 hours via air express courier. Fully tracked with insured transit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center space-y-2 shadow-xs">
              <span className="text-3xl">🤝</span>
              <h4 className="font-serif font-bold text-base text-[#17233B]">
                Institutional &amp; Wholesale
              </h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                From 5kg bakeries to 500kg confectionery batches — get formal GST tax invoices and volume rates.
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
