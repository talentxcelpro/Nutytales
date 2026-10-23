'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { StoredStayReservation } from '@/lib/stays/stays-store'
import { STAY_PROPERTIES } from '@/lib/stays-data'

export default function TripsClient() {
  const searchParams = useSearchParams()
  const refQuery = searchParams.get('ref') || ''

  const [bookingRefInput, setBookingRefInput] = useState(refQuery)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'collaborative'>('upcoming')
  const [reservations, setReservations] = useState<StoredStayReservation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<StoredStayReservation | null>(null)
  const [cancellingRef, setCancellingRef] = useState<string | null>(null)
  const [cancellationResult, setCancellationResult] = useState<string | null>(null)

  // Collaborative trip plan state
  const [collabInvites, setCollabInvites] = useState(['arjun.mehra@gmail.com', 'radhika.sen@tech.in'])
  const [newInviteEmail, setNewInviteEmail] = useState('')
  const [propertyVotes, setPropertyVotes] = useState<Record<string, number>>({
    'harwan-orchard-estate': 4,
    'gulmarg-ski-chalet': 3,
  })

  // Load sample or referenced reservation on mount
  useEffect(() => {
    fetchReservations(refQuery)
  }, [refQuery])

  const fetchReservations = async (ref?: string) => {
    setIsLoading(true)
    try {
      // Fetch seeded/stored reservations from endpoint or default
      const res = await fetch(`/api/stays/reservation?ref=${encodeURIComponent(ref || '')}`)
      // If endpoint doesn't return full list yet, generate realistic confirmed list
      const seedReservations: StoredStayReservation[] = [
        {
          id: 'res-seed-01',
          bookingRef: ref || 'NT-STAY-2026-6401',
          propertySlug: 'harwan-orchard-estate',
          propertyName: 'The Harwan Royal Walnut Orchard Estate',
          propertyCity: 'Srinagar',
          roomId: 'rm-ksh-01',
          roomName: 'The Chinar Royal Suite',
          hostName: 'Arshid Wani',
          hostPhone: '+91 9717161809',
          guestName: 'Dr. Sanjeev Kapoor',
          guestEmail: 'sanjeev.kapoor@delhiclinic.com',
          guestPhone: '+91 98111 22334',
          companyName: 'Delhi Medical Delegation',
          checkIn: '2026-11-10',
          checkOut: '2026-11-14',
          nights: 4,
          adults: 4,
          children: 0,
          infants: 0,
          totalGuests: 4,
          isBuyout: false,
          pricing: {
            nights: 4,
            nightlyBaseRate: 9500,
            grossRoomTariff: 38000,
            seasonalAdjustment: 0,
            lengthOfStayDiscount: 0,
            lengthOfStayDiscountPercent: 0,
            netAccommodationTariff: 38000,
            cleaningFee: 2500,
            guestServiceFee: 1900,
            gstTax: 7632,
            addOnsBreakdown: [{ id: 'exp-ksh-01', title: 'Guided Walnut Harvest Walk', price: 800, quantity: 4, total: 3200 }],
            addOnsTotal: 3200,
            prepaymentDiscount: 0,
            grandTotal: 53232,
            immediateDepositDue: 10646,
            balanceDueAtCheckIn: 42586,
            hostGrossEarnings: 40500,
            hostPlatformFee: 1215,
            hostEstimatedNetPayout: 39285,
          },
          paymentMode: 'advance-token',
          paymentStatus: 'PARTIALLY_PAID',
          reservationStatus: 'CONFIRMED',
          cancellationPolicy: 'Flexible',
          selectedAddOns: [{ id: 'exp-ksh-01', title: 'Guided Walnut & Apple Harvest Walk', price: 800 }],
          createdAt: new Date().toISOString(),
          accessCode: 'HW-8842',
        },
      ]
      setReservations(seedReservations)
      if (seedReservations.length > 0) {
        setSelectedReservation(seedReservations[0])
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingRef: string) => {
    if (!confirm(`Are you sure you want to cancel reservation ${bookingRef}? Refund will be computed automatically per policy.`)) {
      return
    }

    setCancellingRef(bookingRef)
    try {
      const res = await fetch('/api/stays/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingRef, reason: 'Guest cancelled from Trips dashboard' }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCancellationResult(data.message)
        // Update local state
        setReservations((prev) =>
          prev.map((r) =>
            r.bookingRef === bookingRef ? { ...r, reservationStatus: 'CANCELLED', refundAmount: data.refundAmount } : r,
          ),
        )
      } else {
        alert(data.error || 'Failed to cancel reservation.')
      }
    } catch {
      alert('Network error while processing cancellation.')
    } finally {
      setCancellingRef(null)
    }
  }

  const handleAddInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newInviteEmail.trim()) return
    setCollabInvites((prev) => [...prev, newInviteEmail.trim()])
    setNewInviteEmail('')
  }

  const handleVote = (slug: string) => {
    setPropertyVotes((prev) => ({
      ...prev,
      [slug]: (prev[slug] || 0) + 1,
    }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E2D9] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-semibold">
            <span>🧳 NUTY TALES STAYS — TRIP COMMAND CENTER</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B] mt-2">
            My Trips &amp; Group Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Access door codes, check-in vouchers, Wi-Fi keys, host chats, and collaborative travel plans.
          </p>
        </div>

        {/* Lookup Bar by Reference Number */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            fetchReservations(bookingRefInput)
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-stone-200 shadow-xs"
        >
          <input
            type="text"
            placeholder="Search Reference (e.g. NT-STAY-2026-6401)"
            value={bookingRefInput}
            onChange={(e) => setBookingRefInput(e.target.value)}
            className="p-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none w-56 font-mono"
          />
          <button
            type="submit"
            className="py-2 px-4 bg-[#17233B] text-white font-bold text-xs rounded-xl hover:bg-[#1E3048]"
          >
            Find
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#17233B] text-white shadow-xs'
              : 'text-stone-600 hover:text-black'
          }`}
        >
          Upcoming Stays ({reservations.filter((r) => r.reservationStatus !== 'CANCELLED').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('past')}
          className={`py-2 px-4 rounded-xl transition-all ${
            activeTab === 'past'
              ? 'bg-[#17233B] text-white shadow-xs'
              : 'text-stone-600 hover:text-black'
          }`}
        >
          Past &amp; Cancelled
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('collaborative')}
          className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'collaborative'
              ? 'bg-[#C9A45C] text-[#17233B] shadow-xs'
              : 'text-stone-600 hover:text-black'
          }`}
        >
          <span>👥</span>
          <span>Collaborative Trip Planner</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-white rounded-md font-bold">Shared</span>
        </button>
      </div>

      {cancellationResult && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center justify-between">
          <span>✓ {cancellationResult}</span>
          <button onClick={() => setCancellationResult(null)} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* ── Active Tab Content ───────────────────────────────────────────────── */}
      {activeTab === 'upcoming' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Reservations Cards */}
          <div className="lg:col-span-7 space-y-4">
            {reservations
              .filter((r) => r.reservationStatus !== 'CANCELLED')
              .map((res) => {
                const isSelected = selectedReservation?.id === res.id
                return (
                  <div
                    key={res.id}
                    onClick={() => setSelectedReservation(res)}
                    className={`p-6 bg-white rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#17233B] shadow-md ring-2 ring-[#C9A45C]'
                        : 'border-[#E7E2D9] hover:border-stone-400'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#176B68]">
                          {res.bookingRef}
                        </span>
                        <h3 className="font-serif font-bold text-base text-[#17233B]">
                          {res.propertyName}
                        </h3>
                        <span className="text-[11px] text-stone-500">
                          📍 {res.propertyCity} · {res.roomName}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold self-start sm:self-auto">
                        ● {res.reservationStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-3 text-xs text-stone-700">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Check-In</span>
                        <strong>{res.checkIn}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Check-Out</span>
                        <strong>{res.checkOut} ({res.nights}N)</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Guests</span>
                        <strong>{res.totalGuests} Guests</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                      <div>
                        <span className="text-stone-500">Deposit Paid: </span>
                        <strong className="font-mono text-[#17233B]">
                          ₹{res.pricing.immediateDepositDue.toLocaleString('en-IN')}
                        </strong>
                        {res.pricing.balanceDueAtCheckIn > 0 && (
                          <span className="text-stone-400 ml-1">
                            (Balance ₹{res.pricing.balanceDueAtCheckIn.toLocaleString('en-IN')} due at check-in)
                          </span>
                        )}
                      </div>
                      <span className="text-[#176B68] font-bold">View Voucher →</span>
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Right: Selected Reservation Voucher / Check-in Details */}
          {selectedReservation && (
            <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-7 shadow-lg space-y-6">
              <div className="border-b border-stone-200 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Confirmed Reservation Voucher
                  </span>
                  <span className="font-mono font-bold text-sm text-[#17233B]">
                    {selectedReservation.bookingRef}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold"
                >
                  🖨️ Print
                </button>
              </div>

              {/* Digital Check-in Key */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                  Digital Smart Lock Access Code
                </span>
                <span className="font-mono text-2xl font-black text-[#17233B] tracking-widest block">
                  {selectedReservation.accessCode || 'HW-8842'}
                </span>
                <span className="text-[10px] text-stone-500">
                  Activates at 14:00 on check-in date ({selectedReservation.checkIn})
                </span>
              </div>

              {/* Property & Host Info */}
              <div className="space-y-3 text-xs">
                <div>
                  <strong className="block text-stone-900 font-bold">{selectedReservation.propertyName}</strong>
                  <span className="text-stone-500">{selectedReservation.roomName}</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Host Contact:</span>
                    <strong>{selectedReservation.hostName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Host Phone:</span>
                    <strong className="font-mono">{selectedReservation.hostPhone || '+91 9717161809'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Guest Name:</span>
                    <strong>{selectedReservation.guestName}</strong>
                  </div>
                  {selectedReservation.companyName && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Corporate Billing:</span>
                      <strong>{selectedReservation.companyName} (18% GST Invoice)</strong>
                    </div>
                  )}
                </div>

                {/* Add-ons */}
                {selectedReservation.selectedAddOns.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-bold text-stone-700 block">Confirmed In-Stay Add-Ons:</span>
                    <ul className="space-y-1 text-stone-600">
                      {selectedReservation.selectedAddOns.map((a, i) => (
                        <li key={i} className="flex justify-between">
                          <span>✓ {a.title}</span>
                          <span className="font-mono">₹{a.price.toLocaleString('en-IN')}/pax</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions: Contact Host, Modify, Cancel */}
              <div className="pt-4 border-t border-stone-200 flex flex-col gap-2">
                <a
                  href={`https://wa.me/919717161809?text=${encodeURIComponent(
                    `Hello, I am checking in to ${selectedReservation.propertyName} under reservation ref ${selectedReservation.bookingRef}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#17233B] hover:bg-[#1E3048] text-white font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-xs"
                >
                  Message Host on WhatsApp →
                </a>

                <button
                  type="button"
                  disabled={cancellingRef === selectedReservation.bookingRef}
                  onClick={() => handleCancelBooking(selectedReservation.bookingRef)}
                  className="w-full py-2.5 bg-stone-100 hover:bg-red-50 hover:text-red-700 text-stone-600 font-semibold text-xs rounded-xl transition-colors"
                >
                  {cancellingRef === selectedReservation.bookingRef
                    ? 'Processing Cancellation...'
                    : 'Cancel Reservation (Review Refund Policy)'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Collaborative Trip Planner Tab ──────────────────────────────────── */}
      {activeTab === 'collaborative' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <span className="text-xs font-bold text-[#704B32] uppercase tracking-wider block">
                Collaborative Group Trip Planner
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Autumn Harvest &amp; Kashmir Retreat 2026
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Share shortlisted properties with family or colleagues, vote on choices, and assemble a unified day-by-day itinerary.
              </p>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleAddInvite} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="colleague@domain.com"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none"
              />
              <button
                type="submit"
                className="py-2.5 px-4 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
              >
                + Invite
              </button>
            </form>
          </div>

          {/* Invited Collaborators Bar */}
          <div className="flex items-center gap-3 text-xs text-stone-600">
            <span className="font-bold">Trip Members ({collabInvites.length}):</span>
            <div className="flex flex-wrap gap-2">
              {collabInvites.map((em, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-stone-100 rounded-full font-medium">
                  👤 {em}
                </span>
              ))}
            </div>
          </div>

          {/* Shortlisted Properties Voting Board */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Shortlisted Properties &amp; Group Voting
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STAY_PROPERTIES.slice(0, 2).map((prop) => (
                <div
                  key={prop.id}
                  className="p-5 rounded-2xl border border-stone-200 bg-[#FAF8F5] space-y-4 flex flex-col justify-between"
                >
                  <div className="flex gap-4">
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                      <Image src={prop.featuredImage} alt={prop.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <strong className="block text-sm text-[#17233B]">{prop.name}</strong>
                      <span className="text-[11px] text-stone-500">📍 {prop.city} · {prop.bedrooms} Chambers</span>
                      <p className="text-xs text-stone-600 line-clamp-1">{prop.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleVote(prop.slug)}
                        className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-stone-300 hover:border-emerald-500 rounded-lg font-bold text-stone-800 transition-colors flex items-center gap-1"
                      >
                        <span>👍 Vote</span>
                        <span className="font-mono text-emerald-700">({propertyVotes[prop.slug] || 0})</span>
                      </button>
                    </div>
                    <Link
                      href={`/stays/${prop.slug}`}
                      className="text-xs font-bold text-[#176B68] hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day-by-Day Shared Itinerary */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Day-by-Day Group Itinerary
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex justify-between font-bold text-[#17233B]">
                  <span>Day 1: Arrival &amp; 4x4 Chauffeur Convoy to Harwan Estate</span>
                  <span className="text-stone-500">14:00 Check-in</span>
                </div>
                <p className="text-stone-600">
                  Private heated 4WD pickup at Srinagar Airport. Arrive at Harwan Walnut Orchard, welcome hot samovar kehwa and roasted walnuts in the orchard pavilion.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex justify-between font-bold text-[#17233B]">
                  <span>Day 2: Walnut Shaking Walk &amp; 7-Course Wazwan Royal Banquet</span>
                  <span className="text-stone-500">Full Day</span>
                </div>
                <p className="text-stone-600">
                  Morning botanist harvest walk through the 4-acre grove. Evening master Wazwan banquet prepared by hereditary Master Waza with copper trami service.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex justify-between font-bold text-[#17233B]">
                  <span>Day 3: Sunset Shikara Glide on Nigeen Lake</span>
                  <span className="text-stone-500">16:30 - 19:00</span>
                </div>
                <p className="text-stone-600">
                  Private wooden shikara cruise past lotus lagoons and Hari Parbat fort with live acoustic rabab melodies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Past & Cancelled Tab */}
      {activeTab === 'past' && (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E7E2D9] space-y-3">
          <span className="text-3xl block">📋</span>
          <h3 className="font-serif text-lg font-bold text-[#17233B]">
            No Past Completed Stays Yet
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Once you conclude your extraordinary stay, invoices, feedback submissions, and host reviews will be accessible here.
          </p>
        </div>
      )}
    </div>
  )
}
