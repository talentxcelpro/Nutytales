'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useStaysContext } from './StaysShell'
import { ConciergeChatResponse } from '@/lib/stays/ai-concierge'

const SUGGESTED_AI_QUERIES = [
  'Find a private villa in Kashmir for eight people for five nights, with mountain views, a kitchen, parking and a total budget of ₹40,000.',
  'Show me ski-in chalets in Gulmarg for 4 guests with hot tub and fireplace.',
  'Executive residence in Noida with 12-seat boardroom and 500 Mbps fiber for 3 nights.',
  'Heritage cedar houseboat on Nigeen Lake for romantic anniversary with shikara dinner.',
  'Family-friendly private orchard estate in Srinagar with master Wazwan chef.',
]

export default function AIConciergeModal() {
  const { isAiConciergeOpen, closeAiConcierge, aiInitialPrompt } = useStaysContext()
  const [queryInput, setQueryInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'assistant'; text: string; data?: ConciergeChatResponse }[]
  >([])

  useEffect(() => {
    if (aiInitialPrompt && isAiConciergeOpen) {
      setQueryInput(aiInitialPrompt)
      handleSend(aiInitialPrompt)
    }
  }, [aiInitialPrompt, isAiConciergeOpen])

  if (!isAiConciergeOpen) return null

  const handleSend = async (queryText?: string) => {
    const q = (queryText || queryInput).trim()
    if (!q || isLoading) return

    const userMessage = { sender: 'user' as const, text: q }
    setChatHistory((prev) => [...prev, userMessage])
    setQueryInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/stays/ai-concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.summary,
            data,
          },
        ])
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: data.error || 'I could not process your request. Please try refining your destination or dates.',
          },
        ])
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Network error connecting to AI Concierge. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-[#E7E2D9] animate-slideLeft">
        {/* Header */}
        <div className="p-5 border-b border-[#E7E2D9] bg-[#17233B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C9A45C] to-[#99732B] flex items-center justify-center text-white text-xl shadow-md">
              ✨
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                <span>Nuty Tales Stays AI Concierge</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-sans font-bold tracking-wide border border-emerald-400/30">
                  Live Grounded
                </span>
              </h2>
              <p className="text-[11px] text-stone-300">
                Natural-language discovery, real inventory matching &amp; transparent pricing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeAiConcierge}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close Concierge"
          >
            ✕
          </button>
        </div>

        {/* Chat / Content Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Welcome Intro */}
          {chatHistory.length === 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-[#E7E2D9] shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#704B32] block">
                  How can I curate your journey?
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Tell me in your own words what you are seeking. I will extract dates, guests, required amenities (mountain view, kitchen, wood fireplace, fiber internet, parking, pool) and compare verified properties from our database with zero fabricated claims.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Sample Inquiries to try:
                </span>
                <div className="flex flex-col gap-2">
                  {SUGGESTED_AI_QUERIES.map((sq, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(sq)}
                      className="p-3 bg-white hover:bg-stone-50 border border-[#E7E2D9] rounded-xl text-left text-xs text-stone-700 hover:border-[#17233B] transition-all flex items-start gap-2 shadow-2xs group"
                    >
                      <span className="text-[#C9A45C] group-hover:scale-110 transition-transform">💬</span>
                      <span className="line-clamp-2">{sq}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Trail */}
          {chatHistory.map((msg, index) => (
            <div key={index} className="space-y-3">
              <div
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#17233B] text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">
                    ✨
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#17233B] text-white shadow-xs'
                      : 'bg-white border border-[#E7E2D9] text-stone-800 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>

              {/* Render Recommended Property Cards if present */}
              {msg.data?.recommendations && msg.data.recommendations.length > 0 && (
                <div className="space-y-4 pt-2">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
                    Verified Matches from Database:
                  </span>
                  <div className="space-y-4">
                    {msg.data.recommendations.map((rec) => (
                      <div
                        key={rec.property.id}
                        className="p-4 bg-white rounded-2xl border border-[#E7E2D9] shadow-sm space-y-3 hover:border-stone-400 transition-all"
                      >
                        <div className="flex gap-4">
                          <div className="relative w-28 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
                            <Image
                              src={rec.property.featuredImage}
                              alt={rec.property.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#17233B]/90 text-white text-[9px] font-bold">
                              {rec.matchScore}% Match
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif font-bold text-sm text-[#17233B]">
                                {rec.property.name}
                              </h4>
                            </div>
                            <p className="text-[11px] text-stone-500">
                              📍 {rec.property.city}, {rec.property.state} · ⭐ {rec.property.rating} ({rec.property.reviewsCount} reviews)
                            </p>
                            <p className="text-[11px] text-stone-600 line-clamp-2">
                              {rec.property.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Match Explanations */}
                        <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2D9] space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#704B32] block">
                            Why this matches your request:
                          </span>
                          <ul className="space-y-1 text-[11px] text-stone-700">
                            {rec.matchReasons.map((reason, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Transparent Price & Booking Handoff */}
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-stone-500 block">Total Estimated Tariff</span>
                            <span className="font-mono text-sm font-extrabold text-[#176B68]">
                              ₹{rec.estimatedTariff.totalWithTaxes.toLocaleString('en-IN')}
                              <span className="text-[10px] font-normal text-stone-500 ml-1">
                                ({rec.estimatedTariff.nights} nights, taxes included)
                              </span>
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              href={`/stays/${rec.property.slug}`}
                              onClick={closeAiConcierge}
                              className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                            >
                              View &amp; Book →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Side-by-Side Comparison Box */}
                  {msg.data.comparisonMatrix && (
                    <div className="p-4 bg-amber-50/70 rounded-2xl border border-[#C9A45C]/40 space-y-3">
                      <span className="text-xs font-bold text-[#704B32] flex items-center gap-1.5">
                        <span>⚖️</span>
                        <span>Side-by-Side Comparison</span>
                      </span>
                      <p className="text-xs text-stone-700 leading-relaxed font-serif italic">
                        {msg.data.comparisonMatrix.aiComparisonSummary}
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] text-stone-700 bg-white rounded-xl overflow-hidden border border-amber-200">
                          <thead className="bg-amber-100/60 font-bold uppercase text-[10px]">
                            <tr>
                              <th className="p-2">Property</th>
                              <th className="p-2">Capacity</th>
                              <th className="p-2">Est. Total</th>
                              <th className="p-2">Rating</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {msg.data.comparisonMatrix.properties.map((p) => (
                              <tr key={p.slug}>
                                <td className="p-2 font-bold text-[#17233B]">{p.name}</td>
                                <td className="p-2">{p.bedrooms} Beds / {p.capacity} Pax</td>
                                <td className="p-2 font-mono font-bold text-[#176B68]">₹{p.totalTariff.toLocaleString('en-IN')}</td>
                                <td className="p-2">⭐ {p.rating}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  {msg.data.nextQuestions && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.data.nextQuestions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          type="button"
                          onClick={() => handleSend(q)}
                          className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-200 rounded-full text-[11px] text-stone-700 hover:border-[#17233B] transition-all"
                        >
                          💬 {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-4 bg-white rounded-2xl border border-stone-200 text-xs text-stone-600 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#17233B] animate-ping" />
              <span>Analyzing requirements, querying verified inventory and calculating transparent pricing...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E7E2D9] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. 5 nights in Kashmir villa for 8 guests with kitchen & mountain view..."
              className="flex-1 p-3.5 bg-[#FAF8F5] border border-[#E7E2D9] rounded-xl text-xs text-[#17233B] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#17233B]"
            />
            <button
              type="submit"
              disabled={isLoading || !queryInput.trim()}
              className="py-3.5 px-5 bg-[#17233B] hover:bg-[#1E3048] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Send</span>
              <span>→</span>
            </button>
          </form>
          <div className="pt-2 text-[10px] text-stone-400 flex items-center justify-between">
            <span>Natural language search grounded in real inventory</span>
            <span>Deterministic fallback enabled</span>
          </div>
        </div>
      </div>
    </div>
  )
}
