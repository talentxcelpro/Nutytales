import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { INITIAL_VENDORS } from '@/lib/weddings/data'
import VendorDetailClient from './VendorDetailClient'

interface VendorPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return INITIAL_VENDORS.map((vendor) => ({
    slug: vendor.slug,
  }))
}

export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const { slug } = await params
  const vendor = INITIAL_VENDORS.find((v) => v.slug === slug)

  if (!vendor) {
    return {
      title: 'Vendor Not Found | Nuty Tales Weddings',
      description: 'The requested wedding vendor could not be found.',
    }
  }

  const title = `${vendor.businessName} — Wedding ${vendor.category.toUpperCase()} in ${vendor.destination}`
  const description = `${vendor.bio} Starting rate from ₹${vendor.startingPrice.toLocaleString('en-IN')}. Verified packages, portfolios, and direct concierge inquiry.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://weddings.nutytales.com/vendors/${vendor.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://weddings.nutytales.com/vendors/${vendor.slug}`,
      siteName: 'Nuty Tales Weddings',
      images: [
        {
          url: vendor.portfolio[0] || 'https://weddings.nutytales.com/images/wedding-celebration.jpg',
          width: 1200,
          height: 630,
          alt: vendor.businessName,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [vendor.portfolio[0] || 'https://weddings.nutytales.com/images/wedding-celebration.jpg'],
    },
  }
}

export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = await params
  const vendor = INITIAL_VENDORS.find((v) => v.slug === slug)

  if (!vendor) {
    notFound()
  }

  // Schema.org ProfessionalService Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: vendor.businessName,
    description: vendor.bio,
    image: vendor.portfolio.map((img) =>
      img.startsWith('http') ? img : `https://weddings.nutytales.com${img}`
    ),
    address: {
      '@type': 'PostalAddress',
      addressLocality: vendor.city,
      addressCountry: vendor.country,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: vendor.rating,
      reviewCount: vendor.reviewsCount,
      bestRating: '5',
      worstRating: '1',
    },
    priceRange: `From ${vendor.currency} ${vendor.startingPrice.toLocaleString()}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VendorDetailClient vendor={vendor} />
    </>
  )
}
