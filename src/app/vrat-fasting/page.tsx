import type { Metadata } from 'next'
import Link from 'next/link'
import { VRAT_FESTIVALS } from '@/lib/vrat-fasting-data'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Indian Festive Fasting (Vrat) Diet Guides & Superfoods | Nuty Tales',
  description:
    'Complete fasting diet guides for Navratri, Ekadashi, Maha Shivratri, and Karwa Chauth. Discover pure sattvic dry fruits, phool makhana rules, and energy foods for Hindu fasting.',
  alternates: {
    canonical: 'https://nutytales.com/vrat-fasting',
  },
  openGraph: {
    title: 'Indian Festive Fasting (Vrat) Diet Guides & Superfoods | Nuty Tales',
    description:
      'Vedic fasting food rules, permitted falahar, and energy-dense superfoods for Navratri, Ekadashi, and Shivratri.',
    url: 'https://nutytales.com/vrat-fasting',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indian Festive Fasting (Vrat) Diet Guides & Superfoods | Nuty Tales',
    description:
      'Sattvic falahar guides for Navratri, Ekadashi, and Shivratri fasts.',
  },
}

export default function VratFastingHubPage() {
  const festivals = Object.values(VRAT_FESTIVALS)

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://nutytales.com/vrat-fasting#collection',
        url: 'https://nutytales.com/vrat-fasting',
        name: 'Indian Festive Fasting (Vrat) Diet Guides & Superfoods',
        description:
          'Vedic fasting food rules, permitted falahar, and energy-dense superfoods for Navratri, Ekadashi, and Shivratri.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://nutytales.com/#website',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://nutytales.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Vrat & Fasting Hub',
            item: 'https://nutytales.com/vrat-fasting',
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-stone-50 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Sacred Vedic Falahari Nutrition
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Indian Festive Vrat & Fasting Directory
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Explore scriptural fasting rules, permissible sattvic superfoods, forbidden grains, and daily meal timings for major Hindu religious fasts.
            </p>
          </div>

          {/* Festival Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {festivals.map((item) => (
              <Link
                key={item.slug}
                href={`/vrat-fasting/${item.slug}`}
                className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {item.heroBadge}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">{item.hindiName}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {item.festivalName}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {item.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 italic">{item.significance}</span>
                  <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Diet Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
