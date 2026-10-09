import type { Metadata } from 'next'
import ShopHomeHero from '@/components/shop/ShopHomeHero'
import ShopCategoriesGrid from '@/components/shop/ShopCategoriesGrid'
import ShopBestsellersSection from '@/components/shop/ShopBestsellersSection'
import ShopFeaturedCollections from '@/components/shop/ShopFeaturedCollections'
import ShopProvenanceStory from '@/components/shop/ShopProvenanceStory'
import ShopTrustAndGuarantee from '@/components/shop/ShopTrustAndGuarantee'
import { FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: {
    absolute: 'Nuty Tales — Premium Single-Origin Dry Fruits, Saffron & Gourmet Harvest',
  },
  description:
    'Buy certified single-origin Kashmiri Kagzi walnuts, Pampore Mongra saffron, high-oil Mamra almonds, Mithila jumbo makhana, corporate gifting, and artisanal harvest. FSSAI certified, nitrogen-sealed freshness, worldwide delivery.',
  keywords: [
    'Nuty Tales',
    'buy dry fruits online',
    'kashmiri walnuts',
    'pampore mongra saffron',
    'mamra almonds',
    'mithila makhana',
    'fssai 22724441000048',
    'corporate gifting hampers',
    'wedding hampers',
    'kashmiri crafts',
  ],
  alternates: {
    canonical: 'https://nutytales.com',
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Nuty Tales',
    url: 'https://nutytales.com',
    logo: 'https://nutytales.com/images/logo.jpg',
    description:
      'Buy certified single-origin Kashmiri Kagzi walnuts, Pampore Mongra saffron, high-oil Mamra almonds, and Mithila jumbo makhana. Central FSSAI: ' +
      FSSAI_NUMBER,
    currenciesAccepted: 'INR, USD, AED, EUR, GBP',
    paymentAccepted: 'Credit Card, Debit Card, UPI, NetBanking',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'PC-12, 003, Jaypee Wishtown, Sector 128',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201304',
      addressCountry: 'IN',
    },
    hasMap:
      'https://www.google.com/maps/place/Nuty+Tales+(Dry+fruits)/@28.5209169,77.3539445,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce7f48d890b99:0x17d4f4be831d96c1!8m2!3d28.5209122!4d77.3565248!16s%2Fg%2F11vyp7r8k6?entry=ttu&g_ep=EgoyMDI2MTAwNi4wIKXMDSoASAFQAw%3D%3D',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nutytales.com/shop?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9717161809',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi', 'Kashmiri', 'Urdu'],
    },
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B]">
      {/* Schema.org OnlineStore Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── 1. Hero: Discover Something Exceptional + Instant Product Search ── */}
      <ShopHomeHero />

      {/* ── 2. Shop Categories Grid ── */}
      <ShopCategoriesGrid />

      {/* ── 3. Trending Bestsellers with Live Interactive Product Cards ── */}
      <ShopBestsellersSection />

      {/* ── 4. Signature Harvest Reserves (Featured Collections) ── */}
      <ShopFeaturedCollections />

      {/* ── 5. Editorial Provenance: Single-Origin Truth ── */}
      <ShopProvenanceStory />

      {/* ── 6. Standards, Governance & Trust ── */}
      <ShopTrustAndGuarantee />
    </div>
  )
}
