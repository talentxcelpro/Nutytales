'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { VratFestivalData } from '@/lib/vrat-fasting-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface VratClientProps {
  festival: VratFestivalData
}

export default function VratClient({ festival }: VratClientProps) {
  const [cartAdded, setCartAdded] = useState(false)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleAddToCart = () => {
    try {
      const existing = localStorage.getItem('nt_cart')
      const cart = existing ? JSON.parse(existing) : []

      const packItem = {
        productId: `vrat-box-${festival.slug}`,
        name: festival.curatedBox.title,
        slug: 'makhana-grade-a-fox-nuts',
        mode: 'retail' as const,
        sizeLabel: festival.curatedBox.weight,
        unitPrice: festival.curatedBox.price,
        quantity: 1,
        totalPrice: festival.curatedBox.price,
        price: festival.curatedBox.price,
        formattedPrice: `₹${festival.curatedBox.price.toLocaleString('en-IN')}`,
        image: '/images/promo-makhana-899.webp',
      }

      const existingIndex = cart.findIndex((i: { productId: string }) => i.productId === packItem.productId)
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1
      } else {
        cart.push(packItem)
      }

      localStorage.setItem('nt_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setCartAdded(true)
      setTimeout(() => setCartAdded(false), 3000)
    } catch (e) {
      console.error('Error adding vrat pack to cart', e)
    }
  }

  const whatsappMessage = `Hello Nuty Tales! I would like to order the *${festival.curatedBox.title}* (₹${festival.curatedBox.price} - ${festival.curatedBox.weight}) for ${festival.festivalName}. Please share express delivery details.`

  return (
    <div className="space-y-12">
      {/* ── Permissible vs Prohibited Fasting Foods ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold">
          Permissible Sattvic Foods vs Forbidden Items
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Permissible Foods */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Permitted Pure Falahari Foods (Sattvic)
            </h3>
            <div className="space-y-2">
              {festival.allowedFoods.map((item, idx) => (
                <div key={idx} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{item.food}</span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {item.role}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.reason}</p>
                  {item.productSlug && (
                    <Link
                      href={`/shop/${item.productSlug}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline mt-2"
                    >
                      <span>Buy Fresh Single-Origin {item.productName || item.food}</span>
                      <span>→</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prohibited Foods */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600"></span>
              Strictly Prohibited During Fast (Tamasic / Grains)
            </h3>
            <div className="space-y-2">
              {festival.prohibitedFoods.map((item, idx) => (
                <div key={idx} className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/60">
                  <div className="font-bold text-stone-900 text-sm">{item.food}</div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">{item.prohibitionReason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Daily Meal & Fasting Schedule ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold">
          Daily Fasting Protocol & Timing
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {festival.fastingProtocol.map((slot, idx) => (
            <div key={idx} className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg font-mono">
                  {slot.time}
                </span>
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  {slot.phase}
                </span>
              </div>
              <div className="font-bold text-stone-900 text-sm pt-1">{slot.recommendation}</div>
              <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/70">
                <strong className="text-emerald-950 font-semibold">Spiritual & Digestive Benefit: </strong>
                {slot.spiritualAndDigestiveTip}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Curated Vrat Superfood Hamper ── */}
      <section className="bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-emerald-800/40">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All-In-One Sattvic Fasting Box
            </span>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {festival.curatedBox.title}
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              100% pure, unpolished single-origin festive superfoods packed hygienically with Central FSSAI Lic. #{FSSAI_NUMBER}. Zero grain contamination, zero chemical sulfur.
            </p>

            <div className="space-y-1.5 pt-2">
              {festival.curatedBox.items.map((item, i) => (
                <div key={i} className="text-xs text-stone-200 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
            <div className="text-xs uppercase tracking-widest text-emerald-200 font-semibold">
              Special Fasting Offer Price
            </div>

            <div className="flex items-baseline justify-center gap-3">
              <span className="text-4xl font-serif font-bold text-white">
                ₹{festival.curatedBox.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-stone-400 line-through">
                ₹{festival.curatedBox.mrp.toLocaleString('en-IN')}
              </span>
              <span className="px-2 py-0.5 bg-emerald-500 text-stone-950 font-bold text-xs rounded-full">
                {festival.curatedBox.discountPercent}% OFF
              </span>
            </div>

            <div className="text-[11px] text-emerald-200">
              Same-day / Express delivery with GST invoice
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartAdded ? 'Added! Opening Cart...' : 'Add Vrat Hamper to Cart'}
              </button>

              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fasting FAQ ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8">
        <h3 className="text-xl font-serif text-stone-900 font-bold mb-6">
          Frequently Asked Fasting & Religious Questions
        </h3>
        <div className="space-y-3">
          {festival.faq.map((item, idx) => {
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
