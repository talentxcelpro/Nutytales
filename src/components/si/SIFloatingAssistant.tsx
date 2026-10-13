'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import dynamic from 'next/dynamic'
import { PRODUCTS, Product } from '@/lib/products-data'
import { HealthTargetKey } from '@/components/shop/PrecisionHarvestCommandBar'

const KernelRadarCompareModal = dynamic(
  () => import('@/components/shop/KernelRadarCompareModal'),
  { ssr: false }
)
const BioRationSynthesizerModal = dynamic(
  () => import('@/components/shop/BioRationSynthesizerModal'),
  { ssr: false }
)

interface ChatMessage {
  id: string
  sender: 'si' | 'user'
  text: string
  actions?: { label: string; href?: string; onClick?: () => void }[]
}

const HEALTH_TARGETS: { key: HealthTargetKey; label: string; icon: string; tag: string }[] = [
  { key: 'cognitive', label: 'Brain & Memory', icon: '🧠', tag: 'High Oleic MUFA' },
  { key: 'cardiovascular', label: 'Cardio & Heart', icon: '❤️', tag: 'Omega-3 ALA' },
  { key: 'metabolic', label: 'Metabolic Low-GI', icon: '⚡', tag: 'Diabetic Safe' },
  { key: 'seniorLongevity', label: 'Senior Vitality', icon: '👵', tag: 'Bone & Joints' },
  { key: 'activeAthletic', label: 'Plant Protein & ATP', icon: '🏋️', tag: 'Pre/Post Workout' },
  { key: 'ayurvedicRasayana', label: 'Ayurvedic Rasayana', icon: '🕉️', tag: 'Ojas Building' },
]

