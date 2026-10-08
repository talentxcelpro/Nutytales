'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  RevenueOSDashboardMetrics,
  TimeframeFilter,
  getRevenueOSMetrics,
} from '@/lib/revenue-os'
import { formatGlobalPrice } from '@/lib/global-config'

export default function AdminRevenueOSPage() {
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('7d')
  const [metrics, setMetrics] = useState<RevenueOSDashboardMetrics>(() => getRevenueOSMetrics('7d'))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/revenue-os/telemetry?timeframe=${timeframe}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setMetrics(json.data)
        } else {
          setMetrics(getRevenueOSMetrics(timeframe))
        }
      })
      .catch(() => {
        setMetrics(getRevenueOSMetrics(timeframe))
      })
      .finally(() => setLoading(false))
  }, [timeframe])

  const timeframeLabels: { key: TimeframeFilter; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: '7d', label: 'Last 7 Days' },
    { key: '30d', label: 'Last 30 Days' },
    { key: '90d', label: 'Last 90 Days' },
    { key: 'ytd', label: 'YTD 2026' },
  ]

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* ── Top Header Bar ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-300 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
                📈 NUTY TALES REVENUE OS
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Master Commercial &amp; Financial Command
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Consolidated commercial telemetry across all six global verticals: B2B Supply, Gifting, Weddings, Crafts, Stays, and Travel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/admin/partners"
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl font-bold hover:bg-stone-50 transition"
            >
              Partner Verification Desk ↗
            </Link>
            <Link
              href="/admin/command-center"
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl font-bold hover:bg-stone-50 transition"
            >
              Sales Opportunities ↗
            </Link>
            <Link
              href="/search"
              target="_blank"
              className="px-4 py-2 bg-[#17233B] text-white rounded-xl font-bold hover:bg-[#203050] transition"
            >
              Global Search ↗
            </Link>
          </div>
        </div>

        {/* ── Timeframe Selector Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-stone-300 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500 mr-1">Time Horizon:</span>
            <div className="flex flex-wrap gap-1.5">
              {timeframeLabels.map((tf) => (
                <button
                  key={tf.key}
                  onClick={() => setTimeframe(tf.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    timeframe === tf.key
                      ? 'bg-[#17233B] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-medium text-stone-500 flex items-center gap-2">
            {loading && <span className="animate-spin text-sm">⏳</span>}
            <span>Reporting Currency: <strong>INR (₹) Base Equivalent</strong></span>
          </div>
        </div>

        {/* ── Executive Topline Financial KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Gross Merchandise Value */}
          <div className="bg-white p-6 rounded-3xl border border-stone-300 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Gross Merchandise Value (GMV)
              </span>
              <span className="text-lg">💎</span>
            </div>
            <p className="font-serif text-3xl font-bold text-[#17233B]">
              {formatGlobalPrice(metrics.totalGMVINR, 'INR')}
            </p>
            <p className="text-xs text-stone-500">
              Total transaction flow across all 6 vertical marketplaces
            </p>
          </div>

          {/* Card 2: Net Platform Revenue */}
          <div className="bg-white p-6 rounded-3xl border-2 border-[#17233B] shadow-sm space-y-2 bg-gradient-to-br from-white to-amber-50/40">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Net Platform Revenue
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
                {metrics.blendedTakeRatePercent}% Blended Take-Rate
              </span>
            </div>
            <p className="font-serif text-3xl font-bold text-[#17233B]">
              {formatGlobalPrice(metrics.totalNetRevenueINR, 'INR')}
            </p>
            <p className="text-xs text-stone-500">
              Marketplace commissions, procurement spreads &amp; service fees
            </p>
          </div>

          {/* Card 3: Orders & Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-stone-300 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Orders &amp; Bookings
              </span>
              <span className="text-lg">📦</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-serif text-3xl font-bold text-[#17233B]">
                {metrics.totalOrdersAndBookings.toLocaleString()}
              </p>
              <span className="text-xs text-stone-500">
                + {metrics.totalLeadsAndRFQs} RFQs/Leads
              </span>
            </div>
            <p className="text-xs text-stone-500">
              AOV: <strong className="text-[#17233B]">{formatGlobalPrice(metrics.blendedAOVINR, 'INR')}</strong>
            </p>
          </div>

          {/* Card 4: Unit Economics (CAC & LTV) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-300 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Customer Unit Economics
              </span>
              <span className="text-lg">🎯</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Customer Acq. Cost (CAC):</span>
                <strong className="text-[#17233B]">{formatGlobalPrice(metrics.blendedCACINR, 'INR')}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Customer Lifetime Value (LTV):</span>
                <strong className="text-emerald-700">{formatGlobalPrice(metrics.estimatedLTVINR, 'INR')}</strong>
              </div>
            </div>
            <p className="text-[11px] text-stone-400 pt-1">
              LTV:CAC Ratio = <strong>{Math.round(metrics.estimatedLTVINR / metrics.blendedCACINR)}:1</strong> (Top-Decile Marketplace Moat)
            </p>
          </div>
        </div>

        {/* ── Commercial Funnel Telemetry ── */}
        <div className="bg-white rounded-3xl border border-stone-300 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#17233B]">Commercial Conversion Funnel</h2>
              <p className="text-xs text-stone-500">
                End-to-end commercial progression from traffic acquisition to paid booking and order fulfillment.
              </p>
            </div>
            <div className="text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-xl font-medium">
              Total Visitors: <strong>{metrics.totalVisitors.toLocaleString()}</strong> ({metrics.uniqueVisitors.toLocaleString()} Unique)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {metrics.funnel.map((step, idx) => (
              <div
                key={idx}
                className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 relative"
              >
                <div className="text-[11px] font-bold text-stone-500 truncate">{step.stage}</div>
                <div className="text-xl font-bold text-[#17233B]">{step.count.toLocaleString()}</div>
                <div className="text-[10px] text-stone-400 flex items-center justify-between">
                  <span>Pass-thru: {step.conversionFromPrevious}%</span>
                  {step.dropoffRate > 0 && <span className="text-rose-500">Drop: {step.dropoffRate}%</span>}
                </div>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-[#17233B] h-full rounded-full"
                    style={{ width: `${Math.max(8, step.conversionFromPrevious)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vertical Breakdown Table ── */}
        <div className="bg-white rounded-3xl border border-stone-300 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#17233B]">Vertical Performance Matrix</h2>
              <p className="text-xs text-stone-500">
                Revenue, volume, margins and unit economics across the 6 marketplace verticals.
              </p>
            </div>
            <span className="text-xs font-bold text-[#17233B] bg-stone-100 px-3 py-1.5 rounded-xl">
              6 Active Global Verticals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#17233B]">
              <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="p-4">Vertical Name</th>
                  <th className="p-4">GMV (₹)</th>
                  <th className="p-4">Net Revenue</th>
                  <th className="p-4">Take-Rate</th>
                  <th className="p-4">Transactions</th>
                  <th className="p-4">AOV (₹)</th>
                  <th className="p-4">CAC / LTV</th>
                  <th className="p-4">Top Sourcing / Product Focus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {metrics.verticalSummaries.map((v) => (
                  <tr key={v.vertical} className="hover:bg-stone-50/80 transition">
                    <td className="p-4 font-bold text-sm text-[#17233B]">{v.verticalName}</td>
                    <td className="p-4 font-mono font-bold">{formatGlobalPrice(v.gmvINR, 'INR')}</td>
                    <td className="p-4 font-mono font-bold text-emerald-800">
                      {formatGlobalPrice(v.netRevenueINR, 'INR')}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold text-stone-700">
                        {v.takeRatePercent}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{v.transactionsCount} Orders</div>
                      <div className="text-[11px] text-stone-400">{v.leadsAndRfqsCount} Leads</div>
                    </td>
                    <td className="p-4 font-mono">{formatGlobalPrice(v.aovINR, 'INR')}</td>
                    <td className="p-4">
                      <div className="text-[11px] text-stone-500">CAC: {formatGlobalPrice(v.cacINR, 'INR')}</div>
                      <div className="text-[11px] font-bold text-emerald-700">LTV: {formatGlobalPrice(v.ltvINR, 'INR')}</div>
                    </td>
                    <td className="p-4 text-stone-600 text-[11px] max-w-xs line-clamp-2">
                      {v.topCategoryOrCommodity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Regional & Channel Performance Matrix ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Regional Market Contribution */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-300 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Global Regional Contribution</h3>
                <p className="text-xs text-stone-500">Distribution across 8 primary international demand hubs.</p>
              </div>
              <span className="text-xs font-bold text-stone-500">8 Global Hubs</span>
            </div>

            <div className="space-y-3">
              {metrics.regionalSummaries.map((r) => (
                <div key={r.countryCode} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                        {r.countryCode}
                      </span>
                      <strong className="text-[#17233B]">{r.countryName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#17233B]">{formatGlobalPrice(r.gmvINR, 'INR')}</span>
                      <span className="text-stone-400 text-[10px] ml-1.5">({r.shareOfTotalPercent}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{ width: `${r.shareOfTotalPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Attribution */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-300 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Channel Attribution</h3>
                <p className="text-xs text-stone-500">Revenue generation by commercial acquisition channel.</p>
              </div>
            </div>

            <div className="space-y-3">
              {metrics.channelAttributions.map((c, i) => (
                <div key={i} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">{c.label}</span>
                    <span className="font-bold text-[#17233B]">{c.sharePercent}%</span>
                  </div>
                  <div className="text-[11px] font-mono text-stone-500">
                    {formatGlobalPrice(c.revenueINR, 'INR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Live Ingestion Telemetry Stream ── */}
        <div className="bg-white rounded-3xl border border-stone-300 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#17233B]">Live Telemetry Stream</h3>
              <p className="text-xs text-stone-500">Real-time commercial signals received across web, apps, and concierge desks.</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Live Ingestion Feed
            </span>
          </div>

          <div className="space-y-2">
            {metrics.recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      evt.type === 'PURCHASE' || evt.type === 'BOOKING'
                        ? 'bg-emerald-100 text-emerald-800'
                        : evt.type === 'RFQ'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {evt.type}
                  </span>
                  <div>
                    <span className="font-bold text-[#17233B] uppercase tracking-wide mr-2">
                      [{evt.vertical}]
                    </span>
                    <span className="text-stone-600">
                      {evt.city || evt.countryCode} · {evt.trafficSource} · {JSON.stringify(evt.metadata || {})}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-[#17233B] block">
                      {formatGlobalPrice(evt.valueINR, 'INR')}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Cut: {formatGlobalPrice(evt.commissionINR, 'INR')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
