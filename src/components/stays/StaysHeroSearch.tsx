'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStaysContext } from './StaysShell'

const POPULAR_DESTINATIONS = [
  { name: 'Srinagar, Kashmir', label: 'Walnut Orchards & Dal Lake Houseboats', tag: 'Kashmir' },
  { name: 'Gulmarg, Kashmir', label: 'Alpine Ski Chalets & Mt. Apharwat', tag: 'Kashmir' },
  { name: 'Pahalgam, Kashmir', label: 'Glacial Lidder Riverfront Villas', tag: 'Kashmir' },
  { name: 'Noida (Delhi NCR)', label: 'Executive Penthouse & Boardrooms', tag: 'Delhi-NCR' },
  { name: 'Patna, Bihar', label: 'Mithila Courtyard Haveli & Sourcing', tag: 'Patna' },
  { name: 'Bengaluru, Karnataka', label: 'Indiranagar Tropical Garden Villas', tag: 'Bengaluru' },
  { name: 'Kumarakom, Kerala', label: 'Lake Vembanad Nalukettu & Water Villas', tag: 'Kerala' },
  { name: 'Downtown Dubai', label: 'Palm Jumeirah Luxury Beach Villas', tag: 'Global' },
  { name: 'South Kensington, London', label: 'Victorian Mews & Townhouses', tag: 'Global' },
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

    const category = searchParams.get('category')
    if (category) params.set('category', category)
    const discovery = searchParams.get('discovery')
    if (discovery) params.set('discovery', discovery)

    router.push(`/stays?${params.toString()}#marketplace-results`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative z-30 mb-6">
      <form
        onSubmit={handleSearchSubmit}
        className="bg-white rounded-full p-2 sm:p-2.5 shadow-md hover:shadow-xl transition-shadow border border-stone-200 flex flex-wrap md:flex-nowrap items-center divide-y md:divide-y-0 md:divide-x divide-stone-200"
      >
        {/* 1. Destination Input */}
        <div ref={destRef} className="relative flex-1 px-4 sm:px-6 py-2 w-full md:w-auto">
          <label className="block text-[11px] font-bold text-stone-900 tracking-tight">
            Where
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value)
              setDestinationDropdownOpen(true)
            }}
            onFocus={() => setDestinationDropdownOpen(true)}
            placeholder="Search destinations..."
            className="w-full bg-transparent text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none truncate font-normal"
          />

          {/* Autocomplete Dropdown */}
          {destinationDropdownOpen && (
            <div className="absolute top-full left-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-stone-200 p-3 z-50 max-h-80 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-stone-400 px-3 py-1 block">
                Popular Stays
              </span>
              {POPULAR_DESTINATIONS.map((dest, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDestination(dest.name)
                    setDestinationDropdownOpen(false)
                  }}
                  className="w-full p-2.5 rounded-2xl hover:bg-stone-50 text-left transition-colors flex items-center justify-between group"
                >
                  <div className="pr-2">
                    <strong className="block text-xs text-stone-900 group-hover:text-[#176B68]">
                      {dest.name}
                    </strong>
                    <span className="text-[11px] text-stone-500 line-clamp-1">{dest.label}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 flex-shrink-0">
                    {dest.tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Check-In & Check-Out Dates */}
        <div className="flex-1 px-4 sm:px-6 py-2 flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-stone-900 tracking-tight">
              Check in
            </label>
            <input
              type="date"
              value={checkIn}
              min={todayStr}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-stone-900 tracking-tight">
              Check out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || todayStr}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-xs text-stone-700 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* 3. Guests Popover */}
        <div ref={guestRef} className="relative px-4 sm:px-6 py-2 w-full md:w-44">
          <label className="block text-[11px] font-bold text-stone-900 tracking-tight">
            Who
          </label>
          <button
            type="button"
            onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
            className="w-full text-left text-xs sm:text-sm text-stone-700 flex items-center justify-between"
          >
            <span className="truncate">
              {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
            </span>
            <span className="text-xs text-stone-400">▾</span>
          </button>

          {/* Guest Breakdown Popover */}
          {guestDropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-stone-200 p-4 z-50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-stone-900">Adults</strong>
                  <span className="text-[11px] text-stone-500">Ages 13 or above</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm disabled:opacity-30"
                  >
                    –
                  </button>
                  <span className="w-5 text-center font-bold text-xs">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm hover:border-black"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-stone-900">Children</strong>
                  <span className="text-[11px] text-stone-500">Ages 2–12</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    disabled={children <= 0}
                    className="w-7 h-7 rounded-full border border-stone-300 text-stone-700 flex items-center justify-center text-sm disabled:opacity-30"
                  >
                    –
                  </button>
                  <span className="w-5 text-center font-bold text-xs">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(children + 1)}
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

        {/* 4. Action Buttons (AI Concierge + Search) */}
        <div className="p-1 flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => openAiConcierge()}
            className="px-3 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Ask AI Concierge"
          >
            <span>✨</span>
            <span className="hidden lg:inline text-[11px]">AI</span>
          </button>

          <button
            type="submit"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#17233B] hover:bg-[#1E3048] text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md flex-shrink-0"
            title="Search verified stays"
          >
            <span className="text-sm">🔍</span>
          </button>
        </div>
      </form>
    </div>
  )
}
