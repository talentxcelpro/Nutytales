'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function TravelActivationDepositDesk() {
  const [leadTraveller, setLeadTraveller] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [departureCity, setDepartureCity] = useState('Delhi / NCR')
  const [destinationCorridor, setDestinationCorridor] = useState('Kashmir Alpine (Gulmarg & Dal Lake)')
  const [travelDates, setTravelDates] = useState('December 2026 - January 2027')
  const [travellerCount, setTravellerCount] = useState(4)
  const [specialRequests, setSpecialRequests] = useState('Gulmarg Phase 1 & 2 Ski Gondola passes + 4x4 snow vehicle')

  const [isDepositing, setIsDepositing] = useState(false)
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.TRAVEL || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsDepositing(true)

    const ref = `TRIP-LOCK-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'travel_activation_deposit',
          vertical: 'travel',
          referenceId: ref,
          customer: {
            fullName: leadTraveller,
            phone,
            email,
            city: departureCity,
          },
          items: [
            {
              name: `VIP Journey Activation & Mountain Pass Lock Deposit (${travellerCount} Travellers · ${destinationCorridor})`,
              qty: 1,
              price: 10000,
            },
          ],
          total: 10000,
          paymentMethod: 'razorpay_instant',
          notes: `Departure: ${departureCity} | Corridor: ${destinationCorridor} | Dates: ${travelDates} | Specs: ${specialRequests} | 100% credited against final booking`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setDepositSuccess(ref)
      } else {
        setErrorMsg(data.error || 'Failed to process travel activation deposit.')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
    } finally {
      setIsDepositing(false)
    }
  }

  return (
    <div id="travel-deposit-desk" className="bg-gradient-to-br from-[#10192A] via-[#16273C] to-[#0E1A29] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A45C]/40 shadow-2xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] text-xs font-bold uppercase tracking-widest border border-[#C9A45C]/30">
            <span>🏔️</span> VIP JOURNEY ACTIVATION &amp; CONCIERGE DESK
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Lock High-Altitude Vehicles &amp; Gondola Passes: <span className="text-[#C9A45C]">Instant ₹10,000 Activation</span>
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-3xl leading-relaxed font-light">
            During peak snow and autumn seasons, 4x4 mountain vehicles and Gulmarg Gondola slots book out weeks in advance. Place a <strong>₹10,000 refundable planning deposit</strong> to guarantee vehicle priority, ski passes, and dedicated 24/7 mountain concierge. <strong>100% credited against your final itinerary</strong>.
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-xs uppercase font-bold text-[#C9A45C] tracking-wider">Refundable Planning Credit</div>
          <div className="text-lg font-serif font-bold text-white">100% PO Adjustment</div>
        </div>
      </div>

      {depositSuccess ? (
        <div className="bg-[#17233B] border-2 border-emerald-500 rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl font-bold mx-auto">
            ✓
          </div>
          <h3 className="text-xl font-bold font-serif text-white">
            Journey Activation Deposit Received &amp; Fleet Allocated!
          </h3>
          <p className="font-mono text-sm text-[#C9A45C] bg-white/5 py-1.5 px-4 rounded-lg inline-block border border-white/10">
            Activation Ref: {depositSuccess} · ₹10,000 (100% Credited on Itinerary)
          </p>
          <p className="text-xs text-stone-300 max-w-xl mx-auto leading-relaxed">
            Your dedicated 4x4 vehicle fleet and high-priority travel queue for <strong>{destinationCorridor}</strong> are officially locked. Your Senior Mountain Concierge will reach out via WhatsApp within 30 minutes to review your custom day-by-day plan.
          </p>
          <div className="pt-3 flex justify-center gap-3">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales Travel Concierge! I just placed VIP Journey Activation Deposit (Ref: ${depositSuccess}) for ${destinationCorridor}. Please connect with my assigned journey specialist.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              WhatsApp Travel Concierge →
            </a>
            <button
              type="button"
              onClick={() => setDepositSuccess(null)}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-bold rounded-xl"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: What does the deposit guarantee? */}
          <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
                Exclusive Concierge Guarantees
              </span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded font-bold">
                100% Credited
              </span>
            </div>

            <div className="border-b border-white/10 pb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold font-serif text-white">₹10,000</span>
                <span className="text-xs text-stone-400">Refundable Journey Deposit</span>
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                ✓ Deducted 100% from your final itinerary confirmation bill
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-stone-200">
              <span className="font-bold text-white block text-[11px] uppercase tracking-wider">
                What Your Deposit Unlocks Immediately:
              </span>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>Dedicated 4x4 Mountain Fleet Lock:</strong> Chained snow-ready Toyota Fortuner / Innova Crysta with veteran mountain chauffeur</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>Gondola Phase 1 &amp; 2 Pass Concierge:</strong> Direct coordination for sold-out high-altitude ski passes in Gulmarg</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>Airport VIP Meet &amp; Greet:</strong> Direct tarmac arrival assistance at Srinagar or Delhi Terminal 3</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold">•</span>
                  <span><strong>Curated Wazwan &amp; Shikara Slots:</strong> Reserved sunrise Dal Lake shikara and private estate banquet</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-stone-300 space-y-1">
              <div className="text-[#C9A45C] font-bold">The Connected Tri-Hub Axis:</div>
              <div>• Kashmir Origin: Harwan, Gulmarg &amp; Dal Lake ground teams</div>
              <div>• Delhi/NCR: Executive Transit, Terminal 3 Chauffeur Fleet</div>
              <div>• Patna Hub: Heritage Eastern Gangetic river &amp; culture circuits</div>
            </div>
          </div>

          {/* Right: Quick Activation Form */}
          <div className="lg:col-span-7 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
              <span>Reserve Mountain Fleet &amp; Journey Concierge</span>
              <span className="text-xs font-mono text-[#C9A45C]">Instant Confirmation</span>
            </h3>

            <form onSubmit={handleDeposit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Lead Traveller Name *</label>
                  <input
                    type="text"
                    required
                    value={leadTraveller}
                    onChange={(e) => setLeadTraveller(e.target.value)}
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
                  <label className="block text-stone-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="traveller@email.com"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Departure City *</label>
                  <input
                    type="text"
                    required
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="e.g. Delhi-NCR / Mumbai / London"
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-300 font-medium mb-1">Destination Corridor</label>
                  <select
                    value={destinationCorridor}
                    onChange={(e) => setDestinationCorridor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#17233B] border border-white/20 text-white"
                  >
                    <option value="Kashmir Alpine (Gulmarg & Dal Lake)">Kashmir Alpine (Gulmarg &amp; Dal Lake)</option>
                    <option value="Pahalgam Valleys & Aru Wildlife">Pahalgam Valleys &amp; Aru Wildlife</option>
                    <option value="Ladakh High-Altitude Mountain Passes">Ladakh High-Altitude Mountain Passes</option>
                    <option value="Delhi-NCR Executive Heritage & Agra Express">Delhi-NCR Executive Heritage &amp; Agra Express</option>
                    <option value="Patna & Gangetic Spiritual Heritage">Patna &amp; Gangetic Spiritual Heritage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Travellers</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={travellerCount}
                    onChange={(e) => setTravellerCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Travel Dates / Season</label>
                <input
                  type="text"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                  placeholder="e.g. 15–22 December 2026"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Special Preferences (Skiing, Meals, Stays)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Mention ski level, food preferences (Wazwan / Vegetarian), hotel choices..."
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
                  disabled={isDepositing}
                  className="w-full py-3.5 bg-gradient-to-r from-[#C9A45C] to-[#E6CA85] hover:from-[#b5924d] hover:to-[#C9A45C] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl disabled:opacity-50"
                >
                  {isDepositing
                    ? 'Processing Journey Allocation...'
                    : 'Activate Journey & Lock Vehicles (₹10,000 Deposit) →'}
                </button>
                <p className="text-[11px] text-stone-400 text-center mt-2">
                  100% credited against your final booking · Dedicated concierge assigned within 30 mins
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
