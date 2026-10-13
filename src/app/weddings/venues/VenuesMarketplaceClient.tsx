'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { INITIAL_VENUES } from '@/lib/weddings/data'
import { WeddingVenue, VenueType } from '@/lib/weddings/types'
import { getActiveProject, addBudgetItem } from '@/lib/weddings/storage'

export default function VenuesMarketplaceClient() {
  const [selectedDestination, setSelectedDestination] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all')
  const [selectedSetting, setSelectedSetting] = useState<string>('all')
  const [comparisonList, setComparisonList] = useState<WeddingVenue[]>([])
  const [activeModalVenue, setActiveModalVenue] = useState<WeddingVenue | null>(null)
  const [inquirySent, setInquirySent] = useState(false)
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [inquiryName, setInquiryName] = useState('')

  // Filter venues
  const filteredVenues = INITIAL_VENUES.filter((v) => {
    if (selectedDestination !== 'all' && !v.destination.toLowerCase().includes(selectedDestination.toLowerCase())) {
      return false
    }
    if (selectedType !== 'all' && v.venueType !== selectedType) {
      return false
    }
    if (selectedSetting !== 'all' && v.indoorOutdoor !== selectedSetting && v.indoorOutdoor !== 'both') {
      return false
    }
    if (selectedCapacity !== 'all') {
      if (selectedCapacity === 'intimate' && v.capacityMax > 200) return false
      if (selectedCapacity === 'medium' && (v.capacityMax < 200 || v.capacityMin > 500)) return false
      if (selectedCapacity === 'large' && v.capacityMax < 500) return false
    }
    return true
  })

  const toggleCompare = (venue: WeddingVenue) => {
    if (comparisonList.some((v) => v.id === venue.id)) {
      setComparisonList(comparisonList.filter((v) => v.id !== venue.id))
    } else {
      if (comparisonList.length >= 3) {
        alert('You can compare up to 3 venues simultaneously.')
        return
      }
      setComparisonList([...comparisonList, venue])
    }
  }

  const handleAddToProject = (venue: WeddingVenue) => {
    const project = getActiveProject()
    addBudgetItem(project.id, {
      category: 'venue',
      title: `${venue.name} (${venue.destination})`,
      plannedAmount: venue.priceStarting,
      estimatedCost: venue.priceStarting,
      quotedAmount: venue.priceStarting,
      contractedAmount: 0,
      paidAmount: 0,
      vendorName: venue.name,
      paymentStatus: 'pending',
      notes: `Capacity: ${venue.capacityMin}–${venue.capacityMax} guests | ${venue.accommodationRooms} rooms.`,
    })
    alert(`✓ "${venue.name}" added to your wedding workspace budget!`)
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>🏰 GLOBAL VENUE MARKETPLACE</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Extraordinary Wedding Venues
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Explore heritage Rajputana palaces, tranquil Kashmir orchard estates, beachfront Goan havens, Dubai desert sanctuaries, and Lake Como waterfront villas. Transparent capacity, room allocation, and sound policies.
        </p>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Destination */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Destination
            </label>
            <select
              aria-label="Filter venues by destination"
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-semibold text-[#17233B] focus:outline-none"
            >
              <option value="all">All Destinations</option>
              <option value="jaipur">Jaipur (Palaces &amp; Havelis)</option>
              <option value="udaipur">Udaipur (Lakefront Estates)</option>
              <option value="srinagar">Srinagar (Kashmir Orchards)</option>
              <option value="goa">Goa (Beachfront &amp; Lawns)</option>
              <option value="dubai">Dubai (Desert Dunes &amp; Sky)</option>
              <option value="como">Lake Como, Italy (Waterfront)</option>
            </select>
          </div>

          {/* Venue Type */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Venue Type
            </label>
            <select
              aria-label="Filter venues by venue type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-semibold text-[#17233B] focus:outline-none"
            >
              <option value="all">All Property Types</option>
              <option value="palace">Royal Palaces</option>
              <option value="orchard">Orchards &amp; Mountain Estates</option>
              <option value="heritage_haveli">Heritage Havelis</option>
              <option value="beachfront">Beachfront Lawns</option>
              <option value="resort">Desert &amp; Luxury Resorts</option>
              <option value="villa">Historic Italian Villas</option>
            </select>
          </div>

          {/* Capacity */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Guest Capacity
            </label>
            <select
              aria-label="Filter venues by guest capacity"
              value={selectedCapacity}
              onChange={(e) => setSelectedCapacity(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-semibold text-[#17233B] focus:outline-none"
            >
              <option value="all">Any Capacity</option>
              <option value="intimate">Intimate (Up to 200)</option>
              <option value="medium">Classic (200 – 500)</option>
              <option value="large">Grand (500+ Guests)</option>
            </select>
          </div>

          {/* Setting */}
          <div>
            <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-1">
              Setting
            </label>
            <select
              aria-label="Filter venues by indoor or outdoor setting"
              value={selectedSetting}
              onChange={(e) => setSelectedSetting(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-semibold text-[#17233B] focus:outline-none"
            >
              <option value="all">Indoor &amp; Outdoor</option>
              <option value="indoor">Indoor Ballrooms</option>
              <option value="outdoor">Outdoor Lawns &amp; Mandaps</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>
            Showing <strong>{filteredVenues.length}</strong> verified properties
          </span>
          {comparisonList.length > 0 && (
            <span className="text-[#8E2848] font-semibold">
              {comparisonList.length} venue(s) selected for comparison
            </span>
          )}
        </div>
      </div>

      {/* ── Side-by-Side Comparison Drawer ───────────────────────────────────── */}
      {comparisonList.length > 0 && (
        <div className="bg-[#2D1520] text-white rounded-3xl p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#C9A45C] font-bold">⚖️ Side-by-Side Venue Comparison</span>
              <span className="text-stone-300 text-xs">({comparisonList.length}/3 Selected)</span>
            </div>
            <button
              onClick={() => setComparisonList([])}
              className="text-xs text-stone-400 hover:text-white"
            >
              Clear Comparison ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisonList.map((v) => (
              <div key={v.id} className="bg-white/10 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-serif font-bold text-white text-sm line-clamp-1">{v.name}</h4>
                  <button
                    onClick={() => toggleCompare(v)}
                    className="text-stone-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-[#C9A45C]">{v.destination}</p>
                <div className="space-y-1 text-stone-300 pt-1 text-[11px]">
                  <p>Capacity: <strong>{v.capacityMin}–{v.capacityMax} guests</strong></p>
                  <p>Guest Rooms: <strong>{v.accommodationRooms} suites</strong></p>
                  <p>Starting Rate: <strong>From ₹{(v.priceStarting / 100000).toFixed(1)}L</strong></p>
                  <p className="text-stone-400 line-clamp-1">Policy: {v.cateringPolicy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Venues Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVenues.map((venue) => {
          const isComparing = comparisonList.some((c) => c.id === venue.id)
          return (
            <div
              key={venue.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badges */}
                <Link href={`/venues/${venue.slug}`} className="block relative aspect-[16/10] w-full bg-stone-100 group overflow-hidden">
                  <Image
                    src={venue.images[0] || '/images/jaipur-heritage.jpg'}
                    alt={venue.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#17233B] shadow-xs flex items-center gap-1">
                    <span>★</span>
                    <span>{venue.rating}</span>
                    <span className="text-stone-400 font-normal">({venue.reviewsCount})</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[#2D1520] text-[#C9A45C] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {venue.destination}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block mb-1">
                      {venue.venueType.toUpperCase()} · {venue.indoorOutdoor.toUpperCase()}
                    </span>
                    <Link href={`/venues/${venue.slug}`} className="hover:text-[#8E2848] transition-colors">
                      <h3 className="font-serif font-bold text-lg text-[#17233B] line-clamp-1 hover:underline">
                        {venue.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Guest Capacity</span>
                      <strong className="text-stone-800">{venue.capacityMin} – {venue.capacityMax}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Guest Suites</span>
                      <strong className="text-stone-800">{venue.accommodationRooms} Rooms</strong>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2">
                    {venue.description}
                  </p>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Key Amenities</span>
                    <ul className="text-[11px] text-stone-600 space-y-0.5">
                      {venue.amenities.slice(0, 3).map((a, i) => (
                        <li key={i} className="truncate">• {a}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Starting Rate</span>
                      <span className="font-serif text-lg font-bold text-[#8E2848]">
                        From ₹{(venue.priceStarting / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>

                    <button
                      onClick={() => toggleCompare(venue)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                        isComparing
                          ? 'bg-[#C9A45C] text-[#2D1520] font-bold'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      {isComparing ? '✓ Comparing' : '+ Compare'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/venues/${venue.slug}`}
                    className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-center block"
                  >
                    Explore Estate →
                  </Link>
                  <button
                    onClick={() => setActiveModalVenue(venue)}
                    className="py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs text-center"
                  >
                    Quick Quote
                  </button>
                </div>
                <button
                  onClick={() => handleAddToProject(venue)}
                  className="w-full py-2 bg-stone-50 hover:bg-[#C9A45C]/15 text-stone-700 hover:text-[#8E2848] border border-stone-200 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors text-center"
                >
                  + Add to Wedding Workspace
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Venue Details & Inquiry Modal ────────────────────────────────────── */}
      {activeModalVenue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
                  Property Portfolio &amp; Inquiry
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  {activeModalVenue.name}
                </h3>
                <p className="text-xs text-stone-500">{activeModalVenue.destination}</p>
              </div>
              <button
                onClick={() => {
                  setActiveModalVenue(null)
                  setInquirySent(false)
                }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden">
              <Image
                src={activeModalVenue.images[0] || '/images/jaipur-heritage.jpg'}
                alt={activeModalVenue.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <h4 className="font-bold text-sm text-[#17233B]">About this Property</h4>
              <p className="leading-relaxed font-light">{activeModalVenue.description}</p>
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <span className="font-bold text-[#17233B]">Catering &amp; Banqueting Policy:</span>
                <p className="text-stone-600">{activeModalVenue.cateringPolicy}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-[#17233B] uppercase tracking-wider">Property Amenities</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-stone-600">
                {activeModalVenue.amenities.map((am, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {inquirySent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <span className="text-2xl block">✓</span>
                <h4 className="font-bold text-sm text-emerald-900">Inquiry Dispatched</h4>
                <p className="text-xs text-stone-600">
                  Our destination director will check live date availability with {activeModalVenue.name} and get back to you within 4 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!inquiryPhone) return
                  try {
                    await fetch('/api/opportunities', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'wedding_inquiry',
                        vertical: 'weddings',
                        customerName: inquiryName || 'Wedding Couple',
                        customerPhone: inquiryPhone,
                        deliveryCity: activeModalVenue.city,
                        itemOrService: `Venue Inquiry: ${activeModalVenue.name}`,
                        source: 'venues_marketplace',
                      }),
                    })
                    setInquirySent(true)
                  } catch {
                    setInquirySent(true)
                  }
                }}
                className="space-y-3 pt-2 border-t border-stone-100"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Send Venue Quotation Request →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
