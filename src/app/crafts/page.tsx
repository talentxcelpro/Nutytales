'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CLOTHING_PRODUCTS,
  PRODUCT_CATEGORY_TILES,
  ClothingProduct,
  AVAILABLE_COLOURS,
} from '@/lib/clothing-data'
import ClothingNavbarStrip from '@/components/crafts/ClothingNavbarStrip'
import ClothingFilterBar, { FilterState } from '@/components/crafts/ClothingFilterBar'
import ClothingProductCard from '@/components/crafts/ClothingProductCard'
import QuickAddModal from '@/components/crafts/QuickAddModal'
import SizeGuideModal from '@/components/crafts/SizeGuideModal'
import GarmentViewer3DModal from '@/components/crafts/GarmentViewer3DModal'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'
import DemandCaptureModal from '@/components/demand/DemandCaptureModal'
import SourcingRequestBanner from '@/components/demand/SourcingRequestBanner'
import CraftsSwatchAndConsignmentDesk from '@/components/crafts/CraftsSwatchAndConsignmentDesk'

export default function CraftsPage() {
  // ── State for Modals & Overlays ─────────────────────────────────────────────
  const [selectedProductForQuickAdd, setSelectedProductForQuickAdd] = useState<ClothingProduct | null>(null)
  const [selectedProductFor3D, setSelectedProductFor3D] = useState<ClothingProduct | null>(null)
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [b2bQuoteOpen, setB2bQuoteOpen] = useState(false)
  const [activeSiProduct, setActiveSiProduct] = useState<ClothingProduct | undefined>(undefined)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  // ── Filters & Search State ──────────────────────────────────────────────────
  const [activeCollection, setActiveCollection] = useState<string>('new-arrivals')
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    gender: '',
    subCategory: '',
    size: '',
    colour: '',
    material: '',
    craft: '',
    warmth: '',
    occasion: '',
    inStockOnly: false,
    sortBy: 'featured',
  })

  // ── Filtered & Sorted Product Set ───────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...CLOTHING_PRODUCTS]

    // Collection filter
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
      result = result.filter((p) => p.price >= 25000 || p.tags.includes('pashmina'))
    } else if (activeCollection === 'home') {
      result = result.filter((p) => p.primaryCategory === 'heritage-home')
    } else if (activeCollection === 'gifting') {
      result = result.filter((p) => p.primaryCategory === 'heritage-home' || p.tags.includes('gifting'))
    }

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.craft.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.colorOptions.some((c) => c.name.toLowerCase().includes(q))
      )
    }

    // Gender
    if (filters.gender) {
      result = result.filter((p) => p.gender === filters.gender || p.gender === 'unisex')
    }

    // Subcategory
    if (filters.subCategory) {
      result = result.filter((p) => p.subCategory === filters.subCategory)
    }

    // Size
    if (filters.size) {
      result = result.filter((p) => p.sizes.includes(filters.size) || p.sizes.includes('Free Size'))
    }

    // Colour
    if (filters.colour) {
      result = result.filter((p) =>
        p.colorOptions.some((c) => c.name.toLowerCase().includes(filters.colour.toLowerCase()))
      )
    }

    // Material
    if (filters.material) {
      result = result.filter((p) => p.material.toLowerCase().includes(filters.material.toLowerCase()))
    }

    // Craft
    if (filters.craft) {
      result = result.filter((p) => p.craft.toLowerCase().includes(filters.craft.toLowerCase()))
    }

    // Warmth
    if (filters.warmth) {
      result = result.filter((p) => p.warmthRating.startsWith(filters.warmth.split(' ')[0]))
    }

    // Occasion
    if (filters.occasion) {
      result = result.filter((p) => p.occasion === filters.occasion)
    }

    // In Stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.stockStatus === 'IN_STOCK')
    }

    // Sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    } else if (filters.sortBy === 'bestselling') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
    } else if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [filters, activeCollection])

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
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      {/* ── 1. Hero Kashmir Fashion Campaign ───────────────────────────────────── */}
      <section className="relative w-full bg-[#17233B] text-white py-14 sm:py-20 border-b border-[#C9A45C]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & Direct CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[10px] font-extrabold tracking-widest uppercase">
                <span>✦</span> AUTUMN &amp; WINTER HERITAGE COLLECTIONS
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
                  Nuty Tales Crafts &amp; Heritage
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  Kashmir to the World.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-stone-200">
                  Pherans. Shawls. Jackets. Winter Wear. Crafted with character.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl">
                Real Himalayan winter luxury woven on centuries-old looms. Micro-velvet, pure sheep wool, and hand-spun Changthangi Pashmina with verified single-origin provenance and GI certification.
              </p>

              {/* Direct Department CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/crafts/women"
                  className="px-7 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-[1.02]"
                >
                  Shop Women →
                </Link>
                <Link
                  href="/crafts/men"
                  className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Shop Men →
                </Link>
                <button
                  type="button"
                  onClick={() => handleOpenTryWithSi()}
                  className="px-5 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
                >
                  <span>✨ Try with SI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setB2bQuoteOpen(true)}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-[#C9A45C] border border-[#C9A45C]/40 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
                >
                  <span>🏛️ Wholesale / Export RFQ</span>
                </button>
              </div>

              {/* Provenance Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-[10px] uppercase tracking-wider text-stone-300 font-medium">
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">🏛️ GI Certified</span>
                  Authentic Valley Weaves
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">🌾 Pure Fibres</span>
                  Changthangi &amp; Merino Wool
                </div>
                <div>
                  <span className="text-[#C9A45C] block text-xs font-bold">📦 Insured Freight</span>
                  Pan-India &amp; Global Delivery
                </div>
              </div>
            </div>

            {/* Right ONE Strong Kashmir Fashion Campaign Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden border border-white/15 shadow-2xl group">
                <Image
                  src="/images/campaign-wear-the-story.jpg"
                  alt="Nuty Tales Crafts & Heritage Fall Winter 2026 Lookbook - Wear the story"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10192A]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#10192A]/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                    ✦ The Artisan to Wardrobe Promise
                  </span>
                  <p className="text-xs text-stone-200 font-light leading-snug">
                    Every piece is crafted by verified cooperative guilds across Zadibal, Kanihama and Charar-i-Sharief.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Primary Clothing Navigation Strip ──────────────────────────────── */}
      <ClothingNavbarStrip
        onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
        activeCollection={activeCollection}
        onSelectCollection={(col) => setActiveCollection(col)}
      />

      {/* ── 3. Shop by Category (Product/Clothing Images — NOT Models Everywhere) ─ */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold block">
              Curated Wardrobe Departments
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] mt-1">
              Shop by Category
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Folded garments, loom textures, and tailored outerwear presented in clean studio light.
            </p>
          </div>
          <Link
            href="/crafts/pherans"
            className="text-xs font-bold text-[#176B68] hover:underline uppercase tracking-wider flex-shrink-0"
          >
            Explore All Categories →
          </Link>
        </div>

        {/* Category Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {PRODUCT_CATEGORY_TILES.map((tile) => (
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

      {/* ── 4. Main Product Catalog & Filter Section ───────────────────────────── */}
      <section id="catalog" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
              {activeCollection === 'new-arrivals'
                ? 'New Arrivals (Autumn & Winter)'
                : activeCollection === 'bestsellers'
                ? 'Bestselling Heritage Classics'
                : activeCollection === 'fall-winter-2026' || activeCollection === 'seasonal'
                ? 'Autumn & Winter Curated Selection'
                : activeCollection === 'craft-collection'
                ? 'GI Certified Craft Collection'
                : 'Heritage Gifting & Keepsakes'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Showing {filteredProducts.length} pieces · Discover, compare, select sizes, and inspect in 3D.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>📏</span>
            <span>Size &amp; Fit Guide</span>
          </button>
        </div>

        {/* Filter and Sort Toolbar */}
        <ClothingFilterBar
          filters={filters}
          onFilterChange={setFilters}
          totalCount={filteredProducts.length}
          availableSubcategories={currentSubcategories}
        />

        {/* ── 4-Column Product Grid (Desktop: 4, Tablet: 3, Mobile: 2) ───────── */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {filteredProducts.map((product) => (
              <ClothingProductCard
                key={product.id}
                product={product}
                onQuickAdd={(p) => setSelectedProductForQuickAdd(p)}
                onTryWithSi={(p) => handleOpenTryWithSi(p)}
                onOpen3D={(p) => setSelectedProductFor3D(p)}
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
              Try resetting your filters or search query to browse our complete collection.
            </p>
            <button
              type="button"
              onClick={() =>
                setFilters({
                  search: '',
                  gender: '',
                  subCategory: '',
                  size: '',
                  colour: '',
                  material: '',
                  craft: '',
                  warmth: '',
                  occasion: '',
                  inStockOnly: false,
                  sortBy: 'featured',
                })
              }
              className="px-5 py-2.5 bg-[#17233B] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* ── 5. Autumn & Winter Seasonal Colour Story Banner ─────────────────── */}
      <section className="py-16 bg-[#17233B] text-white border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold block">
              Seasonal Palette
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Autumn &amp; Winter: Kashmir to the World
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Our seasonal palette draws directly from the changing valley: deep crimson madder root, pine-covered slopes of Gulmarg, Dal Lake midnight reflections, and warm Himalayan ivory.
            </p>
          </div>

          {/* 8-Colour Swatch Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {AVAILABLE_COLOURS.slice(0, 8).map((col) => (
              <button
                key={col.name}
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, colour: col.name }))}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-center space-y-2 transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-full mx-auto border-2 border-white/20 shadow-md group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="font-bold text-xs text-white block truncate">{col.name}</span>
                <span className="text-[10px] text-stone-400 block uppercase font-mono">{col.hex}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Shop Departments Portals: Men, Women, Kids ─────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Storefront Portals
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Explore by Wardrobe
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Dedicated shopping environments tailored to men, women, and family winter sets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Women's Storefront */}
          <Link
            href="/crafts/women"
            className="group relative rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-6 sm:p-8"
          >
            <Image
              src="/images/campaign-wear-the-story.jpg"
              alt="Women's Kashmir Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-[#10192A]/40 to-transparent" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                Women's Collection
              </span>
              <h3 className="font-serif text-2xl font-bold">
                Pherans, Capes &amp; Shawls
              </h3>
              <p className="text-xs text-stone-300 font-light leading-snug">
                Silk velvet Tilla pherans, Aari capes, and heirloom Kani Pashmina shawls.
              </p>
              <span className="inline-block text-xs font-bold text-[#C9A45C] group-hover:underline pt-1">
                Explore Women's Storefront →
              </span>
            </div>
          </Link>

          {/* Men's Storefront */}
          <Link
            href="/crafts/men"
            className="group relative rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-6 sm:p-8"
          >
            <Image
              src="/images/campaign-mens-style-story.jpg"
              alt="Men's Kashmir Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-[#10192A]/40 to-transparent" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                Men's Collection
              </span>
              <h3 className="font-serif text-2xl font-bold">
                Tweed Pherans &amp; Overcoats
              </h3>
              <p className="text-xs text-stone-300 font-light leading-snug">
                Heavyweight tweed pherans, Kani-accented coats, and reversible Pashmina mufflers.
              </p>
              <span className="inline-block text-xs font-bold text-[#C9A45C] group-hover:underline pt-1">
                Explore Men's Storefront →
              </span>
            </div>
          </Link>

          {/* Kids & Family Storefront */}
          <Link
            href="/crafts/kids"
            className="group relative rounded-3xl overflow-hidden border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-6 sm:p-8"
          >
            <Image
              src="/images/crafts-pherans.jpg"
              alt="Kids & Family Collection"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-[#10192A]/40 to-transparent" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                Kids &amp; Family
              </span>
              <h3 className="font-serif text-2xl font-bold">
                Little Pherans &amp; Sets
              </h3>
              <p className="text-xs text-stone-300 font-light leading-snug">
                Cotton-lined anti-itch children's wool pherans and coordinated Mother-Daughter sets.
              </p>
              <span className="inline-block text-xs font-bold text-[#C9A45C] group-hover:underline pt-1">
                Explore Kids &amp; Family →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── 7. Craft Stories: Aari, Sozni, Tilla, Kani, Pashmina ───────────────── */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
              Provenance &amp; Technique
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              The Five Masters of Kashmir Textile
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              We document verified craft methods. No unverified claims; only authentic living heritage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                title: 'Tilla Dozi',
                sub: 'Metallic Gold Needlework',
                desc: 'Pointed steel needles anchor real silver & gold-gilded metallic threads onto heavy velvet and wool canvasses.',
                origin: 'Zadibal, Downtown Srinagar',
              },
              {
                title: 'Sozni Needlework',
                sub: 'Micro-Stitch Embroidery',
                desc: 'Executed with needles as fine as horsehair, inserting shaded silk floss into intricate floral medallions.',
                origin: 'Pampore & Downtown Srinagar',
              },
              {
                title: 'Aari Hookwork',
                sub: 'Chain-Stitch Floral Vines',
                desc: 'Continuous interlocking chain-stitches applied using a notched awl hook, outlining wild Himalayan foliage.',
                origin: 'Charar-i-Sharief & Budgam',
              },
              {
                title: 'Kani Weave',
                sub: 'Wooden Bobbin Handloom',
                desc: 'Guided by coded poetic Talim scripts, tiny eyeless walnut bobbins interlock colors directly across the warp.',
                origin: 'Kanihama Weavers Colony',
              },
              {
                title: 'Changthangi Pashmina',
                sub: '14.5-Micron Pure Underfleece',
                desc: 'Combed gently from high-altitude goats living at 14,000 feet, spun on wooden charkhas without harsh chemicals.',
                origin: 'Changthang & Kashmir Valley',
              },
            ].map((c, i) => (
              <div
                key={i}
                className="p-5 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#176B68]">
                    0{i + 1}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#17233B]">{c.title}</h4>
                  <span className="text-[10px] font-semibold text-[#704B32] block">{c.sub}</span>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">{c.desc}</p>
                </div>
                <div className="pt-3 border-t border-stone-200 text-[10px] text-stone-500">
                  Origin: <strong className="text-[#17233B]">{c.origin}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Try with SI Interactive Concierge Feature Spotlight ─────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#17233B] via-[#102334] to-[#176B68] rounded-3xl p-8 sm:p-14 text-white shadow-2xl space-y-8 border border-[#C9A45C]/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#C9A45C] text-[#17233B] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                <span>✨</span> TRY WITH SI — STYLING &amp; DRAPE CONCIERGE
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Not sure how a Pheran or Pashmina looks on you?
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 font-light leading-relaxed max-w-2xl">
                SI helps you discover the perfect silhouette: pick your occasion (wedding, travel, daily), style preferences, and height. SI simulates the drape, recommends matching stoles, and guides sizing.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenTryWithSi()}
                  className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Launch SI Styling Studio →
                </button>
                <Link
                  href="/crafts/pherans"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-colors"
                >
                  Browse Ready Pherans
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-3 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                SI Styling Capabilities:
              </span>
              <div className="space-y-2 text-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Harmonious Shawl &amp; Pheran Pairing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Temperature &amp; Sub-Zero Destination Advice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Roomy Silhouette vs. Slim Fit Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Direct 1-Click Addition to Shopping Bag</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Immediate Revenue: Boutique Wholesale Swatch Box ─────────────────── */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CraftsSwatchAndConsignmentDesk />
      </section>

      {/* ── Sourcing Request Engine ────────────────────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SourcingRequestBanner
          vertical="crafts"
          contextText="Looking for bespoke GI-tagged Kani Pashmina shawls, boutique hotel wool throws, export-grade silk rugs, or bulk festive pherans?"
        />
      </section>

      {/* ── Modals: Quick Add, Size Guide, 3D Garment Inspector, Try With SI ──── */}
      <QuickAddModal
        product={selectedProductForQuickAdd}
        isOpen={Boolean(selectedProductForQuickAdd)}
        onClose={() => setSelectedProductForQuickAdd(null)}
        onOpenSizeGuide={() => {
          setSelectedProductForQuickAdd(null)
          setSizeGuideOpen(true)
        }}
      />

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      <GarmentViewer3DModal
        product={selectedProductFor3D}
        isOpen={Boolean(selectedProductFor3D)}
        onClose={() => setSelectedProductFor3D(null)}
        onAddToCart={(p) => {
          setSelectedProductFor3D(null)
          setSelectedProductForQuickAdd(p)
        }}
      />

      <TryWithSIModal
        isOpen={siModalOpen}
        onClose={() => setSiModalOpen(false)}
        initialProduct={
          activeSiProduct
            ? CRAFT_PRODUCTS.find((p) => p.slug === activeSiProduct.slug)
            : undefined
        }
      />

      <DemandCaptureModal
        isOpen={b2bQuoteOpen}
        onClose={() => setB2bQuoteOpen(false)}
        defaultVertical="crafts"
        title="Wholesale & Export Craft Procurement"
        subtitle="Direct sourcing from certified Kashmiri master artisans and handloom cooperatives. We structure minimum order quantities, GI authenticity documents, and insured international air freight."
      />
    </main>
  )
}
