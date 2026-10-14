'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import CartDrawer from '@/components/cart/CartDrawer'
import InstantSearchModal from '@/components/crafts/InstantSearchModal'
import SpeedTelemetryHUD from '@/components/crafts/SpeedTelemetryHUD'
import CraftCurrencySelector from '@/components/crafts/CraftCurrencySelector'

const CRAFTS_NAV_LINKS = [
  { label: 'MEN', href: '/men', queryParam: 'gender=men' },
  { label: 'WOMEN', href: '/women', queryParam: 'gender=women' },
  { label: 'SAREES & LEHENGAS', href: '/#catalog', queryParam: 'category=sarees' },
  { label: 'SHAWLS & DUPATTAS', href: '/shawls-stoles', badge: 'GI Pashmina' },
  { label: '15 STATES ATELIER', href: '/india', badge: '15 States' },
  { label: 'GI CERTIFIED', href: '/#catalog', badge: 'GI Tag', isGi: true },
  { label: '✨ AI STUDIO', href: '/try-with-si', badge: 'TRY-ON', isSpecial: true },
]

export default function CraftsShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Sync cart & wishlist item counts
  const syncCounts = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const totalCart = Array.isArray(cart) ? cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) : 0
      setCartCount(totalCart)

      const wish = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
      setWishlistCount(Array.isArray(wish) ? wish.length : 0)
    } catch {
      setCartCount(0)
      setWishlistCount(0)
    }
  }

  useEffect(() => {
    syncCounts()

    const handleCartUpdate = () => syncCounts()
    const handleWishlistUpdate = () => syncCounts()

    window.addEventListener('nt_cart_updated', handleCartUpdate)
    window.addEventListener('nt_wishlist_updated', handleWishlistUpdate)

    // Global keyboard shortcut: '/' or 'Ctrl+K' opens instant search
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('nt_cart_updated', handleCartUpdate)
      window.removeEventListener('nt_wishlist_updated', handleWishlistUpdate)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleOpenCart = () => {
    window.dispatchEvent(new Event('nt_open_cart'))
  }

  const isLinkActive = (href: string) => {
    if (href === '/' || href === '/#catalog') {
      return pathname === '/crafts' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/crafts/, '') || '/'
    return cleanPath === href || cleanPath.startsWith(href)
  }

  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/crafts')) {
      return href === '/' ? '/crafts' : `/crafts${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#17233B] flex flex-col font-sans">
      {/* ── Global Slide-out Drawers & Modals ─────────────────────────────────── */}
      <CartDrawer />
      <InstantSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* ── Unified Sticky Header (Zero Overlap, Pure Myntra Experience) ─────── */}
      <div className="sticky top-0 z-40 shadow-xs">
        {/* ── Top Micro Announcement Strip ── */}
        <div className="bg-[#10192A] text-stone-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse" />
              <span className="font-bold tracking-wide">NUTY TALES CRAFTS</span>
              <span className="text-white/40 hidden sm:inline">|</span>
              <span className="hidden sm:inline text-stone-300 font-normal">🚚 Complimentary Insured Shipping Pan-India &bull; 100% Single-Origin Handlooms</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-stone-300 font-medium hidden md:inline">Use code <strong className="text-[#C9A45C]">HERITAGE10</strong> for 10% Off</span>
            <span className="text-white/20 hidden md:inline">|</span>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                'Hello Nuty Tales Crafts! I am inquiring about all-India GI handlooms, custom artisan tailoring, and heritage fashion.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A45C] font-semibold hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>Artisan Concierge</span>
              <span>&rarr;</span>
            </a>
          </div>
        </div>

        {/* ── Main Myntra-Style Navigation Bar ── */}
        <header className="bg-white/95 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-18 gap-2 lg:gap-4">
              
              {/* Left: Brand Identity */}
              <Link href={getLinkHref('/')} className="flex items-center gap-2.5 flex-shrink-0 group">
                <div className="w-10 h-10 rounded-xl bg-[#17233B] flex items-center justify-center text-white font-serif text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
                  <span>🇮🇳</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif text-lg sm:text-xl font-extrabold text-[#17233B] tracking-tight">
                      Nuty Tales
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C9A45C] text-[#17233B]">
                      Crafts
                    </span>
                  </div>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#704B32] block -mt-0.5">
                    Pan-India Handlooms &bull; GI Tagged
                  </span>
                </div>
              </Link>

              {/* Center: Myntra High-Level Categories */}
              <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
                {CRAFTS_NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.href)
                  return (
                    <Link
                      key={link.label}
                      href={getLinkHref(link.href)}
                      className={`px-2.5 py-2 text-[12px] font-bold tracking-wider uppercase transition-all relative flex items-center gap-1.5 rounded-lg group ${
                        active
                          ? 'text-[#17233B] font-extrabold'
                          : 'text-stone-700 hover:text-[#17233B] hover:bg-stone-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span
                          className={`text-[8px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                            link.isSpecial
                              ? 'bg-rose-500 text-white animate-pulse'
                              : link.isGi
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : active
                              ? 'bg-[#C9A45C] text-[#17233B]'
                              : 'bg-stone-100 text-stone-600 border border-stone-200'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                      {active && (
                        <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#C9A45C] rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Center-Right: Myntra-Style Full Search Input */}
              <div className="flex-1 max-w-xs sm:max-w-sm hidden md:block">
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(true)}
                  className="w-full h-10 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 border border-stone-200 text-stone-500 text-xs flex items-center justify-between transition-colors text-left"
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-stone-400">🔍</span>
                    <span className="truncate">Search for handlooms, sarees, kurtas, crafts...</span>
                  </span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-stone-300 font-mono text-stone-400">
                    /
                  </span>
                </button>
              </div>

              {/* Right: Actions (Wishlist, Bag, Currency, B2B) */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Search icon button for mobile */}
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(true)}
                  className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100 text-base"
                  aria-label="Search"
                >
                  🔍
                </button>

                {/* Wishlist Button */}
                <Link
                  href={getLinkHref('/#catalog')}
                  className="relative p-2 sm:px-3 sm:py-2 rounded-xl hover:bg-stone-100 text-stone-700 text-xs font-semibold flex flex-col sm:flex-row items-center gap-1 transition-colors"
                  title="Wishlist"
                >
                  <span className="text-base sm:text-sm">♥</span>
                  <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-wider">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Bag Button */}
                <button
                  type="button"
                  onClick={handleOpenCart}
                  className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-[#17233B] hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                  title="Bag"
                >
                  <span className="text-sm">🛍️</span>
                  <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider">Bag</span>
                  <span className="w-4 h-4 rounded-full bg-[#C9A45C] text-[#17233B] text-[9px] font-extrabold flex items-center justify-center">
                    {cartCount}
                  </span>
                </button>

                {/* Global Multi-Currency Dropdown */}
                <div className="hidden sm:block">
                  <CraftCurrencySelector variant="header" />
                </div>

                {/* Wholesale B2B Desk */}
                <Link
                  href={getLinkHref('/wholesale')}
                  className="hidden xl:flex px-3 py-1.5 bg-stone-50 border border-stone-200 hover:border-[#C9A45C] text-stone-700 hover:text-stone-900 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors items-center gap-1"
                >
                  <span>🌍 B2B Desk</span>
                </Link>

                {/* Mobile Menu Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm"
                  aria-label="Toggle navigation"
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav Drawer */}
          {mobileMenuOpen && (
            <div className="xl:hidden bg-white border-t border-stone-200 px-4 py-3 space-y-1">
              {CRAFTS_NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={getLinkHref(link.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-[#17233B] flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C9A45C]/20 text-[#17233B] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </header>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Dedicated All-India Crafts Footer ─────────────────────────────────── */}
      <footer className="bg-[#10192A] text-white border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇮🇳</span>
                <span className="font-serif text-xl font-bold">Nuty Tales Crafts</span>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
                The world’s first fastest crafts e-commerce platform. Evidence-backed GI provenance connecting 15 Indian state weaver cooperatives directly to discerning wardrobes and global boutiques. 68% of retail price flows directly to master artisans with zero intermediaries.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] text-stone-400">
                <span className="px-2 py-0.5 rounded bg-white/10 text-[#C9A45C] font-mono">⚡ 0.8ms In-Memory Engine</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-mono">100% GI Traceable</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Pan-India Clusters</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Kashmir (Pashmina &amp; Tilla Pherans)</li>
                <li>Gujarat (Kutch Ajrakh &amp; Patan Patola)</li>
                <li>Rajasthan (Bagru Indigo &amp; Kota Doria)</li>
                <li>Uttar Pradesh (Chikankari &amp; Banarasi)</li>
                <li>Madhya Pradesh (Chanderi &amp; Maheshwari)</li>
                <li>Northeast (Assam Eri Silk &amp; Naga Weaves)</li>
                <li>South (Pochampally Ikat &amp; Kanchipuram)</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Provenance &amp; Speed</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Government GI Registry Certificates</li>
                <li>Transparent 68% Weaver Remuneration</li>
                <li>100% Pure Natural Fibers &amp; Dyes</li>
                <li>Sub-2ms In-Memory Catalog Filter</li>
                <li>1-Click Express WhatsApp Checkout</li>
                <li>Complimentary Swatch Testing Kit</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Artisan Desk &amp; Export</h4>
              <p className="text-stone-400 leading-relaxed">
                Email: crafts@nutytales.com<br />
                Artisan Helpline: +91 9717161809<br />
                Export Hubs: Srinagar · Jaipur · Varanasi · Hyderabad<br />
                Global Customs: DHL Express Insured Air Freight
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
                  A Nuty Tales Enterprise
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <span>© {new Date().getFullYear()} Nuty Tales Crafts. World&apos;s Fastest All-India Crafts Platform. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href={getLinkHref('/india')} className="hover:text-white">Craft Atlas</Link>
              <Link href={getLinkHref('/wholesale')} className="hover:text-white">Wholesale Desk</Link>
              <Link href={getLinkHref('/dashboard')} className="hover:text-white">Artisan Dashboard</Link>
              <a href="https://www.nutytales.com" className="hover:text-white">Nuty Tales Gateway</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
