'use client'

import React, { useState, useMemo } from 'react'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

interface BioRationSynthesizerModalProps {
  isOpen: boolean
  onClose: () => void
}

interface IngredientConfig {
  id: string
  name: string
  shortLabel: string
  icon: string
  pricePerGram: number // INR
  caloriesPerGram: number
  fatPerGram: number
  proteinPerGram: number
  keyCompound: string
  minGrams: number
  maxGrams: number
  defaultGrams: number
}

const INGREDIENTS: IngredientConfig[] = [
  {
    id: 'mamra',
    name: 'Kashmiri Mamra Almonds',
    shortLabel: 'Mamra Almonds',
    icon: '🌰',
    pricePerGram: 4.2, // ~₹4200/kg
    caloriesPerGram: 6.1,
    fatPerGram: 0.53,
    proteinPerGram: 0.21,
    keyCompound: '52.8% Cold-Pressed Oleic Acid',
    minGrams: 0,
    maxGrams: 20,
    defaultGrams: 10,
  },
  {
    id: 'walnuts',
    name: 'Snow-White Kashmiri Walnuts',
    shortLabel: 'Kagzi Walnuts',
    icon: '🧠',
    pricePerGram: 2.2, // ~₹2200/kg
    caloriesPerGram: 6.5,
    fatPerGram: 0.65,
    proteinPerGram: 0.15,
    keyCompound: 'Plant Omega-3 ALA (9.1g/100g)',
    minGrams: 0,
    maxGrams: 15,
    defaultGrams: 8,
  },
  {
    id: 'makhana',
    name: 'Mithila 7-Suta Jumbo Makhana',
    shortLabel: 'Jumbo Makhana',
    icon: '⚪',
    pricePerGram: 1.5, // ~₹1500/kg
    caloriesPerGram: 3.5,
    fatPerGram: 0.01,
    proteinPerGram: 0.1,
    keyCompound: 'Kaempferol & Bioavailable Magnesium',
    minGrams: 0,
    maxGrams: 15,
    defaultGrams: 6,
  },
  {
    id: 'anjeer',
    name: 'Turkish Sun-Dried Jumbo Anjeer',
    shortLabel: 'Aegean Figs',
    icon: '🍯',
    pricePerGram: 1.6, // ~₹1600/kg
    caloriesPerGram: 2.5,
    fatPerGram: 0.01,
    proteinPerGram: 0.03,
    keyCompound: 'Prebiotic Pectin Fiber & Calcium',
    minGrams: 0,
    maxGrams: 15,
    defaultGrams: 4,
  },
  {
    id: 'pista',
    name: 'California Roasted Pistachios',
    shortLabel: 'Himalayan Pink Pista',
    icon: '🟢',
    pricePerGram: 1.8, // ~₹1800/kg
    caloriesPerGram: 5.6,
    fatPerGram: 0.45,
    proteinPerGram: 0.2,
    keyCompound: 'Lutein Carotenoid & L-Arginine',
    minGrams: 0,
    maxGrams: 12,
    defaultGrams: 2,
  },
]

const RATION_PRESETS = [
  {
    title: '🧠 Cognitive Neuro-Shield',
    desc: 'Targeted for students, researchers & executive focus',
    portions: { mamra: 12, walnuts: 10, makhana: 4, anjeer: 4, pista: 0 },
  },
  {
    title: '❤️ Cardio & Arterial Elasticity',
    desc: 'Maximized Omega-3 ALA & unoxidized mono-unsaturated lipids',
    portions: { mamra: 8, walnuts: 12, makhana: 6, anjeer: 0, pista: 4 },
  },
  {
    title: '⚡ Metabolic Low-GI Diabetic Safe',
    desc: 'High fiber, zero sugar spike, light satiety',
    portions: { mamra: 6, walnuts: 6, makhana: 14, anjeer: 0, pista: 4 },
  },
  {
    title: '👵 Senior Vitality & Joint Mobility',
    desc: 'Prebiotic digestion, bone calcium & anti-inflammatory lipids',
    portions: { mamra: 8, walnuts: 8, makhana: 6, anjeer: 8, pista: 0 },
  },
]

