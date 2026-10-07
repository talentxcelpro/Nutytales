import type { Metadata } from 'next'
import Link from 'next/link'
import LiveStaysDiscovery from '@/components/stays/LiveStaysDiscovery'

export const metadata: Metadata = {
  title: 'Nuty Tales Stays & Travel | Srinagar, Noida & Patna Properties',
  description:
    'Taste. Stay. Explore. Experience authentic boutique hospitality at Nuty Tales properties in Srinagar (Kashmir), Noida (Delhi NCR), and Patna (Bihar). Live seasonal pricing, orchard suites, and direct concierge reservations.',
  keywords: [
    'Nuty Tales stays',
    'kashmir orchard stay srinagar',
    'noida corporate stay',
    'patna heritage stay',
    'kashmir dry fruit tour',
    'taste stay explore',
  ],
  openGraph: {
    title: 'Nuty Tales Stays | Taste. Stay. Explore.',
    description:
      'Curated stays in Srinagar, Noida, and Patna. Unmatched comfort, local experiences, and farm-fresh dry fruit heritage.',
    images: ['/images/crafts-kashmir-landscape.jpg'],
  },
}

export default function StaysPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B]">
      {/* ── 1. Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#17233B] via-[#176B68] to-[#214B39] text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-[#C9A45C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-semibold tracking-wide border border-white/20">
              <span>🏔️ BOUTIQUE HOSPITALITY &amp; ORCHARD RETREATS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Taste. Stay. Explore.
              <span className="block text-[#C9A45C] font-serif italic text-2xl sm:text-3xl md:text-4xl mt-1">
                Hospitality Grounded in Authenticity
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-200 max-w-2xl leading-relaxed font-light">
              Nuty Tales is more than a purveyor of fine dry fruits — it is a gateway to the lands from which they emerge. Stay at our private properties in Srinagar, Noida, and Patna, where gracious warmth meets unforgettable regional experiences.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#booking-engine"
                className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Reserve Your Suite ↓
              </a>
              <Link
                href="/travel/kashmir"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs uppercase tracking-wider border border-white/20 transition-all"
              >
                Kashmir Travel Packages →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Live Dynamic Stays Discovery Engine ───────────────────────────────── */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveStaysDiscovery />
      </section>

      {/* ── 3. The Ecosystem Loop: Taste & Stay ──────────────────────────────────── */}
      <section className="py-16 bg-[#F0EBE1] border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
            The Connected Nuty Tales Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#17233B]">
            From Orchard Stay to Your Daily Pantry
          </h2>
          <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed">
            During your stay in Kashmir, walk the very orchards where our premium walnuts and almonds are nurtured. Taste the fresh harvest over warm saffron kahwa, take home handcrafted gift hampers, and reorder effortlessly online once you return home.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-colors shadow-md"
            >
              Explore Dry Fruits Collection →
            </Link>
            <Link
              href="/crafts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-[#17233B] text-xs font-bold rounded-xl tracking-wider uppercase transition-colors"
            >
              Discover Kashmir Crafts (Try with SI) →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
