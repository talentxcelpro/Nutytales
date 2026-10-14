'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  B2B_COMMODITIES,
  B2B_HUBS,
  B2BCommodity,
  BUYER_PERSONAS,
  BuyerPersona,
} from '@/lib/b2b-data'
import {
  INDUSTRIES,
  IndustryProfile,
} from '@/lib/business-supply-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import CommercialSampleDesk from '@/components/b2b/CommercialSampleDesk'
import QualityPassportModal from '@/components/b2b/QualityPassportModal'
import PriceScenarioCalculator from '@/components/b2b/PriceScenarioCalculator'
import MultiSupplierQuoteComparison from '@/components/b2b/MultiSupplierQuoteComparison'
import ProcurementDeskModal from '@/components/b2b/ProcurementDeskModal'
import BecomeSupplierModal from '@/components/b2b/BecomeSupplierModal'

export default function B2BHomePage() {
  // ── 1. Modals & Drawers State ─────────────────────────────────────────────
  const [inspectedCommodity, setInspectedCommodity] = useState<B2BCommodity | null>(null)
  const [isProcurementDeskOpen, setIsProcurementDeskOpen] = useState(false)
  const [isBecomeSupplierOpen, setIsBecomeSupplierOpen] = useState(false)

  // ── 2. Natural Language Sourcing Search State ─────────────────────────────
  const [naturalSearchQuery, setNaturalSearchQuery] = useState('')
  const [selectedDestinationForFilter, setSelectedDestinationForFilter] = useState('Delhi NCR / Noida Hub')

  // ── 3. Active Filters & Category State ────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeOriginFilter, setActiveOriginFilter] = useState<string>('All')
  const [activeCapabilityTab, setActiveCapabilityTab] = useState<
    'price' | 'quality' | 'desk' | 'privatelabel' | 'export'
  >('price')

  // ── 4. Interactive Buyer Persona State ─────────────────────────────────────
  const [selectedPersona, setSelectedPersona] = useState<BuyerPersona>(BUYER_PERSONAS[0])

  // ── 5. "What Do You Make?" Sector Dossier State ───────────────────────────
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryProfile>(INDUSTRIES[2]) // Bakeries

  // ── 6. Contextual Account Onboarding State (Preserved for corporate accounts)
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1)
  const [workEmail, setWorkEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [businessType, setBusinessType] = useState('Commercial Bakery')
  const [gstin, setGstin] = useState('')
  const [cityPincode, setCityPincode] = useState('')
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'California Almonds (Sliced)',
    'Kashmiri Kagzi Walnuts',
  ])
  const [estMonthlyKg, setEstMonthlyKg] = useState('500 kg - 1,000 kg')
  const [isOnboardingSubmitted, setIsOnboardingSubmitted] = useState(false)
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false)
  const [onboardingError, setOnboardingError] = useState<string | null>(null)
  const [isSignInMode, setIsSignInMode] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // ── Destination Freight Per Kg Lookup ─────────────────────────────────────
  const getFreightPerKg = (dest: string) => {
    if (dest.includes('Delhi') || dest.includes('Noida')) return 5
    if (dest.includes('Mumbai') || dest.includes('Pune')) return 12
    if (dest.includes('Bengaluru') || dest.includes('Karnataka')) return 15
    if (dest.includes('Srinagar') || dest.includes('Kashmir')) return 8
    if (dest.includes('Patna') || dest.includes('Kolkata')) return 11
    if (dest.includes('Ahmedabad') || dest.includes('Gujarat')) return 10
    return 10
  }

  // ── Real Product Image Resolver ───────────────────────────────────────────
  const getCommodityImage = (id: string) => {
    if (id.includes('mamra')) return '/images/mamra-almonds-pouch-250g.jpg'
    if (id.includes('california') || id.includes('almond')) return '/images/almonds-pouch-250g.jpg'
    if (id.includes('walnut') || id.includes('akhrot')) return '/images/kashmir-kagzi-akhrot-250g.jpg'
    if (id.includes('saffron') || id.includes('kesar')) return '/images/saffron-threads-macro.jpg'
    if (id.includes('makhana')) return '/images/makhana-pouch-250g.jpg'
    if (id.includes('cashew')) return '/images/cashews-w180-macro.jpg'
    return '/images/almonds-pouch-250g.jpg'
  }

  // ── Natural Search Parsing & Filtering ────────────────────────────────────
  const { filteredCommodities, parsedSearchFeedback, suggestedAlternatives } = useMemo(() => {
    const query = naturalSearchQuery.toLowerCase().trim()

    let commodities = B2B_COMMODITIES.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      const matchesOrigin =
        activeOriginFilter === 'All' ||
        item.origin.toLowerCase().includes(activeOriginFilter.toLowerCase())
      return matchesCategory && matchesOrigin
    })

    if (!query) {
      return {
        filteredCommodities: commodities,
        parsedSearchFeedback: null,
        suggestedAlternatives: [],
      }
    }

    // Extract keywords
    const keywords = query.split(/[\s,]+/).filter(Boolean)

    // Detect destination in query
    let detectedDest = selectedDestinationForFilter
    if (query.includes('delhi') || query.includes('noida')) detectedDest = 'Delhi NCR / Noida Hub'
    else if (query.includes('mumbai') || query.includes('pune')) detectedDest = 'Mumbai / Pune Industrial Corridor'
    else if (query.includes('bengaluru') || query.includes('bangalore')) detectedDest = 'Bengaluru / Karnataka Hub'
    else if (query.includes('kashmir') || query.includes('srinagar')) detectedDest = 'Srinagar / Kashmir Direct'
    else if (query.includes('bihar') || query.includes('patna') || query.includes('kolkata')) detectedDest = 'Patna / Kolkata Eastern Hub'
    else if (query.includes('gujarat') || query.includes('ahmedabad')) detectedDest = 'Ahmedabad / Gujarat Belt'

    // Detect quantity in query (e.g. 100 kg, 500kg, 1 mt, 2.5 ton)
    let detectedQty = '500 kg'
    const qtyMatch = query.match(/(\d+(?:\.\d+)?)\s*(kg|kilos|mt|tons|ton|g)/i)
    if (qtyMatch) {
      detectedQty = `${qtyMatch[1]} ${qtyMatch[2].toUpperCase()}`
    }

    const matches = commodities.filter((item) => {
      const textToSearch = `${item.name} ${item.origin} ${item.grade} ${item.category} ${item.cuts.join(' ')} ${item.code}`.toLowerCase()
      return keywords.some((k) => textToSearch.includes(k))
    })

    let alternatives: B2BCommodity[] = []
    if (matches.length === 0) {
      // Find fallback alternatives
      alternatives = B2B_COMMODITIES.slice(0, 3)
    }

    return {
      filteredCommodities: matches.length > 0 ? matches : [],
      parsedSearchFeedback: {
        destination: detectedDest,
        quantity: detectedQty,
        matchCount: matches.length,
      },
      suggestedAlternatives: alternatives,
    }
  }, [activeCategory, activeOriginFilter, naturalSearchQuery, selectedDestinationForFilter])

  // Toggle Need Item in Onboarding Form
  const toggleNeed = (item: string) => {
    if (selectedNeeds.includes(item)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== item))
    } else {
      setSelectedNeeds([...selectedNeeds, item])
    }
  }

  // Handle Onboarding Submit
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOnboardingError(null)

    if (onboardingStep === 1) {
      if (!workEmail || !workEmail.includes('@')) {
        setOnboardingError('Please enter a valid official work email address.')
        return
      }
      setOnboardingStep(2)
      return
    }

    if (onboardingStep === 2) {
      if (!companyName || !phone) {
        setOnboardingError('Please provide your organization name and direct phone number.')
        return
      }
      setOnboardingStep(3)
      return
    }

    if (onboardingStep === 3) {
      setIsOnboardingLoading(true)
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contactName || 'B2B Procurement Lead',
            email: workEmail,
            phone,
            businessName: companyName,
            city: cityPincode,
            message: `[B2B Corporate Account Activation] Email: ${workEmail} | Org: ${companyName} | Type: ${businessType} | GSTIN: ${gstin || 'Pending'} | Needs: ${selectedNeeds.join(', ')} | Volume: ${estMonthlyKg}`,
            source: 'business-corporate-onboarding',
          }),
        })

        const data = await res.json()
        if (res.ok && data.success && data.result?.success !== false) {
          setIsOnboardingSubmitted(true)
        } else {
          setOnboardingError(data.error || 'Unable to register business account. Please contact WhatsApp.')
        }
      } catch {
        setOnboardingError('Network error. You can also chat directly on WhatsApp.')
      } finally {
        setIsOnboardingLoading(false)
      }
    }
  }

  return (
    <div className="space-y-16 pb-24">
      {/* ── 1. WORLD-CLASS ENTERPRISE PROCUREMENT HERO ────────────────────────── */}
      <section className="relative pt-6 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        {/* Ambient background glow & decorative grid */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          {/* Top Enterprise Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-200 text-xs font-semibold tracking-wide shadow-xs border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <span className="text-[#FF6B00] font-bold">NEXT-GEN PROCUREMENT OS</span>
            <span className="text-slate-500">•</span>
            <span>Direct Orchards to Industrial Lines</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A1830] leading-[1.12]">
            Wholesale procurement,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#E65100] to-[#10B981]">
              engineered for certainty.
            </span>
          </h1>

          {/* Hero Subheadline */}
          <p className="text-slate-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover verified suppliers, benchmark landed cost quotations with freight and 5% GST input credit, and track temperature-controlled reefer deliveries in real time.
          </p>

          {/* Strategic CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/b2b/dashboard"
              className="px-6 py-3.5 bg-[#081830] hover:bg-[#12274A] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Launch Procurement Workspace</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <a
              href="#pricing-matrix"
              className="px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all border border-slate-300 shadow-xs flex items-center gap-2"
            >
              <span>📦 Live Price Matrix</span>
            </a>

            <Link
              href="/b2b/rfq"
              className="px-5 py-3.5 bg-[#FF6B00] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>⚡ Submit Quick RFQ</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsBecomeSupplierOpen(true)}
              className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all"
            >
              🌾 Become a Supplier
            </button>
          </div>

          {/* Three Trust Pillars (Section 8 of Brief) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-3xl mx-auto text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-center gap-2.5 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <div className="text-left">
                <strong className="block text-slate-900 text-xs">Compare Offers</strong>
                <span className="text-[11px] text-slate-500">Ex-hub, freight &amp; net landed cost</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-center gap-2.5 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <div className="text-left">
                <strong className="block text-slate-900 text-xs">Verify Evidence</strong>
                <span className="text-[11px] text-slate-500">NABL lab assays for moisture &amp; oil</span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-center gap-2.5 text-slate-800">
              <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              <div className="text-left">
                <strong className="block text-slate-900 text-xs">Clear Fulfilment</strong>
                <span className="text-[11px] text-slate-500">14°C reefer transit &amp; Net-30 credit</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. INTELLIGENT SOURCING SEARCH TERMINAL ───────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-lg space-y-4 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🔎</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Natural Language Procurement Search &amp; Route
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Parse commodity, lot size, cut, and destination hub automatically
            </span>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <input
              type="text"
              value={naturalSearchQuery}
              onChange={(e) => setNaturalSearchQuery(e.target.value)}
              placeholder='Try typing: "Kashmiri walnuts, 100 kg, delivered to Delhi" or "California Almonds Sliced, 500 kg"'
              className="w-full px-5 py-3.5 pl-11 pr-10 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#081830] focus:border-transparent outline-none bg-slate-50 text-slate-900 font-medium transition-all"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
            {naturalSearchQuery && (
              <button
                type="button"
                onClick={() => setNaturalSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Example Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
            <span className="text-[11px] font-bold uppercase text-slate-400 mr-1">
              Sample prompts:
            </span>
            {[
              'Kashmiri walnuts, 100 kg, delivered to Delhi',
              'California almonds, sliced 1 MT, Noida Hub',
              'Makhana for private-label packaging, 500 kg',
              'Cashew kernels W240, export grade, Mumbai',
              'Pampore Mongra Saffron, 1 kg, Bengaluru',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setNaturalSearchQuery(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#081830] hover:text-white text-slate-700 text-[11px] font-medium transition-colors border border-slate-200"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Parsed Search Feedback Banner */}
          {parsedSearchFeedback && (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-sm">🎯</span>
                <span>
                  Showing <strong>{parsedSearchFeedback.matchCount} matched commodity lots</strong> for{' '}
                  <strong className="text-emerald-900">{parsedSearchFeedback.quantity}</strong> delivered to{' '}
                  <strong className="text-emerald-900">{parsedSearchFeedback.destination}</strong>.
                </span>
              </div>
              <a
                href="#pricing-matrix"
                className="font-bold text-emerald-800 hover:underline uppercase text-[11px] tracking-wider"
              >
                View in Price Matrix ↓
              </a>
            </div>
          )}
        </div>

        {/* ── 3. LIVE COMMODITY EX-HUB SPOT TICKER CARDS (4 Real Commodities) ── */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: California Almonds */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-800">
                    Import Hub
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">● In Stock (Noida)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                    <Image
                      src="/images/almonds-pouch-250g.jpg"
                      alt="California Almonds"
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">California Almonds</div>
                    <div className="text-[10px] text-slate-500">Nonpareil Extra #1 · Sliced 1.0mm</div>
                    <div className="text-[9px] text-[#C9A45C] font-mono">FSSAI #10021011000219</div>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Ex-Hub Rate</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">₹670 / kg</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400">MOQ 50 kg</div>
                  <div className="text-[10px] text-emerald-700 font-mono font-semibold">Landed ~₹714</div>
                </div>
              </div>
            </div>

            {/* Card 2: Kashmiri Walnuts */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-50 text-amber-800">
                    Direct Orchard
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">● Fresh Crop (Kashmir)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                    <Image
                      src="/images/kashmir-kagzi-akhrot-250g.jpg"
                      alt="Kashmiri Kagzi Walnuts"
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Kashmiri Kagzi Walnuts</div>
                    <div className="text-[10px] text-slate-500">Snow-White Halves (80%+)</div>
                    <div className="text-[9px] text-[#C9A45C] font-mono">FSSAI #11023002000812</div>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Ex-Hub Rate</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">₹1,080 / kg</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400">MOQ 20 kg</div>
                  <div className="text-[10px] text-emerald-700 font-mono font-semibold">Landed ~₹1,135</div>
                </div>
              </div>
            </div>

            {/* Card 3: Kashmiri Saffron */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-50 text-purple-800">
                    GI Certified
                  </span>
                  <span className="text-[10px] text-purple-600 font-bold">● Crocin &gt; 240</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                    <Image
                      src="/images/saffron-threads-macro.jpg"
                      alt="Royal Kashmiri Mongra Saffron"
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Royal Kashmiri Saffron</div>
                    <div className="text-[10px] text-slate-500">Pure Red Mongra Filaments</div>
                    <div className="text-[9px] text-[#C9A45C] font-mono">FSSAI #11024002000301</div>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Bulk Lot Rate</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">₹2,60,000 / kg</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400">MOQ 100g (₹260/g)</div>
                  <div className="text-[10px] text-purple-700 font-mono font-semibold">Air Express</div>
                </div>
              </div>
            </div>

            {/* Card 4: Mithila Makhana */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5 text-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800">
                    GI Producer Co
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">● Hard-Shell Free</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                    <Image
                      src="/images/makhana-pouch-250g.jpg"
                      alt="GI Mithila Makhana"
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">GI Mithila Makhana</div>
                    <div className="text-[10px] text-slate-500">Hand-Graded 6+ Sutra Jumbo</div>
                    <div className="text-[9px] text-[#C9A45C] font-mono">FSSAI #10423001000184</div>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Ex-Hub Rate</div>
                  <div className="font-mono font-bold text-slate-900 text-sm">₹690 / kg</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-slate-400">MOQ 20 kg</div>
                  <div className="text-[10px] text-emerald-700 font-mono font-semibold">Landed ~₹725</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FIVE DISTINCTIVE CAPABILITIES SHOWCASE (Section 3 of Brief) ─────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>⭐</span> FIVE DISTINCTIVE CAPABILITIES
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Built Around What Wholesalers Cannot Easily Copy
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            A technology-led procurement vertical that sells a completed buying outcome—backed by evidence, verified suppliers, and delivered economics.
          </p>
        </div>

        {/* 5 Capability Switcher Tabs */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {[
            { id: 'price', label: '1. Price Intelligence', priority: 'Highest Priority' },
            { id: 'quality', label: '2. Quality Passport', priority: 'Lot Evidence' },
            { id: 'desk', label: '3. Procurement Desk', priority: 'Managed Outcome' },
            { id: 'privatelabel', label: '4. Private Label Growth', priority: 'Brand Packaging' },
            { id: 'export', label: '5. Cross-Border Sourcing', priority: 'Global Export' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCapabilityTab(tab.id as typeof activeCapabilityTab)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all border flex items-center gap-2 ${
                activeCapabilityTab === tab.id
                  ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                  activeCapabilityTab === tab.id
                    ? 'bg-[#C9A45C] text-[#17233B]'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {tab.priority}
              </span>
            </button>
          ))}
        </div>

        {/* Capability Feature Spotlight Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm">
          {activeCapabilityTab === 'price' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-xs">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  CAPABILITY 1 · HIGHEST STRATEGIC PRIORITY
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                  Nuty Tales Price Intelligence
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  A buyer enters a product, quantity, and delivery destination. Nuty Tales compares available verified supplier quotes and computes the estimated total landed purchase cost—including packaging, insured freight, and GST input credit.
                </p>
                <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-2">
                  <div className="font-bold text-[#17233B] text-xs">
                    💡 Example: 100 kg of Kashmiri Walnuts delivered to Noida
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Includes ex-orchard rate (₹1,150/kg) + ₹500 packaging + ₹500 insured logistics + 5% GST (100% tax deductible with GSTIN). The platform distinguishes the lowest nominal price from the best overall offer.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <a
                    href="#pricing-matrix"
                    className="px-5 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-[11px]"
                  >
                    Test Landed Cost Matrix ↓
                  </a>
                  <a
                    href="#multi-supplier-rfq"
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold uppercase tracking-wider text-[11px]"
                  >
                    Compare Supplier Bids
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#10192A] text-white rounded-2xl p-6 border border-white/10 space-y-4">
                <span className="text-[10px] uppercase font-bold text-[#C9A45C] tracking-widest block">
                  Competitive Advantage
                </span>
                <div className="font-serif text-lg font-bold">
                  Transparent Price Discovery Without Calling 10 Wholesalers
                </div>
                <div className="space-y-2 text-[11px] text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>No hidden broker commissions or unexpected freight charges.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Distinguishes confirmed spot rates from indicative supplier quotes.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Anonymized quotation history to track market-price movements.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCapabilityTab === 'quality' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-xs">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  CAPABILITY 2 · TRUST BEFORE TRANSACTION
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                  Nuty Tales Quality Passport
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Every eligible product lot receives a digital record containing harvest details, single-origin provenance, packaging batch, FSSAI compliance, and NABL analytical laboratory test results for moisture, purity, and aflatoxin.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Moisture Assay</span>
                    <strong className="text-stone-900">&lt; 4.5% Standard</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Aflatoxin Residue</span>
                    <strong className="text-emerald-700">&lt; 1.5 ppb Tested</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Sample Pre-Test</span>
                    <strong className="text-[#17233B]">500g Commercial Kit</strong>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setInspectedCommodity(B2B_COMMODITIES[0])}
                    className="px-5 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-[11px]"
                  >
                    View Sample Quality Passport Modal
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#FAF6EE] rounded-2xl p-6 border border-stone-200 space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#704B32] tracking-widest block">
                  Evidence-Backed Buying
                </span>
                <h4 className="font-serif text-lg font-bold text-[#17233B]">
                  Buy with Lab Proof, Not Verbal Assurances
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Traditional wholesalers rely on handshake trust that fails when quality fluctuates. Nuty Tales ties each dispatch to audited batch COA test certificates. Optional 3rd-party SGS inspection available for orders over 2 MT.
                </p>
              </div>
            </div>
          )}

          {activeCapabilityTab === 'desk' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-xs">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  CAPABILITY 3 · MANAGED SOURCING OUTCOME
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                  Nuty Tales Procurement Desk
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Offer managed procurement for enterprises that do not want to manage multiple suppliers. Submit a shopping list or upload an Excel bill of materials; our specialized desk sources competing quotes, consolidates batches, and coordinates delivered freight.
                </p>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-emerald-950">
                  <div className="font-bold">✓ Human-Assisted + Automated Turnaround</div>
                  <p className="text-[11px] text-emerald-800">
                    Guaranteed formal comparative proforma quotation delivered within 4 business hours by an assigned Category Specialist.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProcurementDeskOpen(true)}
                    className="px-5 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-[11px]"
                  >
                    📋 Open Managed Procurement Desk
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#17233B] text-white rounded-2xl p-6 border border-[#C9A45C]/30 space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#C9A45C] tracking-widest block">
                  Outcome-Based Value
                </span>
                <h4 className="font-serif text-lg font-bold">
                  We Sell a Sourcing Outcome, Not Just a Listing Directory
                </h4>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Marketplaces leave the burden of supplier negotiation, shipping follow-up, and fraud risk on the buyer. Our Procurement Desk takes end-to-end accountability for quality and delivery.
                </p>
              </div>
            </div>
          )}

          {activeCapabilityTab === 'privatelabel' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-xs">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  CAPABILITY 4 · PRIVATE LABEL &amp; WHOLESALE GROWTH
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                  From Bulk Procurement to Your Own Branded Products
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Provide retailers, e-commerce brands, hospitality chains, and distributors a frictionless path from raw ingredients to private-label packaged retail units. Custom pouch packaging, nitrogen tins, barcode integration, and certified back-of-pack labels.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900 block">Stand-Up Pouches</span>
                    <span className="text-[10px] text-stone-500">100g, 250g, 500g, 1kg</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900 block">Nitrogen Tins</span>
                    <span className="text-[10px] text-stone-500">12+ months crisp freshness</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="font-bold text-stone-900 block">FSSAI Co-Packing</span>
                    <span className="text-[10px] text-stone-500">Central Lic. Compliance</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#FAF6EE] rounded-2xl p-6 border border-stone-200 space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#704B32] tracking-widest block">
                  Growth Partnership
                </span>
                <h4 className="font-serif text-lg font-bold text-[#17233B]">
                  Help Customers Build Their Brand, Not Just Stock Inventory
                </h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  We only promise private-label specifications and batch volumes that our vetted processing network can reliably execute with zero quality deviations.
                </p>
              </div>
            </div>
          )}

          {activeCapabilityTab === 'export' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-xs">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  CAPABILITY 5 · CROSS-BORDER SOURCING ASSISTANT
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                  Export Procurement for International Importers
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Help overseas buyers source Indian-origin GI-tagged Saffron, Kashmiri Kagzi Walnuts, and Mithila Makhana with export-ready documentation, APEDA clearance, Phytosanitary certificates, Incoterms (FOB Mumbai / CIF Destination), and container stuffing coordination.
                </p>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">Initial Export Corridor:</div>
                  <p className="text-[11px] text-stone-600">
                    GCC (Dubai / Riyadh), UK, EU, and North America. Dedicated Reefer container allocations from JNPT and cold chain aggregation in Srinagar.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#17233B] text-white rounded-2xl p-6 border border-[#C9A45C]/30 space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#C9A45C] tracking-widest block">
                  Cross-Border Sourcing
                </span>
                <h4 className="font-serif text-lg font-bold">
                  Source from India Without a Local Procurement Team
                </h4>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  We validate the suppliers, phytosanitary lab tests, and shipping economics before taking overseas orders—eliminating customs rejections and cross-border payment friction.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. COMMODITY BOARD & PROCUREMENT DECISION TOOL (Section 2C & 2D) ─── */}
      <section id="pricing-matrix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
              <span>📈</span> B2B COMMODITY BOARD &amp; DECISION MATRIX
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Transparent Volume Tier Pricing Matrix
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Real-time landed cost calculation based on your delivery destination, GST treatment (5% with 100% input tax credit), and confirmed supplier status.
            </p>
          </div>

          {/* Destination Selector for Live Landed Cost Calculation */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs space-y-1 text-xs">
            <label className="block text-[10px] uppercase font-bold tracking-wider text-[#704B32]">
              Select Delivery Destination for Landed Cost:
            </label>
            <select
              value={selectedDestinationForFilter}
              onChange={(e) => setSelectedDestinationForFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 font-bold text-[#17233B] outline-none bg-stone-50 focus:ring-2 focus:ring-[#176B68]"
            >
              <option value="Delhi NCR / Noida Hub">Delhi NCR / Noida Hub (+₹5/kg Freight)</option>
              <option value="Mumbai / Pune Industrial Corridor">Mumbai / Pune Corridor (+₹12/kg Freight)</option>
              <option value="Bengaluru / Karnataka Hub">Bengaluru / Karnataka (+₹15/kg Freight)</option>
              <option value="Srinagar / Kashmir Direct">Srinagar / Kashmir (+₹8/kg Direct)</option>
              <option value="Patna / Kolkata Eastern Hub">Patna / Kolkata Hub (+₹11/kg Freight)</option>
              <option value="Ahmedabad / Gujarat Belt">Ahmedabad / Gujarat (+₹10/kg Freight)</option>
            </select>
          </div>
        </div>

        {/* Category & Origin Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Tree Nuts', 'Saffron', 'Makhana', 'Dried Fruits'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <span>Filter Origin:</span>
            {['All', 'Kashmir', 'California', 'Bihar', 'Afghanistan'].map((origin) => (
              <button
                key={origin}
                type="button"
                onClick={() => setActiveOriginFilter(origin)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                  activeOriginFilter === origin
                    ? 'bg-[#704B32] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {origin}
              </button>
            ))}
          </div>
        </div>

        {/* Commodity Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommodities.map((item) => {
            const destFreight = getFreightPerKg(selectedDestinationForFilter)
            const starterLanded = Math.round(
              item.tierPrices.tier1.pricePerKg * (1 + item.gstPercent / 100) + destFreight,
            )
            const bulkLanded = Math.round(
              item.tierPrices.tier3.pricePerKg * (1 + item.gstPercent / 100) + destFreight,
            )

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3.5">
                  {/* Status & MOQ Header with Real Product Photo */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 flex-shrink-0 shadow-2xs">
                        <Image
                          src={getCommodityImage(item.id)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                          {item.origin}
                        </span>
                        <h3 className="font-serif font-bold text-base text-[#17233B] leading-snug">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 font-mono">
                          <span>{item.code}</span>
                          <span>•</span>
                          <span>HSN {item.hsnCode}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">
                      MOQ {item.moqKg} kg
                    </span>
                  </div>

                  {/* Confirmed Status & Verified Supplier Profile Badge */}
                  <div className="space-y-2 text-xs">
                    {/* Price Status Flag */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px]">
                      <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{item.priceConfidence?.status || 'Confirmed Spot Rate'}</span>
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Valid: {item.priceConfidence?.validityDays || 7} days
                      </span>
                    </div>

                    {/* Evidence-Backed Supplier Profile Badge */}
                    {item.supplier && (
                      <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-stone-200 text-[11px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#17233B]">{item.supplier.name}</span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            ✓ {item.supplier.physicalAuditStatus}
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-500 text-[10px]">
                          <span>Hub: {item.supplier.location}</span>
                          <span>Fulfillment: <strong className="text-stone-800">{item.supplier.fulfillmentRate}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Specification Box */}
                  <div className="p-3 bg-stone-50 rounded-xl text-xs space-y-1 border border-stone-200">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Grade / Spec:</span>
                      <span className="font-semibold text-stone-800 text-right">{item.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Moisture Spec:</span>
                      <span className="font-semibold text-stone-800">{item.moisture}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Fulfillment Hub:</span>
                      <span className="font-semibold text-[#176B68]">{item.dispatchHub}</span>
                    </div>
                  </div>

                  {/* 4-Tier Volume Price Ladder */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-stone-100">
                      <span className="text-stone-600">{item.tierPrices.tier1.label}</span>
                      <span className="font-bold text-[#17233B]">
                        ₹{item.tierPrices.tier1.pricePerKg.toLocaleString('en-IN')}/kg
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-stone-100 bg-emerald-50/50 px-1 rounded">
                      <span className="text-emerald-900 font-medium">{item.tierPrices.tier2.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded font-bold">
                          -{item.tierPrices.tier2.savingsPercent}%
                        </span>
                        <span className="font-bold text-emerald-800">
                          ₹{item.tierPrices.tier2.pricePerKg.toLocaleString('en-IN')}/kg
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-stone-100 bg-emerald-50 px-1 rounded">
                      <span className="text-emerald-950 font-bold">{item.tierPrices.tier3.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-emerald-300 text-emerald-950 px-1 rounded font-bold">
                          -{item.tierPrices.tier3.savingsPercent}%
                        </span>
                        <span className="font-bold text-emerald-900">
                          ₹{item.tierPrices.tier3.pricePerKg.toLocaleString('en-IN')}/kg
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-1 bg-amber-50 px-1 rounded">
                      <span className="text-amber-950 font-bold">{item.tierPrices.container.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-[#C9A45C] text-[#17233B] px-1 rounded font-bold">
                          -{item.tierPrices.container.savingsPercent}%
                        </span>
                        <span className="font-bold text-amber-900">
                          ₹{item.tierPrices.container.pricePerKg.toLocaleString('en-IN')}/kg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Net Landed Cost Highlight */}
                  <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-500 block">
                        Estimated Landed ({selectedDestinationForFilter.split('/')[0].trim()}):
                      </span>
                      <span className="text-[10px] text-stone-500">Includes 5% GST + Insured Freight</span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-base font-bold text-[#17233B]">
                        ₹{bulkLanded.toLocaleString('en-IN')}/kg
                      </span>
                      <span className="text-[10px] text-emerald-700 block font-semibold">Bulk Rate</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('multi-supplier-rfq')
                        if (el) el.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="flex-1 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider transition-colors text-center"
                    >
                      Compare Bids
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectedCommodity(item)}
                      className="px-3 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl font-bold transition-colors"
                      title="Inspect Quality Passport & Lab Assay"
                    >
                      🛡️ Passport
                    </button>
                  </div>

                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      `Hello Nuty Tales B2B! I want to request a 500g Commercial Sample Kit for: ${item.name} (${item.code}).`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-center transition-colors text-[11px]"
                  >
                    Request 500g Sample Kit
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Fallback Alternative Products Banner if Search Yields No Match */}
        {filteredCommodities.length === 0 && (
          <div className="p-8 bg-amber-50 rounded-3xl border border-amber-200 text-center space-y-4">
            <span className="text-3xl block">🔍</span>
            <h3 className="font-serif text-xl font-bold text-amber-950">
              No exact match for &quot;{naturalSearchQuery}&quot;
            </h3>
            <p className="text-xs text-amber-800 max-w-md mx-auto">
              We couldn&apos;t find an exact inventory lot matching this exact string, but here are comparable wholesale commodities in stock:
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {suggestedAlternatives.map((alt) => (
                <button
                  key={alt.id}
                  type="button"
                  onClick={() => setNaturalSearchQuery(alt.name)}
                  className="px-4 py-2 bg-white border border-amber-300 text-stone-800 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
                >
                  {alt.name} (₹{alt.tierPrices.tier2.pricePerKg}/kg)
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNaturalSearchQuery('')}
                className="px-4 py-2 bg-[#17233B] text-white rounded-xl text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ── 5. MULTI-SUPPLIER RFQ COMPARISON ENGINE (Section 2E of Brief) ──────── */}
      <section id="multi-supplier-rfq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MultiSupplierQuoteComparison />
      </section>

      {/* ── 6. IMMEDIATE B2B CASHFLOW: 5KG SAMPLE PACK & PROFORMA WIRE DESK ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommercialSampleDesk />
      </section>

      {/* ── 7. DIFFERENT EXPERIENCE FOR EACH BUYER PERSONA (Section 5 of Brief) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>👥</span> BUYER-CENTRIC PROCUREMENT PATHWAYS
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#17233B]">
            Built for Your Specific Buying Model
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            The same platform serves different procurement realities without forcing everyone through a generic checkout.
          </p>
        </div>

        {/* Persona Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BUYER_PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => setSelectedPersona(persona)}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between gap-2 ${
                selectedPersona.id === persona.id
                  ? 'bg-[#17233B] text-white border-[#17233B] shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className="text-2xl">{persona.icon}</span>
              <span className="font-serif font-bold text-xs leading-snug">{persona.role}</span>
              <span
                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  selectedPersona.id === persona.id ? 'bg-[#C9A45C] text-[#17233B]' : 'bg-stone-100 text-stone-500'
                }`}
              >
                MOQ {persona.typicalMoq}
              </span>
            </button>
          ))}
        </div>

        {/* Active Persona Deep-Dive Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-xs">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedPersona.icon}</span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                  Tailored Procurement Solution
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  {selectedPersona.role}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-500 block">
                  What You Need:
                </span>
                <p className="font-medium text-stone-900 text-sm">{selectedPersona.whatTheyNeed}</p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                  Nuty Tales Verifiable Offer:
                </span>
                <p className="font-bold text-emerald-950 text-sm">{selectedPersona.nutyTalesOffer}</p>
              </div>
            </div>

            <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 text-stone-700">
              <strong>Key Commercial Benefit:</strong> {selectedPersona.keyBenefit}
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#17233B] text-white rounded-2xl p-6 border border-[#C9A45C]/30 space-y-4 text-center">
            <span className="text-[10px] uppercase font-bold text-[#C9A45C] tracking-widest block">
              Dedicated Account Manager
            </span>
            <div className="font-serif text-lg font-bold">
              Speak with a Category Specialist
            </div>
            <p className="text-[11px] text-stone-300">
              Get custom volume tier contracts and scheduled standing deliveries structured for your business.
            </p>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales! I am a ${selectedPersona.role}. I am interested in discussing: ${selectedPersona.whatTheyNeed}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-sm"
            >
              Consult Procurement Desk
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. 90-DAY PRACTICAL EXECUTION PLAN (Section 6 of Brief) ───────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>🗓️</span> DISCIPLINED EXECUTION ROADMAP
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#17233B]">
            Practical 90-Day Execution Plan
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Establishing a repeatable wholesale operation before expanding heavily into speculative global marketplace listings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Phase 1 */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider">
                  Days 1–30
                </span>
                <span className="text-[11px] text-emerald-700 font-bold">Phase 1</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#17233B]">
                Prove Supply &amp; Pricing
              </h3>
              <ul className="space-y-2 text-stone-600 leading-relaxed list-disc pl-4 text-[11px]">
                <li>Narrow focus to 6–8 launch SKUs (Kashmir walnuts, almonds, saffron, makhana).</li>
                <li>Secure comparable quotes from at least 3 credible suppliers per core SKU.</li>
                <li>Verify samples, NABL grades, packaging, and dispatch SLAs.</li>
                <li>Establish live landed-cost calculation for Noida, Kashmir, and Patna hubs.</li>
                <li>Recruit 20–30 prospective commercial buyers for initial paid orders.</li>
              </ul>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
              <strong className="text-stone-900 block">Success Measure:</strong>
              <span className="text-stone-600">Reliable supplier shortlist &amp; confirmed buyer purchase intent.</span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#176B68] text-white text-[10px] font-bold uppercase tracking-wider">
                  Days 31–60
                </span>
                <span className="text-[11px] text-[#176B68] font-bold">Phase 2</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#17233B]">
                Launch Procurement Experience
              </h3>
              <ul className="space-y-2 text-stone-600 leading-relaxed list-disc pl-4 text-[11px]">
                <li>Make product discovery available before mandatory account creation.</li>
                <li>Introduce structured RFQs, sample requests, and comparable quotations.</li>
                <li>Deploy human-assisted managed Procurement Desk for Excel/BOM uploads.</li>
                <li>Track quote response time, conversion, and gross contribution per order.</li>
                <li>Direct outreach to commercial bakeries and distributors.</li>
              </ul>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
              <strong className="text-stone-900 block">Success Measure:</strong>
              <span className="text-stone-600">Real paid commercial orders &amp; documented buyer feedback.</span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#704B32] text-white text-[10px] font-bold uppercase tracking-wider">
                  Days 61–90
                </span>
                <span className="text-[11px] text-[#704B32] font-bold">Phase 3</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#17233B]">
                Create Repeat Purchasing
              </h3>
              <ul className="space-y-2 text-stone-600 leading-relaxed list-disc pl-4 text-[11px]">
                <li>Introduce saved purchase lists and 1-click replenishment requests.</li>
                <li>Give returning buyers faster quotations and order-history access.</li>
                <li>Pilot private-label packaging with qualified customer brands.</li>
                <li>Test initial cross-border export shipments for verified Indian-origin goods.</li>
                <li>Expand only SKUs with positive gross contribution margins.</li>
              </ul>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
              <strong className="text-stone-900 block">Success Measure:</strong>
              <span className="text-stone-600">Repeat reorder velocity &amp; improving customer acquisition economics.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. WHOLESALE BUSINESS SCENARIO CALCULATOR (Section 7 of Brief) ─────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriceScenarioCalculator />
      </section>

      {/* ── 10. CONTEXTUAL ACCOUNT ONBOARDING / SIGN-IN (Preserved & Refactored) ─ */}
      <section id="business-onboarding" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6 border-b lg:border-b-0 lg:border-r border-stone-200">
            <div>
              <div className="flex items-center gap-3 text-xs mb-4">
                <span
                  className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-full ${
                    onboardingStep === 1
                      ? 'bg-[#17233B] text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] leading-4">
                    1
                  </span>
                  <span>ACCOUNT CREATION</span>
                </span>

                <span className="text-stone-300">→</span>

                <span
                  className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-full ${
                    onboardingStep === 2
                      ? 'bg-[#17233B] text-white'
                      : onboardingStep === 3
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-center text-[10px] leading-4">
                    2
                  </span>
                  <span>BUSINESS DETAILS</span>
                </span>

                <span className="text-stone-300 hidden sm:inline">→</span>

                <span
                  className={`hidden sm:flex items-center gap-1.5 font-bold px-3 py-1 rounded-full ${
                    onboardingStep === 3
                      ? 'bg-[#17233B] text-white'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-center text-[10px] leading-4">
                    3
                  </span>
                  <span>FINISH</span>
                </span>
              </div>

              {!isOnboardingSubmitted ? (
                <>
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] tracking-tight">
                      {isSignInMode
                        ? 'Sign in to your Nuty Tales Business account'
                        : 'Unlock Corporate Net-30 Credit & Saved Quotes'}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600">
                      Save your quotation history, track recurring replenishment schedules, and access negotiated commercial pricing.
                    </p>
                  </div>

                  {/* Multi-Step Form */}
                  <form onSubmit={handleOnboardingSubmit} className="mt-6 space-y-4 text-xs">
                    {onboardingStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-[#17233B] mb-1.5">
                            Enter an official work email:
                          </label>
                          <input
                            type="email"
                            required
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                            placeholder="Enter work email (e.g. procurement@bakery.com)"
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base focus:ring-2 focus:ring-[#176B68] outline-none bg-stone-50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Procurement Officer Name
                            </label>
                            <input
                              type="text"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="e.g. Vikram Malhotra"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Direct Phone / WhatsApp
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <span>Continue to Business Details</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}

                    {onboardingStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-3 bg-stone-100 rounded-xl text-xs flex items-center justify-between">
                          <span>Account Email: <strong>{workEmail}</strong></span>
                          <button
                            type="button"
                            onClick={() => setOnboardingStep(1)}
                            className="text-[#176B68] font-bold hover:underline"
                          >
                            Edit
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-[#17233B] mb-1">
                              Organization / Company Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g. Royal Confectionery Pvt Ltd"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#17233B] mb-1">
                              Business Sector
                            </label>
                            <select
                              value={businessType}
                              onChange={(e) => setBusinessType(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-white"
                            >
                              <option value="Commercial Bakery">Commercial Bakery &amp; Cakes</option>
                              <option value="Sweet & Mithai Manufacturer">Sweet &amp; Mithai Manufacturer</option>
                              <option value="5-Star Hotel / Hospitality">5-Star Hotel / Hospitality</option>
                              <option value="Food & Snack Manufacturer">Food &amp; Snack Manufacturer</option>
                              <option value="Chocolate & Confectionery">Chocolate &amp; Confectionery</option>
                              <option value="Private Label / D2C Brand">Private Label / D2C Brand</option>
                              <option value="Regional Distributor">Regional Distributor / Wholesaler</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-[#17233B] mb-1">
                              GSTIN (For 100% Tax Credit)
                            </label>
                            <input
                              type="text"
                              maxLength={15}
                              value={gstin}
                              onChange={(e) => setGstin(e.target.value.toUpperCase())}
                              placeholder="e.g. 07AAAAA0000A1Z5"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#17233B] mb-1">
                              Plant City / Delivery Pincode *
                            </label>
                            <input
                              type="text"
                              required
                              value={cityPincode}
                              onChange={(e) => setCityPincode(e.target.value)}
                              placeholder="e.g. Noida / 201301"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setOnboardingStep(1)}
                            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <span>Continue to Commodity Setup</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {onboardingStep === 3 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div>
                          <label className="block font-bold text-[#17233B] mb-2">
                            Select Commodities Needed:
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'California Almonds (Sliced/Whole)',
                              'Kashmiri Mamra Almonds',
                              'Kashmiri Kagzi Walnuts',
                              'Pure Mongra Kashmir Saffron',
                              'Cashews W240 / Tukda',
                              'Phool Makhana Jumbo (6+ Sutra)',
                              'Afghan Seedless Raisins',
                              'Iranian Pistachios',
                            ].map((item) => {
                              const active = selectedNeeds.includes(item)
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleNeed(item)}
                                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                                    active
                                      ? 'bg-[#17233B] text-white border-[#C9A45C]'
                                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                  }`}
                                >
                                  <span className="font-medium text-[11px]">{item}</span>
                                  <span className="font-bold">{active ? '✓' : '+'}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-[#17233B] mb-1.5">
                            Estimated Monthly Requirement:
                          </label>
                          <select
                            value={estMonthlyKg}
                            onChange={(e) => setEstMonthlyKg(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-white"
                          >
                            <option value="100 kg - 250 kg">100 kg - 250 kg (Starter Batch)</option>
                            <option value="500 kg - 1,000 kg">500 kg - 1,000 kg (Commercial Line)</option>
                            <option value="2,500 kg - 5,000 kg">2,500 kg - 5,000 kg (Factory Bulk Run)</option>
                            <option value="10 Tons+ Container">10 Tons+ (Full Container Allocation)</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setOnboardingStep(2)}
                            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isOnboardingLoading}
                            className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <span>
                              {isOnboardingLoading
                                ? 'Activating Business Tier...'
                                : '✓ Complete Registration & Unlock Wholesale Tier'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {onboardingError && (
                      <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs border border-red-200">
                        ⚠️ {onboardingError}
                      </div>
                    )}
                  </form>

                  <div className="pt-2 text-xs">
                    <span className="text-stone-600">
                      {isSignInMode
                        ? 'New organisation? '
                        : 'Already registered with Nuty Tales Business? '}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSignInMode(!isSignInMode)}
                      className="font-bold text-[#176B68] hover:underline"
                    >
                      {isSignInMode ? 'Create free business account' : 'Sign in'}
                    </button>
                  </div>
                </>
              ) : (
                /* Welcome Confirmation */
                <div className="space-y-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 animate-fadeIn">
                  <div className="flex items-center gap-2 text-base font-serif font-bold text-emerald-800">
                    <span className="text-2xl">🎉</span>
                    <span>Business Account Created &amp; Verified!</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    Welcome aboard, <strong>{companyName || 'Corporate Partner'}</strong>. Your commercial wholesale pricing tiers are now unlocked.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <div>Account Email: <strong>{workEmail}</strong></div>
                    <div>Allocated Sourcing Hub: <strong>Noida HQ / Kashmir Valley</strong></div>
                    <div>Assigned Key Account Specialist: <strong>Tariq Ahmad (+91 9717161809)</strong></div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href="#pricing-matrix"
                      className="px-4 py-2 bg-[#17233B] text-white rounded-xl font-bold uppercase text-[11px] tracking-wider"
                    >
                      View Live Wholesale Rates ↓
                    </a>
                    <a
                      href={`https://wa.me/${whatsappPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold uppercase text-[11px] tracking-wider"
                    >
                      Instant WhatsApp Desk
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-stone-200 text-[11px] text-stone-500 leading-relaxed">
              By clicking get started, you agree to Nuty Tales Conditions of Use, Privacy Notice, and the Business Supply Terms and Conditions. You agree that you are creating this business account on behalf of your organisation and have authority to bind your organisation.
            </div>
          </div>

          {/* Right Card: Value Propositions (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 bg-[#FAF6EE] flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#17233B] leading-tight">
                Enterprise Sourcing Benefits
              </h3>

              <div className="space-y-5 text-xs">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                    🚚
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-serif font-bold text-sm text-[#17233B]">
                      Insured Pan-India Logistics
                    </h4>
                    <p className="text-stone-600 leading-relaxed">
                      Scheduled dispatches with live vehicle tracking and transit temperature preservation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                    🏷️
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-serif font-bold text-sm text-[#17233B]">
                      100% Tax Credit GST Invoicing
                    </h4>
                    <p className="text-stone-600 leading-relaxed">
                      Full GST input tax credit with verified HSN codes on every commercial invoice.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-lg flex-shrink-0">
                    🔬
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-serif font-bold text-sm text-[#17233B]">
                      NABL Batch Quality Certificates
                    </h4>
                    <p className="text-stone-600 leading-relaxed">
                      Every dispatched lot includes an authentic Certificate of Analysis from accredited laboratories.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-300 text-xs">
              <button
                type="button"
                onClick={() => setIsProcurementDeskOpen(true)}
                className="font-bold text-[#176B68] hover:underline flex items-center gap-1.5"
              >
                <span>Have an existing PO or BOM? Upload to Desk</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. THREE REGIONAL FULFILLMENT HUBS ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Nationwide Logistics Infrastructure
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#17233B]">
            Three Strategic Processing &amp; Fulfillment Hubs
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Minimizing transit time, eliminating secondary handling, and ensuring uninterrupted inventory continuity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {B2B_HUBS.map((hub) => (
            <div
              key={hub.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#176B68]">
                  {hub.state}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#17233B]">{hub.name}</h3>
                <p className="text-stone-600 text-[11px]">{hub.address}</p>
                <p className="text-stone-800 font-medium pt-1">{hub.role}</p>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1.5 text-[11px]">
                <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                  Transit Benchmarks:
                </span>
                {Object.entries(hub.transitDays).map(([dest, time]) => (
                  <div key={dest} className="flex justify-between text-stone-600">
                    <span>{dest}:</span>
                    <strong className="text-[#17233B]">{time}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modals & Drawers ─────────────────────────────────────────────────── */}
      <QualityPassportModal
        commodity={inspectedCommodity}
        onClose={() => setInspectedCommodity(null)}
      />

      <ProcurementDeskModal
        isOpen={isProcurementDeskOpen}
        onClose={() => setIsProcurementDeskOpen(false)}
      />

      <BecomeSupplierModal
        isOpen={isBecomeSupplierOpen}
        onClose={() => setIsBecomeSupplierOpen(false)}
      />
    </div>
  )
}
