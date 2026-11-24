import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { COMMODITY_COMPARISONS } from '@/lib/comparisons-data'
import CompareClient from './CompareClient'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(COMMODITY_COMPARISONS).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = COMMODITY_COMPARISONS[slug]
  if (!data) return {}

  const canonicalUrl = `https://nutytales.com/compare/${data.slug}`

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

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params
  const data = COMMODITY_COMPARISONS[slug]

  if (!data) {
    notFound()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://nutytales.com/compare/${data.slug}#article`,
        headline: data.title,
        description: data.metaDescription,
        inLanguage: 'en-IN',
        publisher: {
          '@type': 'Organization',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://nutytales.com/compare/${data.slug}#faq`,
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
            name: 'Botanical & Nutritional Comparisons',
            item: 'https://nutytales.com/compare',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.title,
            item: `https://nutytales.com/compare/${data.slug}`,
          },
        ],
      },
    ],
  }

  const otherComparisons = Object.values(COMMODITY_COMPARISONS).filter((c) => c.slug !== data.slug)

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
            <Link href="/compare" className="hover:text-emerald-700 transition-colors">
              Comparisons
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium truncate">{data.title}</span>
          </nav>

          {/* Header */}
          <header className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Independent Nutritional & Chemical Assay
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              {data.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
              {data.heroSubheadline}
            </p>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong className="text-emerald-950 font-bold block mb-1">Executive Summary:</strong>
              {data.executiveSummary}
            </div>
          </header>

          {/* Interactive Comparison Matrix */}
          <CompareClient data={data} />

          {/* Cross Link to Other Comparisons */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-bold mb-4">
              Explore More Superfood & Dry Fruit Comparisons
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherComparisons.map((other) => (
                <Link
                  key={other.slug}
                  href={`/compare/${other.slug}`}
                  className="p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group block"
                >
                  <div className="font-semibold text-stone-900 text-sm group-hover:text-emerald-900">
                    {other.title}
                  </div>
                  <div className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {other.executiveSummary}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-2">
                    Read Comparison →
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Statutory Footer */}
          <footer className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-6">
            <p>
              Central FSSAI Lic. #{FSSAI_NUMBER}. Comparative nutritional data compiled from USDA FoodData Central, ISO 3632-1 laboratory standards, and published botanical monographs.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
