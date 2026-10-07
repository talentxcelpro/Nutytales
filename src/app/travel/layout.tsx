import type { Metadata } from 'next'
import TravelShell from '@/components/travel/TravelShell'

export const metadata: Metadata = {
  metadataBase: new URL('https://travel.nutytales.com'),
  title: {
    default: 'Nutty Tales Travel — Bespoke Kashmir Expeditions & SI Dynamic Journeys',
    template: '%s | Nutty Tales Travel',
  },
  description:
    'Bespoke travel experiences across Kashmir & Ladakh. AI-powered dynamic itinerary planner, private 4x4 off-road convoys, Gulmarg heli-skiing, alpine meadow treks, and verified local DMC coordination.',
  alternates: {
    canonical: 'https://travel.nutytales.com',
  },
  icons: {
    icon: [
      { url: 'https://nutytales.com/favicon.ico', sizes: 'any' },
      { url: 'https://nutytales.com/favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: 'https://nutytales.com/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  keywords: [
    'custom Kashmir travel packages',
    'luxury Kashmir tour',
    'private 4x4 convoy Srinagar',
    'Gulmarg ski expedition',
    'high altitude Kashmir treks',
    'bespoke travel planner Kashmir',
    'SI dynamic trip builder',
    'Kashmir luxury travel concierge',
  ],
  openGraph: {
    title: 'Nutty Tales Travel — Curated Kashmir Journeys & SI Dynamic Itineraries',
    description:
      'Build the trip, don’t just book it. Dynamic day-by-day itinerary planner, private 4x4 convoys, and verified DMCs.',
    url: 'https://travel.nutytales.com',
    siteName: 'Nutty Tales Travel',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nutty Tales Travel — Bespoke Himalayan Expeditions',
    description: 'Dynamic Kashmir & Ladakh journeys with verified local DMCs and private 4x4 convoys.',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TravelShell>{children}</TravelShell>
}
