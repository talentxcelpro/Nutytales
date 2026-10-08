import type { Metadata } from 'next'
import ShopHomeHero from '@/components/shop/ShopHomeHero'
import ShopCategoriesGrid from '@/components/shop/ShopCategoriesGrid'
import ShopBestsellersSection from '@/components/shop/ShopBestsellersSection'
import ShopFeaturedCollections from '@/components/shop/ShopFeaturedCollections'
import ShopProvenanceStory from '@/components/shop/ShopProvenanceStory'
import ShopTrustAndGuarantee from '@/components/shop/ShopTrustAndGuarantee'
import { FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Nuty Tales Shop — Premium Single-Origin Dry Fruits, Saffron & Gourmet Harvest',
  description:
    'Shop authentic single-origin Kashmiri Kagzi walnuts, Pampore Mongra saffron, high-oil Mamra almonds, and Mithila jumbo makhana. Nitrogen-sealed freshness, FSSAI certified, shipped worldwide.',
  keywords: [
    'Nuty Tales Shop',
    'buy dry fruits online',
    'kashmiri walnuts',
    'pampore mongra saffron',
    'mamra almonds',
    'mithila makhana',
    'raw kashmiri honey',
    'fssai certified dry fruits',
    'single origin gourmet food',
    'california almonds',
  ],
  alternates: {
    canonical: 'https://nutytales.com',
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Nuty Tales Shop',
    url: 'https://nutytales.com',
    logo: 'https://nutytales.com/images/logo.jpg',
    description:
      'Nuty Tales Shop — Premium Single-Origin Dry Fruits, Saffron & Gourmet Harvest. FSSAI Reg. ' + FSSAI_NUMBER,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nutytales.com/shop?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9717161809',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
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
