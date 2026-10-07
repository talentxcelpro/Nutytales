'use client'

import React from 'react'
import Link from 'next/link'

const COMPANIES = [
  {
    id: 'business',
    name: 'Nutty Tales Business',
    domain: 'business.nutytales.com',
    href: '/b2b',
    icon: '🏢',
    headline: 'Global B2B Sourcing & Procurement',
    description:
      'Buyers say what they need, the platform finds who can supply it. Wholesale almonds, cashews, saffron, optical-sorted makhana, and recurring replenishment contracts.',
    kpi: '₹48.6L Sourcing GMV',
    cta: 'Enter Business Portal →',
    badge: 'Enterprise Procurement',
    color: 'from-[#10192A] to-[#1E293B]',
  },
  {
    id: 'gifting',
    name: 'Nutty Tales Gifting',
    domain: 'gifting.nutytales.com',
    href: '/gifting',
    icon: '🎁',
    headline: 'Corporate & Multi-Recipient Gifting',
    description:
      'One corporate request executed end-to-end. Upload recipient lists across cities and countries. Laser logo foil stamping, custom greeting cards, and real-time delivery reports.',
    kpi: '1,840 Boxes Dispatched',
    cta: 'Enter Gifting Desk →',
    badge: 'Diwali 2026 Early Bird',
    color: 'from-[#2C1810] to-[#43281C]',
  },
  {
    id: 'weddings',
    name: 'Nutty Tales Weddings',
    domain: 'weddings.nutytales.com',
    href: '/weddings',
    icon: '💍',
    headline: 'The Wedding Operating System',
    description:
      'Plan and execute your destination wedding. Interactive 6-event workspace, auto-balanced budgets, wazwan banquets, verified vendors, and royal dry fruit trousseau hampers.',
    kpi: '₹1.85 Cr Wedding GMV',
    cta: 'Launch Wedding Workspace →',
    badge: 'The Wedding OS',
    color: 'from-[#2D1520] to-[#4A1525]',
  },
  {
    id: 'crafts',
    name: 'Nutty Tales Crafts',
    domain: 'crafts.nutytales.com',
    href: '/crafts',
    icon: '🧣',
    headline: 'Global Fashion & Heritage Marketplace',
    description:
      'Evidence-backed Himalayan luxury. 14.5µm Changthangi Pashmina with official GI QR-tags, embroidered wool pherans, tailored coats, and B2B wholesale export consignments.',
    kpi: '14 Registered Guilds',
    cta: 'Explore Crafts Marketplace →',
    badge: 'GI Tag Certified',
    color: 'from-[#17233B] to-[#125350]',
  },
  {
    id: 'stays',
    name: 'Nutty Tales Stays',
    domain: 'stays.nutytales.com',
    href: '/stays',
    icon: '🏔️',
    headline: 'Hospitality & Stay-Experiences',
    description:
      'Book the stay and everything around it. Harwan walnut orchard villa suites, private delegation estate buyouts, wood-burning bukharis, wazwan feasts, and local excursions.',
    kpi: '84.2% Seasonal Occupancy',
    cta: 'Explore Orchard Stays →',
    badge: 'Boutique Hospitality',
    color: 'from-[#0E3A43] to-[#176B68]',
  },
  {
    id: 'travel',
    name: 'Nutty Tales Travel',
    domain: 'travel.nutytales.com',
    href: '/travel',
    icon: '✈️',
    headline: 'Curated Expeditions & Trip Execution',
    description:
      'Don’t just book a trip. Build the trip. SI Dynamic Itinerary Planner, 4x4 snow safaris, Gulmarg Gondola Phase 2 passes, and licensed Destination Management Companies (DMCs).',
    kpi: '24 Expeditions In-Flight',
    cta: 'Build My Trip →',
    badge: 'SI Itinerary Planner',
    color: 'from-[#1B263B] to-[#0D1B2A]',
  },
]

export default function GroupPortfolioShowcase() {
  return (
    <section className="py-20 bg-[#FAF6EE] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-bold uppercase tracking-widest">
            <span>✦</span> NUTTY TALES GROUP PORTFOLIO
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
            Six Independent Global Digital Businesses
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
            Nutty Tales operates as a technology group ecosystem. Each business is an independent global company with its own customers, suppliers, marketplace, and operations, powered by a shared foundation of intelligence, verified provenance, and execution.
          </p>
        </div>

        {/* 6 Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {COMPANIES.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Banner */}
              <div
                className={`p-6 bg-gradient-to-br ${company.color} text-white space-y-3 relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner">
                    {company.icon}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B]">
                    {company.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-300 uppercase tracking-widest font-mono block">
                    {company.domain}
                  </span>
                  <h3 className="font-serif text-xl font-bold mt-0.5">
                    {company.name}
                  </h3>
                  <span className="text-xs text-[#C9A45C] font-medium block">
                    {company.headline}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {company.description}
                </p>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">Core Metric:</span>
                  <span className="font-bold text-[#17233B]">{company.kpi}</span>
                </div>

                <Link
                  href={company.href}
                  className="w-full block py-3 text-center text-xs font-bold uppercase tracking-wider bg-[#FAF6EE] hover:bg-[#17233B] text-[#17233B] hover:text-white rounded-xl transition-colors border border-stone-300"
                >
                  {company.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
