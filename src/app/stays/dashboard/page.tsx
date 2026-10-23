'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { STAY_PROPERTIES } from '@/lib/stays-data'

export default function StaysDashboardPage() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'calendar' | 'pricing' | 'performance'>('reservations')
  const [blackoutDates, setBlackoutDates] = useState<string[]>(['2026-11-20', '2026-11-21', '2026-11-22'])
  const [newBlackoutDate, setNewBlackoutDate] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleAddBlackout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBlackoutDate || blackoutDates.includes(newBlackoutDate)) return
    setBlackoutDates([...blackoutDates, newBlackoutDate])
    setNewBlackoutDate('')
    setToastMessage(`Date ${newBlackoutDate} blocked on availability calendar.`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleRemoveBlackout = (d: string) => {
    setBlackoutDates(blackoutDates.filter((date) => date !== d))
    setToastMessage(`Date ${d} unblocked and opened for booking.`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E2D9] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>📊 NUTY TALES STAYS — HOST OPERATIONS CENTER</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Hospitality Operations &amp; Occupancy Command
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Live room nights, average daily rate (ADR), RevPAR, blackout calendar editor, and concierge upsells.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/stays/hosts"
            className="px-5 py-2.5 bg-[#176B68] hover:bg-[#125350] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all"
          >
            + Onboard New Listing
          </Link>
          <Link
            href="/stays/group-quote"
            className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b89347] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all"
          >
            + Private Buyout Desk
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold animate-fadeIn">
          ✓ {toastMessage}
        </div>
      )}

      {/* ── 1. Top KPI Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E7E2D9] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
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

        <div className="bg-white rounded-3xl p-6 border border-[#E7E2D9] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Average Occupancy Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              84.2%
            </span>
            <span className="text-emerald-700 font-bold text-xs">High Season</span>
          </div>
          <p className="text-[11px] text-stone-500">Peak autumn harvest &amp; winter snow demand</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E7E2D9] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Average Daily Rate (ADR)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              ₹12,450
            </span>
            <span className="text-blue-700 font-bold text-xs">RevPAR: ₹10,480</span>
          </div>
          <p className="text-[11px] text-stone-500">Curated orchard estate &amp; ski suites</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E7E2D9] shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
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

      {/* ── Tabs Navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        {[
          { id: 'reservations', label: 'Active Reservations & Concierge Dispatch' },
          { id: 'calendar', label: 'Availability & Blackout Calendar' },
          { id: 'pricing', label: 'Pricing & Seasonal Multipliers' },
          { id: 'performance', label: 'Listing Quality & Reviews' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-[#17233B] text-white shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 2. Live Reservations Pipeline ─────────────────────────────────────── */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#17233B]">
                Confirmed Arrivals &amp; Concierge Dispatch
              </h3>
              <p className="text-xs text-stone-500">
                Arrivals across Harwan Orchard Villa, Noida Corporate Suites, and Dal Lake Houseboats.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
              4 Upcoming Check-ins This Week
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest / Corporate Group</th>
                  <th className="py-3 px-4">Property &amp; Suite</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Tariff Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Concierge Service</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr className="hover:bg-stone-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">NT-STAY-2026-6401</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#17233B]">Dr. Sanjeev Kapoor &amp; Party</div>
                    <div className="text-[10px] text-stone-400">Delhi Medical Delegation (4 Guests)</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">The Harwan Royal Walnut Orchard Estate</td>
                  <td className="py-3.5 px-4">Nov 10 - Nov 14 (4 Nts)</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#176B68]">₹53,232</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Confirmed
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-[#176B68]">
                    Walnut Harvest Tour
                  </td>
                </tr>

                <tr className="hover:bg-stone-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">NT-STAY-2026-6188</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#17233B]">McKinsey Leadership Offsite</div>
                    <div className="text-[10px] text-stone-400">Executive Strategy Session (14 Guests)</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">Harwan Complete Estate Buyout</td>
                  <td className="py-3.5 px-4">Nov 18 - Nov 21 (3 Nts)</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#176B68]">₹2,10,000</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                      Buyout Locked
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-stone-600">
                    Master Chef Wazwan Feast
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 3. Availability & Blackout Calendar Tab ─────────────────────────── */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Blackout Dates &amp; Calendar Synchronization
            </h3>
            <p className="text-xs text-stone-500">
              Block dates for private host use, maintenance, or wedding exclusive reservations. Blocked dates cannot be double-booked by guests.
            </p>
          </div>

          {/* Add Blackout Form */}
          <form onSubmit={handleAddBlackout} className="flex gap-3 max-w-md">
            <input
              type="date"
              required
              value={newBlackoutDate}
              onChange={(e) => setNewBlackoutDate(e.target.value)}
              className="p-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-bold text-stone-800"
            />
            <button
              type="submit"
              className="py-2.5 px-5 bg-[#17233B] hover:bg-[#1E3048] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
            >
              Block Date
            </button>
          </form>

          {/* Blocked Dates Chips */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Currently Blocked Dates ({blackoutDates.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {blackoutDates.map((date) => (
                <div
                  key={date}
                  className="px-3 py-1.5 bg-stone-100 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-2 border border-stone-200"
                >
                  <span>🔒 {date}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlackout(date)}
                    className="text-stone-400 hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Pricing & Seasonal Multipliers Tab ─────────────────────────────── */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-8 shadow-xs space-y-6 text-xs text-stone-700">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Dynamic Pricing &amp; Seasonal Rules
            </h3>
            <p className="text-stone-500">
              Set automated peak multipliers based on harvest seasonality, ski snow conditions, and weekend demand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Peak Autumn Multiplier</span>
              <span className="font-mono text-2xl font-black text-[#17233B]">1.25x</span>
              <p className="text-[11px] text-stone-500">Active during October - November (Walnut &amp; Saffron harvest)</p>
            </div>

            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Ski Season Multiplier</span>
              <span className="font-mono text-2xl font-black text-[#17233B]">1.35x</span>
              <p className="text-[11px] text-stone-500">Active during December - February (Powder snow Gulmarg)</p>
            </div>

            <div className="p-5 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Off-Peak Rebate</span>
              <span className="font-mono text-2xl font-black text-[#176B68]">0.85x</span>
              <p className="text-[11px] text-stone-500">Automatic 15% incentive applied to maintain occupancy</p>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Performance Tab ───────────────────────────────────────────────── */}
      {activeTab === 'performance' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#17233B]">
            Portfolio Listing Quality &amp; Reviews Audit
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {STAY_PROPERTIES.slice(0, 4).map((p) => (
              <div key={p.id} className="p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between items-start">
                  <strong className="text-sm text-[#17233B]">{p.name}</strong>
                  <span className="text-amber-500 font-bold">★ {p.rating}</span>
                </div>
                <p className="text-stone-500 text-[11px]">📍 {p.city} · {p.reviewsCount} verified reviews</p>
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    Superhost Qualified
                  </span>
                  <span className="text-stone-400">99% response rate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
