'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

// Goal Profiles
export type HealthGoal =
  | 'WEIGHT_LOSS'
  | 'LEAN_MUSCLE'
  | 'HEART_HEALTH'
  | 'DIABETIC_CARE'
  | 'BRAIN_MEMORY'
  | 'SKIN_ANTI_AGING'

export type ActivityLevel = 'SEDENTARY' | 'MODERATE' | 'ATHLETIC'
export type DemographicGroup = 'ADULT_MALE' | 'ADULT_FEMALE' | 'PREGNANCY' | 'SENIOR'

interface GoalConfig {
  id: HealthGoal
  name: string
  subtitle: string
  badge: string
  accentColor: string
  description: string
  nutMultiplier: number
  keySuperfood: string
}

const GOALS: Record<HealthGoal, GoalConfig> = {
  WEIGHT_LOSS: {
    id: 'WEIGHT_LOSS',
    name: 'Weight Loss & Satiety',
    subtitle: 'High Fiber · Low Glycemic · Natural Crunch',
    badge: 'Metabolism Boost',
    accentColor: '#176B68',
    description: 'Replaces processed snacks with low-calorie roasted Makhana and high-fiber raw almonds to keep hunger at bay for 4+ hours.',
    nutMultiplier: 0.85,
    keySuperfood: 'Jumbo Mithila Makhana',
  },
  LEAN_MUSCLE: {
    id: 'LEAN_MUSCLE',
    name: 'Lean Muscle & High Protein',
    subtitle: 'Plant BCAAs · Healthy Fats · Power Density',
    badge: 'Gym & Recovery',
    accentColor: '#C9A45C',
    description: 'Maximizes clean plant protein with Kashmiri Mamra Almonds, W240 Cashews, and Iranian Pistachios for muscle repair.',
    nutMultiplier: 1.35,
    keySuperfood: 'Kashmiri Mamra Almonds',
  },
  HEART_HEALTH: {
    id: 'HEART_HEALTH',
    name: 'Heart & Cholesterol Care',
    subtitle: 'Plant Sterols · Monounsaturated Fats · Zero Sodium',
    badge: 'Cardio Vitality',
    accentColor: '#8C271E',
    description: 'High-altitude Kashmiri Walnuts provide exceptional ALA Omega-3 to help maintain arterial elasticity and healthy LDL balance.',
    nutMultiplier: 1.0,
    keySuperfood: 'Kagzi Mountain Walnuts',
  },
  DIABETIC_CARE: {
    id: 'DIABETIC_CARE',
    name: 'Diabetes & Blood Sugar',
    subtitle: 'Ultra-Low GI · Insulin Sensitivity · Micronutrients',
    badge: 'Endocrinologist Approved',
    accentColor: '#2C5E7A',
    description: 'Slow-burning healthy fats and soluble fiber balance post-meal glucose spikes with zero added sugar or artificial coatings.',
    nutMultiplier: 0.9,
    keySuperfood: 'Unsalted Raw Pistachios',
  },
  BRAIN_MEMORY: {
    id: 'BRAIN_MEMORY',
    name: 'Brain Focus & Ayurveda',
    subtitle: 'Neuro-Protective · Neurogenesis · Ojas Vitality',
    badge: 'Ayurvedic Memory Formula',
    accentColor: '#6B4C9A',
    description: 'Rich in vitamin E, riboflavin, and natural cold-pressed nut oils celebrated in Charaka Samhita for cognitive clarity and memory retention.',
    nutMultiplier: 1.1,
    keySuperfood: 'High-Oil Mamra Badam',
  },
  SKIN_ANTI_AGING: {
    id: 'SKIN_ANTI_AGING',
    name: 'Skin Glow & Anti-Aging',
    subtitle: 'Crocin Saffron · Anthocyanins · Vitamin E',
    badge: 'Cellular Collagen',
    accentColor: '#B85D19',
    description: 'Combines royal Pampore saffron with wild blueberries and California almonds to fight oxidative stress and boost natural skin elasticity.',
    nutMultiplier: 1.05,
    keySuperfood: 'Pampore Mongra Saffron',
  },
}

