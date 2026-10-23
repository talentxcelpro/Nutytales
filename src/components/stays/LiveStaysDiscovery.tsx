'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  STAY_PROPERTIES,
  STAY_CATEGORIES,
  DISCOVERY_COLLECTIONS,
  StayProperty,
  StayCategory,
  DiscoveryCollection,
} from '@/lib/stays-data'
import PropertyCard from './PropertyCard'
import InteractiveMapView from './InteractiveMapView'
import PropertyFilterModal, { PropertyFilterState } from './PropertyFilterModal'
import AIConciergeModal from './AIConciergeModal'
import ServicesCatalogueSection from './ServicesCatalogueSection'
import SplitStaySection from './SplitStaySection'
import StaysHeroSearch from './StaysHeroSearch'
import { useStaysContext } from './StaysShell'

export default function LiveStaysDiscovery() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openAiConcierge } = useStaysContext()

  // ── Search State from URL Parameters ────────────────────────────────────────
  const urlDestination = searchParams.get('destination') || ''
  const urlCategory = (searchParams.get('category') as StayCategory) || 'all'
  const urlDiscovery = (searchParams.get('discovery') as DiscoveryCollection) || ''
  const urlCheckIn = searchParams.get('checkIn') || ''
  const urlCheckOut = searchParams.get('checkOut') || ''
  const urlGuests = parseInt(searchParams.get('guests') || '2', 10)

  // ── Local Active Filter & View Mode ─────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<StayCategory>(urlCategory)
  const [selectedDiscovery, setSelectedDiscovery] = useState<DiscoveryCollection | ''>(urlDiscovery)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'rating_desc'>('relevance')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // Advanced Filters State
  const [advancedFilters, setAdvancedFilters] = useState<PropertyFilterState>({
    minPrice: 0,
    maxPrice: 100000,
    maxTotalTripBudget: 0,
    bedrooms: 0,
    propertyType: '',
    instantBook: false,
    freeCancellation: false,
    verifiedHost: false,
    workFriendly: false,
    minRating: 0,
    amenities: [],
    accessibility: [],
  })

  // Synchronize state when URL changes
  useEffect(() => {
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory)
    }
    if (urlDiscovery && urlDiscovery !== selectedDiscovery) {
      setSelectedDiscovery(urlDiscovery)
    }
  }, [urlCategory, urlDiscovery])

  // Count active advanced filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (advancedFilters.minPrice > 0) count++
    if (advancedFilters.maxPrice < 100000) count++
    if (advancedFilters.maxTotalTripBudget > 0) count++
    if (advancedFilters.bedrooms > 0) count++
    if (advancedFilters.propertyType) count++
    if (advancedFilters.instantBook) count++
    if (advancedFilters.freeCancellation) count++
    if (advancedFilters.verifiedHost) count++
    if (advancedFilters.workFriendly) count++
    if (advancedFilters.minRating > 0) count++
    count += advancedFilters.amenities.length
    count += advancedFilters.accessibility.length
    return count
  }, [advancedFilters])

  // Calculate nights
  const nights = useMemo(() => {
    if (!urlCheckIn || !urlCheckOut) return 3
    const inDate = new Date(urlCheckIn)
    const outDate = new Date(urlCheckOut)
    const diff = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 3
  }, [urlCheckIn, urlCheckOut])

  // Filter & Sort Properties
  const filteredProperties = useMemo(() => {
    let list = STAY_PROPERTIES.filter((prop) => {
      // 1. Text Destination search
      if (urlDestination.trim()) {
        const q = urlDestination.toLowerCase()
        const match =
          prop.city.toLowerCase().includes(q) ||
          prop.state.toLowerCase().includes(q) ||
          prop.country.toLowerCase().includes(q) ||
          prop.hubZone.toLowerCase().includes(q) ||
          prop.name.toLowerCase().includes(q) ||
          prop.tagline.toLowerCase().includes(q)
        if (!match) return false
      }

      // 2. Category Filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          prop.category === selectedCategory ||
          prop.secondaryCategories.includes(selectedCategory)
        if (!matchesCategory) return false
      }

      // 3. Discovery Collection Filter
      if (selectedDiscovery) {
        if (!prop.discoveryCollections.includes(selectedDiscovery)) {
          return false
        }
      }

      // 4. Guests count
      if (urlGuests > 0 && prop.maxTotalGuests < urlGuests) {
        return false
      }

      // 5. Advanced Filters
      if (prop.estateBuyoutPrice < advancedFilters.minPrice) return false
      if (prop.estateBuyoutPrice > advancedFilters.maxPrice) return false
      if (advancedFilters.bedrooms > 0 && prop.bedrooms < advancedFilters.bedrooms) return false
      if (advancedFilters.propertyType && prop.propertyType !== advancedFilters.propertyType) return false
      if (advancedFilters.instantBook && !prop.instantBook) return false
      if (advancedFilters.freeCancellation && !prop.freeCancellation) return false
      if (advancedFilters.verifiedHost && !prop.host.verified) return false
      if (advancedFilters.workFriendly && (!prop.workFriendly || prop.wifiSpeedMbps < 100)) return false
      if (advancedFilters.minRating > 0 && prop.rating < advancedFilters.minRating) return false

      // Amenities
      if (advancedFilters.amenities.length > 0) {
        const allText = prop.propertyAmenities.join(' ').toLowerCase()
        const hasAll = advancedFilters.amenities.every((a) => allText.includes(a.toLowerCase()))
        if (!hasAll) return false
      }

      // Accessibility
      if (advancedFilters.accessibility.length > 0) {
        const allAccess = prop.accessibilityFeatures.join(' ').toLowerCase()
        const hasAll = advancedFilters.accessibility.every((a) => allAccess.includes(a.toLowerCase()))
        if (!hasAll) return false
      }

      return true
    })

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.estateBuyoutPrice - b.estateBuyoutPrice)
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.estateBuyoutPrice - a.estateBuyoutPrice)
    } else if (sortBy === 'rating_desc') {
      list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
    }

    return list
  }, [
    urlDestination,
    selectedCategory,
    selectedDiscovery,
    urlGuests,
    advancedFilters,
    sortBy,
  ])

  const handleCategorySelect = (catId: StayCategory) => {
    setSelectedCategory(catId)
    const params = new URLSearchParams(searchParams.toString())
    if (catId === 'all') params.delete('category')
    else params.set('category', catId)
    router.replace(`/stays?${params.toString()}#marketplace-results`, { scroll: false })
  }

  const handleDiscoverySelect = (discId: DiscoveryCollection | '') => {
    setSelectedDiscovery(discId)
    const params = new URLSearchParams(searchParams.toString())
    if (!discId) params.delete('discovery')
    else params.set('discovery', discId)
    router.replace(`/stays?${params.toString()}#marketplace-results`, { scroll: false })
  }

  const handleClearAll = () => {
    setSelectedCategory('all')
    setSelectedDiscovery('')
    setAdvancedFilters({
      minPrice: 0,
      maxPrice: 100000,
      maxTotalTripBudget: 0,
      bedrooms: 0,
      propertyType: '',
      instantBook: false,
      freeCancellation: false,
      verifiedHost: false,
      workFriendly: false,
      minRating: 0,
      amenities: [],
      accessibility: [],
    })
    router.replace('/stays#marketplace-results', { scroll: false })
  }

  return (
    <div className="space-y-12">
      {/* ── 1. Floating Hero Search Bar ───────────────────────────────────────── */}
      <StaysHeroSearch
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* ── 2. Primary Category Horizontal Carousel ──────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E7E2D9]">
        {STAY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#17233B] text-white shadow-xs'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-[#E7E2D9]'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── 3. Discovery Collections Secondary Strip ─────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Explore Curated Collections ({DISCOVERY_COLLECTIONS.length})
          </span>
          {selectedDiscovery && (
            <button
              type="button"
              onClick={() => handleDiscoverySelect('')}
              className="text-xs text-[#704B32] font-semibold hover:underline"
            >
              Show all collections
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {DISCOVERY_COLLECTIONS.map((disc) => {
            const isSelected = selectedDiscovery === disc.id
            return (
              <button
                key={disc.id}
                type="button"
                onClick={() => handleDiscoverySelect(isSelected ? '' : disc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 border ${
                  isSelected
                    ? 'bg-[#C9A45C] text-[#17233B] border-[#C9A45C] shadow-xs'
                    : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <span>{disc.icon}</span>
                <span>{disc.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 4. Discovery Control Toolbar (Result Count + Map/Grid + Sort) ─────── */}
      <div id="marketplace-results" className="scroll-mt-28 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D9] pb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
            {selectedDiscovery
              ? DISCOVERY_COLLECTIONS.find((d) => d.id === selectedDiscovery)?.title || 'Curated Stays'
              : selectedCategory !== 'all'
              ? STAY_CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Curated Stays'
              : 'Extraordinary Stays'}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Showing {filteredProperties.length} verified {filteredProperties.length === 1 ? 'property' : 'properties'}
            {urlDestination ? ` matching &ldquo;${urlDestination}&rdquo;` : ' across active hubs'} · Zero hidden booking fees
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active filters badge */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1 hover:bg-amber-200 transition-colors"
            >
              <span>Filters ({activeFiltersCount})</span>
              <span className="text-sm">×</span>
            </button>
          )}

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#E7E2D9] rounded-xl text-xs">
            <span className="text-stone-400 pl-1 text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-stone-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="relevance">Relevance</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          {/* View Toggle (Grid vs Map) */}
          <div className="flex bg-white p-1 rounded-xl border border-[#E7E2D9]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-[#17233B] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-black'
              }`}
              title="Grid View"
            >
              <span>▦</span>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                viewMode === 'map'
                  ? 'bg-[#17233B] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-black'
              }`}
              title="Interactive Map View"
            >
              <span>🗺️</span>
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. Main Results Canvas (Grid or Map) ──────────────────────────────── */}
      {filteredProperties.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E7E2D9] space-y-4">
          <span className="text-4xl block">🔍</span>
          <h3 className="font-serif text-xl font-bold text-[#17233B]">
            No verified stays match your current filters
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            We only display real residences with verified availability. Try clearing some filters, adjusting your dates, or asking our AI Concierge for tailored alternatives.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-5 py-2.5 bg-[#17233B] text-white font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => openAiConcierge(`I was looking for ${urlDestination || 'a stay'} with specific requirements. Suggest best alternatives.`)}
              className="px-5 py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs rounded-xl"
            >
              Ask AI Concierge for Options →
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              nights={nights}
              checkIn={urlCheckIn}
              checkOut={urlCheckOut}
              guests={urlGuests}
            />
          ))}
        </div>
      ) : (
        <InteractiveMapView properties={filteredProperties} nights={nights} />
      )}

      {/* ── 6. In-Stay Travel Services Catalogue ─────────────────────────────── */}
      <ServicesCatalogueSection />

      {/* ── 7. Split-Stay Multi-Property Journeys ────────────────────────────── */}
      <SplitStaySection />

      {/* ── 8. Trust & Safety Marketplace Guarantee ─────────────────────────── */}
      <div className="p-8 sm:p-10 bg-gradient-to-br from-[#17233B] to-[#1E3048] rounded-3xl text-white shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 border border-[#C9A45C]/30">
        <div className="space-y-1">
          <div className="text-2xl mb-1">🛡️</div>
          <h4 className="font-serif text-base font-bold">100% Inspected Residences</h4>
          <p className="text-xs text-stone-300 font-light">
            Every estate, chalet, and houseboat is verified on-site for water, fiber, heating, and hygiene.
          </p>
        </div>
        <div className="space-y-1">
          <div className="text-2xl mb-1">⚡</div>
          <h4 className="font-serif text-base font-bold">Anti-Double Booking Guarantee</h4>
          <p className="text-xs text-stone-300 font-light">
            Server-side transactional lock prevents calendar collisions. Your dates are reserved authoritatively.
          </p>
        </div>
        <div className="space-y-1">
          <div className="text-2xl mb-1">🧾</div>
          <h4 className="font-serif text-base font-bold">18% Corporate GST Invoicing</h4>
          <p className="text-xs text-stone-300 font-light">
            Instant GST credit tax receipts for company retreats, executive travel, and agricultural sourcing offsites.
          </p>
        </div>
        <div className="space-y-1">
          <div className="text-2xl mb-1">👑</div>
          <h4 className="font-serif text-base font-bold">End-to-End Concierge Care</h4>
          <p className="text-xs text-stone-300 font-light">
            Heated 4x4 airport transit, wazwan master chefs, and 24/7 dedicated local assistance throughout your stay.
          </p>
        </div>
      </div>

      {/* Modals */}
      <PropertyFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={advancedFilters}
        onApplyFilters={(newFilters) => setAdvancedFilters(newFilters)}
        onClearFilters={() =>
          setAdvancedFilters({
            minPrice: 0,
            maxPrice: 100000,
            maxTotalTripBudget: 0,
            bedrooms: 0,
            propertyType: '',
            instantBook: false,
            freeCancellation: false,
            verifiedHost: false,
            workFriendly: false,
            minRating: 0,
            amenities: [],
            accessibility: [],
          })
        }
      />

      <AIConciergeModal />
    </div>
  )
}
