'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RecipeData } from '@/lib/recipes-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface RecipeClientProps {
  recipe: RecipeData
}

export default function RecipeClient({ recipe }: RecipeClientProps) {
  const [servingsMultiplier, setServingsMultiplier] = useState(1)
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({})
  const [cartAdded, setCartAdded] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const handleAddBundleToCart = () => {
    try {
      const existing = localStorage.getItem('nt_cart')
      const cart = existing ? JSON.parse(existing) : []

      const bundleItem = {
        productId: `recipe-kit-${recipe.slug}`,
        name: recipe.bundleCart.bundleTitle,
        slug: recipe.ingredients[0]?.productSlug || 'makhana-grade-a-fox-nuts',
        mode: 'retail' as const,
        sizeLabel: 'Complete Raw Ingredient Kit',
        unitPrice: recipe.bundleCart.bundlePrice,
        quantity: 1,
        totalPrice: recipe.bundleCart.bundlePrice,
        price: recipe.bundleCart.bundlePrice,
        formattedPrice: `₹${recipe.bundleCart.bundlePrice.toLocaleString('en-IN')}`,
        image: recipe.heroImage,
      }

      const existingIndex = cart.findIndex((i: { productId: string }) => i.productId === bundleItem.productId)
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1
      } else {
        cart.push(bundleItem)
      }

      localStorage.setItem('nt_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setCartAdded(true)
      setTimeout(() => setCartAdded(false), 3000)
    } catch (e) {
      console.error('Error adding recipe bundle to cart', e)
    }
  }

  const whatsappMessage = `Hello Nuty Tales! I am making *${recipe.title}* and would like to order the *${recipe.bundleCart.bundleTitle}* (₹${recipe.bundleCart.bundlePrice}). Please share delivery timeline to my address.`

  return (
    <div className="space-y-12">
      {/* ── Quick Recipe Metadata Bar ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-x divide-stone-100">
          <div className="px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Prep Time</span>
            <span className="text-lg sm:text-xl font-bold font-serif text-stone-900 mt-1 block">
              {recipe.prepTimeMinutes} mins
            </span>
          </div>
          <div className="px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Cook Time</span>
            <span className="text-lg sm:text-xl font-bold font-serif text-stone-900 mt-1 block">
              {recipe.cookTimeMinutes} mins
            </span>
          </div>
          <div className="px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Calories</span>
            <span className="text-lg sm:text-xl font-bold font-serif text-emerald-800 mt-1 block">
              {recipe.caloriesPerServing * servingsMultiplier} kcal
            </span>
          </div>
          <div className="px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Plant Protein</span>
            <span className="text-lg sm:text-xl font-bold font-serif text-emerald-800 mt-1 block">
              {(recipe.proteinGrams * servingsMultiplier).toFixed(1)}g / serving
            </span>
          </div>
        </div>
      </section>

      {/* ── Ingredients & Preparation Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ingredients Checklist (Left Column) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Ingredients</h3>
              <p className="text-xs text-stone-500 mt-0.5">Click to check off while cooking</p>
            </div>

            {/* Servings Scaler */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setServingsMultiplier(Math.max(1, servingsMultiplier - 1))}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-xs text-stone-700 hover:text-stone-950 font-bold"
              >
                -
              </button>
              <span className="px-2 text-stone-800">{recipe.servings * servingsMultiplier} Servings</span>
              <button
                onClick={() => setServingsMultiplier(servingsMultiplier + 1)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-xs text-stone-700 hover:text-stone-950 font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {recipe.ingredients.map((item, idx) => {
              const isChecked = checkedIngredients[idx]
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredientCheck(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-stone-50/70 border-stone-200 text-stone-400 line-through'
                      : 'bg-white border-stone-200/80 hover:border-emerald-500'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!isChecked}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-stone-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">{item.quantity}</div>

                    {item.isNutyTalesProduct && item.productSlug && (
                      <Link
                        href={`/shop/${item.productSlug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold hover:underline mt-1.5"
                      >
                        <span>✓ Use Certified Single-Origin {item.productName}</span>
                        <span>→</span>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* 1-Click Recipe Ingredient Bundle Card */}
          <div className="bg-emerald-950 text-white rounded-2xl p-5 space-y-4 border border-emerald-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                Cook With Farm-Fresh Origin Ingredients
              </span>
              <h4 className="text-base font-serif font-bold text-white mt-1">
                {recipe.bundleCart.bundleTitle}
              </h4>
              <p className="text-xs text-emerald-100/80 mt-1 leading-relaxed">
                {recipe.bundleCart.description}
              </p>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-serif font-bold text-white">
                  ₹{recipe.bundleCart.bundlePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400 line-through">
                  ₹{recipe.bundleCart.bundleMrp.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500 text-stone-950 font-bold text-[11px] rounded-full">
                {recipe.bundleCart.discountPercent}% OFF
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleAddBundleToCart}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartAdded ? 'Added to Cart! Opening...' : 'Add Ingredients to Cart'}
              </button>

              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Instant WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>

        {/* Step-by-Step Instructions (Right Column) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Method & Preparation Steps
            </h3>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              {recipe.steps.length} Simple Steps
            </span>
          </div>

          <div className="space-y-6">
            {recipe.steps.map((step) => (
              <div key={step.stepNumber} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {step.stepNumber}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {step.instruction}
                  </p>
                  {step.chefTip && (
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2 mt-2">
                      <span className="font-bold text-amber-800">Chef’s Secret:</span>
                      <span className="italic">{step.chefTip}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Nutritional Highlights Footer */}
          <div className="pt-6 border-t border-stone-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Nutritional & Ayurvedic Highlights:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.nutritionalHighlights.map((highlight, idx) => (
                <div key={idx} className="p-2.5 bg-stone-50 rounded-xl text-xs text-stone-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
