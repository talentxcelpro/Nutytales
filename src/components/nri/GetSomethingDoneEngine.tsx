'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { interpretNaturalLanguageRequest } from '@/lib/nri/nlp-engine'
import { matchProvidersForPlan, generateIllustrativeQuote } from '@/lib/nri/matching-engine'
import { ExtractedPlan, NriRequest } from '@/lib/nri/types'
import { NriStore } from '@/lib/nri/nri-store'
import { OPERATIONAL_CITIES } from '@/lib/nri/nri-data'

const EXAMPLE_PROMPTS = [
  'Manage my parents’ house in Srinagar with monthly inspections.',
  'Find a property manager for my apartment in DLF Phase 5 Gurugram.',
  'Arrange a doctor appointment & companion escort for my father in Delhi.',
  'Help renovate my home while I’m living in Dubai.',
  'Draft and register a Power of Attorney for property sale.',
  'Plan my sister’s wedding in Kashmir with Wazwan catering.',
  'Send luxury saffron & walnut gift boxes to relatives across India.',
]

const RESIDENCE_COUNTRIES = [
  'United States',
  'United Kingdom',
  'United Arab Emirates',
  'Canada',
  'Australia',
  'Singapore',
  'Saudi Arabia',
  'Qatar',
  'New Zealand',
  'Germany / Europe',
  'Other Country',
]

