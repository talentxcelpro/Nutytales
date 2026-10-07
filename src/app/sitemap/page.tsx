import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products-data'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { KASHMIR_TRAVEL_PACKAGES } from '@/lib/travel-data'
import { INDUSTRIES } from '@/lib/business-supply-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Global Directory & Sitemap | Nutty Tales Network',
  description:
    'Comprehensive directory and sitemap of the Nutty Tales Group. Explore our 6 independent business verticals: gourmet foods, B2B wholesale, corporate gifting, luxury stays, Kashmir travel, and GI crafts.',
  alternates: {
    canonical: 'https://nutytales.com/sitemap',
  },
}

export default function HtmlSitemapPage() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <main className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-28 sm:pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-4 border-b border-[#17233B]/10 pb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A45C]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#17233B]/60">Navigation</span>
            <span>/</span>
            <span className="text-[#17233B] font-semibold">Sitemap</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#C9A45C]/15 text-[#96732B] font-semibold text-xs tracking-wider uppercase border border-[#C9A45C]/30">
              Complete Global Directory
            </span>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="px-3 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-xs border border-emerald-200 transition-colors"
            >
              Raw XML Feed (/sitemap.xml) ↗
            </a>
            <span className="text-xs text-[#17233B]/50 font-mono">
              7 Business Domains Synchronized
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17233B]">
            Nutty Tales Architecture &amp; Index
          </h1>

          <p className="text-sm sm:text-base text-[#17233B]/80 leading-relaxed font-normal max-w-2xl">
            Quickly navigate all commercial landing pages, B2B procurement portals, boutique residence collections, and heirloom handloom catalogs across the Nutty Tales network.
          </p>
        </div>

        {/* 6 Vertical Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
          {/* Vertical 1: Foods & Dry Fruits */}
          <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#17233B]/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">1. Gourmet Foods &amp; Nuts</h2>
              <span className="text-xs font-mono text-[#C9A45C] bg-[#C9A45C]/10 px-2 py-0.5 rounded">Retail</span>
            </div>
            <ul className="space-y-2 text-xs text-[#17233B]/80">
              <li>
                <Link href="/" className="font-semibold text-[#17233B] hover:text-[#C9A45C]">
                  &bull; Homepage &amp; Tri-Hub Axis
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#C9A45C]">&bull; Complete Online Shop</Link>
              </li>
              <li>
                <Link href="/makhana" className="hover:text-[#C9A45C]">&bull; Mithila Phool Makhana Direct</Link>
              </li>
              {PRODUCTS.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/shop/${p.slug}`} className="hover:text-[#C9A45C]">
                    &bull; {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 2: B2B Business Supply */}
          <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#17233B]/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">2. B2B Wholesale &amp; Supply</h2>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Wholesale</span>
            </div>
            <ul className="space-y-2 text-xs text-[#17233B]/80">
              <li>
                <Link href="/business-supply" className="font-semibold text-[#17233B] hover:text-[#C9A45C]">
                  &bull; B2B Procurement Desk
                </Link>
              </li>
              <li>
                <Link href="/bulk-quote" className="hover:text-[#C9A45C]">&bull; Instant RFQ Generator</Link>
              </li>
              <li>
                <Link href="/founders" className="hover:text-[#C9A45C]">&bull; Nuty Tales Founder Program</Link>
              </li>
              <li>
                <Link href="/wholesale-dry-fruits/noida" className="hover:text-[#C9A45C]">&bull; Wholesale Dry Fruits Noida (HQ)</Link>
              </li>
              <li>
                <Link href="/wholesale-dry-fruits/kashmir" className="hover:text-[#C9A45C]">&bull; Wholesale Dry Fruits Kashmir</Link>
              </li>
              <li>
                <Link href="/wholesale-dry-fruits/patna" className="hover:text-[#C9A45C]">&bull; Wholesale Dry Fruits Patna</Link>
              </li>
              {INDUSTRIES.slice(0, 4).map((ind) => (
                <li key={ind.slug}>
                  <Link href={`/wholesale-dry-fruits/${ind.slug}`} className="hover:text-[#C9A45C]">
                    &bull; Supply for {ind.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 3: Corporate Gifting */}
          <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#17233B]/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">3. Corporate Gifting</h2>
              <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Bespoke</span>
            </div>
            <ul className="space-y-2 text-xs text-[#17233B]/80">
              <li>
                <Link href="/gifting" className="font-semibold text-[#17233B] hover:text-[#C9A45C]">
                  &bull; Master Gifting Studio
                </Link>
              </li>
              <li>
                <Link href="/corporate-gifting" className="hover:text-[#C9A45C]">&bull; Corporate Hampers 2026</Link>
              </li>
              <li>
                <Link href="/corporate-gifts/diwali" className="hover:text-[#C9A45C]">&bull; Diwali Luxury Hampers</Link>
              </li>
              <li>
                <Link href="/corporate-gifts/dubai" className="hover:text-[#C9A45C]">&bull; Corporate Gifts Dubai &amp; GCC</Link>
              </li>
              <li>
                <Link href="/corporate-gifts/mumbai" className="hover:text-[#C9A45C]">&bull; Corporate Gifts Mumbai</Link>
              </li>
              <li>
                <Link href="/corporate-gifts/employee-gifts" className="hover:text-[#C9A45C]">&bull; Employee Milestone Kits</Link>
              </li>
              <li>
                <Link href="/corporate-gifts/client-gifts" className="hover:text-[#C9A45C]">&bull; Executive Client Gifts</Link>
              </li>
            </ul>
          </div>

          {/* Vertical 4: Destination Weddings */}
          <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#17233B]/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">4. Destination Weddings</h2>
              <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">Weddings</span>
            </div>
            <ul className="space-y-2 text-xs text-[#17233B]/80">
              <li>
                <Link href="/weddings" className="font-semibold text-[#17233B] hover:text-[#C9A45C]">
                  &bull; Weddings by Nuty Tales
                </Link>
              </li>
              <li>
                <Link href="/destination-weddings/kashmir" className="hover:text-[#C9A45C]">&bull; Destination Weddings Kashmir</Link>
              </li>
              <li>
                <Link href="/destination-weddings/dubai" className="hover:text-[#C9A45C]">&bull; Destination Weddings Dubai</Link>
              </li>
              <li>
                <Link href="/destination-weddings/italy" className="hover:text-[#C9A45C]">&bull; Destination Weddings Italy</Link>
              </li>
              <li>
                <Link href="/wedding-return-gifts" className="hover:text-[#C9A45C]">&bull; Royal Wedding Return Favours</Link>
              </li>
            </ul>
          </div>

          {/* Vertical 5: Heirloom Crafts */}
          <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#17233B]/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">5. GI Heirloom Crafts</h2>
              <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">GI Tagged</span>
            </div>
            <ul className="space-y-2 text-xs text-[#17233B]/80">
              <li>
                <Link href="/crafts" className="font-semibold text-[#17233B] hover:text-[#C9A45C]">
                  &bull; FW &apos;26 Lookbook &amp; Crafts Portal
                </Link>
              </li>
              <li>
                <Link href="/pashmina-shawls" className="hover:text-[#C9A45C]">&bull; Certified Changthangi Pashminas</Link>
              </li>
              <li>
                <Link href="/crafts/try-with-si" className="hover:text-[#C9A45C]">&bull; Try with SI &mdash; Virtual Drape</Link>
              </li>
              <li>
                <Link href="/crafts/kashmir/shawls" className="hover:text-[#C9A45C]">&bull; Kani &amp; Sozni Shawls</Link>
              </li>
              <li>
                <Link href="/crafts/kashmir/pherans" className="hover:text-[#C9A45C]">&bull; Pure Wool Kashmiri Pherans</Link>
              </li>
              {CRAFT_PRODUCTS.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link href={`/crafts/product/${c.slug}`} className="hover:text-[#C9A45C]">
                    &bull; {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertical 6: Stays & Travel */}
          <div className="bg-white rounded-2xl border border-[#17233B]/10 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#17233B]/10 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#17233B]">6. Stays &amp; Kashmir Travel</h2>
              <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">Hospitality</span>
            </div>
            <ul className="space-y-2 text-xs text-[#17233B]/80">
              <li>
                <Link href="/stays" className="font-semibold text-[#17233B] hover:text-[#C9A45C]">
                  &bull; Boutique Residences &amp; Estates
                </Link>
              </li>
              <li>
                <Link href="/travel/kashmir" className="font-semibold text-[#17233B] hover:text-[#C9A45C]">
                  &bull; Curated Kashmir Expeditions
                </Link>
              </li>
              <li>
                <Link href="/travel/builder" className="hover:text-[#C9A45C]">&bull; SI Dynamic Itinerary Planner</Link>
              </li>
              {STAY_PROPERTIES.slice(0, 3).map((s) => (
                <li key={s.slug}>
                  <Link href={`/stays/${s.slug}`} className="hover:text-[#C9A45C]">
                    &bull; {s.name}
                  </Link>
                </li>
              ))}
              {KASHMIR_TRAVEL_PACKAGES.slice(0, 3).map((pkg) => (
                <li key={pkg.slug}>
                  <Link href={`/travel/kashmir/${pkg.slug}`} className="hover:text-[#C9A45C]">
                    &bull; {pkg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal & Compliance Directory */}
        <div className="bg-[#17233B] text-white p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Trust, Legal &amp; Regulatory Feeds</h2>
              <p className="text-xs text-stone-300">Statutory policies, terms, insured shipping guidelines, and automated indexing endpoints.</p>
            </div>
            <a
              href={`https://wa.me/${whatsappPhone}?text=Hello%20Nutty%20Tales%20Concierge%2C%20I%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C9A45C] hover:bg-[#B38F46] text-[#17233B] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              💬 WhatsApp Concierge
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <Link href="/privacy" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block">
              <strong className="text-white block font-semibold mb-0.5">Privacy Policy</strong>
              <span className="text-stone-400 text-[11px]">DPDP Act 2023 Compliant</span>
            </Link>
            <Link href="/terms" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block">
              <strong className="text-white block font-semibold mb-0.5">Terms of Service</strong>
              <span className="text-stone-400 text-[11px]">Commercial &amp; B2B Agreements</span>
            </Link>
            <Link href="/shipping" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block">
              <strong className="text-white block font-semibold mb-0.5">Insured Shipping</strong>
              <span className="text-stone-400 text-[11px]">Tri-Hub Zero-Loss Guarantee</span>
            </Link>
            <a href="/sitemap.xml" target="_blank" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block">
              <strong className="text-white block font-semibold mb-0.5">Root sitemap.xml ↗</strong>
              <span className="text-stone-400 text-[11px]">Auto-Sharded Index Feed</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
