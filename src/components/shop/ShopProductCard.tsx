'use client'

import React, { useState, useEffect } from 'react'
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
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Load wishlist status
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
      setIsWishlisted(list.includes(product.id))
    } catch {
      // ignore
    }
  }, [product.id])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const list: string[] = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
      let updated: string[] = []
      if (list.includes(product.id)) {
        updated = list.filter((id) => id !== product.id)
        setIsWishlisted(false)
      } else {
        updated = [...list, product.id]
        setIsWishlisted(true)
      }
      localStorage.setItem('nt_wishlist', JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const currentVariant =
    product.variants[selectedVariantIdx] || product.variants[0]
  const unitPrice = currentVariant.retailPrice
  const totalPrice = unitPrice * quantity
  const mrp = currentVariant.mrp || Math.round(unitPrice * 1.15)
  const discountPercent =
    mrp > unitPrice ? Math.round(((mrp - unitPrice) / mrp) * 100) : 0

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
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#176B68]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      {/* ── TOP IMAGE CONTAINER (Uncropped HD Packaging, Ivory Studio) ── */}
      <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#FAF6EE] p-4 flex items-center justify-center overflow-hidden">
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-xs"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-300">
              <span className="text-6xl">🥜</span>
              <span className="text-[10px] mt-2 uppercase font-bold tracking-widest text-[#704B32]">
                {product.category}
              </span>
            </div>
          )}
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-[#8A3B14] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 rounded-md bg-[#C9A45C] text-[#17233B] text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              BESTSELLER
            </span>
          )}
          <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[#176B68] text-[9px] font-bold tracking-wider border border-[#176B68]/20 shadow-xs">
            {product.origin.split(',')[0]}
          </span>
        </div>

        {/* Top Right Wishlist & Rating */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          <button
            type="button"
            onClick={toggleWishlist}
            className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-transform active:scale-90 ${
              isWishlisted ? 'text-red-500' : 'text-stone-400 hover:text-stone-700'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? '♥' : '♡'}
          </button>
          <span className="px-2 py-0.5 rounded-full bg-[#17233B]/85 text-white text-[9px] font-bold shadow-xs">
            ★ 4.9
          </span>
        </div>

        {/* Hover Quick View Trigger */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onQuickView(product)
              }}
              className="w-full py-2.5 rounded-xl bg-white/95 hover:bg-white text-[#17233B] font-bold text-xs uppercase tracking-wider shadow-md backdrop-blur-xs transition-transform active:scale-95 flex items-center justify-center gap-1.5 border border-stone-200"
            >
              <span>👁</span>
              <span>Quick View</span>
            </button>
          </div>
        )}
      </div>

      {/* ── CARD CONTENT & SPECS ── */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div>
          {/* Subheader: Category & Grade */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#704B32] mb-1">
            <span>{product.category}</span>
            <span className="text-stone-500 font-semibold">{product.grade}</span>
          </div>

          {/* Product Name */}
          <Link
            href={`/shop/${product.slug}`}
            className="font-serif font-bold text-base sm:text-lg text-[#17233B] hover:text-[#176B68] transition-colors leading-snug line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Short description */}
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mt-1">
            {product.shortDesc}
          </p>

          {/* Weight variant pills */}
          {product.variants.length > 0 && (
            <div className="pt-2.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                <span>Select Pack:</span>
                <span className="text-[#176B68]">
                  {product.stockStatus === 'IN_STOCK' ? '● In Stock' : 'Limited'}
                </span>
              </div>
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
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                      selectedVariantIdx === idx
                        ? 'bg-[#17233B] text-white border-[#17233B] shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price & Savings Display */}
          <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-[#17233B]">
                  ₹{unitPrice.toLocaleString('en-IN')}
                </span>
                {mrp > unitPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{mrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-stone-400">
                ₹{Math.round((unitPrice / currentVariant.sizeG) * 1000)} / kg equivalent
              </span>
            </div>

            <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Tax Included
            </span>
          </div>
        </div>

        {/* ── ACTION ENGINE: QUANTITY STEPPER & ADD TO BASKET ── */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center gap-2">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setQuantity((q) => Math.max(1, q - 1))
                }}
                className="w-8 h-9 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-white rounded-l-xl transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-7 text-center text-xs font-bold text-[#17233B]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setQuantity((q) => q + 1)
                }}
                className="w-8 h-9 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-white rounded-r-xl transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to Basket button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 ${
                isAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#17233B] hover:bg-[#176B68] text-white'
              }`}
            >
              <span>{isAdded ? '✓ In Basket' : '🛒 Add'}</span>
            </button>
          </div>

          {/* Quick links: specs & wholesale */}
          <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
            <Link
              href={`/shop/${product.slug}`}
              className="hover:text-[#176B68] font-semibold underline underline-offset-2"
            >
              Full Details →
            </Link>
            {product.b2bPricePerKg && (
              <Link
                href="/business-supply"
                className="text-[#176B68] font-bold hover:underline"
              >
                Wholesale ₹{product.b2bPricePerKg}/kg
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
