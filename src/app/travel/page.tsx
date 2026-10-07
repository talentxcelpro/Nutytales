'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DemandCaptureModal from '@/components/demand/DemandCaptureModal'
import SourcingRequestBanner from '@/components/demand/SourcingRequestBanner'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function TravelMarketplacePage() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState('Kashmir Valleys')
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const travelExperiences = [
    {
      title: 'Royal Srinagar & Dal Lake Shikara Expedition',
      destination: 'Srinagar, Kashmir',
      duration: '4 Days / 3 Nights',
      type: 'Private Heritage Tour',
      price: '₹28,500 / person',
      image: '/images/stays-resort.jpg',
      highlights: ['Handcrafted Houseboat Stay', 'Sunset Floating Flower Market', 'Old City Artisan Walk', 'Pampore Saffron Walk'],
    },
    {
      title: 'Gulmarg Alpine Gondola & Pine Ridge Trail',
      destination: 'Gulmarg, Kashmir',
      duration: '5 Days / 4 Nights',
      type: 'Alpine Adventure & Luxury',
      price: '₹42,000 / person',
      image: '/images/crafts-hero.jpg',
      highlights: ['Phase 2 Apharwat Gondola Access', 'Luxury Ski Resort Chalet', 'Pristine Pine Valley Treks', 'Private 4x4 Heated Transfer'],
    },
    {
      title: 'Pahalgam Lidder Valley & Aru Highland Retreat',
      destination: 'Pahalgam, Kashmir',
      duration: '4 Days / 3 Nights',
      type: 'Nature & Wellness',
      price: '₹34,000 / person',
      image: '/images/crafts-kashmir-hero.jpg',
      highlights: ['Lidder Riverfront Boutique Stay', 'Betaab & Aru Valley Private Excursions', 'Trout Fishing Experience', 'Campfire Wazwan Dinner'],
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* ── 1. Hero ── */}
        <div className="relative rounded-3xl overflow-hidden bg-[#17233B] text-white p-8 sm:p-14 lg:p-16 border border-[#C9A45C]/30 shadow-2xl space-y-6">
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
              <span>✈️</span> GLOBAL TRAVEL &amp; BESPOKE EXPERIENCES MARKETPLACE
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Curated Journeys to the World&apos;s Most Soulful Valleys.
            </h1>
            <p className="text-xs sm:text-base text-stone-300 font-light leading-relaxed max-w-2xl">
              Authentic local expeditions, vetted private drivers, heritage boutique stays, and artisan cultural immersions. Sourced directly from verified ground operators without mass-tourism dilution.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Plan My Custom Trip →
              </button>
              <Link
                href="/travel/kashmir"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors"
              >
                Explore Kashmir Valley Guide
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. Featured Launch Experiences ── */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#704B32]">
                Verified Destination Packages
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                Signature Kashmir Expeditions
              </h2>
            </div>
            <span className="text-xs text-stone-500">
              Department of Tourism Certified Operators
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travelExperiences.map((exp, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-stone-200">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-[#17233B]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {exp.type}
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-xs">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#176B68] block">
                      {exp.destination} · {exp.duration}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#17233B] leading-snug">
                      {exp.title}
                    </h3>

                    <ul className="space-y-1 text-stone-600 pt-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-emerald-700 font-bold">✓</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Starting from</span>
                      <strong className="text-sm font-serif text-[#17233B]">{exp.price}</strong>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDestination(exp.title)
                        setQuoteModalOpen(true)
                      }}
                      className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase text-[10px] tracking-wider transition-colors"
                    >
                      Book Tour
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Global Destinations Horizon ── */}
        <div className="bg-[#FAF6EE] rounded-3xl border border-stone-200 p-8 space-y-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#704B32] tracking-wider block">
              International Expansion Architecture
            </span>
            <h3 className="font-serif font-bold text-xl text-[#17233B]">
              Global Destination Corridors (Roadmap)
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-stone-600">
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <strong className="text-[#17233B] block">Kashmir Valleys</strong>
              <span className="text-[11px] text-emerald-700 font-bold">Active Launch Destination</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <strong className="text-[#17233B] block">Dubai &amp; Emirates</strong>
              <span className="text-[11px] text-stone-500">Q1 2027 Partner Onboarding</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <strong className="text-[#17233B] block">London &amp; UK Countryside</strong>
              <span className="text-[11px] text-stone-500">Q2 2027 Inbound Network</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-200">
              <strong className="text-[#17233B] block">Istanbul &amp; Anatolia</strong>
              <span className="text-[11px] text-stone-500">Heritage Spice Corridors</span>
            </div>
          </div>
        </div>

        {/* ── 4. Sourcing Request / Custom Itinerary Banner ── */}
        <SourcingRequestBanner
          vertical="travel"
          contextText="Planning a bespoke photography expedition, heli-skiing week, destination family reunion, or corporate leadership retreat in Kashmir?"
        />
      </div>

      <DemandCaptureModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultVertical="travel"
        defaultItem={selectedDestination}
        title="Plan My Custom Kashmir Travel Experience"
        subtitle="Share your preferred travel dates, group size, and pacing. Our local destination curators will assemble your private itinerary with verified hotel confirmations."
      />
    </div>
  )
}
