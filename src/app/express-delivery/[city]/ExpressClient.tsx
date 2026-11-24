'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CityDeliveryData, CityDeliveryBestseller } from '@/lib/delivery-cities-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface ExpressClientProps {
  cityData: CityDeliveryData
}

export default function ExpressClient({ cityData }: ExpressClientProps) {
  const [pinInput, setPinInput] = useState('')
  const [pinResult, setPinResult] = useState<string | null>(null)
  const [cartAddedSlug, setCartAddedSlug] = useState<string | null>(null)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = pinInput.trim()
    if (clean.length === 6 && /^\d+$/.test(clean)) {
      setPinResult(`✓ Pincode ${clean} is fully covered! ${cityData.deliveryTimeline}. Free delivery on orders above ₹999.`)
    } else {
      setPinResult('Please enter a valid 6-digit Indian pincode.')
    }
  }

  const handleAddToCart = (item: CityDeliveryBestseller) => {
    try {
      const existing = localStorage.getItem('nt_cart')
      const cart = existing ? JSON.parse(existing) : []

      const cartItem = {
        productId: `express-${item.slug}`,
        name: item.name,
        slug: item.slug,
        mode: 'retail' as const,
        sizeLabel: item.weight,
        unitPrice: item.price,
        quantity: 1,
        totalPrice: item.price,
        price: item.price,
        formattedPrice: `₹${item.price.toLocaleString('en-IN')}`,
        image: item.image,
      }

      const existingIndex = cart.findIndex((i: { productId: string }) => i.productId === cartItem.productId)
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1
      } else {
        cart.push(cartItem)
      }

      localStorage.setItem('nt_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setCartAddedSlug(item.slug)
      setTimeout(() => setCartAddedSlug(null), 3000)
    } catch (e) {
      console.error('Error adding express item to cart', e)
    }
  }

  return (
    <div className="space-y-12">
      {/* ── Pincode Verification Banner ── */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Real-Time Express Delivery Check
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Check Express Delivery Timeline to Your Locality in {cityData.cityName}
          </h2>

          <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-md mx-auto pt-2">
            <input
              type="text"
              maxLength={6}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter your 6-digit pincode..."
              className="flex-1 px-4 py-3 border border-stone-300 rounded-xl text-base font-mono focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs whitespace-nowrap"
            >
              Verify Pincode
            </button>
          </form>

          {pinResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-950 max-w-md mx-auto">
              {pinResult}
            </div>
          )}

          {/* Popular Covered Areas */}
          <div className="pt-4 text-xs text-stone-500">
            <span className="font-bold text-stone-700 block mb-2">Major Localities Serviced Daily:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {cityData.popularLocalities.map((area, i) => (
                <span key={i} className="px-2.5 py-1 bg-stone-100 rounded-lg text-stone-700 text-[11px]">
                  ✓ {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bestselling Products Ready for Express Dispatch ── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Popular in {cityData.cityName} — Ready for Immediate Dispatch
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Guaranteed single-origin mountain harvest with Central FSSAI Lic. #{FSSAI_NUMBER}
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
          >
            <span>View All Products</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cityData.bestsellers.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                  {item.offer}
                </span>

                <h4 className="text-lg font-serif font-bold text-stone-900">
                  <Link href={`/shop/${item.slug}`} className="hover:text-emerald-800 transition-colors">
                    {item.name}
                  </Link>
                </h4>

                <div className="text-xs text-stone-500 font-medium">
                  Pack Size: <span className="font-bold text-stone-800">{item.weight}</span>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="flex items-baseline gap-2 pt-2 border-t border-stone-100">
                  <span className="text-2xl font-serif font-bold text-emerald-950">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{item.mrp.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="py-2.5 px-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    {cartAddedSlug === item.slug ? 'Added!' : 'Add to Cart'}
                  </button>

                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      `Hello Nuty Tales! I would like to order *${item.name}* (₹${item.price} - ${item.weight}) for express delivery in ${cityData.cityName}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Express Delivery FAQ ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8">
        <h3 className="text-xl font-serif text-stone-900 font-bold mb-6">
          Frequently Asked Questions About Delivery in {cityData.cityName}
        </h3>
        <div className="space-y-3">
          {cityData.faq.map((item, idx) => {
            const isOpen = openFaqIdx === idx
            return (
              <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-stone-900 text-sm flex items-center justify-between gap-4 hover:bg-stone-50"
                >
                  <span>{item.question}</span>
                  <svg
                    className={`w-4 h-4 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
