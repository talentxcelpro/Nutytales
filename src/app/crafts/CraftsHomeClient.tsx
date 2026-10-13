'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CLOTHING_PRODUCTS,
  ClothingProduct,
  AllIndiaRegion,
} from '@/lib/clothing-data'
import ClothingNavbarStrip from '@/components/crafts/ClothingNavbarStrip'
import ClothingFilterBar, { FilterState } from '@/components/crafts/ClothingFilterBar'
import ClothingProductCard from '@/components/crafts/ClothingProductCard'
import QuickAddModal from '@/components/crafts/QuickAddModal'
import SizeGuideModal from '@/components/crafts/SizeGuideModal'
import GarmentViewer3DModal from '@/components/crafts/GarmentViewer3DModal'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'
import ArtisanPassportModal from '@/components/crafts/ArtisanPassportModal'
import ExpressBuyModal from '@/components/crafts/ExpressBuyModal'
import CraftAtlasRibbon from '@/components/crafts/CraftAtlasRibbon'
import DemandCaptureModal from '@/components/demand/DemandCaptureModal'
import SourcingRequestBanner from '@/components/demand/SourcingRequestBanner'
import CraftsSwatchAndConsignmentDesk from '@/components/crafts/CraftsSwatchAndConsignmentDesk'

// All-India Wardrobe Category Tiles
const ALL_INDIA_CATEGORY_TILES = [
  {
    slug: 'kurtas-tunics',
    label: 'Kurtas & Tunics',
    sub: 'Ajrakh · Chikankari · Ikat',
    image: '/images/crafts-winterwear.jpg',
    href: '#catalog',
  },
  {
    slug: 'pherans',
    label: 'Pherans & Coats',
    sub: 'Velvet Tilla · Merino Wool',
    image: '/images/crafts-pherans.jpg',
    href: '/crafts/pherans',
  },
  {
    slug: 'shawls-stoles',
    label: 'Shawls & Wraps',
    sub: 'GI Pashmina · Kani · Sozni',
    image: '/images/crafts-shawls.jpg',
    href: '/crafts/shawls-stoles',
  },
  {
    slug: 'jackets-coats',
    label: 'Jackets & Vests',
    sub: 'Banarasi · Rabari · Kinnauri',
    image: '/images/crafts-jackets.jpg',
    href: '/crafts/jackets-coats',
  },
  {
    slug: 'silk-heritage',
    label: 'Silk Heritage',
    sub: 'Patola · Eri Silk · Tanchoi',
    image: '/images/crafts-stoles.jpg',
    href: '#catalog',
  },
  {
    slug: 'heritage-home',
    label: 'Heritage Keepsakes',
    sub: 'Carved Walnut · Papier-Mâché',
    image: '/images/dark-wood-gourmet-tray.jpg',
    href: '/crafts/heritage-home',
  },
]

