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

  return <ProductDetailClient product={gift} />
}
