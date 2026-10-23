'use client'

import React, { useState, useEffect, useMemo } from 'react'

export interface DayAvailabilityInfo {
  date: string
  dayOfWeek: number
  dayNumber: number
  month: number
  year: number
  price: number
  available: boolean
  status: 'available' | 'booked' | 'blocked_ical' | 'past'
  reason?: string
}

interface StayAvailabilityCalendarProps {
  propertySlug: string
  checkIn: string
  checkOut: string
  onDatesChange: (checkIn: string, checkOut: string) => void
  isBuyout?: boolean
  roomId?: string
  baseRate?: number
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAYS_HEADER = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function StayAvailabilityCalendar({
  propertySlug,
  checkIn,
  checkOut,
  onDatesChange,
  isBuyout = true,
  roomId,
  baseRate = 12000,
}: StayAvailabilityCalendarProps) {
  // Current month offset: 0 = current month, 1 = next month, etc.
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, DayAvailabilityInfo>>({})
  const [loading, setLoading] = useState(true)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Fetch availability from API
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const now = new Date()
    const targetDate = new Date(now.getFullYear(), now.getMonth() + currentMonthOffset, 1)
    const monthStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`

    fetch(`/api/stays/availability?slug=${encodeURIComponent(propertySlug)}&month=${monthStr}&isBuyout=${isBuyout}${roomId ? `&roomId=${roomId}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        if (data.success && Array.isArray(data.days)) {
          const map: Record<string, DayAvailabilityInfo> = {}
          data.days.forEach((day: DayAvailabilityInfo) => {
            map[day.date] = day
          })
          setAvailabilityMap((prev) => ({ ...prev, ...map }))
        }
      })
      .catch(() => {
        // Fallback gracefully
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [propertySlug, currentMonthOffset, isBuyout, roomId])

  // Current calendar view base dates
  const now = new Date()
  const firstMonthDate = useMemo(() => {
    return new Date(now.getFullYear(), now.getMonth() + currentMonthOffset, 1)
  }, [currentMonthOffset])

  const secondMonthDate = useMemo(() => {
    return new Date(now.getFullYear(), now.getMonth() + currentMonthOffset + 1, 1)
  }, [currentMonthOffset])

  // Helper to render calendar grid for a specific month
  const renderMonthGrid = (monthDate: Date) => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDays = new Date(year, month + 1, 0).getDate()

    const todayStr = new Date().toISOString().split('T')[0]

    const cells: React.ReactNode[] = []

    // Empty offset cells
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(<div key={`empty-${i}`} className="h-12 w-full" />)
    }

    // Day cells
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const isPast = dateStr < todayStr
      const dayInfo = availabilityMap[dateStr]
      const status = isPast ? 'past' : (dayInfo?.status || 'available')
      const isAvailable = status === 'available'
      const price = dayInfo?.price || baseRate

      const isCheckIn = checkIn === dateStr
      const isCheckOut = checkOut === dateStr
      const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut
      const isHoverPreview =
        checkIn &&
        !checkOut &&
        hoveredDate &&
        hoveredDate > checkIn &&
        dateStr > checkIn &&
        dateStr <= hoveredDate &&
        isAvailable

      // Format compact price e.g. "₹28k" or "₹9.5k"
      const formatCompact = (val: number) => {
        if (val >= 1000) {
          const k = val / 1000
          return `₹${k % 1 === 0 ? k : k.toFixed(1)}k`
        }
        return `₹${val}`
      }

      cells.push(
        <button
          key={dateStr}
          type="button"
          disabled={!isAvailable}
          onClick={() => handleDateClick(dateStr, isAvailable)}
          onMouseEnter={() => isAvailable && setHoveredDate(dateStr)}
          onMouseLeave={() => setHoveredDate(null)}
          title={dayInfo?.reason || (isAvailable ? `${dateStr}: ₹${price.toLocaleString('en-IN')}/night` : 'Unavailable')}
          className={`relative h-12 w-full rounded-xl flex flex-col items-center justify-center text-xs transition-all select-none ${
            isCheckIn || isCheckOut
              ? 'bg-[#17233B] text-white font-bold shadow-md z-10 scale-105'
              : isInRange || isHoverPreview
              ? 'bg-[#176B68]/15 text-[#17233B] font-semibold rounded-none'
              : !isAvailable
              ? status === 'booked'
                ? 'bg-red-50/60 text-red-300 cursor-not-allowed line-through'
                : status === 'blocked_ical'
                ? 'bg-amber-50/60 text-amber-300 cursor-not-allowed line-through'
                : 'text-stone-300 cursor-not-allowed'
              : 'hover:bg-stone-100 text-stone-800'
          }`}
        >
          <span className="text-[13px] leading-none">{d}</span>
          {isAvailable && (
            <span
              className={`text-[9px] font-mono leading-none pt-0.5 ${
                isCheckIn || isCheckOut ? 'text-[#C9A45C]' : 'text-stone-500'
              }`}
            >
              {formatCompact(price)}
            </span>
          )}
          {!isAvailable && status !== 'past' && (
            <span className="text-[8px] leading-none pt-0.5 text-stone-400">
              {status === 'blocked_ical' ? 'sync' : 'locked'}
            </span>
          )}
        </button>,
      )
    }

    return (
      <div className="space-y-3">
        <div className="text-center">
          <h4 className="font-serif font-bold text-sm text-[#17233B]">
            {MONTH_NAMES[month]} {year}
          </h4>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS_HEADER.map((d, i) => (
            <div key={i} className="text-[10px] font-bold text-stone-400 py-1 uppercase">
              {d}
            </div>
          ))}
          {cells}
        </div>
      </div>
    )
  }

  // Handle clicking a day
  const handleDateClick = (dateStr: string, isAvailable: boolean) => {
    if (!isAvailable) return

    // If no checkIn selected, or both checkIn & checkOut already selected: set checkIn
    if (!checkIn || (checkIn && checkOut)) {
      onDatesChange(dateStr, '')
      return
    }

    // If checkIn is set, but no checkOut
    if (checkIn && !checkOut) {
      if (dateStr <= checkIn) {
        // Reset check-in to this earlier date
        onDatesChange(dateStr, '')
        return
      }

      // Check if any date in between is unavailable
      const start = new Date(checkIn).getTime()
      const end = new Date(dateStr).getTime()
      let hasConflict = false

      for (let t = start + 86400000; t < end; t += 86400000) {
        const midIso = new Date(t).toISOString().split('T')[0]
        const midInfo = availabilityMap[midIso]
        if (midInfo && !midInfo.available) {
          hasConflict = true
          break
        }
      }

      if (hasConflict) {
        // Can't span over booked dates, reset check-in to clicked date
        onDatesChange(dateStr, '')
      } else {
        onDatesChange(checkIn, dateStr)
      }
    }
  }

  // Quick Preset Handlers
  const applyPreset = (nights: number) => {
    const today = new Date()
    // Find next available contiguous window of N nights
    let startCandidate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    for (let offset = 0; offset < 45; offset++) {
      const probeIn = new Date(startCandidate.getTime() + offset * 86400000).toISOString().split('T')[0]
      const probeOut = new Date(startCandidate.getTime() + (offset + nights) * 86400000).toISOString().split('T')[0]

      // Check if all nights in probe window are available
      let allOpen = true
      for (let i = 0; i < nights; i++) {
        const nightIso = new Date(new Date(probeIn).getTime() + i * 86400000).toISOString().split('T')[0]
        const info = availabilityMap[nightIso]
        if (info && !info.available) {
          allOpen = false
          break
        }
      }

      if (allOpen) {
        onDatesChange(probeIn, probeOut)
        break
      }
    }
  }

  // Calculate selected nights count
  const selectedNights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.max(0, Math.round(diff / 86400000))
  }, [checkIn, checkOut])

  return (
    <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-7 shadow-xs space-y-6">
      {/* Header & Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#17233B]">
            Availability &amp; Dynamic Rates
          </h3>
          <p className="text-xs text-stone-500">
            Select dates to see exact rates with seasonal multipliers and long-stay discounts.
          </p>
        </div>

        {/* Month Pagers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentMonthOffset <= 0}
            onClick={() => setCurrentMonthOffset((prev) => Math.max(0, prev - 1))}
            className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold"
            title="Previous Month"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonthOffset((prev) => prev + 1)}
            className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold"
            title="Next Month"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Quick Window Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1">
          Quick Ranges:
        </span>
        <button
          type="button"
          onClick={() => applyPreset(2)}
          className="px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-all"
        >
          Weekend Getaway (2N)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(7)}
          className="px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all border border-emerald-200"
        >
          Workation (7N · 10% Off)
        </button>
        <button
          type="button"
          onClick={() => applyPreset(14)}
          className="px-3 py-1 rounded-full bg-[#17233B]/5 hover:bg-[#17233B]/10 text-[#17233B] text-xs font-semibold transition-all"
        >
          Extended Retreat (14N · 15% Off)
        </button>
        {(checkIn || checkOut) && (
          <button
            type="button"
            onClick={() => onDatesChange('', '')}
            className="ml-auto text-xs text-red-600 font-bold hover:underline"
          >
            Clear Dates ✕
          </button>
        )}
      </div>

      {/* Dual Month Calendar View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-2xs flex items-center justify-center z-20 text-xs font-bold text-stone-500">
            Refreshing real-time calendar...
          </div>
        )}
        {renderMonthGrid(firstMonthDate)}
        {renderMonthGrid(secondMonthDate)}
      </div>

      {/* Calendar Legend & Selection Summary */}
      <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-stone-600 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md border border-stone-300 bg-white inline-block" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#17233B] inline-block" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-red-100 inline-block line-through text-[9px] text-red-400 text-center font-mono">
              ✕
            </span>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-100 inline-block text-[9px] text-amber-500 text-center font-mono">
              ⚡
            </span>
            <span>Airbnb / iCal Sync</span>
          </div>
        </div>

        {/* Selected Date Summary */}
        <div className="text-right">
          {checkIn && checkOut ? (
            <div className="space-y-0.5">
              <span className="font-serif font-bold text-sm text-[#17233B]">
                {checkIn} → {checkOut} ({selectedNights} {selectedNights === 1 ? 'Night' : 'Nights'})
              </span>
              <p className="text-[10px] text-emerald-700 font-semibold">
                ✓ Guaranteed date lockout with double-booking shield
              </p>
            </div>
          ) : checkIn ? (
            <span className="text-stone-500 text-xs italic">
              Check-in: {checkIn}. Please select check-out date.
            </span>
          ) : (
            <span className="text-stone-400 text-xs italic">
              Select your check-in date to begin.
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
