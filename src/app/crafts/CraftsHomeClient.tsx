'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CLOTHING_PRODUCTS,
  ClothingProduct,
  AllIndiaRegion,
} from '@/lib/clothing-data'
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

// All-India Handcrafted Clothing Category Tiles
const ALL_INDIA_CATEGORY_TILES = [
  {
    slug: 'sherwanis-coats',
    label: 'Sherwanis & Coats',
    sub: 'Banarasi Katan · Nehru Coats',
    image: '/images/weddings/hero-palace.jpg',
    href: '#catalog',
  },
  {
    slug: 'kurtas-tunics',
    label: 'Royal Kurtas & Tunics',
    sub: 'Lucknowi Chikankari · Patola · Kasavu',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    href: '#catalog',
  },
  {
    slug: 'sarees-drapes',
    label: 'Heritage Sarees & Drapes',
    sub: 'Patan Double Ikat · Kanchipuram Brocade',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    href: '#catalog',
  },
  {
    slug: 'handblock-angrakhas',
    label: 'Handblock & Angrakhas',
    sub: 'Kutch Ajrakh · Sanganeri Chanderi',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    href: '#catalog',
  },
  {
    slug: 'shawls-stoles',
    label: 'Heirloom Shawls & Wraps',
    sub: 'Kashmiri GI Pashmina · Kani Jamawar',
    image: '/images/crafts-shawls.jpg',
    href: '/crafts/shawls-stoles',
  },
  {
    slug: 'jackets-coats',
    label: 'Artisan Vests & Jackets',
    sub: 'Rabari Mirrorwork · Nagaland Ao Weaves',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    href: '/crafts/jackets-coats',
  },
]

export interface StateCorridor {
  id: string
  name: string
  title: string
  subtitle: string
  icon: string
  region: string
  giCert: string
  guild: string
  antiquity: string
  craftsList: string
  match: (p: ClothingProduct) => boolean
}

