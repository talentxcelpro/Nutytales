'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import CraftsSwatchAndConsignmentDesk from '@/components/crafts/CraftsSwatchAndConsignmentDesk'

export default function CraftsWholesalePage() {
  const [buyerType, setBuyerType] = useState('Luxury Boutique / Retailer')
  const [category, setCategory] = useState('GI-Certified Pashmina Shawls')
  const [volume, setVolume] = useState('50 - 150 units')
  const [buyerName, setBuyerName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [country, setCountry] = useState('United Kingdom')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rfqRef, setRfqRef] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'b2b_rfq',
          vertical: 'crafts',
          customerName: buyerName,
          companyName: companyName,
          customerPhone: phone,
          customerEmail: email,
          deliveryCity: country,
          targetBudget: 250000,
          currency: 'INR',
          notes: `Buyer Type: ${buyerType} | Category: ${category} | Volume: ${volume} | Country: ${country} | Specs: ${notes}`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setRfqRef(data.opportunityId)
      } else {
        setErrorMsg(data.error || 'Failed to submit wholesale RFQ.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Breadcrumb & Header ───────────────────────────────────────────────── */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-xs font-semibold tracking-wide">
          <span>🧣 NUTTY TALES CRAFTS — WHOLESALE &amp; EXPORT DESK</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
          B2B Artisan Sourcing &amp; Global Export Procurement
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed">
          &quot;I need 200 shawls for our London boutique.&quot; Direct sourcing from certified Kashmiri master artisans and handloom guilds. We structure sample swatches, official GI-tag authenticity documentation, and insured door-to-door air freight worldwide.
        </p>
      </div>

      {/* Immediate Revenue: Swatch Box & Cashmere Authenticity Kit */}
      <CraftsSwatchAndConsignmentDesk />

      {rfqRef ? (
        <div className="bg-amber-50 border-2 border-[#C9A45C] rounded-3xl p-8 sm:p-12 text-center space-y-5 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#17233B] text-[#C9A45C] flex items-center justify-center text-3xl font-bold mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Wholesale Procurement RFQ Created!
          </h2>
          <div className="inline-block px-4 py-2 bg-white rounded-xl font-mono text-sm font-bold text-[#17233B] border border-[#C9A45C]">
            Wholesale Ref: {rfqRef}
          </div>
          <p className="text-xs sm:text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            Our export trade desk has assigned your requirement to verified cooperative handloom guilds in Kanihama and Zadibal. A formal export quotation with swatch dispatch tracking will be sent within 6 hours.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/crafts/dashboard"
              className="px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              View in Crafts Dashboard →
            </Link>
            <button
              onClick={() => setRfqRef(null)}
              className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-lg font-bold text-[#17233B] border-b border-stone-100 pb-3 flex items-center gap-2">
              <span>⚡</span> Request Wholesale / Export Quotation
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Company / Boutique Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Mayfair Heritage Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@brand.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 20 7123 4567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Buyer Category</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white"
                  >
                    <option value="Luxury Boutique / Retailer">Luxury Boutique / Retailer</option>
                    <option value="Fashion Brand / Private Label">Fashion Brand / Private Label</option>
                    <option value="Interior Designer / Architect">Interior Designer / Architect</option>
                    <option value="Hospitality / Luxury Hotel">Hospitality / Luxury Hotel Chain</option>
                    <option value="Corporate Gifting Desk">Corporate Gifting Desk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Destination Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                  >
                    <option value="United Kingdom">United Kingdom (London Hub)</option>
                    <option value="UAE">UAE (Dubai / Abu Dhabi)</option>
                    <option value="United States">United States (New York / LA)</option>
                    <option value="Germany / EU">Germany / European Union</option>
                    <option value="India">India (Domestic Commercial)</option>
                    <option value="Saudi Arabia">Saudi Arabia (Riyadh / Jeddah)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                  >
                    <option value="GI-Certified Pashmina Shawls">GI-Certified Changthangi Pashmina Shawls</option>
                    <option value="Kani Heritage Weave Stoles">Kani Heritage Weave Stoles</option>
                    <option value="Hand-Embroidered Pure Wool Pherans">Hand-Embroidered Pure Wool Pherans</option>
                    <option value="Aari Velvet Tailored Jackets">Aari Velvet Tailored Jackets &amp; Coats</option>
                    <option value="Carved Walnut Wood Boxes">Carved Walnut Wood Boxes &amp; Homeware</option>
                    <option value="Pure Silk Kashmiri Carpets">Pure Silk Hand-Knotted Carpets</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Required Volume</label>
                  <select
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white font-bold text-[#17233B]"
                  >
                    <option value="25 - 50 units (Sample Run)">25 - 50 units (Sample Run · MOQ 25)</option>
                    <option value="50 - 150 units">50 - 150 units (Boutique Tier)</option>
                    <option value="150 - 500 units">150 - 500 units (Wholesale Tier)</option>
                    <option value="500+ units">500+ units (Enterprise Contract)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Custom Embroidery / Color Palette / Labeling Specs
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention colorways, preferred microns (14.5µm Pashmina vs Merino), custom woven label requirements, or target delivery date..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#C9A45C] focus:outline-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-800">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Dispatching to Guilds...' : '⚡ Submit Wholesale RFQ & Request Swatch Box →'}
              </button>
            </form>
          </div>

          {/* Right Trust & Specifications Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#10192A] text-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/30 shadow-lg space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C] block">
                Evidence-Backed Quality Assurance
              </span>
              <h3 className="font-serif text-xl font-bold">
                The Nutty Tales Provenance Guarantee
              </h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                We never make unverified artisan claims. Every wholesale consignment is backed by legal provenance documentation and microscopic testing:
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-[#C9A45C] block">🏛️ Official GI Tag QR-Code</span>
                  <p className="text-stone-300 text-[11px]">
                    Issued by the Govt. of J&amp;K Handicrafts Quality Control Laboratory certifying pure Changthangi goat fiber under 15 microns.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-[#C9A45C] block">📦 Insured Duty-Paid Export Logistics</span>
                  <p className="text-stone-300 text-[11px]">
                    Door-to-door delivery with air courier partners (DHL / FedEx Express), complete with Certificate of Origin and clean customs clearance.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="font-bold text-[#C9A45C] block">🧵 Direct Guild Cooperatives</span>
                  <p className="text-stone-300 text-[11px]">
                    Zero middle-men. Direct pricing from 14 registered master artisan cooperatives in Kanihama, Zadibal, and Charar-i-Sharief.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
