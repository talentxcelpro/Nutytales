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
  const canonicalUrl = `https://nutytales.com/crafts/product/${slug}`

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

  const imageUrl = item.image
    ? (item.image.startsWith('http') ? item.image : `https://nutytales.com${item.image}`)
    : 'https://nutytales.com/opengraph-image'

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.shortDesc || item.longDesc || item.name,
    image: [imageUrl],
    sku: `NT-CRF-${item.id}`,
    mpn: `NT-CRF-${item.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Nuty Tales Crafts',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '86',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      url: `https://nutytales.com/crafts/product/${slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Nuty Tales Crafts',
        url: 'https://nutytales.com',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'd',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
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
        name: 'Crafts',
        item: 'https://nutytales.com/crafts',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.name,
        item: `https://nutytales.com/crafts/product/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CraftProductDetailClient />
    </>
  )
}
