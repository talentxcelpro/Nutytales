import type { Metadata } from 'next'
import Link from 'next/link'
import SaffronPurityClient from './SaffronPurityClient'
import { FSSAI_NUMBER, DEFAULT_CONTACT_PHONE, WHATSAPP_NUMBERS } from '@/lib/constants'

export const revalidate = 86400 // 24-hour Edge ISR

export const metadata: Metadata = {
  title: 'How to Check Pure Kashmiri Saffron at Home & Pregnancy Trimester Guide | Nuty Tales',
  description:
    'Step-by-step guide on how to test pure Kashmiri Mongra Saffron at home using warm water, baking soda, and finger rub tests. Complete pregnancy trimester dosage protocol, benefits, and ISO 3632 Cat-I lab certification.',
  alternates: {
    canonical: 'https://nutytales.com/saffron-purity-guide',
  },
  keywords: [
    'how to check pure saffron at home',
    'kashmiri saffron purity test warm water',
    'saffron in pregnancy benefits and dosage',
    'how much saffron in pregnancy second trimester',
    'real vs fake saffron test baking soda',
    'kesar milk pregnancy benefits',
    'mongra saffron vs lacha saffron difference',
    'fssai certified pure kashmiri saffron',
    'pampore saffron lab test report',
  ],
  openGraph: {
    title: 'How to Test Pure Kashmiri Saffron at Home & Pregnancy Guide | Nuty Tales',
    description:
      'Learn how to authenticate pure Kashmiri Mongra Saffron with 4 easy kitchen tests. Complete Ayurvedic pregnancy dosage protocol.',
    url: 'https://nutytales.com/saffron-purity-guide',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'article',
    images: [
      {
        url: 'https://nutytales.com/images/saffron-threads-macro.jpg',
        width: 1200,
        height: 630,
        alt: 'Pure Kashmiri Mongra Saffron Purity Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Check Pure Kashmiri Saffron at Home & Pregnancy Guide | Nuty Tales',
    description:
      '4 kitchen tests to spot fake saffron instantly, plus trimester-by-trimester pregnancy dosage guide.',
    images: ['https://nutytales.com/images/saffron-threads-macro.jpg'],
  },
}

export default function SaffronPurityPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': 'https://nutytales.com/saffron-purity-guide#article',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://nutytales.com/#website',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
        headline: 'How to Check Pure Kashmiri Saffron at Home & Pregnancy Trimester Guide',
        description:
          '4 simple kitchen tests to detect adulterated saffron, plus clinical and Ayurvedic pregnancy dosage guidance.',
        image: ['https://nutytales.com/images/saffron-threads-macro.jpg'],
        datePublished: '2026-10-15T08:00:00+05:30',
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Nuty Tales Botanical Science Labs',
          url: 'https://nutytales.com/founders',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://nutytales.com/images/logo.jpg',
          },
        },
        mainEntityOfPage: 'https://nutytales.com/saffron-purity-guide',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://nutytales.com/saffron-purity-guide#breadcrumb',
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
            name: 'Botanical Guides',
            item: 'https://nutytales.com/gastronomy-journal',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Saffron Purity & Pregnancy Guide',
            item: 'https://nutytales.com/saffron-purity-guide',
          },
        ],
      },
      {
        '@type': 'HowTo',
        '@id': 'https://nutytales.com/saffron-purity-guide#howto',
        name: 'How to Check Pure Kashmiri Saffron at Home in 4 Steps',
        description: 'Test real Kashmiri Mongra Saffron versus synthetic dyed fake saffron using warm water and baking soda.',
        totalTime: 'PT15M',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'The Warm Water Immersion Test',
            text: 'Drop 3–4 saffron threads into a glass of warm water (45°C). Authentic saffron slowly releases golden-yellow streamers over 15 minutes. Fake saffron bleeds dark red or orange in 3 seconds.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'The Baking Soda Alkaline Test',
            text: 'Dissolve a pinch of baking soda in water and add saffron threads. Pure crocin carotenoids remain bright yellow. Artificial chemical dyes turn dull red or brown.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'The Damp Finger Friction Test',
            text: 'Rub a soaked thread between your thumb and index finger. Real saffron stains skin golden-yellow and stays fibrous without disintegrating. Dyed paper or corn silk breaks down into mush.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'The Trumpet Flute Stigma Inspection',
            text: 'Observe thread shape under magnification. Kashmiri Mongra stigmas are fluted like a miniature trumpet (wider at the tip, slender at the base) with jagged crests, never uniform flat strips.',
          },
        ],
      },
      {
        '@type': 'Product',
        '@id': 'https://nutytales.com/shop/kashmiri-mongra-saffron#product',
        name: 'Pure Kashmiri Mongra Saffron (Grade-1 ISO 3632 Cat-I)',
        image: 'https://nutytales.com/images/saffron-jar-5g.webp',
        description: 'Single-origin Pampore Karewas saffron. Tested Crocin > 240, zero adulteration. Nitrogen-sealed in crystal jars.',
        brand: {
          '@type': 'Brand',
          name: 'Nuty Tales',
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'INR',
          lowPrice: 420,
          highPrice: 1950,
          offerCount: 3,
          availability: 'https://schema.org/InStock',
          url: 'https://nutytales.com/shop/kashmiri-mongra-saffron',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://nutytales.com/saffron-purity-guide#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'When should a pregnant woman start drinking saffron milk?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ayurveda and modern clinical obstetrics recommend starting saffron milk during the second trimester (around week 14 or 15), once the initial embryo implantation phase has stabilized. Always start with a small dosage of 2 to 3 strands infused in warm milk at night.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many saffron strands should be taken per day during pregnancy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A safe and effective maternal dosage is 2 to 3 strands (approx. 15 to 20 mg) per day during the second trimester, and 3 to 4 strands daily during the third trimester. Daily intake should not exceed 5 strands (above 30 mg) to prevent unnecessary uterine stimulation.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does authentic saffron taste sweet or bitter?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Authentic saffron smells sweet and honey-like (due to the volatile compound Safranal), but it ALWAYS tastes slightly bitter on the tongue (due to Picrocrocin). If saffron tastes sweet when placed directly on the tongue, it has been adulterated with sugar syrup or glycerin to increase weight.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the difference between Kashmiri Mongra and Lacha saffron?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Kashmiri Mongra consists strictly of the dark crimson top stigmas with zero yellow or white style tails, yielding the highest Crocin coloring strength (>240). Lacha saffron contains both the red stigmas attached to their yellow style tail, which lowers coloring power and price.',
            },
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

      <main className="min-h-screen bg-[#FCFBF8] text-[#2C1810] pb-24">
        {/* Breadcrumb Header */}
        <div className="bg-[#F5F2EB] border-b border-[#E8E2D5] px-4 py-3 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-stone-600">
            <Link href="/" className="hover:text-amber-800 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/gastronomy-journal" className="hover:text-amber-800 transition">
              Botanical Science
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Saffron Purity & Pregnancy Guide</span>
          </div>
        </div>

        {/* Page Hero */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Himalayan Terroir Laboratory · Clinical Transparency
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1810] mt-4 mb-4 leading-tight">
              How to Check Pure Kashmiri Saffron at Home & Pregnancy Trimester Guide
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-serif">
              Avoid fake dyed threads. Discover the 4-point chemical and diffusion tests to verify authentic Grade-1 Mongra at home, followed by the complete obstetric and Ayurvedic trimester protocol for expectant mothers.
            </p>
          </div>
        </div>

        {/* Client Interactive Test Studio */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SaffronPurityClient />
        </div>

        {/* Deep Knowledge FAQ Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-20">
          <div className="border-t border-stone-200 pt-12">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-3 mb-2">
                Pure Saffron Science & Maternal FAQs
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                  Does drinking saffron milk really make the baby fair?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  No. Skin pigmentation is determined entirely by parental genetics and melanin synthesis. However, the real medical benefits of pure saffron during pregnancy are profoundly real: it relieves nocturnal indigestion, stimulates natural serotonin to combat gestational mood swings, and promotes arterial elasticity.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                  Why does pure saffron take 15–20 minutes to color milk?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Real saffron stigmas are natural biological structures. The primary water-soluble carotenoid pigment, Crocin, is encapsulated within microscopic plant cells. When submerged, liquid must slowly rehydrate the cell walls before pigment molecules can diffuse outward. Synthetic food dyes (Tartrazine, Sunset Yellow) dissolve in 3 seconds because they are surface chemical powders.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                  What is the ISO 3632 Category-I standard?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  ISO 3632 is the international spectrophotometric standard for grading saffron. To achieve Category-I (highest global tier), saffron must demonstrate a Crocin coloring reading above 190. Nuty Tales Pampore Mongra consistently tests at Crocin &gt; 240, placing it among the most potent saffron harvests on Earth.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
