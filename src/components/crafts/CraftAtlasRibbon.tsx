'use client'

import React from 'react'
import { ALL_INDIA_REGIONS, ALL_INDIA_STATES, AllIndiaRegion } from '@/lib/clothing-data'

interface CraftAtlasRibbonProps {
  selectedRegion: string
  selectedState: string
  onSelectRegion: (region: AllIndiaRegion) => void
  onSelectState: (state: string) => void
}

export default function CraftAtlasRibbon({
  selectedRegion,
  selectedState,
  onSelectRegion,
  onSelectState,
}: CraftAtlasRibbonProps) {
  return (
    <div className="w-full bg-[#10192A] text-white border-y border-[#C9A45C]/30 py-5 px-4 sm:px-6 lg:px-8 space-y-4">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Title & Pan-India Scope Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#C9A45C] text-sm">🗺️</span>
            <span className="text-xs uppercase font-extrabold tracking-[0.2em] text-[#C9A45C]">
              All-India Craft Atlas · Single-Origin Regional Clusters
            </span>
          </div>
          <span className="text-[11px] text-stone-300 font-light hidden sm:inline">
            Direct weaver cooperatives verified across 15 Indian States
          </span>
        </div>

        {/* Major Geographic Zones */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {ALL_INDIA_REGIONS.map((r) => {
            const isSelected = selectedRegion === r.id || (r.id === 'All India' && !selectedRegion)
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onSelectRegion(r.id as AllIndiaRegion)
                  onSelectState('')
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#C9A45C] text-[#17233B] border-[#C9A45C] shadow-md scale-[1.02]'
                    : 'bg-white/5 hover:bg-white/10 text-stone-200 border-white/10'
                }`}
              >
                <span>{r.icon}</span>
                <span>{r.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isSelected ? 'bg-[#17233B] text-white' : 'bg-white/10 text-stone-300'
                }`}>
                  {r.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* State / Cluster Quick Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none text-[11px]">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold mr-1 flex-shrink-0">
            States:
          </span>
          {ALL_INDIA_STATES.map((st) => {
            const isStateSelected = selectedState === st || (st === 'All States' && !selectedState)
            return (
              <button
                key={st}
                type="button"
                onClick={() => onSelectState(st === 'All States' ? '' : st)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  isStateSelected
                    ? 'bg-white text-[#17233B] font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {st}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
