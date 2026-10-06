import Image from 'next/image'
import Link from 'next/link'

const WORLD_REGIONS = [
  {
    country: 'Morocco',
    tradition: 'Fez Glazed Ceramics & Berber Kilims',
    desc: 'Zellij mosaic techniques and hand-knotted wool rugs woven by indigenous women in the High Atlas Mountains.',
    status: 'Phase 3 Exploration',
    image: '/images/dark-wood-gourmet-tray.jpg',
  },
  {
    country: 'Turkey',
    tradition: 'Iznik Hand-Painted Pottery & Silk Carpets',
    desc: 'Cobalt and turquoise fritware ceramics from Iznik, and centuries-old double-knot silk weaving from Hereke.',
    status: 'Phase 3 Exploration',
    image: '/images/crystal-gold-nut-bowls.jpg',
  },
  {
    country: 'Afghanistan',
    tradition: 'Herat Glassware & Kandahar Embroidery',
    desc: 'Hand-blown aqua glassware from ancient Herat furnaces and Khamak geometric needlework on fine cotton.',
    status: 'Direct Sourcing Dialogue',
    image: '/images/crafts-artisan-hands.jpg',
  },
  {
    country: 'Central Asia (Uzbekistan)',
    tradition: 'Margilan Ikat & Bukhara Suzani',
    desc: 'Abrbandi cloud-resist dyed natural silks and grand floral embroidered tapestries on handwoven linen.',
    status: 'Curated Heritage Partner',
    image: '/images/crafts-shawls.jpg',
  },
]

export default function WorldCraftsPage() {
  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/crafts" className="hover:text-[#176B68]">Crafts & Heritage</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">From Around the World</span>
          </nav>

          <div className="max-w-3xl space-y-2 border-b border-[#17233B]/10 pb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
              Global Sourcing & Heritage Road Map
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
              From Around the World
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              In subsequent phases, Nutty Tales Crafts will open curated pathways to legendary global craft
              traditions. We adhere strictly to verified customs documentation, country of origin certs, and
              direct master guild compensation.
            </p>
          </div>
        </div>

        {/* Global Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WORLD_REGIONS.map((w) => (
            <div
              key={w.country}
              className="bg-white rounded-2xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-stone-100">
                  <Image src={w.image} alt={w.country} fill className="object-cover" />
                  <div className="absolute top-3 right-3 bg-[#17233B]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {w.status}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                    Global Heritage Route
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#17233B]">{w.country}</h3>
                  <p className="text-xs font-semibold text-[#176B68]">{w.tradition}</p>
                  <p className="text-xs text-stone-600 font-light leading-relaxed pt-1">{w.desc}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/crafts"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#17233B] hover:text-[#176B68]"
                >
                  Explore Current Kashmir Collection →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
