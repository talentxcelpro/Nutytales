import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MANDI_CITIES } from '@/lib/mandi-cities-data'
import CityMandiClient from './CityMandiClient'
import { FSSAI_NUMBER, DEFAULT_CONTACT_PHONE, WHATSAPP_NUMBERS } from '@/lib/constants'

export const revalidate = 3600 // 1-hour ISR for live market rates

interface Props {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return Object.keys(MANDI_CITIES).map((city) => ({
    city,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const data = MANDI_CITIES[city]
  if (!data) return {}

  const canonicalUrl = `https://nutytales.com/mandi-rates/${data.slug}`

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

export default async function CityMandiPage({ params }: Props) {
  const { city } = await params
  const data = MANDI_CITIES[city]

  if (!data) {
    notFound()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://nutytales.com/mandi-rates/${data.slug}#webpage`,
        url: `https://nutytales.com/mandi-rates/${data.slug}`,
        name: data.metaTitle,
        description: data.metaDescription,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://nutytales.com/#website',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
      },
      {
        '@type': 'Dataset',
        '@id': `https://nutytales.com/mandi-rates/${data.slug}#dataset`,
        name: `${data.mandiName} Wholesale Dry Fruit Daily Benchmark Rates`,
        description: `Daily wholesale rate sheet for Mamra almonds, Kashmiri saffron, makhana, and walnuts at ${data.mandiName}, ${data.cityName}.`,
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: {
          '@type': 'Organization',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
        temporalCoverage: '2026/2027',
        spatialCoverage: data.cityName,
      },
      {
        '@type': 'FAQPage',
        '@id': `https://nutytales.com/mandi-rates/${data.slug}#faq`,
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
            name: 'Mandi Rates Index',
            item: 'https://nutytales.com/mandi-rates',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.cityName,
            item: `https://nutytales.com/mandi-rates/${data.slug}`,
          },
        ],
      },
    ],
  }

  const otherCities = Object.values(MANDI_CITIES).filter((c) => c.slug !== data.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-stone-600 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/mandi-rates" className="hover:text-emerald-700 transition-colors">
              Mandi Rates
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">{data.cityName}</span>
          </nav>

          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                {data.heroBadge}
              </span>
              <span className="text-xs text-stone-500 font-medium">{data.hindiName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              {data.mandiName} Dry Fruit Wholesale Rates Today
            </h1>

            <p className="text-base sm:text-lg text-stone-700 max-w-3xl leading-relaxed">
              {data.marketOverview}
            </p>

            {/* Quick Mandi Credentials Pill */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-stone-600 bg-white p-4 rounded-2xl border border-stone-200">
              <div>
                <strong className="text-stone-900">Market Yard Address:</strong> {data.address} ({data.pincode})
              </div>
              <div>
                <strong className="text-stone-900">Trading Hours:</strong> {data.tradingHours}
              </div>
              <div>
                <strong className="text-stone-900">Holiday:</strong> {data.weeklyHoliday}
              </div>
              <div>
                <strong className="text-stone-900">APMC Cess:</strong> {data.apmcCessRate}
              </div>
            </div>
          </header>

          {/* Interactive Rates & RFQ Client Component */}
          <CityMandiClient data={data} />

          {/* Market Highlights */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Why Commercial Buyers in {data.cityName} Choose Direct Origin Dispatch
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.marketHighlights.map((highlight, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 flex gap-3 text-xs sm:text-sm text-stone-700">
                  <div className="text-emerald-700 font-bold">✓</div>
                  <div>{highlight}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Cross-Link Other Mandis */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-bold mb-4">
              Compare Today’s Rates Across Other Major Indian APMC Mandis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherCities.map((other) => (
                <Link
                  key={other.slug}
                  href={`/mandi-rates/${other.slug}`}
                  className="p-3.5 rounded-xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group block"
                >
                  <div className="font-semibold text-stone-900 text-sm group-hover:text-emerald-900">
                    {other.cityName}
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">{other.mandiName}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Legal / B2B Statutory Footer */}
          <footer className="text-xs text-stone-600 leading-relaxed border-t border-stone-200 pt-6 space-y-2">
            <p>
              <strong>Central FSSAI Lic. #{FSSAI_NUMBER} & Commercial Tax Notice:</strong> Wholesale benchmark prices are compiled daily from direct terminal spot transactions, APMC bulletin releases, and Nuty Tales direct farm-gate forward contracts. Minimum commercial order quantity (MOQ) applies. All transactions are billed with official GST invoices and e-Way bills.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
