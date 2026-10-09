'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { NRI_CATEGORIES, OPERATIONAL_CITIES } from '@/lib/nri/nri-data'

export default function NriServicesDirectoryPage() {
  const [selectedCity, setSelectedCity] = useState('All')
  const categoryKeys = Object.keys(NRI_CATEGORIES) as (keyof typeof NRI_CATEGORIES)[]

  const filteredCategories = categoryKeys.filter((k) => {
    if (selectedCity === 'All') return true
    const cat = NRI_CATEGORIES[k]
    return (
      cat.popularCities.includes(selectedCity) ||
      cat.popularCities.some((c) => c.includes(selectedCity)) ||
      cat.popularCities.some((c) => c.includes('Pan-India'))
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Directory Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-xs text-[#C9A45C] font-semibold">
          <span>🇮🇳</span>
          <span>11 SPECIALIZED SERVICE VERTICALS</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Services Directory for Global Indians
        </h1>
        <p className="text-sm text-stone-300 font-light leading-relaxed">
          Explore our full service framework. Each vertical is executed by vetted ground coordinators, Bar Council advocates, and ICAI Chartered Accountants across our operational Indian hubs.
        </p>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-stone-400 font-semibold mr-1">Filter by Indian City:</span>
          {['All', 'Srinagar', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Chandigarh'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedCity === c
                  ? 'bg-[#C9A45C] text-[#0E1524] font-bold'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              {c === 'All' ? 'All India Hubs' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Detailed Cards */}
      <div className="space-y-8">
        {filteredCategories.map((key) => {
          const cat = NRI_CATEGORIES[key]
          const slug = key.replace('_', '-')

          return (
            <div
              key={key}
              className="bg-[#0E1524] rounded-3xl border border-white/10 hover:border-[#C9A45C]/40 transition-all p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10">
                    {cat.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-2xl font-bold text-white">{cat.title}</h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30">
                        {cat.heroBadge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 font-light mt-1 max-w-2xl">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/${slug}`}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold whitespace-nowrap self-start hover:shadow-lg transition-all"
                >
                  View Inclusions & Quotes →
                </Link>
              </div>

              {/* Sample Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {cat.sampleServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <strong className="text-white block font-medium leading-snug">{svc.name}</strong>
                      <span className="text-[11px] text-[#C9A45C] block mt-1">
                        Est: {svc.estimatedRange}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/5 text-[10px] text-stone-400">
                      Deliverable: {svc.deliverable}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-400">
                <span>
                  Supported hubs: <strong className="text-stone-300">{cat.popularCities.join(' • ')}</strong>
                </span>
                <Link href={`/#request-engine`} className="text-[#C9A45C] font-semibold hover:underline">
                  ⚡ Request this Service in India
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
