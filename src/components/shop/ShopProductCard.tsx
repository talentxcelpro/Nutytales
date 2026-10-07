'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products-data'

interface ShopProductCardProps {
  product: Product
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
  // Default to 1kg or highest variant if available, else first variant
  const defaultIdx = product.variants.length > 2 ? 2 : 0
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(defaultIdx)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const currentVariant = product.variants[selectedVariantIdx] || product.variants[0]
  const unitPrice = currentVariant.retailPrice
  const totalPrice = unitPrice * quantity

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
    <div className="bg-white rounded-3xl border border-stone-200/90 hover:border-[#176B68]/60 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* ── Image Canvas (No Cutting, Full Container, Warm Studio) ─────── */}
        <div className="relative aspect-square w-full bg-[#FAF6EE] p-5 overflow-hidden flex items-center justify-center">
          <Link href={`/shop/${product.slug}`} className="block w-full h-full relative">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                quality={95}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300">
                <span className="text-6xl">🥜</span>
                <span className="text-[10px] mt-2 uppercase font-bold tracking-widest text-[#704B32]">
                  {product.category}
                </span>
              </div>
            )}
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
            {product.isFeatured && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] text-[9px] font-extrabold tracking-widest uppercase shadow-sm">
                POPULAR
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-[#176B68] text-[9px] font-bold tracking-wider border border-[#176B68]/20 shadow-sm">
              {product.origin.split(',')[0]}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded-full bg-[#17233B]/90 text-white text-[9px] font-bold tracking-wider shadow-sm">
              ★ 4.9
            </span>
          </div>
        </div>

        {/* ── Details & Variant Selector ─────────────────────────────────── */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#704B32]">
            <span>{product.category}</span>
            <span className="text-stone-500 font-semibold">Grade: {product.grade}</span>
          </div>

          <Link
            href={`/shop/${product.slug}`}
            className="font-serif font-bold text-base sm:text-lg text-[#17233B] group-hover:text-[#176B68] transition-colors leading-snug line-clamp-1 block"
          >
            {product.name}
          </Link>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Pack Size Pills */}
          {product.variants.length > 0 && (
            <div className="pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
                Select Pack Size:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variants.map((variant, idx) => (
                  <button
                    key={`${variant.label}-${idx}`}
                    type="button"
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedVariantIdx === idx
                        ? 'bg-[#17233B] text-white shadow-sm ring-1 ring-[#17233B]'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Stock status */}
          <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
            <div>
              <span className="text-lg font-extrabold text-[#17233B]">
                ₹{unitPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-400 font-normal"> / {currentVariant.label}</span>
            </div>

            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              In Stock
            </span>
          </div>
        </div>
      </div>

      {/* ── Add to Cart & Quick Order Engine ───────────────────────────────── */}
      <div className="p-5 pt-0 space-y-2">
        <div className="flex items-center gap-2">
          {/* Stepper */}
          <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-9 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-white rounded-l-xl transition-colors"
            >
              −
            </button>
            <span className="w-7 text-center text-xs font-bold text-[#17233B]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-9 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-white rounded-r-xl transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to Basket */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
              isAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#17233B] hover:bg-[#176B68] text-white'
            }`}
          >
            <span>{isAdded ? '✓ Added!' : '🛒 Add to Basket'}</span>
          </button>
        </div>

        {/* View Details / Wholesale Link */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <Link
            href={`/shop/${product.slug}`}
            className="hover:text-[#176B68] font-semibold underline underline-offset-2"
          >
            View Full Specs &amp; 3D →
          </Link>
          {product.b2bPricePerKg && (
            <Link
              href="/business-supply"
              className="text-[#176B68] font-bold hover:underline"
            >
              Bulk from ₹{product.b2bPricePerKg}/kg
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
