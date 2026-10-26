// ─── GET /wholesale-dry-fruits/pincode/[pincode] ─────────────────────────────
// Programmatic SEO landing page resolving all 32,000+ Indian Postal Index Numbers (PIN codes).
// Provides hyper-local commercial procurement, verified logistics SLAs, and bulk RFQ triggers.

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import { PRODUCTS } from '@/lib/products-data'
import { resolveIndianPincode } from '@/lib/seo/pincodes'
import { COMMERCIAL_HUBS } from '@/lib/seo/commercial-hubs'
import { schemaToJsonLd } from '@/lib/seo/metadata'

interface PageProps {
  params: Promise<{ pincode: string }>
}

// Top 50 commercial seed pincodes pre-rendered at build time; all 32,000 generated on-demand (ISR)
export async function generateStaticParams() {
  const topPincodes = [
    '110001', '110006', '110020', '110092', // Delhi (Connaught Place, Khari Baoli, Okhla)
    '400001', '400003', '400703', '400705', // Mumbai (Fort, Crawford Market, Vashi APMC)
    '395001', '395003', '395006', '395007', // Surat (Textile market, Katargam)
    '380001', '380002', '380009', '380015', // Ahmedabad (Kalupur, Navrangpura)
    '560001', '560002', '560022', '560066', // Bengaluru (Chickpet, Yeshwanthpur, Whitefield)
    '500001', '500002', '500012', '500081', // Hyderabad (Begum Bazar, Hitec City)
    '600001', '600079', '600092', '600100', // Chennai (George Town, Koyambedu)
    '700001', '700007', '700067', '700091', // Kolkata (Burrabazar, Posta, Salt Lake)
    '302001', '302002', '302003', '302020', // Jaipur (Johari Bazar, Mansarovar)
    '452001', '452002', '452007', '452010', // Indore (Siyaganj, Vijay Nagar)
    '411001', '411037', '411057', '411048', // Pune (Camp, Gultekdi Market Yard, Hinjewadi)
    '226001', '226003', '226010', '226016', // Lucknow (Hazratganj, Chowk, Gomti Nagar)
    '141001', '141008', '143001', '143006', // Ludhiana & Amritsar (Majith Mandi)
    '190001', '190002', '190008', '193403', // Srinagar (Lal Chowk, Maharaj Ganj) & Gulmarg
  ]
  return topPincodes.map((pin) => ({ pincode: pin }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pincode } = await params
  const pinInfo = resolveIndianPincode(pincode)

  if (!pinInfo.isValid) {
    return {
      title: `Wholesale Dry Fruits Delivery | Nuty Tales`,
    }
  }

  const title = `Wholesale Dry Fruits Delivery in PIN ${pincode} (${pinInfo.state}) | B2B Bulk Supply | Nuty Tales`
  const description = `Direct wholesale supply of Kashmiri Mamra almonds, W240 cashews, Pampore saffron, and walnuts to PIN ${pincode} (${pinInfo.primaryDistrict}). FSSAI Reg. ${FSSAI_NUMBER}, Surface Cargo ${pinInfo.transitDaysSurface}d, GST invoices.`

  return {
    title,
    description,
    keywords: [
      `wholesale dry fruits in ${pincode}`,
      `dry fruit supplier PIN ${pincode}`,
      `bulk almonds delivery ${pincode}`,
      `saffron wholesale ${pinInfo.state}`,
      `commercial dry fruits ${pinInfo.primaryDistrict}`,
      `dry fruit mandi near ${pincode}`,
    ],
    openGraph: {
      title,
      description,
      url: `https://nutytales.com/wholesale-dry-fruits/pincode/${pincode}`,
      siteName: 'Nuty Tales',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: `https://nutytales.com/wholesale-dry-fruits/pincode/${pincode}`,
    },
  }
}

export default async function PincodeWholesalePage({ params }: PageProps) {
  const { pincode } = await params
  const pinInfo = resolveIndianPincode(pincode)

  if (!pinInfo.isValid && pincode.length !== 6) {
    notFound()
  }

  // Find nearest commercial hub for linking
  const hub = COMMERCIAL_HUBS.find((h) => h.slug === pinInfo.hubSlug) || COMMERCIAL_HUBS[0]

  // Top bulk B2B products
  const b2bProducts = PRODUCTS.slice(0, 8)

  const whatsappMessage = encodeURIComponent(
    `Hello Nuty Tales, I am inquiring about wholesale dry fruit supply to PIN Code ${pincode} (${pinInfo.primaryDistrict}, ${pinInfo.state}). Please send your commercial rate list and MOQ details.`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBERS.B2B}?text=${whatsappMessage}`

  // Structured Data Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'WholesaleStore',
    name: `Nuty Tales B2B Logistics Delivery — PIN ${pincode}`,
    description: `Direct orchard-to-business wholesale dry fruits and spice distribution network serving PIN ${pincode}, ${pinInfo.state}.`,
    url: `https://nutytales.com/wholesale-dry-fruits/pincode/${pincode}`,
    telephone: DEFAULT_CONTACT_PHONE,
    priceRange: '₹₹₹',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${pinInfo.primaryDistrict}, ${pinInfo.state} (PIN ${pincode})`,
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
    },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the estimated delivery time for wholesale dry fruits to PIN ${pincode}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For PIN ${pincode} (${pinInfo.primaryDistrict}, ${pinInfo.state}), surface container cargo arrives in ${pinInfo.transitDaysSurface} business days. Air express courier shipments for premium saffron and urgent batches arrive in ${pinInfo.transitDaysAir} business days.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the minimum order quantity (MOQ) for businesses in PIN ${pincode}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Our standard B2B minimum order quantity is ${pinInfo.minOrderQuantityKg} kg per order across assorted dry fruits, nuts, and saffron. Contract orders above 500 kg qualify for direct mandi parity wholesale pricing.`,
        },
      },
      {
        '@type': 'Question',
        name: `Do you provide FSSAI batch test certificates and GST tax invoices for PIN ${pincode}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Every consignment dispatched to PIN ${pincode} includes an official 18-digit GST tax invoice (HSN 0802 / 0910), Central FSSAI license verification (${FSSAI_NUMBER}), and NABL accredited laboratory Certificate of Analysis (COA) specifying moisture and purity levels.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(faqSchema) }}
      />

      <main className="min-h-screen bg-[#070b0d] text-stone-100">
        {/* Breadcrumb Header */}
        <div className="border-b border-stone-800/80 bg-stone-900/40 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex text-xs font-mono text-stone-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <span className="mx-2 text-stone-600">/</span>
              <Link href="/wholesale-dry-fruits" className="hover:text-amber-400 transition-colors">B2B Wholesale</Link>
              <span className="mx-2 text-stone-600">/</span>
              <Link href={`/wholesale-dry-fruits/${pinInfo.hubSlug}`} className="hover:text-amber-400 transition-colors">{pinInfo.state}</Link>
              <span className="mx-2 text-stone-600">/</span>
              <span className="text-amber-400">PIN {pincode}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-stone-800">
          <div className="absolute inset-0 bg-radial-gradient from-amber-950/20 via-transparent to-transparent opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Commercial Logistics Line · PIN {pincode}
            </div>

            <h1 className="text-3xl font-serif font-light tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl">
              Wholesale Dry Fruits & Saffron Supply in <span className="text-amber-300 font-normal">PIN {pincode}</span>
            </h1>

            <p className="mt-4 text-lg text-stone-300 max-w-3xl leading-relaxed">
              Orchard-direct bulk procurement for bakeries, sweet manufacturers, hotels, caterers, and food brands across{' '}
              <strong className="text-white">{pinInfo.primaryDistrict}</strong> ({pinInfo.state}). Dispatched directly with FSSAI test certificates and GST commercial billing.
            </p>

            {/* Logistics Status Cards */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl">
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Surface Transit</div>
                <div className="mt-1 text-2xl font-semibold text-white">{pinInfo.transitDaysSurface} Days</div>
                <div className="text-[11px] text-stone-400">Insured Cargo Lines</div>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Air Express</div>
                <div className="mt-1 text-2xl font-semibold text-amber-300">{pinInfo.transitDaysAir} Day</div>
                <div className="text-[11px] text-stone-400">Premium Saffron SLA</div>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Primary Mandi Hub</div>
                <div className="mt-1 text-sm font-semibold text-white truncate">{pinInfo.nearestApmcHub}</div>
                <div className="text-[11px] text-stone-400">Regional Terminal</div>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Cold Chain</div>
                <div className="mt-1 text-sm font-semibold text-emerald-400">
                  {pinInfo.coldChainAvailable ? 'Available' : 'Ambient Air Pack'}
                </div>
                <div className="text-[11px] text-stone-400">Zero Heat Degradation</div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
              >
                <span>Instant WhatsApp Quote for PIN {pincode}</span>
                <span className="text-xs font-mono">→</span>
              </a>
              <Link
                href="/bulk-quote"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/80 px-6 py-3.5 text-sm font-medium text-stone-200 hover:border-amber-500/50 hover:bg-stone-800 transition-all"
              >
                Request Custom RFQ (50kg to 10 Tons)
              </Link>
            </div>
          </div>
        </section>

        {/* Product Catalog Slabs */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-stone-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif text-white">Wholesale Catalog Available in PIN {pincode}</h2>
              <p className="text-sm text-stone-400 mt-1">
                Direct batch dispatch from Kashmir Valley orchards & central fulfillment hubs.
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-xs font-mono text-amber-400">
              FSSAI Standard: NABL Batch COA Guaranteed
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {b2bProducts.map((product) => {
              const baseB2BPrice = product.b2bPricePerKg || Math.round(product.retailPrice * 0.7)
              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-stone-800/90 bg-stone-900/50 p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span className="font-mono text-amber-400">{product.origin}</span>
                      <span className="rounded bg-stone-800 px-2 py-0.5">{product.grade}</span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-white">{product.name}</h3>
                    <p className="mt-2 text-xs text-stone-400 line-clamp-2">{product.shortDesc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-800">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-stone-400 font-mono">B2B Base (50kg+)</span>
                      <span className="text-lg font-semibold text-white">₹{baseB2BPrice}<span className="text-xs text-stone-400">/kg</span></span>
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-400">
                      Tier 1 Ton: ₹{Math.round(baseB2BPrice * 0.92)}/kg (-8%)
                    </div>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBERS.B2B}?text=${encodeURIComponent(`Hi, I need wholesale price for ${product.name} in PIN Code ${pincode} (${pinInfo.state}). Quantity needed:`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block w-full text-center rounded-lg border border-stone-700 bg-stone-800 py-2 text-xs font-medium text-stone-200 hover:border-amber-400 hover:text-white transition-colors"
                    >
                      Book Dispatch to {pincode}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-white text-center mb-8">
            Commercial Supply FAQs for PIN {pincode} ({pinInfo.primaryDistrict})
          </h2>

          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
                <h3 className="text-base font-medium text-amber-300">{faq.name}</h3>
                <p className="mt-2 text-sm text-stone-300 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center text-xs text-stone-400">
            Fulfillment Facility: {pinInfo.dispatchFacility} · GST Invoicing Included · FSSAI Reg. {FSSAI_NUMBER}
          </div>
        </section>
      </main>
    </>
  )
}
