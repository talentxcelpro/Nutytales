'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GiftingProduct, GIFTING_PRODUCTS } from '@/lib/gifting-marketplace-data'
import { useGiftingStore, PIN_LOCATION_DATABASE } from '@/hooks/useGiftingStore'
import { GREETING_CARD_TEMPLATES } from '@/components/gifting/PersonalizationModal'

interface ProductDetailClientProps {
  product: GiftingProduct
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const { addToCart, isInWishlist, toggleWishlist, deliveryPincode } = useGiftingStore()

  // Gallery state
  const allImages = product.images && product.images.length > 0 ? product.images : [product.primaryImage]
  const [selectedImage, setSelectedImage] = useState(allImages[0])

  // Variant state
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  )

  // Quantity
  const [quantity, setQuantity] = useState(1)

  // Personalization
  const [recipientName, setRecipientName] = useState('')
  const [giftMessage, setGiftMessage] = useState('Wishing you happiness, good health, and wonderful moments.')
  const [selectedCard, setSelectedCard] = useState(GREETING_CARD_TEMPLATES[0].id)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [isGiftWrapped, setIsGiftWrapped] = useState(true)

  // PIN check state
  const [pinInput, setPinInput] = useState(deliveryPincode)
  const [pinResult, setPinResult] = useState<{ city: string; days: number } | null>(
    PIN_LOCATION_DATABASE[deliveryPincode] || null
  )

  // Active Tab
  const [activeTab, setActiveTab] = useState<'desc' | 'contents' | 'specs' | 'policies'>('desc')

  // Feedback toast
  const [addedToast, setAddedToast] = useState(false)

  // Computed Price
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentMrp = selectedVariant ? selectedVariant.mrp : product.mrp
  const isWish = isInWishlist(product.slug)

  // Related products
  const relatedGifts = GIFTING_PRODUCTS.filter(
    (p) => p.slug !== product.slug && (p.categorySlug === product.categorySlug || p.isBestseller)
  ).slice(0, 4)

  const handleCheckPin = () => {
    const clean = pinInput.trim().replace(/\D/g, '').slice(0, 6)
    if (clean.length === 6) {
      const match = PIN_LOCATION_DATABASE[clean]
      if (match) {
        setPinResult({ city: `${match.city}, ${match.state}`, days: match.days })
      } else {
        setPinResult({ city: `PIN ${clean}`, days: 3 })
      }
    }
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      quantity,
      image: selectedImage,
      variant: selectedVariant ? selectedVariant.name : 'Standard Pack',
      recipientName: recipientName.trim(),
      giftMessage: giftMessage.trim(),
      deliveryDate,
      isGiftWrapped,
    })
    setAddedToast(true)
    setTimeout(() => setAddedToast(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: currentPrice,
      quantity,
      image: selectedImage,
      variant: selectedVariant ? selectedVariant.name : 'Standard Pack',
      recipientName: recipientName.trim(),
      giftMessage: giftMessage.trim(),
      deliveryDate,
      isGiftWrapped,
    })
    router.push('/gifting/checkout')
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Toast */}
      {addedToast && (
        <div className="fixed bottom-16 sm:bottom-8 right-6 z-50 bg-[#0B2521] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C9A45C]/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200 text-xs">
          <span className="text-[#C9A45C] text-base">✓</span>
          <div>
            <strong className="block text-white">Added to Basket!</strong>
            <span className="text-stone-300 text-[11px]">{product.name}</span>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/gifting" className="hover:text-[#0B2521]">Gifting</Link>
        <span>/</span>
        <Link href={`/gifting/explore?category=${product.categorySlug}`} className="hover:text-[#0B2521]">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-[#0B2521] font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Grid: Gallery + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4 sticky top-28">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm p-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={92}
                className="object-cover"
              />
            </div>

            {/* Badge */}
            {product.badge && (
              <span className="absolute top-6 left-6 bg-[#0B2521] text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.slug)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center text-sm shadow-md transition-transform active:scale-90"
              aria-label="Wishlist"
            >
              {isWish ? '❤️' : '♡'}
            </button>
          </div>

          {/* Thumbnails Row */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white p-1 ${
                    selectedImage === img
                      ? 'border-[#C9A45C] shadow-sm'
                      : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill sizes="80px" quality={85} className="object-cover" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Trust Highlights Strip below image */}
          <div className="grid grid-cols-3 gap-2.5 p-4 bg-white rounded-2xl border border-stone-200 text-center text-xs">
            <div>
              <span className="text-base block">🛡️</span>
              <strong className="block text-[#17233B] text-[11px]">100% Authentic</strong>
              <span className="text-[10px] text-stone-500">GI Certified Origin</span>
            </div>
            <div>
              <span className="text-base block">✈️</span>
              <strong className="block text-[#17233B] text-[11px]">Air Express</strong>
              <span className="text-[10px] text-stone-500">Pan-India &amp; Global</span>
            </div>
            <div>
              <span className="text-base block">✨</span>
              <strong className="block text-[#17233B] text-[11px]">Tamper Proof</strong>
              <span className="text-[10px] text-stone-500">Vacuum Fresh Seal</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-stone-200 pb-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-[#704B32] border border-amber-200">
                {product.categoryName}
              </span>
              <span className="text-emerald-700 font-bold text-xs">● In Stock &amp; Ready to Ship</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B] leading-tight">
              {product.name}
            </h1>

            {product.subtitle && (
              <p className="text-xs text-stone-500 font-medium">{product.subtitle}</p>
            )}

            {/* Stars & Reviews */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <div className="flex items-center text-amber-500 font-bold">
                <span>★★★★★</span>
              </div>
              <span className="font-bold text-[#17233B]">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount} verified ratings)</span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 pt-3">
              <span className="font-serif text-3xl sm:text-4xl font-black text-[#17233B]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {currentMrp && currentMrp > currentPrice && (
                <>
                  <span className="text-base text-stone-400 line-through">
                    ₹{currentMrp.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-xs">
                    {Math.round(((currentMrp - currentPrice) / currentMrp) * 100)}% OFF
                  </span>
                </>
              )}
              <span className="text-[11px] text-stone-500 font-light">
                (Inclusive of all taxes &amp; luxury packaging)
              </span>
            </div>
          </div>

          {/* Product Variants (if applicable) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider block">
                Select Hamper Edition / Size:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#0B2521] bg-[#0B2521] text-white shadow-xs'
                        : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <strong className="block text-xs leading-snug">{v.name}</strong>
                    <span
                      className={`text-[11px] font-mono ${
                        selectedVariant?.id === v.id ? 'text-[#C9A45C]' : 'text-stone-500'
                      }`}
                    >
                      ₹{v.price.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery PIN Availability Check */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs">
            <span className="font-bold text-[#17233B] block">
              📍 Check Delivery Availability &amp; Air Express Speed:
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN"
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono text-xs focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCheckPin}
                className="px-4 py-2 bg-[#0B2521] text-white font-bold rounded-xl text-xs hover:bg-[#176B68] transition-colors"
              >
                Verify
              </button>
            </div>
            {pinResult && (
              <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-1">
                <span>✓</span>
                <span>
                  Delivery to <strong>{pinResult.city}</strong>: Order today, estimated delivery in {pinResult.days} business days via Express Air.
                </span>
              </p>
            )}
          </div>

          {/* Personalization Form (When Supported) */}
          {product.isPersonalizable && (
            <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#C9A45C]/50 space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2.5">
                <span className="text-base">✨</span>
                <div>
                  <strong className="text-xs text-[#17233B] block">Personalize This Gift</strong>
                  <span className="text-[10px] text-stone-500">
                    Complimentary custom name inscription and greeting card
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Recipient Name / Monogram Inscription
                </label>
                <input
                  type="text"
                  maxLength={product.personalizationOptions?.charLimit || 60}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. For Dearest Priya & Kabir"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl focus:border-[#C9A45C] focus:outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Personal Greeting Message (Inside Card)
                </label>
                <textarea
                  rows={2}
                  maxLength={250}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:border-[#C9A45C] focus:outline-hidden text-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="gift-wrap-check"
                  checked={isGiftWrapped}
                  onChange={(e) => setIsGiftWrapped(e.target.checked)}
                  className="w-4 h-4 text-[#0B2521] accent-[#0B2521] cursor-pointer"
                />
                <label htmlFor="gift-wrap-check" className="cursor-pointer font-medium text-stone-700 text-xs">
                  Include Complimentary Gold Satin Ribbon Gift Wrap &amp; Seal
                </label>
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-10 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-stone-50 rounded-l-xl transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono text-[#17233B]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-10 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-stone-50 rounded-r-xl transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 text-center"
              >
                Add to Cart
              </button>

              {/* Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-3 px-6 bg-[#0B2521] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 text-center"
              >
                Buy Now →
              </button>
            </div>
          </div>

          {/* Product Tabs: Description, Contents, Specs, Policies */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex border-b border-stone-200 gap-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('desc')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'desc'
                    ? 'text-[#0B2521] border-b-2 border-[#0B2521]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('contents')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'contents'
                    ? 'text-[#0B2521] border-b-2 border-[#0B2521]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Hamper Contents
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'specs'
                    ? 'text-[#0B2521] border-b-2 border-[#0B2521]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('policies')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'policies'
                    ? 'text-[#0B2521] border-b-2 border-[#0B2521]'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Delivery &amp; Returns
              </button>
            </div>

            <div className="py-4 text-xs text-stone-600 leading-relaxed">
              {activeTab === 'desc' && (
                <div className="space-y-3">
                  <p>{product.longDesc}</p>
                  {product.origin && (
                    <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                      <strong>Origin &amp; Harvest:</strong> {product.origin}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'contents' && (
                <ul className="space-y-2">
                  {product.contents.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[#C9A45C] text-sm">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">{k}</span>
                      <strong className="text-stone-800 text-xs">{v}</strong>
                    </div>
                  ))}
                  {product.fssaiNumber && (
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">FSSAI Certified</span>
                      <strong className="text-stone-800 text-xs">Lic. #{product.fssaiNumber}</strong>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'policies' && (
                <div className="space-y-2.5 text-xs">
                  <p>
                    <strong>Pan-India Air Dispatch:</strong> Orders placed before 1:00 PM are dispatched on the same business day via Bluedart / Delhivery Express Air.
                  </p>
                  <p>
                    <strong>Global Gifting:</strong> International delivery available to UAE, United Kingdom, and United States.
                  </p>
                  <p>
                    <strong>Damaged or Incorrect Items:</strong> Instant replacement or 100% refund guaranteed if transit damage occurs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Recommendation Carousel/Grid */}
      {relatedGifts.length > 0 && (
        <section className="pt-10 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#17233B]">
              You May Also Like
            </h3>
            <Link href="/gifting/explore" className="text-xs font-bold text-[#704B32] hover:text-[#0B2521]">
              View All Gifts →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedGifts.map((rel) => (
              <div
                key={rel.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group p-3 space-y-2"
              >
                <Link href={`/gifting/product/${rel.slug}`} className="block relative aspect-square rounded-xl overflow-hidden bg-stone-50">
                  <Image src={rel.primaryImage} alt={rel.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                </Link>
                <div>
                  <Link href={`/gifting/product/${rel.slug}`} className="font-serif text-xs font-bold text-[#17233B] line-clamp-1 hover:text-[#C9A45C]">
                    {rel.name}
                  </Link>
                  <span className="font-mono font-bold text-xs text-[#0B2521] block mt-1">
                    ₹{rel.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
