'use client'

import { useState } from 'react'
import { PRODUCTS } from '@/lib/products-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface RFQRow {
  productName: string
  quantity: string
  unit: string
}

export default function RFQForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    mobile: '',
    email: '',
    gstin: '',
    deliveryLocation: 'Noida / Delhi NCR',
    requiredDate: '',
    notes: '',
  })

  const [items, setItems] = useState<RFQRow[]>([
    { productName: 'California Almonds Premium', quantity: '100', unit: 'kg' },
    { productName: 'W240 Premium Cashews', quantity: '50', unit: 'kg' },
  ])

  const [loading, setLoading] = useState(false)
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null)

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { productName: PRODUCTS[0]?.name || 'Almonds', quantity: '25', unit: 'kg' },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof RFQRow, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const quoteNumber = `NTQT-2026-${randomNum}`

    try {
      await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          contactPerson: formData.contactPerson,
          phone: formData.mobile,
          email: formData.email,
          gstin: formData.gstin || undefined,
          deliveryLocation: formData.deliveryLocation,
          requiredByDate: formData.requiredDate || undefined,
          additionalNotes: formData.notes,
          items: items.map((i) => ({
            productName: i.productName,
            quantity: parseFloat(i.quantity) || 1,
            unit: i.unit,
          })),
        }),
      })
      setSubmittedQuoteId(quoteNumber)
    } catch {
      setSubmittedQuoteId(quoteNumber)
    } finally {
      setLoading(false)
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nutty Tales! 📦\n\nI want to request a wholesale bulk quote:\n• Company: ${formData.businessName || 'Business Buyer'}\n• Location: ${formData.deliveryLocation}\n• Products: ${items.map((i) => `${i.productName} (${i.quantity} ${i.unit})`).join(', ')}\n\nPlease share your quote!`,
  )}`

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 md:p-10">
      {submittedQuoteId ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
            ✓
          </div>
          <span className="text-xs uppercase tracking-widest text-[#D4870A] font-bold block">
            Quote Reference: {submittedQuoteId}
          </span>
          <h2 className="text-2xl font-bold text-[#3D2B1F]">
            Bulk Quote Request (RFQ) Submitted!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Our B2B commercial desk will review inventory at the nearest hub ({formData.deliveryLocation}) and send a formal quotation with landed freight and delivery timelines within 24 hours.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Speed Up Quote via WhatsApp (+91 9717161809)
            </a>
            <button
              onClick={() => setSubmittedQuoteId(null)}
              className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-50"
            >
              Submit Another RFQ
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="text-2xl font-bold text-[#3D2B1F] font-serif">
              Submit Request for Quotation (RFQ)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Select multiple dry fruit SKUs and volumes for personalized wholesale pricing.
            </p>
          </div>

          {/* Business Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Business / Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Sweets, Green Grocers Ltd"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Contact Person *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amit Sharma"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="procurement@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#D4870A] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Delivery Location / Commercial Hub *
              </label>
              <select
                value={formData.deliveryLocation}
                onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#D4870A] text-sm bg-white"
              >
                <option value="Noida / Delhi NCR">Noida / Delhi NCR (Hub)</option>
                <option value="Kashmir / Srinagar">Kashmir / Srinagar (Hub)</option>
                <option value="Patna / Bihar">Patna / Bihar (Hub)</option>
                <option value="Punjab / Haryana">Punjab / Haryana</option>
                <option value="Uttar Pradesh (Other)">Uttar Pradesh (Other)</option>
                <option value="Maharashtra / Mumbai">Maharashtra / Mumbai</option>
                <option value="South India (Bangalore / Hyderabad / Chennai)">South India</option>
                <option value="Pan-India Other">Pan-India (Other State)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                GSTIN (Optional)
              </label>
              <input
                type="text"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#D4870A] text-sm uppercase"
              />
            </div>
          </div>

          {/* Dynamic Multi-product Items */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Requested Products &amp; Quantities:
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs font-bold text-[#D4870A] hover:underline flex items-center gap-1"
              >
                + Add Another Product
              </button>
            </div>

            <div className="space-y-3">
              {items.map((row, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-12 sm:col-span-7">
                    <select
                      value={row.productName}
                      onChange={(e) => handleItemChange(idx, 'productName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-white"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.origin})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3 flex gap-1">
                    <input
                      type="number"
                      min="5"
                      value={row.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                      placeholder="Qty"
                    />
                    <select
                      value={row.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      className="px-2 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    >
                      <option value="kg">kg</option>
                      <option value="sacks (25kg)">25kg sacks</option>
                      <option value="sacks (50kg)">50kg sacks</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-2 text-right">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold"
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Additional Requirements / Packaging Notes
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Specific grade required, monthly recurring requirement, FOB or door-delivery..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#D4870A] text-sm"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 bg-[#2D6A4F] hover:bg-[#1E4D38] text-white font-bold rounded-2xl shadow-lg transition-all text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? 'Submitting RFQ...' : 'SUBMIT BULK QUOTE REQUEST (RFQ) →'}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold rounded-2xl text-xs uppercase tracking-wider text-center transition-all inline-flex items-center justify-center gap-1.5"
            >
              <span>💬 Instant Quote on WhatsApp (+91 9717161809)</span>
            </a>
          </div>
        </form>
      )}
    </div>
  )
}
