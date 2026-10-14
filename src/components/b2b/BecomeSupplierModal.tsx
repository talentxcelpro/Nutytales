'use client'

import React, { useState } from 'react'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface BecomeSupplierModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function BecomeSupplierModal({
  isOpen,
  onClose,
}: BecomeSupplierModalProps) {
  const [legalName, setLegalName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [supplierType, setSupplierType] = useState('Direct Grower Co-operative')
  const [commodities, setCommodities] = useState('')
  const [location, setLocation] = useState('')
  const [fssai, setFssai] = useState('')
  const [gstin, setGstin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || 'Prospective Supplier',
          email,
          phone,
          businessName: legalName,
          city: location,
          message: `[Supplier Onboarding Application] Entity: ${legalName} | Type: ${supplierType} | Commodities: ${commodities} | FSSAI: ${fssai} | GSTIN: ${gstin} | Hub: ${location}`,
          source: 'supplier-verification-portal',
        }),
      })

      const data = await res.json()
      if (res.ok && data.success && data.result?.success !== false) {
        setIsSuccess(true)
      } else {
        setErrorMsg(data.error || 'Failed to submit application. Please contact WhatsApp.')
      }
    } catch {
      setErrorMsg('Network error. You can also contact our supplier desk on WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#17233B] text-white p-6 sm:p-8 border-b border-[#C9A45C]/30 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-stone-400 hover:text-white text-xl font-bold p-1 rounded-full hover:bg-white/10 w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-bold uppercase tracking-widest mb-2">
            <span>🤝</span> NUTY TALES VERIFIED SUPPLIER NETWORK
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Apply to Become a Verified Origin Supplier
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1 max-w-lg leading-relaxed">
            Supply directly to commercial bakeries, FMCG brands, and export buyers without middleman brokerage. We require verifiable FSSAI credentials, GSTIN compliance, and physical facility audit.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-stone-700">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-900 mb-1">Legal Entity / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="e.g. Kashmir Valley Agri Farmers Co-op"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">Authorized Representative *</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Mohammad Shafi"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">Direct Phone / WhatsApp *</label>
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
                  <label className="block font-bold text-stone-900 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sales@coop.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">Supplier Type</label>
                  <select
                    value={supplierType}
                    onChange={(e) => setSupplierType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-white"
                  >
                    <option value="Direct Grower Co-operative">Direct Grower Co-operative</option>
                    <option value="Primary Processing Plant">Primary Processing / Shelling Plant</option>
                    <option value="Direct Importer / Port Terminal">Direct Importer / Port Terminal</option>
                    <option value="Cold Storage & Aggregator">Cold Storage &amp; Regional Aggregator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">Facility Hub Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pulwama / Darbhanga / JNPT"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">FSSAI License Number *</label>
                  <input
                    type="text"
                    required
                    value={fssai}
                    onChange={(e) => setFssai(e.target.value)}
                    placeholder="14-digit FSSAI Number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-900 mb-1">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="15-character GSTIN"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-900 mb-1">Commodities &amp; Annual Capacity:</label>
                <input
                  type="text"
                  required
                  value={commodities}
                  onChange={(e) => setCommodities(e.target.value)}
                  placeholder="e.g. Kashmiri Walnuts (150 MT), Kagzi Almonds (80 MT)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-stone-600 leading-relaxed border border-stone-200">
                ⚠️ <strong>Supplier Audit Notice:</strong> All listed partners undergo physical inspection of processing facilities, moisture control checks, and mandatory NABL batch laboratory testing prior to commercial lot dispatch.
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs border border-red-200">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Application...' : 'Submit Supplier Verification Application'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 animate-fadeIn text-center">
              <span className="text-4xl block">🌾</span>
              <h3 className="font-serif text-2xl font-bold text-emerald-900">
                Supplier Application Received!
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you for applying to the Nuty Tales Supplier Network. Our origin verification desk will verify your FSSAI and GSTIN records and schedule a physical facility audit.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-xs uppercase"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
