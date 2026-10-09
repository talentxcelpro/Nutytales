'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP)', flag: '🇬🇧' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)', flag: '🇦🇪' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (CAD)', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (AUD)', flag: '🇦🇺' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (SGD)', flag: '🇸🇬' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)', flag: '🇪🇺' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)', flag: '🇮🇳' },
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

  // Close dropdowns on outside click
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
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#0B111D]/95 backdrop-blur-md shadow-xl border-b border-[#C9A45C]/20'
          : 'bg-[#0E1524] border-b border-white/10'
      }`}
    >
      {/* ── Compact Operational Status Bar ── */}
      <div className="bg-[#0A0E18] px-4 py-1 text-[11px] text-stone-300 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-light text-stone-300 hidden sm:inline">
              Operations Hubs Active: Srinagar, Delhi NCR, Mumbai, Bengaluru & Chandigarh
            </span>
            <span className="font-light text-stone-300 sm:hidden">
              On-Ground Hubs Active Across India
            </span>
          </div>

          <Link
            href="/emergency"
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>24/7 Emergency Desk</span>
          </Link>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-white p-0.5 border border-[#C9A45C]/50 shadow-sm group-hover:border-[#C9A45C] transition-colors flex-shrink-0">
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
                <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                  Nuty Tales
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-extrabold tracking-widest bg-gradient-to-r from-[#C9A45C] to-[#E5C178] text-[#0E1524]">
                  NRI
                </span>
              </div>
              <span className="text-[10px] tracking-normal text-stone-400 font-light block mt-0.5">
                India, handled. From anywhere in the world.
              </span>
            </div>
          </Link>

          {/* Desktop Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/services"
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                pathname === '/services' || pathname?.startsWith('/services/')
                  ? 'text-[#C9A45C] bg-white/5'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Services
            </Link>

            <Link
              href="/marketplace"
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                pathname === '/marketplace'
                  ? 'text-[#C9A45C] bg-white/5'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Marketplace
            </Link>

            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/dashboard'
                  ? 'text-[#C9A45C] bg-white/5'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
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
                className={`px-2.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-1 ${
                  moreDropdown ? 'text-white bg-white/10' : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>More</span>
                <span className="text-[9px] opacity-70">▼</span>
              </button>

              {moreDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-[#131B2C] border border-white/10 rounded-2xl shadow-2xl py-1.5 z-50 backdrop-blur-xl animate-fadeIn">
                  <Link
                    href="/how-it-works"
                    onClick={() => setMoreDropdown(false)}
                    className="block px-3.5 py-2 text-xs text-stone-300 hover:text-[#C9A45C] hover:bg-white/5 transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="/providers"
                    onClick={() => setMoreDropdown(false)}
                    className="block px-3.5 py-2 text-xs text-stone-300 hover:text-[#C9A45C] hover:bg-white/5 transition-colors"
                  >
                    For Service Providers
                  </Link>
                  <Link
                    href="/business"
                    onClick={() => setMoreDropdown(false)}
                    className="block px-3.5 py-2 text-xs text-stone-300 hover:text-[#C9A45C] hover:bg-white/5 transition-colors"
                  >
                    Enterprise & Family Offices
                  </Link>
                  <div className="border-t border-white/10 my-1" />
                  <Link
                    href="/emergency"
                    onClick={() => setMoreDropdown(false)}
                    className="flex items-center justify-between px-3.5 py-2 text-xs text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <span>Emergency 24/7</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500 text-white font-bold">SOS</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative hidden sm:block" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 transition-colors"
                title="Select Settlement Currency"
              >
                <span>{currentCurrencyObj.flag}</span>
                <span className="font-mono text-[11px]">{currency}</span>
                <span className="text-[9px] text-stone-400">▼</span>
              </button>

              {currencyDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#131B2C] border border-white/10 rounded-2xl shadow-2xl py-1 z-50 backdrop-blur-xl animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-stone-400 font-semibold border-b border-white/10">
                    Settlement Currency
                  </div>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => changeCurrency(c.code)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                        currency === c.code ? 'text-[#C9A45C] font-bold' : 'text-stone-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{c.flag}</span>
                        <span>{c.code}</span>
                      </span>
                      <span className="text-stone-400 font-mono text-[11px]">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Auth / Sign In */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/dashboard"
                  className="w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center font-bold text-xs border border-[#C9A45C]/50 hover:scale-105 transition-transform"
                  title={user.email || 'My India Command Center'}
                >
                  {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="hidden lg:inline text-xs text-stone-400 hover:text-stone-200 transition-colors px-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="hidden sm:inline px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Signature Primary CTA */}
            <Link
              href="/#request-engine"
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] hover:shadow-lg hover:shadow-[#C9A45C]/25 transition-all hover:scale-[1.02] flex items-center gap-1.5 shadow-md flex-shrink-0"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">Get Something Done</span>
              <span className="sm:hidden">Get Done</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center text-lg hover:bg-white/10 transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B111D] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="space-y-1">
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-200 hover:bg-white/5"
            >
              <span>Services Directory</span>
              <span className="text-xs text-stone-400">11 Verticals →</span>
            </Link>
            <Link
              href="/marketplace"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-200 hover:bg-white/5"
            >
              <span>Provider Marketplace (RFQ)</span>
              <span className="text-xs text-stone-400">Vetted Hubs →</span>
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-stone-200 hover:bg-white/5"
            >
              <span>My India Operating Dashboard</span>
              <span>🏛️</span>
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-stone-200 hover:bg-white/5"
            >
              How It Works & Proof Protocol
            </Link>
            <Link
              href="/providers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-stone-200 hover:bg-white/5"
            >
              For Providers & Partners
            </Link>
            <Link
              href="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10"
            >
              <span>🚨 24/7 Emergency Assistance</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-rose-500 text-white font-bold">SOS</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {/* Mobile Currency Selection */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl">
              <span className="text-xs text-stone-300">Currency</span>
              <div className="flex gap-1 overflow-x-auto py-1">
                {CURRENCIES.slice(0, 5).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => changeCurrency(c.code)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      currency === c.code ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-400 bg-white/5'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/#request-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-center font-bold text-xs shadow-md"
            >
              ⚡ Start a Request in India
            </Link>

            {!user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openAuthModal()
                }}
                className="w-full py-2.5 text-stone-300 text-xs font-semibold hover:text-white"
              >
                Sign In to Your Account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
                className="w-full py-2.5 text-stone-400 text-xs font-medium hover:text-white"
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
