'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { interpretNaturalLanguageRequest, extractLocationsFromPrompt } from '@/lib/nri/nlp-engine'
import { matchProvidersForPlan, generateIllustrativeQuote } from '@/lib/nri/matching-engine'
import { ExtractedPlan, NriRequest } from '@/lib/nri/types'
import { NriStore } from '@/lib/nri/nri-store'
import { OPERATIONAL_CITIES } from '@/lib/nri/nri-data'

const POPULAR_SUGGESTIONS = [
  'Doctor appointment & companion escort for parents in Delhi NCR',
  'Vacant apartment inspection & tenant handover in Mumbai',
  'Power of Attorney consular drafting & Sub-Registrar execution',
  'Ancestral home check & monsoon sealing in Kerala',
  'Villa perimeter inspection & utility audit in Bengaluru',
  'Pre-winter structural audit & pipe insulation in Srinagar',
]

const TIMEFRAMES = [
  { label: 'Flexible / Standard', value: 'standard' },
  { label: 'Urgent / Within 48h', value: 'priority' },
  { label: 'Standing Monthly Plan', value: 'monthly' },
]

export default function GetSomethingDoneEngine() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [userCity, setUserCity] = useState('')
  const [timeline, setTimeline] = useState('standard')
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
      // Auto-extract locations if not selected manually
      const autoLocs = extractLocationsFromPrompt(text)
      const effectiveCity = userCity || autoLocs.city || 'Delhi NCR'
      const effectiveCountry = autoLocs.country || 'Global Diaspora'

      if (!userCity && autoLocs.city) {
        setUserCity(autoLocs.city)
      }

      // Add timeline modifier if user picked priority or monthly
      let augmentedText = text
      if (timeline === 'priority' && !text.toLowerCase().includes('urgent')) {
        augmentedText += ' urgent priority'
      } else if (timeline === 'monthly' && !text.toLowerCase().includes('month')) {
        augmentedText += ' recurring monthly'
      }

      const result = interpretNaturalLanguageRequest(augmentedText, effectiveCountry, effectiveCity)
      const matches = matchProvidersForPlan(result.plan)
      setExtractedPlan(result.plan)
      setMatchedProviders(matches)
      setIsProcessing(false)
      setIsSubmitted(false)
    }, 350)
  }

  const handleSuggestionClick = (example: string) => {
    setPrompt(example)
    const locs = extractLocationsFromPrompt(example)
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
    <div id="search-bar" className="w-full max-w-5xl scroll-mt-28">
      {/* ── Airbnb-Style Horizontal Search Bar ── */}
      <div className="bg-white rounded-2xl lg:rounded-full border border-stone-200 shadow-[0_6px_28px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_36px_rgba(0,0,0,0.09)] transition-all p-2 sm:p-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleInterpret()
          }}
          className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-0"
        >
          {/* Segment 1: Where in India? */}
          <div className="flex-1 px-4 py-2 hover:bg-stone-50 rounded-xl lg:rounded-full transition-colors text-left">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
              Where in India?
            </label>
            <input
              type="text"
              list="operational-cities-list"
              value={userCity}
              onChange={(e) => setUserCity(e.target.value)}
              placeholder="City, locality or PIN"
              className="w-full bg-transparent text-xs font-semibold text-[#191919] placeholder-stone-400 focus:outline-none truncate"
            />
            <datalist id="operational-cities-list">
              {OPERATIONAL_CITIES.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </div>

          <div className="hidden lg:block w-[1px] h-9 bg-stone-200 mx-1" />

          {/* Segment 2: What do you need? (Natural Language Input) */}
          <div className="flex-[2] px-4 py-2 hover:bg-stone-50 rounded-xl lg:rounded-full transition-colors text-left">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
              What do you need?
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Tell us what you need"
              className="w-full bg-transparent text-xs font-medium text-[#191919] placeholder-stone-400 focus:outline-none truncate"
            />
          </div>

          <div className="hidden lg:block w-[1px] h-9 bg-stone-200 mx-1" />

          {/* Segment 3: When? (Timing Selection) */}
          <div className="flex-1 px-4 py-2 hover:bg-stone-50 rounded-xl lg:rounded-full transition-colors cursor-pointer text-left">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-0.5">
              When?
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#191919] focus:outline-none cursor-pointer"
            >
              <option value="standard">Choose timing</option>
              <option value="standard">Flexible timing</option>
              <option value="priority">Urgent (within 48h)</option>
              <option value="monthly">Standing monthly</option>
            </select>
          </div>

          {/* Primary Action Button: Find Help */}
          <div className="px-2 py-1 flex items-center justify-end">
            <button
              type="submit"
              disabled={isProcessing || (!prompt.trim() && !userCity.trim())}
              className="w-full lg:w-auto px-6 py-3.5 rounded-full bg-[#191919] hover:bg-[#8C6D2D] text-white text-xs font-semibold transition-all hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
              aria-label="Find Help in India"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Find Help</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── 3 Compact Clickable Suggestions ── */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500 px-2">
        <span className="font-medium text-stone-400">Suggestions:</span>
        <button
          type="button"
          onClick={() => handleSuggestionClick('Inspect property & 42-point walkthrough with photo dossier')}
          className="px-3.5 py-1 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all text-xs font-medium shadow-2xs hover:border-stone-300"
        >
          Property inspection
        </button>
        <button
          type="button"
          onClick={() => handleSuggestionClick('Companion care visit & doctor escort for parents')}
          className="px-3.5 py-1 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all text-xs font-medium shadow-2xs hover:border-stone-300"
        >
          Help for parents
        </button>
        <button
          type="button"
          onClick={() => handleSuggestionClick('Home civil repairs, electrical maintenance & deep cleaning')}
          className="px-3.5 py-1 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-all text-xs font-medium shadow-2xs hover:border-stone-300"
        >
          Home repairs
        </button>
      </div>

      {/* ── Extracted Service Plan & Quotation Scoping Card ── */}
      {extractedPlan && !isSubmitted && (
        <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xl text-left space-y-6 animate-fadeIn">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3EFE6] text-[#8C6D2D] border border-[#E5DEC9] uppercase tracking-wider">
                  {extractedPlan.categoryLabel}
                </span>
                <span className="text-xs font-semibold text-stone-700">
                  📍 {extractedPlan.destination_city}, {extractedPlan.destination_state}
                </span>
                <span className="text-xs text-stone-400">
                  • Residence: {extractedPlan.country_of_residence}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#191919] mt-1.5">
                {extractedPlan.title}
              </h3>
            </div>

            {/* Sub-Tabs */}
            <div className="flex items-center bg-stone-100 p-1 rounded-full text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('plan')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  activeTab === 'plan' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Scope
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('estimate')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  activeTab === 'estimate' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Estimate
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('providers')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  activeTab === 'providers' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Execution Desk
              </button>
            </div>
          </div>

          {/* Tab 1: Scope & Deliverables */}
          {activeTab === 'plan' && (
            <div className="space-y-4 text-xs">
              <p className="text-stone-600 text-sm font-light leading-relaxed">
                {extractedPlan.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">
                    Planned Inclusions & Checkpoints:
                  </h4>
                  <ul className="space-y-1.5 text-stone-700">
                    {extractedPlan.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span className="leading-tight">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200 space-y-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900">
                    Verifiable Proof Generated:
                  </h4>
                  <ul className="space-y-1.5 text-stone-700">
                    {extractedPlan.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#8C6D2D] font-bold">📸</span>
                        <span className="leading-tight">{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {extractedPlan.clarification_needed.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <span className="font-bold">⚠️ Details for Execution Precision:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-800">
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
            <div className="space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6] p-4 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                    Planning Fee Range
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#191919]">
                    ₹{extractedPlan.estimated_budget.min.toLocaleString('en-IN')} – ₹{extractedPlan.estimated_budget.max.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-500 ml-2">
                    ({extractedPlan.frequency === 'monthly' ? 'monthly recurring estimate' : 'single assignment estimate'})
                  </span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-right">
                  <span className="text-[10px] text-stone-400 uppercase block font-medium">Frequency</span>
                  <span className="font-semibold capitalize text-stone-900">{extractedPlan.frequency.replace('_', ' ')}</span>
                </div>
              </div>

              <p className="text-stone-500 text-xs font-light leading-relaxed">
                <strong className="text-stone-800">Notice:</strong> {extractedPlan.estimated_budget.disclaimer}
              </p>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs space-y-1">
                <span className="font-bold text-blue-900">🛡️ Phased Milestone Custody:</span>
                <p className="text-blue-900/90 leading-relaxed font-light">
                  Funds are safeguarded in platform milestone custody. The final milestone is released only after you review and approve the uploaded GPS-timestamped photographic proof on your portal.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Execution Desk */}
          {activeTab === 'providers' && (
            <div className="space-y-3 text-xs">
              {matchedProviders.length > 0 ? (
                matchedProviders.slice(0, 1).map((m, idx) => (
                  <div key={idx} className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#F3EFE6] border border-[#E5DEC9] flex items-center justify-center text-xl">
                          {m.isDirectHub ? '🏛️' : m.isRfqOnly ? '🤝' : '📋'}
                        </div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm">
                            {m.provider.name}
                          </h4>
                          <span className="text-[11px] text-[#8C6D2D] font-medium block">
                            {m.provider.businessName}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          m.isDirectHub
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : m.isRfqOnly
                            ? 'bg-amber-100 text-amber-900 border-amber-200'
                            : 'bg-stone-100 text-stone-700 border-stone-300'
                        }`}
                      >
                        {m.fitLabel}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {m.provider.bio}
                    </p>

                    <div className="pt-2 border-t border-stone-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Matching & Execution Safeguards:
                      </span>
                      <ul className="space-y-1 text-stone-700">
                        {m.transparentReasons.map((r: string, rIdx: number) => (
                          <li key={rIdx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-stone-200 text-stone-600">
                  <p>Central operations desk will scope and review available ground specialists for {extractedPlan.destination_city}.</p>
                </div>
              )}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100">
            <span className="text-xs text-stone-500 text-center sm:text-left">
              Reviewing plan for <strong className="text-stone-900">{extractedPlan.destination_city}</strong>
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setExtractedPlan(null)}
                className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold w-1/2 sm:w-auto transition-colors"
              >
                Modify Search
              </button>

              <button
                type="button"
                onClick={handleSubmitRequest}
                className="px-6 py-2.5 rounded-full bg-[#191919] hover:bg-[#333333] text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all w-1/2 sm:w-auto text-center"
              >
                {matchedProviders[0]?.isDirectHub
                  ? 'Confirm & Schedule Service →'
                  : matchedProviders[0]?.isRfqOnly
                  ? 'Request Scoped Quotation →'
                  : 'Submit Sourcing Request →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submission Confirmation & Link to Tracker ── */}
      {isSubmitted && createdRequestId && (
        <div className="mt-6 bg-white rounded-3xl border border-stone-200 p-8 shadow-xl text-center space-y-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold mx-auto">
            ✓
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#191919]">
              Your Service Request is Active
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 leading-relaxed">
              Request ID: <span className="font-mono text-stone-900 font-bold">{createdRequestId}</span>. Ground coordinators in {extractedPlan?.destination_city} have been alerted. You can track live milestones in My India.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push(`/requests/${createdRequestId}`)}
              className="px-5 py-2.5 rounded-full bg-[#191919] text-white text-xs font-semibold shadow-sm hover:bg-[#333333] transition-colors"
            >
              Inspect Request Tracker →
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2.5 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition-colors"
            >
              Open My India Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
