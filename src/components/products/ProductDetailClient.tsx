'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import ProductViewer3D, { ModelType } from '@/components/3d/ProductViewer3D'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail')
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(2) // 1kg default
  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // 5kg default
  const [quantity, setQuantity] = useState(1)
  const [addedMessage, setAddedMessage] = useState('')
  const [viewer3DOpen, setViewer3DOpen] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)

  // Multi-angle Gallery
  const defaultGallery = [
    product.image || '/images/almonds-pouch-250g.jpg',
    '/images/hero-lifestyle-bowl.png',
    '/images/crystal-gold-nut-bowls.jpg',
    '/images/luxury-hamper-jars.png',
  ]
  const gallery = product.images && product.images.length > 0 ? product.images : defaultGallery
  const [activeImage, setActiveImage] = useState(gallery[0])

  // Magnifier Zoom state
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Pincode checker
  const [pincode, setPincode] = useState('')
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null)
  const [isCheckingPincode, setIsCheckingPincode] = useState(false)

  // Track scroll for sticky bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const modelType: ModelType =
    product.slug.includes('box') || product.slug.includes('hamper')
      ? 'gift-box'
      : product.slug.includes('walnut')
      ? 'walnut-chest'
      : product.slug.includes('saffron') || product.slug.includes('honey')
      ? 'papier-mache'
      : 'pouch'

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0]
  const currentTier = product.b2bTiers[selectedTierIndex] || product.b2bTiers[0]

  const unitPrice =
    mode === 'retail'
      ? currentVariant.retailPrice
      : currentTier.pricePerKg * currentTier.minQtyKg

  const totalPrice = unitPrice * quantity

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return
    const rect = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pincode || pincode.length < 6) return
    setIsCheckingPincode(true)
    setTimeout(() => {
      setIsCheckingPincode(false)
      setDeliveryEstimate(`Express Air Dispatch: Guaranteed delivery to ${pincode} by Friday, Oct 9 (Complimentary Insured Shipping)`)
    }, 400)
  }

  const handleAddToCart = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const item = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        mode,
        sizeLabel: mode === 'retail' ? currentVariant.label : `${currentTier.minQtyKg} kg (Wholesale)`,
        unitPrice,
        quantity,
        totalPrice,
        image: activeImage || product.image,
      }
      existing.push(item)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setAddedMessage(`Added ${quantity} × ${product.name} to cart!`)
      setTimeout(() => setAddedMessage(''), 3000)
    } catch {
      // fallback
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nutty Tales! 👋\n\nI want to order *${product.name}*:\n• Pack: ${mode === 'retail' ? currentVariant.label : `${currentTier.minQtyKg} kg`}\n• Quantity: ${quantity} units (Total: ₹${totalPrice})\n• Grade: ${product.grade}\n\nPlease confirm availability and dispatch schedule!`
  )}`

  return (
    <div className="space-y-12">
      {/* ── Product Header Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images (7 cols on large) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Stage Image with Interactive HD Magnifier */}
          <div
            ref={imageContainerRef}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            className="relative aspect-square rounded-3xl overflow-hidden bg-[#FAF6EE] border border-stone-200/80 shadow-sm flex items-center justify-center cursor-crosshair group"
          >
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                quality={95}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-contain p-6 transition-transform duration-300 ${
                  isZoomed ? 'scale-125' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : undefined
                }
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300">
                <span className="text-7xl">🥜</span>
                <span className="text-xs uppercase font-bold tracking-widest text-stone-400 mt-2">
                  {product.category}
                </span>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none z-10">
              <span className="px-3 py-1 rounded-full bg-[#176B68] text-white text-[11px] font-bold shadow-sm">
                {product.origin}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/95 text-stone-800 text-[11px] font-bold border border-stone-200 shadow-sm">
                Grade: {product.grade}
              </span>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none z-10">
              <span className="px-2.5 py-1 rounded-full bg-[#17233B]/90 text-white text-[10px] font-bold shadow-sm">
                ★ 4.9 (148 Reviews)
              </span>
            </div>

            {/* Zoom hint badge */}
            <div className="absolute bottom-4 left-4 pointer-events-none opacity-70 group-hover:opacity-0 transition-opacity z-10">
              <span className="bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] text-stone-600 font-semibold shadow-xs">
                🔍 Hover to zoom in HD
              </span>
            </div>
          </div>

          {/* Multi-angle HD Thumbnails Row */}
          <div className="grid grid-cols-4 gap-3">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square rounded-2xl overflow-hidden bg-[#FAF6EE] border-2 transition-all p-2 flex items-center justify-center ${
                  activeImage === img
                    ? 'border-[#176B68] ring-2 ring-[#176B68]/30 scale-102 shadow-sm'
                    : 'border-stone-200 opacity-75 hover:opacity-100 hover:border-stone-400'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} angle ${idx + 1}`}
                  fill
                  quality={90}
                  sizes="100px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>

          {/* 3D Interactive Inspection Trigger */}
          <button
            type="button"
            onClick={() => setViewer3DOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#17233B] hover:bg-[#176B68] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all group active:scale-[0.99]"
          >
            <span className="w-2 h-2 rounded-full bg-[#C9A45C] group-hover:scale-125 transition-transform" />
            <span>Inspect Packaging in 3D (360° PBR Model)</span>
          </button>

          {/* Origin & Trust Strip */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 border-r border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">FSSAI License</span>
              <span className="text-emerald-800 font-bold text-xs mt-0.5 block">{FSSAI_NUMBER}</span>
            </div>
            <div className="p-2 border-r border-stone-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Shelf Life</span>
              <span className="text-stone-800 font-bold text-xs mt-0.5 block">{product.shelfLifeMonths} Months</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Preservatives</span>
              <span className="text-stone-800 font-bold text-xs mt-0.5 block">0% (Pure Harvest)</span>
            </div>
          </div>
        </div>

        {/* Right: Dual Commerce Engine (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#176B68]">
                {product.category}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 font-medium">{product.origin}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#17233B] mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#17233B]/70 mt-2 leading-relaxed">
              {product.shortDesc}
            </p>
          </div>

          {/* Mode Switcher: Retail vs Wholesale */}
          <div className="p-1.5 bg-[#17233B]/5 rounded-2xl flex gap-1 border border-[#17233B]/10">
            <button
              onClick={() => setMode('retail')}
              className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                mode === 'retail'
                  ? 'bg-white text-[#17233B] shadow-sm'
                  : 'text-[#17233B]/60 hover:text-[#17233B]'
              }`}
            >
              🛒 Retail Packs (250g – 1 kg)
            </button>
            <button
              onClick={() => setMode('wholesale')}
              className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                mode === 'wholesale'
                  ? 'bg-[#176B68] text-white shadow-sm'
                  : 'text-[#17233B]/60 hover:text-[#17233B]'
              }`}
            >
              📦 Wholesale Sacks (5 kg – 100 kg+)
            </button>
          </div>

          {/* Pricing & Selection Box */}
          <div className="bg-white p-6 rounded-3xl border border-[#17233B]/10 shadow-sm space-y-5">
            {mode === 'retail' ? (
              /* Retail Pack Size Selector */
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#17233B]/80">
                    Select Pack Size:
                  </label>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Vacuum Flushed Fresh Batch
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((v, idx) => {
                    const isSelected = selectedVariantIndex === idx
                    return (
                      <button
                        key={v.sizeG}
                        type="button"
                        onClick={() => setSelectedVariantIndex(idx)}
                        className={`p-3.5 rounded-2xl border text-center transition-all relative ${
                          isSelected
                            ? 'border-[#176B68] bg-[#176B68]/5 ring-2 ring-[#176B68] shadow-xs'
                            : 'border-stone-200 hover:border-[#176B68]/40 bg-white'
                        }`}
                      >
                        {idx === 2 && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#C9A45C] text-[#17233B] text-[8px] font-black uppercase px-2 py-0.2 rounded-full tracking-wider shadow-xs">
                            BEST VALUE
                          </span>
                        )}
                        <span className="block text-base font-bold text-[#17233B]">{v.label}</span>
                        <span className="block text-xs font-extrabold text-[#176B68] mt-0.5">
                          ₹{v.retailPrice.toLocaleString('en-IN')}
                        </span>
                        {v.mrp && (
                          <span className="text-[10px] text-stone-400 line-through block">
                            MRP ₹{v.mrp}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              /* Wholesale Ladder */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#17233B]/80">
                    Select Quantity Tier:
                  </label>
                  <span className="text-[10px] font-bold text-[#176B68] bg-[#176B68]/10 px-2 py-0.5 rounded border border-[#176B68]/20">
                    GST Invoice Included
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {product.b2bTiers.map((tier, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTierIndex(idx)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedTierIndex === idx
                          ? 'border-[#176B68] bg-[#176B68]/10 ring-2 ring-[#176B68]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <span className="block text-sm font-bold text-[#17233B]">
                        {tier.minQtyKg} kg+
                      </span>
                      <span className="block text-xs font-extrabold text-[#176B68] mt-0.5">
                        ₹{tier.pricePerKg} <span className="text-[10px] font-normal">/kg</span>
                      </span>
                      <span className="text-[10px] text-[#176B68] font-semibold block">
                        Save {tier.savingsPercent}%
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 text-xs text-[#17233B]/80 flex items-center justify-between">
                  <span>Need 100 kg or full pallet contracts?</span>
                  <Link
                    href={`/bulk-quote?product=${encodeURIComponent(product.name)}`}
                    className="font-bold text-[#176B68] hover:underline"
                  >
                    Request Bulk RFQ →
                  </Link>
                </div>
              </div>
            )}

            {/* Quantity Stepper & Price Calculation */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#17233B]/80">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-9 flex items-center justify-center font-bold text-stone-600 hover:bg-white transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-bold bg-white text-[#17233B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-9 flex items-center justify-center font-bold text-stone-600 hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-stone-400 font-bold block">
                  Total Payable
                </span>
                <span className="text-3xl font-black text-[#17233B]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {mode === 'wholesale' ? '(Excl. GST & Freight)' : '(Inclusive of all taxes)'}
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[#17233B] hover:bg-[#176B68] text-white font-bold rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>🛒</span>
                <span>Add to Basket</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-4 bg-[#C9A45C] hover:bg-[#b08e49] text-[#17233B] font-extrabold rounded-2xl shadow-md transition-all text-xs uppercase tracking-wider text-center active:scale-[0.98]"
              >
                Instant Buy Now →
              </button>
            </div>

            {/* WhatsApp Direct */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border-2 border-[#176B68] text-[#176B68] hover:bg-[#176B68]/5 font-bold rounded-2xl text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>Order Directly on WhatsApp Concierge</span>
            </a>

            {addedMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-semibold text-center animate-fade-in">
                ✓ {addedMessage}{' '}
                <button
                  onClick={() => window.dispatchEvent(new Event('nt_open_cart'))}
                  className="underline ml-2 font-bold"
                >
                  View Basket →
                </button>
              </div>
            )}
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              Estimated Delivery &amp; PAN-India Dispatch
            </span>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter 6-digit delivery PIN code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs text-[#17233B] focus:outline-none focus:ring-2 focus:ring-[#176B68]"
              />
              <button
                type="submit"
                disabled={pincode.length < 6 || isCheckingPincode}
                className="px-5 py-2.5 bg-[#17233B] hover:bg-[#176B68] disabled:bg-stone-300 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {isCheckingPincode ? 'Checking...' : 'Check'}
              </button>
            </form>
            {deliveryEstimate && (
              <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                ✓ {deliveryEstimate}
              </p>
            )}
          </div>

          {/* Nutritional Facts Table */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-sm text-[#17233B] uppercase tracking-wider flex items-center justify-between">
              <span>Nutritional Profile</span>
              <span className="text-[10px] font-normal text-stone-400">Per {product.nutrition.servingSize}</span>
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block">Energy</span>
                <span className="font-bold text-stone-900">{product.nutrition.calories} kcal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block">Protein</span>
                <span className="font-bold text-stone-900">{product.nutrition.protein}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block">Carbs</span>
                <span className="font-bold text-stone-900">{product.nutrition.carbs}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block">Fats</span>
                <span className="font-bold text-stone-900">{product.nutrition.fat}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block">Fiber</span>
                <span className="font-bold text-stone-900">{product.nutrition.fiber}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-[10px] text-stone-500 block">Sodium</span>
                <span className="font-bold text-stone-900">{product.nutrition.sodium ?? 0}mg</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500">
              <strong>Allergen Declaration:</strong> {product.allergens}
            </p>
          </div>
        </div>
      </div>

      {/* ── Sticky Bottom Commerce Bar on Mobile/Desktop Scroll ──────────── */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-3 px-4 sm:px-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 h-12 rounded-xl bg-[#FAF6EE] overflow-hidden flex-shrink-0 border border-stone-100">
                {activeImage && (
                  <Image src={activeImage} alt={product.name} fill sizes="48px" className="object-contain p-1" />
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#17233B] truncate leading-tight">{product.name}</h4>
                <p className="text-[11px] text-[#176B68] font-extrabold mt-0.5">
                  ₹{unitPrice.toLocaleString('en-IN')} <span className="text-stone-400 font-normal">({currentVariant.label})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-2.5 px-5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
              >
                Add to Basket
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="py-2.5 px-5 bg-[#C9A45C] hover:bg-[#b08e49] text-[#17233B] rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D Product & Packaging Inspection Modal */}
      <ProductViewer3D
        isOpen={viewer3DOpen}
        onClose={() => setViewer3DOpen(false)}
        productName={product.name}
        modelType={modelType}
        price={unitPrice}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
