'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { NRI_CATEGORIES, OPERATIONAL_CITIES } from '@/lib/nri/nri-data'
import { ServiceCategoryKey } from '@/lib/nri/types'

export default function NriMarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('All')

  const categories = Object.values(NRI_CATEGORIES)
  const displayedCategories =
    selectedCategory === 'all'
      ? categories
      : categories.filter((c) => c.key === selectedCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-xs text-[#C9A45C] font-semibold">
          <span>🛡️</span>
          <span>DATA AUTHENTICITY & VETTING POLICY</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Request for Quotation (RFQ) & Ground Network
        </h1>
        <p className="text-sm text-stone-300 font-light leading-relaxed">
          Nuty Tales upholds strict authenticity: we never publish synthetic provider directories, placeholder ratings, or invented reviews. All overseas service requests are scoped and managed through our centralized on-ground coordinator hubs with verifiable photographic proof.
        </p>
      </div>

      {/* Honest Verification Notice */}
      <div className="bg-[#0E1524] p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Directory Status: Direct Fulfillment Mode
            </span>
            <h2 className="font-serif text-xl font-bold text-white">
              Independent Partner Directory Verification in Progress
            </h2>
          </div>
          <Link
            href="/providers"
            className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-colors self-start sm:self-auto"
          >
            Apply as a Verified Partner →
          </Link>
        </div>
        <p className="text-xs text-stone-300 font-light leading-relaxed">
          Third-party specialist profiles are published to the public directory only after completing physical identity vetting, Bar Council / ICAI / RERA licensing validation, and signed diaspora NDAs. In the interim, all requests are fulfilled directly under the supervision of the <strong className="text-white">Nuty Tales Central Ground Desk</strong> across Srinagar, Delhi NCR, Mumbai, Bengaluru, Chandigarh, and Pune.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0E1524] p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <div>
            <label className="block text-stone-400 text-[10px] uppercase font-semibold mb-1">
              Select Vertical
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1A263D] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none"
            >
              <option value="all">All 11 Service Verticals</option>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-400 text-[10px] uppercase font-semibold mb-1">
              Target Indian City / State
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#1A263D] text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none"
            >
              <option value="All">All Operational Hubs</option>
              {OPERATIONAL_CITIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-stone-400 self-end sm:self-center">
          Showing <strong className="text-white">{displayedCategories.length}</strong> active RFQ categories
        </span>
      </div>

      {/* Category RFQ Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCategories.map((cat) => (
          <div
            key={cat.key}
            className="bg-[#0E1524] rounded-3xl p-6 border border-white/10 hover:border-[#C9A45C]/50 transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10">
                  {cat.icon}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30 uppercase">
                  {cat.heroBadge}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-white">{cat.title}</h3>
                <p className="text-xs text-[#C9A45C] font-medium mt-0.5">{cat.tagline}</p>
              </div>

              <p className="text-xs text-stone-300 font-light leading-relaxed">
                {cat.description}
              </p>

              {/* Sample Deliverables */}
              <div className="p-3.5 rounded-2xl bg-white/5 space-y-2 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                  Ground Execution Standard
                </span>
                <ul className="space-y-1.5 text-stone-300 font-light text-[11px]">
                  {cat.inclusions.slice(0, 3).map((inc, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coverage Hubs */}
              <div className="text-[11px] text-stone-400">
                <span className="text-stone-500 font-semibold">Active Hubs: </span>
                {cat.popularCities.join(', ')}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <Link
                href={`/services/${cat.key}`}
                className="text-xs font-semibold text-stone-300 hover:text-white transition-colors"
              >
                View Details →
              </Link>

              <Link
                href={`/#request-engine`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] font-bold text-xs shadow-md hover:bg-[#DFBC72] transition-colors"
              >
                Request Quotation
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Partner Registration Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#17233B] via-[#10192A] to-[#17233B] p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white">
            Provider Onboarding Desk
          </span>
          <h3 className="font-serif text-2xl font-bold text-white">
            Are You an On-Ground Specialist or Licensed Professional in India?
          </h3>
          <p className="text-xs text-stone-300 font-light">
            We are onboarding credentialed advocates, Chartered Accountants, civil contractors, and elder care companions across Tier-1 and Tier-2 hubs. Complete background vetting and get assigned NRI client requirements.
          </p>
        </div>

        <Link
          href="/providers"
          className="px-6 py-3 rounded-xl bg-white text-[#0E1524] text-xs font-bold hover:bg-stone-200 transition-colors flex-shrink-0"
        >
          Submit Partner Application →
        </Link>
      </div>
    </div>
  )
}
