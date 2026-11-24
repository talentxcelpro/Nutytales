'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { VERIFIED_BATCHES, BatchVerificationData } from '@/lib/verify-data'
import { FSSAI_NUMBER, WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function VerifyClient() {
  const [searchQuery, setSearchQuery] = useState('NT-SF-2026-N9')
  const [activeBatchKey, setActiveBatchKey] = useState<string>('NT-SF-2026-N9')
  const [searched, setSearched] = useState(false)

  const activeBatch: BatchVerificationData | undefined =
    VERIFIED_BATCHES[activeBatchKey] || VERIFIED_BATCHES[searchQuery.trim().toUpperCase()]

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleSelectKey = (key: string) => {
    setActiveBatchKey(key)
    setSearchQuery(key)
    setSearched(true)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = searchQuery.trim().toUpperCase()
    if (VERIFIED_BATCHES[clean]) {
      setActiveBatchKey(clean)
    }
    setSearched(true)
  }

  const handleDownloadReport = () => {
    if (!activeBatch) return
    const message = `Hello Nuty Tales! Please share the official signed NABL Laboratory Certificate for Lot Number *${activeBatch.lotNumber}* (${activeBatch.productName}).`
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-10">
      {/* ── Search Bar & Batch Selector ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 text-center">
            Enter Lot / Batch Number on Your Jar or Pouch:
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. NT-SF-2026-N9, NT-MK-2026-B8..."
              className="flex-1 px-4 py-3 border border-stone-300 rounded-xl text-base font-mono uppercase focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all shadow-md"
            >
              Verify Lot →
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-stone-600 font-medium">Or verify active seasonal lots:</span>
            {Object.keys(VERIFIED_BATCHES).map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => handleSelectKey(key)}
                className={`px-3 py-1 font-mono text-xs rounded-lg border transition-all ${
                  activeBatchKey === key
                    ? 'bg-emerald-100 text-emerald-950 font-bold border-emerald-400'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* ── Verified Certificate of Analysis (COA) ── */}
      {activeBatch ? (
        <section className="bg-white rounded-3xl border border-stone-200/90 shadow-lg overflow-hidden">
          {/* Certificate Header Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/60 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    Official NABL Certificate of Analysis
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {activeBatch.productName}
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  100% Purity Verified (Grade A+)
                </div>
                <div className="text-[11px] font-mono text-stone-400 mt-1">
                  Report #{activeBatch.reportNumber}
                </div>
              </div>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs text-stone-300">
              <div>
                <span className="text-stone-400 block text-[11px]">Lot / Batch:</span>
                <span className="font-mono font-bold text-white text-sm">{activeBatch.lotNumber}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Harvest Season:</span>
                <span className="font-semibold text-white">{activeBatch.harvestSeason}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Terroir Origin & GPS:</span>
                <span className="font-semibold text-emerald-300 block">{activeBatch.terroirGps}</span>
                <span className="text-[11px] text-stone-400 line-clamp-1">{activeBatch.terroirOrigin}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">Accredited Lab:</span>
                <span className="font-semibold text-white block">{activeBatch.nablAccreditationNo}</span>
                <span className="text-[11px] text-stone-400">Tested: {activeBatch.testDate}</span>
              </div>
            </div>
          </div>

          {/* Laboratory Tested Parameters Table */}
          <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Spectrophotometric & Chemical Assay Results
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider bg-stone-50">
                    <th className="py-3 px-4 font-bold rounded-l-xl">Parameter Tested</th>
                    <th className="py-3 px-4 font-bold">Lab Observed Value</th>
                    <th className="py-3 px-4 font-bold">Standard Limit (ISO/FSSAI)</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                    <th className="py-3 px-4 font-bold rounded-r-xl">Scientific Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {activeBatch.parameters.map((param, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">{param.name}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-950 text-sm">
                        {param.testedValue}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-stone-600">{param.standardSpecification}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900">
                          {param.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-stone-600 leading-relaxed max-w-xs">
                        {param.explanation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quality Officer Endorsement */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-700">
              <div className="space-y-1">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] text-emerald-800">
                  Chief Quality Controller Statement:
                </span>
                <p className="italic">{activeBatch.qualityOfficerStatement}</p>
                <div className="text-[11px] text-stone-600 font-mono pt-1">
                  Central FSSAI Lic. #{FSSAI_NUMBER} · ISO 3632-1:2011 Certified Standard
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleDownloadReport}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl border border-stone-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Get Lab PDF
                </button>

                <Link
                  href={`/shop/${activeBatch.slug}`}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
                >
                  Buy This Tested Batch →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
          <p className="text-stone-600 text-sm">
            No report found for query &quot;{searchQuery}&quot;. Please verify the lot code stamped on your package.
          </p>
        </div>
      )}
    </div>
  )
}
