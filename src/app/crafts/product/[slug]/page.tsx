import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CLOTHING_PRODUCTS, getClothingBySlug } from '@/lib/clothing-data'
import { CRAFT_PRODUCTS, getCraftBySlug } from '@/lib/crafts-data'
import CraftProductDetailClient from './CraftProductDetailClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const clothingSlugs = CLOTHING_PRODUCTS.map((p) => ({ slug: p.slug }))
  const craftSlugs = CRAFT_PRODUCTS.map((c) => ({ slug: c.slug }))
  const allSlugs = Array.from(new Set([...clothingSlugs.map((s) => s.slug), ...craftSlugs.map((s) => s.slug)]))
  return allSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = getClothingBySlug(slug) || getCraftBySlug(slug)

  if (!item) {
    return {
      title: 'Craft Product | Nuty Tales Crafts',
    }
  }

  const name = item.name
  const originState = (item as any).state || 'India'
  const description = item.shortDesc || `Authentic GI handcrafted apparel: ${name}. Handcrafted by master artisans in ${originState}.`
  const canonicalUrl = `https://crafts.nutytales.com/product/${slug}`

  return {
    title: `${name} | Handcrafted ${originState} Heritage | Nuty Tales Crafts`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${name} | Nuty Tales Crafts`,
      description,
      url: canonicalUrl,
      siteName: 'Nuty Tales Crafts',
      locale: 'en_IN',
      type: 'website',
      images: item.image ? [{ url: item.image, alt: name }] : [],
    },
  }
}

export default async function CraftProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const item = getClothingBySlug(slug) || getCraftBySlug(slug)

  if (!item) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.shortDesc,
    image: item.image,
    sku: `NT-CRF-${item.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Nuty Tales Crafts',
    },
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://crafts.nutytales.com/product/${slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Nuty Tales Crafts',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CraftProductDetailClient />
    </>
  )
}
