import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { HEALTH_CONDITIONS } from '@/lib/health-data'
import HealthConditionClient from './HealthConditionClient'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400 // 24-hour ISR caching

interface Props {
  params: Promise<{ condition: string }>
}

export async function generateStaticParams() {
  return Object.keys(HEALTH_CONDITIONS).map((condition) => ({
    condition,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { condition } = await params
  const data = HEALTH_CONDITIONS[condition]
  if (!data) return {}

  const canonicalUrl = `https://nutytales.com/health/${data.slug}`

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

export default async function HealthConditionPage({ params }: Props) {
  const { condition } = await params
  const data = HEALTH_CONDITIONS[condition]

  if (!data) {
    notFound()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        '@id': `https://nutytales.com/health/${data.slug}#medicalwebpage`,
        url: `https://nutytales.com/health/${data.slug}`,
        name: data.metaTitle,
        description: data.metaDescription,
        inLanguage: 'en-IN',
        about: {
          '@type': 'MedicalCondition',
          name: data.name,
        },
        aspect: ['dietary modification', 'nutritional management', 'superfood intervention'],
        publisher: {
          '@type': 'Organization',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
          logo: 'https://nutytales.com/images/logo.png',
        },
      },
      {
        '@type': 'Product',
        '@id': `https://nutytales.com/health/${data.slug}#carepack`,
        name: data.curatedPack.title,
        description: data.curatedPack.subtitle,
        image: `https://nutytales.com${data.curatedPack.items[0]?.image || '/images/promo-makhana-899.webp'}`,
        offers: {
          '@type': 'Offer',
          price: data.curatedPack.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `https://nutytales.com/health/${data.slug}`,
          seller: {
            '@type': 'Organization',
            name: 'Nuty Tales Foods & Crafts',
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `https://nutytales.com/health/${data.slug}#faq`,
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
            name: 'Clinical Health Hub',
            item: 'https://nutytales.com/health',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: data.name,
            item: `https://nutytales.com/health/${data.slug}`,
          },
        ],
      },
    ],
  }

  const allConditions = Object.values(HEALTH_CONDITIONS).filter((c) => c.slug !== data.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-stone-600 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/health" className="hover:text-emerald-700 transition-colors">
              Health Directory
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">{data.name}</span>
          </nav>

          {/* Hero Banner */}
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {data.heroBadge}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              {data.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-stone-700 max-w-3xl leading-relaxed">
              {data.heroSubheadline}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-stone-600 mr-2">Key Bio-Markers Targeted:</span>
              {data.primaryNutrientFocus.map((nutrient, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-emerald-950 shadow-xs"
                >
                  {nutrient}
                </span>
              ))}
            </div>
          </header>

          {/* Interactive Client Hub */}
          <HealthConditionClient data={data} />

          {/* Cross-Link Matrix of Other Health Conditions */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-bold mb-4">
              Explore Targeted Nutrition Protocols for Other Conditions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {allConditions.map((other) => (
                <Link
                  key={other.slug}
                  href={`/health/${other.slug}`}
                  className="p-3.5 rounded-xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group block"
                >
                  <div className="font-semibold text-stone-900 text-sm group-hover:text-emerald-900">
                    {other.name}
                  </div>
                  <div className="text-xs text-stone-600 mt-1 line-clamp-1">{other.shortSummary}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* Medical & Regulatory Disclaimer */}
          <footer className="text-xs text-stone-600 leading-relaxed border-t border-stone-200 pt-6 space-y-2">
            <p>
              <strong>Central FSSAI Lic. #{FSSAI_NUMBER} Statutory Compliance:</strong> The nutritional information and recommendations provided on this portal are for educational and dietary guidance based on peer-reviewed clinical nutrition literature. Food products are natural agricultural harvests and are not intended to diagnose, treat, cure, or prevent any disease. Always consult your attending physician or registered dietitian before initiating major dietary interventions for pre-existing medical conditions.
            </p>
            <p>
              Nuty Tales Foods & Crafts · Registered Office: PC-12, Sector 128, Noida 201304 · Kashmir Processing Center: Arshid House, Budgam 191111, Jammu & Kashmir.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
