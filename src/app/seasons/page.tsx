import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SEASONS } from '@/lib/campaign-engine'

export const metadata: Metadata = {
  title: 'Seasonal Collections & Himalayan Harvests | Nuty Tales',
  description:
    'Explore Himalayan seasons with Nuty Tales: Autumn & Winter, Spring Blossom, Summer Escape, and Monsoon. Fresh walnut harvests, Changthangi Pashmina, and alpine retreats.',
  alternates: {
    canonical: 'https://nutytales.com/seasons',
  },
}

export default function SeasonsIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
          The Rhythm of Nature
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight">
          Himalayan Seasons &amp; Global Living
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          From ancient walnut orchard harvests to winter fireside shawls and summer high-altitude treks. Explore each season curated across our connected marketplaces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SEASONS.map((season) => (
          <Link
            key={season.slug}
            href={`/seasons/${season.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
              <Image
                src={season.heroImage}
                alt={season.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-[#17233B]/90 backdrop-blur-sm text-[#C9A45C] px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                {season.months}
              </div>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-500 font-mono block">
                  Season: {season.seasonType.toUpperCase()}
                </span>
                <h2 className="font-serif text-2xl font-bold group-hover:text-[#176B68] transition-colors">
                  {season.name}
                </h2>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {season.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#176B68]">
                <span>Discover Season</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
