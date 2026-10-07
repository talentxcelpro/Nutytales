import type { Metadata } from 'next'
import Link from 'next/link'
import LiveStaysDiscovery from '@/components/stays/LiveStaysDiscovery'
import SourcingRequestBanner from '@/components/demand/SourcingRequestBanner'

export const metadata: Metadata = {
  metadataBase: new URL('https://stays.nutytales.com'),
  title: 'Nutty Tales Stays — Global Boutique Estates, Orchards & Airbnb for Work',
  description:
    'Global boutique hospitality and estate marketplace. Discover private walnut orchards, alpine ski chalets, luxury cedar houseboats, and Airbnb for Work verified corporate residences across Kashmir, Dubai, London, and Goa.',
  keywords: [
    'Airbnb for Work India',
    'luxury stays Kashmir',
    'private villa Srinagar',
    'walnut orchard retreat Harwan',
    'Gulmarg ski chalet',
    'luxury houseboat Dal Lake',
    'corporate offsite estate buyout',
    'boutique stays London Dubai',
    'Nutty Tales Stays',
  ],
  alternates: {
    canonical: 'https://stays.nutytales.com',
  },
  openGraph: {
    title: 'Nutty Tales Stays — Global Boutique Estates & Airbnb for Work',
    description:
      'Private walnut estates, alpine heated chalets, and Airbnb for Work corporate housing with dedicated chefs and high-speed fiber.',
    url: 'https://stays.nutytales.com',
    siteName: 'Nutty Tales Stays',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function StaysPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B]">
      {/* ── 1. Global Hospitality Hero Banner ─────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#17233B] via-[#1E3048] to-[#122336] text-white pt-16 pb-14 md:pt-24 md:pb-20 overflow-hidden border-b border-[#C9A45C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-bold uppercase tracking-widest border border-white/15">
              <span>🏡</span> NUTTY TALES STAYS · GLOBAL HOSPITALITY &amp; AIRBNB BUSINESS
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Stay in Extraordinary Places.
              <span className="block text-[#C9A45C] font-serif italic text-2xl sm:text-4xl lg:text-5xl font-normal mt-1">
                From High-Altitude Orchards to Global Business Suites
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 max-w-2xl leading-relaxed font-light">
              Discover private walnut estates, alpine heated ski chalets, serene cedar houseboats, and Airbnb for Work verified corporate residences. Reserve individual suites or book entire private estates with dedicated chefs and 4x4 convoys.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs">
              <Link
                href="/stays/group-quote"
                className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl uppercase tracking-wider shadow-lg transition-all"
              >
                🏰 Private Estate Buyout Desk →
              </Link>
              <a
                href="#marketplace-grid"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl uppercase tracking-wider border border-white/20 transition-all"
              >
                Explore Global Stays ↓
              </a>
              <Link
                href="/stays/hosts"
                className="px-6 py-3.5 bg-stone-900/70 hover:bg-stone-900 text-stone-200 font-semibold rounded-xl uppercase tracking-wider border border-white/10 transition-all flex items-center gap-1.5"
              >
                <span>🚀</span>
                <span>Airbnb Your Estate (0% Fee)</span>
              </Link>
            </div>
          </div>

          {/* Value Badges Strip */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>100% Inspected &amp; Superhost Vetted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Airbnb for Work (200+ Mbps Fiber)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>In-House Master Wazwan Chefs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Full Private Buyouts (10-20 Pax)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The Core Global Marketplace (Airbnb UI + Search + Grid + Host Calc) ── */}
      <section id="marketplace-grid" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <LiveStaysDiscovery />

        <SourcingRequestBanner
          vertical="stays"
          contextText="Planning a private 4-acre walnut orchard buyout, team executive offsite, VIP high-level delegation, or destination wedding estate takeover?"
        />
      </section>

      {/* ── 3. The Unfair Ecosystem Advantage: Taste, Stay & Explore ──────────── */}
      <section className="py-16 bg-[#F0EBE1] border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
            The Connected Nutty Tales Group Advantage
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#17233B]">
            More Than Keys in a Lockbox: End-to-End Hospitality
          </h2>
          <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Conventional rentals leave you with keys and an empty kitchen. Nutty Tales Stays coordinates fresh harvest walnut breakfasts, in-house royal Wazwan chefs, heated 4x4 airport transit from Nutty Tales Travel, and custom celebration welcome hampers from Nutty Tales Gifting.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-wider">
            <Link
              href="/stays/group-quote"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl transition-colors shadow-md"
            >
              Request Group Quote →
            </Link>
            <Link
              href="/travel/builder"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl transition-colors shadow-sm"
            >
              Build Complete Trip with SI →
            </Link>
            <Link
              href="/stays/hosts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-[#17233B] rounded-xl transition-colors"
            >
              List Property as Host →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
