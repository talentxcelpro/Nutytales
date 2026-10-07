'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import GroupEcosystemBar from '@/components/group/GroupEcosystemBar'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

const WEDDINGS_NAV_LINKS = [
  { label: 'Overview', href: '/' },
  { label: 'Wedding Workspace', href: '/workspace', badge: 'Wedding OS' },
  { label: 'Trousseau & Favors', href: '/#hampers' },
  { label: 'Destination Venues', href: '/#venues' },
  { label: 'Couple Dashboard', href: '/dashboard', badge: 'Timeline' },
]

export default function WeddingsShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/weddings' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/weddings/, '') || '/'
    return cleanPath === href || cleanPath.startsWith(href)
  }

  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/weddings')) {
      return href === '/' ? '/weddings' : `/weddings${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] flex flex-col font-sans">
      {/* ── Group Ecosystem Switcher ── */}
      <GroupEcosystemBar currentCompanyId="weddings" />

      {/* ── Weddings Top Ribbon ─────────────────────────────────────────────────── */}
      <div className="bg-[#2D1520] text-stone-200 text-[11px] py-2 px-4 sm:px-8 border-b border-[#C9A45C]/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse" />
            <span>Nutty Tales Weddings — Global Wedding Operating System &amp; Execution</span>
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#C9A45C]">
            Destination Kashmir, Jaipur, Dubai &amp; Lake Como Concierge
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nutty Tales Weddings Concierge! We are planning a wedding and need bespoke trousseau hampers and vendor support.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A45C] font-bold hover:underline flex items-center gap-1"
          >
            <span>Wedding Concierge</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Weddings Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#8E2848]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-[#8E2848] flex items-center justify-center text-white font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                <span>💍</span>
              </div>
              <div>
                <span className="font-serif text-xl font-extrabold text-[#2D1520] tracking-tight block">
                  Nutty Tales <span className="text-[#8E2848]">Weddings</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                  Favors · Venues · Wedding OS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {WEDDINGS_NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.label}
                    href={getLinkHref(link.href)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#8E2848] text-white shadow-sm'
                        : 'text-stone-700 hover:text-[#8E2848] hover:bg-[#8E2848]/10'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          active
                            ? 'bg-[#C9A45C] text-[#2D1520]'
                            : 'bg-rose-100 text-rose-900 border border-rose-200'
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
                href={getLinkHref('/workspace')}
                className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Launch Workspace
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
            {WEDDINGS_NAV_LINKS.map((link) => (
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
              href={getLinkHref('/workspace')}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-[#8E2848] text-white font-bold text-xs uppercase tracking-wider rounded-xl mt-2"
            >
              Launch Wedding Workspace
            </Link>
          </div>
        )}
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Dedicated Weddings Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#1D0C15] text-white border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💍</span>
                <span className="font-serif text-lg font-bold">Nutty Tales Weddings</span>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                The global operating system for couples, families, and elite planners. From destination palace bookings and trousseau favor curation to verified vendor coordination and escrow management.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Wedding OS Features</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Interactive Budget Allocator</li>
                <li>6-Event Timeline &amp; Checklist</li>
                <li>Bespoke Trousseau &amp; Return Favors</li>
                <li>Monogram Foil Stamping</li>
                <li>Guest List &amp; Room Allotment</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Vendor Ecosystem</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Heritage Palaces &amp; Orchard Venues</li>
                <li>Destination Photographers &amp; Cinema</li>
                <li>Royal Wazwan &amp; Banquet Caterers</li>
                <li>Mehendi &amp; Haldi Decor Stylists</li>
                <li>Luxury Escort &amp; Guest Transfers</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Concierge Desk</h4>
              <p className="text-stone-400">
                Email: weddings@nutytales.com<br />
                Concierge: +91 9717161809<br />
                Destinations: Kashmir, Rajasthan, Dubai, Goa
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
                  A Nutty Tales Group Company
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <span>© {new Date().getFullYear()} Nutty Tales Weddings. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href={getLinkHref('/workspace')} className="hover:text-white">Wedding Workspace</Link>
              <Link href={getLinkHref('/dashboard')} className="hover:text-white">Couple Dashboard</Link>
              <a href="https://www.nutytales.com" className="hover:text-white">Nutty Tales Group Gateway</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
