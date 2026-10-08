import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { LIFE_EVENTS } from '@/lib/campaign-engine'

export const metadata: Metadata = {
  title: 'Life Events, Weddings & Milestone Retreats | Nuty Tales',
  description:
    'Celebrate life’s grandest milestones: Royal Kashmir Destination Weddings, Executive Retreats, and Jubilees. Fully orchestrated luxury across our 6 marketplaces.',
  alternates: {
    canonical: 'https://nutytales.com/life-events',
  },
}

export default function LifeEventsIndexPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#17233B] py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C9A45C]">
          Unforgettable Milestones
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight">
          Life Events &amp; Grand Celebrations
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          From once-in-a-lifetime destination nuptials in Srinagar’s royal lakeside palaces to executive mountain retreats. We connect venue buyouts, travel convoys, bespoke favors, and curated gastronomy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {LIFE_EVENTS.map((event) => (
          <Link
            key={event.slug}
            href={`/life-events/${event.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
              <Image
                src={event.heroImage}
                alt={event.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl font-bold group-hover:text-[#176B68] transition-colors">
                  {event.name}
                </h2>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#176B68]">
                <span>Explore Full Execution</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
