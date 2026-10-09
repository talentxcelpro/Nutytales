'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  B2B_COMMODITIES,
  B2B_HUBS,
  B2BCommodity,
} from '@/lib/b2b-data'
import {
  INDUSTRIES,
  ENTERPRISE_FEATURES,
  IndustryProfile,
} from '@/lib/business-supply-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import CommercialSampleDesk from '@/components/b2b/CommercialSampleDesk'

export default function B2BHomePage() {
  // ── 1. Amazon Business Onboarding State ────────────────────────────────────
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3>(1)
  const [workEmail, setWorkEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [businessType, setBusinessType] = useState('Commercial Bakery')
  const [gstin, setGstin] = useState('')
  const [cityPincode, setCityPincode] = useState('')
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'California Almonds (Sliced)',
    'Kashmiri Kagzi Walnuts',
  ])
  const [estMonthlyKg, setEstMonthlyKg] = useState('500 kg - 1,000 kg')
  const [isOnboardingSubmitted, setIsOnboardingSubmitted] = useState(false)
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false)
  const [onboardingError, setOnboardingError] = useState<string | null>(null)
  const [isSignInMode, setIsSignInMode] = useState(false)

  // ── 2. Live Wholesale Tier Pricing Matrix State ─────────────────────────────
  const [activeCategory, setActiveCategory] = useState<string>('All')

  // ── 3. Interactive RFQ Terminal State ───────────────────────────────────────
  const [rfqCommodityId, setRfqCommodityId] = useState<string>(B2B_COMMODITIES[1].id) // California Almonds
  const [rfqCut, setRfqCut] = useState<string>('Sliced 0.8–1.2mm')
  const [rfqPackaging, setRfqPackaging] = useState<string>('25kg Vacuum Poly Liner')
  const [rfqVolumeKg, setRfqVolumeKg] = useState<number>(500)
  const [rfqDestination, setRfqDestination] = useState<string>('Delhi NCR / Noida Hub')
  const [rfqSuccessMsg, setRfqSuccessMsg] = useState(false)
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false)

  // ── 4. "What Do You Make?" Industry Selector State ──────────────────────────
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryProfile>(INDUSTRIES[2]) // Bakeries

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Selected Commodity for RFQ Calculation
  const selectedCommodity = useMemo(() => {
    return B2B_COMMODITIES.find((c) => c.id === rfqCommodityId) || B2B_COMMODITIES[0]
  }, [rfqCommodityId])

  // Live RFQ Price Calculator
  const calculatedQuote = useMemo(() => {
    const c = selectedCommodity
    const v = rfqVolumeKg

    let tierPrice = c.tierPrices.tier1.pricePerKg
    let tierName = c.tierPrices.tier1.label
    let discountPct = 0

    if (v >= c.tierPrices.container.minKg) {
      tierPrice = c.tierPrices.container.pricePerKg
      tierName = c.tierPrices.container.label
      discountPct = c.tierPrices.container.savingsPercent
    } else if (v >= c.tierPrices.tier3.minKg) {
      tierPrice = c.tierPrices.tier3.pricePerKg
      tierName = c.tierPrices.tier3.label
      discountPct = c.tierPrices.tier3.savingsPercent
    } else if (v >= c.tierPrices.tier2.minKg) {
      tierPrice = c.tierPrices.tier2.pricePerKg
      tierName = c.tierPrices.tier2.label
      discountPct = c.tierPrices.tier2.savingsPercent
    }

    const subtotal = tierPrice * v
    const standardBaseTotal = c.tierPrices.tier1.pricePerKg * v
    const savingsAmount = standardBaseTotal - subtotal
    const gstAmount = Math.round(subtotal * (c.gstPercent / 100))
    const totalWithGst = subtotal + gstAmount

    // Freight estimate
    let freightEstimate = 0
    if (v < 100) freightEstimate = 1200
    else if (v < 500) freightEstimate = 3200
    else if (v < 2000) freightEstimate = 7500
    else freightEstimate = 14000 // Container freight subsidy

    const netLandedPerKg = Math.round((totalWithGst + freightEstimate) / v)

    return {
      tierPrice,
      tierName,
      discountPct,
      subtotal,
      savingsAmount,
      gstAmount,
      totalWithGst,
      freightEstimate,
      netLandedPerKg,
    }
  }, [selectedCommodity, rfqVolumeKg])

  // Toggle Need Item
  const toggleNeed = (item: string) => {
    if (selectedNeeds.includes(item)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== item))
    } else {
      setSelectedNeeds([...selectedNeeds, item])
    }
  }

  // Handle Onboarding Next Step
  const handleOnboardingNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setOnboardingError(null)

    if (onboardingStep === 1) {
      if (!workEmail || !workEmail.includes('@')) {
        setOnboardingError('Please enter a valid official work email address.')
        return
      }
      setOnboardingStep(2)
      return
    }

    if (onboardingStep === 2) {
      if (!companyName || !phone) {
        setOnboardingError('Please provide your organization name and direct phone number.')
        return
      }
      setOnboardingStep(3)
      return
    }

    if (onboardingStep === 3) {
      setIsOnboardingLoading(true)
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: contactName || 'B2B Procurement Lead',
            email: workEmail,
            phone,
            businessName: companyName,
            city: cityPincode,
            message: `[B2B Amazon-Style Account Creation] Email: ${workEmail} | Org: ${companyName} | Type: ${businessType} | GSTIN: ${gstin || 'Pending'} | Needs: ${selectedNeeds.join(', ')} | Volume: ${estMonthlyKg}`,
            source: 'business-subdomain-onboarding',
          }),
        })

        const data = await res.json()
        if (res.ok && data.success && data.result?.success !== false) {
          setIsOnboardingSubmitted(true)
        } else {
          setOnboardingError(data.error || 'Unable to register business account. Please contact WhatsApp.')
        }
      } catch {
        setOnboardingError('Network error. You can also chat directly on WhatsApp.')
      } finally {
        setIsOnboardingLoading(false)
      }
    }
  }

  // Handle RFQ Quick Submit
  const handleRfqQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingRfq(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || 'B2B RFQ Lead',
          email: workEmail || 'procurement@nutytales.com',
          phone: phone || '+91-Enterprise',
          businessName: companyName || 'Corporate Client',
          city: rfqDestination,
          message: `[B2B RFQ Terminal] Commodity: ${selectedCommodity.name} | Cut: ${rfqCut} | Pack: ${rfqPackaging} | Qty: ${rfqVolumeKg} kg | Dest: ${rfqDestination} | Landed/kg: ₹${calculatedQuote.netLandedPerKg} | Total: ₹${calculatedQuote.totalWithGst}`,
          source: 'business-rfq-terminal',
        }),
      })

      setRfqSuccessMsg(true)
      setTimeout(() => setRfqSuccessMsg(false), 5000)
    } catch {
      // Fallback
    } finally {
      setIsSubmittingRfq(false)
    }
  }

  const whatsappQuoteUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nuty Tales B2B Desk! 🏭\n\nI want to lock in a wholesale price contract:\n• Commodity: ${selectedCommodity.name}\n• Mechanical Cut: ${rfqCut}\n• Packaging: ${rfqPackaging}\n• Volume: ${rfqVolumeKg} kg\n• Estimated Landed Rate: ₹${calculatedQuote.netLandedPerKg}/kg\n• Delivery Destination: ${rfqDestination}\n• Org: ${companyName || 'Corporate Procurement'}\n\nPlease share the formal proforma invoice with COA lab batch specs!`,
  )}`

  return (
    <div className="space-y-20 pb-20">
      {/* ── 1. AMAZON BUSINESS REFERENCE SPLIT-CARD HERO ─────────────────────── */}
      <section className="pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Split Card: "Let us create your free Nuty Tales Business account" */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200">
            <div>
              {/* Step indicator header */}
              <div className="flex items-center gap-3 text-xs mb-4">
                <span
                  className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-full ${
                    onboardingStep === 1
                      ? 'bg-[#17233B] text-white'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] leading-4">
                    1
                  </span>
                  <span>ACCOUNT CREATION</span>
                </span>

                <span className="text-stone-300">→</span>

                <span
                  className={`flex items-center gap-1.5 font-bold px-3 py-1 rounded-full ${
                    onboardingStep === 2
                      ? 'bg-[#17233B] text-white'
                      : onboardingStep === 3
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-center text-[10px] leading-4">
                    2
                  </span>
                  <span>BUSINESS DETAILS</span>
                </span>

                <span className="text-stone-300 hidden sm:inline">→</span>

                <span
                  className={`hidden sm:flex items-center gap-1.5 font-bold px-3 py-1 rounded-full ${
                    onboardingStep === 3
                      ? 'bg-[#17233B] text-white'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 text-center text-[10px] leading-4">
                    3
                  </span>
                  <span>FINISH</span>
                </span>
              </div>

              {!isOnboardingSubmitted ? (
                <>
                  <div className="space-y-2">
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B] tracking-tight">
                      {isSignInMode
                        ? 'Sign in to your Nuty Tales Business account'
                        : 'Let us create your free Nuty Tales Business account'}
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-600">
                      Access exclusive volume pricing, GST invoice tax credit, and direct orchard allocations.
                    </p>
                  </div>

                  {/* Multi-Step Onboarding Form */}
                  <form onSubmit={handleOnboardingNext} className="mt-6 space-y-4">
                    {onboardingStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-[#17233B] mb-1.5">
                            Enter an email. Work email preferred.
                          </label>
                          <input
                            type="email"
                            required
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                            placeholder="Enter work email address (e.g. procurement@bakery.com)"
                            className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm sm:text-base focus:ring-2 focus:ring-[#176B68] focus:border-transparent outline-none bg-stone-50"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Procurement Officer Name
                            </label>
                            <input
                              type="text"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              placeholder="e.g. Vikram Malhotra"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Direct Phone / WhatsApp
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <span>Get started</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}

                    {onboardingStep === 2 && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="p-3 bg-stone-100 rounded-xl text-xs flex items-center justify-between">
                          <span>Account Email: <strong>{workEmail}</strong></span>
                          <button
                            type="button"
                            onClick={() => setOnboardingStep(1)}
                            className="text-[#176B68] font-bold hover:underline"
                          >
                            Edit
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-bold text-[#17233B] mb-1">
                              Organization / Company Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g. Royal Confectionery Pvt Ltd"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#17233B] mb-1">
                              Business Sector
                            </label>
                            <select
                              value={businessType}
                              onChange={(e) => setBusinessType(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-white"
                            >
                              <option value="Commercial Bakery">Commercial Bakery &amp; Cakes</option>
                              <option value="Sweet & Mithai Manufacturer">Sweet &amp; Mithai Manufacturer</option>
                              <option value="5-Star Hotel / Hospitality">5-Star Hotel / Hospitality</option>
                              <option value="Food & Snack Manufacturer">Food &amp; Snack Manufacturer</option>
                              <option value="Chocolate & Confectionery">Chocolate &amp; Confectionery</option>
                              <option value="Private Label / D2C Brand">Private Label / D2C Brand</option>
                              <option value="Regional Distributor">Regional Distributor / Wholesaler</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-[#17233B] mb-1">
                              GSTIN (Optional for 18% Credit)
                            </label>
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
                            <label className="block font-bold text-[#17233B] mb-1">
                              Plant City / Delivery Pincode *
                            </label>
                            <input
                              type="text"
                              required
                              value={cityPincode}
                              onChange={(e) => setCityPincode(e.target.value)}
                              placeholder="e.g. Noida / 201301"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setOnboardingStep(1)}
                            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-3 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <span>Continue to Commodity Setup</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {onboardingStep === 3 && (
                      <div className="space-y-4 animate-fadeIn text-xs">
                        <div>
                          <label className="block font-bold text-[#17233B] mb-2">
                            Select Commodities Needed (Tick all that apply):
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              'California Almonds (Sliced/Whole)',
                              'Kashmiri Mamra Almonds',
                              'Kashmiri Kagzi Walnuts',
                              'Pure Mongra Kashmir Saffron',
                              'Cashews W240 / Tukda',
                              'Phool Makhana Jumbo (6+ Sutra)',
                              'Afghan Seedless Raisins',
                              'Iranian Pistachios',
                            ].map((item) => {
                              const active = selectedNeeds.includes(item)
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => toggleNeed(item)}
                                  className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                                    active
                                      ? 'bg-[#17233B] text-white border-[#C9A45C]'
                                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                  }`}
                                >
                                  <span className="font-medium text-[11px]">{item}</span>
                                  <span className="font-bold">{active ? '✓' : '+'}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-[#17233B] mb-1.5">
                            Estimated Monthly Requirement:
                          </label>
                          <select
                            value={estMonthlyKg}
                            onChange={(e) => setEstMonthlyKg(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-white"
                          >
                            <option value="100 kg - 250 kg">100 kg - 250 kg (Starter Batch)</option>
                            <option value="500 kg - 1,000 kg">500 kg - 1,000 kg (Commercial Line)</option>
                            <option value="2,500 kg - 5,000 kg">2,500 kg - 5,000 kg (Factory Bulk Run)</option>
                            <option value="10 Tons+ Container">10 Tons+ (Full Container Allocation)</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setOnboardingStep(2)}
                            className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase rounded-xl transition-colors"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={isOnboardingLoading}
                            className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <span>
                              {isOnboardingLoading
                                ? 'Activating Business Tier...'
                                : '✓ Complete Registration & Unlock Wholesale Tier'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {onboardingError && (
                      <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs border border-red-200">
                        ⚠️ {onboardingError}
                      </div>
                    )}
                  </form>

                  <div className="pt-2 text-xs">
                    <span className="text-stone-600">
                      {isSignInMode
                        ? 'New organisation? '
                        : 'Already a Nuty Tales Business customer? '}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSignInMode(!isSignInMode)}
                      className="font-bold text-[#176B68] hover:underline"
                    >
                      {isSignInMode ? 'Create free business account' : 'Sign in'}
                    </button>
                  </div>
                </>
              ) : (
                /* Welcome Confirmation State */
                <div className="space-y-4 p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 animate-fadeIn">
                  <div className="flex items-center gap-2 text-base font-serif font-bold text-emerald-800">
                    <span className="text-2xl">🎉</span>
                    <span>Nuty Tales Business Account Created &amp; Verified!</span>
                  </div>
                  <p className="text-emerald-900 leading-relaxed">
                    Welcome aboard, <strong>{companyName || 'Corporate Partner'}</strong>. Your commercial wholesale pricing tiers are now unlocked.
                  </p>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                    <div>Account Email: <strong>{workEmail}</strong></div>
                    <div>Allocated Sourcing Hub: <strong>Noida HQ / Kashmir Valley</strong></div>
                    <div>Assigned Key Account Specialist: <strong>Tariq Ahmad (+91 9717161809)</strong></div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href="#pricing-matrix"
                      className="px-4 py-2 bg-[#17233B] text-white rounded-xl font-bold uppercase text-[11px] tracking-wider"
                    >
                      View Live Wholesale Rates ↓
                    </a>
                    <a
                      href={whatsappQuoteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold uppercase text-[11px] tracking-wider"
                    >
                      Instant WhatsApp Desk
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer & Authority Binding Note (Exact match to Amazon Business screenshot) */}
            <div className="pt-6 border-t border-stone-200 text-[11px] text-stone-500 leading-relaxed">
              By clicking get started, you agree to Nuty Tales&apos; Conditions of Use, Privacy Notice, and the Business Supply Terms and Conditions. You agree that you are creating this business account on behalf of your organisation and have authority to bind your organisation.
            </div>
          </div>

          {/* Right Split Card: "Reshape buying for your organisation" (Amazon Business style) */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 bg-[#FAF6EE] flex flex-col justify-between space-y-8">
            <div className="space-y-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] leading-tight">
                Reshape buying for your organisation
              </h2>

              <div className="space-y-6">
                {/* Value Prop 1: Free Delivery */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-xl flex-shrink-0">
                    🚚
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#17233B]">
                      Free Delivery on first order
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Get free insured logistics freight on your first commercial purchase with Nuty Tales Business.
                    </p>
                  </div>
                </div>

                {/* Value Prop 2: GST Invoice & Bulk Discounts */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-xl flex-shrink-0">
                    🏷️
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#17233B]">
                      GST Invoice &amp; Bulk Discounts
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Save up to 18% more with GST input credit and avail transparent tiered wholesale discounts on multi-unit, pallet, and container purchases.
                    </p>
                  </div>
                </div>

                {/* Value Prop 3: Business Analytics & RFQ Desk */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-xl flex-shrink-0">
                    📊
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#17233B]">
                      Business Analytics &amp; RFQ Desk
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Track and monitor spending by your organisation with dynamic charts, batch COA quality test reports, and a dedicated relationship manager.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="pt-6 border-t border-stone-300">
              <a
                href="#rfq-terminal"
                className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1.5"
              >
                <span>Learn more about Nuty Tales Business Supply</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ALIBABA-GRADE LIVE WHOLESALE PRICE TIER MATRIX ─────────────────── */}
      <section id="pricing-matrix" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
              <span>📈</span> ALIBABA-GRADE WHOLESALE COMMODITY BOARD
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Transparent Volume Tier Pricing Matrix
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Live factory-direct pricing across volume brackets. All prices per kg, exclusive of GST.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            {['All', 'Tree Nuts', 'Saffron', 'Makhana', 'Dried Fruits'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Commodity Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {B2B_COMMODITIES.filter(
            (c) => activeCategory === 'All' || c.category === activeCategory,
          ).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                      {item.origin}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#17233B]">
                      {item.name}
                    </h3>
                    <span className="text-[10px] text-stone-500 font-mono">{item.code}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                    MOQ {item.moqKg} kg
                  </span>
                </div>

                <div className="p-3 bg-[#FAF6EE] rounded-xl text-xs space-y-1 border border-stone-200">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Grade / Spec:</span>
                    <span className="font-semibold text-stone-800 text-right">{item.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Moisture:</span>
                    <span className="font-semibold text-stone-800">{item.moisture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Fulfillment Hub:</span>
                    <span className="font-semibold text-[#176B68]">{item.dispatchHub}</span>
                  </div>
                </div>

                {/* 4-Tier Pricing Ladder */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-stone-100">
                    <span className="text-stone-600">{item.tierPrices.tier1.label}</span>
                    <span className="font-bold text-[#17233B]">₹{item.tierPrices.tier1.pricePerKg.toLocaleString('en-IN')}/kg</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100 bg-emerald-50/50 px-1 rounded">
                    <span className="text-emerald-900 font-medium">{item.tierPrices.tier2.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded font-bold">
                        -{item.tierPrices.tier2.savingsPercent}%
                      </span>
                      <span className="font-bold text-emerald-800">
                        ₹{item.tierPrices.tier2.pricePerKg.toLocaleString('en-IN')}/kg
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-stone-100 bg-emerald-50 px-1 rounded">
                    <span className="text-emerald-950 font-bold">{item.tierPrices.tier3.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-emerald-300 text-emerald-950 px-1 rounded font-bold">
                        -{item.tierPrices.tier3.savingsPercent}%
                      </span>
                      <span className="font-bold text-emerald-900">
                        ₹{item.tierPrices.tier3.pricePerKg.toLocaleString('en-IN')}/kg
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1 bg-amber-50 px-1 rounded">
                    <span className="text-amber-950 font-bold">{item.tierPrices.container.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-[#C9A45C] text-[#17233B] px-1 rounded font-bold">
                        -{item.tierPrices.container.savingsPercent}%
                      </span>
                      <span className="font-bold text-amber-900">
                        ₹{item.tierPrices.container.pricePerKg.toLocaleString('en-IN')}/kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRfqCommodityId(item.id)
                    setRfqCut(item.cuts[0] || 'Standard Cut')
                    const el = document.getElementById('rfq-terminal')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="flex-1 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors text-center"
                >
                  Configure in RFQ
                </button>
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales B2B! I would like to request a 500g Commercial Sample Kit for: ${item.name} (${item.code}).`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors"
                  title="Request Lab Sample Kit"
                >
                  Sample Kit
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2.5 IMMEDIATE B2B CASHFLOW: 5KG SAMPLE PACK & PROFORMA WIRE DESK ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CommercialSampleDesk />
      </section>

      {/* ── 3. INTERACTIVE LIVE RFQ PROCUREMENT TERMINAL ─────────────────────── */}
      <section id="rfq-terminal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17233B] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#C9A45C]/30 shadow-2xl space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
              <span>⚡</span> REAL-TIME PROCUREMENT CALCULATOR
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Instant B2B Request for Quote (RFQ) Terminal
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              Select your commodity, mechanical cut, packaging format, and order quantity. Live freight, GST tax credit, and net landed cost per kg are calculated instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Configurator (7 cols) */}
            <form onSubmit={handleRfqQuickSubmit} className="lg:col-span-7 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-bold mb-1.5">
                    1. Select Commodity *
                  </label>
                  <select
                    value={rfqCommodityId}
                    onChange={(e) => {
                      setRfqCommodityId(e.target.value)
                      const match = B2B_COMMODITIES.find((c) => c.id === e.target.value)
                      if (match) setRfqCut(match.cuts[0] || 'Whole')
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#10192A] text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A45C] outline-none"
                  >
                    {B2B_COMMODITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1.5">
                    2. Precision Cut / Form *
                  </label>
                  <select
                    value={rfqCut}
                    onChange={(e) => setRfqCut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#10192A] text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A45C] outline-none"
                  >
                    {selectedCommodity.cuts.map((cut) => (
                      <option key={cut} value={cut}>
                        {cut}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1.5">
                    3. Packaging Format *
                  </label>
                  <select
                    value={rfqPackaging}
                    onChange={(e) => setRfqPackaging(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#10192A] text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A45C] outline-none"
                  >
                    {selectedCommodity.packaging.map((pack) => (
                      <option key={pack} value={pack}>
                        {pack}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-bold mb-1.5">
                    4. Required Order Volume (kg) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={selectedCommodity.moqKg}
                      step={selectedCommodity.category === 'Saffron' ? 0.1 : 10}
                      value={rfqVolumeKg}
                      onChange={(e) => setRfqVolumeKg(Number(e.target.value) || selectedCommodity.moqKg)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#10192A] text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A45C] outline-none font-bold"
                    />
                    <span className="text-stone-400 font-bold uppercase text-[11px]">kg</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-bold mb-1.5">
                    5. Delivery Destination / Plant Hub *
                  </label>
                  <select
                    value={rfqDestination}
                    onChange={(e) => setRfqDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-white/20 bg-[#10192A] text-white text-xs sm:text-sm focus:ring-2 focus:ring-[#C9A45C] outline-none"
                  >
                    <option value="Delhi NCR / Noida Hub">Delhi NCR / Noida Hub (Same Day - 24h)</option>
                    <option value="Mumbai / Pune Industrial Corridor">Mumbai / Pune Industrial Corridor (48 - 72h)</option>
                    <option value="Bengaluru / Karnataka Hub">Bengaluru / Karnataka Hub (3 - 4 Days)</option>
                    <option value="Ahmedabad / Gujarat Belt">Ahmedabad / Gujarat Belt (48h)</option>
                    <option value="Srinagar / Kashmir Direct">Srinagar / Kashmir Direct Orchard (Same Day)</option>
                    <option value="Patna / Kolkata Eastern Hub">Patna / Kolkata Eastern Hub (24 - 36h)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmittingRfq}
                  className="flex-1 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {isSubmittingRfq ? 'Generating Formal RFQ...' : '⚡ Submit RFQ & Lock Price Online'}
                </button>
                <a
                  href={whatsappQuoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <span>→</span>
                </a>
              </div>

              {rfqSuccessMsg && (
                <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/40 text-xs">
                  ✓ RFQ Recorded! A formal proforma quotation and NABL specification sheet have been dispatched to our corporate desk.
                </div>
              )}
            </form>

            {/* Right: Live Landed Cost Summary Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#10192A] rounded-2xl p-6 border border-white/15 space-y-5 text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                  Live Quotation Breakdown
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">
                  Active Tier: {calculatedQuote.tierName}
                </span>
              </div>

              <div className="space-y-2.5 text-stone-300">
                <div className="flex justify-between">
                  <span>Selected Commodity:</span>
                  <span className="font-bold text-white text-right">{selectedCommodity.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Wholesale Rate:</span>
                  <span className="font-bold text-white">₹{calculatedQuote.tierPrice.toLocaleString('en-IN')} / kg</span>
                </div>
                {calculatedQuote.discountPct > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Applied Volume Discount:</span>
                    <span className="font-bold">-{calculatedQuote.discountPct}% (Save ₹{calculatedQuote.savingsAmount.toLocaleString('en-IN')})</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Order Quantity:</span>
                  <span className="font-bold text-white">{rfqVolumeKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">₹{calculatedQuote.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({selectedCommodity.gstPercent}% Input Credit):</span>
                  <span className="font-bold text-white">₹{calculatedQuote.gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Logistics ({rfqDestination.split('(')[0].trim()}):</span>
                  <span className="font-bold text-white">₹{calculatedQuote.freightEstimate.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Net Landed Unit Cost Callout */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-1 text-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                  Net Landed Rate (All Inclusive)
                </span>
                <div className="font-serif text-3xl font-bold text-white">
                  ₹{calculatedQuote.netLandedPerKg.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-stone-300"> / kg</span>
                </div>
                <span className="text-[10px] text-emerald-400 block">
                  Total Commercial Invoice: ₹{calculatedQuote.totalWithGst.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-[10px] text-stone-400 space-y-1">
                <p>• 100% Tax Deductible with GSTIN Input Credit.</p>
                <p>• Net-30 credit terms available for verified corporate clients.</p>
                <p>• Batch COA test certificate shipped with cargo.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. ALIBABA TRADE ASSURANCE & VERIFIED CREDENTIALS ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#704B32]">
              Global Standard B2B Trust
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Nuty Tales Trade Assurance &amp; Quality Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Procure with absolute institutional confidence. We eliminate middleman tampering and provide laboratory certification with every consignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-2xl block">🏅</span>
              <h3 className="font-serif font-bold text-base text-[#17233B]">100% Origin Guaranteed</h3>
              <p className="text-stone-600 leading-relaxed">
                Direct orchard aggregation in Kashmir and Bihar. Zero synthetic bleaching, zero foreign oil blending.
              </p>
            </div>

            <div className="p-5 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-2xl block">🔬</span>
              <h3 className="font-serif font-bold text-base text-[#17233B]">NABL Lab Batch COA</h3>
              <p className="text-stone-600 leading-relaxed">
                Every dispatched pallet includes an authentic Certificate of Analysis for moisture, fat, aflatoxin, and microbiotics.
              </p>
            </div>

            <div className="p-5 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-2xl block">📦</span>
              <h3 className="font-serif font-bold text-base text-[#17233B]">Industrial Vacuum Packaging</h3>
              <p className="text-stone-600 leading-relaxed">
                High-barrier vacuum sacks and nitrogen-flushed 10kg tins ensure 12+ months of crisp freshness with zero rancidity.
              </p>
            </div>

            <div className="p-5 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-2">
              <span className="text-2xl block">🛡️</span>
              <h3 className="font-serif font-bold text-base text-[#17233B]">Insured Dispatch &amp; Return</h3>
              <p className="text-stone-600 leading-relaxed">
                If any batch fails optical or moisture specs agreed upon in your contract, we replace or refund within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. "WHAT DO YOU MAKE?" INTERACTIVE SECTOR DOSSIER ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Interactive Manufacturing Solutions
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#17233B]">
            What Does Your Organisation Make?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Select your sector below to view specialized precision cuts, moisture specifications, and contract parameters.
          </p>
        </div>

        {/* Sector Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {INDUSTRIES.slice(0, 8).map((ind) => (
            <button
              key={ind.id}
              type="button"
              onClick={() => setSelectedIndustry(ind)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                selectedIndustry.id === ind.id
                  ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{ind.icon}</span>
              <span>{ind.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Sector Profile Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#176B68]">
              {selectedIndustry.categoryLabel} Specifications
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#17233B]">
              {selectedIndustry.name}
            </h3>
            <p className="text-stone-600 leading-relaxed">
              {selectedIndustry.tagline}
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                Primary Raw Ingredients:
              </span>
              <p className="font-medium text-[#17233B]">{selectedIndustry.primaryProducts.join(', ')}</p>
            </div>
            <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                Mechanical Cuts Supplied:
              </span>
              <p className="font-medium text-[#17233B]">{selectedIndustry.cutTypes.join(', ')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                Typical Commercial Volume:
              </span>
              <p className="font-bold text-[#176B68]">{selectedIndustry.typicalMonthlyKg}</p>
            </div>
            <a
              href="#rfq-terminal"
              className="inline-block w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-center font-bold uppercase tracking-wider text-[11px] transition-colors"
            >
              Request Supply Schedule →
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. THREE REGIONAL FULFILLMENT HUBS ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Nationwide Logistics Infrastructure
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#17233B]">
            Three Strategic Processing &amp; Fulfillment Hubs
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Minimizing transit time, eliminating secondary handling, and ensuring uninterrupted inventory continuity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {B2B_HUBS.map((hub) => (
            <div
              key={hub.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#176B68]">
                  {hub.state}
                </span>
                <h3 className="font-serif font-bold text-lg text-[#17233B]">{hub.name}</h3>
                <p className="text-stone-600 text-[11px]">{hub.address}</p>
                <p className="text-stone-800 font-medium pt-1">{hub.role}</p>
              </div>

              <div className="p-3 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1.5 text-[11px]">
                <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                  Transit Benchmarks:
                </span>
                {Object.entries(hub.transitDays).map(([dest, time]) => (
                  <div key={dest} className="flex justify-between text-stone-600">
                    <span>{dest}:</span>
                    <strong className="text-[#17233B]">{time}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
