'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { B2B_NAV_LINKS } from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/b2b' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/b2b/, '') || '/'
    return cleanPath.startsWith(href)
  }

  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/b2b')) {
      return href === '/' ? '/b2b' : `/b2b${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
      {/* ── 1. Top Enterprise Ticker & Regulatory Ribbon ──────────────────────── */}
      <div className="bg-[#06152B] text-slate-300 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Live Spot Ticker */}
        <div className="flex items-center gap-3 overflow-hidden text-xs">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mandi &amp; Ex-Hub Spot Rates:</span>
          </span>
          <div className="hidden lg:flex items-center gap-3 font-mono text-[11px] text-slate-300">
            <span className="text-emerald-400 font-semibold">Almonds (Sliced): ₹670/kg</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-semibold">Walnuts (Halves): ₹950/kg</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-semibold">Saffron (Mongra): ₹2,60,000/kg</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400 font-semibold">Makhana (6+ Sutra): ₹680/kg</span>
          </div>
        </div>

        {/* Right: Regulators & Trade Desk */}
        <div className="flex items-center gap-4 text-xs ml-auto">
          <span className="hidden sm:inline text-slate-400">
            FSSAI Lic. <strong className="text-slate-200">{FSSAI_NUMBER}</strong> · NABL Assays
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Trade Desk! I am inquiring about industrial bulk sourcing through Nuty Tales Business.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6B00] font-bold hover:underline flex items-center gap-1"
          >
            <span>Desk: +91 9717161809</span>
          </a>
        </div>
      </div>

      {/* ── 2. Sleek Enterprise Header (Clean, Spacious, Modern) ─────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-6">
              <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#081830] text-white flex items-center justify-center font-bold shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                  <div className="w-5 h-5 rounded-md bg-[#FF6B00] flex items-center justify-center text-white text-xs font-black">
                    N
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xl tracking-tight text-[#0A1830]">
                      nuty tales
                    </span>
                    <span className="font-light text-xl text-[#FF6B00] tracking-tight">
                      business
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#0A1830] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded">
                      Enterprise OS
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Wholesale Procurement Platform
                    </span>
                  </div>
                </div>
              </Link>

              {/* Main Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-700 ml-4">
                <Link
                  href={getLinkHref('/catalog')}
                  className="px-3.5 py-2 rounded-lg hover:text-[#0A1830] hover:bg-slate-100 transition-colors flex items-center gap-1"
                >
                  <span>Commodities</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                    Live
                  </span>
                </Link>
                <Link
                  href={getLinkHref('/quotes')}
                  className="px-3.5 py-2 rounded-lg hover:text-[#0A1830] hover:bg-slate-100 transition-colors"
                >
                  Compare Quotes
                </Link>
                <Link
                  href={getLinkHref('/deliveries')}
                  className="px-3.5 py-2 rounded-lg hover:text-[#0A1830] hover:bg-slate-100 transition-colors"
                >
                  Reefer Logistics
                </Link>
                <Link
                  href={getLinkHref('/certificates')}
                  className="px-3.5 py-2 rounded-lg hover:text-[#0A1830] hover:bg-slate-100 transition-colors"
                >
                  Quality &amp; NABL
                </Link>
                <Link
                  href={getLinkHref('/desk')}
                  className="px-3.5 py-2 rounded-lg hover:text-[#0A1830] hover:bg-slate-100 transition-colors"
                >
                  Managed Desk
                </Link>
              </nav>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3">
              {/* Quick RFQ link */}
              <Link
                href={getLinkHref('/rfq')}
                className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <span>⚡</span>
                <span>Submit RFQ</span>
              </Link>

              {/* Commercial Sign In / Account */}
              <Link
                href={getLinkHref('/account')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <span>🏢</span>
                <span>Corporate Desk</span>
              </Link>

              {/* High-Contrast "Procurement Workspace" Action */}
              <Link
                href="/b2b/dashboard"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#081830] hover:bg-[#12274A] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                <span>Procurement Workspace</span>
                <span>→</span>
              </Link>

              {/* Mobile Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
                aria-label="Toggle navigation"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-fadeIn">
            <Link
              href="/b2b/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-bold text-sm bg-[#081830] text-white"
            >
              📊 Open Procurement Workspace →
            </Link>
            <Link
              href={getLinkHref('/catalog')}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
            >
              📦 Commodities &amp; Live Rates
            </Link>
            <Link
              href={getLinkHref('/quotes')}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
            >
              ⚖️ Quote Comparison Workspace
            </Link>
            <Link
              href={getLinkHref('/rfq')}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
            >
              ⚡ Request For Quote (RFQ)
            </Link>
            <Link
              href={getLinkHref('/deliveries')}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
            >
              🚚 Reefer Cold-Chain Tracking
            </Link>
            <Link
              href={getLinkHref('/certificates')}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
            >
              🔬 NABL Quality Lab Certificates
            </Link>
            <Link
              href={getLinkHref('/account')}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
            >
              🏢 Corporate Account &amp; GSTIN
            </Link>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* ── 3. Enterprise Footer ─────────────────────────────────────────────── */}
      <footer className="bg-[#081830] text-slate-400 text-xs border-t border-white/10 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center font-bold text-sm">
                  N
                </div>
                <span className="font-bold text-white text-base tracking-tight">
                  nuty tales business
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Enterprise B2B wholesale procurement platform for premium dry fruits, tree nuts, Kashmiri saffron, and Mithila makhana.
              </p>
              <div className="text-[11px] text-[#C9A45C]">
                FSSAI Central Lic. #{FSSAI_NUMBER}
              </div>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Procurement
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/b2b/dashboard" className="hover:text-white transition-colors">
                    Procurement Workspace
                  </Link>
                </li>
                <li>
                  <Link href="/b2b/catalog" className="hover:text-white transition-colors">
                    Commodity Catalogue
                  </Link>
                </li>
                <li>
                  <Link href="/b2b/quotes" className="hover:text-white transition-colors">
                    Quote Comparison
                  </Link>
                </li>
                <li>
                  <Link href="/b2b/rfq" className="hover:text-white transition-colors">
                    Direct RFQ Terminal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Assurance &amp; Quality
              </div>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/b2b/certificates" className="hover:text-white transition-colors">
                    NABL Laboratory Assays
                  </Link>
                </li>
                <li>
                  <Link href="/b2b/deliveries" className="hover:text-white transition-colors">
                    14°C Reefer Logistics
                  </Link>
                </li>
                <li>
                  <Link href="/b2b/invoices" className="hover:text-white transition-colors">
                    Net-30 Invoicing &amp; GST Credit
                  </Link>
                </li>
                <li>
                  <Link href="/b2b/desk" className="hover:text-white transition-colors">
                    Dedicated Trade Desk
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Trade Desk Support
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Direct Line:</span>
                  <a href={`https://wa.me/${whatsappPhone}`} className="text-emerald-400 font-bold hover:underline">
                    +91 9717161809 (WhatsApp Desk)
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Central Hub:</span>
                  <span className="text-slate-300">Noida Special Economic Zone &amp; Srinagar Depot</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>© 2026 Nuty Tales Business. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-slate-300">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:text-slate-300">
                Terms of Supply
              </Link>
              <span>·</span>
              <a href={`https://wa.me/${whatsappPhone}`} className="hover:text-slate-300">
                Trade Desk Support
              </a>
            </div>
            <div className="font-mono text-slate-400">v2.4.0</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
