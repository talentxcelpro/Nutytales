import type { Metadata } from 'next'
import GiftingHomeClient from './GiftingHomeClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales Gifting — Gifts for Every Occasion & Every Relationship',
  },
  description:
    'Discover luxury dry fruit hampers, personalized engraved keepsakes, GI-tagged Kashmiri saffron, and celebratory gift boxes for birthdays, weddings, anniversaries, and corporate events. Pan-India & global delivery.',
  alternates: {
    canonical: 'https://nutytales.com/gifting',
  },
  openGraph: {
    title: 'Nuty Tales Gifting — Gifts for Every Occasion & Every Relationship',
    description:
      'Discover luxury dry fruit hampers, personalized engraved keepsakes, GI-tagged Kashmiri saffron, and celebratory gift boxes. Pan-India & global express air delivery.',
    url: 'https://nutytales.com/gifting',
    siteName: 'Nuty Tales Gifting',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function GiftingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Nuty Tales Gifting Marketplace',
    url: 'https://nutytales.com/gifting',
    description:
      'Curated e-commerce marketplace for luxury dry fruit gift hampers, personalized keepsakes, and occasion celebration gifts.',
    priceRange: '₹599 - ₹4950',
    telephone: '+919717161809',
    areaServed: ['IN', 'AE', 'GB', 'US'],
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
