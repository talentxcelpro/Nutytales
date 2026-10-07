'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function StaysDashboardPage() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'occupancy' | 'properties'>('reservations')

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>🏔️ NUTTY TALES STAYS — HOSPITALITY DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Hospitality Operations &amp; Occupancy Command Center
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Live room nights, average daily rate (ADR), RevPAR, concierge experience upsells, and private buyouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/stays/group-quote"
            className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + Private Buyout Quote
          </Link>
          <Link
            href="/stays/hosts"
            className="px-5 py-2.5 bg-[#176B68] hover:bg-[#125350] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + Onboard Property
          </Link>
        </div>
      </div>

      {/* ── 1. Top KPI Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Hospitality GMV (This Month)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              ₹24.6 Lakhs
            </span>
            <span className="text-emerald-700 font-bold text-xs">+19.2%</span>
          </div>
          <p className="text-[11px] text-stone-500">Across 32 confirmed reservations</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Average Occupancy Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              84.2%
            </span>
            <span className="text-emerald-700 font-bold text-xs">High Season</span>
          </div>
          <p className="text-[11px] text-stone-500">Peak autumn walnut harvest demand</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Average Daily Rate (ADR)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              ₹9,450
            </span>
            <span className="text-blue-700 font-bold text-xs">RevPAR: ₹7,950</span>
          </div>
          <p className="text-[11px] text-stone-500">Premium orchard suite pricing</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Concierge Experience GMV
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              ₹5.8 Lakhs
            </span>
            <span className="text-stone-500 text-xs font-normal">Add-on Revenue</span>
          </div>
          <p className="text-[11px] text-stone-500">Wazwan banquets, shikaras, 4x4 convoys</p>
        </div>
      </div>

      {/* ── 2. Live Reservations Pipeline ─────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Live Stays Reservations &amp; Concierge Dispatch
            </h3>
            <p className="text-xs text-stone-500">
              Arrivals across Harwan Orchard Villa, Noida Corporate Suites, and Dal Lake Houseboats.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            6 Upcoming Check-ins
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF6EE] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Guest / Corporate Group</th>
                <th className="py-3 px-4">Property &amp; Suite</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Tariff Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Concierge Pack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">STAY-2026-640</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Dr. Sanjeev Kapoor &amp; Party</div>
                  <div className="text-[10px] text-stone-400">Delhi Medical Delegation (8 Guests)</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Harwan Orchard Master Suite (Srinagar)</td>
                <td className="py-3.5 px-4">Oct 24 - Oct 28 (4 Nts)</td>
                <td className="py-3.5 px-4 font-bold text-[#176B68]">₹74,000</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Confirmed
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-[#176B68]">
                  4x4 Convoy Ready
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">STAY-2026-618</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">McKinsey Leadership Offsite</div>
                  <div className="text-[10px] text-stone-400">Executive Strategy Session (14 Guests)</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Complete Estate Buyout (4 Acres)</td>
                <td className="py-3.5 px-4">Nov 04 - Nov 07 (3 Nts)</td>
                <td className="py-3.5 px-4 font-bold text-[#176B68]">₹2,10,000</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Buyout Locked
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-stone-600">
                  Chef Wazwan Feast
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
