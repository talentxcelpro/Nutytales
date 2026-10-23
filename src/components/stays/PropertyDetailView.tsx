'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StayProperty, STAY_PROPERTIES } from '@/lib/stays-data'
import { calculateStayPricing } from '@/lib/stays/pricing'
import { useStaysContext } from './StaysShell'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import StayAvailabilityCalendar from './StayAvailabilityCalendar'
import StayReviewSection from './StayReviewSection'
import StayHostChatModal from './StayHostChatModal'
import StayIcalSyncModal from './StayIcalSyncModal'

interface PropertyDetailViewProps {
  property: StayProperty
}

export default function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const { isWishlisted, toggleWishlist, openAiConcierge } = useStaysContext()
  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // ── Gallery Lightbox State ──────────────────────────────────────────────────
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)

  // ── Booking State ───────────────────────────────────────────────────────────
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultOutStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(todayStr)
  const [checkOut, setCheckOut] = useState(defaultOutStr)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [isBuyout, setIsBuyout] = useState(property.rooms.length === 0 || adults + children > 4)
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    property.rooms.length > 0 ? property.rooms[0].id : '',
  )
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([])
  const [paymentMode, setPaymentMode] = useState<'advance-token' | 'full-prepay' | 'corporate-po'>('advance-token')
  const [promoCode, setPromoCode] = useState('')

  // Guest details
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [gstin, setGstin] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingConfirmation, setBookingConfirmation] = useState<any | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Share Modal
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // In-App Host Messaging & iCal Sync Modals
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [icalModalOpen, setIcalModalOpen] = useState(false)

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const totalGuests = adults + children
  const wishlisted = isWishlisted(property.slug)

  // Calculate Authoritative Pricing Breakdown
  const pricing = useMemo(() => {
    return calculateStayPricing({
      property,
      checkIn,
      checkOut,
      guestsCount: totalGuests,
      isBuyout,
      roomId: selectedRoomId,
      selectedAddOnIds,
      paymentMode,
      promoCode,
    })
  }, [
    property,
    checkIn,
    checkOut,
    totalGuests,
    isBuyout,
    selectedRoomId,
    selectedAddOnIds,
    paymentMode,
    promoCode,
  ])

  // Toggle add-on
  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  // Handle Reservation Submission with Double-Booking Prevention
  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/stays/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertySlug: property.slug,
          roomId: isBuyout ? undefined : selectedRoomId,
          checkIn,
          checkOut,
          adults,
          children,
          isBuyout,
          guestName,
          guestEmail,
          guestPhone,
          companyName,
          gstin,
          specialRequests,
          paymentMode,
          selectedAddOnIds,
          promoCode,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setBookingConfirmation(data.reservation)
      } else {
        setErrorMessage(data.error || 'Failed to complete reservation. Dates may be unavailable.')
      }
    } catch {
      setErrorMessage('Network error while processing reservation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Similar properties
  const similarProperties = useMemo(() => {
    return STAY_PROPERTIES.filter(
      (p) => p.slug !== property.slug && (p.hubZone === property.hubZone || p.category === property.category),
    ).slice(0, 3)
  }, [property])

  const gallery = property.galleryImages.length > 0 ? property.galleryImages : [property.featuredImage]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* ── 1. Top Breadcrumbs & Actions Row ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/stays" className="hover:text-black">Stays</Link>
          <span>/</span>
          <Link href={`/stays?destination=${encodeURIComponent(property.city)}`} className="hover:text-black">
            {property.city}
          </Link>
          <span>/</span>
          <span className="text-[#17233B] font-semibold truncate max-w-[200px]">
            {property.name}
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-2xs"
          >
            <span>↗</span>
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={() => toggleWishlist(property.slug)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
              wishlisted
                ? 'bg-red-50 border-red-200 text-red-600 font-bold'
                : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <span>{wishlisted ? '❤️' : '🤍'}</span>
            <span>{wishlisted ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Title & Verified Location Header ─────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
            ★ {property.rating.toFixed(2)} ({property.reviewsCount} verified reviews)
          </span>
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold">
            📍 {property.locationNote}
          </span>
          {property.host.superhost && (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
              👑 Superhost Managed
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233B] tracking-tight leading-tight">
          {property.name}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-4xl leading-relaxed font-light">
          {property.tagline}
        </p>
      </div>

      {/* ── 3. High-Resolution Photo Gallery Grid with Fullscreen Lightbox ───── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden aspect-16/9 sm:aspect-21/9 max-h-[500px] relative bg-stone-100">
        <div
          onClick={() => {
            setActivePhotoIdx(0)
            setLightboxOpen(true)
          }}
          className="md:col-span-2 relative h-full cursor-pointer group overflow-hidden"
        >
          <Image
            src={gallery[0]}
            alt={property.name}
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-3 h-full">
          {gallery.slice(1, 5).map((img, i) => (
            <div
              key={i}
              onClick={() => {
                setActivePhotoIdx(i + 1)
                setLightboxOpen(true)
              }}
              className="relative h-full cursor-pointer group overflow-hidden bg-stone-200"
            >
              <Image
                src={img}
                alt={`${property.name} view ${i + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setActivePhotoIdx(0)
            setLightboxOpen(true)
          }}
          className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 hover:bg-white text-[#17233B] font-bold text-xs rounded-xl shadow-lg backdrop-blur-xs flex items-center gap-1.5 transition-all"
        >
          <span>📷</span>
          <span>Show all {gallery.length} photos</span>
        </button>
      </div>

      {/* ── 4. Main Two-Column Layout (Details Left + Persistent Booking Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        {/* Left Column: Property Specifics */}
        <div className="lg:col-span-7 space-y-10">
          {/* Host & Accommodation Summary */}
          <div className="p-6 bg-white rounded-3xl border border-[#E7E2D9] shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#17233B]">
                  Entire {property.propertyType} hosted by {property.host.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {property.maxTotalGuests} Guests · {property.bedrooms} Chambers · {property.beds} Beds · {property.baths} Bathrooms
                  {property.squareFeet ? ` · ${property.squareFeet} sq ft` : ''}
                </p>
                <p className="text-[11px] text-emerald-700 font-semibold pt-1">
                  ✓ Identity Verified · Responds {property.host.responseTime} ({property.host.responseRate}% rate)
                </p>
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#C9A45C]">
                <Image src={property.host.avatar} alt={property.host.name} fill className="object-cover" />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setChatModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#17233B] hover:bg-[#1E3048] text-white font-bold flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <span>💬</span>
                <span>Direct Message Host</span>
              </button>
              <button
                type="button"
                onClick={() => setIcalModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5 transition-all"
              >
                <span>🔄</span>
                <span>Two-Way iCal Sync</span>
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#17233B]">About this residence</h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Suites & Chambers Selection */}
          {property.rooms.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                Chambers &amp; Sleeping Arrangements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-5 bg-white rounded-2xl border border-[#E7E2D9] space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="block text-sm text-[#17233B]">{room.name}</strong>
                        <span className="text-[11px] text-stone-500">{room.bedConfig}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#176B68]">
                        ₹{room.basePricePerNight.toLocaleString('en-IN')}/nt
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {room.amenities.slice(0, 3).map((a, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Amenities Checklist */}
          <div className="p-8 bg-white rounded-3xl border border-[#E7E2D9] shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#17233B]">
              What this place offers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
              {property.propertyAmenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    ✓
                  </span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Accessibility Details */}
          {property.accessibilityFeatures.length > 0 && (
            <div className="p-8 bg-white rounded-3xl border border-[#E7E2D9] shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">♿</span>
                <h3 className="font-serif text-xl font-bold text-[#17233B]">
                  Accessibility Features
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Audited features for mobility, wheelchairs, and senior comfort.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                {property.accessibilityFeatures.map((acc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{acc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day-by-Day Availability Heatmap & Dynamic Calendar */}
          <div id="availability-calendar-section" className="space-y-4">
            <StayAvailabilityCalendar
              propertySlug={property.slug}
              checkIn={checkIn}
              checkOut={checkOut}
              onDatesChange={(newIn, newOut) => {
                setCheckIn(newIn)
                setCheckOut(newOut)
              }}
              isBuyout={isBuyout}
              roomId={isBuyout ? undefined : selectedRoomId}
              baseRate={property.estateBuyoutPrice}
            />
          </div>

          {/* House Rules & Policies */}
          <div className="p-8 bg-white rounded-3xl border border-[#E7E2D9] shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#17233B]">Things to know</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-700">
              <div className="space-y-2">
                <strong className="block text-stone-900 font-bold">House Rules:</strong>
                <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                  {property.houseRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <strong className="block text-stone-900 font-bold">Cancellation Policy ({property.cancellationPolicy}):</strong>
                <p className="text-stone-600 leading-relaxed">
                  {property.cancellationDetails}
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 mt-2 text-[11px] text-stone-600">
                  🛡️ Cancel with full refund up to the specified date directly via your Trips dashboard.
                </div>
              </div>
            </div>
          </div>

          {/* Verified Guest Reviews Engine */}
          <StayReviewSection
            propertySlug={property.slug}
            hostName={property.host.name}
            initialRating={property.rating}
            initialReviewsCount={property.reviewsCount}
            initialBreakdown={property.ratingsBreakdown}
          />

          {/* Location & Map Section */}
          <div className="p-8 bg-white rounded-3xl border border-[#E7E2D9] shadow-xs space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#17233B]">Where you will be</h3>
            <p className="text-xs text-stone-600">
              📍 {property.addressLine || property.locationNote}
            </p>
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
              <div className="text-center space-y-2 p-6">
                <span className="text-3xl block">🗺️</span>
                <strong className="block text-sm text-[#17233B]">Exact Location Pin &amp; Coordinates</strong>
                <p className="text-xs text-stone-500 max-w-sm">
                  Lat: {property.latitude}, Long: {property.longitude}. Full driving directions and gate security code are provided immediately upon booking confirmation.
                </p>
                {property.mapUrl && (
                  <a
                    href={property.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-[#17233B] text-white text-xs font-bold rounded-xl"
                  >
                    Open in Maps →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Persistent Sticky Booking Engine ─────────────────── */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="bg-white rounded-3xl border-2 border-[#17233B] p-6 sm:p-7 shadow-xl space-y-6">
            {/* Header Tariff */}
            <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#17233B]">
                  ₹{pricing.nightlyBaseRate.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-500 ml-1">/ night</span>
              </div>
              <span className="text-xs font-bold text-stone-700">
                ★ {property.rating.toFixed(2)} ({property.reviewsCount})
              </span>
            </div>

            {bookingConfirmation ? (
              <div className="p-6 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                  ✓
                </div>
                <h3 className="font-serif text-xl font-bold text-emerald-950">
                  Dates Locked!
                </h3>
                <div className="inline-block px-4 py-2 bg-emerald-100 rounded-xl font-mono text-xs font-black text-emerald-900 border border-emerald-300">
                  Booking Ref: {bookingConfirmation.bookingRef}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Confirmation sent to {bookingConfirmation.guestEmail}. Access code: <strong>{bookingConfirmation.accessCode}</strong>
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href={`/stays/trips?ref=${bookingConfirmation.bookingRef}`}
                    className="py-3 px-4 bg-[#17233B] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
                  >
                    View in My Trips →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setBookingConfirmation(null)}
                    className="text-xs text-stone-500 underline"
                  >
                    Book another date
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReserve} className="space-y-4 text-xs">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-semibold">
                    {errorMessage}
                  </div>
                )}

                {/* Buyout vs Suite Toggle */}
                {property.rooms.length > 0 && (
                  <div className="p-1 bg-[#FAF8F5] rounded-xl border border-stone-200 flex text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setIsBuyout(false)}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        !isBuyout ? 'bg-[#17233B] text-white shadow-xs' : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      Single Chamber
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsBuyout(true)}
                      className={`flex-1 py-2 rounded-lg transition-all ${
                        isBuyout ? 'bg-[#17233B] text-white shadow-xs' : 'text-stone-600 hover:text-black'
                      }`}
                    >
                      Entire Estate Buyout
                    </button>
                  </div>
                )}

                {/* Dates Picker */}
                <div className="space-y-1">
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                        Check-In
                      </label>
                      <input
                        type="date"
                        required
                        min={todayStr}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent font-bold text-stone-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                        Check-Out ({pricing.nights}N)
                      </label>
                      <input
                        type="date"
                        required
                        min={checkIn || todayStr}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent font-bold text-stone-900 focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('availability-calendar-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-[10px] text-[#176B68] font-bold hover:underline flex items-center gap-1 px-1"
                  >
                    <span>📅</span>
                    <span>View interactive calendar heatmap &amp; rates</span>
                  </button>
                </div>

                {/* Guests */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                      Adults (13+)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={property.maxTotalGuests}
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-0.5">
                      Children (2-12)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Experience Add-Ons */}
                {property.experienceAddOns.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                      Enhance Stay with In-House Concierge:
                    </label>
                    <div className="space-y-2">
                      {property.experienceAddOns.map((addon) => {
                        const checked = selectedAddOnIds.includes(addon.id)
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.id)}
                            className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                              checked
                                ? 'bg-[#176B68]/10 border-[#176B68]'
                                : 'bg-white border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {}}
                              className="mt-0.5 accent-[#176B68]"
                            />
                            <div className="text-[11px] flex-1">
                              <div className="flex justify-between font-bold text-[#17233B]">
                                <span>{addon.title}</span>
                                <span className="font-mono text-[#176B68]">
                                  +₹{addon.pricePerPerson.toLocaleString('en-IN')}/pax
                                </span>
                              </div>
                              <p className="text-[10px] text-stone-500 pt-0.5">{addon.desc}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Guest Details */}
                <div className="space-y-2 pt-3 border-t border-stone-200">
                  <input
                    type="text"
                    required
                    placeholder="Guest Full Name *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp Phone *"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Company & GSTIN (For 18% Tax Credit, Optional)"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl"
                  />
                </div>

                {/* Payment Option Selection */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Payment Preference:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('advance-token')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMode === 'advance-token'
                          ? 'bg-[#17233B] text-white border-[#17233B] shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <strong className="block text-xs">20% Advance Token</strong>
                      <span className={`text-[10px] ${paymentMode === 'advance-token' ? 'text-[#C9A45C]' : 'text-stone-500'}`}>
                        Lock dates for ₹{pricing.immediateDepositDue.toLocaleString('en-IN')}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMode('full-prepay')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMode === 'full-prepay'
                          ? 'bg-[#17233B] text-white border-[#17233B] shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700'
                      }`}
                    >
                      <strong className="block text-xs">100% Prepay (5% Off)</strong>
                      <span className={`text-[10px] ${paymentMode === 'full-prepay' ? 'text-[#C9A45C]' : 'text-stone-500'}`}>
                        Save ₹{pricing.prepaymentDiscount.toLocaleString('en-IN')}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Transparent Price Calculation Table */}
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>₹{pricing.nightlyBaseRate.toLocaleString('en-IN')} × {pricing.nights} Nights</span>
                    <span>₹{pricing.grossRoomTariff.toLocaleString('en-IN')}</span>
                  </div>
                  {pricing.lengthOfStayDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Long Stay Discount ({pricing.lengthOfStayDiscountPercent}%)</span>
                      <span>-₹{pricing.lengthOfStayDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {pricing.cleaningFee > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Cleaning &amp; Sanitization Fee</span>
                      <span>₹{pricing.cleaningFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Platform Service Fee (5%)</span>
                    <span>₹{pricing.guestServiceFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>18% Hospitality GST</span>
                    <span>₹{pricing.gstTax.toLocaleString('en-IN')}</span>
                  </div>
                  {pricing.addOnsTotal > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Concierge Add-ons</span>
                      <span>₹{pricing.addOnsTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {pricing.prepaymentDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Upfront Prepayment Discount</span>
                      <span>-₹{pricing.prepaymentDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-sm text-[#17233B]">
                    <span>Total Tariff (Taxes incl.)</span>
                    <span className="font-mono text-base">₹{pricing.grandTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-1 flex justify-between text-[11px] text-[#704B32] font-bold">
                    <span>Due Today to Lock:</span>
                    <span className="font-mono text-sm text-[#17233B]">
                      ₹{pricing.immediateDepositDue.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Reserve Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#17233B] hover:bg-[#1E3048] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>⚡</span>
                  <span>{isSubmitting ? 'Verifying Calendar & Locking...' : `Lock Dates (₹${pricing.immediateDepositDue.toLocaleString('en-IN')})`}</span>
                </button>

                <p className="text-[10px] text-center text-stone-500">
                  You will not be charged until dates are revalidated server-side.
                </p>
              </form>
            )}

            {/* Host Messaging Shortcut */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Have questions for {property.host.name}?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChatModalOpen(true)}
                  className="text-[#176B68] font-bold hover:underline"
                >
                  💬 In-App Chat
                </button>
                <span className="text-stone-300">·</span>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello! I have pre-arrival questions regarding ${property.name} in ${property.city}.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. Similar Available Properties ──────────────────────────────────── */}
      {similarProperties.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-[#E7E2D9]">
          <h3 className="font-serif text-2xl font-bold text-[#17233B]">
            Similar Extraordinary Residences in {property.hubZone}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden p-4 space-y-3">
                <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100">
                  <Image src={p.featuredImage} alt={p.name} fill className="object-cover" />
                </div>
                <div>
                  <strong className="block text-sm text-[#17233B] line-clamp-1">{p.name}</strong>
                  <span className="text-[11px] text-stone-500">📍 {p.city} · ⭐ {p.rating}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="font-mono text-xs font-bold text-[#176B68]">
                    From ₹{p.estateBuyoutPrice.toLocaleString('en-IN')}/nt
                  </span>
                  <Link
                    href={`/stays/${p.slug}`}
                    className="text-xs font-bold text-[#17233B] hover:text-[#176B68]"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. Fullscreen Lightbox Modal ─────────────────────────────────────── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          <div className="flex justify-between items-center text-white text-xs">
            <span>{property.name} ({activePhotoIdx + 1} of {gallery.length})</span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-base"
            >
              ✕
            </button>
          </div>

          <div className="relative flex-1 max-h-[80vh] flex items-center justify-center">
            <Image
              src={gallery[activePhotoIdx]}
              alt={`Photo ${activePhotoIdx + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex justify-center gap-4 text-white text-xs">
            <button
              type="button"
              onClick={() => setActivePhotoIdx((prev) => (prev - 1 + gallery.length) % gallery.length)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={() => setActivePhotoIdx((prev) => (prev + 1) % gallery.length)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── 7. Share Modal ───────────────────────────────────────────────────── */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#E7E2D9] shadow-2xl">
            <div className="flex justify-between items-center">
              <h4 className="font-serif font-bold text-lg text-[#17233B]">Share this Stay</h4>
              <button onClick={() => setShareModalOpen(false)} className="text-stone-400 hover:text-black">
                ✕
              </button>
            </div>
            <p className="text-xs text-stone-600">
              Invite friends and family to review {property.name}.
            </p>
            <div className="flex items-center gap-2 p-2 bg-[#FAF8F5] rounded-xl border border-stone-200">
              <input
                type="text"
                readOnly
                value={typeof window !== 'undefined' ? window.location.href : ''}
                className="w-full bg-transparent text-xs text-stone-800 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== 'undefined') {
                    navigator.clipboard.writeText(window.location.href)
                    setCopiedLink(true)
                    setTimeout(() => setCopiedLink(false), 2000)
                  }
                }}
                className="px-3 py-1.5 bg-[#17233B] text-white text-xs font-bold rounded-lg flex-shrink-0"
              >
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Take a look at this extraordinary stay on Nuty Tales Stays: ${property.name} in ${property.city} - ${typeof window !== 'undefined' ? window.location.href : ''}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <span>Share via WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* ── 8. In-App Host / Butler Direct Chat Modal ───────────────────────── */}
      <StayHostChatModal
        propertySlug={property.slug}
        propertyName={property.name}
        host={property.host}
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        initialGuestName={guestName}
        initialGuestPhone={guestPhone}
      />

      {/* ── 9. Two-Way iCal Channel Synchronization Modal ──────────────────── */}
      <StayIcalSyncModal
        propertySlug={property.slug}
        propertyName={property.name}
        isOpen={icalModalOpen}
        onClose={() => setIcalModalOpen(false)}
      />
    </div>
  )
}
