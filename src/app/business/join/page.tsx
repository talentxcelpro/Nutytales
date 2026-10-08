'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { BusinessType, PlatformVertical } from '@/lib/platform-core'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function BusinessJoinPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [businessType, setBusinessType] = useState<BusinessType>('bakery')
  const [country, setCountry] = useState('India')
  const [city, setCity] = useState('')
  const [legalName, setLegalName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gstin, setGstin] = useState('')
  const [fssai, setFssai] = useState('')
  const [productsServicesOverview, setProductsServicesOverview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'business_signup',
          vertical: 'business',
          customerName: displayName || legalName,
          companyName: legalName,
          customerPhone: phone,
          customerEmail: email,
          deliveryCity: city,
          itemOrService: `[Business Partner Application] Type: ${businessType} | Country: ${country} | City: ${city} | GSTIN: ${gstin || 'N/A'} | FSSAI: ${fssai || 'N/A'} | Offerings: ${productsServicesOverview}`,
          source: 'business-partner-onboarding',
        }),
      })
      setSubmitted(true)
    } catch {
      //
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>🤝</span> GLOBAL PARTNER &amp; BUSINESS ONBOARDING
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
            Grow Your Business on Nuty Tales
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Join a global network of verified hotels, commercial bakeries, travel curators, wedding planners, and artisan fashion guilds. Access corporate demand, direct buyer RFQs, and automated fulfillment.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-3 text-xs">
          <span className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-2 ${step >= 1 ? 'bg-[#17233B] text-white' : 'bg-stone-200 text-stone-600'}`}>
            <span>1</span> Business Category &amp; Country
          </span>
          <span className="text-stone-300">→</span>
          <span className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-2 ${step >= 2 ? 'bg-[#17233B] text-white' : 'bg-stone-200 text-stone-600'}`}>
            <span>2</span> Legal Entity &amp; Verification
          </span>
          <span className="text-stone-300">→</span>
          <span className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-2 ${step >= 3 ? 'bg-[#17233B] text-white' : 'bg-stone-200 text-stone-600'}`}>
            <span>3</span> Products &amp; Capacity
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xl text-xs space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <h2 className="font-serif font-bold text-xl text-[#17233B]">
                    Step 1: Select Your Business Type &amp; Region
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">Business Classification *</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-stone-50"
                      >
                        <option value="hotel">Hotel / Resort / Luxury Stays</option>
                        <option value="bakery">Commercial Bakery / Pastry Manufacturer</option>
                        <option value="sweet_shop">Sweets &amp; Mithai Manufacturer</option>
                        <option value="restaurant">Restaurant / Cloud Kitchen / Hospitality</option>
                        <option value="wedding_planner">Wedding Planner / Event Curator</option>
                        <option value="travel_agency">Travel Agency / Tour Operator / DMC</option>
                        <option value="artisan_guild">Craft Producer / Artisan Guild / Fashion</option>
                        <option value="manufacturer">Food &amp; Snack Manufacturer</option>
                        <option value="supplier">Bulk Raw Ingredient Supplier</option>
                        <option value="d2c_brand">D2C Brand / Emerging Consumer Label</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">Operating Country *</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-stone-50"
                      >
                        <option value="India">India (Launch Market)</option>
                        <option value="UAE">United Arab Emirates (Dubai / Abu Dhabi)</option>
                        <option value="Saudi Arabia">Saudi Arabia (Riyadh / Jeddah)</option>
                        <option value="United Kingdom">United Kingdom (London / Greater UK)</option>
                        <option value="United States">United States (East / West Coast)</option>
                        <option value="Canada">Canada</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-stone-700 mb-1.5">Headquarters City / Operating Hub *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Srinagar, Kashmir / Greater Noida / Mumbai / Dubai"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Continue to Legal Entity &amp; Verification →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <h2 className="font-serif font-bold text-xl text-[#17233B]">
                    Step 2: Legal Details &amp; Contact Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">Legal Company Name *</label>
                      <input
                        type="text"
                        required
                        value={legalName}
                        onChange={(e) => setLegalName(e.target.value)}
                        placeholder="e.g. Royal Pine Hospitality Pvt Ltd"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">Public Brand / Display Name *</label>
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. The Royal Pine Villas"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">Corporate Work Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="partners@royalpine.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">Direct Phone / WhatsApp *</label>
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
                      <label className="block font-bold text-stone-700 mb-1.5">GSTIN / Tax ID (if applicable)</label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 07AAAAA0000A1Z5"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1.5">FSSAI License / Trade Reg (Food/Hospitality)</label>
                      <input
                        type="text"
                        value={fssai}
                        onChange={(e) => setFssai(e.target.value)}
                        placeholder="e.g. 10020011000123"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 py-3 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                    >
                      Continue to Products &amp; Offerings →
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <h2 className="font-serif font-bold text-xl text-[#17233B]">
                    Step 3: What Products or Services Do You Provide?
                  </h2>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1.5">
                      Describe your core offerings, inventory capacity, and specialities:
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={productsServicesOverview}
                      onChange={(e) => setProductsServicesOverview(e.target.value)}
                      placeholder="e.g. We operate a boutique 12-room heritage villa in Srinagar with wedding catering capability / We produce 2 tons of artisan sourdough and cakes weekly requiring sliced almonds..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                    />
                  </div>

                  <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-1 text-stone-600">
                    <strong className="text-[#17233B] block">Nuty Tales Verified Partner Guarantee:</strong>
                    <p>
                      All onboarded businesses undergo human verification of trade licenses, certifications, and quality standards before public listing. Zero fabricated reviews or phantom profiles.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? 'Submitting Partner Application...' : '✓ Submit Business Verification Application'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-4 animate-fadeIn text-center">
              <span className="text-4xl block">🎉</span>
              <h2 className="font-serif font-bold text-2xl text-emerald-900">
                Partner Onboarding Application Received!
              </h2>
              <p className="max-w-lg mx-auto text-xs leading-relaxed">
                Thank you for applying to join the Nuty Tales Global Business Network. Our partner verification team will review your credentials and contact you within 24 business hours.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales Partner Desk! Submitted partner onboarding for ${legalName} (${city}).`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Connect with Partner Manager on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
