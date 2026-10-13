import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ALL_INDIA_REGIONS, ALL_INDIA_STATES } from '@/lib/clothing-data'

export const metadata: Metadata = {
  title: 'All-India Craft Atlas — Single-Origin Handlooms & GI Clusters | Nuty Tales Crafts',
  description:
    'Explore verified master artisan cooperatives across 15 Indian States: Kashmir, Gujarat, Rajasthan, Uttar Pradesh, Madhya Pradesh, West Bengal, Odisha, Assam, Nagaland, Telangana, Tamil Nadu, and Kerala.',
}

interface ClusterCard {
  state: string
  region: string
  crafts: string
  desc: string
  giCert: string
  loomType: string
  weaversGuild: string
  image: string
  productCount: number
  filterUrl: string
}

const CLUSTERS: ClusterCard[] = [
  {
    state: 'Kashmir',
    region: 'Himalayas & North',
    crafts: 'Changthangi Pashmina · Kani Weave · Tilla Velvet Pherans · Sozni',
    desc: 'Centuries-old Himalayan winter couture. Hand-spun pashmina fibers (12-14 microns) and royal silver-gilded Tilla embroidery.',
    giCert: 'GI-JK-PASHMINA-0046 / GI-JK-KANI-0071',
    loomType: 'Traditional Talim Pit Looms',
    weaversGuild: 'Mir Tilla Guild, Zadibal & Kanihama Cooperative',
    image: '/images/crafts-pherans.jpg',
    productCount: 18,
    filterUrl: '/crafts?state=Kashmir',
  },
  {
    state: 'Gujarat',
    region: 'Western India',
    crafts: 'Kutch Ajrakh · Patan Patola Double Ikat · Rabari Mirrorwork · Bandhani',
    desc: '16-stage natural indigo and madder resist block printing by the Khatri community of Dhamadka, alongside legendary Patola double ikat.',
    giCert: 'GI-IN-GUJ-AJRAKH-0312 / GI-IN-GUJ-PATOLA-0044',
    loomType: 'Tilted Bamboo & Hand Block Printing Tables',
    weaversGuild: 'Khatri Artisan Collective & Salvi Family Guild',
    image: '/images/crafts-winterwear.jpg',
    productCount: 4,
    filterUrl: '/crafts?state=Gujarat',
  },
  {
    state: 'Rajasthan',
    region: 'Western India',
    crafts: 'Bagru Dabu Indigo · Sanganeri Gold Leaf · Kota Doria Handloom',
    desc: 'River-washed mud resist block prints and feather-light silk-cotton gossamer grids (khats) interlaced with pure metallic zari.',
    giCert: 'GI-IN-RJ-BAGRU-0210 / GI-IN-RJ-KOTA-0038',
    loomType: 'Kaithun Pit Looms & Chippa Handblock Vats',
    weaversGuild: 'Kaithun Ansari Weavers & Chippa Guild',
    image: '/images/jaipur-heritage.jpg',
    productCount: 4,
    filterUrl: '/crafts?state=Rajasthan',
  },
  {
    state: 'Uttar Pradesh',
    region: 'Gangetic & Central',
    crafts: 'Lucknowi Chikankari & Mukaish · Banarasi Katan Silk Brocade · Tanchoi',
    desc: 'Nawabi Awadhi 32-stitch shadow work on fine mulmul and georgette, and Varanasi Shikargah hunting brocades woven with gold and silver zari.',
    giCert: 'GI-IN-UP-CHIKANKARI-0119 / GI-IN-UP-BANARAS-0099',
    loomType: 'Kadhwa Drawboy & Throw-Shuttle Pit Looms',
    weaversGuild: 'Begum Akhtar Memorial Guild & Ansari Weavers Guild',
    image: '/images/campaign-mens-style-story.jpg',
    productCount: 4,
    filterUrl: '/crafts?state=Uttar+Pradesh',
  },
  {
    state: 'Madhya Pradesh',
    region: 'Gangetic & Central',
    crafts: 'Chanderi Handloom Tissue Silk · Maheshwari Reversible Zari Handloom',
    desc: 'Vedic-era translucent tissue silk with hand-plucked Ashavali butis, and Maharani Ahilyabai Holkar’s Narmada river border weaves.',
    giCert: 'GI-IN-MP-CHANDERI-0021 / GI-IN-MP-MAHESHWAR-0087',
    loomType: 'Eknaliya & Dobby Pit Looms',
    weaversGuild: 'Rehwa Society & Chanderi Master Weavers Guild',
    image: '/images/crafts-stoles.jpg',
    productCount: 3,
    filterUrl: '/crafts?state=Madhya+Pradesh',
  },
  {
    state: 'West Bengal',
    region: 'Eastern & Northeast',
    crafts: 'Shantiniketan Nakshi Kantha · Dhakai Jamdani Muslin',
    desc: 'Upcycled running-stitch silk quilting revived by Rabindranath Tagore, and UNESCO-recognized discontinuous extra-weft floral muslin.',
    giCert: 'GI-IN-WB-KANTHA-0142 / GI-IN-WB-JAMDANI-0188',
    loomType: 'Hand Bamboo Needles & Traditional Frame Looms',
    weaversGuild: 'Phulia Weavers Co-op & Shantiniketan Rural Guild',
    image: '/images/crafts-jackets.jpg',
    productCount: 3,
    filterUrl: '/crafts?state=West+Bengal',
  },
  {
    state: 'Odisha',
    region: 'Eastern & Northeast',
    crafts: 'Sambalpuri Bandha Ikat · Kotpad Natural Madder-Dye',
    desc: 'Curvilinear tie-dye warp and weft mathematical weaving featuring sacred temple spires, Shankha, and Chakra motifs.',
    giCert: 'GI-IN-OD-SAMBALPUR-0078',
    loomType: 'Traditional Western Odisha Pit Looms',
    weaversGuild: 'Bargarh Meher Handloom Guild #4',
    image: '/images/crystal-gold-nut-bowls.jpg',
    productCount: 2,
    filterUrl: '/crafts?state=Odisha',
  },
  {
    state: 'Assam & Nagaland',
    region: 'Eastern & Northeast',
    crafts: 'Ahimsa Eri Peace Silk · Naga Ao Tribal Backstrap Loin Loom',
    desc: 'Non-violent silk harvested without harming the silkworm, naturally thermoregulating, alongside ancient body-tensioned backstrap tribal weaves.',
    giCert: 'GI-IN-AS-ERISILK-0315 / GI-IN-NL-NAGA-0244',
    loomType: 'Takli Drop Spindles & Backstrap Loin Looms',
    weaversGuild: 'Brahmaputra Peace Silk Guild & Naga Mother Association',
    image: '/images/crafts-winter-hero.jpg',
    productCount: 3,
    filterUrl: '/crafts?state=Assam',
  },
  {
    state: 'Telangana & Andhra',
    region: 'Southern Peninsular',
    crafts: 'Pochampally Double Ikat · Machilipatnam Natural Kalamkari',
    desc: 'Geometric Pagdu Bandhu double-ikat woven in India’s first registered GI hub, and 23-stage herbal vegetable-dyed river-washed cottons.',
    giCert: 'GI-IN-TG-POCHAMPALLY-0004 / GI-IN-AP-KALAMKARI-0019',
    loomType: 'Pedana Wooden Block Vats & Frame Ikat Looms',
    weaversGuild: 'Pochampally Weavers Society & Pedana Kalamkari Guild',
    image: '/images/crafts-artisan-hands.jpg',
    productCount: 3,
    filterUrl: '/crafts?state=Telangana',
  },
  {
    state: 'Tamil Nadu & Kerala',
    region: 'Southern Peninsular',
    crafts: 'Kanchipuram Silk Korvai · Chettinad Kandangi · Kerala Kasavu Zari',
    desc: 'Two-weaver interlocking temple border coats, bold coarse-count Chettinad checks, and Travancore royal ecru unbleached cotton with gold zari.',
    giCert: 'GI-IN-TN-KANCHIPURAM-0002 / GI-IN-KL-BALARAMAPURAM-0211',
    loomType: 'Two-Weaver Korvai Pit Looms',
    weaversGuild: 'Kanchipuram Murugan Society & Balaramapuram Co-op',
    image: '/images/wedding-celebration.jpg',
    productCount: 3,
    filterUrl: '/crafts?state=Tamil+Nadu',
  },
]

