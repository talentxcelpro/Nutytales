import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getOccasionBySlug, OCCASIONS } from '@/lib/campaign-engine'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return OCCASIONS.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const occasion = getOccasionBySlug(slug)
  if (!occasion) return { title: 'Occasion Not Found | Nuty Tales' }

  return {
    title: `${occasion.name} Hampers & Gifts | Nuty Tales Gifting`,
    description: occasion.description,
    alternates: {
      canonical: `https://nutytales.com/occasions/${occasion.slug}`,
    },
    openGraph: {
      title: `${occasion.name} | Nuty Tales Gifting`,
      description: occasion.description,
      url: `https://nutytales.com/occasions/${occasion.slug}`,
    },
  }
}

export default async function OccasionDetailPage({ params }: Props) {
  const { slug } = await params
  const occasion = getOccasionBySlug(slug)
  if (!occasion) notFound()

  const whatsappPhone = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B]">
      {/* ── Hero Section ── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-widest">
              <span>🎯</span> {occasion.type.toUpperCase()} CURATION
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17233B] tracking-tight leading-[1.12]">
                {occasion.name}
              </h1>
              <p className="font-serif italic text-xl text-[#704B32]">
                Thoughtful, High-Impact Impressions
              </p>
            </div>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {occasion.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Ideal Use Cases
              </span>
              <div className="flex flex-wrap gap-2">
                {occasion.idealFor.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/gifting/recipients"
                className="px-8 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Launch Multi-Recipient Desk →
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nuty Tales! I need assistance with our upcoming ${occasion.name} gifting order.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
              >
                💬 Corporate Concierge
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <Image
                src={occasion.heroImage}
                alt={occasion.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Suggested Hampers ── */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Bespoke Catalog
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Recommended Hampers for {occasion.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasion.suggestedHampers.map((hamper, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#FAF6EE] rounded-3xl border border-stone-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-2xl">🎁</span>
                  <h3 className="font-serif font-bold text-xl text-[#17233B]">{hamper}</h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Custom laser branding, choice of foil cards, fresh batch NABL quality certificate, and direct doorstep tracking.
                  </p>
                </div>
                <Link
                  href="/gifting"
                  className="w-full py-3 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-colors"
                >
                  Configure This Hamper →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
