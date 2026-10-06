import Image from 'next/image'
import Link from 'next/link'

const REGIONS = [
  {
    state: 'Rajasthan',
    crafts: 'Blue Pottery · Sanganeri Block Print · Handcrafted Décor',
    desc: 'Ceramic quartz craftsmanship from Jaipur and natural indigo vegetable dyed textiles from Bagru.',
    status: 'Winter 2026 Curation',
    image: '/images/dark-wood-gourmet-tray.jpg',
  },
  {
    state: 'Uttar Pradesh',
    crafts: 'Lucknowi Chikankari · Moradabad Brassware · Saharanpur Woodcraft',
    desc: 'Gossamer shadow-work embroidery on fine mulmul and brassware polished by fourth-generation metal artisans.',
    status: 'In Sourcing Review',
    image: '/images/crafts-artisan-hands.jpg',
  },
  {
    state: 'Bihar',
    crafts: 'Madhubani Art · Sikki Grass Craft · Bhagalpuri Tussar Silk',
    desc: 'Ritualistic folk paintings from Mithila using bamboo twigs, and eco-friendly golden grass craft from Madhubani.',
    status: 'Connected to Patna Hub',
    image: '/images/crafts-gifting-box.jpg',
  },
  {
    state: 'Gujarat',
    crafts: 'Kutch Ajrakh · Bandhani · Rogan Art',
    desc: 'Block-printed resists with natural madder and indigo, and castor oil castor pigments hand-painted on silk.',
    status: 'Artisan Cooperative Pilot',
    image: '/images/crafts-winterwear.jpg',
  },
  {
    state: 'West Bengal',
    crafts: 'Kantha Stitching · Bankura Terracotta',
    desc: 'Upcycled rural running-stitch embroideries documenting mythological folklore and terracotta craft.',
    status: 'Phase 2 Pipeline',
    image: '/images/crafts-stoles.jpg',
  },
  {
    state: 'Odisha',
    crafts: 'Raghurajpur Pattachitra · Cuttack Silver Filigree',
    desc: 'Intricate cloth scroll paintings made with natural stone pigments and microscopic silver wire jewelry.',
    status: 'Phase 2 Pipeline',
    image: '/images/crystal-gold-nut-bowls.jpg',
  },
]

export default function IndiaCraftsPage() {
  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-4">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/crafts" className="hover:text-[#176B68]">Crafts & Heritage</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">India — A Tapestry of Craft</span>
          </nav>

          <div className="max-w-3xl space-y-2 border-b border-[#17233B]/10 pb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
              Pan-India Artisan Clusters
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
              India — A Tapestry of Craft
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Following our Kashmir anchor, Nutty Tales is curating verified artisan partnerships
              across India. Every region represented adheres to our Provenance & GI Authenticity code:
              direct cooperative relationships, documented master techniques, and fair remuneration.
            </p>
          </div>
        </div>

        {/* Region Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REGIONS.map((r) => (
            <div
              key={r.state}
              className="bg-white rounded-2xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-stone-100">
                  <Image src={r.image} alt={r.state} fill className="object-cover" />
                  <div className="absolute top-3 right-3 bg-[#17233B]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                    {r.status}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                    State Heritage
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#17233B]">{r.state}</h3>
                  <p className="text-xs font-semibold text-[#176B68]">{r.crafts}</p>
                  <p className="text-xs text-stone-600 font-light leading-relaxed pt-1">{r.desc}</p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/corporate-gifting"
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#17233B] hover:text-[#176B68]"
                >
                  Request Pre-Curation Access →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
