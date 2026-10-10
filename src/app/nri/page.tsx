import type { Metadata } from 'next'
import NriHomeClient from './NriHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales NRI — India, handled. From anywhere in the world.',
  },
  description:
    'Dedicated on-the-ground support in India for Non-Resident Indians and overseas families. Verified parent care visits, GPS-audited property inspections, legal documentation, and ancestral stays.',
  alternates: {
    canonical: 'https://nri.nutytales.com',
  },
  openGraph: {
    title: 'Nuty Tales NRI — India, handled. From anywhere in the world.',
    description:
      'Dedicated on-the-ground support in India for Non-Resident Indians and overseas families. Verified parent care visits, GPS-audited property inspections, legal documentation, and ancestral stays.',
    url: 'https://nri.nutytales.com',
    siteName: 'Nuty Tales NRI',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function NriHomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Nuty Tales NRI',
    description: 'India-management platform and on-ground execution for global NRIs and diaspora families.',
    url: 'https://nri.nutytales.com',
    telephone: '+91-9596660144',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Srinagar',
      addressRegion: 'Jammu and Kashmir',
      addressCountry: 'IN',
    },
    areaServed: ['United States', 'United Kingdom', 'Canada', 'United Arab Emirates', 'Australia', 'India'],
    serviceType: [
      'NRI Property Management',
      'Senior Parent Care',
      'Power of Attorney Legal Coordination',
      'Ancestral Travel and Stays',
      'Remittance & CA Taxation Coordination',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NriHomeClient />
    </>
  )
}
