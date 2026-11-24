import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DELIVERY_CITIES } from '@/lib/delivery-cities-data'
import ExpressClient from './ExpressClient'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

interface Props {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return Object.keys(DELIVERY_CITIES).map((city) => ({
    city,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const data = DELIVERY_CITIES[city]
  if (!data) return {}

  const canonicalUrl = `https://nutytales.com/express-delivery/${data.slug}`

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: canonicalUrl,
      siteName: 'Nuty Tales Foods & Crafts',
      locale: 'en_IN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
    },
  }
}

export default async function ExpressDeliveryCityPage({ params }: Props) {
  const { city } = await params
  const data = DELIVERY_CITIES[city]

  if (!data) {
    notFound()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'DeliveryService',
        '@id': `https://nutytales.com/express-delivery/${data.slug}#service`,
        name: `Nuty Tales Express Dry Fruits Delivery ${data.cityName}`,
        description: data.metaDescription,
        provider: {
          '@type': 'Organization',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
        areaServed: {
          '@type': 'City',
          name: data.cityName,
        },
        hasDeliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeDirectDownload',
      },
      {
        '@type': 'FAQPage',
        '@id': `https://nutytales.com/express-delivery/${data.slug}#faq`,
        mainEntity: data.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
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
          {
            '@type': 'ListItem',
            position: 3,
            name: data.cityName,
            item: `https://nutytales.com/express-delivery/${data.slug}`,
          },
        ],
      },
    ],
  }

  const otherCities = Object.values(DELIVERY_CITIES).filter((c) => c.slug !== data.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-stone-500 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/express-delivery" className="hover:text-emerald-700 transition-colors">
              Express Delivery
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium truncate">{data.cityName}</span>
          </nav>

          {/* Header */}
          <header className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              {data.heroBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Fresh Dry Fruits Express Delivery in {data.cityName}
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
              {data.overview}
            </p>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 flex flex-wrap items-center gap-4">
              <div>
                <strong className="text-stone-900">Delivery Speed:</strong> {data.deliveryTimeline}
              </div>
              <div>
                <strong className="text-stone-900">Dispatch Hub:</strong> {data.fulfillmentHub}
              </div>
            </div>
          </header>

          {/* Interactive Client Component */}
          <ExpressClient cityData={data} />

          {/* City Cross-Linking */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-bold mb-4">
              Explore Express Delivery in Other Major Metros
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherCities.map((other) => (
                <Link
                  key={other.slug}
                  href={`/express-delivery/${other.slug}`}
                  className="p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group block"
                >
                  <div className="font-semibold text-stone-900 text-sm group-hover:text-emerald-900">
                    {other.cityName}
                  </div>
                  <div className="text-xs text-stone-500 mt-1 line-clamp-1">
                    {other.deliveryTimeline}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-2">
                    View City Hub →
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Statutory Footer */}
          <footer className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-6">
            <p>
              Central FSSAI Lic. #{FSSAI_NUMBER}. Nitrogen-flushed packaging ensures maximum freshness during transit.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