export default function SIFloatingAssistant() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Modals for Precision Harvest OS (Accessible site-wide via SI)
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false)
  const [isRadarOpen, setIsRadarOpen] = useState(false)
  const [comparedProducts, setComparedProducts] = useState<Product[]>([])

  const isShopRoute =
    pathname.startsWith('/shop') ||
    pathname === '/' ||
    pathname.startsWith('/makhana')

  // Context-aware prompt suggestions based on pathname
  const contextData = getContextualPrompts(pathname)

  // Listen to cross-component window events
  useEffect(() => {
    const handleOpenSynth = () => setIsSynthesizerOpen(true)
    const handleOpenRadar = (e: any) => {
      if (e.detail?.slugA && e.detail?.slugB) {
        const prodA = PRODUCTS.find((p) => p.slug === e.detail.slugA)
        const prodB = PRODUCTS.find((p) => p.slug === e.detail.slugB)
        if (prodA && prodB) setComparedProducts([prodA, prodB])
      }
      setIsRadarOpen(true)
    }
    const handleOpenSI = (e: any) => {
      setIsOpen(true)
      if (e.detail?.query) {
        handleSendMessage(e.detail.query)
      }
    }

    window.addEventListener('nt_open_synthesizer', handleOpenSynth)
    window.addEventListener('nt_open_radar', handleOpenRadar)
    window.addEventListener('nt_open_si', handleOpenSI)

    return () => {
      window.removeEventListener('nt_open_synthesizer', handleOpenSynth)
      window.removeEventListener('nt_open_radar', handleOpenRadar)
      window.removeEventListener('nt_open_si', handleOpenSI)
    }
  }, [])

  // Initialize welcome message when page changes
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome-' + pathname,
      sender: 'si',
      text: contextData.greeting,
      actions: contextData.actions,
    }
    setMessages([welcomeMsg])
  }, [pathname])

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim()
    if (!query) return

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')

    // Generate intelligent contextual response
    setTimeout(() => {
      const response = generateSIResponse(
        query,
        pathname,
        () => setIsSynthesizerOpen(true),
        () => setIsRadarOpen(true)
      )
      setMessages((prev) => [...prev, response])
    }, 450)
  }

  // Fast trigger for health targets in SI
  const handleSelectHealthTargetInSI = (target: HealthTargetKey, label: string) => {
    // Notify shop catalog if on shop page
    window.dispatchEvent(
      new CustomEvent('nt_set_health_target', { detail: { target } })
    )

    handleSendMessage(`Bio-Nutritional scientific guidance for ${label}`)
  }

  const handleRemoveFromCompare = (slug: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.slug !== slug))
  }

  const handleSelectPresetComparison = (slugA: string, slugB: string) => {
    const prodA = PRODUCTS.find((p) => p.slug === slugA)
    const prodB = PRODUCTS.find((p) => p.slug === slugB)
    if (prodA && prodB) {
      setComparedProducts([prodA, prodB])
    }
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <>
      {/* ── Floating Launcher Button (With Precision Harvest Pulse) ───────────── */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center group">
        {/* Subtle hover tooltip */}
        <div className="hidden sm:block absolute right-14 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#17233B] text-white text-[11px] font-medium px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl border border-white/10 backdrop-blur-md">
          {isShopRoute ? '✦ Ask AI Sommelier & Synthesizer' : 'Ask SI Assistant'}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open SI Concierge Assistant"
          title="Ask SI Assistant"
          className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#17233B] hover:bg-[#10192B] text-white flex items-center justify-center shadow-2xl border-2 border-[#C9A45C] transition-all hover:scale-105 active:scale-95 group"
        >
          {/* Subtle Ring Glow on Shop */}
          {isShopRoute && !isOpen && (
            <span className="absolute -inset-1 rounded-full bg-[#C9A45C]/30 animate-ping pointer-events-none" />
          )}

          <span className="text-lg group-hover:rotate-12 transition-transform">
            {isOpen ? '✕' : '✨'}
          </span>
        </button>
      </div>

      {/* ── Chat Drawer Modal ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-20 right-3 sm:right-6 z-40 w-[94vw] sm:w-[440px] max-h-[660px] h-[84vh] bg-[#FAF6EE] text-[#17233B] rounded-3xl shadow-2xl border border-[#C9A45C]/50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#17233B] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#176B68] to-[#C9A45C] flex items-center justify-center text-base font-bold shadow-inner">
                {contextData.badgeIcon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm">{contextData.assistantName}</h3>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#C9A45C] text-[#17233B]">
                    Specialized AI
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 font-light">
                  {contextData.tagline}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* ── Precision Harvest OS Interactive Tool Dock (Embedded in SI) ──────── */}
          {isShopRoute && (
            <div className="bg-[#10192B] text-white p-3.5 border-b border-white/10 space-y-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-wider uppercase text-[#C9A45C] font-bold">
                    PRECISION HARVEST OS
                  </span>
                </div>
                <span className="text-[9px] text-stone-400 font-mono">
                  FSSAI 22724441000048
                </span>
              </div>

              {/* Quick Actions (Synthesizer & Radar) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsSynthesizerOpen(true)}
                  className="px-2.5 py-2 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E5C882] text-[#17233B] font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span>🧪</span>
                  <span>Daily 30g Synthesizer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRadarOpen(true)}
                  className="px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span>⚖️</span>
                  <span>Kernel Radar</span>
                </button>
              </div>

              {/* Biological Health Targets Strip */}
              <div className="space-y-1 pt-1 border-t border-white/10">
                <span className="text-[9px] font-mono uppercase text-stone-400 block tracking-wider">
                  Targeted Nutrition Guidance:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5 text-[10px]">
                  {HEALTH_TARGETS.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => handleSelectHealthTargetInSI(t.key, t.label)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-stone-200 whitespace-nowrap transition-colors flex items-center gap-1"
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#17233B] text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Optional Action Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.actions.map((act, i) =>
                      act.href ? (
                        <Link
                          key={i}
                          href={act.href}
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#C9A45C] text-[#17233B] text-[11px] font-bold hover:bg-[#C9A45C] hover:text-[#17233B] transition-colors shadow-xs"
                        >
                          {act.label} →
                        </Link>
                      ) : (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (act.onClick) {
                              act.onClick()
                            } else {
                              handleSendMessage(act.label)
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FAF5ED] hover:bg-[#17233B] hover:text-white text-[#17233B] text-[11px] font-semibold border border-[#EAE3D5] transition-colors"
                        >
                          {act.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Queries Strip */}
          <div className="px-4 py-2 bg-stone-100 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-bold uppercase text-[#704B32] whitespace-nowrap">
              Quick:
            </span>
            {contextData.quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-white text-stone-700 border border-stone-200 whitespace-nowrap hover:border-[#176B68] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={contextData.inputPlaceholder}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              Ask
            </button>
          </form>

          {/* WhatsApp Fallback Strip */}
          <div className="bg-[#FAF6EE] px-4 py-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
            <span>Direct human concierge always available</span>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>WhatsApp Us (+91 9717161809)</span>
              <span>→</span>
            </a>
          </div>
        </div>
      )}

      {/* ── Global Modals Managed Site-Wide via SI ── */}
      <KernelRadarCompareModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        comparedProducts={comparedProducts}
        allProducts={PRODUCTS}
        onRemoveFromCompare={handleRemoveFromCompare}
        onSelectPresetComparison={handleSelectPresetComparison}
      />

      <BioRationSynthesizerModal
        isOpen={isSynthesizerOpen}
        onClose={() => setIsSynthesizerOpen(false)}
      />
    </>
  )
}

// ─── Helpers: Contextual Prompts & AI Decision Engine ──────────────────────────
function getContextualPrompts(pathname: string) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const isNri = pathname.startsWith('/nri') || hostname.startsWith('nri.') || hostname.includes('nri')

  // ── Product: Nuty Tales NRI ───────────────────────────────────────────────
  if (isNri) {
    return {
      assistantName: 'SI India Execution Copilot',
      badgeIcon: '🇮🇳',
      tagline: 'Your trusted intelligence & execution team in India',
      pillText: 'Need something handled in India?',
      inputPlaceholder: 'Tell SI what you need done in India...',
      greeting:
        'Welcome to Nuty Tales NRI. India, handled. From anywhere in the world.\n\nTell me what you need done for your family, property, healthcare, documents, or travel in India.',
      actions: [
        { label: '⚡ Get Something Done', href: '/nri#request-engine' },
        { label: '🏛️ My India Dashboard', href: '/nri/dashboard' },
        { label: '🚨 Emergency Assistance', href: '/nri/emergency' },
      ],
      quickPrompts: [
        'Inspect parents’ house in Srinagar',
        'Doctor appointment for father in Delhi',
        'Property tax & POA assistance',
      ],
    }
  }

  // ── Product: Nuty Tales Business ──────────────────────────────────────────
  if (pathname.startsWith('/b2b') || pathname.startsWith('/business-supply')) {
    return {
      assistantName: 'SI Procurement Copilot',
      badgeIcon: '🏢',
      tagline: 'Global B2B Sourcing & Commodity Procurement Desk',
      pillText: 'Need bulk sourcing or RFQ quotes?',
      inputPlaceholder: 'Tell SI what you need to source...',
      greeting:
        'Welcome to Nuty Tales Business. I am your B2B Procurement Copilot. Tell me what commodity or ingredient you need to source.',
      actions: [
        { label: 'Create Instant RFQ', href: '/b2b/rfq' },
        { label: 'Wholesale Catalog', href: '/b2b/catalog' },
      ],
      quickPrompts: [
        'Quote 5,000 kg Mamra Badam',
        'Bakery almond slices 0.8mm',
        'FSSAI & NABL lab reports',
      ],
    }
  }

  // ── Product: Nuty Tales Gifting ───────────────────────────────────────────
  if (pathname.startsWith('/gifting') || pathname.startsWith('/corporate-gifting')) {
    return {
      assistantName: 'SI Gift Designer & Gifting OS',
      badgeIcon: '🎁',
      tagline: 'Outcome-Based Gifting, Choice Links & Global Fulfillment',
      pillText: 'Need corporate or bulk gifting advice?',
      inputPlaceholder: 'Tell SI what you want this gift to accomplish...',
      greeting:
        'Welcome to Nuty Tales Gifting. I curate outcome-based programs, recipient choice links, and PAN-India corporate hampers.',
      actions: [
        { label: '✨ Design a Gift (SI Studio)', href: '/gifting/designer' },
        { label: '🔗 Recipient Choice Desk', href: '/gifting/recipients' },
      ],
      quickPrompts: [
        '300 employees in India, UAE & UK ($75)',
        'Thank best CXO client (₹5,000)',
      ],
    }
  }

  // ── Product: Nuty Tales Weddings ──────────────────────────────────────────
  if (pathname.startsWith('/weddings')) {
    return {
      assistantName: 'SI Wedding Planner',
      badgeIcon: '💍',
      tagline: 'The Wedding Operating System & Execution Concierge',
      pillText: 'Need wedding favors or planning advice?',
      inputPlaceholder: "Tell SI how you're planning your wedding...",
      greeting:
        'Welcome to Nuty Tales Weddings. I help you plan budgets, orchestrate guest favors, and generate multi-day timelines.',
      actions: [
        { label: 'Launch Wedding Workspace', href: '/weddings/workspace' },
        { label: 'Wedding Favors & Hampers', href: '/weddings' },
      ],
      quickPrompts: [
        'Budget split for ₹25 Lakhs',
        '300 Mehendi return gifts',
      ],
    }
  }

  // ── Product: Nuty Tales Crafts ────────────────────────────────────────────
  if (pathname.startsWith('/crafts')) {
    return {
      assistantName: 'SI Style & Craft Advisor',
      badgeIcon: '🧣',
      tagline: 'Global Luxury Weaves, Virtual Drape & Provenance',
      pillText: 'Need drape simulation or weave advice?',
      inputPlaceholder: 'Tell SI what you want to wear or discover...',
      greeting:
        'Welcome to Nuty Tales Crafts. I verify GI-tag authenticity and simulate drape folds in the Virtual Studio.',
      actions: [
        { label: 'Try with SI (Drape Studio)', href: '/crafts/try-with-si' },
        { label: 'B2B Wholesale Weaves', href: '/crafts/wholesale' },
      ],
      quickPrompts: [
        'Simulate drape on my height',
        'Verify GI Pashmina certificate',
      ],
    }
  }

  // ── Product: Nuty Tales Shop (Default) ───────────────────────────────────
  return {
    assistantName: 'SI Harvest Sommelier & Bio-Engine',
    badgeIcon: '✦',
    tagline: 'Precision Harvest OS · NABL Lab Certified',
    pillText: 'Need scientific harvest or bio-target advice?',
    inputPlaceholder: "Ask AI Sommelier: 'High oleic nuts for memory', 'Mamra vs California'...",
    greeting:
      'Welcome to Precision Harvest OS. I am SI, your gourmet harvest and bio-nutritional sommelier.\n\nI can compare batch lab telemetry, formulate your Daily 30g Micro-Ration, or explain why Himalayan unpasteurized harvests deliver superior bioactive lipids.',
    actions: [
      { label: '🧠 Kids Memory & Brain Badam' },
      { label: '⚖️ Compare Mamra vs California' },
      { label: '⚡ Low GI Diabetic Makhana' },
      { label: '🌸 Pure Grade-1 Mongra Saffron' },
    ],
    quickPrompts: [
      'Compare Mamra vs California',
      'Kids memory & soaking badam',
      'Heart health & Kagzi walnuts',
      'Daily 30g micro-ration box',
    ],
  }
}

function generateSIResponse(
  query: string,
  pathname: string,
  onOpenSynthesizer?: () => void,
  onOpenRadar?: () => void
): ChatMessage {
  const q = query.toLowerCase()

  // ── 1. Mamra vs California / Why Expensive Comparison ───────────────────────
  if (
    q.includes('mamra vs') ||
    q.includes('california') ||
    q.includes('why expensive') ||
    q.includes('why pay') ||
    q.includes('difference') ||
    q.includes('compare')
  ) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `⚖️ **Scientific Benchmark: Kashmiri Mamra vs California Almonds**

• **Essential Oil Divide**: NABL tests show Kashmiri Mamra yields **52.8% cold-pressed oleic acid** vs 40.5% in commercial California Nonpareil (2.7× more bioactive lipids).
• **Pasteurization**: California almonds undergo mandatory steam pasteurization or PPO chemical treatment. Nuty Tales Mamra is **100% Raw Unpasteurized**, shade-cured in cold Himalayan air.
• **Pedigree**: Single-tree wild mountain seedling with natural concave kernel dip and rich crunch—never flat or hybrid.`,
      actions: [
        { label: '⚖️ Open Kernel Radar Comparator', onClick: onOpenRadar },
        { label: 'View Kashmiri Mamra', href: '/shop?category=almonds' },
      ],
    }
  }

  // ── 2. Brain & Cognitive Memory ─────────────────────────────────────────────
  if (
    q.includes('memory') ||
    q.includes('brain') ||
    q.includes('cognitive') ||
    q.includes('student') ||
    q.includes('soak')
  ) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `🧠 **Cognitive & Memory Telemetry (Neuro-Protection)**:

• **Kashmiri Mamra Almonds**: Delivers 52.8% cold-pressed oleic acid and natural alpha-tocopherol (Vit E) to protect acetylcholine precursors and neural synapses.
• **Snow-White Kagzi Walnuts**: Industry-leading 9.1g/100g plant Omega-3 ALA for cerebral blood flow.
• **Connoisseur Morning Ritual**: Soak 5 Mamra almonds overnight in pure water, peel the skin at dawn, and consume with a spoonful of raw Acacia honey for sustained executive focus.`,
      actions: [
        { label: '🧪 Formulate Brain 30g Dose', onClick: onOpenSynthesizer },
        { label: 'View Kashmiri Mamra', href: '/shop?category=almonds' },
        { label: 'View Kagzi Walnuts', href: '/shop?category=walnuts' },
      ],
    }
  }

  // ── 3. Cardio & Heart Health ────────────────────────────────────────────────
  if (
    q.includes('heart') ||
    q.includes('cardio') ||
    q.includes('cholesterol') ||
    q.includes('lipid') ||
    q.includes('arterial')
  ) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `❤️ **Cardiovascular & Arterial Elasticity Telemetry**:

• **Snow-White Kashmiri Walnuts**: 64.2% natural unoxidized oil. Zero chlorine or sulfur bleaching ensures the fragile pellicle retains 100% of its protective ellagitannins.
• **California Jumbo Pistachios**: High natural L-arginine, a key precursor to nitric oxide that promotes vascular dilation.
• **Mithila Makhana**: Ultra-low sodium and bioavailable magnesium for cardiovascular rhythm.`,
      actions: [
        { label: '🧪 Formulate Cardio 30g Dose', onClick: onOpenSynthesizer },
        { label: 'View Kashmiri Walnuts', href: '/shop?category=walnuts' },
      ],
    }
  }

  // ── 4. Diabetic & Low GI Metabolic ──────────────────────────────────────────
  if (
    q.includes('diabetic') ||
    q.includes('diabetes') ||
    q.includes('low gi') ||
    q.includes('glycemic') ||
    q.includes('sugar') ||
    q.includes('makhana')
  ) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `⚡ **Metabolic & Low-GI Telemetry (Diabetic Safe)**:

• **Mithila 7-Suta Jumbo Makhana**: Certified Glycemic Index of only 38 (Low GI) with Kaempferol flavonoids. 22mm+ unbroken popped lotus seeds with zero black husk crumbs.
• **Raw Mamra Almonds**: Ultra-low GI of 12. Consuming 5–8 nuts prior to meals dampens postprandial glucose spikes by slowing carbohydrate absorption.`,
      actions: [
        { label: '🧪 Formulate Low-GI Ration', onClick: onOpenSynthesizer },
        { label: 'View Jumbo Makhana', href: '/shop?category=makhana' },
      ],
    }
  }

  // ── 5. Synthesizer / Daily Micro-Ration ──────────────────────────────────────
  if (
    q.includes('synthesizer') ||
    q.includes('ration') ||
    q.includes('30g') ||
    q.includes('vault') ||
    q.includes('dose') ||
    q.includes('daily')
  ) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `🧪 **Daily 30g Micro-Ration Synthesizer**:

Stop buying oxidized bulk sacks. Engineer your exact personalized daily dose:
• Calibrate Mamra, Kagzi Walnuts, Jumbo Makhana, Turkish Figs & Pistachios.
• Sealed in 30 individual **99.8% food-grade nitrogen-flushed daily sachets**.
• Zero oxygen, zero moisture rancidity, guaranteed fresh for each morning.
• Costs approx ₹45–₹65/day (less than a cafe coffee).`,
      actions: [
        { label: '🧪 Launch 30g Synthesizer Now', onClick: onOpenSynthesizer },
      ],
    }
  }

  // ── 6. Saffron Mongra Grade-1 ───────────────────────────────────────────────
  if (
    q.includes('saffron') ||
    q.includes('kesar') ||
    q.includes('mongra') ||
    q.includes('crocin') ||
    q.includes('purity')
  ) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `🌸 **Kashmir Mongra Saffron (ISO 3632 Category-1)**:

• **Crocin Color Score**: > 240 units (Standard commercial saffron averages 130–160).
• **100% Stigma-Only**: Zero yellow style threads. Certified under GI Tag 535 and FSSAI 22724441000048.
• **Authentic Infusion Test**: Pure Mongra releases a delicate golden-crimson hue slowly over 20 minutes without floating dye bleeding artificially into warm water.`,
      actions: [
        { label: 'View Grade-1 Saffron', href: '/shop?category=saffron' },
        { label: '⚖️ Compare in Radar', onClick: onOpenRadar },
      ],
    }
  }

  // ── 7. Walnuts / Akhrot ──────────────────────────────────────────────────────
  if (q.includes('walnut') || q.includes('akhrot') || q.includes('kagzi')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `Our Kashmir Kagzi Walnuts are hand-cracked fresh from Kupwara and Shopian high-altitude organic orchards. Soft-shell (Kagzi) can be cracked with thumb pressure, yielding snow-white halves with 64.2% bioactive Omega-3 ALA oil and zero bleaching.`,
      actions: [
        { label: 'View Walnut Selection', href: '/shop?category=walnuts' },
        { label: '⚖️ Compare in Radar', onClick: onOpenRadar },
      ],
    }
  }

  // ── 8. FSSAI / NABL Lab Certifications ──────────────────────────────────────
  if (q.includes('fssai') || q.includes('license') || q.includes('lab') || q.includes('nabl') || q.includes('cert')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: `🛡️ **Official Certification & Quality Infrastructure**:

• **FSSAI Registration**: 22724441000048 (Nuty Tales Foods & Crafts, a subsidiary of Nexgenn Services).
• **Registered HQ**: Sector 128, Noida, Uttar Pradesh 201304.
• **Himalayan Procurement Hub**: Arshid House, Budgam-Gojra Road, Dadna, Budgam, J&K 191111.
• **Makhana Aggregation**: Nafis Colony, Patna, Bihar 800004.
• **Nitrogen Packaging**: 99.8% food-grade oxygen evacuation under cold-room protocols.`,
      actions: [
        { label: 'View Lab Telemetry in Radar', onClick: onOpenRadar },
        { label: 'Browse Food Collections', href: '/shop' },
      ],
    }
  }

  // Default fallback
  return {
    id: 'resp-' + Date.now(),
    sender: 'si',
    text: `I've noted: "${query}". I am SI, your gourmet harvest and bio-nutritional sommelier. Would you like me to analyze lab metrics, synthesize a 30-day daily micro-dose, or compare specific harvests?`,
    actions: [
      { label: '🧪 Open 30g Synthesizer', onClick: onOpenSynthesizer },
      { label: '⚖️ Open Kernel Radar', onClick: onOpenRadar },
      { label: 'Browse Food Collections', href: '/shop' },
    ],
  }
}
