'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  INDUSTRIES,
  NUT_PROCESSING_CUTS,
  BULK_PACKAGING_TIERS,
  SUPPLY_HUBS,
  IndustryProfile,
} from '@/lib/business-supply-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function BusinessSupplyPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryProfile>(INDUSTRIES[1]) // Bakeries by default
  const [selectedCut, setSelectedCut] = useState<string>('Sliced / Flaked')
  const [selectedPackaging, setSelectedPackaging] = useState<string>('25 KG Vacuum Sack')
  const [orderFrequency, setOrderFrequency] = useState<string>('Monthly Contract')

  // SI Production Assistant State
  const [mfgType, setMfgType] = useState<string>('Bakeries & Patisserie')
  const [mfgMonthlyVol, setMfgMonthlyVol] = useState<string>('500 kg')
  const [mfgIngredients, setMfgIngredients] = useState<string>('Almonds (Sliced) + Walnuts + Raisins')
  const [mfgLocation, setMfgLocation] = useState<string>('Delhi NCR / Noida Hub')
  const [siRfqResult, setSiRfqResult] = useState<{
    specCode: string
    recommendedCut: string
    estPriceBand: string
    summary: string
  } | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  // RFQ Form State
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [gstin, setGstin] = useState('')
  const [sampleReq, setSampleReq] = useState(true)
  const [rfqSubmitted, setRfqSubmitted] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleRunSiAssistant = () => {
    setIsEvaluating(true)
    setTimeout(() => {
      setSiRfqResult({
        specCode: `NT-IND-${mfgType.substring(0, 3).toUpperCase()}-2026`,
        recommendedCut: `Uniform 1.0mm Mechanical Slices (<4% moisture, 0% shell fragments)`,
        estPriceBand: `Tier-1 Contract Wholesale (5% - 15% below spot market with 90-day price lock)`,
        summary: `SI has compiled your production procurement file for ${mfgMonthlyVol}/month delivery to ${mfgLocation}. COA & NABL test certificates scheduled with batch samples.`,
      })
      setIsEvaluating(false)
    }, 600)
  }

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRfqSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      {/* ── 1. Hero Executive Sourcing Banner ────────────────────────────────────── */}
      <section className="relative w-full bg-[#17233B] text-white py-16 sm:py-24 border-b border-[#C9A45C]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[11px] font-bold tracking-widest uppercase">
                <span>🏭</span> PAN-INDIA WHOLESALE &amp; INGREDIENT SUPPLY
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
                  Nutty Tales B2B Business Supply
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  Premium dry fruits for businesses that make, serve and gift.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-stone-300">
                  Reliable raw ingredient procurement, mechanical processing cuts, and recurring contracts.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-2xl">
                We supply hotels, sweet manufacturers, commercial bakeries, biscuit plants, and confectionery brands across India. From whole jumbo nuts to paper-thin slices, slivers, dices, and blanched kernels — backed by FSSAI Central Reg. {FSSAI_NUMBER}, NABL batch analysis, and scheduled monthly freight.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#production-si"
                  className="px-6 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  <span>⚙️</span>
                  <span>Buying for Production? Ask SI</span>
                </a>
                <a
                  href="#rfq-form"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Request Business Quote ↓
                </a>
              </div>

              {/* 3 Hubs Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Noida HQ</span>
                  <span className="font-semibold text-white">Central Processing Hub</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Kashmir Valley</span>
                  <span className="font-semibold text-white">Walnut &amp; Saffron Aggregation</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Patna / Bihar</span>
                  <span className="font-semibold text-white">Makhana Wetland Sourcing</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Overview */}
            <div className="lg:col-span-5">
              <div className="bg-[#10192A] rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#C9A45C]">
                    Recurring Supply Contract
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    Active Capacity
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>Batch Quality Assurance:</span>
                    <span className="font-bold text-white">COA + NABL Lab Passed</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Packaging Formats:</span>
                    <span className="font-bold text-white">10kg Tin / 25kg Vacuum Sack</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Delivery Frequency:</span>
                    <span className="font-bold text-white">Weekly / Monthly Scheduled</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Price Protection:</span>
                    <span className="font-bold text-white">Quarterly Contract Locks</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Credit &amp; GST:</span>
                    <span className="font-bold text-white">Input Tax Credit (5% GST)</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <span className="text-[11px] text-stone-300 block mb-2">Speak to Corporate Procurement Desk:</span>
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      'Hello Nutty Tales B2B! I would like to discuss a recurring business supply requirement for dry fruits.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                  >
                    WhatsApp +91 9717161809
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Sell by Industry: "Who do you buy for?" ────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Tailored Industry Specifications
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Who Do You Buy For?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            We understand the precise mechanical cut, moisture, and safety standards required by each manufacturing process.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10 text-xs">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 border ${
                selectedIndustry.id === ind.id
                  ? 'bg-[#17233B] text-white border-[#17233B] shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{ind.icon}</span>
              <span>{ind.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Industry Detail Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#176B68]">
                Industry Profile
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#17233B]">
                {selectedIndustry.name}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-light">
                {selectedIndustry.tagline}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-[#704B32] uppercase text-[10px] block">Primary Ingredients</span>
                <p className="text-stone-800 font-medium">{selectedIndustry.primaryProducts.join(', ')}</p>
              </div>

              <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-[#704B32] uppercase text-[10px] block">Cuts &amp; Processing</span>
                <p className="text-stone-800 font-medium">{selectedIndustry.cutTypes.join(', ')}</p>
              </div>

              <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-[#704B32] uppercase text-[10px] block">Typical Monthly Run</span>
                <p className="text-stone-800 font-medium">{selectedIndustry.typicalMonthlyKg}</p>
              </div>

              <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
                <span className="font-bold text-[#704B32] uppercase text-[10px] block">Quality Standard</span>
                <p className="text-stone-800 font-medium">{selectedIndustry.fssaiStandard}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#17233B] block">
                Why Industry Leaders Choose Nutty Tales:
              </span>
              <ul className="text-xs text-stone-600 space-y-1.5">
                {selectedIndustry.keyBenefits.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FAF6EE] p-6 rounded-2xl border border-stone-200 space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block">
              Typical Production Use Cases:
            </span>
            <ul className="text-xs text-stone-700 space-y-2">
              {selectedIndustry.useCases.map((uc, idx) => (
                <li key={idx} className="p-2.5 bg-white rounded-lg border border-stone-200 font-medium">
                  • {uc}
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <a
                href="#rfq-form"
                className="block w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Request {selectedIndustry.name} Supply Quote →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Cuts & Processing Specification Grid ───────────────────────────────── */}
      <section className="py-16 bg-[#F0EBE1] border-t border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
              Engineering Food Production
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Processing Cuts &amp; Bulk Packaging
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              From bakeries requiring paper-thin almond flakes to chocolate factories demanding uniform 4mm kibbles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NUT_PROCESSING_CUTS.map((cut, idx) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-[#17233B]">{cut.name}</h4>
                  <span className="text-[10px] uppercase font-bold bg-[#FAF6EE] text-[#176B68] px-2 py-0.5 rounded">
                    Spec Certified
                  </span>
                </div>
                <p className="text-xs text-stone-600 font-light leading-relaxed">{cut.desc}</p>
              </div>
            ))}
          </div>

          {/* Bulk Tiers */}
          <div className="p-6 sm:p-8 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-lg text-[#17233B]">
              Standard Industrial Packaging Formats
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {BULK_PACKAGING_TIERS.map((tier, idx) => (
                <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-[#17233B] block">{tier.label}</span>
                  <p className="text-[11px] text-stone-500 font-light leading-tight">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. "Buy for Production" SI Assistant ──────────────────────────────────── */}
      <section id="production-si" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#17233B] via-[#102334] to-[#176B68] rounded-3xl p-6 sm:p-12 text-white shadow-2xl space-y-8 border border-[#C9A45C]/30">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#C9A45C] text-[#17233B] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
              <span>🤖</span> SI PRODUCTION PROCUREMENT ADVISOR
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Buying Dry Fruits for Production? Tell Us What You Manufacture.
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed">
              SI analyzes your product line, calculates optimal mechanical cuts and moisture thresholds,
              and generates an estimated contract quotation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Form (7 cols) */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">What do you manufacture?</label>
                  <select
                    value={mfgType}
                    onChange={(e) => setMfgType(e.target.value)}
                    className="w-full bg-[#10192A] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A45C]"
                  >
                    <option value="Bakeries & Patisserie">Bakeries / Cakes / Cookies</option>
                    <option value="Sweets & Mithai (Kaju Katli)">Sweets &amp; Mithai (Kaju Katli / Laddoo)</option>
                    <option value="Biscuit Factory">Biscuit &amp; Rusk Factory</option>
                    <option value="Chocolates & Confectionery">Chocolate &amp; Confectionery</option>
                    <option value="Granola & Healthy Cereals">Granola &amp; Healthy Cereals</option>
                    <option value="Hotels & Banquets Catering">Hotels &amp; Banquet Catering</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Estimated Monthly Volume?</label>
                  <select
                    value={mfgMonthlyVol}
                    onChange={(e) => setMfgMonthlyVol(e.target.value)}
                    className="w-full bg-[#10192A] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A45C]"
                  >
                    <option value="100 kg">100 kg - 250 kg</option>
                    <option value="500 kg">500 kg - 1,000 kg</option>
                    <option value="2.5 Tons">2.5 Tons - 5 Tons</option>
                    <option value="10 Tons+">10 Tons+ (Full Container Load)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-300 font-bold block mb-1">Primary Ingredients Required?</label>
                  <input
                    type="text"
                    value={mfgIngredients}
                    onChange={(e) => setMfgIngredients(e.target.value)}
                    className="w-full bg-[#10192A] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="text-stone-300 font-bold block mb-1">Plant Delivery Location?</label>
                  <input
                    type="text"
                    value={mfgLocation}
                    onChange={(e) => setMfgLocation(e.target.value)}
                    className="w-full bg-[#10192A] border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C9A45C]"
                  />
                </div>
              </div>

              <button
                onClick={handleRunSiAssistant}
                disabled={isEvaluating}
                className="w-full py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>✨</span>
                <span>{isEvaluating ? 'SI Analyzing Quality Specifications...' : 'SI, Build Production Specification & RFQ'}</span>
              </button>
            </div>

            {/* Output Card (5 cols) */}
            <div className="lg:col-span-5 bg-white text-[#17233B] rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-serif font-bold text-sm">SI Contract Procurement Recommendation</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  FSSAI Ready
                </span>
              </div>

              {siRfqResult ? (
                <div className="space-y-3 text-xs animate-fadeIn">
                  <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-[#704B32] block">Recommended Cut Spec:</span>
                    <p className="font-semibold text-[#17233B] mt-0.5">{siRfqResult.recommendedCut}</p>
                  </div>

                  <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200">
                    <span className="text-[10px] uppercase font-bold text-[#704B32] block">Wholesale Pricing Matrix:</span>
                    <p className="font-semibold text-emerald-700 mt-0.5">{siRfqResult.estPriceBand}</p>
                  </div>

                  <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                    {siRfqResult.summary}
                  </p>

                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      `Hello Nutty Tales! I have an RFQ generated by SI for ${mfgType} (${mfgMonthlyVol}/month). Location: ${mfgLocation}. Ingredients: ${mfgIngredients}. Please connect with our procurement team.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Send to Nutty Tales B2B Desk →
                  </a>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-stone-500 italic">
                  Select your manufacturing line and click &ldquo;Build Production Specification&rdquo; to review tailored grades and pricing.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Formal RFQ Engine: "REQUEST BUSINESS QUOTE" ────────────────────────── */}
      <section id="rfq-form" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Formal Tender &amp; RFQ Portal
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Request Business Quote (RFQ)
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Submit your recurring requirement. Our corporate commercial desk responds within 4 business hours with certified COA and sample dispatch.
          </p>
        </div>

        <form onSubmit={handleRfqSubmit} className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Company / Establishment Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Royal Grand Hotel / Amber Bakes"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Contact Person &amp; Title</label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="e.g. Sanjay Verma (Head of Purchase)"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Official Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="procurement@company.com"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Company GSTIN (For B2B Billing)</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="07AAAAA0000A1Z5"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Supply Frequency</label>
              <select
                value={orderFrequency}
                onChange={(e) => setOrderFrequency(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
              >
                <option value="One-time Spot Order">One-time Spot Order</option>
                <option value="Weekly Scheduled Delivery">Weekly Scheduled Delivery</option>
                <option value="Monthly Contract">Monthly Contract</option>
                <option value="Quarterly Contract">Quarterly Contract</option>
                <option value="Annual Supply Contract">Annual Supply Contract</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 text-xs">
            <input
              type="checkbox"
              id="sample-req"
              checked={sampleReq}
              onChange={(e) => setSampleReq(e.target.checked)}
              className="w-4 h-4 text-[#176B68] rounded focus:ring-0"
            />
            <label htmlFor="sample-req" className="font-semibold text-stone-800 cursor-pointer">
              Send Complimentary Production Tasting / Cut Sample Kit (Dispatched via Bluedart)
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            {rfqSubmitted ? '✓ Commercial RFQ Registered — Desk Contacting You Shortly!' : 'Submit Business RFQ & Request Sample'}
          </button>
        </form>
      </section>
    </main>
  )
}
