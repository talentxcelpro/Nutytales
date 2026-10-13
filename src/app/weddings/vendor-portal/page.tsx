'use client'

import React, { useState } from 'react'
import { INITIAL_VENDORS } from '@/lib/weddings/data'
import { WeddingVendor } from '@/lib/weddings/types'

export default function VendorPortalPage() {
  const [selectedVendor] = useState<WeddingVendor>(INITIAL_VENDORS[0])
  const [quoteAmount, setQuoteAmount] = useState('480000')
  const [quoteSubmitted, setQuoteSubmitted] = useState(false)

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#17233B]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>🤝 VENDOR OPERATIONS CONSOLE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Vendor Partner Workspace
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Logged in as: <strong>{selectedVendor.businessName}</strong> ({selectedVendor.category.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            ✓ Verified Partner Guild
          </span>
        </div>
      </div>

      {/* ── Vendor Key Performance Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Incoming RFQs
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#17233B]">3 Leads</span>
          <p className="text-[11px] text-stone-500">Awaiting quotation submission</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Confirmed Bookings
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#8E2848]">4 Weddings</span>
          <p className="text-[11px] text-emerald-700 font-medium">Escrow deposits locked</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Settled Payouts
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#17233B]">₹14.2 Lakhs</span>
          <p className="text-[11px] text-stone-500">Disbursed via bank transfer</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Client Rating
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#C9A45C]">★ 4.98</span>
          <p className="text-[11px] text-stone-500">48 verified reviews</p>
        </div>
      </div>

      {/* ── Incoming RFP Queue ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-lg text-[#17233B]">
          Incoming Client Inquiries &amp; Quotation Requests
        </h3>

        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#8E2848]">ENQ-2026-9041</span>
                <h4 className="font-serif font-bold text-base text-[#17233B]">
                  Ananya &amp; Vikram (Jaipur Destination Celebration)
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                Under Review
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
              <p>Celebration Date: <strong>Nov 20, 2026</strong></p>
              <p>Attendance: <strong>250 Guests</strong></p>
              <p>Venue: <strong>The Jai Mahal Palace Lawns</strong></p>
            </div>

            <p className="text-stone-600 font-light leading-relaxed">
              &quot;Seeking complete turnkey day-of run-of-show orchestration, multi-day coordination, and stage management.&quot;
            </p>

            {quoteSubmitted ? (
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-800 font-semibold text-center">
                ✓ Formal Proposal Submitted (₹{Number(quoteAmount).toLocaleString('en-IN')})
              </div>
            ) : (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="font-bold text-stone-700">Quote Amount:</span>
                  <input
                    type="number"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="bg-white border border-stone-300 rounded-lg p-2 font-bold text-xs"
                  />
                </div>
                <button
                  onClick={() => setQuoteSubmitted(true)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#8E2848] text-white rounded-xl font-bold uppercase tracking-wider"
                >
                  Submit Formal Quotation →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
