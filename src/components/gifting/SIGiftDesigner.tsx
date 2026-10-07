'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

export type RecipientPersona =
  | 'client'
  | 'employee'
  | 'partner'
  | 'vip'
  | 'wedding_guests'
  | 'family_friends'
  | 'myself'

export type GiftingOutcome =
  | 'thank_client'
  | 'onboard_employee'
  | 'milestone'
  | 'diwali'
  | 'wedding_favors'
  | 'kashmir_experience'
  | 'just_because'

export type VibeStyle =
  | 'luxury_heritage'
  | 'wellness_gourmet'
  | 'kashmiri_artisan'
  | 'sustainable_luxe'
  | 'modern_minimal'

interface GiftingProgramResult {
  title: string
  subtitle: string
  tierName: string
  unitBudgetINR: number
  unitBudgetUSD: number
  recommendedUnits: number
  heroImage: string
  badge: string
  boxContents: string[]
  personalization: string
  packagingType: string
  regions: {
    name: string
    code: string
    flag: string
    method: string
    deliveryDays: string
    dutyStatus: string
  }[]
  ecosystemSynergies: {
    vertical: 'weddings' | 'crafts' | 'stays' | 'travel' | 'business'
    badge: string
    title: string
    description: string
    linkText: string
    href: string
  }[]
  choiceLinkSupport: boolean
  aiRationale: string
}

const PRESET_INTENTS = [
  {
    label: 'Global Festive 300 (India/UAE/UK)',
    prompt:
      'I need gifts for 300 employees across India, UAE and UK. Budget $75 each. Diwali is coming. Premium Indian heritage theme.',
    persona: 'employee' as RecipientPersona,
    outcome: 'diwali' as GiftingOutcome,
    budget: 6250,
    vibe: 'luxury_heritage' as VibeStyle,
  },
  {
    label: 'Thank Best CXO Client',
    prompt:
      'Thank my top 25 executive clients with a rare Kashmir keepsake, GI saffron and artisan walnut wood box. Budget ₹5,000.',
    persona: 'vip' as RecipientPersona,
    outcome: 'thank_client' as GiftingOutcome,
    budget: 5000,
    vibe: 'luxury_heritage' as VibeStyle,
  },
  {
    label: 'Destination Wedding 400 Guests',
    prompt:
      '500 luxury wedding welcome boxes for guests attending a Srinagar destination wedding. Warm kahwa, walnuts, and pashmina touches.',
    persona: 'wedding_guests' as RecipientPersona,
    outcome: 'wedding_favors' as GiftingOutcome,
    budget: 3500,
    vibe: 'kashmiri_artisan' as VibeStyle,
  },
  {
    label: 'Deal Closed / Sendoso Trigger',
    prompt:
      'Congratulate a client on signing a 3-year enterprise contract. Premium gourmet pairing with personalized CEO letter. Budget ₹2,500.',
    persona: 'client' as RecipientPersona,
    outcome: 'milestone' as GiftingOutcome,
    budget: 2500,
    vibe: 'modern_minimal' as VibeStyle,
  },
  {
    label: 'New Hire Welcome Desk (50)',
    prompt:
      'Welcome 50 new tech hires across Bangalore and Noida with an energizing gourmet wellness box and branded keepsake notebook.',
    persona: 'employee' as RecipientPersona,
    outcome: 'onboard_employee' as GiftingOutcome,
    budget: 1200,
    vibe: 'wellness_gourmet' as VibeStyle,
  },
]

