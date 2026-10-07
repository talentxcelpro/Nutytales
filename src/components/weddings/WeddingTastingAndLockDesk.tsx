'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function WeddingTastingAndLockDesk() {
  const [activeTab, setActiveTab] = useState<'tasting' | 'date-lock'>('tasting')

  // Tasting Box Form State
  const [familyNames, setFamilyNames] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [weddingDate, setWeddingDate] = useState('November - December 2026')
  const [weddingLocation, setWeddingLocation] = useState('Delhi-NCR / Royal Rajasthan')
  const [isOrderingTasting, setIsOrderingTasting] = useState(false)
  const [tastingSuccess, setTastingSuccess] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Date Lock Form State
  const [targetFavours, setTargetFavours] = useState(350)
  const [exactDate, setExactDate] = useState('2026-11-20')
  const [monogramInitials, setMonogramInitials] = useState('R & S')
  const [isLockingDate, setIsLockingDate] = useState(false)
  const [lockSuccess, setLockSuccess] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleOrderTasting = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsOrderingTasting(true)

    const ref = `SAMPLE-WED-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wedding_tasting_trunk',
          vertical: 'weddings',
          referenceId: ref,
          customer: {
            fullName: contactName,
            companyName: familyNames ? `Family of ${familyNames}` : 'Wedding Client',
            phone,
            email,
            address: deliveryAddress,
            city: weddingLocation,
          },
          items: [
            {
              name: 'Royal Trousseau Tasting & Monogram Trunk (Mamra, Walnuts, Kehwa, Saffron, Velvet Swatches)',
              qty: 1,
              price: 1850,
            },
          ],
          total: 1850,
          paymentMethod: 'razorpay_instant',
          notes: `Wedding Date: ${weddingDate} | Destination: ${weddingLocation} | 100% credited against wedding favour order`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setTastingSuccess(ref)
      } else {
        setErrorMsg(data.error || 'Failed to order tasting trunk.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsOrderingTasting(false)
    }
  }

  const handleLockDate = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsLockingDate(true)

    const ref = `LOCK-WED-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wedding_date_lock_deposit',
          vertical: 'weddings',
          referenceId: ref,
          customer: {
            fullName: contactName,
            companyName: familyNames ? `Family of ${familyNames}` : 'Wedding Client',
            phone,
            email,
            address: deliveryAddress,
            city: weddingLocation,
          },
          items: [
            {
              name: `Wedding Date & Master Gifting Slot Lock Deposit (${targetFavours} Favours · Monogram: ${monogramInitials})`,
              qty: 1,
              price: 15000,
            },
          ],
          total: 15000,
          paymentMethod: 'razorpay_instant',
          notes: `Exact Date: ${exactDate} | Monogram: ${monogramInitials} | 100% Adjusted against final wedding invoice`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setLockSuccess(ref)
      } else {
        setErrorMsg(data.error || 'Failed to reserve wedding date slot.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsLockingDate(false)
    }
  }

  return (
    <div id="wedding-cashflow-desk" className="bg-gradient-to-br from-[#10192A] via-[#211726] to-[#121B2B] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A45C]/40 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] text-xs font-bold uppercase tracking-widest border border-[#C9A45C]/30">
            <span>💍</span> BESPOKE WEDDING REVENUE &amp; RESERVATION DESK
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Taste &amp; Feel at Home: <span className="text-[#C9A45C]">Order Royal Tasting Trunk</span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            Luxury destination weddings in Kashmir, Delhi-NCR, or Rajasthan require impeccable tactile proof. Order the curated Royal Trousseau Tasting Trunk for <strong>₹1,850</strong> (100% credited against your wedding order), or lock your wedding date and master artisan guild with a <strong>₹15,000 priority deposit</strong>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-white/10 p-1 rounded-2xl border border-white/15 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('tasting')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'tasting'
                ? 'bg-[#C9A45C] text-[#17233B] shadow-lg'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            🧳 Tasting Trunk (₹1,850)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('date-lock')}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === 'date-lock'
                ? 'bg-[#C9A45C] text-[#17233B] shadow-lg'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            🔒 Lock Wedding Slot (₹15,000)
          </button>
        </div>
      </div>

      {/* ── Tab 1: Tasting Trunk ──────────────────────────────────────────────── */}
      {activeTab === 'tasting' && (
        <div>
          {tastingSuccess ? (
            <div className="bg-[#17233B] border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
                ✓
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                Royal Tasting Trunk Confirmed &amp; Queued for 24h Courier!
              </h3>
              <p className="font-mono text-sm text-[#C9A45C] bg-white/5 py-1.5 px-4 rounded-lg inline-block border border-white/10">
                Tasting Ref: {tastingSuccess} · ₹1,850 (100% Credited on Wedding Order)
              </p>
              <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                Dispatched directly to your family residence via Blue Dart Air. Includes glass tasting jars of Mamra almonds, walnut kernels, Pampore Mongra saffron, authentic Kashmiri Kehwa whole spice blend, and 6 bespoke box velvet/paperboard material swatches.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nutty Tales Wedding Concierge! I just ordered Royal Tasting Trunk (Ref: ${tastingSuccess}) for our upcoming celebration. Please share delivery tracking.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  WhatsApp Wedding Concierge →
                </a>
                <button
                  type="button"
                  onClick={() => setTastingSuccess(null)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-bold rounded-xl"
                >
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: What is in the trunk */}
              <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
                    Family Tasting Experience
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
                    Dispatched in 24 Hours
                  </span>
                </div>

                <div className="border-b border-white/10 pb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-serif text-white">₹1,850</span>
                    <span className="text-xs text-stone-400">All-Inclusive (Door-Delivered)</span>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                    ✓ 100% (₹1,850) deducted directly against your final wedding favour invoice
                  </p>
                </div>

                <div className="space-y-2 text-xs text-stone-200">
                  <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
                    Contents of Your Royal Trunk:
                  </span>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>100g Kashmiri Mamra Badam:</strong> Cold-climate high-oil crunchy kernels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>100g Harwan Kagzi Walnuts:</strong> Extra-light hand-cracked halves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>1g Pampore GI Mongra Saffron:</strong> Certified Grade A1 red stigmas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>50g Traditional Samovar Kehwa Blend:</strong> Whole green tea, cardamom, cinnamon</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#C9A45C] font-bold">•</span>
                      <span><strong>Material &amp; Monogram Swatch Card:</strong> Velvet, linen, gold foil, and brass seal samples</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-white/10 text-[11px] text-stone-300 space-y-1">
                  <div className="text-[#C9A45C] font-bold">Tri-Hub Wedding Logistics Corridor:</div>
                  <div>• Origin: Kashmir Harwan &amp; Srinagar artisan guilds</div>
                  <div>• Coordination: Delhi-NCR Executive Wedding Studio</div>
                  <div>• Eastern Heritage: Patna Mithila Makhana celebration sweets</div>
                </div>
              </div>

              {/* Right: Quick Order Form */}
              <div className="lg:col-span-7 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
                  <span>Enter Family Residence Address for Tasting Trunk</span>
                  <span className="text-xs font-mono text-[#C9A45C]">24h Dispatch</span>
                </h3>

                <form onSubmit={handleOrderTasting} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Family / Couple Names *</label>
                      <input
                        type="text"
                        required
                        value={familyNames}
                        onChange={(e) => setFamilyNames(e.target.value)}
                        placeholder="e.g. Kapoor &amp; Mehra Wedding"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Point of Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Full Name (Bride / Groom / Parent)"
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
                      <label className="block text-stone-300 font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="wedding@family.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Target Wedding Timeline</label>
                      <input
                        type="text"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        placeholder="e.g. November 2026"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Celebration Destination</label>
                      <select
                        value={weddingLocation}
                        onChange={(e) => setWeddingLocation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                      >
                        <option value="Delhi-NCR / Gurgaon">Delhi-NCR / Gurgaon</option>
                        <option value="Kashmir (Srinagar / Gulmarg)">Kashmir (Srinagar / Dal Lake / Gulmarg)</option>
                        <option value="Rajasthan (Udaipur / Jaipur / Jodhpur)">Rajasthan (Udaipur / Jaipur / Jodhpur)</option>
                        <option value="Patna / Eastern India">Patna / Eastern India Heritage</option>
                        <option value="Goa Beach Destination">Goa Beach Destination</option>
                        <option value="Dubai / Abu Dhabi International">Dubai / Abu Dhabi International</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Delivery Address for Tasting Trunk *</label>
                    <textarea
                      rows={2}
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Street address, city, state, pincode for express courier delivery..."
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
                      disabled={isOrderingTasting}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C9A45C] to-[#E6CA85] hover:from-[#b5924d] hover:to-[#C9A45C] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50"
                    >
                      {isOrderingTasting
                        ? 'Dispatching Tasting Trunk...'
                        : 'Order Royal Tasting Trunk (₹1,850) — Dispatched in 24h →'}
                    </button>
                    <p className="text-[11px] text-stone-400 text-center mt-2">
                      100% of ₹1,850 credited on wedding order · Razorpay / UPI / NetBanking
                    </p>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Date Lock Deposit ─────────────────────────────────────────── */}
      {activeTab === 'date-lock' && (
        <div>
          {lockSuccess ? (
            <div className="bg-[#17233B] border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
                💍
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                Wedding Celebration Slot &amp; Artisan Guild Reserved!
              </h3>
              <p className="font-mono text-sm text-[#C9A45C] bg-white/5 py-1.5 px-4 rounded-lg inline-block border border-white/10">
                Reservation Token: {lockSuccess} · ₹15,000 (100% Adjusted Against Wedding Order)
              </p>
              <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
                Your wedding date of <strong>{exactDate}</strong> for <strong>{targetFavours} bespoke favours</strong> with monogram <strong>&quot;{monogramInitials}&quot;</strong> is officially locked in our master artisan craft schedule. Our Senior Wedding Stylist will reach out within 2 hours.
              </p>
              <div className="pt-3 flex justify-center gap-3">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nutty Tales Wedding Concierge! We just locked our wedding gifting slot (Ref: ${lockSuccess}) for date ${exactDate}. Please connect us with our assigned Senior Wedding Stylist.`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Connect with Wedding Stylist →
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C] block">
                  Why Lock Your Wedding Slot?
                </span>
                <h3 className="font-serif text-xl font-bold text-white">
                  Reserve Handcrafted Master Guild Capacity
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  Each hand-carved walnut wood casket and bespoke hot-foil embossed trunk requires 4–6 weeks of dedicated guild craftsmanship in Srinagar.
                </p>
                <div className="space-y-2 text-xs text-stone-200">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-[#C9A45C] block">🎨 Dedicated Artisan Guild:</strong>
                    <span>Guaranteed master craftsman allocation for your custom family monogram &amp; box dies.</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-emerald-400 block">🌾 Autumn Harvest Reserve:</strong>
                    <span>Direct batch hold on fresh 2026 Pampore Saffron &amp; Harwan Mamra kernels.</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <strong className="text-stone-300 block">💰 100% Adjusted on Invoice:</strong>
                    <span>Your ₹15,000 reservation deposit is deducted directly from your final wedding order.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">
                  Reserve Wedding Gifting Slot (₹15,000 Deposit)
                </h3>

                <form onSubmit={handleLockDate} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Family / Couple Names *</label>
                      <input
                        type="text"
                        required
                        value={familyNames}
                        onChange={(e) => setFamilyNames(e.target.value)}
                        placeholder="e.g. Kapoor &amp; Mehra"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Contact Person *</label>
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
                      <label className="block text-stone-300 font-medium mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="wedding@family.com"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Target Favours</label>
                      <input
                        type="number"
                        min={50}
                        step={25}
                        value={targetFavours}
                        onChange={(e) => setTargetFavours(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Wedding Date</label>
                      <input
                        type="date"
                        value={exactDate}
                        onChange={(e) => setExactDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">Monogram Initials</label>
                      <input
                        type="text"
                        value={monogramInitials}
                        onChange={(e) => setMonogramInitials(e.target.value)}
                        placeholder="e.g. R &amp; S"
                        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                      />
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
                      disabled={isLockingDate}
                      className="w-full py-3.5 bg-gradient-to-r from-[#C9A45C] to-[#E6CA85] hover:from-[#b5924d] hover:to-[#C9A45C] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50"
                    >
                      {isLockingDate
                        ? 'Reserving Artisan Guild Slot...'
                        : 'Lock Wedding Slot & Custom Guild (₹15,000 Deposit) →'}
                    </button>
                    <p className="text-[11px] text-stone-400 text-center mt-2">
                      100% of ₹15,000 credited on final wedding invoice · Senior Stylist assigned immediately
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
