'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StayProperty } from '@/lib/stays-data'

interface InteractiveMapViewProps {
  properties: StayProperty[]
  nights?: number
}

export default function InteractiveMapView({
  properties,
  nights = 3,
}: InteractiveMapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<StayProperty | null>(
    properties.length > 0 ? properties[0] : null,
  )

  return (
    <div className="bg-white rounded-3xl border border-[#E7E2D9] overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      {/* ── 1. Interactive Geographic Hub View (SVG & Pin Canvas) ─────────────── */}
      <div className="lg:col-span-8 bg-[#E9E5DD] relative overflow-hidden flex flex-col justify-between p-4 sm:p-6 min-h-[380px]">
        {/* Map Header Overlay */}
        <div className="flex items-center justify-between z-10">
          <div className="px-3.5 py-1.5 rounded-full bg-[#17233B]/90 text-white text-xs font-bold shadow-md flex items-center gap-2 backdrop-blur-xs">
            <span>🗺️ Verified Residence Pins ({properties.length})</span>
          </div>
          <span className="text-[11px] text-stone-600 bg-white/80 px-2.5 py-1 rounded-full shadow-2xs font-medium">
            Click pins to preview estate details
          </span>
        </div>

        {/* Conceptual Stylized Topographic Map Background with Real Coordinates */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#17233B_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Pins Layout */}
        <div className="relative w-full h-full min-h-[320px] flex items-center justify-center">
          <div className="relative w-full max-w-2xl h-72">
            {properties.map((prop, index) => {
              const isSelected = selectedProperty?.id === prop.id
              // Distribute pins across visual space based on hub zone
              const positions: Record<string, { top: string; left: string }> = {
                'harwan-orchard-estate': { top: '25%', left: '35%' },
                'gulmarg-ski-chalet': { top: '18%', left: '22%' },
                'zest-e-nigeen-houseboat': { top: '32%', left: '42%' },
                'lidder-pine-riverfront-estate': { top: '40%', left: '50%' },
                'cyber-city-executive-penthouse': { top: '65%', left: '48%' },
                'mithila-heritage-courtyard-patna': { top: '70%', left: '68%' },
                'silicon-grove-garden-villa-bengaluru': { top: '80%', left: '38%' },
                'kerala-backwater-nalukettu': { top: '88%', left: '32%' },
                'dubai-downtown-sky-villa': { top: '55%', left: '15%' },
                'kensington-mews-residence': { top: '15%', left: '80%' },
              }

              const pos = positions[prop.slug] || {
                top: `${20 + (index * 15) % 70}%`,
                left: `${15 + (index * 20) % 75}%`,
              }

              return (
                <div
                  key={prop.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedProperty(prop)}
                    className={`group px-3 py-1.5 rounded-full font-bold text-xs shadow-lg transition-all transform hover:scale-110 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#17233B] text-white ring-4 ring-[#C9A45C]'
                        : 'bg-white text-stone-900 hover:bg-[#17233B] hover:text-white'
                    }`}
                  >
                    <span>📍</span>
                    <span className="font-mono">₹{Math.round(prop.estateBuyoutPrice / 1000)}k</span>
                  </button>
                  <span
                    className={`block text-[9px] font-bold text-center mt-0.5 truncate max-w-[110px] ${
                      isSelected ? 'text-[#17233B]' : 'text-stone-600'
                    }`}
                  >
                    {prop.city}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Map Legend Footer */}
        <div className="z-10 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 border border-stone-200 flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#17233B]" /> Kashmir Alps
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B68]" /> NCR &amp; South
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9A45C]" /> Global Hubs
            </span>
          </div>
          <span className="font-semibold text-stone-700">Privacy-protected approximate locations</span>
        </div>
      </div>

      {/* ── 2. Side Preview Card Panel ───────────────────────────────────────── */}
      <div className="lg:col-span-4 p-5 sm:p-6 bg-[#FAF8F5] border-t lg:border-t-0 lg:border-l border-[#E7E2D9] flex flex-col justify-between">
        {selectedProperty ? (
          <div className="space-y-4">
            <div className="relative aspect-16/10 rounded-2xl overflow-hidden shadow-xs bg-stone-200">
              <Image
                src={selectedProperty.featuredImage}
                alt={selectedProperty.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 bg-[#17233B]/90 text-white text-[10px] font-bold rounded-lg backdrop-blur-xs">
                ⭐ {selectedProperty.rating} ({selectedProperty.reviewsCount} reviews)
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#704B32] block">
                {selectedProperty.city}, {selectedProperty.state}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#17233B]">
                {selectedProperty.name}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {selectedProperty.tagline}
              </p>
            </div>

            {/* Capacity & Connectivity */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-stone-700">
                <span className="text-[10px] text-stone-400 block">Bedrooms</span>
                <strong>{selectedProperty.bedrooms} Chambers ({selectedProperty.maxTotalGuests} Pax)</strong>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-stone-700">
                <span className="text-[10px] text-stone-400 block">Wi-Fi Speed</span>
                <strong>{selectedProperty.wifiSpeedMbps} Mbps Fiber</strong>
              </div>
            </div>

            {/* Key Amenities */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Features:</span>
              <ul className="text-xs text-stone-700 space-y-1">
                {selectedProperty.propertyAmenities.slice(0, 3).map((a, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="truncate">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tariff & Action */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 block">From</span>
                <span className="font-mono text-lg font-bold text-[#17233B]">
                  ₹{selectedProperty.estateBuyoutPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-500"> / night</span>
              </div>
              <Link
                href={`/stays/${selectedProperty.slug}`}
                className="py-2.5 px-5 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors shadow-xs"
              >
                View Residence →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-stone-400 p-8 text-center">
            Click any pin on the map to inspect property specifics.
          </div>
        )}
      </div>
    </div>
  )
}
