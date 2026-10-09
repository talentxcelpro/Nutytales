'use client'

import React from 'react'
import Link from 'next/link'
import GetSomethingDoneEngine from '@/components/nri/GetSomethingDoneEngine'
import { NRI_CATEGORIES, OPERATIONAL_CITIES, VERIFIED_PROVIDERS } from '@/lib/nri/nri-data'

export default function NriHomePage() {
  const categoryKeys = Object.keys(NRI_CATEGORIES) as (keyof typeof NRI_CATEGORIES)[]

  return (
    <div className="space-y-24 pb-20">
      {/* ── 1. Hero Section ── */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-[#0E1524] via-[#0B101D] to-[#0A0F1D]">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#176B68]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          {/* Hero Branding & Statement */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C9A45C]/30 text-xs text-[#C9A45C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dedicated Execution Platform for the Global Indian Diaspora</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              India, handled.{' '}
              <span className="bg-gradient-to-r from-[#C9A45C] via-[#E7CB8E] to-[#C9A45C] bg-clip-text text-transparent block sm:inline">
                From anywhere in the world.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
              Your family, property, home, documents, healthcare coordination, and plans in India—managed through one trusted platform, wherever life takes you.
            </p>
          </div>

          {/* Signature Request Engine */}
          <GetSomethingDoneEngine />

          {/* Operational Hubs Ticker */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-2 text-stone-300 font-semibold">
              <span className="text-emerald-400">●</span>
              <span>Active Operational Supply:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
              {OPERATIONAL_CITIES.slice(0, 6).map((city) => (
                <div key={city.id} className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="text-white font-medium">{city.name}</span>
                  <span className="text-stone-400">({city.state})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The 11 Core Service Verticals ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#C9A45C] font-bold">
              Comprehensive Service Framework
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What We Handle in India
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl">
              From routine parent companionship and structural property inspections to Power of Attorney registration and Kashmir weddings.
            </p>
          </div>

          <Link
            href="/services"
            className="text-xs font-bold text-[#C9A45C] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Explore Full 11-Vertical Directory</span>
            <span>→</span>
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryKeys.map((key) => {
            const cat = NRI_CATEGORIES[key]
            return (
              <div
                key={key}
                className="group rounded-3xl bg-[#0E1524] border border-white/10 hover:border-[#C9A45C]/50 p-6 space-y-5 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C9A45C]/10 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#C9A45C]/10 transition-colors">
                      {cat.icon}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30">
                      {cat.heroBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#C9A45C] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-stone-400 font-light mt-1 line-clamp-2">
                      {cat.tagline}
                    </p>
                  </div>

                  {/* Sample Inclusions */}
                  <ul className="space-y-1.5 pt-2 text-[11px] text-stone-300">
                    {cat.inclusions.slice(0, 3).map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 text-xs">✓</span>
                        <span className="line-clamp-1">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    Lead hubs: <strong className="text-stone-300">{cat.popularCities.slice(0, 2).join(', ')}</strong>
                  </span>
                  <Link
                    href={`/services/${key.replace('_', '-')}`}
                    className="text-xs font-semibold text-[#C9A45C] hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 3. The 4-Step Execution Loop (How It Works) ── */}
      <section className="bg-gradient-to-b from-[#10192A] to-[#0A0F1D] py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] uppercase tracking-widest text-[#C9A45C] font-bold">
              Accountability & Transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              The Transactional Execution Loop
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              We replace informal favors with verified milestones, contractual clarity, and verifiable photographic proof of completion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Request in Plain Words',
                desc: 'Describe what your family or property needs in India. Our NLP engine extracts dates, city, frequency, and produces an itemized draft plan.',
                icon: '✍️',
              },
              {
                step: '02',
                title: 'Matching & Binding Quotes',
                desc: 'Matched with verified local coordinators, Bar Council advocates, or ICAI CAs. Receive transparent quotations with milestone breakdowns.',
                icon: '🤝',
              },
              {
                step: '03',
                title: 'Phased Milestone Custody',
                desc: 'Fund your service in USD, GBP, AED, CAD, or INR. Payments are safeguarded in platform milestone custody and disbursed only upon your approval.',
                icon: '🛡️',
              },
              {
                step: '04',
                title: 'Geotagged Proof & Sign-Off',
                desc: 'Receive GPS-timestamped photos, receipts, or official registry records. Inspect the proof on your portal before approving milestone release.',
                icon: '📸',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0B111D] p-6 rounded-3xl border border-white/10 space-y-3 relative group hover:border-[#C9A45C]/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-mono text-2xl font-bold text-[#C9A45C]/40 group-hover:text-[#C9A45C] transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. My India — The Operating Dashboard Preview ── */}
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
              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl">
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
              { label: 'Family Profiles', icon: '❤️', desc: 'Parent check-ins & wellness' },
              { label: 'Property Dossiers', icon: '🏡', desc: 'Inspection photo logs & bills' },
              { label: 'Active Requests', icon: '⚡', desc: 'Live milestone execution' },
              { label: 'Document Vault', icon: '📂', desc: 'Encrypted POAs & Deeds' },
              { label: 'Activity Timeline', icon: '🕒', desc: 'Chronological audit trail' },
              { label: 'Multi-Family Access', icon: '👥', desc: 'Sibling collaboration' },
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

      {/* ── 5. Ground Execution & Provider Vetting Standard ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-[#C9A45C] font-bold">
              Institutional Quality Standard
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              Vetted Ground Execution & Accountability
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              We never fabricate providers, ratings, or completed job counts. Every request is fulfilled through rigorous vetting and supervised local coordinators.
            </p>
          </div>

          <Link href="/services" className="text-xs font-bold text-[#C9A45C] hover:underline">
            Explore All 11 Service Verticals →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0E1524] rounded-3xl p-6 border border-white/10 space-y-4 hover:border-[#C9A45C]/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/15 border border-[#C9A45C]/30 flex items-center justify-center text-2xl">
                🏛️
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Direct Operations Hubs</h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Physical ground hubs active across Srinagar, Delhi NCR, Mumbai, Bengaluru, and Chandigarh. Dedicated supervisors coordinate every visit in person.
              </p>
              <div className="p-3 rounded-xl bg-white/5 text-[11px] text-stone-400 space-y-1">
                <strong className="text-[#C9A45C] block">Coverage Standard:</strong>
                <p>Strict geographic accountability. No unverified third-party contractor handoffs.</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/#request-engine"
                className="w-full py-2.5 rounded-xl bg-[#C9A45C]/15 text-[#C9A45C] text-xs font-bold block text-center hover:bg-[#C9A45C] hover:text-[#0E1524] transition-colors"
              >
                Submit Ground Request
              </Link>
            </div>
          </div>

          <div className="bg-[#0E1524] rounded-3xl p-6 border border-white/10 space-y-4 hover:border-[#C9A45C]/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl">
                ⚖️
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Credentialed Professionals</h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Legal drafting and consular filings executed only by Bar Council enrolled advocates. Tax and repatriation managed by ICAI Chartered Accountants.
              </p>
              <div className="p-3 rounded-xl bg-white/5 text-[11px] text-stone-400 space-y-1">
                <strong className="text-emerald-400 block">Licensing Verification:</strong>
                <p>Bar Council enrollment and ICAI membership numbers verified before assignment.</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/services/legal_documents"
                className="w-full py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold block text-center hover:bg-emerald-500 hover:text-[#0E1524] transition-colors"
              >
                Request Legal / Tax Scoping
              </Link>
            </div>
          </div>

          <div className="bg-[#0E1524] rounded-3xl p-6 border border-white/10 space-y-4 hover:border-[#C9A45C]/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Photographic Audit Trail</h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Every property walkthrough and companion errand generates encrypted, GPS-tagged, timestamped photographic evidence uploaded directly to your dossier.
              </p>
              <div className="p-3 rounded-xl bg-white/5 text-[11px] text-stone-400 space-y-1">
                <strong className="text-blue-300 block">Customer Sign-Off:</strong>
                <p>Final milestones disbursed only after you inspect and accept uploaded proof.</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/how-it-works"
                className="w-full py-2.5 rounded-xl bg-blue-500/15 text-blue-300 text-xs font-bold block text-center hover:bg-blue-500 hover:text-[#0E1524] transition-colors"
              >
                View 4-Step Proof Loop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Emergency 24/7 Notice & Provider Callout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergency Card */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-950/40 to-[#0E1524] p-8 border border-rose-500/30 space-y-4">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-500 text-white tracking-widest">
              Urgent Local Escalation
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              India Emergency Assistance
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Sudden medical escalation, family distress, or severe property alert in India? Submit an emergency dispatch request for prioritized ground coordination.
            </p>
            <div className="pt-2">
              <Link
                href="/emergency"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-colors"
              >
                <span>🚨 Access 24/7 Emergency Assistance Desk</span>
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
