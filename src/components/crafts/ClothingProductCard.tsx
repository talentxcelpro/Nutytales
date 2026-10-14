'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ClothingProduct } from '@/lib/clothing-data'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

interface ClothingProductCardProps {
  product: ClothingProduct
  onQuickAdd: (product: ClothingProduct) => void
  onTryWithSi?: (product: ClothingProduct) => void
  onOpen3D?: (product: ClothingProduct) => void
  onOpenPassport?: (product: ClothingProduct) => void
  onExpressBuy?: (product: ClothingProduct) => void
}

export default function ClothingProductCard({
  product,
  onQuickAdd,
  onTryWithSi,
  onOpen3D,
  onOpenPassport,
  onExpressBuy,
}: ClothingProductCardProps) {
  const { formatCraftPrice, isWesternMarket } = useMarketCurrency()
  const [isHovered, setIsHovered] = useState(false)
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const list = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
      return list.includes(product.id)
    } catch {
      return false
    }
  })

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const list = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
      let updated: string[]
      if (list.includes(product.id)) {
        updated = list.filter((id: string) => id !== product.id)
        setIsWishlisted(false)
      } else {
        updated = [...list, product.id]
        setIsWishlisted(true)
      }
      localStorage.setItem('nt_wishlist', JSON.stringify(updated))
      window.dispatchEvent(new Event('nt_wishlist_updated'))
    } catch {
      // ignore
    }
  }

  const discountPercent =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0

  const previewImages = [
    product.image,
    product.secondaryImage,
    product.detailImage,
    product.textureImage,
    ...(product.additionalImages || []),
  ].filter(Boolean).slice(0, 5)

  const [hoverImageIdx, setHoverImageIdx] = useState(0)

  const activeImage =
    isHovered && previewImages[hoverImageIdx]
      ? previewImages[hoverImageIdx]
      : product.image

  const currentColor = product.colorOptions[selectedColorIdx] || product.colorOptions[0]
  const loomHours = product.loomHours || product.provenance.artisanHours || 60

  const handleSizeSelect = (e: React.MouseEvent, size: string) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickAdd(product)
  }

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-stone-200/90 hover:border-stone-400 hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setHoverImageIdx(0)
      }}
    >
      {/* ── 1. Image Stage with Myntra Fashion Aspect Ratio (3:4) ──────────── */}
      <div className="relative aspect-[3/4] w-full bg-[#FAF6EE] overflow-hidden">
        <Link href={`/crafts/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            quality={95}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-[center_top] group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Multi-angle preview pagination indicator dots on hover */}
        {isHovered && previewImages.length > 1 && (
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-1.5 px-3 pointer-events-auto">
            {previewImages.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onMouseEnter={(e) => {
                  e.stopPropagation()
                  setHoverImageIdx(dotIdx)
                }}
                className={`h-1.5 rounded-full transition-all ${
                  hoverImageIdx === dotIdx
                    ? 'w-5 bg-[#C9A45C]'
                    : 'w-1.5 bg-white/70 hover:bg-white'
                }`}
                aria-label={`Preview angle ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Top Badges (Origin & Status) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.state && (
            <span className="px-2 py-0.5 rounded-md bg-[#10192A]/90 backdrop-blur-xs text-[#C9A45C] text-[9px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-1">
              <span>📍</span> {product.state}
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-[#17233B] text-white text-[9px] font-bold tracking-widest uppercase shadow-xs">
              NEW
            </span>
          )}
          {product.isBestseller && !product.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-[#C9A45C] text-[#17233B] text-[9px] font-extrabold tracking-widest uppercase shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon (Top Right) */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center text-stone-700 shadow-sm transition-transform active:scale-90"
        >
          <span className={`text-base leading-none ${isWishlisted ? 'text-rose-600 scale-110' : 'text-stone-400 hover:text-stone-700'}`}>
            {isWishlisted ? '♥' : '♡'}
          </span>
        </button>

        {/* Myntra Signature Rating Badge (Bottom Left) */}
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-stone-800 shadow-xs flex items-center gap-1">
          <span>
            {product.reviews && product.reviews.length > 0
              ? (product.reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / product.reviews.length).toFixed(1)
              : '4.9'}
          </span>
          <span className="text-amber-500 text-[11px] leading-none">★</span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500 font-medium">
            {(product.reviews?.length || 2) * 45 + 110}
          </span>
        </div>

        {/* Loom Hours Pill (Bottom Right) */}
        <div className="absolute bottom-2.5 right-2.5 z-10 hidden sm:block">
          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-stone-200 text-[9px] font-mono font-medium">
            ⏱️ {loomHours}h
          </span>
        </div>

        {/* Myntra-Style Hover Size Picker Bar (Slides Up on Hover) */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-white/95 backdrop-blur-md p-2.5 transition-all duration-200 transform translate-y-full group-hover:translate-y-0 shadow-lg border-t border-stone-100 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] text-stone-500 font-bold uppercase">
            <span>Select Size</span>
            <span className="text-[#176B68] font-mono font-bold">68% to Weaver</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {product.sizes.slice(0, 5).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={(e) => handleSizeSelect(e, sz)}
                className="flex-1 py-1 px-1.5 rounded-md border border-stone-200 hover:border-[#17233B] hover:bg-[#17233B] hover:text-white text-[10px] font-bold text-stone-800 transition-colors text-center"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. Myntra-Grade Brand, Title & Commercial Info ───────────────────── */}
      <div className="p-3.5 flex flex-col flex-1 justify-between space-y-2">
        <div className="space-y-0.5">
          {/* Brand / Atelier Name (Bold Uppercase) */}
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-[#17233B] tracking-wider uppercase truncate">
              {product.provenance.artisanGroup || `${product.craft} Atelier`}
            </span>
            {product.provenance.giTagCertified && (
              <button
                type="button"
                onClick={() => onOpenPassport && onOpenPassport(product)}
                className="text-[#176B68] hover:underline text-[9px] font-extrabold flex-shrink-0"
                title="View Verifiable GI Passport"
              >
                📜 GI Cert
              </button>
            )}
          </div>

          {/* Product Description / Title */}
          <Link
            href={`/crafts/product/${product.slug}`}
            className="text-xs text-stone-600 hover:text-[#176B68] transition-colors leading-snug truncate block"
          >
            {product.name}
          </Link>
        </div>

        {/* Color Swatch Dots & Fabric info */}
        <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5">
          <div className="flex items-center gap-1">
            {product.colorOptions && product.colorOptions.length > 0 && product.colorOptions.slice(0, 3).map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                title={color.name}
                className={`w-2.5 h-2.5 rounded-full border ${
                  selectedColorIdx === idx ? 'ring-2 ring-[#17233B] scale-110' : 'border-black/20'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            <span className="truncate ml-1">{product.material.split('(')[0].trim()}</span>
          </div>
          <span className="text-[#176B68] font-bold">{product.craft}</span>
        </div>

        {/* Pricing Row (Selling Price, MRP strikethrough, Discount % OFF) */}
        <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between gap-1 flex-wrap">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-bold text-sm text-[#17233B]">
              {formatCraftPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-stone-400 line-through">
                {formatCraftPrice(product.mrp)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[11px] font-bold text-rose-600">
                ({discountPercent}% OFF)
              </span>
            )}
            {isWesternMarket && (
              <span className="text-[9px] font-bold text-[#C9A45C] bg-[#10192A] px-1.5 py-0.5 rounded" title="Insured international express delivery and import duties included">
                Global Express
              </span>
            )}
          </div>
        </div>

        {/* DeepTech Action Strip (Virtual Drape SI & Quick Bag) */}
        <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between gap-1.5">
          {product.tryWithSiSupported && onTryWithSi && (
            <button
              type="button"
              onClick={() => onTryWithSi(product)}
              className="flex-1 py-1 px-2 rounded-lg bg-[#176B68]/10 hover:bg-[#176B68] text-[#176B68] hover:text-white text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>✨</span> Virtual Drape
            </button>
          )}

          {product.is3DSupported && onOpen3D && (
            <button
              type="button"
              onClick={() => onOpen3D(product)}
              className="py-1 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold transition-colors"
              title="Inspect 3D Weave"
            >
              3D
            </button>
          )}

          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="flex-1 py-1 px-2 rounded-lg bg-[#17233B] hover:bg-black text-white text-[10px] font-bold uppercase transition-colors text-center"
          >
            + Bag
          </button>
        </div>
      </div>
    </div>
  )
}
