import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { REGIONAL_CONFIGS, resolveRegionalProduct, getRegionalProducts } from '@/lib/regional-data'
import RegionalProductClient from '@/components/regional/RegionalProductClient'

interface Props {
  params: Promise<{ slug: string }>
}

const config = REGIONAL_CONFIGS.me

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = resolveRegionalProduct(slug, 'me')

  if (!item) {
    return {
      title: `Product Not Found | ${config.brandName}`,
    }
  }

  const title = `${item.regionalEditionTitle} — GCC Delivery | ${config.brandName}`
  const description = `${item.baseProduct.shortDesc} Specially prepared for GCC & Middle East diaspora delivery in our ${config.packagingBadge}. Direct flight dispatch from ${config.regionalHub}.`

  return {
    title,
    description,
    alternates: {
      canonical: item.canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: item.canonicalUrl,
      siteName: config.brandName,
      images: [
        {
          url: item.baseProduct.image || '/images/luxury-hamper-jars.png',
          width: 800,
          height: 800,
          alt: item.regionalEditionTitle,
        },
      ],
    },
  }
}

export const revalidate = 3600

export default async function MiddleEastProductPage({ params }: Props) {
  const { slug } = await params
  const item = resolveRegionalProduct(slug, 'me')

  if (!item) {
    notFound()
  }

  return <RegionalProductClient config={config} productItem={item} />
}
