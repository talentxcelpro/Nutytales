'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HealthConditionData } from '@/lib/health-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface HealthConditionClientProps {
  data: HealthConditionData
}

export default function HealthConditionClient({ data }: HealthConditionClientProps) {
  const [selectedPortionIdx, setSelectedPortionIdx] = useState(0)
  const [activeTab, setActiveTab] = useState<'portions' | 'schedule' | 'clinical' | 'foods'>('portions')
  const [cartAdded, setCartAdded] = useState(false)
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)

  const activePortion = data.portions[selectedPortionIdx] || data.portions[0]
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleAddToCart = () => {
    try {
      const existing = localStorage.getItem('nt_cart')
      const cart = existing ? JSON.parse(existing) : []

      const packItem = {
        productId: `pack-${data.slug}`,
        name: data.curatedPack.title,
        slug: data.curatedPack.items[0]?.slug || 'makhana-grade-a-fox-nuts',
        mode: 'retail' as const,
        sizeLabel: data.curatedPack.weightTotal,
        unitPrice: data.curatedPack.price,
        quantity: 1,
        totalPrice: data.curatedPack.price,
        price: data.curatedPack.price,
        formattedPrice: `₹${data.curatedPack.price.toLocaleString('en-IN')}`,
        image: data.curatedPack.items[0]?.image || '/images/promo-makhana-899.webp',
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
      console.error('Error adding pack to cart', e)
    }
  }

  const whatsappPackMessage = `Hello Nuty Tales! I would like to order the *${data.curatedPack.title}* (₹${data.curatedPack.price} - ${data.curatedPack.weightTotal}) for ${data.name}.\n\nPlease share delivery timeline and payment details.`

  return (
    <div className="space-y-12">
      {/* ── Condition Interactive Calculator & Guidance Hub ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold">
              Personalized {data.name} Protocol
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Select your profile to calculate scientific daily portions & nutrient bio-availability
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setActiveTab('portions')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'portions'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Portion Calculator
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'schedule'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daily Clock
            </button>
            <button
              onClick={() => setActiveTab('foods')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'foods'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Safe vs Avoid
            </button>
            <button
              onClick={() => setActiveTab('clinical')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'clinical'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Clinical Studies
            </button>
          </div>
        </div>

        {/* Tab 1: Portions & Dosage */}
        {activeTab === 'portions' && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 mr-2">
                Select Your Stage / Body Category:
              </span>
              {data.portions.map((portion, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPortionIdx(idx)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all ${
                    selectedPortionIdx === idx
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {portion.weightRangeKg}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-emerald-900 text-white rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-emerald-200 font-medium">
                    Recommended Daily Target
                  </div>
                  <div className="text-4xl font-serif font-bold mt-2 text-white">
                    {activePortion.dailyIntakeGrams} <span className="text-lg font-sans font-normal text-emerald-200">grams/day</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-800 text-xs text-emerald-100 space-y-1">
                    <p>
                      <strong className="text-white">Glycemic Impact:</strong> {activePortion.glycemicImpact}
                    </p>
                    <p>
                      <strong className="text-white">Best Timing:</strong> {activePortion.bestTimeToConsume}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-800/80 text-xs text-emerald-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Calibrated to FSSAI Dietary Allowances</span>
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Target Daily Nut & Superfood Breakdown:
                </div>
                <div className="space-y-3">
                  {activePortion.recommendedComposition.map((item, i) => (
                    <div
                      key={i}
                      className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-semibold text-stone-900 text-sm">{item.name}</div>
                        <div className="text-xs text-stone-600 mt-0.5">{item.reason}</div>
                      </div>
                      <div className="inline-flex items-center px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-bold text-emerald-800 self-start sm:self-auto">
                        {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Daily Clock */}
        {activeTab === 'schedule' && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.dailySchedule.map((slot, idx) => (
                <div key={idx} className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 flex gap-4">
                  <div className="flex-shrink-0 w-16 text-center">
                    <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-md">
                      {slot.time}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-semibold uppercase text-stone-600 tracking-wide">
                      {slot.label}
                    </div>
                    <div className="text-sm font-bold text-stone-900">{slot.recommendation}</div>
                    <p className="text-xs text-stone-600 leading-relaxed pt-1">{slot.tips}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Safe vs Avoid */}
        {activeTab === 'foods' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Recommended Therapeutic Foods
              </h3>
              <div className="space-y-2">
                {data.safeFoods.map((food, idx) => (
                  <div key={idx} className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 text-sm">{food.food}</span>
                      <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                        GI: {food.gi}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1">{food.benefit}</p>
                    <div className="text-xs text-emerald-700 font-medium mt-1">
                      Serving: {food.serving}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> Foods & Preparation to Avoid
              </h3>
              <div className="space-y-2">
                {data.avoidFoods.map((food, idx) => (
                  <div key={idx} className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/60">
                    <div className="font-semibold text-stone-900 text-sm">{food.food}</div>
                    <p className="text-xs text-stone-600 mt-1">{food.dangerReason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Clinical Studies */}
        {activeTab === 'clinical' && (
          <div className="mt-6 space-y-4">
            {data.clinicalStudies.map((study, idx) => (
              <div key={idx} className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded">
                    {study.journal} ({study.year})
                  </span>
                  <a
                    href={study.doiOrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    View PubMed / DOI
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <h4 className="text-sm font-bold text-stone-900">{study.title}</h4>
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                  <strong className="text-emerald-950 font-semibold">Key Clinical Finding: </strong>
                  {study.keyFinding}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Curated Doctor-Vetted 30-Day Care Box ── */}
      <section className="bg-gradient-to-br from-emerald-950 via-stone-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative border border-emerald-800/40">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              30-Day Curated Therapeutic Supply
            </span>
            <span className="text-xs text-emerald-200/80 font-mono">
              FSSAI Lic. #{FSSAI_NUMBER}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                {data.curatedPack.title}
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {data.curatedPack.subtitle}. Single-origin, nitrogen-sealed batch with zero artificial preservatives or added sodium.
              </p>

              <div className="space-y-2 pt-2">
                {data.curatedPack.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <Link href={`/shop/${item.slug}`} className="font-semibold text-white hover:text-emerald-300 transition-colors">
                        {item.name} ({item.weight})
                      </Link>
                    </div>
                    <span className="text-emerald-300 text-right">{item.role}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-emerald-300/70 italic pt-2">
                {data.curatedPack.fssaiNote}
              </p>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-5">
              <div className="text-xs uppercase tracking-widest text-emerald-200 font-semibold">
                Complete 30-Day Therapeutic Care Pack
              </div>

              <div className="flex items-baseline justify-center gap-3">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-white">
                  ₹{data.curatedPack.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-stone-400 line-through">
                  ₹{data.curatedPack.mrp.toLocaleString('en-IN')}
                </span>
                <span className="px-2 py-0.5 bg-emerald-500 text-stone-950 font-bold text-xs rounded-full">
                  {data.curatedPack.discountPercent}% OFF
                </span>
              </div>

              <div className="text-xs text-emerald-200">
                Includes Express Priority Dispatch + GST Invoice
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartAdded ? 'Added to Cart! Opening...' : 'Add 30-Day Pack to Cart'}
                </button>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappPackMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z" />
                  </svg>
                  Instant 1-Click WhatsApp Order
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Evidence-Based FAQ Accordion ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold mb-6">
          Frequently Asked Medical & Dietary Questions
        </h3>
        <div className="space-y-3">
          {data.faq.map((item, idx) => {
            const isOpen = openFaqIdx === idx
            return (
              <div
                key={idx}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-stone-900 text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-stone-50"
                >
                  <span>{item.question}</span>
                  <svg
                    className={`w-5 h-5 text-stone-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
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
