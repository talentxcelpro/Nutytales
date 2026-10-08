import type { Metadata } from 'next'
import Link from 'next/link'
import KashmirTourCustomizer from '@/components/travel/KashmirTourCustomizer'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Kashmir Travel, Tours & Stays | Nuty Tales Private Experiences',
  description:
    'Experience the magic of Kashmir with Nuty Tales. Stay at our private Srinagar orchard retreat and enjoy curated tours to Gulmarg, Pahalgam, Sonamarg, and Dal Lake with authentic local guides and live itinerary customization.',
  keywords: [
    'kashmir travel package',
    'srinagar orchard stay',
    'gulmarg tour package',
    'pahalgam day trip',
    'kashmir dry fruit tour',
    'kashmir wazwan experience',
  ],
}

export default function KashmirTravelPage() {
  const whatsappNumber = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B]">
      {/* ── 1. Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-[#17233B] via-[#176B68] to-[#214B39] text-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-[#C9A45C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-semibold uppercase tracking-wider border border-white/20">
              🏔️ CURATED KASHMIR EXPERIENCES &amp; TOURS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Stay in Kashmir. Explore Kashmir. Taste Kashmir.
            </h1>
            <p className="text-base sm:text-lg text-stone-200 max-w-2xl leading-relaxed font-light">
              Discover paradise through the eyes of locals. From our tranquil Srinagar orchard stay to snow-clad Gulmarg slopes and authentic Wazwan banquets, let Nuty Tales craft your unforgettable Kashmir journey.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#tour-customizer"
                className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Customize Your Itinerary ↓
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  'Hello Nuty Tales! 🏔️ I want to plan a custom private trip to Kashmir.',
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs uppercase tracking-wider border border-white/20 transition-all"
              >
                Chat on WhatsApp (+91 9717161809)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Dynamic Tour Customizer Engine ────────────────────────────────────── */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <KashmirTourCustomizer />
      </section>

      {/* ── 3. The Living Ecosystem Connection ──────────────────────────────────── */}
      <section className="py-16 bg-[#F0EBE1] border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
            Complete Your Kashmir Discovery
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#17233B]">
            Taste, Wear &amp; Experience the Valley
          </h2>
          <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Combine your mountain vacation with our authentic Autumn & Winter Kashmiri crafts and farm-fresh dry fruit hampers, delivered directly to your home or prepared as welcome gifts in your room.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/crafts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#17233B] hover:bg-[#176B68] text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-colors shadow-md"
            >
              Shop Kashmir Crafts (Pashminas &amp; Pherans) →
            </Link>
            <Link
              href="/stays"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-[#17233B] text-xs font-bold rounded-xl tracking-wider uppercase transition-colors"
            >
              View Srinagar Orchard Retreat →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
