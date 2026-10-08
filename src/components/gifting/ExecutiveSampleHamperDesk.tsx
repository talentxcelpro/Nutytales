'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function ExecutiveSampleHamperDesk() {
  const [activeTab, setActiveTab] = useState<'sample' | 'lock'>('sample')

  // Sample Box State
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [brandingNeed, setBrandingNeed] = useState('Hot-Foil Gold Logo on Lid')
  const [isOrderingSample, setIsOrderingSample] = useState(false)
  const [sampleSuccess, setSampleSuccess] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Allocation Lock State
  const [lockTargetUnits, setLockTargetUnits] = useState(250)
  const [lockFestiveDate, setLockFestiveDate] = useState('Diwali 2026 (Oct 20-25)')
  const [isLockingSlot, setIsLockingSlot] = useState(false)
  const [lockSuccess, setLockSuccess] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleOrderSample = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsOrderingSample(true)

    const ref = `SAMPLE-GIFT-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sample_box',
          vertical: 'gifting',
          referenceId: ref,
          customer: {
            fullName: contactName,
            companyName,
            phone,
            email,
            address,
            city: 'Pan-India Express',
          },
          items: [
            {
              name: 'Executive Diwali Gifting Sample Hamper (4 Luxury Jars + Custom Branding Swatches)',
              qty: 1,
              price: 1499,
            },
          ],
          total: 1499,
          paymentMethod: 'razorpay_instant',
          notes: `Branding preference: ${brandingNeed} | 100% PO Credit Guarantee applicable`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSampleSuccess(ref)
      } else {
        setErrorMsg(data.error || 'Failed to place sample hamper order.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsOrderingSample(false)
    }
  }

  const handleLockSlot = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsLockingSlot(true)

    const ref = `LOCK-GIFT-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'production_slot_deposit',
          vertical: 'gifting',
          referenceId: ref,
          customer: {
            fullName: contactName,
            companyName,
            phone,
            email,
            address,
            city: 'Priority Corporate Queue',
          },
          items: [
            {
              name: `Festive Production Slot Lock Deposit (${lockTargetUnits} Units · ${lockFestiveDate})`,
              qty: 1,
              price: 9999,
            },
          ],
          total: 9999,
          paymentMethod: 'razorpay_instant',
          notes: `Target Units: ${lockTargetUnits} | Festive Window: ${lockFestiveDate} | 100% Deposit Adjusted Against Final Invoice`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setLockSuccess(ref)
      } else {
        setErrorMsg(data.error || 'Failed to reserve production slot.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsLockingSlot(false)
    }
  }

  return (
    <div id="gifting-cashflow-desk" className="bg-gradient-to-br from-[#10192A] via-[#1A263D] to-[#121B2B] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A45C]/40 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] text-xs font-bold uppercase tracking-widest border border-[#C9A45C]/30">
            <span>🎁</span> IMMEDIATE CORPORATE CASHFLOW &amp; ALLOCATION DESK
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Present to Your Board Tomorrow: <span className="text-[#C9A45C]">Order Physical Sample Trunk</span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            Don&apos;t pitch a digital PDF to your leadership. Order the finished Executive Sample Hamper for <strong>₹1,499</strong> (100% credited against your bulk order), or lock your corporate production slot with a <strong>₹9,999 priority deposit</strong> before harvest quotas fill.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/10 p-1 rounded-2xl border border-white/15 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('sample')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'sample'
                ? 'bg-[#C9A45C] text-[#17233B] shadow-lg'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            📦 Physical Sample Hamper (₹1,499)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lock')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'lock'
                ? 'bg-[#C9A45C] text-[#17233B] shadow-lg'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            🔒 Reserve Festive Slot (₹9,999)
          </button>
        </div>
      </div>

      {/* ── Tab 1: Physical Sample Box ────────────────────────────────────────── */}
      {activeTab === 'sample' && (
        <div>
          {sampleSuccess ? (
            <div className="bg-[#17233B] border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
                ✓
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                Executive Sample Hamper Confirmed &amp; Queued for 24h Courier!
              </h3>
              <p className="font-mono text-sm text-[#C9A45C] bg-white/5 py-1.5 px-4 rounded-lg inline-block border border-white/10">
                Sample Order Ref: {sampleSuccess} · ₹1,499 (100% PO Credit Guaranteed)
              </p>
              <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                Dispatched within 24 hours from our <strong>Noida Sector 62 Corporate Showroom</strong> via Blue Dart Air. Your physical box contains 4 premium glass jars, gold lid foil stamping swatches, and a ₹1,499 credit voucher valid on orders of 25+ hampers.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales Corporate Concierge! I just ordered Executive Sample Hamper (Ref: ${sampleSuccess}). Please share delivery tracking.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  WhatsApp Gifting Concierge →
                </a>
                <button
                  type="button"
                  onClick={() => setSampleSuccess(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-bold rounded-xl"
                >
                  Order Another Sample
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Box Details */}
              <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
                    Boardroom Evaluation Kit
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
                    Dispatched in 24 Hours
                  </span>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-serif text-white">₹1,499</span>
                    <span className="text-xs text-stone-400">Doorstep Express Delivery</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    ✓ 100% (₹1,499) deducted against your bulk order (&gt;25 boxes)
                  </p>
                </div>

                <div className="space-y-2 text-xs text-stone-200">
                  <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
                    Included in Your Sample Trunk:
                  </span>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>4 Full-Size Luxury Glass Jars:</strong> Kashmiri Kagzi Walnuts (150g), Mamra Badam (150g), Jumbo Cashews (150g), Arabian Medjool Dates (150g)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>Rigid Magnetic Keepsake Box:</strong> Premium textured paperboard with gold satin pull ribbon</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>Branding Swatch Folio:</strong> Hot-foil stamping samples (Gold, Rose Gold, Blind Deboss), laser engraving wood tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>100% PO Credit Voucher:</strong> Deduct ₹1,499 directly from your corporate invoice</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-stone-300 space-y-1">
                  <div className="text-[#C9A45C] font-bold">Tri-Hub Execution Guarantee:</div>
                  <div>• Delhi/NCR Hub: Noida Sector 62 Gifting Studio (Instant Dispatch)</div>
                  <div>• Kashmir Origin: Harwan Walnuts &amp; Pampore Saffron direct seal</div>
                  <div>• Patna Depot: Mithila Grade-1 Phool Makhana fresh inclusion</div>
                </div>
              </div>

              {/* Right: Quick Order Form */}
              <div className="lg:col-span-7 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
                  <span>Order Sample Box for Corporate Review</span>
                  <span className="text-xs font-mono text-[#C9A45C]">Instant Dispatch</span>
                </h3>

                <form onSubmit={handleOrderSample} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Bain &amp; Co / Tata Motors"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">HR / Procurement Lead Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98110 00000"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Official Work Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="hr@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Branding Style to Inspect in Box</label>
                    <select
                      value={brandingNeed}
                      onChange={(e) => setBrandingNeed(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                    >
                      <option value="Hot-Foil Gold Logo on Lid">Hot-Foil Metallic Gold Stamping on Box Lid</option>
                      <option value="Laser-Etched Walnut Wood Tag">Laser-Etched Natural Walnut Wood Badge</option>
                      <option value="Custom Full-Bleed Pantone Printed Sleeve">Custom Full-Bleed Pantone Printed Brand Sleeve</option>
                      <option value="Personalized CEO Wax-Sealed Greeting Card">Personalized CEO Wax-Sealed Greeting Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Office Delivery Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Corporate office address, floor, city, pincode..."
                      className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isOrderingSample}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C9A45C] to-[#E6CA85] hover:from-[#b5924d] hover:to-[#C9A45C] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50"
                    >
                      {isOrderingSample
                        ? 'Dispatching Sample Order...'
                        : 'Order Executive Sample Hamper (₹1,499) — Dispatched in 24h →'}
                    </button>
                    <p className="text-[11px] text-stone-400 text-center mt-2">
                      100% of ₹1,499 credited on PO · Instant GST Invoice · Dispatched from Noida Sector 62 Showroom
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Festive Production Slot Reservation Token ──────────────────── */}
      {activeTab === 'lock' && (
        <div>
          {lockSuccess ? (
            <div className="bg-[#17233B] border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
                🔒
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                Festive Production Slot Locked &amp; Inventory Quota Reserved!
              </h3>
              <p className="font-mono text-sm text-[#C9A45C] bg-white/5 py-1.5 px-4 rounded-lg inline-block border border-white/10">
                Reservation Token: {lockSuccess} · ₹9,999 (100% Adjusted on Final PO)
              </p>
              <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                Your capacity of <strong>{lockTargetUnits} hampers</strong> for <strong>{lockFestiveDate}</strong> is officially locked in our assembly schedule. Our senior gifting account manager will reach out within 2 hours to confirm your custom die-lines and delivery matrix.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales Corporate Concierge! I just locked festive production slot (Ref: ${lockSuccess}) for ${lockTargetUnits} units. Please assign Senior Account Director.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Connect with Assigned Director →
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C] block">
                  Why Reserve Your Slot Now?
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  Lock Early-Bird Pricing &amp; Guaranteed Festive Delivery
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  During peak Diwali and year-end cycles, raw harvest dry fruit rates rise 20–35% and packaging lines reach full capacity.
                </p>
                <div className="space-y-2 text-xs text-stone-200">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-[#C9A45C] block">🔒 Rate Lock Guarantee:</strong>
                    <span>Freezes today’s wholesale pricing on Kashmir Walnuts, Mamra &amp; Saffron.</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-emerald-400 block">🚚 Guaranteed Dispatch Slot:</strong>
                    <span>Priority multi-address courier scheduling to 200+ cities without festive delays.</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-stone-300 block">💰 100% Fully Credited:</strong>
                    <span>Your ₹9,999 deposit is directly deducted from your final commercial invoice.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">
                  Reserve Corporate Production Capacity (₹9,999 Deposit)
                </h3>

                <form onSubmit={handleLockSlot} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Organization Name"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Contact Officer *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Mobile / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98110 00000"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="official@company.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Target Quantity (Units)</label>
                      <input
                        type="number"
                        min={50}
                        step={25}
                        value={lockTargetUnits}
                        onChange={(e) => setLockTargetUnits(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Target Festive Window</label>
                      <select
                        value={lockFestiveDate}
                        onChange={(e) => setLockFestiveDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                      >
                        <option value="Diwali 2026 (Oct 20-25)">Diwali 2026 (Oct 20-25 Dispatch)</option>
                        <option value="Pre-Diwali VIP (Oct 10-15)">Pre-Diwali VIP Window (Oct 10-15)</option>
                        <option value="Year-End / New Year 2027">Year-End / New Year 2027 (Dec 15-20)</option>
                        <option value="Immediate Monthly Milestone">Immediate Monthly Corporate Milestone</option>
                      </select>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLockingSlot}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C9A45C] to-[#E6CA85] hover:from-[#b5924d] hover:to-[#C9A45C] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50"
                    >
                      {isLockingSlot
                        ? 'Reserving Production Slot...'
                        : `Lock Production Slot & Pricing (₹9,999 Deposit) →`}
                    </button>
                    <p className="text-[11px] text-stone-400 text-center mt-2">
                      100% of ₹9,999 credited on final bill · Official GST Proforma Receipt provided
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