export default function CraftsHomeClient() {
  // ── State for Modals & Overlays ─────────────────────────────────────────────
  const [selectedProductForQuickAdd, setSelectedProductForQuickAdd] = useState<ClothingProduct | null>(null)
  const [selectedProductFor3D, setSelectedProductFor3D] = useState<ClothingProduct | null>(null)
  const [selectedProductForPassport, setSelectedProductForPassport] = useState<ClothingProduct | null>(null)
  const [selectedProductForExpressBuy, setSelectedProductForExpressBuy] = useState<ClothingProduct | null>(null)
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [b2bQuoteOpen, setB2bQuoteOpen] = useState(false)
  const [activeSiProduct, setActiveSiProduct] = useState<ClothingProduct | undefined>(undefined)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  // ── Regional Atlas State ────────────────────────────────────────────────────
  const [selectedRegion, setSelectedRegion] = useState<AllIndiaRegion>('All India')
  const [selectedState, setSelectedState] = useState<string>('')

  // ── Filter & Search State ───────────────────────────────────────────────────
  const [activeCollection, setActiveCollection] = useState<string>('new-arrivals')
  const [filterLatency, setFilterLatency] = useState<number>(0.9)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: '',
    subCategory: '',
    region: '',
    state: '',
    size: '',
    colour: '',
    material: '',
    craft: '',
    warmth: '',
    occasion: '',
    inStockOnly: false,
    giOnly: false,
    sortBy: 'featured',
  })

  // Synchronize Region and State between Atlas and Filters
  const handleSelectRegion = (r: AllIndiaRegion) => {
    setSelectedRegion(r)
    setSelectedState('')
    setFilters((prev) => ({
      ...prev,
      region: r === 'All India' ? '' : r,
      state: '',
    }))
  }

  const handleSelectState = (st: string) => {
    setSelectedState(st)
    setFilters((prev) => ({
      ...prev,
      state: st,
    }))
  }

  // ── High-Speed In-Memory Filter Engine (<1ms) ────────────────────────────────
  const filteredProducts = useMemo(() => {
    const startTime = performance.now()
    let result = [...CLOTHING_PRODUCTS]

    // 1. Region Filter
    if (selectedRegion && selectedRegion !== 'All India') {
      result = result.filter((p) => {
        if (p.region) return p.region === selectedRegion
        if (selectedRegion === 'Himalayas & North') {
          return !p.region || p.provenance.origin.includes('Kashmir')
        }
        return false
      })
    }

    // 2. State Filter
    if (filters.state || selectedState) {
      const targetState = filters.state || selectedState
      result = result.filter((p) => {
        if (p.state) return p.state.toLowerCase() === targetState.toLowerCase()
        if (targetState.toLowerCase() === 'kashmir') {
          return !p.state || p.provenance.origin.toLowerCase().includes('kashmir')
        }
        return false
      })
    }

    // 3. Collection filter
    if (activeCollection === 'new-arrivals') {
      result = result.filter((p) => p.isNew)
    } else if (activeCollection === 'bestsellers') {
      result = result.filter((p) => p.isBestseller)
    } else if (activeCollection === 'seasonal' || activeCollection === 'fall-winter-2026') {
      result = result.filter((p) => p.isFallWinter2026 || p.warmthRating?.includes('Heavy') || p.warmthRating?.includes('Medium'))
    } else if (activeCollection === 'festive') {
      result = result.filter((p) => p.tags.includes('festive') || p.tags.includes('tilla') || p.tags.includes('wedding'))
    } else if (activeCollection === 'heritage' || activeCollection === 'craft-collection') {
      result = result.filter((p) => p.provenance.giTagCertified || p.tags.includes('heritage'))
    } else if (activeCollection === 'luxury') {
      result = result.filter((p) => p.price >= 15000 || p.tags.includes('pashmina') || p.tags.includes('patola') || p.tags.includes('brocade'))
    } else if (activeCollection === 'home') {
      result = result.filter((p) => p.primaryCategory === 'heritage-home')
    } else if (activeCollection === 'gifting') {
      result = result.filter((p) => p.primaryCategory === 'heritage-home' || p.tags.includes('gifting'))
    }

    // 4. Search query
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.craft.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          (p.state && p.state.toLowerCase().includes(q)) ||
          p.colorOptions.some((c) => c.name.toLowerCase().includes(q))
      )
    }

    // 5. GI Certified Only
    if (filters.giOnly) {
      result = result.filter((p) => p.provenance.giTagCertified)
    }

    // 6. Gender
    if (filters.gender) {
      result = result.filter((p) => p.gender === filters.gender || p.gender === 'unisex')
    }

    // 7. Subcategory
    if (filters.subCategory) {
      result = result.filter((p) => p.subCategory === filters.subCategory)
    }

    // 8. Size
    if (filters.size) {
      result = result.filter((p) => p.sizes.includes(filters.size) || p.sizes.includes('Free Size'))
    }

    // 9. Material
    if (filters.material) {
      result = result.filter((p) => p.material.toLowerCase().includes(filters.material.toLowerCase()))
    }

    // 10. Craft
    if (filters.craft) {
      result = result.filter((p) => p.craft.toLowerCase().includes(filters.craft.toLowerCase()))
    }

    // 11. Warmth
    if (filters.warmth) {
      result = result.filter((p) => p.warmthRating.startsWith(filters.warmth.split(' ')[0]))
    }

    // 12. Occasion
    if (filters.occasion) {
      result = result.filter((p) => p.occasion === filters.occasion)
    }

    // 13. In Stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stockStatus === 'IN_STOCK')
    }

    // 14. Sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    } else if (filters.sortBy === 'bestselling') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
    } else if (filters.sortBy === 'loom-hours') {
      result.sort((a, b) => (b.loomHours || b.provenance.artisanHours || 0) - (a.loomHours || a.provenance.artisanHours || 0))
    } else if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    const duration = performance.now() - startTime
    setFilterLatency(Math.max(0.4, parseFloat(duration.toFixed(2))))

    return result
  }, [filters, activeCollection, selectedRegion, selectedState])

  // Extract available subcategories from current pool
  const currentSubcategories = useMemo(() => {
    const set = new Set<string>()
    CLOTHING_PRODUCTS.forEach((p) => set.add(p.subCategory))
    return Array.from(set)
  }, [])

  const handleOpenTryWithSi = (product?: ClothingProduct) => {
    setActiveSiProduct(product)
    setSiModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B]">
      {/* ── Modals & Overlays ──────────────────────────────────────────────────── */}
      <QuickAddModal
        product={selectedProductForQuickAdd}
        isOpen={!!selectedProductForQuickAdd}
        onClose={() => setSelectedProductForQuickAdd(null)}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      <ArtisanPassportModal
        product={selectedProductForPassport}
        isOpen={!!selectedProductForPassport}
        onClose={() => setSelectedProductForPassport(null)}
      />

      <ExpressBuyModal
        product={selectedProductForExpressBuy}
        isOpen={!!selectedProductForExpressBuy}
        onClose={() => setSelectedProductForExpressBuy(null)}
      />

      <GarmentViewer3DModal
        product={selectedProductFor3D}
        isOpen={!!selectedProductFor3D}
        onClose={() => setSelectedProductFor3D(null)}
      />

      <TryWithSIModal
        isOpen={siModalOpen}
        onClose={() => setSiModalOpen(false)}
        initialProduct={activeSiProduct}
      />

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <DemandCaptureModal
        isOpen={b2bQuoteOpen}
        onClose={() => setB2bQuoteOpen(false)}
      />

      {/* ── 1. Hero: All-India Handcrafted Wardrobe Campaign ─────────────────── */}
      <section className="relative w-full bg-[#10192A] text-white py-14 sm:py-20 border-b border-[#C9A45C]/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & Direct CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[10px] font-extrabold tracking-widest uppercase">
                <span>⚡</span> WORLD’S FIRST FASTEST CRAFTS E-COMMERCE PLATFORM
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
                  Nuty Tales Crafts · All India Handlooms
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  India’s Handcrafted Wardrobe. Verified at the Loom.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-stone-200">
                  Kashmir Pashmina · Kutch Ajrakh · Banarasi Silk · Lucknowi Chikankari · Assam Eri Peace Silk
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-2xl">
                Experience physical-store speed online. Our sub-1ms in-memory catalog connects 15 Indian state weaver guilds directly to discerning wardrobes. Every garment features single-origin GI certification, verifiable loom hours, and transparent 68% direct weaver remuneration.
              </p>

              {/* Direct Department CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#catalog"
                  className="px-7 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-[1.02]"
                >
                  Explore All-India Crafts (46 Pieces) →
                </a>
                <Link
                  href="/crafts/women"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Women
                </Link>
                <Link
                  href="/crafts/men"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Men
                </Link>
                <button
                  type="button"
                  onClick={() => handleOpenTryWithSi()}
                  className="px-5 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
                >
                  <span>✨ Try with SI</span>
                </button>
              </div>

              {/* Provenance & Speed Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-stone-300 font-medium">
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">🏛️ Pan-India GI</span>
                  15 State Artisan Guilds
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">⚡ Sub-1ms Speed</span>
                  In-Memory 0kb Roundtrip
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">🤝 68% to Weavers</span>
                  Transparent Fair Remuneration
                </div>
              </div>
            </div>

            {/* Right Campaign Showcase */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[16/12] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
                <Image
                  src="/images/campaign-wear-the-story.jpg"
                  alt="Nuty Tales Crafts All India Heritage Lookbook"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10192A]/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#10192A]/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                      ✦ The Pan-India Loom Promise
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ⚡ 0.9ms Catalog Response
                    </span>
                  </div>
                  <p className="text-xs text-stone-200 font-light leading-snug">
                    From the cold high-altitude looms of Zadibal to the desert block tables of Kutch and the temple pits of Varanasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Interactive All-India Craft Atlas Ribbon ───────────────────────── */}
      <CraftAtlasRibbon
        selectedRegion={selectedRegion}
        selectedState={selectedState}
        onSelectRegion={handleSelectRegion}
        onSelectState={handleSelectState}
      />

      {/* ── 3. Primary Clothing Navigation Strip ──────────────────────────────── */}
      <ClothingNavbarStrip
        onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
        activeCollection={activeCollection}
        onSelectCollection={(col) => setActiveCollection(col)}
      />

      {/* ── 4. Shop by All-India Craft Wardrobe Category ───────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold block">
              Pan-India Wardrobe Departments
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] mt-1">
              Shop by Craft Category
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Explore hand-embroidery, extra-weft pit-looms, resist-dyes, and heritage outerwear across India.
            </p>
          </div>
          <a
            href="#catalog"
            className="text-xs font-bold text-[#176B68] hover:underline uppercase tracking-wider flex-shrink-0"
          >
            View Complete Catalog (46 Pieces) →
          </a>
        </div>

        {/* Category Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {ALL_INDIA_CATEGORY_TILES.map((tile) => (
            <Link
              key={tile.slug}
              href={tile.href}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-square w-full bg-[#FAF6EE] overflow-hidden">
                <Image
                  src={tile.image}
                  alt={tile.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <div className="p-3 text-center space-y-0.5">
                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#17233B] group-hover:text-[#176B68] transition-colors">
                  {tile.label}
                </h3>
                <p className="text-[10px] text-stone-500 truncate">{tile.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. Main Product Catalog & Instant Filter Section ─────────────────── */}
      <section id="catalog" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
                {selectedState
                  ? `${selectedState} Handcrafted Collection`
                  : selectedRegion !== 'All India'
                  ? `${selectedRegion} Weaves`
                  : activeCollection === 'new-arrivals'
                  ? 'New Arrivals (Autumn & Winter 2026)'
                  : activeCollection === 'bestsellers'
                  ? 'Bestselling All-India Classics'
                  : 'All-India Handcrafted Collection'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                ⚡ {filterLatency.toFixed(1)}ms
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {filteredProducts.length} pieces · Instant in-memory filters, 1-Click Express Buy &amp; Verifiable GI Passports.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1"
            >
              <span>📏</span>
              <span>Size Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setB2bQuoteOpen(true)}
              className="text-xs font-bold text-[#704B32] hover:underline flex items-center gap-1"
            >
              <span>🏛️</span>
              <span>B2B / Export Desk</span>
            </button>
          </div>
        </div>

        {/* Filter and Sort Toolbar with Telemetry */}
        <ClothingFilterBar
          filters={filters}
          onFilterChange={setFilters}
          totalCount={filteredProducts.length}
          availableSubcategories={currentSubcategories}
          filterLatencyMs={filterLatency}
        />

        {/* ── 4-Column Product Grid ─────────────────────────────────────────── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {filteredProducts.map((product) => (
              <ClothingProductCard
                key={product.id}
                product={product}
                onQuickAdd={(p) => setSelectedProductForQuickAdd(p)}
                onTryWithSi={(p) => handleOpenTryWithSi(p)}
                onOpen3D={(p) => setSelectedProductFor3D(p)}
                onOpenPassport={(p) => setSelectedProductForPassport(p)}
                onExpressBuy={(p) => setSelectedProductForExpressBuy(p)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-3">
            <span className="text-3xl block">🔍</span>
            <h3 className="font-serif font-bold text-lg text-[#17233B]">
              No garments matched your filter criteria
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Try resetting your region, craft, or search query to browse our 46 Pan-India pieces.
            </p>
            <button
              type="button"
              onClick={() => {
                handleSelectRegion('All India')
                handleSelectState('')
                setFilters({
                  search: '',
                  gender: '',
                  subCategory: '',
                  region: '',
                  state: '',
                  size: '',
                  colour: '',
                  material: '',
                  craft: '',
                  warmth: '',
                  occasion: '',
                  inStockOnly: false,
                  giOnly: false,
                  sortBy: 'featured',
                })
              }}
              className="px-5 py-2.5 bg-[#17233B] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ── 6. "With a Difference": Craft-to-Closet Transparent Economics ──────── */}
      <section className="py-16 bg-[#17233B] text-white border-y border-[#C9A45C]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
              The Difference That Matters
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Craft-to-Closet Transparent Economics
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Fast fashion takes 80% markups for retail middlemen while paying weavers cents. Nuty Tales inverted the supply chain: 68% of every rupee paid flows directly into the verified bank account of the weaver cooperative guild.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-[#C9A45C] block">68%</span>
              <h3 className="font-bold text-sm text-white">Direct Weaver Remuneration</h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Paid directly to the master weavers in Dhamadka, Zadibal, Chowk, Varanasi, Sualkuchi and Kanchipuram.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-emerald-400 block">14%</span>
              <h3 className="font-bold text-sm text-white">Ethical Raw Fibers &amp; Dyes</h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Changthangi pashmina, organic river-washed indigo, Ahimsa peace silk cocoons, and certified silver zari.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-stone-300 block">10%</span>
              <h3 className="font-bold text-sm text-white">Insured Freight &amp; Keepsake Boxes</h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Breathable unbleached cotton garment bags, artisan lineage cards, and insured express delivery across India &amp; global customs.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-[#176B68] block">8%</span>
              <h3 className="font-bold text-sm text-white">Platform Verification &amp; Speed QA</h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Lab fiber testing, Government GI certificate validation, and high-speed in-memory digital infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Swatch Desk & Bespoke Made-to-Measure ─────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CraftsSwatchAndConsignmentDesk />
      </section>

      {/* ── 8. Demand Sourcing Banner ─────────────────────────────────────────── */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SourcingRequestBanner />
      </section>
    </main>
  )
}
