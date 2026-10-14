'use client'

import React, { useState, useMemo } from 'react'
import { B2B_COMMODITIES, B2BCommodity } from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface MultiSupplierQuoteComparisonProps {
  initialCommodityId?: string
  initialVolumeKg?: number
  initialDestination?: string
}

export default function MultiSupplierQuoteComparison({
  initialCommodityId,
  initialVolumeKg = 500,
  initialDestination = 'Delhi NCR / Noida Hub',
}: MultiSupplierQuoteComparisonProps) {
  const [selectedId, setSelectedId] = useState(initialCommodityId || B2B_COMMODITIES[1].id)
  const [volumeKg, setVolumeKg] = useState(initialVolumeKg)
  const [destination, setDestination] = useState(initialDestination)
  const [selectedCut, setSelectedCut] = useState('Standard Whole / Jumbo')
  const [lockedSupplier, setLockedSupplier] = useState<string | null>(null)

  const commodity = useMemo(() => {
    return B2B_COMMODITIES.find((c) => c.id === selectedId) || B2B_COMMODITIES[0]
  }, [selectedId])

  // Compute tier price based on volume
  const baseRate = useMemo(() => {
    const v = volumeKg
    const t = commodity.tierPrices
    if (v >= t.container.minKg) return t.container.pricePerKg
    if (v >= t.tier3.minKg) return t.tier3.pricePerKg
    if (v >= t.tier2.minKg) return t.tier2.pricePerKg
    return t.tier1.pricePerKg
  }, [commodity, volumeKg])

  // Destination freight calculation
  const freightPerKg = useMemo(() => {
    if (destination.includes('Delhi NCR') || destination.includes('Noida')) return 5
    if (destination.includes('Mumbai') || destination.includes('Pune')) return 12
    if (destination.includes('Bengaluru')) return 15
    if (destination.includes('Srinagar')) return 8
    if (destination.includes('Patna') || destination.includes('Kolkata')) return 11
    return 10
  }, [destination])

  // Generate 3 comparable quotation proposals
  const quoteProposals = useMemo(() => {
    // 1. Central Hub Dispatch (Fastest Lead Time)
    const hubRate = baseRate
    const hubFreight = freightPerKg * volumeKg
    const hubSubtotal = hubRate * volumeKg
    const hubGst = Math.round(hubSubtotal * (commodity.gstPercent / 100))
    const hubTotal = hubSubtotal + hubGst + hubFreight
    const hubLandedPerKg = Math.round(hubTotal / volumeKg)

    // 2. Direct Orchard / Farmer Origin (Lowest Landed Cost, slightly longer transit)
    const orchardRate = Math.round(baseRate * 0.94) // 6% discount direct from tree
    const orchardFreight = (freightPerKg + 3) * volumeKg // slightly higher haul distance
    const orchardSubtotal = orchardRate * volumeKg
    const orchardGst = Math.round(orchardSubtotal * (commodity.gstPercent / 100))
    const orchardTotal = orchardSubtotal + orchardGst + orchardFreight
    const orchardLandedPerKg = Math.round(orchardTotal / volumeKg)

    // 3. Export Grade Premium Specification (Highest Quality / Zero Foreign Matter)
    const exportRate = Math.round(baseRate * 1.05) // 5% premium for laser grading
    const exportFreight = (freightPerKg + 2) * volumeKg
    const exportSubtotal = exportRate * volumeKg
    const exportGst = Math.round(exportSubtotal * (commodity.gstPercent / 100))
    const exportTotal = exportSubtotal + exportGst + exportFreight
    const exportLandedPerKg = Math.round(exportTotal / volumeKg)

    return [
      {
        id: 'quote-hub',
        badge: '⚡ Fastest Delivery',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        supplierName: 'Nuty Tales Central Processing Hub',
        supplierType: 'Audited Central Fulfillment Center',
        location: 'Noida Logistics Corridor, NCR',
        leadTime: '24 - 48 Hours Dispatch',
        dispatchHub: 'Noida HQ Central Hub',
        ratePerKg: hubRate,
        landedPerKg: hubLandedPerKg,
        totalInvoice: hubTotal,
        gstCredit: hubGst,
        freight: hubFreight,
        specGrade: commodity.grade,
        paymentTerms: 'Net-30 for GSTIN verified accounts / Advance online',
        suitability: 'Immediate production replenishment & bakery lines',
      },
      {
        id: 'quote-orchard',
        badge: '💰 Lowest Landed Cost',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        supplierName: commodity.supplier?.name || 'Direct Grower Aggregation Co-op',
        supplierType: 'Direct Orchard / Wetland Aggregator',
        location: commodity.origin,
        leadTime: '4 - 6 Business Days Direct Reefer',
        dispatchHub: commodity.dispatchHub,
        ratePerKg: orchardRate,
        landedPerKg: orchardLandedPerKg,
        totalInvoice: orchardTotal,
        gstCredit: orchardGst,
        freight: orchardFreight,
        specGrade: 'Unblended Single-Harvest Lot',
        paymentTerms: '50% Advance on PO, 50% on Lorry Receipt (LR)',
        suitability: 'Wholesale distributors & forward inventory planning',
      },
      {
        id: 'quote-export',
        badge: '🏅 Grade 1 Export Spec',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        supplierName: 'Certified Export Processing Terminal',
        supplierType: 'Phytosanitary Certified Facility',
        location: 'Special Sourcing Zone (J&K / JNPT)',
        leadTime: '3 - 5 Business Days',
        dispatchHub: 'Bonded Warehouse / Reefer Hub',
        ratePerKg: exportRate,
        landedPerKg: exportLandedPerKg,
        totalInvoice: exportTotal,
        gstCredit: exportGst,
        freight: exportFreight,
        specGrade: '100% Optical Laser Sorted · Aflatoxin < 1.0 ppb',
        paymentTerms: '100% Escrow / Irrevocable Bank LC / Wire',
        suitability: 'Export importers, premium FMCG brands & institutional buyers',
      },
    ]
  }, [baseRate, freightPerKg, volumeKg, commodity])

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
          <span>⚖️</span> MULTI-SUPPLIER QUOTATION ENGINE
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17233B]">
          One RFQ. Three Verified Bids.
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Never make 10 phone calls to negotiate price. Submit your requirements once and compare transparent offers across speed, landed cost, verified quality specs, and commercial payment terms.
        </p>
      </div>

      {/* RFQ Parameters Selector Bar */}
      <div className="bg-[#FAF6EE] rounded-2xl p-4 sm:p-6 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div>
          <label className="block text-stone-700 font-bold mb-1">Select Commodity:</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#176B68]"
          >
            {B2B_COMMODITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-bold mb-1">Cut / Form:</label>
          <select
            value={selectedCut}
            onChange={(e) => setSelectedCut(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#176B68]"
          >
            {commodity.cuts.map((cut) => (
              <option key={cut} value={cut}>
                {cut}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-stone-700 font-bold mb-1">Required Quantity (kg):</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={commodity.moqKg}
              step={commodity.category === 'Saffron' ? 0.1 : 50}
              value={volumeKg}
              onChange={(e) => setVolumeKg(Number(e.target.value) || commodity.moqKg)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900 outline-none focus:ring-2 focus:ring-[#176B68]"
            />
            <span className="text-stone-500 font-bold">kg</span>
          </div>
        </div>

        <div>
          <label className="block text-stone-700 font-bold mb-1">Destination Hub:</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-900 outline-none focus:ring-2 focus:ring-[#176B68]"
          >
            <option value="Delhi NCR / Noida Hub">Delhi NCR / Noida Hub</option>
            <option value="Mumbai / Pune Industrial Corridor">Mumbai / Pune Corridor</option>
            <option value="Bengaluru / Karnataka Hub">Bengaluru / Karnataka</option>
            <option value="Srinagar / Kashmir Direct">Srinagar / Kashmir Direct</option>
            <option value="Patna / Kolkata Eastern Hub">Patna / Kolkata Hub</option>
            <option value="Ahmedabad / Gujarat Belt">Ahmedabad / Gujarat Belt</option>
          </select>
        </div>
      </div>

      {/* 3 Quotation Proposals Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quoteProposals.map((quote) => {
          const isLocked = lockedSupplier === quote.id
          const whatsappMsg = `Hello Nuty Tales B2B Desk! I want to lock in this verified quote:\n• Proposal: ${quote.supplierName} (${quote.badge})\n• Commodity: ${commodity.name}\n• Volume: ${volumeKg} kg\n• Destination: ${destination}\n• Net Landed Rate: ₹${quote.landedPerKg}/kg\n• Total Commercial Invoice: ₹${quote.totalInvoice.toLocaleString('en-IN')}\n• Payment Terms: ${quote.paymentTerms}\n\nPlease issue the formal Proforma Invoice with COA batch documents!`
          const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMsg)}`

          return (
            <div
              key={quote.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between space-y-6 transition-all ${
                isLocked
                  ? 'border-[#176B68] ring-2 ring-[#176B68] bg-emerald-50/20 shadow-lg'
                  : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                {/* Proposal Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${quote.badgeColor}`}
                  >
                    {quote.badge}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">
                    Dispatch: <strong>{quote.leadTime}</strong>
                  </span>
                </div>

                {/* Supplier Identity */}
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-[#17233B] leading-snug">
                    {quote.supplierName}
                  </h3>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                    <span>📍 {quote.location}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">✓ Verified Entity</span>
                  </div>
                </div>

                {/* Net Landed Unit Price Box */}
                <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-stone-200 text-center space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                    Estimated Net Landed Cost
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#17233B]">
                    ₹{quote.landedPerKg.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500"> / kg</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    All-inclusive (Product + Freight + GST)
                  </span>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-2 text-xs border-t border-stone-100 pt-3 text-stone-600">
                  <div className="flex justify-between">
                    <span>Ex-Hub Base Rate:</span>
                    <strong className="text-stone-900">₹{quote.ratePerKg.toLocaleString('en-IN')}/kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Freight to Destination:</span>
                    <strong className="text-stone-900">₹{quote.freight.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5% 100% Tax Credit):</span>
                    <strong className="text-stone-900">₹{quote.gstCredit.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-1.5">
                    <span>Total Order Value:</span>
                    <span>₹{quote.totalInvoice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Commercial Terms & Spec */}
                <div className="p-3 bg-stone-50 rounded-xl text-[11px] space-y-1.5 border border-stone-200 text-stone-700">
                  <div>
                    <span className="text-stone-500 block">Grade Specification:</span>
                    <span className="font-medium text-stone-900">{quote.specGrade}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Payment Terms:</span>
                    <span className="font-medium text-stone-900">{quote.paymentTerms}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Best Suited For:</span>
                    <span className="font-semibold text-[#176B68]">{quote.suitability}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-all shadow-sm"
                >
                  Lock This Quote &amp; Request Proforma
                </a>
                <button
                  type="button"
                  onClick={() => setLockedSupplier(isLocked ? null : quote.id)}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors text-center"
                >
                  {isLocked ? '✓ Selected for RFQ Package' : 'Compare Specification'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
