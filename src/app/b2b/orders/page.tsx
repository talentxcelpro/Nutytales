'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BOrdersPage() {
  const [poNumber, setPoNumber] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [uploadNote, setUploadNote] = useState('')
  const [poSubmitted, setPoSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const recentOrders = [
    {
      id: 'NT-PO-2026-9214',
      date: '04 Oct 2026',
      org: 'Grand Mirage Hotels & Resorts',
      items: 'W240 Jumbo Cashews (500kg) + Medjool Dates (250kg)',
      hub: 'Noida HQ Central Hub',
      carrier: 'SafeXpress Reefer Logistics',
      tracking: 'SFX-992140182-IN',
      status: 'In Transit · Delivery Tomorrow',
    },
    {
      id: 'NT-PO-2026-9201',
      date: '29 Sep 2026',
      org: 'Delight Artisan Bakery Network',
      items: 'California Almond Slices 1.0mm (1,000kg)',
      hub: 'Noida Processing Hub',
      carrier: 'GATI KWE Commercial',
      tracking: 'GAT-88120491-IN',
      status: 'Delivered · COA Accepted',
    },
  ]

  const handlePoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: companyName || 'PO Processing Officer',
          phone: contactPhone,
          businessName: companyName,
          message: `[B2B Purchase Order Submission] PO Number: ${poNumber} | Notes: ${uploadNote}`,
          source: 'business-po-upload-desk',
        }),
      })
      setPoSubmitted(true)
    } catch {
      //
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="space-y-3 border-b border-stone-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
          <span>📦</span> B2B ORDER &amp; PURCHASE ORDER (PO) DISPATCH
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
          Corporate Orders &amp; Contract Fulfilment
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Track active refrigerated cargo consignments, upload corporate Purchase Orders (POs) for Net-30 billing, and access laboratory batch dispatch documentation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Active Orders List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="font-serif font-bold text-xl text-[#17233B]">
              Active Institutional Dispatches
            </h2>

            <div className="space-y-4">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
                    <div>
                      <span className="font-mono font-bold text-[#17233B] block">{ord.id}</span>
                      <span className="text-[10px] text-stone-500">Ordered on {ord.date}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {ord.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                      Consignment Manifest:
                    </span>
                    <p className="font-semibold text-[#17233B]">{ord.items}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1">
                    <div>Fulfillment: <strong>{ord.hub}</strong></div>
                    <div>Carrier Tracking: <strong className="font-mono text-[#176B68]">{ord.tracking}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PO Upload Desk (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
              Formal Procurement Desk
            </span>
            <h2 className="font-serif font-bold text-xl text-[#17233B]">
              Submit Corporate Purchase Order (PO)
            </h2>
            <p className="text-stone-600">
              Approved corporate clients on Net-30 credit terms can directly log POs for automatic allocation.
            </p>
          </div>

          <form onSubmit={handlePoSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Radisson Blu / Bikanervala"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Internal PO Number *</label>
              <input
                type="text"
                required
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                placeholder="e.g. PO/2026/OCT/0419"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Procurement WhatsApp / Phone *</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Items &amp; Delivery Instructions</label>
              <textarea
                rows={3}
                value={uploadNote}
                onChange={(e) => setUploadNote(e.target.value)}
                placeholder="Paste PO line items, delivery deadline, or special packaging notes..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Registering PO...' : 'Submit PO for Fulfilment'}
            </button>

            {poSubmitted && (
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                ✓ PO successfully logged! Your key account manager will confirm dispatch schedule within 2 hours.
              </div>
            )}
          </form>

          <div className="pt-4 border-t border-stone-200 text-center">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                'Hello Nuty Tales B2B! Submitting a corporate Purchase Order for processing.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline"
            >
              Or send PO directly on WhatsApp (+91 9717161809) →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
