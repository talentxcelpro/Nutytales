'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useStaysContext } from '@/components/stays/StaysShell'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import PropertyCard from '@/components/stays/PropertyCard'

export default function WishlistClient() {
  const { wishlist, openAiConcierge } = useStaysContext()
  const [collectionName, setCollectionName] = useState('My Dream Mountain Stays')
  const [sharedToast, setSharedToast] = useState(false)

  const savedProperties = STAY_PROPERTIES.filter((p) => wishlist.includes(p.slug))

  const handleShareWishlist = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setSharedToast(true)
      setTimeout(() => setSharedToast(false), 2500)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D9] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-800 text-xs font-semibold border border-red-200">
            <span>❤️ SAVED RESIDENCES COLLECTION</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            {collectionName} ({savedProperties.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Properties you have saved for upcoming trips, family vacations, or corporate retreats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedProperties.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleShareWishlist}
                className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-1.5 shadow-2xs"
              >
                <span>🔗</span>
                <span>{sharedToast ? 'Link Copied!' : 'Share Collection'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const names = savedProperties.map((p) => p.name).join(', ')
                  openAiConcierge(`I have saved these properties: ${names}. Help me pick the best one for my trip.`)
                }}
                className="px-4 py-2 bg-[#17233B] hover:bg-[#1E3048] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>Ask AI to Pick</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid or Empty */}
      {savedProperties.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#E7E2D9] space-y-4">
          <span className="text-4xl block">🤍</span>
          <h3 className="font-serif text-xl font-bold text-[#17233B]">
            Your wishlist is empty
          </h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
            As you explore our high-altitude walnut estates, ski chalets, and cedar houseboats, tap the heart icon on any residence to curate your personalized collection.
          </p>
          <div className="pt-2">
            <Link
              href="/stays"
              className="px-6 py-3 bg-[#17233B] text-white font-bold text-xs rounded-xl uppercase tracking-wider inline-block shadow-xs"
            >
              Explore Curated Stays →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {savedProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}
    </div>
  )
}
