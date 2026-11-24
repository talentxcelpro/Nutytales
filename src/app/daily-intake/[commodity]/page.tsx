import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DAILY_INTAKE_DATA } from '@/lib/daily-intake-data'
import DailyIntakeClient from './DailyIntakeClient'

interface Props {
  params: Promise<{ commodity: string }>
}

export const revalidate = 86400 // Revalidate daily

export async function generateStaticParams() {
  return Object.keys(DAILY_INTAKE_DATA).map((commodity) => ({
    commodity,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { commodity } = await params
  const data = DAILY_INTAKE_DATA[commodity]

  if (!data) {
    return {
      title: 'Daily Intake & Nutrition Protocol | Nuty Tales',
      description: 'Scientific daily dry fruit intake dosages, soaking rules, and Ayurvedic timing.',
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nutytales.com'
  const canonicalUrl = `${appUrl}/daily-intake/${data.slug}`

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: canonicalUrl,
      siteName: 'Nuty Tales',
      images: [
        {
          url: data.productImage.startsWith('http') ? data.productImage : `${appUrl}${data.productImage}`,
          width: 1200,
          height: 630,
          alt: `${data.commodityName} Daily Intake Guide`,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
      images: [data.productImage.startsWith('http') ? data.productImage : `${appUrl}${data.productImage}`],
    },
    keywords: [
      `how many ${data.slug} to eat per day`,
      `how many ${data.commodityName} per day`,
      `soaked ${data.slug} benefits`,
      `best time to eat ${data.slug}`,
      `${data.slug} daily dosage`,
      `${data.hindiName} khane ke fayde`,
      'nuty tales daily intake',
    ],
  }
}

export default async function DailyIntakePage({ params }: Props) {
  const { commodity } = await params
  const data = DAILY_INTAKE_DATA[commodity]

  if (!data) {
    notFound()
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nutytales.com'
  const canonicalUrl = `${appUrl}/daily-intake/${data.slug}`

  // 1. HowTo Schema (for Google Soaking Rich Results)
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Soak & Prepare ${data.commodityName} for 100% Bio-Availability`,
    description: data.soakingProtocol.biochemicalReason,
    totalTime: `PT${data.soakingProtocol.soakingDurationHours}H`,
    step: data.soakingProtocol.stepByStep.map((s) => ({
      '@type': 'HowToStep',
      position: s.step,
      name: s.title,
      text: s.desc,
    })),
  }

  // 2. MedicalWebPage Schema
  const medicalSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: data.headline,
    url: canonicalUrl,
    description: data.subheadline,
    about: {
      '@type': 'MedicalCondition',
      name: `Nutritional Bio-Availability of ${data.commodityName}`,
    },
    aspect: [
      'Overview',
      'Dosage and administration',
      'Adverse effects',
      'Contraindications',
    ],
  }

  // 3. FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  // 4. Product Schema (for 30-Day Monthly Pack)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.monthlyPackTitle,
    image: data.productImage.startsWith('http') ? data.productImage : `${appUrl}${data.productImage}`,
    description: `${data.monthlyPackTitle} (${data.monthlyPackWeight}). 100% pure Himalayan harvest with Central FSSAI Lic. #22724441000048.`,
    brand: {
      '@type': 'Brand',
      name: 'Nuty Tales',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: data.monthlyPackPrice,
      availability: 'https://schema.org/InStock',
      url: `${appUrl}/shop/${data.productSlug}`,
      seller: {
        '@type': 'Organization',
        name: 'Nuty Tales',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <DailyIntakeClient data={data} />
    </>
  )
}
