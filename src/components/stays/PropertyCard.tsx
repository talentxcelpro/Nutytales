'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { StayProperty } from '@/lib/stays-data'
import { useStaysContext } from './StaysShell'

interface PropertyCardProps {
  property: StayProperty
  nights?: number
  checkIn?: string
  checkOut?: string
  guests?: number
}

export default function PropertyCard({
  property,
  nights = 3,
  checkIn,
  checkOut,
  guests = 2,
}: PropertyCardProps) {
  const { isWishlisted, toggleWishlist, isCompared, addToCompare, removeFromCompare } =
    useStaysContext()
  const [currentImageIdx, setCurrentImageIdx] = useState(0)

  const images = property.galleryImages.length > 0 ? property.galleryImages : [property.featuredImage]
  const wishlisted = isWishlisted(property.slug)
  const compared = isCompared(property.slug)

  // Estimated Total for default nights
  const totalTariff = Math.round(
    property.estateBuyoutPrice * nights * 1.18 + property.cleaningFee + property.estateBuyoutPrice * nights * 0.05,
  )

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIdx((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="group bg-white rounded-3xl border border-[#E7E2D9] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative">
      {/* ── 1. Image Carousel Container ────────────────────────────────────────── */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <Link href={`/stays/${property.slug}`} className="block w-full h-full">
          <Image
            src={images[currentImageIdx]}
            alt={property.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Carousel Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-800 text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              aria-label="Next image"
            >
              ›
            </button>
            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImageIdx ? 'bg-white w-3' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {property.curatedCollection && (
            <span className="px-2.5 py-1 rounded-full bg-[#17233B]/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-xs border border-white/20">
              Curated Estate
            </span>
          )}
          {property.instantBook && (
            <span className="px-2 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-xs">
              ⚡ Instant Book
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(property.slug)
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all z-10 shadow-md ${
            wishlisted
              ? 'bg-red-50 text-red-500 scale-110'
              : 'bg-white/80 hover:bg-white text-stone-600 hover:text-red-500'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <span className="text-sm">{wishlisted ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* ── 2. Content Body ────────────────────────────────────────────────────── */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Rating & Location Row */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">
              📍 {property.city}, {property.state}
            </span>
            <div className="flex items-center gap-1 font-bold text-stone-800">
              <span className="text-amber-500">★</span>
              <span>{property.rating.toFixed(2)}</span>
              <span className="text-stone-400 font-normal">({property.reviewsCount})</span>
            </div>
          </div>

          {/* Property Name */}
          <Link href={`/stays/${property.slug}`} className="block group-hover:text-[#176B68] transition-colors">
            <h3 className="font-serif text-lg font-bold text-[#17233B] line-clamp-1 leading-snug">
              {property.name}
            </h3>
          </Link>

          {/* Tagline */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {property.tagline}
          </p>

          {/* Capacity Spec Pill */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
            <span>{property.bedrooms} Chambers</span>
            <span>•</span>
            <span>{property.beds} Beds</span>
            <span>•</span>
            <span>Up to {property.maxTotalGuests} Guests</span>
          </div>

          {/* Key Feature Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {property.propertyAmenities.slice(0, 2).map((amenity, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-stone-200 text-[10px] text-stone-600 truncate max-w-[190px]"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* ── 3. Footer: Pricing & Compare Trigger ─────────────────────────────── */}
        <div className="pt-4 border-t border-[#E7E2D9] flex items-end justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">From</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-base sm:text-lg font-extrabold text-[#17233B]">
                ₹{property.estateBuyoutPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 font-normal">/ night</span>
            </div>
            <span className="text-[10px] text-stone-500 block">
              ₹{totalTariff.toLocaleString('en-IN')} total ({nights} nights incl. tax)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Toggle */}
            <button
              type="button"
              onClick={() => {
                if (compared) removeFromCompare(property.slug)
                else addToCompare(property)
              }}
              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                compared
                  ? 'bg-[#17233B] text-[#C9A45C] border-[#17233B]'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
              title="Add to side-by-side comparison"
            >
              ⚖️
            </button>

            {/* View Details CTA */}
            <Link
              href={`/stays/${property.slug}`}
              className="py-2.5 px-4 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors shadow-xs"
            >
              Reserve →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
