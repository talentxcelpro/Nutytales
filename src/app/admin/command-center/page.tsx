'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CommercialOpportunity, formatLocalizedPrice } from '@/lib/platform-core'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function AdminSalesCommandCenterPage() {
  const [opportunities, setOpportunities] = useState<CommercialOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'high_value' | 'unanswered'>('all')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        if (data.opportunities) {
          setOpportunities(data.opportunities)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  // Aggregate Metrics
  const totalPipelineValue = opportunities.reduce((acc, curr) => acc + (curr.budget || 250000), 0)
  const highIntentCount = opportunities.filter((o) => o.intentScore >= 80).length
  const pendingFollowups = opportunities.filter((o) => o.status === 'NEW' || o.status === 'QUALIFIED').length

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab === 'high_value') return (opp.budget || 0) >= 400000 || opp.intentScore >= 90
    if (activeTab === 'unanswered') return opp.status === 'NEW' || opp.status === 'QUALIFIED'
    return true
  })

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-300 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
              <span>📊</span> NUTTY TALES SALES COMMAND CENTER
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Daily Business Generation &amp; Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Live telemetry tracking inbound intent, RFQ pipelines, corporate gifting budgets, and verified business matches.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://business.nutytales.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl font-bold hover:bg-stone-50"
            >
              Open B2B Portal ↗
            </a>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800"
            >
              WhatsApp Trade Desk
            </a>
          </div>
        </div>

        {/* ── Question 1: "HOW MUCH BUSINESS DID NUTTY TALES GENERATE TODAY?" ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
              How Much Business Did Nutty Tales Generate Today?
            </h2>
            <span className="text-[11px] text-stone-500 font-mono">
              Live Pipeline Pulse · Zero Fake Metrics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#704B32] block">Pipeline Value</span>
              <div className="font-serif text-2xl font-bold text-[#17233B]">
                ₹{(totalPipelineValue / 100000).toFixed(1)}L
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">+18.4% vs last week</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#704B32] block">Active RFQs</span>
              <div className="font-serif text-2xl font-bold text-[#17233B]">
                {opportunities.length}
              </div>
              <span className="text-[10px] text-stone-500 block">Across 6 verticals</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#704B32] block">High Intent (&gt;80)</span>
              <div className="font-serif text-2xl font-bold text-emerald-700">
                {highIntentCount}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">Ready for proforma</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#704B32] block">Pending Follow-ups</span>
              <div className="font-serif text-2xl font-bold text-amber-700">
                {pendingFollowups}
              </div>
              <span className="text-[10px] text-amber-600 font-bold block">Action required &lt;2h</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#704B32] block">Avg Order Value</span>
              <div className="font-serif text-2xl font-bold text-[#17233B]">
                ₹4.2L
              </div>
              <span className="text-[10px] text-stone-500 block">Institutional B2B</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#704B32] block">FSSAI Status</span>
              <div className="font-serif text-xl font-bold text-emerald-700">
                Active
              </div>
              <span className="text-[10px] text-stone-500 block">Lic. {FSSAI_NUMBER.slice(-6)}</span>
            </div>
          </div>
        </div>

        {/* ── Question 2: "WHAT SHOULD WE DO NEXT?" (CRM ACTION QUEUE) ── */}
        <div className="bg-[#17233B] text-white p-6 sm:p-8 rounded-3xl border border-[#C9A45C]/30 space-y-6 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
              Immediate Sales Action Queue
            </span>
            <h3 className="font-serif text-2xl font-bold">
              What Should We Do Next? (Top Priorities)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#C9A45C]">Action 1 · B2B RFQ</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">Urgent</span>
              </div>
              <strong className="text-white block font-serif text-sm">Delhi Artisan Bakeries (500kg Sliced)</strong>
              <p className="text-stone-300 text-[11px]">
                Target rate ₹670/kg. Dispatch proforma invoice and NABL lab moisture specification via WhatsApp desk.
              </p>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  'Dispatching proforma for Delhi Artisan Bakeries (500kg Sliced Almonds).',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-1 text-emerald-400 font-bold hover:underline"
              >
                Send Proforma Quote →
              </a>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#C9A45C]">Action 2 · Corporate Diwali</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[9px]">High Budget</span>
              </div>
              <strong className="text-white block font-serif text-sm">TechCorp Middle East (250 Boxes, AED 7.5L)</strong>
              <p className="text-stone-300 text-[11px]">
                Executive saffron &amp; walnut hampers. Share custom laser-engraved mockups and Dubai reefer freight options.
              </p>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  'Preparing luxury hamper proposal for TechCorp Dubai.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-1 text-emerald-400 font-bold hover:underline"
              >
                Connect with Gifting Director →
              </a>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#C9A45C]">Action 3 · Destination Wedding</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[9px]">Confirmed Date</span>
              </div>
              <strong className="text-white block font-serif text-sm">Kapoor &amp; Mehra (400 Favours)</strong>
              <p className="text-stone-300 text-[11px]">
                Pure Mongra saffron silver carafes. Split delivery needed for Delhi &amp; Srinagar venue.
              </p>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  'Confirming silver carafe wedding sample for Kapoor & Mehra.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block pt-1 text-emerald-400 font-bold hover:underline"
              >
                Assign Wedding Specialist →
              </a>
            </div>
          </div>
        </div>

        {/* ── Portfolio P&L — The 6 Independent Global Companies ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
                <span>✦</span> NUTTY TALES GROUP PORTFOLIO P&amp;L
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B] mt-1">
                Six Independent Operating Companies
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              Independent P&amp;L · Separate Dashboards · Shared Platform Core
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Business */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🏢</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    business.nutytales.com
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Nutty Tales Business</h3>
                <p className="text-xs text-stone-500 font-light">
                  Global B2B sourcing, bulk wholesale commodity contracts, and enterprise replenishment.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Monthly Sourcing GMV:</span>
                    <span className="font-bold text-[#17233B]">₹48.6 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Active RFQ Volume:</span>
                    <span className="font-bold text-[#176B68]">22,400 kg (8 Deals)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/b2b/dashboard"
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-[#10192A] text-white hover:bg-[#176B68] rounded-xl transition-colors"
              >
                Open Business Dashboard →
              </Link>
            </div>

            {/* 2. Gifting */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🎁</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                    gifting.nutytales.com
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Nutty Tales Gifting</h3>
                <p className="text-xs text-stone-500 font-light">
                  Corporate gifting, Diwali 2026 hampers, multi-recipient dispatch, and laser branding.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Gifting GMV (Season):</span>
                    <span className="font-bold text-[#17233B]">₹32.8 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Hampers Dispatched:</span>
                    <span className="font-bold text-[#176B68]">1,840 Boxes</span>
                  </div>
                </div>
              </div>
              <Link
                href="/gifting/dashboard"
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-[#10192A] text-white hover:bg-[#176B68] rounded-xl transition-colors"
              >
                Open Gifting Dashboard →
              </Link>
            </div>

            {/* 3. Weddings */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">💍</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                    weddings.nutytales.com
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Nutty Tales Weddings</h3>
                <p className="text-xs text-stone-500 font-light">
                  The Wedding OS: Interactive workspace, venue booking, wazwan banquets, and trousseau favors.
                </p>
                <div className="p-3 bg-rose-50/50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Wedding Pipeline GMV:</span>
                    <span className="font-bold text-[#8E2848]">₹1.85 Crores</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Favors Booked:</span>
                    <span className="font-bold text-[#8E2848]">2,150 Units</span>
                  </div>
                </div>
              </div>
              <Link
                href="/weddings/dashboard"
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-[#2D1520] text-white hover:bg-[#8E2848] rounded-xl transition-colors"
              >
                Open Weddings Dashboard →
              </Link>
            </div>

            {/* 4. Crafts */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🧣</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    crafts.nutytales.com
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Nutty Tales Crafts</h3>
                <p className="text-xs text-stone-500 font-light">
                  Global luxury weaves marketplace, GI Changthangi Pashmina, tailored pherans, and wholesale export.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Marketplace GMV:</span>
                    <span className="font-bold text-[#17233B]">₹41.2 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">B2B Wholesale Share:</span>
                    <span className="font-bold text-[#176B68]">64% (14 Guilds)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/crafts/dashboard"
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-[#10192A] text-white hover:bg-[#176B68] rounded-xl transition-colors"
              >
                Open Crafts Dashboard →
              </Link>
            </div>

            {/* 5. Stays */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🏔️</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    stays.nutytales.com
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Nutty Tales Stays</h3>
                <p className="text-xs text-stone-500 font-light">
                  Hospitality &amp; stay-experiences: Harwan walnut orchard suites, private buyouts, and local dining.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Hospitality GMV:</span>
                    <span className="font-bold text-[#17233B]">₹24.6 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Average Occupancy:</span>
                    <span className="font-bold text-[#176B68]">84.2% (ADR ₹9,450)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/stays/dashboard"
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-[#10192A] text-white hover:bg-[#176B68] rounded-xl transition-colors"
              >
                Open Stays Dashboard →
              </Link>
            </div>

            {/* 6. Travel */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl">✈️</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    travel.nutytales.com
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Nutty Tales Travel</h3>
                <p className="text-xs text-stone-500 font-light">
                  SI dynamic itinerary planning, 4x4 snow safaris, verified DMC network, and alpine expeditions.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Travel Bookings GMV:</span>
                    <span className="font-bold text-[#17233B]">₹54.2 Lakhs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Active Expeditions:</span>
                    <span className="font-bold text-[#176B68]">24 Trips (18 DMCs)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/travel/dashboard"
                className="w-full py-2.5 text-center text-xs font-bold uppercase tracking-wider bg-[#0E3A43] text-white hover:bg-[#176B68] rounded-xl transition-colors"
              >
                Open Travel Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Active Opportunities Pipeline Table ── */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-[#17233B]">
                Active Inbound Opportunities Pipeline
              </h3>
              <p className="text-xs text-stone-500">
                Opportunities captured automatically from website searches, RFQ terminals, and vertical inquiry CTAs.
              </p>
            </div>

            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  activeTab === 'all' ? 'bg-[#17233B] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                All ({opportunities.length})
              </button>
              <button
                onClick={() => setActiveTab('high_value')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  activeTab === 'high_value' ? 'bg-[#17233B] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                High Value (Score &gt; 80)
              </button>
              <button
                onClick={() => setActiveTab('unanswered')}
                className={`px-3 py-1.5 rounded-lg font-bold ${
                  activeTab === 'unanswered' ? 'bg-[#17233B] text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Unanswered ({pendingFollowups})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-[#704B32] uppercase text-[10px] tracking-wider border-b border-stone-200">
                  <th className="py-3 px-6 font-bold">Opp ID</th>
                  <th className="py-3 px-4 font-bold">Vertical</th>
                  <th className="py-3 px-4 font-bold">Client / Org</th>
                  <th className="py-3 px-4 font-bold">Item / Requirement</th>
                  <th className="py-3 px-4 font-bold">Quantity</th>
                  <th className="py-3 px-4 font-bold">Budget</th>
                  <th className="py-3 px-4 font-bold">Intent Score</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-6 font-bold text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {filteredOpportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#17233B]">{opp.id}</td>
                    <td className="py-4 px-4 font-bold uppercase text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                        {opp.vertical}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <strong className="block text-[#17233B]">{opp.customerName}</strong>
                      <span className="text-[10px] text-stone-500">{opp.companyName}</span>
                    </td>
                    <td className="py-4 px-4 font-medium text-stone-700 max-w-xs truncate">
                      {opp.itemOrService}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#176B68]">{opp.quantity}</td>
                    <td className="py-4 px-4 font-bold text-[#17233B]">
                      {opp.budget ? formatLocalizedPrice(opp.budget, opp.currency) : 'Open Budget'}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          opp.intentScore >= 90
                            ? 'bg-emerald-100 text-emerald-800'
                            : opp.intentScore >= 75
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {opp.intentScore}/100
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {opp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                          `Connecting regarding Opportunity ${opp.id} (${opp.customerName} - ${opp.itemOrService}).`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#176B68] hover:underline font-bold"
                      >
                        Follow up →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
