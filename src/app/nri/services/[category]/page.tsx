import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NRI_CATEGORIES } from '@/lib/nri/nri-data'
import { ServiceCategoryKey } from '@/lib/nri/types'

const SLUG_MAP: Record<string, ServiceCategoryKey> = {
  'property-management': 'property_management',
  'parent-care': 'parent_care',
  'healthcare': 'healthcare',
  'legal-services': 'legal_documents',
  'tax-services': 'tax_finance',
  'home-services': 'home_services',
  'travel': 'travel_stays',
  'weddings': 'weddings_events',
  'gifting': 'gifting_deliveries',
  'crafts': 'crafts_heritage',
  'business': 'business_procurement',
}

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((category) => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const catKey: ServiceCategoryKey | undefined = SLUG_MAP[category]
  if (!catKey || !NRI_CATEGORIES[catKey]) {
    return { title: 'NRI Services | Nuty Tales NRI' }
  }
  const cat = NRI_CATEGORIES[catKey]
  return {
    title: `${cat.title} in India for NRIs | Nuty Tales NRI`,
    description: `${cat.description} Verified on-ground coordinators across ${cat.popularCities.join(', ')}.`,
    alternates: {
      canonical: `https://nri.nutytales.com/services/${category}`,
    },
    openGraph: {
      title: `${cat.title} in India for NRIs | Nuty Tales NRI`,
      description: cat.description,
      url: `https://nri.nutytales.com/services/${category}`,
    },
  }
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params
  const catKey: ServiceCategoryKey | undefined = SLUG_MAP[category]

  if (!catKey || !NRI_CATEGORIES[catKey]) {
    notFound()
  }

  const cat = NRI_CATEGORIES[catKey]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-white">Services</Link>
        <span>/</span>
        <span className="text-[#C9A45C] font-semibold">{cat.title}</span>
      </nav>

      {/* Hero */}
      <div className="bg-[#0E1524] rounded-3xl border border-white/10 p-8 sm:p-12 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10">
            {cat.icon}
          </span>
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/30 uppercase tracking-wider">
              {cat.heroBadge}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mt-1">
              {cat.title}
            </h1>
          </div>
        </div>

        <p className="text-base text-stone-300 font-light leading-relaxed max-w-3xl">
          {cat.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            href="/#request-engine"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold shadow-lg hover:shadow-[#C9A45C]/25 transition-all"
          >
            ⚡ Request Execution in India →
          </Link>
          <span className="text-xs text-stone-400">
            Operational Hubs: <strong className="text-white">{cat.popularCities.join(', ')}</strong>
          </span>
        </div>
      </div>

      {/* Inclusions & Inspection Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0E1524] p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="font-serif text-xl font-bold text-white">
            What Is Included in Every Engagement
          </h3>
          <ul className="space-y-2.5 text-xs text-stone-300">
            {cat.inclusions.map((inc: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">{inc}</span>
              </li>
            ))}
          </ul>
        </div>

        {cat.inspectionChecklist ? (
          <div className="bg-[#0E1524] p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              Standard Physical Inspection Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {cat.inspectionChecklist.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#C9A45C] font-bold mt-0.5">📋</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-[#0E1524] p-8 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-serif text-xl font-bold text-white">
              Verification & Safeguards
            </h3>
            <p className="text-xs text-stone-300 font-light leading-relaxed">
              Every provider deployed under this category is identity-verified with background checks or Bar Council / ICAI professional credentials. Milestone escrow safeguards your payments until verifiable proof of completion is uploaded and inspected.
            </p>
          </div>
        )}
      </div>

      {/* Sample Services & Rates */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-white">
          Standard Engagement Tiers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cat.sampleServices.map((svc: any) => (
            <div
              key={svc.id}
              className="bg-[#0E1524] p-6 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between text-xs"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-stone-400">
                  {svc.pricingType}
                </span>
                <h4 className="font-bold text-white text-sm mt-2">{svc.name}</h4>
                <span className="font-serif text-lg font-bold text-[#C9A45C] block mt-1">
                  {svc.estimatedRange}
                </span>
                <span className="text-[11px] text-stone-400 block">
                  Turnaround: {svc.turnaround}
                </span>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-stone-300">
                <strong className="text-stone-400 block">Deliverable:</strong>
                <p>{svc.deliverable}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Disclaimer */}
      {cat.regulatoryDisclaimer && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
          <strong className="block font-bold">⚠️ Compliance & Regulatory Notice:</strong>
          <p className="text-stone-300 leading-relaxed font-light">{cat.regulatoryDisclaimer}</p>
        </div>
      )}

      {/* FAQs */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-white">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {cat.faqs.map((faq: any, i: number) => (
            <div
              key={i}
              className="bg-[#0E1524] p-5 rounded-2xl border border-white/10 space-y-2 text-xs"
            >
              <h4 className="font-bold text-white text-sm">{faq.q}</h4>
              <p className="text-stone-300 font-light leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
