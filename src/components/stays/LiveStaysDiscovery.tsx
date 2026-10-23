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
  const [showTotalWithTaxes, setShowTotalWithTaxes] = useState(false)
  const [showExperienceSection, setShowExperienceSection] = useState(false)

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
        const matchesLocation =
          prop.name.toLowerCase().includes(q) ||
          prop.city.toLowerCase().includes(q) ||
          prop.state.toLowerCase().includes(q) ||
          prop.country.toLowerCase().includes(q) ||
          prop.hubZone.toLowerCase().includes(q)
        if (!matchesLocation) return false
      }

      // 2. Primary Category
      if (selectedCategory && selectedCategory !== 'all') {
        const matchesCat =
          prop.category === selectedCategory || prop.secondaryCategories.includes(selectedCategory)
        if (!matchesCat) return false
      }

      // 3. Curated Discovery Collection
      if (selectedDiscovery) {
        if (!prop.discoveryCollections.includes(selectedDiscovery)) {
          return false
        }
      }

      // 4. Capacity Filter
      if (urlGuests > prop.maxTotalGuests) {
        return false
      }

      // 5. Advanced Filters
      if (advancedFilters.minPrice > 0 && prop.estateBuyoutPrice < advancedFilters.minPrice) {
        return false
      }
      if (advancedFilters.maxPrice < 100000 && prop.estateBuyoutPrice > advancedFilters.maxPrice) {
        return false
      }
      if (advancedFilters.bedrooms > 0 && prop.bedrooms < advancedFilters.bedrooms) {
        return false
      }
      if (advancedFilters.propertyType && prop.propertyType !== advancedFilters.propertyType) {
        return false
      }
      if (advancedFilters.instantBook && !prop.instantBook) {
        return false
      }
      if (advancedFilters.freeCancellation && !prop.freeCancellation) {
        return false
      }
      if (advancedFilters.verifiedHost && !prop.host.verified) {
        return false
      }
      if (advancedFilters.workFriendly && !prop.workFriendly) {
        return false
      }
      if (advancedFilters.minRating > 0 && prop.rating < advancedFilters.minRating) {
        return false
      }

      // Amenities
      if (advancedFilters.amenities.length > 0) {
        const allAmenities = prop.propertyAmenities.join(' ').toLowerCase()
        const hasAll = advancedFilters.amenities.every((a) => allAmenities.includes(a.toLowerCase()))
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
    router.replace(`/stays?${params.toString()}`, { scroll: false })
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
    router.replace('/stays', { scroll: false })
  }

  return (
    <div className="space-y-6">
      {/* ── 1. Compact Top Search Pill (Airbnb-inspired) ─────────────────────── */}
      <StaysHeroSearch
        onOpenFilterModal={() => setIsFilterModalOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* ── 2. Category Filter & Controls Bar ─────────────────────────────────── */}
      <div className="sticky top-20 z-20 bg-[#FAF8F5]/95 backdrop-blur-md py-2 border-b border-stone-200/70 flex items-center justify-between gap-4">
        {/* Horizontal Category Icons */}
        <div className="flex items-center gap-6 overflow-x-auto pb-1 scrollbar-none flex-1">
          {STAY_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`flex flex-col items-center gap-1.5 pb-2 transition-all flex-shrink-0 cursor-pointer border-b-2 ${
                  isActive
                    ? 'border-stone-900 text-stone-900 font-bold opacity-100'
                    : 'border-transparent text-stone-500 hover:text-stone-900 hover:border-stone-300 font-medium opacity-75 hover:opacity-100'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[11px] whitespace-nowrap">{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Right Controls: Filters & Transparent Total Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Filters Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:border-stone-900 text-xs font-semibold text-stone-800 shadow-2xs transition-colors"
          >
            <span>⚙️</span>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Transparent Total Toggle Switch (Better than Airbnb) */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl border border-stone-200 bg-white shadow-2xs">
            <span className="text-xs font-medium text-stone-700">Display total with zero hidden fees</span>
            <button
              type="button"
              role="switch"
              aria-checked={showTotalWithTaxes}
              onClick={() => setShowTotalWithTaxes(!showTotalWithTaxes)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 cursor-pointer ${
                showTotalWithTaxes ? 'bg-[#17233B]' : 'bg-stone-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  showTotalWithTaxes ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Active filters notice if any */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between text-xs py-2 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <span>{activeFiltersCount} active search filter(s) applied</span>
          <button
            type="button"
            onClick={handleClearAll}
            className="font-bold underline hover:text-black cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── 3. Main Results Canvas (4-Column Luxury Grid or Full Map) ─────────── */}
      {filteredProperties.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-stone-200 space-y-4 my-8">
          <span className="text-4xl block">🔍</span>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            No verified stays match your current filters
          </h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            We only display real residences with verified availability. Try clearing some filters, adjusting your dates, or asking our AI Concierge for tailored alternatives.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="px-5 py-2.5 bg-stone-900 text-white font-bold text-xs rounded-xl"
            >
              Reset Filters
            </button>
            <button
              type="button"
              onClick={() => openAiConcierge(`I was looking for ${urlDestination || 'a stay'} with specific requirements. Suggest best alternatives.`)}
              className="px-5 py-2.5 bg-[#C9A45C] text-stone-900 font-bold text-xs rounded-xl"
            >
              Ask AI Concierge for Options →
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              nights={nights}
              checkIn={urlCheckIn}
              checkOut={urlCheckOut}
              guests={urlGuests}
              showTotalWithTaxes={showTotalWithTaxes}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-md">
          <InteractiveMapView properties={filteredProperties} nights={nights} />
        </div>
      )}

      {/* ── 4. Floating Map / List Toggle Button (Airbnb Signature) ───────────── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
          className="px-6 py-3 rounded-full bg-[#17233B] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <span>{viewMode === 'grid' ? 'Show map 🗺️' : 'Show list 📋'}</span>
        </button>
      </div>

      {/* ── 5. Secondary Services & Split Stays Accordion Drawer ─────────────── */}
      <div className="pt-12 border-t border-stone-200 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Exclusive In-Stay Services &amp; Split Journeys
            </h3>
            <p className="text-xs text-stone-500">
              Private 4x4 snow transit, master wazwan chefs, harvest walks, and multi-property itineraries.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowExperienceSection(!showExperienceSection)}
            className="text-xs font-bold text-[#176B68] hover:underline cursor-pointer"
          >
            {showExperienceSection ? 'Hide Services & Itineraries ▲' : 'Explore Local Services & Itineraries ▼'}
          </button>
        </div>

        {showExperienceSection && (
          <div className="space-y-12 animate-fadeIn">
            <ServicesCatalogueSection />
            <SplitStaySection />
          </div>
        )}
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
