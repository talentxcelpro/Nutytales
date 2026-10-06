'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[82vh] flex items-center bg-[#F7F2E8] pt-24 pb-16 lg:py-0 overflow-hidden border-b border-[#17233B]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (45%) */}
          <div className="lg:col-span-5 space-y-6 lg:pr-6">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-semibold block">
                Nutty Tales
              </span>
              <p className="font-serif italic text-base text-[#176B68]">
                Wholesome Nutty Delights
              </p>
            </div>

            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17233B] tracking-tight leading-[1.15]">
                The finest nuts, <br />
                thoughtfully sourced.
              </h1>
              <p className="text-sm sm:text-base text-[#17233B]/80 max-w-md font-normal leading-relaxed">
                Premium dry fruits for everyday indulgence, wholesale supply, and thoughtful gifting. From California and Kashmir to your home.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow-sm"
              >
                Shop Dry Fruits
              </Link>
              <Link
                href="/wholesale-dry-fruits"
                className="px-6 py-3.5 border border-[#17233B] text-[#17233B] hover:bg-[#17233B] hover:text-white text-xs uppercase tracking-widest font-semibold transition-all duration-200"
              >
                Wholesale
              </Link>
            </div>

            {/* Subtle third option for Stays */}
            <div className="pt-2">
              <Link
                href="/stays"
                className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase font-semibold text-[#176B68] hover:text-[#214B39] transition-colors"
              >
                <span>Explore Nutty Tales Stays</span>
                <span className="text-sm">→</span>
              </Link>
            </div>

            {/* Micro Trust Strip */}
            <div className="pt-6 border-t border-[#17233B]/10 flex items-center gap-6 text-[11px] uppercase tracking-wider text-[#704B32] font-medium">
              <span>FSSAI Certified</span>
              <span className="text-stone-300">•</span>
              <span>GST Invoices</span>
              <span className="text-stone-300">•</span>
              <span>Pan-India Supply</span>
            </div>
          </div>

          {/* Right Column (55%): Pure Lifestyle Food Photography & Real Packaging */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-[#17233B]/10">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/hero-lifestyle-bowl.png"
                  alt="Nutty Tales Almonds and Cashews in handcrafted wooden bowl"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>

              {/* Inset floating cards with real Nutty Tales packaging */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#F7F2E8]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#17233B]/10 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-14 bg-white rounded border border-stone-200 overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/almonds-pouch-250g.png"
                      alt="Nutty Tales Almonds Pack"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative w-10 h-14 bg-white rounded border border-stone-200 overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/cashews-pouch-250g.jpg"
                      alt="Nutty Tales Cashews Pack"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-[#17233B] block">
                      Artisanal 250g &amp; 1kg Vacuum Pouches
                    </span>
                    <span className="text-[10px] text-[#704B32] tracking-wider uppercase block">
                      Almonds • Cashews • Walnuts • Makhana
                    </span>
                  </div>
                </div>

                <Link
                  href="/shop"
                  className="hidden sm:inline-block text-[11px] font-semibold text-[#176B68] hover:underline uppercase tracking-wider whitespace-nowrap"
                >
                  View Packs →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
