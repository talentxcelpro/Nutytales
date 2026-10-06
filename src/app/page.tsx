import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import GiftsForEveryStory from '@/components/home/GiftsForEveryStory'
import DiscoverSection from '@/components/home/DiscoverSection'
import WinterCraftsSpotlight from '@/components/home/WinterCraftsSpotlight'
import PopularProducts from '@/components/home/PopularProducts'
import BusinessSupplyBanner from '@/components/home/BusinessSupplyBanner'
import CategoryTiles from '@/components/home/CategoryTiles'
import CorporateEditorialSection from '@/components/home/CorporateEditorialSection'
import WholesaleEditorialSection from '@/components/home/WholesaleEditorialSection'
import KashmirSection from '@/components/home/KashmirSection'
import BrandStorySection from '@/components/home/BrandStorySection'

export const metadata: Metadata = {
  title: 'Nutty Tales — Taste. Gift. Wear. Stay. Explore. | Dry Fruits, Weddings & Crafts',
  description:
    'The finest nuts, bespoke weddings, B2B business supply, and authentic Himalayan heritage. Buy premium California almonds, cashews, Kashmiri Kagzi walnuts, Mongra saffron, raw honey, Mithila makhana, handcrafted Pashmina shawls & pherans (Try with SI), wedding hampers, and explore boutique stays in Srinagar, Noida & Patna. FSSAI certified.',
  keywords: [
    'nutty tales',
    'taste gift wear stay explore',
    'wedding dry fruit hampers',
    'weddings by nutty tales',
    'b2b dry fruit supply',
    'dry fruits for bakeries',
    'dry fruits for hotels',
    'kashmir crafts and heritage',
    'try with si',
    'corporate diwali gift hampers',
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
      'Taste. Gift. Wear. Stay. Explore. Gourmet dry fruits, B2B business ingredients, bespoke wedding hampers, boutique stays in Srinagar, Noida & Patna, and authentic Kashmiri heritage crafts. FSSAI Reg. 22724441000048.',
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

      {/* 1. Hero (Brand Message & Photography) */}
      <Hero />

      {/* 2. Gifts for Every Story Strip (Everyday, Weddings, Diwali, Corporate, Kashmir, Celebrations) */}
      <GiftsForEveryStory />

      {/* 3. Discover Nutty Tales (4 Doors: Taste, Gift, Stay, Discover) */}
      <DiscoverSection />

      {/* 4. Kashmir — Fall / Winter 2026: Wear the Story (Try with SI Spotlight) */}
      <WinterCraftsSpotlight />

      {/* 5. Our Collection (Dry Fruits, Saffron, Honey, Makhana) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PopularProducts />
      </section>

      {/* 6. Nutty Tales Business Supply (Hotels, Bakeries, Sweet Shops, Food Plants) */}
      <BusinessSupplyBanner />

      {/* 7. Shop by Category */}
      <CategoryTiles />

      {/* 8. Corporate & Heritage Gifting */}
      <CorporateEditorialSection />

      {/* 9. Wholesale & Bulk Supply */}
      <WholesaleEditorialSection />

      {/* 10. From Kashmir, With Warmth */}
      <KashmirSection />

      {/* 11. Brand Story & Traceability */}
      <BrandStorySection />
    </div>
  )
}
