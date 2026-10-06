'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { KASHMIR_TRAVEL_PACKAGES, TravelPackage } from '@/lib/travel-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function KashmirTourCustomizer() {
  const [selectedPkgId, setSelectedPkgId] = useState<string>(KASHMIR_TRAVEL_PACKAGES[0].id)
  const currentPkg = useMemo(
    () => KASHMIR_TRAVEL_PACKAGES.find((p) => p.id === selectedPkgId) || KASHMIR_TRAVEL_PACKAGES[0],
    [selectedPkgId]
  )

  // Customization state
  const [travelersCount, setTravelersCount] = useState<number>(2)
  const [vehicleTier, setVehicleTier] = useState<'standard' | '4x4_snow' | 'innova'>('4x4_snow')
  const [roomTier, setRoomTier] = useState<'deluxe' | 'private_cottage'>('deluxe')
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['gondola_pass'])

  // Traveler contact details
  const [travelerName, setTravelerName] = useState('')
  const [travelerPhone, setTravelerPhone] = useState('')
  const [travelerEmail, setTravelerEmail] = useState('')
  const [travelDate, setTravelDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Pricing add-ons
  const vehicleSurcharges = {
    standard: 0,
    '4x4_snow': 3500 * currentPkg.days,
    innova: 2500 * currentPkg.days,
  }

  const roomSurcharges = {
    deluxe: 0,
    private_cottage: 4000 * currentPkg.nights,
  }

  const availableAddons = [
    { id: 'gondola_pass', title: 'Gulmarg Gondola Phase 2 High Peak Pass', price: 1850 },
    { id: 'wazwan_banquet', title: 'Private 7-Course Wazwan Feast with Chef', price: 1800 },
    { id: 'artisan_masterclass', title: 'Downtown Shehr-e-Khaas Loom & Wood Masterclass', price: 1200 },
    { id: 'dachigam_safari', title: 'Dachigam Hangul Deer Wildlife Guided Trail', price: 1500 },
  ]

  const addonsTotal = useMemo(() => {
    return selectedAddons.reduce((acc, id) => {
      const match = availableAddons.find((a) => a.id === id)
      return acc + (match ? match.price * travelersCount : 0)
    }, 0)
  }, [selectedAddons, travelersCount])

  // Total tour estimate
  const basePriceTotal = currentPkg.basePricePerAdult * travelersCount
  const vehicleUpgrade = vehicleSurcharges[vehicleTier]
  const roomUpgrade = roomSurcharges[roomTier]
  const totalTourEstimate = basePriceTotal + vehicleUpgrade + roomUpgrade + addonsTotal
  const perPersonEstimate = Math.round(totalTourEstimate / (travelersCount || 1))

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCustomTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const addonsList = selectedAddons
      .map((id) => availableAddons.find((a) => a.id === id)?.title)
      .join(', ')

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: travelerName || 'Traveler',
          phone: travelerPhone,
          email: travelerEmail,
          city: 'Kashmir Tour Plan',
          businessName: `[TOUR] ${currentPkg.title}`,
          message: `Package: ${currentPkg.title} (${currentPkg.duration}) | Travel Date: ${travelDate || 'TBD'} | Travelers: ${travelersCount} | Vehicle: ${vehicleTier} | Stay: ${roomTier} | Add-ons: ${addonsList || 'None'} | Total: ₹${totalTourEstimate.toLocaleString('en-IN')}`,
          source: 'kashmir-tour-engine',
        }),
      })
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false)
      setIsSuccess(true)
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nutty Tales Kashmir Travel! 🏔️\n\nI want to customize *${currentPkg.title}* (${currentPkg.duration}):\n• Dates: ${travelDate || 'Flexible'}\n• Travelers: ${travelersCount} Adults\n• Vehicle: ${vehicleTier.replace('_', ' ').toUpperCase()}\n• Stay Tier: ${roomTier.replace('_', ' ').toUpperCase()}\n• Add-ons: ${selectedAddons.join(', ') || 'Standard'}\n• Estimated Total: ₹${totalTourEstimate.toLocaleString('en-IN')}\n\nPlease share the detailed customized itinerary and booking details!`,
  )}`

  return (
    <div className="space-y-12">
      {/* ── 1. Package Switcher Cards ────────────────────────────────────────────── */}
      <div>
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C9A45C] block">
            Curated Kashmir Journeys
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#17233B]">
            Select Your Preferred Itinerary
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Each package is operated directly with private sanitized vehicles and stays at Nutty Tales Orchard Retreat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {KASHMIR_TRAVEL_PACKAGES.map((pkg) => {
            const isSelected = pkg.id === selectedPkgId
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkgId(pkg.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#17233B] text-white border-[#C9A45C] ring-2 ring-[#C9A45C]/40 shadow-xl scale-[1.02]'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-[#17233B] shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className={isSelected ? 'text-[#C9A45C]' : 'text-[#176B68]'}>
                      {pkg.duration}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10">
                      {pkg.bestSeason.split(' ')[0]}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold leading-snug">{pkg.title}</h3>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                    {pkg.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase block opacity-70">From</span>
                    <span className="font-bold text-sm">
                      ₹{pkg.basePricePerAdult.toLocaleString('en-IN')}
                      <span className="text-[10px] font-normal opacity-70"> / person</span>
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isSelected ? 'bg-[#C9A45C] text-[#17233B]' : 'bg-stone-100 text-stone-700'}`}>
                    {isSelected ? 'Selected' : 'View'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 2. Active Package Detail & Day-by-Day Itinerary ────────────────────────── */}
      <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Package Highlight Banner */}
        <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-[500px] bg-stone-900">
          <Image
            src={currentPkg.featuredImage}
            alt={currentPkg.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

          <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            <span className="px-3 py-1 rounded-full bg-[#17233B]/90 text-[#C9A45C] text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/20">
              {currentPkg.duration}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-900/90 text-emerald-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
              Private Tour
            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
            <h3 className="font-serif text-2xl font-bold">{currentPkg.title}</h3>
            <p className="text-xs text-stone-200 leading-relaxed">{currentPkg.tagline}</p>
            <div className="pt-2 border-t border-white/20 text-[11px] text-[#C9A45C]">
              Season: {currentPkg.bestSeason}
            </div>
          </div>
        </div>

        {/* Right: Day-by-Day Progression & Inclusions */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF6EE] overflow-y-auto max-h-[560px]">
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#704B32] block mb-3">
                Curated Day-by-Day Itinerary
              </span>
              <div className="space-y-3">
                {currentPkg.itinerary.map((day) => (
                  <div key={day.day} className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#17233B]">
                      <span>Day 0{day.day}: {day.title}</span>
                      <span className="text-[10px] text-[#176B68] font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        {day.stay}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">{day.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions List */}
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#17233B] block">
                Package Inclusions
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                {currentPkg.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Dynamic Tour Customizer & Price Calculator Form ─────────────────────── */}
      <div id="tour-customizer" className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10">
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase font-bold tracking-widest text-[#704B32] block">
            Customize Vehicle, Stay & Add-ons
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] mt-1">
            Build Your Private Kashmir Itinerary
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time price recalculation as you toggle vehicle options, room upgrades, and mountain passes.
          </p>
        </div>

        <form onSubmit={handleCustomTourSubmit} className="space-y-8">
          {/* Customizer Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Number of Travelers */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B] mb-2">
                Number of Adults
              </label>
              <select
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
              >
                <option value={1}>1 Traveler (Solo Supplement)</option>
                <option value={2}>2 Adults (Couple / Twin)</option>
                <option value={3}>3 Adults (Small Family)</option>
                <option value={4}>4 Adults (Family / Group)</option>
                <option value={6}>6 Adults (Private Group)</option>
              </select>
            </div>

            {/* Vehicle Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B] mb-2">
                Vehicle Selection
              </label>
              <select
                value={vehicleTier}
                onChange={(e) => setVehicleTier(e.target.value as any)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
              >
                <option value="4x4_snow">4x4 Snow SUV (Recommended for Gulmarg)</option>
                <option value="innova">Toyota Innova Crysta (+₹2,500/day)</option>
                <option value="standard">Standard Private Sedan (Included)</option>
              </select>
            </div>

            {/* Accommodation Tier */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B] mb-2">
                Orchard Stay Category
              </label>
              <select
                value={roomTier}
                onChange={(e) => setRoomTier(e.target.value as any)}
                className="w-full px-3.5 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
              >
                <option value="deluxe">Deluxe Heritage Suite (Included)</option>
                <option value="private_cottage">Private Stand-Alone Cedar Cottage (+₹4,000/nt)</option>
              </select>
            </div>
          </div>

          {/* Add-on Experiences Checkboxes */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#704B32]">
              Optional Curated Experiences:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableAddons.map((addon) => {
                const isChecked = selectedAddons.includes(addon.id)
                return (
                  <label
                    key={addon.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-[#176B68]/5 border-[#176B68]'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleAddon(addon.id)}
                        className="w-4 h-4 text-[#176B68] rounded focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-[#17233B]">{addon.title}</span>
                    </div>
                    <span className="text-xs font-bold text-[#176B68] whitespace-nowrap">
                      +₹{addon.price.toLocaleString('en-IN')}/p
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Expected Travel Date</label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Lead Traveler Name *</label>
              <input
                type="text"
                required
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                placeholder="e.g. Aditi Rao"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={travelerPhone}
                onChange={(e) => setTravelerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={travelerEmail}
                onChange={(e) => setTravelerEmail(e.target.value)}
                placeholder="aditi@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Pricing Ledger & Actions */}
          <div className="p-6 bg-[#FAF6EE] rounded-2xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 w-full md:w-auto">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                Estimated Tour Cost ({travelersCount} Travelers · {currentPkg.duration})
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold text-[#17233B]">
                  ₹{totalTourEstimate.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-600 font-medium">
                  (₹{perPersonEstimate.toLocaleString('en-IN')} / adult)
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Inclusive of private vehicle, orchard villa stay, breakfast &amp; kehwa, transfers, and selected passes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 shadow-md"
              >
                <span>Chat with Tour Planner</span>
                <span>→</span>
              </a>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : isSuccess ? '✓ Quote Requested' : 'Request Official Itinerary'}
              </button>
            </div>
          </div>

          {isSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <span>
                ✓ Your customized tour request for {currentPkg.title} has been received! Our tour concierge will contact you within 2 hours.
              </span>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
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
