import type { Metadata } from 'next'
import TravelPartnersClient from './TravelPartnersClient'

export const metadata: Metadata = {
  title: 'Partner Network Onboarding | Nuty Tales Travel',
  description:
    'Join the Nuty Tales Travel partner network. Direct contracting for licensed DMCs, luxury SUV fleet owners, boutique stay operators, and mountain guides in Kashmir.',
  alternates: {
    canonical: 'https://travel.nutytales.com/partners',
  },
  openGraph: {
    title: 'Partner Network Onboarding | Nuty Tales Travel',
    description:
      'Join the Nuty Tales Travel partner network for verified operators, fleet owners, and boutique stays.',
    url: 'https://travel.nutytales.com/partners',
    siteName: 'Nuty Tales Travel',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function TravelPartnersPage() {
  return <TravelPartnersClient />
}
