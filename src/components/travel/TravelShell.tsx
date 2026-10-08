'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

const TRAVEL_NAV_LINKS = [
  { label: 'Destinations', href: '/kashmir' },
  { label: 'Trips', href: '/#trips' },
  { label: 'Experiences', href: '/#experiences' },
  { label: 'Itineraries', href: '/builder', badge: 'SI Builder' },
  { label: 'Concierge', href: '/partners', badge: 'DMC Network' },
]

export default function TravelShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [ecosystemMenuOpen, setEcosystemMenuOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/travel' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/travel/, '') || '/'
    return cleanPath === href || cleanPath.startsWith(href)
  }

  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/travel')) {
      return href === '/' ? '/travel' : `/travel${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] flex flex-col font-sans">
      {/* ── Travel Top Ribbon ─────────────────────────────────────────────────── */}
      <div className="bg-[#10192A] text-stone-200 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-[#C9A45C]">NUTY TALES TRAVEL</span>
            <span className="text-stone-300">· The World&apos;s Intelligent Journey Marketplace</span>
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-stone-300 italic">
            &ldquo;Don&apos;t search for your trip. Tell us what you want. SI plans it. Nuty Tales puts it together.&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales Travel Desk! I want to plan a custom trip to Kashmir / Himalayas.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Trip Concierge</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Travel Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-[#17233B] flex items-center justify-center text-white font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                <span>✈️</span>
              </div>
              <div>
                <span className="font-serif text-xl font-extrabold text-[#17233B] tracking-tight block">
                  Nuty Tales <span className="text-[#C9A45C]">Travel</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                  Intelligent Journey Marketplace · Operating Layer
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {TRAVEL_NAV_LINKS.map((link) => {
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
                href={getLinkHref('/builder')}
                className="px-5 py-2.5 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Launch Trip Builder
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
            {TRAVEL_NAV_LINKS.map((link) => (
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
              href={getLinkHref('/builder')}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl mt-2"
            >
              Build My Trip
            </Link>
          </div>
        )}
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Dedicated Travel Footer ───────────────────────────────────── */}
      <footer className="bg-[#10192A] text-white border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✈️</span>
                <span className="font-serif text-lg font-bold">Nuty Tales Travel</span>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Complete trip execution, bespoke dynamic itineraries, alpine snow expeditions, private 4x4 convoys, and verified Destination Management Companies (DMCs). Tailored for families, corporate offsites, and adventurous explorers.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Himalayan Corridors</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Gulmarg Gondola &amp; Ski Expeditions</li>
                <li>Pahalgam Valley &amp; Aru Horse Trails</li>
                <li>Sonamarg Thajiwas Glacier 4x4 Safaris</li>
                <li>Srinagar Dal Lake &amp; Heritage Old City</li>
                <li>Leh-Ladakh High Altitude Passes</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Global Network</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Dubai Desert Dunes &amp; Burj Corridors</li>
                <li>London &amp; Scottish Highlands</li>
                <li>Boutique Destination Management (DMC)</li>
                <li>Licensed Mountain Safety Guides</li>
                <li>24/7 Weather Concierge Protocol</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Travel Desk</h4>
              <p className="text-stone-400">
                Email: travel@nutytales.com<br />
                Fleet Control: +91 9717161809<br />
                Operations: Srinagar, Leh, Delhi
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
                  A Nuty Tales Company
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <span>© {new Date().getFullYear()} Nuty Tales Travel. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href={getLinkHref('/builder')} className="hover:text-white">SI Trip Builder</Link>
              <Link href={getLinkHref('/dashboard')} className="hover:text-white">Travel Dashboard</Link>
              <a href="https://www.nutytales.com" className="hover:text-white">Nuty Tales Gateway</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
