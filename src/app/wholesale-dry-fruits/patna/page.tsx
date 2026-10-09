import type { Metadata } from 'next'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Dry Fruit & Makhana Wholesale Supplier in Patna & Bihar | Nuty Tales',
  description:
    'Wholesale dry fruits and direct Mithila Makhana supplier in Patna and Bihar. Serving retailers, sweet shops, bakeries, namkeen manufacturers, and caterers across Patna, Gaya, Muzaffarpur, and Bhagalpur.',
  keywords: [
    'dry fruits wholesale patna',
    'makhana wholesale bihar',
    'fox nuts bulk supplier patna',
    'cashew almond supplier bihar',
    'dry fruit distributor muzaffarpur',
  ],
}

export default function PatnaWholesalePage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.PATNA || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#D4870A]">Home</Link>
          <span>/</span>
          <Link href="/wholesale-dry-fruits" className="hover:text-[#D4870A]">Wholesale</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Patna &amp; Bihar</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
            🌾 BIHAR DISTRIBUTION &amp; MITHILA MAKHANA SOURCING HUB
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2B1F] font-serif">
            Dry Fruit &amp; Makhana Wholesale Supplier in Patna &amp; Bihar
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            Nuty Tales operates a dedicated commercial distribution hub in Patna. We supply bakeries, sweet shops (mithai makers), namkeen units, and dry fruit retailers with bulk California almonds, cashew splits/whole, raisins, and direct-from-farmer Phool Makhana across Bihar.
          </p>
        </div>

        {/* Makhana Highlight */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4870A]">
              Speciality Agriculture
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Direct Farmer Sourcing
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#3D2B1F]">
            Phool Makhana (Fox Nuts) Wholesale from Mithila
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Bihar produces over 85% of India&apos;s fox nuts. Our Patna hub is directly connected to processing clusters in Darbhanga and Madhubani, offering machine-graded Grade A and 6-Suta/7-Suta jumbo makhana at competitive ex-warehouse rates.
          </p>
          <div className="pt-2">
            <Link
              href="/makhana"
              className="text-xs font-bold text-[#D4870A] hover:underline"
            >
              Explore Our Makhana Wholesale Guide &amp; Catalog →
            </Link>
          </div>
        </div>

        {/* Patna Regional Hub Address */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2D6A4F]">
              Patna Commercial Hub &amp; Makhana Depot
            </span>
            <p className="text-sm font-semibold text-[#3D2B1F]">
              Nafis Colony, near Noor Plaza, Bari Path, Lalbagh, Patna, Bihar 800004, India
            </p>
            <p className="text-xs text-stone-500">
              Direct connection to Mithila wetland farmer clusters in Darbhanga &amp; Madhubani.
            </p>
          </div>
          <a
            href="https://www.mappls.com/place-noor+plaza-bari+path-lalbagh-patna-bihar-800004-VOK1WN@zdata=MjUuNjE2MzI0Kzg1LjE3MDQxNysxNytWT0sxV04rKw==ed"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#2D6A4F] text-white hover:bg-[#1E4D38] rounded-xl text-xs font-semibold whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            Open on Mappls ↗
          </a>
        </div>

        {/* CTAs */}
        <div className="bg-[#2D6A4F] text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Request Patna &amp; Bihar Wholesale Quote</h2>
            <p className="text-xs text-emerald-100 mt-1">Talk to our Patna regional sales desk for current market rates.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/bulk-quote"
              className="px-6 py-3 bg-[#D4870A] hover:bg-[#B8710A] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md"
            >
              Request Bulk Quote
            </Link>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-[#2D6A4F] hover:bg-stone-50 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-1.5"
            >
              <span>WhatsApp: +91 9717161809</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
