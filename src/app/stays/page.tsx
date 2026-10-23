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
      {/* ── 1. Elegant Light Discovery Hero ─────────────────────────────────── */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 border-b border-[#E7E2D9] bg-gradient-to-b from-[#F5EFE6]/60 via-[#FAF8F5] to-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#704B32] text-xs font-bold uppercase tracking-widest border border-[#E7E2D9] shadow-2xs">
            <span>✨</span> NUTY TALES STAYS · STAY SOMEWHERE EXTRAORDINARY
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#17233B] font-serif leading-tight max-w-4xl mx-auto">
            Find a stay that feels like yours.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
            Stay somewhere extraordinary. Experience somewhere real. Private walnut orchard estates in Harwan, alpine timber ski chalets in Gulmarg, and floating deodar palaces on Nigeen Lake with zero hidden fees.
          </p>
        </div>
      </section>

      {/* ── 2. The Core Marketplace Engine (Search + Discovery + Cards + Services) ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <LiveStaysDiscovery />
      </main>

      {/* ── 3. The Unfair Ecosystem Advantage Strip ──────────────────────────── */}
      <section className="py-16 bg-[#F4EFE6] border-t border-[#E7E2D9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
            The Connected Nuty Tales Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#17233B]">
            More Than Keys in a Lockbox: End-to-End Hospitality
          </h2>
          <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed font-light">
            Conventional rentals leave you with keys and an empty kitchen. Nuty Tales Stays coordinates fresh harvest walnut breakfasts, in-house royal Wazwan chefs, heated 4x4 airport transit from Nuty Tales Travel, and custom celebration welcome hampers from Nuty Tales Gifting.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-wider">
            <Link
              href="/stays/group-quote"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#17233B] hover:bg-[#1E3048] text-white rounded-xl transition-colors shadow-xs"
            >
              Request Group Buyout Quote →
            </Link>
            <Link
              href="/stays/hosts"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b89347] text-[#17233B] rounded-xl transition-colors shadow-xs"
            >
              List Property as Host →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
