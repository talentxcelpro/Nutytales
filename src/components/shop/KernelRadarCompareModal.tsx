'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/products-data'
import { getProductTelemetry, HARVEST_TELEMETRY } from '@/lib/harvest-telemetry'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

interface KernelRadarCompareModalProps {
  isOpen: boolean
  onClose: () => void
  comparedProducts: Product[]
  allProducts: Product[]
  onRemoveFromCompare: (slug: string) => void
  onSelectPresetComparison: (slugA: string, slugB: string) => void
}

const PRESET_COMPARISONS = [
  {
    title: 'Himalayan Mamra vs California Almonds',
    slugA: 'mamra-almonds-kashmiri-badam',
    slugB: 'california-almonds-premium',
    badge: 'Lipid & Processing Divide',
  },
  {
    title: 'Snow-White Kagzi vs Bleached Market Walnuts',
    slugA: 'kashmiri-walnuts-in-shell-snow-white',
    slugB: 'walnut-kernels-snow-white-kashmir',
    badge: 'Zero-Bleach Pellicle',
  },
  {
    title: 'Mithila 7-Suta Jumbo vs Broken Makhana',
    slugA: 'phool-makhana-jumbo-grade-a',
    slugB: 'phool-makhana-jumbo-grade-a',
    badge: 'Sphere Integrity & Low GI',
  },
  {
    title: 'Pampore Mongra Grade-1 vs Commercial Saffron',
    slugA: 'kashmir-saffron-mongra-grade-1',
    slugB: 'kashmir-saffron-mongra-grade-1',
    badge: 'Crocin > 240 Purity',
  },
]

