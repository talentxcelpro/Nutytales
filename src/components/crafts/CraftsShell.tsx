'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import GroupEcosystemBar from '@/components/group/GroupEcosystemBar'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

const CRAFTS_NAV_LINKS = [
  { label: 'Overview', href: '/' },
  { label: 'Women', href: '/women' },
  { label: 'Men', href: '/men' },
  { label: 'Pashmina & Shawls', href: '/shawls-stoles' },
  { label: 'Pherans', href: '/pherans' },
  { label: 'Jackets & Coats', href: '/jackets-coats' },
  { label: 'Heritage Home', href: '/heritage-home' },
  { label: 'Wholesale & Export', href: '/wholesale', badge: 'B2B Desk' },
  { label: 'Marketplace Dashboard', href: '/dashboard', badge: 'Artisans' },
]

export default function CraftsShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/crafts' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/crafts/, '') || '/'
    return cleanPath === href || cleanPath.startsWith(href)
  }

  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/crafts')) {
      return href === '/' ? '/crafts' : `/crafts${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#17233B] flex flex-col font-sans">
      {/* ── Group Ecosystem Switcher ── */}
      <GroupEcosystemBar currentCompanyId="crafts" />

      {/* ── Crafts Top Ribbon ─────────────────────────────────────────────────── */}
      <div className="bg-[#10192A] text-stone-200 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse" />
            <span>Nutty Tales Crafts — Global Fashion, Handlooms &amp; Heritage Marketplace</span>
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#C9A45C]">
            GI-Tag Certified Single-Origin Weaves · Insured Global Export Freight
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nutty Tales Crafts! I am inquiring about authentic Kashmiri GI Pashmina and heritage fashion.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A45C] font-bold hover:underline flex items-center gap-1"
          >
            <span>Artisan Concierge</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Crafts Header ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FAF6EE]/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-[#17233B] flex items-center justify-center text-white font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                <span>🧣</span>
              </div>
              <div>
                <span className="font-serif text-xl font-extrabold text-[#17233B] tracking-tight block">
                  Nutty Tales <span className="text-[#C9A45C]">Crafts</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                  Pashmina · Pherans · Heritage FW26
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {CRAFTS_NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.label}
                    href={getLinkHref(link.href)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1 ${
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
                href={getLinkHref('/wholesale')}
                className="px-4 py-2.5 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <span>🌍</span>
                <span>Wholesale Desk</span>
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
            {CRAFTS_NAV_LINKS.map((link) => (
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
              href={getLinkHref('/wholesale')}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl mt-2"
            >
              Wholesale &amp; Export Desk
            </Link>
          </div>
        )}
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Dedicated Crafts Footer ───────────────────────────────────── */}
      <footer className="bg-[#10192A] text-white border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧣</span>
                <span className="font-serif text-lg font-bold">Nutty Tales Crafts</span>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Global marketplace for luxury Himalayan handlooms, GI-certified Changthangi Pashmina, hand-embroidered pherans, tailored jackets, and artisanal home decor. Evidence-backed provenance directly connecting master weavers to global wardrobes and boutiques.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Collections</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Kani &amp; Sozni Pashmina Shawls</li>
                <li>Pure Sheep Wool &amp; Velvet Pherans</li>
                <li>Tailored Nehru &amp; Long Winter Coats</li>
                <li>Carved Walnut Wood &amp; Papier-Mâché</li>
                <li>Silk Carpets &amp; Heritage Throws</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Wholesale &amp; Export</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Boutique Bulk Orders (MOQ 25 units)</li>
                <li>Official GI Tag Authentication Proof</li>
                <li>Certificate of Origin &amp; Export Customs</li>
                <li>Duty-Paid Air Logistics (UK, UAE, US, EU)</li>
                <li>Private Label Artisan Production</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Artisan Desk</h4>
              <p className="text-stone-400">
                Email: crafts@nutytales.com<br />
                Weaver Guilds: Zadibal, Kanihama, Charar-i-Sharief<br />
                Concierge: +91 9717161809
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
                  A Nutty Tales Group Company
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <span>© {new Date().getFullYear()} Nutty Tales Crafts. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href={getLinkHref('/wholesale')} className="hover:text-white">Wholesale Desk</Link>
              <Link href={getLinkHref('/dashboard')} className="hover:text-white">Marketplace Dashboard</Link>
              <a href="https://www.nutytales.com" className="hover:text-white">Nutty Tales Group Gateway</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
