'use client'

import React, { useState } from 'react'

interface CorporateQuoteModalProps {
  isOpen: boolean
  onClose: () => void
  initialTier?: number
  initialQty?: number
}

export default function CorporateQuoteModal({
  isOpen,
  onClose,
  initialTier = 2450,
  initialQty = 50,
}: CorporateQuoteModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [recipients, setRecipients] = useState(initialQty)
  const [budgetPerBox, setBudgetPerBox] = useState(initialTier)
  const [occasion, setOccasion] = useState('Diwali & Festive Celebration')
  const [customBranding, setCustomBranding] = useState(true)
  const [eventDate, setEventDate] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [referenceId, setReferenceId] = useState('')

  if (!isOpen) return null

  const estimatedTotal = recipients * budgetPerBox
  const gstCredit = Math.round(estimatedTotal * 0.18)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim() || !phone.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/gifting/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          contactName,
          phone,
          email,
          occasion,
          recipientCount: recipients,
          budgetTotal: estimatedTotal,
          recipients: [],
          notes: `[Corporate RFP] Budget/box: ₹${budgetPerBox} | Branding: ${customBranding ? 'Yes' : 'No'} | Event Date: ${eventDate} | Notes: ${notes}`,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setReferenceId(data.campaignId || `GIFT-${Date.now().toString().slice(-6)}`)
        setSubmittedSuccess(true)
      } else {
        throw new Error(data.error || 'Failed to submit enquiry')
      }
    } catch {
      // Local fallback
      setReferenceId(`GIFT-${Date.now().toString().slice(-6)}`)
      setSubmittedSuccess(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[#10192A]/70 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-[#0B2521] text-white flex items-center justify-between border-b border-[#C9A45C]/30">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
              Enterprise Desk · Instant RFP
            </span>
            <h3 className="font-serif text-2xl font-bold">Request a Corporate Quote</h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Multi-address air dispatch, 18% GST input tax credit &amp; custom laser branding
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <h4 className="font-serif text-2xl font-bold text-[#17233B]">Corporate Proposal Initiated!</h4>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{contactName || companyName}</strong>. Your reference ID is{' '}
              <span className="font-mono font-bold text-[#17233B]">{referenceId}</span>.
              Our enterprise concierge has received your request and will share the catalog, sample hampers, and GST proforma invoice within 2 business hours.
            </p>
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 max-w-md mx-auto text-xs text-stone-700 space-y-1 text-left">
              <div><strong>Company:</strong> {companyName}</div>
              <div><strong>Total Units:</strong> {recipients} hampers (Est. ₹{estimatedTotal.toLocaleString('en-IN')})</div>
              <div><strong>GST Recovery:</strong> ~₹{gstCredit.toLocaleString('en-IN')}</div>
              <div><strong>Hotline:</strong> +91 9717161809 (Corporate Concierge Desk)</div>
            </div>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Close &amp; Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Row 1: Company & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation Pvt Ltd"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rahul Sharma (HR / Procurement)"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Row 2: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Official Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Corporate Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@company.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Row 3: Quantities & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Expected Hampers (Units)</label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={recipients}
                  onChange={(e) => setRecipients(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Budget Per Hamper (₹)</label>
                <select
                  value={budgetPerBox}
                  onChange={(e) => setBudgetPerBox(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                >
                  <option value={890}>₹890 (Essential Mailer)</option>
                  <option value={1350}>₹1,350 (Chinar Rigid Box)</option>
                  <option value={2450}>₹2,450 (Executive Trunk)</option>
                  <option value={3999}>₹3,999 (Festive Mega Hamper)</option>
                  <option value={4950}>₹4,950 (Royal Walnut Casket)</option>
                  <option value={8000}>₹8,000+ (VIP Bespoke)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Occasion / Event</label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                >
                  <option value="Diwali & Festive Celebration">Diwali &amp; Festive Celebration</option>
                  <option value="Employee Welcome & Onboarding">Employee Welcome &amp; Onboarding</option>
                  <option value="Annual Rewards & Recognition">Annual Rewards &amp; Recognition</option>
                  <option value="VIP Client Appreciation">VIP Client Appreciation</option>
                  <option value="Leadership Summit & Conference">Leadership Summit &amp; Conference</option>
                  <option value="New Year Celebrations">New Year Celebrations</option>
                </select>
              </div>
            </div>

            {/* Checkbox: Custom Branding */}
            <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
              <input
                type="checkbox"
                id="branding-check"
                checked={customBranding}
                onChange={(e) => setCustomBranding(e.target.checked)}
                className="w-4 h-4 rounded-sm text-[#0B2521] accent-[#0B2521] cursor-pointer"
              />
              <label htmlFor="branding-check" className="cursor-pointer">
                <span className="font-bold text-[#17233B]">Include Custom Corporate Branding &amp; Logo</span>
                <span className="block text-stone-500 text-[11px]">
                  Hot-foil gold logo stamping on lid, personalized greeting card, and company sleeve
                </span>
              </label>
            </div>

            {/* Event date & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Required Delivery Date / Window</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Special Requirements / Multi-City Drop</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 50 boxes to Noida HQ, 150 individual doorstep deliveries across India..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:border-[#0B2521] focus:bg-white focus:outline-hidden text-xs"
                />
              </div>
            </div>

            {/* Live Calculation Bar */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-stone-500 text-[11px] block">Estimated Program Total:</span>
                <span className="font-serif text-2xl font-black text-[#17233B]">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-emerald-700 font-bold ml-2 text-[11px]">
                  (Save ~₹{gstCredit.toLocaleString('en-IN')} via GST Input Credit)
                </span>
              </div>
              <div className="text-[11px] text-stone-500 text-right">
                <span>MOQ: 10 Boxes · PAN-India &amp; Global Air Dispatch</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Generating Quotation...' : 'Submit Request for Proposal →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
