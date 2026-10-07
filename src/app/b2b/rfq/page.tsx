'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { B2B_COMMODITIES } from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BRfqPage() {
  const [commodityId, setCommodityId] = useState(B2B_COMMODITIES[0].id)
  const [cut, setCut] = useState(B2B_COMMODITIES[0].cuts[0])
  const [packaging, setPackaging] = useState(B2B_COMMODITIES[0].packaging[0])
  const [quantityKg, setQuantityKg] = useState(250)
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [gstin, setGstin] = useState('')
  const [cityPincode, setCityPincode] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const item = useMemo(() => {
    return B2B_COMMODITIES.find((c) => c.id === commodityId) || B2B_COMMODITIES[0]
  }, [commodityId])

  // Calculation
  const quote = useMemo(() => {
    const v = quantityKg
    let rate = item.tierPrices.tier1.pricePerKg
    let tierLabel = item.tierPrices.tier1.label
    let discountPct = 0

    if (v >= item.tierPrices.container.minKg) {
      rate = item.tierPrices.container.pricePerKg
      tierLabel = item.tierPrices.container.label
      discountPct = item.tierPrices.container.savingsPercent
    } else if (v >= item.tierPrices.tier3.minKg) {
      rate = item.tierPrices.tier3.pricePerKg
      tierLabel = item.tierPrices.tier3.label
      discountPct = item.tierPrices.tier3.savingsPercent
    } else if (v >= item.tierPrices.tier2.minKg) {
      rate = item.tierPrices.tier2.pricePerKg
      tierLabel = item.tierPrices.tier2.label
      discountPct = item.tierPrices.tier2.savingsPercent
    }

    const subtotal = rate * v
    const standardTotal = item.tierPrices.tier1.pricePerKg * v
    const savings = standardTotal - subtotal
    const gst = Math.round(subtotal * (item.gstPercent / 100))
    const total = subtotal + gst

    let freight = 2500
    if (v < 100) freight = 1200
    else if (v < 500) freight = 3500
    else if (v < 2000) freight = 8000
    else freight = 15000

    const landedPerKg = Math.round((total + freight) / v)

    return { rate, tierLabel, discountPct, subtotal, savings, gst, total, freight, landedPerKg }
  }, [item, quantityKg])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || 'B2B RFQ Lead',
          email,
          phone,
          businessName: companyName,
          city: cityPincode,
          message: `[B2B Dedicated RFQ] Commodity: ${item.name} (${item.code}) | Form: ${cut} | Pack: ${packaging} | Qty: ${quantityKg} kg | GSTIN: ${gstin || 'None'} | Est. Landed: ₹${quote.landedPerKg}/kg | Subtotal: ₹${quote.subtotal} | Notes: ${notes}`,
          source: 'business-subdomain-rfq-terminal',
        }),
      })

      const data = await res.json()
      if (res.ok && data.success && data.result?.success !== false) {
        setSubmitted(true)
      } else {
        setErrorMsg(data.error || 'Failed to submit RFQ. Please reach via WhatsApp.')
      }
    } catch {
      setErrorMsg('Network error. Please try WhatsApp directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales B2B Desk! 🏭\n\nI want to submit a formal RFQ:\n• Commodity: ${item.name} (${item.code})\n• Cut: ${cut}\n• Packaging: ${packaging}\n• Quantity: ${quantityKg} kg\n• Estimated Landed Rate: ₹${quote.landedPerKg}/kg\n• Company: ${companyName || 'Corporate Client'}\n• Plant City: ${cityPincode || 'India'}\n\nPlease share the formal quotation with lab analysis sheets!`,
  )}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
          <span>📋</span> B2B BULK PROCUREMENT TERMINAL
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
          Request for Quote (RFQ) &amp; Factory Contract
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Submit customized specifications across whole raw nuts, precision slices, slivers, and vacuum packaging. Our commercial desk generates proforma invoices with NABL lab COA within 4 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* RFQ Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">
                1. Commodity &amp; Processing Parameters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select Raw Material *</label>
                  <select
                    value={commodityId}
                    onChange={(e) => {
                      setCommodityId(e.target.value)
                      const match = B2B_COMMODITIES.find((c) => c.id === e.target.value)
                      if (match) {
                        setCut(match.cuts[0] || 'Whole')
                        setPackaging(match.packaging[0] || 'Standard Box')
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs sm:text-sm font-semibold text-[#17233B] focus:ring-2 focus:ring-[#176B68] outline-none"
                  >
                    {B2B_COMMODITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.origin})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Precision Cut / Form *</label>
                  <select
                    value={cut}
                    onChange={(e) => setCut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs sm:text-sm font-semibold text-[#17233B] focus:ring-2 focus:ring-[#176B68] outline-none"
                  >
                    {item.cuts.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Packaging Barrier *</label>
                  <select
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs sm:text-sm font-semibold text-[#17233B] focus:ring-2 focus:ring-[#176B68] outline-none"
                  >
                    {item.packaging.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Order Quantity (MOQ {item.moqKg} kg) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={item.moqKg}
                      step={item.category === 'Saffron' ? 0.1 : 10}
                      value={quantityKg}
                      onChange={(e) => setQuantityKg(Number(e.target.value) || item.moqKg)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-xs sm:text-sm font-bold text-[#17233B] focus:ring-2 focus:ring-[#176B68] outline-none"
                    />
                    <span className="font-bold text-stone-500 uppercase text-xs">kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">
                2. Enterprise Billing &amp; Destination Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Amber Confectionery Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Contact Officer Name *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Vikram Singhania"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Official Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="procurement@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">GSTIN (for 18% Tax Credit)</label>
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
                  <label className="block font-semibold text-stone-700 mb-1">Delivery City &amp; Pincode *</label>
                  <input
                    type="text"
                    required
                    value={cityPincode}
                    onChange={(e) => setCityPincode(e.target.value)}
                    placeholder="e.g. Greater Noida 201306"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Customized Processing or Schedule Instructions
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Specify exact cut thickness (e.g. 1.0mm slices, zero skin), required delivery cadence (e.g. weekly 200kg dispatches)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting RFQ...' : 'Submit Formal Commercial RFQ'}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
              >
                <span>WhatsApp Procurement Desk</span>
                <span>→</span>
              </a>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs border border-red-200">
                ⚠️ {errorMsg}
              </div>
            )}

            {submitted && (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl text-xs border border-emerald-200 space-y-1">
                <p className="font-bold">✓ Official Commercial RFQ Dispatched!</p>
                <p>Our senior procurement desk has logged your volume requirement. Your proforma invoice with NABL lab certificate will arrive within 4 business hours.</p>
              </div>
            )}
          </form>
        </div>

        {/* Live Calculation Sidebar (5 cols) */}
        <div className="lg:col-span-5 bg-[#10192A] text-white rounded-3xl p-6 sm:p-8 border border-white/15 space-y-6 shadow-xl text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
              Commercial Estimate
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">
              {quote.tierLabel}
            </span>
          </div>

          <div className="space-y-3 text-stone-300">
            <div className="flex justify-between">
              <span>Item:</span>
              <strong className="text-white text-right">{item.name}</strong>
            </div>
            <div className="flex justify-between">
              <span>Cut &amp; Pack:</span>
              <span className="text-white text-right">{cut} ({packaging})</span>
            </div>
            <div className="flex justify-between">
              <span>Base Rate:</span>
              <span className="text-white">₹{quote.rate.toLocaleString('en-IN')} / kg</span>
            </div>
            {quote.discountPct > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Volume Discount:</span>
                <span>-{quote.discountPct}% (Save ₹{quote.savings.toLocaleString('en-IN')})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Volume:</span>
              <strong className="text-white">{quantityKg} kg</strong>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <strong className="text-white">₹{quote.subtotal.toLocaleString('en-IN')}</strong>
            </div>
            <div className="flex justify-between">
              <span>GST ({item.gstPercent}% Input Credit):</span>
              <span className="text-white">₹{quote.gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Insured Transit Freight:</span>
              <span className="text-white">₹{quote.freight.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
              Estimated Landed Unit Cost
            </span>
            <div className="font-serif text-3xl font-bold text-white">
              ₹{quote.landedPerKg.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-stone-300"> / kg</span>
            </div>
            <span className="text-[10px] text-emerald-400 block">
              Total Order: ₹{(quote.total + quote.freight).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3.5 bg-stone-900 rounded-xl border border-white/10 space-y-1.5 text-[11px] text-stone-400">
            <div className="flex items-center gap-2 text-white">
              <span>🛡️</span>
              <strong>FSSAI Central Lic:</strong> {FSSAI_NUMBER}
            </div>
            <p>• COA batch analysis for moisture, oil content &amp; foreign matter.</p>
            <p>• 100% replacement guarantee if cargo deviates from specification.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
