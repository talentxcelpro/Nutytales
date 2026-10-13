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
  { label: 'All India Atlas', href: '/india', badge: '15 States' },
  { label: 'Kurtas & Tunics', href: '/#catalog' },
  { label: 'Shawls & Wraps', href: '/shawls-stoles', badge: 'GI Pashmina' },
  { label: 'Pherans & Coats', href: '/pherans' },
  { label: 'Jackets & Vests', href: '/jackets-coats' },
  { label: 'Wholesale & Export', href: '/wholesale', badge: 'B2B' },
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
    if (href === '/') {
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

      {/* ── Crafts Top Speed & Provenance Ribbon ──────────────────────────────── */}
      <div className="bg-[#10192A] text-stone-200 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse" />
            <span className="font-bold">Nuty Tales Crafts</span> — All-India Handlooms &amp; Heritage Apparel
          </span>
          <span className="hidden lg:inline text-white/30">•</span>
          <span className="hidden lg:inline text-[#C9A45C]">
            Pan-India GI Clusters · 100% Single-Origin Weaves · Insured Pan-India &amp; Global Air Freight
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {/* Live Speed Telemetry Badge */}
          <SpeedTelemetryHUD />

          {/* Global Currency Selector (Compact with 200% inflation notice) */}
          <CraftCurrencySelector variant="compact" />

          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales Crafts! I am inquiring about all-India GI handlooms, custom artisan tailoring, and heritage fashion.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A45C] font-bold hover:underline flex items-center gap-1 hidden sm:flex"
          >
            <span>Artisan Concierge</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Crafts Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-[#17233B] flex items-center justify-center text-white font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                <span>🇮🇳</span>
              </div>
              <div>
                <span className="font-serif text-xl font-extrabold text-[#17233B] tracking-tight block">
                  Nuty Tales <span className="text-[#C9A45C]">Crafts</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                  Pan-India Handlooms · GI Certified Weaves
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {CRAFTS_NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.label}
                    href={getLinkHref(link.href)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1 ${
                      active
                        ? 'bg-[#17233B] text-white shadow-xs'
                        : 'text-stone-700 hover:text-[#17233B] hover:bg-stone-200/50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          active
                            ? 'bg-[#C9A45C] text-[#17233B]'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Action Buttons: Instant Search, Wishlist, Bag, Wholesale */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Instant Search Bar Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-stone-200/60 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Instant Search across All-India Crafts (Press /)"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">Search</span>
                <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-stone-300 font-mono text-stone-500">
                  /
                </span>
              </button>

              {/* Wishlist Indicator */}
              <Link
                href={getLinkHref('/#catalog')}
                className="relative p-2.5 rounded-xl bg-stone-200/60 hover:bg-stone-200 text-stone-700 text-sm transition-colors"
                title="Saved to Wishlist"
              >
                <span>♥</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Drawer Trigger */}
              <button
                type="button"
                onClick={handleOpenCart}
                className="relative px-3.5 py-2.5 bg-[#17233B] hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
                title="Open Shopping Bag"
              >
                <span>🛍️</span>
                <span className="hidden sm:inline">Bag</span>
                <span className="w-5 h-5 rounded-full bg-[#C9A45C] text-[#17233B] text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

              {/* Global Currency Selector (Header Pill) */}
              <div className="hidden sm:block">
                <CraftCurrencySelector variant="header" />
              </div>

              {/* Wholesale Desk Link */}
              <Link
                href={getLinkHref('/wholesale')}
                className="hidden xl:flex px-3 py-2 bg-white border border-stone-300 hover:border-[#C9A45C] text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs items-center gap-1"
              >
                <span>🌍 B2B Export</span>
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl border border-stone-200 text-stone-700"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-2">
            {CRAFTS_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={getLinkHref(link.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                {link.label} {link.badge && `(${link.badge})`}
              </Link>
            ))}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-600">Currency:</span>
              <CraftCurrencySelector variant="header" />
            </div>
            <Link
              href={getLinkHref('/wholesale')}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl mt-2"
            >
              Wholesale &amp; Export Desk
            </Link>
          </div>
        )}
      </header>

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
