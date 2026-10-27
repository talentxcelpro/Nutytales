'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { B2B_COMMODITIES, B2BCommodity } from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import CommercialSampleDesk from '@/components/b2b/CommercialSampleDesk'
import QualityPassportModal from '@/components/b2b/QualityPassportModal'

const getCommodityImage = (id: string) => {
  if (id.includes('mamra')) return '/images/mamra-almonds-pouch-250g.webp'
  if (id.includes('california') || id.includes('almond')) return '/images/almonds-pouch-250g.webp'
  if (id.includes('walnut') || id.includes('akhrot')) return '/images/kashmir-kagzi-akhrot-250g.webp'
  if (id.includes('saffron') || id.includes('kesar')) return '/images/saffron-threads-macro.jpg'
  if (id.includes('makhana')) return '/images/makhana-pouch-250g.webp'
  if (id.includes('cashew')) return '/images/cashews-w180-macro.jpg'
  return '/images/almonds-pouch-250g.webp'
}

export default function B2BCatalogPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [inspectedCommodity, setInspectedCommodity] = useState<B2BCommodity | null>(null)
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const categories = ['All', 'Tree Nuts', 'Saffron', 'Makhana', 'Dried Fruits']

  const filteredCommodities = B2B_COMMODITIES.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>📦</span> B2B INDUSTRIAL INGREDIENT CATALOGUE
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
            Commercial Wholesale Commodities
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Live wholesale rates across tree nuts, GI-tagged Kashmiri saffron, Mithila makhana, and dried fruits. Cleaned, machine-graded, and moisture-controlled for industrial production with digital Lot Quality Passports.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commodity, origin, grade..."
              className="px-4 py-2.5 pl-9 rounded-xl border border-stone-300 text-xs sm:text-sm w-full sm:w-64 focus:ring-2 focus:ring-[#176B68] outline-none bg-white font-medium"
            />
            <span className="absolute left-3 top-2.5 text-stone-400 text-sm">🔍</span>
          </div>

          <Link
            href="/b2b/rfq"
            className="px-5 py-2.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>⚡ Open RFQ Terminal</span>
          </Link>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold transition-all border ${
              activeCategory === cat
                ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Commodity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommodities.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
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
                      <span>HSN: {item.hsnCode}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded flex-shrink-0">
                  MOQ {item.moqKg} kg
                </span>
              </div>

              {/* Verified Supplier & Price Confidence Badge */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200 text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{item.priceConfidence?.status || 'Confirmed Spot Rate'}</span>
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Checked {item.priceConfidence?.lastConfirmedHoursAgo || 2}h ago
                  </span>
                </div>

                {item.supplier && (
                  <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-stone-200 text-[11px] flex justify-between items-center">
                    <span className="font-semibold text-stone-800">{item.supplier.name}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      ✓ {item.supplier.physicalAuditStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Spec Overview */}
              <div className="p-3.5 bg-[#FAF6EE] rounded-2xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Quality Spec:</span>
                  <span className="font-semibold text-stone-800 text-right">{item.grade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Moisture Control:</span>
                  <span className="font-semibold text-stone-800">{item.moisture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Processing Cuts:</span>
                  <span className="font-semibold text-stone-800 text-right">{item.cuts.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Fulfillment Hub:</span>
                  <span className="font-semibold text-[#176B68]">{item.dispatchHub}</span>
                </div>
              </div>

              {/* Tier Pricing Matrix */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#704B32] tracking-wider block">
                  Wholesale Volume Ladders:
                </span>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-600">{item.tierPrices.tier1.label}</span>
                  <strong className="text-[#17233B]">₹{item.tierPrices.tier1.pricePerKg.toLocaleString('en-IN')}/kg</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100 bg-emerald-50/50 px-1 rounded">
                  <span className="text-emerald-900 font-medium">{item.tierPrices.tier2.label}</span>
                  <strong className="text-emerald-800">
                    ₹{item.tierPrices.tier2.pricePerKg.toLocaleString('en-IN')}/kg
                    <span className="text-[10px] font-bold ml-1 text-emerald-600">(-{item.tierPrices.tier2.savingsPercent}%)</span>
                  </strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100 bg-emerald-50 px-1 rounded">
                  <span className="text-emerald-950 font-bold">{item.tierPrices.tier3.label}</span>
                  <strong className="text-emerald-900">
                    ₹{item.tierPrices.tier3.pricePerKg.toLocaleString('en-IN')}/kg
                    <span className="text-[10px] font-bold ml-1 text-emerald-600">(-{item.tierPrices.tier3.savingsPercent}%)</span>
                  </strong>
                </div>
                <div className="flex justify-between items-center py-1 bg-amber-50 px-1 rounded">
                  <span className="text-amber-950 font-bold">{item.tierPrices.container.label}</span>
                  <strong className="text-amber-900">
                    ₹{item.tierPrices.container.pricePerKg.toLocaleString('en-IN')}/kg
                    <span className="text-[10px] font-bold ml-1 text-[#704B32]">(-{item.tierPrices.container.savingsPercent}%)</span>
                  </strong>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex gap-2">
                <Link
                  href={`/b2b/rfq?commodity=${item.id}`}
                  className="flex-1 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider transition-colors text-center"
                >
                  Configure RFQ
                </Link>
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
                  `Hello Nuty Tales B2B! I would like to request a 500g Commercial Sample Kit & Specification Sheet for: ${item.name} (${item.code}).`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-center transition-colors text-[11px]"
              >
                Request 500g Sample Kit
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Immediate Cashflow: 5kg Quality Pack & Proforma Wire Desk */}
      <CommercialSampleDesk />

      {/* Quality Passport Modal */}
      <QualityPassportModal
        commodity={inspectedCommodity}
        onClose={() => setInspectedCommodity(null)}
      />
    </div>
  )
}
