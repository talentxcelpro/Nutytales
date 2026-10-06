'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  FOUNDER_SECTORS,
  FOUNDER_TIERS,
  FOUNDER_SERVICES,
  FounderSector,
} from '@/lib/founders-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function FoundersPage() {
  const [selectedSector, setSelectedSector] = useState<FounderSector>(FOUNDER_SECTORS[0])
  const [activeTab, setActiveTab] = useState<'sectors' | 'services' | 'tiers' | 'apply'>('sectors')

  // Dynamic Application Form State
  const [applicantSector, setApplicantSector] = useState('D2C Brand')
  const [stage, setStage] = useState('Pre-launch')
  const [needs, setNeeds] = useState<string[]>(['Product sourcing', 'Packaging'])
  const [founderName, setFounderName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [socialLink, setSocialLink] = useState('')
  const [launchDate, setLaunchDate] = useState('')
  const [monthlyRequirement, setMonthlyRequirement] = useState('50 kg - 100 kg')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // SI Founder Copilot Interactive Tool State
  const [siIdeaInput, setSiIdeaInput] = useState('Kashmir Wellness D2C Dry Fruit Brand')
  const [siPlan, setSiPlan] = useState<{
    skus: string[]
    landedCost: string
    srp: string
    packaging: string
    moq: string
    hub: string
    launchPlan: string
  } | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const toggleNeed = (need: string) => {
    setNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    )
  }

  const handleSimulateSiCopilot = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setSiPlan({
        skus: [
          '250g Kashmiri Mamra Almonds (Unsalted Single-Origin)',
          '250g Extra Light Kashmiri Walnut Halves (80%)',
          '1g Pure Pampore Mongra Saffron Glass Jar',
          '200g Desi Ghee Roasted Himalayan Makhana',
        ],
        landedCost: '₹340 - ₹480 per unit (inclusive of nitrogen foil pouching & batch COA)',
        srp: '₹650 - ₹950 per unit (healthy 45% - 55% gross margin profile)',
        packaging: 'Stand-up matte barrier pouch with resealable zip + gold foil logo badge',
        moq: 'Starter Batch: 100 units per SKU (Total 400 units / ~100 kg initial run)',
        hub: 'Noida HQ for NCR/National next-day dispatch + raw aggregation from Srinagar Hub',
        launchPlan:
          'Week 1: Finalize packaging artwork · Week 2: Dispatch pilot sample kit with NABL lab COA · Week 3: Run trial production · Week 4: Ship to founder warehouse or Amazon FBA.',
      })
    }, 600)
  }

  const handleFounderApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${founderName} (${brandName})`,
          phone,
          email,
          city,
          businessName: `[FOUNDER PROGRAM] ${brandName} - ${applicantSector}`,
          message: `Sector: ${applicantSector} | Stage: ${stage} | Needs: ${needs.join(', ')} | Monthly Vol: ${monthlyRequirement} | Launch Date: ${launchDate || 'TBD'} | Social/Web: ${socialLink}`,
          source: 'founder-program-application',
        }),
      })
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nutty Tales Founder Program! 🚀\n\nI want to apply / discuss infrastructure for my venture:\n• Brand: ${brandName || 'Emerging Startup'}\n• Founder: ${founderName || 'Founder'}\n• Sector: ${applicantSector}\n• Stage: ${stage}\n• Sourcing & Services Needed: ${needs.join(', ')}\n• Monthly Requirement: ${monthlyRequirement}\n• City: ${city || 'India'}\n\nPlease connect me with a Founder Supply Specialist!`,
  )}`

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      {/* ── 1. Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#17233B] text-white py-16 sm:py-24 border-b border-[#C9A45C]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[11px] font-bold tracking-widest uppercase">
                <span>🚀</span> NUTTY TALES FOUNDER PROGRAM
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
                  We Help Founders Build
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  Your idea deserves a real supply chain.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-stone-300">
                  Source better. Launch faster. Grow smarter.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-2xl">
                Starting a D2C food brand, travel agency, clothing label, boutique stay or café? Nutty Tales provides the real commercial infrastructure you need: direct-from-origin sourcing, private label packaging, hotel &amp; travel inventory, artisan fashion supply, and multi-hub fulfilment across Noida, Patna and Kashmir.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#apply"
                  className="px-7 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center gap-2 hover:scale-[1.02]"
                >
                  <span>Join the Founder Program →</span>
                </a>
                <a
                  href="#copilot"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Plan with SI Founder Copilot ✨
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-stone-300 font-medium">
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">🌾 Zero Middlemen</span>
                  Direct Farm Origin
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">🏷️ Private Label</span>
                  Turnkey Packaging
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">📦 Low MOQs</span>
                  From 10kg / 50 Units
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">🚚 Multi-Hub</span>
                  Noida · Patna · Kashmir
                </div>
              </div>
            </div>

            {/* Right Card: Value Thesis */}
            <div className="lg:col-span-5">
              <div className="bg-[#10192A] rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#C9A45C]">
                    What We Are (And What We Aren&apos;t)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    Commercial Partner
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-stone-300">
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold text-sm">✓</span>
                    <span><strong>We supply raw materials &amp; finished goods:</strong> Certified ingredients, makhana, saffron, pashminas, hotel amenities.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold text-sm">✓</span>
                    <span><strong>We handle packaging &amp; lab testing:</strong> Nitrogen pouches, rigid gift boxes, NABL lab COA certificates.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold text-sm">✓</span>
                    <span><strong>We provide inventory &amp; operations:</strong> Stays, 4x4 snow transfers, and warehouse pick-pack-ship.</span>
                  </div>
                  <div className="flex items-start gap-2.5 pt-2 border-t border-white/10 text-stone-400">
                    <span className="text-[#C9A45C] font-bold text-sm">•</span>
                    <span><em>We are not a venture fund or theoretical incubator. We provide actual commercial supply chain execution.</em></span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <span className="text-[11px] text-stone-300 block mb-2">Speak directly with a Founder Desk Lead:</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-2.5 bg-[#176B68] hover:bg-[#125350] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                  >
                    WhatsApp Founder Concierge
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Who Can Join: Supported Startup Sectors ───────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Ecosystem Verticals
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Who Is the Founder Program Built For?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            We partner with ambitious founders across food, travel, fashion, hospitality, and gifting.
          </p>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 text-xs">
          {FOUNDER_SECTORS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 border ${
                selectedSector.id === sec.id
                  ? 'bg-[#17233B] text-white border-[#17233B] shadow-md'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Sector Deep Dive Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
                Vertical Infrastructure
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#17233B] flex items-center gap-3">
                <span>{selectedSector.icon}</span>
                <span>{selectedSector.name}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light">
                {selectedSector.tagline}
              </p>
            </div>

            {/* Ideal For Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                Ideal For:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedSector.idealFor.map((item, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#FAF6EE] text-stone-800 border border-stone-200 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* What Nutty Tales Supplies */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#17233B] block">
                What Nutty Tales Provides:
              </span>
              <ul className="text-xs text-stone-600 space-y-2">
                {selectedSector.whatWeProvide.map((prov, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-emerald-700 font-bold text-sm">✓</span>
                    <span className="leading-snug">{prov}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Real-World Case Simulation */}
          <div className="lg:col-span-5 bg-[#FAF6EE] p-6 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                Real-World Startup Example
              </span>
              <span className="text-[10px] font-bold text-[#176B68] bg-white px-2 py-0.5 rounded border border-stone-200">
                Case Scenario
              </span>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-[#17233B]">
                {selectedSector.sampleCase.startupName}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                <strong>Founder Need:</strong> {selectedSector.sampleCase.founderNeed}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
              <strong className="text-[#176B68] block">Nutty Tales Solution:</strong>
              <p>{selectedSector.sampleCase.nuttyTalesSolution}</p>
            </div>

            <div className="pt-2">
              <a
                href="#apply"
                className="block w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Apply for {selectedSector.name} →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. The 6 Pillars of Commercial Infrastructure ─────────────────────────── */}
      <section className="py-20 bg-[#F0EBE1] border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Real Infrastructure, Not Just Advice
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              We give your business access to our operational supply chain from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FOUNDER_SERVICES.map((srv, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-3xl block">{srv.icon}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                    {srv.title}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#17233B]">
                    {srv.subtitle}
                  </h4>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SI Founder Copilot (Interactive Planner) ──────────────────────────── */}
      <section id="copilot" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#17233B] via-[#102334] to-[#176B68] rounded-3xl p-6 sm:p-12 text-white shadow-2xl space-y-8 border border-[#C9A45C]/30">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#C9A45C] text-[#17233B] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
              <span>✨</span> SI FOUNDER COPILOT
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Tell SI What You Want to Launch.
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed">
              SI analyzes your venture concept, recommends initial core SKUs, estimates landed cost and healthy retail margins, selects optimal packaging, and calculates your starter MOQ.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Side (5 cols) */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4 text-xs">
              <div>
                <label className="text-stone-300 font-bold block mb-1">
                  Describe what you are building:
                </label>
                <input
                  type="text"
                  value={siIdeaInput}
                  onChange={(e) => setSiIdeaInput(e.target.value)}
                  placeholder="e.g. Kashmir Wellness D2C Dry Fruit Brand"
                  className="w-full bg-[#10192A] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A45C]"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Quick Concept Prompts:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Kashmir Wellness D2C Dry Fruit Brand',
                    'Gulmarg Snow Safari Travel Agency',
                    'Pashmina & Pheran Ethnic Label',
                    'Artisanal Sourdough & Macaron Bakery',
                    'Luxury Wedding Hamper Business',
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSiIdeaInput(p)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-stone-300 border border-white/10"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateSiCopilot}
                disabled={isSimulating}
                className="w-full py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{isSimulating ? 'SI is analyzing...' : '✨ Run SI Founder Blueprint'}</span>
              </button>
            </div>

            {/* Output Side (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF6EE] text-[#17233B] rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                    SI Founder Blueprint
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#17233B]">
                    Commercial Feasibility &amp; Launch Plan
                  </h4>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                  Pre-Launch Model
                </span>
              </div>

              {siPlan ? (
                <div className="space-y-3 text-xs animate-fadeIn">
                  <div>
                    <strong className="text-[#176B68] block mb-1">Recommended Starter SKUs:</strong>
                    <ul className="space-y-1 text-stone-700">
                      {siPlan.skus.map((sku, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-[#176B68]">✦</span>
                          <span>{sku}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Estimated Landed Cost</span>
                      <span className="font-semibold text-stone-800 text-[11px]">{siPlan.landedCost}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-stone-200">
                      <span className="text-[10px] text-stone-500 uppercase font-bold block">Suggested Retail (SRP)</span>
                      <span className="font-semibold text-stone-800 text-[11px]">{siPlan.srp}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">Recommended Starter MOQ</span>
                    <p className="font-medium text-stone-800">{siPlan.moq}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                    <span className="text-[10px] text-stone-500 uppercase font-bold block">4-Week Launch Roadmap</span>
                    <p className="text-stone-700">{siPlan.launchPlan}</p>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#apply"
                      className="block w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      Apply with this Blueprint →
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 space-y-2 text-stone-500 text-xs">
                  <span className="text-3xl block">💡</span>
                  <p>Click &ldquo;Run SI Founder Blueprint&rdquo; to generate your starter SKUs, cost models, packaging concept, and MOQ roadmap.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Founder Tiers (Starter, Growth, Scale) ─────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Partnership Progression
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Founder Program Tiers
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Start small with low MOQs, scale into recurring scheduled supply, and graduate into multi-city contract logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FOUNDER_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all ${
                tier.highlighted
                  ? 'bg-white border-[#C9A45C] ring-2 ring-[#C9A45C]/40 shadow-xl scale-105'
                  : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-2xl text-[#17233B]">{tier.tier}</h4>
                  {tier.highlighted && (
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#C9A45C] text-[#17233B]">
                      Most Popular
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 italic">{tier.subtitle}</p>

                <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 text-xs font-bold text-[#176B68]">
                  Volume: {tier.moq}
                </div>

                <ul className="space-y-2 text-xs text-stone-700">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100">
                <a
                  href="#apply"
                  className={`block w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-sm ${
                    tier.highlighted
                      ? 'bg-[#17233B] hover:bg-[#176B68] text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-[#17233B]'
                  }`}
                >
                  {tier.cta} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Dynamic Application Form ─────────────────────────────────────────── */}
      <section id="apply" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#704B32] block">
              Application Desk
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] mt-1">
              Join Nutty Tales Founder Program
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Tell us what you are building. Our founder supply team responds within 24 hours with product sample options, landed cost models, and initial batch recommendations.
            </p>
          </div>

          <form onSubmit={handleFounderApply} className="space-y-6">
            {/* Sector Radios */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]">
                I&apos;m Building: *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  'D2C Brand',
                  'Food / F&B',
                  'Fashion & Clothing',
                  'Travel Agency',
                  'Hospitality & Stays',
                  'Gifting & Events',
                  'Retail & Modern Trade',
                  'Other Venture',
                ].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setApplicantSector(sec)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-colors ${
                      applicantSector === sec
                        ? 'bg-[#17233B] text-white border-[#17233B]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* Stage Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]">
                Current Stage: *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {['Idea', 'Pre-launch', 'Launched', 'Growing', 'Scaling'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStage(st)}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                      stage === st
                        ? 'bg-[#176B68] text-white border-[#176B68]'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Support Needed Checkboxes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#17233B]">
                What Do You Need? (Select All That Apply): *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {[
                  'Product sourcing',
                  'Bulk procurement',
                  'Private label',
                  'Packaging lab',
                  'Multi-hub fulfilment',
                  'Travel inventory',
                  'Clothing / crafts supply',
                  'Gifting kits',
                  'SI Copilot assistance',
                ].map((nd) => {
                  const isChecked = needs.includes(nd)
                  return (
                    <label
                      key={nd}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#176B68]/10 border-[#176B68] text-[#17233B] font-semibold'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleNeed(nd)}
                        className="w-4 h-4 text-[#176B68] rounded focus:ring-0 cursor-pointer"
                      />
                      <span>{nd}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Founder Full Name *</label>
                <input
                  type="text"
                  required
                  value={founderName}
                  onChange={(e) => setFounderName(e.target.value)}
                  placeholder="e.g. Samarth Mehta"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Brand / Venture Name *</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. PureValley Organics"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Mobile *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samarth@purevalley.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Operating City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Delhi NCR, Mumbai, Bengaluru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Website or Instagram Handle</label>
                <input
                  type="text"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  placeholder="e.g. @purevalley_wellness or website URL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Expected Launch Date</label>
                <input
                  type="text"
                  value={launchDate}
                  onChange={(e) => setLaunchDate(e.target.value)}
                  placeholder="e.g. November 2026 / Immediate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Estimated Monthly Requirement</label>
                <select
                  value={monthlyRequirement}
                  onChange={(e) => setMonthlyRequirement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-white"
                >
                  <option value="10 kg - 50 kg">Starter Pilot (10 kg - 50 kg)</option>
                  <option value="50 kg - 100 kg">Early Traction (50 kg - 100 kg)</option>
                  <option value="250 kg - 500 kg">Growing Brand (250 kg - 500 kg)</option>
                  <option value="1 Ton+">Scale Volume (1 Ton+)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Application...' : isSubmitted ? '✓ Application Submitted' : 'Submit Founder Application'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Or Chat with Founder Desk on WhatsApp (+91 9717161809)</span>
                <span>→</span>
              </a>
            </div>

            {isSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <span>
                  ✓ Welcome to the Nutty Tales Founder Program! Our Founder Supply Specialist will review your details and reach out within 24 hours.
                </span>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-emerald-900 font-bold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
