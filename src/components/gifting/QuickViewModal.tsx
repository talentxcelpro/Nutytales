'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { GiftingProduct } from '@/lib/gifting-marketplace-data'
import { useGiftingStore } from '@/hooks/useGiftingStore'

interface QuickViewModalProps {
  product: GiftingProduct | null
  isOpen: boolean
  onClose: () => void
  onOpenPersonalize?: (product: GiftingProduct) => void
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onOpenPersonalize,
}: QuickViewModalProps) {
  const { addToCart, isInWishlist, toggleWishlist } = useGiftingStore()
  const [selectedImg, setSelectedImg] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!isOpen || !product) return null

  const activeImg = selectedImg || product.primaryImage
  const isWish = isInWishlist(product.slug)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: product.primaryImage,
      variant: 'Standard Gift Pack',
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#10192A]/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        {/* Left: Image showcase */}
        <div className="md:w-1/2 bg-[#FAF7F2] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm">
            <Image
              src={activeImg}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#0B2521] text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.slug)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md transition-transform active:scale-90"
              aria-label="Toggle wishlist"
            >
              {isWish ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 pt-4 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImg(img)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImg === img ? 'border-[#C9A45C] shadow-sm' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product details */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#704B32]">
                {product.categoryName}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#17233B] leading-snug">
              {product.name}
            </h3>

            {/* Stars & Reviews */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-amber-500 font-bold">★★★★★</span>
              <span className="text-stone-500 font-medium">({product.reviewCount} verified reviews)</span>
              <span className="text-stone-300">•</span>
              <span className="text-emerald-700 font-bold text-[11px]">In Stock</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-sm text-stone-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {product.shortDesc}
            </p>

            {/* Included contents */}
            {product.contents && product.contents.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">
                  Included in this Gift:
                </span>
                <ul className="text-xs text-stone-600 space-y-1">
                  {product.contents.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-[#C9A45C]">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {product.contents.length > 3 && (
                    <li className="text-[11px] text-stone-400 italic">
                      + {product.contents.length - 3} more items included
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-white rounded-l-xl transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono text-[#17233B]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold text-stone-600 hover:bg-white rounded-r-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98"
              >
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>

              {product.isPersonalizable && onOpenPersonalize && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onOpenPersonalize(product)
                  }}
                  className="px-4 py-3 bg-[#0B2521] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span>✨</span>
                  <span>Personalize</span>
                </button>
              )}
            </div>

            <Link
              href={`/gifting/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-[11px] font-semibold text-[#17233B] hover:text-[#C9A45C] underline underline-offset-2"
            >
              View Full Product Details &amp; Specifications →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
