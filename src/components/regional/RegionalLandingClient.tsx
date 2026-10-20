'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RegionalConfig, RegionalProductItem, RegionKey } from '@/lib/regional-data'
import { CurrencyCode, formatGlobalPrice } from '@/lib/global-config'

export default function RegionalLandingClient({
  config,
  featuredProducts,
}: {
  config: RegionalConfig
  featuredProducts: RegionalProductItem[]
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const storeHref = `${config.pathPrefix}/store`

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-white/10 bg-radial-gradient">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300">
                <span>{config.heroBadge}</span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-300">{config.deliveryEstimate}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                {config.heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-light max-w-2xl">
                {config.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href={storeHref}
                  className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl hover:shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <span>Browse {config.packagingBadge}s</span>
                  <span className="text-lg">→</span>
                </Link>

                <a
                  href="#coverage"
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition"
                >
                  View Delivery Countries
                </a>
              </div>

              {/* Trust badges strip */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-300">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-amber-400 font-bold">100% Guaranteed</p>
                  <p className="text-[11px] text-stone-400">Customs Pre-Cleared</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-amber-400 font-bold">Cold-Chain Air</p>
                  <p className="text-[11px] text-stone-400">Temperature Verified</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-amber-400 font-bold">Direct Harvest</p>
                  <p className="text-[11px] text-stone-400">Kashmir &amp; Mithila</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-amber-400 font-bold">{config.shippingCarriers[0]}</p>
                  <p className="text-[11px] text-stone-400">Tracked Air Courier</p>
                </div>
              </div>
            </div>

            {/* Right Showcase Box (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-gradient-to-b from-white/15 to-white/5 p-6 border border-white/20 shadow-2xl backdrop-blur-md">
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-stone-900 border border-white/10">
                  <Image
                    src={featuredProducts[0]?.baseProduct.image || '/images/luxury-hamper-jars.png'}
                    alt={config.brandName}
                    fill
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-amber-300 border border-white/20">
                    {config.packagingBadge}
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-600/90 text-[11px] font-bold text-white shadow">
                    Active Flight Dispatch
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                      Signature Dispatch
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {featuredProducts[0]?.formattedPrice}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">
                    {featuredProducts[0]?.regionalEditionTitle || 'Gourmet Selection'}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2">
                    {config.packagingDescription}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`${storeHref}/${featuredProducts[0]?.regionalSlug}`}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition border border-white/15"
                    >
                      <span>View Edition Details</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Highlights / Strategic Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Regional Infrastructure
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Built for Seamless Cross-Border Delivery
          </h2>
          <p className="text-sm text-stone-400">
            Every shipment operates under dedicated international air-logistics corridors with zero customs friction for the recipient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.highlights.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition space-y-3"
            >
              <span className="text-3xl block">{item.icon}</span>
              <h3 className="font-serif text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-stone-400 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Regional Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Curated Catalog
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Popular {config.packagingBadge} Selections
            </h2>
            <p className="text-xs text-stone-400">
              Pattern: <code className="text-amber-300 font-mono">{config.pathPrefix}/store/[product]{config.slugSuffix}</code>
            </p>
          </div>
          <Link
            href={storeHref}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 uppercase tracking-wider"
          >
            <span>View All Products</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((item) => (
            <Link
              key={item.regionalSlug}
              href={`${storeHref}/${item.regionalSlug}`}
              className="group rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition p-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-stone-900 border border-white/10">
                  <Image
                    src={item.baseProduct.image || '/images/luxury-hamper-jars.png'}
                    alt={item.regionalName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/20">
                    {item.packagingBadge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>{item.baseProduct.origin}</span>
                    <span className="font-semibold text-emerald-400">Grade: {item.baseProduct.grade}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition">
                    {item.regionalName}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-2 font-light">
                    {item.baseProduct.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">Price / 1kg</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {item.formattedPrice}
                  </span>
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-stone-950 transition">
                  Order ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Delivery Countries & Coverage Map */}
      <section id="coverage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/15 p-8 sm:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Guaranteed Coverage
            </span>
            <h2 className="font-serif text-3xl font-bold text-white">
              Doorstep Delivery in {config.supportedCountries.length} Countries
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              We operate dedicated air consolidation to eliminate custom hold-ups and import duties for your friends, family, and clients.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {config.supportedCountries.map((c) => (
              <div
                key={c.code}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs"
              >
                <span className="text-2xl">{c.flag}</span>
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">{c.name}</p>
                  <p className="text-[10px] text-stone-400">{config.deliveryEstimate.split(' ')[0]} - {config.deliveryEstimate.split(' ')[2]} Days</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>All Taxes &amp; Customs Duties Included (DDP)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>Full SMS &amp; Email Courier Tracking Link</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>100% In-Transit Damage / Spoilage Replacement Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Assurance &amp; Details
          </span>
          <h2 className="font-serif text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-400">
            Everything you need to know about international dispatch, compliance, and payment.
          </p>
        </div>

        <div className="space-y-3">
          {config.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-amber-300"
                >
                  <span>{faq.question}</span>
                  <span className="font-mono text-base text-amber-400">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-stone-300 leading-relaxed font-light border-t border-white/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-amber-600 to-amber-700 p-8 sm:p-14 text-center text-stone-950 space-y-6 shadow-2xl">
          <span className="text-xs uppercase font-extrabold tracking-widest bg-black/10 px-3 py-1 rounded-full inline-block">
            {config.subdomain}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight">
            Ready to Experience Authentic Himalayan Harvest?
          </h2>
          <p className="text-sm sm:text-base font-medium text-stone-900 max-w-xl mx-auto">
            Order your customized {config.packagingBadge.toLowerCase()} with direct dispatch from our {config.regionalHub.split('&')[0]}.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={storeHref}
              className="px-8 py-4 rounded-2xl bg-stone-950 hover:bg-black text-white font-bold text-sm tracking-wide shadow-lg transition"
            >
              Open {config.brandName} Catalog
            </Link>
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(
                `Hello Nuty Tales, I want to book a ${config.packagingBadge} for delivery via ${config.subdomain}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-2xl bg-white/20 hover:bg-white/30 text-stone-950 font-bold text-sm transition"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
