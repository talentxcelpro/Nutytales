'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

const GIFTING_NAV_LINKS = [
  { label: 'Explore Gifts', href: '/#hampers' },
  { label: 'Occasions', href: '/#occasions' },
  { label: 'Corporate', href: '/#corporate' },
  { label: 'Collections', href: '/#collections' },
  { label: 'Personalized', href: '/designer', badge: 'SI Studio' },
  { label: 'Bulk Gifting', href: '/recipients', badge: 'Roster Desk' },
]

export default function GiftingShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [ecosystemMenuOpen, setEcosystemMenuOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/gifting' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/gifting/, '') || '/'
    return cleanPath === href || cleanPath.startsWith(href)
  }

  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/gifting')) {
      return href === '/' ? '/gifting' : `/gifting${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] flex flex-col font-sans">
      {/* ── Gifting Top Ribbon ─────────────────────────────────────────────────── */}
      <div className="bg-[#10192A] text-stone-300 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nuty Tales Gifting — The Global Gifting OS</span>
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#C9A45C]">
            Outcome Intelligence · Recipient Choice Links · PAN-India &amp; Global Air Dispatch (UAE, UK, US)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales Gifting! I need a tailored gifting program proposal.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Corporate Hotline</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* ── Gifting Brand Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-2xl bg-[#17233B] flex items-center justify-center text-white font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                <span>🎁</span>
              </div>
              <div>
                <span className="font-serif text-xl font-extrabold text-[#17233B] tracking-tight block">
                  NUTY TALES <span className="text-[#C9A45C]">GIFTING</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32]">
                  Gifts that mean something
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {GIFTING_NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.label}
                    href={getLinkHref(link.href)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
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
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
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
                href={getLinkHref('/designer')}
                className="px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>DESIGN A GIFT</span>
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
            {GIFTING_NAV_LINKS.map((link) => (
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
              href={getLinkHref('/recipients')}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 bg-[#C9A45C] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl mt-2"
            >
              Bulk Upload Recipients
            </Link>
          </div>
        )}
      </header>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Dedicated Gifting Footer ───────────────────────────────────── */}
      <footer className="bg-[#10192A] text-white border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <span className="font-serif text-lg font-bold">Nuty Tales Gifting</span>
              </div>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Global corporate gifting, festival hampers, and bespoke celebration boxes. One order executed end-to-end with laser personalization, multi-city air dispatch, and real-time delivery reports.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Gifting Solutions</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>Corporate Employee Gifting</li>
                <li>VIP Client &amp; CXO Executive Boxes</li>
                <li>Festive Season Priority Procurement</li>
                <li>Wedding Welcome Hampers</li>
                <li>International Air Gifting (UAE, UK, US)</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Operations &amp; Trust</h4>
              <ul className="space-y-1.5 text-stone-300">
                <li>FSSAI Certified Fresh Packing</li>
                <li>Laser Foil Logo Branding</li>
                <li>Multi-Address Excel / CSV Ingestion</li>
                <li>Corporate GST Invoicing</li>
                <li>Dedicated Account Concierge</li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-[#C9A45C] uppercase tracking-wider text-[11px]">Corporate Desk</h4>
              <p className="text-stone-400">
                Email: gifting@nutytales.com<br />
                Hotline: +91 9717161809<br />
                Hubs: Noida, Srinagar, Patna
              </p>
              <div className="pt-2">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest block">
                  A Nuty Tales Company
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
            <span>© {new Date().getFullYear()} Nuty Tales Gifting. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href={getLinkHref('/recipients')} className="hover:text-white">Multi-Recipient Desk</Link>
              <Link href={getLinkHref('/dashboard')} className="hover:text-white">Corporate Dashboard</Link>
              <a href="https://www.nutytales.com" className="hover:text-white">Nuty Tales Gateway</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
