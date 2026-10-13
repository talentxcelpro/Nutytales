import type { Metadata } from 'next'
import CraftsHomeClient from './CraftsHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: "Nuty Tales Crafts — India's Handcrafted Wardrobe. Verified at the Loom.",
  },
  description:
    "The world's first fastest crafts e-commerce platform. Evidence-backed GI-certified handlooms from 15 Indian state clusters: Kashmir Pashmina, Kutch Ajrakh, Banarasi Silk, Lucknowi Chikankari, Assam Eri Peace Silk, and Pochampally Ikat.",
  alternates: {
    canonical: 'https://crafts.nutytales.com',
  },
  openGraph: {
    title: "Nuty Tales Crafts — India's Handcrafted Wardrobe. Verified at the Loom.",
    description:
      'The world’s first fastest crafts e-commerce platform. Evidence-backed GI handlooms, single-origin natural fibers, and fair weaver trade across India.',
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
    description:
      'All-India GI-certified handlooms, artisan couture, Pashmina shawls, pherans, kurtas, and master weaver heritage.',
    telephone: '+91-9717161809',
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Srinagar & Pan-India Artisan Hubs',
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
