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

  const currentVariant =
    product.variants[selectedVariantIdx] || product.variants[0]
  const unitPrice = currentVariant.retailPrice
  const totalPrice = unitPrice * quantity
  const mrp = currentVariant.mrp || Math.round(unitPrice * 1.15)
  const savings = mrp > unitPrice ? mrp - unitPrice : 0

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
        image: product.image,
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
    <article className="group bg-white rounded-2xl border border-[#EAE3D5] hover:border-[#B8934A]/70 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div>
        {/* ── Visual Canvas (Zero Distortion, HD Packshot) ── */}
        <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#FAF5ED] p-5 flex items-center justify-center overflow-hidden">
          <Link
            href={`/shop/${product.slug}`}
            className="relative w-full h-full flex items-center justify-center block"
          >
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                quality={95}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-3 group-hover:scale-104 transition-transform duration-500 ease-out drop-shadow-2xs"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-stone-300">
                <span className="text-5xl">🥜</span>
                <span className="text-[10px] mt-2 uppercase font-medium tracking-widest text-[#8C7E70]">
                  {product.category}
                </span>
              </div>
            )}
          </Link>

          {/* Minimal Origin & Grade Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1 z-10 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#5C4F41] text-[10px] font-medium tracking-wider uppercase border border-[#EAE3D5] shadow-2xs">
              {product.origin.split(',')[0]}
            </span>
            {product.grade && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5ED] text-[#B8934A] text-[9px] font-semibold tracking-wider uppercase border border-[#EAE3D5]">
                {product.grade}
              </span>
            )}
          </div>

          {/* Subtle Quick View on Hover */}
          {onQuickView && (
            <div className="absolute inset-x-4 bottom-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onQuickView(product)
                }}
                className="w-full py-2 rounded-full bg-white/95 hover:bg-white text-[#17233B] text-xs font-semibold uppercase tracking-wider shadow-sm border border-[#EAE3D5] transition-transform active:scale-95"
              >
                Quick View
              </button>
            </div>
          )}
        </div>

        {/* ── Product Information ── */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#8C7E70] font-medium">
            <span>{product.category}</span>
            <span className="text-emerald-800 text-[10px]">
              {product.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Limited'}
            </span>
          </div>

          <Link
            href={`/shop/${product.slug}`}
            className="font-serif text-lg font-normal text-[#17233B] hover:text-[#176B68] transition-colors leading-snug line-clamp-1 block"
          >
            {product.name}
          </Link>

          <p className="text-xs text-[#7A6D5E] font-light line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Pack Size Selection */}
          {product.variants.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider text-[#8C7E70] block mb-1.5 font-medium">
                Pack Size:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={`${v.label}-${idx}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedVariantIdx(idx)
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                      selectedVariantIdx === idx
                        ? 'bg-[#17233B] text-white border-[#17233B] shadow-2xs'
                        : 'bg-[#FAF5ED]/50 hover:bg-[#FAF5ED] text-[#5C4F41] border-[#EAE3D5]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="pt-3 border-t border-[#F0EBE1] flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold text-[#17233B]">
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

      {/* ── Direct Add to Basket ── */}
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
            className={`flex-1 py-2.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#17233B] hover:bg-[#176B68] text-white'
            }`}
          >
            <span>{isAdded ? '✓ Added' : 'Add to Basket'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#8C7E70] pt-1">
          <Link
            href={`/shop/${product.slug}`}
            className="hover:text-[#17233B] underline underline-offset-2"
          >
            Details &amp; Origin Story →
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
