'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/products-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  // Mode: retail vs wholesale
  const [mode, setMode] = useState<'retail' | 'wholesale'>('retail')
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(2) // 1kg default
  const [selectedTierIndex, setSelectedTierIndex] = useState(0) // 5kg default
  const [quantity, setQuantity] = useState(1)
  const [addedMessage, setAddedMessage] = useState('')

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0]
  const currentTier = product.b2bTiers[selectedTierIndex] || product.b2bTiers[0]

  const unitPrice =
    mode === 'retail'
      ? currentVariant.retailPrice
      : currentTier.pricePerKg * currentTier.minQtyKg

  const totalPrice = unitPrice * quantity

  const handleAddToCart = () => {
    // Save to simple localStorage cart
    const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
    const item = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      mode,
      sizeLabel: mode === 'retail' ? currentVariant.label : `${currentTier.minQtyKg} kg (Wholesale)`,
      unitPrice,
      quantity,
      totalPrice,
      image: product.image,
    }
    existing.push(item)
    localStorage.setItem('nt_cart', JSON.stringify(existing))

    setAddedMessage(`Added ${quantity} × ${product.name} to cart!`)
    setTimeout(() => setAddedMessage(''), 3000)
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nutty Tales! 👋\n\nI want to enquire about *${product.name}*:\n• Quantity: ${mode === 'retail' ? currentVariant.label : `${currentTier.minQtyKg} kg`}\n• Grade: ${product.grade}\n\nPlease share current pricing and dispatch schedule!`,
  )}`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left: Product Images */}
      <div className="lg:col-span-5 space-y-4">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-300">
              <span className="text-7xl">🥜</span>
              <span className="text-xs uppercase font-bold tracking-widest text-stone-400 mt-2">
                {product.category}
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            <span className="px-3 py-1 rounded-full bg-[#2D6A4F] text-white text-[11px] font-bold">
              {product.origin}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/95 text-stone-800 text-[11px] font-bold border border-stone-200">
              Grade: {product.grade}
            </span>
          </div>
        </div>

        {/* Origin & Trust Strip */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span className="font-semibold text-stone-700">FSSAI Status:</span>
            <span className="text-emerald-700 font-bold">Lic. {FSSAI_NUMBER}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-stone-700">Shelf Life:</span>
            <span>{product.shelfLifeMonths} Months</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-stone-700">Storage:</span>
            <span>{product.storage}</span>
          </div>
        </div>
      </div>

      {/* Right: Product Details & Dual Commerce Engine */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#176B68]">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#17233B] font-serif mt-1">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#17233B]/70 mt-2 leading-relaxed">
            {product.shortDesc}
          </p>
        </div>

        {/* Switcher: Buy Retail vs Buy Wholesale */}
        <div className="p-1.5 bg-[#17233B]/5 rounded-2xl flex gap-1 border border-[#17233B]/10">
          <button
            onClick={() => setMode('retail')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              mode === 'retail'
                ? 'bg-white text-[#17233B] shadow-sm'
                : 'text-[#17233B]/60 hover:text-[#17233B]'
            }`}
          >
            🛒 Retail Quantities (250g – 1 kg)
          </button>
          <button
            onClick={() => setMode('wholesale')}
            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              mode === 'wholesale'
                ? 'bg-[#176B68] text-white shadow-sm'
                : 'text-[#17233B]/60 hover:text-[#17233B]'
            }`}
          >
            📦 Wholesale Sacks (5 kg – 100 kg+)
          </button>
        </div>

        {/* Pricing & Pack Selector Box */}
        <div className="bg-white p-6 rounded-3xl border border-[#17233B]/10 shadow-sm space-y-5">
          {mode === 'retail' ? (
            /* Retail Pack Size Selector */
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/80">
                Select Retail Pack Size:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.sizeG}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedVariantIndex === idx
                        ? 'border-[#176B68] bg-[#176B68]/5 ring-2 ring-[#176B68]'
                        : 'border-[#17233B]/10 hover:border-[#17233B]/30 bg-white'
                    }`}
                  >
                    <span className="block text-base font-bold text-[#17233B]">{v.label}</span>
                    <span className="block text-xs font-semibold text-[#176B68] mt-0.5">
                      ₹{v.retailPrice}
                    </span>
                    {v.mrp && (
                      <span className="text-[10px] text-stone-400 line-through">
                        MRP ₹{v.mrp}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Wholesale Quantity Break Ladder */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]/80">
                  Select Wholesale Quantity Tier:
                </label>
                <span className="text-[10px] font-bold text-[#176B68] bg-[#176B68]/10 px-2 py-0.5 rounded border border-[#176B68]/20">
                  GST Invoice Included
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {product.b2bTiers.map((tier, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTierIndex(idx)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedTierIndex === idx
                        ? 'border-[#176B68] bg-[#176B68]/10 ring-2 ring-[#176B68]'
                        : 'border-[#17233B]/10 hover:border-[#17233B]/30 bg-white'
                    }`}
                  >
                    <span className="block text-sm font-bold text-[#17233B]">
                      {tier.minQtyKg} kg+
                    </span>
                    <span className="block text-xs font-extrabold text-[#176B68] mt-0.5">
                      ₹{tier.pricePerKg} <span className="text-[10px] font-normal">/kg</span>
                    </span>
                    <span className="text-[10px] text-[#176B68] font-semibold block">
                      Save {tier.savingsPercent}%
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-[#F7F2E8] rounded-xl border border-[#17233B]/10 text-xs text-[#17233B]/80 flex items-center justify-between">
                <span>Need 100 kg or full pallet shipment?</span>
                <Link
                  href={`/bulk-quote?product=${encodeURIComponent(product.name)}`}
                  className="font-bold text-[#176B68] hover:underline"
                >
                  Request Bulk RFQ →
                </Link>
              </div>
            </div>
          )}

          {/* Quantity & Total Price */}
          <div className="pt-3 border-t border-[#17233B]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#17233B]/80">Units:</span>
              <div className="flex items-center border border-[#17233B]/20 rounded-xl overflow-hidden bg-[#F7F2E8]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-sm font-bold hover:bg-[#17233B]/10"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold bg-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-sm font-bold hover:bg-[#17233B]/10"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-stone-500 block">Total Amount</span>
              <span className="text-2xl font-black text-[#17233B]">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-stone-500 block">
                {mode === 'wholesale' ? '(Excl. GST & Freight)' : '(Incl. all taxes)'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-[#176B68] hover:bg-[#125350] text-white font-bold rounded-2xl shadow-sm transition-all text-xs uppercase tracking-wider"
            >
              Add to Cart
            </button>

            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-[#17233B] hover:bg-black text-white font-bold rounded-2xl shadow-sm transition-all text-xs uppercase tracking-wider text-center"
            >
              Buy Now
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-5 border-2 border-[#176B68] text-[#176B68] hover:bg-[#176B68]/5 font-bold rounded-2xl text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>💬 WhatsApp Concierge</span>
            </a>
          </div>

          {addedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl font-semibold text-center animate-fade-in">
              ✓ {addedMessage}{' '}
              <Link href="/cart" className="underline ml-2">
                View Cart →
              </Link>
            </div>
          )}
        </div>

        {/* Nutritional Facts Table */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-sm text-[#3D2B1F] uppercase tracking-wider">
            Nutritional Values (Per {product.nutrition.servingSize})
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 block">Energy</span>
              <span className="font-bold text-stone-900">{product.nutrition.calories} kcal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 block">Protein</span>
              <span className="font-bold text-stone-900">{product.nutrition.protein}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 block">Carbs</span>
              <span className="font-bold text-stone-900">{product.nutrition.carbs}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 block">Fats</span>
              <span className="font-bold text-stone-900">{product.nutrition.fat}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 block">Fiber</span>
              <span className="font-bold text-stone-900">{product.nutrition.fiber}g</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
              <span className="text-[10px] text-stone-500 block">Sodium</span>
              <span className="font-bold text-stone-900">{product.nutrition.sodium ?? 0}mg</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-500">
            <strong>Allergen Declaration:</strong> {product.allergens}
          </p>
        </div>
      </div>
    </div>
  )
}
