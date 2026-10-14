'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  getStoredQuotes,
  getStoredRfqs,
  saveStoredPurchaseOrder,
  QuotationRecord,
  RFQRecord,
  PurchaseOrderRecord,
} from '@/lib/b2b-procurement-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BQuotesPage() {
  const [quotes, setQuotes] = useState<QuotationRecord[]>([])
  const [rfqs, setRfqs] = useState<RFQRecord[]>([])
  const [selectedRfqId, setSelectedRfqId] = useState<string>('all')
  const [acceptedPoMsg, setAcceptedPoMsg] = useState<string | null>(null)
  const [detailQuote, setDetailQuote] = useState<QuotationRecord | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setQuotes(getStoredQuotes())
    setRfqs(getStoredRfqs())
  }, [])

  const filteredQuotes = useMemo(() => {
    if (selectedRfqId === 'all') return quotes
    return quotes.filter((q) => q.rfqId === selectedRfqId)
  }, [quotes, selectedRfqId])

  // Accept Quote and Generate PO
  const handleAcceptQuote = (quote: QuotationRecord) => {
    const poNumber = `NT-PO-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const newPO: PurchaseOrderRecord = {
      id: `po-${Date.now()}`,
      poNumber,
      rfqNumber: quote.rfqNumber,
      quoteId: quote.id,
      supplierId: quote.supplierId,
      supplierName: quote.supplierName,
      supplierLocation: quote.supplierLocation,
      orderDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      deliveryDeadline: quote.validUntil,
      destination: quote.destinationHub,
      status: 'ACKNOWLEDGED',
      items: [
        {
          name: `${quote.commodityName} (${quote.cut})`,
          quantityKg: quote.quantityKg,
          unitRate: quote.exHubRatePerKg,
          total: quote.subtotal,
        },
      ],
      subtotal: quote.subtotal,
      freightAmount: quote.freightTotal,
      gstAmount: quote.gstTotal,
      totalAmount: quote.totalAmount,
      paymentStatus: 'NET_30_PENDING',
      paymentTerms: quote.paymentTerms,
      carrierName: 'Nuty Tales Cold-Chain Logistics Hub',
      trackingNumber: `TRK-PO-${poNumber.slice(-4)}`,
      reeferTempCelcius: 15.8,
      etaDays: quote.leadTimeDays,
      invoiceNumber: `NT-INV-${poNumber.slice(-4)}`,
    }

    saveStoredPurchaseOrder(newPO)
    setAcceptedPoMsg(`Purchase Order ${poNumber} created and dispatched to ${quote.supplierName}!`)
    setTimeout(() => setAcceptedPoMsg(null), 8000)
  }

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
            <Link href="/b2b/dashboard" className="hover:text-stone-900">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-stone-900 font-bold">Quote Comparison</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Quotation Comparison &amp; Landed Bids
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Commercial side-by-side analysis of verified supplier quotes, landed freight, and payment terms
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/b2b/rfq"
            className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>+</span>
            <span>Create New RFQ</span>
          </Link>
        </div>
      </div>

      {acceptedPoMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-950 rounded-2xl border border-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <span className="font-bold">{acceptedPoMsg}</span>
          </div>
          <Link
            href="/b2b/orders"
            className="font-bold text-[#176B68] hover:underline uppercase text-[11px]"
          >
            View in Purchase Orders →
          </Link>
        </div>
      )}

      {/* ── RFQ Filter Pills ──────────────────────────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-700">Filter by RFQ Package:</span>
          <select
            value={selectedRfqId}
            onChange={(e) => setSelectedRfqId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-stone-50 font-semibold text-stone-900 outline-none focus:ring-2 focus:ring-[#176B68]"
          >
            <option value="all">All Active RFQs ({quotes.length} Bids)</option>
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>
                {r.rfqNumber} — {r.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-stone-500 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span>✓</span> NABL COA Required
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span>✓</span> Net-30 Invoicing
          </span>
          <span>•</span>
          <span>FSSAI Central Lic. {FSSAI_NUMBER}</span>
        </div>
      </div>

      {/* ── Side-by-Side Quotation Comparison Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredQuotes.map((q) => {
          const isExpiringSoon = q.validUntil.includes('17') || q.validUntil.includes('18')

          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6 text-xs"
            >
              <div className="space-y-4">
                {/* Header: Quote ID & Status */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-500">
                    {q.quoteNumber}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                      isExpiringSoon
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    Valid until {q.validUntil}
                  </span>
                </div>

                {/* Supplier Identity */}
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                    {q.supplierName}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span>📍 {q.supplierLocation}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">★ {q.supplierRating}</span>
                  </div>
                </div>

                {/* Landed Unit Cost Callout */}
                <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-stone-200 text-center space-y-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                    Delivered Landed Cost (All-Inclusive)
                  </span>
                  <div className="font-serif text-3xl font-extrabold text-[#17233B]">
                    ₹{q.netLandedPerKg.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-stone-500"> / kg</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block">
                    Includes Packaging + Freight + 5% GST (Input Credit)
                  </span>
                </div>

                {/* Commercial Cost Breakdown */}
                <div className="space-y-2 border-t border-stone-100 pt-3 text-stone-600">
                  <div className="flex justify-between">
                    <span>Ex-Hub Rate:</span>
                    <strong className="text-stone-900">₹{q.exHubRatePerKg}/kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Volume:</span>
                    <strong className="text-stone-900">{q.quantityKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <strong className="text-stone-900">₹{q.subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Insured Freight to {q.destinationHub.split('/')[0].trim()}:</span>
                    <strong className="text-stone-900">₹{q.freightTotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5% 100% Tax Deductible):</span>
                    <strong className="text-stone-900">₹{q.gstTotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-1.5 text-sm">
                    <span>Total Purchase Order:</span>
                    <span className="text-[#17233B]">₹{q.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Commercial Terms & SLA */}
                <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 border border-stone-200 text-[11px] text-stone-700">
                  <div>
                    <span className="text-stone-500 block">Dispatch SLA:</span>
                    <strong className="text-stone-900">{q.leadTimeDays} Business Days</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Payment Terms:</span>
                    <span className="font-semibold text-stone-900">{q.paymentTerms}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Lab Certificate:</span>
                    <span className="text-emerald-700 font-bold">✓ NABL Batch COA Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleAcceptQuote(q)}
                  className="w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors shadow-xs"
                >
                  Accept Quote &amp; Issue PO
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailQuote(q)}
                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-center transition-colors text-[11px]"
                  >
                    View Breakdown
                  </button>
                  <a
                    href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                      `Hello Nuty Tales Sourcing Desk! I am reviewing Quote ${q.quoteNumber} from ${q.supplierName} for ${q.commodityName} (${q.quantityKg} kg). Let's finalize proforma terms.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-[11px] border border-emerald-200"
                  >
                    Negotiate
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Quote Detail Modal ────────────────────────────────────────────────── */}
      {detailQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="p-6 bg-[#17233B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                  Commercial Proforma Breakdown
                </span>
                <h3 className="font-serif text-xl font-bold">{detailQuote.quoteNumber}</h3>
                <span className="text-[11px] text-stone-300">{detailQuote.supplierName}</span>
              </div>
              <button
                onClick={() => setDetailQuote(null)}
                className="text-stone-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-stone-700">
              <div className="space-y-2 border-b border-stone-200 pb-3">
                <div className="flex justify-between">
                  <span>Commodity:</span>
                  <strong className="text-stone-900">{detailQuote.commodityName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Mechanical Cut / Form:</span>
                  <strong className="text-stone-900">{detailQuote.cut}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Spec:</span>
                  <strong className="text-stone-900">{detailQuote.packaging}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Destination:</span>
                  <strong className="text-stone-900">{detailQuote.destinationHub}</strong>
                </div>
              </div>

              <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Net Landed Unit Rate:</span>
                  <strong className="text-stone-900 text-sm">₹{detailQuote.netLandedPerKg} / kg</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Commercial Invoice:</span>
                  <strong className="text-[#17233B] text-sm">₹{detailQuote.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  handleAcceptQuote(detailQuote)
                  setDetailQuote(null)
                }}
                className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-[11px]"
              >
                Accept &amp; Generate PO
              </button>
              <button
                type="button"
                onClick={() => setDetailQuote(null)}
                className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
