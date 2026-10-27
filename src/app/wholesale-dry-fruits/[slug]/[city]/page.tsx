// ─── GET /wholesale-dry-fruits/[product]/[city] ─────────────────────────────
// High-Converting Combinatorial Programmatic SEO Landing Page (Product + City Matrix).
// Matches queries like "Wholesale Mamra Almonds Surat", "Saffron Bulk Supplier Delhi Khari Baoli", etc.

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import { PRODUCTS } from '@/lib/products-data'
import { COMMERCIAL_HUBS, getHubBySlug } from '@/lib/seo/commercial-hubs'
import { schemaToJsonLd } from '@/lib/seo/metadata'

interface PageProps {
  params: Promise<{ slug: string; city: string }>
}

// Top product-city combinations pre-rendered at build time; all others generated on-demand (ISR)
export async function generateStaticParams() {
  const topProducts = [
    'mamra-almonds-kashmiri-badam',
    'california-almonds-premium',
    'kashmiri-walnuts-inshell-snow-white',
    'w240-jumbo-cashews-goa-mangalore',
    'pampore-mongra-saffron-grade-a1',
    'makhana-grade-a-fox-nuts',
    'afghan-green-raisins-kishmish',
    'afghani-anjeer-dried-figs',
  ]

  const topHubs = [
    'delhi-khari-baoli',
    'mumbai-apmc-vashi',
    'surat-textile-diamond-hub',
    'ahmedabad-kalupur-market',
    'bengaluru-yeshwanthpur-mandi',
    'hyderabad-begum-bazar',
    'jaipur-johari-bazar',
    'indore-sarafa-bazar',
    'pune-market-yard',
    'lucknow-aminabad-chowk',
    'ludhiana-kesar-ganj',
    'amritsar-majith-mandi',
    'dubai-deira-spice-souk',
  ]

  const paramsList: Array<{ slug: string; city: string }> = []
  for (const p of topProducts) {
    for (const h of topHubs) {
      paramsList.push({ slug: p, city: h })
    }
  }
  return paramsList
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: productSlug, city: citySlug } = await params
  const product = PRODUCTS.find((p) => p.slug === productSlug)
  const hub = getHubBySlug(citySlug)

  if (!product || !hub) {
    return {
      title: 'Wholesale Dry Fruits Supplier | Nuty Tales',
    }
  }

  const title = `Wholesale ${product.name} in ${hub.name} | Direct Bulk Supply | Nuty Tales`
  const description = `Buy wholesale ${product.name} (${product.grade}, ${product.origin}) delivered to ${hub.name}. Direct mandi supply, FSSAI certified (${FSSAI_NUMBER}), bulk price slabs from 50kg to 10 tons. GST invoicing.`

  return {
    title,
    description,
    keywords: [
      `wholesale ${product.name} in ${hub.name}`,
      `bulk ${product.name} supplier ${hub.state}`,
      `${product.name} wholesale price ${hub.name}`,
      `${product.name} mandi ${hub.apmcMandi}`,
      `${product.name} commercial supply ${hub.country}`,
    ],
    openGraph: {
      title,
      description,
      url: `https://nutytales.com/wholesale-dry-fruits/${productSlug}/${citySlug}`,
      siteName: 'Nuty Tales',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: {
      canonical: `https://nutytales.com/wholesale-dry-fruits/${productSlug}/${citySlug}`,
    },
  }
}

