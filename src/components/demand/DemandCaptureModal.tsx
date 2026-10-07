'use client'

import React, { useState } from 'react'
import { PlatformVertical, SUPPORTED_CURRENCIES } from '@/lib/platform-core'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface DemandCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  defaultVertical?: PlatformVertical
  defaultItem?: string
  title?: string
  subtitle?: string
}

export default function DemandCaptureModal({
  isOpen,
  onClose,
  defaultVertical = 'discovery',
  defaultItem = '',
  title = 'Get Me A Commercial Quote',
  subtitle = 'Tell us what you need. Our commercial desk structures institutional pricing, bespoke sourcing, and lab analysis within 4 hours.',
}: DemandCaptureModalProps) {
  const [vertical, setVertical] = useState<PlatformVertical>(defaultVertical)
  const [itemOrService, setItemOrService] = useState(defaultItem)
  const [quantity, setQuantity] = useState('')
  const [budget, setBudget] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [customerName, setCustomerName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [requiredDate, setRequiredDate] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type:
            vertical === 'business'
              ? 'b2b_rfq'
              : vertical === 'gifting'
              ? 'corporate_gifting'
              : vertical === 'weddings'
              ? 'wedding_inquiry'
              : vertical === 'stays'
              ? 'hotel_booking'
              : vertical === 'travel'
              ? 'travel_tour'
              : 'sourcing_request',
          vertical,
          customerName,
          companyName,
          customerPhone,
          customerEmail,
          itemOrService,
          quantity,
          budget: Number(budget) || undefined,
          currency,
          deliveryCity,
          requiredDate,
          notes,
          source: `modal-cta:${vertical}`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setResultId(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to register request. Please connect on WhatsApp.')
      }
    } catch {
      setErrorMsg('Network error. Please connect directly on WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales Commercial Desk! 🌟\n\nI want a custom commercial quote:\n• Vertical: ${vertical.toUpperCase()}\n• Requirement: ${itemOrService}\n• Quantity: ${quantity || 'As required'}\n• Budget: ${budget ? `${budget} ${currency}` : 'Flexible'}\n• Destination: ${deliveryCity || 'India'}\n• Name/Org: ${customerName} (${companyName || 'Corporate Client'})\n\nPlease share the formal quotation!`,
  )}`

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF6EE] text-[#17233B] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#C9A45C]/40 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#17233B] text-white p-6 sm:p-8 flex items-start justify-between border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
              <span>⚡</span> INSTANT COMMERCIAL SOURCING
            </div>
            <h2 className="font-serif text-2xl font-bold">{title}</h2>
            <p className="text-xs text-stone-300 font-light leading-relaxed max-w-lg">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-xs space-y-5">
          {!resultId ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select Sector / Vertical *</label>
                  <select
                    value={vertical}
                    onChange={(e) => setVertical(e.target.value as PlatformVertical)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-[#17233B] focus:ring-2 focus:ring-[#176B68] outline-none"
                  >
                    <option value="business">Business Supply &amp; Raw Ingredients (B2B)</option>
                    <option value="gifting">Corporate &amp; Festival Gifting Hampers</option>
                    <option value="weddings">Wedding Favours &amp; Vendor Services</option>
                    <option value="crafts">Kashmiri Crafts &amp; Heritage Fashion</option>
                    <option value="stays">Hotels, Resorts &amp; Private Stays</option>
                    <option value="travel">Travel Tours &amp; Luxury Experiences</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">What do you need? *</label>
                  <input
                    type="text"
                    required
                    value={itemOrService}
                    onChange={(e) => setItemOrService(e.target.value)}
                    placeholder="e.g. 500kg Sliced Almonds / 200 Diwali Hampers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity Needed</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 500 kg / 250 boxes / 6 rooms"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Budget &amp; Currency</label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-2.5 py-2.5 rounded-xl border border-stone-300 bg-white font-bold text-[#17233B] focus:ring-2 focus:ring-[#176B68] outline-none"
                    >
                      {Object.keys(SUPPORTED_CURRENCIES).map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 350000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Royal Confectionery Pvt Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="procurement@company.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Delivery Destination / City</label>
                  <input
                    type="text"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="e.g. Delhi NCR / Dubai / London"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Special Specifications / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention any custom branding, packaging preferences, or specific quality cut..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering Opportunity...' : '⚡ Submit Commercial Sourcing Request'}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <span>→</span>
                </a>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200">
                  ⚠️ {errorMsg}
                </div>
              )}
            </form>
          ) : (
            /* Authentic Opportunity Registered Confirmation */
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4 animate-fadeIn text-emerald-950">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-emerald-900">
                    Commercial Sourcing Opportunity Registered!
                  </h3>
                  <span className="font-mono text-xs font-bold text-emerald-800">
                    Ref ID: {resultId}
                  </span>
                </div>
              </div>

              <p className="leading-relaxed">
                Thank you, <strong>{customerName}</strong>. Your request for <strong>{itemOrService}</strong> has been logged in Nutty Tales&apos; Sales Command Center.
              </p>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-1 text-xs">
                <div>Assigned Desk: <strong>Senior Commercial Trade &amp; Accounts</strong></div>
                <div>Target Destination: <strong>{deliveryCity || 'PAN-India'}</strong></div>
                <div>Guaranteed Turnaround: <strong>Formal proforma quote within 4 business hours</strong></div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#17233B] text-white rounded-xl font-bold uppercase text-[11px] tracking-wider"
                >
                  Done
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold uppercase text-[11px] tracking-wider"
                >
                  Open WhatsApp Thread
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
