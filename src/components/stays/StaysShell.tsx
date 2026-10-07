'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import GroupEcosystemBar from '@/components/group/GroupEcosystemBar'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

const STAYS_NAV_LINKS = [
  { label: 'Overview', href: '/' },
  { label: 'Orchard Suites', href: '/#booking-engine' },
  { label: 'Experiences & Dining', href: '/#experiences' },
  { label: 'Group & Orchard Buyouts', href: '/group-quote', badge: 'Private' },
  { label: 'Host Portal', href: '/hosts', badge: 'List Property' },
  { label: 'Hospitality Dashboard', href: '/dashboard', badge: 'Occupancy' },
]

export default function StaysShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.STAYS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/stays' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/stays/, '') || '/'
    return cleanPath === href || cleanPath.startsWith(href)
  }

  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/stays')) {
      return href === '/' ? '/stays' : `/stays${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] flex flex-col font-sans">
      {/* ── Group Ecosystem Switcher ── */}
      <GroupEcosystemBar currentCompanyId="stays" />

      {/* ── Stays Top Ribbon ─────────────────────────────────────────────────── */}
      <div className="bg-[#10192A] text-stone-200 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nutty Tales Stays — Global Hospitality &amp; Experience Discovery</span>
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#C9A45C]">
            Book the stay and everything around it (Transfers, Dining &amp; Local Concierge)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nutty Tales Stays Concierge! I want to inquire about Harwan orchard villa and heritage suites.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Stay Concierge</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Stays Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-[#17233B] flex items-center justify-center text-white font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                <span>🏔️</span>
              </div>
              <div>
                <span className="font-serif text-xl font-extrabold text-[#17233B] tracking-tight block">
                  Nutty Tales <span className="text-[#C9A45C]">Stays</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                  Orchards · Villas · Houseboats
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {STAYS_NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.label}
                    href={getLinkHref(link.href)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#17233B] text-white shadow-sm'
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

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href={getLinkHref('/group-quote')}
                className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Request Buyout Quote
              </Link>
            </div>

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

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-2">
            {STAYS_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={getLinkHref(link.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={getLinkHref('/group-quote')}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl mt-2"
            >
              Group / Buyout Quote
            </Link>
          </div>
        )}
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Dedicated Stays Footer ───────────────────────────────────── */}
      <footer className="bg-[#10192A] text-white border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏔️</span>
                <span className="font-serif text-lg font-bold">Nutty Tales Stays</span>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Global boutique hospitality and stay-experiences. Nestled in high-altitude orchards, lake-facing heritage suites, and urban corporate hubs. Book your room and seamless local culinary, transfer, and excursion journeys.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Flagship Properties</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Harwan Walnut Orchard Villa (Srinagar)</li>
                <li>Zabarwan Mountain View Suites</li>
                <li>Dal Lake Luxury Cedar Houseboats</li>
                <li>Noida Sector 63 Corporate Residence</li>
                <li>Patna Heritage Mithila Villa</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Concierge Experiences</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Traditional Bukhari Wood Fireplace Nights</li>
                <li>Royal Multi-Course Wazwan Banquets</li>
                <li>Private Sunrise Dal Lake Shikara Rides</li>
                <li>Orchard Walnut &amp; Almond Harvest Walks</li>
                <li>Airport Chauffeur &amp; 4x4 Fleet Transfers</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Host Desk</h4>
              <p className="text-stone-400">
                Email: stays@nutytales.com<br />
                Concierge: +91 9717161809<br />
                Direct Concierge WhatsApp
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
                  A Nutty Tales Group Company
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <span>© {new Date().getFullYear()} Nutty Tales Stays. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href={getLinkHref('/group-quote')} className="hover:text-white">Group Buyouts</Link>
              <Link href={getLinkHref('/dashboard')} className="hover:text-white">Hospitality Dashboard</Link>
              <a href="https://www.nutytales.com" className="hover:text-white">Nutty Tales Group Gateway</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
