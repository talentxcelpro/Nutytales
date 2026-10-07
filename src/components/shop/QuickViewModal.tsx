'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products-data'

interface QuickViewModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  if (!isOpen || !product) return null

  const currentVariant =
    product.variants[selectedVariantIdx] || product.variants[0]
  const unitPrice = currentVariant.retailPrice
  const totalPrice = unitPrice * quantity
  const mrp = currentVariant.mrp || Math.round(unitPrice * 1.15)
  const savings = mrp > unitPrice ? mrp - unitPrice : 0

  const handleAddToCart = () => {
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 my-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-lg transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: HD Product Presentation Canvas */}
          <div className="relative bg-[#FAF6EE] p-8 flex flex-col items-center justify-center min-h-[380px] md:min-h-[500px]">
            {product.image ? (
              <div className="relative w-full h-[320px] md:h-[420px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  quality={95}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4 drop-shadow-md hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="text-stone-400 text-center">
                <span className="text-6xl">🥜</span>
                <p className="text-xs uppercase font-bold mt-2">Nutty Tales Harvest</p>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-1.5 pointer-events-none">
              <span className="bg-[#17233B] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {product.origin.split(',')[0]}
              </span>
              <span className="bg-[#C9A45C] text-[#17233B] px-3 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                {product.grade}
              </span>
            </div>

            <p className="text-[11px] text-stone-500 mt-2 font-medium">
              100% Studio Uncropped HD Packaging
            </p>
          </div>

          {/* Right: Commerce & Specification Panel */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#704B32] mb-1.5">
                <span className="uppercase tracking-wider">{product.category}</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px] font-bold">
                  ✓ Ready for Dispatch
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] leading-tight">
                {product.name}
              </h2>

              {/* Reviews & Origin */}
              <div className="flex items-center gap-3 text-xs text-stone-600 mt-2">
                <span className="text-amber-500 font-bold">★★★★★</span>
                <span className="font-semibold">4.9 (120+ verified reviews)</span>
                <span>•</span>
                <span className="text-[#176B68] font-bold">FSSAI Certified</span>
              </div>

              {/* Pricing */}
              <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                      ₹{unitPrice.toLocaleString('en-IN')}
                    </span>
                    {mrp > unitPrice && (
                      <span className="text-stone-400 line-through text-sm">
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500">
                    Net Weight: {currentVariant.label} · Inclusive of all taxes
                  </span>
                </div>

                {savings > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Save ₹{savings}
                  </span>
                )}
              </div>

              {/* Pack Size Selector */}
              {product.variants.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block mb-2">
                    Select Pack Size:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, idx) => (
                      <button
                        key={`${v.label}-${idx}`}
                        type="button"
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all border ${
                          selectedVariantIdx === idx
                            ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {v.label} — ₹{v.retailPrice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Short Description */}
              <p className="text-xs text-stone-600 leading-relaxed mt-4 line-clamp-3">
                {product.shortDesc}
              </p>

              {/* Nutrition Highlights */}
              {product.nutrition && (
                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-stone-100 text-center">
                  <div className="bg-white p-2 rounded-xl border border-stone-100">
                    <span className="block text-[10px] text-stone-400 uppercase">Protein</span>
                    <span className="text-xs font-bold text-[#17233B]">{product.nutrition.protein}g</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-100">
                    <span className="block text-[10px] text-stone-400 uppercase">Fiber</span>
                    <span className="text-xs font-bold text-[#17233B]">{product.nutrition.fiber}g</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-100">
                    <span className="block text-[10px] text-stone-400 uppercase">Good Fats</span>
                    <span className="text-xs font-bold text-[#17233B]">{product.nutrition.fat}g</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-stone-100">
                    <span className="block text-[10px] text-stone-400 uppercase">Calories</span>
                    <span className="text-xs font-bold text-[#17233B]">{product.nutrition.calories}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper + Add to Cart + Full Details Link */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-xl bg-white px-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-11 flex items-center justify-center font-bold text-stone-600 hover:text-black"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-[#17233B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-11 flex items-center justify-center font-bold text-stone-600 hover:text-black"
                  >
                    +
                  </button>
                </div>

                {/* Add to Basket button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#17233B] hover:bg-[#176B68] text-white'
                  }`}
                >
                  <span>{isAdded ? '✓ Added to Cart!' : '🛒 Add to Basket'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <Link
                  href={`/shop/${product.slug}`}
                  onClick={onClose}
                  className="font-bold text-[#176B68] hover:underline flex items-center gap-1"
                >
                  <span>View Complete Specs, B2B Tiers &amp; 3D</span>
                  <span>→</span>
                </Link>
                <span>Free Pan-India Delivery on ₹1,999+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
