'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CountryCurrencyModal from '@/components/global/CountryCurrencyModal'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function GlobalFooter() {
  const pathname = usePathname()
  const [marketModalOpen, setMarketModalOpen] = useState(false)
  const currentYear = new Date().getFullYear()
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Suppress global footer when rendering dedicated standalone company shells or subdomains
  const isSubdomain =
    (typeof window !== 'undefined' && /^(business|gifting|weddings|crafts|stays|travel|nri)\./i.test(window.location.hostname)) ||
    (typeof document !== 'undefined' && /nt_active_vertical=(business|gifting|weddings|crafts|stays|travel|nri)/i.test(document.cookie))

  if (
    isSubdomain ||
    pathname?.startsWith('/b2b') ||
    pathname?.startsWith('/gifting') ||
    pathname?.startsWith('/weddings') ||
    pathname?.startsWith('/crafts') ||
    pathname?.startsWith('/stays') ||
    pathname?.startsWith('/travel') ||
    pathname?.startsWith('/nri')
  ) {
    return null
  }

  return (
    <>
      <footer className="bg-[#10192A] text-stone-300 border-t border-white/10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Col 1: Brand & Positioning (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 border border-white/20 flex-shrink-0">
                  <Image
                    src="/images/logo.jpg"
                    alt="Nuty Tales"
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                    Nuty Tales Foods &amp; Crafts
                  </span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#C9A45C] font-semibold block">
                    A subsidiary of Nexgenn Services
                  </span>
                </div>
              </Link>

              <p className="text-xs text-stone-400 leading-relaxed font-light max-w-sm">
                Dry fruits, nuts, healthy snacks, corporate gifting, wedding hampers and crafts. Connecting direct orchard sourcing in Kashmir, Mithila Makhana wetlands, and corporate logistics from Noida.
              </p>

              <div className="pt-2 text-xs text-stone-400 space-y-1">
                <p>📍 Registered HQ: PC-12, 003, Jaypee Wishtown, Sector 128, Noida, UP 201304</p>
                <p>🏔️ Kashmir: Arshid House, Dadna, Budgam · 🌾 Patna: Nafis Colony</p>
                <p className="font-mono text-[11px] text-stone-500">
                  Nuty Tales Foods &amp; Crafts · Central FSSAI: {FSSAI_NUMBER}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setMarketModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold flex items-center gap-2 transition"
                >
                  <span>🌐</span>
                  <span>Select Regional Market &amp; Currency</span>
                  <span>↗</span>
                </button>
              </div>
            </div>

            {/* Col 2: Shop Categories (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Shop Collections
              </h3>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><Link href="/shop" className="hover:text-white transition">All Gourmet Harvest</Link></li>
                <li><Link href="/shop?category=walnuts" className="hover:text-white transition">Kashmiri Kagzi Walnuts</Link></li>
                <li><Link href="/shop?category=saffron" className="hover:text-white transition">Pampore Mongra Saffron</Link></li>
                <li><Link href="/shop?category=almonds" className="hover:text-white transition">Mamra &amp; California Badam</Link></li>
                <li><Link href="/shop?category=makhana" className="hover:text-white transition">Jumbo Mithila Makhana</Link></li>
                <li><Link href="/shop?category=honey" className="hover:text-white transition">Raw High-Altitude Honey</Link></li>
                <li><Link href="/shop?category=cashews" className="hover:text-white transition">Jumbo Roasted Cashews</Link></li>
              </ul>
            </div>

            {/* Col 3: Customer Care (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Customer Care
              </h3>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><Link href="/account" className="hover:text-white transition">Order Tracking</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition">Shipping &amp; Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-white transition">Returns &amp; Refund Policy</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Quality &amp; Lab Standards</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
                <li>
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-semibold"
                  >
                    💬 WhatsApp Order Desk
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Sourcing (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Origin &amp; Trust
              </h3>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>100% Single-Origin Verified</li>
                <li>Zero Artificial Bleach or Polish</li>
                <li>Cold-Chain Nitrogen Sealed</li>
                <li>FSSAI Central Lic. {FSSAI_NUMBER}</li>
                <li>NABL Lab-Tested Batches</li>
                <li>Insured Global Courier Network</li>
              </ul>
            </div>

            {/* Col 5: Global Markets (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">
                Global Delivery
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-400">
                <li>🇮🇳 India (Domestic Express)</li>
                <li>🇦🇪 United Arab Emirates</li>
                <li>🇬🇧 United Kingdom</li>
                <li>🇺🇸 United States</li>
                <li>🇨🇦 Canada</li>
                <li>🇦🇺 Australia</li>
                <li>🇸🇬 Singapore</li>
                <li>🇸🇦 Saudi Arabia</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Focused on Shop with subtle ecosystem footer */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p>© {currentYear} Nuty Tales Foods &amp; Crafts · A subsidiary of Nexgenn Services. All rights reserved.</p>
              <p className="text-[11px] text-stone-500">
                Part of Nuty Tales technology ecosystem ·{' '}
                <a href="https://business.nutytales.com" className="hover:underline text-stone-400">Business</a> ·{' '}
                <a href="https://gifting.nutytales.com" className="hover:underline text-stone-400">Gifting</a> ·{' '}
                <a href="https://weddings.nutytales.com" className="hover:underline text-stone-400">Weddings</a> ·{' '}
                <a href="https://crafts.nutytales.com" className="hover:underline text-stone-400">Crafts</a> ·{' '}
                <a href="https://stays.nutytales.com" className="hover:underline text-stone-400">Stays</a> ·{' '}
                <a href="https://travel.nutytales.com" className="hover:underline text-stone-400">Travel</a>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="hover:text-stone-300">Privacy</Link>
              <Link href="/terms" className="hover:text-stone-300">Terms</Link>
              <Link href="/sitemap.xml" className="hover:text-stone-300">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>

      <CountryCurrencyModal
        isOpen={marketModalOpen}
        onClose={() => setMarketModalOpen(false)}
      />
    </>
  )
}
