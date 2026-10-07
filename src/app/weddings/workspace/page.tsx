'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function WeddingWorkspacePage() {
  const [coupleNames, setCoupleNames] = useState('Ananya & Vikram')
  const [destination, setDestination] = useState('Srinagar (Kashmir Valley)')
  const [weddingDate, setWeddingDate] = useState('2026-11-15')
  const [guestCount, setGuestCount] = useState<number>(350)
  const [totalBudgetLakhs, setTotalBudgetLakhs] = useState<number>(45) // ₹45 Lakhs

  // Contact
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')

  // Selected Events
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'Roka & Engagement',
    'Mehendi & Sangeet Night',
    'Haldi Ceremony',
    'Main Wedding Ceremony (Shaadi)',
    'Royal Reception Dinner',
  ])

  // Vendors Needed
  const [neededVendors, setNeededVendors] = useState<string[]>([
    'Heritage Orchard / Palace Venue',
    'Royal Kashmiri Wazwan / Multi-Cuisine Catering',
    'Bespoke Dry Fruit Return Favors (Nutty Tales)',
    'Cinematography & Candid Photography',
    'Floral & Stage Scenography',
  ])

  // Return Favor Tier
  const [favorTier, setFavorTier] = useState<'royal' | 'velvet' | 'heritage'>('royal')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [workspaceRef, setWorkspaceRef] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Budget Breakdown (Auto-balanced percentages)
  const totalBudgetInr = totalBudgetLakhs * 100000
  const venueBudget = Math.round(totalBudgetInr * 0.35)
  const cateringBudget = Math.round(totalBudgetInr * 0.25)
  const decorBudget = Math.round(totalBudgetInr * 0.15)
  const photoBudget = Math.round(totalBudgetInr * 0.10)
  const favorsBudget = Math.round(totalBudgetInr * 0.10)
  const miscBudget = Math.round(totalBudgetInr * 0.05)

  const favorUnitCost = favorTier === 'royal' ? 2400 : favorTier === 'heritage' ? 1600 : 1100
  const estimatedFavorsCost = guestCount * favorUnitCost

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event],
    )
  }

  const toggleVendor = (vendor: string) => {
    setNeededVendors((prev) =>
      prev.includes(vendor) ? prev.filter((v) => v !== vendor) : [...prev, vendor],
    )
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wedding_inquiry',
          vertical: 'weddings',
          customerName: contactName || coupleNames,
          companyName: `Wedding of ${coupleNames}`,
          customerPhone: contactPhone,
          customerEmail: contactEmail,
          deliveryCity: destination,
          targetBudget: totalBudgetInr,
          currency: 'INR',
          notes: `Date: ${weddingDate} | Guests: ${guestCount} | Total Budget: ₹${totalBudgetLakhs} Lakhs | Events: ${selectedEvents.join(
            ', ',
          )} | Vendors Needed: ${neededVendors.join(
            ', ',
          )} | Favor Tier: ${favorTier} (~₹${estimatedFavorsCost.toLocaleString(
            'en-IN',
          )})`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setWorkspaceRef(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to initialize workspace.')
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>💍 NUTTY TALES WEDDINGS — OPERATING SYSTEM</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Interactive Wedding Workspace &amp; Planning Engine
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          &quot;Plan and execute your wedding.&quot; Structure your multi-event timeline, auto-balance budgets across venues, wazwan catering, and cinematography, and dispatch RFQs to verified vendors with one click.
        </p>
      </div>

      {workspaceRef ? (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#8E2848] text-white flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1520]">
            Wedding Workspace Initialized for {coupleNames}!
          </h2>
          <div className="inline-block px-4 py-2 bg-rose-100 rounded-xl font-mono text-sm font-bold text-[#8E2848] border border-rose-300">
            Workspace ID: {workspaceRef}
          </div>
          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            Your planning blueprint for {guestCount} guests in {destination} has been structured. Our senior destination wedding director will contact you with initial vendor availability within 4 hours.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/weddings/dashboard"
              className="px-6 py-3 bg-[#2D1520] hover:bg-[#8E2848] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Open Couple Dashboard →
            </Link>
            <button
              onClick={() => setWorkspaceRef(null)}
              className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Modify Blueprint
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreateWorkspace} className="space-y-8">
          {/* ── 1. Couple & Destination Parameters ────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>1.</span> Wedding Identity &amp; Key Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Couple Names *</label>
                <input
                  type="text"
                  required
                  value={coupleNames}
                  onChange={(e) => setCoupleNames(e.target.value)}
                  placeholder="e.g. Ananya & Vikram"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target Destination / City</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none bg-white font-medium"
                >
                  <option value="Srinagar (Kashmir Valley)">Srinagar (Kashmir Valley Orchard/Dal Lake)</option>
                  <option value="Gulmarg / Pahalgam">Gulmarg / Pahalgam (Alpine Meadow)</option>
                  <option value="Udaipur / Jaipur">Udaipur / Jaipur (Palace Heritage)</option>
                  <option value="Goa Beachside">Goa (Beachside Luxury)</option>
                  <option value="Dubai / Abu Dhabi">Dubai / Abu Dhabi (International)</option>
                  <option value="Delhi NCR">Delhi NCR Farmhouse Estate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Wedding Date *</label>
                <input
                  type="date"
                  required
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Expected Guest Count</label>
                <input
                  type="number"
                  min="20"
                  max="5000"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none font-bold text-[#17233B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Contact Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Vikram Sharma (Groom)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="ananya.vikram@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── 2. Interactive Budget Optimizer ───────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#17233B] flex items-center gap-2">
                  <span>2.</span> Interactive Budget Allocator
                </h3>
                <p className="text-xs text-stone-500">
                  Dynamic category splitting based on industry benchmarks for destination weddings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">Total Budget:</span>
                <span className="font-serif text-2xl font-extrabold text-[#8E2848]">
                  ₹{totalBudgetLakhs} Lakhs
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={totalBudgetLakhs}
                onChange={(e) => setTotalBudgetLakhs(Number(e.target.value))}
                className="w-full accent-[#8E2848] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>₹10 Lakhs (Intimate)</span>
                <span>₹50 Lakhs (Premium Destination)</span>
                <span>₹1.5+ Cr (Grand Palace)</span>
                <span>₹2.5 Cr (Imperial)</span>
              </div>
            </div>

            {/* Allocation Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Venue &amp; Rooms (35%)</span>
                <span className="font-bold text-base text-[#17233B]">₹{(venueBudget / 100000).toFixed(1)}L</span>
                <span className="text-[10px] text-stone-500 block">3 nights for {guestCount} guests</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Food &amp; Catering (25%)</span>
                <span className="font-bold text-base text-[#17233B]">₹{(cateringBudget / 100000).toFixed(1)}L</span>
                <span className="text-[10px] text-stone-500 block">Wazwan feasts &amp; banquets</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Decor &amp; Florals (15%)</span>
                <span className="font-bold text-base text-[#17233B]">₹{(decorBudget / 100000).toFixed(1)}L</span>
                <span className="text-[10px] text-stone-500 block">Mandap, Mehendi canopy</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Cinema &amp; Photo (10%)</span>
                <span className="font-bold text-base text-[#17233B]">₹{(photoBudget / 100000).toFixed(1)}L</span>
                <span className="text-[10px] text-stone-500 block">Candid cinematography</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <span className="text-[10px] font-bold text-[#8E2848] uppercase block">Trousseau &amp; Favors (10%)</span>
                <span className="font-bold text-base text-[#8E2848]">₹{(favorsBudget / 100000).toFixed(1)}L</span>
                <span className="text-[10px] text-[#8E2848] block">Nutty Tales VIP Hampers</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Entertainment (5%)</span>
                <span className="font-bold text-base text-[#17233B]">₹{(miscBudget / 100000).toFixed(1)}L</span>
                <span className="text-[10px] text-stone-500 block">Sufi troupe, DJ, Sound</span>
              </div>
            </div>
          </div>

          {/* ── 3. Event Milestones & Vendors Needed ───────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Events Selection */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
                <span>3.</span> Events in Your Multi-Day Timeline
              </h3>
              <p className="text-xs text-stone-500">Select all ceremonies you plan to host:</p>
              <div className="space-y-2 text-xs">
                {[
                  'Roka & Engagement',
                  'Mehendi & Sangeet Night',
                  'Haldi Ceremony',
                  'Chooda & Kaleere / Pithi',
                  'Main Wedding Ceremony (Shaadi)',
                  'Royal Reception Dinner',
                  'Post-Wedding Sundowner / Brunch',
                ].map((ev) => (
                  <label
                    key={ev}
                    className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(ev)}
                      onChange={() => toggleEvent(ev)}
                      className="accent-[#8E2848] w-4 h-4"
                    />
                    <span className="font-medium text-stone-800">{ev}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vendor RFP Checklist */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
                <span>4.</span> Verified Vendors to Quote
              </h3>
              <p className="text-xs text-stone-500">We match vetted, insured vendors for these categories:</p>
              <div className="space-y-2 text-xs">
                {[
                  'Heritage Orchard / Palace Venue',
                  'Royal Kashmiri Wazwan / Multi-Cuisine Catering',
                  'Bespoke Dry Fruit Return Favors (Nutty Tales)',
                  'Cinematography & Candid Photography',
                  'Floral & Stage Scenography',
                  'Bridal Makeup & Hair Artists',
                  'Sufi Singers & Live Wedding Band',
                  'Chauffeur Fleet & Airport Transfers',
                ].map((ven) => (
                  <label
                    key={ven}
                    className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={neededVendors.includes(ven)}
                      onChange={() => toggleVendor(ven)}
                      className="accent-[#8E2848] w-4 h-4"
                    />
                    <span className="font-medium text-stone-800">{ven}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-800">
              {errorMsg}
            </div>
          )}

          {/* ── Submit Action ─────────────────────────────────────────────────── */}
          <div className="p-6 bg-[#2D1520] text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                ✦ Nutty Tales Wedding OS Guarantee
              </span>
              <h4 className="font-serif text-xl font-bold">
                Lock in Your Wedding Blueprint
              </h4>
              <p className="text-xs text-stone-300 font-light max-w-xl">
                Zero commitment required to initialize workspace. We return itemized vendor quotes and sample favor boxes to your doorstep.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap"
            >
              {isSubmitting ? 'Structuring Workspace...' : '⚡ Generate My Wedding Workspace →'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
