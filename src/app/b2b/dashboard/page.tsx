'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { B2B_COMMODITIES } from '@/lib/b2b-data'

export default function B2BDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'orders' | 'suppliers'>('overview')

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>🏢 NUTY TALES BUSINESS — OPERATING DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            B2B Procurement &amp; Supplier Command Center
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Real-time pipeline, active RFQs, wholesale contract execution, and verified supplier matchmaking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/b2b/rfq"
            className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + Create New RFQ
          </Link>
          <Link
            href="/business/join"
            className="px-5 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + Onboard Supplier
          </Link>
        </div>
      </div>

      {/* ── 1. Top KPI Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Sourcing GMV (This Month)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              ₹48.6 Lakhs
            </span>
            <span className="text-emerald-700 font-bold text-xs">+18.4%</span>
          </div>
          <p className="text-[11px] text-stone-500">Across 14 institutional purchase orders</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Active RFQ Volume
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              22,400 kg
            </span>
            <span className="text-blue-700 font-bold text-xs">8 Deals</span>
          </div>
          <p className="text-[11px] text-stone-500">Pending quote sign-off &amp; lab sampling</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Vetted Suppliers
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              34 Entities
            </span>
            <span className="text-emerald-700 font-bold text-xs">100% FSSAI</span>
          </div>
          <p className="text-[11px] text-stone-500">Kashmir, Patna &amp; NCR sorting facilities</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Average Order Fulfillment
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              38.5 Hours
            </span>
            <span className="text-stone-500 text-xs font-normal">SLA: 48h</span>
          </div>
          <p className="text-[11px] text-stone-500">Direct pallet &amp; reefer truck dispatch</p>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-semibold">
        {(['overview', 'rfqs', 'orders', 'suppliers'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab
                ? 'border-[#176B68] text-[#176B68] font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── 3. Active RFQs & Procurement Inquiries ────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Live Procurement Requests &amp; Commercial Pipeline
            </h3>
            <p className="text-xs text-stone-500">
              Direct institutional requirements matched against vetted processing hubs.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
            8 Pending Action
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF6EE] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">RFQ Ref</th>
                <th className="py-3 px-4">Buyer Organization</th>
                <th className="py-3 px-4">Commodity / Specification</th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">Target Hub</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">RFQ-2026-904</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">The Oberoi Hospitality Group</div>
                  <div className="text-[10px] text-stone-400">Delhi NCR Central Kitchen</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium">Kashmiri Mamra Almonds</div>
                  <div className="text-[10px] text-stone-400">Whole Giri · Moisture &lt;4.2%</div>
                </td>
                <td className="py-3.5 px-4 font-bold">1,500 kg</td>
                <td className="py-3.5 px-4">Noida Central Hub</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Quote Issued
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href="/b2b/quotes"
                    className="text-[#176B68] font-bold hover:underline"
                  >
                    View Proforma →
                  </Link>
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">RFQ-2026-882</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Artisan Patisserie &amp; Bakes</div>
                  <div className="text-[10px] text-stone-400">Bengaluru Production Facility</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium">California Blanched Almond Slices</div>
                  <div className="text-[10px] text-stone-400">0.8mm uniform cut</div>
                </td>
                <td className="py-3.5 px-4 font-bold">3,000 kg</td>
                <td className="py-3.5 px-4">Noida Mechanical Hub</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Lab Sampling
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href="/b2b/quotes"
                    className="text-[#176B68] font-bold hover:underline"
                  >
                    COA Report →
                  </Link>
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">RFQ-2026-845</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Haldiram Mithai &amp; Snacks Ltd</div>
                  <div className="text-[10px] text-stone-400">Nagpur Plant</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium">Jumbo Phool Makhana (6+ Sutra)</div>
                  <div className="text-[10px] text-stone-400">Optical sorted · Handpicked</div>
                </td>
                <td className="py-3.5 px-4 font-bold">5,000 kg</td>
                <td className="py-3.5 px-4">Patna Depot</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Negotiation
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href="/b2b/quotes"
                    className="text-[#176B68] font-bold hover:underline"
                  >
                    Counter Quote →
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Live Commodity Inventory Levels ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {B2B_COMMODITIES.slice(0, 3).map((comm) => (
          <div
            key={comm.id}
            className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#704B32] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {comm.category}
              </span>
              <span className="font-mono text-[10px] text-stone-400">{comm.code}</span>
            </div>

            <div>
              <h4 className="font-serif text-base font-bold text-[#17233B]">{comm.name}</h4>
              <p className="text-[11px] text-stone-500">{comm.origin}</p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Warehouse Stock:</span>
                <span className="font-bold text-[#17233B]">{comm.inStockKg.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tier 1 MOQ Price:</span>
                <span className="font-bold text-[#176B68]">₹{comm.tierPrices.tier1.pricePerKg}/kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Container Price:</span>
                <span className="font-bold text-emerald-700">₹{comm.tierPrices.container.pricePerKg}/kg</span>
              </div>
            </div>

            <Link
              href="/b2b/rfq"
              className="w-full block py-2 text-center text-xs font-bold uppercase tracking-wider bg-[#FAF6EE] hover:bg-[#17233B] text-[#17233B] hover:text-white rounded-xl transition-colors border border-stone-200"
            >
              Order Allocation →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
