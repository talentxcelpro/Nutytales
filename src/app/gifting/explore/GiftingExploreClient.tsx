'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  GIFTING_CATEGORIES,
  GIFTING_OCCASIONS,
  GIFTING_RECIPIENTS,
  GIFTING_PRODUCTS,
  GiftingProduct,
} from '@/lib/gifting-marketplace-data'
import { useGiftingStore } from '@/hooks/useGiftingStore'
import QuickViewModal from '@/components/gifting/QuickViewModal'
import PersonalizationModal from '@/components/gifting/PersonalizationModal'

export default function GiftingExploreClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToCart, isInWishlist, toggleWishlist } = useGiftingStore()

  // Initial params
  const initialCategory = searchParams.get('category') || 'all'
  const initialOccasion = searchParams.get('occasion') || 'all'
  const initialRecipient = searchParams.get('recipient') || 'all'
  const initialQuery = searchParams.get('q') || ''
  const initialMinPrice = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : 0
  const initialMaxPrice = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : 10000
  const initialSort = (searchParams.get('sortBy') as any) || 'featured'

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [selectedOccasion, setSelectedOccasion] = useState<string>(initialOccasion)
  const [selectedRecipient, setSelectedRecipient] = useState<string>(initialRecipient)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery)
  const [minPrice, setMinPrice] = useState<number>(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'bestselling'>(initialSort)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<GiftingProduct | null>(null)
  const [personalizeProduct, setPersonalizeProduct] = useState<GiftingProduct | null>(null)
  const [addedToast, setAddedToast] = useState<string | null>(null)

  // Filter computation
  const filteredProducts = useMemo(() => {
    let list = [...GIFTING_PRODUCTS]

    // Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.contents.some((c) => c.toLowerCase().includes(q))
      )
    }

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categorySlug === selectedCategory)
    }

    // Occasion
    if (selectedOccasion !== 'all') {
      list = list.filter((p) => p.occasions.includes(selectedOccasion))
    }

    // Recipient
    if (selectedRecipient !== 'all') {
      list = list.filter((p) => p.recipients.includes(selectedRecipient))
    }

    // Price
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice)

    // Sort
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'bestselling') list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
    else list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))

    return list
  }, [searchQuery, selectedCategory, selectedOccasion, selectedRecipient, minPrice, maxPrice, sortBy])

  const handleResetFilters = () => {
    setSelectedCategory('all')
    setSelectedOccasion('all')
    setSelectedRecipient('all')
    setSearchQuery('')
    setMinPrice(0)
    setMaxPrice(10000)
    setSortBy('featured')
  }

  const handleQuickAdd = (p: GiftingProduct) => {
    addToCart({
      productId: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      quantity: 1,
      image: p.primaryImage,
    })
    setAddedToast(p.name)
    setTimeout(() => setAddedToast(null), 2500)
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Toast */}
      {addedToast && (
        <div className="fixed bottom-16 sm:bottom-8 right-6 z-50 bg-[#0B2521] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C9A45C]/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200 text-xs">
          <span className="text-[#C9A45C] text-base">✓</span>
          <div>
            <strong className="block text-white">Added to Basket!</strong>
            <span className="text-stone-300 text-[11px] line-clamp-1">{addedToast}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Link href="/gifting" className="hover:text-[#0B2521]">Gifting</Link>
            <span>/</span>
            <span className="text-[#0B2521] font-semibold">Catalog</span>
            {selectedCategory !== 'all' && (
              <>
                <span>/</span>
                <span className="text-[#C9A45C] font-semibold">
                  {GIFTING_CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                </span>
              </>
            )}
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-[#17233B]">
            All Gifting Collections
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Showing {filteredProducts.length} authentic handcrafted hampers and celebration gifts
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 flex items-center gap-2"
          >
            <span>⚙️</span>
            <span>Filters ({[selectedCategory !== 'all', selectedOccasion !== 'all', selectedRecipient !== 'all'].filter(Boolean).length})</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 focus:outline-hidden focus:border-[#C9A45C]"
            >
              <option value="featured">Featured Picks</option>
              <option value="bestselling">Bestselling First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:col-span-3 space-y-6 ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          } bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs text-xs`}
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-[#17233B] text-sm flex items-center gap-2">
              <span>⚙️</span>
              <span>Filter Catalogue</span>
            </h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[11px] text-[#C9A45C] hover:underline font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Search keyword within results */}
          <div className="space-y-1.5">
            <label className="font-bold text-stone-700 block">Search Keywords</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Saffron, Walnut..."
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-stone-300 rounded-xl focus:bg-white focus:outline-hidden text-xs"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 block">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex justify-between items-center ${
                  selectedCategory === 'all'
                    ? 'bg-[#0B2521] text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-70">{GIFTING_PRODUCTS.length}</span>
              </button>
              {GIFTING_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex justify-between items-center ${
                    selectedCategory === c.slug
                      ? 'bg-[#0B2521] text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] opacity-70">
                    {GIFTING_PRODUCTS.filter((p) => p.categorySlug === c.slug).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Occasions */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 block">Occasion</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedOccasion('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex justify-between items-center ${
                  selectedOccasion === 'all'
                    ? 'bg-[#0B2521] text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>All Occasions</span>
              </button>
              {GIFTING_OCCASIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSelectedOccasion(o.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex justify-between items-center ${
                    selectedOccasion === o.slug
                      ? 'bg-[#0B2521] text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{o.name}</span>
                  <span className="text-[10px] opacity-70">
                    {GIFTING_PRODUCTS.filter((p) => p.occasions.includes(o.slug)).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <label className="font-bold text-stone-700 block">Recipient</label>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedRecipient('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex justify-between items-center ${
                  selectedRecipient === 'all'
                    ? 'bg-[#0B2521] text-white font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>All Recipients</span>
              </button>
              {GIFTING_RECIPIENTS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRecipient(r.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex justify-between items-center ${
                    selectedRecipient === r.slug
                      ? 'bg-[#0B2521] text-white font-bold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex justify-between items-center font-bold text-stone-700">
              <span>Price Range</span>
              <span className="font-mono text-[#0B2521]">₹{minPrice} - ₹{maxPrice}</span>
            </div>
            <div className="flex gap-2 text-xs">
              {[
                { label: '< ₹1,000', min: 0, max: 1000 },
                { label: '₹1k - ₹2.5k', min: 1000, max: 2500 },
                { label: '₹2.5k - ₹5k', min: 2500, max: 5000 },
                { label: '₹5,000+', min: 5000, max: 25000 },
              ].map((tier, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setMinPrice(tier.min)
                    setMaxPrice(tier.max)
                  }}
                  className="flex-1 py-1 px-1 bg-stone-100 hover:bg-stone-200 text-[10px] rounded-md font-semibold text-center"
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Products Grid */}
        <div className="lg:col-span-9 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
              <span className="text-4xl">🔍</span>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                No gifts match your selected filters
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range, clearing specific occasion filters, or searching for broader terms like &ldquo;Hamper&rdquo; or &ldquo;Dry Fruits&rdquo;.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {filteredProducts.map((product) => {
                const isWish = isInWishlist(product.slug)

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden p-2.5">
                        <Link href={`/gifting/product/${product.slug}`} className="block relative w-full h-full">
                          <Image
                            src={product.primaryImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
                            quality={90}
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
                          />
                        </Link>

                        {/* Badge */}
                        {product.badge && (
                          <span className="absolute top-4 left-4 bg-[#0B2521] text-[#C9A45C] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                            {product.badge}
                          </span>
                        )}

                        {/* Wishlist */}
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.slug)}
                          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center text-xs shadow-xs transition-transform active:scale-90"
                        >
                          {isWish ? '❤️' : '♡'}
                        </button>

                        {/* Quick View on Hover */}
                        <button
                          type="button"
                          onClick={() => setQuickViewProduct(product)}
                          className="absolute bottom-4 left-4 right-4 py-1.5 bg-[#0B2521]/90 hover:bg-[#0B2521] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-center"
                        >
                          Quick View
                        </button>
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32]">
                          {product.categoryName}
                        </span>
                        <Link
                          href={`/gifting/product/${product.slug}`}
                          className="font-serif text-sm font-bold text-[#17233B] line-clamp-2 hover:text-[#C9A45C] transition-colors leading-tight min-h-[2.4rem] block"
                        >
                          {product.name}
                        </Link>

                        {/* Stars */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-amber-500 font-bold">★★★★★</span>
                          <span className="text-stone-400 text-[11px]">({product.reviewCount})</span>
                        </div>

                        {/* Price */}
                        <div className="pt-1 flex items-baseline gap-2">
                          <span className="font-serif text-base font-extrabold text-[#17233B]">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-stone-400 line-through">
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="p-4 pt-0">
                      {product.isPersonalizable ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickAdd(product)}
                            className="flex-1 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs rounded-xl transition-all shadow-xs text-center active:scale-95"
                          >
                            Add to Cart
                          </button>
                          <button
                            type="button"
                            onClick={() => setPersonalizeProduct(product)}
                            className="px-3 py-2 bg-[#0B2521] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold transition-colors"
                            title="Personalize with Custom Name"
                          >
                            ✨
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickAdd(product)}
                          className="w-full py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs rounded-xl transition-all shadow-xs text-center active:scale-95"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenPersonalize={(p) => setPersonalizeProduct(p)}
      />

      <PersonalizationModal
        product={personalizeProduct}
        isOpen={!!personalizeProduct}
        onClose={() => setPersonalizeProduct(null)}
      />
    </div>
  )
}
