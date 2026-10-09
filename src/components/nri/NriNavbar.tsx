'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', label: 'British Pound', flag: '🇬🇧' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'EUR', symbol: '€', label: 'Euro', flag: '🇪🇺' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee', flag: '🇮🇳' },
]

export default function NriNavbar() {
  const pathname = usePathname()
  const { user, profile, openAuthModal, signOut } = useAuth()
  const [currency, setCurrency] = useState('USD')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyDropdown, setCurrencyDropdown] = useState(false)
  const [moreDropdown, setMoreDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const currencyRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nt_nri_currency')
      if (saved) setCurrency(saved)
    } catch {
      // Ignore
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setCurrencyDropdown(false)
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeCurrency = (code: string) => {
    setCurrency(code)
    try {
      localStorage.setItem('nt_nri_currency', code)
    } catch {
      // Ignore
    }
    setCurrencyDropdown(false)
  }

  const currentCurrencyObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm border-b border-[#EAE6DF]'
          : 'bg-[#FAF9F6] border-b border-[#EAE6DF]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Editorial Title */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1 border border-stone-200 shadow-sm group-hover:border-[#C5A059] transition-all">
              <Image
                src="/images/logo.jpg"
                alt="Nuty Tales NRI"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#191919]">
                  Nuty Tales
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-[#F3EFE6] text-[#8C6D2D] border border-[#E5DEC9]">
                  NRI
                </span>
              </div>
              <span className="text-[11px] tracking-normal text-stone-500 font-light block mt-0.5">
                India, handled. From anywhere.
              </span>
            </div>
          </Link>

          {/* Desktop Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/#discovery"
              className="px-3.5 py-2 rounded-full text-sm font-medium text-stone-700 hover:text-[#191919] hover:bg-[#F3EFE6] transition-colors"
            >
              Explore
            </Link>

            <Link
              href="/services"
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === '/services' || pathname?.startsWith('/services/')
                  ? 'text-[#8C6D2D] bg-[#F3EFE6] font-semibold'
                  : 'text-stone-700 hover:text-[#191919] hover:bg-[#F3EFE6]'
              }`}
            >
              Services
            </Link>

            <Link
              href="/marketplace"
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                pathname === '/marketplace'
                  ? 'text-[#8C6D2D] bg-[#F3EFE6] font-semibold'
                  : 'text-stone-700 hover:text-[#191919] hover:bg-[#F3EFE6]'
              }`}
            >
              Marketplace
            </Link>

            <Link
              href="/dashboard"
              className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/dashboard'
                  ? 'text-[#8C6D2D] bg-[#F3EFE6] font-semibold'
                  : 'text-stone-700 hover:text-[#191919] hover:bg-[#F3EFE6]'
              }`}
            >
              <span>🏛️</span>
              <span>My India</span>
            </Link>

            {/* Compact 'More' Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreDropdown(!moreDropdown)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  moreDropdown ? 'text-[#191919] bg-[#F3EFE6]' : 'text-stone-600 hover:text-[#191919] hover:bg-[#F3EFE6]'
                }`}
              >
                <span>More</span>
                <span className="text-[10px] opacity-60">▼</span>
              </button>

              {moreDropdown && (
                <div className="absolute left-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <Link
                    href="/how-it-works"
                    onClick={() => setMoreDropdown(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF9F6] hover:text-[#8C6D2D] transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/providers"
                    onClick={() => setMoreDropdown(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF9F6] hover:text-[#8C6D2D] transition-colors"
                  >
                    Become a Provider
                  </Link>
                  <Link
                    href="/business"
                    onClick={() => setMoreDropdown(false)}
                    className="block px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF9F6] hover:text-[#8C6D2D] transition-colors"
                  >
                    Enterprise & Family Offices
                  </Link>
                  <div className="border-t border-stone-100 my-1" />
                  <Link
                    href="/emergency"
                    onClick={() => setMoreDropdown(false)}
                    className="flex items-center justify-between px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                  >
                    <span>24/7 Emergency Desk</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-100 text-rose-700 font-bold">SOS</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency & Country Selector */}
            <div className="relative hidden sm:block" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium border border-stone-200 transition-colors shadow-2xs"
                title="Select Overseas Currency"
              >
                <span>{currentCurrencyObj.flag}</span>
                <span className="font-semibold text-stone-900">{currency}</span>
                <span className="text-[9px] text-stone-400">▼</span>
              </button>

              {currencyDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-1.5 text-[10px] uppercase tracking-wider text-stone-400 font-bold border-b border-stone-100">
                    Settlement Currency
                  </div>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => changeCurrency(c.code)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-stone-50 transition-colors ${
                        currency === c.code ? 'text-[#8C6D2D] font-bold bg-[#FAF9F6]' : 'text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                      </span>
                      <span className="text-stone-400 font-mono text-[11px]">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Provider Onboarding Link (Desktop) */}
            <Link
              href="/providers"
              className="hidden xl:inline text-xs font-medium text-stone-600 hover:text-stone-900 px-2 py-1.5 transition-colors"
            >
              Become a Provider
            </Link>

            {/* User Account / Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="w-9 h-9 rounded-full bg-[#191919] text-[#FAF9F6] flex items-center justify-center font-bold text-xs border border-stone-300 shadow-sm hover:scale-105 transition-transform"
                  title={user.email || 'My India Account'}
                >
                  {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="hidden md:inline text-xs text-stone-500 hover:text-stone-800 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="hidden sm:inline px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Primary Action Button: Apple-grade Pill CTA */}
            <Link
              href="/#search-bar"
              className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold bg-[#191919] text-white hover:bg-[#333333] transition-all hover:shadow-md flex items-center gap-1.5 shadow-sm"
            >
              <span>Get Started</span>
              <span className="text-stone-400">→</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white border border-stone-200 text-stone-800 flex items-center justify-center text-base hover:bg-stone-50 transition-colors ml-1"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn">
          <nav className="space-y-1">
            <Link
              href="/#discovery"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              <span>Explore Marketplace</span>
              <span className="text-xs text-stone-400">Browse →</span>
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              <span>All 11 Service Verticals</span>
              <span className="text-xs text-stone-400">Directory →</span>
            </Link>
            <Link
              href="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              <span>Request for Quotation (RFQ)</span>
              <span className="text-xs text-stone-400">Hubs →</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              <span>My India Operating Dashboard</span>
              <span>🏛️</span>
            </Link>
            <Link
              href="/providers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              Become a Provider / Partner
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-stone-800 hover:bg-stone-50"
            >
              How It Works & Proof Protocol
            </Link>
            <Link
              href="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-rose-700 hover:bg-rose-50"
            >
              <span>Emergency 24/7 Desk</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-100 text-rose-800 font-bold">SOS</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {/* Mobile Currency Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-stone-50 rounded-xl">
              <span className="text-xs text-stone-600 font-medium">Currency</span>
              <div className="flex gap-1 overflow-x-auto py-1">
                {CURRENCIES.slice(0, 5).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => changeCurrency(c.code)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      currency === c.code ? 'bg-[#191919] text-white' : 'text-stone-600 bg-white border border-stone-200'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/#search-bar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-full bg-[#191919] text-white text-center font-semibold text-xs shadow-sm"
            >
              Get Started with a Request
            </Link>

            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openAuthModal()
                }}
                className="w-full py-2.5 text-stone-700 text-xs font-semibold hover:text-stone-900"
              >
                Sign In to Account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
                className="w-full py-2.5 text-stone-500 text-xs font-medium"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
