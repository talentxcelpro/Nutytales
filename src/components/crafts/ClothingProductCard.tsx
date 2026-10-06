'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ClothingProduct } from '@/lib/clothing-data'

interface ClothingProductCardProps {
  product: ClothingProduct
  onQuickAdd: (product: ClothingProduct) => void
  onTryWithSi?: (product: ClothingProduct) => void
  onOpen3D?: (product: ClothingProduct) => void
}

export default function ClothingProductCard({
  product,
  onQuickAdd,
  onTryWithSi,
  onOpen3D,
}: ClothingProductCardProps) {
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

  const activeImage =
    isHovered && product.secondaryImage
      ? product.secondaryImage
      : product.image

  const currentColor = product.colorOptions[selectedColorIdx] || product.colorOptions[0]

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Image Presentation Area (Warm Studio Background) ───────────────── */}
      <div className="relative aspect-[3/4] w-full bg-[#FAF6EE] overflow-hidden">
        <Link href={`/crafts/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Top Badges (Clean, Minimal, Non-Obtrusive) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-[#17233B] text-white text-[9px] font-bold tracking-widest uppercase shadow-sm">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2 py-0.5 rounded-md bg-[#C9A45C] text-[#17233B] text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
              BESTSELLER
            </span>
          )}
          {discountPercent > 0 && !product.isNew && !product.isBestseller && (
            <span className="px-2 py-0.5 rounded-md bg-[#176B68] text-white text-[9px] font-bold tracking-widest uppercase shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label="Save to Wishlist"
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center text-stone-700 shadow-sm transition-transform active:scale-90"
        >
          <span className={`text-sm ${isWishlisted ? 'text-rose-600 scale-110' : 'text-stone-500 hover:text-stone-800'}`}>
            {isWishlisted ? '♥' : '♡'}
          </span>
        </button>

        {/* Quick Action Overlay Strip (Appears on Hover) */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            onClick={() => onQuickAdd(product)}
            className="flex-1 py-2 bg-[#17233B]/95 hover:bg-[#17233B] text-white rounded-xl text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-lg transition-transform active:scale-95"
          >
            Quick Add
          </button>
          {product.is3DSupported && onOpen3D && (
            <button
              type="button"
              onClick={() => onOpen3D(product)}
              title="Inspect Garment in 3D"
              className="px-2.5 py-2 bg-white/90 hover:bg-white text-[#17233B] rounded-xl text-[11px] font-bold backdrop-blur-md shadow-lg transition-transform active:scale-95"
            >
              3D
            </button>
          )}
          {product.tryWithSiSupported && onTryWithSi && (
            <button
              type="button"
              onClick={() => onTryWithSi(product)}
              title="Virtual Drape with SI"
              className="px-2.5 py-2 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl text-[11px] font-bold backdrop-blur-md shadow-lg transition-transform active:scale-95"
            >
              ✨ SI
            </button>
          )}
        </div>
      </div>

      {/* ── Product Commercial Metadata (Clean Minimal Typography) ──────────── */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2.5">
        <div className="space-y-1">
          {/* Craft & Material Subtitle */}
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block truncate">
            {product.craft} · {product.material.split('(')[0]}
          </span>

          {/* Product Title */}
          <Link
            href={`/crafts/product/${product.slug}`}
            className="font-serif font-bold text-xs sm:text-sm text-[#17233B] hover:text-[#176B68] transition-colors leading-snug line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        {/* Color Swatch Dots */}
        {product.colorOptions && product.colorOptions.length > 0 && (
          <div className="flex items-center gap-1.5 pt-0.5">
            {product.colorOptions.slice(0, 5).map((color, idx) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColorIdx(idx)}
                title={color.name}
                className={`w-3 h-3 rounded-full border transition-all ${
                  selectedColorIdx === idx
                    ? 'ring-2 ring-[#17233B] scale-110'
                    : 'border-black/20 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colorOptions.length > 5 && (
              <span className="text-[9px] text-stone-500 font-medium">
                +{product.colorOptions.length - 5}
              </span>
            )}
            <span className="text-[10px] text-stone-500 font-medium ml-1 truncate">
              {currentColor?.name}
            </span>
          </div>
        )}

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-[11px] text-amber-500">
          <span>★★★★★</span>
          <span className="text-[10px] text-stone-500">
            ({product.reviews?.length || 12})
          </span>
          {product.provenance.giTagCertified && (
            <span className="ml-auto text-[9px] font-bold text-[#176B68] bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              GI Certified
            </span>
          )}
        </div>

        {/* Pricing Row */}
        <div className="pt-1.5 border-t border-stone-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-bold text-sm sm:text-base text-[#17233B]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-[11px] text-stone-400 line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-500 font-medium">
            {product.sizes[0] || 'Free Size'}
          </span>
        </div>
      </div>
    </div>
  )
}
