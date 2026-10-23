import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import TripsClient from './TripsClient'

export const metadata: Metadata = {
  title: 'My Trips & Itineraries | Nuty Tales Stays',
  description: 'Manage upcoming reservations, check-in instructions, door codes, and collaborative travel plans.',
  robots: 'noindex,nofollow',
}

export default function TripsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-stone-500">
          Loading your travel itineraries...
        </div>
      }
    >
      <TripsClient />
    </Suspense>
  )
}
