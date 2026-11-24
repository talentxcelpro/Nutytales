import type { Metadata } from 'next'
import Link from 'next/link'
import MandiRatesClient from './MandiRatesClient'
import { FSSAI_NUMBER, DEFAULT_CONTACT_PHONE, WHATSAPP_NUMBERS } from '@/lib/constants'

export const revalidate = 3600 // 1-hour ISR Edge caching for live market updates

export const metadata: Metadata = {
  title: 'Daily Wholesale Dry Fruits Mandi Rates India Today | Khari Baoli & Kashmir APMC | Nuty Tales',
  description:
    'Live daily wholesale dry fruit prices today across Khari Baoli Delhi, Kashmir Mandi, and Mumbai APMC. Direct wholesale rates for Mamra almonds, Kashmiri saffron, Mithila makhana, walnuts, and cashews with GST invoices.',
  alternates: {
    canonical: 'https://nutytales.com/mandi-rates',
  },
  keywords: [
    'khari baoli dry fruit rate today',
    'dry fruits wholesale price list today',
    'kashmir walnut mandi rate',
    'kashmiri mamra badam wholesale price delhi',
    'pampore saffron wholesale price per kg',
    'mithila makhana wholesale price bihar',
    'w240 cashew wholesale rate mumbai',
    'dry fruit mandi contact number',
    'apmc dry fruits price today',
  ],
  openGraph: {
    title: 'Daily Wholesale Dry Fruits Mandi Rates India Today | Nuty Tales',
    description:
      'Live wholesale mandi benchmark rates for Khari Baoli, Kashmir, and Mumbai APMC. Save 8-15% with direct farm-gate dispatch.',
    url: 'https://nutytales.com/mandi-rates',
    siteName: 'Nuty Tales Foods & Crafts',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Wholesale Dry Fruits Mandi Rates India Today | Nuty Tales',
    description:
      'Live wholesale dry fruit rates today across Delhi, Kashmir, and Mumbai markets. Direct origin supply with GST invoices.',
  },
}

