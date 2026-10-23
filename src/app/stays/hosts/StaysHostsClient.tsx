'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'

export default function StaysHostPortalPage() {
  const [currentStep, setCurrentStep] = useState(1)

  // Step 1: Host Profile & Verification
  const [hostName, setHostName] = useState('')
  const [hostPhone, setHostPhone] = useState('')
  const [hostEmail, setHostEmail] = useState('')
  const [hasDeed, setHasDeed] = useState(true)

  // Step 2: Property Essentials
  const [propertyTitle, setPropertyTitle] = useState('')
  const [propertyType, setPropertyType] = useState('villa')
  const [category, setCategory] = useState('orchards')
  const [destinationHub, setDestinationHub] = useState('Kashmir')
  const [city, setCity] = useState('Srinagar')
  const [addressLine, setAddressLine] = useState('')
  const [tagline, setTagline] = useState('')

  // Step 3: Capacity
  const [bedrooms, setBedrooms] = useState(4)
  const [beds, setBeds] = useState(5)
  const [baths, setBaths] = useState(4)
  const [maxGuests, setMaxGuests] = useState(8)
  const [wifiSpeed, setWifiSpeed] = useState(200)

  // Step 4: Amenities & Accessibility
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Bukhari (Wood Fireplace)',
    'High-Speed Wi-Fi',
    'Private Lawn / Garden',
    'Secure Gated Parking',
  ])
  const [accessibilityFeatures, setAccessibilityFeatures] = useState<string[]>([
    'Step-free entrance and ramps',
  ])

  // Step 5: Pricing & Policies
  const [nightlyRate, setNightlyRate] = useState(12000)
  const [cleaningFee, setCleaningFee] = useState(1500)
  const [cancellationPolicy, setCancellationPolicy] = useState('Flexible')
  const [instantBook, setInstantBook] = useState(true)

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccessRef, setSubmissionSuccessRef] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Revenue Estimator
  const estimatedMonthlyRevenue = useMemo(() => {
    // Assuming 65% occupancy in curated collection
    const gross = nightlyRate * 30 * 0.65
    const hostFee = gross * 0.03
    return Math.round(gross - hostFee)
  }, [nightlyRate])

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const hostListingRef = `NT-HOST-${Date.now().toString().slice(-5)}`
      // Simulate real persistence to store or leads
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: hostName,
          phone: hostPhone,
          email: hostEmail,
          businessName: `[HOST ONBOARDING] ${propertyTitle}`,
          city,
          message: `Host Application [Ref: ${hostListingRef}]: Property: ${propertyTitle} (${propertyType}) | Bedrooms: ${bedrooms} | Max Guests: ${maxGuests} | Tariff: ₹${nightlyRate}/nt | Amenities: ${selectedAmenities.join(
            ', ',
          )}`,
          source: 'stays-host-portal',
        }),
      })

      setSubmissionSuccessRef(hostListingRef)
    } catch {
      setErrorMsg('Failed to submit host application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="space-y-3 border-b border-[#E7E2D9] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-semibold">
          <span>👑 NUTY TALES STAYS — HOST ONBOARDING PORTAL</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          List Your Extraordinary Residence with Nuty Tales
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-3xl leading-relaxed">
          Join our verified collection of private walnut orchards, mountain ski chalets, and heritage houseboats. Enjoy transparent 3% host commission (vs 15%+ on other platforms), guaranteed payments, and vetted guests.
        </p>
      </div>

      {submissionSuccessRef ? (
        <div className="p-8 sm:p-12 bg-white rounded-3xl border-2 border-emerald-500 shadow-xl text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xl mx-auto shadow-md">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Listing Submitted for Verification Audit!
          </h2>
          <div className="inline-block px-4 py-2 bg-emerald-100 rounded-xl font-mono text-sm font-bold text-emerald-900 border border-emerald-300">
            Host Application Ref: {submissionSuccessRef}
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Our Regional Hospitality Auditor will review your deed verification and schedule a 3D photography shoot at <strong>{propertyTitle}</strong> in {city} within 48 hours.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/stays/dashboard"
              className="py-3 px-6 bg-[#17233B] hover:bg-[#1E3048] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
            >
              Open Host Operations Dashboard →
            </Link>
            <Link
              href="/stays"
              className="py-3 px-6 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl"
            >
              Back to Stays Marketplace
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Multi-Step Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E7E2D9] p-6 sm:p-8 shadow-xs space-y-6">
            {/* Step Wizard Progress Indicator */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 text-xs font-bold text-stone-500">
              <span className={currentStep === 1 ? 'text-[#17233B]' : ''}>1. Identity</span>
              <span>→</span>
              <span className={currentStep === 2 ? 'text-[#17233B]' : ''}>2. Property</span>
              <span>→</span>
              <span className={currentStep === 3 ? 'text-[#17233B]' : ''}>3. Capacity</span>
              <span>→</span>
              <span className={currentStep === 4 ? 'text-[#17233B]' : ''}>4. Amenities</span>
              <span>→</span>
              <span className={currentStep === 5 ? 'text-[#17233B]' : ''}>5. Pricing</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Step 1: Host Profile */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-[#17233B]">
                    Host Identity &amp; Verification
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Your Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        placeholder="e.g. Tariq Ahmad Lone"
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">WhatsApp Phone *</label>
                        <input
                          type="tel"
                          required
                          value={hostPhone}
                          onChange={(e) => setHostPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={hostEmail}
                          onChange={(e) => setHostEmail(e.target.value)}
                          placeholder="tariq@residence.com"
                          className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 pt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasDeed}
                        onChange={(e) => setHasDeed(e.target.checked)}
                        className="accent-[#176B68]"
                      />
                      <span className="text-stone-700">
                        I am the registered title deed holder or authorized legal custodian of this property.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Property Essentials */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-[#17233B]">
                    Property Details &amp; Location
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Property Name / Title *</label>
                      <input
                        type="text"
                        required
                        value={propertyTitle}
                        onChange={(e) => setPropertyTitle(e.target.value)}
                        placeholder="e.g. Whispering Pines Cedar Lodge"
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Property Type</label>
                        <select
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                          className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-semibold"
                        >
                          <option value="villa">Luxury Villa</option>
                          <option value="estate">Private Orchard Estate</option>
                          <option value="chalet">Alpine Ski Chalet</option>
                          <option value="houseboat">Cedar Houseboat</option>
                          <option value="penthouse">Executive Penthouse</option>
                          <option value="heritage_manor">Heritage Manor</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">Hub Region</label>
                        <select
                          value={destinationHub}
                          onChange={(e) => setDestinationHub(e.target.value)}
                          className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-semibold"
                        >
                          <option value="Kashmir">Kashmir (Srinagar / Gulmarg / Pahalgam)</option>
                          <option value="Delhi-NCR">Delhi NCR (Noida / Gurugram)</option>
                          <option value="Patna">Patna (Mithila / Ganges)</option>
                          <option value="Bengaluru">Bengaluru (Karnataka)</option>
                          <option value="Kerala">Kerala (Kumarakom / Backwaters)</option>
                          <option value="Global">Global (Dubai / London)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Gulmarg, Baramulla"
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Full Physical Address</label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        placeholder="e.g. Upper Circular Road, near Gondola Base, Gulmarg"
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Catchy One-Line Tagline</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Ski-in / ski-out luxury timber chalet with heated outdoor hot tub"
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Capacity */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-[#17233B]">
                    Accommodations &amp; Space
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Bedrooms</label>
                      <input
                        type="number"
                        min="1"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Beds</label>
                      <input
                        type="number"
                        min="1"
                        value={beds}
                        onChange={(e) => setBeds(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Bathrooms</label>
                      <input
                        type="number"
                        min="1"
                        value={baths}
                        onChange={(e) => setBaths(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Max Guests</label>
                      <input
                        type="number"
                        min="1"
                        value={maxGuests}
                        onChange={(e) => setMaxGuests(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Verified Wi-Fi Fiber Speed (Mbps)</label>
                    <input
                      type="number"
                      value={wifiSpeed}
                      onChange={(e) => setWifiSpeed(Number(e.target.value))}
                      className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Amenities */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-[#17233B]">
                    Amenities &amp; Features
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Bukhari (Wood Fireplace)',
                      'High-Speed Wi-Fi',
                      'Private Lawn / Garden',
                      'Secure Gated Parking',
                      'Chef Kitchen',
                      'Outdoor Cedar Hot Tub',
                      'Ski-in / Ski-out Access',
                      'Silent Generator Backup',
                      'River / Lake Frontage',
                      'Pet Friendly',
                    ].map((amenity) => {
                      const checked = selectedAmenities.includes(amenity)
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                            checked
                              ? 'bg-[#176B68]/10 border-[#176B68] text-[#17233B]'
                              : 'bg-white border-stone-200 text-stone-600'
                          }`}
                        >
                          {checked ? '✓ ' : '+ '} {amenity}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Pricing */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-serif text-lg font-bold text-[#17233B]">
                    Nightly Rates &amp; Policies
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Base Nightly Tariff (₹) *</label>
                      <input
                        type="number"
                        step="500"
                        value={nightlyRate}
                        onChange={(e) => setNightlyRate(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-mono font-bold text-base text-[#17233B]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Cleaning Fee (₹)</label>
                      <input
                        type="number"
                        step="250"
                        value={cleaningFee}
                        onChange={(e) => setCleaningFee(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-mono font-bold text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Cancellation Policy</label>
                      <select
                        value={cancellationPolicy}
                        onChange={(e) => setCancellationPolicy(e.target.value)}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-semibold"
                      >
                        <option value="Flexible">Flexible (Full refund up to 48h prior)</option>
                        <option value="Moderate">Moderate (Full refund up to 5 days prior)</option>
                        <option value="Strict">Strict (50% refund up to 7 days prior)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">Instant Booking</label>
                      <select
                        value={instantBook ? 'true' : 'false'}
                        onChange={(e) => setInstantBook(e.target.value === 'true')}
                        className="w-full p-3 rounded-xl border border-stone-200 bg-[#FAF8F5] font-semibold"
                      >
                        <option value="true">Enable Instant Booking</option>
                        <option value="false">Require Host Pre-Approval</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Nav Controls */}
              <div className="pt-4 border-t border-stone-200 flex justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                  >
                    ← Back
                  </button>
                ) : <div />}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="py-2.5 px-6 bg-[#17233B] hover:bg-[#1E3048] text-white font-bold rounded-xl shadow-xs"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-8 bg-[#C9A45C] hover:bg-[#b89347] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Listing for Audit'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Earnings Estimator & Platform Advantage */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#17233B] text-white p-6 rounded-3xl space-y-4 shadow-lg border border-[#C9A45C]/30">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                Estimated Host Earnings
              </span>
              <div>
                <span className="font-mono text-3xl font-black block text-white">
                  ₹{estimatedMonthlyRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-stone-300">
                  Est. Net Monthly Payout (at 65% occupancy)
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Nightly Rate:</span>
                  <span className="font-mono font-bold text-white">₹{nightlyRate.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="text-emerald-400 font-bold">Only 3% (vs 15% Airbnb)</span>
                </div>
                <div className="flex justify-between">
                  <span>Guest Payout Cycle:</span>
                  <span className="font-bold text-white">T+24h post check-in</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-white rounded-3xl border border-[#E7E2D9] space-y-3 text-xs text-stone-700">
              <strong className="block text-[#17233B] font-bold">Why Host on Nuty Tales Stays?</strong>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Free professional architectural photoshoot</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Corporate offsite and high-net-worth traveler demand</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>Dedicated property manager assistance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
