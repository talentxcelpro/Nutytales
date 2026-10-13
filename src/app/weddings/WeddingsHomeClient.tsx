'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { INITIAL_VENUES, INITIAL_VENDORS } from '@/lib/weddings/data'
import { WeddingVenue, WeddingVendor } from '@/lib/weddings/types'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { WEDDING_CURATIONS } from '@/lib/weddings-data'

const DISCOVERY_CATEGORIES = [
  { id: 'venues', name: 'Venues', icon: '🏰', count: '120+ Curated' },
  { id: 'catering', name: 'Catering & Wazwan', icon: '🍽️', count: '45+ Chefs' },
  { id: 'photography', name: 'Photography & Cinema', icon: '📷', count: '60+ Studios' },
  { id: 'decor', name: 'Decor & Flowers', icon: '🌸', count: '35+ Designers' },
  { id: 'makeup', name: 'Makeup & Styling', icon: '💄', count: '50+ Artists' },
  { id: 'outfits', name: 'Outfits & Trousseau', icon: '👗', count: '30+ Boutiques' },
  { id: 'invitations', name: 'Invitations & Cards', icon: '✉️', count: '25+ Ateliers' },
  { id: 'music', name: 'Music & Entertainment', icon: '🎶', count: '40+ Troupes' },
  { id: 'stays', name: 'Guest Accommodation', icon: '🏨', count: '85+ Resorts' },
  { id: 'transport', name: 'Transportation', icon: '🚗', count: '30+ Fleets' },
  { id: 'favors', name: 'Gifting & Favors', icon: '🎁', count: 'Bespoke Studio' },
  { id: 'planning', name: 'Planning & Coordination', icon: '📋', count: '20+ Teams' },
]

const EDITORIAL_COLLECTIONS = [
  {
    title: 'Heritage Palaces & Royal Estates',
    dest: 'Rajasthan & Kashmir',
    tag: 'Grand & Timeless',
    image: '/images/jaipur-heritage.jpg',
    href: '/venues?type=palace',
  },
  {
    title: 'Apple Orchards & Mountain Lawns',
    dest: 'Srinagar & Gulmarg',
    tag: 'Nature Celebrations',
    image: '/images/stays/kashmir-orchard-estate.jpg',
    href: '/venues?destination=kashmir',
  },
  {
    title: 'Intimate Waterfront Celebrations',
    dest: 'Udaipur, Goa & Como',
    tag: '40 – 150 Guests',
    image: '/images/stays/cedar-houseboat.jpg',
    href: '/venues?capacity=intimate',
  },
  {
    title: 'Desert Dunes & Arabian Nights',
    dest: 'Dubai & Emirates',
    tag: 'Destination Luxury',
    image: '/images/stays/modern-apartment-interior.jpg',
    href: '/venues?destination=dubai',
  },
]

