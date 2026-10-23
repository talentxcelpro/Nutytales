'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CURATED_SPLIT_STAYS, SplitStaySuggestion } from '@/lib/stays-data'

export default function SplitStaySection() {
  return (
    <section className="py-12 bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-10 shadow-xs space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
          <span>🔄</span> MULTI-STAY JOURNEYS
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
          Split Stays: Experience Two Worlds in One Journey
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Why stay in one place when you can experience complementary contrasts? Our split-stay journeys combine consecutive reservations with seamless chauffeur transfers in between.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {CURATED_SPLIT_STAYS.map((split) => (
          <div
            key={split.id}
            className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D9] space-y-5 hover:border-stone-400 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#704B32] uppercase tracking-wider">
                  {split.totalNights} Nights Combined Journey
                </span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold">
                  Transfer Coordinated
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                {split.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-serif italic">
                &ldquo;{split.highlight}&rdquo;
              </p>
            </div>

            {/* Visual Split Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
              {split.stays.map((stay, idx) => (
                <div
                  key={stay.propertySlug}
                  className="bg-white p-3 rounded-2xl border border-stone-200 space-y-2 relative"
                >
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-stone-100">
                    <Image
                      src={stay.image}
                      alt={stay.propertyName}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#17233B]/90 text-white text-[9px] font-bold">
                      Part {idx + 1} · {stay.nights} Nights
                    </span>
                  </div>
                  <div>
                    <strong className="block text-xs text-[#17233B] line-clamp-1">
                      {stay.propertyName}
                    </strong>
                    <span className="text-[10px] text-stone-500">📍 {stay.city}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer with Combined Total */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-semibold block">
                  Combined {split.totalNights}-Night Estimate
                </span>
                <span className="font-mono text-lg font-bold text-[#176B68]">
                  ₹{split.combinedCostEst.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500 ml-1">(Distinct bookings, unified care)</span>
              </div>

              <Link
                href={`/stays/${split.stays[0].propertySlug}`}
                className="py-2.5 px-5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors shadow-xs"
              >
                Explore Split Stay →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
