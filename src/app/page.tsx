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

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Nuty Tales Foods & Crafts and who is the parent organisation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nuty Tales Foods & Crafts is a subsidiary of Nexgenn Services specializing in single-origin dry fruits, nuts, healthy snacks, corporate gifting, wedding hampers, Kashmiri crafts, and boutique stays. It operates under central FSSAI registration 22724441000048.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is the official registered office of Nuty Tales Foods & Crafts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The official registered office is PC-12, 003, Jaypee Wishtown, Sector 128, Noida, Uttar Pradesh 201304, India. Google Maps location: https://www.google.com/maps/place/Nuty+Tales+(Dry+fruits)/@28.5209169,77.3539445,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce7f48d890b99:0x17d4f4be831d96c1!8m2!3d28.5209122!4d77.3565248!16s%2Fg%2F11vyp7r8k6',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Nuty Tales located in Kashmir?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nuty Tales operates its Kashmir procurement, property, and business hub at Arshid House, Budgam–Gojra Road, Dadna, Budgam, Jammu and Kashmir 191111, India. Google Maps location: https://www.google.com/maps/place/Arshid+House/@34.0087558,74.7060736,17z/data=!4m6!3m5!1s0x38e191f6e26e2615:0x437d1ccd908b0d4a!8m2!3d34.0087701!4d74.7086101!16s%2Fg%2F11t2ssyygj',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Nuty Tales located in Patna, Bihar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nuty Tales operates its Eastern commercial and Makhana aggregation hub at Nafis Colony, near Noor Plaza, Bari Path, Lalbagh, Patna, Bihar 800004, India. Mappls location: https://www.mappls.com/place-noor+plaza-bari+path-lalbagh-patna-bihar-800004-VOK1WN@zdata=MjUuNjE2MzI0Kzg1LjE3MDQxNysxNytWT0sxV04rKw==ed',
        },
      },
      {
        '@type': 'Question',
        name: 'What is Nuty Tales central FSSAI registration number?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The central FSSAI registration number for Nuty Tales Foods & Crafts is 22724441000048.',
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B]">
      {/* Schema.org OnlineStore & FAQPage Structured Data for LLMs and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
