import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { VRAT_FESTIVALS } from '@/lib/vrat-fasting-data'
import VratClient from './VratClient'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

interface Props {
  params: Promise<{ festival: string }>
}

export async function generateStaticParams() {
  return Object.keys(VRAT_FESTIVALS).map((festival) => ({
    festival,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { festival } = await params
  const data = VRAT_FESTIVALS[festival]
  if (!data) return {}

  const canonicalUrl = `https://nutytales.com/vrat-fasting/${data.slug}`

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

export default async function VratFestivalDetailPage({ params }: Props) {
  const { festival } = await params
  const data = VRAT_FESTIVALS[festival]

  if (!data) {
    notFound()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://nutytales.com/vrat-fasting/${data.slug}#article`,
        headline: data.festivalName,
        description: data.metaDescription,
        inLanguage: 'en-IN',
        publisher: {
          '@type': 'Organization',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
      },
      {
        '@type': 'Product',
        '@id': `https://nutytales.com/vrat-fasting/${data.slug}#vratbox`,
        name: data.curatedBox.title,
        description: `Complete ${data.festivalName} sattvic fasting superfood hamper`,
        image: 'https://nutytales.com/images/promo-makhana-899.webp',
        offers: {
          '@type': 'Offer',
          price: data.curatedBox.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `https://nutytales.com/vrat-fasting/${data.slug}`,
          seller: {
            '@type': 'Organization',
            name: 'Nuty Tales Foods & Crafts',
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://nutytales.com/vrat-fasting/${data.slug}#faq`,
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
            name: 'Fasting & Vrat Guides',
            item: 'https://nutytales.com/vrat-fasting',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.festivalName,
            item: `https://nutytales.com/vrat-fasting/${data.slug}`,
          },
        ],
      },
    ],
  }

  const otherFestivals = Object.values(VRAT_FESTIVALS).filter((f) => f.slug !== data.slug)

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
            <Link href="/vrat-fasting" className="hover:text-emerald-700 transition-colors">
              Vrat & Fasting Hub
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium truncate">{data.festivalName}</span>
          </nav>

          {/* Header */}
          <header className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                {data.heroBadge}
              </span>
              <span className="text-xs text-stone-500 font-medium">{data.hindiName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              {data.festivalName}
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
              {data.overview}
            </p>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
              <span className="font-bold text-amber-800">Spiritual Significance:</span>
              <span>{data.significance}</span>
            </div>
          </header>

          {/* Interactive Vrat Client Component */}
          <VratClient festival={data} />

          {/* Cross Link to Other Fasting Festivals */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-bold mb-4">
              Explore More Sacred Indian Vrat Guides & Superfood Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherFestivals.map((other) => (
                <Link
                  key={other.slug}
                  href={`/vrat-fasting/${other.slug}`}
                  className="p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group block"
                >
                  <div className="font-semibold text-stone-900 text-sm group-hover:text-emerald-900">
                    {other.festivalName}
                  </div>
                  <div className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {other.overview}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-2">
                    View Diet Rules →
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Statutory Footer */}
          <footer className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-6">
            <p>
              Central FSSAI Lic. #{FSSAI_NUMBER}. All festive superfoods are 100% natural, unprocessed, and compliant with traditional sattvic dietary codes.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
