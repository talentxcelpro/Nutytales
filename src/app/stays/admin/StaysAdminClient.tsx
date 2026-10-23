'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { STAY_PROPERTIES } from '@/lib/stays-data'

interface PendingListing {
  id: string
  title: string
  hostName: string
  city: string
  nightlyRate: number
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED'
  submittedAt: string
}

export default function StaysAdminClient() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'reservations' | 'financials' | 'disputes'>('approvals')

  const [pendingListings, setPendingListings] = useState<PendingListing[]>([
    {
      id: 'LST-9021',
      title: 'Zabarwan Forest Edge Glamping Dome',
      hostName: 'Hilal Mir',
      city: 'Srinagar (Harwan)',
      nightlyRate: 7500,
      status: 'PENDING_REVIEW',
      submittedAt: 'Today, 10:14 AM',
    },
    {
      id: 'LST-8942',
      title: 'Aru Valley Riverside Cedar Cottage',
      hostName: 'Shafiq Wani',
      city: 'Pahalgam',
      nightlyRate: 11000,
      status: 'PENDING_REVIEW',
      submittedAt: 'Yesterday, 4:30 PM',
    },
  ])

  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const handleApprove = (id: string) => {
    setPendingListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'APPROVED' } : l)),
    )
    setToastMsg(`Listing ${id} approved and published to stays inventory.`)
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleReject = (id: string) => {
    setPendingListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'REJECTED' } : l)),
    )
    setToastMsg(`Listing ${id} marked for revision with feedback sent to host.`)
    setTimeout(() => setToastMsg(null), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D9] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-semibold">
            <span>🛡️ NUTY TALES STAYS — MARKETPLACE OPERATIONS &amp; GOVERNANCE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Marketplace Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Authoritative property approvals, host identity vetting, financial ledger reconciliation, and fraud prevention.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
            ● Server Authorised
          </span>
          <Link
            href="/stays/dashboard"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl"
          >
            Host View →
          </Link>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold animate-fadeIn">
          ✓ {toastMsg}
        </div>
      )}

      {/* ── Operations Metrics ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Active Properties</span>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[#17233B]">{STAY_PROPERTIES.length} Estates</span>
          <span className="text-[11px] text-emerald-700 block font-semibold">100% On-site Inspected</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Pending Host Audits</span>
          <span className="font-serif text-2xl sm:text-3xl font-black text-amber-700">
            {pendingListings.filter((l) => l.status === 'PENDING_REVIEW').length}
          </span>
          <span className="text-[11px] text-stone-500 block">Deed &amp; Title Verification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Platform GMV (MTD)</span>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[#17233B]">₹38.4 Lakhs</span>
          <span className="text-[11px] text-emerald-700 block font-semibold">+22.4% vs last month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block">Platform Revenue (Commission)</span>
          <span className="font-serif text-2xl sm:text-3xl font-black text-[#176B68]">₹3.07 Lakhs</span>
          <span className="text-[11px] text-stone-500 block">3% Host + 5% Guest fee</span>
        </div>
      </div>

      {/* ── Tabs Navigation ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-bold">
        {[
          { id: 'approvals', label: 'Listing Approvals', badge: pendingListings.filter((l) => l.status === 'PENDING_REVIEW').length },
          { id: 'reservations', label: 'Reservation Ledger' },
          { id: 'financials', label: 'Monetisation & Tax Rules' },
          { id: 'disputes', label: 'Disputes & Support (0)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[#17233B] text-white shadow-xs'
                : 'text-stone-600 hover:text-black'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-900 text-[10px] font-black">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content: Listing Approvals ───────────────────────────────────── */}
      {activeTab === 'approvals' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              New Host Listings Awaiting Quality &amp; Deed Audit
            </h3>
            <span className="text-xs text-stone-500">
              Only verified properties with inspected photos will appear on public discovery.
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {pendingListings.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-500">{item.id}</span>
                    <strong className="text-sm text-[#17233B]">{item.title}</strong>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Host: {item.hostName} · 📍 {item.city} · Base Tariff: ₹{item.nightlyRate.toLocaleString('en-IN')}/nt · Submitted {item.submittedAt}
                  </p>
                </div>

                {item.status === 'PENDING_REVIEW' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      className="px-3 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-xl"
                    >
                      Request Revisions
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-1.5 bg-[#176B68] hover:bg-[#125350] text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      Approve &amp; Publish
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab Content: Financials & Monetisation Rules ──────────────────────── */}
      {activeTab === 'financials' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-8 shadow-xs space-y-6 text-xs text-stone-700">
          <h3 className="font-serif text-lg font-bold text-[#17233B]">
            Platform Monetisation &amp; Tax Configuration
          </h3>
          <p className="text-stone-500">
            Rules governing guest service fees, host commission, and automated 18% corporate GST reconciliation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Host Commission</span>
              <span className="font-mono text-2xl font-black text-[#17233B]">3.0%</span>
              <p className="text-[11px] text-stone-500">Deducted from gross host earnings per confirmed stay</p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Guest Service Fee</span>
              <span className="font-mono text-2xl font-black text-[#17233B]">5.0%</span>
              <p className="text-[11px] text-stone-500">Added to accommodation subtotal for 24/7 concierge guarantee</p>
            </div>

            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 block">Hospitality GST</span>
              <span className="font-mono text-2xl font-black text-[#17233B]">18.0%</span>
              <p className="text-[11px] text-stone-500">Official tax breakdown with B2B corporate input credit tax receipts</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab Content: Reservations ─────────────────────────────────────────── */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-3xl border border-[#E7E2D9] p-6 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#17233B]">
            Authoritative Reservation Ledger
          </h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#FAF8F5] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Guest</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Tariff</th>
                  <th className="p-3">Host Payout</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr className="hover:bg-stone-50">
                  <td className="p-3 font-mono font-bold text-[#17233B]">NT-STAY-2026-6401</td>
                  <td className="p-3 font-semibold">The Harwan Royal Walnut Orchard</td>
                  <td className="p-3">Dr. Sanjeev Kapoor</td>
                  <td className="p-3">Nov 10 - Nov 14 (4N)</td>
                  <td className="p-3 font-mono font-bold text-[#176B68]">₹53,232</td>
                  <td className="p-3 font-mono">₹39,285</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      CONFIRMED
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
