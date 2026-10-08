'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ShopProvenanceStory() {
  return (
    <section className="py-24 bg-[#10192A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-bold uppercase tracking-wider border border-white/10">
            <span>🌾</span> Single-Origin Provenance
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            Why Provenance Changes Everything
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
            Industrial commercial nuts and saffron are blended across dozens of countries, bleached for visual shelf-appeal, and held in transit warehouses for years. Nuty Tales sources directly at origin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-3xl block">🏔️</span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Pampore Karewa Saffron
              </h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Grown in lacustrine clay soils 1,600m above sea level. Pampore Mongra possesses certified crocin coloring potency above 240 — almost double the standard Iranian imports. Dried gently on traditional cedar trays.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-[#C9A45C]">
              GI Tag Certified · Lot Grade A+
            </div>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-3xl block">🌳</span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Harwan Unbleached Walnuts
              </h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Old-growth walnut trees nourished by Zabarwan snowmelt. Unlike supermarket walnuts that undergo chlorine or sulfur baths to lighten their shells, ours are hand-cracked and nitrogen-packed in raw organic purity.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-[#C9A45C]">
              Zero Chemical Polish · 68% Healthy Oils
            </div>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 border border-white/10 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-3xl block">🪷</span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Mithila Freshwater Makhana
              </h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Gorgon nuts harvested by diving into clean freshwater ponds in North Bihar. Hand-roasted in earthen pots and cracked instantly with wooden mallets to release giant 6-soot crisp white puffs.
              </p>
            </div>
            <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-[#C9A45C]">
              Optically Graded · Zero Sodium Added
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition"
          >
            <span>Shop Single-Origin Harvests</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
