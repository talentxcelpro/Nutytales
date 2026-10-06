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
                ✨
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-bold text-sm">SI Assistant</h3>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#C9A45C] text-[#17233B]">
                    Live AI Concierge
                  </span>
                </div>
                <p className="text-[11px] text-stone-300 font-light">
                  Nutty Tales Commerce, Crafts &amp; Hospitality Engine
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
              placeholder="Ask SI anything..."
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
function getContextualPrompts(pathname: string) {
  if (pathname.startsWith('/crafts')) {
    return {
      greeting:
        'Welcome to Crafts & Heritage Fall/Winter 2026. I am SI, your Kashmir style & provenance concierge. I can simulate drapes on your silhouette, explain the 14.5-micron Pashmina craft, or check GI tag certification.',
      actions: [
        { label: 'Try with SI (Virtual Drape)', href: '/crafts/try-with-si' },
        { label: 'GI Certification Authenticity', onClick: () => {} },
        { label: 'Pheran vs Shawl Guide', onClick: () => {} },
      ],
      quickPrompts: ['Drape a Pheran on me', 'Explain Kani weave', 'Is this GI certified?'],
    }
  }

  if (pathname.startsWith('/weddings')) {
    return {
      greeting:
        'Planning wedding celebrations? I am SI, your bespoke wedding concierge. I can match packaging to your wedding card colors, configure 100 to 1,000+ hampers across multiple cities, and generate custom monogram previews.',
      actions: [
        { label: 'Design Your Hamper', href: '/weddings' },
        { label: 'Budget Calculator (₹500 - ₹5000+)', onClick: () => {} },
        { label: 'Multi-City PAN-India Delivery', onClick: () => {} },
      ],
      quickPrompts: ['Hampers under ₹1,500', 'Multi-city dispatch', 'Personalized monograms'],
    }
  }

  if (pathname.startsWith('/business-supply')) {
    return {
      greeting:
        'Sourcing ingredients for hotels, commercial bakeries, or mithai chains? I can quote bulk cut specifications (sliced, slivered, nut flour) with laboratory moisture & oil parameters.',
      actions: [
        { label: 'Create B2B RFQ', href: '/business-supply' },
        { label: 'Request Lab Sample Kit', onClick: () => {} },
        { label: 'Almond Slice Specs', onClick: () => {} },
      ],
      quickPrompts: ['Bakery almond slices', '500kg wholesale quote', 'FSSAI lab reports'],
    }
  }

  if (pathname.startsWith('/stays')) {
    return {
      greeting:
        'Welcome to Nutty Tales Hospitality. I can check live availability and seasonal tariffs for our Srinagar Orchard Villa, Noida Corporate Retreat, or Patna Heritage Stay.',
      actions: [
        { label: 'Srinagar Orchard Villa', href: '/stays' },
        { label: 'Kashmir Tour Packages', href: '/travel/kashmir' },
      ],
      quickPrompts: ['Best snow months', 'Orchard suite tariff', 'Private Wazwan dinner'],
    }
  }

  if (pathname.startsWith('/travel')) {
    return {
      greeting:
        'Planning your Kashmir journey? I can help customize your 4x4 snow safari, Gulmarg Gondola passes, and orchard retreat stays.',
      actions: [
        { label: 'Customize Itinerary', href: '/travel/kashmir' },
        { label: 'Winter Snow Safari', href: '/travel/kashmir' },
      ],
      quickPrompts: ['Gulmarg Gondola advice', 'Private 4x4 vehicle', 'Wazwan feast booking'],
    }
  }

  // Default / Homepage / Retail
  return {
    greeting:
      'Hello! I am SI, your Nutty Tales assistant. Whether you are looking for heart-healthy nuts, wedding hampers, Kashmir pashminas, or an orchard stay in Srinagar, I can guide you.',
    actions: [
      { label: 'Shop Dry Fruits', href: '/shop' },
      { label: 'Wedding Hampers', href: '/weddings' },
      { label: 'Kashmir Crafts', href: '/crafts' },
      { label: 'B2B Wholesale', href: '/business-supply' },
    ],
    quickPrompts: ['Diabetic-friendly nuts', 'Best dry fruits for gifting', 'Kashmir orchard stay'],
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
    text: `I've noted: "${query}". Nutty Tales connects wholesome dry fruit nutrition, artisan Kashmir crafts, and bespoke boutique stays. How else may I assist you today?`,
    actions: [
      { label: 'Browse Food Collections', href: '/shop' },
      { label: 'Explore Kashmir Crafts', href: '/crafts' },
    ],
  }
}
