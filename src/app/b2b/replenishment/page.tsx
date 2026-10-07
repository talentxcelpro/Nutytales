'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BReplenishmentPage() {
  const [commodity, setCommodity] = useState('California Almonds (Sliced 1.0mm)')
  const [cadence, setCadence] = useState('Every 2 Weeks (Bi-weekly)')
  const [monthlyVolume, setMonthlyVolume] = useState('1,000 kg')
  const [plantLocation, setPlantLocation] = useState('Greater Noida / NCR')
  const [contractPeriod, setContractPeriod] = useState('6-Month Supply Lock')
  const [submitted, setSubmitted] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleContractSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <div className="space-y-3 border-b border-stone-200 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
          <span>🔄</span> SCHEDULED REPLENISHMENT &amp; PRICE LOCKS
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B]">
          Recurring Contract Supply &amp; Production Buffer
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
          Shield your factory floor against dry fruit spot market price surges. Lock in quarterly rates with automated standing orders and guaranteed warehouse buffer inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: How Recurring Contracts Work (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
            <h2 className="font-serif font-bold text-xl text-[#17233B]">
              Why Leading Food Brands Use Nuty Tales Replenishment
            </h2>

            <div className="space-y-4 text-stone-600 leading-relaxed">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-[#17233B] block">Quarterly Price Lock Guarantee</strong>
                  Never worry about festive or off-season price volatility. We contract raw tree nut allocations at fixed quarterly price points.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-[#17233B] block">Dedicated Buffer Storage in Noida Hub</strong>
                  We keep 15 days of emergency production stock pre-tested and vacuum-sealed specifically allocated to your account.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-[#17233B] block">Scheduled JIT (Just-In-Time) Dispatch</strong>
                  Deliveries arrive directly at your loading bay on your designated weekday (e.g. every Tuesday morning).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  4
                </span>
                <div>
                  <strong className="text-[#17233B] block">Flexible Adjustment Window</strong>
                  Scale volume up or down by ±20% with 7 days advance notice without penalty.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contract Configurator (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
              Contract Architect
            </span>
            <h2 className="font-serif font-bold text-xl text-[#17233B]">
              Configure Your Supply Schedule
            </h2>
            <p className="text-stone-600">
              Set your target monthly run rate and our trade desk will structure your standing agreement.
            </p>
          </div>

          <form onSubmit={handleContractSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Raw Ingredient / Cut</label>
              <input
                type="text"
                value={commodity}
                onChange={(e) => setCommodity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Delivery Frequency</label>
                <select
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-white"
                >
                  <option value="Weekly (Every Monday)">Weekly Standing Order</option>
                  <option value="Every 2 Weeks (Bi-weekly)">Bi-Weekly (Twice a Month)</option>
                  <option value="Monthly Pallet">Monthly Pallet Run</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Monthly Run Volume</label>
                <input
                  type="text"
                  value={monthlyVolume}
                  onChange={(e) => setMonthlyVolume(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Contract Duration</label>
                <select
                  value={contractPeriod}
                  onChange={(e) => setContractPeriod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none bg-white"
                >
                  <option value="3-Month Pilot">3-Month Price Lock</option>
                  <option value="6-Month Supply Lock">6-Month Strategic Lock</option>
                  <option value="Annual Framework">Annual Framework Agreement</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Plant Location / Hub</label>
                <input
                  type="text"
                  value={plantLocation}
                  onChange={(e) => setPlantLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Draft Supply Agreement Proposal
            </button>

            {submitted && (
              <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200">
                ✓ Agreement request submitted! Our supply chain director will review buffer requirements and connect via WhatsApp within 3 hours.
              </div>
            )}
          </form>

          <div className="pt-2 text-center">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales B2B! I want to establish a recurring replenishment contract for ${commodity} (${monthlyVolume}/month).`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline"
            >
              Discuss with Senior Supply Director on WhatsApp →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
