'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

const FOOTER_COLS = [
  {
    title: 'Foods & Dry Fruits',
    links: [
      { label: 'All Dry Fruits & Foods', href: '/shop' },
      { label: 'Kashmiri Mamra & Kagzi Badam', href: '/shop?category=almonds' },
      { label: 'Kashmiri Kagzi Walnuts', href: '/shop?category=walnuts' },
      { label: 'Pure Mongra Saffron (GI-535)', href: '/shop?category=saffron' },
      { label: 'Kashmiri Acacia & Sidr Honey', href: '/shop?category=honey' },
      { label: 'Mithila Phool Makhana Jumbo', href: '/makhana' },
    ],
  },
  {
    title: 'Crafts & Heritage',
    links: [
      { label: 'Autumn & Winter Collections', href: '/crafts' },
      { label: 'Try with SI — Virtual Drape', href: '/crafts/try-with-si' },
      { label: 'Kani & Sozni Pashmina Shawls', href: '/crafts/kashmir/shawls' },
      { label: 'Kashmiri Pure Wool Pherans', href: '/crafts/kashmir/pherans' },
      { label: 'Fine Cashmere & Merino Stoles', href: '/crafts/kashmir/stoles' },
      { label: 'Aari Velvet Long Coats & Jackets', href: '/crafts/kashmir/jackets-coats' },
      { label: 'Carved Walnut Wood & Papier-Mâché', href: '/crafts/kashmir' },
    ],
  },
  {
    title: 'Marketplace & Partners',
    links: [
      { label: 'Global Commercial Search', href: '/search' },
      { label: 'Partner & Seller Network', href: '/partners' },
      { label: 'B2B Wholesale Supply', href: '/business-supply' },
      { label: 'Enterprise RFQ Desk', href: '/bulk-quote' },
      { label: 'Nuty Tales Founder Program', href: '/founders' },
      { label: 'Revenue OS Telemetry', href: '/admin/revenue-os' },
      { label: 'Partner Verification Desk', href: '/admin/partners' },
    ],
  },
  {
    title: 'Gifting, Stays & Campaigns',
    links: [
      { label: 'Master Gifting Portal', href: '/gifting' },
      { label: 'Weddings by Nuty Tales', href: '/weddings' },
      { label: 'Corporate & Festive Gifting', href: '/corporate-gifting' },
      { label: 'Boutique Stays & Residences', href: '/stays' },
      { label: 'Curated Kashmir Expeditions', href: '/travel/kashmir' },
      { label: 'Festivals of Nuty Tales', href: '/festivals' },
      { label: 'Seasonal Campaigns', href: '/seasons' },
    ],
  },
]

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Suppress consumer footer on dedicated standalone company shells or subdomains
  const isSubdomain =
    (typeof window !== 'undefined' && /^(business|gifting|weddings|crafts|stays|travel)\./i.test(window.location.hostname)) ||
    (typeof document !== 'undefined' && /nt_active_vertical=(business|gifting|weddings|crafts|stays|travel)/i.test(document.cookie))

  if (
    isSubdomain ||
    pathname?.startsWith('/b2b') ||
    pathname?.startsWith('/gifting') ||
    pathname?.startsWith('/weddings') ||
    pathname?.startsWith('/crafts') ||
    pathname?.startsWith('/stays') ||
    pathname?.startsWith('/travel')
  ) {
    return null
  }

  return (
    <footer className="bg-[#17233B] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white p-0.5 border border-white/20 flex-shrink-0">
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
                  Nuty Tales
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#C9A45C] font-semibold block">
                  Taste · Stay · Explore · Discover
                </span>
              </div>
            </Link>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm font-normal">
              An integrated gourmet dry-fruit commerce, luxury Himalayan crafts, and boutique hospitality network. Connecting the orchards &amp; loom clusters of Kashmir, the Makhana ponds of Bihar, and central procurement in Noida, Delhi NCR.
            </p>

            <div className="pt-2 text-xs text-stone-300 space-y-1">
              <p>📍 Central HQ: Sector 62, Noida, Delhi NCR</p>
              <p>🏔️ Valley Hub: Srinagar, Jammu &amp; Kashmir</p>
              <p>🌾 Eastern Hub: Patna, Bihar</p>
              <p className="pt-1">
                <a
                  href={`https://wa.me/${whatsappPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A45C] hover:underline font-semibold"
                >
                  💬 WhatsApp Concierge: +91 9717161809
                </a>
              </p>
            </div>
          </div>

          {/* Nav Columns (4 cols) */}
          {FOOTER_COLS.map((col, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-stone-300">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Official FSSAI & Quality Assurance Trust Ribbon */}
        <div className="mt-12 py-5 px-6 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-xl p-2 px-3 flex items-center justify-center shadow-xs flex-shrink-0">
              <Image
                src="/images/fssai-logo.png"
                alt="FSSAI Food Safety and Standards Authority of India"
                width={72}
                height={35}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white tracking-wide uppercase">
                  Central FSSAI Food Safety Certified
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified Active
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-mono mt-0.5">
                License No. <span className="text-[#C9A45C] font-semibold tracking-wider">{FSSAI_NUMBER}</span> · Standardized under Food Safety and Standards Act
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className="text-[#C9A45C]">✦</span> 100% Single-Origin Harvest
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C9A45C]">✦</span> NABL Lab Tested
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#C9A45C]">✦</span> Nitrogen-Flushed Barrier Packs
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span>© {currentYear} Nuty Tales Private Limited. All rights reserved.</span>
            <span>Central FSSAI Lic. {FSSAI_NUMBER}</span>
            <span>Govt. J&amp;K GI Tag Authenticity Certified</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-white transition-colors">
              Insured Shipping
            </Link>
            <Link href="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