export default function KernelRadarCompareModal({
  isOpen,
  onClose,
  comparedProducts,
  allProducts,
  onRemoveFromCompare,
  onSelectPresetComparison,
}: KernelRadarCompareModalProps) {
  const { formatPrice } = useMarketCurrency()
  const [activeTab, setActiveTab] = useState<'radar' | 'nabl' | 'verdict'>('radar')

  if (!isOpen) return null

  // Ensure we have at least 2 products to display; fallback to default Mamra vs California
  let displayProducts = comparedProducts
  if (displayProducts.length === 0) {
    const mamra = allProducts.find((p) => p.slug.includes('mamra')) || allProducts[0]
    const california =
      allProducts.find((p) => p.slug.includes('california')) ||
      allProducts[1] ||
      allProducts[0]
    displayProducts = [mamra, california].filter(Boolean)
  } else if (displayProducts.length === 1) {
    const fallback =
      allProducts.find(
        (p) =>
          p.slug !== displayProducts[0].slug &&
          (p.categorySlug === displayProducts[0].categorySlug ||
            p.slug.includes('california') ||
            p.slug.includes('mamra'))
      ) || allProducts.find((p) => p.slug !== displayProducts[0].slug)
    if (fallback) {
      displayProducts = [...displayProducts, fallback]
    }
  }

  const handleAddToCart = (product: Product) => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const variant = product.variants[0]
      const item = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        mode: 'retail',
        sizeLabel: variant.label,
        unitPrice: variant.retailPrice,
        quantity: 1,
        totalPrice: variant.retailPrice,
        image: product.image || '/images/almonds-pouch-250g.webp',
      }
      existing.push(item)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))
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
        className="bg-[#10192B] text-white w-full max-w-5xl rounded-t-3xl sm:rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Modal Header ── */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#C9A45C] font-semibold">
                NABL LAB TELEMETRY · KERNEL RADAR COMPARATOR
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-white font-normal">
              Direct Scientific Benchmark
            </h2>
            <p className="text-xs text-stone-300 font-light hidden sm:block">
              Side-by-side bio-nutritional inspection, cold-pressed essential lipid density, and unpasteurized authenticity.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-stone-300 hover:text-white transition-all text-sm font-bold"
            aria-label="Close comparator"
          >
            ✕
          </button>
        </div>

        {/* ── Presets Ribbon (Fast 1-Click Common Comparisons) ── */}
        <div className="px-4 sm:px-6 py-2.5 bg-white/5 border-b border-white/10 overflow-x-auto scrollbar-hide flex items-center gap-2 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 flex-shrink-0">
            Quick Benchmarks:
          </span>
          {PRESET_COMPARISONS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => onSelectPresetComparison(preset.slugA, preset.slugB)}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 whitespace-nowrap text-[11px] font-medium transition-colors flex items-center gap-1.5"
            >
              <span>{preset.title}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#C9A45C]/20 text-[#E5C882] font-mono">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>

        {/* ── Navigation Tabs ── */}
        <div className="px-4 sm:px-6 pt-3 flex gap-2 border-b border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'radar'
                ? 'border-[#C9A45C] text-[#C9A45C]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            🔬 Bio-Lipid &amp; Moisture Radar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nabl')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'nabl'
                ? 'border-[#C9A45C] text-[#C9A45C]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            📋 NABL Lab Telemetry Sheet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verdict')}
            className={`pb-2.5 font-medium border-b-2 transition-colors ${
              activeTab === 'verdict'
                ? 'border-[#C9A45C] text-[#C9A45C]'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            💡 Why Pay The Difference?
          </button>
        </div>

        {/* ── Main Comparison Scrollable Viewport ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Products Header Columns */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6">
            {displayProducts.slice(0, 2).map((prod) => {
              const tel = getProductTelemetry(prod.slug, prod.categorySlug)
              const variant = prod.variants[0]
              return (
                <div
                  key={prod.id}
                  className="bg-white/5 rounded-2xl p-3.5 sm:p-4 border border-white/10 relative space-y-3"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveFromCompare(prod.slug)}
                    className="absolute top-2 right-2 text-stone-400 hover:text-rose-400 text-xs px-1.5 py-0.5 rounded-full bg-white/10"
                    title="Remove from comparison"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={prod.image || '/images/almonds-pouch-250g.webp'}
                        alt={prod.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="space-y-1 text-center sm:text-left min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A45C] block truncate">
                        {prod.origin} · {tel.telemetry.altitudeMeters}m
                      </span>
                      <h3 className="font-serif text-sm sm:text-base text-white font-medium line-clamp-1">
                        {prod.name}
                      </h3>
                      <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                        <span className="font-serif text-base sm:text-lg text-white font-semibold">
                          {formatPrice(variant.retailPrice)}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          ({variant.label})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(prod)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E5C882] text-[#17233B] text-xs font-bold hover:scale-[1.01] active:scale-95 transition-all shadow-sm"
                  >
                    Add {variant.label} to Basket
                  </button>
                </div>
              )
            })}
          </div>

          {/* TAB 1: RADAR METRICS & COMPARATIVE BARS */}
          {activeTab === 'radar' && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#C9A45C]">
                Key Lab Indices (Live Comparison)
              </h4>

              {/* Metric 1: Essential Oil % */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Cold-Pressed Essential Oil Density</span>
                    <span className="text-[10px] text-stone-400 font-mono">(Higher = richer bioactive lipids)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {displayProducts.slice(0, 2).map((prod) => {
                    const tel = getProductTelemetry(prod.slug, prod.categorySlug)
                    const oil = tel.telemetry.essentialOilPercent
                    const isSuperior = oil > 50
                    return (
                      <div key={prod.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-stone-300 truncate">{prod.name.split(' ')[0]}</span>
                          <span className={`font-bold ${isSuperior ? 'text-emerald-400' : 'text-stone-300'}`}>
                            {oil}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isSuperior ? 'bg-gradient-to-r from-emerald-400 to-[#C9A45C]' : 'bg-white/40'
                            }`}
                            style={{ width: `${Math.min(100, (oil / 70) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Metric 2: Moisture Retention % */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Moisture Content %</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      (NABL Spec &lt; 5.0% for zero rancidity)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {displayProducts.slice(0, 2).map((prod) => {
                    const tel = getProductTelemetry(prod.slug, prod.categorySlug)
                    const moisture = tel.telemetry.moisturePercent
                    const isOptimal = moisture < 5.0
                    return (
                      <div key={prod.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-stone-300 truncate">{prod.name.split(' ')[0]}</span>
                          <span className={`font-bold ${isOptimal ? 'text-emerald-400' : 'text-amber-300'}`}>
                            {moisture}% {isOptimal ? '✓ Crispy' : 'Soft'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, (moisture / 15) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Metric 3: ORAC Antioxidant Score */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">ORAC Oxygen Radical Absorbance (Antioxidants)</span>
                    <span className="text-[10px] text-stone-400 font-mono">(µmol TE/100g)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {displayProducts.slice(0, 2).map((prod) => {
                    const tel = getProductTelemetry(prod.slug, prod.categorySlug)
                    const orac = tel.telemetry.oracAntioxidantScore
                    return (
                      <div key={prod.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-stone-300 truncate">{prod.name.split(' ')[0]}</span>
                          <span className="font-bold text-[#E5C882]">
                            {orac.toLocaleString()} ORAC
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-rose-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, (orac / 25000) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Metric 4: Glycemic Index (GI) */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Glycemic Index (GI)</span>
                    <span className="text-[10px] text-stone-400 font-mono">(&lt; 35 = Low Glycemic Diabetic Safe)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {displayProducts.slice(0, 2).map((prod) => {
                    const tel = getProductTelemetry(prod.slug, prod.categorySlug)
                    const gi = tel.telemetry.glycemicIndex
                    return (
                      <div key={prod.id} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-stone-300 truncate">{prod.name.split(' ')[0]}</span>
                          <span className="font-bold text-emerald-300">
                            GI: {gi} (Ultra-Low)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, (gi / 55) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NABL TELEMETRY SHEET */}
          {activeTab === 'nabl' && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#C9A45C]">
                Official Quality Certificate Matrix
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/15 text-stone-400 text-[10px] font-mono uppercase">
                      <th className="py-2.5 px-3">Telemetry Parameter</th>
                      {displayProducts.slice(0, 2).map((p) => (
                        <th key={p.id} className="py-2.5 px-3 text-white">
                          {p.name.split(' ').slice(0, 2).join(' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-light">
                    <tr>
                      <td className="py-2.5 px-3 text-stone-400 font-mono">Batch ID</td>
                      {displayProducts.slice(0, 2).map((p) => (
                        <td key={p.id} className="py-2.5 px-3 font-mono text-[#C9A45C]">
                          {getProductTelemetry(p.slug).telemetry.batchId}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-stone-400 font-mono">Lab Cert Status</td>
                      {displayProducts.slice(0, 2).map((p) => (
                        <td key={p.id} className="py-2.5 px-3 text-emerald-400 font-mono">
                          ✓ {getProductTelemetry(p.slug).telemetry.nablLabCert}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-stone-400 font-mono">Processing Method</td>
                      {displayProducts.slice(0, 2).map((p) => (
                        <td key={p.id} className="py-2.5 px-3 text-stone-200">
                          {getProductTelemetry(p.slug).telemetry.pasteurizationMethod}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-stone-400 font-mono">Chemical Wash / Bleach</td>
                      {displayProducts.slice(0, 2).map((p) => (
                        <td key={p.id} className="py-2.5 px-3 text-emerald-400 font-semibold">
                          {getProductTelemetry(p.slug).telemetry.chemicalWash}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-stone-400 font-mono">Botanical Pedigree</td>
                      {displayProducts.slice(0, 2).map((p) => (
                        <td key={p.id} className="py-2.5 px-3 text-stone-200">
                          {getProductTelemetry(p.slug).telemetry.treeType}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-stone-400 font-mono">Nitrogen Purity (Oxygen Flush)</td>
                      {displayProducts.slice(0, 2).map((p) => (
                        <td key={p.id} className="py-2.5 px-3 text-cyan-300 font-mono">
                          {getProductTelemetry(p.slug).telemetry.nitrogenPurityPercent}% Food Grade
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 text-stone-400 font-mono">Primary Bioactive Compound</td>
                      {displayProducts.slice(0, 2).map((p) => (
                        <td key={p.id} className="py-2.5 px-3 text-[#E5C882]">
                          {getProductTelemetry(p.slug).telemetry.primaryBioactiveCompound}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: WHY PAY THE DIFFERENCE? */}
          {activeTab === 'verdict' && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#C9A45C]">
                The Price Justification Equation (Customer ROI)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayProducts.slice(0, 2).map((prod) => {
                  const tel = getProductTelemetry(prod.slug, prod.categorySlug)
                  return (
                    <div
                      key={prod.id}
                      className="bg-white/5 rounded-2xl p-4 sm:p-5 border border-white/10 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚖️</span>
                        <h5 className="font-serif text-base text-white font-medium">
                          {prod.name}
                        </h5>
                      </div>

                      <p className="text-xs text-stone-300 font-light leading-relaxed">
                        {tel.scientificVerdict}
                      </p>

                      {tel.whyPayTheDifference && (
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-2 text-xs">
                          <div className="text-[10px] font-mono uppercase text-[#C9A45C]">
                            Vs. {tel.whyPayTheDifference.cheaperAlternativeName}:
                          </div>
                          <p className="text-stone-300 text-xs font-light">
                            {tel.whyPayTheDifference.keyAdvantageSummary}
                          </p>
                          <div className="pt-1 border-t border-white/10 text-[11px] font-mono text-emerald-400">
                            • Lipid Difference: {tel.whyPayTheDifference.lipidDifference}
                          </div>
                          <div className="text-[11px] font-mono text-cyan-300">
                            • Processing: {tel.whyPayTheDifference.processingDifference}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-400">
            <span>🛡️</span>
            <span>All lab metrics verifiable under FSSAI Registration 22724441000048</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-colors"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  )
}