export default function SIGiftDesigner({
  initialCompact = false,
}: {
  initialCompact?: boolean
}) {
  const [naturalQuery, setNaturalQuery] = useState('')
  const [step, setStep] = useState<number>(1)
  const [persona, setPersona] = useState<RecipientPersona>('client')
  const [outcome, setOutcome] = useState<GiftingOutcome>('thank_client')
  const [unitBudget, setUnitBudget] = useState<number>(2500)
  const [recipientCount, setRecipientCount] = useState<number>(100)
  const [vibe, setVibe] = useState<VibeStyle>('luxury_heritage')
  const [enableChoiceLink, setEnableChoiceLink] = useState<boolean>(true)
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['IN', 'AE', 'UK'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [programResult, setProgramResult] = useState<GiftingProgramResult | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.CORPORATE || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Handle Preset selection
  const handleSelectPreset = (preset: typeof PRESET_INTENTS[0]) => {
    setNaturalQuery(preset.prompt)
    setPersona(preset.persona)
    setOutcome(preset.outcome)
    setUnitBudget(preset.budget)
    setVibe(preset.vibe)
    generateProgram(preset.persona, preset.outcome, preset.budget, preset.vibe, recipientCount)
  }

  // AI Program Generation Logic
  const generateProgram = (
    p: RecipientPersona,
    o: GiftingOutcome,
    b: number,
    v: VibeStyle,
    count: number
  ) => {
    setIsGenerating(true)

    setTimeout(() => {
      let title = 'The Royal Kashmir Gourmet & Heritage Collection'
      let subtitle = 'High-altitude GI Saffron · Mamra Badam · Carved Walnut Casket'
      let tierName = 'Executive Luxury Program'
      let image = '/images/luxury-hamper-jars.png'
      let badge = 'SI TAILORED ARCHITECTURE'
      let packaging = 'Hand-carved Solid Walnut Wood Casket with Brass Insignia'
      let personalization = 'Laser-etched recipient name & hot-foil custom company crest wax seal'
      let contents = [
        'GI Pampore Mongra Saffron (1g Gold Vial)',
        'Hand-Sorted Kashmiri Mamra Badam (200g)',
        'W180 Jumbo Roasted & Salted Cashews (200g)',
        'Wild Himalayan Forest White Honey (150g)',
        'Brass Kahwa Serving Spoon & Keepsake Storybook',
      ]

      let synergies: GiftingProgramResult['ecosystemSynergies'] = []

      // Adapt based on outcome & persona
      if (o === 'wedding_favors' || p === 'wedding_guests') {
        title = 'The Valley Of Chinar Destination Wedding Favor'
        subtitle = 'Kashmiri Saffron Kahwa · Papier-Mâché Bauble · Walnut Keepsake'
        tierName = 'Wedding Favors & Guest Suite Program'
        image = '/images/luxury-teal-gift-box.jpg'
        packaging = 'Teal Chinar Gold-Embossed Rigid Box with Silk Drawstring Pouches'
        personalization = 'Couple monogram in gold foil + individualized guest room delivery tags'
        contents = [
          'Royal Shahi Kahwa Leaf & Spice Blend (150g)',
          'GI-Grade Saffron Strands with Provenance Certificate (1g)',
          'Hand-Painted Kashmiri Papier-Mâché Trinket Keepsake',
          'Salted Pistachios in Shell & Afghan Anjeer (300g)',
        ]
        synergies.push({
          vertical: 'weddings',
          badge: 'Weddings OS Connected',
          title: 'Guest Roster & Suite Distribution',
          description: 'Synchronized with your Nutty Tales Wedding Workspace for hotel room drop allocation.',
          linkText: 'Open Wedding Workspace',
          href: '/weddings/workspace',
        })
        synergies.push({
          vertical: 'stays',
          badge: 'Stays Hospitality',
          title: 'Welcome Amenity Drop',
          description: 'Delivered directly to guest rooms at partner Srinagar & Gulmarg resorts.',
          linkText: 'View Stays Portfolio',
          href: '/stays',
        })
      } else if (o === 'onboard_employee') {
        title = 'The Catalyst Day-1 Wellness & Onboarding Kit'
        subtitle = 'Clean Energy Makhana · California Almonds · Sustainable Desk Accents'
        tierName = 'Enterprise Onboarding OS'
        image = '/images/long-festive-gift-box.jpg'
        packaging = 'FSC-Certified Minimalist Magnetic Matte Box with Custom Sleeve'
        personalization = 'Welcome note signed by Department Head + QR video welcome from CEO'
        contents = [
          'California Jumbo Roasted Lightly Salted Almonds (150g)',
          'Himalayan Pink Salt Crunchy Makhana (60g)',
          'Superseed Trail Mix with Cranberries & Chia (150g)',
          'Kashmir Walnut Wood Phone/Card Stand for Workstation',
        ]
        synergies.push({
          vertical: 'business',
          badge: 'B2B Enterprise',
          title: 'Automated HRIS Trigger',
          description: 'Dispatches automatically when an employee signs offer in BambooHR / Darwinbox.',
          linkText: 'Configure B2B Replenishment',
          href: '/b2b/replenishment',
        })
      } else if (o === 'kashmir_experience') {
        title = 'The Zabarwan Sovereign VIP Immersion'
        subtitle = 'Rare GI Kani Pashmina Touch · Grade-A Saffron · Pure Pine Honey'
        tierName = 'CXO VIP Relationship Casket'
        image = '/images/corporate-diwali-gifting.jpg'
        packaging = 'Antique Polished Walnut Trunk with Inlaid Brass Chinar Inlay'
        personalization = 'Calligraphed personalized parchment letter & executive luggage tag'
        contents = [
          'GI-Certified Miniature Pashmina Pocket Square (Hand-spun)',
          'Pampore Mongra Saffron GI Tagged (2g Collector Box)',
          'Rare Kashmiri Kagzi Soft-Shell Walnuts (250g)',
          'Raw Forest Acacia Honey in Artisan Stone Jar (200g)',
          'Invitation card to Nutty Tales Srinagar Orchard Retreat',
        ]
        synergies.push({
          vertical: 'crafts',
          badge: 'Crafts Provenance',
          title: 'GI Kashmiri Artisan Verification',
          description: 'Each textile & woodwork piece includes QR traceability to the master craftsman in Srinagar.',
          linkText: 'Explore Crafts Studio',
          href: '/crafts',
        })
        synergies.push({
          vertical: 'travel',
          badge: 'Travel Concierge',
          title: 'Kashmir VIP Experience Activation',
          description: 'Pair this gift with private shikara cruises, saffron farm visits, or orchard stays.',
          linkText: 'Explore Kashmir Itineraries',
          href: '/travel',
        })
      } else if (b < 1500) {
        title = 'The Chinar Essence Celebration Box'
        subtitle = 'Optimized Value · Zero Quality Compromise · Multi-City Ready'
        tierName = 'Scale Workforce & Community Program'
        image = '/images/long-festive-gift-box.jpg'
        packaging = 'Rigid 3-Tier Gold-Foil Gift Box with Ribbon Pull'
        personalization = 'Custom company foil logo sleeve & festive greeting'
        contents = [
          'Selected California Almonds (100g)',
          'Crunchy Roasted Whole Cashews (100g)',
          'Kashmiri Golden Raisins (100g)',
          'Roasted Peri-Peri Makhana (50g)',
        ]
      }

      const rationale = `Nutty Tales SI analyzed your intent: ${p.toUpperCase()} audience with goal "${o}". Selected ${v.replace(
        '_',
        ' '
      )} aesthetics at ₹${b.toLocaleString(
        'en-IN'
      )} budget. Configured multi-region distribution nodes with local duty clearance, ${
        enableChoiceLink ? 'enabled Snappy-style recipient choice link,' : 'direct address dispatch,'
      } and interconnected with your corporate tax invoice recovery.`

      setProgramResult({
        title,
        subtitle,
        tierName,
        unitBudgetINR: b,
        unitBudgetUSD: Math.round(b / 83),
        recommendedUnits: count,
        heroImage: image,
        badge,
        boxContents: contents,
        personalization,
        packagingType: packaging,
        regions: [
          {
            name: 'India Domestic',
            code: 'IN',
            flag: '🇮🇳',
            method: 'Bluedart Air / Delhivery Express',
            deliveryDays: '1-3 Business Days',
            dutyStatus: 'Zero Duty / GST Credit',
          },
          {
            name: 'United Arab Emirates',
            code: 'AE',
            flag: '🇦🇪',
            method: 'Dubai Fulfillment Hub (DDP)',
            deliveryDays: '48-72 Hours',
            dutyStatus: 'Pre-cleared Customs (No recipient tax)',
          },
          {
            name: 'United Kingdom & Europe',
            code: 'UK',
            flag: '🇬🇧',
            method: 'London Direct Air Dispatch',
            deliveryDays: '3-5 Business Days',
            dutyStatus: 'HMRC Compliant / VAT Paid',
          },
        ],
        ecosystemSynergies: synergies,
        choiceLinkSupport: enableChoiceLink,
        aiRationale: rationale,
      })

      setIsGenerating(false)
      setStep(5)
    }, 650)
  }

  // Handle Natural Query Submission
  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!naturalQuery.trim()) return

    const lower = naturalQuery.toLowerCase()
    let parsedBudget = unitBudget
    let parsedPersona: RecipientPersona = persona
    let parsedOutcome: GiftingOutcome = outcome
    let parsedVibe: VibeStyle = vibe
    let parsedCount = recipientCount

    // Extract numbers
    const budgetMatch = lower.match(/(?:₹|\$|rs\.?|inr|usd)\s*([0-9,]+)/) || lower.match(/([0-9,]+)\s*(?:rs|rupees|inr|usd|bucks|dollars)/)
    if (budgetMatch) {
      const val = parseInt(budgetMatch[1].replace(/,/g, ''), 10)
      if (lower.includes('$') || lower.includes('usd') || lower.includes('dollar')) {
        parsedBudget = val * 83
      } else {
        parsedBudget = val
      }
      setUnitBudget(parsedBudget)
    }

    const countMatch = lower.match(/([0-9,]+)\s*(?:employees|clients|people|guests|boxes|recipients|units|colleagues)/)
    if (countMatch) {
      parsedCount = parseInt(countMatch[1].replace(/,/g, ''), 10)
      setRecipientCount(parsedCount)
    }

    // Persona parsing
    if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('guest')) {
      parsedPersona = 'wedding_guests'
      parsedOutcome = 'wedding_favors'
      parsedVibe = 'kashmiri_artisan'
    } else if (lower.includes('cxo') || lower.includes('vip') || lower.includes('director') || lower.includes('executive')) {
      parsedPersona = 'vip'
      parsedOutcome = 'thank_client'
      parsedVibe = 'luxury_heritage'
    } else if (lower.includes('employee') || lower.includes('team') || lower.includes('staff')) {
      parsedPersona = 'employee'
      if (lower.includes('diwali') || lower.includes('festive')) {
        parsedOutcome = 'diwali'
      } else if (lower.includes('welcome') || lower.includes('onboard')) {
        parsedOutcome = 'onboard_employee'
      }
    } else if (lower.includes('client') || lower.includes('deal') || lower.includes('partner')) {
      parsedPersona = 'client'
      parsedOutcome = 'thank_client'
    }

    if (lower.includes('kashmir') || lower.includes('walnut') || lower.includes('saffron')) {
      parsedVibe = 'kashmiri_artisan'
    } else if (lower.includes('wellness') || lower.includes('healthy') || lower.includes('organic')) {
      parsedVibe = 'wellness_gourmet'
    }

    setPersona(parsedPersona)
    setOutcome(parsedOutcome)
    setVibe(parsedVibe)
    generateProgram(parsedPersona, parsedOutcome, parsedBudget, parsedVibe, parsedCount)
  }

  // Tweak prompt action
  const applyTweak = (tweakType: 'luxurious' | 'reduce' | 'bulk_rfq' | 'choice_mode') => {
    if (!programResult) return
    if (tweakType === 'luxurious') {
      const newBudget = Math.round(unitBudget * 1.5)
      setUnitBudget(newBudget)
      setVibe('luxury_heritage')
      generateProgram(persona, outcome, newBudget, 'luxury_heritage', recipientCount)
    } else if (tweakType === 'reduce') {
      const newBudget = 1450
      setUnitBudget(newBudget)
      generateProgram(persona, outcome, newBudget, vibe, recipientCount)
    } else if (tweakType === 'bulk_rfq') {
      setRecipientCount(2000)
      generateProgram(persona, outcome, unitBudget, vibe, 2000)
    } else if (tweakType === 'choice_mode') {
      setEnableChoiceLink(true)
      generateProgram(persona, outcome, unitBudget, vibe, recipientCount)
    }
  }

  const copySimulatedChoiceLink = () => {
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const totalCalculatedCost = (programResult ? programResult.unitBudgetINR : unitBudget) * recipientCount
  const gstInputRecoverable = Math.round(totalCalculatedCost * 0.12)

  return (
    <div id="designer" className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
      {/* ── Studio Header ───────────────────────────────────────────────────── */}
      <div className="bg-[#17233B] text-white p-6 sm:p-8 border-b border-[#C9A45C]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40 text-xs font-bold uppercase tracking-wider">
              <span>✨</span> SI GIFT DESIGNER &amp; GLOBAL GIFTING OS
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Design a Gift with Outcome Intelligence
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light">
              Don&apos;t settle for generic gift catalogues. Tell SI who you are gifting, what you want this gift to accomplish, and your budget across India, UAE, and the UK. SI orchestrates bespoke curation, recipient choice links, and enterprise multi-region fulfillment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-right">
              <span className="text-[10px] text-stone-300 block uppercase tracking-wider">Intelligence Mode</span>
              <span className="text-xs font-bold text-[#C9A45C]">Snappy + Reachdesk + Crafts OS</span>
            </div>
          </div>
        </div>

        {/* ── Conversational Natural Language Input Box ──────────────────────── */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <form onSubmit={handleQuerySubmit} className="relative flex items-center">
            <div className="absolute left-4 text-stone-400 text-lg">💬</div>
            <input
              type="text"
              value={naturalQuery}
              onChange={(e) => setNaturalQuery(e.target.value)}
              placeholder="E.g. I need gifts for 300 employees across India, UAE and UK. Budget $75 each. Diwali Indian heritage theme."
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white text-[#17233B] text-xs sm:text-sm placeholder:text-stone-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#C9A45C] shadow-lg"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="absolute right-2 px-5 py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              {isGenerating ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-[#17233B] border-t-transparent animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>DESIGN GIFT</span>
                  <span>✨</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Try Prompts:</span>
            {PRESET_INTENTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 border border-white/10 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Interactive 7-Step Outcome Guided Studio ─────────────────────────── */}
      <div className="p-6 sm:p-10 space-y-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-[#17233B] text-white flex items-center justify-center text-xs font-bold">
              1-4
            </span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#17233B]">
                Define Your Gifting Outcome &amp; Sentiment
              </h3>
              <p className="text-stone-500 text-xs">
                Fine-tune each dimension or let the conversational prompt orchestrate the program below.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">Live Recipient Allocation:</span>
            <span className="font-mono font-bold text-[#704B32] px-2.5 py-1 bg-stone-100 rounded-lg text-xs">
              {recipientCount} Recipients
            </span>
          </div>
        </div>

        {/* 4 Interactive Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1: Who */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider flex items-center gap-1.5">
              <span>👤</span> 1. Who are you gifting?
            </label>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                { id: 'client', label: 'Enterprise Clients / Key Accounts' },
                { id: 'employee', label: 'Company Employees / Team' },
                { id: 'vip', label: 'Board / CXO / High-Value VIP' },
                { id: 'wedding_guests', label: 'Wedding Guests & Delegates' },
                { id: 'partner', label: 'Strategic Channel Partners' },
                { id: 'family_friends', label: 'Family & Friends' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setPersona(opt.id as RecipientPersona)
                    if (programResult) generateProgram(opt.id as RecipientPersona, outcome, unitBudget, vibe, recipientCount)
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    persona === opt.id
                      ? 'border-[#17233B] bg-[#17233B] text-white font-semibold shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: What outcome? */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span> 2. What&apos;s the outcome?
            </label>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                { id: 'thank_client', label: 'Thank My Best Client' },
                { id: 'diwali', label: 'Celebrate Diwali / Festive Season' },
                { id: 'milestone', label: 'Celebrate Partnership / Deal Closed' },
                { id: 'wedding_favors', label: 'Destination Wedding Favors' },
                { id: 'onboard_employee', label: 'Welcome New Team Member' },
                { id: 'kashmir_experience', label: 'Kashmir VIP Valley Immersion' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setOutcome(opt.id as GiftingOutcome)
                    if (programResult) generateProgram(persona, opt.id as GiftingOutcome, unitBudget, vibe, recipientCount)
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    outcome === opt.id
                      ? 'border-[#704B32] bg-[#704B32] text-white font-semibold shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Budget */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider flex items-center gap-1.5">
              <span>💰</span> 3. Target Per-Gift Budget
            </label>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                { budget: 1200, label: '₹1,200 ($15)', sub: 'Community & Scaled Team' },
                { budget: 2500, label: '₹2,500 ($30)', sub: 'Management & Client Festive' },
                { budget: 5000, label: '₹5,000 ($60)', sub: 'Executive / CXO Walnut Box' },
                { budget: 10000, label: '₹10,000 ($120)', sub: 'Ultra-Luxury Valley Casket' },
              ].map((opt) => (
                <button
                  key={opt.budget}
                  type="button"
                  onClick={() => {
                    setUnitBudget(opt.budget)
                    if (programResult) generateProgram(persona, outcome, opt.budget, vibe, recipientCount)
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    unitBudget === opt.budget
                      ? 'border-[#176B68] bg-[#176B68] text-white font-semibold shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <strong className="block">{opt.label}</strong>
                  </div>
                  <span className={`text-[10px] block ${unitBudget === opt.budget ? 'text-emerald-100' : 'text-stone-500'}`}>
                    {opt.sub}
                  </span>
                </button>
              ))}
            </div>

            {/* Recipient Count Slider */}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-600">
                <span>Roster Count:</span>
                <span className="font-mono text-[#17233B]">{recipientCount} Units</span>
              </div>
              <input
                type="range"
                min="25"
                max="2500"
                step="25"
                value={recipientCount}
                onChange={(e) => setRecipientCount(Number(e.target.value))}
                className="w-full accent-[#704B32] cursor-pointer"
              />
            </div>
          </div>

          {/* Step 4: What should it feel like? */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#17233B] uppercase tracking-wider flex items-center gap-1.5">
              <span>🎨</span> 4. Aesthetic &amp; Vibe
            </label>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {[
                { id: 'luxury_heritage', label: '👑 Luxury Heritage & Walnut' },
                { id: 'kashmiri_artisan', label: '🧣 Kashmiri Artisan & GI Crafts' },
                { id: 'wellness_gourmet', label: '🌱 Pure Wellness & Organic' },
                { id: 'sustainable_luxe', label: '♻️ Sustainable Eco-Luxe' },
                { id: 'modern_minimal', label: '⚡ Modern Minimal Corporate' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setVibe(opt.id as VibeStyle)
                    if (programResult) generateProgram(persona, outcome, unitBudget, opt.id as VibeStyle, recipientCount)
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    vibe === opt.id
                      ? 'border-[#C9A45C] bg-[#C9A45C] text-[#17233B] font-bold shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => generateProgram(persona, outcome, unitBudget, vibe, recipientCount)}
              className="w-full mt-3 py-3 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Regenerate Program</span>
              <span>⚡</span>
            </button>
          </div>
        </div>

        {/* ── Generated Gifting Program Showcase ─────────────────────────────── */}
        {programResult && (
          <div className="mt-10 pt-10 border-t border-stone-200 space-y-8 animate-fadeIn">
            {/* Header Result Card */}
            <div className="bg-[#FAF6EE] rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-stone-200">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider">
                      {programResult.badge}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      {programResult.tierName}
                    </span>
                    {programResult.choiceLinkSupport && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">
                        Snappy-Style Choice Link Enabled
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
                    {programResult.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm font-medium">
                    {programResult.subtitle}
                  </p>
                </div>

                {/* Pricing Block */}
                <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm text-right min-w-[240px]">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Total Estimated Investment ({recipientCount} units)
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-[#17233B] mt-0.5">
                    ₹{totalCalculatedCost.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold mt-1">
                    GST 12% Input Credit: ~₹{gstInputRecoverable.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Rationale explanation */}
              <div className="pt-4 text-xs text-stone-600 italic bg-white/70 p-4 rounded-xl border border-stone-200/60 mt-4 flex items-start gap-2.5">
                <span className="text-base text-[#C9A45C]">🧠</span>
                <div>
                  <strong className="text-[#17233B] not-italic block mb-0.5">SI Gifting OS Reasoning:</strong>
                  {programResult.aiRationale}
                </div>
              </div>

              {/* Main Content & Visual Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8">
                {/* Visual Image Preview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-stone-100">
                    <Image
                      src={programResult.heroImage}
                      alt={programResult.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-[#17233B]/90 backdrop-blur-sm text-[#C9A45C] text-[10px] font-bold px-3 py-1 rounded-lg">
                      ₹{programResult.unitBudgetINR.toLocaleString('en-IN')} / Box
                    </div>
                  </div>

                  {/* Packaging & Personalization Details */}
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2 text-xs">
                    <div>
                      <strong className="text-[#17233B] block">Packaging Architecture:</strong>
                      <span className="text-stone-600">{programResult.packagingType}</span>
                    </div>
                    <div>
                      <strong className="text-[#17233B] block">Custom Branding:</strong>
                      <span className="text-stone-600">{programResult.personalization}</span>
                    </div>
                  </div>
                </div>

                {/* Box Ingredients & Specifications */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#704B32] block">
                      Curated Program Components:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {programResult.boxContents.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm flex items-center gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#FAF6EE] text-[#C9A45C] flex items-center justify-center font-bold text-xs flex-shrink-0">
                            ✓
                          </span>
                          <span className="text-[#17233B] font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Region Dispatch Strategy */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#17233B]">
                        Global Multi-Region Fulfillment Mesh:
                      </span>
                      <span className="text-[10px] text-stone-500">Reachdesk/Snappy Parity</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      {programResult.regions.map((reg) => (
                        <div
                          key={reg.code}
                          className="p-3 bg-white rounded-xl border border-stone-200 shadow-sm space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-[#17233B]">
                            <span>{reg.flag} {reg.name}</span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Active</span>
                          </div>
                          <div className="text-[11px] text-stone-600">{reg.method}</div>
                          <div className="text-[10px] text-stone-500">{reg.deliveryDays} · {reg.dutyStatus}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Choice Link Interactive Demo */}
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔗</span>
                        <div>
                          <strong className="text-xs text-purple-950 block">
                            Snappy-Style Recipient Choice Link
                          </strong>
                          <span className="text-[11px] text-purple-700">
                            Lock budget at ₹{programResult.unitBudgetINR.toLocaleString('en-IN')}. Recipient selects items &amp; inputs address privately.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={copySimulatedChoiceLink}
                        className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        {copiedLink ? '✓ Link Copied!' : 'Copy Choice Link'}
                      </button>
                    </div>

                    <div className="text-[11px] bg-white p-2.5 rounded-xl border border-purple-200 font-mono text-purple-900 truncate">
                      https://gifting.nutytales.com/choice/NT-{Math.round(totalCalculatedCost).toString().slice(-4)}?tier={programResult.unitBudgetINR}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-Business Ecosystem Synergies (The Moat!) */}
            {programResult.ecosystemSynergies.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#704B32]">
                    Cross-Ecosystem Synergies (Nutty Tales Unified Moat)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programResult.ecosystemSynergies.map((syn, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-[#FAF7F2] rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider">
                          {syn.badge}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-[#17233B]">
                          {syn.title}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {syn.description}
                        </p>
                      </div>
                      <Link
                        href={syn.href}
                        className="text-xs font-bold text-[#704B32] hover:text-[#17233B] flex items-center gap-1"
                      >
                        <span>{syn.linkText}</span>
                        <span>→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversational Prompt Tweaks */}
            <div className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Iterate With SI Conversational Modifiers:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => applyTweak('luxurious')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>✨</span>
                  <span>Make it more luxurious (+GI Saffron &amp; Walnut)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTweak('reduce')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>📉</span>
                  <span>Optimize under ₹1,500</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTweak('bulk_rfq')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>🏢</span>
                  <span>Need 2,000 units (Enterprise RFQ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTweak('choice_mode')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>🎁</span>
                  <span>Enable Recipient Choice Flow</span>
                </button>
              </div>
            </div>

            {/* Final Execution CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500">
                Ready to execute this program for <strong>{recipientCount} recipients</strong>?
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/gifting/recipients?budget=${programResult.unitBudgetINR}&qty=${recipientCount}&occasion=${outcome}`}
                  className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 hover:scale-[1.02]"
                >
                  <span>⚡</span>
                  <span>Load Into Multi-Recipient Desk</span>
                </Link>

                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nutty Tales Gifting! I designed a program for ${recipientCount} recipients at ₹${programResult.unitBudgetINR} each (${programResult.title}). Please send a formal proforma and sample box.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#17233B] hover:bg-stone-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <span>💬</span>
                  <span>Lock Program via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
