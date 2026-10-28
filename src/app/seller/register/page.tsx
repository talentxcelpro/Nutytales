'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSeller } from '../SellerContext'
import { GLOBAL_PRODUCT_CATEGORIES } from '@/lib/seller-portal/mock-data'
import { SupportedCurrency, CURRENCY_SYMBOLS } from '@/lib/seller-portal/types'

const GLOBAL_BUSINESS_TYPES = [
  {
    type: 'brand',
    title: 'Independent Brand & Designer Label',
    desc: 'Direct-to-consumer apparel, beauty, leatherware, jewelry, home decor & contemporary design',
    commission: '0% Free Listing',
    icon: '✨',
    defaultCategory: 'fashion-apparel',
  },
  {
    type: 'manufacturer',
    title: 'Manufacturer & Industrial Producer',
    desc: 'Scaled production lines, precision electronics, furniture, textiles & consumer hardware',
    commission: '0% Free Listing',
    icon: '🏭',
    defaultCategory: 'furniture-decor',
  },
  {
    type: 'wholesaler',
    title: 'B2B Sourcing & Wholesaler',
    desc: 'Institutional procurement, bulk cartons, cold storage commodities & catering wholesale',
    commission: '0% Free Listing',
    icon: '📦',
    defaultCategory: 'business-wholesale',
  },
  {
    type: 'artisan',
    title: 'Heritage Artisan & Master Guild',
    desc: 'Authentic handcrafted pashmina, walnut wood carving, fine jewellery, ceramics & heritage art',
    commission: '0% Free Listing',
    icon: '🪡',
    defaultCategory: 'crafts-handicrafts',
  },
  {
    type: 'farmer',
    title: 'Agricultural Producer & Orchardist',
    desc: 'Direct-source saffron, walnuts, almonds, organic valley crops, apiary honey & natural pantry',
    commission: '0% Free Listing',
    icon: '🌱',
    defaultCategory: 'food-dry-fruits',
  },
  {
    type: 'retailer',
    title: 'Specialty Retailer & Curated Atelier',
    desc: 'Multi-brand boutique merchandise, luxury gifts, gourmet snacks & seasonal hampers',
    commission: '0% Free Listing',
    icon: '🏬',
    defaultCategory: 'gifts-hampers',
  },
  {
    type: 'services_hospitality',
    title: 'Hospitality, Stays & Curated Travel',
    desc: 'Heritage houseboats, boutique orchard villas, mountain retreats & experiential travel',
    commission: '0% Free Listing',
    icon: '🏡',
    defaultCategory: 'travel-stays',
  },
]

