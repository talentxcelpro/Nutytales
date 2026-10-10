import type { Metadata } from 'next'
import WeddingsHomeClient from './WeddingsHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales Weddings — Bring Every Wedding Detail Together Beautifully',
  },
  description:
    'Curated wedding favors, royal trousseau walnut gift hampers, and destination wedding execution. Bring every wedding detail together beautifully with intelligent planning and artisan curation.',
  alternates: {
    canonical: 'https://weddings.nutytales.com',
  },
  openGraph: {
    title: 'Nuty Tales Weddings — Bring Every Wedding Detail Together Beautifully',
    description:
      'Curated wedding favors, royal trousseau walnut gift hampers, and destination wedding execution. Bring every wedding detail together beautifully.',
    url: 'https://weddings.nutytales.com',
    siteName: 'Nuty Tales Weddings',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function WeddingsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Nuty Tales Weddings',
    url: 'https://weddings.nutytales.com',
    description: 'Royal trousseau dry fruit gift hampers and Kashmir destination wedding execution.',
    provider: {
      '@type': 'Organization',
      name: 'Nuty Tales',
      url: 'https://nutytales.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WeddingsHomeClient />
    </>
  )
}
