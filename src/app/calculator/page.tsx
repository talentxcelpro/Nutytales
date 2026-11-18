import type { Metadata } from 'next'
import Link from 'next/link'
import CalculatorClient from './CalculatorClient'
import { FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Daily Dry Fruit Intake & Calorie Calculator | Precision Nutrition Guide | Nuty Tales',
  description:
    'Calculate your scientific daily portion of almonds, walnuts, makhana, dates, and pistachios. Calibrated to your body weight, activity level, and health goals (weight loss, lean muscle, diabetic control, memory, skin glow). Free instant nutrition breakdown.',
  keywords: [
    'dry fruit intake calculator',
    'how many almonds per day',
    'daily nut consumption chart',
    'makhana calories calculator',
    'dry fruit calories per day',
    'walnut intake for heart health',
    'mamra almond portion guide',
    'dry fruits for weight loss portion',
    'diabetic dry fruit portion calculator',
  ],
  alternates: {
    canonical: 'https://nutytales.com/calculator',
  },
  openGraph: {
    title: 'Daily Dry Fruit Intake & Calorie Calculator | Nuty Tales',
    description:
      'Personalized daily portion calculator for almonds, walnuts, makhana, and pistachios based on clinical nutrition guidelines.',
    url: 'https://nutytales.com/calculator',
    siteName: 'Nuty Tales',
    images: [
      {
        url: 'https://nutytales.com/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Nuty Tales Daily Dry Fruit & Calorie Calculator',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Dry Fruit Intake & Calorie Calculator | Nuty Tales',
    description:
      'Personalized daily portion calculator for almonds, walnuts, makhana, and pistachios based on clinical nutrition guidelines.',
    images: ['https://nutytales.com/opengraph-image'],
  },
}

export default function CalculatorPage() {
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Nuty Tales Daily Dry Fruit & Calorie Calculator',
    url: 'https://nutytales.com/calculator',
    description:
      'Interactive health tool to calculate precise daily portions of dry fruits and nuts based on body weight, fitness goals, and metabolic activity.',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    author: {
      '@type': 'Organization',
      name: 'Nuty Tales',
      url: 'https://nutytales.com',
    },
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Calculate Your Optimal Daily Dry Fruit Intake',
    description:
      'Step-by-step clinical nutrition protocol to find your exact daily portion of almonds, walnuts, makhana, and pistachios.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Select Your Health Goal',
        text: 'Choose whether you are targeting weight loss, lean muscle synthesis, cardio vitality, diabetic glycemic control, or cognitive memory.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Enter Your Body Weight and Activity Level',
        text: 'Input your weight in kilograms and specify whether your daily routine is sedentary, moderate, or athletic.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Review Your Daily Prescription Plate',
        text: 'Get exact piece counts and gram measurements for soaked Mamra almonds, Kagzi walnuts, roasted Mithila makhana, and pistachios.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Follow the Chrono-Nutrition Schedule',
        text: 'Consume your daily portion according to natural circadian digestive rhythms from morning wake-up to evening sleep.',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why should Mamra or California almonds be soaked before eating?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Soaking almonds in water for 6 to 8 hours neutralizes tannins and phytic acid present in the brown skin. Phytic acid inhibits zinc and iron absorption in the gut. Once peeled, digestive enzymes can extract 100% of the natural bioavailable vitamin E and healthy oils.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can diabetics consume Medjool dates and cashews safely?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, in controlled moderation. Medjool dates possess a low glycemic index (GI ~42) because their natural fructose is bound within insoluble fiber. Pairing 1 date with 2 walnut halves slows gastric emptying, preventing blood glucose surges.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many calories are in roasted Mithila Makhana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '100 grams of pure Mithila fox nuts provide approximately 347 calories, but because Makhana is lightweight and voluminous, 1 full cup (approx. 15g) is only ~52 calories with zero cholesterol and nearly 2g of clean plant protein.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Kashmiri Mongra Saffron help with sleep and skin collagen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Kashmiri Mongra saffron has the highest natural concentration of Crocin (>8.5%) and Safranal. Research confirms that 20–30mg of authentic saffron boosts synaptic serotonin levels, promoting deep REM sleep and reducing cortisol.',
        },
      },
    ],
  }

  const breadcrumbSchema = {
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
        name: 'Nutrition Calculator',
        item: 'https://nutytales.com/calculator',
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#FBF8F3] text-[#17233B] pt-28 sm:pt-36 pb-24">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-mono">
          <Link href="/" className="hover:text-[#C9A45C] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C9A45C] font-semibold">Nutrition Intelligence</span>
          <span>/</span>
          <span className="text-[#17233B] font-bold">Portion &amp; Calorie Calculator</span>
        </nav>

        {/* Client Calculator Engine */}
        <CalculatorClient />

        {/* Scientific Footnote Banner */}
        <div className="p-6 bg-white rounded-2xl border border-stone-200/70 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏛️</span>
            <div>
              <span className="font-bold text-[#17233B] block">Evidence-Based Clinical Formulations</span>
              <span>
                Calculated according to ICMR (Indian Council of Medical Research) dietary guidelines &amp; Ayurvedic Charaka Samhita nutrient density principles.
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="font-mono text-[10px] text-stone-400 block">FSSAI Central Lic. #{FSSAI_NUMBER}</span>
            <span className="text-emerald-700 font-semibold text-[11px]">100% Unadulterated Pure Harvest</span>
          </div>
        </div>
      </div>
    </main>
  )
}
