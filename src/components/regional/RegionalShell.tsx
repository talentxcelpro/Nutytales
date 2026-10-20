'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { RegionalConfig, RegionKey, REGIONAL_CONFIGS } from '@/lib/regional-data'
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/lib/global-config'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function RegionalShell({
  config,
  children,
  currentCurrency,
  onCurrencyChange,
}: {
  config: RegionalConfig
  children: React.ReactNode
  currentCurrency?: CurrencyCode
  onCurrencyChange?: (c: CurrencyCode) => void
}) {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(
    currentCurrency || config.defaultCurrency
  )
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false)
  const [regionMenuOpen, setRegionMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  const handleSelectCurrency = (cur: CurrencyCode) => {
    setActiveCurrency(cur)
    setCurrencyMenuOpen(false)
    if (onCurrencyChange) {
      onCurrencyChange(cur)
    }
  }

  const currentYear = new Date().getFullYear()

  // Suffix indicator styling
  const themeColors = {
    me: {
      accent: 'from-amber-600 to-amber-700',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      heroAccent: 'text-amber-400',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      bannerBg: 'bg-[#1C160C] text-amber-200 border-amber-900/40',
    },
    eu: {
      accent: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      heroAccent: 'text-emerald-400',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      bannerBg: 'bg-[#0B1A15] text-emerald-200 border-emerald-900/40',
    },
    us: {
      accent: 'from-blue-600 to-indigo-700',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      heroAccent: 'text-blue-400',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      bannerBg: 'bg-[#0F172A] text-blue-200 border-blue-900/40',
    },
  }[config.key]

  const storeHref = `${config.pathPrefix}/store`
  const homeHref = `${config.pathPrefix}`

  return (
    <div className="min-h-screen bg-[#0E1524] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* 1. Global Regional Announcement Banner */}
      <div className={`py-2 px-4 text-xs border-b flex items-center justify-between gap-4 ${themeColors.bannerBg}`}>
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">✨</span>
            <span className="font-semibold tracking-wide">
              {config.offeringTitle}:
            </span>
            <span className="text-stone-300 hidden sm:inline">
              Orders over {config.freeShippingLabel} qualify for Free Air Cargo Doorstep Dispatch
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:inline-flex items-center gap-1.5 text-stone-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              Hub: {config.regionalHub.split('&')[0]}
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setRegionMenuOpen(!regionMenuOpen)}
                className="hover:underline font-bold text-amber-300 flex items-center gap-1"
              >
                <span>🌍 Switch Region</span>
                <span className="text-[9px]">▼</span>
              </button>

              {regionMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-[#162032] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 text-xs">
                  <div className="text-[10px] font-bold uppercase text-stone-400 px-3 py-1">
                    Select Regional Portal
                  </div>
                  <Link
                    href="/me"
                    onClick={() => setRegionMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition"
                  >
                    <span>🇦🇪</span>
                    <div className="text-left">
                      <p className="font-bold text-white text-xs">Middle East (GCC)</p>
                      <p className="text-[10px] text-stone-400">middleeast.nutytales.com</p>
                    </div>
                  </Link>
                  <Link
                    href="/eu"
                    onClick={() => setRegionMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition"
                  >
                    <span>🇬🇧</span>
                    <div className="text-left">
                      <p className="font-bold text-white text-xs">UK &amp; Europe</p>
                      <p className="text-[10px] text-stone-400">europe.nutytales.com</p>
                    </div>
                  </Link>
                  <Link
                    href="/us"
                    onClick={() => setRegionMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition"
                  >
                    <span>🇺🇸</span>
                    <div className="text-left">
                      <p className="font-bold text-white text-xs">North America</p>
                      <p className="text-[10px] text-stone-400">america.nutytales.com</p>
                    </div>
                  </Link>
                  <div className="border-t border-white/10 my-1" />
                  <Link
                    href="/"
                    onClick={() => setRegionMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-[11px] text-stone-400"
                  >
                    <span>🇮🇳</span>
                    <span>India (Global HQ): nutytales.com</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Regional Header */}
      <header className="sticky top-0 z-40 bg-[#0E1524]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Subdomain Title */}
            <div className="flex items-center gap-3.5">
              <Link href={homeHref} className="flex items-center gap-3 group">
                <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white p-1 border border-white/20 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                  <Image
                    src="/images/logo.jpg"
                    alt={config.brandName}
                    width={44}
                    height={44}
                    priority
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                      Nuty Tales
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${themeColors.badgeBg}`}>
                      {config.subdomain.split('.')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wide text-stone-400 font-medium block truncate max-w-[130px] sm:max-w-none">
                    {config.tagline.replace('Nuty Tales regional offering; ', '')}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-7 text-xs uppercase tracking-wider font-semibold">
              <Link
                href={homeHref}
                className={`transition-colors py-1 ${
                  pathname === homeHref ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-300 hover:text-white'
                }`}
              >
                Overview
              </Link>
              <Link
                href={storeHref}
                className={`transition-colors py-1 ${
                  pathname?.includes('/store') ? 'text-amber-400 border-b-2 border-amber-400' : 'text-stone-300 hover:text-white'
                }`}
              >
                Store Catalog
              </Link>
              <a
                href="#compliance"
                className="text-stone-300 hover:text-white transition-colors"
              >
                Compliance
              </a>
              <a
                href="#faq"
                className="text-stone-300 hover:text-white transition-colors"
              >
                FAQs
              </a>
            </nav>

            {/* Action Bar: Currency Toggle & Cart */}
            <div className="flex items-center space-x-3 text-xs">
              {/* Currency Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                  className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition"
                  title="Change Currency"
                >
                  <span>{SUPPORTED_CURRENCIES[activeCurrency]?.symbol || '$'}</span>
                  <span>{activeCurrency}</span>
                  <span className="text-[9px] text-stone-400">▼</span>
                </button>

                {currencyMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-36 bg-[#162032] border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                    <div className="text-[10px] font-bold uppercase text-stone-400 px-2 py-1">
                      Currency
                    </div>
                    {config.supportedCurrencies.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleSelectCurrency(c)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition ${
                          activeCurrency === c ? 'bg-amber-500/20 text-amber-300 font-bold' : 'hover:bg-white/5 text-stone-300'
                        }`}
                      >
                        <span>{c}</span>
                        <span className="font-mono text-stone-400">{SUPPORTED_CURRENCIES[c]?.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Drawer Link */}
              <Link
                href={`${config.pathPrefix}/cart`}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold flex items-center gap-2 transition"
              >
                <span>🛒</span>
                <span className="font-bold">{cartCount}</span>
                <span className="hidden sm:inline text-stone-300 text-[11px]">Cart</span>
              </Link>

              {/* WhatsApp Regional Concierge */}
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello ${config.brandName}, I would like assistance with an international delivery.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 transition font-semibold"
              >
                <span>💬</span>
                <span>Order Concierge</span>
              </a>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#121B2D] px-4 py-4 space-y-3 text-sm">
            <Link
              href={homeHref}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-stone-200 hover:text-white"
            >
              Overview
            </Link>
            <Link
              href={storeHref}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-stone-200 hover:text-white"
            >
              Store Catalog ({config.packagingBadge})
            </Link>
            <div className="border-t border-white/10 pt-3">
              <p className="text-xs text-stone-400 font-bold uppercase mb-2">Switch Region</p>
              <div className="grid grid-cols-3 gap-2">
                <Link
                  href="/me"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 rounded-lg bg-white/5 text-center text-xs"
                >
                  🇦🇪 Middle East
                </Link>
                <Link
                  href="/eu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 rounded-lg bg-white/5 text-center text-xs"
                >
                  🇬🇧 Europe
                </Link>
                <Link
                  href="/us"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 rounded-lg bg-white/5 text-center text-xs"
                >
                  🇺🇸 Americas
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* 4. Rich Regional Footer */}
      <footer className="bg-[#090D17] text-stone-300 border-t border-white/10 pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Col 1: Brand & Regional Identity (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  {config.brandName}
                </span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
                {config.description}
              </p>
              <div className="pt-2 text-stone-400 space-y-1 text-[11px]">
                <p>📍 Regional Hub: <span className="text-stone-200">{config.regionalHub}</span></p>
                <p>✈️ Logistics Carriers: <span className="text-stone-200">{config.shippingCarriers.join(', ')}</span></p>
                <p>🛡️ Compliance: <span className="text-emerald-400">{config.complianceBadge}</span></p>
                <p className="font-mono text-stone-500 pt-1">
                  Canonical Subdomain: {config.subdomain}
                </p>
              </div>
            </div>

            {/* Col 2: Supported Delivery Countries (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Destination Coverage
              </h4>
              <ul className="space-y-1.5 text-stone-400">
                {config.supportedCountries.map((c) => (
                  <li key={c.code} className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Regional Store Links (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Regional Store
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li>
                  <Link href={storeHref} className="hover:text-white transition">
                    All {config.packagingBadge}s
                  </Link>
                </li>
                <li>
                  <Link href={`${storeHref}/kashmiri-mongra-saffron${config.slugSuffix}`} className="hover:text-white transition">
                    Pampore Mongra Saffron
                  </Link>
                </li>
                <li>
                  <Link href={`${storeHref}/mamra-almonds-kashmiri-badam${config.slugSuffix}`} className="hover:text-white transition">
                    Kashmiri Mamra Badam
                  </Link>
                </li>
                <li>
                  <Link href={`${storeHref}/kashmiri-walnuts-in-shell${config.slugSuffix}`} className="hover:text-white transition">
                    Kagzi Walnuts in Shell
                  </Link>
                </li>
                <li>
                  <Link href={`${storeHref}/makhana-grade-a-fox-nuts${config.slugSuffix}`} className="hover:text-white transition">
                    Mithila Jumbo Makhana
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: International Network (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Other Regional Portals
              </h4>
              <div className="space-y-2 text-stone-400 text-xs">
                <div>
                  <a href="https://middleeast.nutytales.com" className="text-amber-400 hover:underline block font-semibold">
                    🇦🇪 middleeast.nutytales.com
                  </a>
                  <span className="text-[10px] text-stone-500">GCC &amp; Middle East Diaspora Delivery</span>
                </div>
                <div>
                  <a href="https://europe.nutytales.com" className="text-emerald-400 hover:underline block font-semibold">
                    🇬🇧 europe.nutytales.com
                  </a>
                  <span className="text-[10px] text-stone-500">UK &amp; Europe Organic Dry Fruit Delivery</span>
                </div>
                <div>
                  <a href="https://america.nutytales.com" className="text-blue-400 hover:underline block font-semibold">
                    🇺🇸 america.nutytales.com
                  </a>
                  <span className="text-[10px] text-stone-500">US &amp; Canada North American Distribution</span>
                </div>
                <div className="pt-2">
                  <a href="https://nutytales.com" className="text-stone-300 hover:underline block">
                    🌐 nutytales.com — Global Marketplace HQ
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
            <p>
              © {currentYear} {config.brandName} · A division of Nuty Tales Foods &amp; Crafts. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href={`${config.pathPrefix}/sitemap.xml`} className="hover:text-stone-300">
                Sitemap
              </Link>
              <Link href="/privacy" className="hover:text-stone-300">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-stone-300">
                Terms
              </Link>
              <Link href="/shipping" className="hover:text-stone-300">
                Fulfillment Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
