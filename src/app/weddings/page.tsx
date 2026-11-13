import type { Metadata } from 'next'
import WeddingsHomeClient from './WeddingsHomeClient'

export const metadata: Metadata = {
  title: 'Luxury Destination Weddings & Kashmiri Trousseau Hampers | Nuty Tales Weddings',
  description:
    'Curated wedding favors, royal trousseau walnut gift hampers, and destination wedding execution in Kashmir. Bring every wedding detail together beautifully with intelligent planning and artisan curation.',
  alternates: {
    canonical: 'https://nutytales.com/weddings',
  },
  openGraph: {
    title: 'Luxury Destination Weddings & Kashmiri Trousseau Hampers | Nuty Tales Weddings',
    description:
      'Curated wedding favors, royal trousseau walnut gift hampers, and destination wedding execution in Kashmir. Bring every wedding detail together beautifully.',
    url: 'https://nutytales.com/weddings',
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
    url: 'https://nutytales.com/weddings',
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
