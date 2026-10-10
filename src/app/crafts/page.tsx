import type { Metadata } from 'next'
import CraftsHomeClient from './CraftsHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales Crafts — Crafted by Tradition. Chosen for a Lifetime.',
  },
  description:
    'Evidence-backed GI-certified Changthangi Pashmina, hand-embroidered Tilla shawls, fine wool pherans, and bespoke heritage crafts. Crafted by tradition, chosen for a lifetime.',
  alternates: {
    canonical: 'https://crafts.nutytales.com',
  },
  openGraph: {
    title: 'Nuty Tales Crafts — Crafted by Tradition. Chosen for a Lifetime.',
    description:
      'Evidence-backed GI-certified Changthangi Pashmina, fine wool pherans, and bespoke Himalayan heritage crafts. Crafted by tradition, chosen for a lifetime.',
    url: 'https://crafts.nutytales.com',
    siteName: 'Nuty Tales Crafts',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function CraftsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Nuty Tales Crafts',
    url: 'https://crafts.nutytales.com',
    description: 'Authentic Kashmir GI Pashmina, hand-embroidered shawls, pherans, and heritage crafts.',
    telephone: '+91-9596660144',
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
      <CraftsHomeClient />
    </>
  )
}
