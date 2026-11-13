import type { Metadata } from 'next'
import TravelHomeClient from './TravelHomeClient'

export const metadata: Metadata = {
  title: 'Kashmir Luxury Travel & Bespoke Tour Packages | Nuty Tales Travel',
  description:
    'Bespoke travel expeditions and curated journeys across Kashmir, Ladakh, and India. AI-powered dynamic itinerary planner, private 4x4 off-road convoys, alpine chalets, and verified DMC coordination.',
  alternates: {
    canonical: 'https://nutytales.com/travel',
  },
  openGraph: {
    title: 'Kashmir Luxury Travel & Bespoke Tour Packages | Nuty Tales Travel',
    description:
      'Bespoke travel expeditions and curated journeys across Kashmir, Ladakh, and India. AI-powered dynamic itinerary planner, private 4x4 off-road convoys, alpine chalets, and verified DMC coordination.',
    url: 'https://nutytales.com/travel',
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
    url: 'https://nutytales.com/travel',
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
