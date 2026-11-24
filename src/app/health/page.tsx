import type { Metadata } from 'next'
import Link from 'next/link'
import { HEALTH_CONDITIONS } from '@/lib/health-data'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Clinical Nutrition & Condition-Specific Dry Fruit Directory | Nuty Tales',
  description:
    'Evidence-based clinical dietary guidance for Diabetes, Cholesterol, Pregnancy, Weight Loss, High Uric Acid, Hypertension, and Fatty Liver. Discover scientific portions of pure Himalayan dry fruits and lotus seeds.',
  alternates: {
    canonical: 'https://nutytales.com/health',
  },
  openGraph: {
    title: 'Clinical Nutrition & Condition-Specific Dry Fruit Directory | Nuty Tales',
    description:
      'Doctor & nutritionist-backed dry fruit protocols for 10 common lifestyle and metabolic conditions. Zero adulteration, FSSAI certified.',
    url: 'https://nutytales.com/health',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clinical Nutrition & Condition-Specific Dry Fruit Directory | Nuty Tales',
    description:
      'Scientific portion guides for dry fruits and nuts tailored to diabetes, heart wellness, pregnancy, and weight loss.',
  },
}

export default function HealthHubPage() {
  const conditions = Object.values(HEALTH_CONDITIONS)

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://nutytales.com/health#collection',
        url: 'https://nutytales.com/health',
        name: 'Clinical Nutrition & Condition-Specific Dry Fruit Directory',
        description:
          'Evidence-based clinical dietary guidance for Diabetes, Cholesterol, Pregnancy, Weight Loss, High Uric Acid, Hypertension, and Fatty Liver.',
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
            name: 'Health Protocols',
            item: 'https://nutytales.com/health',
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
              Evidence-Based Nutritional Science
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Condition-Specific Dry Fruit Protocols
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Every body and metabolic profile is unique. Explore clinical portion charts, glycemic index benchmarks, and daily timing protocols for 10 common lifestyle health conditions.
            </p>
          </div>

          {/* Quick Interactive Tools Bar */}
          <div className="p-6 bg-gradient-to-r from-emerald-900 to-stone-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">
                Free Diagnostic Tool
              </div>
              <h2 className="text-xl font-serif font-bold">
                Daily Dry Fruit Intake & Calorie Calculator
              </h2>
              <p className="text-xs text-emerald-100/80">
                Calculate your exact daily grams of almonds, walnuts, and makhana tailored to body weight & fitness goals.
              </p>
            </div>
            <Link
              href="/calculator"
              className="py-3 px-6 bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold rounded-xl text-sm transition-all whitespace-nowrap shadow-md"
            >
              Launch Portion Calculator →
            </Link>
          </div>

          {/* 10 Condition Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {conditions.map((item) => (
              <Link
                key={item.slug}
                href={`/health/${item.slug}`}
                className="p-6 bg-white rounded-3xl border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {item.heroBadge}
                    </span>
                    <span className="text-xs text-stone-600 font-medium">{item.hindiName}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.shortSummary}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {item.primaryNutrientFocus.slice(0, 2).map((focus, i) => (
                      <span key={i} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {focus}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Protocol →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Institutional Quality Assurance */}
          <section className="bg-emerald-50/60 rounded-3xl border border-emerald-200/80 p-8 text-center max-w-4xl mx-auto space-y-3">
            <h3 className="text-lg font-serif font-bold text-emerald-950">
              Why Purity & Terroir Matter For Medical Nutrition
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto">
              Conventional supermarket dry fruits are frequently subject to sulfur fumigation, paraffin waxing, and hydrogenated oil roasting. Nuty Tales sources 100% single-origin harvests from Kashmir, Bihar, and select global terroirs with zero chemical refining.
            </p>
            <div className="pt-2 text-xs text-emerald-900 font-mono">
              Central FSSAI Lic. #{FSSAI_NUMBER} · ISO 3632 Cat-I Certified Saffron
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
