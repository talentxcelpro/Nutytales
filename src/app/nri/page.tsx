'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import GetSomethingDoneEngine from '@/components/nri/GetSomethingDoneEngine'
import { NRI_CATEGORIES, OPERATIONAL_CITIES } from '@/lib/nri/nri-data'

export default function NriHomePage() {
  const [activeProofTab, setActiveProofTab] = useState<'dossier' | 'checklist' | 'milestones' | 'verification'>('dossier')

  // The 6 Flagship Core Services for immediate discovery
  const coreServices = [
    {
      key: 'property_management',
      href: '/services/property-management',
      title: 'Property Management',
      tagline: 'Inspections, tenant liaison, maintenance & vacant plot monitoring',
      badge: 'GPS Timestamped Proof',
      image: '/images/stays/kashmir-orchard-estate.jpg',
      icon: '🏡',
      inclusions: [
        'Comprehensive 42-point walkthrough with 30+ date/GPS stamped photos',
        'Tenant agreement verification & maintenance complaint resolution',
        'Electricity, water, society dues & municipal tax ledger clearance',
      ],
      availability: 'Active Hubs: Srinagar, Delhi NCR, Mumbai, Bengaluru, Chandigarh',
      pricingMode: 'Fixed Inspection (₹3,499) or Monthly Retainer RFQ',
    },
    {
      key: 'parent_care',
      href: '/services/parent-care',
      title: 'Parents & Family Care',
      tagline: 'Scheduled home visits, medical errands, grocery delivery & companion care',
      badge: 'Dedicated Local Companion',
      image: '/images/stays/corporate-work-villa.jpg',
      icon: '❤️',
      inclusions: [
        'Bi-weekly or monthly respectful home visits with check-in summaries',
        'Prescription medicine pickup & doorstep delivery from licensed pharmacies',
        'Hospital OPD escorts, bank branch accompaniment & pension life certificate',
      ],
      availability: 'Active Hubs: Delhi NCR, Srinagar, Chandigarh, Mumbai, Bengaluru, Amritsar',
      pricingMode: 'Single Companion Visit (₹1,999) or Standing Monthly Plan',
    },
    {
      key: 'home_services',
      href: '/services/home-services',
      title: 'Home Repairs & Turnkey Care',
      tagline: 'Deep cleaning, plumbing, electrical rewiring, winterization & painting',
      badge: 'Vetted Craft Guilds',
      image: '/images/stays/gulmarg-ski-chalet.jpg',
      icon: '🔧',
      inclusions: [
        'High-pressure deep sanitization before family arrivals',
        'Pipe winterization, drainage clearance & water-tank flushing',
        'Civil repairs, terrace waterproofing & turnkey painting supervision',
      ],
      availability: 'Active Hubs: Srinagar, Delhi NCR, Chandigarh, Pune, Mumbai',
      pricingMode: 'Itemized Contractor Quotations with Milestone Custody',
    },
    {
      key: 'legal_documents',
      href: '/services/legal-documents',
      title: 'Legal & Document Assistance',
      tagline: 'Power of Attorney (POA), consular attestation, registry search & mutation',
      badge: 'Bar Council Advocates',
      image: null,
      icon: '📜',
      inclusions: [
        'Power of Attorney consular drafting, adjudication & Sub-Registrar execution',
        'Sub-Registrar non-encumbrance certificate & 30-year ancestral title search',
        'Revenue mutation (Inteqal), Jamabandi retrieval & partition representation',
      ],
      availability: 'Jurisdictions: Delhi NCR, J&K, Punjab, Haryana, Maharashtra',
      pricingMode: 'Fixed Scoping Filing Fees + Advocate Quotations',
    },
    {
      key: 'healthcare',
      href: '/services/healthcare',
      title: 'Healthcare Coordination',
      tagline: 'Specialist OPD booking, hospital escorts & bedside care liaison',
      badge: 'Tertiary Hospital Liaison',
      image: null,
      icon: '🏥',
      inclusions: [
        'Prioritized consultations at Max, Medanta, Apollo, Fortis & AIIMS',
        'Dedicated attendant accompaniment for OPD diagnostics & blood collections',
        'Post-discharge nursing attendant coordination and prescription replenishment',
      ],
      availability: 'Active Hubs: Delhi NCR, Mumbai, Bengaluru, Srinagar, Chandigarh',
      pricingMode: 'Scheduled Hospital Escort (₹2,499) + Medical Billing Direct',
    },
    {
      key: 'travel_stays',
      href: '/services/travel',
      title: 'Travel, Stays & Chauffeurs',
      tagline: 'Chauffeur luxury SUVs, ancestral return tours & heritage villas',
      badge: 'Curated Private Fleets',
      image: '/images/stays/cedar-houseboat.jpg',
      icon: '🚗',
      inclusions: [
        'Dedicated chauffeur luxury SUV fleets across North India & Kashmir',
        'Private heritage orchard estates, ski chalets & luxury houseboats',
        'Turnkey diaspora homecoming itineraries with personal security assistance',
      ],
      availability: 'Active Hubs: Srinagar, Gulmarg, Pahalgam, Delhi NCR, Chandigarh',
      pricingMode: 'Daily Chauffeur SUV Fleet (₹4,500/day) & Bespoke Stays',
    },
  ]

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* ── 1. Hero Section ── */}
      <section className="relative pt-10 sm:pt-14 pb-16 overflow-hidden bg-gradient-to-b from-[#0E1524] via-[#0B101D] to-[#0A0E18]">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#176B68]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          {/* Hero Branding & Statement */}
          <div className="text-center space-y-3.5 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-[#C9A45C]/30 text-xs text-[#C9A45C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dedicated Operating Platform for the Global Indian Diaspora</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              India, handled.{' '}
              <span className="bg-gradient-to-r from-[#C9A45C] via-[#E7CB8E] to-[#C9A45C] bg-clip-text text-transparent block sm:inline">
                From anywhere in the world.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
              Your trusted team in India, while you live anywhere in the world. Family check-ins, ancestral properties, documents, healthcare coordination, and custom requirements—handled with verified accountability.
            </p>
          </div>

          {/* Signature Request Engine */}
          <GetSomethingDoneEngine />

          {/* Operational Hubs Live Ticker */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-400">
            <div className="flex items-center gap-2 text-stone-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Active On-Ground Operations Hubs:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px]">
              {OPERATIONAL_CITIES.slice(0, 6).map((city) => (
                <div
                  key={city.id}
                  className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg border border-white/10"
                >
                  <span className="text-white font-medium">{city.name}</span>
                  <span className="text-stone-400">({city.state})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Service Discovery (Directly Below Hero) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C9A45C] font-bold">
              Immediate Service Discovery
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              What We Handle in India
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl">
              Explore our 6 flagship service verticals. Each request is managed by vetted coordinators with verifiable photographic proof and milestone custody.
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-bold text-[#C9A45C] hover:text-white flex items-center gap-1 transition-colors self-start md:self-auto"
          >
            <span>Explore All 11 Service Verticals</span>
            <span>→</span>
          </Link>
        </div>

        {/* 6 Core Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((srv) => (
            <div
              key={srv.key}
              className="group rounded-3xl bg-[#0E1524] border border-white/10 hover:border-[#C9A45C]/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C9A45C]/10 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Visual Header (Image or Luxury Graphic) */}
                {srv.image ? (
                  <div className="relative h-44 w-full overflow-hidden bg-black/40">
                    <Image
                      src={srv.image}
                      alt={srv.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1524] via-black/40 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0E1524]/90 text-[#C9A45C] border border-[#C9A45C]/40 backdrop-blur-md">
                        {srv.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span className="text-2xl">{srv.icon}</span>
                      <h3 className="font-serif text-lg font-bold text-white leading-tight">
                        {srv.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 pb-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10">
                        {srv.icon}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30">
                        {srv.badge}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#C9A45C] transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs text-stone-400 font-light mt-1">
                        {srv.tagline}
                      </p>
                    </div>
                  </div>
                )}

                {/* Body Details */}
                <div className="p-5 pt-3 space-y-3">
                  {srv.image && (
                    <p className="text-xs text-stone-300 font-light leading-relaxed">
                      {srv.tagline}
                    </p>
                  )}

                  {/* Sample Scope Inclusions */}
                  <ul className="space-y-1.5 text-[11px] text-stone-300">
                    {srv.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 text-xs font-bold">✓</span>
                        <span className="leading-tight">{inc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Coverage & Pricing Standard */}
                  <div className="pt-2 text-[10px] text-stone-400 space-y-1 border-t border-white/5">
                    <div>
                      <span className="text-stone-500 font-semibold">Coverage: </span>
                      <span className="text-stone-300">{srv.availability}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 font-semibold">Model: </span>
                      <span className="text-[#C9A45C] font-medium">{srv.pricingMode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={srv.href}
                  className="text-xs font-semibold text-stone-300 hover:text-white transition-colors"
                >
                  View Details →
                </Link>

                <Link
                  href={`/#request-engine`}
                  className="px-3.5 py-1.5 rounded-lg bg-[#C9A45C]/15 text-[#C9A45C] text-xs font-bold hover:bg-[#C9A45C] hover:text-[#0E1524] transition-colors"
                >
                  Request Scoping
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal Callout to Other 5 Verticals */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-stone-300 text-center sm:text-left">
            Looking for <strong>Kashmir Destination Weddings, GI Heritage Crafts, Festive Gifting, 15CA/15CB Tax Advisory</strong>, or <strong>Supplier Factory Sourcing</strong>?
          </span>
          <Link
            href="/services"
            className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors whitespace-nowrap"
          >
            Explore All 11 Verticals →
          </Link>
        </div>
      </section>

      {/* ── 3. Trust & Verifiable Proof of Service ── */}
      <section className="bg-gradient-to-b from-[#10192A] via-[#0E1524] to-[#0A0E18] py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C9A45C] font-bold">
              Accountability & Evidence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Verifiable Proof of Service Execution
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              We never ask you to rely on informal word-of-mouth. Every ground assignment produces authentic, date/GPS-stamped photographic proof uploaded to your private portal before milestone disbursement.
            </p>
          </div>

          {/* Interactive Evidence Explorer */}
          <div className="bg-[#0B111D] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 text-xs">
              <button
                type="button"
                onClick={() => setActiveProofTab('dossier')}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                  activeProofTab === 'dossier'
                    ? 'bg-[#C9A45C] text-[#0E1524]'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                📷 Real Inspection Dossier
              </button>
              <button
                type="button"
                onClick={() => setActiveProofTab('checklist')}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                  activeProofTab === 'checklist'
                    ? 'bg-[#C9A45C] text-[#0E1524]'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                📋 Standard 42-Point Checklist
              </button>
              <button
                type="button"
                onClick={() => setActiveProofTab('milestones')}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                  activeProofTab === 'milestones'
                    ? 'bg-[#C9A45C] text-[#0E1524]'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                🛡️ Phased Milestone Custody
              </button>
              <button
                type="button"
                onClick={() => setActiveProofTab('verification')}
                className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                  activeProofTab === 'verification'
                    ? 'bg-[#C9A45C] text-[#0E1524]'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                ⚖️ 5-Point Vetting Standard
              </button>
            </div>

            {/* Tab 1: Real Inspection Dossier */}
            {activeProofTab === 'dossier' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400">
                      Authentic Field Dossier Preview
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Harwan Orchard Estate, Srinagar — Structural & Perimeter Audit
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      GPS: 34.1481° N, 74.8973° E • Logged: 06 Oct 2026, 14:15 IST • Coordinator: J&K Central Desk
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 self-start sm:self-auto">
                    ✓ Customer Approved & Disbursed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#121B2B] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-black/60">
                      <Image
                        src="/images/stays/kashmir-orchard-estate.jpg"
                        alt="Boundary perimeter inspection"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[9px] font-mono text-emerald-300">
                        GPS 34.1481°N, 74.8973°E
                      </div>
                    </div>
                    <strong className="text-white text-xs block">1. Perimeter & Main Gate Integrity</strong>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Boundary wall intact; no encroachment observed. Lock mechanism functional. Front orchard gate secured.
                    </p>
                  </div>

                  <div className="bg-[#121B2B] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-black/60 flex items-center justify-center p-4">
                      <div className="text-center space-y-1">
                        <span className="text-3xl block">⚡</span>
                        <span className="font-mono text-sm font-bold text-amber-400 block">Meter #JKP-88219</span>
                        <span className="text-[11px] text-stone-300 block">Reading: 14,280 kWh</span>
                        <span className="text-[10px] text-emerald-400 block">Tariff: Paid Up-to-Date</span>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[9px] font-mono text-amber-300">
                        Meter Stamp: Oct 6, 2026
                      </div>
                    </div>
                    <strong className="text-white text-xs block">2. Utility Metering & Bills</strong>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Physical meter photographed and cross-verified against PDD online ledger. Zero pending arrears.
                    </p>
                  </div>

                  <div className="bg-[#121B2B] p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-black/60 flex items-center justify-center p-4">
                      <div className="text-center space-y-1">
                        <span className="text-3xl block">💧</span>
                        <span className="font-mono text-sm font-bold text-blue-300 block">Moisture Audit: 12%</span>
                        <span className="text-[11px] text-stone-300 block">Ceiling Seepage: None</span>
                        <span className="text-[10px] text-emerald-400 block">Pipes Winterized: Completed</span>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[9px] font-mono text-blue-300">
                        Thermal Sensor: Normal
                      </div>
                    </div>
                    <strong className="text-white text-xs block">3. Structural & Winterization Check</strong>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      Main roof shingles inspected. External water supply lines insulated with mineral wool to prevent winter freezing.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Standard 42-Point Checklist */}
            {activeProofTab === 'checklist' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-white">
                    The 42-Point Property & Facility Inspection Standard
                  </h3>
                  <p className="text-xs text-stone-300 font-light">
                    Every property visit follows our standardized protocol. Coordinators cannot close an assignment without completing all checkpoints.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {[
                    'Exterior boundary walls & compound fence security',
                    'Main entrance gates, deadbolts & master locks',
                    'Window glass panes, grill fastenings & latch alignment',
                    'Terrace, parapet & balcony drainage flow clearance',
                    'Ceiling moisture levels & seepage hygrometer check',
                    'Electrical main distribution board & breaker status',
                    'Electricity meter reading & serial number recording',
                    'Water supply connection, overhead tank & float valve',
                    'Bathroom fixtures, taps & under-sink leakage audit',
                    'Kitchen sink, waste pipe & grease trap condition',
                    'Pest, termite & rodent evidence inspection',
                    'Garden vegetation, lawn overgrowth & tree trimming check',
                  ].map((chk, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span className="text-stone-300 leading-tight">{chk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Phased Milestone Custody */}
            {activeProofTab === 'milestones' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-white">
                    How Phased Milestone Custody Protects Your Funds
                  </h3>
                  <p className="text-xs text-stone-300 font-light">
                    Unlike informal contractor engagements where advance payments are at risk, our platform safeguards your money in phased milestones.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="bg-[#121B2B] p-5 rounded-2xl border border-white/10 space-y-2">
                    <span className="font-mono text-2xl font-bold text-[#C9A45C]">01</span>
                    <strong className="text-white block text-sm">Initial Mobilization (40%)</strong>
                    <p className="text-stone-300 font-light leading-relaxed">
                      Deposited when you accept the quotation. Held securely in platform custody to reserve the coordinator slot and cover ground transit.
                    </p>
                  </div>

                  <div className="bg-[#121B2B] p-5 rounded-2xl border border-white/10 space-y-2">
                    <span className="font-mono text-2xl font-bold text-[#C9A45C]">02</span>
                    <strong className="text-white block text-sm">Evidence Upload & Audit</strong>
                    <p className="text-stone-300 font-light leading-relaxed">
                      The coordinator executes the task and uploads GPS-timestamped photos and checklists to your dashboard. The operations supervisor verifies adherence.
                    </p>
                  </div>

                  <div className="bg-[#121B2B] p-5 rounded-2xl border border-white/10 space-y-2">
                    <span className="font-mono text-2xl font-bold text-[#C9A45C]">03</span>
                    <strong className="text-white block text-sm">Final Milestone Release (60%)</strong>
                    <p className="text-stone-300 font-light leading-relaxed">
                      The remaining funds are disbursed only after you inspect the evidence and click &quot;Approve Sign-Off&quot;. Instant dispute escalation available if unsatisfied.
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 italic pt-2">
                  * Regulatory Notice: Milestone custody operates as a contractual payment schedule between client, platform, and coordinator. Nuty Tales is not a banking depository or regulated escrow institution.
                </p>
              </div>
            )}

            {/* Tab 4: 5-Point Vetting Standard */}
            {activeProofTab === 'verification' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold text-white">
                    Our 5-Point Specialist Vetting Protocol
                  </h3>
                  <p className="text-xs text-stone-300 font-light">
                    Every ground coordinator and professional partner undergoes strict verification before being assigned overseas client tasks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-[#121B2B] p-4 rounded-2xl border border-white/10 space-y-1">
                    <strong className="text-emerald-400 block text-xs">1. Government Identity & Police Clearance</strong>
                    <p className="text-stone-300 font-light leading-relaxed">
                      Physical Aadhaar card verification, PAN authentication, and local police verification records verified for all ground coordinators.
                    </p>
                  </div>

                  <div className="bg-[#121B2B] p-4 rounded-2xl border border-white/10 space-y-1">
                    <strong className="text-emerald-400 block text-xs">2. Professional Licensing Accreditation</strong>
                    <p className="text-stone-300 font-light leading-relaxed">
                      Legal drafting handled exclusively by Bar Council enrolled advocates. Tax matters handled by ICAI Chartered Accountants.
                    </p>
                  </div>

                  <div className="bg-[#121B2B] p-4 rounded-2xl border border-white/10 space-y-1">
                    <strong className="text-emerald-400 block text-xs">3. Diaspora Privacy & Code of Conduct</strong>
                    <p className="text-stone-300 font-light leading-relaxed">
                      Binding Non-Disclosure Agreements (NDAs). Zero unsolicited contact with relatives; strict respect for elderly dignity and property privacy.
                    </p>
                  </div>

                  <div className="bg-[#121B2B] p-4 rounded-2xl border border-white/10 space-y-1">
                    <strong className="text-emerald-400 block text-xs">4. Verifiable Track Record Verification</strong>
                    <p className="text-stone-300 font-light leading-relaxed">
                      Prior commercial references and ground experience verified in target operational hubs before assignment.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. My India — Operating Dashboard Preview ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#17233B] via-[#10192A] to-[#17233B] p-8 sm:p-12 border-2 border-[#C9A45C]/30 shadow-2xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#C9A45C] text-[#0E1524]">
                The Signature Customer Experience
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                My India — Your Personal Command Center
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl leading-relaxed">
                Not a generic e-commerce account. A unified operating dashboard bringing together your family profiles, property dossiers, document vault, and live service timelines.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold shadow-lg hover:shadow-[#C9A45C]/25 transition-all text-center flex-shrink-0"
            >
              Open My India Dashboard →
            </Link>
          </div>

          {/* Interactive Feature Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { label: 'Family Profiles', icon: '❤️', desc: 'Parent check-ins & health logs' },
              { label: 'Property Dossiers', icon: '🏡', desc: 'Inspection photo logs & bills' },
              { label: 'Active Requests', icon: '⚡', desc: 'Live milestone execution' },
              { label: 'Document Vault', icon: '📂', desc: 'Encrypted POAs & title deeds' },
              { label: 'Activity Timeline', icon: '🕒', desc: 'Chronological audit trail' },
              { label: 'Multi-Family Access', icon: '👥', desc: 'Overseas sibling sharing' },
            ].map((f, i) => (
              <div key={i} className="bg-black/25 p-3.5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-xl block">{f.icon}</span>
                <span className="font-bold text-white text-xs block">{f.label}</span>
                <span className="text-[10px] text-stone-400 block">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Emergency 24/7 Notice & Provider Network Callout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergency Card */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-950/40 to-[#0E1524] p-8 border border-rose-500/30 space-y-4">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-500 text-white tracking-widest">
              Urgent Local Escalation
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              India Emergency Assistance Desk
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Sudden medical escalation, family distress, or severe property alert in India? Submit an emergency dispatch request for prioritized ground coordination.
            </p>
            <div className="pt-2">
              <Link
                href="/emergency"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-colors"
              >
                <span>🚨 Access 24/7 Emergency Desk</span>
              </Link>
            </div>
          </div>

          {/* Become a Provider Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#17233B]/80 to-[#0E1524] p-8 border border-[#C9A45C]/30 space-y-4">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#C9A45C] text-[#0E1524] tracking-widest">
              Join Our Verified Supply Network
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              Are You a Service Specialist in India?
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              We connect qualified advocates, Chartered Accountants, property inspection firms, and elder companion organizations with overseas clients.
            </p>
            <div className="pt-2">
              <Link
                href="/providers"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors"
              >
                <span>🤝 Apply for Provider Verification</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
