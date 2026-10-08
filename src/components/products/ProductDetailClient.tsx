'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product, PRODUCTS, getProductDynamicGallery } from '@/lib/products-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import ProductViewer3D, { ModelType } from '@/components/3d/ProductViewer3D'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const { formatPrice, country, countryConfig } = useMarketCurrency()
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail')
  const [purchaseType, setPurchaseType] = useState<'onetime' | 'subscribe'>('onetime')
  const [subscribeInterval, setSubscribeInterval] = useState<number>(30)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(2) // 1kg default
  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // 5kg default
  const [quantity, setQuantity] = useState(1)
  const [addedMessage, setAddedMessage] = useState('')
  const [viewer3DOpen, setViewer3DOpen] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [showCOAModal, setShowCOAModal] = useState(false)

  // Multi-angle Dynamic 6-10 HD Gallery
  const gallery = product.images && product.images.length > 3 ? product.images : getProductDynamicGallery(product)
  const [activeImage, setActiveImage] = useState(gallery[0] || product.image)

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

  const baseUnitPrice =
    mode === 'retail'
      ? currentVariant.retailPrice
      : currentTier.pricePerKg * currentTier.minQtyKg

  const unitPrice =
    mode === 'retail' && purchaseType === 'subscribe'
      ? Math.round(baseUnitPrice * 0.9)
      : baseUnitPrice

  const totalPrice = unitPrice * quantity

  const dynamicEstimatedDate = useMemo(() => {
    const d = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }, [])

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
      setDeliveryEstimate(`Express Air Dispatch: Guaranteed delivery to ${pincode} by ${dynamicEstimatedDate} (Complimentary Insured Shipping)`)
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
        sizeLabel:
          mode === 'retail'
            ? `${currentVariant.label}${purchaseType === 'subscribe' ? ` (Auto-ship every ${subscribeInterval}d)` : ''}`
            : `${currentTier.minQtyKg} kg (Wholesale)`,
        unitPrice,
        quantity,
        totalPrice,
        image: activeImage || product.image,
      }
      existing.push(item)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setAddedMessage(
        purchaseType === 'subscribe'
          ? `Subscribed to ${quantity} × ${product.name} (every ${subscribeInterval} days)!`
          : `Added ${quantity} × ${product.name} to cart!`
      )
      setTimeout(() => setAddedMessage(''), 3000)
    } catch {
      // fallback
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/checkout')
  }

  // ── Curated Companion Harvest Bundle ──
  const complementaryProducts = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        (p.isFeatured ||
          p.categorySlug === 'saffron' ||
          p.categorySlug === 'walnuts' ||
          p.categorySlug === 'honey' ||
          p.categorySlug === 'almonds')
    ).slice(0, 2)
  }, [product.id])

  const bundleItems = useMemo(
    () => [product, ...complementaryProducts],
    [product, complementaryProducts]
  )
  const bundleRegularTotal = useMemo(
    () => bundleItems.reduce((acc, item) => acc + item.retailPrice, 0),
    [bundleItems]
  )
  const bundleSavings = Math.round(bundleRegularTotal * 0.15)
  const bundlePrice = bundleRegularTotal - bundleSavings

  const handleAddBundle = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      bundleItems.forEach((item) => {
        const discountedPrice = Math.round(item.retailPrice * 0.85)
        existing.push({
          productId: item.id,
          name: item.name,
          slug: item.slug,
          mode: 'retail',
          sizeLabel: item.variants[0]?.label || 'Standard Pack',
          unitPrice: discountedPrice,
          quantity: 1,
          totalPrice: discountedPrice,
          image: item.image,
        })
      })
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))
      setAddedMessage(`Added 3-piece Harvest Ritual Bundle to basket (15% bundle savings)!`)
      setTimeout(() => setAddedMessage(''), 3500)
    } catch {
      // fallback
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales! 👋\n\nI want to order *${product.name}*:\n• Pack: ${mode === 'retail' ? currentVariant.label : `${currentTier.minQtyKg} kg`}\n• Quantity: ${quantity} units (Total: ₹${totalPrice})\n• Grade: ${product.grade}\n\nPlease confirm availability and dispatch schedule!`
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
                className={`transition-transform duration-300 ${
                  isZoomed ? 'scale-125' : 'scale-100'
                } ${
                  activeImage.includes('pouch') || activeImage.includes('jar') || activeImage.includes('box')
                    ? 'object-contain p-6'
                    : 'object-cover'
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

          {/* Dynamic 8-10 Multi-angle HD Thumbnails Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`relative aspect-square rounded-2xl overflow-hidden bg-[#FAF6EE] border-2 transition-all p-1 flex items-center justify-center ${
                  activeImage === img
                    ? 'border-[#176B68] ring-2 ring-[#176B68]/30 scale-102 shadow-sm'
                    : 'border-stone-200 opacity-75 hover:opacity-100 hover:border-stone-400'
                }`}
                aria-label={`View angle ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} angle ${idx + 1}`}
                  fill
                  quality={90}
                  sizes="80px"
                  className={
                    img.includes('pouch') || img.includes('jar') || img.includes('box')
                      ? 'object-contain p-1'
                      : 'object-cover'
                  }
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
            {/* Purchase Model: One-Time vs Subscribe & Save (10% Off) */}
            {mode === 'retail' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100/90 rounded-2xl border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setPurchaseType('onetime')}
                    className={`p-3 rounded-xl text-left transition-all ${
                      purchaseType === 'onetime'
                        ? 'bg-white shadow-xs border border-stone-200/80'
                        : 'hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#17233B]">One-Time Order</span>
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center">
                        {purchaseType === 'onetime' && <span className="w-2 h-2 rounded-full bg-[#17233B]" />}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium mt-0.5 block">Standard single dispatch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPurchaseType('subscribe')}
                    className={`p-3 rounded-xl text-left transition-all relative overflow-hidden ${
                      purchaseType === 'subscribe'
                        ? 'bg-emerald-50/90 border border-emerald-300 shadow-xs'
                        : 'hover:bg-emerald-50/40'
                    }`}
                  >
                    <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-wider">
                      SAVE 10%
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950">Subscribe &amp; Save</span>
                      <span className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center">
                        {purchaseType === 'subscribe' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                      Auto-replenish · Pause anytime
                    </span>
                  </button>
                </div>

                {purchaseType === 'subscribe' && (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-emerald-900 font-medium">Auto-delivery frequency:</span>
                    <div className="flex gap-1.5">
                      {[30, 60, 90].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setSubscribeInterval(days)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            subscribeInterval === days
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          Every {days} Days
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                    const variantUnitPrice =
                      purchaseType === 'subscribe'
                        ? Math.round(v.retailPrice * 0.9)
                        : v.retailPrice
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
                          {formatPrice(variantUnitPrice)}
                        </span>
                        {v.mrp && (
                          <span className="text-[10px] text-stone-400 line-through block">
                            MRP {formatPrice(v.mrp)}
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
                        {formatPrice(tier.pricePerKg)} <span className="text-[10px] font-normal">/kg</span>
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

            {/* Global Express Air Guarantee Strip */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">✈️</span>
                <div>
                  <span className="font-bold text-[#17233B]">
                    Direct Express to {countryConfig.countryName}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Dispatched within 24h in certified food-grade packaging
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCOAModal(true)}
                className="text-[11px] font-bold text-[#176B68] hover:underline whitespace-nowrap bg-white px-2.5 py-1 rounded-lg border border-stone-200"
              >
                Inspect COA 📜
              </button>
            </div>

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
                  {formatPrice(totalPrice)}
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
                <span>{purchaseType === 'subscribe' ? 'Subscribe Now' : 'Add to Basket'}</span>
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

      {/* ── Frequently Bought Together / Signature Ritual Bundle ───────── */}
      {complementaryProducts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#704B32]">
              ✦ Curated Harvest Pairing
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#17233B]">
              Frequently Sourced Together
            </h3>
            <p className="text-xs text-stone-500">
              Connoisseurs pair {product.name} with these single-origin companion harvests for optimal gastronomic balance and daily wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Primary Item */}
            <div className="flex items-center gap-3 p-3.5 bg-[#FAF7F2] rounded-2xl border border-stone-200/80">
              <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-stone-100 flex items-center justify-center">
                {product.image && (
                  <Image src={product.image} alt={product.name} fill sizes="56px" className="object-contain p-1" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-emerald-800">Current Item</span>
                <h4 className="text-xs font-bold text-[#17233B] truncate">{product.name}</h4>
                <span className="text-xs font-bold text-[#176B68]">{formatPrice(product.retailPrice)}</span>
              </div>
            </div>

            {/* Complementary Item 1 */}
            {complementaryProducts[0] && (
              <div className="flex items-center gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-stone-100 flex items-center justify-center">
                  {complementaryProducts[0].image && (
                    <Image src={complementaryProducts[0].image} alt={complementaryProducts[0].name} fill sizes="56px" className="object-contain p-1" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-stone-400">Pairing +1</span>
                  <h4 className="text-xs font-bold text-[#17233B] truncate">{complementaryProducts[0].name}</h4>
                  <span className="text-xs font-bold text-[#176B68]">{formatPrice(complementaryProducts[0].retailPrice)}</span>
                </div>
              </div>
            )}

            {/* Complementary Item 2 */}
            {complementaryProducts[1] && (
              <div className="flex items-center gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-stone-100 flex items-center justify-center">
                  {complementaryProducts[1].image && (
                    <Image src={complementaryProducts[1].image} alt={complementaryProducts[1].name} fill sizes="56px" className="object-contain p-1" />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-stone-400">Pairing +2</span>
                  <h4 className="text-xs font-bold text-[#17233B] truncate">{complementaryProducts[1].name}</h4>
                  <span className="text-xs font-bold text-[#176B68]">{formatPrice(complementaryProducts[1].retailPrice)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#C9A45C]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-lg font-bold text-[#17233B]">
                  Ritual Bundle Price: {formatPrice(bundlePrice)}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(bundleRegularTotal)}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Save 15% ({formatPrice(bundleSavings)})
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                All items shipped together in cold-chain protected single-lot parcel.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddBundle}
              className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-sm"
            >
              ⚡ Add 3-Item Bundle to Basket
            </button>
          </div>
        </div>
      )}

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
                  {formatPrice(unitPrice)} <span className="text-stone-400 font-normal">({currentVariant.label})</span>
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

      {/* ── NABL Lab COA & Batch Passport Modal ────────────────────────── */}
      {showCOAModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-stone-300 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 text-[#17233B]">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                  NABL Laboratory Verification
                </span>
                <h3 className="font-serif text-xl font-bold text-[#17233B]">
                  Certificate of Analysis (COA)
                </h3>
                <p className="text-xs text-stone-500">
                  Batch: NT-2026-GI-535 • Certified Harvest
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCOAModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold border border-stone-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center">
                <span className="text-stone-500">Origin Plateau</span>
                <span className="font-bold text-[#17233B]">{product.origin} (5,350 FT Elevation)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center">
                <span className="text-stone-500">Moisture Content</span>
                <span className="font-bold text-emerald-700">7.8% (Target &lt; 10% PASS)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center">
                <span className="text-stone-500">Chemical Contaminants</span>
                <span className="font-bold text-emerald-700">0.00% Zero Pesticides (PASS)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center">
                <span className="text-stone-500">FSSAI License</span>
                <span className="font-bold text-[#17233B]">{FSSAI_NUMBER}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-stone-200 flex justify-between items-center">
                <span className="text-stone-500">Cold Vault Condition</span>
                <span className="font-bold text-[#17233B]">Maintained at 4°C - 8°C</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 font-medium">
              ✓ Tested according to ISO 3632 &amp; FSSAI Standard Regulations. 100% genuine single-origin harvest lot.
            </div>

            <button
              type="button"
              onClick={() => setShowCOAModal(false)}
              className="w-full py-3 bg-[#17233B] hover:bg-[#203050] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
            >
              Close Verification Record
            </button>
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
        productImage={product.image}
        origin={product.origin}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
