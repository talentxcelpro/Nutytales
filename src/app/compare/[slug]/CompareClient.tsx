'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ComparisonData } from '@/lib/comparisons-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface CompareClientProps {
  data: ComparisonData
}

export default function CompareClient({ data }: CompareClientProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0)
  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <div className="space-y-12">
      {/* ── Visual Head-to-Head Hero Cards ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option A Card */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-stone-950 font-bold text-[11px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
            Premium Recommendation
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
              {data.optionA.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-2">
              {data.optionA.name}
            </h3>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              Best Applications:
            </span>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {data.bestFor.optionABestFor.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {data.optionA.productSlug && (
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block">Single-Origin Farm Direct:</span>
                <span className="font-serif font-bold text-lg text-emerald-950">
                  ₹{data.optionA.priceInr?.toLocaleString('en-IN')}
                </span>
              </div>
              <Link
                href={`/shop/${data.optionA.productSlug}`}
                className="py-2.5 px-4 bg-emerald-900 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs transition-all"
              >
                Shop Authentic {data.optionA.shortLabel} →
              </Link>
            </div>
          )}
        </div>

        {/* Option B Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md inline-block">
              {data.optionB.badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-2">
              {data.optionB.name}
            </h3>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              Best Applications:
            </span>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {data.bestFor.optionBBestFor.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {data.optionB.productSlug && (
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block">Available In Shop:</span>
                <span className="font-serif font-bold text-lg text-stone-900">
                  ₹{data.optionB.priceInr?.toLocaleString('en-IN')}
                </span>
              </div>
              <Link
                href={`/shop/${data.optionB.productSlug}`}
                className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold rounded-xl text-xs uppercase tracking-wider border border-stone-300 transition-all"
              >
                View {data.optionB.shortLabel} →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Side-by-Side Comparison Matrix Table ── */}
      <section className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-serif text-stone-900 font-bold mb-6">
          Detailed Scientific & Nutritional Parameter Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider bg-stone-50/70">
                <th className="py-3 px-4 font-bold rounded-l-xl">Evaluation Parameter</th>
                <th className="py-3 px-4 font-bold text-emerald-950">{data.optionA.shortLabel}</th>
                <th className="py-3 px-4 font-bold">{data.optionB.shortLabel}</th>
                <th className="py-3 px-4 font-bold text-center">Winner</th>
                <th className="py-3 px-4 font-bold rounded-r-xl">Clinical Analysis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {data.metrics.map((metric, idx) => (
                <tr key={idx} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="py-4 px-4 font-bold text-stone-900">{metric.parameter}</td>

                  <td className="py-4 px-4 font-semibold text-emerald-950 bg-emerald-50/30">
                    {metric.optionAValue}
                  </td>

                  <td className="py-4 px-4 text-stone-700">{metric.optionBValue}</td>

                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        metric.winner === 'Option A'
                          ? 'bg-emerald-100 text-emerald-900'
                          : metric.winner === 'Option B'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {metric.winner === 'Option A'
                        ? data.optionA.shortLabel
                        : metric.winner === 'Option B'
                        ? data.optionB.shortLabel
                        : 'Tie'}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-xs text-stone-600 leading-relaxed max-w-xs">
                    {metric.clinicalExplanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Botanical Verdict Callout Box ── */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-md">
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
            The Botanical & Nutritional Verdict
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Which One Should You Choose?
          </h3>
          <p className="text-sm text-stone-300 leading-relaxed font-sans">
            {data.verdict}
          </p>

          {data.optionA.productSlug && (
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/shop/${data.optionA.productSlug}`}
                className="py-3 px-6 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Order Certified {data.optionA.shortLabel} →
              </Link>

              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  `Hello Nuty Tales! I am comparing ${data.title}. Please guide me on which product fits my health requirements.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs transition-all shadow-xs"
              >
                Ask Botanical Expert on WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8">
        <h3 className="text-xl font-serif text-stone-900 font-bold mb-6">
          Frequently Asked Comparison Questions
        </h3>
        <div className="space-y-3">
          {data.faq.map((item, idx) => {
            const isOpen = openFaqIdx === idx
            return (
              <div key={idx} className="border border-stone-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-stone-900 text-sm flex items-center justify-between gap-4 hover:bg-stone-50"
                >
                  <span>{item.question}</span>
                  <svg
                    className={`w-4 h-4 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                    {item.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
