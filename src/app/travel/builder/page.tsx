'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function TravelBuilderPage() {
  const [destination, setDestination] = useState('Kashmir (Srinagar, Gulmarg, Pahalgam)')
  const [daysCount, setDaysCount] = useState<number>(6)
  const [groupType, setGroupType] = useState('Family with Children')
  const [travelersCount, setTravelersCount] = useState<number>(4)
  const [travelDate, setTravelDate] = useState('2026-11-10')
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'active'>('balanced')
  const [stayCategory, setStayCategory] = useState<'boutique' | 'luxury-resort' | 'heritage-houseboat'>('luxury-resort')
  const [vehicle, setVehicle] = useState<'4x4-fortuner' | 'innova-crysta' | 'tempo-luxury'>('innova-crysta')

  // Contact
  const [travelerName, setTravelerName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tripRef, setTripRef] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Estimated Pricing
  const perPersonPerDay = stayCategory === 'luxury-resort' ? 8500 : 6200
  const vehicleCost = daysCount * (vehicle === '4x4-fortuner' ? 6500 : 4500)
  const experiencesEstimate = travelersCount * 5000
  const grandEstimate = perPersonPerDay * travelersCount * daysCount + vehicleCost + experiencesEstimate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_inquiry',
          vertical: 'travel',
          customerName: travelerName,
          companyName: `Trip for ${travelerName} (${groupType})`,
          customerPhone: phone,
          customerEmail: email,
          deliveryCity: destination,
          targetBudget: grandEstimate,
          currency: 'INR',
          notes: `Destination: ${destination} | ${daysCount} Days | Date: ${travelDate} | Travelers: ${travelersCount} | Pace: ${pace} | Stay: ${stayCategory} | Vehicle: ${vehicle} | Estimate: ₹${grandEstimate.toLocaleString(
            'en-IN',
          )}`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setTripRef(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to submit itinerary.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Breadcrumb & Header ───────────────────────────────────────────────── */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>✈️ NUTTY TALES TRAVEL — SI TRIP PLANNER &amp; BUILDER</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Build Your Bespoke Itinerary &amp; Private Expedition
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          &quot;Don&apos;t just book a trip. Build the trip.&quot; Tailor your days across Srinagar Dal Lake houseboats, Gulmarg powder snow ski slopes, and Pahalgam pine forests. Real-time vehicle pairing, licensed mountain guides, and concierge billing.
        </p>
      </div>

      {tripRef ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#0E3A43] text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Itinerary Blueprint Created Successfully!
          </h2>
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-xl font-mono text-sm font-bold text-emerald-900 border border-emerald-300">
            Trip Reference: {tripRef}
          </div>
          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            Your {daysCount}-day itinerary for {travelersCount} travelers in {destination} has been structured. Our Lead Mountain Concierge has assigned a verified chauffeur fleet and will contact you via WhatsApp with day-by-day flight &amp; hotel vouchers.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/travel/dashboard"
              className="px-6 py-3 bg-[#17233B] hover:bg-[#0E3A43] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              View in Travel Dashboard →
            </Link>
            <button
              onClick={() => setTripRef(null)}
              className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Build Another Itinerary
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── 1. Trip Configuration Parameters ──────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>1.</span> Destination, Dates &amp; Traveler Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Destination Corridor *</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium text-[#17233B]"
                >
                  <option value="Kashmir (Srinagar, Gulmarg, Pahalgam)">Kashmir Classic (Srinagar · Gulmarg · Pahalgam · Sonamarg)</option>
                  <option value="Leh-Ladakh High Altitude Passes">Leh-Ladakh High Altitude (Pangong · Nubra Valley · Khardung La)</option>
                  <option value="Dubai & Desert Corridors">Dubai &amp; Desert Corridors (Burj · Palm Jumeirah · Dune Safari)</option>
                  <option value="London & Scottish Highlands">London &amp; Scottish Highlands Heritage Corridor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Departure Date *</label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Trip Duration (Days)</label>
                <input
                  type="number"
                  min="3"
                  max="21"
                  value={daysCount}
                  onChange={(e) => setDaysCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Group Nature</label>
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="Family with Children">Family with Children / Elders</option>
                  <option value="Honeymoon & Couples">Honeymoon &amp; Couples</option>
                  <option value="Adventure Friends Group">Adventure Friends Group</option>
                  <option value="Corporate Offsite Delegation">Corporate Offsite Delegation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Total Travelers</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Travel Pace</label>
                <select
                  value={pace}
                  onChange={(e) => setPace(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="relaxed">Relaxed (Late mornings, leisure)</option>
                  <option value="balanced">Balanced (Highlights + free time)</option>
                  <option value="active">Active (Full-day treks &amp; safaris)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Lodging Standard</label>
                <select
                  value={stayCategory}
                  onChange={(e) => setStayCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="luxury-resort">5-Star Luxury Resort (Khyber / Taj)</option>
                  <option value="boutique">Boutique Orchard Villa / Suite</option>
                  <option value="heritage-houseboat">Luxury Cedar Lake Houseboat</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── 2. Dedicated Fleet Vehicle & Contact ──────────────────────────── */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>2.</span> Dedicated Chauffeur Vehicle &amp; Traveler Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Assigned Private Fleet</label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-bold text-[#17233B]"
                >
                  <option value="innova-crysta">Toyota Innova Crysta (Air-conditioned)</option>
                  <option value="4x4-fortuner">Toyota Fortuner 4x4 (Snow chains &amp; terrain)</option>
                  <option value="tempo-luxury">Mercedes / Force Urbania (Luxury 12-seater)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Lead Traveler Name *</label>
                <input
                  type="text"
                  required
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="traveler@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── 3. Live Generated Day-by-Day Itinerary Preview ─────────────────── */}
          <div className="bg-[#FAF6EE] rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">
                  3. SI Generated Day-by-Day Route Simulation ({daysCount} Days)
                </h3>
                <p className="text-xs text-stone-500">
                  Adaptive plan balancing mountain passes, scenic stops, and curated regional dining.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-[#0E3A43] text-white rounded-full">
                AI Structured
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] block">
                  Day 1 · Arrival in Srinagar &amp; Dal Lake Shikara Sunset
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Private chauffeur airport reception with saffron kahwa welcome. Check-in to Harwan Orchard Villa or Lake Houseboat. Evening sunset shikara ride across floating vegetable gardens and Char Chinar.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] block">
                  Day 2 · Gulmarg Alpine Meadow &amp; Gondola Phase 2
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Morning drive to Gulmarg via scenic pine highway. Pre-booked VIP Gondola pass ascending to Apharwat Peak (13,780 ft). Professional ski guide instruction and warm mountain lunch at highland cafe.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] block">
                  Day 3 · Pahalgam Valley of Shepherds &amp; Betaab Valley
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Drive through Pampore saffron fields and Awantipora ruins. Arrive in Pahalgam along the Lidder River. Private pony trail into Aru Valley and picnic lunch by the alpine stream.
                </p>
              </div>

              {daysCount > 3 && (
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A45C] block">
                    Day 4 to {daysCount} · Sonamarg Glacier Safari &amp; Heritage Craft Guilds
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Excursion to Thajiwas Glacier. Visit registered Zadibal Pashmina weavers and Charar-i-Sharief woodcraft artisans. Farewell Wazwan feast prepared by master Wazas.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── 4. Ledger & Submission ────────────────────────────────────────── */}
          <div className="bg-[#10192A] text-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                Estimated Landed Package Price
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#C9A45C]">
                  ₹{grandEstimate.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-400">Total for {travelersCount} Travelers ({daysCount} Days)</span>
              </div>
              <p className="text-xs text-stone-300 font-light">
                Includes verified stays, dedicated private vehicle, fuel, driver allowances, toll permits, and concierge support.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap"
            >
              {isSubmitting ? 'Structuring Itinerary...' : '⚡ Confirm Itinerary & Lock Dates →'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
