'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CRAFT_PRODUCTS, CRAFT_CATEGORIES, CraftProduct } from '@/lib/crafts-data'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'

export default function CraftsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [activeSiProduct, setActiveSiProduct] = useState<CraftProduct | undefined>(undefined)

  const openTryWithSi = (product?: CraftProduct) => {
    setActiveSiProduct(product)
    setSiModalOpen(true)
  }

  const filteredProducts =
    selectedCategory === 'all'
      ? CRAFT_PRODUCTS
      : CRAFT_PRODUCTS.filter((p) => p.category === selectedCategory)

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      {/* ── 1. Hero Editorial Lookbook Banner ──────────────────────────────────────── */}
      <section className="relative w-full bg-[#17233B] text-[#FAF6EE] overflow-hidden border-b border-[#C9A45C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Brand Content */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[11px] font-bold tracking-widest uppercase">
                <span>✦</span> Fall / Winter 2026 Collection
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
                  Nutty Tales Crafts & Heritage
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                  Kashmir to the World
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-[#FAF6EE]/80">
                  Timeless Craftsmanship. Modern Style. A Warmer Tomorrow.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#FAF6EE]/75 leading-relaxed font-light max-w-lg">
                Shawls, stoles, pherans, and coats woven from the finest Himalayan natural fibres.
                Handcrafted by master artisan guilds in the valleys of Kashmir with verified
                single-origin provenance and GI authenticity.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => openTryWithSi()}
                  className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center gap-2 hover:scale-[1.02]"
                >
                  <span className="text-sm">✨</span>
                  <span>Try with SI — Virtual Drape</span>
                </button>
                <a
                  href="#collection"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Explore Collection ↓
                </a>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-stone-300 font-medium">
                <div>
                  <span className="text-stone-400 block text-xs">🏛️</span> Authentic Craftsmanship
                </div>
                <div>
                  <span className="text-stone-400 block text-xs">🌿</span> Premium Natural Fibres
                </div>
                <div>
                  <span className="text-stone-400 block text-xs">🤝</span> Artisan Communities
                </div>
                <div>
                  <span className="text-stone-400 block text-xs">📦</span> Pan-India & Global Delivery
                </div>
              </div>
            </div>

            {/* Right Cinematic Lookbook Imagery */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 aspect-[16/10] w-full">
                <Image
                  src="/images/crafts-winter-hero.jpg"
                  alt="Nutty Tales Crafts & Heritage Fall Winter 2026 Lookbook"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#17233B]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs flex items-center justify-between">
                  <span className="font-serif italic text-stone-200">
                    Warmth that carries a story — Dal Lake & Srinagar Valleys
                  </span>
                  <span className="bg-[#17233B]/80 px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-bold border border-white/20">
                    FW &apos;26 Editorial
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. "Try With SI" Interactive Feature Callout ─────────────────────────── */}
      <section className="bg-[#FAF6EE] py-10 border-b border-[#17233B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#17233B] via-[#102334] to-[#176B68] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#C9A45C]/30">
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#C9A45C] text-[#17233B] px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest">
                <span>🤖 AI Styling Engine</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Nutty Tales — Try with SI
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                See how each handcrafted Pheran, Pashmina Shawl, Stole, or Velvet Coat looks before you buy.
                Compare cuts, draping styles, embroidery palettes, and ask SI:
                <span className="italic text-[#C9A45C]"> &ldquo;What should I wear in Gulmarg this December?&rdquo;</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <button
                onClick={() => openTryWithSi()}
                className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-105"
              >
                Launch Try-On Studio →
              </button>
              <Link
                href="/crafts/try-with-si"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 text-center transition-colors"
              >
                Style Advisor Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Visual Categories Grid (6 Cards from Campaign) ────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#704B32] font-semibold">
            Curated Wardrobe & Traditions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Explore by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#17233B]/70 font-light">
            Each category represents generations of artisanal mastery, natural Himalayan fibres, and time-tested warmth.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CRAFT_CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                setSelectedCategory(cat.slug)
                const el = document.getElementById('collection')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group text-left bg-white rounded-xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif text-base font-bold leading-tight group-hover:text-[#C9A45C] transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-[10px] text-stone-200 truncate mt-0.5">{cat.sub}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── 4. Main Fall / Winter 2026 Collection Showcase ───────────────────────── */}
      <section id="collection" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#17233B]/10 pb-6 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
              Fall / Winter 2026
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#17233B] mt-1">
              The Heritage Wardrobe
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#17233B] text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              All Items ({CRAFT_PRODUCTS.length})
            </button>
            {CRAFT_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-[#17233B] text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#17233B]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full bg-stone-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="bg-[#17233B]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                      {product.provenance.craftTradition}
                    </span>
                    {product.provenance.giTagCertified && (
                      <span className="bg-[#C9A45C] text-[#17233B] px-2 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-wider w-max shadow-sm">
                        GI Certified
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-[#704B32] px-2 py-1 rounded text-[10px] font-semibold">
                      {product.warmthRating.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#704B32] font-semibold">
                    <span className="uppercase tracking-wider">{product.provenance.origin}</span>
                    <span>{product.provenance.artisanHours} hrs handcraft</span>
                  </div>

                  <Link href={`/crafts/product/${product.slug}`}>
                    <h3 className="font-serif text-lg font-bold text-[#17233B] group-hover:text-[#176B68] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#17233B]/70 leading-relaxed font-light line-clamp-2">
                    {product.shortDesc}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#17233B]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.mrp > product.price && (
                        <span className="ml-2 text-xs text-stone-400 line-through">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      In Stock · Free Insured Shipping
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 pt-0 space-y-2">
                {product.tryWithSiSupported ? (
                  <button
                    onClick={() => openTryWithSi(product)}
                    className="w-full py-2.5 bg-[#C9A45C]/15 hover:bg-[#C9A45C]/25 text-[#704B32] border border-[#C9A45C]/40 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>✨ Try with SI</span>
                  </button>
                ) : (
                  <Link
                    href={`/crafts/product/${product.slug}`}
                    className="block w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-center rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors"
                  >
                    View Details & Heritage
                  </Link>
                )}

                <Link
                  href={`/crafts/product/${product.slug}`}
                  className="block w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                >
                  Order / View Piece →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Three Editorial Stories (From the Campaign Banner) ────────────────── */}
      <section className="py-20 bg-[#F0EBE1] border-t border-b border-[#17233B]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Handcrafted in Kashmir */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full bg-stone-100">
                <Image
                  src="/images/crafts-artisan-hands.jpg"
                  alt="Artisan hands stitching sozni needlework"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                    Living Heritage
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#17233B] mt-1">
                    Handcrafted in Kashmir
                  </h3>
                  <p className="text-xs text-[#17233B]/70 leading-relaxed font-light mt-2">
                    Preserving centuries-old traditions, supporting artisan guilds, and sustaining weaving
                    families in Kanihama, Zadibal, and Downtown Srinagar.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/crafts/kashmir"
                    className="text-xs font-bold tracking-wider uppercase text-[#176B68] hover:text-[#214B39] inline-flex items-center gap-1"
                  >
                    Learn Our Story →
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. From Kashmir With Love */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full bg-stone-100">
                <Image
                  src="/images/crafts-kashmir-landscape.jpg"
                  alt="Dal Lake houseboats and snow-clad Himalayan mountain peaks"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                    Valley to Wardrobe
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#17233B] mt-1">
                    From Kashmir, With Love
                  </h3>
                  <p className="text-xs text-[#17233B]/70 leading-relaxed font-light mt-2">
                    Authentic crafts. Pure natural mountain fibres. A more meaningful, timeless wardrobe
                    that keeps you warm across cold winters and carries a story across generations.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/crafts/kashmir"
                    className="text-xs font-bold tracking-wider uppercase text-[#176B68] hover:text-[#214B39] inline-flex items-center gap-1"
                  >
                    Explore Kashmir Crafts →
                  </Link>
                </div>
              </div>
            </div>

            {/* 3. Corporate & Festive Gifting */}
            <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group">
              <div className="relative aspect-[16/9] w-full bg-stone-100">
                <Image
                  src="/images/crafts-gifting-box.jpg"
                  alt="Nutty Tales Crafts and Heritage corporate luxury gift box"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                    Prestige Keepsakes
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#17233B] mt-1">
                    Corporate & Festive Gifting
                  </h3>
                  <p className="text-xs text-[#17233B]/70 leading-relaxed font-light mt-2">
                    Custom hampers pairing pure Cashmere stoles with handcrafted papier-mâché boxes,
                    Pampore saffron, and single-origin Kashmiri walnuts.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/corporate-gifting"
                    className="text-xs font-bold tracking-wider uppercase text-[#176B68] hover:text-[#214B39] inline-flex items-center gap-1"
                  >
                    Request a Corporate Quote →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. The Ecosystem Bridge (Taste • Stay • Explore • Discover) ──────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-semibold">
            The Nutty Tales Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Taste it. Stay there. Explore it. Bring its stories home.
          </h2>
          <p className="text-xs sm:text-sm text-[#17233B]/70 leading-relaxed font-light">
            Stay at our Srinagar mountain retreat, taste single-origin Kagzi walnuts & saffron harvested
            from surrounding terraces, and drape yourself in heirlooms woven by local master artisans.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <Link
            href="/shop"
            className="p-6 rounded-xl bg-white border border-stone-200 hover:border-[#176B68] transition-colors"
          >
            <span className="text-2xl block mb-2">🌰</span>
            <h4 className="font-serif font-bold text-base text-[#17233B]">Taste Foods</h4>
            <p className="text-xs text-stone-500 mt-1">Dry fruits, saffron, raw honey, and makhana.</p>
          </Link>

          <Link
            href="/corporate-gifting"
            className="p-6 rounded-xl bg-white border border-stone-200 hover:border-[#176B68] transition-colors"
          >
            <span className="text-2xl block mb-2">🎁</span>
            <h4 className="font-serif font-bold text-base text-[#17233B]">Gift Hampers</h4>
            <p className="text-xs text-stone-500 mt-1">Diwali corporate & heritage luxury boxes.</p>
          </Link>

          <Link
            href="/stays"
            className="p-6 rounded-xl bg-white border border-stone-200 hover:border-[#176B68] transition-colors"
          >
            <span className="text-2xl block mb-2">🏡</span>
            <h4 className="font-serif font-bold text-base text-[#17233B]">Stay Retreas</h4>
            <p className="text-xs text-stone-500 mt-1">Boutique properties in Srinagar, Noida & Patna.</p>
          </Link>

          <Link
            href="/crafts"
            className="p-6 rounded-xl bg-white border border-[#176B68] ring-1 ring-[#176B68] transition-colors"
          >
            <span className="text-2xl block mb-2">🧣</span>
            <h4 className="font-serif font-bold text-base text-[#17233B]">Discover Crafts</h4>
            <p className="text-xs text-stone-500 mt-1">Shawls, pherans, stoles & walnut wood.</p>
          </Link>
        </div>
      </section>

      {/* Global Try with SI Modal */}
      <TryWithSIModal
        isOpen={siModalOpen}
        onClose={() => setSiModalOpen(false)}
        initialProduct={activeSiProduct}
      />
    </main>
  )
}
