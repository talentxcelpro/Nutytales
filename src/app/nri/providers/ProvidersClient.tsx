'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { NRI_CATEGORIES, OPERATIONAL_CITIES } from '@/lib/nri/nri-data'
import { NriStore } from '@/lib/nri/nri-store'
import { NriProvider, ServiceCategoryKey } from '@/lib/nri/types'

export default function ProviderOnboardingPage() {
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>(['Srinagar'])
  const [selectedCategories, setSelectedCategories] = useState<ServiceCategoryKey[]>(['property_management'])
  const [experienceYears, setExperienceYears] = useState(5)
  const [licenseInfo, setLicenseInfo] = useState('')
  const [nriExperience, setNriExperience] = useState('')
  const [sampleRate, setSampleRate] = useState('')
  const [panDeclared, setPanDeclared] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  const toggleCategory = (cat: ServiceCategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !email.trim()) return

    const newProvider: NriProvider = {
      id: `prov-new-${Date.now()}`,
      name,
      businessName: businessName || `${name} Services`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      categories: selectedCategories,
      cities: selectedCities,
      experienceYears: Number(experienceYears),
      verificationStatus: 'under_review',
      verificationLevel: 'Identity Verified',
      rating: 5.0,
      reviewCount: 0,
      completedJobs: 0,
      nriExperience,
      languages: ['English', 'Hindi'],
      bio: `${businessName || name} providing certified ground execution in ${selectedCities.join(', ')}.`,
      phone,
      email,
      panGstDeclared: panDeclared,
      sampleRate: sampleRate || 'Custom Quote',
    }

    NriStore.saveProvider(newProvider)
    setSubmitted(true)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8C6D2D]/10 border border-[#8C6D2D]/20 text-xs text-[#8C6D2D] font-semibold">
          <span>🤝</span>
          <span>ON-GROUND SUPPLY PARTNERSHIP</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#191919] tracking-tight">
          Become a Verified Service Provider
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Join India’s premier execution network. We connect verified advocates, Chartered Accountants, structural engineers, and elder companions with clients living across the globe.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-3xl p-10 border border-emerald-200 text-center space-y-4 shadow-sm animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#191919]">
            Application Submitted for Verification
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Your application status is now <span className="text-[#8C6D2D] font-bold uppercase">Under Review</span>. Our compliance officer will verify your identity, Bar Council / ICAI / trade licenses, and contact you via phone or email within 2-3 business days.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/provider-workspace"
              className="px-5 py-2.5 rounded-full bg-[#191919] text-white text-xs font-semibold hover:bg-[#2A2A2A] transition-colors"
            >
              Open Provider Workspace →
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#FAF9F6] text-stone-700 border border-[#EAE6DF] text-xs font-semibold hover:bg-[#F3EFE6] transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] space-y-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          {/* Section 1: Business Identity */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#191919] border-b border-[#EAE6DF] pb-2">
              1. Identity & Business Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Primary Contact Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Farooq Ahmad Mir"
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Registered Business / Firm Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Mir Estate & Property Solutions"
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Official Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91-9858000101"
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@mirestates.com"
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Services & Coverage */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#191919] border-b border-[#EAE6DF] pb-2">
              2. Service Specializations & City Coverage
            </h3>

            <div className="space-y-2">
              <label className="block text-stone-600 text-xs font-semibold">
                Select Service Verticals Handled:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {Object.keys(NRI_CATEGORIES).map((k) => {
                  const key = k as ServiceCategoryKey
                  const selected = selectedCategories.includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleCategory(key)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selected
                          ? 'bg-[#8C6D2D]/15 border-[#8C6D2D] text-[#8C6D2D] font-semibold'
                          : 'bg-[#FAF9F6] border-[#EAE6DF] text-stone-600 hover:text-[#191919]'
                      }`}
                    >
                      <span>{NRI_CATEGORIES[key].icon} </span>
                      <span>{NRI_CATEGORIES[key].shortTitle}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-stone-600 text-xs font-semibold">
                Operational Cities with Direct Physical Presence:
              </label>
              <div className="flex flex-wrap gap-2 text-xs">
                {OPERATIONAL_CITIES.map((c) => {
                  const selected = selectedCities.includes(c.name)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCity(c.name)}
                      className={`px-3 py-1.5 rounded-full border transition-all ${
                        selected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                          : 'bg-[#FAF9F6] border-[#EAE6DF] text-stone-600 hover:bg-[#F3EFE6]'
                      }`}
                    >
                      📍 {c.name}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Qualifications & Track Record */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#191919] border-b border-[#EAE6DF] pb-2">
              3. Qualifications & Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Years of Professional Experience in India
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Professional License / Enrollment No.
                </label>
                <input
                  type="text"
                  value={licenseInfo}
                  onChange={(e) => setLicenseInfo(e.target.value)}
                  placeholder="e.g. Bar Council Enrolment / ICAI Membership / Engineer Reg."
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>
            </div>

            <div className="text-xs space-y-1">
              <label className="block text-stone-600 font-semibold">
                Relevant Experience Serving Overseas / Diaspora Clients:
              </label>
              <textarea
                rows={3}
                value={nriExperience}
                onChange={(e) => setNriExperience(e.target.value)}
                placeholder="e.g. Have managed ancestral orchards for families in London and Dubai; coordinated regular photo updates and tenant coordination."
                className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
              />
            </div>

            <div className="text-xs space-y-1">
              <label className="block text-stone-600 font-semibold">
                Standard / Sample Pricing Model:
              </label>
              <input
                type="text"
                value={sampleRate}
                onChange={(e) => setSampleRate(e.target.value)}
                placeholder="e.g. ₹3,500 per site visit / ₹4,999 monthly retainer"
                className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE6DF] flex items-start gap-3 text-xs">
              <input
                type="checkbox"
                id="panCheck"
                checked={panDeclared}
                onChange={(e) => setPanDeclared(e.target.checked)}
                className="mt-0.5"
              />
              <label htmlFor="panCheck" className="text-stone-700 font-light leading-relaxed">
                I declare that my business possesses valid Indian PAN / GST credentials, and I agree to undergo mandatory identity and police/credential background checks before receiving customer bookings.
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Submit Provider Application →
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