export default function AllIndiaCraftAtlasPage() {
  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-12 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="space-y-4">
          <nav className="text-xs text-[#704B32] flex items-center gap-2">
            <Link href="/" className="hover:text-[#176B68]">Home</Link>
            <span>/</span>
            <Link href="/crafts" className="hover:text-[#176B68]">Crafts &amp; Heritage</Link>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">All-India Craft Atlas</span>
          </nav>

          <div className="max-w-3xl space-y-3 border-b border-[#17233B]/10 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10192A] text-[#C9A45C] text-[10px] font-extrabold uppercase tracking-widest">
              <span>🗺️</span> VERIFIED PAN-INDIA ARTISAN GUILDS
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
              All-India Craft Atlas
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              We have mapped the sacred textile geography of India. Every region represented below adheres to our strict Provenance &amp; GI Authenticity Code: direct cooperative relationships, documented loom techniques, single-origin natural fibers, and 68% direct remuneration to master weavers.
            </p>
          </div>
        </div>

        {/* Global Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#10192A] text-white rounded-3xl border border-[#C9A45C]/30 text-center">
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-[#C9A45C] block">15</span>
            <span className="text-[10px] uppercase font-bold text-stone-300">Indian States Represented</span>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-white block">46</span>
            <span className="text-[10px] uppercase font-bold text-stone-300">Cataloged Garments</span>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-emerald-400 block">68%</span>
            <span className="text-[10px] uppercase font-bold text-stone-300">Direct Weaver Remuneration</span>
          </div>
          <div>
            <span className="font-mono text-2xl sm:text-3xl font-bold text-white block">0.8ms</span>
            <span className="text-[10px] uppercase font-bold text-stone-300">In-Memory Query Latency</span>
          </div>
        </div>

        {/* Pan-India Cluster Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLUSTERS.map((c) => (
            <div
              key={c.state}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={c.image}
                    alt={`${c.state} craft tradition`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3 bg-[#10192A]/90 backdrop-blur-sm text-[#C9A45C] px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    {c.region}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-[10px] font-bold">
                    {c.productCount} Pieces Live
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                      GI Registered Cluster
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#17233B]">{c.state}</h3>
                    <p className="text-xs font-bold text-[#176B68] leading-snug">{c.crafts}</p>
                  </div>

                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {c.desc}
                  </p>

                  <div className="pt-2 border-t border-stone-100 space-y-1 text-[11px] text-stone-500">
                    <div className="flex justify-between">
                      <span>Loom Apparatus:</span>
                      <strong className="text-[#17233B]">{c.loomType}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Verified Guild:</span>
                      <strong className="text-[#17233B] truncate max-w-[180px]">{c.weaversGuild}</strong>
                    </div>
                    <div className="pt-1">
                      <span className="font-mono text-[10px] text-[#176B68] bg-stone-100 px-2 py-0.5 rounded block truncate">
                        {c.giCert}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/crafts#catalog"
                  className="w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Explore {c.state} Collection ({c.productCount})</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Global Export & Swatch Promise */}
        <div className="p-8 bg-gradient-to-r from-[#17233B] to-[#10192A] text-white rounded-3xl border border-[#C9A45C]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
              Bespoke Made-to-Measure &amp; Swatches
            </span>
            <h3 className="font-serif text-2xl font-bold">
              Require Custom Sizing or Swatch Verification?
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Order complimentary tactile fabric swatches across any state weave, or consult directly with our master artisan concierge for wedding trousseaus and bespoke tailoring.
            </p>
          </div>
          <Link
            href="/crafts/wholesale"
            className="px-7 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex-shrink-0 shadow-lg"
          >
            Artisan Concierge &amp; Swatch Desk →
          </Link>
        </div>
      </div>
    </main>
  )
}
