import type { Metadata } from 'next'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Dry Fruit Wholesale Supplier in Noida & Delhi NCR | Nutty Tales',
  description:
    'Wholesale dry fruits supplier in Noida, Greater Noida, Ghaziabad, Gurugram, and Delhi NCR. Direct Khari Baoli market links, central warehouse, bulk almonds, cashews, raisins, and GST invoices.',
  keywords: [
    'dry fruits wholesale noida',
    'dry fruit supplier delhi ncr',
    'khari baoli dry fruit wholesale',
    'bulk almonds cashews noida',
    'dry fruit distributor ghaziabad',
  ],
}

export default function NoidaWholesalePage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.NOIDA || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-24 pb-20 md:pt-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#D4870A]">Home</Link>
          <span>/</span>
          <Link href="/wholesale-dry-fruits" className="hover:text-[#D4870A]">Wholesale</Link>
          <span>/</span>
          <span className="text-stone-800 font-semibold">Noida &amp; Delhi NCR</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-[#3D2B1F] text-xs font-bold border border-amber-300">
            🏢 CENTRAL PROCUREMENT &amp; NCR LOGISTICS HQ
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3D2B1F] font-serif">
            Dry Fruit Wholesale Supplier in Noida &amp; Delhi NCR
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            Operating from Noida with procurement access to Delhi&apos;s Khari Baoli market and direct import pipelines, Nutty Tales delivers bulk California almonds, W240/W320 cashews, raisins, pistachios, walnuts, and corporate hampers across Delhi NCR.
          </p>
        </div>

        {/* Commercial Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <span className="text-2xl">⚡</span>
            <h3 className="font-bold text-sm text-[#3D2B1F]">Rapid NCR Delivery</h3>
            <p className="text-xs text-stone-600">Same-day and 24-hour dispatch for Noida, Greater Noida, Ghaziabad, Faridabad, Gurugram, and Delhi.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <span className="text-2xl">📋</span>
            <h3 className="font-bold text-sm text-[#3D2B1F]">GST Tax Invoices</h3>
            <p className="text-xs text-stone-600">100% tax-compliant invoices with HSN codes for supermarkets, sweet shops, and bakeries.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
            <span className="text-2xl">🌿</span>
            <h3 className="font-bold text-sm text-[#3D2B1F]">FSSAI Reg. {FSSAI_NUMBER}</h3>
            <p className="text-xs text-stone-600">Hygienic batch packaging, moisture-tested kernels, and sealed tamper-evident containers.</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="bg-gradient-to-r from-[#D4870A] to-[#B8710A] text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Get Current Noida Wholesale Rates</h2>
            <p className="text-xs text-amber-100 mt-1">Direct communication with our Noida B2B commercial desk.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/bulk-quote"
              className="px-6 py-3 bg-white text-[#3D2B1F] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:bg-stone-50"
            >
              Request Bulk Quote (RFQ)
            </Link>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#2D6A4F] hover:bg-[#1E4D38] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md inline-flex items-center gap-1.5"
            >
              <span>WhatsApp: +91 9717161809</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
