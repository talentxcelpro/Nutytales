'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { StayProperty } from '@/lib/stays-data'

// Global Stays Context for Wishlist, Comparison, and AI Concierge Modal
interface StaysContextType {
  wishlist: string[]
  toggleWishlist: (slug: string) => void
  isWishlisted: (slug: string) => boolean
  comparedProperties: StayProperty[]
  addToCompare: (property: StayProperty) => void
  removeFromCompare: (slug: string) => void
  isCompared: (slug: string) => boolean
  clearCompare: () => void
  isAiConciergeOpen: boolean
  openAiConcierge: (initialPrompt?: string) => void
  closeAiConcierge: () => void
  aiInitialPrompt: string
}

const StaysContext = createContext<StaysContextType | null>(null)

export function useStaysContext() {
  const context = useContext(StaysContext)
  if (!context) {
    throw new Error('useStaysContext must be used within a StaysShell')
  }
  return context
}

const STAYS_PRIMARY_NAV = [
  { label: 'Stays', href: '/stays' },
  { label: 'Mountain Escapes', href: '/stays?discovery=mountain_escapes' },
  { label: 'Private Villas', href: '/stays?discovery=villas_private' },
  { label: 'Cedar Houseboats', href: '/stays?category=houseboats' },
  { label: 'Experiences & Services', href: '/stays#services-catalogue' },
  { label: 'Group Buyouts', href: '/stays/group-quote', badge: 'Private' },
]

