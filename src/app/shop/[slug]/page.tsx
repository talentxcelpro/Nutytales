import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PRODUCTS, Product } from '@/lib/products-data'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import { FSSAI_NUMBER } from '@/lib/constants'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const COMMON_ALIASES: Record<string, string> = {
  'pure-mongra-saffron': 'kashmiri-mongra-saffron',
  'kashmiri-saffron': 'kashmiri-mongra-saffron',
  'pampore-mongra-saffron': 'kashmiri-mongra-saffron',
  'saffron': 'kashmiri-mongra-saffron',
  'mongra-saffron': 'kashmiri-mongra-saffron',
  'kashmir-saffron': 'kashmiri-mongra-saffron',
  'super-negin-saffron': 'iranian-super-negin-saffron',
  'persian-saffron': 'iranian-super-negin-saffron',
  'kashmiri-kagzi-walnuts': 'kashmiri-walnuts-in-shell',
  'kagzi-akhrot': 'kashmiri-walnuts-in-shell',
  'kagzi-walnuts': 'kashmiri-walnuts-in-shell',
  'walnuts': 'kashmiri-walnuts-in-shell',
  'akhrot': 'kashmiri-walnuts-in-shell',
  'mamra-badam': 'mamra-almonds-kashmiri-badam',
  'kashmiri-mamra-badam': 'mamra-almonds-kashmiri-badam',
  'mamra-almonds': 'mamra-almonds-kashmiri-badam',
  'california-almonds': 'california-almonds-premium',
  'almonds': 'california-almonds-premium',
  'makhana': 'makhana-grade-a-fox-nuts',
  'phool-makhana': 'makhana-grade-a-fox-nuts',
  'cashews': 'w240-premium-cashews',
  'kaju': 'w240-premium-cashews',
  'acacia-honey': 'pure-kashmiri-acacia-honey',
  'kashmiri-honey': 'pure-kashmiri-acacia-honey',
  'honey': 'pure-kashmiri-acacia-honey',
  'pistachios': 'iranian-pistachios-roasted-salted',
  'pista': 'iranian-pistachios-roasted-salted',
  'anjeer': 'dried-anjeer-turkish-figs',
  'figs': 'dried-anjeer-turkish-figs',
  'turkish-anjeer': 'dried-anjeer-turkish-figs',
  'afghan-anjeer': 'afghan-kandahari-mala-anjeer',
  'mala-anjeer': 'afghan-kandahari-mala-anjeer',
  'kishmish': 'kishmish-green-afghan-raisins',
  'raisins': 'kishmish-green-afghan-raisins',
  'munakka': 'jumbo-black-munakka-seedless',
  'black-raisins': 'jumbo-black-munakka-seedless',
  'apricots': 'ladakh-halman-wild-apricots',
  'khubani': 'ladakh-halman-wild-apricots',
  'halman-apricots': 'ladakh-halman-wild-apricots',
  'ajwa': 'royal-ajwa-dates-madinah',
  'ajwa-dates': 'royal-ajwa-dates-madinah',
  'gurbandi': 'gurbandi-badam-afghan-almonds',
  'gurbandi-badam': 'gurbandi-badam-afghan-almonds',
  'w180': 'king-jumbo-w180-cashews',
  'w180-cashews': 'king-jumbo-w180-cashews',
}

function resolveProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined
  // 1. Exact match
  const exact = PRODUCTS.find((p) => p.slug === slug)
  if (exact) return exact

  // 2. Alias dictionary
  const aliasTarget = COMMON_ALIASES[slug.toLowerCase()]
  if (aliasTarget) {
    const matched = PRODUCTS.find((p) => p.slug === aliasTarget)
    if (matched) return matched
  }

  // 3. Keyword / partial match
  const clean = slug.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (clean.includes('saffron') || clean.includes('kesar') || clean.includes('mongra')) {
    if (clean.includes('iran') || clean.includes('negin')) {
      return PRODUCTS.find((p) => p.slug === 'iranian-super-negin-saffron')
    }
    return PRODUCTS.find((p) => p.slug === 'kashmiri-mongra-saffron')
  }

  if (clean.includes('walnut') || clean.includes('akhrot')) {
    return PRODUCTS.find((p) => p.slug === 'kashmiri-walnuts-in-shell') || PRODUCTS.find((p) => p.slug.includes('walnut'))
  }

  if (clean.includes('mamra')) {
    return PRODUCTS.find((p) => p.slug === 'mamra-almonds-kashmiri-badam')
  }

  if (clean.includes('almond') || clean.includes('badam')) {
    return PRODUCTS.find((p) => p.slug === 'california-almonds-premium')
  }

  if (clean.includes('makhana')) {
    return PRODUCTS.find((p) => p.slug === 'makhana-grade-a-fox-nuts')
  }

  if (clean.includes('honey')) {
    return PRODUCTS.find((p) => p.slug === 'pure-kashmiri-acacia-honey')
  }

  return PRODUCTS.find((p) => p.slug.replace(/[^a-z0-9]/g, '').includes(clean) || clean.includes(p.slug.replace(/[^a-z0-9]/g, '')))
}

export async function generateStaticParams() {
  const allSlugs = new Set([
    ...PRODUCTS.map((p) => p.slug),
    ...Object.keys(COMMON_ALIASES),
  ])
  return Array.from(allSlugs).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = resolveProductBySlug(slug)
  if (!product) return { title: 'Product Not Found | Nuty Tales' }

  return {
    title: `${product.name} — Retail & Wholesale | Nuty Tales`,
    description: `${product.shortDesc} Origin: ${product.origin}. Available in 250g, 500g, 1kg retail and 5kg to 50kg bulk wholesale. FSSAI Lic. ${FSSAI_NUMBER}.`,
    keywords: [
      product.name.toLowerCase(),
      `${product.name.toLowerCase()} wholesale`,
      `${product.category.toLowerCase()} price per kg`,
      `${product.origin.toLowerCase()} dry fruits`,
    ],
    openGraph: {
      title: `${product.name} | Nuty Tales`,
      description: product.shortDesc,
      images: product.image ? [product.image] : undefined,
    },
    alternates: {
      canonical: `https://nutytales.com/shop/${product.slug}`,
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = resolveProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
  ).slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc,
    brand: {
      '@type': 'Brand',
      name: 'Nuty Tales',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: product.variants[0]?.retailPrice || product.retailPrice,
      highPrice: product.retailPrice,
      offerCount: product.variants.length,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32">
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#D4870A]">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#D4870A]">
            Shop
          </Link>
          <span>/</span>
          <Link
            href={`/shop?category=${product.categorySlug}`}
            className="hover:text-[#D4870A]"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">{product.name}</span>
        </nav>

        {/* Main Product Component */}
        <ProductDetailClient product={product} />

        {/* Extended Description & Storage */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 space-y-4">
          <h2 className="text-xl font-bold text-[#3D2B1F] font-serif">
            About {product.name}
          </h2>
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
            {product.longDesc}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="space-y-6 pt-4">
            <h2 className="text-2xl font-bold text-[#3D2B1F] font-serif">
              More in {product.category}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/shop/${rel.slug}`}
                  className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-[#D4870A] shadow-sm transition-all group block space-y-2"
                >
                  <span className="text-[10px] font-bold uppercase text-[#D4870A]">
                    {rel.category}
                  </span>
                  <h3 className="font-bold text-xs text-[#3D2B1F] group-hover:text-[#D4870A] line-clamp-1">
                    {rel.name}
                  </h3>
                  <p className="text-xs font-black text-stone-900">
                    ₹{rel.retailPrice.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] font-normal text-stone-500">/ kg</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
