'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  CLOTHING_PRODUCTS,
  ClothingProduct,
  AVAILABLE_COLOURS,
  AVAILABLE_MATERIALS,
  AVAILABLE_CRAFTS,
  AVAILABLE_OCCASIONS,
  ALL_INDIA_STATES,
} from '@/lib/clothing-data'
import ClothingProductCard from '@/components/crafts/ClothingProductCard'
import QuickAddModal from '@/components/crafts/QuickAddModal'
import SizeGuideModal from '@/components/crafts/SizeGuideModal'
import GarmentViewer3DModal from '@/components/crafts/GarmentViewer3DModal'
import TryWithSIModal from '@/components/crafts/TryWithSIModal'
import ArtisanPassportModal from '@/components/crafts/ArtisanPassportModal'
import ExpressBuyModal from '@/components/crafts/ExpressBuyModal'
import DemandCaptureModal from '@/components/demand/DemandCaptureModal'
import SourcingRequestBanner from '@/components/demand/SourcingRequestBanner'
import CraftsSwatchAndConsignmentDesk from '@/components/crafts/CraftsSwatchAndConsignmentDesk'

// ── Top Shoppable Story Avatars (Myntra Studio / Lookbook Circles) ──────────────
const FASHION_STORIES = [
  { id: 'all', name: 'All India', count: 46, image: 'https://plus.unsplash.com/premium_photo-1682090778813-3938ba76ee57?w=800&auto=format&fit=crop&q=80', icon: '🇮🇳', state: '' },
  { id: 'gujarat', name: 'Gujarat Patola', count: 4, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80', icon: '🦁', state: 'Gujarat' },
  { id: 'kashi', name: 'Kashi Brocade', count: 3, image: 'https://plus.unsplash.com/premium_photo-1681483544221-e04d719060ff?w=800&auto=format&fit=crop&q=80', icon: '🏛️', state: 'Uttar Pradesh' },
  { id: 'kashmir', name: 'Kashmir Pashmina', count: 23, image: '/images/crafts-shawls.jpg', icon: '🏔️', state: 'Jammu & Kashmir' },
  { id: 'kanchi', name: 'Kanchipuram Silk', count: 5, image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80', icon: '🦚', state: 'Tamil Nadu' },
  { id: 'thar', name: 'Thar Handblock', count: 3, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', icon: '🏰', state: 'Rajasthan' },
  { id: 'bengal', name: 'Bengal Jamdani', count: 3, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80', icon: '🌿', state: 'West Bengal' },
  { id: 'assam', name: 'Assam Peace Silk', count: 2, image: 'https://images.unsplash.com/flagged/photo-1551854716-8b811be39e7e?w=800&auto=format&fit=crop&q=80', icon: '🧵', state: 'Assam' },
  { id: 'chanderi', name: 'Chanderi Zari', count: 3, image: 'https://images.unsplash.com/photo-1610189012906-4c0aa9b9781e?w=800&auto=format&fit=crop&q=80', icon: '👑', state: 'Madhya Pradesh' },
  { id: 'si', name: '58 Models Studio', count: '58', image: 'https://images.unsplash.com/photo-1727430228383-aa1fb59db8bf?w=800&auto=format&fit=crop&q=80', icon: '✨', action: 'try-si' },
]

// ── Categories List for Faceted Filter ──────────────────────────────────────────
const FACET_CATEGORIES = [
  { id: 'kurtas', label: 'Kurtas & Tunics', query: 'Kurta' },
  { id: 'jackets', label: 'Jackets & Coats', query: 'Jacket' },
  { id: 'shawls', label: 'Heirloom Shawls & Stoles', query: 'Shawl' },
  { id: 'pherans', label: 'Kashmir Pherans', query: 'Pheran' },
  { id: 'sarees', label: 'Heritage Sarees & Drapes', query: 'Saree' },
  { id: 'sherwanis', label: 'Sherwanis & Nehru Vests', query: 'Sherwani' },
  { id: 'accessories', label: 'Artisan Accessories', query: 'Accessories' },
]

export default function CraftsHomeClient() {
  // ── State for Modals & DeepTech Overlays ──────────────────────────────────────
  const [selectedProductForQuickAdd, setSelectedProductForQuickAdd] = useState<ClothingProduct | null>(null)
  const [selectedProductFor3D, setSelectedProductFor3D] = useState<ClothingProduct | null>(null)
  const [selectedProductForPassport, setSelectedProductForPassport] = useState<ClothingProduct | null>(null)
  const [selectedProductForExpressBuy, setSelectedProductForExpressBuy] = useState<ClothingProduct | null>(null)
  const [siModalOpen, setSiModalOpen] = useState(false)
  const [b2bQuoteOpen, setB2bQuoteOpen] = useState(false)
  const [activeSiProduct, setActiveSiProduct] = useState<ClothingProduct | undefined>(undefined)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // ── Myntra Faceted Filters State ─────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGender, setSelectedGender] = useState<string>('all')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('')
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [giOnly, setGiOnly] = useState<boolean>(false)
  const [minDiscount, setMinDiscount] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>('recommended')
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [stateSearchText, setStateSearchText] = useState('')
  const [craftSearchText, setCraftSearchText] = useState('')
  const [filterLatency, setFilterLatency] = useState<number>(0.8)

  // Total active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedGender !== 'all') count++
    count += selectedCategories.length
    count += selectedStates.length
    count += selectedCrafts.length
    if (selectedPriceRange) count++
    count += selectedColors.length
    count += selectedMaterials.length
    count += selectedOccasions.length
    if (giOnly) count++
    if (minDiscount > 0) count++
    if (searchQuery.trim()) count++
    return count
  }, [
    selectedGender,
    selectedCategories,
    selectedStates,
    selectedCrafts,
    selectedPriceRange,
    selectedColors,
    selectedMaterials,
    selectedOccasions,
    giOnly,
    minDiscount,
    searchQuery,
  ])

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setSearchQuery('')
    setSelectedGender('all')
    setSelectedCategories([])
    setSelectedStates([])
    setSelectedCrafts([])
    setSelectedPriceRange('')
    setSelectedColors([])
    setSelectedMaterials([])
    setSelectedOccasions([])
    setGiOnly(false)
    setMinDiscount(0)
    setSortBy('recommended')
  }

  // Toggle helpers for multi-select
  const toggleItem = (list: string[], item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  // ── High-Speed In-Memory Filtering (<0.8ms) ──────────────────────────────────
  const filteredProducts = useMemo(() => {
    const startTime = performance.now()
    let result = [...CLOTHING_PRODUCTS]

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.craft.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          (p.state && p.state.toLowerCase().includes(q)) ||
          p.subCategory.toLowerCase().includes(q) ||
          p.provenance.artisanGroup.toLowerCase().includes(q)
      )
    }

    // 2. Gender
    if (selectedGender !== 'all') {
      result = result.filter((p) => p.gender === selectedGender || p.gender === 'unisex')
    }

    // 3. Categories (Multi-select)
    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const pCat = (p.categoryLabel || p.subCategory || '').toLowerCase()
        return selectedCategories.some((c) => pCat.includes(c.toLowerCase()) || p.name.toLowerCase().includes(c.toLowerCase()))
      })
    }

    // 4. States (Multi-select)
    if (selectedStates.length > 0) {
      result = result.filter((p) => {
        const pState = (p.state || 'Jammu & Kashmir').toLowerCase()
        const pOrigin = (p.provenance.origin || '').toLowerCase()
        return selectedStates.some((st) => {
          const s = st.toLowerCase()
          if (s === 'kashmir' || s === 'jammu & kashmir') {
            return pState.includes('kashmir') || pOrigin.includes('kashmir') || pState.includes('himachal')
          }
          return pState === s || pOrigin.includes(s)
        })
      })
    }

    // 5. Crafts (Multi-select)
    if (selectedCrafts.length > 0) {
      result = result.filter((p) => {
        const pCraft = p.craft.toLowerCase()
        return selectedCrafts.some((cr) => pCraft.includes(cr.toLowerCase()))
      })
    }

    // 6. Price Range
    if (selectedPriceRange) {
      if (selectedPriceRange === 'under-10k') {
        result = result.filter((p) => p.price < 10000)
      } else if (selectedPriceRange === '10k-25k') {
        result = result.filter((p) => p.price >= 10000 && p.price <= 25000)
      } else if (selectedPriceRange === '25k-50k') {
        result = result.filter((p) => p.price > 25000 && p.price <= 50000)
      } else if (selectedPriceRange === 'above-50k') {
        result = result.filter((p) => p.price > 50000)
      }
    }

    // 7. Colors (Multi-select)
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colorOptions.some((co) => selectedColors.some((c) => co.name.toLowerCase().includes(c.toLowerCase())))
      )
    }

    // 8. Materials (Multi-select)
    if (selectedMaterials.length > 0) {
      result = result.filter((p) => {
        const pMat = p.material.toLowerCase()
        return selectedMaterials.some((m) => pMat.includes(m.toLowerCase()))
      })
    }

    // 9. Occasions (Multi-select)
    if (selectedOccasions.length > 0) {
      result = result.filter((p) => selectedOccasions.includes(p.occasion))
    }

    // 10. GI Certified Only
    if (giOnly) {
      result = result.filter((p) => p.provenance.giTagCertified)
    }

    // 11. Discount
    if (minDiscount > 0) {
      result = result.filter((p) => {
        const disc = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0
        return disc >= minDiscount
      })
    }

    // 12. Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    } else if (sortBy === 'bestselling') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'loom-hours') {
      result.sort(
        (a, b) =>
          (b.loomHours || b.provenance.artisanHours || 0) -
          (a.loomHours || a.provenance.artisanHours || 0)
      )
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = a.mrp > a.price ? (a.mrp - a.price) / a.mrp : 0
        const discB = b.mrp > b.price ? (b.mrp - b.price) / b.mrp : 0
        return discB - discA
      })
    } else if (sortBy === 'rating') {
      result.sort((a, b) => {
        const ratingA = a.reviews?.length ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 4.9
        const ratingB = b.reviews?.length ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 4.9
        return ratingB - ratingA
      })
    }

    const duration = performance.now() - startTime
    setFilterLatency(Math.max(0.4, parseFloat(duration.toFixed(2))))

    return result
  }, [
    searchQuery,
    selectedGender,
    selectedCategories,
    selectedStates,
    selectedCrafts,
    selectedPriceRange,
    selectedColors,
    selectedMaterials,
    selectedOccasions,
    giOnly,
    minDiscount,
    sortBy,
  ])

  // Filtered lists for sidebar searches
  const filteredStatesList = useMemo(() => {
    const list = ALL_INDIA_STATES.filter((st) => st !== 'All States')
    if (!stateSearchText.trim()) return list
    return list.filter((st) => st.toLowerCase().includes(stateSearchText.toLowerCase()))
  }, [stateSearchText])

  const filteredCraftsList = useMemo(() => {
    const list = AVAILABLE_CRAFTS.filter((cr) => cr !== 'All Crafts')
    if (!craftSearchText.trim()) return list.slice(0, 16)
    return list.filter((cr) => cr.toLowerCase().includes(craftSearchText.toLowerCase()))
  }, [craftSearchText])

  const handleOpenTryWithSi = (product?: ClothingProduct) => {
    setActiveSiProduct(product)
    setSiModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#F5F5F6] text-[#282C3F] font-sans">
      {/* ── Global Modals & Overlays ─────────────────────────────────────────── */}
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

      {/* ── 1. Shoppable Story Avatars (Myntra Studio / Lookbook Circles) ─────── */}
      <section className="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-5 overflow-x-auto pb-1 scrollbar-none">
            {FASHION_STORIES.map((story) => {
              const isSelected = story.state ? selectedStates.includes(story.state) : selectedStates.length === 0 && !giOnly
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => {
                    if (story.action === 'try-si') {
                      handleOpenTryWithSi()
                    } else if (story.state) {
                      setSelectedStates([story.state])
                    } else {
                      setSelectedStates([])
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group cursor-pointer"
                >
                  <div
                    className={`relative w-15 h-15 sm:w-16 sm:h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-[#FF3E6C] via-[#F16521] to-[#C9A45C] shadow-md'
                        : 'bg-gradient-to-tr from-stone-200 via-stone-300 to-stone-200 group-hover:from-[#C9A45C] group-hover:to-[#176B68]'
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white p-0.5">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    {story.count && (
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#10192A] text-white text-[9px] font-mono font-bold shadow-xs border border-white">
                        {story.count}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] font-medium tracking-tight text-center max-w-[70px] truncate ${
                    isSelected ? 'font-bold text-[#FF3E6C]' : 'text-stone-700'
                  }`}>
                    {story.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Core E-Commerce Two-Column PLP (Product Listing Page) ─────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Breadcrumbs & Catalog Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
          <div>
            <nav className="text-[11px] text-stone-500 flex items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-stone-800">Home</Link>
              <span>/</span>
              <Link href="/crafts" className="hover:text-stone-800">Clothing</Link>
              <span>/</span>
              <span className="text-stone-800 font-bold">Indian Handcrafted &amp; Ethnic Wear</span>
            </nav>
            <div className="flex items-baseline gap-2 mt-1">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#17233B] tracking-tight">
                Indian Handcrafted &amp; Ethnic Wear
              </h1>
              <span className="text-xs text-stone-500 font-medium font-mono">
                ({filteredProducts.length} items)
              </span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="flex items-center gap-2.5 text-xs self-start sm:self-auto flex-wrap">
            <button
              type="button"
              onClick={() => {
                setActiveSiProduct(undefined)
                setSiModalOpen(true)
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#17233B] to-[#176B68] text-white font-bold flex items-center gap-1.5 shadow-xs hover:opacity-95"
            >
              <span>✨</span>
              <span>58-Model Try-On Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-stone-600 hover:text-[#176B68] font-bold flex items-center gap-1 px-2 py-1"
            >
              <span>📏</span>
              <span>Size Guide</span>
            </button>
            <button
              type="button"
              onClick={() => setB2bQuoteOpen(true)}
              className="text-stone-600 hover:text-[#704B32] font-bold flex items-center gap-1 px-2 py-1"
            >
              <span>🏛️</span>
              <span>B2B / Export Desk</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips Strip */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none border-b border-stone-200 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mr-1 flex-shrink-0">
              Active:
            </span>

            {selectedGender !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 font-medium text-[11px]">
                Gender: {selectedGender}
                <button onClick={() => setSelectedGender('all')} className="hover:text-red-600 font-bold">✕</button>
              </span>
            )}

            {selectedStates.map((st) => (
              <span key={st} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-medium text-[11px]">
                📍 {st}
                <button onClick={() => toggleItem(selectedStates, st, setSelectedStates)} className="hover:text-red-600 font-bold">✕</button>
              </span>
            ))}

            {selectedCategories.map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 font-medium text-[11px]">
                {cat}
                <button onClick={() => toggleItem(selectedCategories, cat, setSelectedCategories)} className="hover:text-red-600 font-bold">✕</button>
              </span>
            ))}

            {selectedCrafts.map((cr) => (
              <span key={cr} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-medium text-[11px]">
                🧵 {cr}
                <button onClick={() => toggleItem(selectedCrafts, cr, setSelectedCrafts)} className="hover:text-red-600 font-bold">✕</button>
              </span>
            ))}

            {selectedPriceRange && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 font-medium text-[11px]">
                Price: {selectedPriceRange}
                <button onClick={() => setSelectedPriceRange('')} className="hover:text-red-600 font-bold">✕</button>
              </span>
            )}

            {giOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 font-bold text-[11px]">
                📜 GI Tag Certified
                <button onClick={() => setGiOnly(false)} className="hover:text-red-600 font-bold">✕</button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200 text-stone-800 font-medium text-[11px]">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')} className="hover:text-red-600 font-bold">✕</button>
              </span>
            )}

            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-[#FF3E6C] font-bold text-xs uppercase tracking-wider hover:underline ml-2 flex-shrink-0"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── Two-Column Layout ─────────────────────────────────────────────── */}
        <div className="flex gap-7 items-start pt-5">
          {/* ── LEFT COLUMN: MYNTRA FACETED FILTER SIDEBAR (Desktop) ─────────── */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 space-y-5 scrollbar-thin bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            {/* Sidebar Title */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="font-extrabold text-xs uppercase tracking-wider text-stone-900">
                FILTERS {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </span>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="text-xs font-bold text-[#FF3E6C] uppercase tracking-wider hover:underline"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* Quick Catalog Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search craft, fabric, style..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#17233B]"
              />
              <span className="absolute left-2.5 top-2 text-stone-400 text-xs">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1.5 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Section 1: GENDER */}
            <div className="space-y-2 pb-4 border-b border-stone-200 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                Gender
              </span>
              <div className="space-y-1.5">
                {[
                  { id: 'all', label: 'All', count: CLOTHING_PRODUCTS.length },
                  { id: 'women', label: 'Women', count: CLOTHING_PRODUCTS.filter((p) => p.gender === 'women').length },
                  { id: 'men', label: 'Men', count: CLOTHING_PRODUCTS.filter((p) => p.gender === 'men').length },
                  { id: 'unisex', label: 'Unisex', count: CLOTHING_PRODUCTS.filter((p) => p.gender === 'unisex').length },
                ].map((g) => (
                  <label key={g.id} className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedGender === g.id}
                        onChange={() => setSelectedGender(g.id)}
                        className="accent-[#17233B]"
                      />
                      <span className={selectedGender === g.id ? 'font-bold text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}>
                        {g.label}
                      </span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">({g.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 2: CATEGORIES */}
            <div className="space-y-2 pb-4 border-b border-stone-200 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                Categories
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {FACET_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.query)
                  const count = CLOTHING_PRODUCTS.filter((p) => {
                    const pCat = (p.categoryLabel || p.subCategory || '').toLowerCase()
                    return pCat.includes(cat.query.toLowerCase()) || p.name.toLowerCase().includes(cat.query.toLowerCase())
                  }).length
                  return (
                    <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(selectedCategories, cat.query, setSelectedCategories)}
                          className="accent-[#17233B] rounded"
                        />
                        <span className={isChecked ? 'font-bold text-stone-900' : 'text-stone-600 group-hover:text-stone-900 truncate max-w-[150px]'}>
                          {cat.label}
                        </span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">({count})</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Section 3: STATE / WEAVER CLUSTER */}
            <div className="space-y-2 pb-4 border-b border-stone-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
                  State / Artisan Cluster
                </span>
                {selectedStates.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedStates([])}
                    className="text-[10px] text-[#FF3E6C] font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* State Search Input */}
              <input
                type="text"
                value={stateSearchText}
                onChange={(e) => setStateSearchText(e.target.value)}
                placeholder="Search State..."
                className="w-full px-2 py-1 text-[11px] rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 mb-1"
              />

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {filteredStatesList.map((st) => {
                  const isChecked = selectedStates.includes(st)
                  const count = CLOTHING_PRODUCTS.filter((p) => {
                    const pState = (p.state || 'Jammu & Kashmir').toLowerCase()
                    const s = st.toLowerCase()
                    if (s === 'jammu & kashmir') {
                      return pState.includes('kashmir') || p.provenance.origin.toLowerCase().includes('kashmir')
                    }
                    return pState === s
                  }).length

                  return (
                    <label key={st} className="flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(selectedStates, st, setSelectedStates)}
                          className="accent-[#17233B] rounded"
                        />
                        <span className={isChecked ? 'font-bold text-stone-900' : 'text-stone-600 group-hover:text-stone-900 truncate max-w-[150px]'}>
                          {st}
                        </span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">({count})</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Section 4: CRAFT TECHNIQUE */}
            <div className="space-y-2 pb-4 border-b border-stone-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
                  Craft &amp; Technique
                </span>
                {selectedCrafts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCrafts([])}
                    className="text-[10px] text-[#FF3E6C] font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Craft search */}
              <input
                type="text"
                value={craftSearchText}
                onChange={(e) => setCraftSearchText(e.target.value)}
                placeholder="Search Craft..."
                className="w-full px-2 py-1 text-[11px] rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 mb-1"
              />

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {filteredCraftsList.map((cr) => {
                  const isChecked = selectedCrafts.includes(cr)
                  const count = CLOTHING_PRODUCTS.filter((p) => p.craft.toLowerCase().includes(cr.toLowerCase())).length
                  if (count === 0 && !craftSearchText) return null

                  return (
                    <label key={cr} className="flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(selectedCrafts, cr, setSelectedCrafts)}
                          className="accent-[#17233B] rounded"
                        />
                        <span className={isChecked ? 'font-bold text-stone-900' : 'text-stone-600 group-hover:text-stone-900 truncate max-w-[150px]'}>
                          {cr}
                        </span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">({count})</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Section 5: PRICE BUCKETS */}
            <div className="space-y-2 pb-4 border-b border-stone-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px]">
                  Price Range
                </span>
                {selectedPriceRange && (
                  <button
                    type="button"
                    onClick={() => setSelectedPriceRange('')}
                    className="text-[10px] text-[#FF3E6C] font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'under-10k', label: 'Under ₹10,000', count: CLOTHING_PRODUCTS.filter((p) => p.price < 10000).length },
                  { id: '10k-25k', label: '₹10,000 - ₹25,000', count: CLOTHING_PRODUCTS.filter((p) => p.price >= 10000 && p.price <= 25000).length },
                  { id: '25k-50k', label: '₹25,000 - ₹50,000', count: CLOTHING_PRODUCTS.filter((p) => p.price > 25000 && p.price <= 50000).length },
                  { id: 'above-50k', label: 'Above ₹50,000', count: CLOTHING_PRODUCTS.filter((p) => p.price > 50000).length },
                ].map((pr) => (
                  <label key={pr.id} className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === pr.id}
                        onChange={() => setSelectedPriceRange(pr.id)}
                        className="accent-[#17233B]"
                      />
                      <span className={selectedPriceRange === pr.id ? 'font-bold text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}>
                        {pr.label}
                      </span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">({pr.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Section 6: GI CERTIFIED ONLY */}
            <div className="pb-4 border-b border-stone-200 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={giOnly}
                    onChange={(e) => setGiOnly(e.target.checked)}
                    className="accent-amber-600 rounded"
                  />
                  <span className="font-bold text-amber-950 text-xs">
                    📜 GI Tag Certified Only
                  </span>
                </span>
                <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-200 px-1.5 py-0.2 rounded-full">
                  {CLOTHING_PRODUCTS.filter((p) => p.provenance.giTagCertified).length}
                </span>
              </label>
            </div>

            {/* Section 7: COLOR SWATCHES */}
            <div className="space-y-2 pb-4 border-b border-stone-200 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                Color
              </span>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLOURS.map((col) => {
                  const isChecked = selectedColors.includes(col.name)
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleItem(selectedColors, col.name, setSelectedColors)}
                      title={col.name}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] transition-all ${
                        isChecked
                          ? 'border-[#17233B] bg-stone-100 font-bold'
                          : 'border-stone-200 hover:border-stone-400 text-stone-700'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Section 8: DISCOUNT RANGE */}
            <div className="space-y-2 pb-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-800 text-[11px] block">
                Discount Range
              </span>
              <div className="space-y-1.5">
                {[
                  { val: 10, label: '10% and above' },
                  { val: 20, label: '20% and above' },
                  { val: 30, label: '30% and above' },
                ].map((d) => (
                  <label key={d.val} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="discount"
                      checked={minDiscount === d.val}
                      onChange={() => setMinDiscount(minDiscount === d.val ? 0 : d.val)}
                      className="accent-[#17233B]"
                    />
                    <span className={minDiscount === d.val ? 'font-bold text-stone-900' : 'text-stone-600 group-hover:text-stone-900'}>
                      {d.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── RIGHT COLUMN: MAIN PRODUCT CATALOG (Myntra PLP) ──────────────── */}
          <section className="flex-1 min-w-0 space-y-4">
            {/* Top Toolbar: View Toggles & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-xs text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-1.5 bg-[#17233B] text-white rounded-lg font-bold text-xs uppercase flex items-center gap-1.5"
                >
                  <span>⚙️ Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#FF3E6C] text-white text-[10px]">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Grid Density Toggle (Desktop) */}
                <div className="hidden sm:flex items-center gap-1 border-r border-stone-200 pr-3">
                  <span className="text-stone-400 font-medium mr-1 text-[11px]">View:</span>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      gridCols === 4 ? 'bg-[#17233B] text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                    title="4 Columns Grid"
                  >
                    4 Cols
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      gridCols === 3 ? 'bg-[#17233B] text-white' : 'text-stone-600 hover:bg-stone-100'
                    }`}
                    title="3 Columns Grid"
                  >
                    3 Cols
                  </button>
                </div>

                <span className="text-stone-500 font-medium">
                  Showing <strong className="text-stone-900">{filteredProducts.length}</strong> of {CLOTHING_PRODUCTS.length} pieces
                </span>
              </div>

              {/* Sort By Dropdown (Myntra Style) */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-stone-500 font-bold uppercase text-[11px] whitespace-nowrap">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#17233B]"
                >
                  <option value="recommended">Recommended</option>
                  <option value="newest">What&apos;s New</option>
                  <option value="bestselling">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Better Discount</option>
                  <option value="loom-hours">Artisan Loom Hours</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* ── Myntra Fashion Products Grid ───────────────────────────────── */}
            {filteredProducts.length > 0 ? (
              <div
                className={`grid grid-cols-2 gap-3.5 sm:gap-5 ${
                  gridCols === 4 ? 'md:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-3'
                }`}
              >
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
              <div className="py-20 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-4 shadow-xs">
                <span className="text-4xl block">🔍</span>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  No garments match your selected filters
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  We couldn&apos;t find any pieces matching all your chosen criteria. Try clearing some filters or searching for another craft or state.
                </p>
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="px-6 py-2.5 bg-[#17233B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ── 4. Mobile Filter Bottom Drawer ───────────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="font-extrabold text-sm uppercase text-stone-900">
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </span>
              <div className="flex items-center gap-3">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="text-xs font-bold text-[#FF3E6C]"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase text-stone-800">Gender</span>
              <div className="flex gap-2">
                {['all', 'women', 'men', 'unisex'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`px-3 py-1.5 rounded-lg border text-xs capitalize font-bold ${
                      selectedGender === g ? 'bg-[#17233B] text-white border-[#17233B]' : 'bg-white text-stone-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* States */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase text-stone-800">States</span>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                {ALL_INDIA_STATES.filter((s) => s !== 'All States').map((st) => {
                  const isChecked = selectedStates.includes(st)
                  return (
                    <button
                      key={st}
                      onClick={() => toggleItem(selectedStates, st, setSelectedStates)}
                      className={`px-2.5 py-1 rounded-lg border text-xs ${
                        isChecked ? 'bg-[#17233B] text-white border-[#17233B] font-bold' : 'bg-white text-stone-700'
                      }`}
                    >
                      {st}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* GI Tag */}
            <div>
              <label className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <span className="font-bold text-amber-950">📜 GI Tag Certified Only</span>
                <input
                  type="checkbox"
                  checked={giOnly}
                  onChange={(e) => setGiOnly(e.target.checked)}
                  className="accent-amber-600"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-[#17233B] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Apply Filters ({filteredProducts.length} Items)
            </button>
          </div>
        </div>
      )}

      {/* ── 5. "With a Difference": Craft-to-Closet Transparent Economics ──────── */}
      <section className="py-16 bg-[#17233B] text-white border-y border-[#C9A45C]/30 mt-12">
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

      {/* ── 6. Swatch Desk & Bespoke Made-to-Measure ─────────────────────────── */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CraftsSwatchAndConsignmentDesk />
      </section>

      {/* ── 7. Demand Sourcing Banner ─────────────────────────────────────────── */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SourcingRequestBanner />
      </section>
    </main>
  )
}
