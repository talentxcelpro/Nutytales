import type { Metadata } from 'next'
import Link from 'next/link'
import VerifyClient from './VerifyClient'
import { FSSAI_NUMBER } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'NABL Lab Test Report & Batch Authenticity Verification | Nuty Tales',
  description:
    'Verify your Nuty Tales dry fruits and Kashmiri saffron batch lab report online. Enter your lot number to view NABL-accredited ISO 3632 Crocin testing, natural oil percentage, and zero aflatoxin certificates.',
  alternates: {
    canonical: 'https://nutytales.com/verify',
  },
  keywords: [
    'dry fruit batch verification',
    'saffron purity lab test report',
    'kashmiri saffron crocin testing certificate',
    'nabl certified food testing online',
    'mamra almond oil percentage report',
    'makhana aflatoxin free certificate',
    'iso 3632 saffron report lookup',
    'nutytales batch authentication',
  ],
  openGraph: {
    title: 'NABL Lab Test Report & Batch Authenticity Verification | Nuty Tales',
    description:
      'Digital Certificate of Analysis (COA) lookup for Nuty Tales single-origin dry fruits, lotus seeds, and certified Kashmiri saffron.',
    url: 'https://nutytales.com/verify',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NABL Lab Test Report & Batch Authenticity Verification | Nuty Tales',
    description:
      'Enter lot number to view NABL lab reports for Crocin, oil content, and purity.',
  },
}

export default function VerifyPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://nutytales.com/verify#webpage',
        url: 'https://nutytales.com/verify',
        name: 'NABL Lab Test Report & Batch Authenticity Verification',
        description:
          'Digital Certificate of Analysis (COA) lookup for Nuty Tales single-origin dry fruits, lotus seeds, and certified Kashmiri saffron.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://nutytales.com/#website',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
      },
      {
        '@type': 'Dataset',
        '@id': 'https://nutytales.com/verify#dataset',
        name: 'Nuty Tales Quality Control Laboratory Certificates',
        description:
          'Publicly auditable laboratory test parameters including ISO 3632 spectrophotometric Crocin counts, lipid percentages, and mycotoxin clearances.',
        license: 'https://creativecommons.org/licenses/by/4.0/',
        creator: {
          '@type': 'Organization',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
      },
      {
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
            name: 'Batch Verification',
            item: 'https://nutytales.com/verify',
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-stone-50 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-xs text-stone-600 flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-medium">Batch Verification & Lab Reports</span>
          </nav>

          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              100% Traceable Terroir & NABL Certification
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Laboratory Certificate & Batch Authenticator
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Every jar, pouch, and wholesale carton dispatched by Nuty Tales is assigned an immutable Lot Number tied to independent NABL laboratory assays and GPS farm coordinates.
            </p>
          </div>

          {/* Interactive Verification Client */}
          <VerifyClient />

          {/* Transparency & Testing Standards */}
          <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Our 4-Pillar Quality & Purity Commitment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
                <span className="font-bold text-emerald-900 text-sm block">1. ISO 3632-1 Cat-I Saffron Protocol</span>
                <p className="text-stone-600 leading-relaxed">
                  Every lot of Kashmiri Mongra saffron is tested using UV-visible spectrophotometry to verify coloring power (Crocin &gt; 190), aroma (Safranal), and flavor (Picrocrocin) with zero synthetic dyes.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
                <span className="font-bold text-emerald-900 text-sm block">2. Single-Origin GPS Terroir Tracking</span>
                <p className="text-stone-600 leading-relaxed">
                  We never blend imported Afghan or Iranian almonds with Kashmiri Mamra, nor do we mix commercial makhana. Each batch is harvested from specific micro-climates in Kashmir and Bihar.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
                <span className="font-bold text-emerald-900 text-sm block">3. Aflatoxin & Heavy Metal Free</span>
                <p className="text-stone-600 leading-relaxed">
                  Every nut and seed lot undergoes high-performance liquid chromatography (HPLC) testing to certify zero aflatoxin contamination and compliance with strict EU & FSSAI residue limits.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-1">
                <span className="font-bold text-emerald-900 text-sm block">4. Nitrogen Flushing for 12-Month Crunch</span>
                <p className="text-stone-600 leading-relaxed">
                  Oxygen is the enemy of natural oils. Our retail pouches and B2B vacuum cartons are flushed with inert food-grade nitrogen, preventing oil rancidity without chemical BHA/BHT preservatives.
                </p>
              </div>
            </div>
          </section>

          {/* Statutory Footer */}
          <footer className="text-xs text-stone-600 leading-relaxed border-t border-stone-200 pt-6 space-y-2">
            <p>
              <strong>Central FSSAI Lic. #{FSSAI_NUMBER}:</strong> Testing reports are issued by third-party NABL-accredited analytical laboratories under ISO/IEC 17025 standards. For official regulatory inquiries or bulk institutional audit packets, contact our compliance officer at <span className="font-mono text-stone-800">compliance@nutytales.com</span>.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
