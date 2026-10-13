'use client'

import React, { useState } from 'react'

export type HealthTargetKey =
  | 'all'
  | 'cognitive'
  | 'cardiovascular'
  | 'metabolic'
  | 'seniorLongevity'
  | 'activeAthletic'
  | 'ayurvedicRasayana'

interface PrecisionHarvestCommandBarProps {
  selectedHealthTarget: HealthTargetKey
  onSelectHealthTarget: (target: HealthTargetKey) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onOpenSynthesizer: () => void
  comparedCount: number
  onOpenCompareRadar: () => void
  onResetFilters: () => void
}

const HEALTH_TARGETS: { key: HealthTargetKey; label: string; icon: string; tag: string }[] = [
  { key: 'all', label: 'All Harvests', icon: '✦', tag: 'Full Catalog' },
  { key: 'cognitive', label: 'Brain & Memory', icon: '🧠', tag: 'High Oleic & MUFA' },
  { key: 'cardiovascular', label: 'Cardio & Heart Health', icon: '❤️', tag: 'Omega-3 ALA' },
  { key: 'metabolic', label: 'Metabolic & Low GI', icon: '⚡', tag: 'Diabetic Safe' },
  { key: 'seniorLongevity', label: 'Senior Longevity', icon: '👵', tag: 'Bone & Joints' },
  { key: 'activeAthletic', label: 'Plant Protein & ATP', icon: '🏋️', tag: 'Pre/Post Workout' },
  { key: 'ayurvedicRasayana', label: 'Ayurvedic Rasayana', icon: '🕉️', tag: 'Ojas Building' },
]

export default function PrecisionHarvestCommandBar({
  selectedHealthTarget,
  onSelectHealthTarget,
  searchQuery,
  onSearchChange,
  onOpenSynthesizer,
  comparedCount,
  onOpenCompareRadar,
  onResetFilters,
}: PrecisionHarvestCommandBarProps) {
  const [isAiSearchActive, setIsAiSearchActive] = useState(false)
  const [aiPresetQuestion, setAiPresetQuestion] = useState<string | null>(null)

  const handlePresetClick = (q: string, target: HealthTargetKey) => {
    onSearchChange(q)
    onSelectHealthTarget(target)
    setAiPresetQuestion(q)
    setIsAiSearchActive(true)
  }

  return (
    <div className="w-full space-y-4 mb-6">
      {/* ── Top Apple-Grade Precision Dock ── */}
      <div className="bg-[#17233B] text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Row: System Status & Action Anchors */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#C9A45C] font-semibold">
                PRECISION HARVEST OS · BIO-NUTRITIONAL ENGINE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Daily Synthesizer Trigger */}
              <button
                type="button"
                onClick={onOpenSynthesizer}
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E5C882] text-[#17233B] font-bold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>🧪</span>
                <span>Daily 30g Ration Synthesizer</span>
              </button>

              {/* Compare Radar Trigger */}
              <button
                type="button"
                onClick={onOpenCompareRadar}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  comparedCount > 0
                    ? 'bg-white text-[#17233B] border-white shadow-md font-bold'
                    : 'bg-white/10 text-stone-300 border-white/15 hover:bg-white/15'
                }`}
              >
                <span>⚖️</span>
                <span>Kernel Radar Comparator</span>
                {comparedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#17233B] text-white text-[10px] flex items-center justify-center font-bold">
                    {comparedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Middle: Natural Language Neural Sommelier Search Bar */}
          <div className="relative">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-stone-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value)
                  if (!e.target.value) setAiPresetQuestion(null)
                }}
                onFocus={() => setIsAiSearchActive(true)}
                placeholder="Ask AI Sommelier: 'High oleic nuts for memory', 'Compare Mamra vs California', 'Low GI snacks'..."
                className="w-full pl-11 pr-24 py-3 rounded-2xl bg-white/10 border border-white/15 text-white text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#C9A45C] focus:bg-white/15 transition-all font-light"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('')
                    setAiPresetQuestion(null)
                  }}
                  className="absolute right-4 text-xs text-stone-400 hover:text-white"
                >
                  Clear ✕
                </button>
              )}
            </div>

            {/* AI Presets Quick Prompts */}
            <div className="flex items-center gap-2 pt-2.5 overflow-x-auto scrollbar-hide text-[11px] text-stone-300">
              <span className="text-stone-400 text-[10px] uppercase font-mono tracking-wider flex-shrink-0">
                Suggested Prompts:
              </span>
              <button
                type="button"
                onClick={() => handlePresetClick('High oil unpasteurized almonds for memory', 'cognitive')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 whitespace-nowrap transition-colors"
              >
                🧠 Kids Memory &amp; Soaking Badam
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('Zero bleach unoxidized heart omega 3', 'cardiovascular')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 whitespace-nowrap transition-colors"
              >
                ❤️ Heart Health &amp; Non-Bleached Walnuts
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('Diabetic friendly low glycemic popped fox nuts', 'metabolic')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 whitespace-nowrap transition-colors"
              >
                ⚡ Low GI Diabetic Snacks (Makhana)
              </button>
              <button
                type="button"
                onClick={() => handlePresetClick('Grade 1 pure Mongra saffron ISO 3632', 'ayurvedicRasayana')}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 whitespace-nowrap transition-colors"
              >
                🌸 Pure Certified Mongra Saffron
              </button>
            </div>
          </div>

          {/* Bottom: Bio-Nutritional Target Selector Pills */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                Filter by Biological &amp; Health Target (Dynamic Telemetry Scoring):
              </span>
              {selectedHealthTarget !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSelectHealthTarget('all')}
                  className="text-[11px] text-[#C9A45C] hover:underline"
                >
                  Reset Bio-Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {HEALTH_TARGETS.map((t) => {
                const isActive = selectedHealthTarget === t.key
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => onSelectHealthTarget(t.key)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-white text-[#17233B] border-white shadow-lg font-bold scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>{t.icon}</span>
                      <span className={`text-[9px] font-mono uppercase ${isActive ? 'text-stone-600' : 'text-stone-400'}`}>
                        {isActive ? 'Active' : t.tag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold mt-1 truncate">{t.label}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
