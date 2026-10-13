'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WeddingVenue } from '@/lib/weddings/types'
import { getActiveProject, createEnquiry, addBudgetItem, logActivity } from '@/lib/weddings/storage'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function VenueDetailClient({ venue }: { venue: WeddingVenue }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showRfpModal, setShowRfpModal] = useState(false)
  const [rfpSubmitted, setRfpSubmitted] = useState(false)
  const [addedToWorkspace, setAddedToWorkspace] = useState(false)

  // RFP Form State
  const [coupleName, setCoupleName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState(venue.capacityMin)
  const [ceremonyTypes, setCeremonyTypes] = useState('3-Day Multi-Event Royal Celebration')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const formatPrice = (amt: number, curr: string) => {
    if (curr === 'INR') {
      if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`
      if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)} Lakhs`
      return `₹${amt.toLocaleString('en-IN')}`
    }
    return `${curr} ${amt.toLocaleString()}`
  }

  const handleSendRfp = (e: React.FormEvent) => {
    e.preventDefault()
    const activeProject = getActiveProject()

    createEnquiry(activeProject.id, {
      venueId: venue.id,
      venueName: venue.name,
      category: 'venue',
      targetDate: eventDate || activeProject.weddingDate,
      guestCount: Number(guestCount) || venue.capacityMin || 100,
      quoteAmount: venue.priceStarting,
      currency: venue.currency,
      status: 'submitted',
      requirements: `Venue Booking Request: ${ceremonyTypes} for ${guestCount} guests. Phone: ${phone}. Email: ${email}. Notes: ${notes || 'Standard royal wedding setup'}`,
    })

    setRfpSubmitted(true)
  }

  const handleAddToWorkspace = () => {
    const activeProject = getActiveProject()
    addBudgetItem(activeProject.id, {
      category: 'venue',
      title: `${venue.name} — Venue Hire & Hospitality`,
      plannedAmount: venue.priceStarting,
      estimatedCost: venue.priceStarting,
      quotedAmount: venue.priceStarting,
      contractedAmount: venue.priceStarting,
      paidAmount: 0,
      paymentStatus: 'pending',
      vendorName: venue.name,
      notes: `Curated venue in ${venue.destination}. Capacity: ${venue.capacityMin}–${venue.capacityMax} guests.`,
    })
    logActivity(
      activeProject.id,
      'Venue Shortlisted',
      `Added ${venue.name} to project budget & destination plan`
    )
    setAddedToWorkspace(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] pb-24">
      {/* ── Breadcrumb & Top Navigation ────────────────────────────────────── */}
      <div className="border-b border-stone-200 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#8E2848] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/venues" className="hover:text-[#8E2848] transition-colors">
              Venues
            </Link>
            <span>/</span>
            <span className="text-stone-400">{venue.city}</span>
            <span>/</span>
            <span className="text-stone-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {venue.name}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToWorkspace}
              disabled={addedToWorkspace}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all ${
                addedToWorkspace
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              {addedToWorkspace ? '✓ Saved to Workspace' : '+ Save to Project'}
            </button>
            <button
              onClick={() => setShowRfpModal(true)}
              className="text-xs px-4 py-1.5 rounded-xl font-bold uppercase tracking-wider bg-[#8E2848] hover:bg-[#721f39] text-white shadow-xs transition-all"
            >
              Request Quote
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        {/* ── Title, Ratings & Location Header ─────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
              {venue.venueType.toUpperCase()} ESTATE
            </span>
            {venue.verified && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <span>✓ Verified Nuty Tales Venue</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium">
              📍 {venue.destination}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B] tracking-tight">
                {venue.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-stone-600">
                <div className="flex items-center gap-1 font-bold text-[#8E2848]">
                  <span>★</span>
                  <span>{venue.rating}</span>
                </div>
                <span>•</span>
                <span className="underline">{venue.reviewsCount} verified couple &amp; planner reviews</span>
                <span>•</span>
                <span className="text-stone-500">{venue.city}, {venue.country}</span>
              </div>
            </div>

            <div className="text-left md:text-right bg-white p-4 rounded-2xl border border-stone-200 shadow-xs md:bg-transparent md:border-0 md:p-0 md:shadow-none">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block">
                Starting Rate (Exclusive Hire)
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#8E2848]">
                {formatPrice(venue.priceStarting, venue.currency)}
              </span>
              <span className="text-stone-400 text-xs block">+ Taxes &amp; Royal Banqueting</span>
            </div>
          </div>
        </div>

        {/* ── Photo Gallery Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
          {/* Main Large Visual */}
          <div className="md:col-span-3 relative aspect-[16/10] sm:aspect-[16/9] w-full">
            <Image
              src={venue.images[activeImageIndex] || venue.images[0] || '/images/jaipur-heritage.jpg'}
              alt={venue.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Side Thumbnail Stack */}
          <div className="flex md:flex-col gap-3 p-3 overflow-x-auto md:overflow-visible">
            {venue.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] w-28 md:w-full rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-[#8E2848] scale-102 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${venue.name} photo ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Key Operational Specs Bar ────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <div className="space-y-1 border-r border-stone-100 last:border-0 pr-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Guest Capacity
            </span>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              {venue.capacityMin} – {venue.capacityMax}
            </p>
            <span className="text-stone-500 text-xs">Comfortable banqueting</span>
          </div>

          <div className="space-y-1 border-r border-stone-100 last:border-0 pr-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Accommodation Block
            </span>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              {venue.accommodationRooms} Suites
            </p>
            <span className="text-stone-500 text-xs">For family &amp; key guests</span>
          </div>

          <div className="space-y-1 border-r border-stone-100 last:border-0 pr-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Ceremony Setting
            </span>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#17233B] capitalize">
              {venue.indoorOutdoor}
            </p>
            <span className="text-stone-500 text-xs">Lawns, pavilions &amp; halls</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Sound Curfew Policy
            </span>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#8E2848]">
              Late License
            </p>
            <span className="text-stone-500 text-xs">Approved acoustic zoning</span>
          </div>
        </div>

        {/* ── Main Content Grid: Overview & Specs vs Sidebar RFP ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Estate Description */}
            <section className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                About the Estate
              </h2>
              <p className="text-stone-600 leading-relaxed font-light text-base">
                {venue.description}
              </p>
              <div className="pt-4 border-t border-stone-100 flex items-center gap-3 text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Recommended For:</span>
                <span>Multi-day Indian Weddings</span>
                <span>•</span>
                <span>Intimate Luxury Destination Celebrations</span>
                <span>•</span>
                <span>Grand Evening Pheras</span>
              </div>
            </section>

            {/* Curated Amenities & Facilities */}
            <section className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Curated Amenities &amp; Production Infrastructure
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {venue.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF7F2] border border-stone-200/60"
                  >
                    <span className="text-[#C9A45C] font-bold text-lg leading-none">✦</span>
                    <span className="text-stone-800 text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Catering & Banqueting Policies */}
            <section className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Catering &amp; Culinary Governance
              </h2>
              <div className="p-5 rounded-2xl bg-[#2D1520]/5 border border-[#8E2848]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8E2848]">
                  <span>🍽 Culinary Master Class</span>
                </div>
                <p className="text-stone-800 text-sm font-medium">
                  {venue.cateringPolicy}
                </p>
                <p className="text-stone-500 text-xs">
                  Outside luxury specialist caterers, Kashmiri wazwan woodfire artisans, and Jain gourmet master kitchens accommodated with prior management authorization.
                </p>
              </div>
            </section>
          </div>

          {/* ── Sidebar: Direct Booking & Concierge Desk ─────────────────── */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-6 sticky top-24">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
                  Direct Inquiries &amp; Dates
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B] mt-1">
                  Check Estate Availability
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Guaranteed direct-to-estate rates with zero booking surcharges.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Starting Package:</span>
                  <strong className="text-stone-800 font-semibold">{formatPrice(venue.priceStarting, venue.currency)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Guest Rooms Included:</span>
                  <strong className="text-stone-800 font-semibold">{venue.accommodationRooms} Suites</strong>
                </div>
                <div className="flex justify-between">
                  <span>Max Capacity:</span>
                  <strong className="text-stone-800 font-semibold">{venue.capacityMax} Guests</strong>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowRfpModal(true)}
                  className="w-full py-3.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all text-center block"
                >
                  Send Official RFP / Inquire
                </button>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales Weddings Concierge! We are inquiring about dates and royal packages for ${venue.name} in ${venue.destination}. Please share availability.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#2D1520] hover:bg-[#3D1E2C] text-[#C9A45C] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>💬 Instant WhatsApp Concierge</span>
                </a>

                <button
                  onClick={handleAddToWorkspace}
                  disabled={addedToWorkspace}
                  className={`w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    addedToWorkspace
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                  }`}
                >
                  {addedToWorkspace ? '✓ Saved in My Wedding Project' : '+ Add Venue to Workspace'}
                </button>
              </div>

              <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 space-y-1">
                <p>• Verified contracts &amp; escrow payment milestones</p>
                <p>• On-site production walkthrough support</p>
                <p>• Complimentary wedding trousseau tasting gift</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive RFP Modal ────────────────────────────────────────── */}
      {showRfpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
                  Official Request For Proposal
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  {venue.name}
                </h3>
                <p className="text-xs text-stone-500">{venue.destination}</p>
              </div>
              <button
                onClick={() => {
                  setShowRfpModal(false)
                  setRfpSubmitted(false)
                }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {rfpSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl font-bold">
                  ✓
                </div>
                <h4 className="font-serif text-xl font-bold text-stone-800">
                  Proposal Request Dispatched!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your wedding requirements have been logged in your workspace and dispatched to the estate management desk. A formal quotation will be delivered within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setShowRfpModal(false)
                    setRfpSubmitted(false)
                  }}
                  className="px-6 py-2.5 bg-[#8E2848] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#721f39]"
                >
                  Return to Venue
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendRfp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Couple / Family Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram & Ananya"
                      value={coupleName}
                      onChange={(e) => setCoupleName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Preferred Wedding Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Estimated Guest Count
                    </label>
                    <input
                      type="number"
                      min={venue.capacityMin}
                      max={venue.capacityMax}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Ceremony Type / Scope
                    </label>
                    <select
                      value={ceremonyTypes}
                      onChange={(e) => setCeremonyTypes(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    >
                      <option value="3-Day Multi-Event Royal Celebration">3-Day Multi-Event Celebration</option>
                      <option value="2-Day Sangeet & Pheras">2-Day Sangeet &amp; Pheras</option>
                      <option value="Single Day Grand Wedding & Reception">Single Day Wedding &amp; Reception</option>
                      <option value="Intimate Destination Wedding (<100 Guests)">Intimate Destination (&lt;100 Guests)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      WhatsApp Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="couple@weddings.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Specific Requests / Catering &amp; Decor Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need 45 rooms blocked for family, woodfire Wazwan catering station, and late night pool afterparty permissions."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRfpModal(false)}
                    className="px-4 py-2.5 text-stone-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                  >
                    Submit RFP
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
