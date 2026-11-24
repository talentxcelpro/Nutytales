import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { DAILY_INTAKE_DATA } from '@/lib/daily-intake-data'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Daily Dry Fruit Intake Guide: Dosages, Soaking Protocols & Timing | Nuty Tales',
  description:
    'Complete scientific and Ayurvedic daily intake guide for dry fruits and nuts. How many almonds, walnuts, makhana, figs, and saffron strands to eat per day for maximum health.',
  alternates: {
    canonical: 'https://nutytales.com/daily-intake',
  },
  openGraph: {
    title: 'Daily Dry Fruit Intake Guide: Dosages, Soaking Protocols & Timing | Nuty Tales',
    description:
      'Scientific daily portion sizes, soaking durations, and Ayurvedic timing for almonds, walnuts, makhana, figs, and saffron.',
    url: 'https://nutytales.com/daily-intake',
    siteName: 'Nuty Tales',
    images: [{ url: 'https://nutytales.com/images/hero-lifestyle-bowl.png', width: 1200, height: 630 }],
  },
}

export default function DailyIntakeDirectoryPage() {
  const commodities = Object.values(DAILY_INTAKE_DATA)

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C241D]">
      {/* Top Breadcrumb */}
      <div className="border-b border-[#E8DEC8] bg-[#F7F2E7]/70 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 text-xs text-[#7A6B5D]">
          <Link href="/" className="hover:text-[#5B2E1E]">Home</Link>
          <span>/</span>
          <span className="font-semibold text-[#5B2E1E]">Daily Intake & Nutrition Guide</span>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F7F2E7] to-[#FDFBF7] py-14 md:py-20 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <span className="inline-block rounded-full border border-[#D4C3A3] bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#7A4B2A]">
            Scientific Nutrition & Ayurvedic Dinacharya
          </span>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#3B1E13] md:text-5xl">
            How Many Dry Fruits Should You Eat Per Day?
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#5C4F43] md:text-lg">
            Stop guessing your daily portions. Discover exact scientific counts, overnight soaking clocks to deactivate phytic acid, and optimal meal timings for 100% bio-available nutrition.
          </p>
        </div>
      </section>

      {/* Commodities Grid */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {commodities.map((item) => (
            <article
              key={item.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8DEC8] bg-white shadow-sm transition-all hover:border-[#5B2E1E] hover:shadow-xl"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-[#F7F2E7]">
                  <Image
                    src={item.productImage}
                    alt={item.commodityName}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 rounded-full bg-[#5B2E1E] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                    {item.hindiName}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#A05A2C]">
                    {item.heroBadge}
                  </span>
                  <h2 className="mt-1 font-serif text-xl font-bold text-[#3B1E13] group-hover:text-[#5B2E1E]">
                    {item.commodityName}
                  </h2>
                  <p className="mt-2 text-xs line-clamp-2 text-[#5C4F43]">
                    {item.subheadline}
                  </p>

                  <div className="mt-5 space-y-2 rounded-xl bg-[#FBF9F4] p-3 text-xs border border-[#EFE7D8]">
                    <div className="flex justify-between">
                      <span className="text-[#7A6B5D]">Adult Daily Dose:</span>
                      <strong className="text-[#5B2E1E]">{item.ageGuidelines[2]?.recommendedCount || '8–10 Kernels'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7A6B5D]">Overnight Soaking:</span>
                      <span className="font-semibold text-[#16A34A]">
                        {item.soakingProtocol.recommended ? `Yes (${item.soakingProtocol.soakingDurationHours}h)` : 'No Soaking Needed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EFE7D8] p-6 pt-0">
                <Link
                  href={`/daily-intake/${item.slug}`}
                  className="mt-4 block w-full rounded-xl bg-[#5B2E1E] py-3 text-center text-xs font-bold text-white transition-all hover:bg-[#431F14] shadow-sm"
                >
                  View Full Daily Protocol & Dose →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Clinical Disclaimer */}
        <div className="mt-16 rounded-2xl border border-[#D9CDB8] bg-[#F7F2E7] p-8 text-center text-xs text-[#5C4F43]">
          <p className="font-bold text-[#3B1E13]">FSSAI Central Compliance & Medical Disclaimer</p>
          <p className="mt-2 max-w-3xl mx-auto leading-relaxed">
            Nutritional intake guidance provided by Nuty Tales is compiled from clinical reference data published by the Indian Council of Medical Research (ICMR-NIN) and classical Ayurvedic pharmacopeia. It is for educational purposes and should not replace customized medical advice from your personal physician or registered clinical dietician. Central FSSAI Lic. #22724441000048.
          </p>
        </div>
      </main>
    </div>
  )
}
