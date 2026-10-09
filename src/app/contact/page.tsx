import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BRAND_NAME,
  PARENT_ORGANIZATION,
  SUBSIDIARY_STATEMENT,
  BUSINESS_FOCUS,
  FSSAI_NUMBER,
  LOCATIONS,
  WHATSAPP_NUMBERS,
  DEFAULT_CONTACT_PHONE,
  SUPPORT_EMAIL,
} from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us & Official Registered Locations | Nuty Tales Foods & Crafts',
  description:
    'Official registered office, regional procurement hubs, and verified Google Maps locations for Nuty Tales Foods & Crafts (A subsidiary of Nexgenn Services) in Noida, Kashmir (Arshid House), and Patna.',
  alternates: {
    canonical: 'https://nutytales.com/contact',
  },
}

export default function ContactPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_NAME,
    parentOrganization: {
      '@type': 'Organization',
      name: PARENT_ORGANIZATION,
    },
    url: 'https://nutytales.com',
    telephone: '+91-9717161809',
    email: SUPPORT_EMAIL,
    location: [
      {
        '@type': 'LocalBusiness',
        name: `${BRAND_NAME} — Noida Registered Office & Central HQ`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'PC-12, 003, Jaypee Wishtown, Sector 128',
          addressLocality: 'Noida',
          addressRegion: 'Uttar Pradesh',
          postalCode: '201304',
          addressCountry: 'IN',
        },
        hasMap: LOCATIONS.NOIDA.mapUrl,
      },
      {
        '@type': 'LocalBusiness',
        name: `${BRAND_NAME} — Kashmir Hub (Arshid House)`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Arshid House, Budgam–Gojra Road, Dadna',
          addressLocality: 'Budgam',
          addressRegion: 'Jammu and Kashmir',
          postalCode: '191111',
          addressCountry: 'IN',
        },
        hasMap: LOCATIONS.KASHMIR.mapUrl,
      },
      {
        '@type': 'LocalBusiness',
        name: `${BRAND_NAME} — Patna Distribution Depot (Nafis Colony)`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Nafis Colony, near Noor Plaza, Bari Path, Lalbagh',
          addressLocality: 'Patna',
          addressRegion: 'Bihar',
          postalCode: '800004',
          addressCountry: 'IN',
        },
        hasMap: LOCATIONS.PATNA.mapUrl,
      },
    ],
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#191919] pt-28 sm:pt-36 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* ── Breadcrumb & Header ── */}
        <div className="space-y-4 max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#8C6D2D]">Home</Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">Contact &amp; Locations</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#8C6D2D]/10 text-[#8C6D2D] text-xs font-bold border border-[#8C6D2D]/20">
              OFFICIAL CORPORATE IDENTITY
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              FSSAI Lic. {FSSAI_NUMBER}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#191919] tracking-tight">
            Registered Office &amp; Verified Regional Hubs
          </h1>

          <p className="text-base text-stone-600 leading-relaxed font-light">
            <strong className="text-stone-900 font-medium">{BRAND_NAME}</strong> is {SUBSIDIARY_STATEMENT.toLowerCase()}. Operating with verified farm-gate sourcing in Kashmir, Mithila makhana wetland aggregation in Bihar, and central corporate fulfillment in Noida.
          </p>
        </div>

        {/* ── Corporate Details Summary Strip ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Brand Name</span>
            <p className="font-serif font-bold text-stone-900 text-sm">{BRAND_NAME}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Parent Organisation</span>
            <p className="font-semibold text-stone-900 text-sm">{PARENT_ORGANIZATION}</p>
            <span className="text-[10px] text-[#8C6D2D] block">Subsidiary Relationship</span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Central FSSAI License</span>
            <p className="font-mono font-bold text-stone-900 text-sm">{FSSAI_NUMBER}</p>
            <span className="text-[10px] text-emerald-700 block">Food Safety &amp; Standards Authority</span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Business Focus</span>
            <p className="text-xs text-stone-600 leading-snug">{BUSINESS_FOCUS}</p>
          </div>
        </div>

        {/* ── Verified Hubs Grid (3 Cards) ── */}
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D2D]">
              Verified Physical Locations
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Direct Maps &amp; Operating Corridors
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Noida HQ Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center text-lg font-bold border border-amber-200">
                    🏢
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-200">
                    Official Registered HQ
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    1. Noida — Official Registered Office
                  </h3>
                  <span className="text-xs text-[#8C6D2D] font-medium block mt-0.5">
                    Central Wholesale Desk &amp; FSSAI Facility
                  </span>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Verified Address</span>
                  <p className="text-stone-900 font-semibold leading-relaxed">
                    PC-12, 003, Jaypee Wishtown, Sector 128, Noida, Uttar Pradesh 201304, India
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  The official registered office and FSSAI-associated corporate facility. Central order routing, Khari Baoli market procurement link, and Delhi NCR express dispatch.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <a
                  href={LOCATIONS.NOIDA.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#17233B] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Open Nuty Tales on Google Maps ↗</span>
                </a>
                <Link
                  href="/wholesale-dry-fruits/noida"
                  className="block text-center text-xs text-[#8C6D2D] hover:underline font-medium"
                >
                  View Noida Regional Hub Page →
                </Link>
              </div>
            </div>

            {/* 2. Kashmir Arshid House Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg font-bold border border-emerald-200">
                    🏔️
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Valley Farm Aggregation
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    2. Kashmir — Arshid House
                  </h3>
                  <span className="text-xs text-[#8C6D2D] font-medium block mt-0.5">
                    Procurement, Property &amp; Business Hub
                  </span>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Verified Address</span>
                  <p className="text-stone-900 font-semibold leading-relaxed">
                    Arshid House, Budgam–Gojra Road, Dadna, Budgam, Jammu and Kashmir 191111, India
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Use this as the Kashmir location link for property and business information. Aggregates Kashmiri walnuts, Mamra badam, high-altitude raw honey, Pampore saffron, and artisanal handlooms.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <a
                  href={LOCATIONS.KASHMIR.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#8C6D2D] hover:bg-[#725721] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Open Arshid House on Google Maps ↗</span>
                </a>
                <Link
                  href="/wholesale-dry-fruits/kashmir"
                  className="block text-center text-xs text-[#8C6D2D] hover:underline font-medium"
                >
                  View Kashmir Regional Hub Page →
                </Link>
              </div>
            </div>

            {/* 3. Patna Nafis Colony Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center text-lg font-bold border border-teal-200">
                    🌾
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal-50 text-teal-800 border border-teal-200">
                    Makhana Sourcing Depot
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    3. Patna — Nafis Colony
                  </h3>
                  <span className="text-xs text-teal-700 font-medium block mt-0.5">
                    Eastern Distribution &amp; Mithila Cluster Link
                  </span>
                </div>

                <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Verified Landmark Address</span>
                  <p className="text-stone-900 font-semibold leading-relaxed">
                    Nafis Colony, near Noor Plaza, Bari Path, Lalbagh, Patna, Bihar 800004, India
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  Identified using the Noor Plaza landmark on Mappls. Directly linked to Mithila farmer clusters in Darbhanga and Madhubani for machine-graded Phool Makhana.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <a
                  href={LOCATIONS.PATNA.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D38] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Open Noor Plaza on Mappls ↗</span>
                </a>
                <Link
                  href="/wholesale-dry-fruits/patna"
                  className="block text-center text-xs text-[#2D6A4F] hover:underline font-medium"
                >
                  View Patna Regional Hub Page →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Direct Concierge & Immediate Communication ── */}
        <section className="bg-gradient-to-r from-[#17233B] via-[#1E2E4E] to-[#17233B] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#C9A45C]">
              Direct Executive Support
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Have a Custom Inquiry or Bulk Wholesale Requirement?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Connect directly with our central order desk in Noida or valley procurement desk in Kashmir via WhatsApp or bulk quotation RFQ.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                'Hello Nuty Tales! I would like to inquire about dry fruits, gifting hampers, or location procurement.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-md text-center transition-all inline-flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>WhatsApp: +91 9717161809</span>
            </a>
            <Link
              href="/bulk-quote"
              className="px-6 py-3.5 rounded-full bg-white text-[#17233B] hover:bg-stone-100 font-bold text-xs uppercase tracking-wider shadow-md text-center transition-all"
            >
              Request Bulk Quote →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
