'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSeller } from '../SellerContext'

interface MarketplaceChannel {
  id: string
  name: string
  domain: string
  region: string
  currency: string
  commission: string
  icon: string
  description: string
  status: 'active' | 'approved' | 'apply'
  fulfillmentHub: string
}

const GLOBAL_CHANNELS: MarketplaceChannel[] = [
  {
    id: 'na',
    name: 'North America Storefront',
    domain: 'america.nutytales.com',
    region: 'United States & Canada',
    currency: 'USD / CAD',
    commission: '8.0%',
    icon: '🗽',
    description: 'High-purchasing-power audience with integrated FedEx & UPS 2-day ground and express air delivery networks.',
    status: 'active',
    fulfillmentHub: 'New Jersey & Seattle Air Hubs',
  },
  {
    id: 'eu',
    name: 'European Union & United Kingdom',
    domain: 'europe.nutytales.com',
    region: 'UK, Germany, France & EEA',
    currency: 'EUR / GBP',
    commission: '8.0%',
    icon: '🏰',
    description: 'Direct distribution with IOSS VAT compliance, CE certification moderation, and DHL Express cross-border routing.',
    status: 'active',
    fulfillmentHub: 'London Heathrow & Frankfurt CargoCity',
  },
  {
    id: 'gcc',
    name: 'Middle East & GCC Concierge',
    domain: 'middleeast.nutytales.com',
    region: 'UAE, Saudi Arabia, Qatar, Oman',
    currency: 'AED / SAR',
    commission: '7.5%',
    icon: '🕌',
    description: 'Luxury dry fruits, gourmet saffron, bespoke perfumes, and royal gifting with Aramex & DHL 48-hour delivery.',
    status: 'active',
    fulfillmentHub: 'Dubai Logistics City (DLC)',
  },
  {
    id: 'apac',
    name: 'Asia-Pacific & Central Marketplace',
    domain: 'nutytales.com',
    region: 'India, Singapore, Australia, Global',
    currency: 'INR / SGD / AUD / USD',
    commission: '7.0%',
    icon: '🌐',
    description: 'Our foundational marketplace ecosystem serving pan-India consumers, NRI diaspora, and Asia-Pacific retail customers.',
    status: 'active',
    fulfillmentHub: 'Delhi NCR, Mumbai & Singapore Changi',
  },
  {
    id: 'crafts',
    name: 'Artisan Crafts & Heritage Atelier',
    domain: 'crafts.nutytales.com',
    region: 'Global Collectors & Connoisseurs',
    currency: 'Multi-Currency',
    commission: '12.0%',
    icon: '🪡',
    description: 'Curated gallery storefront for master woodcraft, authentic GI Pashmina shawls, copperware, and museum-grade collectibles.',
    status: 'approved',
    fulfillmentHub: 'Srinagar Craft Council Depot & Global Forwarding',
  },
  {
    id: 'gifting',
    name: 'Corporate Gifting & Bespoke Hampers',
    domain: 'gifting.nutytales.com',
    region: 'Institutional & High-Net-Worth Gifting',
    currency: 'Multi-Currency',
    commission: '10.0%',
    icon: '🎁',
    description: 'B2B institutional orders, custom-branded luxury boxes, festive hampers, and executive gourmet kits.',
    status: 'approved',
    fulfillmentHub: 'Dedicated Packaging & Cold-Storage Ateliers',
  },
  {
    id: 'weddings',
    name: 'Weddings & Celebration Favours',
    domain: 'weddings.nutytales.com',
    region: 'Luxury Weddings Worldwide',
    currency: 'Multi-Currency',
    commission: '9.0%',
    icon: '💍',
    description: 'Bulk wedding favours, ceremonial packaging, royal dry fruit platters, and bespoke guest invitations.',
    status: 'apply',
    fulfillmentHub: 'Custom Event Logistics Network',
  },
  {
    id: 'stays',
    name: 'Heritage Stays & Curated Expeditions',
    domain: 'stays.nutytales.com',
    region: 'Experiential Luxury Travel',
    currency: 'Multi-Currency',
    commission: '14.0%',
    icon: '🏡',
    description: 'Bookings for boutique orchard villas, luxury houseboats, ski chalets, and guided artisanal expeditions.',
    status: 'apply',
    fulfillmentHub: 'Direct Host Reservation Engine',
  },
]

export default function MarketplaceReachPage() {
  const { seller } = useSeller()
  const [channels, setChannels] = useState<MarketplaceChannel[]>(GLOBAL_CHANNELS)
  const [applyingChannel, setApplyingChannel] = useState<string | null>(null)

  const handleApply = (channelId: string) => {
    setApplyingChannel(channelId)
    setTimeout(() => {
      setChannels((prev) =>
        prev.map((c) => (c.id === channelId ? { ...c, status: 'approved' } : c))
      )
      setApplyingChannel(null)
    }, 1200)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">
            Multi-Storefront Ecosystem
          </span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-0.5">
            Global Marketplace Reach & Channels
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Distribute your catalog across specialized regional and vertical domains using a single seller account and shared inventory.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-full border border-emerald-200">
            Unified Merchant Identity Active
          </span>
        </div>
      </div>

      {/* Ecosystem Architecture Graphic Banner */}
      <div className="bg-[#163326] text-white p-7 rounded-3xl border border-[#24523F] shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A869]">
            Architectural Principle
          </span>
          <h3 className="text-xl font-serif font-bold">One Account · Universal Global Distribution</h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Nuty Tales Seller Central acts as the universal command layer. When you publish a listing or adjust inventory here, approved products synchronize automatically to relevant geographic and category storefronts, respecting local taxes, currencies, and customs compliance rules.
          </p>
        </div>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-300 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    {channel.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{channel.name}</h4>
                    <span className="text-[11px] font-mono text-stone-500">{channel.domain}</span>
                  </div>
                </div>

                <div>
                  {channel.status === 'active' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Live Channel
                    </span>
                  )}
                  {channel.status === 'approved' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      Approved
                    </span>
                  )}
                  {channel.status === 'apply' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600">
                      Application Open
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-stone-600 mt-3 leading-relaxed">{channel.description}</p>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-500">
                <span>Coverage Region:</span>
                <span className="font-medium text-stone-800">{channel.region}</span>
              </div>
              <div className="flex items-center justify-between text-stone-500">
                <span>Transaction Currencies:</span>
                <span className="font-medium text-stone-800">{channel.currency}</span>
              </div>
              <div className="flex items-center justify-between text-stone-500">
                <span>Fulfillment Hub:</span>
                <span className="font-medium text-stone-800">{channel.fulfillmentHub}</span>
              </div>
              <div className="flex items-center justify-between text-stone-500">
                <span>Commission Rate:</span>
                <span className="font-bold text-[#163326] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/40">
                  {channel.commission}
                </span>
              </div>

              <div className="pt-2">
                {channel.status === 'active' || channel.status === 'approved' ? (
                  <div className="w-full py-2 bg-stone-50 rounded-xl text-center text-xs font-semibold text-stone-600 border border-stone-200">
                    ✓ Products Automatically Syndicated
                  </div>
                ) : (
                  <button
                    onClick={() => handleApply(channel.id)}
                    disabled={applyingChannel === channel.id}
                    className="w-full py-2 bg-[#163326] hover:bg-[#11291E] text-white rounded-xl text-xs font-semibold shadow-xs transition"
                  >
                    {applyingChannel === channel.id ? 'Submitting Application...' : 'Apply for Channel Access →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
