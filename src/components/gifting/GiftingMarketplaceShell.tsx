'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import CartDrawer from '@/components/cart/CartDrawer'
import PincodeModal from '@/components/gifting/PincodeModal'
import WishlistDrawer from '@/components/gifting/WishlistDrawer'
import CorporateQuoteModal from '@/components/gifting/CorporateQuoteModal'
import { useGiftingStore } from '@/hooks/useGiftingStore'
import {
  GIFTING_CATEGORIES,
  GIFTING_OCCASIONS,
  GIFTING_RECIPIENTS,
  GIFTING_PRODUCTS,
} from '@/lib/gifting-marketplace-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function GiftingMarketplaceShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { cartCount, openCart, wishlist, deliveryLocation } = useGiftingStore()

  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pincodeModalOpen, setPincodeModalOpen] = useState(false)
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false)
  const [corporateModalOpen, setCorporateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-suggest matches
  const searchSuggestions = searchQuery.trim()
    ? GIFTING_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.occasions.some((o) => o.includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : []

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearchFocused(false)
    router.push(`/gifting/explore?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] flex flex-col font-sans selection:bg-[#C9A45C]/30">
      {/* ── 1. Top Utility Strip (Image 2 exact replica) ───────────────────── */}
      <div className="bg-[#0B2521] text-stone-200 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex items-center justify-between gap-3 font-medium">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-white">
            <span>🎁</span>
            <span>Gifts for Every Occasion</span>
          </span>
          <span className="text-white/20 hidden md:inline">•</span>
          <span className="hidden md:flex items-center gap-1.5 text-[#C9A45C]">
            <span>✈️</span>
            <span>Pan-India &amp; Global Delivery (UAE, UK, US)</span>
          </span>
          <span className="text-white/20 hidden lg:inline">•</span>
          <span className="hidden lg:flex items-center gap-1.5 text-stone-300">
            <span>🛡️</span>
            <span>Premium &amp; Authentic Products</span>
          </span>
          <span className="text-white/20 hidden xl:inline">•</span>
          <span className="hidden xl:flex items-center gap-1.5 text-stone-300">
            <span>✍️</span>
            <span>Personalisation Available</span>
          </span>
          <span className="text-white/20 hidden xl:inline">•</span>
          <button
            type="button"
            onClick={() => setCorporateModalOpen(true)}
            className="hidden xl:flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
          >
            <span>💼</span>
            <span>Corporate Gifting Solutions</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium flex-shrink-0">
          <Link
            href="/gifting/track"
            className="text-stone-300 hover:text-[#C9A45C] transition-colors flex items-center gap-1"
          >
            <span>📍</span>
            <span>Track Order</span>
          </Link>
          <span className="text-white/20">•</span>
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales Gifting! I need help selecting an occasion gift hamper.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A45C] hover:underline flex items-center gap-1 font-semibold"
          >
            <span>❓ Help</span>
          </a>
        </div>
      </div>

      {/* ── 2. Main Brand Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/gifting" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-11 h-11 rounded-2xl bg-[#0B2521] flex items-center justify-center text-white font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform border border-[#C9A45C]/30">
                <span>🎁</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-extrabold text-[#0B2521] tracking-tight block">
                  NUTY TALES <span className="text-[#C9A45C]">GIFTING</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#704B32] block -mt-0.5">
                  GIFTS THAT MEAN SOMETHING
                </span>
              </div>
            </Link>

            {/* Central Search Bar with Live Suggestions */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <form onSubmit={handleSearchSubmit} className="w-full flex items-center">
                <div className="relative w-full flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setSearchFocused(true)
                    }}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search for gifts, occasions, products, or recipients..."
                    className="w-full pl-4 pr-12 py-2.5 bg-[#FAF7F2] border border-stone-300 rounded-full text-xs text-[#17233B] placeholder-stone-400 focus:bg-white focus:outline-hidden focus:border-[#C9A45C] focus:ring-2 focus:ring-[#C9A45C]/20 transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 w-9 h-9 bg-[#C9A45C] hover:bg-[#b5924d] text-white rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-sm"
                    aria-label="Submit search"
                  >
                    🔍
                  </button>
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {searchFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-50 text-xs">
                  <div className="p-2 border-b border-stone-100 bg-stone-50 flex justify-between items-center text-stone-500 text-[11px]">
                    <span>Suggested Gift Matches</span>
                    <span>Press Enter to view all</span>
                  </div>
                  {searchSuggestions.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {searchSuggestions.map((item) => (
                        <Link
                          key={item.id}
                          href={`/gifting/product/${item.slug}`}
                          onClick={() => setSearchFocused(false)}
                          className="p-3 hover:bg-[#FAF7F2] flex items-center gap-3 transition-colors"
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                            <Image src={item.primaryImage} alt={item.name} fill className="object-contain p-0.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <strong className="block text-[#17233B] truncate">{item.name}</strong>
                            <span className="text-[10px] text-stone-500">{item.categoryName}</span>
                          </div>
                          <span className="font-mono font-bold text-[#0B2521]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-stone-400">
                      No exact gifts found. Press Enter to search catalog.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Action Icons: Delivery Pincode, Account, Wishlist, Cart */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 text-xs font-semibold">
              {/* Delivery Location Selector */}
              <button
                type="button"
                onClick={() => setPincodeModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-700 hover:text-[#0B2521] hover:bg-stone-100 transition-colors"
              >
                <span className="text-[#C9A45C]">📍</span>
                <div className="text-left leading-tight">
                  <span className="text-[10px] text-stone-400 block font-normal">Deliver to</span>
                  <span className="font-bold truncate max-w-[110px] block">{deliveryLocation} ▾</span>
                </div>
              </button>

              {/* Account */}
              <Link
                href="/gifting/dashboard"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-700 hover:text-[#0B2521] hover:bg-stone-100 transition-colors"
              >
                <span className="text-base">👤</span>
                <span>Account</span>
              </Link>

              {/* Wishlist */}
              <button
                type="button"
                onClick={() => setWishlistDrawerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-stone-700 hover:text-[#0B2521] hover:bg-stone-100 transition-colors relative"
                aria-label="View Wishlist"
              >
                <span className="text-base">♡</span>
                <span className="hidden sm:inline">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center -ml-1">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B2521] hover:bg-[#176B68] text-white shadow-sm transition-all active:scale-95"
                aria-label="View Shopping Basket"
              >
                <div className="relative">
                  <span className="text-base">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#C9A45C] text-[#0B2521] text-[10px] font-black flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="font-bold text-xs">Cart</span>
              </button>

              {/* Mobile Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-700"
                aria-label="Toggle navigation drawer"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts, occasions, hampers..."
                className="w-full pl-3.5 pr-10 py-2 bg-[#FAF7F2] border border-stone-300 rounded-xl text-xs text-[#17233B]"
              />
              <button
                type="submit"
                className="absolute right-2 text-stone-500 p-1"
                aria-label="Search"
              >
                🔍
              </button>
            </form>
          </div>
        </div>

        {/* ── 3. Primary Navigation Bar (Image 2 exact menu structure) ─────── */}
        <nav className="hidden lg:block border-t border-stone-200/70 bg-[#FAF7F2]/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-11 text-xs font-semibold text-stone-700">
              {/* All Gifts Mega Menu Trigger */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('all-gifts')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[#0B2521] hover:bg-stone-200/50 transition-colors"
                >
                  <span>☰</span>
                  <span>All Gifts</span>
                  <span className="text-[10px] text-stone-400">▾</span>
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === 'all-gifts' && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-[10px] uppercase font-bold text-stone-400 px-3 block mb-1">
                      Explore Categories
                    </span>
                    {GIFTING_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/gifting/explore?category=${cat.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-700 hover:bg-[#FAF7F2] hover:text-[#0B2521] transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono">({cat.count})</span>
                      </Link>
                    ))}
                    <div className="pt-2 border-t border-stone-100">
                      <Link
                        href="/gifting/explore"
                        className="block text-center py-2 bg-[#FAF7F2] text-[#0B2521] rounded-xl font-bold text-[11px] hover:bg-stone-200/60"
                      >
                        View Complete Catalog →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Occasions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('occasions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-[#0B2521] hover:bg-stone-200/50 transition-colors"
                >
                  <span>Occasions</span>
                  <span className="text-[10px] text-stone-400">▾</span>
                </button>

                {activeDropdown === 'occasions' && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-[10px] uppercase font-bold text-stone-400 px-3 block mb-1">
                      Shop by Celebration
                    </span>
                    {GIFTING_OCCASIONS.map((occ) => (
                      <Link
                        key={occ.id}
                        href={`/gifting/explore?occasion=${occ.slug}`}
                        className="block px-3 py-2 rounded-xl text-stone-700 hover:bg-[#FAF7F2] hover:text-[#0B2521] transition-colors"
                      >
                        <strong className="block text-xs">{occ.name}</strong>
                        <span className="text-[10px] text-stone-400 block -mt-0.5">{occ.subtitle}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recipients Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('recipients')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:text-[#0B2521] hover:bg-stone-200/50 transition-colors"
                >
                  <span>Recipients</span>
                  <span className="text-[10px] text-stone-400">▾</span>
                </button>

                {activeDropdown === 'recipients' && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-[10px] uppercase font-bold text-stone-400 px-3 block mb-1">
                      Gifts by Recipient
                    </span>
                    {GIFTING_RECIPIENTS.map((rec) => (
                      <Link
                        key={rec.id}
                        href={`/gifting/explore?recipient=${rec.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-stone-700 hover:bg-[#FAF7F2] hover:text-[#0B2521] transition-colors"
                      >
                        <span>{rec.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-50 text-[#704B32] font-bold">
                          {rec.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Navigation Links */}
              <Link
                href="/gifting/explore?category=gift-hampers"
                className="px-3 py-1.5 rounded-lg hover:text-[#0B2521] hover:bg-stone-200/50 transition-colors"
              >
                Collections
              </Link>

              <Link
                href="/gifting/explore?category=personalized-gifts"
                className="px-3 py-1.5 rounded-lg hover:text-[#0B2521] hover:bg-stone-200/50 transition-colors"
              >
                Personalized Gifts
              </Link>

              <button
                type="button"
                onClick={() => setCorporateModalOpen(true)}
                className="px-3 py-1.5 rounded-lg hover:text-[#0B2521] hover:bg-stone-200/50 transition-colors cursor-pointer"
              >
                Corporate Gifting
              </button>

              <Link
                href="/gifting/recipients"
                className="px-3 py-1.5 rounded-lg hover:text-[#0B2521] hover:bg-stone-200/50 transition-colors"
              >
                Bulk Orders
              </Link>

              <Link
                href="/gifting/explore?category=gift-hampers&priceMin=2500"
                className="px-3 py-1.5 rounded-lg hover:text-[#0B2521] hover:bg-stone-200/50 transition-colors"
              >
                Nuty Tales Premium
              </Link>

              {/* Offers Pill Badge */}
              <Link
                href="/gifting/explore?discount=true"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold transition-colors"
              >
                <span>🏷️</span>
                <span>Offers</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── 4. Mobile Navigation Drawer ─────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-stone-200 px-5 py-5 space-y-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-200">
            {/* Delivery Pin on Mobile */}
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 block">Delivery Destination</span>
                <strong className="text-xs text-[#0B2521]">{deliveryLocation}</strong>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setPincodeModalOpen(true)
                }}
                className="text-xs font-bold text-[#C9A45C] hover:underline"
              >
                Change PIN
              </button>
            </div>

            {/* Quick Links */}
            <div className="space-y-1 text-xs">
              <Link
                href="/gifting/explore"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold bg-[#FAF7F2] text-[#0B2521]"
              >
                🎁 Shop All Gifts
              </Link>
              <Link
                href="/gifting/explore?category=gift-hampers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50"
              >
                Gift Hampers &amp; Boxes
              </Link>
              <Link
                href="/gifting/explore?category=dry-fruits-nuts"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50"
              >
                Dry Fruits &amp; Nuts
              </Link>
              <Link
                href="/gifting/explore?category=personalized-gifts"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50"
              >
                Personalized Gifts
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setCorporateModalOpen(true)
                }}
                className="block w-full text-left px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50"
              >
                Corporate Gifting RFP
              </button>
              <Link
                href="/gifting/track"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50"
              >
                Track Your Order
              </Link>
            </div>

            {/* Corporate Hotline Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setCorporateModalOpen(true)
                }}
                className="w-full py-3 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl text-center shadow-md"
              >
                Request Corporate Quote →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── 5. Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── 6. Mobile Sticky Bottom Navigation ─────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-2 px-6 flex items-center justify-between text-center text-[10px] font-semibold text-stone-600 shadow-lg">
        <Link href="/gifting" className="flex flex-col items-center gap-0.5">
          <span className="text-lg">🏠</span>
          <span>Home</span>
        </Link>
        <Link href="/gifting/explore" className="flex flex-col items-center gap-0.5">
          <span className="text-lg">🔍</span>
          <span>Explore</span>
        </Link>
        <button
          type="button"
          onClick={() => setWishlistDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 relative"
        >
          <span className="text-lg">♡</span>
          <span>Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center gap-0.5 relative"
        >
          <span className="text-lg">🛒</span>
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-[#C9A45C] text-[#0B2521] text-[8px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setCorporateModalOpen(true)}
          className="flex flex-col items-center gap-0.5"
        >
          <span className="text-lg">💼</span>
          <span>Corporate</span>
        </button>
      </div>

      {/* ── 7. Comprehensive E-Commerce Footer ──────────────────────────────── */}
      <footer className="bg-[#0B2521] text-white border-t border-white/10 mt-16 pt-16 pb-24 lg:pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Newsletter & Assurance Banner */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A45C]">
                Exclusive Festive Privileges
              </span>
              <h4 className="font-serif text-2xl font-bold">
                Subscribe to Nuty Tales Gifting Club
              </h4>
              <p className="text-stone-300 text-xs font-light">
                Receive secret seasonal harvest drops, festival early-bird benefits, and corporate catalog previews.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Thank you for subscribing! Your festive welcome coupon is NUTY10.')
              }}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-stone-400 focus:outline-hidden focus:border-[#C9A45C] text-xs w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>

          {/* 4-Column Directory */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-stone-300">
            {/* Column 1: Shop by Category */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">
                Shop by Category
              </h5>
              <ul className="space-y-2">
                {GIFTING_CATEGORIES.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/gifting/explore?category=${c.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Shop by Occasion */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">
                Shop by Occasion
              </h5>
              <ul className="space-y-2">
                {GIFTING_OCCASIONS.slice(0, 6).map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/gifting/explore?occasion=${o.slug}`}
                      className="hover:text-white transition-colors"
                    >
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Corporate & Bulk */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">
                Corporate &amp; Business
              </h5>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCorporateModalOpen(true)}
                    className="hover:text-white transition-colors text-left"
                  >
                    Request Corporate Quote
                  </button>
                </li>
                <li>
                  <Link href="/gifting/recipients" className="hover:text-white transition-colors">
                    Multi-Recipient Desk (Excel/CSV)
                  </Link>
                </li>
                <li>
                  <Link href="/gifting/designer" className="hover:text-white transition-colors">
                    Custom Gift Designer Studio
                  </Link>
                </li>
                <li>
                  <Link href="/gifting/track" className="hover:text-white transition-colors">
                    Track Consignments
                  </Link>
                </li>
                <li>
                  <span className="text-stone-400">18% GST Invoicing with ITC</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Trust & Support */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">
                Customer Care &amp; Trust
              </h5>
              <p className="text-stone-400 text-xs leading-relaxed">
                Central FSSAI Lic. #22724441000048<br />
                Hotline: +91 9717161809<br />
                Email: gifting@nutytales.com<br />
                Hubs: Noida, Srinagar, Patna
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-stone-400">
                <span className="px-2 py-1 bg-white/5 rounded-md">✓ Razorpay Secured</span>
                <span className="px-2 py-1 bg-white/5 rounded-md">✓ Express Air</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright and Legal Policies */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <span>© {new Date().getFullYear()} Nuty Tales Gifting. All rights reserved.</span>
            <div className="flex flex-wrap gap-4">
              <Link href="/shipping" className="hover:text-white">Shipping Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/terms" className="hover:text-white">Returns &amp; Refunds</Link>
              <Link href="/gifting/track" className="hover:text-white">Track Order</Link>
              <a href="https://www.nutytales.com" className="hover:text-white">Nuty Tales Gateway</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals Mounted to Shell */}
      <CartDrawer />
      <PincodeModal isOpen={pincodeModalOpen} onClose={() => setPincodeModalOpen(false)} />
      <WishlistDrawer isOpen={wishlistDrawerOpen} onClose={() => setWishlistDrawerOpen(false)} />
      <CorporateQuoteModal
        isOpen={corporateModalOpen}
        onClose={() => setCorporateModalOpen(false)}
      />
    </div>
  )
}
