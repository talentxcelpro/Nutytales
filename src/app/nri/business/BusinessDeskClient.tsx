'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function BusinessDeskClient() {
  const [orgName, setOrgName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [serviceScope, setServiceScope] = useState('Relocation & Executive Accommodations')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim() || !contactEmail.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8C6D2D]/10 border border-[#8C6D2D]/20 text-xs text-[#8C6D2D] font-semibold">
          <span>🏢</span>
          <span>ENTERPRISE & FAMILY OFFICE PLATFORM</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#191919] tracking-tight">
          Corporate & Institutional NRI Services
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Structured operational execution in India for global corporations, international relocation agencies, family offices, and multinational enterprises managing employees and assets in India.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {[
          {
            title: 'Expat & Executive Relocation',
            desc: 'Turnkey accommodation setup, neighborhood inspections, utility clearance, and local liaison for executives relocating to Indian metros.',
            icon: '🏙️',
          },
          {
            title: 'On-Ground Supplier Audits',
            desc: 'Physical factory inspections, machinery audits, batch quality testing via NABL accredited laboratories, and supplier authenticity checks.',
            icon: '🏭',
          },
          {
            title: 'Family Office Property Portfolios',
            desc: 'Comprehensive multi-city management of commercial real estate, heritage ancestral estates, and vacant plot perimeters across India.',
            icon: '🏛️',
          },
          {
            title: 'Corporate Diaspora Gifting',
            desc: 'Multi-recipient festival and milestone hampers (handcrafted Kashmir walnut boxes, saffron, pashmina) with customized corporate brass branding.',
            icon: '🎁',
          },
          {
            title: 'Legal & Entity Incorporation',
            desc: 'Coordination with Bar Council advocates for company registration, registered office setup, GST filing, and trademark protection.',
            icon: '📜',
          },
          {
            title: 'Consolidated Global Invoicing',
            desc: 'Single unified master contract with institutional invoicing in USD, GBP, EUR, or AED. Dedicated account manager and SLA guarantees.',
            icon: '💳',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-[#EAE6DF] space-y-3 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all"
          >
            <div className="space-y-2.5">
              <span className="text-3xl p-3 rounded-2xl bg-[#F7F4EE] inline-block border border-[#EAE6DF]">{item.icon}</span>
              <h3 className="font-serif text-lg font-bold text-[#191919]">{item.title}</h3>
              <p className="text-stone-600 font-light leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Consultation Inquiry Form */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="border-b border-[#EAE6DF] pb-4">
          <h2 className="font-serif text-2xl font-bold text-[#191919]">
            Schedule an Institutional Consultation
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light mt-1">
            Our corporate solutions team will prepare a structured proposal and service level agreement (SLA).
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-center space-y-2">
            <span className="text-2xl block text-emerald-600">✓</span>
            <strong className="text-sm block">Inquiry Received</strong>
            <p className="text-stone-600 font-light">Our Head of Institutional Operations will connect with you at {contactEmail} within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="e.g. Apex Global Relocation UK"
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Contact Person Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Robert Sterling"
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Corporate Work Email *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="robert@apexrelocations.co.uk"
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Primary Scope</label>
                <select
                  value={serviceScope}
                  onChange={(e) => setServiceScope(e.target.value)}
                  className="w-full bg-[#FAF9F6] text-[#191919] p-3 rounded-xl border border-[#EAE6DF] focus:outline-none focus:border-[#8C6D2D]"
                >
                  <option value="Relocation & Executive Accommodations">Relocation & Executive Accommodations</option>
                  <option value="Supplier Audits & Factory Inspections">Supplier Audits & Factory Inspections</option>
                  <option value="Family Office Real Estate Management">Family Office Real Estate Management</option>
                  <option value="Corporate Gifting Program">Corporate Gifting Program</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Request Enterprise Proposal →
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
