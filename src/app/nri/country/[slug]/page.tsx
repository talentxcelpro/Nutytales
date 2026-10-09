import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import GetSomethingDoneEngine from '@/components/nri/GetSomethingDoneEngine'

interface CountryConfig {
  slug: string
  name: string
  flag: string
  currency: string
  currencySymbol: string
  headline: string
  tagline: string
  keyTopics: { title: string; desc: string }[]
}

const COUNTRIES: Record<string, CountryConfig> = {
  usa: {
    slug: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    headline: 'USA to India Management Platform',
    tagline: 'Handling family, ancestral properties in Kashmir & Punjab, and cross-border tax compliance for Indian Americans.',
    keyTopics: [
      {
        title: 'US-India Tax & FBAR / FATCA Compliance',
        desc: 'Coordinate with ICAI Chartered Accountants familiar with IRS foreign asset reporting (Form 8938) and Form 15CA/15CB repatriation.',
      },
      {
        title: 'Power of Attorney Apostille & Consulate Liaison',
        desc: 'Draft POAs compliant with Indian High Commission / Consulates in New York, San Francisco, Chicago, Houston, and Atlanta.',
      },
      {
        title: 'Pacific & Eastern Timezone Coordination',
        desc: 'Our coordinators schedule video walkthroughs and parent companion visits at hours convenient for your North American timezone.',
      },
    ],
  },
  uk: {
    slug: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencySymbol: '£',
    headline: 'UK to India Management Platform',
    tagline: 'Trusted ground execution for British Indians and Kashmiri diaspora residing across London, Birmingham, and Manchester.',
    keyTopics: [
      {
        title: 'HMRC & Indian Capital Gains Liaison',
        desc: 'Guidance on UK remittance basis vs Indian TDS deductions on property sales in Srinagar, Delhi, and Punjab.',
      },
      {
        title: 'Ancestral Property & Orchard Oversight',
        desc: 'Regular physical walkthroughs of Kashmir estates and ancestral homes with GPS timestamped photographic dossiers.',
      },
      {
        title: 'Elder Parent Companionship & Escorts',
        desc: 'Weekly home companion visits, medicine replenishment, and specialist OPD escorts across Indian metros.',
      },
    ],
  },
  canada: {
    slug: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencySymbol: 'C$',
    headline: 'Canada to India Management Platform',
    tagline: 'Reliable on-ground liaison for Indo-Canadians in Toronto, Vancouver, Calgary, and Montreal.',
    keyTopics: [
      {
        title: 'CRA & NRI Property Tax Coordination',
        desc: 'Coordinate Section 197 lower withholding certificates before remitting funds from India to Canada.',
      },
      {
        title: 'Punjab & Kashmir Revenue Records (Jamabandi)',
        desc: 'Advocate assistance in retrieving official land revenue extracts, partition records, and title certificates.',
      },
      {
        title: 'Winterization & Snow Audits in Kashmir',
        desc: 'Specialized thermal wrapping of plumbing lines and roof snow inspections before the harsh valley winter.',
      },
    ],
  },
  uae: {
    slug: 'uae',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencySymbol: 'AED',
    headline: 'UAE & Gulf to India Management Platform',
    tagline: 'Fast-track India execution for NRIs in Dubai, Abu Dhabi, Sharjah, and across the GCC.',
    keyTopics: [
      {
        title: 'Same-Timezone Ground Execution',
        desc: 'With only a 1.5 hour time difference, manage daily repair progress, site visits, and family errands in real-time.',
      },
      {
        title: 'NRE / NRO Bank Accounts & Property Investments',
        desc: 'FEMA-compliant property document coordination, tenant rental collection ledgers, and turnkey maintenance.',
      },
      {
        title: 'Destination Kashmir Weddings & Event Logistics',
        desc: 'Orchestrating traditional Wazwan banquets, bridal trousseau, and luxury villa buyouts for Gulf diaspora families.',
      },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(COUNTRIES).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const country = COUNTRIES[slug]
  if (!country) return { title: 'NRI Country Services | Nuty Tales NRI' }
  return {
    title: `${country.name} to India Management Platform | Nuty Tales NRI`,
    description: country.tagline,
    alternates: {
      canonical: `https://nri.nutytales.com/country/${slug}`,
    },
    openGraph: {
      title: `${country.name} to India Management Platform | Nuty Tales NRI`,
      description: country.tagline,
      url: `https://nri.nutytales.com/country/${slug}`,
    },
  }
}

export default async function CountryGatewayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const country = COUNTRIES[slug]

  if (!country) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="bg-[#0E1524] rounded-3xl p-8 sm:p-12 border border-white/10 space-y-4 text-center max-w-4xl mx-auto">
        <span className="text-4xl block">{country.flag}</span>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-xs text-[#C9A45C] font-semibold">
          <span>{country.currency} SETTLEMENT & TIMEZONE CONCIERGE</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          {country.headline}
        </h1>
        <p className="text-sm text-stone-300 font-light max-w-2xl mx-auto leading-relaxed">
          {country.tagline}
        </p>
      </div>

      {/* Key Topics for this Diaspora */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        {country.keyTopics.map((top, idx) => (
          <div
            key={idx}
            className="bg-[#0E1524] p-6 rounded-3xl border border-white/10 space-y-2"
          >
            <strong className="font-serif text-base font-bold text-white block">
              {top.title}
            </strong>
            <p className="text-stone-300 font-light leading-relaxed">{top.desc}</p>
          </div>
        ))}
      </div>

      {/* Signature Request Engine pre-tuned for this country */}
      <div className="pt-4 space-y-4">
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-[#C9A45C] font-bold">
            Start Your Request from {country.name}
          </span>
        </div>
        <GetSomethingDoneEngine />
      </div>
    </div>
  )
}