export default function BioRationSynthesizerModal({
  isOpen,
  onClose,
}: BioRationSynthesizerModalProps) {
  const { formatPrice } = useMarketCurrency()

  const [portions, setPortions] = useState<Record<string, number>>({
    mamra: 10,
    walnuts: 8,
    makhana: 6,
    anjeer: 4,
    pista: 2,
  })

  const [boxSupplyDays, setBoxSupplyDays] = useState<30 | 14>(30)
  const [isSuccess, setIsSuccess] = useState(false)

  // Derived bio-nutritional calculations
  const stats = useMemo(() => {
    let totalGrams = 0
    let dailyCost = 0
    let totalCalories = 0
    let totalLipids = 0
    let totalProtein = 0

    INGREDIENTS.forEach((ing) => {
      const g = portions[ing.id] || 0
      totalGrams += g
      dailyCost += g * ing.pricePerGram
      totalCalories += g * ing.caloriesPerGram
      totalLipids += g * ing.fatPerGram
      totalProtein += g * ing.proteinPerGram
    })

    const boxCost = Math.round(dailyCost * boxSupplyDays)

    return {
      totalGrams,
      dailyCost: Math.round(dailyCost),
      boxCost,
      totalCalories: Math.round(totalCalories),
      totalLipids: totalLipids.toFixed(1),
      totalProtein: totalProtein.toFixed(1),
    }
  }, [portions, boxSupplyDays])

  if (!isOpen) return null

  const handleSliderChange = (id: string, value: number) => {
    setPortions((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleApplyPreset = (presetPortions: Record<string, number>) => {
    setPortions(presetPortions)
  }

  const handleAddToCart = () => {
    try {
      const summaryComponents = INGREDIENTS.filter(
        (i) => (portions[i.id] || 0) > 0
      )
        .map((i) => `${portions[i.id]}g ${i.shortLabel}`)
        .join(' · ')

      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const item = {
        productId: `bio-ration-${Date.now()}`,
        name: `Custom Micro-Ration (${stats.totalGrams}g Daily Dose)`,
        slug: 'mamra-almonds-kashmiri-badam',
        mode: 'custom_ration',
        sizeLabel: `${boxSupplyDays}-Day Vault (${boxSupplyDays} × ${stats.totalGrams}g Nitrogen Pouches)`,
        unitPrice: stats.boxCost,
        quantity: 1,
        totalPrice: stats.boxCost,
        image: '/images/almonds-pouch-250g.jpg',
        meta: {
          portions,
          totalGrams: stats.totalGrams,
          dailyCalories: stats.totalCalories,
          summary: summaryComponents,
        },
      }
      existing.push(item)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1500)
    } catch {
      // fallback
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[150] bg-[#0c1424]/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#10192B] text-white w-full max-w-4xl rounded-t-3xl sm:rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Radial Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Modal Header ── */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A45C] animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#C9A45C] font-semibold">
                PRECISION HARVEST OS · MICRO-RATION SYNTHESIZER
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              Engineer Your Daily 30g Nutrition Ration
            </h2>
            <p className="text-xs text-stone-300 font-light hidden sm:block">
              Stop buying random bulk bags. Synthesize your customized daily micro-dose sealed in individual oxygen-purged nitrogen sachets.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-stone-300 hover:text-white transition-all text-sm font-bold"
            aria-label="Close synthesizer"
          >
            ✕
          </button>
        </div>

        {/* ── Quick Health Target Presets ── */}
        <div className="px-4 sm:px-6 py-2.5 bg-white/5 border-b border-white/10 overflow-x-auto scrollbar-hide flex items-center gap-2 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 flex-shrink-0">
            Health Formulas:
          </span>
          {RATION_PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => handleApplyPreset(preset.portions)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 whitespace-nowrap text-[11px] font-medium transition-colors"
              title={preset.desc}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* ── Body: Interactive Sliders & Live Telemetry HUD ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Telemetry Summary Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">
                Daily Dose Weight
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {stats.totalGrams}
                </span>
                <span className="text-xs text-stone-400 font-mono">g / day</span>
              </div>
              <span
                className={`text-[9px] font-mono block mt-0.5 ${
                  stats.totalGrams === 30
                    ? 'text-emerald-400'
                    : stats.totalGrams > 30
                    ? 'text-amber-400'
                    : 'text-stone-400'
                }`}
              >
                {stats.totalGrams === 30
                  ? '✓ Standard Target'
                  : stats.totalGrams > 30
                  ? 'Elevated Athletic Dose'
                  : 'Light Micro-Dose'}
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">
                Pure Bioactive Lipids
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-emerald-400">
                  {stats.totalLipids}
                </span>
                <span className="text-xs text-stone-400 font-mono">g</span>
              </div>
              <span className="text-[9px] text-stone-400 font-mono block mt-0.5">
                High Oleic &amp; Omega-3 ALA
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">
                Plant Protein &amp; Energy
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-cyan-300">
                  {stats.totalProtein}g
                </span>
                <span className="text-xs text-stone-400 font-mono">· {stats.totalCalories} kcal</span>
              </div>
              <span className="text-[9px] text-stone-400 font-mono block mt-0.5">
                Low Glycemic Load
              </span>
            </div>

            <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] font-mono uppercase text-stone-400 block">
                Daily Dose Cost
              </span>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#E5C882]">
                  {formatPrice(stats.dailyCost)}
                </span>
                <span className="text-xs text-stone-400 font-mono">/ day</span>
              </div>
              <span className="text-[9px] text-stone-400 font-mono block mt-0.5">
                Less than a cafe coffee
              </span>
            </div>
          </div>

          {/* 5 Core Ingredient Sliders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#C9A45C]">
              <span>Customize Bio-Active Grams</span>
              <span>Slide to calibrate</span>
            </div>

            <div className="space-y-3">
              {INGREDIENTS.map((ing) => {
                const currentG = portions[ing.id] || 0
                return (
                  <div
                    key={ing.id}
                    className="bg-white/5 rounded-2xl p-3.5 sm:p-4 border border-white/10 space-y-2 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{ing.icon}</span>
                        <div>
                          <h4 className="text-sm font-medium text-white">
                            {ing.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#C9A45C] block">
                            {ing.keyCompound}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-lg font-bold text-white">
                          {currentG}g
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono block">
                          ₹{Math.round(currentG * ing.pricePerGram)}/day
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[10px] text-stone-400 font-mono w-6">
                        0g
                      </span>
                      <input
                        type="range"
                        min={ing.minGrams}
                        max={ing.maxGrams}
                        step={1}
                        value={currentG}
                        onChange={(e) =>
                          handleSliderChange(ing.id, Number(e.target.value))
                        }
                        className="flex-1 accent-[#C9A45C] bg-white/20 h-2 rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] text-stone-400 font-mono w-6 text-right">
                        {ing.maxGrams}g
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Modal Footer: Box Tier & Dispense Button ── */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Box Supply Period Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-300">Vault Cycle:</span>
              <div className="flex bg-white/10 rounded-full p-1 border border-white/15">
                <button
                  type="button"
                  onClick={() => setBoxSupplyDays(14)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    boxSupplyDays === 14
                      ? 'bg-white text-[#17233B]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  14-Day Cycle
                </button>
                <button
                  type="button"
                  onClick={() => setBoxSupplyDays(30)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    boxSupplyDays === 30
                      ? 'bg-[#C9A45C] text-[#17233B]'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  30-Day Complete Vault (Recommended)
                </button>
              </div>
            </div>

            {/* Total Pricing & Action Button */}
            <div className="flex items-center gap-4 justify-between sm:justify-end">
              <div>
                <span className="text-[10px] font-mono text-stone-400 uppercase block">
                  Total Vault Price ({boxSupplyDays} Pouches)
                </span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {formatPrice(stats.boxCost)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stats.totalGrams === 0}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                  isSuccess
                    ? 'bg-emerald-600 text-white'
                    : stats.totalGrams === 0
                    ? 'bg-stone-600 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C9A45C] to-[#E5C882] text-[#17233B] hover:scale-[1.02]'
                }`}
              >
                <span>{isSuccess ? '✓ Synthesized into Basket' : 'Order Sealed Daily Vault'}</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-white/5">
            <span>📦 Each daily ration is individually flushed with 99.8% food-grade nitrogen to prevent oil rancidity</span>
            <span className="font-mono text-[#C9A45C]">FSSAI 22724441000048</span>
          </div>
        </div>
      </div>
    </div>
  )
}
