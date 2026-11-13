import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getGiftBySlug, getAllGifts } from '@/lib/gifting-marketplace-data'
import ProductDetailClient from './ProductDetailClient'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const gifts = getAllGifts()
  return gifts.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const gift = getGiftBySlug(slug)

  if (!gift) {
    return {
      title: 'Gift Not Found | Nuty Tales Gifting',
    }
  }

  return {
    title: `${gift.name} | Nuty Tales Gifting`,
    description: `${gift.shortDesc} Buy authentic Kashmiri hampers, dry fruits & personalized celebration gifts online.`,
    alternates: {
      canonical: `https://nutytales.com/gifting/product/${gift.slug}`,
    },
    openGraph: {
      title: `${gift.name} — Nuty Tales Gifting`,
      description: gift.shortDesc,
      url: `https://nutytales.com/gifting/product/${gift.slug}`,
      images: [{ url: gift.primaryImage, alt: gift.name }],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const gift = getGiftBySlug(slug)

  if (!gift) {
    notFound()
  }

  const imageUrl = gift.primaryImage
    ? (gift.primaryImage.startsWith('http') ? gift.primaryImage : `https://nutytales.com${gift.primaryImage}`)
    : 'https://nutytales.com/opengraph-image'

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: gift.name,
    description: gift.shortDesc || (gift as any).longDesc || gift.name,
    image: [imageUrl],
    sku: `NT-GFT-${gift.id}`,
    mpn: `NT-GFT-${gift.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Nuty Tales Gifting',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '64',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: gift.price,
      priceCurrency: 'INR',
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      url: `https://nutytales.com/gifting/product/${gift.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Nuty Tales Gifting',
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
        name: 'Gifting',
        item: 'https://nutytales.com/gifting',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: gift.name,
        item: `https://nutytales.com/gifting/product/${gift.slug}`,
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
      <ProductDetailClient product={gift} />
    </>
  )
}
