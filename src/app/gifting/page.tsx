import type { Metadata } from 'next'
import GiftingHomeClient from './GiftingHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales Gifting — Bespoke Corporate & Festive Luxury Dry Fruit Hampers',
  },
  description:
    'Global corporate gifting and festive hamper solutions. Enterprise multi-recipient desk, custom laser-etched branding, handcrafted Kashmiri walnut wood boxes, GST invoicing, and PAN-India/international scheduled dispatch.',
  alternates: {
    canonical: 'https://gifting.nutytales.com',
  },
  openGraph: {
    title: 'Nuty Tales Gifting — Bespoke Corporate & Festive Luxury Dry Fruit Hampers',
    description:
      'Curate luxury dry fruit gift boxes with enterprise multi-recipient delivery, laser branding, and scheduled dispatch.',
    url: 'https://gifting.nutytales.com',
    siteName: 'Nuty Tales Gifting',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function GiftingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Nuty Tales Gifting',
    url: 'https://gifting.nutytales.com',
    description: 'Bespoke corporate gifting, employee festive kits, and luxury dry fruit hampers.',
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
      <GiftingHomeClient />
    </>
  )
}
