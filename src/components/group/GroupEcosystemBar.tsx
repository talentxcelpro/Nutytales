'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const GROUP_COMPANIES = [
  {
    id: 'gateway',
    name: 'Group Gateway',
    subdomain: 'nutytales.com',
    href: '/',
    tag: 'Flagship & Harvest',
    icon: '✦',
  },
  {
    id: 'business',
    name: 'Business',
    subdomain: 'business.nutytales.com',
    href: '/b2b',
    tag: 'B2B Sourcing & RFQ',
    icon: '🏢',
  },
  {
    id: 'gifting',
    name: 'Gifting',
    subdomain: 'gifting.nutytales.com',
    href: '/gifting',
    tag: 'Corporate & Personal',
    icon: '🎁',
  },
  {
    id: 'weddings',
    name: 'Weddings',
    subdomain: 'weddings.nutytales.com',
    href: '/weddings',
    tag: 'Wedding OS & Favors',
    icon: '💍',
  },
  {
    id: 'crafts',
    name: 'Crafts',
    subdomain: 'crafts.nutytales.com',
    href: '/crafts',
    tag: 'Fashion & Handlooms',
    icon: '🧣',
  },
  {
    id: 'stays',
    name: 'Stays',
    subdomain: 'stays.nutytales.com',
    href: '/stays',
    tag: 'Hospitality & Retreats',
    icon: '🏔️',
  },
  {
    id: 'travel',
    name: 'Travel',
    subdomain: 'travel.nutytales.com',
    href: '/travel',
    tag: 'Trips & Experiences',
    icon: '✈️',
  },
]

interface GroupEcosystemBarProps {
  currentCompanyId: 'gateway' | 'business' | 'gifting' | 'weddings' | 'crafts' | 'stays' | 'travel'
  darkTheme?: boolean
}

export default function GroupEcosystemBar({
  currentCompanyId,
  darkTheme = true,
}: GroupEcosystemBarProps) {
  const pathname = usePathname()

  return (
    <div
      className={`w-full border-b text-[11px] font-sans transition-colors ${
        darkTheme
          ? 'bg-[#0B111E] text-stone-300 border-white/10'
          : 'bg-[#F4EFE6] text-stone-700 border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-4">
        {/* Left: Group Label */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-extrabold uppercase tracking-widest text-[#C9A45C] text-[10px] flex items-center gap-1">
            <span>✦</span> NUTTY TALES GROUP
          </span>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="hidden md:inline text-stone-400 text-[10px]">
            Independent Global Operating Companies
          </span>
        </div>

        {/* Right: Company Navigation Pills */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
          {GROUP_COMPANIES.map((company) => {
            const isActive = company.id === currentCompanyId
            return (
              <Link
                key={company.id}
                href={company.href}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#C9A45C] text-[#17233B] font-bold shadow-sm'
                    : darkTheme
                    ? 'hover:bg-white/10 text-stone-300 hover:text-white'
                    : 'hover:bg-stone-200 text-stone-600 hover:text-stone-900'
                }`}
                title={`${company.name} — ${company.tag}`}
              >
                <span>{company.icon}</span>
                <span>{company.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17233B] inline-block animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