export default function MandiRatesPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.B2B || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://nutytales.com/mandi-rates#webpage',
        url: 'https://nutytales.com/mandi-rates',
        name: 'Daily Wholesale Dry Fruits Mandi Rates India Today',
        description:
          'Live wholesale dry fruit price benchmarks across Khari Baoli Delhi, Srinagar Mandi, and Mumbai APMC.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://nutytales.com/#website',
          name: 'Nuty Tales Foods & Crafts',
          url: 'https://nutytales.com',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://nutytales.com/mandi-rates#breadcrumb',
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
            name: 'Wholesale B2B',
            item: 'https://nutytales.com/wholesale-dry-fruits',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Daily Mandi Rates',
            item: 'https://nutytales.com/mandi-rates',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://nutytales.com/mandi-rates#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is today’s wholesale rate of Kashmiri Mamra Badam in Khari Baoli?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Today’s benchmark wholesale price for Grade-A Kashmiri Mamra Almonds in Khari Baoli (Delhi) ranges between ₹3,400 to ₹3,550 per kg. Nuty Tales provides direct farm-gate dispatch from Budgam/Pulwama starting at ₹3,150 per kg with verified 52.8% natural oil content.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the bulk wholesale rate for pure Kashmiri Mongra Saffron per kg?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pure Grade-1 Kashmiri Mongra Saffron (ISO 3632 Category-I with Crocin reading > 240) trades at ₹2,35,000 to ₹2,60,000 per kg wholesale. Nuty Tales supplies authenticated vacuum-sealed lots with minimum order quantities (MOQ) as low as 50 grams for food manufacturers and temples.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the wholesale price of Mithila Phool Makhana today?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Standard commercial 6-Suta makhana trades around ₹950 to ₹980 per kg in Delhi and Patna. Nuty Tales supplies hand-graded 7-Suta Jumbo flakes (>20mm) directly from Darbhanga & Madhubani at ₹899 per kg in 25kg bulk sacks.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you provide GST tax invoices and transport logistics for wholesale orders?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Every dispatch is accompanied by an official 100% compliant GST invoice with appropriate HSN codes (0802 for nuts, 0910 for saffron, 1904 for makhana) to ensure full Input Tax Credit (ITC). We partner with BlueDart, Delhivery Surface, and VRL Logistics for insured doorstep delivery across India.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is the Minimum Order Quantity (MOQ) for B2B wholesale rates?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Our standard MOQ is 10kg to 25kg for nuts and makhana, and 50g for saffron. For corporate gifting and bakery bulk orders exceeding 100kg, additional tiered commercial discounts are applied.',
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

      <main className="min-h-screen bg-[#FCFBF8] text-[#2C1810]">
        {/* Breadcrumb Header */}
        <div className="bg-[#F5F2EB] border-b border-[#E8E2D5] px-4 py-3 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs text-stone-600">
            <Link href="/" className="hover:text-amber-800 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/wholesale-dry-fruits" className="hover:text-amber-800 transition">
              Wholesale B2B
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-900">Live Mandi Rates</span>
          </div>
        </div>

        {/* Page Hero */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
              B2B Commodity Intelligence · Direct Origin Supply
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1810] mt-4 mb-4 leading-tight">
              India Wholesale Dry Fruits Mandi Rates Today
            </h1>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-serif">
              Real-time daily wholesale benchmarks for Khari Baoli (Delhi), Lal Chowk (Srinagar), and APMC Vashi (Mumbai). Procure directly from Kashmir & Mithila farm-gate hubs with Central FSSAI Lic. #{FSSAI_NUMBER} and full GST input tax credit.
            </p>
          </div>
        </div>

        {/* Interactive Client Component */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <MandiRatesClient />
        </div>

        {/* Major Terminal Mandis Directory */}
        <section className="bg-stone-50 border-t border-stone-200 py-12 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Regional Terminal Mandis Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
                City-Specific Dry Fruit Mandi Rates & APMC Guides
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Access local market yards, APMC cess details, freight transit times, and direct farm-gate savings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Link
                href="/mandi-rates/delhi-khari-baoli"
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                  Delhi NCR Mandi Rates
                </div>
                <div className="text-xs text-stone-500 mt-1">Khari Baoli & Katra Ishwar Bhawan</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
                  View Rates →
                </div>
              </Link>

              <Link
                href="/mandi-rates/mumbai-apmc-vashi"
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                  Mumbai APMC Mandi Rates
                </div>
                <div className="text-xs text-stone-500 mt-1">Vashi APMC Market I & II (Turbhe)</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
                  View Rates →
                </div>
              </Link>

              <Link
                href="/mandi-rates/kashmir-srinagar"
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                  Srinagar & Pampore Mandi
                </div>
                <div className="text-xs text-stone-500 mt-1">Parimpora & Farm Gate Origin Hub</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
                  View Rates →
                </div>
              </Link>

              <Link
                href="/mandi-rates/bihar-gulabbagh"
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                  Gulabbagh Mandi Purnea
                </div>
                <div className="text-xs text-stone-500 mt-1">National Phool Makhana Capital</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
                  View Rates →
                </div>
              </Link>

              <Link
                href="/mandi-rates/ahmedabad-kalupur"
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                  Ahmedabad Kalupur Mandi
                </div>
                <div className="text-xs text-stone-500 mt-1">Chokha Bazar & Madhupura Market</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
                  View Rates →
                </div>
              </Link>

              <Link
                href="/mandi-rates/bangalore-yeshwanthpur"
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                  Bengaluru APMC Mandi
                </div>
                <div className="text-xs text-stone-500 mt-1">Yeshwanthpur Yard & Corporate Gifting</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
                  View Rates →
                </div>
              </Link>

              <Link
                href="/mandi-rates/kolkata-posta"
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-emerald-600 hover:shadow-md transition-all group"
              >
                <div className="font-bold text-stone-900 group-hover:text-emerald-900 text-sm">
                  Kolkata Posta Mandi
                </div>
                <div className="text-xs text-stone-500 mt-1">Barabazar & Eastern India Gateway</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-3 inline-flex items-center gap-1">
                  View Rates →
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Commercial FAQ Section */}
        <section className="bg-white border-t border-stone-200 py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
                Commercial Procurement Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-3 mb-2">
                Frequently Asked B2B Mandi Questions
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Essential procurement insights for sweet shops, bakeries, FMCG packagers, and retailers.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200">
                <h3 className="font-bold text-base text-stone-900 mb-2">
                  How often are these Mandi rates updated?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Our procurement desks in Khari Baoli (Delhi), Srinagar (Kashmir), and Darbhanga (Bihar) update rates daily by 08:30 AM IST to reflect overnight arrivals, mandi auction volumes, and transport freight adjustments.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200">
                <h3 className="font-bold text-base text-stone-900 mb-2">
                  Why are Nuty Tales direct prices lower than Khari Baoli?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Terminal mandis like Khari Baoli add multiple commission agents (Adathiyas), mandi cess, and regional re-packaging markups. Nuty Tales dispatches directly from our origin aggregation centers in Kashmir and Bihar, passing 8% to 15% in pure margin savings directly to your business.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200">
                <h3 className="font-bold text-base text-stone-900 mb-2">
                  Can we receive laboratory test certificates before placing large orders?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Absolutely. Every batch of Kashmiri Saffron carries NABL-accredited ISO 3632 testing for Crocin (color), Picrocrocin (flavor), and Safranal (aroma). For Mamra almonds, we provide oil-content chromatographic analysis upon request.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-stone-200">
                <h3 className="font-bold text-base text-stone-900 mb-2">
                  How do we initiate a wholesale order today?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Simply click &quot;Get RFQ / Order&quot; on any commodity above or message our dedicated B2B desk directly on WhatsApp at{' '}
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    className="text-amber-800 font-bold underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +{whatsappPhone}
                  </a>
                  . Our trade desk will issue a formal proforma invoice with dispatch schedules within 30 minutes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
