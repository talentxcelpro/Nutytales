import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import DiscoverSection from '@/components/home/DiscoverSection'
import PopularProducts from '@/components/home/PopularProducts'
import CategoryTiles from '@/components/home/CategoryTiles'
import CorporateEditorialSection from '@/components/home/CorporateEditorialSection'
import WholesaleEditorialSection from '@/components/home/WholesaleEditorialSection'
import KashmirSection from '@/components/home/KashmirSection'
import BrandStorySection from '@/components/home/BrandStorySection'
import { FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Nutty Tales — Wholesome Nutty Delights | Dry Fruits & Boutique Stays',
  description:
    'The finest nuts, thoughtfully sourced. Buy premium California almonds, cashews, Kashmiri walnuts, Afghan raisins, Bihar makhana, corporate Diwali hampers, and explore boutique stays in Srinagar, Noida & Patna. FSSAI certified.',
  keywords: [
    'nutty tales',
    'wholesome nutty delights',
    'buy premium dry fruits',
    'dry fruits wholesale india',
    'corporate diwali gift hampers',
    'kashmir walnut wholesale',
    'nutty tales stays',
  ],
  alternates: {
    canonical: 'https://nuttytales.com',
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nutty Tales',
    url: 'https://nuttytales.com',
    logo: 'https://nuttytales.com/images/logo.jpg',
    description:
      'Premium dry fruits wholesale & retail supplier with operating hubs in Noida, Srinagar, and Patna. FSSAI Reg. 22724441000048.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9717161809',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
  }

  return (
    <div className="min-h-screen bg-[#F7F2E8]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero (75-80vh, Left Brand Message, Right Pure Lifestyle Photography + Packaging) */}
      <Hero />

      {/* 2. Discover Nutty Tales (4 Editorial Cards: Dry Fruits, Wholesale, Corporate Gifting, Stays) */}
      <DiscoverSection />

      {/* 3. Our Collection (Naturally Good. Beautifully Packed. Generous Whitespace) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PopularProducts />
      </section>

      {/* 4. Shop by Category (High-Quality Photographic Tiles) */}
      <CategoryTiles />

      {/* 5. Corporate Gifting (Deep Navy Luxury Editorial Section) */}
      <CorporateEditorialSection />

      {/* 6. Wholesale & Bulk Supply (3 Operating Hubs: Noida, Srinagar, Patna) */}
      <WholesaleEditorialSection />

      {/* 7. From Kashmir, With Warmth (Stay, Explore, Take Home) */}
      <KashmirSection />

      {/* 8. Brand Story & Traceability */}
      <BrandStorySection />
    </div>
  )
}
