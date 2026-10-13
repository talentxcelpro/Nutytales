'use client'

import React from 'react'

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

const HEALTH_TARGETS: { key: HealthTargetKey; label: string; icon: string; short: string }[] = [
  { key: 'all', label: 'All Harvests', icon: '✦', short: 'All' },
  { key: 'cognitive', label: 'Brain & Memory', icon: '🧠', short: 'Brain' },
  { key: 'cardiovascular', label: 'Cardio & Heart', icon: '❤️', short: 'Cardio' },
  { key: 'metabolic', label: 'Metabolic & Low GI', icon: '⚡', short: 'Low-GI' },
  { key: 'seniorLongevity', label: 'Senior Vitality', icon: '👵', short: 'Longevity' },
  { key: 'activeAthletic', label: 'Plant Protein & ATP', icon: '🏋️', short: 'Protein' },
  { key: 'ayurvedicRasayana', label: 'Ayurvedic Rasayana', icon: '🕉️', short: 'Rasayana' },
]

export default function PrecisionHarvestCommandBar({
  selectedHealthTarget,
  onSelectHealthTarget,
  searchQuery,
  onSearchChange,
  onOpenSynthesizer,
  comparedCount,
  onOpenCompareRadar,
}: PrecisionHarvestCommandBarProps) {
  const handleOpenSIWithQuery = (q?: string) => {
    window.dispatchEvent(
      new CustomEvent('nt_open_si', { detail: { query: q || '' } })
    )
  }

  return (
    <div className="w-full mb-6">
      {/* ── Compact Luxury Precision Dock (Understated & Ergonomic) ── */}
      <div className="bg-[#17233B] text-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-lg border border-white/10 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          {/* Top Row: System Status, SI Assistant Trigger & Fast Tools */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#C9A45C] font-semibold">
                PRECISION HARVEST OS · BIO-NUTRITIONAL ENGINE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Trigger SI Assistant Drawer */}
              <button
                type="button"
                onClick={() => handleOpenSIWithQuery()}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#E5C882] hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5 active:scale-95 shadow-xs"
                title="Open Sensory Intelligence Sommelier"
              >
                <span>✨</span>
                <span>Ask SI Sommelier</span>
              </button>

              {/* Daily Synthesizer Trigger */}
              <button
                type="button"
                onClick={onOpenSynthesizer}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E5C882] text-[#17233B] font-bold text-xs shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>🧪</span>
                <span>Daily 30g Synthesizer</span>
              </button>

              {/* Compare Radar Trigger */}
              <button
                type="button"
                onClick={onOpenCompareRadar}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  comparedCount > 0
                    ? 'bg-white text-[#17233B] border-white shadow-md font-bold'
                    : 'bg-white/10 text-stone-300 border-white/15 hover:bg-white/15'
                }`}
              >
                <span>⚖️</span>
                <span>Kernel Radar</span>
                {comparedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#17233B] text-white text-[10px] flex items-center justify-center font-bold">
                    {comparedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Row: Biological Health Target Filter Pills (Single Responsive Row) */}
          <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex-shrink-0 mr-1 hidden sm:inline">
              Target:
            </span>
            {HEALTH_TARGETS.map((target) => {
              const isSelected = selectedHealthTarget === target.key
              return (
                <button
                  key={target.key}
                  type="button"
                  onClick={() => onSelectHealthTarget(target.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-[#17233B] font-bold shadow-md scale-[1.02]'
                      : 'bg-white/10 hover:bg-white/15 text-stone-300 border border-white/10'
                  }`}
                >
                  <span>{target.icon}</span>
                  <span>{target.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
