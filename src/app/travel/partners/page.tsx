'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function TravelPartnersPage() {
  const [partnerType, setPartnerType] = useState('Destination Management Company (DMC)')
  const [companyName, setCompanyName] = useState('')
  const [operatorName, setOperatorName] = useState('')
  const [city, setCity] = useState('Srinagar / Kashmir')
  const [fleetSize, setFleetSize] = useState<number>(8)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [partnerRef, setPartnerRef] = useState<string | null>(null)
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
          vertical: 'travel',
          customerName: operatorName,
          companyName: companyName,
          customerPhone: phone,
          customerEmail: email,
          deliveryCity: city,
          targetBudget: 500000,
          currency: 'INR',
          notes: `[TRAVEL PARTNER ONBOARDING] Type: ${partnerType} | Company: ${companyName} | Fleet Size: ${fleetSize} vehicles | License: ${licenseNumber}`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setPartnerRef(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to submit partner application.')
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
          <span>✈️ NUTTY TALES TRAVEL — DMC &amp; OPERATOR PARTNER NETWORK</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Join the Nutty Tales Global Travel Partner Ecosystem
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Are you a licensed Destination Management Company (DMC), mountain ski guide, adventure outfitter, or luxury fleet operator? Partner with Nutty Tales Travel to receive verified international group bookings and high-intent itineraries.
        </p>
      </div>

      {partnerRef ? (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#0E3A43] text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Partner Application Received!
          </h2>
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-xl font-mono text-sm font-bold text-emerald-900 border border-emerald-300">
            DMC Partner ID: {partnerRef}
          </div>
          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            Our Global Corridors Director has received credentials for {companyName}. Our supplier verification desk will contact you to inspect vehicle fitness and verify safety insurance policies within 24 hours.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/travel/dashboard"
              className="px-6 py-3 bg-[#17233B] hover:bg-[#0E3A43] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Open Travel Dashboard →
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
            <span>🛡️</span> Operator Verification Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Company / Agency Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Alpine Kashmir Expeditions"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Business Role</label>
              <select
                value={partnerType}
                onChange={(e) => setPartnerType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium"
              >
                <option value="Destination Management Company (DMC)">Destination Management Company (DMC)</option>
                <option value="Luxury Chauffeur Fleet Operator">Luxury Chauffeur Fleet Operator</option>
                <option value="Licensed Ski & Adventure Guide">Licensed Ski &amp; Adventure Guide</option>
                <option value="Helicopter & Aviation Transfer">Helicopter &amp; Aviation Transfer</option>
                <option value="Houseboat & Floating Experience">Houseboat &amp; Floating Experience</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Operating Corridor *</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Srinagar, Gulmarg, Leh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Number of Vehicles in Fleet</label>
              <input
                type="number"
                min="1"
                max="200"
                value={fleetSize}
                onChange={(e) => setFleetSize(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Tourism Dept / DOT License # *</label>
              <input
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. JK-TOUR-2026-881"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Managing Director / Lead *</label>
              <input
                type="text"
                required
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
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
                placeholder="+91..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@dmc.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#0E3A43] focus:outline-none"
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
            className="w-full py-3.5 bg-[#17233B] hover:bg-[#0E3A43] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'Registering DMC...' : '⚡ Register as Verified Nutty Tales Travel Partner →'}
          </button>
        </form>
      )}
    </div>
  )
}
