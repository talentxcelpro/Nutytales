import type { Metadata } from 'next'
import Link from 'next/link'
import { DELIVERY_CITIES } from '@/lib/delivery-cities-data'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Express Dry Fruits Delivery Across Major Indian Cities | Nuty Tales',
  description:
    'Same-day and 24-48 hr express dry fruit delivery in Delhi NCR, Mumbai, and Bangalore. Fresh single-origin Kashmiri Mamra almonds, saffron, and Mithila makhana.',
  alternates: {
    canonical: 'https://nutytales.com/express-delivery',
  },
  openGraph: {
    title: 'Express Dry Fruits Delivery Across Major Indian Cities | Nuty Tales',
    description:
      'Fast doorstep delivery of farm-fresh dry fruits, nuts, and saffron across Indian metros.',
    url: 'https://nutytales.com/express-delivery',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Express Dry Fruits Delivery Across Major Indian Cities | Nuty Tales',
    description:
      'Fast doorstep delivery of farm-fresh dry fruits and saffron.',
  },
}

export default function ExpressDeliveryHubPage() {
  const cities = Object.values(DELIVERY_CITIES)

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://nutytales.com/express-delivery#collection',
        url: 'https://nutytales.com/express-delivery',
        name: 'Express Dry Fruits Delivery Across Major Indian Cities',
        description:
          'Fast doorstep delivery of farm-fresh dry fruits, nuts, and saffron across Indian metros.',
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
            name: 'Express Delivery Directory',
            item: 'https://nutytales.com/express-delivery',
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
              Fast Doorstep Delivery Hub
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Express Metro Dry Fruit Delivery
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Order fresh single-origin Himalayan harvests, lotus seeds, and certified saffron with direct doorstep express delivery across India’s major commercial corridors.
            </p>
          </div>

          {/* City Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((item) => (
              <Link
                key={item.slug}
                href={`/express-delivery/${item.slug}`}
                className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {item.heroBadge}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      {item.deliveryTimeline.split(' ')[0]} Speed
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {item.cityName}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {item.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">Free shipping &gt; ₹999</span>
                  <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Check Pincode →
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
