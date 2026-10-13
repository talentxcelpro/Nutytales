'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WeddingVendor, VendorPackage } from '@/lib/weddings/types'
import { getActiveProject, createEnquiry, addBudgetItem, logActivity } from '@/lib/weddings/storage'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function VendorDetailClient({ vendor }: { vendor: WeddingVendor }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState<VendorPackage | null>(
    vendor.packages[0] || null
  )
  const [showRfpModal, setShowRfpModal] = useState(false)
  const [rfpSubmitted, setRfpSubmitted] = useState(false)
  const [addedToWorkspace, setAddedToWorkspace] = useState(false)

  // RFP Form State
  const [coupleName, setCoupleName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [venueName, setVenueName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const formatPrice = (amt: number, curr: string) => {
    if (curr === 'INR') {
      if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)} Lakhs`
      return `₹${amt.toLocaleString('en-IN')}`
    }
    return `${curr} ${amt.toLocaleString()}`
  }

  const handleSendRfp = (e: React.FormEvent) => {
    e.preventDefault()
    const activeProject = getActiveProject()

    createEnquiry(activeProject.id, {
      vendorId: vendor.id,
      vendorName: vendor.businessName,
      category: vendor.category,
      targetDate: eventDate || activeProject.weddingDate,
      guestCount: activeProject.guestCount || 150,
      quoteAmount: selectedPackage ? selectedPackage.price : vendor.startingPrice,
      currency: vendor.currency,
      status: 'submitted',
      requirements: `Vendor RFP: ${selectedPackage ? selectedPackage.name : 'Custom Package'}. Location: ${venueName || activeProject.destination}. Phone: ${phone}. Email: ${email}. Notes: ${notes || 'Standard booking scope'}`,
    })

    setRfpSubmitted(true)
  }

  const handleAddToWorkspace = () => {
    const activeProject = getActiveProject()
    const price = selectedPackage ? selectedPackage.price : vendor.startingPrice
    const pkgTitle = selectedPackage ? selectedPackage.name : 'Standard Service'

    const budgetCat =
      vendor.category === 'planner' ? 'planner_fees' :
      vendor.category === 'catering' ? 'catering' :
      vendor.category === 'photography' ? 'photography' :
      vendor.category === 'decor' ? 'decor' :
      vendor.category === 'music' ? 'music' :
      vendor.category === 'transport' ? 'transport' :
      vendor.category === 'favors' ? 'trousseau_favors' :
      vendor.category === 'outfits' ? 'attire' :
      vendor.category === 'invitations' ? 'invitations' : 'other'

    addBudgetItem(activeProject.id, {
      category: budgetCat,
      title: `${vendor.businessName} (${pkgTitle})`,
      plannedAmount: price,
      estimatedCost: price,
      quotedAmount: price,
      contractedAmount: price,
      paidAmount: 0,
      paymentStatus: 'pending',
      vendorName: vendor.businessName,
      notes: `Service area: ${vendor.destination}. Verified vendor contract.`,
    })
    logActivity(
      activeProject.id,
      'Vendor Shortlisted',
      `Added ${vendor.businessName} to project budget`
    )
    setAddedToWorkspace(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] pb-24">
      {/* ── Breadcrumb & Top Bar ───────────────────────────────────────────── */}
      <div className="border-b border-stone-200 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#8E2848] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/vendors" className="hover:text-[#8E2848] transition-colors">
              Vendors
            </Link>
            <span>/</span>
            <span className="text-stone-400 capitalize">{vendor.category}</span>
            <span>/</span>
            <span className="text-stone-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {vendor.businessName}
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
              {addedToWorkspace ? '✓ Saved to Workspace' : '+ Shortlist'}
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
        {/* ── Header: Identity, Category & Pricing ─────────────────────────── */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
              {vendor.category.toUpperCase()} MASTER
            </span>
            {vendor.verified && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                <span>✓ Verified Industry Partner</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium">
              📍 {vendor.destination}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B] tracking-tight">
                {vendor.businessName}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-stone-600">
                <div className="flex items-center gap-1 font-bold text-[#8E2848]">
                  <span>★</span>
                  <span>{vendor.rating}</span>
                </div>
                <span>•</span>
                <span className="underline">{vendor.reviewsCount} verified event reviews</span>
                <span>•</span>
                <span className="text-stone-500">Based in {vendor.city}, {vendor.country}</span>
              </div>
            </div>

            <div className="text-left md:text-right bg-white p-4 rounded-2xl border border-stone-200 shadow-xs md:bg-transparent md:border-0 md:p-0 md:shadow-none">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block">
                Starting Package
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#8E2848]">
                From {formatPrice(vendor.startingPrice, vendor.currency)}
              </span>
              <span className="text-stone-400 text-xs block">
                {vendor.category === 'catering' ? 'Per Plate / Banqueting' : 'Full Wedding Package'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Portfolio Gallery ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
          <div className="md:col-span-3 relative aspect-[16/10] sm:aspect-[16/9] w-full">
            <Image
              src={vendor.portfolio[activeImageIndex] || vendor.portfolio[0] || '/images/wedding-celebration.jpg'}
              alt={vendor.businessName}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="flex md:flex-col gap-3 p-3 overflow-x-auto md:overflow-visible">
            {vendor.portfolio.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[16/10] w-28 md:w-full rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-[#8E2848] scale-102 shadow-md' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`${vendor.businessName} portfolio ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Content Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Biography & Philosophy */}
            <section className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                About {vendor.businessName}
              </h2>
              <p className="text-stone-600 leading-relaxed font-light text-base">
                {vendor.bio}
              </p>
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Specializations:</span>
                <span className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200">Destination Celebrations</span>
                <span className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200">Multi-Day Execution</span>
                <span className="px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200">Heritage Traditions</span>
              </div>
            </section>

            {/* Curated Package Tiers */}
            <section className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                    Available Package Tiers &amp; Inclusions
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Transparent pricing with itemized deliverable commitments.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {vendor.packages.map((pkg, idx) => {
                  const isSelected = selectedPackage?.name === pkg.name
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-[#8E2848] bg-[#FAF7F2] shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200/60">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E2848] block">
                            Tier 0{idx + 1}
                          </span>
                          <h3 className="font-serif text-lg font-bold text-[#17233B]">
                            {pkg.name}
                          </h3>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-serif text-2xl font-extrabold text-[#8E2848]">
                            {formatPrice(pkg.price, vendor.currency)}
                          </span>
                          <span className="text-[10px] text-stone-400 block">+ Applicable Taxes</span>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <span className="text-[11px] font-bold text-stone-700 block">
                          Included In This Package:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                          {pkg.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-700 font-bold">✓</span>
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          {/* ── Sidebar: Direct Quote & WhatsApp ─────────────────────────── */}
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-md space-y-6 sticky top-24">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
                  Bookings &amp; Inquiries
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B] mt-1">
                  Check Dates &amp; Quote
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Connect with the studio management team directly.
                </p>
              </div>

              {selectedPackage && (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 space-y-2 text-xs text-stone-600">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8E2848] block">
                    Selected Package
                  </span>
                  <p className="font-bold text-stone-800 text-sm">{selectedPackage.name}</p>
                  <p className="font-serif text-lg font-bold text-[#8E2848]">
                    {formatPrice(selectedPackage.price, vendor.currency)}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => setShowRfpModal(true)}
                  className="w-full py-3.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all text-center block"
                >
                  Request Official Quote
                </button>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales Weddings Concierge! We would like to inquire about booking ${vendor.businessName} (${vendor.category}) for our wedding. Please connect us with availability and packages.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#2D1520] hover:bg-[#3D1E2C] text-[#C9A45C] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all text-center flex items-center justify-center gap-2"
                >
                  <span>💬 Instant WhatsApp Inquiry</span>
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
                  {addedToWorkspace ? '✓ Saved to Wedding Budget' : '+ Add to Wedding Budget'}
                </button>
              </div>

              <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-400 space-y-1">
                <p>• Verified contracts &amp; escrow payment milestones</p>
                <p>• Backup team guarantee for day-of execution</p>
                <p>• Dedicated wedding concierge support</p>
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
                  Official Vendor Inquiry
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  {vendor.businessName}
                </h3>
                <p className="text-xs text-stone-500 capitalize">{vendor.category} · {vendor.destination}</p>
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
                  Vendor Request Logged!
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Your inquiry for {vendor.businessName} has been recorded in your wedding workspace and sent to the studio team. You will receive an official response and package confirmation within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setShowRfpModal(false)
                    setRfpSubmitted(false)
                  }}
                  className="px-6 py-2.5 bg-[#8E2848] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#721f39]"
                >
                  Return to Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendRfp} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Couple / Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya & Vikram"
                      value={coupleName}
                      onChange={(e) => setCoupleName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-1">
                      Event Date *
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

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Confirmed / Shortlisted Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jai Mahal Palace, Jaipur"
                    value={venueName}
                    onChange={(e) => setVenueName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  />
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
                    Event Vision &amp; Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Need 3 days of candid photography and 4K aerial drone coverage for Sangeet, Mehendi and Reception."
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
                    Send Inquiry
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
