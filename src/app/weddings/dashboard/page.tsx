'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function WeddingsDashboardPage() {
  const [activeTab, setActiveTab] = useState<'weddings' | 'vendors' | 'milestones'>('weddings')

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>💍 NUTTY TALES WEDDINGS — OPERATING DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Wedding Planning &amp; Vendor Command Center
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Active wedding pipelines, escrow milestone payments, vendor confirmations, and countdown timelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/weddings/workspace"
            className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + New Wedding Workspace
          </Link>
        </div>
      </div>

      {/* ── 1. Top KPI Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Wedding Pipeline GMV
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              ₹1.85 Cr
            </span>
            <span className="text-emerald-700 font-bold text-xs">+32%</span>
          </div>
          <p className="text-[11px] text-stone-500">Across 6 active destination weddings</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Favors &amp; Hampers Booked
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              2,150 Units
            </span>
            <span className="text-rose-700 font-bold text-xs">Laser Monogram</span>
          </div>
          <p className="text-[11px] text-stone-500">Nutty Tales VIP trousseau collections</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Confirmed Vendor RFPs
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              28 Contracts
            </span>
            <span className="text-emerald-700 font-bold text-xs">Escrow Secured</span>
          </div>
          <p className="text-[11px] text-stone-500">Venues, wazwan chefs, cinema crews</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Upcoming Ceremonies
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              14 Days
            </span>
            <span className="text-stone-500 text-xs font-normal">Next: Nov 2026</span>
          </div>
          <p className="text-[11px] text-stone-500">Srinagar Orchard Villa &amp; Dal Lake</p>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-semibold">
        {(['weddings', 'vendors', 'milestones'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab
                ? 'border-[#8E2848] text-[#8E2848] font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── 3. Active Weddings Pipeline ───────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Active Wedding Workspaces &amp; Production Milestones
            </h3>
            <p className="text-xs text-stone-500">
              Real-time planning milestones, vendor lock-ins, and trousseau favor dispatch dates.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-rose-100 text-[#8E2848] rounded-full">
            6 Active Weddings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF6EE] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Workspace ID</th>
                <th className="py-3 px-4">Couple &amp; Destination</th>
                <th className="py-3 px-4">Wedding Date</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-4 text-right">Concierge SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#2D1520]">WED-2026-104</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Ananya &amp; Vikram</div>
                  <div className="text-[10px] text-stone-400">Srinagar Orchard Villa &amp; Shikara Banquet</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Nov 15, 2026</td>
                <td className="py-3.5 px-4 font-bold">350 Guests</td>
                <td className="py-3.5 px-4 font-bold text-[#8E2848]">₹45 Lakhs</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Vendors Locked
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-stone-600">
                  Favors in Print
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#2D1520]">WED-2026-098</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Meera &amp; Siddharth</div>
                  <div className="text-[10px] text-stone-400">Jaipur Heritage Palace</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Dec 02, 2026</td>
                <td className="py-3.5 px-4 font-bold">600 Guests</td>
                <td className="py-3.5 px-4 font-bold text-[#8E2848]">₹75 Lakhs</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Escrow Confirmed
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-emerald-700">
                  Trousseau Packed
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#2D1520]">WED-2026-081</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Pooja &amp; Zayd</div>
                  <div className="text-[10px] text-stone-400">Dubai Palm Jumeirah &amp; Desert Dunes</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Jan 18, 2027</td>
                <td className="py-3.5 px-4 font-bold">250 Guests</td>
                <td className="py-3.5 px-4 font-bold text-[#8E2848]">AED 180,000</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Venue Finalizing
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-stone-600">
                  Concierge Review
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
