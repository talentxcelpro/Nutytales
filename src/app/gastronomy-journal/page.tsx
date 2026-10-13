import type { Metadata } from 'next'
import GastronomyJournalClient from '@/components/journal/GastronomyJournalClient'

export const revalidate = 3600 // 1-hour ISR Edge Caching

export const metadata: Metadata = {
  title: 'The Gastronomy Journal | Nuty Tales · Terroir, Botanical Science & Himalayan Rituals',
  description:
    'An editorial publication exploring the culinary rituals, bioactive lipid science, Crocin extraction kinetics, and ancient Ayurvedic terroir of Kashmiri Mamra, Mongra Saffron, Kagzi Walnuts, and Mithila Makhana.',
  alternates: {
    canonical: 'https://nutytales.com/gastronomy-journal',
  },
  openGraph: {
    title: 'The Gastronomy Journal | Nuty Tales Foods & Crafts',
    description:
      'Terroir chronicles, culinary rituals, bioactive lipid science, and chef masterclasses from the High Himalayas.',
    url: 'https://nutytales.com/gastronomy-journal',
    siteName: 'Nuty Tales',
    images: [
      {
        url: '/images/saffron-threads-macro.jpg',
        width: 1200,
        height: 630,
        alt: 'Nuty Tales Gastronomy Journal · Himalayan Terroir Archives',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Gastronomy Journal | Nuty Tales',
    description:
      'Terroir chronicles, culinary rituals, bioactive lipid science, and chef masterclasses from the High Himalayas.',
    images: ['/images/saffron-threads-macro.jpg'],
  },
}

export default function GastronomyJournalPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'The Gastronomy Journal · Nuty Tales Himalayan Terroir Archives',
    description:
      'Botanical science, bioactive lipid profiles, and ancient culinary rituals from the high valleys of Kashmir and the Silk Route.',
    url: 'https://nutytales.com/gastronomy-journal',
    publisher: {
      '@type': 'Organization',
      name: 'Nuty Tales Foods & Crafts',
      url: 'https://nutytales.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nutytales.com/images/logo.jpg',
      },
    },
    hasPart: [
      {
        '@type': 'Article',
        headline: 'The Connoisseur Morning Ritual: Overnight Water-Soaked Mamra Badam & Wild Acacia Honey',
        description:
          'The biochemical mechanics of phytic acid deactivation, cold-climate lipid synthesis, and non-glycemic Levulose synergy.',
        image: 'https://nutytales.com/images/mamra-kernels-macro.jpg',
        author: {
          '@type': 'Organization',
          name: 'Nuty Tales Gastronomy Guild',
        },
      },
      {
        '@type': 'Article',
        headline: 'The Pampore Chemistry: Crocin Extraction Kinetics & The Science of the Saffron Bloom',
        description:
          'Why authentic Grade-1 Mongra stigmas take 20 minutes to infuse, and the destructive fallacy of instantaneous color.',
        image: 'https://nutytales.com/images/saffron-threads-macro.jpg',
        author: {
          '@type': 'Organization',
          name: 'Nuty Tales Gastronomy Guild',
        },
      },
      {
        '@type': 'Article',
        headline: 'The Fragile Bioactive Pellicle: Why Bleached Commercial Walnuts Turn Bitter vs. Sun-Cured Kagzi',
        description:
          'The fragile chemistry of Alpha-Linolenic Acid (ALA), chemical peroxide bleaching, and the single-hand palm crack.',
        image: 'https://nutytales.com/images/cashews-walnuts-macro.jpg',
        author: {
          '@type': 'Organization',
          name: 'Nuty Tales Gastronomy Guild',
        },
      },
      {
        '@type': 'Article',
        headline: 'Mithila Popped Nectar: 7-Suta Makhana as an Ancient Low-GI Ayurvedic Fasting Superfood',
        description:
          'The underwater harvesting of Euryale ferox, 7-Suta sieve precision, and resistant starch cellular architecture.',
        image: 'https://nutytales.com/images/makhana-pouch-250g.jpg',
        author: {
          '@type': 'Organization',
          name: 'Nuty Tales Gastronomy Guild',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GastronomyJournalClient />
    </>
  )
}
