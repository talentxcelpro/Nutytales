'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function TravelDashboardPage() {
  const [activeTab, setActiveTab] = useState<'trips' | 'dmcs' | 'experiences'>('trips')

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>✈️ NUTTY TALES TRAVEL — OPERATIONS DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Travel Operations &amp; DMC Dispatch Command Center
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Active expedition tracking, private fleet assignments, licensed mountain guides, and DMC partner revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/travel/builder"
            className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + Build New Itinerary
          </Link>
        </div>
      </div>

      {/* ── 1. Top KPI Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Travel Bookings GMV
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0E3A43]">
              ₹54.2 Lakhs
            </span>
            <span className="text-emerald-700 font-bold text-xs">+36.4%</span>
          </div>
          <p className="text-[11px] text-stone-500">Autumn &amp; winter departures</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Trips In-Flight / Scheduled
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0E3A43]">
              24 Expeditions
            </span>
            <span className="text-blue-700 font-bold text-xs">100% Chauffeur Locked</span>
          </div>
          <p className="text-[11px] text-stone-500">Srinagar, Gulmarg, Pahalgam, Leh</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Verified DMC &amp; Fleet Partners
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0E3A43]">
              18 DMCs
            </span>
            <span className="text-emerald-700 font-bold text-xs">Licensed</span>
          </div>
          <p className="text-[11px] text-stone-500">45+ luxury 4x4 vehicles &amp; alpine guides</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Guest Satisfaction Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0E3A43]">
              4.96 / 5.0
            </span>
            <span className="text-stone-500 text-xs font-normal">140+ Reviews</span>
          </div>
          <p className="text-[11px] text-stone-500">Zero safety or weather delays</p>
        </div>
      </div>

      {/* ── 2. Live Trips Pipeline ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Active Itineraries &amp; Departure Roster
            </h3>
            <p className="text-xs text-stone-500">
              Live status across Toyota Fortuner 4x4 fleets and partner boutique stays.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            4 Currently on Route
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF6EE] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Trip Ref</th>
                <th className="py-3 px-4">Lead Traveler</th>
                <th className="py-3 px-4">Route &amp; Duration</th>
                <th className="py-3 px-4">Travelers</th>
                <th className="py-3 px-4">Vehicle Assigned</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Concierge Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#0E3A43]">TRV-2026-720</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Rohit Narang &amp; Family</div>
                  <div className="text-[10px] text-stone-400">Delhi NCR</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Srinagar → Gulmarg → Pahalgam (6 Days)</td>
                <td className="py-3.5 px-4 font-bold">4 Guests</td>
                <td className="py-3.5 px-4">Innova Crysta #JK01-9921</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Day 3 (Gulmarg Phase 2)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[#176B68] font-bold">Driver Live GPS</span>
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#0E3A43]">TRV-2026-698</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Elena Rostova &amp; Partner</div>
                  <div className="text-[10px] text-stone-400">London, UK</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Kashmir Autumn Heritage &amp; Craft Tour (8 Days)</td>
                <td className="py-3.5 px-4 font-bold">2 Guests</td>
                <td className="py-3.5 px-4">Toyota Fortuner 4x4 #JK01-4110</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Completed
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-emerald-700 font-bold">Review 5.0 ★</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