export const STATE_CORRIDORS: StateCorridor[] = [
  {
    id: 'gujarat',
    name: 'Gujarat',
    title: 'Gujarat Heritage Corridor',
    subtitle: 'Royal Solanki Double Ikat & Great Rann Indigo Vats',
    icon: '🦁',
    region: 'Western India · Patan, Dhamadka & Bhuj',
    giCert: 'GI-IN-GUJ-PATOLA-0044 · GI-IN-GUJ-AJRAKH-0312',
    guild: 'Salvi Family Guild & Khatri Dhamadka Collective',
    antiquity: '900+ Years Royal Solanki Heritage',
    craftsList: 'Patan Patola Double Ikat · Kutch Ajrakh Handblock · Rabari Mirrorwork · Bandhani',
    match: (p) => p.state === 'Gujarat',
  },
  {
    id: 'up',
    name: 'Uttar Pradesh',
    title: 'Uttar Pradesh Heritage Corridor',
    subtitle: 'Kashi Imperial Silk Brocades & Awadh Court Shadow Work',
    icon: '🏛️',
    region: 'Gangetic Plains · Varanasi & Lucknow',
    giCert: 'GI-IN-UP-BANARAS-0099 · GI-IN-UP-CHIKANKARI-0119',
    guild: 'Ansari Master Weavers & Begum Akhtar Memorial Guild',
    antiquity: '600+ Years Imperial Nawabi Looms',
    craftsList: 'Banarasi Katan Silk Brocade · Lucknowi Chikankari & Mukaish · Kashi Stoles',
    match: (p) => p.state === 'Uttar Pradesh',
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    title: 'Rajasthan Heritage Corridor',
    subtitle: 'Thar Desert River-Washed Block Prints & Gossamer Khats',
    icon: '🏰',
    region: 'Desert & West · Jaipur, Bagru & Kota',
    giCert: 'GI-IN-RJ-KOTA-0038 · GI-IN-RJ-BAGRU-0210',
    guild: 'Kaithun Ansari Weavers & Chippa Blockprinters',
    antiquity: '500+ Years Vedic Pit Looms',
    craftsList: 'Sanganeri Handblock · Kota Doria Real Zari Handloom · Bagru Dabu Indigo',
    match: (p) => p.state === 'Rajasthan',
  },
  {
    id: 'south',
    name: 'Tamil Nadu & South',
    title: 'Tamil Nadu & South Heritage Corridor',
    subtitle: 'Sacred Temple Border Weaves, Telia Rumaal & Gold Zari',
    icon: '🦚',
    region: 'Southern Peninsular · Kanchipuram, Chettinad & Travancore',
    giCert: 'GI-IN-TN-KANCHIPURAM-0002 · GI-IN-TG-POCHAMPALLY-0004',
    guild: 'Kanchipuram Murugan Society & Balaramapuram Co-op',
    antiquity: '400+ Years Sacred Weaver Guilds',
    craftsList: 'Kanchipuram Pure Silk Korvai · Chettinad Kandangi · Kasavu Gold Zari · Pochampally Double Ikat',
    match: (p) => ['Tamil Nadu', 'Kerala', 'Telangana', 'Andhra Pradesh'].includes(p.state || ''),
  },
  {
    id: 'east',
    name: 'West Bengal & Odisha',
    title: 'West Bengal & Odisha Heritage Corridor',
    subtitle: 'UNESCO Discontinuous Weft Muslin & Sacred Bandha Ikat',
    icon: '🌿',
    region: 'Eastern India · Phulia, Shantiniketan & Bargarh',
    giCert: 'GI-IN-WB-JAMDANI-0188 · GI-IN-WB-KANTHA-0142 · GI-IN-OD-SAMBALPUR-0078',
    guild: 'Phulia Weavers Co-op & Bargarh Meher Handloom Guild',
    antiquity: 'UNESCO Intangible Cultural Heritage',
    craftsList: 'Dhakai Jamdani Fine Muslin · Shantiniketan Nakshi Kantha · Sambalpuri Bandha Ikat',
    match: (p) => ['West Bengal', 'Odisha'].includes(p.state || ''),
  },
  {
    id: 'northeast',
    name: 'Assam & Nagaland',
    title: 'Assam & Nagaland Heritage Corridor',
    subtitle: 'Non-Violent Forest Peace Silk & Ancestral Backstrap Weaves',
    icon: '🧵',
    region: 'Northeast India · Brahmaputra Valley & Naga Hills',
    giCert: 'GI-IN-AS-ERISILK-0315 · GI-IN-NL-NAGA-0244',
    guild: 'Brahmaputra Peace Silk Guild & Naga Mother Association',
    antiquity: 'Ancient Indigenous Ahimsa Weaving',
    craftsList: 'Ahimsa Eri Peace Silk Handloom · Naga Ao Tribal Backstrap Loin Loom',
    match: (p) => ['Assam', 'Nagaland'].includes(p.state || ''),
  },
  {
    id: 'central',
    name: 'Madhya Pradesh & Punjab',
    title: 'Madhya Pradesh & Punjab Heritage Corridor',
    subtitle: 'Vedic Translucent Gossamer & Royal Phulkari Silk Floss',
    icon: '👑',
    region: 'Central & North · Chanderi, Maheshwar & Amritsar',
    giCert: 'GI-IN-MP-CHANDERI-0021 · GI-IN-MP-MAHESHWAR-0087 · GI-IN-PB-PHULKARI-0092',
    guild: 'Rehwa Society & Chanderi Master Weavers Guild',
    antiquity: 'Ahilyabai Holkar Royal Patronage',
    craftsList: 'Chanderi Handloom Tissue Silk · Maheshwari Reversible Zari · Amritsar Phulkari',
    match: (p) => ['Madhya Pradesh', 'Punjab'].includes(p.state || ''),
  },
  {
    id: 'kashmir',
    name: 'Jammu & Kashmir & Himalayas',
    title: 'Jammu & Kashmir & Himalayan Corridor',
    subtitle: 'Changthangi Micro-Fiber Pashmina & Imperial Court Pherans',
    icon: '🏔️',
    region: 'Himalayas & North · Srinagar, Zadibal, Kanihama & Kullu',
    giCert: 'GI-JK-PASHMINA-0046 · GI-JK-KANI-0071 · GI-IN-HP-KULLU-0012',
    guild: 'Mir Tilla Guild Zadibal & Kanihama Cooperative',
    antiquity: '700+ Years Mughal Imperial Looms',
    craftsList: 'Certified Changthangi Pashmina · Kani Jamawar · Royal Tilla & Aari Pherans · Pure Tweed · Kullu Wool',
    match: (p) => !p.state || p.state === 'Jammu & Kashmir' || p.state === 'Himachal Pradesh' || (p.provenance.origin || '').includes('Kashmir'),
  },
]

