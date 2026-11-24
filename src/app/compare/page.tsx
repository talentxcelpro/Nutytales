import type { Metadata } from 'next'
import Link from 'next/link'
import { COMMODITY_COMPARISONS } from '@/lib/comparisons-data'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Dry Fruits & Superfood Comparisons | Botanical Nutrition Guide | Nuty Tales',
  description:
    'Evidence-based comparisons: Mamra Badam vs California Almonds, Kashmiri Saffron vs Iranian Saffron, Makhana vs Popcorn, and more. Transparent nutritional and cost breakdowns.',
  alternates: {
    canonical: 'https://nutytales.com/compare',
  },
  openGraph: {
    title: 'Dry Fruits & Superfood Comparisons | Nuty Tales',
    description:
      'Discover which dry fruits offer the best nutrition, oil content, and value for your health.',
    url: 'https://nutytales.com/compare',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dry Fruits & Superfood Comparisons | Nuty Tales',
    description:
      'Botanical and nutritional comparisons of popular nuts and saffron.',
  },
}

export default function CompareHubPage() {
  const comparisons = Object.values(COMMODITY_COMPARISONS)

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://nutytales.com/compare#collection',
        url: 'https://nutytales.com/compare',
        name: 'Dry Fruits & Superfood Comparisons',
        description:
          'Evidence-based comparisons of dry fruits, nuts, makhana, and saffron.',
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
            name: 'Comparisons',
            item: 'https://nutytales.com/compare',
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
              Independent Scientific Benchmarks
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Superfood & Dry Fruit Comparisons
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Unbiased, lab-tested side-by-side evaluations to help you choose the best nuts, seeds, and spices for your health goals and budget.
            </p>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisons.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                    <span className="text-emerald-800 font-bold">{item.optionA.shortLabel}</span>
                    <span>vs</span>
                    <span>{item.optionB.shortLabel}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {item.executiveSummary}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-mono">{item.metrics.length} Parameters Tested</span>
                  <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Analysis →
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
