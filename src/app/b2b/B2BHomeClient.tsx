'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  B2B_COMMODITIES,
  B2B_HUBS,
  B2BCommodity,
} from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import CommercialSampleDesk from '@/components/b2b/CommercialSampleDesk'
import QualityPassportModal from '@/components/b2b/QualityPassportModal'
import PriceScenarioCalculator from '@/components/b2b/PriceScenarioCalculator'
import MultiSupplierQuoteComparison from '@/components/b2b/MultiSupplierQuoteComparison'
import ProcurementDeskModal from '@/components/b2b/ProcurementDeskModal'
import BecomeSupplierModal from '@/components/b2b/BecomeSupplierModal'

export default function B2BHomeClient() {
  // ── 1. Modals & Drawers State ─────────────────────────────────────────────
  const [inspectedCommodity, setInspectedCommodity] = useState<B2BCommodity | null>(null)
  const [isProcurementDeskOpen, setIsProcurementDeskOpen] = useState(false)
  const [isBecomeSupplierOpen, setIsBecomeSupplierOpen] = useState(false)
  const [lockedCommodityAlert, setLockedCommodityAlert] = useState<string | null>(null)

  // ── 2. Global Terminal Controls State ──────────────────────────────────────
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'AED' | 'EUR'>('INR')
  const [selectedIncoterm, setSelectedIncoterm] = useState<'Ex-Hub' | 'FOR-Delivered' | 'FOB-Port' | 'CIF-Port'>('FOR-Delivered')
  const [selectedDestination, setSelectedDestination] = useState<string>('Delhi NCR / Noida Central Hub')
  const [activePlatformTab, setActivePlatformTab] = useState<'exchange' | 'vendors' | 'rfq' | 'calculator' | 'coldchain'>('exchange')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // ── 3. Sourcing Filter State ───────────────────────────────────────────────
  const [naturalSearchQuery, setNaturalSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [activeOriginFilter, setActiveOriginFilter] = useState<string>('All')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // ── 4. Multi-Currency Conversion Helpers ───────────────────────────────────
  const formatPrice = (inrVal: number) => {
    if (selectedCurrency === 'USD') {
      const usdVal = inrVal / 83.5
      return `$${usdVal < 100 ? usdVal.toFixed(2) : Math.round(usdVal).toLocaleString('en-US')}`
    }
    if (selectedCurrency === 'AED') {
      const aedVal = inrVal / 22.7
      return `د.إ ${aedVal < 100 ? aedVal.toFixed(2) : Math.round(aedVal).toLocaleString('en-US')}`
    }
    if (selectedCurrency === 'EUR') {
      const eurVal = inrVal / 90.5
      return `€${eurVal < 100 ? eurVal.toFixed(2) : Math.round(eurVal).toLocaleString('en-US')}`
    }
    return `₹${inrVal.toLocaleString('en-IN')}`
  }

  // ── 5. Destination Landed Cost Engine ───────────────────────────────────────
  const calculateLandedRate = (baseRate: number, dest: string) => {
    let freight = 5
    let gstRate = 0.05 // 5% GST on raw dry fruits & nuts
    if (dest.includes('Delhi') || dest.includes('Noida')) freight = 5
    else if (dest.includes('Mumbai') || dest.includes('Nhava Sheva')) freight = 12
    else if (dest.includes('Bengaluru')) freight = 15
    else if (dest.includes('Dubai') || dest.includes('Jebel Ali')) {
      freight = 45
      gstRate = 0 // Export LUT
    } else if (dest.includes('Rotterdam')) {
      freight = 65
      gstRate = 0
    }
    return Math.round((baseRate + freight) * (1 + gstRate))
  }

  // ── 6. Real Commodity Image Resolver ───────────────────────────────────────
  const getCommodityImage = (id: string) => {
    if (id.includes('mamra')) return '/images/mamra-kernels-macro.jpg'
    if (id.includes('california') || id.includes('almond')) return '/images/almonds-pouch-250g.jpg'
    if (id.includes('walnut') || id.includes('akhrot')) return '/images/kashmir-kagzi-akhrot-250g.jpg'
    if (id.includes('saffron') || id.includes('kesar')) return '/images/saffron-threads-macro.jpg'
    if (id.includes('makhana')) return '/images/makhana-pouch-250g.jpg'
    if (id.includes('cashew')) return '/images/cashews-w180-macro.jpg'
    return '/images/almonds-pouch-250g.jpg'
  }

  // ── 7. Natural Language Sourcing Search & Parser ───────────────────────────
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

    const keywords = query.split(/[\s,]+/).filter(Boolean)

    let detectedDest = selectedDestination
    if (query.includes('delhi') || query.includes('noida')) detectedDest = 'Delhi NCR / Noida Central Hub'
    else if (query.includes('mumbai') || query.includes('nhava')) detectedDest = 'Mumbai / Nhava Sheva Port (JNPT)'
    else if (query.includes('bengaluru') || query.includes('bangalore')) detectedDest = 'Bengaluru / Karnataka Hub'
    else if (query.includes('dubai') || query.includes('jebel')) detectedDest = 'Dubai Jebel Ali Port (UAE)'
    else if (query.includes('rotterdam') || query.includes('europe')) detectedDest = 'Rotterdam Port (Netherlands)'

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
  }, [activeCategory, activeOriginFilter, naturalSearchQuery, selectedDestination])

  // ── 8. Six Verified Vendors from Reference Architecture ─────────────────────
  const VENDORS_DATABASE = [
    {
      id: 'ven-kva',
      code: 'KVA',
      name: 'Kashmir Valley Agri-Exports',
      category: 'Kashmiri Kagzi Walnuts & Saffron Mongra',
      location: 'Srinagar, J&K',
      rating: 4.9,
      deliveriesCount: 142,
      totalSpend: '₹1.84 Cr',
      ratePerKg: 1080,
      landedPerKg: calculateLandedRate(1080, selectedDestination),
      fssaiNumber: '11023002000812',
      lotNumber: 'LOT-KMR-2026-W04',
      image: '/images/kashmir-kagzi-akhrot-250g.jpg',
      avatarBg: 'bg-emerald-600 text-white',
      tags: ['Snow-White Halves 80%+', 'Cold-Chain Reefer', 'GI Registered'],
    },
    {
      id: 'ven-cvn',
      code: 'CVN',
      name: 'Central Valley Nut Processors',
      category: 'California Almonds (Nonpareil Extra #1)',
      location: 'Nhava Sheva Hub / Modesto CA',
      rating: 4.8,
      deliveriesCount: 98,
      totalSpend: '₹2.15 Cr',
      ratePerKg: 670,
      landedPerKg: calculateLandedRate(670, selectedDestination),
      fssaiNumber: '10021011000219',
      lotNumber: 'LOT-CAL-2026-A12',
      image: '/images/almonds-pouch-250g.jpg',
      avatarBg: 'bg-blue-600 text-white',
      tags: ['Sliced 1.0mm', 'Laser Sorted', 'NABL Certified'],
    },
    {
      id: 'ven-prs',
      code: 'PRS',
      name: 'Pampore Royal Saffron Syndicate',
      category: 'Pure Kashmiri Mongra Saffron (Grade A1)',
      location: 'Pampore, Kashmir',
      rating: 5.0,
      deliveriesCount: 64,
      totalSpend: '₹3.42 Cr',
      ratePerKg: 260000,
      landedPerKg: calculateLandedRate(260000, selectedDestination),
      fssaiNumber: '11024002000301',
      lotNumber: 'LOT-SAF-2026-M09',
      image: '/images/saffron-threads-macro.jpg',
      avatarBg: 'bg-purple-600 text-white',
      tags: ['Crocin > 240', 'ISO 3632 Cat I', 'Insured Air Dispatch'],
    },
    {
      id: 'ven-mah',
      code: 'MAH',
      name: 'Mithila Agro Producers Syndicate',
      category: 'GI Mithila Phool Makhana (6+ Sutra)',
      location: 'Darbhanga, Bihar',
      rating: 4.7,
      deliveriesCount: 115,
      totalSpend: '₹94.2 L',
      ratePerKg: 690,
      landedPerKg: calculateLandedRate(690, selectedDestination),
      fssaiNumber: '10423001000184',
      lotNumber: 'LOT-MKH-2026-J07',
      image: '/images/makhana-pouch-250g.jpg',
      avatarBg: 'bg-amber-600 text-white',
      tags: ['Hand-Graded Jumbo', 'Hard-Shell Free', 'Private Label Ready'],
    },
    {
      id: 'ven-kcp',
      code: 'KCP',
      name: 'Konkan Cashew Processors Ltd',
      category: 'Cashew Kernels W240 & W180 King Jumbo',
      location: 'Mangalore / Goa',
      rating: 4.8,
      deliveriesCount: 87,
      totalSpend: '₹1.18 Cr',
      ratePerKg: 760,
      landedPerKg: calculateLandedRate(760, selectedDestination),
      fssaiNumber: '11222333000412',
      lotNumber: 'LOT-CSH-2026-W02',
      image: '/images/cashews-w180-macro.jpg',
      avatarBg: 'bg-indigo-600 text-white',
      tags: ['Moisture < 4.5%', 'Export Vacuum Packs', 'Clean Aflatoxin'],
    },
    {
      id: 'ven-ahf',
      code: 'AHF',
      name: 'Afghan-Hind Dry Fruit Terminal',
      category: 'Kashmiri Mamra Almonds & Iranian Pistachios',
      location: 'Khari Baoli / Nhava Sheva',
      rating: 4.9,
      deliveriesCount: 73,
      totalSpend: '₹1.62 Cr',
      ratePerKg: 2150,
      landedPerKg: calculateLandedRate(2150, selectedDestination),
      fssaiNumber: '10018011005120',
      lotNumber: 'LOT-MAM-2026-K03',
      image: '/images/mamra-kernels-macro.jpg',
      avatarBg: 'bg-teal-600 text-white',
      tags: ['Cold Climate High Oil', 'Zero Trans-Fat', 'Export Grade'],
    },
  ]

  const handleLockPrice = (commodityName: string, rate: number) => {
    setLockedCommodityAlert(`Spot rate for ${commodityName} (₹${rate.toLocaleString('en-IN')}/kg) locked for 24 hours. A Proforma Invoice draft has been generated.`)
    setTimeout(() => setLockedCommodityAlert(null), 7000)
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ── 1. GLOBAL TERMINAL HEADER STRIP ───────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top Meta Line: Title + Live Floor Status + Quick Action Buttons */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                LIVE COMMODITY SOURCING TERMINAL
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-[11px] text-stone-500 font-mono hidden sm:inline">
                APMC Mumbai · JNPT Reefer Gate · Pampore Cold Hub · Dubai DGCX · Rotterdam
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#081830]">
              Global Wholesale Procurement &amp; Spot Exchange
            </h1>
            <p className="text-xs text-stone-500">
              Direct farm-to-enterprise contracts, verified NABL lab evidence, 5% GST landed cost calculations, and temperature-controlled reefer dispatch.
            </p>
          </div>

          {/* Right Action Controls: Post RFQ & Supplier Registry */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsProcurementDeskOpen(true)}
              className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E65100] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>Post Quick RFQ</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBecomeSupplierOpen(true)}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-200 transition-colors"
            >
              🌾 Become a Supplier
            </button>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                'Hello Trade Desk! Inquiring about immediate spot contract allocations.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl transition-colors"
            >
              📞 Hotline Desk
            </a>
          </div>
        </div>

        {/* Global Trading Filters: Currency + Incoterms + Destination Port */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Currency Switcher */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-600 uppercase">Settlement Currency:</span>
            <div className="flex items-center gap-1">
              {(['INR', 'USD', 'AED', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setSelectedCurrency(curr)}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                    selectedCurrency === curr
                      ? 'bg-[#081830] text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {curr === 'INR' && '₹ INR'}
                  {curr === 'USD' && '$ USD'}
                  {curr === 'AED' && 'د.إ AED'}
                  {curr === 'EUR' && '€ EUR'}
                </button>
              ))}
            </div>
          </div>

          {/* Incoterms Selector */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-600 uppercase">Incoterms:</span>
            <select
              value={selectedIncoterm}
              onChange={(e) => setSelectedIncoterm(e.target.value as typeof selectedIncoterm)}
              className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-semibold text-stone-800 outline-none"
            >
              <option value="FOR-Delivered">FOR Destination (With 5% GST)</option>
              <option value="Ex-Hub">Ex-Warehouse Spot</option>
              <option value="FOB-Port">FOB Nhava Sheva (Export)</option>
              <option value="CIF-Port">CIF Destination Port</option>
            </select>
          </div>

          {/* Delivery Destination Hub */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-600 uppercase">Destination Hub:</span>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-semibold text-stone-800 outline-none max-w-[190px] truncate"
            >
              <option value="Delhi NCR / Noida Central Hub">Delhi NCR / Noida Hub</option>
              <option value="Mumbai / Nhava Sheva Port (JNPT)">Mumbai / Nhava Sheva JNPT</option>
              <option value="Bengaluru / Karnataka Hub">Bengaluru / South Hub</option>
              <option value="Dubai Jebel Ali Port (UAE)">Dubai Jebel Ali (UAE)</option>
              <option value="Rotterdam Port (Netherlands)">Rotterdam Port (EU)</option>
            </select>
          </div>
        </div>

        {/* Locked Spot Rate Alert Banner */}
        {lockedCommodityAlert && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-base">🔒</span>
              <span className="font-semibold">{lockedCommodityAlert}</span>
            </div>
            <button
              onClick={() => setLockedCommodityAlert(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </section>

      {/* ── 2. PLATFORM KPI SUMMARY STRIP (4 Plasma Cards) ──────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 24h Spot Traded Volume (Blue Accent) */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563EB]" />
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            24h Traded Volume
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="font-mono text-2xl font-bold text-stone-900">48.5 MT</div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              +14 POs Dispatched
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Across 6 origin cold-chain hubs</div>
        </div>

        {/* Card 2: Verified Origin Hubs (Orange Accent) */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF6B00]" />
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Verified Origin Hubs
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="font-mono text-2xl font-bold text-stone-900">6 Regions</div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              Direct Orchards
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Kashmir, California, Mithila, Mangalore, Kerman</div>
        </div>

        {/* Card 3: Landed Cost Benchmark (Green Accent) */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Landed Cost Advantage
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="font-mono text-2xl font-bold text-emerald-700">-8.2% vs APMC</div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              5% GST Eligible
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Direct aggregator to factory gate</div>
        </div>

        {/* Card 4: Cold-Chain Telemetry (Purple Accent) */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#8B5CF6]" />
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Cold Reefer Telemetry
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="font-mono text-2xl font-bold text-stone-900">2°C – 4°C</div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
              Active Fleet
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">12 refrigerated containers in-transit</div>
        </div>
      </section>

      {/* ── 3. INTELLIGENT SOURCING SEARCH TERMINAL ───────────────────────── */}
      <section className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base">🔎</span>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Natural Language Sourcing Search &amp; Route Terminal
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            Parse commodity, quantity, cut, and destination hub automatically
          </span>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <input
            type="text"
            value={naturalSearchQuery}
            onChange={(e) => setNaturalSearchQuery(e.target.value)}
            placeholder='Try: "Kashmiri walnuts, 10 MT to Nhava Sheva" or "California Almonds Sliced, 500 kg to Delhi NCR"'
            className="w-full px-4 py-2.5 pl-10 pr-9 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#081830] focus:border-transparent outline-none bg-stone-50 text-stone-900 font-medium transition-all"
          />
          <span className="absolute left-3 top-2.5 text-stone-400 text-sm">🔍</span>
          {naturalSearchQuery && (
            <button
              type="button"
              onClick={() => setNaturalSearchQuery('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Example Prompt Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-stone-600">
          <span className="text-[10px] font-bold uppercase text-stone-400 mr-1">
            Quick Sourcing Queries:
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
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-[#081830] hover:text-white text-stone-700 text-[11px] font-medium transition-colors border border-stone-200"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Parsed Search Feedback Banner */}
        {parsedSearchFeedback && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-sm">🎯</span>
              <span>
                Showing <strong>{parsedSearchFeedback.matchCount} matched commodity lots</strong> for{' '}
                <strong className="text-emerald-900">{parsedSearchFeedback.quantity}</strong> routed to{' '}
                <strong className="text-emerald-900">{parsedSearchFeedback.destination}</strong>.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActivePlatformTab('exchange')}
              className="font-bold text-emerald-800 hover:underline uppercase text-[11px] tracking-wider"
            >
              View on Spot Floor ↓
            </button>
          </div>
        )}
      </section>

      {/* ── 4. MULTI-MODULE PLATFORM WORKSPACE (TABS) ────────────────────────── */}
      <section className="space-y-4">
        {/* Platform View Switcher Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-2">
          {/* Main 5 Platform Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {[
              { id: 'exchange', label: 'Live Spot Exchange', icon: '📊', count: filteredCommodities.length },
              { id: 'vendors', label: 'Verified Vendor Database', icon: '🏢', count: VENDORS_DATABASE.length },
              { id: 'rfq', label: 'Multi-Supplier RFQ Matrix', icon: '⚡', count: null },
              { id: 'calculator', label: 'Landed Arbitrage Simulator', icon: '🧮', count: null },
              { id: 'coldchain', label: 'Reefer Cold-Chain Corridors', icon: '❄️', count: 12 },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActivePlatformTab(tab.id as typeof activePlatformTab)}
                className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  activePlatformTab === tab.id
                    ? 'bg-[#081830] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      activePlatformTab === tab.id ? 'bg-[#FF6B00] text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Grid vs Table) when on exchange tab */}
          {activePlatformTab === 'exchange' && (
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500'
                }`}
              >
                ▦ Grid Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500'
                }`}
              >
                ▤ Trading Table
              </button>
            </div>
          )}
        </div>

        {/* ── TAB 1: LIVE COMMODITY SPOT EXCHANGE ────────────────────────────── */}
        {activePlatformTab === 'exchange' && (
          <div className="space-y-4">
            {/* Category Quick Filter Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-stone-400 mr-1">Commodity:</span>
                {['All', 'Dry Fruits', 'Seeds', 'Spices'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeCategory === cat
                        ? 'bg-[#081830] text-white'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase text-stone-400 mr-1">Origin:</span>
                {['All', 'Kashmir', 'California', 'Bihar', 'Goa'].map((orig) => (
                  <button
                    key={orig}
                    type="button"
                    onClick={() => setActiveOriginFilter(orig)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activeOriginFilter === orig
                        ? 'bg-[#081830] text-white'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {orig}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode A: Dense Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCommodities.map((item) => {
                  const spotPrice = item.tierPrices.tier2.pricePerKg
                  const landedPrice = calculateLandedRate(spotPrice, selectedDestination)
                  const img = getCommodityImage(item.id)

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Top Header Strip */}
                      <div className="p-4 space-y-3">
                        {/* Status + Origin Pill */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200">
                            {item.origin}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{item.priceConfidence?.status || 'Confirmed Spot'}</span>
                          </span>
                        </div>

                        {/* Product Image & Title Row */}
                        <div className="flex items-start gap-3">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Image
                              src={img}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-stone-900 text-sm leading-snug line-clamp-1">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                              {item.grade}
                            </div>
                            <div className="text-[9px] text-[#C9A45C] font-mono mt-0.5">
                              FSSAI Central Lic. · NABL Assayed
                            </div>
                          </div>
                        </div>

                        {/* Specification Matrix (Moisture, Cut, Hub) */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-[10px]">
                          <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                            <span className="text-stone-400 uppercase font-bold block">Moisture</span>
                            <span className="font-semibold text-stone-800">{item.moisture}</span>
                          </div>
                          <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                            <span className="text-stone-400 uppercase font-bold block">Min Order</span>
                            <span className="font-semibold text-stone-800">{item.moqKg} kg</span>
                          </div>
                          <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                            <span className="text-stone-400 uppercase font-bold block">Dispatch Hub</span>
                            <span className="font-semibold text-stone-800 truncate block">{item.dispatchHub.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Live Pricing Box (Ex-Hub Spot + Net Landed) */}
                        <div className="p-3 bg-stone-50/80 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[9px] text-stone-400 uppercase font-bold block">
                              Ex-Hub Spot ({selectedCurrency})
                            </span>
                            <span className="font-mono font-bold text-stone-900 text-sm">
                              {formatPrice(spotPrice)}
                              <span className="text-[10px] text-stone-500 font-normal"> / kg</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-emerald-800 uppercase font-bold block">
                              Est. Landed (5% GST)
                            </span>
                            <span className="font-mono font-bold text-emerald-700 text-sm">
                              {formatPrice(landedPrice)}
                              <span className="text-[10px] text-emerald-600 font-normal"> / kg</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Row: RFQ + Quality Passport + Sample */}
                      <div className="p-3 bg-stone-50/50 border-t border-stone-100 flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setIsProcurementDeskOpen(true)}
                          className="flex-1 py-2 bg-[#081830] hover:bg-[#12274A] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors text-center shadow-xs"
                        >
                          ⚡ RFQ
                        </button>
                        <button
                          type="button"
                          onClick={() => setInspectedCommodity(item)}
                          className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors"
                          title="Inspect Lab Quality Passport"
                        >
                          🛡️ Assay
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLockPrice(item.name, spotPrice)}
                          className="px-2.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs rounded-xl transition-colors"
                          title="Lock Spot Price for 24 hours"
                        >
                          🔒 Lock
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* View Mode B: Dense Trading Terminal (Table View) */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#081830] text-white text-[10px] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Commodity / Specification</th>
                        <th className="py-3 px-3">Origin Orchard</th>
                        <th className="py-3 px-3">Moisture Spec</th>
                        <th className="py-3 px-3">MOQ</th>
                        <th className="py-3 px-4">Ex-Hub Rate ({selectedCurrency})</th>
                        <th className="py-3 px-4">Est. Landed ({selectedCurrency})</th>
                        <th className="py-3 px-4 text-right">Procurement Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-sans">
                      {filteredCommodities.map((item) => {
                        const spotPrice = item.tierPrices.tier2.pricePerKg
                        const landedPrice = calculateLandedRate(spotPrice, selectedDestination)
                        const img = getCommodityImage(item.id)

                        return (
                          <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-stone-200 bg-stone-50 flex-shrink-0">
                                  <Image
                                    src={img}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-stone-900">{item.name}</div>
                                  <div className="text-[10px] text-stone-500">{item.grade}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-medium text-stone-700">{item.origin}</td>
                            <td className="py-3 px-3 font-mono text-stone-600">{item.moisture}</td>
                            <td className="py-3 px-3 font-mono text-stone-600">{item.moqKg} kg</td>
                            <td className="py-3 px-4 font-mono font-bold text-stone-900">
                              {formatPrice(spotPrice)}/kg
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                              {formatPrice(landedPrice)}/kg
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setIsProcurementDeskOpen(true)}
                                  className="px-3 py-1 bg-[#081830] hover:bg-[#12274A] text-white font-bold text-[10px] uppercase rounded-lg shadow-2xs"
                                >
                                  Instant RFQ
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setInspectedCommodity(item)}
                                  className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px]"
                                >
                                  Assay
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: VERIFIED VENDOR DATABASE & ACTIVE LOTS ──────────────────── */}
        {activePlatformTab === 'vendors' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Vetted Primary Origin Processors &amp; Aggregators
                </h3>
                <p className="text-stone-500 text-[11px]">
                  All listed vendors hold verified FSSAI Central Licenses, valid NABL lab lot certificates, and documented dispatch track records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBecomeSupplierOpen(true)}
                className="px-4 py-2 bg-[#081830] hover:bg-[#12274A] text-white font-bold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap shadow-xs"
              >
                + Register as Supplier
              </button>
            </div>

            {/* 6 Vendor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {VENDORS_DATABASE.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Logo thumbnail + Name + FSSAI */}
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex-shrink-0">
                        <Image
                          src={vendor.image}
                          alt={vendor.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                        <span
                          className={`absolute bottom-0 right-0 px-1 text-[8px] font-bold ${vendor.avatarBg}`}
                        >
                          {vendor.code}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-stone-900 text-xs truncate">
                          {vendor.name}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {vendor.category}
                        </div>
                        <div className="text-[9px] text-[#C9A45C] font-mono mt-0.5">
                          FSSAI Lic. #{vendor.fssaiNumber} · {vendor.lotNumber}
                        </div>
                      </div>
                    </div>

                    {/* Vendor Performance Metrics */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
                      <div>
                        <div className="text-[9px] font-bold text-stone-400 uppercase">LOCATION</div>
                        <div className="font-semibold text-stone-800 text-[11px] truncate">
                          {vendor.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-stone-400 uppercase">RATING</div>
                        <div className="font-semibold text-stone-800 text-[11px] flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          <span>{vendor.rating.toFixed(1)} / 5.0</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-stone-400 uppercase">DELIVERIES</div>
                        <div className="font-mono font-bold text-stone-900 text-[11px]">
                          {vendor.deliveriesCount} orders
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-stone-400 uppercase">TOTAL SPEND</div>
                        <div className="font-mono font-bold text-stone-900 text-[11px]">
                          {vendor.totalSpend}
                        </div>
                      </div>
                    </div>

                    {/* Spot & Landed Rates */}
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[9px] text-stone-400 uppercase font-bold block">
                          Spot Rate
                        </span>
                        <span className="font-mono font-bold text-stone-900">
                          {formatPrice(vendor.ratePerKg)}/kg
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-emerald-800 uppercase font-bold block">
                          Est. Landed (5% GST)
                        </span>
                        <span className="font-mono font-bold text-emerald-700">
                          {formatPrice(vendor.landedPerKg)}/kg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vendor Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      {vendor.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[9px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsProcurementDeskOpen(true)}
                      className="px-3.5 py-1.5 bg-[#FF6B00] hover:bg-[#E65100] text-white text-xs font-bold uppercase rounded-lg shadow-2xs transition-colors"
                    >
                      Get Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: MULTI-SUPPLIER RFQ COMPARISON ENGINE ───────────────────── */}
        {activePlatformTab === 'rfq' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <MultiSupplierQuoteComparison />
          </div>
        )}

        {/* ── TAB 4: LANDED COST & VOLUME ARBITRAGE SIMULATOR ────────────────── */}
        {activePlatformTab === 'calculator' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="border-b border-stone-100 pb-3 mb-4">
              <h3 className="font-bold text-stone-900 text-sm">
                Enterprise Sourcing Arbitrage &amp; Financial Model Simulator
              </h3>
              <p className="text-stone-500 text-xs">
                Simulate bulk volume tiers, wholesale discounts, shipping freight, and GST input credit recovery.
              </p>
            </div>
            <PriceScenarioCalculator />
          </div>
        )}

        {/* ── TAB 5: REEFER COLD-CHAIN TELEMETRY & NETWORK ──────────────────── */}
        {activePlatformTab === 'coldchain' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">
                    Refrigerated Cold-Chain Telemetry &amp; Logistics Corridors
                  </h3>
                  <p className="text-stone-500 text-xs">
                    Continuous 2°C – 4°C temperature monitoring from primary origin vaults to industrial receiving docks.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                  ● 12 Units Telemetry Active
                </span>
              </div>

              {/* Corridor Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Kashmir ➔ Delhi NCR Corridor</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Nominal (2.8°C)
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Pampore Cold Vault to Noida Sector 63 Logistics Gateway. Active telemetry GPS logged every 15 minutes.
                  </p>
                  <div className="text-[10px] font-mono text-stone-500">
                    Transit SLA: 36 Hours · Next Dispatch: Today 20:00 IST
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Nhava Sheva ➔ Northern Industrial Belt</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Nominal (3.2°C)
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Import container clearance at JNPT Port to Bhiwandi &amp; NCR distribution centers.
                  </p>
                  <div className="text-[10px] font-mono text-stone-500">
                    Transit SLA: 48 Hours · 20ft &amp; 40ft Reefer FCL Ready
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">Export Corridor: Nhava Sheva ➔ Jebel Ali</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Scheduled Sailing
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Phytosanitary &amp; APEDA certified container stuffing for GCC food distribution groups.
                  </p>
                  <div className="text-[10px] font-mono text-stone-500">
                    Ocean Transit: 4 Days · Customs Drawback Managed
                  </div>
                </div>
              </div>
            </div>

            {/* Commercial Sample Pack Desk Embedded */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
              <CommercialSampleDesk />
            </div>
          </div>
        )}
      </section>

      {/* ── 5. INTERACTIVE MODALS & WORKFLOW DRAWERS ──────────────────────────── */}
      {/* A. Quality Passport Modal (Lab Assays) */}
      <QualityPassportModal
        commodity={inspectedCommodity}
        onClose={() => setInspectedCommodity(null)}
      />

      {/* B. Instant Procurement Desk Modal (RFQ Submission) */}
      <ProcurementDeskModal
        isOpen={isProcurementDeskOpen}
        onClose={() => setIsProcurementDeskOpen(false)}
      />

      {/* C. Supplier Onboarding Modal */}
      <BecomeSupplierModal
        isOpen={isBecomeSupplierOpen}
        onClose={() => setIsBecomeSupplierOpen(false)}
      />
    </div>
  )
}
