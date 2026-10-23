import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import LiveStaysDiscovery from '@/components/stays/LiveStaysDiscovery'

export const metadata: Metadata = {
  metadataBase: new URL('https://stays.nutytales.com'),
  title: 'Nuty Tales Stays — Stay somewhere extraordinary. Experience somewhere real.',
  description:
    'Discover vetted luxury private residences, alpine chalets, walnut orchard estates, and lakefront cedar houseboats across Kashmir, Delhi-NCR, Patna, Bengaluru, Kerala, and global gateways. Transparent pricing, zero hidden fees, and end-to-end concierge care.',
  keywords: [
    'luxury private residences Kashmir',
    'private villa Srinagar',
    'walnut orchard estate Harwan',
    'Gulmarg alpine ski chalet',
    'luxury cedar houseboat Dal Lake Nigeen',
    'corporate offsite estate buyout Delhi NCR',
    'Patna heritage villa stay',
    'Bengaluru Indiranagar garden villa',
    'Kerala Nalukettu backwaters',
    'Nuty Tales Stays',
  ],
  alternates: {
    canonical: 'https://stays.nutytales.com',
  },
  openGraph: {
    title: 'Nuty Tales Stays — Find a stay that feels like yours.',
    description:
      'Stay somewhere extraordinary. Experience somewhere real. Private walnut estates, alpine ski chalets, and royal houseboats with dedicated master chefs, 4x4 convoys, and high-speed fiber.',
    url: 'https://stays.nutytales.com',
    siteName: 'Nuty Tales Stays',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function StaysPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#17233B]">
      {/* ── World-Class Travel Marketplace Engine (Search + Categories + Live Stays) ── */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-stone-400">Loading stays...</div>}>
          <LiveStaysDiscovery />
        </Suspense>
      </main>
    </div>
  )
}
