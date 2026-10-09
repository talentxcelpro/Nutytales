'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
  { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar (AUD)' },
  { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (SGD)' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)' },
]

export default function NriNavbar() {
  const pathname = usePathname()
  const { user, profile, openAuthModal, signOut } = useAuth()
  const [currency, setCurrency] = useState('USD')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currencyDropdown, setCurrencyDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
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

  const changeCurrency = (code: string) => {
    setCurrency(code)
    try {
      localStorage.setItem('nt_nri_currency', code)
    } catch {
      // Ignore
    }
    setCurrencyDropdown(false)
  }

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'For Providers', href: '/providers' },
    { label: 'For Business', href: '/business' },
    { label: 'Emergency 24/7', href: '/emergency', badge: 'SOS' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#0E1524]/95 backdrop-blur-md shadow-lg border-b border-[#C9A45C]/20'
          : 'bg-[#0E1524] border-b border-white/10'
      }`}
    >
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#17233B] via-[#1A2E40] to-[#17233B] px-4 py-1.5 text-center text-xs text-stone-300 border-b border-white/5 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-light">
          Your trusted ground team in India. Verified coordinators across Srinagar, Delhi NCR, Mumbai, Bengaluru & Chandigarh.
        </span>
        <Link href="/emergency" className="underline font-semibold text-[#C9A45C] hover:text-white ml-1">
          Need Emergency Assistance?
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white p-1 border-2 border-[#C9A45C]/40 shadow-sm group-hover:border-[#C9A45C] transition-colors flex-shrink-0">
              <Image
                src="/images/logo.jpg"
                alt="Nuty Tales NRI"
                width={44}
                height={44}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  Nuty Tales
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-widest bg-gradient-to-r from-[#C9A45C] to-[#E5C178] text-[#0E1524]">
                  NRI
                </span>
              </div>
              <span className="text-[10px] tracking-wide text-stone-400 font-light block">
                India, handled. From anywhere in the world.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = pathname === link.href || pathname === `/nri${link.href}`
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                    active ? 'text-[#C9A45C]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500/90 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Hub */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCurrencyDropdown(!currencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 transition-colors"
                title="Select Overseas Currency"
              >
                <span>🌍 {currency}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {currencyDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#17233B] border border-white/10 rounded-xl shadow-2xl py-1 z-50 animate-fadeIn">
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
                      <span>{c.label}</span>
                      <span className="text-stone-400">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* My India Dashboard Entry */}
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-stone-200 border border-white/15 flex items-center gap-1.5 transition-colors"
            >
              <span>🏛️</span>
              <span>My India</span>
            </Link>

            {/* Auth or Sign In */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="w-8 h-8 rounded-full bg-[#176B68] text-white flex items-center justify-center font-bold text-xs border border-[#C9A45C]/50"
                  title={user.email || 'My Account'}
                >
                  {(profile?.name || user.email || 'U').charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-stone-400 hover:text-stone-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="px-3 py-2 text-xs font-medium text-stone-300 hover:text-white"
              >
                Sign In
              </button>
            )}

            {/* Signature CTA: Get Something Done */}
            <Link
              href="/#request-engine"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C9A45C] to-[#DFBC72] text-[#0E1524] hover:shadow-lg hover:shadow-[#C9A45C]/20 transition-all hover:scale-[1.02] flex items-center gap-1.5 shadow-md"
            >
              <span>⚡</span>
              <span>Get Something Done</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/#request-engine"
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C9A45C] text-[#0E1524]"
            >
              Get Done
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center text-base"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0E1524] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-stone-200 hover:bg-white/5"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500 text-white font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-white/5 text-stone-200 text-center font-semibold text-xs border border-white/10"
            >
              🏛️ Open My India Operating Dashboard
            </Link>

            <Link
              href="/#request-engine"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#C9A45C] text-[#0E1524] text-center font-bold text-xs"
            >
              ⚡ Get Something Done in India
            </Link>

            {!user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  openAuthModal()
                }}
                className="w-full py-2 text-stone-400 text-xs font-medium"
              >
                Sign In to Account
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  signOut()
                }}
                className="w-full py-2 text-stone-400 text-xs font-medium"
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
