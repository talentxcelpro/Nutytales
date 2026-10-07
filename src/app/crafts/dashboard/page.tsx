'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function CraftsDashboardPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wholesale' | 'guilds'>('wholesale')

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>🧣 NUTTY TALES CRAFTS — MARKETPLACE DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Crafts Marketplace &amp; Artisan Guild Command Center
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Global fashion GMV, wholesale consignment tracking, GI tag provenance audits, and international export volume.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/crafts/wholesale"
            className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + Create Wholesale RFQ
          </Link>
        </div>
      </div>

      {/* ── 1. Top KPI Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Crafts Marketplace GMV
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              ₹41.2 Lakhs
            </span>
            <span className="text-emerald-700 font-bold text-xs">+28.5%</span>
          </div>
          <p className="text-[11px] text-stone-500">Retail luxury &amp; wholesale exports</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            B2B Wholesale Share
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              64%
            </span>
            <span className="text-blue-700 font-bold text-xs">Boutique Orders</span>
          </div>
          <p className="text-[11px] text-stone-500">UK, UAE &amp; US retail consignments</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Active Artisan Guilds
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              14 Guilds
            </span>
            <span className="text-emerald-700 font-bold text-xs">100% GI Tagged</span>
          </div>
          <p className="text-[11px] text-stone-500">120+ registered master weavers</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            International Air Shipments
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              86 Consignments
            </span>
            <span className="text-stone-500 text-xs font-normal">Duty Paid</span>
          </div>
          <p className="text-[11px] text-stone-500">London, Dubai, New York, Zurich</p>
        </div>
      </div>

      {/* ── 2. Active Wholesale Pipeline ──────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Live Wholesale Consignments &amp; Guild Production
            </h3>
            <p className="text-xs text-stone-500">
              Handloom progress across Kanihama, Zadibal, and Charar-i-Sharief master weaving centers.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
            5 In Flight
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF6EE] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Consignment ID</th>
                <th className="py-3 px-4">Boutique / Buyer</th>
                <th className="py-3 px-4">Craft &amp; Weave</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">CRFT-2026-512</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">The Royal Cashmere Gallery</div>
                  <div className="text-[10px] text-stone-400">Mayfair, London, UK</div>
                </td>
                <td className="py-3.5 px-4 font-medium">GI Changthangi Kani Pashmina Shawls</td>
                <td className="py-3.5 px-4 font-bold">75 Pieces</td>
                <td className="py-3.5 px-4">London Heathrow Hub</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Loom Weaving (80%)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-[#176B68] font-bold">GI-JK-2026-88</span>
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">CRFT-2026-499</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Maison de L&apos;Orient</div>
                  <div className="text-[10px] text-stone-400">Downtown Dubai, UAE</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Aari Velvet Embroidered Long Coats</td>
                <td className="py-3.5 px-4 font-bold">40 Pieces</td>
                <td className="py-3.5 px-4">Dubai DIFC</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Dispatched (Air)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-emerald-700 font-bold">DHL 9821-44</span>
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">CRFT-2026-476</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Aman Resorts Gift Pavilion</div>
                  <div className="text-[10px] text-stone-400">Jaipur &amp; Ranthambore</div>
                </td>
                <td className="py-3.5 px-4 font-medium">Fine Cashmere Natural Tone Stoles</td>
                <td className="py-3.5 px-4 font-bold">120 Pieces</td>
                <td className="py-3.5 px-4">Jaipur Property Hub</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Delivered
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-stone-500 font-bold">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