export default async function ProductCityWholesalePage({ params }: PageProps) {
  const { slug: productSlug, city: citySlug } = await params
  const product = PRODUCTS.find((p) => p.slug === productSlug)
  const hub = getHubBySlug(citySlug)

  if (!product || !hub) {
    notFound()
  }

  const basePrice = product.b2bPricePerKg || Math.round(product.retailPrice * 0.7)
  const tier50 = basePrice
  const tier200 = Math.round(basePrice * 0.95)
  const tier500 = Math.round(basePrice * 0.92)
  const tier1000 = Math.round(basePrice * 0.88)

  const whatsappMessage = encodeURIComponent(
    `Hello Nuty Tales, I am looking for wholesale supply of ${product.name} in ${hub.name}. Required quantity: 500kg. Please provide current commercial rate and delivery schedule.`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBERS.B2B}?text=${whatsappMessage}`

  // Product + AggregateOffer Schema
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Wholesale ${product.name} — ${hub.name}`,
    image: product.image || 'https://nutytales.com/images/products/mamra-almonds.jpg',
    description: `Direct commercial wholesale supply of ${product.name} (${product.grade}) to ${hub.name}, ${hub.state}. FSSAI certified batch testing, cold chain transit, and GST billing.`,
    sku: `NT-B2B-${product.slug}-${hub.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Nuty Tales',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: hub.countryCode === 'AE' ? 'AED' : hub.countryCode === 'GB' ? 'GBP' : hub.countryCode === 'US' ? 'USD' : 'INR',
      lowPrice: tier1000,
      highPrice: tier50,
      offerCount: 4,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Nuty Tales B2B Commodities',
      },
    },
  }

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the wholesale price of ${product.name} delivered to ${hub.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For ${hub.name}, wholesale base pricing starts at ₹${tier50}/kg for standard 50 kg orders, scaling down to ₹${tier1000}/kg for 1 ton contracts. Final rates include insured transit and GST billing.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the dispatch time to ${hub.apmcMandi} in ${hub.state}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Orders to ${hub.name} take approximately ${hub.transitDaysFromKashmir} business days via direct surface cargo from our Kashmir/Delhi fulfillment centers, or 24-48 hours via dedicated air express logistics.`,
        },
      },
      {
        '@type': 'Question',
        name: `What quality certifications are provided with ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Every batch is supplied with an official FSSAI Central License certificate (${FSSAI_NUMBER}), NABL accredited laboratory moisture and purity test analysis (COA), and complete GST commercial tax documentation.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd(faqSchema) }}
      />

      <main className="min-h-screen bg-[#070b0d] text-stone-100">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-stone-800/80 bg-stone-900/40 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex text-xs font-mono text-stone-400">
              <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <span className="mx-2 text-stone-600">/</span>
              <Link href="/wholesale-dry-fruits" className="hover:text-amber-400 transition-colors">B2B Wholesale</Link>
              <span className="mx-2 text-stone-600">/</span>
              <Link href={`/wholesale-dry-fruits/${product.slug}`} className="hover:text-amber-400 transition-colors">{product.name}</Link>
              <span className="mx-2 text-stone-600">/</span>
              <span className="text-amber-400">{hub.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-stone-800">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Direct Commercial Supply · {hub.apmcMandi}
            </div>

            <h1 className="text-3xl font-serif font-light tracking-tight text-white sm:text-5xl lg:text-6xl max-w-4xl">
              Wholesale <span className="text-amber-300 font-normal">{product.name}</span> in {hub.name}
            </h1>

            <p className="mt-4 text-lg text-stone-300 max-w-3xl leading-relaxed">
              Direct origin procurement of {product.grade} {product.name} from {product.origin}. 
              Supplying sweet manufacturers, bakeries, 5-star hotels, and food brands across <strong className="text-white">{hub.state}</strong> with scheduled mandi dispatch.
            </p>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl">
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Grade & Origin</div>
                <div className="mt-1 text-base font-semibold text-white">{product.grade}</div>
                <div className="text-[11px] text-stone-400">{product.origin}</div>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Logistics to {hub.state}</div>
                <div className="mt-1 text-base font-semibold text-amber-300">{hub.transitDaysFromKashmir} Days Transit</div>
                <div className="text-[11px] text-stone-400">Surface Insured Cargo</div>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Minimum Order</div>
                <div className="mt-1 text-base font-semibold text-white">50 kg</div>
                <div className="text-[11px] text-stone-400">Assorted / Single SKU</div>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
                <div className="text-xs font-mono text-stone-400">Compliance</div>
                <div className="mt-1 text-base font-semibold text-emerald-400">FSSAI + NABL COA</div>
                <div className="text-[11px] text-stone-400">GST Invoice HSN 0802</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-emerald-950/50 hover:bg-emerald-500 transition-all"
              >
                <span>Instant WhatsApp Price for {hub.name}</span>
                <span className="text-xs font-mono">→</span>
              </a>
              <Link
                href="/bulk-quote"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800/80 px-6 py-3.5 text-sm font-medium text-stone-200 hover:border-amber-500/50 hover:bg-stone-800 transition-all"
              >
                Request 1 Ton Contract Rate
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Tiers Table */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-b border-stone-800">
          <h2 className="text-2xl font-serif text-white mb-2">
            Wholesale Price Slabs for {product.name} ({hub.name})
          </h2>
          <p className="text-sm text-stone-400 mb-8">
            Transparent mandi-linked commercial price tiers. Rates exclude GST (5% / 12% as applicable) and include transit insurance.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="text-xs font-mono text-stone-400">Tier 1: Commercial Sample</div>
              <div className="mt-2 text-2xl font-semibold text-white">₹{tier50}<span className="text-xs text-stone-400">/kg</span></div>
              <div className="mt-1 text-xs text-amber-400">Order Quantity: 50 kg - 199 kg</div>
              <p className="mt-3 text-xs text-stone-400">Ideal for restaurants, boutique cafés, and trial batches.</p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="text-xs font-mono text-stone-400">Tier 2: Business Standard</div>
              <div className="mt-2 text-2xl font-semibold text-white">₹{tier200}<span className="text-xs text-stone-400">/kg</span></div>
              <div className="mt-1 text-xs text-emerald-400">Order Quantity: 200 kg - 499 kg (-5%)</div>
              <p className="mt-3 text-xs text-stone-400">Ideal for bakeries, sweet shops, and weekly replenishment.</p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-6">
              <div className="text-xs font-mono text-stone-400">Tier 3: Industrial Production</div>
              <div className="mt-2 text-2xl font-semibold text-white">₹{tier500}<span className="text-xs text-stone-400">/kg</span></div>
              <div className="mt-1 text-xs text-emerald-400">Order Quantity: 500 kg - 999 kg (-8%)</div>
              <p className="mt-3 text-xs text-stone-400">Scheduled bi-weekly dispatch with locked contract pricing.</p>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-6">
              <div className="text-xs font-mono text-amber-400">Tier 4: Enterprise Container</div>
              <div className="mt-2 text-2xl font-semibold text-white">₹{tier1000}<span className="text-xs text-stone-400">/kg</span></div>
              <div className="mt-1 text-xs text-amber-300">Order Quantity: 1 Ton+ (-12%)</div>
              <p className="mt-3 text-xs text-stone-300">Dedicated freight vehicle, COA with each lot, credit terms available.</p>
            </div>
          </div>
        </section>

        {/* Commercial FAQs */}
        <section className="py-16 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-white text-center mb-8">
            Frequently Asked Procurement Questions
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="rounded-xl border border-stone-800 bg-stone-900/40 p-6">
                <h3 className="text-base font-medium text-amber-300">{faq.name}</h3>
                <p className="mt-2 text-sm text-stone-300 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