interface ProductRecommendation {
  id: string
  name: string
  slug: string
  sizeLabel: string
  monthlyQuantityPacks: number
  unitPrice: number
  image: string
  role: string
}

export default function CalculatorClient() {
  const router = useRouter()
  const [goal, setGoal] = useState<HealthGoal>('WEIGHT_LOSS')
  const [demographic, setDemographic] = useState<DemographicGroup>('ADULT_MALE')
  const [weightKg, setWeightKg] = useState<number>(68)
  const [activity, setActivity] = useState<ActivityLevel>('MODERATE')
  const [addedMessage, setAddedMessage] = useState<string>('')

  // Calculation Engine
  const calculation = useMemo(() => {
    const selectedGoal = GOALS[goal]

    // Base multiplier based on body weight
    const weightFactor = weightKg / 65

    // Activity Factor
    const actFactor = activity === 'ATHLETIC' ? 1.25 : activity === 'MODERATE' ? 1.0 : 0.85

    // Demographic factor
    const demoFactor =
      demographic === 'PREGNANCY' ? 1.3 : demographic === 'SENIOR' ? 0.9 : demographic === 'ADULT_FEMALE' ? 0.92 : 1.0

    const totalFactor = weightFactor * actFactor * demoFactor * selectedGoal.nutMultiplier

    // Nut Grams
    const almondsGrams = Math.round(15 * totalFactor)
    const almondsCount = Math.round(almondsGrams / 1.3)

    const walnutsGrams = Math.round(12 * totalFactor)
    const walnutsHalves = Math.round(walnutsGrams / 3.0) * 2

    const makhanaGrams = goal === 'WEIGHT_LOSS' ? Math.round(25 * totalFactor) : Math.round(15 * totalFactor)
    const makhanaCups = (makhanaGrams / 12).toFixed(1)

    const pistachiosGrams = goal === 'LEAN_MUSCLE' || goal === 'DIABETIC_CARE' ? Math.round(15 * totalFactor) : Math.round(8 * totalFactor)
    const pistachiosCount = Math.round(pistachiosGrams / 0.8)

    const datesCount = goal === 'DIABETIC_CARE' ? 1 : goal === 'WEIGHT_LOSS' ? 1 : Math.round(2 * totalFactor)
    const datesGrams = datesCount * 18

    // Saffron recommendation
    const saffronStrands = demographic === 'PREGNANCY' || goal === 'SKIN_ANTI_AGING' ? 4 : 3

    // Nutritional Totals
    const totalCalories = Math.round(
      almondsGrams * 5.8 + walnutsGrams * 6.5 + makhanaGrams * 3.5 + pistachiosGrams * 5.6 + datesGrams * 2.8
    )

    const totalProtein = (
      almondsGrams * 0.21 +
      walnutsGrams * 0.15 +
      makhanaGrams * 0.1 +
      pistachiosGrams * 0.2 +
      datesGrams * 0.02
    ).toFixed(1)

    const totalFats = (
      almondsGrams * 0.5 +
      walnutsGrams * 0.65 +
      makhanaGrams * 0.01 +
      pistachiosGrams * 0.45 +
      datesGrams * 0.005
    ).toFixed(1)

    const totalFiber = (
      almondsGrams * 0.12 +
      walnutsGrams * 0.07 +
      makhanaGrams * 0.08 +
      pistachiosGrams * 0.1 +
      datesGrams * 0.07
    ).toFixed(1)

    // Recommended 30-day Supply Kit
    const recommendedKit: ProductRecommendation[] = [
      {
        id: goal === 'BRAIN_MEMORY' || goal === 'LEAN_MUSCLE' ? 'alm-002' : 'alm-001',
        name: goal === 'BRAIN_MEMORY' || goal === 'LEAN_MUSCLE' ? 'Kashmiri Mamra Almonds' : 'California Almonds Premium',
        slug: goal === 'BRAIN_MEMORY' || goal === 'LEAN_MUSCLE' ? 'mamra-almonds-kashmiri-badam' : 'california-almonds-premium',
        sizeLabel: '500g',
        monthlyQuantityPacks: 1,
        unitPrice: goal === 'BRAIN_MEMORY' || goal === 'LEAN_MUSCLE' ? 1850 : 650,
        image: '/images/almonds-pouch-250g.webp',
        role: 'Morning Metabolism & Brain Fuel',
      },
      {
        id: 'wal-001',
        name: 'Kashmiri Kagzi Walnuts (Snow Kernels)',
        slug: 'kashmiri-walnuts-in-shell',
        sizeLabel: '500g',
        monthlyQuantityPacks: 1,
        unitPrice: 850,
        image: '/images/himachal-walnuts-pouch-250g.webp',
        role: 'Omega-3 ALA Heart & Cellular Health',
      },
      {
        id: 'mkh-001',
        name: 'NutyTales Premium Makhana (Jumbo 6 Suta)',
        slug: 'makhana-grade-a-fox-nuts',
        sizeLabel: '500g',
        monthlyQuantityPacks: 1,
        unitPrice: 480,
        image: '/images/makhana-pouch-250g.webp',
        role: 'Zero-Cholesterol Afternoon Satiety Snack',
      },
      {
        id: goal === 'SKIN_ANTI_AGING' ? 'saf-001' : 'dat-001',
        name: goal === 'SKIN_ANTI_AGING' ? 'Authentic Kashmiri Mongra Saffron (Grade A1)' : 'Royal Medjool Dates Premium',
        slug: goal === 'SKIN_ANTI_AGING' ? 'kashmiri-mongra-saffron' : 'medjool-dates-premium',
        sizeLabel: goal === 'SKIN_ANTI_AGING' ? '2g' : '500g',
        monthlyQuantityPacks: 1,
        unitPrice: goal === 'SKIN_ANTI_AGING' ? 950 : 624,
        image: goal === 'SKIN_ANTI_AGING' ? '/images/saffron-box-1g.webp' : '/images/dates-box-500g.webp',
        role: goal === 'SKIN_ANTI_AGING' ? 'Nightly Anti-Aging Saffron Infusion' : 'Pre-Workout & Energy Natural Sweetener',
      },
    ]

    const bundleTotal = recommendedKit.reduce((sum, item) => sum + item.unitPrice * item.monthlyQuantityPacks, 0)

    return {
      almondsGrams,
      almondsCount,
      walnutsGrams,
      walnutsHalves,
      makhanaGrams,
      makhanaCups,
      pistachiosGrams,
      pistachiosCount,
      datesCount,
      datesGrams,
      saffronStrands,
      totalCalories,
      totalProtein,
      totalFats,
      totalFiber,
      recommendedKit,
      bundleTotal,
    }
  }, [goal, demographic, weightKg, activity])

  // Add 30-Day Health Kit to Cart
  const handleAddBundleToCart = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')

      calculation.recommendedKit.forEach((item) => {
        existing.push({
          productId: item.id,
          name: `${item.name} (${item.sizeLabel})`,
          slug: item.slug,
          mode: 'retail',
          sizeLabel: item.sizeLabel,
          unitPrice: item.unitPrice,
          quantity: item.monthlyQuantityPacks,
          totalPrice: item.unitPrice * item.monthlyQuantityPacks,
          image: item.image,
        })
      })

      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setAddedMessage('30-Day Nutrition Health Kit successfully added to cart!')
      setTimeout(() => setAddedMessage(''), 3500)
    } catch {
      // fallback
    }
  }

  const handleInstantBuyBundle = () => {
    handleAddBundleToCart()
    router.push('/checkout')
  }

  // WhatsApp pre-filled concierge message
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappPlanText = `Hello Nuty Tales Nutrition Team! 🌿\n\nI just calculated my personalized daily portion on your calculator:\n• Goal: ${GOALS[goal].name}\n• Weight: ${weightKg} kg (${activity.toLowerCase()} activity)\n• Target Daily Intake: ${calculation.almondsCount} Almonds, ${calculation.walnutsHalves} Walnut halves, ${calculation.makhanaGrams}g Makhana, ${calculation.pistachiosCount} Pistachios, ${calculation.datesCount} Medjool Date\n• Daily Calories: ${calculation.totalCalories} kcal (${calculation.totalProtein}g Protein)\n\nCan you please arrange my 30-day fresh-harvest supply kit (₹${calculation.bundleTotal.toLocaleString('en-IN')}) with free shipping?`
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappPlanText)}`

  return (
    <div className="space-y-12">
      {/* ── Top Header Banner ── */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#96732B] text-xs font-bold tracking-widest uppercase">
          <span>🩺</span>
          <span>EBM Clinical &amp; Ayurvedic Nutrition Protocol</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#17233B] tracking-tight leading-tight">
          Personalized Daily Dry Fruit &amp; Calorie Calculator
        </h1>
        <p className="text-sm sm:text-base text-[#17233B]/75 leading-relaxed font-normal">
          Get your exact scientific daily portion of single-origin almonds, walnuts, makhana, and pistachios. Precision-calibrated to your body weight, activity level, and specific wellness goals.
        </p>
      </div>

      {/* ── Main Interactive Configurator Card ── */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-10 space-y-8">
        {/* Step 1: Goal Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#17233B]">
              Step 1: Choose Your Primary Health Goal
            </span>
            <span className="text-xs text-stone-400 font-medium">Select one</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(GOALS).map((item) => {
              const isSelected = goal === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#17233B] bg-[#17233B]/[0.03] ring-1 ring-[#17233B] shadow-sm'
                      : 'border-stone-200/90 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#17233B]">{item.name}</span>
                      <span
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider"
                        style={{ backgroundColor: item.accentColor }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug">{item.subtitle}</p>
                  </div>

                  <p className="text-[10px] text-stone-400 mt-3 pt-2 border-t border-stone-100 italic">
                    Key: {item.keySuperfood}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Body Weight & Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-100">
          {/* Demographic */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#17233B] block">
              Life Stage / Profile
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'ADULT_MALE', label: 'Male Adult' },
                { id: 'ADULT_FEMALE', label: 'Female Adult' },
                { id: 'PREGNANCY', label: 'Pregnancy / Mom' },
                { id: 'SENIOR', label: 'Senior (60+)' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDemographic(d.id as DemographicGroup)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    demographic === d.id
                      ? 'border-[#17233B] bg-[#17233B] text-white shadow-2xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Body Weight Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#17233B]">
                Body Weight:
              </label>
              <span className="text-base font-black text-[#17233B] bg-stone-100 px-3 py-0.5 rounded-lg">
                {weightKg} kg ({Math.round(weightKg * 2.204)} lbs)
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="120"
              step="1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-[#C9A45C] cursor-pointer mt-3"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>40 kg</span>
              <span>75 kg</span>
              <span>120 kg</span>
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#17233B] block">
              Daily Physical Activity
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'SEDENTARY', label: 'Desk Job' },
                { id: 'MODERATE', label: 'Moderate' },
                { id: 'ATHLETIC', label: 'Intense / Gym' },
              ].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActivity(a.id as ActivityLevel)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    activity === a.id
                      ? 'border-[#17233B] bg-[#17233B] text-white shadow-2xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Result Presentation Engine ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Your Daily Prescription Plate (7 cols) */}
        <div className="lg:col-span-7 bg-[#17233B] text-white rounded-3xl p-6 sm:p-9 space-y-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A45C] block">
                Target Daily Prescription
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Your Exact Daily Nut &amp; Superfood Dose
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#C9A45C]">
                {calculation.totalCalories}
              </span>
              <span className="text-[11px] text-stone-300 block uppercase tracking-wide">
                kcal / day
              </span>
            </div>
          </div>

          {/* Nut Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-2xl block">🌰</span>
              <span className="text-xl font-bold text-white block">{calculation.almondsCount} pcs</span>
              <span className="text-[10px] text-stone-300 block uppercase font-mono">Almonds (~{calculation.almondsGrams}g)</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-2xl block">🧠</span>
              <span className="text-xl font-bold text-white block">{calculation.walnutsHalves} halves</span>
              <span className="text-[10px] text-stone-300 block uppercase font-mono">Walnuts (~{calculation.walnutsGrams}g)</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-2xl block">🥣</span>
              <span className="text-xl font-bold text-white block">{calculation.makhanaCups} cups</span>
              <span className="text-[10px] text-stone-300 block uppercase font-mono">Makhana ({calculation.makhanaGrams}g)</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
              <span className="text-2xl block">🟢</span>
              <span className="text-xl font-bold text-white block">{calculation.pistachiosCount} pcs</span>
              <span className="text-[10px] text-stone-300 block uppercase font-mono">Pistachios (~{calculation.pistachiosGrams}g)</span>
            </div>
          </div>

          {/* Macro Nutrition Bar */}
          <div className="space-y-3 bg-white/5 border border-white/10 p-5 rounded-2xl">
            <span className="text-xs uppercase font-mono tracking-wider text-[#C9A45C] font-semibold block">
              Macronutrient Profile (Clean Orchard Sourced)
            </span>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-lg font-bold text-emerald-400">{calculation.totalProtein}g</span>
                <span className="text-[10px] text-stone-300 block">Plant Protein</span>
              </div>
              <div>
                <span className="text-lg font-bold text-amber-300">{calculation.totalFats}g</span>
                <span className="text-[10px] text-stone-300 block">Healthy Heart Fats (MUFA)</span>
              </div>
              <div>
                <span className="text-lg font-bold text-sky-300">{calculation.totalFiber}g</span>
                <span className="text-[10px] text-stone-300 block">Prebiotic Fiber</span>
              </div>
            </div>
          </div>

          {/* Chrono-Nutrition Consumption Schedule */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C9A45C] font-semibold">
              Optimal Chrono-Nutrition Timing
            </h3>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-amber-400 font-bold">🌅 07:30 AM</span>
                <div>
                  <strong className="text-white block font-medium">Empty Stomach Morning Protocol</strong>
                  <span>Soak {calculation.almondsCount} almonds overnight in water. Peel skin to remove enzyme inhibitors before breakfast.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-emerald-400 font-bold">☀️ 11:30 AM</span>
                <div>
                  <strong className="text-white block font-medium">Mid-Day Satiety Desk Snack</strong>
                  <span>Lightly roast {calculation.makhanaGrams}g Makhana with a pinch of rock salt. Keeps insulin flat and kills cravings.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-sky-400 font-bold">🌇 05:00 PM</span>
                <div>
                  <strong className="text-white block font-medium">Evening Pre-Workout / Chai Companion</strong>
                  <span>{calculation.walnutsHalves} Kashmiri Walnut halves + {calculation.datesCount} Medjool date. Immediate mental energy.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-purple-400 font-bold">🌙 09:30 PM</span>
                <div>
                  <strong className="text-white block font-medium">Night Bedtime Recovery</strong>
                  <span>{calculation.saffronStrands} strands of Kashmiri Mongra Saffron steeped in 150ml warm milk for restorative sleep.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 30-Day Fresh Harvest Custom Kit (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold inline-block">
              1-Month Orchard Supply
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17233B]">
              Recommended 30-Day Health Bundle
            </h3>
            <p className="text-xs text-stone-500">
              Single-origin batch packed under central FSSAI licence. Nitrogen sealed to lock crisp farm freshness for 12 months.
            </p>
          </div>

          {/* Product Items List */}
          <div className="divide-y divide-stone-100">
            {calculation.recommendedKit.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden relative flex-shrink-0 border border-stone-200/60">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="48px" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#17233B] line-clamp-1">{item.name}</h4>
                    <span className="text-[10px] text-[#176B68] font-medium block">{item.role}</span>
                    <span className="text-[10px] text-stone-400">Pack size: {item.sizeLabel}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-extrabold text-[#17233B] text-sm block">
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold">100% Pure</span>
                </div>
              </div>
            ))}
          </div>

          {/* Price & Free Delivery Guarantee */}
          <div className="p-4 bg-[#F7F2E8] rounded-2xl border border-stone-200/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#17233B]">Total Monthly Kit Cost:</span>
              <span className="text-2xl font-black text-[#17233B]">
                ₹{calculation.bundleTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-800 font-medium pt-1 border-t border-stone-300/40">
              <span>✈️ Pan-India Express Delivery</span>
              <span className="font-bold">FREE (₹0)</span>
            </div>
          </div>

          {/* Feedback message */}
          {addedMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold text-center border border-emerald-200 animate-fade-in">
              {addedMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handleInstantBuyBundle}
              className="w-full py-4 bg-[#17233B] hover:bg-black text-white font-bold rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>🛒</span>
              <span>Order 30-Day Health Bundle Now</span>
            </button>

            <button
              type="button"
              onClick={handleAddBundleToCart}
              className="w-full py-3.5 bg-white hover:bg-stone-50 text-[#17233B] font-bold rounded-full text-xs uppercase tracking-wider border border-stone-300 transition-all text-center"
            >
              Add Bundle to Basket
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 font-semibold rounded-full text-xs text-center transition-all flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>Send My Plan to Nutritionist on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── SEO Scientific FAQ Accordion ── */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 space-y-6 shadow-sm">
        <h3 className="text-2xl font-serif font-bold text-[#17233B]">
          Frequently Asked Questions About Daily Nut &amp; Dry Fruit Consumption
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-stone-600">
          <div className="space-y-2 p-5 bg-[#FAF7F2] rounded-2xl border border-stone-200/60">
            <h4 className="font-bold text-[#17233B] text-sm">
              Why should Mamra or California almonds be soaked before eating?
            </h4>
            <p className="leading-relaxed">
              Soaking almonds in water for 6 to 8 hours neutralizes tannins and phytic acid present in the brown skin. Phytic acid inhibits zinc and iron absorption in the gut. Once peeled, digestive enzymes can extract 100% of the natural bioavailable vitamin E and healthy oils.
            </p>
          </div>

          <div className="space-y-2 p-5 bg-[#FAF7F2] rounded-2xl border border-stone-200/60">
            <h4 className="font-bold text-[#17233B] text-sm">
              Can diabetics consume Medjool dates and cashews safely?
            </h4>
            <p className="leading-relaxed">
              Yes, in controlled moderation. Medjool dates possess a low glycemic index (GI ~42) because their natural fructose is bound within insoluble fiber. Pairing 1 date with 2 walnut halves slows gastric emptying, preventing blood glucose surges.
            </p>
          </div>

          <div className="space-y-2 p-5 bg-[#FAF7F2] rounded-2xl border border-stone-200/60">
            <h4 className="font-bold text-[#17233B] text-sm">
              How many calories are in roasted Mithila Makhana?
            </h4>
            <p className="leading-relaxed">
              100 grams of pure Mithila fox nuts provide approximately 347 calories, but because Makhana is lightweight and voluminous, 1 full cup (approx. 15g) is only ~52 calories with zero cholesterol and nearly 2g of clean plant protein.
            </p>
          </div>

          <div className="space-y-2 p-5 bg-[#FAF7F2] rounded-2xl border border-stone-200/60">
            <h4 className="font-bold text-[#17233B] text-sm">
              How does Kashmiri Mongra Saffron help with sleep and skin collagen?
            </h4>
            <p className="leading-relaxed">
              Kashmiri Mongra saffron has the world&apos;s highest natural concentration of Crocin (&gt;8.5%) and Safranal. Research published in clinical neuropharmacology confirms that 20–30mg of authentic saffron boosts synaptic serotonin levels, promoting deep REM sleep and reducing cortisol.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
