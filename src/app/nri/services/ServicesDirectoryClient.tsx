'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { NRI_CATEGORIES } from '@/lib/nri/nri-data'

export default function ServicesDirectoryClient() {
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C6D2D]/10 border border-[#8C6D2D]/20 text-xs text-[#8C6D2D] font-semibold">
          <span>🇮🇳</span>
          <span>11 SPECIALIZED SERVICE VERTICALS</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#191919] tracking-tight">
          Services Directory for Global Indians
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Explore our complete service framework. Each vertical is executed by vetted ground coordinators, Bar Council advocates, and ICAI Chartered Accountants across our operational Indian hubs.
        </p>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          <span className="text-stone-500 font-semibold mr-1">Filter by Indian City:</span>
          {['All', 'Srinagar', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Chandigarh'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                selectedCity === c
                  ? 'bg-[#191919] text-white shadow-sm font-semibold'
                  : 'bg-white text-stone-700 hover:bg-[#F3EFE6] border border-[#EAE6DF]'
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
              className="bg-white rounded-3xl border border-[#EAE6DF] hover:border-[#8C6D2D]/40 transition-all p-6 sm:p-8 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#EAE6DF]">
                    {cat.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="font-serif text-2xl font-bold text-[#191919]">{cat.title}</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C6D2D]/10 text-[#8C6D2D] border border-[#8C6D2D]/20">
                        {cat.heroBadge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 font-light mt-1.5 max-w-2xl leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/services/${slug}`}
                  className="px-5 py-2.5 rounded-full bg-[#191919] hover:bg-[#2A2A2A] text-white text-xs font-semibold whitespace-nowrap self-start shadow-sm transition-all"
                >
                  View Inclusions & Quotes →
                </Link>
              </div>

              {/* Sample Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {cat.sampleServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] space-y-2 text-xs flex flex-col justify-between"
                  >
                    <div>
                      <strong className="text-[#191919] block font-medium leading-snug">{svc.name}</strong>
                      <span className="text-[11px] text-[#8C6D2D] font-semibold block mt-1">
                        Est: {svc.estimatedRange}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#EAE6DF] text-[10px] text-stone-500">
                      Deliverable: {svc.deliverable}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer info */}
              <div className="pt-3 border-t border-[#EAE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500">
                <span>
                  Supported hubs: <strong className="text-stone-800">{cat.popularCities.join(' • ')}</strong>
                </span>
                <Link href={`/#request-engine`} className="text-[#8C6D2D] font-semibold hover:underline">
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
