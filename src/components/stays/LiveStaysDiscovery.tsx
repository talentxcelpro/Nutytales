'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { STAY_PROPERTIES, StayProperty, StayRoom } from '@/lib/stays-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function LiveStaysDiscovery() {
  const [selectedPropId, setSelectedPropId] = useState<string>('prop-kashmir')
  const property = useMemo(
    () => STAY_PROPERTIES.find((p) => p.id === selectedPropId) || STAY_PROPERTIES[0],
    [selectedPropId]
  )

  const [selectedRoomId, setSelectedRoomId] = useState<string>(property.rooms[0]?.id || '')
  const selectedRoom = useMemo(
    () => property.rooms.find((r) => r.id === selectedRoomId) || property.rooms[0],
    [property, selectedRoomId]
  )

  // Booking Parameters
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultCheckOutStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState<string>(todayStr)
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOutStr)
  const [guestsCount, setGuestsCount] = useState<number>(2)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])

  // Guest Contact
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReserved, setIsReserved] = useState(false)

  // Calculate Nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diffTime = outDate.getTime() - inDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }, [checkIn, checkOut])

  // Check if Peak Season applies
  const isPeakSeason = useMemo(() => {
    if (!checkIn) return false
    const monthName = new Date(checkIn).toLocaleString('en-US', { month: 'long' })
    return property.seasonalRates.peakMonths.includes(monthName)
  }, [checkIn, property])

  const seasonalMultiplier = isPeakSeason
    ? property.seasonalRates.peakSeasonMultiplier
    : 1.0

  // Pricing Calculation
  const nightlyRate = Math.round(selectedRoom.basePricePerNight * seasonalMultiplier)
  const baseRoomTotal = nightlyRate * nights

  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((acc, addOnId) => {
      const item = property.experienceAddOns.find((a) => a.id === addOnId)
      return acc + (item ? item.pricePerPerson * guestsCount : 0)
    }, 0)
  }, [selectedAddOns, property, guestsCount])

  const totalEstimate = baseRoomTotal + addOnsTotal

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handlePropertySwitch = (propId: string) => {
    setSelectedPropId(propId)
    const newProp = STAY_PROPERTIES.find((p) => p.id === propId)
    if (newProp && newProp.rooms.length > 0) {
      setSelectedRoomId(newProp.rooms[0].id)
    }
    setSelectedAddOns([])
  }

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const addOnTitles = selectedAddOns
      .map((id) => property.experienceAddOns.find((a) => a.id === id)?.title)
      .filter(Boolean)
      .join(', ')

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName || 'Boutique Stay Enquirer',
          phone: guestPhone,
          email: guestEmail,
          city: property.city,
          businessName: `[STAYS] ${property.name} - ${selectedRoom.name}`,
          message: `Check-in: ${checkIn} | Check-out: ${checkOut} (${nights} nights) | Guests: ${guestsCount} | Add-ons: ${
            addOnTitles || 'None'
          } | Estimated Tariff: ₹${totalEstimate.toLocaleString('en-IN')} | Notes: ${specialRequests}`,
          source: 'live-stays-engine',
        }),
      })
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false)
      setIsReserved(true)
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales Hospitality! 🏔️\n\nI want to reserve a stay:\n• Property: *${property.name}* (${property.city})\n• Room: ${selectedRoom.name}\n• Dates: ${checkIn} to ${checkOut} (${nights} nights)\n• Guests: ${guestsCount}\n• Add-ons: ${
      selectedAddOns.map((id) => property.experienceAddOns.find((a) => a.id === id)?.title).join(', ') || 'Standard'
    }\n• Estimated Tariff: ₹${totalEstimate.toLocaleString('en-IN')}\n\nPlease verify availability and confirm my reservation!`,
  )}`

  return (
    <div className="space-y-12">
      {/* ── 1. Property Switcher Tabs ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {STAY_PROPERTIES.map((prop) => {
          const isSelected = prop.id === selectedPropId
          return (
            <button
              key={prop.id}
              onClick={() => handlePropertySwitch(prop.id)}
              className={`px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-sm ${
                isSelected
                  ? 'bg-[#17233B] text-white ring-2 ring-[#C9A45C] scale-105'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
              }`}
            >
              <span>{prop.city === 'Srinagar' ? '🏔️' : prop.city === 'Noida' ? '🏢' : '🏛️'}</span>
              <span>{prop.name}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#C9A45C] text-[#17233B]' : 'bg-stone-100 text-stone-600'}`}>
                {prop.city}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── 2. Active Property Hero Showcase ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Photo Gallery & Insets */}
        <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[460px] bg-stone-900">
          <Image
            src={property.featuredImage}
            alt={property.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Badges */}
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-[#17233B]/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20">
              {property.city}, {property.state}
            </span>
            {isPeakSeason && (
              <span className="px-3 py-1 rounded-full bg-[#C9A45C] text-[#17233B] text-xs font-extrabold uppercase tracking-wider shadow-md">
                Peak Season Rate Active
              </span>
            )}
          </div>

          {/* Bottom Inset Caption */}
          <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">{property.name}</h3>
            <p className="text-xs sm:text-sm text-stone-200 font-light">{property.tagline}</p>
            <p className="text-[11px] text-[#C9A45C] font-medium pt-1">📍 {property.locationNote}</p>
          </div>
        </div>

        {/* Right: Property Amenities Strip */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF6EE] border-t lg:border-t-0 lg:border-l border-stone-200">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#704B32] block">
              Property Highlights & Comforts
            </span>
            <ul className="space-y-2.5 text-xs text-[#17233B]">
              {property.propertyAmenities.map((amenity, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#176B68] font-bold text-sm">✓</span>
                  <span className="leading-snug">{amenity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">Starting Tariff</span>
              <span className="font-serif text-2xl font-bold text-[#17233B]">
                ₹{property.rooms[0]?.basePricePerNight.toLocaleString('en-IN')}
                <span className="text-xs text-stone-500 font-sans font-normal"> / night</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-tight">
              Includes farm-fresh breakfast, traditional Samovar kehwa, and complimentary Wi-Fi.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. Interactive Room Selector ────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
            Select Your Suite or Cottage
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            {property.rooms.length} room types available at this property
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {property.rooms.map((room) => {
            const isSelected = room.id === selectedRoomId
            return (
              <div
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`cursor-pointer rounded-2xl p-6 transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#176B68] ring-2 ring-[#176B68]/30 shadow-lg scale-[1.01]'
                    : 'bg-white/80 hover:bg-white border-stone-200 hover:border-stone-300 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {room.type}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      Up to {room.maxGuests} Guests
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-bold text-[#17233B]">{room.name}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{room.description}</p>

                  <div className="text-[11px] text-stone-500 space-y-1 pt-1">
                    <div className="flex items-center gap-1.5">
                      <span>🛏️</span>
                      <span>{room.bedConfig}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>📐</span>
                      <span>{room.sizeSqFt} sq. ft. living area</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase block">Base Tariff</span>
                    <span className="font-bold text-base text-[#17233B]">
                      ₹{room.basePricePerNight.toLocaleString('en-IN')}
                      <span className="text-[11px] font-normal text-stone-500"> / nt</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                      isSelected ? 'bg-[#176B68] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {isSelected ? '✓ Selected' : 'Choose'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 4. Live Date & Tariff Engine Form ─────────────────────────────────────── */}
      <div id="booking-engine" className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10">
        <div className="max-w-3xl mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#704B32] block">
            Step 2: Dates, Guests & Curated Add-ons
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] mt-1">
            Calculate Live Tariff &amp; Reserve
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time seasonal rate engine. No hidden charges. Verified direct hospitality from Nuty Tales.
          </p>
        </div>

        <form onSubmit={handleReservationSubmit} className="space-y-8">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B] mb-1.5">
                Check-in Date
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B] mb-1.5">
                Check-out Date
              </label>
              <input
                type="date"
                required
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B] mb-1.5">
                Guests
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
              >
                <option value={1}>1 Solo Guest</option>
                <option value={2}>2 Adults (Couple / Twin)</option>
                <option value={3}>3 Adults (Family)</option>
                <option value={4}>4 Adults (Suite Quad)</option>
                <option value={6}>5-6 Guests (Multiple Rooms)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B] mb-1.5">
                Selected Suite
              </label>
              <input
                type="text"
                readOnly
                value={selectedRoom.name}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-200 text-xs sm:text-sm text-[#17233B] bg-stone-100 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          {/* Curated Experience Add-Ons */}
          {property.experienceAddOns.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#704B32]">
                Optional Bespoke Experiences &amp; Add-ons:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.experienceAddOns.map((addon) => {
                  const isChecked = selectedAddOns.includes(addon.id)
                  return (
                    <label
                      key={addon.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#176B68]/5 border-[#176B68]'
                          : 'bg-white border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddOn(addon.id)}
                        className="mt-0.5 w-4 h-4 text-[#176B68] rounded focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#17233B]">{addon.title}</span>
                          <span className="text-xs font-bold text-[#176B68]">
                            +₹{addon.pricePerPerson.toLocaleString('en-IN')}/person
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">{addon.desc}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Guest Full Name *</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Rohini Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Mobile *</label>
              <input
                type="tel"
                required
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="rohini@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Pricing Ledger & Submission */}
          <div className="p-6 bg-[#FAF6EE] rounded-2xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 w-full md:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Estimated Tariff Breakdown ({nights} {nights === 1 ? 'Night' : 'Nights'}, {guestsCount} Guests)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold text-[#17233B]">
                  ₹{totalEstimate.toLocaleString('en-IN')}
                </span>
                {isPeakSeason && (
                  <span className="text-xs text-[#704B32] font-semibold bg-amber-100 px-2 py-0.5 rounded">
                    Peak Season Multiplier ({property.seasonalRates.peakSeasonMultiplier}x)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                ₹{nightlyRate.toLocaleString('en-IN')}/nt room tariff
                {addOnsTotal > 0 && ` + ₹${addOnsTotal.toLocaleString('en-IN')} experiences`} · Direct concierge billing
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-md"
              >
                <span>Instant WhatsApp Concierge</span>
                <span>→</span>
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : isReserved ? '✓ Request Submitted' : 'Submit Formal Request'}
              </button>
            </div>
          </div>

          {isReserved && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <span>
                ✓ Your reservation enquiry for {property.name} has been sent! Our hospitality concierge will contact you within 2 hours.
              </span>
              <button
                type="button"
                onClick={() => setIsReserved(false)}
                className="text-emerald-900 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
