'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  PARTNER_TYPE_META,
  PartnerType,
  PartnerApplication,
} from '@/lib/seller-partner-system'
import { trackRevenueEvent } from '@/lib/revenue-os'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function PartnerPortalPage() {
  const [selectedType, setSelectedType] = useState<PartnerType>('farmer')
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: 'India',
    city: '',
    address: '',
    websiteOrCatalog: '',
    taxId: '',
    fssaiNumber: '',
    annualTurnover: '',
    certifications: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedApp, setSubmittedApp] = useState<PartnerApplication | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const activeMeta = PARTNER_TYPE_META[selectedType]
  const supportPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          partnerType: selectedType,
          craftCertifications: formData.certifications
            ? formData.certifications.split(',').map((s) => s.trim())
            : [],
        }),
      })

      const data = await res.json()
      if (data.success && data.application) {
        setSubmittedApp(data.application)
        // Fire Revenue OS telemetry event
        trackRevenueEvent({
          type: 'PARTNER_SIGNUP',
          vertical: activeMeta.verticals[0] || 'business',
          countryCode: formData.country === 'India' ? 'IN' : 'AE',
          currency: 'INR',
          valueINR: 50000,
          commissionINR: 50000 * (activeMeta.commissionPercent / 100),
          metadata: {
            partnerType: selectedType,
            businessName: formData.businessName,
            partnerId: data.application.id,
          },
        })
      } else {
        setErrorMsg(data.error || 'Failed to submit application. Please verify details.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Network error. Please try again or connect directly via WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B] pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ── Top Hero / Breadcrumbs ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold tracking-wider uppercase text-[#17233B]">
            <span>🌐</span> Nuty Tales Global Supply Network
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
            Sell &amp; Partner with Nuty Tales
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Connect directly with high-net-worth individual buyers, corporate procurement desks, luxury hotels, and international patrons across 8 global markets.
          </p>
        </div>

        {/* ── Value Pillars ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: '🌍',
              title: 'Global Export & Reach',
              desc: 'Sell to clients in India, UAE, UK, USA, Europe, Canada, Australia & Singapore without complex overseas setups.',
            },
            {
              icon: '💎',
              title: 'Zero Hidden Fees',
              desc: 'Fair transparent take-rates starting from 4.5% for bulk sourcing to 14% for boutique hotel bookings.',
            },
            {
              icon: '⚡',
              title: 'Fast Bi-Weekly Payouts',
              desc: 'Prompt direct bank settlements with automated tax reconciliation, e-invoicing, and escrow protection.',
            },
            {
              icon: '🛡️',
              title: 'Authenticity Verification',
              desc: 'Official badges for GI-Tagged Saffron, Silk Mark Pashmina, FSSAI certified cold-storage, and licensed DMCs.',
            },
          ].map((pillar, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-2">
              <span className="text-2xl">{pillar.icon}</span>
              <h2 className="font-bold text-sm text-[#17233B]">{pillar.title}</h2>
              <p className="text-xs text-stone-500 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Submission Area or Success Confirmation ── */}
        {submittedApp ? (
          <div className="bg-white border-2 border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Application Received</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                Welcome to Nuty Tales, {submittedApp.businessName}
              </h2>
              <p className="text-sm text-stone-600">
                Application Reference ID: <strong className="font-mono text-[#17233B]">{submittedApp.id}</strong>
              </p>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed">
              Our Vendor Onboarding &amp; Quality Verification Team has received your details. We review FSSAI licenses, GI credentials, and commercial terms within 24 to 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href={`https://wa.me/${supportPhone}?text=${encodeURIComponent(
                  `Hi Nuty Tales team, I just submitted partner application ${submittedApp.id} for ${submittedApp.businessName}. Please review my verification.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow hover:bg-[#20b858] transition"
              >
                <span>💬</span> Connect on WhatsApp Now
              </a>
              <button
                onClick={() => setSubmittedApp(null)}
                className="w-full sm:w-auto px-6 py-3 bg-stone-100 text-stone-700 rounded-xl text-sm font-semibold hover:bg-stone-200 transition"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-3xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Vertical & Category Selector */}
            <div className="lg:col-span-5 bg-stone-50/70 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-stone-200 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Step 1 of 2</span>
                <h2 className="text-lg font-bold text-[#17233B]">Select Your Partner Category</h2>
                <p className="text-xs text-stone-500 mt-1">Choose the vertical that best describes your supply operation.</p>
              </div>

              <div className="space-y-2">
                {(Object.keys(PARTNER_TYPE_META) as PartnerType[]).map((key) => {
                  const item = PARTNER_TYPE_META[key]
                  const isSelected = selectedType === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedType(key)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-[#17233B] text-white border-[#17233B] shadow-md'
                          : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-xs truncate">{item.title}</p>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-amber-400 text-stone-900' : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {item.commissionPercent}% Take-rate
                          </span>
                        </div>
                        <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                          {item.subtitle}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Category Terms Box */}
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">{activeMeta.badge} Terms</span>
                  <span className="text-xs font-bold text-amber-900">{activeMeta.commissionPercent}% Standard Commission</span>
                </div>
                <div className="text-[11px] text-amber-800 space-y-1">
                  <p className="font-medium">Verification Documents Required:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600">
                    {activeMeta.kycRequirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Step 2 of 2</span>
                <h2 className="text-lg font-bold text-[#17233B]">
                  Register {activeMeta.title} Profile
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Provide your business credentials to begin the verification and contract onboarding.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Business / Entity Legal Name *</label>
                    <input
                      required
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="e.g. Shalimar Agro Orchards LLP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Authorized Contact Person *</label>
                    <input
                      required
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="e.g. Tariq Ahmad"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Work Email *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="partner@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Primary Phone *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Operating Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B] bg-white"
                    >
                      <option value="India">India</option>
                      <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="United States">United States (USA)</option>
                      <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Singapore">Singapore</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">City / Operating Hub</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Srinagar, Dubai, Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Operating / Facility Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Factory, processing shed, boutique hotel address, or workshop location"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Tax ID / GSTIN / VAT / TRN</label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="GSTIN, UAE TRN, or VAT ID"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      {selectedType === 'farmer' || selectedType === 'wholesaler' ? 'FSSAI License Number' : 'Website / Portfolio Link'}
                    </label>
                    <input
                      type="text"
                      name={selectedType === 'farmer' || selectedType === 'wholesaler' ? 'fssaiNumber' : 'websiteOrCatalog'}
                      value={selectedType === 'farmer' || selectedType === 'wholesaler' ? formData.fssaiNumber : formData.websiteOrCatalog}
                      onChange={handleChange}
                      placeholder={selectedType === 'farmer' || selectedType === 'wholesaler' ? '14-digit FSSAI number' : 'https://...'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Certifications / GI Tags / Accreditations</label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="e.g. Kashmir Saffron GI-535, Silk Mark Pashmina, Tourism Dept Grade A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#17233B] text-white font-bold text-sm hover:bg-[#203050] transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin text-base">⏳</span>
                        <span>Verifying &amp; Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Partner Application</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-stone-400 mt-2">
                    By submitting, you agree to Nuty Tales Marketplace Master Vendor Terms and Standard SLA Protocols.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Direct Desk Footer ── */}
        <div className="bg-[#17233B] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#C9A45C]">
              Institutional Sourcing or Urgent Bulk Alliance?
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
              Connect with our Global Supply Desk for immediate contract farming agreements, multi-ton saffron allocation, or 5-star hotel procurement.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${supportPhone}?text=${encodeURIComponent(
                'Hi Nuty Tales team, I want to discuss a strategic vendor / supplier alliance.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#d6b26d] transition"
            >
              Contact Alliance Desk
            </a>
            <Link
              href="/b2b"
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
            >
              Explore B2B
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
