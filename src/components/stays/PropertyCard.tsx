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
  showTotalWithTaxes?: boolean
}

export default function PropertyCard({
  property,
  nights = 3,
  checkIn,
  checkOut,
  guests = 2,
  showTotalWithTaxes = false,
}: PropertyCardProps) {
  const { isWishlisted, toggleWishlist, isCompared, addToCompare, removeFromCompare } =
    useStaysContext()
  const [currentImageIdx, setCurrentImageIdx] = useState(0)

  const images = property.galleryImages.length > 0 ? property.galleryImages : [property.featuredImage]
  const wishlisted = isWishlisted(property.slug)
  const compared = isCompared(property.slug)

  // Authoritative estimated total for default nights with transparent breakdown
  const totalTariff = Math.round(
    property.estateBuyoutPrice * nights * 1.18 +
      property.cleaningFee +
      property.estateBuyoutPrice * nights * 0.05,
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
    <div className="group relative flex flex-col transition-all duration-300">
      {/* ── 1. Image Carousel Container (Edge-to-edge Luxury Frame) ───────── */}
      <div className="relative aspect-[20/19] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-2xs group-hover:shadow-lg transition-shadow duration-300">
        <Link href={`/stays/${property.slug}`} className="block w-full h-full">
          <Image
            src={images[currentImageIdx]}
            alt={property.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
            className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Carousel Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 text-sm font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-stone-800 text-sm font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
              aria-label="Next photo"
            >
              ›
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImageIdx ? 'bg-white w-4' : 'bg-white/60 w-1.5'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {property.curatedCollection && (
            <span className="px-3 py-1 rounded-full bg-white/95 text-stone-900 text-[11px] font-bold tracking-tight shadow-md backdrop-blur-xs flex items-center gap-1">
              <span>🏆</span> Guest favourite
            </span>
          )}
          {property.instantBook && (
            <span className="px-2.5 py-1 rounded-full bg-[#17233B]/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-xs shadow-xs">
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
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform z-10 hover:scale-115 ${
            wishlisted ? 'scale-110' : ''
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <svg
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className={`w-6 h-6 drop-shadow-sm transition-colors ${
              wishlisted
                ? 'fill-red-500 stroke-red-500'
                : 'fill-black/30 stroke-white stroke-[2.5px] hover:fill-black/40'
            }`}
          >
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05A6.98 6.98 0 0 0 9 4a6.98 6.98 0 0 0-7 7c0 7 7 12.27 14 17z" />
          </svg>
        </button>

        {/* Quick Compare Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (compared) removeFromCompare(property.slug)
            else addToCompare(property)
          }}
          className={`absolute bottom-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold z-10 transition-all opacity-0 group-hover:opacity-100 shadow-md ${
            compared
              ? 'bg-[#17233B] text-[#C9A45C]'
              : 'bg-white/95 text-stone-700 hover:bg-white'
          }`}
          title="Compare property side-by-side"
        >
          {compared ? '✓ Compared' : '⚖️ Compare'}
        </button>
      </div>

      {/* ── 2. Content Body (Clean Airbnb-style Typography) ────────────────── */}
      <Link href={`/stays/${property.slug}`} className="block pt-2 space-y-0.5 text-stone-900">
        {/* Row 1: Location & Rating */}
        <div className="flex items-center justify-between gap-2 text-sm leading-tight">
          <span className="font-semibold text-stone-900 truncate">
            {property.city}, {property.state}
          </span>
          <div className="flex items-center gap-1 font-semibold text-stone-900 flex-shrink-0 text-sm">
            <span className="text-stone-900 text-xs">★</span>
            <span>{property.rating.toFixed(2)}</span>
            <span className="text-stone-400 font-normal text-xs">({property.reviewsCount})</span>
          </div>
        </div>

        {/* Row 2: Property Title */}
        <div className="font-serif text-stone-800 text-sm font-medium truncate group-hover:text-[#176B68] transition-colors">
          {property.name}
        </div>

        {/* Row 3: Highlight / View */}
        <p className="text-xs text-stone-500 truncate">
          {property.tagline}
        </p>

        {/* Row 4: Capacity */}
        <p className="text-xs text-stone-500">
          {property.bedrooms} Chambers · {property.beds} Beds · Up to {property.maxTotalGuests} guests
        </p>

        {/* Row 5: Pricing */}
        <div className="pt-1.5 leading-tight">
          {showTotalWithTaxes ? (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-stone-900 text-sm sm:text-base">
                  ₹{totalTariff.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-600 font-normal">total ({nights} nights)</span>
              </div>
              <span className="text-[11px] text-[#176B68] font-medium block">
                Taxes &amp; cleaning included · Zero surprises
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 text-sm">
              <span className="font-bold text-stone-900">
                ₹{property.estateBuyoutPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-600 font-normal">night</span>
              <span className="text-stone-400 mx-0.5">·</span>
              <span className="text-xs text-stone-500 underline font-normal">
                ₹{totalTariff.toLocaleString('en-IN')} total
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
