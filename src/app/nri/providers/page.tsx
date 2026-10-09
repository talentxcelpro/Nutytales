import type { Metadata } from 'next'
import ProvidersClient from './ProvidersClient'

export const metadata: Metadata = {
  title: 'Join Ground Execution Network | Nuty Tales NRI',
  description:
    'Become a certified local service coordinator or trusted vendor for overseas Indians. Onboarding for property inspectors, elder companions, legal advocates, and drivers.',
  alternates: {
    canonical: 'https://nri.nutytales.com/providers',
  },
  openGraph: {
    title: 'Join Ground Execution Network | Nuty Tales NRI',
    description:
      'Become a certified local service coordinator or trusted vendor for overseas Indians.',
    url: 'https://nri.nutytales.com/providers',
    siteName: 'Nuty Tales NRI',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function ProviderOnboardingPage() {
  return <ProvidersClient />
}
