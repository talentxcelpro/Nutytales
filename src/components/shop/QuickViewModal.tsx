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
  const [activeTab, setActiveTab] = useState<'pack' | 'raw'>('pack')

  if (!isOpen || !product) return null

  const currentVariant =
    product.variants[selectedVariantIdx] || product.variants[0]
  const unitPrice = currentVariant.retailPrice
  const totalPrice = unitPrice * quantity
  const mrp = currentVariant.mrp || Math.round(unitPrice * 1.15)
  const savings = mrp > unitPrice ? mrp - unitPrice : 0

  const primaryImage = product.image || '/images/almonds-pouch-250g.jpg'
  const secondaryImage = product.sensory?.secondaryImage

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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#EAE3D5] my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#17233B] flex items-center justify-center font-bold text-sm shadow-xs border border-[#EAE3D5] transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* ── Left: Dual-Angle Photography Stage ── */}
          <div className="relative bg-[#FAF5ED] p-6 sm:p-8 flex flex-col justify-between min-h-[380px] md:min-h-[520px]">
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={() => setActiveTab('pack')}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === 'pack'
                    ? 'bg-[#17233B] text-white shadow-xs'
                    : 'bg-white/80 text-[#5C4F41] border border-[#EAE3D5]'
                }`}
              >
                Studio Pouch
              </button>
              {secondaryImage && (
                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === 'raw'
                      ? 'bg-[#17233B] text-white shadow-xs'
                      : 'bg-white/80 text-[#5C4F41] border border-[#EAE3D5]'
                  }`}
                >
                  Raw Kernel Macro
                </button>
              )}
            </div>

            {/* Image Canvas */}
            <div className="relative w-full h-[300px] md:h-[380px] my-auto flex items-center justify-center">
              {activeTab === 'pack' ? (
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  quality={95}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4 drop-shadow-xs"
                />
              ) : (
                secondaryImage && (
                  <Image
                    src={secondaryImage}
                    alt={`${product.name} raw macro`}
                    fill
                    quality={95}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover rounded-2xl"
                  />
                )
              )}
            </div>

            {/* Terroir / Provenance Capsule */}
            <div className="flex items-center justify-between text-[11px] text-[#7A6D5E] border-t border-[#EAE3D5] pt-3 z-10">
              <span>{product.origin}</span>
              {product.sensory?.altitude && (
                <span className="font-mono text-[#17233B] font-semibold">
                  🏔️ {product.sensory.altitude}
                </span>
              )}
            </div>
          </div>

          {/* ── Right: Sensory & Commerce Details ── */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Grade */}
              <div className="flex items-center justify-between text-xs font-medium text-[#8C7E70] uppercase tracking-wider mb-1">
                <span>{product.category}</span>
                <span className="text-[#B8934A] font-semibold">
                  {product.sensory?.harvestSeason || product.grade}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#17233B] leading-tight">
                {product.name}
              </h2>

              {/* Sommelier Tasting Notes */}
              {product.sensory?.tastingNotes && product.sensory.tastingNotes.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7E70] font-semibold block mb-1">
                    Sommelier Tasting Notes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.sensory.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-0.5 rounded-full bg-[#FAF5ED] text-[#704B32] text-xs font-medium border border-[#EAE3D5]"
                      >
                        ✦ {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Capsule */}
              <div className="mt-4 p-4 rounded-2xl bg-[#FAF5ED]/50 border border-[#EAE3D5] flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#17233B]">
                      ₹{unitPrice.toLocaleString('en-IN')}
                    </span>
                    {mrp > unitPrice && (
                      <span className="text-stone-400 line-through text-sm">
                        ₹{mrp.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#7A6D5E]">
                    Net Weight: {currentVariant.label} · Tax Included
                  </span>
                </div>

                {savings > 0 && (
                  <span className="bg-emerald-800 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Save ₹{savings}
                  </span>
                )}
              </div>

              {/* Tactile Pack Size Selector */}
              {product.variants.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7E70] block mb-2">
                    Select Pack Size:
                  </span>
                  <div className="flex rounded-full bg-[#FAF5ED] p-1 border border-[#EAE3D5]">
                    {product.variants.map((v, idx) => (
                      <button
                        key={`${v.label}-${idx}`}
                        type="button"
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all text-center ${
                          selectedVariantIdx === idx
                            ? 'bg-[#17233B] text-white shadow-xs'
                            : 'text-[#6B6055] hover:text-[#17233B]'
                        }`}
                      >
                        {v.label} — ₹{v.retailPrice}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Short Description */}
              <p className="text-xs text-[#7A6D5E] font-light leading-relaxed mt-4 line-clamp-3">
                {product.longDesc.split('\n\n')[0] || product.shortDesc}
              </p>

              {/* Lab Purity Highlights */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#F0EBE1] text-center text-xs">
                <div className="bg-[#FAF5ED]/50 p-2 rounded-xl border border-[#EAE3D5]">
                  <span className="block text-[10px] text-[#8C7E70] uppercase">Oil Index</span>
                  <span className="font-semibold text-[#17233B]">
                    {product.sensory?.oilIndex?.split(' ')[0] || 'Natural'}
                  </span>
                </div>
                <div className="bg-[#FAF5ED]/50 p-2 rounded-xl border border-[#EAE3D5]">
                  <span className="block text-[10px] text-[#8C7E70] uppercase">Moisture</span>
                  <span className="font-semibold text-[#17233B]">&lt; 4.8% Sealed</span>
                </div>
                <div className="bg-[#FAF5ED]/50 p-2 rounded-xl border border-[#EAE3D5]">
                  <span className="block text-[10px] text-[#8C7E70] uppercase">Purity</span>
                  <span className="font-semibold text-[#17233B]">100% Unbleached</span>
                </div>
              </div>
            </div>

            {/* Stepper + Add to Cart */}
            <div className="space-y-3 pt-3 border-t border-[#EAE3D5]">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#EAE3D5] rounded-full bg-[#FAF5ED]/60 px-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-11 flex items-center justify-center font-semibold text-[#5C4F41] hover:text-[#17233B]"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-sm text-[#17233B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-11 flex items-center justify-center font-semibold text-[#5C4F41] hover:text-[#17233B]"
                  >
                    +
                  </button>
                </div>

                {/* Add to Basket */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-6 rounded-full font-semibold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#17233B] hover:bg-[#1E5E58] text-white'
                  }`}
                >
                  <span>{isAdded ? '✓ Added to Basket' : 'Add to Basket'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#8C7E70] pt-1">
                <Link
                  href={`/shop/${product.slug}`}
                  onClick={onClose}
                  className="font-medium text-[#176B68] hover:underline flex items-center gap-1"
                >
                  <span>View Complete Culinary Dossier</span>
                  <span>→</span>
                </Link>
                <span>Free Express Pan-India Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
