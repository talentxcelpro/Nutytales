'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function StaysGroupQuotePage() {
  const [propertyChoice, setPropertyChoice] = useState('Harwan Orchard Estate (Srinagar, Kashmir)')
  const [groupType, setGroupType] = useState('Corporate Executive Retreat')
  const [checkIn, setCheckIn] = useState('2026-10-25')
  const [nights, setNights] = useState<number>(3)
  const [guestsCount, setGuestsCount] = useState<number>(14)
  const [contactName, setContactName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [addOnExperiences, setAddOnExperiences] = useState<string[]>([
    'Private Chef Multi-Course Wazwan Dinner',
    'Chauffeur-Driven 4x4 Airport Convoy (Srinagar to Harwan)',
    'Sunrise Shikara Lake Ride with Morning Kahwa',
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quoteRef, setQuoteRef] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const toggleAddOn = (item: string) => {
    setAddOnExperiences((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    )
  }

  // Estimated Pricing
  const estateNightlyBase = 45000 // 4-acre private estate buyout per night
  const lodgingTotal = estateNightlyBase * nights
  const cateringPerPersonDay = 2500
  const cateringTotal = cateringPerPersonDay * guestsCount * nights
  const convoyTotal = 18000
  const grandEstimate = lodgingTotal + cateringTotal + convoyTotal

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
          vertical: 'stays',
          customerName: contactName,
          companyName: companyName,
          customerPhone: phone,
          customerEmail: email,
          deliveryCity: propertyChoice,
          targetBudget: grandEstimate,
          currency: 'INR',
          notes: `Group Type: ${groupType} | Check-in: ${checkIn} (${nights} nights) | Guests: ${guestsCount} | Add-ons: ${addOnExperiences.join(
            ', ',
          )} | Estimated Buyout: ₹${grandEstimate.toLocaleString('en-IN')}`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setQuoteRef(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to submit group buyout request.')
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
          <span>🏔️ NUTY TALES STAYS — PRIVATE BUYOUT DESK</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Private Orchard Buyouts, Delegations &amp; Corporate Retreats
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          &quot;Book the stay and everything around it.&quot; Complete exclusive buyout of our 4-acre Harwan walnut estate or Noida executive suites. Includes dedicated private culinary masters, heated bukharis, 4x4 airport convoys, and curated valley experiences.
        </p>
      </div>

      {quoteRef ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#176B68] text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Estate Buyout Request Received!
          </h2>
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-xl font-mono text-sm font-bold text-emerald-900 border border-emerald-300">
            Reservation Ref: {quoteRef}
          </div>
          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            Our Senior Hospitality Concierge has blocked preliminary dates for your group of {guestsCount} guests. A tailored itinerary, chef banquet menu, and vehicle allocation document has been sent to your email.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/stays/dashboard"
              className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              View in Stays Dashboard →
            </Link>
            <button
              onClick={() => setQuoteRef(null)}
              className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Configure Another Stay
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Configuration Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>🏰</span> Estate Buyout &amp; Delegation Parameters
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">Select Property Estate *</label>
                  <select
                    value={propertyChoice}
                    onChange={(e) => setPropertyChoice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium text-[#17233B]"
                  >
                    <option value="Harwan Orchard Estate (Srinagar, Kashmir)">Harwan Walnut Orchard Estate (Srinagar, Kashmir · 4 Acres Private)</option>
                    <option value="Noida Sector 63 Corporate Residence (Delhi NCR)">Noida Executive Residence &amp; Suites (Delhi NCR · 12 Suites)</option>
                    <option value="Patna Heritage Mithila Villa (Bihar)">Patna Heritage Mithila Villa (Bihar · Central City Courtyard)</option>
                    <option value="Dal Lake Royal Cedar Houseboat Flotilla">Dal Lake Luxury Cedar Houseboat Flotilla (Nagreed Lake)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Group Nature</label>
                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Corporate Executive Retreat">Corporate Executive Retreat / Offsite</option>
                    <option value="VIP High-Level Delegation">VIP High-Level Delegation</option>
                    <option value="Destination Wedding Family Buyout">Destination Wedding Family Buyout</option>
                    <option value="Private Family Reunion">Private Family Reunion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Check-in Date *</label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Duration of Stay (Nights)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Number of Guests</label>
                  <input
                    type="number"
                    min="2"
                    max="60"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Organizer / Lead Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. McKinsey & Company"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="concierge@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                  />
                </div>
              </div>

              {/* Add-on Experiences */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-stone-700">
                  Concierge Experiences &amp; Logistics Add-ons:
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    'Private Chef Multi-Course Wazwan Dinner',
                    'Chauffeur-Driven 4x4 Airport Convoy (Srinagar to Harwan)',
                    'Sunrise Shikara Lake Ride with Morning Kahwa',
                    'High-Altitude Alpine Meadow Excursion (Gulmarg Gondola Pass)',
                    'Private Walnut Orchard Harvesting Walk',
                  ].map((exp) => (
                    <label
                      key={exp}
                      className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={addOnExperiences.includes(exp)}
                        onChange={() => toggleAddOn(exp)}
                        className="accent-[#176B68] w-4 h-4"
                      />
                      <span className="font-medium text-stone-800">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Reserving Buyout Window...' : '⚡ Request Formal Buyout Proposal & Date Hold →'}
              </button>
            </form>
          </div>

          {/* Right Live Estimate Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#10192A] text-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/30 shadow-lg space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C] block">
                  Estimated Transparent Tariff
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  Exclusive Estate Buyout
                </h3>
                <p className="text-xs text-stone-300 font-light mt-1">
                  {nights} Nights · {guestsCount} Guests · Entire property exclusive access with zero outside guests.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-300">Private Lodging ({nights} Nts):</span>
                  <span className="font-bold text-white">₹{lodgingTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-300">Chef &amp; F&amp;B Banquets:</span>
                  <span className="font-bold text-white">₹{cateringTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-300">4x4 Convoy &amp; Chauffeurs:</span>
                  <span className="font-bold text-white">₹{convoyTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-xs uppercase font-bold text-[#C9A45C]">Total Estimate:</span>
                  <span className="font-serif text-2xl font-extrabold text-[#C9A45C]">
                    ₹{grandEstimate.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-300 font-light">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>100% Private 4-Acre Grounds &amp; Living Rooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Dedicated Butler, Sommelier &amp; Executive Chef</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>High-Speed Starlink/Fiber Wi-Fi for Offsites</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Official Corporate GST Invoice with ITC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
