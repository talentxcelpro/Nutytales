'use client'

import React from 'react'
import Link from 'next/link'

export default function NriHowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Submit in Plain Words',
      headline: 'Natural Language Request Engine',
      description:
        'Tell us what your family or property needs in India. You don’t need to browse through confusing service hierarchies. Our engine parses the city, urgency, frequency, and produces an itemized draft plan.',
      badge: 'Zero Friction',
      icon: '✍️',
    },
    {
      num: '02',
      title: 'Transparent Matching & Quotes',
      headline: 'Verified Specialist Quotations',
      description:
        'We match background-checked ground coordinators, Bar Council advocates, or ICAI Chartered Accountants based on location coverage and verified track record. You receive formal itemized quotations with milestone breakdowns.',
      badge: 'Calibrated Matching',
      icon: '🤝',
    },
    {
      num: '03',
      title: 'Phased Milestone Custody',
      headline: 'Your Capital Stays Safeguarded',
      description:
        'Fund your request securely using international cards or wire transfer in USD, GBP, AED, CAD, or INR. Payments are safeguarded in platform milestone custody and disbursed only after verified milestone completion. Funds are never paid out blindly upfront.',
      badge: 'Milestone Protection',
      icon: '🛡️',
    },
    {
      num: '04',
      title: 'Live Ground Mobilization',
      headline: 'Real-Time Visibility from Overseas',
      description:
        'Track the scheduled visit, companion accompaniment, or legal filing in your My India dashboard. Receive direct check-in updates and communication across time zones.',
      badge: 'Cross-Timezone Liaison',
      icon: '📍',
    },
    {
      num: '05',
      title: 'GPS-Timestamped Proof & Sign-Off',
      headline: 'Inspect Evidence Before Payment Release',
      description:
        'The coordinator uploads high-resolution timestamped photos, 42-point checklists, meter readings, or stamped government receipts. You inspect the dossier and click approve to release the final milestone.',
      badge: 'Verifiable Evidence',
      icon: '📸',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-xs text-[#C9A45C] font-semibold">
          <span>🛡️</span>
          <span>THE TRANSACTIONAL EXECUTION LOOP</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          How Nuty Tales NRI Handles Your Responsibilities in India
        </h1>
        <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
          We replace reliance on busy relatives or informal favors with institutional accountability, verified ground specialists, and structured milestone payment approvals.
        </p>
      </div>

      {/* The 5 Steps */}
      <div className="space-y-6">
        {steps.map((st, i) => (
          <div
            key={i}
            className="bg-[#0E1524] rounded-3xl p-8 border border-white/10 hover:border-[#C9A45C]/40 transition-all flex flex-col md:flex-row items-start gap-6"
          >
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-4xl p-4 rounded-2xl bg-white/5 border border-white/10">
                {st.icon}
              </span>
              <span className="font-mono text-3xl font-bold text-[#C9A45C]">
                {st.num}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30 uppercase">
                  {st.badge}
                </span>
                <span className="text-xs text-stone-400 font-medium">{st.headline}</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">{st.title}</h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
                {st.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Proof Standards Card */}
      <div className="bg-gradient-to-r from-[#17233B] to-[#0E1524] p-8 sm:p-10 rounded-3xl border border-[#C9A45C]/30 space-y-6">
        <h3 className="font-serif text-2xl font-bold text-white">
          Our Standard of Proof & Customer Rights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
            <strong className="text-white block text-sm">Geotagged Metadata</strong>
            <p className="text-stone-300 font-light leading-relaxed">
              Every photo in an inspection dossier includes embedded GPS coordinates and Indian Standard Time stamps, preventing reused or stale photos.
            </p>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
            <strong className="text-white block text-sm">Milestone Hold</strong>
            <p className="text-stone-300 font-light leading-relaxed">
              Final milestones (typically 50-60% of total engagement) are held in platform custody until you review the completed evidence.
            </p>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-2">
            <strong className="text-white block text-sm">Arbitration & Dispute</strong>
            <p className="text-stone-300 font-light leading-relaxed">
              If an inspection was incomplete or substandard, you can raise an instant dispute. Our Operations Supervisor audits the evidence and mediates rework or refund.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link
            href="/#request-engine"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold shadow-lg hover:shadow-[#C9A45C]/30 transition-all hover:scale-[1.02]"
          >
            <span>⚡ Start Your Request Now</span>
            <span>→</span>
          </Link>
        </div>

        <p className="text-[11px] text-stone-500 text-center leading-relaxed max-w-2xl mx-auto pt-2 border-t border-white/5">
          * Regulatory Clarification: Milestone custody operates as a contractual payment schedule and phased service release mechanism governed by client terms. Nuty Tales is not a regulated banking escrow institution or depository.
        </p>
      </div>
    </div>
  )
}
