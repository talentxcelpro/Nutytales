'use client'

import React, { useState } from 'react'

const AMENITY_OPTIONS = [
  'Bukhari (Wood Fireplace)',
  'Master Wazwan Chef',
  'Dedicated Workspace with Gigabit Fiber',
  'Private Orchard Grounds',
  'Outdoor Heated Cedar Hot Tub',
  'Ski-in / Ski-out Access',
  'Direct Riverfront Frontage',
  'Lotus Pond Frontage',
  'Plunge Pool',
  'Full Kitchen',
  'Secure Gated Parking',
  'Silent Generator Backup (24/7)',
  'Underfloor Heating',
  'Boardroom & AV Screen',
  'Pet Friendly',
]

const ACCESSIBILITY_OPTIONS = [
  'Step-free entrance and ramps',
  'Wide 36-inch doorways',
  'Ground-floor accessible suite with walk-in shower',
  'Zero-threshold shower stalls',
  'Dedicated parking near entrance',
]

const PROPERTY_TYPE_OPTIONS = [
  { id: 'estate', label: 'Private Estate' },
  { id: 'villa', label: 'Luxury Villa' },
  { id: 'chalet', label: 'Alpine Ski Chalet' },
  { id: 'houseboat', label: 'Royal Cedar Houseboat' },
  { id: 'penthouse', label: 'Executive Penthouse' },
  { id: 'heritage_manor', label: 'Heritage Manor' },
]

export interface PropertyFilterState {
  minPrice: number
  maxPrice: number
  maxTotalTripBudget: number
  bedrooms: number
  propertyType: string
  instantBook: boolean
  freeCancellation: boolean
  verifiedHost: boolean
  workFriendly: boolean
  minRating: number
  amenities: string[]
  accessibility: string[]
}

interface PropertyFilterModalProps {
  isOpen: boolean
  onClose: () => void
  currentFilters: PropertyFilterState
  onApplyFilters: (filters: PropertyFilterState) => void
  onClearFilters: () => void
}

