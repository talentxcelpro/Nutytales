'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

interface ChatMessage {
  id: string
  sender: 'si' | 'user'
  text: string
  actions?: { label: string; href?: string; onClick?: () => void }[]
}

export default function SIFloatingAssistant() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Context-aware prompt suggestions based on pathname
  const contextData = getContextualPrompts(pathname)

  // Initialize or update welcome message when page changes
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

    setHasInteracted(true)
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')

    // Generate intelligent contextual response
    setTimeout(() => {
      const response = generateSIResponse(query, pathname)
      setMessages((prev) => [...prev, response])
    }, 600)
  }

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  return (
    <>
      {/* ── Floating Launcher Button ────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && !hasInteracted && (
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hidden sm:flex items-center gap-2 bg-[#17233B]/95 text-white px-3.5 py-2 rounded-2xl shadow-xl border border-[#C9A45C]/40 text-xs animate-fadeIn hover:bg-[#17233B]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-serif italic text-stone-200">
              Need styling, wedding or B2B advice?
            </span>
            <span className="font-bold text-[#C9A45C]">Ask SI ✨</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open SI Concierge Assistant"
          className="relative w-14 h-14 rounded-full bg-[#17233B] hover:bg-[#176B68] text-white flex items-center justify-center shadow-2xl border-2 border-[#C9A45C] transition-all hover:scale-105 group"
        >
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C9A45C] rounded-full border-2 border-[#17233B] animate-ping" />
          <span className="text-xl group-hover:rotate-12 transition-transform">
            {isOpen ? '✕' : '✨'}
          </span>
        </button>
      </div>

      {/* ── Chat Drawer Modal ───────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[94vw] sm:w-[420px] max-h-[600px] h-[80vh] bg-[#FAF6EE] text-[#17233B] rounded-3xl shadow-2xl border border-[#C9A45C]/50 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#17233B] text-white px-5 py-4 flex items-center justify-between border-b border-white/10">
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

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
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
                          onClick={() => handleSendMessage(act.label)}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#176B68] hover:text-white text-stone-700 text-[11px] font-semibold border border-stone-200 transition-colors"
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
    </>
  )
}

// ─── Helpers: Contextual Prompts & AI Decision Engine ──────────────────────────
// ─── Helpers: Contextual Prompts & AI Decision Engine ──────────────────────────
function getContextualPrompts(pathname: string) {
  // ── Company 1: Nutty Tales Business (business.nutytales.com / /b2b) ─────────
  if (pathname.startsWith('/b2b') || pathname.startsWith('/business-supply')) {
    return {
      assistantName: 'SI Procurement Copilot',
      badgeIcon: '🏢',
      tagline: 'Global B2B Sourcing & Commodity Procurement Desk',
      inputPlaceholder: 'Tell SI what you need to source (e.g. 5,000 kg almonds monthly)...',
      greeting:
        'Welcome to Nutty Tales Business. I am your B2B Procurement Copilot. Tell me what commodity or ingredient you need to source, your monthly volume, or grade specifications, and I will match verified suppliers with formal quotes.',
      actions: [
        { label: 'Create Instant RFQ', href: '/b2b/rfq' },
        { label: 'Wholesale Catalog', href: '/b2b/catalog' },
        { label: 'Commercial Dashboard', href: '/b2b/dashboard' },
      ],
      quickPrompts: [
        'Quote 5,000 kg Mamra Badam',
        'Bakery almond slices 0.8mm',
        'FSSAI & NABL lab reports',
        'Standing replenishment agreement',
      ],
    }
  }

  // ── Company 2: Nutty Tales Gifting (gifting.nutytales.com / /gifting) ───────
  if (pathname.startsWith('/gifting') || pathname.startsWith('/corporate-gifting')) {
    return {
      assistantName: 'SI Corporate Gifting Copilot',
      badgeIcon: '🎁',
      tagline: 'End-to-End Multi-Recipient Corporate & Festival Gifting',
      inputPlaceholder: "Tell SI who you're gifting (e.g. 250 executive clients for Diwali)...",
      greeting:
        'Welcome to Nutty Tales Gifting. I am your Corporate Gifting Copilot. Whether you need 50 executive hampers with laser-engraved wooden boxes or 2,000 multi-city employee gifts, tell me your budget and recipient count.',
      actions: [
        { label: 'Multi-Recipient Desk', href: '/gifting/recipients' },
        { label: 'Curate Bespoke Hamper', href: '/gifting' },
        { label: 'Gifting Dashboard', href: '/gifting/dashboard' },
      ],
      quickPrompts: [
        'Hampers under ₹1,500 for Diwali',
        'Upload 200 recipient addresses',
        'Custom corporate foil branding',
        'PAN-India multi-office dispatch',
      ],
    }
  }

  // ── Company 3: Nutty Tales Weddings (weddings.nutytales.com / /weddings) ─────
  if (pathname.startsWith('/weddings')) {
    return {
      assistantName: 'SI Wedding Planner',
      badgeIcon: '💍',
      tagline: 'The Wedding Operating System & Execution Concierge',
      inputPlaceholder: "Tell SI how you're planning your wedding (e.g. 400 guests destination in Kashmir)...",
      greeting:
        'Welcome to Nutty Tales Weddings. I am your Wedding Planner Copilot. I help you plan budgets, orchestrate vendor RFQs (venues, decorators, photography), calculate guest favors, and generate multi-day timelines.',
      actions: [
        { label: 'Launch Wedding Workspace', href: '/weddings/workspace' },
        { label: 'Wedding Favors & Hampers', href: '/weddings/favors' },
        { label: 'Planner Dashboard', href: '/weddings/dashboard' },
      ],
      quickPrompts: [
        'Budget split for ₹25 Lakhs',
        'Destination Kashmir venues',
        '300 Mehendi return gifts',
        'Multi-day event countdown',
      ],
    }
  }

  // ── Company 4: Nutty Tales Crafts (crafts.nutytales.com / /crafts) ───────────
  if (pathname.startsWith('/crafts')) {
    return {
      assistantName: 'SI Style & Craft Advisor',
      badgeIcon: '🧣',
      tagline: 'Global Luxury Weaves, Virtual Drape & Provenance',
      inputPlaceholder: 'Tell SI what you want to wear or discover (e.g. GI Kani Pashmina for winter)...',
      greeting:
        'Welcome to Nutty Tales Crafts. I am your Style & Provenance Advisor. I verify GI-tag authenticity, simulate drape folds in the Virtual Studio, and assist boutique buyers with wholesale craft procurement.',
      actions: [
        { label: 'Try with SI (Drape Studio)', href: '/crafts/try-with-si' },
        { label: 'B2B Wholesale Weaves', href: '/crafts/wholesale' },
        { label: 'Artisan Dashboard', href: '/crafts/dashboard' },
      ],
      quickPrompts: [
        'Simulate drape on my height',
        'Verify GI Pashmina certificate',
        'Wholesale quote for 100 shawls',
        'Sub-zero warmth pheran',
      ],
    }
  }

  // ── Company 5: Nutty Tales Stays (stays.nutytales.com / /stays) ─────────────
  if (pathname.startsWith('/stays')) {
    return {
      assistantName: 'SI Stay Concierge',
      badgeIcon: '🏔️',
      tagline: 'Hospitality, Orchard Suites & Valley Experiences',
      inputPlaceholder: 'Tell SI how you want to stay (e.g. 3 nights Srinagar orchard villa with kahwa)...',
      greeting:
        'Welcome to Nutty Tales Stays. I am your Hospitality Concierge. I calculate live seasonal tariffs, orchestrate private orchard buyouts for VIP delegations, and coordinate local culinary experiences.',
      actions: [
        { label: 'Reserve Orchard Suite', href: '/stays#booking-engine' },
        { label: 'Private Buyout & Groups', href: '/stays/group-quote' },
        { label: 'Host Dashboard', href: '/stays/dashboard' },
      ],
      quickPrompts: [
        'Harwan Srinagar orchard suite',
        'Peak snow season tariff',
        'Private property buyout quote',
        'Airport transfer & shikara',
      ],
    }
  }

  // ── Company 6: Nutty Tales Travel (travel.nutytales.com / /travel) ───────────
  if (pathname.startsWith('/travel')) {
    return {
      assistantName: 'SI Travel Planner',
      badgeIcon: '✈️',
      tagline: 'Dynamic Itineraries, 4x4 Snow Safaris & Expeditions',
      inputPlaceholder: 'Tell SI where you want to go (e.g. 7-day family Kashmir winter expedition)...',
      greeting:
        'Welcome to Nutty Tales Travel. I am your Travel Planner Copilot. Tell me your travel dates, group size, and interests, and I will build an hour-by-hour itinerary with vetted drivers, stays, and activities.',
      actions: [
        { label: 'Build My Trip', href: '/travel/builder' },
        { label: 'Explore Kashmir Packages', href: '/travel/kashmir' },
        { label: 'Operator Dashboard', href: '/travel/dashboard' },
      ],
      quickPrompts: [
        '7-day family winter itinerary',
        'Gulmarg Gondola & ski guide',
        'Private 4x4 vehicle with driver',
        'International corridor packages',
      ],
    }
  }

  // ── Default / Group Gateway (nutytales.com) ─────────────────────────────────
  return {
    assistantName: 'SI Group Intelligence',
    badgeIcon: '✦',
    tagline: 'Nutty Tales Group Flagship Ecosystem',
    inputPlaceholder: 'Ask SI anything across the 6 operating companies...',
    greeting:
      'Hello! I am SI, the shared intelligence platform of Nutty Tales Group. I connect our 6 independent global companies: B2B Business, Corporate Gifting, Weddings OS, Crafts Marketplace, Hospitality Stays, and Travel Planning.',
    actions: [
      { label: 'Shop Harvest Retail', href: '/shop' },
      { label: 'B2B Business Supply', href: '/b2b' },
      { label: 'Corporate Gifting', href: '/gifting' },
      { label: 'Wedding Workspace', href: '/weddings' },
    ],
    quickPrompts: [
      'Pure Kashmiri Mamra Badam',
      'Corporate festival gift hampers',
      'Orchard villa stay in Srinagar',
      'B2B wholesale pricing',
    ],
  }
}

function generateSIResponse(query: string, pathname: string): ChatMessage {
  const q = query.toLowerCase()

  if (q.includes('drape') || q.includes('try') || q.includes('look') || q.includes('wear')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: 'Our Try with SI studio allows you to upload your portrait or choose an avatar model to see exact drape folds, Tilla embroidery shimmer, and styling pairing recommendations!',
      actions: [{ label: 'Open Try with SI Studio', href: '/crafts/try-with-si' }],
    }
  }

  if (q.includes('gi') || q.includes('certif') || q.includes('authentic') || q.includes('fake')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: 'Every Kashmir Pashmina, Kani shawl, and Papier-Mâché piece carries a unique official J&K Handicrafts GI QR-code tag with artisan cooperative tracing and microscopic purity verification.',
      actions: [{ label: 'Explore Certified Crafts', href: '/crafts/kashmir' }],
    }
  }

  if (q.includes('wedding') || q.includes('card') || q.includes('monogram') || q.includes('hamper')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: 'For weddings, we offer our 6-step configurator: Occasion, Budget Tier (₹500 to ₹5,000+), Contents, Packaging (Rigid, Wood, Potli), Monogram foil stamping, and Multi-City PAN-India dispatch.',
      actions: [{ label: 'Design Your Wedding Hamper', href: '/weddings' }],
    }
  }

  if (q.includes('founder') || q.includes('startup') || q.includes('private label') || q.includes('d2c') || q.includes('moq')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: 'The Nuty Tales Founder Program provides complete commercial infrastructure for startups: bulk ingredient sourcing at origin rates, small starter MOQs, turnkey private-label pouching, travel inventory access, and multi-hub fulfilment across Noida, Patna & Kashmir.',
      actions: [
        { label: 'Run SI Founder Blueprint', href: '/founders#copilot' },
        { label: 'Apply for Founder Program', href: '/founders#apply' },
      ],
    }
  }

  if (q.includes('b2b') || q.includes('wholesale') || q.includes('bakery') || q.includes('slice') || q.includes('rfq')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: 'We supply premium grades to five-star hotel chains, industrial bakeries, and mithai manufacturers with custom cut specs (0.8–1.2mm sliced, diced, nut meal) in 25kg vacuum-sealed packs.',
      actions: [{ label: 'Open B2B Supply Portal', href: '/business-supply' }],
    }
  }

  if (q.includes('snow') || q.includes('stay') || q.includes('hotel') || q.includes('srinagar')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'si',
      text: 'Our flagship Srinagar property is nestled in a private 4-acre walnut orchard in Harwan. Featuring traditional wood-burning Bukharis, under-floor heating, and direct views of the Zabarwan range.',
      actions: [
        { label: 'Check Stay Availability', href: '/stays' },
        { label: 'Explore Kashmir Tours', href: '/travel/kashmir' },
      ],
    }
  }

  return {
    id: 'resp-' + Date.now(),
    sender: 'si',
    text: `I've noted: "${query}". Nuty Tales connects wholesome dry fruit nutrition, artisan Kashmir crafts, and bespoke boutique stays. How else may I assist you today?`,
    actions: [
      { label: 'Browse Food Collections', href: '/shop' },
      { label: 'Explore Kashmir Crafts', href: '/crafts' },
    ],
  }
}
