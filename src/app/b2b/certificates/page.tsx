'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { INITIAL_CERTIFICATES, CertificateRecord } from '@/lib/b2b-procurement-store'
import { FSSAI_NUMBER, WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function B2BCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([])
  const [selectedCert, setSelectedCert] = useState<CertificateRecord | null>(null)
  const [filterType, setFilterType] = useState('ALL')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setCertificates(INITIAL_CERTIFICATES)
  }, [])

  const filteredCerts = certificates.filter((c) => {
    if (filterType === 'ALL') return true
    return c.status === filterType
  })

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
            <Link href="/b2b/dashboard" className="hover:text-stone-900">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-stone-900 font-bold">Quality &amp; Certificates</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Quality &amp; Document Centre
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Traceable digital lot records, NABL analytical assays, GI Tag certifications, and FSSAI Central audit records
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales Quality Directorate! Requesting formal laboratory assay and SGS pre-shipment inspection for our commercial order.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>🔬</span>
            <span>Request 3rd-Party SGS Inspection</span>
          </a>
        </div>
      </div>

      {/* ── Compliance Distinction Callout Banner ─────────────────────────────── */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 flex items-start gap-3 text-xs">
        <span className="text-xl">⚖️</span>
        <div className="space-y-1">
          <strong className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
            Verified Entity Identity vs Independently Tested Lot Quality
          </strong>
          <p className="text-[11px] leading-relaxed text-amber-800">
            At Nuty Tales, we strictly distinguish a supplier’s verified business identity from independently tested product quality. Business registration proves legitimate entity status, while this digital passport represents third-party laboratory verification of this specific dispatch lot.
          </p>
        </div>
      </div>

      {/* ── Filter Tabs ───────────────────────────────────────────────────────── */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Certificates' },
            { id: 'NABL_CERTIFIED', label: 'NABL Certified Assays' },
            { id: 'GI_VERIFIED', label: 'GI Tag Provenance' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                filterType === tab.id
                  ? 'bg-[#17233B] text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-stone-500 text-[11px]">
          FSSAI Central Lic. {FSSAI_NUMBER} · NABL ISO 17025 Compliant
        </div>
      </div>

      {/* ── Certificates Table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                <th className="py-3.5 px-4">Lot ID</th>
                <th className="py-3.5 px-4">Commodity</th>
                <th className="py-3.5 px-4">Origin &amp; Harvest</th>
                <th className="py-3.5 px-4">Testing Laboratory</th>
                <th className="py-3.5 px-4">Moisture %</th>
                <th className="py-3.5 px-4">Aflatoxin (ppb)</th>
                <th className="py-3.5 px-4">Tested Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{cert.lotNumber}</td>
                  <td className="py-3.5 px-4 font-medium">{cert.commodityName}</td>
                  <td className="py-3.5 px-4">
                    <div>{cert.origin}</div>
                    <span className="text-[10px] text-stone-400">{cert.harvestSeason}</span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600">{cert.labName}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{cert.moistureContent}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">{cert.aflatoxinReading}</td>
                  <td className="py-3.5 px-4 text-stone-500">{cert.testDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {cert.status === 'NABL_CERTIFIED' ? '✓ NABL Certified' : '✓ GI Provenance'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold text-[11px]"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="p-6 bg-[#17233B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                  NABL Laboratory Analytical Assay
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedCert.lotNumber}</h3>
                <span className="text-[11px] text-stone-300">{selectedCert.commodityName}</span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-stone-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-stone-700">
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 text-[11px]">
                <div>
                  <span className="text-stone-500 block">Accreditation:</span>
                  <strong className="text-stone-900">{selectedCert.accreditation}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Sample Harvest:</span>
                  <strong className="text-stone-900">{selectedCert.harvestSeason}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Tested Moisture:</span>
                  <strong className="text-stone-900 text-sm">{selectedCert.moistureContent}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Aflatoxin Status:</span>
                  <strong className="text-emerald-700 text-sm">{selectedCert.aflatoxinReading}</strong>
                </div>
              </div>

              {selectedCert.oilContent && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
                  <span className="text-stone-500 block">Active Lipid / Essential Compound Spec:</span>
                  <strong className="text-stone-900">{selectedCert.oilContent}</strong>
                </div>
              )}

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
                • <strong>Traceability Note:</strong> Every pallet dispatched under this Lot ID is sealed with tamper-evident RFID barrier locks corresponding to this certificate.
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