const ELIGIBLE_COUNTRIES = [
  { name: 'United States', code: 'US', currency: 'USD' as SupportedCurrency, phoneCode: '+1', taxLabel: 'EIN / Federal Tax ID', subTaxLabel: 'State Sales Tax ID' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP' as SupportedCurrency, phoneCode: '+44', taxLabel: 'Companies House CRN', subTaxLabel: 'UK VAT Registration Number' },
  { name: 'United Arab Emirates', code: 'AE', currency: 'AED' as SupportedCurrency, phoneCode: '+971', taxLabel: 'Commercial Trade License No.', subTaxLabel: 'Federal TRN (Tax Reg. No.)' },
  { name: 'Germany', code: 'DE', currency: 'EUR' as SupportedCurrency, phoneCode: '+49', taxLabel: 'Handelsregister (HRB / HRA)', subTaxLabel: 'Umsatzsteuer-ID (USt-IdNr)' },
  { name: 'India', code: 'IN', currency: 'INR' as SupportedCurrency, phoneCode: '+91', taxLabel: 'Permanent Account Number (PAN)', subTaxLabel: 'GSTIN (Goods & Services Tax)' },
  { name: 'Canada', code: 'CA', currency: 'CAD' as SupportedCurrency, phoneCode: '+1', taxLabel: 'CRA Business Number (BN9)', subTaxLabel: 'GST/HST Account Number' },
  { name: 'Australia', code: 'AU', currency: 'AUD' as SupportedCurrency, phoneCode: '+61', taxLabel: 'Australian Business Number (ABN)', subTaxLabel: 'ACN / Company Number' },
  { name: 'France', code: 'FR', currency: 'EUR' as SupportedCurrency, phoneCode: '+33', taxLabel: 'SIREN / SIRET Number', subTaxLabel: 'Numéro de TVA Intracommunautaire' },
  { name: 'Singapore', code: 'SG', currency: 'SGD' as SupportedCurrency, phoneCode: '+65', taxLabel: 'Unique Entity Number (UEN)', subTaxLabel: 'GST Registration Number' },
  { name: 'Other Worldwide', code: 'XX', currency: 'USD' as SupportedCurrency, phoneCode: '+', taxLabel: 'National Business Registration Number', subTaxLabel: 'National Tax ID / VAT Number' },
]

export default function SellerRegistrationPage() {
  const router = useRouter()
  const { refreshSeller } = useSeller()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    businessType: 'brand',
    storeName: '',
    legalName: '',
    email: '',
    phoneCode: '+1',
    phoneNumber: '',
    whatsapp: '',
    website: '',
    country: 'United States',
    countryCode: 'US',
    preferredCurrency: 'USD' as SupportedCurrency,
    pickupAddress: '',
    city: '',
    state: '',
    pincode: '',
    // Tax fields (adapt dynamically)
    primaryTaxId: '',
    secondaryTaxId: '',
    specialCertification: '', // e.g. FSSAI, FDA, GI Tag, CE
    // Bank & settlement
    bankName: '',
    accountNumber: '',
    routingCode: '',
    beneficiaryName: '',
    // Categories & markets
    categories: ['fashion-apparel'],
    supportedMarkets: ['Domestic', 'Global'],
    agreedToTerms: false,
  })

  const currentCountryConfig = ELIGIBLE_COUNTRIES.find((c) => c.name === formData.country) || ELIGIBLE_COUNTRIES[0]

  const handleCountryChange = (countryName: string) => {
    const config = ELIGIBLE_COUNTRIES.find((c) => c.name === countryName)
    if (config) {
      setFormData((prev) => ({
        ...prev,
        country: config.name,
        countryCode: config.code,
        preferredCurrency: config.currency,
        phoneCode: config.phoneCode,
      }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCategoryToggle = (slug: string) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(slug)
      if (exists) {
        if (prev.categories.length === 1) return prev
        return { ...prev, categories: prev.categories.filter((c) => c !== slug) }
      } else {
        return { ...prev, categories: [...prev.categories, slug] }
      }
    })
  }

  const handleMarketToggle = (market: string) => {
    setFormData((prev) => {
      const exists = prev.supportedMarkets.includes(market)
      if (exists) {
        if (prev.supportedMarkets.length === 1) return prev
        return { ...prev, supportedMarkets: prev.supportedMarkets.filter((m) => m !== market) }
      } else {
        return { ...prev, supportedMarkets: [...prev.supportedMarkets, market] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const fullPhone = `${formData.phoneCode} ${formData.phoneNumber}`

      // Build country-specific tax structure
      const taxObj: any = {
        countryCode: formData.countryCode,
      }
      if (formData.countryCode === 'US') {
        taxObj.einOrSsn = formData.primaryTaxId
        taxObj.stateTaxPermit = formData.secondaryTaxId
      } else if (formData.countryCode === 'GB') {
        taxObj.companyNumber = formData.primaryTaxId
        taxObj.vatNumber = formData.secondaryTaxId
      } else if (formData.countryCode === 'AE') {
        taxObj.tradeLicenseNumber = formData.primaryTaxId
        taxObj.trnNumber = formData.secondaryTaxId
      } else if (formData.countryCode === 'IN') {
        taxObj.panNumber = formData.primaryTaxId
        taxObj.gstin = formData.secondaryTaxId
        taxObj.fssaiNumber = formData.specialCertification
      } else {
        taxObj.businessRegistrationNumber = formData.primaryTaxId
        taxObj.taxIdNumber = formData.secondaryTaxId
      }

      const res = await fetch('/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: formData.storeName,
          legalName: formData.legalName || formData.storeName,
          businessType: formData.businessType,
          email: formData.email,
          phone: fullPhone,
          whatsapp: formData.whatsapp || fullPhone,
          website: formData.website,
          pickupAddress: formData.pickupAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          countryCode: formData.countryCode,
          preferredCurrency: formData.preferredCurrency,
          supportedMarkets: formData.supportedMarkets,
          taxIdentifiers: taxObj,
          bankDetails: {
            bankName: formData.bankName,
            accountNumberMasked: formData.accountNumber
              ? `•••• •••• ${formData.accountNumber.slice(-4)}`
              : '•••• •••• 9921',
            routingCode: formData.routingCode || 'SWIFT/ROUTING',
            beneficiaryName: formData.beneficiaryName || formData.storeName,
            countryCode: formData.countryCode,
            currency: formData.preferredCurrency,
            accountType: 'checking',
          },
          approvedCategories: formData.categories,
          approvedStorefronts: ['nutytales.com'],
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit seller registration')
      }

      setSuccess(true)
      await refreshSeller()
      setTimeout(() => {
        router.push('/seller')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-3xl border border-stone-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-3xl mx-auto font-bold">
          ✓
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#163326]">Global Account Initialized</h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          Welcome to Nuty Tales Seller Central. Your application has been logged for international merchant verification. Redirecting you to your global command console...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto my-2 sm:my-4 space-y-4 sm:space-y-6 px-1 sm:px-0">
      {/* Global Header */}
      <div className="bg-[#163326] text-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#24523F] shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <Link href="/seller" className="text-xs text-[#C5A869] hover:underline flex items-center gap-1 font-medium">
              ← Return to Console
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FAF6EF] text-[#163326] border border-[#C5A869]">
              ✨ 0% Commission & Free Unlimited Listings
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#C5A869] block">
            Nuty Tales Seller Central · Global Onboarding
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-50 mt-1">
            Sell Anywhere. Grow Everywhere.
          </h1>
          <p className="text-xs text-stone-300 mt-2 max-w-2xl leading-relaxed">
            Register your business with zero upfront costs. As an early partner, enjoy 0% platform commission on all orders and unlimited free product listings. You retain 100% of your customer earnings.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#24523F]/80">
          {[
            { num: 1, label: 'Business Model' },
            { num: 2, label: 'Entity & Contact' },
            { num: 3, label: 'Warehouse & Pickup' },
            { num: 4, label: 'Tax & Compliance' },
            { num: 5, label: 'Categories & Payout' },
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`flex items-center gap-2 cursor-pointer transition ${
                step === s.num
                  ? 'text-white font-bold'
                  : step > s.num
                  ? 'text-[#C5A869] font-medium'
                  : 'text-stone-400 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step === s.num
                    ? 'bg-[#C5A869] text-[#163326]'
                    : step > s.num
                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-500'
                    : 'bg-[#1E4333] text-stone-300'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-xs hidden md:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Wizard Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        {/* STEP 1: BUSINESS MODEL */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Select Your Business Model</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Choose the primary operational classification for your merchant enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {GLOBAL_BUSINESS_TYPES.map((bt) => (
                <div
                  key={bt.type}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      businessType: bt.type,
                      categories: [bt.defaultCategory],
                    }))
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    formData.businessType === bt.type
                      ? 'border-[#163326] bg-[#FAF6EF] ring-2 ring-[#163326]/10'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl p-2 bg-white rounded-xl border border-stone-200 shrink-0 shadow-xs">
                      {bt.icon}
                    </span>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm">{bt.title}</h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">{bt.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Standard Platform Take</span>
                    <span className="font-bold text-[#163326] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                      {bt.commission}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 bg-[#163326] hover:bg-[#11291E] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Continue: Store Identity & Contact →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: STORE IDENTITY & CONTACT */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Merchant Identity & Incorporation</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Official entity details, operating jurisdiction, and business communications.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Public Store / Brand Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Apex Global Apparel, Nordic Living, Cascade Gear"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Registered Legal Corporate Entity Name
                </label>
                <input
                  type="text"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                  placeholder="e.g. Apex Retail International Ltd, Cascade LLC"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Country of Incorporation / Base *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] bg-white font-medium"
                >
                  {ELIGIBLE_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Default Reporting Currency *
                </label>
                <select
                  name="preferredCurrency"
                  value={formData.preferredCurrency}
                  onChange={handleChange}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] bg-white"
                >
                  <option value="USD">USD ($) — United States Dollar</option>
                  <option value="EUR">EUR (€) — Euro</option>
                  <option value="GBP">GBP (£) — British Pound</option>
                  <option value="AED">AED — UAE Dirham</option>
                  <option value="INR">INR (₹) — Indian Rupee</option>
                  <option value="CAD">CAD (CA$) — Canadian Dollar</option>
                  <option value="AUD">AUD (A$) — Australian Dollar</option>
                  <option value="SGD">SGD (S$) — Singapore Dollar</option>
                </select>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  All dashboard charts, analytics & payouts will calculate in this currency.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Business Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="contact@yourbusiness.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Business Telephone *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                    className="w-20 text-xs px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none bg-stone-50 font-mono text-center"
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="202-555-0143"
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  WhatsApp Business (For Dispatch Alerts)
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+1 202-555-0143"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Brand Website / Online Catalogue
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.yourbrand.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!formData.storeName || !formData.email || !formData.phoneNumber) {
                    setError('Please complete store name, email and phone number.')
                    return
                  }
                  setError(null)
                  setStep(3)
                }}
                className="px-6 py-2.5 bg-[#163326] hover:bg-[#11291E] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Continue: Pickup & Logistics →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: WAREHOUSE & DISPATCH */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">Primary Logistics & Fulfillment Depot</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Physical warehouse or depot where courier fleets (DHL, FedEx, UPS, BlueDart) collect outbound shipments.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Warehouse Street Address / Industrial Facility *
                </label>
                <textarea
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Suite 400, 100 Logistics Way, Industrial Park"
                  className="w-full text-xs p-3.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Seattle, London, Dubai..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    State / Province / Emirate *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    placeholder="Washington, England, Dubai..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Postal Code / ZIP *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    placeholder="98101, EC1A 1BB..."
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!formData.pickupAddress || !formData.city || !formData.state || !formData.pincode) {
                    setError('Please complete all warehouse address fields.')
                    return
                  }
                  setError(null)
                  setStep(4)
                }}
                className="px-6 py-2.5 bg-[#163326] hover:bg-[#11291E] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Continue: Tax & Compliance →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TAX & COMPLIANCE (DYNAMIC BY COUNTRY) */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#FAF6EF] text-[#163326] px-2 py-0.5 rounded font-bold border border-[#C5A869]/40">
                  {currentCountryConfig.name}
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Tax Identification & Regional Compliance
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Tax and legal documentation adapted specifically to {currentCountryConfig.name}. International sellers are not required to provide Indian documentation.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {currentCountryConfig.taxLabel} *
                  </label>
                  <input
                    type="text"
                    name="primaryTaxId"
                    value={formData.primaryTaxId}
                    onChange={handleChange}
                    required
                    placeholder="Enter registration or tax ID"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {currentCountryConfig.subTaxLabel}
                  </label>
                  <input
                    type="text"
                    name="secondaryTaxId"
                    value={formData.secondaryTaxId}
                    onChange={handleChange}
                    placeholder="Enter secondary VAT / sales tax ID"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] bg-white font-mono"
                  />
                </div>
              </div>

              {formData.countryCode === 'IN' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    FSSAI Food Safety License Number (Mandatory for Food / Dry Fruits)
                  </label>
                  <input
                    type="text"
                    name="specialCertification"
                    value={formData.specialCertification}
                    onChange={handleChange}
                    placeholder="14-digit FSSAI Registration"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none bg-white font-mono"
                  />
                </div>
              )}

              {formData.countryCode !== 'IN' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Industry Certifications (FDA, CE, Organic, Fair Trade, Origin)
                  </label>
                  <input
                    type="text"
                    name="specialCertification"
                    value={formData.specialCertification}
                    onChange={handleChange}
                    placeholder="e.g. USDA Organic #99218, CE Mark Compliance, ISO 9001"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none bg-white"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!formData.primaryTaxId) {
                    setError(`Please provide your ${currentCountryConfig.taxLabel}.`)
                    return
                  }
                  setError(null)
                  setStep(5)
                }}
                className="px-6 py-2.5 bg-[#163326] hover:bg-[#11291E] text-white text-xs font-semibold rounded-xl shadow-xs transition"
              >
                Continue: Categories & Payout Setup →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CATEGORIES & SETTLEMENT */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Product Categories & Payout Configuration
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Select your intended selling categories across the 20 global marketplace taxonomy tracks.
              </p>
            </div>

            {/* 20 Categories Grid */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Eligible Product Categories (Select All That Apply) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-2 border border-stone-200 rounded-2xl bg-stone-50/50">
                {GLOBAL_PRODUCT_CATEGORIES.map((cat) => {
                  const selected = formData.categories.includes(cat.slug)
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleCategoryToggle(cat.slug)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center gap-2 ${
                        selected
                          ? 'border-[#163326] bg-[#163326] text-white font-semibold shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Target Markets */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Target Selling Regions
              </label>
              <div className="flex flex-wrap gap-2">
                {['Domestic', 'North America', 'Europe', 'Middle East & GCC', 'Asia-Pacific', 'Global Cross-Border'].map((m) => {
                  const active = formData.supportedMarkets.includes(m)
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMarketToggle(m)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                        active
                          ? 'bg-[#163326] text-white border-[#163326]'
                          : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bank details */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                Payout & Settlement Bank Account ({formData.preferredCurrency})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 mb-1">Financial Institution / Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. JPMorgan Chase, Barclays, Emirates NBD, HDFC"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Account Beneficiary Name *</label>
                  <input
                    type="text"
                    name="beneficiaryName"
                    value={formData.beneficiaryName}
                    onChange={handleChange}
                    placeholder={formData.legalName || formData.storeName}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Account / IBAN Number *</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter account number or IBAN"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Routing / Sort Code / SWIFT / IFSC *</label>
                  <input
                    type="text"
                    name="routingCode"
                    value={formData.routingCode}
                    onChange={handleChange}
                    required
                    placeholder="Routing, Sort Code, or SWIFT/BIC"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-3 p-4 bg-[#FAF6EF] rounded-2xl border border-[#C5A869]/40">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                required
                className="mt-1 h-4 w-4 rounded text-[#163326] focus:ring-[#163326]"
              />
              <label htmlFor="agreedToTerms" className="text-xs text-stone-700 leading-relaxed cursor-pointer">
                I hereby declare that the corporate, tax, and product information provided is genuine and accurate. I agree to adhere to the Nuty Tales Seller Central Global Merchant Agreement, product quality standards, fair trading policies, and applicable international customs compliance regulations.
              </label>
            </div>

            <div className="flex justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.agreedToTerms}
                className="px-8 py-3 bg-[#163326] hover:bg-[#11291E] disabled:bg-stone-400 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
              >
                {submitting ? 'Submitting Global Account...' : 'Complete Registration & Open Dashboard →'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
