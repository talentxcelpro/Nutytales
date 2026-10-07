'use client'

import React from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BQuotesPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const sampleQuotes = [
    {
      id: 'NT-QT-2026-0841',
      date: '05 Oct 2026',
      org: 'Premier Bakery & Patisserie Group',
      commodity: 'California Almonds (Sliced 1.0mm)',
      volume: '500 kg',
      ratePerKg: '₹670',
      totalLanded: '₹3,51,750 (incl. 5% GST & Freight)',
      status: 'Price Locked (Valid 5 Days)',
      hub: 'Noida Central Processing Hub',
      coaAttached: true,
    },
    {
      id: 'NT-QT-2026-0839',
      date: '02 Oct 2026',
      org: 'Heritage Mithai & Sweets Corp',
      commodity: 'Cashew Tukda (Splits JH) + Mongra Saffron',
      volume: '1,200 kg + 2 kg',
      ratePerKg: '₹530 / kg + ₹2,60,000 / kg',
      totalLanded: '₹12,18,000 (incl. GST)',
      status: 'PO Approved / In Packaging',
      hub: 'Noida HQ & Kashmir Saffron Vault',
      coaAttached: true,
    },
    {
      id: 'NT-QT-2026-0833',
      date: '28 Sep 2026',
      org: 'Grand Horizon Luxury Resort',
      commodity: 'Kashmiri Kagzi Walnuts (Extra Light Halves 80%)',
      volume: '300 kg',
      ratePerKg: '₹1,080',
      totalLanded: '₹3,40,200',
      status: 'Dispatched / In Reefer Transit',
      hub: 'Kashmir Valley Hub',
      coaAttached: true,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>📑</span> COMMERCIAL QUOTES &amp; PROPOSALS DESK
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
            Commercial Proposals &amp; Proforma Archive
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Review formal commercial bids, lab specification sheets, quarterly price locks, and proforma tax invoices generated for your organization.
          </p>
        </div>

        <Link
          href="/b2b/rfq"
          className="px-6 py-3 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>+ Create New RFQ</span>
        </Link>
      </div>

      {/* Active Quotes Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#17233B]">
            Representative Commercial Contracts
          </h2>
          <span className="text-xs text-stone-500">
            FSSAI Central Lic. {FSSAI_NUMBER}
          </span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-[#704B32] uppercase text-[10px] tracking-wider border-b border-stone-200">
                <th className="py-3 px-6 font-bold">Quote Ref</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Client / Org</th>
                <th className="py-3 px-4 font-bold">Commodity Spec</th>
                <th className="py-3 px-4 font-bold">Volume</th>
                <th className="py-3 px-4 font-bold">Unit Rate</th>
                <th className="py-3 px-4 font-bold">Total Landed</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {sampleQuotes.map((q) => (
                <tr key={q.id} className="hover:bg-[#FAF6EE]/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#17233B]">{q.id}</td>
                  <td className="py-4 px-4 text-stone-500">{q.date}</td>
                  <td className="py-4 px-4 font-medium">{q.org}</td>
                  <td className="py-4 px-4 text-stone-600">{q.commodity}</td>
                  <td className="py-4 px-4 font-bold text-[#176B68]">{q.volume}</td>
                  <td className="py-4 px-4 font-medium">{q.ratePerKg}</td>
                  <td className="py-4 px-4 font-bold text-[#17233B]">{q.totalLanded}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {q.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        `Hello Nuty Tales B2B! Inquiring regarding Quote Reference: ${q.id}. Please connect with the account manager.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#176B68] hover:underline font-bold"
                    >
                      Connect Manager →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proforma FAQ & Contact Card */}
      <div className="bg-[#FAF6EE] rounded-3xl border border-stone-200 p-8 space-y-4">
        <h3 className="font-serif font-bold text-xl text-[#17233B]">
          How Nuty Tales Commercial Quotes Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600 leading-relaxed">
          <div className="space-y-1">
            <strong className="text-[#17233B] block">1. 7-Day Firm Price Protection</strong>
            <p>Once generated, your quoted raw ingredient rate is locked against spot market volatility for 7 full calendar days.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-[#17233B] block">2. NABL Lab COA Guarantee</strong>
            <p>Every commercial invoice includes physical lot testing: moisture, FFA, aflatoxin, and optical defect report.</p>
          </div>
          <div className="space-y-1">
            <strong className="text-[#17233B] block">3. Multi-Plant Hub Billing</strong>
            <p>Split a single contract into multiple dispatches across your NCR, Mumbai, Bengaluru, and Kolkata facilities.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
