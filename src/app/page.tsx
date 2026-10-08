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
import GroupEcosystemBar from '@/components/group/GroupEcosystemBar'
import GroupPortfolioShowcase from '@/components/home/GroupPortfolioShowcase'

export const metadata: Metadata = {
  title: 'Nuty Tales — Global Marketplace for Products, Gifting, Travel, Stays, Crafts, Weddings & Business',
  description:
    'Nuty Tales is a global technology-enabled marketplace connecting customers, sellers, artisans, farmers, boutique hosts, and corporate buyers across six integrated verticals: Products, Gifting, Weddings, Crafts, Stays, and Travel.',
  keywords: [
    'Nuty Tales',
    'global marketplace',
    'premium dry fruits',
    'corporate gifting',
    'destination weddings',
    'kashmir crafts',
    'boutique stays',
    'curated travel',
    'b2b food supply',
    'try with si',
  ],
  alternates: {
    canonical: 'https://nutytales.com',
  },
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nuty Tales',
    url: 'https://nutytales.com',
    logo: 'https://nutytales.com/images/logo.jpg',
    description:
      'Nuty Tales — A Global Marketplace for Products, Gifting, Travel, Stays, Crafts, Weddings and Business Services. FSSAI Reg. 22724441000048.',
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

      {/* ── Group Ecosystem Bar ── */}
      <GroupEcosystemBar currentCompanyId="gateway" darkTheme={false} />

      {/* 1. Hero (Brand Message & Photography) */}
      <Hero />

      {/* ── Nuty Tales: Six Independent Global Businesses Showcase ── */}
      <GroupPortfolioShowcase />

      {/* 2. Gifts for Every Story Strip (Everyday, Weddings, Diwali, Corporate, Kashmir, Celebrations) */}
      <GiftsForEveryStory />

      {/* 3. Discover Nuty Tales (4 Doors: Taste, Gift, Stay, Discover) */}
      <DiscoverSection />

      {/* 4. Kashmir — Autumn & Winter Collections: Wear the Story (Try with SI Spotlight) */}
      <WinterCraftsSpotlight />

      {/* 5. Our Collection (Dry Fruits, Saffron, Honey, Makhana) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PopularProducts />
      </section>

      {/* 6. Nuty Tales Business Supply (Hotels, Bakeries, Sweet Shops, Food Plants) */}
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
