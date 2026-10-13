import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { INITIAL_VENUES } from '@/lib/weddings/data'
import VenueDetailClient from './VenueDetailClient'

interface VenuePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return INITIAL_VENUES.map((venue) => ({
    slug: venue.slug,
  }))
}

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { slug } = await params
  const venue = INITIAL_VENUES.find((v) => v.slug === slug)

  if (!venue) {
    return {
      title: 'Venue Not Found | Nuty Tales Weddings',
      description: 'The requested wedding venue could not be found.',
    }
  }

  const title = `${venue.name} — Luxury Wedding Venue in ${venue.destination}`
  const description = `${venue.description} Guest capacity: ${venue.capacityMin}–${venue.capacityMax} guests with ${venue.accommodationRooms} guest suites. Verified rates, curfews, and catering policies.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://weddings.nutytales.com/venues/${venue.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://weddings.nutytales.com/venues/${venue.slug}`,
      siteName: 'Nuty Tales Weddings',
      images: [
        {
          url: venue.images[0] || 'https://weddings.nutytales.com/images/weddings/hero-palace.jpg',
          width: 1200,
          height: 630,
          alt: venue.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [venue.images[0] || 'https://weddings.nutytales.com/images/weddings/hero-palace.jpg'],
    },
  }
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params
  const venue = INITIAL_VENUES.find((v) => v.slug === slug)

  if (!venue) {
    notFound()
  }

  // Schema.org EventVenue Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    name: venue.name,
    description: venue.description,
    image: venue.images.map((img) =>
      img.startsWith('http') ? img : `https://weddings.nutytales.com${img}`
    ),
    address: {
      '@type': 'PostalAddress',
      addressLocality: venue.city,
      addressCountry: venue.country,
    },
    maximumAttendeeCapacity: venue.capacityMax,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: venue.rating,
      reviewCount: venue.reviewsCount,
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: venue.priceStarting,
      priceCurrency: venue.currency,
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VenueDetailClient venue={venue} />
    </>
  )
}
