'use client'

import React, { useState } from 'react'
import {
  AVAILABLE_SIZES,
  AVAILABLE_COLOURS,
  AVAILABLE_MATERIALS,
  AVAILABLE_CRAFTS,
  AVAILABLE_OCCASIONS,
  AVAILABLE_WARMTHS,
} from '@/lib/clothing-data'

export interface FilterState {
  search: string
  gender: string
  subCategory: string
  size: string
  colour: string
  material: string
  craft: string
  warmth: string
  occasion: string
  inStockOnly: boolean
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'bestselling'
}

interface ClothingFilterBarProps {
  filters: FilterState
  onFilterChange: (newFilters: FilterState) => void
  totalCount: number
  availableSubcategories?: string[]
}

export default function ClothingFilterBar({
  filters,
  onFilterChange,
  totalCount,
  availableSubcategories = [],
}: ClothingFilterBarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [filterPanelExpanded, setFilterPanelExpanded] = useState(false)

  const activeFiltersCount = [
    filters.gender,
    filters.subCategory,
    filters.size,
    filters.colour,
    filters.material,
    filters.craft,
    filters.warmth,
    filters.occasion,
    filters.inStockOnly ? 'stock' : '',
    filters.search ? 'search' : '',
  ].filter(Boolean).length

  const handleClearAll = () => {
    onFilterChange({
      search: '',
      gender: '',
      subCategory: '',
      size: '',
      colour: '',
      material: '',
      craft: '',
      warmth: '',
      occasion: '',
      inStockOnly: false,
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFilterPanelExpanded(!filterPanelExpanded)}
            className="px-4 py-2 rounded-xl bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <span>⚙️ Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#C9A45C] text-[#17233B] text-[10px] font-extrabold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <span className="text-[10px]">{filterPanelExpanded ? '▲' : '▼'}</span>
          </button>

          <span className="text-stone-500 font-medium hidden sm:inline">
            Showing <strong className="text-[#17233B]">{totalCount}</strong> pieces
          </span>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#704B32] hover:text-[#176B68] text-[11px] font-bold underline"
            >
              Clear All ({activeFiltersCount})
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-stone-500 font-medium hidden sm:inline">Sort By:</span>
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
            <option value="newest">Newest Arrivals (FW '26)</option>
            <option value="bestselling">Bestselling Classics</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* ── Collapsible Interactive Filter Panel ─────────────────────────────── */}
      {filterPanelExpanded && (
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-6 animate-fadeIn text-xs">
          {/* Subcategories (if available) */}
          {availableSubcategories.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Sub-Category
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
            {/* 1. Size Filter */}
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

            {/* 2. Colour Story Filter */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Colour Story (FW '26)
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLOURS.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => updateSingleFilter('colour', col.name)}
                    title={col.name}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                      filters.colour === col.name
                        ? 'border-[#17233B] bg-[#17233B] text-white'
                        : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Craft & Needlework */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Craft / Embroidery
              </span>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_CRAFTS.map((cr) => (
                  <button
                    key={cr}
                    type="button"
                    onClick={() => updateSingleFilter('craft', cr)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all border ${
                      filters.craft === cr
                        ? 'bg-[#176B68] text-white border-[#176B68] font-bold'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                    }`}
                  >
                    {cr}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Warmth & Occasion */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block mb-1">
                  Warmth Rating
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_WARMTHS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => updateSingleFilter('warmth', w)}
                      className={`px-2 py-0.5 rounded text-[11px] transition-all border ${
                        filters.warmth === w
                          ? 'bg-[#17233B] text-white border-[#17233B] font-bold'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      {w.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block mb-1">
                  Occasion
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_OCCASIONS.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => updateSingleFilter('occasion', occ)}
                      className={`px-2 py-0.5 rounded text-[11px] transition-all border ${
                        filters.occasion === occ
                          ? 'bg-[#C9A45C] text-[#17233B] border-[#C9A45C] font-bold'
                          : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-300'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Checkbox: In Stock */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-700">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    inStockOnly: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#176B68] focus:ring-[#176B68]"
              />
              <span>In-Stock Ready to Dispatch Only</span>
            </label>

            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#704B32] hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* ── Active Filter Badges Pill Row ────────────────────────────────────── */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-400 text-[11px] font-bold uppercase tracking-wider">
            Active:
          </span>
          {filters.search && (
            <span className="inline-flex items-center gap-1.5 bg-stone-200 text-[#17233B] px-3 py-1 rounded-full">
              Search: "{filters.search}"
              <button onClick={() => updateSingleFilter('search', '')}>✕</button>
            </span>
          )}
          {filters.subCategory && (
            <span className="inline-flex items-center gap-1.5 bg-[#FAF6EE] border border-stone-300 text-[#17233B] px-3 py-1 rounded-full">
              {filters.subCategory}
              <button onClick={() => updateSingleFilter('subCategory', '')}>✕</button>
            </span>
          )}
          {filters.size && (
            <span className="inline-flex items-center gap-1.5 bg-[#FAF6EE] border border-stone-300 text-[#17233B] px-3 py-1 rounded-full">
              Size: {filters.size}
              <button onClick={() => updateSingleFilter('size', '')}>✕</button>
            </span>
          )}
          {filters.colour && (
            <span className="inline-flex items-center gap-1.5 bg-[#FAF6EE] border border-stone-300 text-[#17233B] px-3 py-1 rounded-full">
              Colour: {filters.colour}
              <button onClick={() => updateSingleFilter('colour', '')}>✕</button>
            </span>
          )}
          {filters.craft && (
            <span className="inline-flex items-center gap-1.5 bg-[#FAF6EE] border border-stone-300 text-[#17233B] px-3 py-1 rounded-full">
              Craft: {filters.craft}
              <button onClick={() => updateSingleFilter('craft', '')}>✕</button>
            </span>
          )}
          {filters.warmth && (
            <span className="inline-flex items-center gap-1.5 bg-[#FAF6EE] border border-stone-300 text-[#17233B] px-3 py-1 rounded-full">
              Warmth: {filters.warmth.split(' ')[0]}
              <button onClick={() => updateSingleFilter('warmth', '')}>✕</button>
            </span>
          )}
          {filters.occasion && (
            <span className="inline-flex items-center gap-1.5 bg-[#FAF6EE] border border-stone-300 text-[#17233B] px-3 py-1 rounded-full">
              Occasion: {filters.occasion}
              <button onClick={() => updateSingleFilter('occasion', '')}>✕</button>
            </span>
          )}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 bg-[#176B68]/15 text-[#176B68] font-bold px-3 py-1 rounded-full">
              In Stock Only
              <button onClick={() => onFilterChange({ ...filters, inStockOnly: false })}>✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
