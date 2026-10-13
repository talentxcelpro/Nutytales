'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { INITIAL_VENDORS } from '@/lib/weddings/data'
import { WeddingVendor, VendorCategory } from '@/lib/weddings/types'
import { getActiveProject, getProjectEvents, createEnquiry, addBudgetItem } from '@/lib/weddings/storage'

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'planner', label: 'Wedding Planners' },
  { id: 'catering', label: 'Wazwan & Catering' },
  { id: 'photography', label: 'Photo & Cinema' },
  { id: 'decor', label: 'Floral & Decor' },
  { id: 'favors', label: 'Gifts & Favors' },
  { id: 'music', label: 'Music & Bands' },
]

export default function VendorsMarketplaceClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDestination, setSelectedDestination] = useState<string>('all')
  const [activeVendorModal, setActiveVendorModal] = useState<WeddingVendor | null>(null)

  // Inquiry form states
  const [selectedEventId, setSelectedEventId] = useState<string>('')
  const [inquiryGuests, setInquiryGuests] = useState<number>(250)
  const [inquiryNotes, setInquiryNotes] = useState<string>('')
  const [inquirySuccess, setInquirySuccess] = useState<boolean>(false)

  const project = getActiveProject()
  const events = getProjectEvents(project.id)

  const filteredVendors = INITIAL_VENDORS.filter((v) => {
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false
    if (selectedDestination !== 'all' && !v.destination.toLowerCase().includes(selectedDestination.toLowerCase())) {
      return false
    }
    return true
  })

  const handleSubmitProposalRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeVendorModal) return

    const selectedEvt = events.find((ev) => ev.id === selectedEventId)

    createEnquiry(project.id, {
      vendorId: activeVendorModal.id,
      vendorName: activeVendorModal.businessName,
      eventId: selectedEventId || undefined,
      eventTitle: selectedEvt ? selectedEvt.title : 'General Celebration',
      category: activeVendorModal.category,
      targetDate: selectedEvt ? selectedEvt.date : project.weddingDate,
      guestCount: inquiryGuests,
      requirements: inquiryNotes || 'Bespoke celebration quotation required.',
      quoteAmount: activeVendorModal.startingPrice,
      currency: activeVendorModal.currency,
      status: 'under_review',
    })

    // Also add to workspace budget as an estimated quotation item
    addBudgetItem(project.id, {
      category: activeVendorModal.category === 'planner' ? 'planner_fees' : activeVendorModal.category === 'favors' ? 'trousseau_favors' : (activeVendorModal.category as any),
      title: `${activeVendorModal.businessName} (Proposal Requested)`,
      plannedAmount: activeVendorModal.startingPrice,
      estimatedCost: activeVendorModal.startingPrice,
      quotedAmount: activeVendorModal.startingPrice,
      contractedAmount: 0,
      paidAmount: 0,
      vendorName: activeVendorModal.businessName,
      paymentStatus: 'pending',
      notes: `Event: ${selectedEvt?.title || 'General'} | Requirements: ${inquiryNotes || 'None'}`,
    })

    setInquirySuccess(true)
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-[#17233B]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-stone-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>🤝 VERIFIED VENDOR ECOSYSTEM</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          Global Wedding Vendors Directory
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Direct access to vetted master chefs, award-winning cinematographers, heritage decorators, and turnkey wedding planners. Transparent packages and structured RFP tracking.
        </p>
      </div>

      {/* ── Category Tabs ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#8E2848] text-white shadow-xs font-bold'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Destination Filter ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">Filter Location:</span>
          <select
            aria-label="Filter vendors by location"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
          >
            <option value="all">Pan-India &amp; International</option>
            <option value="jaipur">Jaipur / Rajasthan</option>
            <option value="kashmir">Srinagar / Kashmir</option>
            <option value="delhi">Delhi NCR</option>
            <option value="dubai">Dubai &amp; GCC</option>
          </select>
        </div>

        <span>
          Showing <strong>{filteredVendors.length}</strong> verified vendor collectives
        </span>
      </div>

      {/* ── Vendors Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & Badges */}
              <div className="relative aspect-[16/10] w-full bg-stone-100">
                <Image
                  src={vendor.portfolio[0] || '/images/wedding-celebration.jpg'}
                  alt={vendor.businessName}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#2D1520] text-[#C9A45C] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {vendor.category.toUpperCase()}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#17233B] shadow-xs flex items-center gap-1">
                  <span>★</span>
                  <span>{vendor.rating}</span>
                  <span className="text-stone-400 font-normal">({vendor.reviewsCount})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#17233B] line-clamp-1">
                    {vendor.businessName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                    <span>📍 {vendor.destination}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">✓ Verified Partner</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-light line-clamp-3 leading-relaxed">
                  {vendor.bio}
                </p>

                {/* Packages Pill Preview */}
                <div className="space-y-1.5 bg-stone-50 p-3 rounded-2xl text-xs">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">
                    Featured Service Package
                  </span>
                  {vendor.packages.length > 0 ? (
                    <div>
                      <strong className="text-stone-800 block text-xs">{vendor.packages[0].name}</strong>
                      <span className="text-[11px] text-[#8E2848] font-bold">
                        ₹{vendor.packages[0].price.toLocaleString('en-IN')} (Starting)
                      </span>
                    </div>
                  ) : (
                    <span className="text-stone-500">Customized pricing per event</span>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Starting Rate</span>
                    <span className="font-serif text-lg font-bold text-[#8E2848]">
                      ₹{vendor.startingPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-500">
                    Response: &lt;4 Hours
                  </span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setActiveVendorModal(vendor)
                  setInquirySuccess(false)
                }}
                className="w-full py-3 bg-[#17233B] hover:bg-[#8E2848] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs text-center"
              >
                Request Quotation &amp; Align Event →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Vendor Inquiry & Event Alignment Modal ────────────────────────────── */}
      {activeVendorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
                  Formal RFP Submission
                </span>
                <h3 className="font-serif text-xl font-bold text-[#17233B]">
                  {activeVendorModal.businessName}
                </h3>
                <p className="text-xs text-stone-500">
                  {activeVendorModal.category.toUpperCase()} · {activeVendorModal.destination}
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveVendorModal(null)
                  setInquirySuccess(false)
                }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {inquirySuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <span className="text-3xl block">✓</span>
                <h4 className="font-serif font-bold text-base text-emerald-900">
                  Quotation Request Recorded!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your RFP has been logged in your <strong>Wedding Workspace</strong> under Vendors &amp; Budget. {activeVendorModal.businessName} has received your event parameters and will submit their formal quotation.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/workspace"
                    className="px-5 py-2.5 bg-[#8E2848] text-white rounded-xl text-xs font-bold uppercase"
                  >
                    Open Workspace →
                  </Link>
                  <button
                    onClick={() => setActiveVendorModal(null)}
                    className="px-5 py-2.5 bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitProposalRequest} className="space-y-4">
                {/* Select Event Association */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Associate with Wedding Event
                  </label>
                  <select
                    aria-label="Associate with wedding event"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs font-semibold text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  >
                    <option value="">General Wedding Requirement</option>
                    {events.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.date} · {ev.expectedGuests} Guests)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Expected Attendance</label>
                    <input
                      type="number"
                      value={inquiryGuests}
                      onChange={(e) => setInquiryGuests(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Starting Rate Indication</label>
                    <input
                      type="text"
                      disabled
                      value={`₹${activeVendorModal.startingPrice.toLocaleString('en-IN')}`}
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl p-2.5 font-bold text-[#8E2848]"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-stone-700 block">
                    Specific Requirements or Inclusions
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    placeholder="e.g. Need 4 candid cinema shooters, same-day social media edit, and drone coverage over palace grounds."
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Submit RFP to {activeVendorModal.businessName} →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