export default function GetSomethingDoneEngine() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [userCountry, setUserCountry] = useState('United States')
  const [userCity, setUserCity] = useState('Srinagar')
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedPlan, setExtractedPlan] = useState<ExtractedPlan | null>(null)
  const [matchedProviders, setMatchedProviders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'plan' | 'providers' | 'estimate'>('plan')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null)

  const handleInterpret = (textToUse?: string) => {
    const text = (textToUse || prompt).trim()
    if (!text) return

    setIsProcessing(true)
    setTimeout(() => {
      const result = interpretNaturalLanguageRequest(text, userCountry, userCity)
      const matches = matchProvidersForPlan(result.plan)
      setExtractedPlan(result.plan)
      setMatchedProviders(matches)
      setIsProcessing(false)
      setIsSubmitted(false)
    }, 400)
  }

  const handlePromptChipClick = (example: string) => {
    setPrompt(example)
    handleInterpret(example)
  }

  const handleSubmitRequest = () => {
    if (!extractedPlan) return

    const requestId = `req-${Date.now()}`
    const topQuotes = matchedProviders.slice(0, 2).map((m) => generateIllustrativeQuote(m.provider, extractedPlan))

    const newRequest: NriRequest = {
      id: requestId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'submitted',
      rawPrompt: prompt,
      extractedPlan,
      quotes: topQuotes as any,
      history: [
        {
          status: 'submitted',
          timestamp: new Date().toISOString(),
          actor: 'customer',
          note: `Request initiated from ${userCountry} for ${extractedPlan.destination_city}`,
        },
        {
          status: 'matching',
          timestamp: new Date().toISOString(),
          actor: 'system',
          note: `Matched ${matchedProviders.length} verified regional providers`,
        },
      ],
    }

    NriStore.saveRequest(newRequest)
    setCreatedRequestId(requestId)
    setIsSubmitted(true)
  }

  return (
    <div id="request-engine" className="w-full max-w-5xl mx-auto">
      {/* Outer Glow Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#17233B]/95 via-[#10192A]/95 to-[#0E1524]/95 border-2 border-[#C9A45C]/40 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-[11px] font-extrabold uppercase tracking-widest shadow-md">
          ✨ The Signature Request Engine
        </div>

        {/* Input Heading */}
        <div className="text-center space-y-2 mb-6 pt-2">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            What do you need done in India?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto font-light">
            Tell us in plain words. We’ll organize the right service category, estimate timelines and budgets, and connect verified ground specialists.
          </p>
        </div>

        {/* Country & Indian Location Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 max-w-2xl mx-auto">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Your Country of Residence
            </label>
            <select
              value={userCountry}
              onChange={(e) => setUserCountry(e.target.value)}
              className="w-full bg-[#1A263D] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#C9A45C] focus:outline-none"
            >
              {RESIDENCE_COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-[#10192A]">
                  🌍 {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Indian Destination City
            </label>
            <select
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
              className="w-full bg-[#1A263D] text-white text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#C9A45C] focus:outline-none"
            >
              {OPERATIONAL_CITIES.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#10192A]">
                  📍 {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Textarea & Action */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I live in London and need someone to inspect my ancestral home in Srinagar before winter, check roof seepage, and insulate water pipes..."
              className="w-full rounded-2xl bg-[#0B111D] border border-white/20 p-4 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C] transition-all resize-none shadow-inner"
            />

            <div className="sm:absolute sm:bottom-3 sm:right-3 mt-2 sm:mt-0 flex justify-end">
              <button
                type="button"
                onClick={() => handleInterpret()}
                disabled={isProcessing || !prompt.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#DFBC72] text-[#0E1524] text-xs font-bold hover:shadow-lg hover:shadow-[#C9A45C]/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#0E1524] border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Request...</span>
                  </>
                ) : (
                  <>
                    <span>⚡ Find the Right Service</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example Prompt Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-stone-400 font-medium block">
              Popular NRI requests:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePromptChipClick(ex)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] border border-white/10 hover:border-[#C9A45C]/40 transition-colors text-left"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Extracted Plan & Interpretation Card ── */}
        {extractedPlan && !isSubmitted && (
          <div className="mt-8 pt-8 border-t border-white/10 space-y-6 animate-fadeIn">
            {/* Header with Title and Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40 uppercase tracking-wider">
                    {extractedPlan.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-400">
                    📍 {extractedPlan.destination_city}, {extractedPlan.destination_state}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  {extractedPlan.title}
                </h3>
              </div>

              {/* Sub-tabs */}
              <div className="flex items-center bg-[#0B111D] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('plan')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'plan' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Service Plan
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('estimate')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'estimate' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Estimate
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('providers')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'providers' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Matched Providers ({matchedProviders.length})
                </button>
              </div>
            </div>

            {/* Tab 1: Service Plan */}
            {activeTab === 'plan' && (
              <div className="space-y-4 bg-[#0B111D]/80 rounded-2xl p-5 border border-white/10 text-xs">
                <p className="text-stone-300 leading-relaxed font-light text-sm">
                  {extractedPlan.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-[11px] uppercase tracking-wider text-[#C9A45C] font-bold">
                      Key Inclusions & Execution Steps:
                    </h4>
                    <ul className="space-y-1.5 text-stone-300">
                      {extractedPlan.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] uppercase tracking-wider text-[#C9A45C] font-bold">
                      Verified Proof Deliverables:
                    </h4>
                    <ul className="space-y-1.5 text-stone-300">
                      {extractedPlan.deliverables.map((del, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#C9A45C] mt-0.5">📄</span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {extractedPlan.clarification_needed.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                    <span className="font-bold">⚠️ Clarification for precision:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-300">
                      {extractedPlan.clarification_needed.map((cl, i) => (
                        <li key={i}>{cl}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Estimate */}
            {activeTab === 'estimate' && (
              <div className="bg-[#0B111D]/80 rounded-2xl p-5 border border-white/10 text-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                      Planning Estimate Range
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#C9A45C]">
                      ₹{extractedPlan.estimated_budget.min.toLocaleString('en-IN')} – ₹{extractedPlan.estimated_budget.max.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-400 ml-2">
                      ({extractedPlan.frequency === 'monthly' ? 'per month' : 'single execution'})
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-stone-300 text-right">
                    <span className="text-[10px] text-stone-400 block uppercase">Frequency</span>
                    <span className="font-semibold capitalize">{extractedPlan.frequency.replace('_', ' ')}</span>
                  </div>
                </div>

                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  <strong className="text-white">Pricing Notice:</strong> {extractedPlan.estimated_budget.disclaimer}
                </p>

                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-stone-300 text-xs space-y-1">
                  <span className="font-bold text-blue-300">🛡️ Phased Milestone Protection:</span>
                  <p>
                    Funds are never transferred directly upfront to local contractors. Initial deposit is held in platform custody; final milestone is released only after you review the GPS-timestamped photos, receipts, or legal records.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Matched Providers */}
            {activeTab === 'providers' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {matchedProviders.map((match, i) => (
                    <div
                      key={i}
                      className="bg-[#0B111D] p-4 rounded-2xl border border-white/10 hover:border-[#C9A45C]/40 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={match.provider.avatar}
                            alt={match.provider.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#C9A45C]/40"
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm">{match.provider.name}</h4>
                            <span className="text-[11px] text-stone-400 block">
                              {match.provider.businessName}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-0.5">
                              <span>★ {match.provider.rating}</span>
                              <span className="text-stone-400">({match.provider.completedJobs} jobs)</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {match.fitLabel}
                        </span>
                      </div>

                      <div className="text-[11px] text-stone-300 bg-white/5 p-2 rounded-lg space-y-1">
                        <span className="font-semibold text-[#C9A45C] block">Why matched:</span>
                        <p className="text-stone-400 leading-tight">
                          {match.transparentReasons.slice(0, 2).join(' • ')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-stone-400">
                          Sample Rate: <strong className="text-white">{match.provider.sampleRate}</strong>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">
                          ✓ {match.provider.verificationLevel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
              <span className="text-xs text-stone-400">
                Reviewing plan for <strong className="text-white">{extractedPlan.destination_city}</strong>
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setExtractedPlan(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 w-1/2 sm:w-auto"
                >
                  Edit Prompt
                </button>

                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold hover:shadow-lg hover:shadow-[#C9A45C]/30 transition-all hover:scale-[1.02] w-1/2 sm:w-auto text-center"
                >
                  Submit & Open Request Tracker →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Submission Confirmation & Link to Tracker ── */}
        {isSubmitted && createdRequestId && (
          <div className="mt-8 pt-8 border-t border-white/10 text-center space-y-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Your Service Request is Active!
              </h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto mt-1">
                Request ID: <span className="font-mono text-[#C9A45C] font-bold">{createdRequestId}</span>. Matched regional providers in {extractedPlan?.destination_city} have been alerted and your request is recorded in the My India dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/requests/${createdRequestId}`)}
                className="px-5 py-2.5 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold shadow-md hover:bg-[#DFBC72]"
              >
                Inspect Request Status & Quotes →
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15"
              >
                Go to My India Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
