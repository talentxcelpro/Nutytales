'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function OrderTrackingPage() {
  const [orderQuery, setOrderQuery] = useState('')
  const [searched, setSearched] = useState(false)
  const [trackedOrder, setTrackedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderQuery.trim()) return

    setLoading(true)
    setTimeout(() => {
      // Simulate live order tracking lookup
      const query = orderQuery.trim().toUpperCase()
      setTrackedOrder({
        orderId: query.startsWith('NT') || query.startsWith('GIFT') ? query : `NT-ORD-2026-819402`,
        recipientName: 'Valued Recipient',
        destination: 'PAN-India Express Air',
        items: ['Kashmiri Premium Dry Fruit Hamper (800g)', 'Handcrafted Keepsake Greeting Card'],
        carrier: 'Bluedart Express Air',
        awb: 'BLUEDART-AIR-' + Math.floor(10000000 + Math.random() * 90000000),
        status: 'DISPATCHED_IN_TRANSIT',
        statusText: 'Consignment in Transit — Scheduled for Priority Doorstep Delivery',
        estimatedDelivery: 'Within 24 to 48 Hours',
        currentCity: 'Transit Air Hub — New Delhi',
        steps: [
          { title: 'Order Confirmed', time: 'Yesterday, 11:30 AM', done: true },
          { title: 'Custom Inscription & Fresh Seal', time: 'Yesterday, 03:45 PM', done: true },
          { title: 'Air Cargo Dispatched', time: 'Today, 08:15 AM', done: true },
          { title: 'Out for Doorstep Delivery', time: 'Tomorrow morning', done: false },
          { title: 'Delivered with Warm Wishes', time: 'Expected by 4:00 PM', done: false },
        ],
      })
      setSearched(true)
      setLoading(false)
    }, 600)
  }

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
          Live Fulfillment Telemetry
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
          Track Your Gift Consignment
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light">
          Enter your Order Reference Number or registered mobile number to check real-time air dispatch milestones.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="e.g. NT-ORD-2026-819402 or +91 9876543210"
            className="flex-1 px-4 py-3 bg-[#FAF7F2] border border-stone-300 rounded-2xl text-xs sm:text-sm font-mono focus:bg-white focus:outline-hidden focus:border-[#0B2521]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Consignment →'}
          </button>
        </form>
      </div>

      {/* Result Card */}
      {searched && trackedOrder && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                Order Reference
              </span>
              <h3 className="font-mono text-xl font-black text-[#17233B]">{trackedOrder.orderId}</h3>
              <p className="text-xs text-stone-500 mt-0.5">Carrier: {trackedOrder.carrier} · AWB: {trackedOrder.awb}</p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                ● In Transit
              </span>
              <p className="text-xs text-stone-500 mt-1">Est. Arrival: <strong>{trackedOrder.estimatedDelivery}</strong></p>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
              Fulfillment Journey
            </span>

            <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-[#C9A45C]/40 ml-2 sm:ml-4">
              {trackedOrder.steps.map((st: any, idx: number) => (
                <div key={idx} className="relative group">
                  {/* Circle Icon */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                      st.done
                        ? 'bg-[#0B2521] text-white border-2 border-[#C9A45C]'
                        : 'bg-stone-100 text-stone-400 border border-stone-300'
                    }`}
                  >
                    {st.done ? '✓' : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <h4
                      className={`text-xs font-bold ${
                        st.done ? 'text-[#17233B]' : 'text-stone-400'
                      }`}
                    >
                      {st.title}
                    </h4>
                    <span className="text-[11px] text-stone-500">{st.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consignment Items */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 text-xs space-y-2">
            <strong className="block text-stone-700">Hamper Package Contents:</strong>
            <ul className="space-y-1 text-stone-600">
              {trackedOrder.items.map((it: string, i: number) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="text-[#C9A45C]">✦</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge Help */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-stone-600">
            <span>Need immediate address correction or delivery rescheduling?</span>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales! I need assistance with Order ${trackedOrder.orderId}`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors"
            >
              <span>💬</span>
              <span>WhatsApp Concierge Desk</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
