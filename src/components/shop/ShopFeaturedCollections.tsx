'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const COLLECTIONS = [
  {
    title: 'The Kashmir Saffron Vault',
    tagline: 'Single-origin GI Mongra stigmas dried within hours of picking on the Pampore Karewa plateau.',
    badge: 'GI Tag Certified #GI-535',
    image: '/images/saffron-threads-macro.jpg',
    href: '/shop?category=saffron',
    accent: 'from-[#431407]/90 to-transparent',
  },
  {
    title: 'Himalayan Kagzi Walnut Reserves',
    tagline: 'Hand-cracked paper-thin walnut kernels, sun-dried without chemicals or sulfur bleaching.',
    badge: 'Harwan Single-Orchard',
    image: '/images/cashews-walnuts-macro.jpg',
    href: '/shop?category=walnuts',
    accent: 'from-[#17233B]/90 to-transparent',
  },
  {
    title: 'Mithila Giant Lotus Seed Lot',
    tagline: 'Pristine freshwater pond harvested Makhana, slow-roasted and optically graded for maximum puff volume.',
    badge: 'Grade-A 6-Soot Jumbo',
    image: '/images/makhana-pouch-250g.jpg',
    href: '/shop?category=makhana',
    accent: 'from-[#14532D]/90 to-transparent',
  },
]

export default function ShopFeaturedCollections() {
  return (
    <section id="collections" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B]/5 text-[#704B32] text-xs font-bold uppercase tracking-wider">
          <span>✦</span> Curated Editorial Lots
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#17233B]">
          Signature Harvest Reserves
        </h2>
        <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
          Limited single-origin lots with complete harvest traceability, grower attribution, and independent laboratory COA certification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTIONS.map((col, idx) => (
          <Link
            key={idx}
            href={col.href}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-stone-900 border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-7"
          >
            <Image
              src={col.image}
              alt={col.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-85"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${col.accent}`} />

            <div className="relative z-10 space-y-3">
              <span className="inline-block px-3 py-1 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                {col.badge}
              </span>
              <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#C9A45C] transition">
                {col.title}
              </h3>
              <p className="text-xs text-stone-200 font-light leading-relaxed line-clamp-3">
                {col.tagline}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#C9A45C]">
                <span>Discover Collection</span>
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
