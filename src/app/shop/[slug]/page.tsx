import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PRODUCTS, Product } from '@/lib/products-data'
import ProductDetailClient from '@/components/products/ProductDetailClient'
import { FSSAI_NUMBER } from '@/lib/constants'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) return { title: 'Product Not Found | Nutty Tales' }

  return {
    title: `${product.name} — Retail & Wholesale | Nutty Tales`,
    description: `${product.shortDesc} Origin: ${product.origin}. Available in 250g, 500g, 1kg retail and 5kg to 50kg bulk wholesale. FSSAI Lic. ${FSSAI_NUMBER}.`,
    keywords: [
      product.name.toLowerCase(),
      `${product.name.toLowerCase()} wholesale`,
      `${product.category.toLowerCase()} price per kg`,
      `${product.origin.toLowerCase()} dry fruits`,
    ],
    openGraph: {
      title: `${product.name} | Nutty Tales`,
      description: product.shortDesc,
      images: product.image ? [product.image] : undefined,
    },
    alternates: {
      canonical: `https://nuttytales.com/shop/${product.slug}`,
    },
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = PRODUCTS.find((p) => p.slug === slug)

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
      name: 'Nutty Tales',
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
