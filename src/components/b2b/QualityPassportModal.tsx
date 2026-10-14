'use client'

import React from 'react'
import { B2BCommodity } from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface QualityPassportModalProps {
  commodity: B2BCommodity | null
  onClose: () => void
}

export default function QualityPassportModal({
  commodity,
  onClose,
}: QualityPassportModalProps) {
  if (!commodity || !commodity.qualityPassport) return null

  const qp = commodity.qualityPassport
  const sup = commodity.supplier
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const sampleWhatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales Lab Desk! I want to request a 500g Commercial Sample Kit for Lot: ${qp.lotNumber} (${commodity.name}). Please share the dispatched courier tracking.`,
  )}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Certificate Header Banner */}
        <div className="bg-[#17233B] text-white p-6 sm:p-8 border-b border-[#C9A45C]/30 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white text-xl font-bold p-1 rounded-full hover:bg-white/10 w-8 h-8 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#C9A45C] bg-white/10 px-3 py-1 rounded-full">
              🛡️ DIGITAL QUALITY PASSPORT
            </span>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {qp.labCertification}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {commodity.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 mt-2">
            <span>Lot ID: <strong className="text-white font-mono">{qp.lotNumber}</strong></span>
            <span>•</span>
            <span>Origin: <strong className="text-[#C9A45C]">{commodity.origin}</strong></span>
            <span>•</span>
            <span>Harvest: <strong className="text-white">{qp.harvestSeason}</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Important Distinction Callout */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 flex items-start gap-3">
            <span className="text-xl">⚖️</span>
            <div className="space-y-1">
              <strong className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                Audited Identity vs Independently Tested Lot
              </strong>
              <p className="text-[11px] leading-relaxed text-amber-800">
                At Nuty Tales, we strictly distinguish a supplier’s verified business identity from independently tested product quality. Business registration proves legitimate entity status, while this digital passport represents third-party laboratory verification of this specific dispatch lot.
              </p>
            </div>
          </div>

          {/* Lab Test Results Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-[#17233B]">
                NABL Laboratory Analytical Assay
              </span>
              <span className="text-[11px] text-stone-500">
                Tested: <strong className="text-stone-800">{qp.lastTestedDate}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Moisture Content</span>
                <span className="font-serif text-lg font-bold text-[#17233B]">{qp.moistureContent}</span>
                <span className="text-[9px] text-emerald-700 block font-semibold">Strict Standard</span>
              </div>
              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Purity &amp; Count</span>
                <span className="font-serif text-lg font-bold text-[#17233B]">{qp.purityPercent}</span>
                <span className="text-[9px] text-emerald-700 block font-semibold">Zero Foreign Matter</span>
              </div>
              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Aflatoxin Residue</span>
                <span className="font-serif text-lg font-bold text-[#17233B]">{qp.aflatoxinPpb}</span>
                <span className="text-[9px] text-emerald-700 block font-semibold">Safe for Human Food</span>
              </div>
              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Active Oil / Grade</span>
                <span className="font-serif text-lg font-bold text-[#17233B]">{qp.oilContent || 'Grade A'}</span>
                <span className="text-[9px] text-[#176B68] block font-semibold">Cold Press Grade</span>
              </div>
            </div>
          </div>

          {/* Supplier Provenance & Verified Audit Status */}
          {sup && (
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#17233B] block">
                Origin Supplier &amp; Traceability Record
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="space-y-1">
                  <div>Supplier: <strong className="text-stone-900">{sup.name}</strong></div>
                  <div>Category: <span className="font-medium text-stone-700">{sup.type}</span></div>
                  <div>Hub: <span className="font-medium text-stone-700">{sup.location}</span></div>
                </div>
                <div className="space-y-1 sm:text-right">
                  <div>Business Identity: <span className="text-emerald-700 font-bold">✓ GSTIN &amp; PAN Active</span></div>
                  <div>Physical Audit: <span className="text-emerald-700 font-bold">✓ {sup.physicalAuditStatus}</span></div>
                  <div>Historical On-Time SLA: <strong className="text-stone-900">{sup.fulfillmentRate}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* Packaging & Handling Compliance */}
          <div className="p-3 bg-stone-50 rounded-xl text-[11px] space-y-1 text-stone-600">
            <div>• <strong>Storage Conditions:</strong> Stored in reefer/dehumidified ambient room (14°C - 18°C) to prevent lipid oxidation.</div>
            <div>• <strong>Packaging Barrier:</strong> High-density vacuum poly-barrier liner with nitrogen flushing.</div>
            <div>• <strong>FSSAI Central Clearance:</strong> Full regulatory compliance with FSSAI Lic. {FSSAI_NUMBER}.</div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 sm:p-6 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-stone-500 text-[11px]">
            Want an independent 3rd-party pre-shipment SGS or Bureau Veritas inspection? Available for orders &gt; 2 MT.
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <a
              href={sampleWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-center transition-colors"
            >
              Order 500g Lab Sample
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
