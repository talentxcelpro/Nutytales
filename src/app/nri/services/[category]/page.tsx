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
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link href="/" className="hover:text-[#191919] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/services" className="hover:text-[#191919] transition-colors">Services</Link>
        <span>/</span>
        <span className="text-[#8C6D2D] font-semibold">{cat.title}</span>
      </nav>

      {/* Hero */}
      <div className="bg-white rounded-3xl border border-[#EAE6DF] p-8 sm:p-12 space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-4">
          <span className="text-4xl p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#EAE6DF]">
            {cat.icon}
          </span>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C6D2D]/10 text-[#8C6D2D] border border-[#8C6D2D]/20 uppercase tracking-wider">
              {cat.heroBadge}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#191919] tracking-tight mt-1">
              {cat.title}
            </h1>
          </div>
        </div>

        <p className="text-base text-stone-600 font-light leading-relaxed max-w-3xl">
          {cat.description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            href="/#request-engine"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            ⚡ Request Execution in India →
          </Link>
          <span className="text-xs text-stone-500">
            Operational Hubs: <strong className="text-stone-800 font-semibold">{cat.popularCities.join(', ')}</strong>
          </span>
        </div>
      </div>

      {/* Inclusions & Inspection Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-[#EAE6DF] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <h3 className="font-serif text-xl font-bold text-[#191919]">
            What Is Included in Every Engagement
          </h3>
          <ul className="space-y-2.5 text-xs text-stone-600">
            {cat.inclusions.map((inc: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">{inc}</span>
              </li>
            ))}
          </ul>
        </div>

        {cat.inspectionChecklist ? (
          <div className="bg-white p-8 rounded-3xl border border-[#EAE6DF] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h3 className="font-serif text-xl font-bold text-[#191919]">
              Standard Physical Inspection Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-600">
              {cat.inspectionChecklist.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-[#8C6D2D] font-bold mt-0.5">📋</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-[#EAE6DF] space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <h3 className="font-serif text-xl font-bold text-[#191919]">
              Verification & Safeguards
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Every provider deployed under this category is identity-verified with background checks or Bar Council / ICAI professional credentials. Milestone escrow safeguards your payments until verifiable proof of completion is uploaded and inspected.
            </p>
          </div>
        )}
      </div>

      {/* Sample Services & Rates */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#191919]">
          Standard Engagement Tiers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cat.sampleServices.map((svc: any) => (
            <div
              key={svc.id}
              className="bg-white p-6 rounded-2xl border border-[#EAE6DF] space-y-3 flex flex-col justify-between text-xs shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all"
            >
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF9F6] text-stone-600 border border-[#EAE6DF]">
                  {svc.pricingType}
                </span>
                <h4 className="font-bold text-[#191919] text-sm mt-2">{svc.name}</h4>
                <span className="font-serif text-lg font-bold text-[#8C6D2D] block mt-1">
                  {svc.estimatedRange}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Turnaround: {svc.turnaround}
                </span>
              </div>

              <div className="pt-3 border-t border-[#EAE6DF] text-[11px] text-stone-600">
                <strong className="text-stone-800 block">Deliverable:</strong>
                <p>{svc.deliverable}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regulatory Disclaimer */}
      {cat.regulatoryDisclaimer && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <strong className="block font-bold">⚠️ Compliance & Regulatory Notice:</strong>
          <p className="text-stone-700 leading-relaxed font-light">{cat.regulatoryDisclaimer}</p>
        </div>
      )}

      {/* FAQs */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#191919]">
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {cat.faqs.map((faq: any, i: number) => (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-[#EAE6DF] space-y-2 text-xs shadow-sm"
            >
              <h4 className="font-bold text-[#191919] text-sm">{faq.q}</h4>
              <p className="text-stone-600 font-light leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
