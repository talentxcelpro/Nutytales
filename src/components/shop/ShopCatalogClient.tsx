'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products-data'
import { PRODUCT_CATEGORIES } from '@/lib/constants'
import ShopProductCard from './ShopProductCard'
import QuickViewModal from './QuickViewModal'
import BestsellerBundles from './BestsellerBundles'
import SocialProofToast from './SocialProofToast'
import ExitIntentModal from './ExitIntentModal'
import HealthGoalFilter, { HEALTH_GOALS } from './HealthGoalFilter'

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
  const router = useRouter()

  // Filter & Search States
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
  const [activeHealthGoal, setActiveHealthGoal] = useState<string>('all')
  const [activeShoppingMode, setActiveShoppingMode] = useState<
    'all' | 'bundles' | 'deals' | 'kashmir' | 'protein' | 'gifting'
  >('all')

  // UI States
  const [gridColumns, setGridColumns] = useState<3 | 4>(4)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [voucherCopied, setVoucherCopied] = useState<boolean>(false)
  const [cartCount, setCartCount] = useState<number>(0)
  const [cartTotal, setCartTotal] = useState<number>(0)

  // Countdown timer for promo urgency
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 41,
    seconds: 29,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        return { hours: 2, minutes: 30, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Listen to Cart updates for floating bottom bar
  const refreshCartState = () => {
    try {
      const items = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      setCartCount(items.reduce((acc: number, i: { quantity?: number }) => acc + (i.quantity || 1), 0))
      setCartTotal(items.reduce((acc: number, i: { totalPrice?: number }) => acc + (i.totalPrice || 0), 0))
    } catch {
      setCartCount(0)
      setCartTotal(0)
    }
  }

  useEffect(() => {
    refreshCartState()
    window.addEventListener('nt_cart_updated', refreshCartState)
    return () => window.removeEventListener('nt_cart_updated', refreshCartState)
  }, [])

  const copyPromoCode = () => {
    navigator.clipboard?.writeText('FIRSTHARVEST')
    setVoucherCopied(true)
    setTimeout(() => setVoucherCopied(false), 2500)
  }

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Shopping Mode Quick Filter
      if (activeShoppingMode === 'deals' && (!p.mrp || p.mrp <= p.retailPrice)) {
        return false
      }
      if (activeShoppingMode === 'kashmir' && !p.origin.toLowerCase().includes('kashmir')) {
        return false
      }
      if (
        activeShoppingMode === 'protein' &&
        !['almonds', 'cashews', 'seeds', 'makhana'].includes(p.categorySlug)
      ) {
        return false
      }
      if (activeShoppingMode === 'gifting' && p.categorySlug !== 'gift-packs') {
        return false
      }

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

      // Health Goal filter
      if (activeHealthGoal !== 'all') {
        const goalObj = HEALTH_GOALS.find((g) => g.id === activeHealthGoal)
        if (goalObj && goalObj.tagMatch.length > 0) {
          const matchTag = p.tags?.some((t) =>
            goalObj.tagMatch.some((m) => t.toLowerCase().includes(m))
          )
          const matchCat = goalObj.tagMatch.some((m) =>
            p.categorySlug.toLowerCase().includes(m)
          )
          const matchName = goalObj.tagMatch.some((m) =>
            p.name.toLowerCase().includes(m)
          )
          if (!matchTag && !matchCat && !matchName) return false
        }
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
    activeShoppingMode,
    selectedCategory,
    selectedOrigin,
    selectedPriceRangeIdx,
    activeHealthGoal,
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
    (selectedPriceRangeIdx !== 0 ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (selectedGrade !== 'all' ? 1 : 0) +
    (activeHealthGoal !== 'all' ? 1 : 0) +
    (activeShoppingMode !== 'all' ? 1 : 0)

  const resetAllFilters = () => {
    setSelectedCategory('all')
    setSelectedOrigin('All Origins')
    setSelectedPriceRangeIdx(0)
    setSearchQuery('')
    setInStockOnly(false)
    setSelectedGrade('all')
    setActiveHealthGoal('all')
    setActiveShoppingMode('all')
    setSortBy('featured')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20 sm:pt-24 pb-28">
      {/* ── Top Urgency Promo Ribbon ── */}
      <div className="bg-linear-to-r from-[#17233B] via-[#704B32] to-[#17233B] text-white py-2.5 px-4 text-center border-b border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="bg-[#C9A45C] text-[#17233B] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              NEW CUSTOMER PERK
            </span>
            <span>
              Flat 10% OFF + Free 100g Kashmiri Akhrot Sample with code{' '}
              <strong className="text-[#C9A45C] font-mono tracking-wider">
                FIRSTHARVEST
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-300 text-[11px] font-mono">
              ⚡ Ends in{' '}
              <strong className="text-white">
                {String(timeLeft.hours).padStart(2, '0')}h:
                {String(timeLeft.minutes).padStart(2, '0')}m:
                {String(timeLeft.seconds).padStart(2, '0')}s
              </strong>
            </span>
            <button
              type="button"
              onClick={copyPromoCode}
              className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold uppercase tracking-wider transition-colors border border-white/20 active:scale-95"
            >
              {voucherCopied ? '✓ Copied!' : 'Copy Code'}
            </button>
          </div>
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
                Guaranteed Fresh Harvest · 2026 Reserve
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17233B] tracking-tight">
                Shop Premium Dry Fruits, Nuts &amp; Saffron
              </h1>
              <p className="text-sm text-stone-600 max-w-2xl mt-1.5 leading-relaxed">
                100% natural, nitrogen-flushed, and farm-graded. Zero chemical polishing. Free express Pan-India insured delivery on orders ₹999+.
              </p>
            </div>

            {/* Quick Bulk Link */}
            <div className="flex items-center gap-3">
              <Link
                href="/business-supply"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-[#17233B] hover:text-white border border-stone-200 text-xs font-bold text-[#17233B] transition-colors shadow-xs"
              >
                <span>🏢</span>
                <span>Wholesale &amp; HORECA (5kg+) →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Curated Shopping Mode Tabs (Zero Friction Decision Making) ── */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => setActiveShoppingMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShoppingMode === 'all'
                ? 'bg-[#17233B] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            <span>🌟</span>
            <span>All Harvest ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveShoppingMode('bundles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShoppingMode === 'bundles'
                ? 'bg-[#C9A45C] text-[#17233B] shadow-sm ring-2 ring-[#C9A45C]'
                : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-50'
            }`}
          >
            <span>🔥</span>
            <span>Bestseller Bundles (Save 25%)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveShoppingMode('deals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShoppingMode === 'deals'
                ? 'bg-[#8A3B14] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            <span>⚡</span>
            <span>Flash Harvest Deals</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveShoppingMode('kashmir')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShoppingMode === 'kashmir'
                ? 'bg-[#176B68] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            <span>👑</span>
            <span>Kashmir Valley Reserve</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveShoppingMode('protein')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShoppingMode === 'protein'
                ? 'bg-[#17233B] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            <span>💪</span>
            <span>Gym &amp; High Protein</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveShoppingMode('gifting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeShoppingMode === 'gifting'
                ? 'bg-[#17233B] text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            <span>🎁</span>
            <span>Luxury Gifting Sets</span>
          </button>
        </div>

        {/* ── Bestseller Bundles Showcase (When in bundles or all mode) ── */}
        {(activeShoppingMode === 'bundles' || activeShoppingMode === 'all') && (
          <BestsellerBundles />
        )}

        {/* ── 1-Click Health & Lifestyle Goal Filter ── */}
        <HealthGoalFilter
          activeGoal={activeHealthGoal}
          onSelectGoal={(goal) => setActiveHealthGoal(goal)}
        />

        {/* ── Visual Category Carousel Bar ── */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#17233B] text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-[#176B68]'
              }`}
            >
              <span>🌰</span>
              <span>All Products</span>
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.slug
                      ? 'bg-[#176B68] text-white shadow-sm'
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
            <span className="text-stone-500 font-semibold">Active Refinements:</span>
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
            {activeHealthGoal !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-bold">
                Goal: {activeHealthGoal}
                <button
                  type="button"
                  onClick={() => setActiveHealthGoal('all')}
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
                  Try adjusting your origin, price range, or health goal filter to discover available dry fruits and gift sets.
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

        {/* ── Verified Customer Testimonials Carousel Strip ── */}
        <section className="mt-20 pt-12 border-t border-stone-200/90">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
              Loved by 12,000+ Indian Households
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
              Real Reviews from Real Connoisseurs
            </h2>
            <div className="flex items-center justify-center gap-2 text-amber-500 font-bold text-base">
              <span>★★★★★</span>
              <span className="text-[#17233B] text-xs font-bold">
                4.9/5 Average Rating · Over 1,400+ Verified Purchases
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-500 font-bold">★★★★★</span>
                <span className="text-stone-400 text-[11px]">3 days ago</span>
              </div>
              <p className="font-serif italic text-stone-800 text-sm leading-relaxed">
                &ldquo;The Kashmiri Mamra almonds from Nutty Tales are on another level. So oil-rich and crunchy, completely different from imported grocery store nuts. Arrived in Mumbai within 48 hours in pristine vacuum packaging.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#17233B] block">Dr. Anita S.</strong>
                  <span className="text-[10px] text-stone-500">Verified Buyer · Mumbai</span>
                </div>
                <span className="text-[#176B68] text-[10px] font-bold">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-500 font-bold">★★★★★</span>
                <span className="text-stone-400 text-[11px]">1 week ago</span>
              </div>
              <p className="font-serif italic text-stone-800 text-sm leading-relaxed">
                &ldquo;Ordered the Royal Himalayan Breakfast bundle for my parents in Delhi. The Acacia honey with snow walnuts is heavenly. Free shipping and beautiful gold foil packaging made it feel like a luxury gift.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#17233B] block">Rohan Mehra</strong>
                  <span className="text-[10px] text-stone-500">Verified Buyer · New Delhi</span>
                </div>
                <span className="text-[#176B68] text-[10px] font-bold">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-500 font-bold">★★★★★</span>
                <span className="text-stone-400 text-[11px]">2 weeks ago</span>
              </div>
              <p className="font-serif italic text-stone-800 text-sm leading-relaxed">
                &ldquo;The Mongra Saffron color and aroma are authentic Kashmir grade. No artificial dye, just genuine deep crimson threads that fragrance the whole kitchen with 2 strands. Will never buy from anyone else.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#17233B] block">Kavita R.</strong>
                  <span className="text-[10px] text-stone-500">Verified Buyer · Bengaluru</span>
                </div>
                <span className="text-[#176B68] text-[10px] font-bold">✓ Verified Purchase</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Nutty Tales Purity Standard Pillars ── */}
        <section className="mt-16 pt-12 border-t border-stone-200/90">
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

      {/* ── Sticky Bottom Checkout Bar (When Cart Has Items) ── */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-[100] bg-[#17233B] text-white p-3.5 sm:p-4 border-t border-white/10 shadow-2xl backdrop-blur-md animate-slideUp">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">
                🛍️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    {cartCount} item{cartCount > 1 ? 's' : ''} in basket
                  </span>
                  <span className="text-[#C9A45C] font-extrabold text-sm">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                  <span>✓</span>
                  <span>Free Express Air Delivery Unlocked</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('nt_open_cart'))}
                className="hidden sm:block px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                View Basket
              </button>
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="px-5 py-2.5 rounded-xl bg-[#C9A45C] hover:bg-white text-[#17233B] text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              >
                <span>⚡ Instant Checkout</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Quick View Modal ── */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* ── Live Verified Orders Social Proof Ticker ── */}
      <SocialProofToast />

      {/* ── Leave-Prevention Exit Intent Modal ── */}
      <ExitIntentModal />
    </div>
  )
}
