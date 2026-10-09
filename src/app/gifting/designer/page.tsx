import type { Metadata } from 'next'
import Link from 'next/link'
import SIGiftDesigner from '@/components/gifting/SIGiftDesigner'

export const metadata: Metadata = {
  title: 'Outcome-Based Gift Designer | Nuty Tales Gifting',
  description:
    'Design custom corporate and luxury hampers. Configure premium dry fruits, branded packaging, multi-address shipping, and immediate quotation.',
  alternates: {
    canonical: 'https://gifting.nutytales.com/designer',
  },
  openGraph: {
    title: 'Outcome-Based Gift Designer | Nuty Tales Gifting',
    description:
      'Design custom corporate and luxury hampers with live configuration and immediate quotation.',
    url: 'https://gifting.nutytales.com/designer',
    siteName: 'Nuty Tales Gifting',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function GiftDesignerPage() {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* ── Breadcrumb / Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>🎁 NUTY TALES GIFTING · SI DESIGN STUDIO</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B] mt-2">
            Outcome-Based Gift Designer
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Specify intent, audience, and budget. Our Gifting OS configures contents, multi-country delivery, recipient choice links, and enterprise invoicing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/gifting"
            className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            ← Gifting Home
          </Link>
          <Link
            href="/gifting/recipients"
            className="px-4 py-2 bg-[#17233B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            Multi-Recipient Desk →
          </Link>
        </div>
      </div>

      {/* ── Main SI Designer Engine ──────────────────────────────────────────── */}
      <SIGiftDesigner />
    </div>
  )
}
