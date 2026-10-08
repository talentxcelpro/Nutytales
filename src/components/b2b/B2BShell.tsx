'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { B2B_NAV_LINKS } from '@/lib/b2b-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'
import GroupEcosystemBar from '@/components/group/GroupEcosystemBar'

export default function B2BShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Normalize path for active link detection (handles both /b2b/rfq and rewritten /rfq)
  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/b2b' || pathname === '/'
    }
    const cleanPath = pathname.replace(/^\/b2b/, '') || '/'
    return cleanPath.startsWith(href)
  }

  // Construct link href preserving rewritten or direct routing
  const getLinkHref = (href: string) => {
    if (pathname.startsWith('/b2b')) {
      return href === '/' ? '/b2b' : `/b2b${href}`
    }
    return href
  }

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#17233B] flex flex-col font-sans">
      {/* ── B2B Top Utility Notification Bar ───────────────────────────────────── */}
      <div className="bg-[#10192A] text-stone-300 text-[11px] py-2 px-4 sm:px-8 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Nuty Tales Enterprise Sourcing &amp; Industrial Supply Hub</span>
          </span>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:inline text-[#C9A45C]">
            FSSAI Central Lic. {FSSAI_NUMBER} · NABL Tested COA Guarantee
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <a
            href="https://www.nutytales.com"
            className="text-stone-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Retail Store</span>
            <span className="text-[10px]">↗</span>
          </a>
          <span className="text-white/20">|</span>
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales B2B Procurement Desk! I am inquiring about industrial bulk dry fruit supply.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>B2B Desk: +91 9717161809</span>
          </a>
        </div>
      </div>

      {/* ── Amazon Business-Inspired Main B2B Header ───────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Logo & Enterprise Sub-Branding */}
            <div className="flex items-center gap-4">
              <Link href={getLinkHref('/')} className="flex items-center gap-3 group">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-[#17233B] p-1 border border-[#C9A45C]/30 shadow-sm flex-shrink-0">
                  <Image
                    src="/images/logo.png"
                    alt="Nuty Tales"
                    fill
                    className="object-contain p-1"
                    sizes="44px"
                    priority
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-black text-xl tracking-tight text-[#17233B]">
                      nuty tales
                    </span>
                    <span className="font-serif font-bold text-xl text-[#704B32] italic">
                      business
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#17233B] text-[#C9A45C] text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                      B2B Direct
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Commercial Ingredients &amp; Wholesale
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Amazon Business 3-Step Indicator Preview (Visible on large screens) */}
            <div className="hidden xl:flex items-center gap-2 bg-[#FAF6EE] px-4 py-2 rounded-full border border-stone-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-[#704B32] tracking-wider mr-1">
                Fast Onboarding:
              </span>
              <div className="flex items-center gap-1.5 font-bold text-[#17233B]">
                <span className="w-5 h-5 rounded-full bg-[#17233B] text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span className="text-[11px]">Work Email</span>
              </div>
              <span className="text-stone-300">→</span>
              <div className="flex items-center gap-1.5 text-stone-500">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span className="text-[11px]">Business &amp; GSTIN</span>
              </div>
              <span className="text-stone-300">→</span>
              <div className="flex items-center gap-1.5 text-stone-500">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span className="text-[11px]">Wholesale Tier Active</span>
              </div>
            </div>

            {/* Right Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={getLinkHref('/rfq')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>⚡</span>
                <span>Instant RFQ</span>
              </Link>

              <Link
                href={getLinkHref('/account')}
                className="px-4 py-2 bg-[#17233B] hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2"
              >
                <span>🏢</span>
                <span>Business Sign In</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-700 hover:text-[#17233B] rounded-lg"
                aria-label="Toggle B2B menu"
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

        {/* ── Alibaba-Grade B2B Secondary Navigation Bar ─────────────────────────── */}
        <div className="border-t border-stone-200 bg-[#FAF6EE] hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 py-1.5 text-xs font-bold">
              {B2B_NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={getLinkHref(link.href)}
                    className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-[#17233B] text-white shadow-sm'
                        : 'text-stone-700 hover:text-[#17233B] hover:bg-stone-200/60'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                          active
                            ? 'bg-[#C9A45C] text-[#17233B]'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                )
              })}

              <div className="ml-auto flex items-center gap-3 text-[11px] text-stone-500">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span>✓</span> Net-30 Invoicing
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span>✓</span> 18% GST Input Credit
                </span>
                <span className="text-stone-300">•</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <span>✓</span> Pallet &amp; Container Logistics
                </span>
              </div>
            </nav>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ───────────────────────────────────────────── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 animate-fadeIn">
            {B2B_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={getLinkHref(link.href)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl font-bold text-sm ${
                    active ? 'bg-[#17233B] text-white' : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] bg-[#C9A45C] text-[#17233B] px-2 py-0.5 rounded font-bold">
                        {link.badge}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </header>

      {/* ── Main Content Area ─────────────────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Dedicated B2B Enterprise Footer ───────────────────────────────────── */}
      <footer className="bg-[#10192A] text-stone-300 border-t border-white/10 text-xs mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: B2B Brand & Accreditations */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#17233B] p-1 border border-[#C9A45C]/40 flex items-center justify-center">
                  <span className="font-serif font-black text-lg text-[#C9A45C]">NT</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Nuty Tales Business Supply</h3>
                  <p className="text-[11px] text-stone-400">
                    Industrial B2B Raw Ingredient Procurement &amp; Processing Infrastructure
                  </p>
                </div>
              </div>

              <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
                Direct grower aggregation, optical sorting, mechanical precision cutting, and quarterly supply contracts for commercial food manufacturing, bakeries, confectionery, and 5-star hospitality.
              </p>

              <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-[#C9A45C]">✦</span>
                  <strong>FSSAI Central License:</strong> {FSSAI_NUMBER}
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-[#C9A45C]">✦</span>
                  <strong>Quality Standard:</strong> NABL Accredited Lab Batch Analysis COA
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-[#C9A45C]">✦</span>
                  <strong>Export Credentials:</strong> APEDA Registered Merchant Exporter
                </div>
              </div>
            </div>

            {/* Col 2: Procurement Navigation */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#C9A45C]">
                B2B Procurement
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li><Link href={getLinkHref('/catalog')} className="hover:text-white transition-colors">Wholesale Commodities</Link></li>
                <li><Link href={getLinkHref('/rfq')} className="hover:text-white transition-colors">Instant RFQ Terminal</Link></li>
                <li><Link href={getLinkHref('/quotes')} className="hover:text-white transition-colors">Commercial Quotes Desk</Link></li>
                <li><Link href={getLinkHref('/orders')} className="hover:text-white transition-colors">Purchase Order (PO) Processing</Link></li>
                <li><Link href={getLinkHref('/replenishment')} className="hover:text-white transition-colors">Scheduled Replenishment</Link></li>
                <li><Link href={getLinkHref('/account')} className="hover:text-white transition-colors">Organization Account &amp; GSTIN</Link></li>
              </ul>
            </div>

            {/* Col 3: Sectors Served */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#C9A45C]">
                Commercial Sectors
              </h4>
              <ul className="space-y-2 text-stone-400">
                <li><span className="text-stone-300">Commercial Bakeries</span> (Sliced 0.8mm)</li>
                <li><span className="text-stone-300">Sweet &amp; Mithai Plants</span> (Kaju Katli)</li>
                <li><span className="text-stone-300">5-Star Hotel Chains</span> (Mini Bar &amp; Buffet)</li>
                <li><span className="text-stone-300">Biscuit &amp; Cookie Lines</span> (Nut Dices)</li>
                <li><span className="text-stone-300">Healthy Snack Brands</span> (Makhana)</li>
                <li><span className="text-stone-300">Private Label D2C</span> (Custom Pouch)</li>
              </ul>
            </div>

            {/* Col 4: Warehouse Hubs */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider text-[#C9A45C]">
                Fulfillment Hubs
              </h4>
              <div className="space-y-2.5 text-[11px] text-stone-400">
                <div>
                  <strong className="text-white block">Noida HQ Processing Hub:</strong>
                  Sector 63 Logistics Corridor, UP 201301
                </div>
                <div>
                  <strong className="text-white block">Kashmir Valley Center:</strong>
                  Pampore Highway, Srinagar, J&amp;K 192121
                </div>
                <div>
                  <strong className="text-white block">Patna Makhana Depot:</strong>
                  Industrial Area, Patna, Bihar 800002
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <div>
              © {new Date().getFullYear()} Nuty Tales Business Supply. Dedicated B2B Wholesale Portal. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>GST Input Credit (5% / 12%)</span>
              <span>•</span>
              <span>Net-30 Commercial Credit</span>
              <span>•</span>
              <a href="https://www.nutytales.com" className="text-[#C9A45C] hover:underline">
                Consumer Store: nutytales.com ↗
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
