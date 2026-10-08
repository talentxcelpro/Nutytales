import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getLifeEventBySlug, LIFE_EVENTS } from '@/lib/campaign-engine'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return LIFE_EVENTS.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = getLifeEventBySlug(slug)
  if (!event) return { title: 'Life Event Not Found | Nuty Tales' }

  return {
    title: `${event.name} | End-to-End Concierge Orchestration | Nuty Tales`,
    description: event.description,
    alternates: {
      canonical: `https://nutytales.com/life-events/${event.slug}`,
    },
    openGraph: {
      title: `${event.name} | Nuty Tales`,
      description: event.description,
      url: `https://nutytales.com/life-events/${event.slug}`,
    },
  }
}

export default async function LifeEventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = getLifeEventBySlug(slug)
  if (!event) notFound()

  const whatsappPhone = (WHATSAPP_NUMBERS.WEDDINGS || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B]">
      {/* ── Hero Section ── */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B] text-[#C9A45C] text-xs font-bold uppercase tracking-widest">
              <span>👑</span> LIFE EVENT ORCHESTRATION
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#17233B] tracking-tight leading-[1.12]">
                {event.name}
              </h1>
              <p className="font-serif italic text-xl text-[#704B32]">
                Curated across the Nuty Tales Global Ecosystem
              </p>
            </div>

            <p className="text-stone-600 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {event.description}
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Ceremony &amp; Event Milestones
              </span>
              <div className="flex flex-wrap gap-2">
                {event.milestones.map((m, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/weddings"
                className="px-8 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-extrabold rounded-2xl text-xs uppercase tracking-wider shadow-lg transition-all"
              >
                Open Planning Concierge →
              </Link>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nuty Tales! We are planning a milestone ${event.name} and would like to speak with the master concierge desk.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all"
              >
                💬 Dedicated Concierge
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <Image
                src={event.heroImage}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
