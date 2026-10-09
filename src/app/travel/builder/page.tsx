import type { Metadata } from 'next'
import TravelBuilderClient from './TravelBuilderClient'

export const metadata: Metadata = {
  title: 'Dynamic Kashmir Trip Builder & Cost Estimator | Nuty Tales Travel',
  description:
    'Design your personalized Kashmir holiday in minutes. Select private stays, 4x4 vehicles, and curated experiences with live transparent pricing.',
  alternates: {
    canonical: 'https://travel.nutytales.com/builder',
  },
  openGraph: {
    title: 'Dynamic Kashmir Trip Builder & Cost Estimator | Nuty Tales Travel',
    description:
      'Design your personalized Kashmir holiday in minutes. Select private stays, 4x4 vehicles, and curated experiences with live transparent pricing.',
    url: 'https://travel.nutytales.com/builder',
    siteName: 'Nuty Tales Travel',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function TravelBuilderPage() {
  return <TravelBuilderClient />
}