export default function PropertyFilterModal({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
  onClearFilters,
}: PropertyFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilterState>(currentFilters)
  const [amenitySearch, setAmenitySearch] = useState('')

  if (!isOpen) return null

  const toggleAmenity = (item: string) => {
    setLocalFilters((prev) => {
      const exists = prev.amenities.includes(item)
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((a) => a !== item) : [...prev.amenities, item],
      }
    })
  }

  const toggleAccessibility = (item: string) => {
    setLocalFilters((prev) => {
      const exists = prev.accessibility.includes(item)
      return {
        ...prev,
        accessibility: exists ? prev.accessibility.filter((a) => a !== item) : [...prev.accessibility, item],
      }
    })
  }

  const filteredAmenities = AMENITY_OPTIONS.filter((a) =>
    a.toLowerCase().includes(amenitySearch.toLowerCase()),
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col border border-[#E7E2D9] overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E2D9] bg-white flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#17233B]">
              Advanced Property Filters
            </h2>
            <p className="text-[11px] text-stone-500">
              Narrow results by verified attributes, exact budget and accessibility.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* 1. Nightly Price Range */}
          <div className="space-y-3">
            <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
              Nightly Rate (INR)
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-stone-500 block mb-1">Minimum Rate</label>
                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2">
                  <span className="text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="1000"
                    min="0"
                    value={localFilters.minPrice}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, minPrice: Number(e.target.value) || 0 })
                    }
                    className="w-full bg-transparent font-semibold text-[#17233B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-stone-500 block mb-1">Maximum Rate</label>
                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2">
                  <span className="text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="5000"
                    min="0"
                    value={localFilters.maxPrice}
                    onChange={(e) =>
                      setLocalFilters({ ...localFilters, maxPrice: Number(e.target.value) || 100000 })
                    }
                    className="w-full bg-transparent font-semibold text-[#17233B] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Total Trip Budget Target */}
          <div className="space-y-2 pt-4 border-t border-stone-200">
            <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
              Total Trip Budget Cap (Optional)
            </span>
            <p className="text-[11px] text-stone-500">
              Only show properties whose grand total (all nights, cleaning, taxes) stays within this budget.
            </p>
            <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2 max-w-sm">
              <span className="text-stone-400 font-bold">₹</span>
              <input
                type="number"
                step="5000"
                placeholder="e.g. 50000"
                value={localFilters.maxTotalTripBudget || ''}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    maxTotalTripBudget: Number(e.target.value) || 0,
                  })
                }
                className="w-full bg-transparent font-semibold text-[#17233B] focus:outline-none"
              />
            </div>
          </div>

          {/* 3. Rooms & Bedrooms */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
              Minimum Bedrooms
            </span>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, bedrooms: num })}
                  className={`py-2 px-4 rounded-xl font-bold transition-all border ${
                    localFilters.bedrooms === num
                      ? 'bg-[#17233B] text-white border-[#17233B]'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {num === 0 ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Property Type */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
              Property Type
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROPERTY_TYPE_OPTIONS.map((pt) => {
                const isSelected = localFilters.propertyType === pt.id
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() =>
                      setLocalFilters({
                        ...localFilters,
                        propertyType: isSelected ? '' : pt.id,
                      })
                    }
                    className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'bg-[#17233B] text-white border-[#17233B]'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <strong className="block text-xs">{pt.label}</strong>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 5. Booking Options & Trust Toggles */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
              Booking &amp; Host Trust
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:border-stone-400">
                <input
                  type="checkbox"
                  checked={localFilters.instantBook}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, instantBook: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#176B68]"
                />
                <div>
                  <strong className="block text-xs text-[#17233B]">⚡ Instant Book</strong>
                  <span className="text-[10px] text-stone-500">Book without waiting for host approval</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:border-stone-400">
                <input
                  type="checkbox"
                  checked={localFilters.freeCancellation}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, freeCancellation: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#176B68]"
                />
                <div>
                  <strong className="block text-xs text-[#17233B]">🛡️ Free Cancellation</strong>
                  <span className="text-[10px] text-stone-500">Flexible full refund policy</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:border-stone-400">
                <input
                  type="checkbox"
                  checked={localFilters.verifiedHost}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, verifiedHost: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#176B68]"
                />
                <div>
                  <strong className="block text-xs text-[#17233B]">👑 Verified Superhost</strong>
                  <span className="text-[10px] text-stone-500">Government ID &amp; property title audited</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-stone-200 cursor-pointer hover:border-stone-400">
                <input
                  type="checkbox"
                  checked={localFilters.workFriendly}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, workFriendly: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#176B68]"
                />
                <div>
                  <strong className="block text-xs text-[#17233B]">💻 Gigabit Fiber &amp; Work Desk</strong>
                  <span className="text-[10px] text-stone-500">100+ Mbps verified speed with UPS</span>
                </div>
              </label>
            </div>
          </div>

          {/* 6. Minimum Rating */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
              Minimum Guest Rating
            </span>
            <div className="flex gap-2">
              {[
                { label: 'Any', value: 0 },
                { label: '⭐ 4.8+', value: 4.8 },
                { label: '⭐ 4.9+', value: 4.9 },
                { label: '⭐ 4.95+', value: 4.95 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLocalFilters({ ...localFilters, minRating: opt.value })}
                  className={`py-2 px-3.5 rounded-xl font-bold transition-all border ${
                    localFilters.minRating === opt.value
                      ? 'bg-[#17233B] text-white border-[#17233B]'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Searchable Amenities */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
                Amenities &amp; Features
              </span>
              <span className="text-[10px] text-stone-500">
                {localFilters.amenities.length} selected
              </span>
            </div>

            <input
              type="text"
              placeholder="Search amenities (e.g. bukhari, pool, kitchen)..."
              value={amenitySearch}
              onChange={(e) => setAmenitySearch(e.target.value)}
              className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {filteredAmenities.map((amenity) => {
                const checked = localFilters.amenities.includes(amenity)
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#176B68]/10 border-[#176B68] text-[#17233B] font-semibold'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAmenity(amenity)}
                      className="accent-[#176B68]"
                    />
                    <span>{amenity}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 8. Accessibility Features */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <span className="font-bold text-stone-800 text-xs uppercase tracking-wider block">
              Accessibility Features
            </span>
            <div className="space-y-2">
              {ACCESSIBILITY_OPTIONS.map((acc) => {
                const checked = localFilters.accessibility.includes(acc)
                return (
                  <label
                    key={acc}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#176B68]/10 border-[#176B68] text-[#17233B] font-semibold'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAccessibility(acc)}
                      className="accent-[#176B68]"
                    />
                    <span>{acc}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E7E2D9] bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClearFilters()
              onClose()
            }}
            className="text-xs font-bold text-stone-600 hover:text-black underline px-2 py-1"
          >
            Clear all filters
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyFilters(localFilters)
                onClose()
              }}
              className="py-2.5 px-6 bg-[#17233B] hover:bg-[#1E3048] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
