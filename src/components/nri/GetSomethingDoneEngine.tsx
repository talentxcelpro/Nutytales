'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { interpretNaturalLanguageRequest, extractLocationsFromPrompt } from '@/lib/nri/nlp-engine'
import { matchProvidersForPlan, generateIllustrativeQuote } from '@/lib/nri/matching-engine'
import { ExtractedPlan, NriRequest } from '@/lib/nri/types'
import { NriStore } from '@/lib/nri/nri-store'
import { OPERATIONAL_CITIES } from '@/lib/nri/nri-data'

const EXAMPLE_PROMPTS = [
  'Manage my parents’ house in Srinagar with monthly inspections.',
  'Arrange a doctor appointment & companion escort for my father in Delhi.',
  'Inspect apartment in DLF Phase 5 Gurugram before winter.',
  'Help renovate my ancestral home while I’m living in Dubai.',
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
  const [userCountry, setUserCountry] = useState('')
  const [userCity, setUserCity] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedPlan, setExtractedPlan] = useState<ExtractedPlan | null>(null)
  const [matchedProviders, setMatchedProviders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'plan' | 'estimate' | 'providers'>('plan')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null)

  const handleInterpret = (textToUse?: string) => {
    const text = (textToUse || prompt).trim()
    if (!text) return

    setIsProcessing(true)
    setTimeout(() => {
      // Auto-extract locations if user hasn't explicitly chosen them
      const autoLocs = extractLocationsFromPrompt(text)
      const effectiveCountry = userCountry || autoLocs.country || 'Global Diaspora'
      const effectiveCity = userCity || autoLocs.city || 'Delhi NCR'

      // Synchronize input fields if they were blank
      if (!userCountry && autoLocs.country) setUserCountry(autoLocs.country)
      if (!userCity && autoLocs.city) setUserCity(autoLocs.city)

      const result = interpretNaturalLanguageRequest(text, effectiveCountry, effectiveCity)
      const matches = matchProvidersForPlan(result.plan)
      setExtractedPlan(result.plan)
      setMatchedProviders(matches)
      setIsProcessing(false)
      setIsSubmitted(false)
    }, 350)
  }

  const handlePromptChipClick = (example: string) => {
    setPrompt(example)
    const locs = extractLocationsFromPrompt(example)
    if (locs.country) setUserCountry(locs.country)
    if (locs.city) setUserCity(locs.city)
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
          note: `Request initiated for ${extractedPlan.destination_city} (${extractedPlan.country_of_residence})`,
        },
        {
          status: 'matching',
          timestamp: new Date().toISOString(),
          actor: 'system',
          note: `Assigned to Nuty Tales Ground Operations Desk in ${extractedPlan.destination_city}`,
        },
      ],
    }

    NriStore.saveRequest(newRequest)
    setCreatedRequestId(requestId)
    setIsSubmitted(true)
  }

  return (
    <div id="request-engine" className="w-full max-w-5xl mx-auto scroll-mt-24">
      {/* Outer Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#141F33]/98 via-[#0F1726]/98 to-[#0B111D]/98 border-2 border-[#C9A45C]/40 p-6 sm:p-9 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest shadow-md">
          ✨ The Signature Request Engine
        </div>

        {/* Heading & Instructions */}
        <div className="text-center space-y-2 mb-6 pt-1">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            What do you need done in India?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Tell us in plain words. Our engine scopes the right vertical, estimates realistic timelines and fees, and assigns vetted coordinators on the ground.
          </p>
        </div>

        {/* Optional Location Selectors (Neutral Placeholders to Avoid Contradicting Prompts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 max-w-2xl mx-auto">
          <div>
            <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Where are you currently based?
            </label>
            <select
              value={userCountry}
              onChange={(e) => setUserCountry(e.target.value)}
              className="w-full bg-[#182338] text-stone-200 text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#C9A45C] focus:outline-none transition-colors"
            >
              <option value="" className="text-stone-400">
                🌍 Select your country of residence (or auto-detect)
              </option>
              {RESIDENCE_COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-[#10192A] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
              Indian Destination City
            </label>
            <select
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
              className="w-full bg-[#182338] text-stone-200 text-xs rounded-xl px-3.5 py-2.5 border border-white/10 focus:border-[#C9A45C] focus:outline-none transition-colors"
            >
              <option value="" className="text-stone-400">
                📍 Auto-detected from prompt (or select hub)
              </option>
              {OPERATIONAL_CITIES.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#10192A] text-white">
                  {c.name} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Input Textarea & Prominent Action */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
                  e.preventDefault()
                  handleInterpret()
                }
              }}
              placeholder="e.g. I live in London and need someone to inspect my ancestral home in Srinagar before winter, check roof seepage, test water pressure, and send timestamped photos..."
              className="w-full rounded-2xl bg-[#080D17] border border-white/20 p-4 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-[#C9A45C] focus:ring-1 focus:ring-[#C9A45C]/40 transition-all resize-none shadow-inner leading-relaxed"
              aria-label="Describe what you need done in India"
            />
          </div>

          {/* Action Row: Primary Button + Keyboard Hint */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-stone-300">Enter</kbd> to analyze request
            </span>

            <button
              type="button"
              onClick={() => handleInterpret()}
              disabled={isProcessing || !prompt.trim()}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] via-[#E2C37E] to-[#C9A45C] text-[#0E1524] text-xs sm:text-sm font-bold shadow-lg hover:shadow-[#C9A45C]/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
              aria-label="Find service category and scoping estimate"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0E1524] border-t-transparent rounded-full animate-spin" />
                  <span>Structuring Service Plan...</span>
                </>
              ) : (
                <>
                  <span>⚡ Find Service & Scoping Estimate</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>

          {/* Example Prompt Chips */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
              Try an example request:
            </span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePromptChipClick(ex)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-[11px] border border-white/10 hover:border-[#C9A45C]/50 transition-all text-left"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Extracted Plan & Interpretation Review Card ── */}
        {extractedPlan && !isSubmitted && (
          <div className="mt-8 pt-8 border-t border-white/10 space-y-6 animate-fadeIn">
            {/* Header: Plan Title + Review Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40 uppercase tracking-wider">
                    {extractedPlan.categoryLabel}
                  </span>
                  <span className="text-xs text-stone-300 font-medium">
                    📍 {extractedPlan.destination_city}, {extractedPlan.destination_state}
                  </span>
                  <span className="text-xs text-stone-400">
                    • Origin: {extractedPlan.country_of_residence}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  {extractedPlan.title}
                </h3>
              </div>

              {/* View Selector */}
              <div className="flex items-center bg-[#080D17] p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('plan')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'plan' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Scope of Work
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('estimate')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'estimate' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Pricing Estimate
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('providers')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    activeTab === 'providers' ? 'bg-[#C9A45C] text-[#0E1524]' : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Execution Desk
                </button>
              </div>
            </div>

            {/* Tab 1: Scope of Work */}
            {activeTab === 'plan' && (
              <div className="space-y-4 bg-[#080D17]/90 rounded-2xl p-5 border border-white/10 text-xs">
                <p className="text-stone-300 leading-relaxed font-light text-sm">
                  {extractedPlan.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-[11px] uppercase tracking-wider text-[#C9A45C] font-bold">
                      Planned Ground Deliverables:
                    </h4>
                    <ul className="space-y-2 text-stone-300">
                      {extractedPlan.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[11px] uppercase tracking-wider text-[#C9A45C] font-bold">
                      Verifiable Evidence Produced:
                    </h4>
                    <ul className="space-y-2 text-stone-300">
                      {extractedPlan.deliverables.map((del, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#C9A45C] mt-0.5">📸</span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {extractedPlan.clarification_needed.length > 0 && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                    <span className="font-bold">⚠️ Details for Execution Precision:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-300">
                      {extractedPlan.clarification_needed.map((cl, i) => (
                        <li key={i}>{cl}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Pricing Estimate */}
            {activeTab === 'estimate' && (
              <div className="bg-[#080D17]/90 rounded-2xl p-5 border border-white/10 text-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block">
                      Planning Fee Range
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C9A45C]">
                      ₹{extractedPlan.estimated_budget.min.toLocaleString('en-IN')} – ₹{extractedPlan.estimated_budget.max.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-stone-400 ml-2">
                      ({extractedPlan.frequency === 'monthly' ? 'monthly retainer estimate' : 'single assignment estimate'})
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-stone-300">
                    <span className="text-[10px] text-stone-400 block uppercase">Billing Mode</span>
                    <span className="font-semibold capitalize">{extractedPlan.frequency.replace('_', ' ')}</span>
                  </div>
                </div>

                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  <strong className="text-white">Notice:</strong> {extractedPlan.estimated_budget.disclaimer}
                </p>

                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-stone-300 text-xs space-y-1">
                  <span className="font-bold text-blue-300">🛡️ Phased Milestone Custody:</span>
                  <p className="leading-relaxed">
                    Payments are safeguarded in platform milestone custody. The final milestone is disbursed only after you inspect and accept the uploaded GPS-timestamped photographic proof on your portal.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Execution Desk */}
            {activeTab === 'providers' && (
              <div className="space-y-3">
                <div className="bg-[#080D17]/90 p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#C9A45C]/20 border border-[#C9A45C]/40 flex items-center justify-center text-2xl">
                        🏛️
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          Nuty Tales Ground Operations ({extractedPlan.destination_city})
                        </h4>
                        <span className="text-[11px] text-[#C9A45C] font-medium block">
                          Central Concierge & Ground Coordinator Desk
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Platform Supervised
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 font-light leading-relaxed pt-1">
                    Direct on-ground coordinator dispatch in {extractedPlan.destination_city}. All activities are overseen by our Operations Supervisor with strict timestamped photographic verification and milestone custody.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white/5 text-stone-300">
                      <strong className="text-[#C9A45C] block">Verification Standard:</strong>
                      <span>Aadhaar & Police Vetted</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 text-stone-300">
                      <strong className="text-[#C9A45C] block">Evidence Protocol:</strong>
                      <span>GPS & Time-Stamped</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 text-stone-300">
                      <strong className="text-[#C9A45C] block">Payment Release:</strong>
                      <span>Only Upon Client Approval</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Review & Final Submission Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span className="text-xs text-stone-400 text-center sm:text-left">
                Ready to proceed? We’ll initiate coordination for <strong className="text-white">{extractedPlan.destination_city}</strong>.
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setExtractedPlan(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 w-1/2 sm:w-auto transition-colors"
                >
                  Edit Request
                </button>

                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E2C37E] text-[#0E1524] text-xs font-bold hover:shadow-lg hover:shadow-[#C9A45C]/30 transition-all hover:scale-[1.02] w-1/2 sm:w-auto text-center"
                >
                  Confirm & Submit Request →
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
              <p className="text-xs text-stone-300 max-w-md mx-auto mt-1 leading-relaxed">
                Request ID: <span className="font-mono text-[#C9A45C] font-bold">{createdRequestId}</span>. Ground coordinators in {extractedPlan?.destination_city} have been notified. You can track milestones live in My India.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push(`/requests/${createdRequestId}`)}
                className="px-5 py-2.5 rounded-xl bg-[#C9A45C] text-[#0E1524] text-xs font-bold shadow-md hover:bg-[#DFBC72] transition-colors"
              >
                Inspect Request Status & Proof Dossier →
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-colors"
              >
                Open My India Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
