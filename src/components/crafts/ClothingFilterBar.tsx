'use client'

import React, { useState } from 'react'
import {
  AVAILABLE_SIZES,
  AVAILABLE_COLOURS,
  AVAILABLE_MATERIALS,
  AVAILABLE_CRAFTS,
  AVAILABLE_OCCASIONS,
  ALL_INDIA_REGIONS,
  ALL_INDIA_STATES,
} from '@/lib/clothing-data'

export interface FilterState {
  search: string
  gender: string
  subCategory: string
  region?: string
  state?: string
  size: string
  colour: string
  material: string
  craft: string
  warmth: string
  occasion: string
  inStockOnly: boolean
  giOnly?: boolean
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'bestselling' | 'loom-hours'
}

interface ClothingFilterBarProps {
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  totalCount: number
  availableSubcategories?: string[]
  filterLatencyMs?: number
}

export default function ClothingFilterBar({
  filters,
  onFilterChange,
  totalCount,
  availableSubcategories = [],
  filterLatencyMs = 0.9,
}: ClothingFilterBarProps) {
  const [filterPanelExpanded, setFilterPanelExpanded] = useState(false)

  const activeFiltersCount = [
    filters.gender,
    filters.subCategory,
    filters.region,
    filters.state,
    filters.size,
    filters.colour,
    filters.material,
    filters.craft,
    filters.warmth,
    filters.occasion,
    filters.inStockOnly ? 'stock' : '',
    filters.giOnly ? 'gi' : '',
    filters.search ? 'search' : '',
  ].filter(Boolean).length

  const handleClearAll = () => {
    onFilterChange({
      search: '',
      gender: '',
      subCategory: '',
      region: '',
      state: '',
      size: '',
      colour: '',
      material: '',
      craft: '',
      warmth: '',
      occasion: '',
      inStockOnly: false,
      giOnly: false,
      sortBy: 'featured',
    })
  }

  const updateSingleFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: filters[key] === value ? '' : value,
    })
  }

  return (
    <div className="w-full space-y-4">
      {/* ── Top Bar: Results Count, Quick Toggles & Sort ─────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-stone-200 shadow-xs text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setFilterPanelExpanded(!filterPanelExpanded)}
            className="px-4 py-2 rounded-xl bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <span>⚙️ Filter Facets</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C9A45C] text-[#17233B] text-[10px] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <span className="text-[10px]">{filterPanelExpanded ? '▲' : '▼'}</span>
          </button>

          <span className="text-stone-600 font-medium hidden sm:inline">
            Showing <strong className="text-[#17233B]">{totalCount}</strong> pieces
          </span>

          {/* Real-time speed badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
            <span>⚡ {filterLatencyMs.toFixed(1)}ms</span>
            <span className="hidden md:inline font-normal text-emerald-600">index speed</span>
          </span>

          {/* Quick GI Tag Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, giOnly: !filters.giOnly })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
              filters.giOnly
                ? 'bg-[#176B68] text-white border-[#176B68]'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
          >
            <span>🏛️</span>
            <span>GI Certified Only</span>
          </button>

          {/* Quick In-Stock Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
              filters.inStockOnly
                ? 'bg-[#17233B] text-white border-[#17233B]'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
          >
            <span>📦</span>
            <span>In Stock</span>
          </button>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#704B32] hover:text-[#176B68] text-[11px] font-bold underline ml-1"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-stone-500 font-medium hidden sm:inline">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as FilterState['sortBy'],
              })
            }
            className="px-3 py-2 rounded-xl border border-stone-300 bg-white text-[#17233B] font-semibold text-xs focus:ring-1 focus:ring-[#176B68] focus:outline-none"
          >
            <option value="featured">Featured / Curated</option>
            <option value="newest">Newest Arrivals (FW &apos;26)</option>
            <option value="bestselling">Bestselling Classics</option>
            <option value="loom-hours">Loom Hours (Heirloom First)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ── Collapsible Interactive Filter Panel ─────────────────────────────── */}
      {filterPanelExpanded && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-6 animate-fadeIn text-xs">
          {/* 1. All-India State Selector */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
              State / Regional Craft Cluster
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_INDIA_STATES.map((st) => {
                const isSelected = filters.state === st || (!filters.state && st === 'All States')
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateSingleFilter('state', st === 'All States' ? '' : st)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all border ${
                      isSelected
                        ? 'bg-[#17233B] text-white border-[#17233B] shadow-xs'
                        : 'bg-[#FAF6EE] hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Craft Traditions */}
          <div className="space-y-2 border-t border-stone-100 pt-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
              Craft Tradition / Needlework / Weave
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
              {AVAILABLE_CRAFTS.map((cr) => {
                const isSelected = filters.craft === cr || (!filters.craft && cr === 'All Crafts')
                return (
                  <button
                    key={cr}
                    type="button"
                    onClick={() => updateSingleFilter('craft', cr === 'All Crafts' ? '' : cr)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#C9A45C] text-[#17233B] border-[#C9A45C] font-bold shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    {cr}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Subcategories (if available) */}
          {availableSubcategories.length > 0 && (
            <div className="space-y-2 border-t border-stone-100 pt-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Garment Silhouette
              </span>
              <div className="flex flex-wrap gap-2">
                {availableSubcategories.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => updateSingleFilter('subCategory', sub)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all border ${
                      filters.subCategory === sub
                        ? 'bg-[#17233B] text-white border-[#17233B] shadow-xs'
                        : 'bg-[#FAF6EE] hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t border-stone-100">
            {/* 3. Size Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Size
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateSingleFilter('size', sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      filters.size === sz
                        ? 'bg-[#176B68] text-white border-[#176B68]'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Natural Fiber / Material */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Natural Fiber / Material
              </span>
              <select
                value={filters.material}
                onChange={(e) => updateSingleFilter('material', e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-medium outline-none"
              >
                <option value="">All Materials</option>
                {AVAILABLE_MATERIALS.filter((m) => m !== 'All Materials').map((mat) => (
                  <option key={mat} value={mat}>
                    {mat}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Occasion Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Occasion
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_OCCASIONS.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => updateSingleFilter('occasion', occ)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      filters.occasion === occ
                        ? 'bg-[#17233B] text-white border-[#17233B]'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Wardrobe Gender */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Department
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['women', 'men', 'unisex', 'kids'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => updateSingleFilter('gender', g)}
                    className={`px-3 py-1 rounded-lg text-xs uppercase font-bold transition-all border ${
                      filters.gender === g
                        ? 'bg-[#17233B] text-white border-[#17233B]'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
