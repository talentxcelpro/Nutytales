import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { REGIONAL_CONFIGS, resolveRegionalProduct, getRegionalProducts } from '@/lib/regional-data'
import RegionalProductClient from '@/components/regional/RegionalProductClient'

interface Props {
  params: Promise<{ slug: string }>
}

const config = REGIONAL_CONFIGS.us

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = resolveRegionalProduct(slug, 'us')

  if (!item) {
    return {
      title: `Product Not Found | ${config.brandName}`,
    }
  }

  const title = `${item.regionalEditionTitle} — US & Canada Delivery | ${config.brandName}`
  const description = `${item.baseProduct.shortDesc} Gourmet orchard selection distributed across North America. Compliant with US FDA regulations and dispatched via ${config.regionalHub}.`

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
          url: item.baseProduct.image || '/images/luxury-hamper-jars.webp',
          width: 800,
          height: 800,
          alt: item.regionalEditionTitle,
        },
      ],
    },
  }
}

export const revalidate = 3600

export async function generateStaticParams() {
  const products = getRegionalProducts('us')
  return products.map((p) => ({
    slug: p.regionalSlug,
  }))
}

export default async function AmericaProductPage({ params }: Props) {
  const { slug } = await params
  const item = resolveRegionalProduct(slug, 'us')

  if (!item) {
    notFound()
  }

  return <RegionalProductClient config={config} productItem={item} />
}
