'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products-data'

interface ShopProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export default function ShopProductCard({
  product,
  onQuickView,
}: ShopProductCardProps) {
  // Default to 1kg or highest variant if available, else first variant
  const defaultIdx = product.variants.length > 2 ? 2 : 0
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(defaultIdx)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [activeImageMode, setActiveImageMode] = useState<'pouch' | 'raw'>('pouch')

  const currentVariant =
    product.variants[selectedVariantIdx] || product.variants[0]
  const unitPrice = currentVariant.retailPrice
  const totalPrice = unitPrice * quantity
  const mrp = currentVariant.mrp || Math.round(unitPrice * 1.15)
  const savings = mrp > unitPrice ? mrp - unitPrice : 0

  const primaryImage = product.image || '/images/almonds-pouch-250g.jpg'
  const secondaryImage = product.sensory?.secondaryImage

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const item = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        mode: 'retail',
        sizeLabel: currentVariant.label,
        unitPrice,
        quantity,
        totalPrice,
        image: primaryImage,
      }
      existing.push(item)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <article className="group bg-white rounded-3xl border border-[#EAE3D5] hover:border-[#B8934A]/80 shadow-2xs hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden relative">
      <div>
        {/* ── 1. Next-Gen Dual-View Visual Canvas (Packaging ⟷ Raw Harvest Reveal) ── */}
        <div
          className="relative aspect-[4/5] sm:aspect-square w-full bg-[#FAF5ED] p-5 flex items-center justify-center overflow-hidden cursor-pointer"
          onMouseEnter={() => {
            if (secondaryImage) setActiveImageMode('raw')
          }}
          onMouseLeave={() => {
            setActiveImageMode('pouch')
          }}
        >
          <Link
            href={`/shop/${product.slug}`}
            className="relative w-full h-full flex items-center justify-center block"
          >
            {/* Primary Packshot (Studio Standing Pouch) */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                activeImageMode === 'raw' && secondaryImage ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
              }`}
            >
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                quality={95}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-3 transition-transform duration-700 group-hover:scale-103 drop-shadow-2xs"
              />
            </div>

            {/* Secondary Macro Reveal (Raw Glistening Kernels / Threads) */}
            {secondaryImage && (
              <div
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  activeImageMode === 'raw' ? 'opacity-100 scale-100' : 'opacity-0 scale-102 pointer-events-none'
                }`}
              >
                <Image
                  src={secondaryImage}
                  alt={`${product.name} raw harvest`}
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover rounded-2xl"
                />
                <span className="absolute bottom-3 left-3 bg-[#17233B]/85 text-white backdrop-blur-xs text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full">
                  Harvest Reveal · Raw Kernels
                </span>
              </div>
            )}
          </Link>

          {/* Terroir & Origin Tag */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1 z-10 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#5C4F41] text-[10px] font-medium tracking-wider uppercase border border-[#EAE3D5] shadow-2xs">
              {product.origin.split(',')[0]}
            </span>
            {product.sensory?.altitude && (
              <span className="px-2 py-0.5 rounded-full bg-[#17233B]/85 text-[#F5EFE6] text-[9px] font-mono tracking-wide">
                🏔️ {product.sensory.altitude.split('(')[0].trim()}
              </span>
            )}
          </div>

          {/* Quick Dual-Mode View Button for Touch / Mobile */}
          {secondaryImage && (
            <div className="absolute top-3.5 right-3.5 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveImageMode((prev) => (prev === 'pouch' ? 'raw' : 'pouch'))
                }}
                className="px-2 py-1 rounded-full bg-white/90 hover:bg-white text-[9px] font-semibold tracking-wider text-[#17233B] border border-[#EAE3D5] shadow-2xs transition-all active:scale-95"
                title="Toggle between studio packshot and raw harvest"
              >
                {activeImageMode === 'raw' ? '📦 Pack' : '👁️ Reveal'}
              </button>
            </div>
          )}

          {/* Quick View Sensory Trigger */}
          {onQuickView && (
            <div className="absolute inset-x-4 bottom-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onQuickView(product)
                }}
                className="w-full py-2.5 rounded-full bg-white/95 hover:bg-white text-[#17233B] text-xs font-semibold uppercase tracking-wider shadow-sm border border-[#EAE3D5] transition-transform active:scale-95"
              >
                Inspect Sensory Profile
              </button>
            </div>
          )}
        </div>

        {/* ── 2. Sensory Storytelling & Specifications ── */}
        <div className="p-5 space-y-3">
          {/* Category & Harvest Season */}
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#8C7E70] font-medium">
            <span>{product.category}</span>
            <span className="text-[#B8934A] text-[10px] font-semibold">
              {product.sensory?.harvestSeason || product.grade}
            </span>
          </div>

          {/* Product Title */}
          <Link
            href={`/shop/${product.slug}`}
            className="font-serif text-lg sm:text-xl font-normal text-[#17233B] hover:text-[#176B68] transition-colors leading-snug line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Sommelier Tasting Notes Pill Matrix */}
          {product.sensory?.tastingNotes && product.sensory.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {product.sensory.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-2 py-0.5 rounded-md bg-[#FAF5ED] text-[#704B32] text-[10px] font-medium tracking-wide border border-[#EAE3D5]"
                >
                  {note}
                </span>
              ))}
            </div>
          )}

          {/* Short Narrative */}
          <p className="text-xs text-[#7A6D5E] font-light line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* ── 3. Tactile Fluid Segmented Weight Selector ── */}
          {product.variants.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8C7E70] mb-1.5 font-medium">
                <span>Select Pack:</span>
                <span className="text-emerald-800 font-semibold">
                  {product.stockStatus === 'IN_STOCK' ? '✓ Ready to Dispatch' : 'Limited'}
                </span>
              </div>
              <div className="flex rounded-full bg-[#FAF5ED] p-1 border border-[#EAE3D5]">
                {product.variants.map((v, idx) => (
                  <button
                    key={`${v.label}-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedVariantIdx(idx)
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all text-center ${
                      selectedVariantIdx === idx
                        ? 'bg-[#17233B] text-white shadow-xs'
                        : 'text-[#6B6055] hover:text-[#17233B]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Value Index */}
          <div className="pt-3 border-t border-[#F0EBE1] flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl sm:text-2xl font-semibold text-[#17233B]">
                ₹{unitPrice.toLocaleString('en-IN')}
              </span>
              {mrp > unitPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-[11px] text-emerald-800 font-medium">
                Save ₹{savings}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 4. Next-Gen Add to Basket Engine ── */}
      <div className="p-5 pt-0 space-y-2">
        <div className="flex items-center gap-2">
          {/* Stepper */}
          <div className="flex items-center border border-[#EAE3D5] rounded-full bg-[#FAF5ED]/60 px-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setQuantity((q) => Math.max(1, q - 1))
              }}
              className="w-7 h-9 flex items-center justify-center text-sm font-semibold text-[#5C4F41] hover:text-[#17233B]"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center text-xs font-medium text-[#17233B]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setQuantity((q) => q + 1)
              }}
              className="w-7 h-9 flex items-center justify-center text-sm font-semibold text-[#5C4F41] hover:text-[#17233B]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#17233B] hover:bg-[#1E5E58] text-white'
            }`}
          >
            <span>{isAdded ? '✓ Added to Basket' : 'Add to Basket'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8C7E70] pt-1">
          <Link
            href={`/shop/${product.slug}`}
            className="hover:text-[#17233B] underline underline-offset-2"
          >
            Full Terroir &amp; Specs →
          </Link>
          {product.b2bPricePerKg && (
            <Link
              href="/business-supply"
              className="hover:text-[#17233B]"
            >
              Bulk from ₹{product.b2bPricePerKg}/kg
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