export const STATE_TABS = [
  { id: 'all', label: 'All India', count: 46, icon: '🇮🇳', stateValue: '' },
  { id: 'gujarat', label: 'Gujarat', count: 4, icon: '🦁', stateValue: 'Gujarat' },
  { id: 'up', label: 'Uttar Pradesh', count: 3, icon: '🏛️', stateValue: 'Uttar Pradesh' },
  { id: 'rajasthan', label: 'Rajasthan', count: 3, icon: '🏰', stateValue: 'Rajasthan' },
  { id: 'south', label: 'Tamil Nadu & South', count: 5, icon: '🦚', stateValue: 'Tamil Nadu & South' },
  { id: 'east', label: 'West Bengal & Odisha', count: 3, icon: '🌿', stateValue: 'West Bengal & Odisha' },
  { id: 'northeast', label: 'Assam & Nagaland', count: 2, icon: '🧵', stateValue: 'Assam & Nagaland' },
  { id: 'central', label: 'Madhya Pradesh & Punjab', count: 3, icon: '👑', stateValue: 'Madhya Pradesh & Punjab' },
  { id: 'kashmir', label: 'Jammu & Kashmir', count: 23, icon: '🏔️', stateValue: 'Jammu & Kashmir' },
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
  const [catalogViewMode, setCatalogViewMode] = useState<'corridors' | 'grid'>('corridors')
  const [activeCollection, setActiveCollection] = useState<string>('all')
  const [filterLatency, setFilterLatency] = useState<number>(0.8)
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

  // Pre-calculate products for each corridor
  const corridorsWithProducts = useMemo(() => {
    return STATE_CORRIDORS.map((corridor) => {
      const items = CLOTHING_PRODUCTS.filter(corridor.match)
      return {
        ...corridor,
        items,
        count: items.length,
      }
    })
  }, [])

  const displayedCorridors = useMemo(() => {
    if (!selectedState || selectedState === 'All States' || selectedState === 'All India') {
      return corridorsWithProducts
    }
    const s = selectedState.toLowerCase()
    return corridorsWithProducts.filter((c) => {
      const cName = c.name.toLowerCase()
      const cId = c.id.toLowerCase()
      if (s === 'kashmir' || s === 'jammu & kashmir') {
        return cId === 'kashmir'
      }
      if (s.includes('south') || s.includes('tamil nadu') || s.includes('kerala')) {
        return cId === 'south'
      }
      if (s.includes('bengal') || s.includes('odisha')) {
        return cId === 'east'
      }
      if (s.includes('assam') || s.includes('nagaland')) {
        return cId === 'northeast'
      }
      if (s.includes('madhya pradesh') || s.includes('punjab')) {
        return cId === 'central'
      }
      return cName.includes(s) || s.includes(cName)
    })
  }, [corridorsWithProducts, selectedState])

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
      const targetState = (filters.state || selectedState).toLowerCase()
      result = result.filter((p) => {
        const prodState = (p.state || 'Jammu & Kashmir').toLowerCase()
        const prodOrigin = (p.provenance.origin || '').toLowerCase()
        if (targetState === 'kashmir' || targetState === 'jammu & kashmir') {
          return prodState.includes('kashmir') || prodOrigin.includes('kashmir') || prodState.includes('himachal')
        }
        if (targetState.includes('tamil nadu') || targetState.includes('south') || targetState.includes('kerala')) {
          return ['tamil nadu', 'kerala', 'telangana', 'andhra pradesh'].includes(prodState)
        }
        if (targetState.includes('bengal') || targetState.includes('odisha')) {
          return ['west bengal', 'odisha'].includes(prodState)
        }
        if (targetState.includes('assam') || targetState.includes('nagaland')) {
          return ['assam', 'nagaland'].includes(prodState)
        }
        if (targetState.includes('madhya pradesh') || targetState.includes('punjab')) {
          return ['madhya pradesh', 'punjab'].includes(prodState)
        }
        return prodState.includes(targetState) || prodOrigin.includes(targetState)
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
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-stone-900 group">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full">
                  <Image
                    src="/images/weddings/hero-palace.jpg"
                    alt="Banarasi Katan Silk Brocade & Pan-India Heritage Couture"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-[#10192A]/30 to-transparent" />

                  {/* Overlaid Pan-India Regional Quick Chips */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider">
                      ✦ 15-State Couture Archive
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-[10px] font-mono font-bold">
                      ⚡ 0.9ms In-Memory
                    </span>
                  </div>

                  {/* Visual Craft Insets */}
                  <div className="absolute bottom-16 left-4 right-4 grid grid-cols-3 gap-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 shadow-md">
                      <Image
                        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
                        alt="Patan Patola Double Ikat"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="absolute bottom-1 left-1.5 text-[8px] font-bold text-white uppercase tracking-wider drop-shadow">
                        Gujarat Patola
                      </span>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 shadow-md">
                      <Image
                        src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"
                        alt="Lucknowi Chikankari"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="absolute bottom-1 left-1.5 text-[8px] font-bold text-white uppercase tracking-wider drop-shadow">
                        UP Chikankari
                      </span>
                    </div>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 shadow-md">
                      <Image
                        src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
                        alt="Kutch Ajrakh Indigo"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <span className="absolute bottom-1 left-1.5 text-[8px] font-bold text-white uppercase tracking-wider drop-shadow">
                        Kutch Ajrakh
                      </span>
                    </div>
                  </div>

                  {/* Bottom Text Pill */}
                  <div className="absolute bottom-3 left-4 right-4 bg-[#10192A]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A45C] block">
                        Direct From Master Weaver Guilds
                      </span>
                      <p className="text-[11px] text-stone-200 font-light leading-tight">
                        Banaras · Patan · Lucknow · Kutch · Kanchipuram · Bengal · Kashmir
                      </p>
                    </div>
                    <a
                      href="#catalog"
                      className="px-3 py-1.5 bg-[#C9A45C] hover:bg-amber-400 text-[#10192A] text-[10px] font-extrabold uppercase rounded-lg transition-colors flex-shrink-0"
                    >
                      View All →
                    </a>
                  </div>
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

      {/* ── 5. Main Product Catalog & Statewise Heritage Corridors Section ──── */}
      <section id="catalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        {/* Section Header with Telemetry & Quick Desk Actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#704B32] block">
                Pan-India Handcrafted Archive · 15 States
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                ⚡ {filterLatency.toFixed(1)}ms In-Memory
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B] tracking-tight">
              Statewise Products &amp; Master Artisan Corridors
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Explore 46 authenticated single-origin weaves grouped by state heritage ateliers. Each corridor features verifiable Government GI credentials, documented loom techniques, and direct weaver cooperative remuneration.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs font-bold text-[#176B68] hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#176B68]/10"
            >
              <span>📏</span>
              <span>Size Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setB2bQuoteOpen(true)}
              className="text-xs font-bold text-[#704B32] hover:underline flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#704B32]/10"
            >
              <span>🏛️</span>
              <span>B2B / Export Desk</span>
            </button>
          </div>
        </div>

        {/* ── Dynamic State Switcher Tabs Bar ───────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#704B32] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>📍</span> Select Indian State / Regional Guild:
            </span>
            {selectedState && (
              <button
                type="button"
                onClick={() => handleSelectState('')}
                className="text-[#176B68] hover:underline text-xs"
              >
                Reset to All India (46 Pieces)
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {STATE_TABS.map((tab) => {
              const isActive =
                tab.stateValue === ''
                  ? !selectedState || selectedState === 'All States' || selectedState === 'All India'
                  : selectedState.toLowerCase() === tab.stateValue.toLowerCase()
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectState(tab.stateValue)}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'bg-[#10192A] text-white border-[#C9A45C] shadow-md ring-2 ring-[#C9A45C]/30 scale-[1.02]'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive ? 'bg-[#C9A45C] text-[#10192A]' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── View Mode Switcher Toggle: State Corridors vs All-India Direct Grid */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Browse Experience:
            </span>
            <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => setCatalogViewMode('corridors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  catalogViewMode === 'corridors'
                    ? 'bg-[#10192A] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🏛️</span>
                <span>State Corridors</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-200 text-amber-900 font-extrabold uppercase">
                  Curated
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCatalogViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  catalogViewMode === 'grid'
                    ? 'bg-[#10192A] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>⚡</span>
                <span>All-India Fast Grid</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-200 text-emerald-900 font-extrabold uppercase">
                  In-Memory
                </span>
              </button>
            </div>
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-3">
            <span>
              Showing{' '}
              <strong className="text-[#17233B]">
                {catalogViewMode === 'corridors'
                  ? displayedCorridors.reduce((acc, c) => acc + c.count, 0)
                  : filteredProducts.length}
              </strong>{' '}
              pieces across{' '}
              <strong className="text-[#17233B]">
                {catalogViewMode === 'corridors' ? displayedCorridors.length : '15'}
              </strong>{' '}
              state ateliers
            </span>
          </div>
        </div>

        {/* ── VIEW MODE 1: STATE HERITAGE CORRIDORS ─────────────────────────── */}
        {catalogViewMode === 'corridors' && (
          <div className="space-y-12 pt-2">
            {displayedCorridors.map((corridor) => (
              <div
                key={corridor.id}
                id={`corridor-${corridor.id}`}
                className="space-y-6 scroll-mt-28 bg-[#FAF6EE] rounded-3xl"
              >
                {/* State Corridor Header Banner */}
                <div className="bg-gradient-to-r from-[#10192A] via-[#17233B] to-[#10192A] text-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/30 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A45C]/5 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-2xl">{corridor.icon}</span>
                        <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#C9A45C] bg-white/10 px-3 py-1 rounded-full border border-white/15">
                          {corridor.region}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-400/30">
                          {corridor.count} Masterpieces
                        </span>
                        <span className="text-[10px] text-stone-300 font-semibold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                          ⏱️ {corridor.antiquity}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {corridor.title}
                        </h3>
                        <p className="font-serif italic text-sm sm:text-base text-stone-300 mt-1">
                          &ldquo;{corridor.subtitle}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-300 pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#C9A45C]">📜</span>
                          <span className="font-mono text-[11px] text-stone-200">{corridor.giCert}</span>
                        </div>
                        <div className="hidden sm:inline text-white/30">•</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#C9A45C]">🏛️</span>
                          <span className="text-stone-300 font-medium">{corridor.guild}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 font-light leading-relaxed">
                        <strong className="text-white font-medium">Craft Traditions:</strong> {corridor.craftsList}
                      </p>
                    </div>

                    {/* Action shortcuts */}
                    <div className="flex flex-row lg:flex-col items-stretch gap-2.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenTryWithSi(corridor.items[0])}
                        className="px-4 py-2.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>✨</span>
                        <span>Virtual Drape (SI)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCatalogViewMode('grid')
                          handleSelectState(corridor.name)
                        }}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors text-center"
                      >
                        Explore in Grid Mode →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Corridor Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {corridor.items.map((product) => (
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

                {/* Provenance Remuneration Seal */}
                <div className="flex items-center justify-between px-4 py-2 bg-stone-100 rounded-xl text-[11px] text-stone-600 border border-stone-200/80">
                  <span className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">✓ 68% Remuneration Guarantee:</span>
                    Direct cooperative settlement to {corridor.guild}.
                  </span>
                  <span className="font-mono text-stone-500 font-medium hidden sm:inline">
                    Pan-India Insured Express Air
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── VIEW MODE 2: ALL-INDIA DIRECT IN-MEMORY GRID ──────────────────── */}
        {catalogViewMode === 'grid' && (
          <div className="space-y-6">
            {/* Filter and Sort Toolbar with Telemetry */}
            <ClothingFilterBar
              filters={filters}
              onFilterChange={setFilters}
              totalCount={filteredProducts.length}
              availableSubcategories={currentSubcategories}
              filterLatencyMs={filterLatency}
            />

            {/* 4-Column Product Grid */}
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
                  Try resetting your state, craft, or search query to browse our 46 Pan-India pieces.
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
