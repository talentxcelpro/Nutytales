import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getFestivalBySlug, FESTIVALS, getDynamicActiveCampaigns } from '@/lib/campaign-engine'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return FESTIVALS.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const festival = getFestivalBySlug(slug)
  if (!festival) return { title: 'Festival Not Found | Nuty Tales' }

  const year = new Date().getFullYear()

  return {
    title: `${festival.name} Gifts & Hampers ${year} | Nuty Tales Gifting`,
    description: `Order luxury ${festival.name} gift hampers, dry fruit boxes, pure Kashmiri Mongra saffron, and bespoke corporate gifts. Pan-India and global doorstep delivery.`,
    alternates: {
      canonical: `https://nutytales.com/festivals/${festival.slug}`,
    },
    openGraph: {
      title: `${festival.name} Celebrations & Gifts | Nuty Tales`,
      description: festival.description,
      url: `https://nutytales.com/festivals/${festival.slug}`,
    },
  }
}

export default async function FestivalDetailPage({ params }: Props) {
  const { slug } = await params
  const festival = getFestivalBySlug(slug)
  if (!festival) notFound()

  const currentYear = new Date().getFullYear()
  const activeCampaigns = getDynamicActiveCampaigns()
  const matchingCampaign = activeCampaigns.find((c) => c.landingRoute.includes(festival.slug))
  const whatsappPhone = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B]">
      {/* ── Active Campaign Notice ── */}
      {matchingCampaign && (
        <div className="bg-[#17233B] text-white py-3 px-4 border-b border-[#C9A45C]/30 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] font-extrabold uppercase text-[10px]">
                {matchingCampaign.badge}
              </span>
              <span className="text-stone-200">
                {matchingCampaign.bannerSubtitle}
              </span>
            </div>
            <Link
              href="/gifting/recipients"
              className="text-[#C9A45C] font-bold hover:underline flex items-center gap-1"
            >
              <span>Multi-Recipient Gifting Desk</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-widest">
              <span>🌟</span> {festival.season} FESTIVAL CELEBRATION
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17233B] tracking-tight leading-[1.12]">
                {festival.name} Gifting &amp; Festivities
              </h1>
              <p className="font-serif italic text-xl text-[#704B32]">
                Curated Luxury for {festival.name} {currentYear} &amp; Beyond
              </p>
            </div>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {festival.description}
            </p>

            <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Traditions &amp; Gifting Customs
              </span>
              <div className="flex flex-wrap gap-2">
                {festival.traditions.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-[#FAF6EE] text-[#17233B] rounded-lg text-xs font-medium border border-stone-200"
                  >
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/gifting"
                className="px-8 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Design a {festival.name} Gift →
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nuty Tales! I would like to inquire about ${festival.name} gift hampers for corporate/personal delivery.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
              >
                💬 Concierge Chat
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <Image
                src={festival.heroImage}
                alt={festival.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Suggested Gifts Section ── */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
              Signature Hampers
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Recommended for {festival.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {festival.suggestedGifts.map((gift, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#FAF6EE] rounded-2xl border border-stone-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-2xl">🎁</span>
                  <h3 className="font-serif font-bold text-lg text-[#17233B]">{gift}</h3>
                  <p className="text-xs text-stone-600 font-light">
                    Hand-graded fresh dry fruits, certified saffron, and vacuum packaging with custom branding.
                  </p>
                </div>
                <Link
                  href="/gifting"
                  className="w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold text-center block transition-colors uppercase tracking-wider"
                >
                  Configure
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Connected Nuty Tales Ecosystem ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl font-bold text-[#17233B]">
            Connected Across Nuty Tales
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Discover how {festival.name} connects across our six global marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs font-bold text-center">
          <Link href="/gifting" className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#176B68] shadow-sm">
            🎁 Nuty Tales Gifting
          </Link>
          <Link href="/crafts" className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#176B68] shadow-sm">
            🧣 Nuty Tales Crafts
          </Link>
          <Link href="/b2b" className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#176B68] shadow-sm">
            🏭 Nuty Tales Business
          </Link>
          <Link href="/stays" className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#176B68] shadow-sm">
            🏡 Nuty Tales Stays
          </Link>
          <Link href="/travel" className="p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#176B68] shadow-sm">
            ✈️ Nuty Tales Travel
          </Link>
        </div>
      </section>
    </div>
  )
}
