'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import GetSomethingDoneEngine from '@/components/nri/GetSomethingDoneEngine'
import { OPERATIONAL_CITIES } from '@/lib/nri/nri-data'
import { PAN_INDIA_DESTINATIONS } from '@/lib/nri/image-registry'

export default function NriHomePage() {
  const [activeCategory, setActiveCategory] = useState('property')
  const [activeProofTab, setActiveProofTab] = useState<'dossier' | 'checklist' | 'milestones' | 'verification'>('dossier')
  const [selectedEvidenceCity, setSelectedEvidenceCity] = useState<'mumbai' | 'delhi' | 'srinagar' | 'bengaluru'>('mumbai')
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'North' | 'West' | 'South' | 'East'>('all')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // 1. Service Category Strip (Airbnb-style)
  const categoryStrip = [
    { id: 'property', label: 'Property Care', icon: '🏡', href: '/services/property-management' },
    { id: 'family', label: 'Parents & Family', icon: '❤️', href: '/services/parent-care' },
    { id: 'home', label: 'Home Services', icon: '🔧', href: '/services/home-services' },
    { id: 'documents', label: 'Documents & Legal', icon: '📜', href: '/services/legal-services' },
    { id: 'healthcare', label: 'Healthcare', icon: '🏥', href: '/services/healthcare' },
    { id: 'travel', label: 'Travel & Stays', icon: '🚗', href: '/services/travel' },
    { id: 'weddings', label: 'Weddings', icon: '💍', href: '/services/weddings' },
    { id: 'gifting', label: 'Gifting', icon: '🎁', href: '/services/gifting' },
    { id: 'tax', label: 'Tax & FEMA', icon: '📊', href: '/services/tax-services' },
    { id: 'business', label: 'Business & Sourcing', icon: '🏢', href: '/services/business' },
    { id: 'more', label: 'All 11 Verticals', icon: '⋯', href: '/services' },
  ]

  // 2. Pan-India Visual Discovery Cards (Everything you need in India)
  const discoveryCards = [
    {
      title: 'Keep Your Family Close',
      description: 'Scheduled companion visits, prescription delivery, and accompanied hospital consultations for aging parents.',
      context: 'Delhi NCR • Mumbai • Bengaluru • Chandigarh • Hyderabad',
      image: '/images/nri/senior-care.jpg',
      href: '/services/parent-care',
      cta: 'Explore Parent Care',
    },
    {
      title: 'Care for Your Property',
      description: 'Physical 42-point walkthroughs, GPS-tagged photo dossiers, tenant coordination, and pre-monsoon/winter maintenance.',
      context: 'Mumbai • Delhi NCR • Bengaluru • Pune • Srinagar',
      image: '/images/nri/mumbai-apartment.jpg',
      href: '/services/property-management',
      cta: 'Explore Property Care',
    },
    {
      title: 'Get Things Fixed & Built',
      description: 'Turnkey interior painting, civil repair supervision, plumbing inspections, and pre-arrival deep sanitization.',
      context: 'Delhi NCR • Bengaluru • Mumbai • Chandigarh • Pune',
      image: '/images/nri/home-repair.jpg',
      href: '/services/home-services',
      cta: 'Explore Home Services',
    },
    {
      title: 'Ancestral Returns & Travel',
      description: 'Dedicated chauffeur luxury SUV fleets, ancestral village return itineraries, and private heritage retreats.',
      context: 'Kerala • Rajasthan • Kashmir Valley • North-South Corridors',
      image: '/images/nri/kerala-heritage.jpg',
      href: '/services/travel',
      cta: 'Plan Your Visit',
    },
  ]

  // 3. Pan-India High-Demand Requests (With transparent estimate notices)
  const popularServices = [
    {
      icon: '🏥',
      title: 'Specialist OPD Hospital Escort',
      desc: 'Accompanied consultations and lab collections at Max, Apollo, Medanta & Manipal.',
      href: '/services/healthcare',
      pricing: '₹2,499 / Hospital Escort',
      coverage: 'Delhi NCR • Bengaluru • Mumbai • Hyderabad',
    },
    {
      icon: '📜',
      title: 'Power of Attorney (POA) Adjudication',
      desc: 'Consular drafting, Indian embassy attestation review, and Sub-Registrar execution.',
      href: '/services/legal-services',
      pricing: 'Direct Advocate Scoping',
      coverage: 'National High Courts & Sub-Registrars',
    },
    {
      icon: '🏡',
      title: '42-Point Vacant Property Walkthrough',
      desc: 'Society flat & villa audit with GPS timestamped photo dossier, meter readings & key checks.',
      href: '/services/property-management',
      pricing: '₹3,499 / Inspection',
      coverage: 'Mumbai • Delhi NCR • Bengaluru • Pune',
    },
    {
      icon: '📊',
      title: '15CA / 15CB Capital Remittance',
      desc: 'ICAI Chartered Accountant certification for ancestral property sale repatriation under FEMA.',
      href: '/services/tax-services',
      pricing: 'Direct ICAI CA Scoping',
      coverage: 'Pan-India Remittance Desks',
    },
    {
      icon: '❄️',
      title: 'Pre-Winter Structural Sealing',
      desc: 'Roof seepage checks, pipe freeze insulation, boundary perimeter verification & meter readings.',
      href: '/services/property-management',
      pricing: '₹3,999 / Inspection',
      coverage: 'Srinagar • Himachal • Hill Stations',
    },
    {
      icon: '💊',
      title: 'Doorstep Prescription Replenishment',
      desc: 'Routine medicine pickup from licensed pharmacies and direct delivery to parents.',
      href: '/services/parent-care',
      pricing: 'Included in Standing Plans',
      coverage: 'Delhi NCR • Mumbai • Bengaluru • Srinagar',
    },
  ]

  // Filtered Pan-India Destinations for Nationwide Section
  const filteredDestinations = selectedRegion === 'all'
    ? PAN_INDIA_DESTINATIONS
    : PAN_INDIA_DESTINATIONS.filter((d) => d.region === selectedRegion)

  // FAQs
  const faqs = [
    {
      q: 'How do I know the coordinator actually visited my house in India?',
      a: 'Every inspection produces an encrypted digital dossier containing geotagged, date/time-stamped photographs of the exterior perimeter, interior rooms, and physical electricity meter. You inspect the full evidence report on your portal before approving milestone payment release.',
    },
    {
      q: 'How does phased milestone custody protect my payments?',
      a: 'We never transfer full funds upfront to local contractors. Initial deposits are held in platform milestone custody to mobilize coordinators. The final milestone (typically 60%) is disbursed only after you review and approve the completed proof on your overseas dashboard.',
    },
    {
      q: 'What is the difference between Direct Fulfillment Hubs and Scoped RFQ Dispatch?',
      a: 'In Direct Fulfillment Hubs (like Delhi NCR, Mumbai, Bengaluru, Srinagar, and Chandigarh), Nuty Tales operates direct on-ground coordinator desks with pre-set pricing and immediate dispatch. In Scoped RFQ Dispatch cities (like Hyderabad, Pune, Jaipur, Kochi, Kolkata, and Patna), assignments are scoped and matched through vetted specialist partners within 24–48 hours.',
    },
    {
      q: 'Can multiple family members in different countries access the same account?',
      a: 'Yes. Through the My India command center, you can invite siblings or co-owners living in London, Dubai, Toronto, or New York to view active inspection logs, share parent health updates, and access the document vault collaboratively.',
    },
    {
      q: 'How are legal matters like Power of Attorney (POA) and property deeds handled?',
      a: 'Legal drafting, consular adjudication, and revenue registry searches are handled strictly by independent, verified advocates enrolled with the Bar Council of India. We do not provide informal legal advice; your matter is represented by credentialed advocates.',
    },
    {
      q: 'What if an on-ground assignment is unsatisfactory or incomplete?',
      a: 'You can raise an instant dispute directly from your request tracker before approving the final milestone. Our Central Operations Desk supervisor reviews the photographic checklist, arbitrates with the ground team, and coordinates immediate rework or refund.',
    },
  ]

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden text-[#191919]">
      {/* ── 1. Editorial Hero (Fluid Full-Width Split Layout) ── */}
      <section className="relative pt-8 sm:pt-14 pb-12 overflow-hidden border-b border-[#EAE6DF]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline & Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EFE6] text-[#8C6D2D] border border-[#E5DEC9] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Pan-India Ground Coordination for the Global Indian Diaspora</span>
              </div>

              <div className="space-y-3">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#191919] leading-[1.12]">
                  Your India, taken care of.
                </h1>
                <p className="text-base sm:text-lg text-stone-600 font-light max-w-2xl leading-relaxed">
                  Trusted local help for your family, home and life in India—wherever you are. Managed through one operating platform with verifiable photographic proof across North, West, South, and East India.
                </p>
              </div>

              {/* The Unified Airbnb-Style Search Experience */}
              <GetSomethingDoneEngine />

              {/* Restrained Trust Strip (Immediately beneath search) */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#8C6D2D]">✓</span>
                  <span>Transparent quotes</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#8C6D2D]">✓</span>
                  <span>Verified professionals</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#8C6D2D]">✓</span>
                  <span>GPS proof of work</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#8C6D2D]">✓</span>
                  <span>Accountable support</span>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Hero Photography (Pan-India National Presence) */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-stone-200">
                <Image
                  src="/images/nri/delhi-residence.jpg"
                  alt="Modern residence and property management in India handled by Nuty Tales"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                {/* Floating Operational Status Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-md flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                      National Operations Desks
                    </span>
                    <strong className="text-xs font-semibold text-stone-900 block">
                      Delhi NCR • Mumbai • Bengaluru • Srinagar • Chandigarh
                    </strong>
                    <span className="text-[11px] text-stone-500 block">
                      GPS-Tagged Photo Dossiers • Milestone Custody
                    </span>
                  </div>

                  <a
                    href="#nationwide-coverage"
                    className="px-3.5 py-1.5 rounded-full bg-[#191919] text-white text-[11px] font-semibold hover:bg-stone-800 transition-colors flex-shrink-0"
                  >
                    View Hubs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Service Category Strip (Airbnb-style Icon Bar) ── */}
      <section id="categories" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="border-b border-[#EAE6DF] pb-4">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-2">
            {categoryStrip.map((cat) => {
              const active = activeCategory === cat.id
              return (
                <Link
                  key={cat.id}
                  href={cat.href}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl transition-all whitespace-nowrap flex-shrink-0 group ${
                    active
                      ? 'border-b-2 border-[#191919] text-[#191919] font-bold'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Visual Discovery Cards (Everything you need in India) ── */}
      <section id="discovery" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EAE6DF] pb-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
              Effortless Discovery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#191919]">
              Everything you need in India, in one place.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl">
              High-touch local coordination for your family, ancestral properties, and travel across India.
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-semibold text-stone-900 hover:text-[#8C6D2D] transition-colors self-start sm:self-auto"
          >
            Browse All 11 Verticals →
          </Link>
        </div>

        {/* 4 Large Editorial Cards in Fluid 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discoveryCards.map((card, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3.5 left-4 right-4">
                    <span className="text-[10px] font-medium text-stone-200 block drop-shadow-sm truncate">
                      {card.context}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white drop-shadow-sm mt-0.5">
                      {card.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF9F6] hover:bg-[#F3EFE6] text-[#191919] text-xs font-semibold border border-stone-300 transition-colors w-full justify-center"
                >
                  <span>{card.cta}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Nationwide Coverage & Discovery (Help Across India, Wherever Life Takes You) ── */}
      <section id="nationwide-coverage" className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE6DF] pb-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
              Pan-India Ground Reach
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#191919]">
              Help across India, wherever life takes you.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-2xl">
              From Delhi NCR to Kochi, and Mumbai to Srinagar. We provide direct fulfillment hubs and vetted specialist partner networks with transparent operational status.
            </p>
          </div>

          {/* Region Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F3EFE6] p-1 rounded-full border border-[#E5DEC9] self-start md:self-auto text-xs">
            {(['all', 'North', 'West', 'South', 'East'] as const).map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#191919] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {reg === 'all' ? 'All India' : `${reg} India`}
              </button>
            ))}
          </div>
        </div>

        {/* Coverage Legend Strip */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600 bg-[#FAF9F6] p-3.5 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <strong className="text-stone-900 font-medium">Direct Fulfillment Hub:</strong>
            <span className="font-light">Dedicated local concierge & ground coordinator desks (Available to Book)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <strong className="text-stone-900 font-medium">Scoped RFQ Dispatch:</strong>
            <span className="font-light">Custom scoping with vetted specialist partners (24–48h Turnaround)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
            <strong className="text-stone-900 font-medium">Expanding Network:</strong>
            <span className="font-light">Coverage feasibility assessed on request</span>
          </div>
        </div>

        {/* Destinations Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDestinations.map((dest, i) => {
            const isDirect = dest.status === 'Direct Fulfillment Hub'
            const isRFQ = dest.status === 'Scoped RFQ Dispatch'
            return (
              <div
                key={i}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                    <Image
                      src={dest.image}
                      alt={dest.city}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Top Status Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/60 text-white backdrop-blur-xs">
                        {dest.region} India
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase backdrop-blur-xs ${
                          isDirect
                            ? 'bg-emerald-600/90 text-white'
                            : isRFQ
                            ? 'bg-amber-500/90 text-stone-950 font-bold'
                            : 'bg-stone-500/90 text-white'
                        }`}
                      >
                        {dest.statusBadge}
                      </span>
                    </div>

                    {/* Bottom City Name */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-medium text-stone-200 block drop-shadow-sm">
                        {dest.state}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white drop-shadow-sm">
                        {dest.city}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {dest.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dest.highlights.map((hl, hIdx) => (
                        <span
                          key={hIdx}
                          className="px-2 py-0.5 rounded-md bg-[#FAF9F6] text-[10px] font-medium text-stone-600 border border-stone-200"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1">
                  <Link
                    href={`/#search-bar`}
                    className="block text-center w-full py-2 rounded-xl bg-stone-50 hover:bg-[#F3EFE6] text-stone-800 text-xs font-semibold border border-stone-200 transition-colors"
                  >
                    {isDirect ? `Book in ${dest.city} →` : `Request Quote →`}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 5. Popular Ways We Help (High Demand Requests) ── */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#EAE6DF] pb-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
              High-Demand Requests
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#191919]">
              Popular ways we help overseas families
            </h2>
            <p className="text-xs text-stone-500 font-light">
              *System-Calculated Estimates. Subject to specific assignment scope and regional logistics.
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-semibold text-stone-900 hover:text-[#8C6D2D] transition-colors self-start sm:self-auto"
          >
            Explore All Solutions →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map((srv, i) => (
            <Link
              key={i}
              href={srv.href}
              className="p-6 bg-white rounded-3xl border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all flex flex-col justify-between group space-y-4 text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] flex items-center justify-center text-2xl">
                    {srv.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-stone-500 px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-stone-200">
                    {srv.coverage}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#8C6D2D] transition-colors">
                  {srv.title}
                </h3>
                <p className="text-xs text-stone-600 font-light leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-stone-900 block">{srv.pricing}</span>
                  <span className="text-[10px] text-stone-400">Estimated Rate</span>
                </div>
                <span className="text-[#8C6D2D] font-semibold group-hover:translate-x-0.5 transition-transform">
                  Book →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. How the Process Works (Apple-Grade Execution Loop) ── */}
      <section className="bg-[#F3EFE6] py-16 border-y border-[#E5DEC9]">
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
              Accountability by Design
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              How the process works
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              We replace informal favors with institutional accountability, verified ground specialists, and contractual milestone custody.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Request in Plain Words',
                desc: 'Describe what your family or property needs in India. Our engine scopes the vertical, city, and deliverables into an itemized draft plan.',
                icon: '✍️',
              },
              {
                step: '02',
                title: 'Transparent Quotation',
                desc: 'Receive formal quotations with milestone breakdowns. Review inclusions and scope before confirming your request.',
                icon: '🤝',
              },
              {
                step: '03',
                title: 'Phased Milestone Custody',
                desc: 'Fund your service in USD, GBP, AED, CAD, or INR. Payments are safeguarded in platform custody and never disbursed blindly upfront.',
                icon: '🛡️',
              },
              {
                step: '04',
                title: 'GPS Proof & Sign-Off',
                desc: 'Receive GPS-timestamped photos, official meter readings, or receipts. Inspect the dossier on your portal before approving release.',
                icon: '📸',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-stone-200 space-y-4 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-mono text-2xl font-bold text-stone-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900">{item.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. What Verified Service Execution Looks Like (Proof Explorer) ── */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
            Verifiable Field Evidence
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            What verified execution looks like
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Every physical inspection and companion errand generates encrypted, GPS-tagged photographic evidence uploaded directly to your overseas dossier.
          </p>
        </div>

        {/* Evidence Explorer Container */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-9 shadow-sm space-y-6">
          {/* Main Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-4 text-xs">
            <button
              type="button"
              onClick={() => setActiveProofTab('dossier')}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                activeProofTab === 'dossier'
                  ? 'bg-[#191919] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              📷 Pan-India Field Dossiers
            </button>
            <button
              type="button"
              onClick={() => setActiveProofTab('checklist')}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                activeProofTab === 'checklist'
                  ? 'bg-[#191919] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              📋 Standard 42-Point Checklist
            </button>
            <button
              type="button"
              onClick={() => setActiveProofTab('milestones')}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                activeProofTab === 'milestones'
                  ? 'bg-[#191919] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              🛡️ Milestone Custody Model
            </button>
            <button
              type="button"
              onClick={() => setActiveProofTab('verification')}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                activeProofTab === 'verification'
                  ? 'bg-[#191919] text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              ⚖️ 5-Point Vetting Standard
            </button>
          </div>

          {/* Tab 1: Pan-India Field Dossiers (With Multi-City Switcher) */}
          {activeProofTab === 'dossier' && (
            <div className="space-y-6 animate-fadeIn text-left">
              {/* City Switcher Buttons */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-stone-500 mr-1">Switch Field Log:</span>
                {[
                  { id: 'mumbai', label: '🏢 Mumbai Apartment (Bandra West)' },
                  { id: 'delhi', label: '❤️ Delhi NCR Elder Escort (Gurugram)' },
                  { id: 'srinagar', label: '🏡 Srinagar Estate (Harwan)' },
                  { id: 'bengaluru', label: '🌳 Bengaluru Villa (Whitefield)' },
                ].map((cityTab) => (
                  <button
                    key={cityTab.id}
                    type="button"
                    onClick={() => setSelectedEvidenceCity(cityTab.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                      selectedEvidenceCity === cityTab.id
                        ? 'bg-[#F3EFE6] text-[#8C6D2D] font-bold border border-[#E5DEC9]'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {cityTab.label}
                  </button>
                ))}
              </div>

              {/* Mumbai Apartment Evidence */}
              {selectedEvidenceCity === 'mumbai' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                        Authentic Field Evidence Report • West India Desk
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Pali Hill Residential Apartment, Bandra West, Mumbai — Pre-Lease Walkthrough
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        GPS: 19.0596° N, 72.8295° E • Logged: 07 Oct 2026, 11:30 IST • Assigned: Mumbai MMR Desk
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                      ✓ Customer Approved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src="/images/nri/mumbai-apartment.jpg"
                          alt="Society tower and gate check"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono text-emerald-300">
                          GPS 19.0596°N, 72.8295°E
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">1. Society Facade & Security Gate Access</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Society security guard register checked. Key handover verified with building management office.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src="/images/nri/modern-apartment-interior.jpg"
                          alt="Turnkey apartment interior walkthrough"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono text-emerald-300">
                          GPS 19.0596°N, 72.8295°E
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">2. Interior Walkthrough & Fixture Checklist</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        All split AC units, modular kitchen hob, and master geysers tested. Zero seepage detected in balconies.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center p-4">
                        <div className="text-center space-y-1">
                          <span className="text-3xl block">⚡</span>
                          <span className="font-mono text-sm font-bold text-stone-900 block">Adani Elec #ADE-9104</span>
                          <span className="text-xs text-stone-600 block">Meter Reading: 8,412 Units</span>
                          <span className="text-[10px] text-emerald-700 font-semibold block">MGL Piped Gas: Active & Paid</span>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-100 rounded text-[9px] font-mono text-stone-600">
                          Stamp: Oct 7, 2026
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">3. Utility Metering & Clearance</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Meter dial photographed and matched with online bill. Handover ready for incoming tenant.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Delhi NCR Senior Care Evidence */}
              {selectedEvidenceCity === 'delhi' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                        Authentic Field Evidence Report • North India Desk
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        DLF Phase 5, Gurugram, Delhi NCR — Hospital Escort & Prescription Delivery
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        GPS: 28.4595° N, 77.0266° E • Logged: 05 Oct 2026, 09:45 IST • Assigned: Delhi NCR Care Desk
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                      ✓ Family Approved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src="/images/nri/senior-care.jpg"
                          alt="Senior parent companion meet"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono text-emerald-300">
                          GPS 28.4595°N, 77.0266°E
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">1. Doorstep Companion Meet & Check-in</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Vitals recorded (BP: 122/78, Sugar: 104). Assisted parents into private sanitized vehicle.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src="/images/nri/healthcare-escort.jpg"
                          alt="Hospital OPD consultation escort"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono text-emerald-300">
                          GPS 28.4595°N, 77.0266°E
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">2. Accompanied OPD at Fortis Memorial</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Consultation with Dr. Sharma (Cardiology). Prescriptions scanned directly to overseas vault.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center p-4">
                        <div className="text-center space-y-1">
                          <span className="text-3xl block">💊</span>
                          <span className="font-mono text-sm font-bold text-stone-900 block">Apollo Pharmacy #982</span>
                          <span className="text-xs text-stone-600 block">30-Day Refill Collected</span>
                          <span className="text-[10px] text-emerald-700 font-semibold block">Delivered & Stored at Home</span>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-100 rounded text-[9px] font-mono text-stone-600">
                          Stamp: Oct 5, 2026
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">3. Pharmacy Refill & Safe Return</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Monthly medicines procured and organized by dosage. Parents settled comfortably at residence.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Srinagar Estate Evidence */}
              {selectedEvidenceCity === 'srinagar' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                        Authentic Field Evidence Report • J&K Operations Desk
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Harwan Orchard Estate, Srinagar — Structural & Perimeter Pre-Winter Audit
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        GPS: 34.1481° N, 74.8973° E • Logged: 06 Oct 2026, 14:15 IST • Assigned: Srinagar Field Desk
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                      ✓ Customer Approved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src="/images/stays/kashmir-orchard-estate.jpg"
                          alt="Boundary perimeter inspection"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono text-emerald-300">
                          GPS 34.1481°N, 74.8973°E
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">1. Perimeter & Gate Integrity</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Boundary stone wall intact. Zero structural displacement. Main entrance deadbolts lubricated and secured.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center p-4">
                        <div className="text-center space-y-1">
                          <span className="text-3xl block">⚡</span>
                          <span className="font-mono text-sm font-bold text-stone-900 block">Meter #JKP-88219</span>
                          <span className="text-xs text-stone-600 block">Reading: 14,280 kWh</span>
                          <span className="text-[10px] text-emerald-700 font-semibold block">Electricity Arrears: Nil</span>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-100 rounded text-[9px] font-mono text-stone-600">
                          Stamp: Oct 6, 2026
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">2. Utility Metering & Ledgers</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Physical meter dial photographed and verified against PDD online account. No pending dues.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center p-4">
                        <div className="text-center space-y-1">
                          <span className="text-3xl block">💧</span>
                          <span className="font-mono text-sm font-bold text-stone-900 block">Moisture Audit: 12%</span>
                          <span className="text-xs text-emerald-700 font-semibold block">Seepage: None Detected</span>
                          <span className="text-[10px] text-stone-500 block">External Pipes: Winterized</span>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-100 rounded text-[9px] font-mono text-stone-600">
                          Sensor: Calibrated
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">3. Structural Moisture & Pipes</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Thermal sensor confirms roof shingles dry. External supply pipes wrapped in insulation to avoid sub-zero freezing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bengaluru Villa Evidence */}
              {selectedEvidenceCity === 'bengaluru' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                        Authentic Field Evidence Report • South India Desk
                      </span>
                      <h3 className="font-serif text-lg font-bold text-stone-900">
                        Prestige Glenwood, Whitefield, Bengaluru — Gated Community Villa Audit
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        GPS: 12.9698° N, 77.7500° E • Logged: 04 Oct 2026, 16:20 IST • Assigned: Bengaluru South Desk
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
                      ✓ Customer Approved
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src="/images/nri/bengaluru-villa.jpg"
                          alt="Gated community villa exterior"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono text-emerald-300">
                          GPS 12.9698°N, 77.7500°E
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">1. Villa Exterior & Garden Boundary</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Lawn maintenance inspected. Perimeter solar fencing confirmed active with community security control.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-stone-200">
                        <Image
                          src="/images/nri/home-repair.jpg"
                          alt="Water tank and pump inspection"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/75 rounded text-[9px] font-mono text-emerald-300">
                          GPS 12.9698°N, 77.7500°E
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">2. Sump Pump & Tank Float Inspection</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Hydro-pneumatic booster pump tested and cycling smoothly. Overhead water tank float valve functional.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                      <div className="relative h-44 rounded-xl overflow-hidden bg-white border border-stone-200 flex items-center justify-center p-4">
                        <div className="text-center space-y-1">
                          <span className="text-3xl block">⚡</span>
                          <span className="font-mono text-sm font-bold text-stone-900 block">BESCOM #BLR-4421</span>
                          <span className="text-xs text-stone-600 block">Reading: 21,940 Units</span>
                          <span className="text-[10px] text-emerald-700 font-semibold block">Solar Grid Export: 420 kWh</span>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-stone-100 rounded text-[9px] font-mono text-stone-600">
                          Stamp: Oct 4, 2026
                        </div>
                      </div>
                      <strong className="text-stone-900 text-xs block">3. BESCOM Solar Net-Metering Audit</strong>
                      <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                        Dual meter reading logged. Solar rooftop feed-in verified against Karnataka electricity portal.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Standard 42-Point Checklist */}
          {activeProofTab === 'checklist' && (
            <div className="space-y-4 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  The 42-Point Property & Structural Standard
                </h3>
                <p className="text-xs text-stone-600 font-light">
                  Standardized physical checkpoints inspected on every walkthrough before milestone sign-off across India.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-2">
                {[
                  'Exterior boundary wall & fencing integrity',
                  'Main entrance gate, deadbolts & master locks',
                  'Window glass panes, safety grills & latch alignment',
                  'Roof terrace drainage & parapet gutters',
                  'Ceiling moisture levels & hygrometer readings',
                  'Main electrical distribution board & earth leakage',
                  'Physical electricity meter serial & kilowatt readings',
                  'Water inlet valve, overhead tank & float ball check',
                  'Bathroom drainage lines & under-sink pipe leaks',
                  'Kitchen gas line, exhaust & waste disposal check',
                  'Termite, rodent & post-monsoon pest evidence',
                  'Garden boundary & rainwater harvesting clearance',
                ].map((chk, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#FAF9F6] p-3 rounded-xl border border-stone-200">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-stone-700 leading-tight">{chk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Milestone Custody Model */}
          {activeProofTab === 'milestones' && (
            <div className="space-y-4 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  How Phased Milestone Custody Protects Your Capital
                </h3>
                <p className="text-xs text-stone-600 font-light">
                  Payments are held according to agreed service milestones and disbursed only upon customer sign-off.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-mono text-2xl font-bold text-[#8C6D2D]">01</span>
                  <strong className="text-stone-900 block text-sm">Mobilization Deposit (40%)</strong>
                  <p className="text-stone-600 font-light leading-relaxed">
                    Deposited upon quotation acceptance. Held in platform custody to schedule the coordinator and cover field mobilization.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-mono text-2xl font-bold text-[#8C6D2D]">02</span>
                  <strong className="text-stone-900 block text-sm">Field Execution & Proof</strong>
                  <p className="text-stone-600 font-light leading-relaxed">
                    The coordinator completes the task and uploads GPS-timestamped photos and checklists to your dashboard for review.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-mono text-2xl font-bold text-[#8C6D2D]">03</span>
                  <strong className="text-stone-900 block text-sm">Final Milestone Release (60%)</strong>
                  <p className="text-stone-600 font-light leading-relaxed">
                    Disbursed only after you review the evidence and approve completion. Instant dispute mediation if anything was missed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: 5-Point Vetting Standard */}
          {activeProofTab === 'verification' && (
            <div className="space-y-4 animate-fadeIn text-left">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  The 5-Point Specialist Vetting Protocol
                </h3>
                <p className="text-xs text-stone-600 font-light">
                  Every ground coordinator and professional partner undergoes strict verification before being assigned tasks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-xs">1. Government Identity & Police Clearance</strong>
                  <p className="text-stone-600 font-light leading-relaxed">
                    Aadhaar biometric verification and local police verification records verified for all coordinators.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-xs">2. Professional Licensing Accreditation</strong>
                  <p className="text-stone-600 font-light leading-relaxed">
                    Legal drafting handled exclusively by Bar Council enrolled advocates. Tax matters handled by ICAI Chartered Accountants.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-xs">3. Diaspora Privacy & Code of Conduct</strong>
                  <p className="text-stone-600 font-light leading-relaxed">
                    Binding NDAs. Zero unsolicited contact with relatives; strict respect for elderly dignity and property privacy.
                  </p>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block text-xs">4. Verifiable Track Record Verification</strong>
                  <p className="text-stone-600 font-light leading-relaxed">
                    Prior local commercial references and ground experience verified in target operational hubs before assignment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 8. My India Customer Dashboard Preview ── */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="rounded-3xl bg-white border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8 text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#F3EFE6] text-[#8C6D2D] border border-[#E5DEC9]">
                The Signature Customer Experience
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                My India — Your Personal Command Center
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                Not a generic retail account. A unified operating dashboard bringing together your family profiles, property dossiers, document vault, and live service timelines across India.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-full bg-[#191919] hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-all text-center flex-shrink-0"
            >
              Open My India Dashboard →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { label: 'Family Profiles', icon: '❤️', desc: 'Parent check-ins & health logs' },
              { label: 'Property Dossiers', icon: '🏡', desc: 'Inspection photo logs & bills' },
              { label: 'Active Requests', icon: '⚡', desc: 'Live milestone execution' },
              { label: 'Document Vault', icon: '📂', desc: 'Encrypted POAs & title deeds' },
              { label: 'Activity Timeline', icon: '🕒', desc: 'Chronological audit trail' },
              { label: 'Multi-Family Access', icon: '👥', desc: 'Overseas sibling sharing' },
            ].map((f, i) => (
              <div key={i} className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-xl block">{f.icon}</span>
                <span className="font-semibold text-stone-900 text-xs block">{f.label}</span>
                <span className="text-[10px] text-stone-500 block leading-tight">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Frequently Asked Questions ── */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-8 lg:px-12 space-y-8 text-left">
        <div className="text-center space-y-2">
          <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
            Clear Answers
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const open = expandedFaq === i
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(open ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 hover:bg-stone-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-stone-900">{faq.q}</span>
                  <span className="text-stone-400 font-mono text-sm">{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="px-6 pb-4 pt-1 text-xs text-stone-600 font-light leading-relaxed border-t border-stone-100 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 10. Final Call to Action ── */}
      <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="rounded-3xl bg-[#F3EFE6] border border-[#E5DEC9] p-8 sm:p-14 text-center space-y-6">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#8C6D2D] font-bold">
              Ready to Handle Something in India?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              India, handled. From anywhere in the world.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light max-w-xl mx-auto leading-relaxed">
              Describe any responsibility—property inspection, companion visit, or legal filing. Receive an itemized plan and transparent quote.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#search-bar"
              className="px-7 py-3.5 rounded-full bg-[#191919] hover:bg-stone-800 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Start a Request Now →
            </a>
            <Link
              href="/services"
              className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-300 transition-colors"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