export default function StaysShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [comparedProperties, setComparedProperties] = useState<StayProperty[]>([])
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState(false)
  const [aiInitialPrompt, setAiInitialPrompt] = useState('')

  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Load wishlist from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nutytales_stays_wishlist')
      if (saved) {
        setWishlist(JSON.parse(saved))
      }
    } catch {
      // Ignore
    }
  }, [])

  const toggleWishlist = (slug: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(slug)
      const next = exists ? prev.filter((s) => s !== slug) : [...prev, slug]
      try {
        localStorage.setItem('nutytales_stays_wishlist', JSON.stringify(next))
      } catch {
        // Ignore
      }
      return next
    })
  }

  const isWishlisted = (slug: string) => wishlist.includes(slug)

  const addToCompare = (property: StayProperty) => {
    setComparedProperties((prev) => {
      if (prev.some((p) => p.slug === property.slug)) return prev
      if (prev.length >= 4) {
        alert('You can compare up to 4 properties at a time.')
        return prev
      }
      return [...prev, property]
    })
  }

  const removeFromCompare = (slug: string) => {
    setComparedProperties((prev) => prev.filter((p) => p.slug !== slug))
  }

  const isCompared = (slug: string) => comparedProperties.some((p) => p.slug === slug)
  const clearCompare = () => setComparedProperties([])

  const openAiConcierge = (initialPrompt?: string) => {
    if (initialPrompt) setAiInitialPrompt(initialPrompt)
    setIsAiConciergeOpen(true)
  }

  const closeAiConcierge = () => {
    setIsAiConciergeOpen(false)
    setAiInitialPrompt('')
  }

  return (
    <StaysContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        comparedProperties,
        addToCompare,
        removeFromCompare,
        isCompared,
        clearCompare,
        isAiConciergeOpen,
        openAiConcierge,
        closeAiConcierge,
        aiInitialPrompt,
      }}
    >
      <div className="min-h-screen bg-[#FAF8F5] text-[#17233B] flex flex-col font-sans selection:bg-[#C9A45C]/30 selection:text-[#17233B]">
        {/* ── 1. Top Ribbon ────────────────────────────────────────────────────── */}
        <div className="bg-[#17233B] text-stone-300 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <strong className="tracking-wide">Nuty Tales Stays</strong> — Stay somewhere extraordinary. Experience somewhere real.
            </span>
            <span className="hidden lg:inline text-white/30">•</span>
            <span className="hidden lg:inline text-[#C9A45C]">
              Zero hidden booking fees · 100% Inspected &amp; verified residences
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <button
              type="button"
              onClick={() => openAiConcierge('Find me an extraordinary mountain retreat with private chef and mountain views')}
              className="text-[#C9A45C] hover:text-white font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>✨</span>
              <span>Ask AI Concierge</span>
            </button>
            <span className="text-white/20">|</span>
            <Link href="/stays/hosts" className="hover:text-white transition-colors">
              Become a Host
            </Link>
            <span className="text-white/20">|</span>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                'Hello Nuty Tales Stays Concierge! I would like to inquire about reserving a private stay.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>WhatsApp Concierge</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* ── 2. Primary Navigation Header ─────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2D9] shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Brand Logo */}
              <Link href="/stays" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#17233B] to-[#1E3048] flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform border border-[#C9A45C]/30">
                  <span>🏔️</span>
                </div>
                <div>
                  <div className="font-serif text-xl font-extrabold text-[#17233B] tracking-tight leading-none flex items-center gap-1">
                    <span>Nuty Tales</span>
                    <span className="text-[#C9A45C]">Stays</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] mt-0.5 block">
                    Curated Travel Marketplace
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {STAYS_PRIMARY_NAV.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#17233B] text-white shadow-xs'
                          : 'text-stone-700 hover:text-[#17233B] hover:bg-stone-200/50'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-[#C9A45C] text-[#17233B]">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* User Actions & Shortcuts */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* AI Concierge Quick Trigger */}
                <button
                  type="button"
                  onClick={() => openAiConcierge()}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-[#17233B] to-[#176B68] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95 transition-all"
                  title="Open AI Travel Concierge"
                >
                  <span className="text-amber-300">✨</span>
                  <span>AI Concierge</span>
                </button>

                {/* Wishlist Link */}
                <Link
                  href="/stays/wishlist"
                  className="p-2.5 rounded-xl border border-[#E7E2D9] bg-white hover:bg-stone-50 text-stone-700 relative transition-all"
                  title="Saved Properties"
                >
                  <span className="text-sm">❤️</span>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-[#C9A45C] text-[#17233B] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* My Trips */}
                <Link
                  href="/stays/trips"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E7E2D9] bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-all"
                >
                  <span>🧳</span>
                  <span>Trips</span>
                </Link>

                {/* Host Dashboard Link */}
                <Link
                  href="/stays/dashboard"
                  className="hidden xl:inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E7E2D9] bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold transition-all"
                >
                  <span>📊</span>
                  <span>Dashboard</span>
                </Link>

                {/* Become a Host CTA */}
                <Link
                  href="/stays/hosts"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#C9A45C] hover:bg-[#b89347] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all"
                >
                  <span>Become a Host</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl border border-[#E7E2D9] bg-white text-stone-800"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-b border-[#E7E2D9] px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
              {STAYS_PRIMARY_NAV.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-stone-200 grid grid-cols-2 gap-2">
                <Link
                  href="/stays/trips"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-center rounded-xl bg-stone-100 text-stone-800 text-xs font-bold"
                >
                  🧳 My Trips
                </Link>
                <Link
                  href="/stays/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-center rounded-xl bg-stone-100 text-stone-800 text-xs font-bold"
                >
                  ❤️ Saved ({wishlist.length})
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openAiConcierge()
                }}
                className="w-full py-3 bg-gradient-to-r from-[#17233B] to-[#176B68] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <span>✨</span>
                <span>Open AI Travel Concierge</span>
              </button>
              <Link
                href="/stays/hosts"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl"
              >
                Become a Host / List Property
              </Link>
            </div>
          )}
        </header>

        {/* ── Main Children Content ────────────────────────────────────────────── */}
        <main className="flex-1">{children}</main>

        {/* ── Floating Comparison Dock (Appears when properties are selected) ───── */}
        {comparedProperties.length > 0 && (
          <aside aria-label="Selected Properties Comparison Dock" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#17233B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C9A45C]/40 flex items-center gap-4 animate-slideUp max-w-[95vw]">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">⚖️ Compare ({comparedProperties.length}/4)</span>
              <span className="hidden sm:inline text-xs text-stone-300">properties selected</span>
            </div>
            <div className="flex items-center gap-2">
              {comparedProperties.map((prop) => (
                <div
                  key={prop.slug}
                  className="px-2.5 py-1 bg-white/10 rounded-lg text-[11px] font-semibold flex items-center gap-1.5"
                >
                  <span className="truncate max-w-[100px]">{prop.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCompare(prop.slug)}
                    className="text-stone-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const names = comparedProperties.map((p) => p.name).join(' vs ')
                  openAiConcierge(`Compare these properties side by side: ${names}`)
                }}
                className="px-3.5 py-1.5 bg-[#C9A45C] hover:bg-[#b89347] text-[#17233B] font-bold text-xs rounded-xl shadow-xs"
              >
                Compare Now →
              </button>
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs text-stone-400 hover:text-white underline"
              >
                Clear
              </button>
            </div>
          </aside>
        )}

        {/* ── Stays Footer ────────────────────────────────────────────────────── */}
        <footer className="bg-[#10192A] text-white border-t border-white/10 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏔️</span>
                  <span className="font-serif text-xl font-bold">Nuty Tales Stays</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed max-w-md font-light">
                  Stay somewhere extraordinary. Experience somewhere real. Nuty Tales Stays combines inspected private estates, mountain chalets, and heritage houseboats with seamless local culinary feasts, 4x4 airport transit, and trusted concierge care across Kashmir, Delhi-NCR, Patna, and global gateways.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs text-stone-300">
                  <span className="px-2.5 py-1 bg-white/10 rounded-md">🛡️ 100% Inspected</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded-md">🔒 Anti-Double Booking</span>
                  <span className="px-2.5 py-1 bg-white/10 rounded-md">🧾 18% Corporate GST</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">
                  Explore Stays
                </h4>
                <ul className="space-y-2 text-stone-300">
                  <li><Link href="/stays?discovery=guest_favourites" className="hover:text-white">Guest Favourites</Link></li>
                  <li><Link href="/stays?discovery=mountain_escapes" className="hover:text-white">Mountain &amp; Ski Chalets</Link></li>
                  <li><Link href="/stays?discovery=villas_private" className="hover:text-white">Walnut &amp; Apple Estates</Link></li>
                  <li><Link href="/stays?category=houseboats" className="hover:text-white">Lakefront Cedar Houseboats</Link></li>
                  <li><Link href="/stays?discovery=work_friendly" className="hover:text-white">Executive Remote Work</Link></li>
                  <li><Link href="/stays?discovery=destination_weddings" className="hover:text-white">Wedding &amp; Event Stays</Link></li>
                </ul>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">
                  Curated Services
                </h4>
                <ul className="space-y-2 text-stone-300">
                  <li><Link href="/stays#services-catalogue" className="hover:text-white">4x4 Snow Convoy Transfers</Link></li>
                  <li><Link href="/stays#services-catalogue" className="hover:text-white">Master Wazwan Banquet Chefs</Link></li>
                  <li><Link href="/stays#services-catalogue" className="hover:text-white">Walnut &amp; Saffron Harvest Walks</Link></li>
                  <li><Link href="/stays#services-catalogue" className="hover:text-white">Ski Butler &amp; Gondola Concierge</Link></li>
                  <li><Link href="/stays/group-quote" className="hover:text-white">Private Estate Buyouts</Link></li>
                </ul>
              </div>

              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">
                  Host &amp; Support Desk
                </h4>
                <p className="text-stone-300 leading-relaxed">
                  Dedicated Concierge: +91 9717161809<br />
                  Hospitality Desk: stays@nutytales.com<br />
                  Emergency: 24/7 Guest Assistance
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/stays/hosts" className="text-[#C9A45C] font-bold hover:underline">
                    Host Partner Onboarding →
                  </Link>
                  <Link href="/stays/dashboard" className="text-stone-400 hover:text-white">
                    Host Operations Dashboard →
                  </Link>
                  <Link href="/stays/admin" className="text-stone-400 hover:text-white">
                    Operations Admin Portal →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
              <span>© {new Date().getFullYear()} Nuty Tales Stays. All rights reserved.</span>
              <div className="flex gap-6">
                <Link href="/stays/trips" className="hover:text-white">My Bookings</Link>
                <Link href="/stays/wishlist" className="hover:text-white">Saved Wishlist</Link>
                <Link href="/stays/group-quote" className="hover:text-white">Corporate Offsites</Link>
                <a href="https://nutytales.com" className="hover:text-white">Nuty Tales Group</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </StaysContext.Provider>
  )
}
