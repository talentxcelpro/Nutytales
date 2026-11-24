import type { Metadata } from 'next'
import Link from 'next/link'
import { CULINARY_RECIPES } from '@/lib/recipes-data'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Healthy Superfood Recipes & Vrat Fasting Dishes | Nuty Tales',
  description:
    'Discover delicious, nutrient-dense recipes made with pure Himalayan dry fruits, Kashmiri saffron, and jumbo makhana. Healthy desserts, Navratri & Shivratri fasting dishes, Kashmiri kehwa, and postpartum panjiri.',
  alternates: {
    canonical: 'https://nutytales.com/recipes',
  },
  openGraph: {
    title: 'Healthy Superfood Recipes & Vrat Fasting Dishes | Nuty Tales',
    description:
      'Step-by-step authentic recipes using single-origin makhana, pure saffron, and dry fruits. Rich in protein, gluten-free, and fasting approved.',
    url: 'https://nutytales.com/recipes',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthy Superfood Recipes & Vrat Fasting Dishes | Nuty Tales',
    description:
      'Authentic Indian recipes with Kashmiri saffron, makhana, and raw dry fruits.',
  },
}

export default function RecipesHubPage() {
  const recipes = Object.values(CULINARY_RECIPES)

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://nutytales.com/recipes#collection',
        url: 'https://nutytales.com/recipes',
        name: 'Healthy Superfood Recipes & Vrat Fasting Dishes',
        description:
          'Step-by-step authentic recipes using single-origin makhana, pure saffron, and dry fruits.',
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
            name: 'Recipes Directory',
            item: 'https://nutytales.com/recipes',
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
              Authentic Indian Culinary & Wellness Kitchen
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Superfood & Vrat Fasting Recipes
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Wholesome, doctor-vetted recipes made with pure Himalayan dry fruits, certified Kashmiri saffron, and jumbo makhana. Healthy desserts, 5-minute snacks, and sacred festive delicacies.
            </p>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((item) => (
              <Link
                key={item.slug}
                href={`/recipes/${item.slug}`}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden hover:border-emerald-500 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {item.isVratFriendly ? '★ Vrat Special' : 'Healthy Superfood'}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">
                      {item.totalTimeMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="font-semibold text-stone-700">
                    {item.caloriesPerServing} kcal · {item.proteinGrams}g protein
                  </div>
                  <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View Recipe →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Interactive Tools Promotion Bar */}
          <div className="bg-gradient-to-r from-emerald-950 to-stone-900 text-white rounded-3xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Precision Portion Control
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Daily Dry Fruit Intake Calculator
              </h2>
              <p className="text-xs text-stone-300 max-w-xl">
                Need to know exact daily portions for diabetes, weight loss, or pregnancy? Calculate your custom grams in 30 seconds.
              </p>
            </div>
            <Link
              href="/calculator"
              className="py-3 px-6 bg-emerald-400 hover:bg-emerald-300 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-md self-start sm:self-auto"
            >
              Launch Portion Tool →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