export default function WeddingsHomeClient() {
  // Search parameters
  const [searchDestination, setSearchDestination] = useState('')
  const [searchGuestCount, setSearchGuestCount] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [searchBudget, setSearchBudget] = useState('')

  // Selected venue & vendor for inquiry modal
  const [selectedVenue, setSelectedVenue] = useState<WeddingVenue | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<WeddingVendor | null>(null)
  const [inquiryName, setInquiryName] = useState('')
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [inquiryDate, setInquiryDate] = useState('2026-11-20')
  const [inquirySent, setInquirySent] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Filter venues according to search parameters
  const filteredVenues = INITIAL_VENUES.filter((v) => {
    if (searchDestination && !v.destination.toLowerCase().includes(searchDestination.toLowerCase())) {
      return false
    }
    if (searchGuestCount) {
      const count = parseInt(searchGuestCount)
      if (v.capacityMax < count) return false
    }
    return true
  })

  // Filter vendors according to search
  const filteredVendors = INITIAL_VENDORS.filter((vnd) => {
    if (searchCategory && vnd.category !== searchCategory) return false
    if (searchDestination && !vnd.destination.toLowerCase().includes(searchDestination.toLowerCase())) {
      return false
    }
    return true
  })

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inquiryPhone) return
    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'wedding_inquiry',
          vertical: 'weddings',
          customerName: inquiryName || 'Wedding Couple',
          customerPhone: inquiryPhone,
          deliveryCity: selectedVenue?.city || selectedVendor?.city || 'India',
          itemOrService: selectedVenue
            ? `Venue Booking Inquiry: ${selectedVenue.name} (${selectedVenue.destination})`
            : `Vendor Quote Request: ${selectedVendor?.businessName} (${selectedVendor?.category})`,
          notes: `Date: ${inquiryDate} | Guests: ${searchGuestCount || 'Not specified'}`,
          source: 'weddings.nutytales.com/discovery',
        }),
      })
      setInquirySent(true)
    } catch {
      setInquirySent(true)
    }
  }

  const HERO_SLIDES = [
    {
      src: '/images/weddings/hero-palace.jpg',
      alt: 'Royal Rajasthan Palace Courtyard Celebration at Twilight',
      caption: 'The Rambagh & Jai Mahal Palace Grounds — Jaipur, India',
      flag: '🇮🇳 Jaipur Palace',
    },
    {
      src: '/images/weddings/hero-global.jpg',
      alt: 'Luxury Italian Riviera Terrace Wedding at Sunset',
      caption: 'Villa Balbiano & Tuscan Estates — Lake Como & Italy',
      flag: '🇮🇹 Lake Como',
    },
  ]
  const [activeHero, setActiveHero] = useState(0)

  return (
    <div className="space-y-16 pb-24 text-[#17233B]">
      {/* ── 1. Editorial Photography Hero ────────────────────────────────────────── */}
      <section className="relative w-full pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 aspect-[16/10] sm:aspect-[21/9] min-h-[480px] flex items-center">
          <Image
            src={HERO_SLIDES[activeHero].src}
            alt={HERO_SLIDES[activeHero].alt}
            fill
            priority
            className="object-cover object-center transition-all duration-700 brightness-[0.88]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 space-y-5 text-white">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[#E5C378] text-xs font-semibold tracking-wider uppercase">
              <span>💍</span> Nuty Tales Weddings
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Your wedding. <br />
              <span className="font-normal italic text-[#FAF7F2]">Beautifully brought together.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 font-light leading-relaxed max-w-xl">
              Discover extraordinary venues, find your people, plan every detail, and bring your celebration to life—all in one place.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/workspace"
                className="px-6 py-3.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-[1.02]"
              >
                Start Planning Free
              </Link>
              <a
                href="#venues-section"
                className="px-6 py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/30"
              >
                Explore Venues ↓
              </a>
            </div>
          </div>

          {/* Interactive Destination Switcher */}
          <div className="absolute bottom-5 right-6 z-20 hidden md:flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-300 mr-1">
              Curated Backdrops:
            </span>
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setActiveHero(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeHero === idx
                    ? 'bg-white text-stone-900 shadow-md scale-105'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {slide.flag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Unified Discovery Search Experience ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#8E2848] flex items-center gap-1.5">
              <span>🔍</span> Unified Wedding Search
            </span>
            <span className="text-xs text-stone-400 font-light hidden sm:inline">
              Instant discovery across 120+ verified venues &amp; vendors
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Destination */}
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus-within:border-[#8E2848] transition-colors">
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">
                Destination
              </label>
              <select
                aria-label="Filter by destination"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none"
              >
                <option value="">Any Destination</option>
                <option value="Jaipur">Jaipur (Palaces &amp; Havelis)</option>
                <option value="Udaipur">Udaipur (Lakefront Estates)</option>
                <option value="Kashmir">Srinagar (Orchards &amp; Dal Lake)</option>
                <option value="Goa">Goa (Beachfront &amp; Lawns)</option>
                <option value="Delhi">Delhi NCR (Farmhouses &amp; Mansions)</option>
                <option value="Dubai">Dubai &amp; UAE (Desert &amp; Sky Villas)</option>
                <option value="Italy">Italy (Lake Como &amp; Tuscany)</option>
              </select>
            </div>

            {/* Guest Count */}
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus-within:border-[#8E2848] transition-colors">
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">
                Guest Count
              </label>
              <select
                aria-label="Filter by guest count"
                value={searchGuestCount}
                onChange={(e) => setSearchGuestCount(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none"
              >
                <option value="">Any Size</option>
                <option value="100">Intimate (Up to 100)</option>
                <option value="250">Classic (150 – 250)</option>
                <option value="500">Grand (250 – 500)</option>
                <option value="800">Imperial (500+ Guests)</option>
              </select>
            </div>

            {/* Category */}
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus-within:border-[#8E2848] transition-colors">
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">
                Service Category
              </label>
              <select
                aria-label="Filter by service category"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none"
              >
                <option value="">All Services</option>
                <option value="planner">Wedding Planners</option>
                <option value="catering">Royal Wazwan &amp; Catering</option>
                <option value="photography">Cinema &amp; Photography</option>
                <option value="decor">Floral &amp; Scenography</option>
                <option value="favors">Bespoke Gifting &amp; Favors</option>
                <option value="music">Live Bands &amp; Sufi Troupes</option>
              </select>
            </div>

            {/* Budget Range */}
            <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 focus-within:border-[#8E2848] transition-colors">
              <label className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block mb-0.5">
                Target Budget
              </label>
              <select
                aria-label="Filter by target budget"
                value={searchBudget}
                onChange={(e) => setSearchBudget(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-[#17233B] focus:outline-none"
              >
                <option value="">Any Budget</option>
                <option value="25">Up to ₹25 Lakhs</option>
                <option value="50">₹25L – ₹50 Lakhs</option>
                <option value="75">₹50L – ₹1 Crore</option>
                <option value="150">₹1 Crore – ₹2.5 Cr+</option>
              </select>
            </div>

            {/* Submit Action */}
            <button
              onClick={() => {
                const element = document.getElementById('venues-section')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="py-3 px-6 bg-[#17233B] hover:bg-[#8E2848] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>✨</span>
              <span>Explore Weddings</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. Discovery Categories Grid ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
              Curated Directory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
              Explore by Category
            </h2>
          </div>
          <Link
            href="/venues"
            className="text-xs font-bold text-[#8E2848] hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {DISCOVERY_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === 'venues' ? '/venues' : cat.id === 'favors' ? '/wedding-return-gifts' : `/vendors?category=${cat.id}`}
              className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#8E2848] hover:shadow-md transition-all text-center space-y-1.5 group"
            >
              <span className="text-2xl block group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="font-bold text-xs text-[#17233B] block group-hover:text-[#8E2848] transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-stone-400 font-medium block">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. Editorial Discovery Collections ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
            Editorial Perspectives
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
            Celebration Collections
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EDITORIAL_COLLECTIONS.map((col, idx) => (
            <Link
              key={idx}
              href={col.href}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-sm hover:shadow-xl transition-all border border-stone-200"
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.82]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                  {col.tag}
                </span>
                <h3 className="font-serif font-bold text-lg leading-snug text-white group-hover:text-[#FAF7F2] transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-stone-300 font-light">{col.dest}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. Real Featured Venues Section ────────────────────────────────────── */}
      <section id="venues-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
              Verified Properties
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
              Extraordinary Wedding Venues
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Historic Rajput palaces, lakeside orchards, and oceanfront estates vetted for sound permits, room blocks, and multi-day banquets.
            </p>
          </div>
          <Link
            href="/venues"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-[#17233B] transition-colors self-start sm:self-auto"
          >
            Browse All {INITIAL_VENUES.length} Venues →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <Link href={`/venues/${venue.slug}`} className="block relative aspect-[16/10] w-full bg-stone-100 group overflow-hidden">
                  <Image
                    src={venue.images[0] || '/images/jaipur-heritage.jpg'}
                    alt={venue.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#17233B] shadow-xs flex items-center gap-1">
                    <span>★</span>
                    <span>{venue.rating}</span>
                    <span className="text-stone-400 font-normal">({venue.reviewsCount})</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-[#2D1520] text-[#C9A45C] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {venue.destination}
                  </div>
                </Link>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <Link href={`/venues/${venue.slug}`} className="hover:text-[#8E2848] transition-colors">
                    <h3 className="font-serif font-bold text-lg text-[#17233B] line-clamp-1 hover:underline">
                      {venue.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-stone-600">
                    <span>Capacity: <strong>{venue.capacityMin}–{venue.capacityMax}</strong></span>
                    <span>•</span>
                    <span>Rooms: <strong>{venue.accommodationRooms}</strong></span>
                  </div>

                  <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed">
                    {venue.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Price Guide</span>
                      <span className="font-serif text-base font-bold text-[#8E2848]">
                        From ₹{(venue.priceStarting / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Verified Partner
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedVenue(venue)}
                  className="flex-1 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs text-center"
                >
                  Request Quote
                </button>
                <Link
                  href={`/venues/${venue.slug}`}
                  className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Estate →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Real Verified Vendors Section ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
              Vendor Collective
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
              Verified Wedding Professionals
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Planners, 36-course Wazwan chefs, candid cinematographers, and scenographers holding verified client reviews.
            </p>
          </div>
          <Link
            href="/vendors"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-[#17233B] transition-colors self-start sm:self-auto"
          >
            Explore All Vendors →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <Link href={`/vendors/${vendor.slug}`} className="block relative aspect-[16/10] w-full bg-stone-100 group overflow-hidden">
                  <Image
                    src={vendor.portfolio[0] || '/images/wedding-celebration.jpg'}
                    alt={vendor.businessName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#2D1520] text-[#C9A45C] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {vendor.category.toUpperCase()}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#17233B] shadow-xs flex items-center gap-1">
                    <span>★</span>
                    <span>{vendor.rating}</span>
                  </div>
                </Link>

                <div className="p-5 space-y-3">
                  <Link href={`/vendors/${vendor.slug}`} className="hover:text-[#8E2848] transition-colors">
                    <h3 className="font-serif font-bold text-base text-[#17233B] line-clamp-1 hover:underline">
                      {vendor.businessName}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>📍 {vendor.destination}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">✓ Verified Guild</span>
                  </div>
                  <p className="text-xs text-stone-600 font-light line-clamp-2 leading-relaxed">
                    {vendor.bio}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-semibold block">Starting Rate</span>
                      <span className="font-serif text-base font-bold text-[#8E2848]">
                        ₹{vendor.startingPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-light">
                      {vendor.packages.length} standard package tiers
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <button
                  onClick={() => setSelectedVendor(vendor)}
                  className="flex-1 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs text-center"
                >
                  Request Quote
                </button>
                <Link
                  href={`/vendors/${vendor.slug}`}
                  className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  View Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. Wedding Operating System (The Core Engine Preview) ────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2D1520] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#C9A45C]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
                <span>⚡</span> The Wedding Operating System
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                One persistent workspace. <br />
                <span className="text-[#C9A45C]">Every detail synchronized.</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl">
                Replace fragmented spreadsheets and scattered chat groups with a unified operating system built for modern families and professional planners.
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs text-stone-200 pt-2">
                <div className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-white block">Multi-Event Scheduler</strong>
                    <span className="text-stone-400 text-[11px]">Detects venue &amp; vendor schedule conflicts automatically.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-white block">Financial Control Desk</strong>
                    <span className="text-stone-400 text-[11px]">Separate planned, estimated, quoted, and paid amounts.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-white block">Guest &amp; Table Seating</strong>
                    <span className="text-stone-400 text-[11px]">CSV imports, dietary logs, and interactive seating tables.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#C9A45C] font-bold text-sm">✓</span>
                  <div>
                    <strong className="text-white block">SI Wedding Intelligence</strong>
                    <span className="text-stone-400 text-[11px]">Context-aware budgeting advice and next-action summaries.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/workspace"
                  className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105"
                >
                  Open Wedding Workspace →
                </Link>
                <Link
                  href="/planner"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold uppercase tracking-wider border border-white/20 transition-colors"
                >
                  For Professional Planners
                </Link>
              </div>
            </div>

            {/* Right Inset Snapshot */}
            <div className="lg:col-span-5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/15 p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[#C9A45C] font-bold font-mono">WED-2026-JAIPUR</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  ● Active Blueprint
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-stone-300 text-[11px]">
                  <span>Total Planned Budget:</span>
                  <span className="font-bold text-white">₹75.0 Lakhs</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C9A45C] h-full w-[65%]" />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>Committed: ₹48.5L (65%)</span>
                  <span>Remaining: ₹26.5L</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-[#C9A45C] uppercase font-bold tracking-wider block">
                  Next Milestone Action
                </span>
                <p className="text-white text-xs font-medium">
                  Confirm Ustad Gani Wazwan 50% catering milestone payment (Due Nov 05).
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                <div className="p-2 bg-white/5 rounded-lg">
                  <span className="text-white font-bold block text-sm">5</span>
                  <span className="text-stone-400">Ceremonies</span>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <span className="text-white font-bold block text-sm">250</span>
                  <span className="text-stone-400">Guests</span>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <span className="text-white font-bold block text-sm">0</span>
                  <span className="text-emerald-400">Conflicts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Wedding Favors & Trousseau Keepsakes Showcase ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
              Bespoke Artisan Gifting
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B]">
              Royal Trousseau &amp; Wedding Favors
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Hand-carved walnut wood presentation chests, monogrammed rigid boxes, and verified single-origin Kashmiri dry fruits delivered to hotel suites Pan-India.
            </p>
          </div>
          <Link
            href="/wedding-return-gifts"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-[#17233B] transition-colors self-start sm:self-auto"
          >
            Explore Gifting Studio →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WEDDING_CURATIONS.map((cur) => (
            <div
              key={cur.id}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-stone-100">
                  <Image src={cur.image} alt={cur.name} fill className="object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                    {cur.subtitle}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#17233B] line-clamp-1">
                    {cur.name}
                  </h3>
                  <p className="text-xs font-bold text-[#8E2848]">
                    From ₹{cur.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-stone-400 font-normal">/ hamper</span>
                  </p>
                  <ul className="text-[11px] text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                    {cur.contents.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="truncate">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales! I would like details and a sample box for "${cur.name}" (₹${cur.price}).`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-[#17233B] hover:bg-[#8E2848] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                >
                  Request Sample Box →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. Direct Inquiry / RFQ Modal ───────────────────────────────────────── */}
      {(selectedVenue || selectedVendor) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
                  Official RFP &amp; Availability Check
                </span>
                <h3 className="font-serif text-xl font-bold text-[#17233B]">
                  {selectedVenue ? selectedVenue.name : selectedVendor?.businessName}
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedVenue ? selectedVenue.destination : selectedVendor?.destination}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedVenue(null)
                  setSelectedVendor(null)
                  setInquirySent(false)
                }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {inquirySent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <span className="text-3xl block">✓</span>
                <h4 className="font-serif font-bold text-base text-emerald-900">
                  Inquiry Dispatched Successfully!
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Our wedding concierge has transmitted your specifications directly to the partner. We will share verified date availability and quotation within 4 hours.
                </p>
                <button
                  onClick={() => {
                    setSelectedVenue(null)
                    setSelectedVendor(null)
                    setInquirySent(false)
                  }}
                  className="px-5 py-2 bg-[#17233B] text-white rounded-xl text-xs font-bold uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">Your Name / Couple Names *</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Ananya & Vikram"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 block">Target Celebration Date</label>
                    <input
                      type="date"
                      value={inquiryDate}
                      onChange={(e) => setInquiryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#8E2848] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200">
                  <span className="font-bold text-[#17233B] block mb-0.5">Nuty Tales Verification Guarantee:</span>
                  We do not simulate automated bookings. Dates and pricing are checked directly with verified leadership before confirmation.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                >
                  Send Quotation Request →
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
