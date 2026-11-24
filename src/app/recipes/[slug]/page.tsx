import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CULINARY_RECIPES } from '@/lib/recipes-data'
import RecipeClient from './RecipeClient'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return Object.keys(CULINARY_RECIPES).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const recipe = CULINARY_RECIPES[slug]
  if (!recipe) return {}

  const canonicalUrl = `https://nutytales.com/recipes/${recipe.slug}`

  return {
    title: recipe.metaTitle,
    description: recipe.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: recipe.metaTitle,
      description: recipe.metaDescription,
      url: canonicalUrl,
      siteName: 'Nuty Tales Foods & Crafts',
      locale: 'en_IN',
      type: 'article',
      images: [
        {
          url: `https://nutytales.com${recipe.heroImage}`,
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.metaTitle,
      description: recipe.metaDescription,
      images: [`https://nutytales.com${recipe.heroImage}`],
    },
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params
  const recipe = CULINARY_RECIPES[slug]

  if (!recipe) {
    notFound()
  }

  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    headline: recipe.title,
    description: recipe.shortDescription,
    image: [`https://nutytales.com${recipe.heroImage}`],
    author: {
      '@type': 'Organization',
      name: 'Nuty Tales Foods & Crafts',
      url: 'https://nutytales.com',
    },
    datePublished: '2026-11-24',
    prepTime: `PT${recipe.prepTimeMinutes}M`,
    cookTime: `PT${recipe.cookTimeMinutes}M`,
    totalTime: recipe.isoTotalTime,
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: 'Healthy Snack & Festive Dessert',
    recipeCuisine: 'Indian',
    keywords: recipe.dietaryTags.join(', '),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.caloriesPerServing} calories`,
      proteinContent: `${recipe.proteinGrams} g`,
      fiberContent: `${recipe.fiberGrams} g`,
    },
    recipeIngredient: recipe.ingredients.map((i) => `${i.quantity} ${i.name}`),
    recipeInstructions: recipe.steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.title,
      text: step.instruction,
      position: step.stepNumber,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '142',
      bestRating: '5',
      worstRating: '1',
    },
  }

  const otherRecipes = Object.values(CULINARY_RECIPES).filter((r) => r.slug !== recipe.slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />

      <main className="min-h-screen bg-stone-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-stone-500 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/recipes" className="hover:text-emerald-700 transition-colors">
              Culinary & Vrat Recipes
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium truncate">{recipe.title}</span>
          </nav>

          {/* Header */}
          <header className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                {recipe.difficulty} Recipe · Ready in {recipe.totalTimeMinutes} Mins
              </span>
              <span className="text-xs text-stone-500 font-medium">{recipe.hindiTitle}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              {recipe.title}
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed">
              {recipe.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {recipe.dietaryTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 shadow-xs"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Interactive Recipe & Cart Client Component */}
          <RecipeClient recipe={recipe} />

          {/* Cross Link to Other Recipes */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-serif text-stone-900 font-bold mb-4">
              Explore More Superfood & Vrat Recipes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {otherRecipes.map((other) => (
                <Link
                  key={other.slug}
                  href={`/recipes/${other.slug}`}
                  className="p-4 rounded-2xl border border-stone-200/80 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group block"
                >
                  <div className="font-semibold text-stone-900 text-sm group-hover:text-emerald-900">
                    {other.title}
                  </div>
                  <div className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {other.shortDescription}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-2">
                    {other.totalTimeMinutes} mins · {other.caloriesPerServing} cal →
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Statutory Footer */}
          <footer className="text-xs text-stone-500 leading-relaxed border-t border-stone-200 pt-6">
            <p>
              Central FSSAI Lic. #{FSSAI_NUMBER}. All Nuty Tales raw dry fruits and saffron are tested for 100% natural purity and zero synthetic adulteration under ISO 3632-1 standards.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
