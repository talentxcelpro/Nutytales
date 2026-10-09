'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import CountryCurrencyModal from '@/components/global/CountryCurrencyModal'
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/lib/global-config'

const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳',
  AE: '🇦🇪',
  GB: '🇬🇧',
  US: '🇺🇸',
  CA: '🇨🇦',
  AU: '🇦🇺',
  SG: '🇸🇬',
  SA: '🇸🇦',
}

export default function GlobalHeader() {
  const { user, profile, openAuthModal, signOut } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [marketModalOpen, setMarketModalOpen] = useState(false)
  const [activeCountry, setActiveCountry] = useState('IN')
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('INR')
  const [cartCount, setCartCount] = useState(0)

  // Suppress global gateway header when rendering dedicated standalone company shells or subdomains
  const isSubdomain =
    (typeof window !== 'undefined' && /^(business|gifting|weddings|crafts|stays|travel|nri)\./i.test(window.location.hostname)) ||
    (typeof document !== 'undefined' && /nt_active_vertical=(business|gifting|weddings|crafts|stays|travel|nri)/i.test(document.cookie))

  if (
    isSubdomain ||
    pathname?.startsWith('/b2b') ||
    pathname?.startsWith('/gifting') ||
    pathname?.startsWith('/weddings') ||
    pathname?.startsWith('/crafts') ||
    pathname?.startsWith('/stays') ||
    pathname?.startsWith('/travel') ||
    pathname?.startsWith('/nri')
  ) {
    return null
  }

  // Listen for scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Sync market preferences from storage & events
  useEffect(() => {
    const syncMarket = () => {
      try {
        const c = localStorage.getItem('nutytales_country') || 'IN'
        const cur = (localStorage.getItem('nutytales_currency') as CurrencyCode) || 'INR'
        setActiveCountry(c)
        setActiveCurrency(cur)
      } catch {
        // Ignore
      }
    }
    syncMarket()
    window.addEventListener('nt_market_updated', syncMarket)
    return () => window.removeEventListener('nt_market_updated', syncMarket)
  }, [])

  // Sync cart count
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('nt_cart') || '[]')
        const total = stored.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0)
        setCartCount(total)
      } catch {
        setCartCount(0)
      }
    }
    updateCartCount()
    window.addEventListener('nt_cart_updated', updateCartCount)
    window.addEventListener('storage', updateCartCount)
    return () => {
      window.removeEventListener('nt_cart_updated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  const [ecosystemMenuOpen, setEcosystemMenuOpen] = useState(false)

  // Pure Nuty Tales Shop Navigation (The user came to shop)
  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'New', href: '/shop?filter=new' },
    { label: 'Collections', href: '/shop#collections' },
    { label: 'Categories', href: '/shop#categories' },
    { label: 'Bestsellers', href: '/shop?filter=bestsellers' },
    { label: 'Discover', href: '/explore' },
  ]

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.startsWith('/shop?')) return pathname === '/shop'
    if (href.includes('#')) return pathname === '/shop'
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FDFBF7]/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs'
            : 'bg-[#FDFBF7]/70 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Left: Nuty Tales Shop */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-stone-200 p-0.5 shadow-2xs group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.jpg"
                  alt="Nuty Tales Shop"
                  width={36}
                  height={36}
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#17233B]">
                  Nuty Tales
                </span>
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#704B32] -mt-0.5 hidden sm:block">
                  Shop
                </span>
              </div>
            </Link>

            {/* Navigation Center */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs uppercase tracking-widest font-semibold transition-colors py-1 relative ${
                      active
                        ? 'text-[#17233B] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#17233B]'
                        : 'text-stone-600 hover:text-[#17233B]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Actions Right */}
            <div className="flex items-center space-x-3 text-xs">
              {/* Universal Search Link */}
              <Link
                href="/search"
                className="p-2 rounded-xl text-stone-700 hover:text-[#17233B] hover:bg-stone-200/50 transition-colors flex items-center gap-1.5"
                title="Search Nuty Tales"
              >
                <span className="text-base">🔍</span>
                <span className="hidden xl:inline text-xs font-semibold uppercase tracking-wider text-stone-600">
                  Search
                </span>
              </Link>

              {/* Country & Currency Trigger */}
              <button
                type="button"
                onClick={() => setMarketModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-800 transition shadow-2xs flex items-center gap-1.5 text-xs font-semibold"
                title="Select Country & Currency"
              >
                <span>{COUNTRY_FLAGS[activeCountry] || '🌐'}</span>
                <span className="font-mono">{activeCurrency}</span>
              </button>

              {/* Google-style Ecosystem 9-Dots Launcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setEcosystemMenuOpen(!ecosystemMenuOpen)}
                  className="p-2 rounded-xl text-stone-700 hover:text-[#17233B] hover:bg-stone-200/50 transition-colors flex items-center"
                  title="Nuty Tales Products"
                  aria-label="Nuty Tales Products"
                >
                  <svg className="w-4 h-4 fill-current text-stone-600" viewBox="0 0 24 24">
                    <circle cx="5" cy="5" r="2" />
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="19" cy="5" r="2" />
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                    <circle cx="5" cy="19" r="2" />
                    <circle cx="12" cy="19" r="2" />
                    <circle cx="19" cy="19" r="2" />
                  </svg>
                </button>
                {ecosystemMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-white rounded-3xl p-5 shadow-2xl border border-stone-200 w-80 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                          Nuty Tales Products
                        </span>
                        <button
                          onClick={() => setEcosystemMenuOpen(false)}
                          className="text-stone-400 hover:text-stone-700 text-xs font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        {[
                          { name: 'Shop', icon: '🌰', href: '/shop' },
                          { name: 'Business', icon: '🏢', href: '/b2b' },
                          { name: 'Gifting', icon: '🎁', href: '/gifting' },
                          { name: 'Weddings', icon: '💍', href: '/weddings' },
                          { name: 'Crafts', icon: '🧣', href: '/crafts' },
                          { name: 'Stays', icon: '🏔️', href: '/stays' },
                          { name: 'Travel', icon: '✈️', href: '/travel' },
                        ].map((prod) => (
                          <Link
                            key={prod.name}
                            href={prod.href}
                            onClick={() => setEcosystemMenuOpen(false)}
                            className="p-3 rounded-2xl hover:bg-stone-50 transition border border-transparent hover:border-stone-200 flex flex-col items-center gap-1.5"
                          >
                            <span className="text-2xl">{prod.icon}</span>
                            <span className="font-semibold text-stone-800 text-[11px]">{prod.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Trigger */}
              {user ? (
                <div className="relative group hidden sm:block">
                  <button
                    type="button"
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-[#17233B] text-xs font-semibold transition"
                  >
                    {user.photoURL || profile?.avatar_url ? (
                      <img
                        src={user.photoURL || profile?.avatar_url || ''}
                        alt={user.displayName || profile?.name || 'Account'}
                        className="w-5 h-5 rounded-full object-cover border border-stone-300 shadow-2xs"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-[#17233B] text-white flex items-center justify-center text-[10px] font-bold">
                        {(user.displayName || profile?.name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                    <span className="max-w-[100px] truncate font-bold text-[#17233B]">
                      {(user.displayName || profile?.name || user.email?.split('@')[0] || 'Account').split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-stone-500">▾</span>
                  </button>
                  <div className="absolute right-0 top-full pt-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                    <div className="bg-white rounded-2xl p-3 shadow-xl border border-stone-200 w-56 space-y-2 text-xs">
                      <div className="px-2 py-2 border-b border-stone-100 flex items-center gap-2.5">
                        {user.photoURL || profile?.avatar_url ? (
                          <img
                            src={user.photoURL || profile?.avatar_url || ''}
                            alt={user.displayName || profile?.name || 'Account'}
                            className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0 shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#17233B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {(user.displayName || profile?.name || user.email || 'U')[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#17233B] truncate text-xs">
                            {user.displayName || profile?.name || 'Nuty Tales Member'}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {user.email || user.phoneNumber}
                          </p>
                          <span className="inline-block mt-0.5 text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ✓ Verified Member
                          </span>
                        </div>
                      </div>
                      <Link href="/b2b/orders" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-stone-50 font-medium text-stone-700 transition">
                        <span>📦</span>
                        <span>My Orders &amp; Bookings</span>
                      </Link>
                      <button
                        onClick={signOut}
                        className="w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition"
                      >
                        <span>🚪</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="hidden sm:flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-stone-700 hover:text-[#17233B] py-1.5 px-3"
                >
                  <span>Sign In</span>
                </button>
              )}

              {/* Basket Trigger */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('nt_open_cart'))}
                className="relative p-2 rounded-xl text-stone-700 hover:text-[#17233B] hover:bg-stone-200/50 transition flex items-center"
                aria-label="View basket"
              >
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#17233B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-200/50"
                aria-label="Toggle navigation"
              >
                <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-stone-200 px-6 py-6 space-y-4 shadow-xl">
            <nav className="grid grid-cols-2 gap-3 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`p-3 rounded-xl border text-center font-bold uppercase tracking-wider text-xs transition ${
                    isLinkActive(link.href)
                      ? 'bg-[#17233B] text-white border-[#17233B]'
                      : 'bg-white text-stone-800 border-stone-200'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setMarketModalOpen(true)
                }}
                className="flex items-center gap-2 text-xs font-semibold text-stone-700"
              >
                <span>{COUNTRY_FLAGS[activeCountry] || '🌐'}</span>
                <span>Market: {activeCountry} ({activeCurrency})</span>
              </button>

              {user ? (
                <button onClick={signOut} className="text-xs text-rose-600 font-bold">
                  Sign Out
                </button>
              ) : (
                <button onClick={openAuthModal} className="text-xs text-[#17233B] font-bold">
                  Sign In →
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Country & Currency Modal */}
      <CountryCurrencyModal
        isOpen={marketModalOpen}
        onClose={() => setMarketModalOpen(false)}
      />
    </>
  )
}
