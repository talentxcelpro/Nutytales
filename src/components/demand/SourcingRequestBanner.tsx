'use client'

import React, { useState } from 'react'
import { PlatformVertical } from '@/lib/platform-core'
import DemandCaptureModal from './DemandCaptureModal'

interface SourcingRequestBannerProps {
  vertical?: PlatformVertical
  contextText?: string
}

export default function SourcingRequestBanner({
  vertical = 'discovery',
  contextText = "Looking for a custom cut, specific Kashmiri craft, destination package, or volume hamper not listed here?",
}: SourcingRequestBannerProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="bg-[#10192A] text-white rounded-3xl p-6 sm:p-8 border border-[#C9A45C]/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
            <span>✨</span> CAN&apos;T FIND YOUR EXACT SPECIFICATION?
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Nuty Tales Custom Sourcing Engine
          </h3>
          <p className="text-xs text-stone-300 font-light max-w-xl">
            {contextText} Our senior procurement network sources directly from vetted artisan cooperatives, orchard growers, and luxury hospitality partners globally.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md whitespace-nowrap flex-shrink-0"
        >
          ⚡ Create Sourcing Request →
        </button>
      </div>

      <DemandCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultVertical={vertical}
        title="Nuty Tales Custom Sourcing Engine"
        subtitle="Specify what you need. Our ground sourcing teams in Kashmir, Noida, and partner networks will locate verified supply and return a formal quote."
      />
    </>
  )
}
