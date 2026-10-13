'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'

const NAV_LINKS = [
  { label: 'Discover', href: '/' },
  { label: 'Venues', href: '/venues' },
  { label: 'Vendors', href: '/vendors' },
  { label: 'Favors & Gifts', href: '/wedding-return-gifts' },
  { label: 'Inspiration', href: '/inspiration' },
  { label: 'Planning', href: '/workspace' },
]

const PRO_LINKS = [
  { label: 'Wedding Planner Workspace', href: '/planner', desc: 'Multi-client command center' },
  { label: 'Vendor Partner Portal', href: '/vendor-portal', desc: 'Inquiries, quotes & bookings' },
  { label: 'Platform Administration', href: '/admin', desc: 'Trust & verification desk' },
]

export default function WeddingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, profile, openAuthModal, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [proMenuOpen, setProMenuOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD' | 'AED' | 'EUR' | 'GBP'>('INR')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const getLinkHref = (href: string) => {
    // If the path already has /weddings, keep subpaths consistent
    if (pathname.startsWith('/weddings')) {
      if (href === '/') return '/weddings'
      if (href.startsWith('/weddings')) return href
      return `/weddings${href}`
    }
    return href
  }

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/weddings' || pathname === '/'
    }
    const target = getLinkHref(href)
    return pathname === target || pathname.startsWith(target + '/')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] flex flex-col font-sans selection:bg-[#C9A45C]/30">
      {/* ── Top Ribbon: Refined Champagne & Ivory ───────────────────────────── */}
      <div className="bg-[#2D1520] text-stone-200 text-xs py-2 px-4 sm:px-8 border-b border-[#C9A45C]/25">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C] animate-pulse" />
            <span className="font-medium tracking-wide text-white">Nuty Tales Weddings</span>
            <span className="text-white/40 hidden md:inline">•</span>
            <span className="text-stone-300 font-light hidden md:inline">
              Global Wedding Discovery, Multi-Event Planning &amp; Execution
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 text-stone-300">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest hidden sm:inline">Currency:</span>
              <select
                aria-label="Select Currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value as any)}
                className="bg-black/30 border border-white/20 rounded px-1.5 py-0.5 text-[11px] text-[#C9A45C] font-semibold focus:outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <span className="text-white/30 hidden sm:inline">|</span>

            {/* Direct Concierge WhatsApp Link */}
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                'Hello Nuty Tales Weddings Concierge! We are planning our wedding and would love assistance with venues and vendor coordination.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A45C] hover:text-white font-medium flex items-center gap-1 transition-colors"
            >
              <span>Concierge Desk</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#701A31] to-[#8E2848] flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
                <span>💍</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#17233B] tracking-tight block">
                  Nuty Tales <span className="text-[#8E2848] font-normal italic">Weddings</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-[#8E2848]/80 block">
                  Discovery · Planning · Execution
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.label}
                    href={getLinkHref(link.href)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      active
                        ? 'bg-[#8E2848] text-white shadow-xs'
                        : 'text-stone-700 hover:text-[#8E2848] hover:bg-[#8E2848]/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {/* Secondary "Professionals" Dropdown */}
              <div className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setProMenuOpen(!proMenuOpen)}
                  onBlur={() => setTimeout(() => setProMenuOpen(false), 200)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 flex items-center gap-1 transition-colors"
                >
                  <span>Planners &amp; Vendors</span>
                  <span className="text-[10px]">▾</span>
                </button>

                {proMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-xl p-2 z-50 animate-fadeIn">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 px-3 py-1 block">
                      Operations Portals
                    </span>
                    {PRO_LINKS.map((pro) => (
                      <Link
                        key={pro.label}
                        href={getLinkHref(pro.href)}
                        className="block px-3 py-2 rounded-xl hover:bg-stone-50 transition-colors"
                      >
                        <span className="font-bold text-xs text-[#17233B] block">{pro.label}</span>
                        <span className="text-[11px] text-stone-500 font-light block">{pro.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Elements */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href={getLinkHref('/workspace')}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-800 transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>My Workspace</span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1"
                    title="Sign Out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal()}
                  className="text-xs font-semibold text-stone-700 hover:text-[#8E2848] px-3 py-2 transition-colors"
                >
                  Sign In
                </button>
              )}

              <Link
                href={getLinkHref('/workspace')}
                className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Start Planning
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-5 space-y-3 animate-fadeIn">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={getLinkHref(link.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isLinkActive(link.href) ? 'bg-[#8E2848] text-white' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 px-3 block">
                Professional Portals
              </span>
              {PRO_LINKS.map((pro) => (
                <Link
                  key={pro.label}
                  href={getLinkHref(pro.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
                >
                  {pro.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              {user ? (
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Sign Out ({user.email || 'User'})
                </button>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  Sign In
                </button>
              )}

              <Link
                href={getLinkHref('/workspace')}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 bg-[#8E2848] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Start Planning
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Children Content ──────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Global Celebratory Weddings Footer ──────────────────────────────── */}
      <footer className="bg-[#1A1618] text-stone-300 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Col 1: Brand & Purpose (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8E2848] flex items-center justify-center text-white text-base">
                  💍
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Nuty Tales Weddings</h3>
                  <span className="text-[10px] text-[#C9A45C] uppercase tracking-widest font-semibold block">
                    Every detail. Every person. Every moment. Together.
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
                The global operating platform for couples, families, and elite planners. Discover verified palace venues, coordinate multi-day ceremonies, manage real budgets, and orchestrate memorable celebrations across India, UAE, and international destinations.
              </p>
              <div className="pt-2 text-xs text-[#C9A45C] flex items-center gap-2">
                <span>Verified Partners &amp; Escrow Milestone Security</span>
              </div>
            </div>

            {/* Col 2: Discovery & Marketplace (2 cols) */}
            <div className="lg:col-span-2 space-y-3 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Discovery</h4>
              <ul className="space-y-2 text-stone-400">
                <li><Link href={getLinkHref('/venues')} className="hover:text-white transition-colors">Venues Directory</Link></li>
                <li><Link href={getLinkHref('/vendors')} className="hover:text-white transition-colors">Verified Vendors</Link></li>
                <li><Link href={getLinkHref('/inspiration')} className="hover:text-white transition-colors">Real Weddings</Link></li>
                <li><Link href="/destination-weddings/kashmir" className="hover:text-white transition-colors">Kashmir Valley</Link></li>
                <li><Link href="/destination-weddings/dubai" className="hover:text-white transition-colors">Dubai &amp; UAE</Link></li>
                <li><Link href="/destination-weddings/italy" className="hover:text-white transition-colors">Italy &amp; Como</Link></li>
              </ul>
            </div>

            {/* Col 3: Wedding Operating System (3 cols) */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Wedding Workspace</h4>
              <ul className="space-y-2 text-stone-400">
                <li><Link href={getLinkHref('/workspace')} className="hover:text-white transition-colors">My Wedding Command Center</Link></li>
                <li><Link href={getLinkHref('/workspace')} className="hover:text-white transition-colors">Multi-Event Timeline &amp; Conflict Check</Link></li>
                <li><Link href={getLinkHref('/workspace')} className="hover:text-white transition-colors">Interactive Budget &amp; Invoices</Link></li>
                <li><Link href={getLinkHref('/workspace')} className="hover:text-white transition-colors">Guest List &amp; Table Seating Planner</Link></li>
                <li><Link href={getLinkHref('/wedding-return-gifts')} className="hover:text-white transition-colors">Bespoke Trousseau Favors Studio</Link></li>
                <li><Link href={getLinkHref('/planner')} className="hover:text-white transition-colors">Professional Planner Portal</Link></li>
              </ul>
            </div>

            {/* Col 4: Concierge & Hospitality (3 cols) */}
            <div className="lg:col-span-3 space-y-3 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Global Concierge Desk</h4>
              <p className="text-stone-400 leading-relaxed font-light">
                Direct WhatsApp assistance with our senior wedding directors for palace site visits, tastings, and supplier RFQs.
              </p>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Direct Helpline</span>
                <span className="font-mono text-white text-xs font-bold block">+91 97171 61809</span>
                <span className="text-[11px] text-stone-400 block">weddings@nutytales.com</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <span>© {new Date().getFullYear()} Nuty Tales Weddings. All rights reserved. A Nuty Tales Company.</span>
            <div className="flex gap-4">
              <Link href={getLinkHref('/workspace')} className="hover:text-stone-300">Workspace</Link>
              <Link href={getLinkHref('/planner')} className="hover:text-stone-300">Planners</Link>
              <Link href={getLinkHref('/vendor-portal')} className="hover:text-stone-300">Vendors</Link>
              <Link href="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-stone-300">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
