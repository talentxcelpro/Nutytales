import type { Metadata } from 'next'
import TravelHomeClient from './TravelHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales Travel — Travel India Beyond the Ordinary',
  },
  description:
    'Bespoke travel expeditions and curated journeys across Kashmir, Ladakh, and India. AI-powered dynamic itinerary planner, private 4x4 off-road convoys, alpine chalets, and verified DMC coordination.',
  alternates: {
    canonical: 'https://travel.nutytales.com',
  },
  openGraph: {
    title: 'Nuty Tales Travel — Travel India Beyond the Ordinary',
    description:
      'Bespoke travel expeditions and curated journeys across Kashmir, Ladakh, and India. AI-powered dynamic itinerary planner, private 4x4 off-road convoys, alpine chalets, and verified DMC coordination.',
    url: 'https://travel.nutytales.com',
    siteName: 'Nuty Tales Travel',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function TravelPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Nuty Tales Travel',
    url: 'https://travel.nutytales.com',
    description: 'Bespoke travel experiences and dynamic itinerary planning across Kashmir & Ladakh.',
    telephone: '+91-9717161809',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Srinagar',
      addressRegion: 'Jammu and Kashmir',
      addressCountry: 'IN',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TravelHomeClient />
    </>
  )
}
