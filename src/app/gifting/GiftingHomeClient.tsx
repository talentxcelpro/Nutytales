'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  GIFTING_CATEGORIES,
  GIFTING_OCCASIONS,
  GIFTING_RECIPIENTS,
  GIFTING_PRODUCTS,
  getBestsellingGifts,
  GiftingProduct,
} from '@/lib/gifting-marketplace-data'
import { useGiftingStore } from '@/hooks/useGiftingStore'
import QuickViewModal from '@/components/gifting/QuickViewModal'
import PersonalizationModal from '@/components/gifting/PersonalizationModal'
import CorporateQuoteModal from '@/components/gifting/CorporateQuoteModal'

const BESTSELLER_TABS = [
  'All',
  'Gift Hampers',
  'Dry Fruits',
  'Personalized',
  'Kashmiri Special',
  'Corporate',
]

export default function GiftingHomeClient() {
  const { addToCart, isInWishlist, toggleWishlist } = useGiftingStore()

  // State
  const [activeBestsellerTab, setActiveBestsellerTab] = useState('All')
  const [quickViewProduct, setQuickViewProduct] = useState<GiftingProduct | null>(null)
  const [personalizeProduct, setPersonalizeProduct] = useState<GiftingProduct | null>(null)
  const [corporateModalOpen, setCorporateModalOpen] = useState(false)
  const [allOccasionsOpen, setAllOccasionsOpen] = useState(false)
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null)

  // Current bestselling filtered list
  const bestsellingList = getBestsellingGifts(activeBestsellerTab)

  const handleQuickAdd = (product: GiftingProduct) => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.primaryImage,
      variant: 'Standard Gift Box',
    })
    setAddedItemToast(product.name)
    setTimeout(() => setAddedItemToast(null), 2500)
  }

  return (
    <div className="bg-[#FAF7F2] text-[#17233B]">
      {/* Toast Notification when adding to cart */}
      {addedItemToast && (
        <div className="fixed bottom-16 sm:bottom-8 right-6 z-50 bg-[#0B2521] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C9A45C]/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200 text-xs">
          <span className="text-[#C9A45C] text-base">✓</span>
          <div>
            <strong className="block text-white">Added to Basket!</strong>
            <span className="text-stone-300 text-[11px] line-clamp-1">{addedItemToast}</span>
          </div>
        </div>
      )}

      {/* ── A. HERO SECTION (Image 2 exact editorial replica) ──────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5EFE6] via-[#FAF7F2] to-[#FAF7F2] border-b border-stone-200/60 pt-6 sm:pt-10 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Hero Card Container */}
          <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 shadow-md bg-[#FBF8F3]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[460px] lg:min-h-[500px]">
              {/* Left Editorial Copy */}
              <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-6 z-10">
                <div className="space-y-3">
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17233B] tracking-tight leading-[1.14]">
                    Gifts for <br />
                    <span className="text-[#0B2521]">Every Occasion</span> <br />
                    and Every Relationship.
                  </h1>
                  <p className="text-stone-600 text-xs sm:text-sm lg:text-base font-light leading-relaxed max-w-md pt-1">
                    Thoughtful gifts. Authentic products. Pan-India &amp; global delivery. Make every moment special with Nuty Tales.
                  </p>
                </div>

                {/* Primary Hero CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/gifting/explore"
                    className="px-7 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Shop All Gifts</span>
                    <span>→</span>
                  </Link>

                  <Link
                    href="/gifting/explore?category=gift-hampers"
                    className="px-6 py-3.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    Explore Gift Hampers
                  </Link>
                </div>

                {/* Trust Badges Strip (Hero Sub-Row) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-200/80 text-[11px] text-stone-600">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#704B32]">🚚</span>
                    <span className="font-medium leading-tight">Pan-India &amp; Global Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#704B32]">✨</span>
                    <span className="font-medium leading-tight">Personalization Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#704B32]">🛡️</span>
                    <span className="font-medium leading-tight">Premium &amp; Authentic Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#704B32]">🔒</span>
                    <span className="font-medium leading-tight">Secure Payments</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Image (Hamper Display) */}
              <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-full min-h-[320px] lg:min-h-[500px] w-full overflow-hidden bg-stone-100">
                <Image
                  src="/images/gifting/hero-hamper-showcase.jpg"
                  alt="Nuty Tales Gifting luxury hampers showcase"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FBF8F3] via-transparent to-transparent hidden lg:block w-24" />
              </div>
            </div>

            {/* Slider Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B2521]" />
              <span className="w-2 h-2 rounded-full bg-stone-400" />
              <span className="w-2 h-2 rounded-full bg-stone-400" />
            </div>
          </div>
        </div>
      </section>

      {/* ── B. SHOP BY CATEGORY (10 Circular Image Tiles) ───────────────────── */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center md:text-left mb-6 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
              Discover Our Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/gifting/explore"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#704B32] hover:text-[#0B2521]"
          >
            <span>Explore All</span>
            <span>→</span>
          </Link>
        </div>

        {/* 10 Circular Category Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4 text-center">
          {GIFTING_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/gifting/explore?category=${cat.slug}`}
              className="group flex flex-col items-center space-y-2 p-2 rounded-2xl transition-transform hover:-translate-y-1"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white border border-stone-200/90 shadow-sm p-0.5 group-hover:border-[#C9A45C] group-hover:shadow-md transition-all">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-800 group-hover:text-[#0B2521] leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* 10th Tile: More Categories */}
          <Link
            href="/gifting/explore"
            className="group flex flex-col items-center space-y-2 p-2 rounded-2xl transition-transform hover:-translate-y-1"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm group-hover:border-[#C9A45C] group-hover:text-[#0B2521] transition-all">
              <span className="text-2xl">⊞</span>
            </div>
            <span className="text-xs font-semibold text-stone-800 group-hover:text-[#0B2521] leading-tight">
              More Categories
            </span>
          </Link>
        </div>
      </section>

      {/* ── C. SHOP BY OCCASION (6 Cards Grid Matching Image 2) ─────────────── */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              Shop by Occasion
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Thoughtfully curated for life’s most cherished celebrations
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAllOccasionsOpen(true)}
            className="text-xs font-bold text-[#704B32] hover:text-[#0B2521] flex items-center gap-1 transition-colors"
          >
            <span>View All Occasions</span>
            <span>→</span>
          </button>
        </div>

        {/* 6 Visual Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {GIFTING_OCCASIONS.slice(0, 6).map((occ) => (
            <Link
              key={occ.id}
              href={`/gifting/explore?occasion=${occ.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-stone-100 shadow-sm hover:shadow-lg transition-all border border-stone-200/70"
            >
              <Image
                src={occ.image}
                alt={occ.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10192A]/90 via-[#10192A]/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white space-y-0.5">
                <h3 className="font-serif text-sm font-bold leading-tight drop-shadow-xs">
                  {occ.name}
                </h3>
                <p className="text-[10px] text-stone-300 font-light line-clamp-1">
                  {occ.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── D. BESTSELLING GIFTS (Product Grid with Tabs Matching Image 2) ───── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              Bestselling Gifts
            </h2>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {BESTSELLER_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveBestsellerTab(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeBestsellerTab === tab
                      ? 'bg-[#C9A45C] text-[#17233B] font-bold shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/gifting/explore?sortBy=bestselling"
            className="text-xs font-bold text-[#704B32] hover:text-[#0B2521] flex items-center gap-1 self-end md:self-auto"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {/* 6 Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {bestsellingList.slice(0, 6).map((product) => {
            const isWish = isInWishlist(product.slug)

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container with Wishlist Button */}
                  <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden p-2">
                    <Link href={`/gifting/product/${product.slug}`} className="block relative w-full h-full">
                      <Image
                        src={product.primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product.slug)}
                      className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center text-xs shadow-sm transition-transform active:scale-90"
                      aria-label="Save to wishlist"
                    >
                      {isWish ? '❤️' : '♡'}
                    </button>

                    {/* Quick View Button on Hover */}
                    <button
                      type="button"
                      onClick={() => setQuickViewProduct(product)}
                      className="absolute bottom-3 left-3 right-3 py-1.5 bg-[#0B2521]/90 hover:bg-[#0B2521] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs text-center"
                    >
                      Quick View
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 space-y-1.5">
                    <Link
                      href={`/gifting/product/${product.slug}`}
                      className="font-serif text-xs font-bold text-[#17233B] line-clamp-2 hover:text-[#C9A45C] transition-colors leading-tight min-h-[2.5rem]"
                    >
                      {product.name}
                    </Link>

                    {/* Stars and Reviews */}
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-amber-500 font-bold">★★★★★</span>
                      <span className="text-stone-400 font-medium">({product.reviewCount})</span>
                    </div>

                    {/* Price in INR */}
                    <div className="pt-0.5">
                      <span className="font-serif text-sm font-extrabold text-[#17233B]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-[10px] text-stone-400 line-through ml-1.5">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="p-3.5 pt-0">
                  {product.isPersonalizable ? (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="flex-1 py-2 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-[11px] rounded-xl transition-all shadow-xs text-center active:scale-95"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => setPersonalizeProduct(product)}
                        className="px-2.5 py-2 bg-[#0B2521] hover:bg-[#176B68] text-white rounded-xl text-[10px] font-bold transition-colors"
                        title="Personalize"
                      >
                        ✨
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="w-full py-2 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-[11px] rounded-xl transition-all shadow-xs text-center active:scale-95"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── E. DOUBLE EDITORIAL SPLIT BANNERS (Image 2 exact match) ────────── */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Split Banner: Personalized Gifts */}
          <div className="relative rounded-3xl overflow-hidden bg-[#FAF2E8] border border-[#C9A45C]/30 p-8 sm:p-10 flex flex-col justify-between min-h-[220px] shadow-sm">
            <div className="space-y-2 z-10 max-w-xs">
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#704B32]">
                Personalized Gifts
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Make it unique with names, messages and custom designs.
              </p>
              <div className="pt-2">
                <Link
                  href="/gifting/explore?category=personalized-gifts"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  <span>Explore Personalized Gifts</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right illustration / photo */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-90 pointer-events-none">
              <Image
                src="/images/gifting/banner-personalized-split.jpg"
                alt="Personalized wooden boxes"
                fill
                className="object-cover object-right"
              />
            </div>
          </div>

          {/* Right Split Banner: Corporate Gifting */}
          <div className="relative rounded-3xl overflow-hidden bg-[#EAEFEF] border border-stone-300 p-8 sm:p-10 flex flex-col justify-between min-h-[220px] shadow-sm">
            <div className="space-y-2 z-10 max-w-xs">
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0B2521]">
                Corporate Gifting
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Customized solutions for businesses of all sizes.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCorporateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0B2521] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  <span>Get Corporate Quote</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right photo */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-90 pointer-events-none">
              <Image
                src="/images/gifting/banner-corporate-split.jpg"
                alt="Corporate luxury gift boxes"
                fill
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── F. SHOP BY RECIPIENT ────────────────────────────────────────────── */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              Shop by Recipient
            </h2>
            <p className="text-xs text-stone-500 font-light mt-0.5">
              Personalized collections curated for every special bond
            </p>
          </div>
          <Link
            href="/gifting/explore"
            className="text-xs font-bold text-[#704B32] hover:text-[#0B2521] flex items-center gap-1"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {GIFTING_RECIPIENTS.map((rec) => (
            <Link
              key={rec.id}
              href={`/gifting/explore?recipient=${rec.slug}`}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#C9A45C] hover:shadow-md transition-all group flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-[#704B32] border border-amber-200/60 inline-block mb-1.5">
                  {rec.badge}
                </span>
                <h4 className="font-serif text-sm font-bold text-[#17233B] group-hover:text-[#0B2521]">
                  {rec.name}
                </h4>
                <p className="text-[11px] text-stone-500 font-light leading-snug line-clamp-2 mt-1">
                  {rec.description}
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#C9A45C] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Explore Gifts →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── G. WHY CHOOSE NUTY TALES (6 Rounded Pill Badges) ───────────────── */}
      <section className="py-12 bg-white/70 border-y border-stone-200/80 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              Why Choose Nuty Tales
            </h2>
            <p className="text-xs text-stone-500 font-light">
              Crafted with authentic Himalayan harvest, uncompromising quality, and personalized care
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-center">
            {[
              { icon: '🎁', title: 'Wide Range', sub: 'for Every Occasion' },
              { icon: '🛡️', title: 'Authentic &', sub: 'Premium Products' },
              { icon: '✍️', title: 'Personalization', sub: 'Available' },
              { icon: '✈️', title: 'Pan-India &', sub: 'Global Delivery' },
              { icon: '🔒', title: 'Secure', sub: 'Payments' },
              { icon: '💼', title: 'Bulk & Corporate', sub: 'Gifting Solutions' },
            ].map((pill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/90 shadow-2xs space-y-2 hover:bg-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white mx-auto flex items-center justify-center text-lg shadow-2xs border border-stone-200">
                  {pill.icon}
                </div>
                <div>
                  <strong className="block text-xs text-[#17233B]">{pill.title}</strong>
                  <span className="text-[10px] text-stone-500">{pill.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── H. THREE-COLUMN EDITORIAL BANNER ROW (Image 2 Bottom Row) ──────── */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Nuty Tales Premium */}
          <div className="relative rounded-3xl overflow-hidden bg-[#FBF6EE] border border-[#C9A45C]/40 p-6 flex flex-col justify-between min-h-[160px] shadow-sm">
            <div className="space-y-1 z-10 max-w-[180px]">
              <h4 className="font-serif text-lg font-bold text-[#17233B]">Nuty Tales Premium</h4>
              <p className="text-[11px] text-stone-500">Exclusive curated hampers</p>
              <div className="pt-2">
                <Link
                  href="/gifting/explore?category=gift-hampers&priceMin=2500"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#704B32] text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#593923] transition-colors"
                >
                  <span>Explore Premium</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-2/5 pointer-events-none">
              <Image
                src="/images/gifting/editorial-premium.jpg"
                alt="Nuty Tales Premium Hampers"
                fill
                className="object-cover object-right"
              />
            </div>
          </div>

          {/* 2. Kashmiri Special */}
          <div className="relative rounded-3xl overflow-hidden bg-[#FAF2E8] border border-stone-300 p-6 flex flex-col justify-between min-h-[160px] shadow-sm">
            <div className="space-y-1 z-10 max-w-[180px]">
              <h4 className="font-serif text-lg font-bold text-[#17233B]">Kashmiri Special</h4>
              <p className="text-[11px] text-stone-500">Authentic products from the valley</p>
              <div className="pt-2">
                <Link
                  href="/gifting/explore?category=kashmiri-specialties"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#704B32] text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#593923] transition-colors"
                >
                  <span>Shop Now</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-2/5 pointer-events-none">
              <Image
                src="/images/gifting/editorial-kashmiri.jpg"
                alt="Kashmiri Specialties"
                fill
                className="object-cover object-right"
              />
            </div>
          </div>

          {/* 3. Gift Hampers */}
          <div className="relative rounded-3xl overflow-hidden bg-[#F3EFE9] border border-stone-300 p-6 flex flex-col justify-between min-h-[160px] shadow-sm">
            <div className="space-y-1 z-10 max-w-[180px]">
              <h4 className="font-serif text-lg font-bold text-[#17233B]">Gift Hampers</h4>
              <p className="text-[11px] text-stone-500">Curated for every occasion</p>
              <div className="pt-2">
                <Link
                  href="/gifting/explore?category=gift-hampers"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#704B32] text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#593923] transition-colors"
                >
                  <span>View Hampers</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-2/5 pointer-events-none">
              <Image
                src="/images/gifting/editorial-hampers.jpg"
                alt="Curated gift hampers"
                fill
                className="object-cover object-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── ALL OCCASIONS EXPANDABLE MODAL ──────────────────────────────────── */}
      {allOccasionsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#10192A]/70 backdrop-blur-xs" onClick={() => setAllOccasionsOpen(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
                  Occasion Directory
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  Every Celebration, Covered
                </h3>
              </div>
              <button
                onClick={() => setAllOccasionsOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {GIFTING_OCCASIONS.map((occ) => (
                <Link
                  key={occ.id}
                  href={`/gifting/explore?occasion=${occ.slug}`}
                  onClick={() => setAllOccasionsOpen(false)}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-stone-200 hover:border-[#C9A45C] transition-all group"
                >
                  <strong className="block text-xs text-[#17233B] group-hover:text-[#0B2521]">
                    {occ.name}
                  </strong>
                  <span className="text-[11px] text-stone-500 font-light block mt-0.5">
                    {occ.subtitle}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals Mounted for Instant Interaction */}
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

      <CorporateQuoteModal
        isOpen={corporateModalOpen}
        onClose={() => setCorporateModalOpen(false)}
      />
    </div>
  )
}
