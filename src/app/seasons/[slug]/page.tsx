import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSeasonBySlug, SEASONS } from '@/lib/campaign-engine'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return SEASONS.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const season = getSeasonBySlug(slug)
  if (!season) return { title: 'Season Not Found | Nuty Tales' }

  return {
    title: `${season.name} | Authentic Himalayan Living | Nuty Tales`,
    description: season.description,
    alternates: {
      canonical: `https://nutytales.com/seasons/${season.slug}`,
    },
    openGraph: {
      title: `${season.name} | Nuty Tales`,
      description: season.description,
      url: `https://nutytales.com/seasons/${season.slug}`,
    },
  }
}

export default async function SeasonDetailPage({ params }: Props) {
  const { slug } = await params
  const season = getSeasonBySlug(slug)
  if (!season) notFound()

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B]">
      {/* ── Hero Section ── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-widest">
              <span>🍃</span> {season.months}
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17233B] tracking-tight leading-[1.12]">
                {season.name}
              </h1>
              <p className="font-serif italic text-xl text-[#704B32]">
                Living in Harmony with Nature
              </p>
            </div>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {season.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/crafts"
                className="px-8 py-4 bg-[#17233B] hover:bg-[#176B68] text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Explore Season Crafts →
              </Link>
              <Link
                href="/shop"
                className="px-6 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
              >
                Gourmet Harvest Catalog
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <Image
                src={season.heroImage}
                alt={season.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Season Dimensions Grid ── */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Cross-Vertical Synergy
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Experiencing {season.name} Across Verticals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            {/* Crafts */}
            <div className="p-6 bg-[#FAF6EE] rounded-3xl border border-stone-200 space-y-4">
              <span className="text-2xl">🧣</span>
              <h3 className="font-serif font-bold text-xl text-[#17233B]">Crafts &amp; Apparel</h3>
              <ul className="space-y-2 text-stone-700">
                {season.craftHighlights.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#C9A45C]">✦</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <Link href="/crafts" className="inline-block pt-2 font-bold text-[#176B68] hover:underline">
                View Crafts Catalog →
              </Link>
            </div>

            {/* Culinary */}
            <div className="p-6 bg-[#FAF6EE] rounded-3xl border border-stone-200 space-y-4">
              <span className="text-2xl">🌰</span>
              <h3 className="font-serif font-bold text-xl text-[#17233B]">Harvest &amp; Nutrition</h3>
              <ul className="space-y-2 text-stone-700">
                {season.culinaryHighlights.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#C9A45C]">✦</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="inline-block pt-2 font-bold text-[#176B68] hover:underline">
                Shop Fresh Harvest →
              </Link>
            </div>

            {/* Travel & Stays */}
            <div className="p-6 bg-[#FAF6EE] rounded-3xl border border-stone-200 space-y-4">
              <span className="text-2xl">🏔️</span>
              <h3 className="font-serif font-bold text-xl text-[#17233B]">Travel &amp; Mountain Stays</h3>
              <ul className="space-y-2 text-stone-700">
                {season.travelHighlights.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#C9A45C]">✦</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <Link href="/travel" className="inline-block pt-2 font-bold text-[#176B68] hover:underline">
                Plan Seasonal Journey →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
