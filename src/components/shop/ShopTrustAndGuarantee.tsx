'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FSSAI_NUMBER, WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export default function ShopTrustAndGuarantee() {
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#17233B] text-white rounded-3xl p-8 sm:p-14 space-y-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C9A45C]">
              The Nuty Tales Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Uncompromising Standards From Tree to Table
            </h2>
            <p className="text-sm text-stone-300 font-light leading-relaxed">
              We operate our own nitrogen packaging facility in Noida HQ with direct sourcing collection hubs across Srinagar and Patna.
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap shadow-md inline-flex items-center gap-2 self-start md:self-auto"
          >
            <span>💬</span>
            <span>WhatsApp Order Support</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[#C9A45C] font-serif text-2xl font-bold block">100%</span>
            <p className="font-bold text-white">Origin Verification</p>
            <p className="text-[11px] text-stone-400 font-light">Every SKU tested for botanical purity and GI tagging.</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-white px-2 py-0.5 rounded-md inline-flex items-center">
                <Image
                  src="/images/fssai-logo.png"
                  alt="FSSAI"
                  width={52}
                  height={24}
                  className="h-5 w-auto object-contain"
                />
              </div>
            </div>
            <p className="font-bold text-white">Central Lic. {FSSAI_NUMBER}</p>
            <p className="text-[11px] text-stone-400 font-light">Audited facility for hygiene, packaging &amp; storage.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#C9A45C] font-serif text-2xl font-bold block">N2 Seal</span>
            <p className="font-bold text-white">Nitrogen Flushed</p>
            <p className="text-[11px] text-stone-400 font-light">Multi-layer food-grade pouches lock in raw crunch.</p>
          </div>
          <div className="space-y-1">
            <span className="text-[#C9A45C] font-serif text-2xl font-bold block">Global</span>
            <p className="font-bold text-white">Insured Dispatch</p>
            <p className="text-[11px] text-stone-400 font-light">Fast air couriers to India, UAE, UK, US &amp; Singapore.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
