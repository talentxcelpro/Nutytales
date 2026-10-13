'use client'

import React from 'react'
import Image from 'next/image'
import { ClothingProduct } from '@/lib/clothing-data'

interface ArtisanPassportModalProps {
  product: ClothingProduct | null
  isOpen: boolean
  onClose: () => void
}

export default function ArtisanPassportModal({
  product,
  isOpen,
  onClose,
}: ArtisanPassportModalProps) {
  if (!isOpen || !product) return null

  const p = product.provenance
  const giCert = product.giNumber || p.giCertificateNo || 'GI-IN-AUTHENTIC-2026'
  const loomHours = product.loomHours || p.artisanHours || 60
  const impact = product.impactSplit || { artisanWeaver: 68, naturalFibers: 14, ecoLogistics: 10, platformOps: 8 }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-[#C9A45C]/50 space-y-6 relative overflow-hidden font-sans max-h-[90vh] overflow-y-auto">
        {/* Background Passport Crest Stamp Watermark */}
        <div className="absolute top-10 right-10 text-[160px] opacity-5 pointer-events-none font-serif font-black select-none leading-none">
          GI
        </div>

        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-[#704B32]/20 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-extrabold uppercase tracking-widest">
              <span>🏛️</span> OFFICIAL ARTISAN &amp; GI PROVENANCE PASSPORT
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] pt-1">
              {product.name}
            </h3>
            <p className="text-xs text-[#704B32] font-semibold">
              Registry Serial: <span className="font-mono text-[#17233B] bg-stone-200 px-2 py-0.5 rounded">{giCert}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 font-bold text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Two-Column Credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Garment Image & Origin Map Pin */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-stone-300 shadow-sm">
              <Image
                src={product.processImage || product.detailImage || product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 300px"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-[#17233B]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[10px] flex items-center justify-between">
                <span>📍 {product.state || 'India'}</span>
                <span className="text-[#C9A45C] font-bold">GI Verified</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                Artisan Cooperative Guild
              </span>
              <p className="font-bold text-[#17233B]">{p.artisanGroup}</p>
              {p.artisanName && (
                <p className="text-stone-600 text-[11px]">Master Craftsperson: <strong className="text-[#17233B]">{p.artisanName}</strong></p>
              )}
              <p className="text-stone-500 text-[11px] pt-0.5">{p.origin}</p>
            </div>
          </div>

          {/* Lineage & Craft Details */}
          <div className="space-y-3">
            <div className="p-3.5 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500">Craft Tradition:</span>
                <span className="font-bold text-[#17233B]">{p.craftTradition || product.craft}</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500">Loom / Needle Hours:</span>
                <span className="font-mono font-bold text-[#176B68] text-sm">⏱️ {loomHours} Hours</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500">Fiber Purity:</span>
                <span className="font-bold text-[#17233B]">{product.fabricPurity || product.material}</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500">Dye / Technique:</span>
                <span className="text-stone-700">{p.technique}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Fair Remuneration:</span>
                <span className="font-bold text-emerald-700">{p.fairWageGuarantee || 'Guild Verified'}</span>
              </div>
            </div>

            {/* Micro QR Seal */}
            <div className="p-3.5 bg-gradient-to-br from-[#17233B] to-[#10192A] text-white rounded-2xl border border-stone-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 flex-shrink-0 flex items-center justify-center text-xl">
                <span>🛡️</span>
              </div>
              <div className="text-[11px] space-y-0.5">
                <span className="text-[#C9A45C] font-bold block uppercase tracking-wider text-[10px]">
                  Government GI Protection
                </span>
                <p className="text-stone-300 font-light leading-snug">
                  Certified single-origin heritage protected under Geographical Indications of Goods Act.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Craft-to-Closet Impact Meter */}
        <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#17233B] uppercase tracking-wider text-[11px]">
              Craft-to-Closet Transparent Economics
            </span>
            <span className="text-[10px] text-stone-500">Every Rupee Accounted For</span>
          </div>

          <div className="w-full bg-stone-300 rounded-full h-3 flex overflow-hidden">
            <div className="bg-[#176B68] h-full" style={{ width: `${impact.artisanWeaver}%` }} title={`Weaver: ${impact.artisanWeaver}%`} />
            <div className="bg-[#C9A45C] h-full" style={{ width: `${impact.naturalFibers}%` }} title={`Fibers: ${impact.naturalFibers}%`} />
            <div className="bg-[#17233B] h-full" style={{ width: `${impact.ecoLogistics}%` }} title={`Insured Logistics: ${impact.ecoLogistics}%`} />
            <div className="bg-stone-500 h-full" style={{ width: `${impact.platformOps}%` }} title={`Verification: ${impact.platformOps}%`} />
          </div>

          <div className="grid grid-cols-4 gap-2 text-[10px] text-stone-600 pt-1">
            <div>
              <strong className="text-[#176B68] block font-mono font-bold text-xs">{impact.artisanWeaver}%</strong>
              Direct Weaver Guild
            </div>
            <div>
              <strong className="text-[#C9A45C] block font-mono font-bold text-xs">{impact.naturalFibers}%</strong>
              Natural Fibers & Dyes
            </div>
            <div>
              <strong className="text-[#17233B] block font-mono font-bold text-xs">{impact.ecoLogistics}%</strong>
              Insured Freight & Box
            </div>
            <div>
              <strong className="text-stone-700 block font-mono font-bold text-xs">{impact.platformOps}%</strong>
              GI Verification & QA
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-200">
          <span className="text-[11px] text-stone-500">
            Care: {p.care}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#17233B] hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  )
}
