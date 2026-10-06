'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ClothingProduct } from '@/lib/clothing-data'

interface QuickAddModalProps {
  product: ClothingProduct | null
  isOpen: boolean
  onClose: () => void
  onOpenSizeGuide: () => void
}

export default function QuickAddModal({
  product,
  isOpen,
  onClose,
  onOpenSizeGuide,
}: QuickAddModalProps) {
  if (!isOpen || !product) return null

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Free Size')
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const selectedColor = product.colorOptions[selectedColorIdx] || { name: 'Standard', hex: '#631B26' }

  const handleAddToCart = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const newItem = {
        productId: product.id,
        name: `${product.name} (${selectedColor.name})`,
        slug: product.slug,
        mode: 'retail' as const,
        sizeLabel: selectedSize,
        unitPrice: product.price,
        quantity: quantity,
        totalPrice: product.price * quantity,
        image: product.image,
      }
      localStorage.setItem('nt_cart', JSON.stringify([...existing, newItem]))
      setAdded(true)
      setTimeout(() => {
        setAdded(false)
        onClose()
      }, 1600)
    } catch {
      // ignore
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
            Quick Add to Bag
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 font-bold text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-base text-[#17233B] leading-snug">
              {product.name}
            </h4>
            <p className="text-xs text-[#704B32]">{product.craft} · {product.material}</p>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-serif font-bold text-base text-[#17233B]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Color Selector */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-stone-700">Colour:</span>
            <span className="font-medium text-[#17233B]">{selectedColor.name}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colorOptions.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColorIdx(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                  selectedColorIdx === i
                    ? 'border-[#17233B] bg-white ring-2 ring-[#17233B]/20 shadow-sm'
                    : 'border-stone-300 bg-white/60 hover:bg-white text-stone-600'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 flex-shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] font-medium">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-stone-700">Select Size:</span>
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className="text-[11px] text-[#176B68] hover:underline font-bold"
            >
              📏 Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedSize === s
                    ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="font-bold text-stone-700">Quantity:</span>
          <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1.5 hover:bg-stone-100 font-bold text-stone-600"
            >
              -
            </button>
            <span className="px-3 font-bold text-stone-800">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1.5 hover:bg-stone-100 font-bold text-stone-600"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#17233B] hover:bg-[#176B68] text-white'
            }`}
          >
            {added ? '✓ Added to Shopping Bag!' : `Add to Bag • ₹${(product.price * quantity).toLocaleString('en-IN')}`}
          </button>
          <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
            <span>Free insured Pan-India shipping</span>
            <Link
              href={`/crafts/product/${product.slug}`}
              onClick={onClose}
              className="text-[#704B32] hover:underline font-bold"
            >
              View Full Product Page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
