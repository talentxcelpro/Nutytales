'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStaysContext } from './StaysShell'

const POPULAR_DESTINATIONS = [
  { name: 'Srinagar, Kashmir', label: 'Walnut Orchards & Dal Lake Houseboats', tag: 'Kashmir' },
  { name: 'Gulmarg, Kashmir', label: 'Alpine Ski Chalets & Mt. Apharwat', tag: 'Kashmir' },
  { name: 'Pahalgam, Kashmir', label: 'Glacial Lidder Riverfront Villas', tag: 'Kashmir' },
  { name: 'Noida (Delhi NCR)', label: 'Cyber City Executive Residences & Boardrooms', tag: 'Delhi-NCR' },
  { name: 'Patna, Bihar', label: 'Mithila Courtyard Manor & Makhana Sourcing', tag: 'Patna' },
  { name: 'Bengaluru, Karnataka', label: 'Indiranagar Tropical Garden Villas', tag: 'Bengaluru' },
  { name: 'Kumarakom, Kerala', label: 'Lake Vembanad Nalukettu & Spice Estates', tag: 'Kerala' },
  { name: 'Downtown Dubai', label: 'Burj Khalifa Skyline Villas & DIFC Suites', tag: 'Global' },
  { name: 'South Kensington, London', label: 'Cobblestone Mews & Townhouses', tag: 'Global' },
]

interface StaysHeroSearchProps {
  onOpenFilterModal?: () => void
  activeFiltersCount?: number
}

export default function StaysHeroSearch({
  onOpenFilterModal,
  activeFiltersCount = 0,
}: StaysHeroSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openAiConcierge } = useStaysContext()

  // State from URL or defaults
  const [destination, setDestination] = useState(searchParams.get('destination') || '')
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false)
  const destRef = useRef<HTMLDivElement>(null)

  const todayStr = new Date().toISOString().split('T')[0]
  const defaultOutStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || todayStr)
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || defaultOutStr)

  // Guests
  const [adults, setAdults] = useState(parseInt(searchParams.get('adults') || '2', 10))
  const [children, setChildren] = useState(parseInt(searchParams.get('children') || '0', 10))
  const [infants, setInfants] = useState(parseInt(searchParams.get('infants') || '0', 10))
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false)
  const guestRef = useRef<HTMLDivElement>(null)

  const totalGuests = adults + children

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestinationDropdownOpen(false)
      }
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setGuestDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDestinationDropdownOpen(false)
    setGuestDropdownOpen(false)

    const params = new URLSearchParams()
    if (destination.trim()) params.set('destination', destination.trim())
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('guests', totalGuests.toString())
    if (adults > 0) params.set('adults', adults.toString())
    if (children > 0) params.set('children', children.toString())
    if (infants > 0) params.set('infants', infants.toString())

    // Preserve any existing filter tags
    const category = searchParams.get('category')
    if (category) params.set('category', category)
    const discovery = searchParams.get('discovery')
    if (discovery) params.set('discovery', discovery)

    router.push(`/stays?${params.toString()}#marketplace-results`)
  }

  return (
    <div className="w-full max-w-5xl mx-auto relative z-30">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-4 shadow-xl border border-[#E7E2D9] grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center"
      >
        {/* 1. Destination Input */}
        <div ref={destRef} className="relative md:col-span-4 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 transition-colors">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
            Where to?
          </label>
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-sm">📍</span>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value)
                setDestinationDropdownOpen(true)
              }}
              onFocus={() => setDestinationDropdownOpen(true)}
              placeholder="Srinagar, Gulmarg, Noida, Dubai..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#17233B] placeholder-stone-400 focus:outline-none"
            />
            {destination && (
              <button
                type="button"
                onClick={() => setDestination('')}
                className="text-stone-400 hover:text-stone-700 text-xs px-1"
              >
                ×
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {destinationDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 max-h-72 overflow-y-auto animate-fadeIn">
              <span className="text-[10px] uppercase font-bold text-stone-400 px-3 py-1.5 block">
                Popular Destinations
              </span>
              {POPULAR_DESTINATIONS.map((dest, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDestination(dest.name)
                    setDestinationDropdownOpen(false)
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-stone-50 text-left transition-colors flex items-center justify-between group"
                >
                  <div>
                    <strong className="block text-xs text-[#17233B] group-hover:text-[#176B68]">
                      {dest.name}
                    </strong>
                    <span className="text-[11px] text-stone-500">{dest.label}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                    {dest.tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Check-In & Check-Out Dates */}
        <div className="md:col-span-3 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
              Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              min={todayStr}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
              Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || todayStr}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Guests Selector Popover */}
        <div ref={guestRef} className="relative md:col-span-2 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 transition-colors">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
            Who
          </label>
          <button
            type="button"
            onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
            className="w-full text-left text-xs sm:text-sm font-semibold text-[#17233B] flex items-center justify-between"
          >
            <span>
              {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
              {infants > 0 ? `, ${infants} Inf` : ''}
            </span>
            <span className="text-xs text-stone-400">▾</span>
          </button>

          {/* Guest Breakdown Popover */}
          {guestDropdownOpen && (
            <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-64 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 space-y-4 animate-fadeIn">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-[#17233B]">Adults</strong>
                  <span className="text-[10px] text-stone-500">Age 13+</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm hover:border-black"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm hover:border-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div>
                  <strong className="block text-xs text-[#17233B]">Children</strong>
                  <span className="text-[10px] text-stone-500">Ages 2-12</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm hover:border-black"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm hover:border-black"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <div>
                  <strong className="block text-xs text-[#17233B]">Infants</strong>
                  <span className="text-[10px] text-stone-500">Under 2</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm hover:border-black"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{infants}</span>
                  <button
                    type="button"
                    onClick={() => setInfants(infants + 1)}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm hover:border-black"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGuestDropdownOpen(false)}
                className="w-full py-2 bg-[#17233B] text-white text-xs font-bold rounded-xl mt-2"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* 4. Filter Button & Submit Action */}
        <div className="md:col-span-3 flex items-center gap-2">
          {onOpenFilterModal && (
            <button
              type="button"
              onClick={onOpenFilterModal}
              className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeFiltersCount > 0
                  ? 'bg-[#17233B] text-[#C9A45C] border-[#17233B]'
                  : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="Open Advanced Property Filters"
            >
              <span>⚙️</span>
              <span className="hidden xl:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#C9A45C] text-[#17233B] text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}

          <button
            type="submit"
            className="flex-1 py-3.5 px-6 bg-[#C9A45C] hover:bg-[#b89347] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            <span>Search Stays</span>
          </button>
        </div>
      </form>

      {/* Voice / AI Natural Language Shortcut */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-stone-600">
        <span className="text-stone-400">Prefer conversational search?</span>
        <button
          type="button"
          onClick={() => openAiConcierge()}
          className="text-[#17233B] font-bold underline hover:text-[#176B68] flex items-center gap-1"
        >
          <span>✨ Try AI Concierge</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#C9A45C]/20 text-[#704B32] font-semibold">
            &ldquo;Villa in Kashmir for 8 with mountain view&rdquo;
          </span>
        </button>
      </div>
    </div>
  )
}
