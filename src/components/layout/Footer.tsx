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
      { label: 'Kashmiri Kagzi & Mamra Badam', href: '/shop?category=almonds' },
      { label: 'Kashmiri Kagzi Akhrot (Walnuts)', href: '/shop?category=walnuts' },
      { label: 'Pure Mongra Saffron (Pampore & Iran)', href: '/shop?category=saffron' },
      { label: 'Kashmiri Acacia & Sidr Honey', href: '/shop?category=honey' },
      { label: 'Mithila Phool Makhana Jumbo', href: '/makhana' },
    ],
  },
  {
    title: "Crafts & Heritage (FW '26)",
    links: [
      { label: 'Fall / Winter 2026 Lookbook', href: '/crafts' },
      { label: 'Try with SI — Virtual Drape', href: '/crafts/try-with-si' },
      { label: 'Kani & Sozni Pashmina Shawls', href: '/crafts/kashmir/shawls' },
      { label: 'Kashmiri Pure Wool Pherans', href: '/crafts/kashmir/pherans' },
      { label: 'Fine Cashmere & Merino Stoles', href: '/crafts/kashmir/stoles' },
      { label: 'Aari Velvet Long Coats & Jackets', href: '/crafts/kashmir/jackets-coats' },
      { label: 'Carved Walnut Wood & Papier-Mâché', href: '/crafts/kashmir' },
    ],
  },
  {
    title: 'Business Supply & Founders',
    links: [
      { label: 'B2B Business Supply Marketplace', href: '/business-supply' },
      { label: 'Nuty Tales Founder Program', href: '/founders' },
      { label: 'Bulk Ingredients Catalog', href: '/business-supply#bulk-ingredients' },
      { label: 'Enterprise Contract Procurement', href: '/business-supply#rfq-form' },
      { label: 'Noida Central Processing Hub', href: '/wholesale-dry-fruits/noida' },
      { label: 'Request Bulk Quote (RFQ)', href: '/bulk-quote' },
    ],
  },
  {
    title: 'Gifting, Stays & Weddings',
    links: [
      { label: 'Master Gifting Portal', href: '/gifting' },
      { label: 'Weddings by Nuty Tales', href: '/weddings' },
      { label: 'Corporate & Diwali 2026 Gifting', href: '/corporate-gifting' },
      { label: 'Boutique Stays (Srinagar, Noida, Patna)', href: '/stays' },
      { label: 'Curated Kashmir Tours & Packages', href: '/travel/kashmir' },
      { label: 'Saffron & Walnut Orchard Walks', href: '/stays' },
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

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-400 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span>© {currentYear} Nuty Tales Private Limited. All rights reserved.</span>
            <span>FSSAI Reg. No. {FSSAI_NUMBER}</span>
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
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
