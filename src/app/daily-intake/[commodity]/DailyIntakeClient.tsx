'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { IntakeCommodityData } from '@/lib/daily-intake-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface DailyIntakeClientProps {
  data: IntakeCommodityData
}

export default function DailyIntakeClient({ data }: DailyIntakeClientProps) {
  const [selectedAgeIndex, setSelectedAgeIndex] = useState(2) // Default to Healthy Adults
  const [addedToCart, setAddedToCart] = useState(false)

  const activeAge = data.ageGuidelines[selectedAgeIndex] || data.ageGuidelines[0]
  const supportPhone = WHATSAPP_NUMBERS?.SUPPORT || DEFAULT_CONTACT_PHONE

  const handleAddToCart = () => {
    try {
      const stored = localStorage.getItem('nt_cart')
      const currentCart = stored ? JSON.parse(stored) : []
      const productId = `daily-intake-${data.slug}`
      const existingIdx = currentCart.findIndex((i: any) => i.productId === productId || i.slug === data.productSlug)

      if (existingIdx > -1) {
        currentCart[existingIdx].quantity += 1
        currentCart[existingIdx].totalPrice = (currentCart[existingIdx].price || data.monthlyPackPrice) * currentCart[existingIdx].quantity
      } else {
        currentCart.push({
          productId,
          name: data.monthlyPackTitle,
          slug: data.productSlug,
          price: data.monthlyPackPrice,
          unitPrice: data.monthlyPackPrice,
          totalPrice: data.monthlyPackPrice,
          quantity: 1,
          sizeLabel: data.monthlyPackWeight,
          variant: data.monthlyPackWeight,
          image: data.productImage,
        })
      }

      localStorage.setItem('nt_cart', JSON.stringify(currentCart))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3500)
    } catch {
      // Fallback
      setAddedToCart(true)
    }
  }

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello Nuty Tales! I am reading your Daily Intake Guide for ${data.commodityName}. I want to order the "${data.monthlyPackTitle}" (${data.monthlyPackWeight}) at ₹${data.monthlyPackPrice}. Please confirm availability and dispatch timeline.`
    )
    window.open(`https://wa.me/${supportPhone}?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C241D]">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#E8DEC8] bg-[#F7F2E7]/70 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 text-xs text-[#7A6B5D]">
          <Link href="/" className="hover:text-[#5B2E1E]">Home</Link>
          <span>/</span>
          <Link href="/daily-intake" className="hover:text-[#5B2E1E]">Daily Intake Guide</Link>
          <span>/</span>
          <span className="font-semibold text-[#5B2E1E]">{data.commodityName}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F2E7] to-[#FDFBF7] py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4C3A3] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#7A4B2A] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              {data.heroBadge}
            </span>
            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#3B1E13] md:text-5xl">
              {data.headline}
            </h1>
            <p className="mt-2 text-sm font-medium italic text-[#7A6B5D]">
              {data.hindiName} • {data.botanicalName}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#5C4F43] md:text-lg">
              {data.subheadline}
            </p>
          </div>

          {/* Interactive Intake Calculator Card */}
          <div className="mt-10 rounded-2xl border border-[#D9CDB8] bg-white p-6 shadow-xl md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#A05A2C]">Interactive Dosing Matrix</span>
                <h2 className="mt-1 font-serif text-xl font-bold text-[#3B1E13] md:text-2xl">
                  Select Age Group & Biological Stage:
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.ageGuidelines.map((guideline, idx) => (
                  <button
                    key={guideline.group}
                    onClick={() => setSelectedAgeIndex(idx)}
                    className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      selectedAgeIndex === idx
                        ? 'bg-[#5B2E1E] text-white shadow-md'
                        : 'border border-[#E0D5C1] bg-[#F9F6F0] text-[#5C4F43] hover:border-[#5B2E1E]'
                    }`}
                  >
                    {guideline.group} ({guideline.ageRange})
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Result Box */}
            <div className="mt-8 grid grid-cols-1 gap-6 rounded-xl border border-[#E8DEC8] bg-[#FBF9F4] p-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-5 border border-[#E8DEC8] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B5D]">Exact Daily Count</span>
                <p className="mt-2 font-serif text-2xl font-extrabold text-[#5B2E1E] md:text-3xl">
                  {activeAge.recommendedCount}
                </p>
                <p className="mt-1 text-xs text-[#7A6B5D]">Weight: {activeAge.recommendedGrams}</p>
              </div>

              <div className="rounded-lg bg-white p-5 border border-[#E8DEC8] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B5D]">Optimal Timing & Form</span>
                <p className="mt-2 text-sm font-semibold text-[#3B1E13]">
                  {activeAge.optimalTiming}
                </p>
                <p className="mt-1 text-xs text-[#16A34A] font-medium">✓ 100% Bio-active absorption</p>
              </div>

              <div className="rounded-lg bg-white p-5 border border-[#E8DEC8] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A6B5D]">Clinical Benefit</span>
                <p className="mt-2 text-xs leading-relaxed text-[#5C4F43]">
                  {activeAge.clinicalReason}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column (2 Cols): Protocols, Biochemical Explanations, Timing Clock */}
          <div className="space-y-12 lg:col-span-2">
            {/* Key Micronutrient Breakdown */}
            <section className="rounded-2xl border border-[#E8DEC8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-serif text-2xl font-bold text-[#3B1E13]">
                Daily Micronutrient Density (Per Serving)
              </h2>
              <p className="mt-2 text-sm text-[#7A6B5D]">
                Measured clinical bioavailability from raw single-origin harvest lots (FSSAI Lic. #22724441000048).
              </p>
              <div className="mt-6 divide-y divide-[#EFE7D8]">
                {data.keyNutrientsPerDailyDose.map((nutr) => (
                  <div key={nutr.nutrient} className="flex items-center justify-between py-3 text-sm">
                    <span className="font-semibold text-[#3B1E13]">{nutr.nutrient}</span>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#5B2E1E]">{nutr.amount}</span>
                      <span className="ml-2 rounded bg-[#F4EDE2] px-2 py-0.5 text-xs text-[#7A4B2A]">{nutr.dailyValuePercent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Overnight Soaking Science & Step-by-Step */}
            <section className="rounded-2xl border border-[#E8DEC8] bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5B2E1E] text-white font-bold">
                  💧
                </span>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#3B1E13]">
                    {data.soakingProtocol.recommended ? 'The Science of Overnight Soaking' : 'Preparation & Consumption Rules'}
                  </h2>
                  <p className="text-xs text-[#7A6B5D]">
                    {data.soakingProtocol.recommended
                      ? `Recommended Duration: ${data.soakingProtocol.soakingDurationHours} Hours | Peel Skin: ${data.soakingProtocol.peelSkin ? 'Yes' : 'No'}`
                      : 'No soaking needed for puffed/roasted commodities'}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-[#F7F2E7] p-5 text-sm leading-relaxed text-[#5C4F43]">
                <strong className="text-[#3B1E13]">Biochemical Mechanism: </strong>
                {data.soakingProtocol.biochemicalReason}
              </div>

              {/* Step by Step Timeline */}
              <div className="mt-8 space-y-4">
                {data.soakingProtocol.stepByStep.map((s) => (
                  <div key={s.step} className="flex items-start gap-4 rounded-xl border border-[#EFE7D8] p-4 transition-all hover:bg-[#FAF8F5]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5B2E1E] text-xs font-bold text-white">
                      {s.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#3B1E13]">{s.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#5C4F43]">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Ayurvedic Dinacharya Timing Clock */}
            <section className="rounded-2xl border border-[#E8DEC8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-serif text-2xl font-bold text-[#3B1E13]">
                Optimal Ayurvedic Timing Clock (Dinacharya)
              </h2>
              <p className="mt-2 text-sm text-[#7A6B5D]">
                Aligning dry fruit consumption with your biological circadian rhythms for optimal gut bio-transformation.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.idealTimingClock.map((clock, idx) => (
                  <div key={idx} className="rounded-xl border border-[#E8DEC8] bg-[#FBF9F4] p-5">
                    <span className="rounded bg-[#5B2E1E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {clock.timeOfDay}
                    </span>
                    <h3 className="mt-3 font-semibold text-[#3B1E13]">{clock.ayurvedicPhase}</h3>
                    <p className="mt-1 text-xs font-medium text-[#7A4B2A]">Best for: {clock.bestFor}</p>
                    <p className="mt-3 text-xs leading-relaxed text-[#5C4F43]">
                      <strong className="text-[#3B1E13]">Protocol: </strong>
                      {clock.howToConsume}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Safety & Contraindications */}
            <section className="rounded-2xl border border-[#FED7AA] bg-[#FFFBEB] p-6 md:p-8">
              <div className="flex items-center gap-2 text-[#9A3412]">
                <span className="text-xl">⚠️</span>
                <h2 className="font-serif text-xl font-bold">Safety Limits & Contraindications</h2>
              </div>
              <div className="mt-4 space-y-3">
                {data.whoShouldAvoidOrLimit.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-[#FDBA74] bg-white p-4 text-xs">
                    <p className="font-bold text-[#9A3412]">{item.condition} — Safe Limit: {item.safeLimit}</p>
                    <p className="mt-1 text-[#7C2D12]">{item.caution}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Frequently Asked Questions */}
            <section className="rounded-2xl border border-[#E8DEC8] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-serif text-2xl font-bold text-[#3B1E13]">
                Frequently Asked Clinical Questions
              </h2>
              <div className="mt-6 space-y-4">
                {data.faq.map((q, idx) => (
                  <div key={idx} className="rounded-xl border border-[#EFE7D8] p-5">
                    <h3 className="font-semibold text-[#3B1E13]">{q.question}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#5C4F43]">{q.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: 1-Click Monthly Harvest Dispenser Box & Quick Conversion */}
          <div className="space-y-6">
            <div className="sticky top-20 rounded-2xl border-2 border-[#5B2E1E] bg-white p-6 shadow-xl">
              <span className="inline-block rounded-full bg-[#16A34A] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                30-Day Fresh Harvest Subscription
              </span>

              <div className="mt-4 relative h-48 w-full overflow-hidden rounded-xl bg-[#F7F2E7]">
                <Image
                  src={data.productImage}
                  alt={data.monthlyPackTitle}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <h3 className="mt-4 font-serif text-xl font-bold text-[#3B1E13]">
                {data.monthlyPackTitle}
              </h3>
              <p className="mt-1 text-xs text-[#7A6B5D]">{data.monthlyPackWeight}</p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold text-[#5B2E1E]">
                  ₹{data.monthlyPackPrice}
                </span>
                <span className="text-sm text-[#7A6B5D] line-through">
                  ₹{data.monthlyPackMrp}
                </span>
                <span className="rounded bg-[#DCFCE7] px-2 py-0.5 text-xs font-bold text-[#16A34A]">
                  Save {Math.round(((data.monthlyPackMrp - data.monthlyPackPrice) / data.monthlyPackMrp) * 100)}%
                </span>
              </div>

              <ul className="mt-4 space-y-2 text-xs text-[#5C4F43]">
                <li className="flex items-center gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  Pre-portioned for exactly 30 daily therapeutic servings
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  100% Unpasteurized, single-origin Himalayan terroir
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  Central FSSAI Lic. #22724441000048 certified purity
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#16A34A] font-bold">✓</span>
                  Free Express Delivery across India within 48 hours
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full rounded-xl py-3.5 text-center text-sm font-bold tracking-wide transition-all shadow-md ${
                    addedToCart
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#5B2E1E] text-white hover:bg-[#431F14]'
                  }`}
                >
                  {addedToCart ? '✓ Added to Cart!' : 'Add 30-Day Box to Cart'}
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#25D366] bg-[#25D366]/10 py-3 text-center text-xs font-bold text-[#128C7E] transition-all hover:bg-[#25D366] hover:text-white"
                >
                  <span>💬</span> Order Instantly on WhatsApp
                </button>
              </div>

              <div className="mt-6 border-t border-[#E8DEC8] pt-4 text-center">
                <p className="text-[11px] text-[#7A6B5D]">
                  Need a custom family or diabetic bundle? Call/WhatsApp our Nutrition Desk at{' '}
                  <a href={`tel:${supportPhone}`} className="font-semibold text-[#5B2E1E] underline">
                    {supportPhone}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
