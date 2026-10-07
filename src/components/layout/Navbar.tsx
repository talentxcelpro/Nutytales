'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'

import CartDrawer from '@/components/cart/CartDrawer'

const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Business Supply', href: '/business-supply' },
  { label: 'Founders', href: '/founders', badge: 'Program' },
  { label: 'Gifting', href: '/gifting' },
  { label: 'Weddings', href: '/weddings', badge: 'Bespoke' },
  { label: 'Crafts', href: '/crafts', badge: "FW '26" },
  { label: 'Stays', href: '/stays' },
  { label: 'Travel', href: '/travel/kashmir' },
]

export default function Navbar() {
  const { user, profile, openAuthModal, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  // Suppress consumer retail navbar when rendering dedicated standalone company shells or subdomains
  const isSubdomain =
    (typeof window !== 'undefined' && /^(business|gifting|weddings|crafts|stays|travel)\./i.test(window.location.hostname)) ||
    (typeof document !== 'undefined' && /nt_active_vertical=(business|gifting|weddings|crafts|stays|travel)/i.test(document.cookie))

  if (
    isSubdomain ||
    pathname?.startsWith('/b2b') ||
    pathname?.startsWith('/gifting') ||
    pathname?.startsWith('/weddings') ||
    pathname?.startsWith('/crafts') ||
    pathname?.startsWith('/stays') ||
    pathname?.startsWith('/travel')
  ) {
    return null
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F7F2E8]/95 backdrop-blur-md shadow-sm border-b border-[#17233B]/10'
            : 'bg-[#F7F2E8]/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Left */}
            <Link href="/" className="flex items-center gap-3.5 group flex-shrink-0">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-[#17233B]/10 bg-white p-0.5 flex-shrink-0 shadow-sm">
                <Image
                  src="/images/logo.jpg"
                  alt="Nuty Tales"
                  width={44}
                  height={44}
                  priority
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#17233B] group-hover:text-[#176B68] transition-colors leading-none">
                  Nuty Tales
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#704B32] font-medium mt-1">
                  Taste · Gift · Wear · Stay · Explore
                </span>
              </div>
            </Link>

            {/* Navigation Center */}
            <nav className="hidden xl:flex items-center space-x-6">
              {NAV_LINKS.map((link) => {
                const isCrafts = link.href === '/crafts'
                return (
                  <div key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      className={`text-[11px] uppercase tracking-widest font-semibold transition-colors py-1 relative flex items-center gap-1.5 ${
                        isActive(link.href)
                          ? 'text-[#176B68] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#176B68]'
                          : 'text-[#17233B]/80 hover:text-[#176B68]'
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="bg-[#C9A45C] text-[#17233B] text-[8px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-normal">
                          {link.badge}
                        </span>
                      )}
                    </Link>

                    {/* Crafts & Heritage Clothing Mega Dropdown */}
                    {isCrafts && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50">
                        <div className="bg-white rounded-2xl p-5 shadow-2xl border border-stone-200 w-80 space-y-3">
                          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                              Fall / Winter 2026 Collection
                            </span>
                            <span className="text-[9px] font-extrabold bg-[#C9A45C] text-[#17233B] px-1.5 py-0.2 rounded">
                              FW '26
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <Link href="/crafts/women" className="text-stone-700 hover:text-[#176B68] font-bold">Women</Link>
                            <Link href="/crafts/men" className="text-stone-700 hover:text-[#176B68] font-bold">Men</Link>
                            <Link href="/crafts/kids" className="text-stone-700 hover:text-[#176B68] font-bold">Kids &amp; Family</Link>
                            <Link href="/crafts/pherans" className="text-stone-700 hover:text-[#176B68] font-bold">Pherans</Link>
                            <Link href="/crafts/shawls-stoles" className="text-stone-700 hover:text-[#176B68] font-bold">Shawls &amp; Stoles</Link>
                            <Link href="/crafts/jackets-coats" className="text-stone-700 hover:text-[#176B68] font-bold">Jackets &amp; Coats</Link>
                            <Link href="/crafts/winter-wear" className="text-stone-700 hover:text-[#176B68] font-bold">Winter Wear</Link>
                            <Link href="/crafts/accessories" className="text-stone-700 hover:text-[#176B68] font-bold">Accessories</Link>
                            <Link href="/crafts/heritage-home" className="text-stone-700 hover:text-[#176B68] font-bold col-span-2 pt-1 border-t border-stone-100">Heritage Home &amp; Keepsakes →</Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* Actions Right */}
            <div className="hidden md:flex items-center space-x-4 text-xs uppercase tracking-wider font-semibold text-[#17233B]">
              <Link
                href="/crafts/try-with-si"
                className="text-[#704B32] hover:text-[#176B68] transition-colors flex items-center gap-1"
                title="Try on clothing with SI"
              >
                <span>✨</span>
                <span>Try with SI</span>
              </Link>

              {/* User Profile / Sign In */}
              {user ? (
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-[#17233B] text-[11px] font-bold normal-case transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#17233B] text-white flex items-center justify-center text-[10px]">
                      {profile?.name ? profile.name[0].toUpperCase() : '👤'}
                    </span>
                    <span className="max-w-[90px] truncate">
                      {profile?.name || user.displayName || user.phoneNumber || 'Account'}
                    </span>
                    <span className="text-[9px]">▾</span>
                  </button>
                  <div className="absolute right-0 top-full pt-1.5 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all z-50">
                    <div className="bg-white rounded-2xl p-3 shadow-xl border border-stone-200 w-48 space-y-1 text-xs">
                      <div className="px-2 py-1 border-b border-stone-100">
                        <p className="font-bold text-[#17233B] truncate">{profile?.name || 'Nuty Tales Member'}</p>
                        <p className="text-[10px] text-stone-500 truncate">{user.email || user.phoneNumber}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-2 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-semibold"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-[#17233B] hover:text-[#176B68] flex items-center gap-1.5 transition-colors"
                >
                  <span>👤</span>
                  <span>Sign In</span>
                </button>
              )}

              {/* Shopping Basket Button with Live Counter */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('nt_open_cart'))}
                className="relative p-2 rounded-xl text-[#17233B] hover:text-[#176B68] hover:bg-black/5 transition-colors flex items-center gap-1.5 font-bold"
                aria-label="Shopping Basket"
              >
                <span className="text-lg">🛒</span>
                {cartCount > 0 ? (
                  <span className="bg-[#176B68] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm leading-none">
                    {cartCount}
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-500 font-semibold lowercase">basket</span>
                )}
              </button>

              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#176B68] hover:bg-[#125350] text-white rounded-md text-[11px] font-semibold tracking-wider uppercase transition-colors whitespace-nowrap"
              >
                +91 9717161809
              </a>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-3 xl:hidden">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('nt_open_cart'))}
                className="relative p-1 text-xl"
                aria-label="Shopping Basket"
              >
                <span>🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#176B68] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-[#17233B] text-2xl focus:outline-none p-1"
                aria-label="Toggle menu"
              >
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="xl:hidden bg-[#F7F2E8] border-b border-[#17233B]/10 px-6 py-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            <nav className="space-y-3 text-sm font-semibold tracking-wide text-[#17233B]">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="space-y-1">
                  <Link
                    href={link.href}
                    className="flex items-center justify-between py-2 border-b border-[#17233B]/5 hover:text-[#176B68]"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="bg-[#C9A45C] text-[#17233B] text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>

                  {link.href === '/crafts' && (
                    <div className="grid grid-cols-2 gap-2 pl-3 py-1.5 text-xs text-stone-600 border-b border-[#17233B]/5 font-normal">
                      <Link href="/crafts/women" className="hover:text-[#176B68]">• Women</Link>
                      <Link href="/crafts/men" className="hover:text-[#176B68]">• Men</Link>
                      <Link href="/crafts/kids" className="hover:text-[#176B68]">• Kids &amp; Family</Link>
                      <Link href="/crafts/pherans" className="hover:text-[#176B68]">• Pherans</Link>
                      <Link href="/crafts/shawls-stoles" className="hover:text-[#176B68]">• Shawls &amp; Stoles</Link>
                      <Link href="/crafts/jackets-coats" className="hover:text-[#176B68]">• Jackets &amp; Coats</Link>
                      <Link href="/crafts/winter-wear" className="hover:text-[#176B68]">• Winter Wear</Link>
                      <Link href="/crafts/accessories" className="hover:text-[#176B68]">• Accessories</Link>
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/crafts/try-with-si"
                className="block py-2 border-b border-[#17233B]/5 text-[#176B68] font-bold"
              >
                ✨ Try with SI Studio
              </Link>
              <Link
                href="/wholesale-dry-fruits"
                className="block py-2 border-b border-[#17233B]/5 hover:text-[#176B68]"
              >
                Wholesale Portal
              </Link>
              <Link
                href="/bulk-quote"
                className="block py-2 border-b border-[#17233B]/5 hover:text-[#176B68]"
              >
                Request Bulk Quote
              </Link>

              {/* Mobile Auth button */}
              {user ? (
                <div className="py-2.5 border-b border-[#17233B]/10 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-[#17233B]">
                      {profile?.name || user.displayName || 'Member'}
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      {user.email || user.phoneNumber}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    openAuthModal()
                  }}
                  className="w-full text-left py-2.5 border-b border-[#17233B]/10 text-xs font-bold uppercase tracking-wider text-[#17233B] hover:text-[#176B68] flex items-center gap-2"
                >
                  <span>👤</span>
                  <span>Sign In / Register</span>
                </button>
              )}
            </nav>
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-[#176B68] text-white text-center rounded-md font-semibold text-xs uppercase tracking-wider"
              >
                WhatsApp Concierge (+91 9717161809)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Floating subtle WhatsApp button */}
      <a
        href={`https://wa.me/${whatsappPhone}`}
        aria-label="WhatsApp Concierge"
        className="fixed bottom-6 right-6 z-50 w-13 h-13 bg-[#176B68] hover:bg-[#125350] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 border border-white/40"
      >
        <span className="text-xl">💬</span>
      </a>

      {/* Global Slide-Over Shopping Basket Drawer */}
      <CartDrawer />
    </>
  )
}
