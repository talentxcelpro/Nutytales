'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  STAY_PROPERTIES,
  STAY_CATEGORIES,
  StayProperty,
  StayCategory,
  StayRoom,
} from '@/lib/stays-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function LiveStaysDiscovery() {
  // ── 1. Search Bar Parameters ────────────────────────────────────────────────
  const [selectedHubZone, setSelectedHubZone] = useState<'All' | 'Kashmir' | 'Delhi-NCR' | 'Patna' | 'Global'>('All')
  const [destinationQuery, setDestinationQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<StayCategory>('all')
  const [isCorporateWorkOnly, setIsCorporateWorkOnly] = useState(false)
  
  const todayStr = new Date().toISOString().split('T')[0]
  const defaultCheckOutStr = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  const [checkIn, setCheckIn] = useState<string>(todayStr)
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOutStr)
  const [guestsCount, setGuestsCount] = useState<number>(2)

  // ── 2. Modal / Booking Drawer State ─────────────────────────────────────────
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<StayProperty | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string>('')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [isBuyoutMode, setIsBuyoutMode] = useState(false)

  // ── 3. Guest Contact & Immediate Revenue Booking ────────────────────────────
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [gstin, setGstin] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [paymentMode, setPaymentMode] = useState<'advance-token' | 'full-prepay' | 'corporate-po'>('advance-token')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingConfirmationRef, setBookingConfirmationRef] = useState<string | null>(null)

  // ── 4. Host Asset Management Calculator State ───────────────────────────────
  const [hostPropertyType, setHostPropertyType] = useState<'orchard' | 'chalet' | 'houseboat' | 'executive'>('orchard')
  const [hostBedrooms, setHostBedrooms] = useState<number>(4)

  const hostEstimatedMonthlyRevenue = useMemo(() => {
    const baseDailyRate =
      hostPropertyType === 'orchard'
        ? 12000
        : hostPropertyType === 'chalet'
        ? 16000
        : hostPropertyType === 'houseboat'
        ? 8500
        : 7500
    // Assuming 65% average occupancy in the curated collection
    return Math.round(baseDailyRate * (hostBedrooms / 2) * 30 * 0.65)
  }, [hostPropertyType, hostBedrooms])

  // ── Calculate Nights ────────────────────────────────────────────────────────
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1
    const inDate = new Date(checkIn)
    const outDate = new Date(checkOut)
    const diffTime = outDate.getTime() - inDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  }, [checkIn, checkOut])

  // ── Filtered Properties Set ─────────────────────────────────────────────────
  const filteredProperties = useMemo(() => {
    return STAY_PROPERTIES.filter((prop) => {
      // Hub zone filter (Kashmir, Delhi-NCR, Patna, Global)
      if (selectedHubZone !== 'All' && prop.hubZone !== selectedHubZone) {
        return false
      }

      // Text query
      if (destinationQuery.trim()) {
        const q = destinationQuery.toLowerCase()
        const matchesLocation =
          prop.city.toLowerCase().includes(q) ||
          prop.state.toLowerCase().includes(q) ||
          prop.name.toLowerCase().includes(q) ||
          prop.country.toLowerCase().includes(q) ||
          prop.tagline.toLowerCase().includes(q)
        if (!matchesLocation) return false
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          prop.category === selectedCategory ||
          prop.secondaryCategories.includes(selectedCategory)
        if (!matchesCategory) return false
      }

      // Corporate work stays only
      if (isCorporateWorkOnly && !prop.workFriendly) {
        return false
      }

      // Guest capacity
      if (guestsCount > prop.maxTotalGuests) {
        return false
      }

      return true
    })
  }, [selectedHubZone, destinationQuery, selectedCategory, isCorporateWorkOnly, guestsCount])

  // ── Open Property Modal ─────────────────────────────────────────────────────
  const handleOpenProperty = (property: StayProperty, buyout = false) => {
    setSelectedPropertyForModal(property)
    setSelectedRoomId(property.rooms[0]?.id || '')
    setSelectedAddOns([])
    setIsBuyoutMode(buyout)
    setBookingConfirmationRef(null)
  }

  // ── Pricing Calculation for Modal ───────────────────────────────────────────
  const modalSelectedRoom = useMemo(() => {
    if (!selectedPropertyForModal) return null
    return (
      selectedPropertyForModal.rooms.find((r) => r.id === selectedRoomId) ||
      selectedPropertyForModal.rooms[0]
    )
  }, [selectedPropertyForModal, selectedRoomId])

  const modalNightlyRate = useMemo(() => {
    if (!selectedPropertyForModal) return 0
    if (isBuyoutMode) return selectedPropertyForModal.estateBuyoutPrice
    return modalSelectedRoom ? modalSelectedRoom.basePricePerNight : 0
  }, [selectedPropertyForModal, isBuyoutMode, modalSelectedRoom])

  const modalBaseTotal = modalNightlyRate * nights

  const modalAddOnsTotal = useMemo(() => {
    if (!selectedPropertyForModal) return 0
    return selectedAddOns.reduce((acc, addOnId) => {
      const item = selectedPropertyForModal.experienceAddOns.find((a) => a.id === addOnId)
      return acc + (item ? item.pricePerPerson * guestsCount : 0)
    }, 0)
  }, [selectedPropertyForModal, selectedAddOns, guestsCount])

  const modalGrandTotal = modalBaseTotal + modalAddOnsTotal
  // Immediate Cash Inflow Token (20% Advance Guarantee or ₹15,000 minimum)
  const immediateTokenDeposit = isBuyoutMode ? 25000 : Math.round(Math.max(5000, modalGrandTotal * 0.2))

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // ── Handle Reservation Submission & Immediate Payment Trigger ──────────────
  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPropertyForModal) return

    setIsSubmitting(true)
    const refCode = `STAY-${Date.now().toString().slice(-6)}`

    const addOnTitles = selectedAddOns
      .map((id) => selectedPropertyForModal.experienceAddOns.find((a) => a.id === id)?.title)
      .filter(Boolean)
      .join(', ')

    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_inquiry',
          vertical: 'stays',
          customerName: guestName,
          companyName: companyName || `${guestName} Executive Group`,
          customerPhone: guestPhone,
          customerEmail: guestEmail,
          deliveryCity: `${selectedPropertyForModal.city}, ${selectedPropertyForModal.state}`,
          targetBudget: modalGrandTotal,
          currency: 'INR',
          notes: `[REF: ${refCode}] Property: ${selectedPropertyForModal.name} | Hub: ${selectedPropertyForModal.hubZone} | Mode: ${
            isBuyoutMode ? 'Full Estate Buyout' : modalSelectedRoom?.name
          } | Dates: ${checkIn} to ${checkOut} (${nights} nights) | Guests: ${guestsCount} | GSTIN: ${
            gstin || 'None'
          } | Payment Mode: ${paymentMode} | Deposit Due: ₹${immediateTokenDeposit.toLocaleString(
            'en-IN'
          )} | Add-ons: ${addOnTitles || 'None'} | Notes: ${specialRequests}`,
        }),
      })
      setBookingConfirmationRef(refCode)
    } catch {
      setBookingConfirmationRef(refCode)
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="space-y-12">
      {/* ── 1. The Three Primary Strategic Hubs Switcher ──────────────────────── */}
      <div className="bg-[#17233B] text-white p-4 rounded-3xl border border-[#C9A45C]/30 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A45C] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Strategic Operating Corridors:
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'All', label: 'All Locations' },
              { id: 'Kashmir', label: '🏔️ Kashmir (Harwan · Gulmarg · Pahalgam)' },
              { id: 'Delhi-NCR', label: '🏢 Delhi / NCR (Noida Sector 128 / Jaypee Wishtown)' },
              { id: 'Patna', label: '🏛️ Patna (Nafis Colony / Mithila Courtyard)' },
              { id: 'Global', label: '🌍 Global (Dubai DIFC · London Kensington)' },
            ].map((hub) => (
              <button
                key={hub.id}
                type="button"
                onClick={() => setSelectedHubZone(hub.id as any)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all border ${
                  selectedHubZone === hub.id
                    ? 'bg-[#C9A45C] text-[#17233B] border-[#C9A45C] shadow-sm'
                    : 'bg-white/10 text-stone-200 border-white/10 hover:bg-white/20'
                }`}
              >
                {hub.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. The Global Private Residences Floating Search Bar ──────────────── */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl border border-stone-200 text-[#17233B]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Where: Destination */}
          <div className="md:col-span-4 p-2.5 sm:p-3 rounded-2xl bg-[#FAF6EE] hover:bg-stone-100 transition-colors border border-stone-200">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Destination / Estate
            </label>
            <input
              type="text"
              value={destinationQuery}
              onChange={(e) => setDestinationQuery(e.target.value)}
              placeholder="Srinagar, Gulmarg, Noida NCR, Patna, Dubai..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#17233B] focus:outline-none placeholder-stone-400"
            />
          </div>

          {/* When: Dates */}
          <div className="md:col-span-3 grid grid-cols-2 gap-2 p-2.5 sm:p-3 rounded-2xl bg-[#FAF6EE] border border-stone-200">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Check Out ({nights}N)
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none"
              />
            </div>
          </div>

          {/* Who: Guests */}
          <div className="md:col-span-2 p-2.5 sm:p-3 rounded-2xl bg-[#FAF6EE] border border-stone-200">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Guests
            </label>
            <select
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none cursor-pointer"
            >
              {[1, 2, 4, 6, 8, 10, 14, 20].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Search Action & Corporate Work Mode Toggle */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCorporateWorkOnly(!isCorporateWorkOnly)}
              className={`flex-1 py-3 px-3 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                isCorporateWorkOnly
                  ? 'bg-[#17233B] text-[#C9A45C] border-[#17233B] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>💼</span>
              <span>{isCorporateWorkOnly ? 'Corporate Living' : 'For Business'}</span>
            </button>

            <button
              type="button"
              className="py-3 px-5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>🔍</span>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 3. Horizontal Category Navigation Carousel ───────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
        {STAY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-[#17233B] text-white shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── 4. Corporate Living & Executive Suites Banner ─────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#17233B] via-[#1E3048] to-[#10192A] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-[#C9A45C]/30">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] font-bold text-[10px] uppercase tracking-wider">
            <span>💼</span> NUTY TALES EXECUTIVE CORPORATE LIVING
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold">
            Executive Residences &amp; High-Yield Team Offsites
          </h3>
          <p className="text-xs text-stone-300 max-w-2xl font-light leading-relaxed">
            Anchored in <strong>Delhi / NCR (Sector 128, Noida)</strong>, <strong>Kashmir (Arshid House &amp; Harwan)</strong>, and <strong>Patna (Nafis Colony)</strong>. Redundant 200–500 Mbps commercial fiber, dedicated board meeting tables, in-house master chefs, private 4x4 airport transit, and official 18% GST invoicing.
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <Link
            href="/stays/group-quote"
            className="px-5 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            Request Offsite Buyout Quote
          </Link>
          <button
            type="button"
            onClick={() => setIsCorporateWorkOnly(!isCorporateWorkOnly)}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all"
          >
            {isCorporateWorkOnly ? 'Show All Estates' : 'Filter Executive Living'}
          </button>
        </div>
      </div>

      {/* ── 5. Global Property Card Grid ───────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
          <span>Displaying {filteredProperties.length} verified private residences &amp; estates</span>
          <span className="text-[#704B32] hidden sm:inline">✦ Instant Advance Token &amp; Full Estate Buyouts</span>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center space-y-3 border border-stone-200">
            <span className="text-4xl block">🔍</span>
            <h4 className="font-serif text-xl font-bold text-[#17233B]">No residences matched your criteria</h4>
            <p className="text-xs text-stone-500">Try switching your hub zone or selecting &apos;All Residences&apos;.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedHubZone('All')
                setDestinationQuery('')
                setSelectedCategory('all')
                setIsCorporateWorkOnly(false)
              }}
              className="px-4 py-2 bg-[#17233B] text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Overlay Badges */}
                  <div
                    className="relative aspect-[16/11] bg-stone-100 overflow-hidden cursor-pointer"
                    onClick={() => handleOpenProperty(prop)}
                  >
                    <Image
                      src={prop.featuredImage}
                      alt={prop.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="bg-[#17233B]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        {prop.hubZone} Hub
                      </span>
                      {prop.workFriendly && (
                        <span className="bg-[#C9A45C] text-[#17233B] text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                          Executive Living
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-500">
                        {prop.city}, {prop.country}
                      </span>
                      <span className="font-bold text-[#17233B] flex items-center gap-1">
                        ★ {prop.rating} <span className="text-stone-400 font-normal">({prop.reviewsCount})</span>
                      </span>
                    </div>

                    <h4
                      onClick={() => handleOpenProperty(prop)}
                      className="font-serif font-bold text-base text-[#17233B] group-hover:text-[#704B32] transition-colors cursor-pointer line-clamp-1"
                    >
                      {prop.name}
                    </h4>

                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {prop.bedrooms} Bedrooms · {prop.baths} Baths · Up to {prop.maxTotalGuests} Guests
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1 text-[10px] text-stone-600">
                      <span className="bg-stone-100 px-2 py-0.5 rounded font-medium">⚡ {prop.wifiSpeedMbps} Mbps Fiber</span>
                      <span className="bg-stone-100 px-2 py-0.5 rounded font-medium">👨‍🍳 Chef Service</span>
                    </div>

                    {/* Pricing */}
                    <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#17233B] text-base">
                          ₹{prop.rooms[0]?.basePricePerNight.toLocaleString('en-IN')}
                        </span>
                        <span className="text-stone-500 text-[11px]"> / suite</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">Estate Buyout:</span>
                        <span className="font-mono font-semibold text-[#704B32] text-xs">
                          ₹{prop.estateBuyoutPrice.toLocaleString('en-IN')} / night
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-5 pt-0 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenProperty(prop, false)}
                    className="flex-1 py-2.5 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Reserve Suite
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenProperty(prop, true)}
                    className="py-2.5 px-3 bg-[#FAF6EE] hover:bg-stone-200 text-[#704B32] font-bold text-xs rounded-xl transition-all border border-stone-200"
                    title="Reserve entire private estate"
                  >
                    Buyout
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 6. Estate Asset Management & Host Program ─────────────────────────── */}
      <section className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-white/10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Pitch */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C] text-[#17233B] text-[10px] font-bold uppercase tracking-wider">
              <span>🏡</span> ESTATE ASSET MANAGEMENT &amp; PRIVATE COLLECTION
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
              List your orchard, heritage manor or corporate penthouse in the Private Collection.
            </h3>
            <p className="text-sm text-stone-300 font-light leading-relaxed max-w-xl">
              Turn your property into a high-yield institutional asset across Kashmir, Delhi NCR, and Patna. Nuty Tales manages high-net-worth guest screening, deployed in-house Wazwan chefs, complete housekeeping, and corporate enterprise bookings.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[#C9A45C] font-bold block text-sm">0% Listing Fee</span>
                <span className="text-stone-400">Zero upfront cost to partner</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[#C9A45C] font-bold block text-sm">Vetted Guests</span>
                <span className="text-stone-400">CXOs, executive teams &amp; families</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-[#C9A45C] font-bold block text-sm">Asset Guarantee</span>
                <span className="text-stone-400">₹10 Lakh damage escrow protocol</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/stays/hosts"
                className="inline-flex items-center gap-2 px-7 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                <span>🚀</span>
                <span>Submit Estate Listing Application</span>
              </Link>
            </div>
          </div>

          {/* Right: Live Host Earnings Calculator */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 space-y-5 text-white">
            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
                Estate Yield Calculator
              </span>
              <h4 className="font-serif text-2xl font-bold">Estimated Monthly Yield</h4>
            </div>

            {/* Property Type Radio */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-stone-300 block">Property Type:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'orchard', label: 'Orchard Villa (Kashmir)' },
                  { id: 'chalet', label: 'Ski Chalet (Gulmarg)' },
                  { id: 'houseboat', label: 'Cedar Houseboat' },
                  { id: 'executive', label: 'Executive Penthouse (NCR)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setHostPropertyType(item.id as any)}
                    className={`p-2.5 rounded-xl border transition-all text-center ${
                      hostPropertyType === item.id
                        ? 'bg-[#C9A45C] text-[#17233B] font-bold border-[#C9A45C]'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bedroom Slider */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-300 font-semibold">Bedrooms / Chambers:</span>
                <span className="font-mono font-bold text-white px-2 py-0.5 bg-white/10 rounded">
                  {hostBedrooms} Bedrooms
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={hostBedrooms}
                onChange={(e) => setHostBedrooms(Number(e.target.value))}
                className="w-full accent-[#C9A45C] cursor-pointer"
              />
            </div>

            {/* Calculated Monthly Revenue */}
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center space-y-1">
              <span className="text-xs text-stone-300">Projected Monthly Net Revenue:</span>
              <div className="font-mono text-3xl font-black text-[#C9A45C]">
                ₹{hostEstimatedMonthlyRevenue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-stone-400 block">
                Calculated on 65% occupancy in Nuty Tales Private Collection
              </span>
            </div>

            <Link
              href={`/stays/hosts?type=${hostPropertyType}&br=${hostBedrooms}`}
              className="block w-full text-center py-3 bg-white text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-100 transition-all shadow-md"
            >
              Start Partner Onboarding →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Interactive Property Quick-Look & Instant Deposit Booking Modal ─── */}
      {selectedPropertyForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-[#17233B]">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 px-6 sm:px-8 py-4 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                  {selectedPropertyForModal.city}, {selectedPropertyForModal.country} · {selectedPropertyForModal.hubZone} Hub
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
                  {selectedPropertyForModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPropertyForModal(null)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Photo Banner */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100">
                <Image
                  src={selectedPropertyForModal.featuredImage}
                  alt={selectedPropertyForModal.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#17233B]/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    ★ {selectedPropertyForModal.rating} ({selectedPropertyForModal.reviewsCount} reviews)
                  </span>
                  <span className="bg-[#C9A45C] text-[#17233B] text-xs font-bold px-3 py-1 rounded-full">
                    {isBuyoutMode ? 'Full Private Estate Buyout' : 'Suite Selection'}
                  </span>
                </div>
              </div>

              {/* Success Message If Booked */}
              {bookingConfirmationRef && (
                <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-500 text-emerald-900 space-y-2">
                  <div className="font-bold text-base flex items-center gap-2">
                    <span>🎉</span> Reservation Dossier Submitted! Reference: <strong>{bookingConfirmationRef}</strong>
                  </div>
                  <p className="text-xs">
                    Our Private Stay Concierge and the property director have received your booking. A formal Proforma Invoice with direct Bank Wire (RTGS/NEFT) and instant payment token link has been dispatched to your email and WhatsApp.
                  </p>
                </div>
              )}

              {/* Mode Toggle: Suite vs Estate Buyout */}
              <div className="flex rounded-2xl bg-stone-100 p-1 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsBuyoutMode(false)}
                  className={`flex-1 py-2.5 rounded-xl transition-all ${
                    !isBuyoutMode ? 'bg-white text-[#17233B] shadow-sm' : 'text-stone-600 hover:text-black'
                  }`}
                >
                  Individual Suite / Chamber
                </button>
                <button
                  type="button"
                  onClick={() => setIsBuyoutMode(true)}
                  className={`flex-1 py-2.5 rounded-xl transition-all ${
                    isBuyoutMode ? 'bg-[#17233B] text-white shadow-sm' : 'text-stone-600 hover:text-black'
                  }`}
                >
                  Entire Private Estate Buyout (Up to {selectedPropertyForModal.maxTotalGuests} Guests)
                </button>
              </div>

              {/* Room Selector (If not buyout) */}
              {!isBuyoutMode && (
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                    Select Suite / Chamber:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPropertyForModal.rooms.map((room) => (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          selectedRoomId === room.id
                            ? 'border-[#17233B] bg-[#FAF6EE] ring-2 ring-[#C9A45C]'
                            : 'border-stone-200 bg-white hover:border-stone-400'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="block text-sm text-[#17233B]">{room.name}</strong>
                            <span className="text-[11px] text-stone-500">{room.type} · {room.sizeSqFt} sq ft</span>
                          </div>
                          <span className="font-mono font-bold text-xs text-[#704B32]">
                            ₹{room.basePricePerNight.toLocaleString('en-IN')}/night
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 pt-2 line-clamp-2">{room.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-On Experiences */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  Curated In-Stay Hospitality Add-Ons:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPropertyForModal.experienceAddOns.map((addon) => {
                    const isChecked = selectedAddOns.includes(addon.id)
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'border-[#176B68] bg-[#176B68]/10'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 accent-[#176B68]"
                        />
                        <div className="text-xs flex-1">
                          <div className="flex justify-between">
                            <strong className="text-[#17233B]">{addon.title}</strong>
                            <span className="font-mono text-[#176B68] font-bold">
                              +₹{addon.pricePerPerson.toLocaleString('en-IN')}/pax
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 pt-0.5">{addon.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Immediate Revenue Form */}
              <form onSubmit={handleReservationSubmit} className="space-y-4 pt-4 border-t border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF6EE] focus:outline-none focus:ring-2 focus:ring-[#704B32]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF6EE] focus:outline-none focus:ring-2 focus:ring-[#704B32]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Work / Personal Email *</label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="vikram@enterprise.com"
                      className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF6EE] focus:outline-none focus:ring-2 focus:ring-[#704B32]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Company Name &amp; GSTIN (For 18% Tax Credit)</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="e.g. 07AAAAA0000A1Z5 (Optional)"
                      className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF6EE] focus:outline-none focus:ring-2 focus:ring-[#704B32]"
                    />
                  </div>
                </div>

                {/* Immediate Inflow Payment Option Selector */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <label className="font-bold text-[#17233B] block">
                    Immediate Revenue &amp; Commitment Option:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'advance-token', label: '20% Advance Token', desc: `Pay ₹${immediateTokenDeposit.toLocaleString('en-IN')} now to lock dates` },
                      { id: 'full-prepay', label: '100% Prepayment', desc: `Pay full ₹${modalGrandTotal.toLocaleString('en-IN')} (5% instant rebate)` },
                      { id: 'corporate-po', label: 'Corporate PO & GST Invoice', desc: 'Net-15 terms for approved enterprises' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMode(opt.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          paymentMode === opt.id
                            ? 'border-[#17233B] bg-[#17233B] text-white shadow-sm'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        <strong className="block text-xs">{opt.label}</strong>
                        <span className={`text-[10px] ${paymentMode === opt.id ? 'text-[#C9A45C]' : 'text-stone-500'}`}>
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown Footer */}
                <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-stone-600">
                    <div>
                      {isBuyoutMode ? 'Full Private Estate Buyout' : modalSelectedRoom?.name} · {nights} Nights · {guestsCount} Guests
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Total Tariff: ₹{modalGrandTotal.toLocaleString('en-IN')} · <strong>Commitment Deposit Due Today: ₹{immediateTokenDeposit.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Deposit to Lock:</span>
                    <span className="font-mono text-2xl font-black text-[#17233B]">
                      ₹{immediateTokenDeposit.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    {isSubmitting ? 'Processing Reservation...' : `⚡ Lock Dates with ₹${immediateTokenDeposit.toLocaleString('en-IN')} Deposit`}
                  </button>

                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      `Hello Nuty Tales Private Collection! I want to lock: ${selectedPropertyForModal.name} (${selectedPropertyForModal.hubZone} Hub, ${checkIn} to ${checkOut}, ${guestsCount} guests). Estimated: ₹${modalGrandTotal.toLocaleString('en-IN')}`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <span>💬</span>
                    <span className="hidden sm:inline">WhatsApp Concierge</span>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
