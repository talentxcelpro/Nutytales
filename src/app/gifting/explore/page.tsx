import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import GiftingExploreClient from './GiftingExploreClient'

export const metadata: Metadata = {
  title: 'Explore All Gifts & Hampers | Nuty Tales Gifting Marketplace',
  description:
    'Browse our complete catalogue of premium dry fruit hampers, personalized engraved memory boxes, Kashmiri saffron, and celebration gifts for every occasion.',
  alternates: {
    canonical: 'https://nutytales.com/gifting/explore',
  },
}

export default function GiftingExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center p-8 text-stone-500 text-xs">
          Loading Gifting Marketplace...
        </div>
      }
    >
      <GiftingExploreClient />
    </Suspense>
  )
}
