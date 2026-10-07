'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function GiftingDashboardPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'recipients' | 'invoices'>('campaigns')

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>🎁 NUTTY TALES GIFTING — CORPORATE OPERATIONS</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Gifting Operations &amp; Fulfillment Command Center
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Corporate accounts, multi-recipient tracking, custom packaging production, and GST tax billing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gifting/recipients"
            className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            + New Gifting Campaign
          </Link>
        </div>
      </div>

      {/* ── 1. Top KPI Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Gifting GMV (Season 2026)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              ₹32.8 Lakhs
            </span>
            <span className="text-emerald-700 font-bold text-xs">+24.1%</span>
          </div>
          <p className="text-[11px] text-stone-500">Across 18 enterprise corporate contracts</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Hampers Dispatched
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              1,840 Boxes
            </span>
            <span className="text-emerald-700 font-bold text-xs">99.4% On-Time</span>
          </div>
          <p className="text-[11px] text-stone-500">Bluedart &amp; DHL Express tracking</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            Active Corporate Accounts
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              42 Clients
            </span>
            <span className="text-blue-700 font-bold text-xs">Tier 1 MNCs</span>
          </div>
          <p className="text-[11px] text-stone-500">KPMG, Google, Peak XV, Tech Mahindra</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
            International Recipients
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              214 Boxes
            </span>
            <span className="text-stone-500 text-xs font-normal">UAE, UK, US</span>
          </div>
          <p className="text-[11px] text-stone-500">Duty-paid international air freight</p>
        </div>
      </div>

      {/* ── 2. Navigation Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-stone-200 text-xs font-semibold">
        {(['campaigns', 'recipients', 'invoices'] as const).map((tab) => (
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

      {/* ── 3. Active Corporate Campaigns ─────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Corporate Gifting Campaigns in Production
            </h3>
            <p className="text-xs text-stone-500">
              Live fulfillment status across Noida central packaging hub &amp; air courier networks.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            4 Active Campaigns
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF6EE] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Campaign ID</th>
                <th className="py-3 px-4">Client Organization</th>
                <th className="py-3 px-4">Hamper Specification</th>
                <th className="py-3 px-4">Recipients</th>
                <th className="py-3 px-4">Budget Total</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Dispatch SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">GIFT-2026-401</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Peak XV Partners India</div>
                  <div className="text-[10px] text-stone-400">Founder &amp; LP Diwali Hamper</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium">Royal Saffron &amp; Walnut Lacquer Box</div>
                  <div className="text-[10px] text-stone-400">Laser-engraved gold monogram</div>
                </td>
                <td className="py-3.5 px-4 font-bold">250 Boxes</td>
                <td className="py-3.5 px-4 font-bold text-[#176B68]">₹8,45,000</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                    In Production
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-stone-600">
                  Oct 18, 2026
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">GIFT-2026-388</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">KPMG Global Services</div>
                  <div className="text-[10px] text-stone-400">Senior Leadership Recognition</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium">Kashmir Valley Heritage Hamper</div>
                  <div className="text-[10px] text-stone-400">Organic acacia honey + Mamra almonds</div>
                </td>
                <td className="py-3.5 px-4 font-bold">600 Boxes</td>
                <td className="py-3.5 px-4 font-bold text-[#176B68]">₹12,20,000</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Dispatched (Air)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-emerald-700">
                  Out for Delivery
                </td>
              </tr>

              <tr className="hover:bg-stone-50">
                <td className="py-3.5 px-4 font-mono font-bold text-[#17233B]">GIFT-2026-365</td>
                <td className="py-3.5 px-4">
                  <div className="font-bold text-[#17233B]">Falcon Global Capital (UAE)</div>
                  <div className="text-[10px] text-stone-400">Gulf VIP Client Relations</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium">Imperial Mongra Saffron &amp; Pistachio Box</div>
                  <div className="text-[10px] text-stone-400">Arabic &amp; English calligraphy parchment</div>
                </td>
                <td className="py-3.5 px-4 font-bold">120 Boxes</td>
                <td className="py-3.5 px-4 font-bold text-[#176B68]">AED 28,500</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Customs Clear
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-stone-600">
                  Dubai DIFC Hub
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
