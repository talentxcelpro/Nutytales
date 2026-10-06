import Link from 'next/link'
import Image from 'next/image'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

const FOOTER_COLS = [
  {
    title: 'Collection',
    links: [
      { label: 'All Dry Fruits', href: '/shop' },
      { label: 'California & Kashmir Almonds', href: '/shop?category=almonds' },
      { label: 'W180 & W240 Cashews', href: '/shop?category=cashews' },
      { label: 'Kashmiri Snow Walnuts', href: '/shop?category=walnuts' },
      { label: 'Mithila Phool Makhana', href: '/makhana' },
      { label: 'Iranian & Afghan Pistachios', href: '/shop?category=pistachios' },
    ],
  },
  {
    title: 'Wholesale & B2B',
    links: [
      { label: 'Commercial Sourcing Portal', href: '/wholesale-dry-fruits' },
      { label: 'Noida Central Procurement Hub', href: '/wholesale-dry-fruits/noida' },
      { label: 'Kashmir / Srinagar Distribution', href: '/wholesale-dry-fruits/kashmir' },
      { label: 'Patna / Bihar Distribution', href: '/wholesale-dry-fruits/patna' },
      { label: 'Request Bulk Quote (RFQ)', href: '/bulk-quote' },
      { label: 'B2B Account Registration', href: '/business' },
    ],
  },
  {
    title: 'Corporate Gifting',
    links: [
      { label: 'Diwali 2026 Collection', href: '/corporate-gifting' },
      { label: 'Employee Gift Hampers', href: '/corporate-gifting' },
      { label: 'Client & Executive Boxes', href: '/corporate-gifting' },
      { label: 'Handcrafted Wooden Chests', href: '/corporate-gifting' },
      { label: 'Custom Logo Branding', href: '/corporate-gifting' },
      { label: 'Corporate Quote Request', href: '/corporate-gifting#request-quote' },
    ],
  },
  {
    title: 'Stays & Travel',
    links: [
      { label: 'Nutty Tales Stays Overview', href: '/stays' },
      { label: 'Kashmir Valley Orchard Stay', href: '/stays/kashmir' },
      { label: 'Noida Executive Retreat', href: '/stays/noida' },
      { label: 'Patna Heritage Comfort Stay', href: '/stays/patna' },
      { label: 'Curated Kashmir Tours', href: '/travel/kashmir' },
      { label: 'Saffron & Walnut Orchard Walks', href: '/stays' },
    ],
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

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
                  alt="Nutty Tales"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  Nutty Tales
                </span>
                <span className="text-[10px] tracking-widest uppercase text-[#C9A45C] font-semibold block">
                  Wholesome Nutty Delights
                </span>
              </div>
            </Link>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm font-normal">
              An integrated gourmet dry-fruit commerce and boutique hospitality network. Connecting the orchards of Kashmir, the Makhana ponds of Bihar, and central procurement in Delhi NCR.
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
                  💬 WhatsApp / Call: +91 9717161809
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Columns (4 cols) */}
          {FOOTER_COLS.map((col, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C9A45C]">
                {col.title}
              </h4>
              <ul className="space-y-2 text-xs">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-stone-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Compliance Bar */}
      <div className="border-t border-white/10 bg-[#0F1726] py-6 text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} Nutty Tales. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400">
            <span className="text-[#C9A45C] font-semibold">
              FSSAI Lic. {FSSAI_NUMBER}
            </span>
            <span>•</span>
            <span>GST Tax Invoices</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
