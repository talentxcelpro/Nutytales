'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function StaysHostPortalPage() {
  const [propertyName, setPropertyName] = useState('')
  const [propertyType, setPropertyType] = useState('Boutique Orchard Villa')
  const [city, setCity] = useState('Srinagar (Kashmir)')
  const [roomsCount, setRoomsCount] = useState<number>(6)
  const [baseTariff, setBaseTariff] = useState<number>(8500)
  const [peakMultiplier, setPeakMultiplier] = useState<number>(1.4)
  const [ownerName, setOwnerName] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [amenities, setAmenities] = useState<string[]>([
    'Heated Wood Bukharis',
    'High-Speed Wi-Fi',
    'Orchard View Balconies',
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hostRef, setHostRef] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
          customerName: ownerName,
          companyName: propertyName,
          customerPhone: ownerPhone,
          customerEmail: ownerEmail,
          deliveryCity: city,
          targetBudget: baseTariff * roomsCount * 30,
          currency: 'INR',
          notes: `[HOST ONBOARDING] Property: ${propertyName} (${propertyType}) | City: ${city} | Rooms: ${roomsCount} | Base Tariff: ₹${baseTariff}/nt | Peak Multiplier: ${peakMultiplier}x | Amenities: ${amenities.join(
            ', ',
          )}`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setHostRef(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to submit property application.')
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
          <span>🏔️ NUTTY TALES STAYS — HOST &amp; PROPERTY PARTNER PORTAL</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          List Your Boutique Property on Nutty Tales Stays
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Join our curated global hospitality network. We connect verified orchard villas, mountain retreats, and heritage suites to discerning travelers, corporate offsite leaders, and destination wedding parties.
        </p>
      </div>

      {hostRef ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#176B68] text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Property Application Submitted!
          </h2>
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-xl font-mono text-sm font-bold text-emerald-900 border border-emerald-300">
            Host Ref: {hostRef}
          </div>
          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            Our Regional Hospitality Inspector has logged {propertyName}. A property audit team will schedule an on-site photoshoot and verification visit within 48 hours.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/stays/dashboard"
              className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              View in Stays Dashboard →
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
            <span>🏡</span> Property Onboarding Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Property Name *</label>
              <input
                type="text"
                required
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Cedar Pines Orchard Retreat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Property Category</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium"
              >
                <option value="Boutique Orchard Villa">Boutique Orchard Villa</option>
                <option value="Heritage Hotel / Haveli">Heritage Hotel / Haveli</option>
                <option value="Luxury Houseboat">Luxury Lake Houseboat</option>
                <option value="Mountain Ski Resort">Mountain Ski Resort / Chalet</option>
                <option value="Urban Serviced Residence">Urban Serviced Residence</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Location / Valley *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Harwan, Srinagar (J&K)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Number of Guest Rooms</label>
              <input
                type="number"
                min="1"
                max="200"
                value={roomsCount}
                onChange={(e) => setRoomsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Base Room Tariff (₹ / Night)</label>
              <input
                type="number"
                min="1000"
                value={baseTariff}
                onChange={(e) => setBaseTariff(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-[#176B68]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Peak Season Multiplier</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={peakMultiplier}
                onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Owner / GM Name *</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Mobile *</label>
              <input
                type="tel"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder="+91..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="gm@hotel.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
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
            className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Registering Property...' : '⚡ Apply to List on Nutty Tales Stays →'}
          </button>
        </form>
      )}
    </div>
  )
}
