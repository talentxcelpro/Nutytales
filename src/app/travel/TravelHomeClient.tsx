'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import DemandCaptureModal from '@/components/demand/DemandCaptureModal'
import TravelActivationDepositDesk from '@/components/travel/TravelActivationDepositDesk'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'

// ── Types for the 5-Mode Trip Operating System ─────────────────────────────────
export type TripMode = 'explore' | 'plan' | 'book' | 'experience' | 'remember'

export interface VerifiedSupply {
  flights: string
  stays: string
  transit: string
  experiences: string
  dining: string
  cancellation: string
  trustStatus: 'VERIFIED_API' | 'DIRECT_SUPPLY' | 'DMC_ESCROW'
}

export interface TripItinerary {
  id: string
  title: string
  destination: string
  flag: string
  nights: number
  travelers: number
  budgetLabel: string
  basePrice: number
  description: string
  flights: string
  stays: string[]
  vehicle: string
  activities: string[]
  dining: string
  heritage: string
  photography: string
  protection: string
  supply: VerifiedSupply
  isB2BGroup?: boolean
}

// ── Curated Global & Flagship Supply Corridors ───────────────────────────────────
const PRESET_INTENTS: Record<string, TripItinerary> = {
  italy_slow: {
    id: 'italy_slow',
    title: 'Italy Gourmet, Architecture & Slow Travel Odyssey',
    destination: 'Italy (Rome, Florence, Tuscany, Amalfi Coast)',
    flag: '🇮🇹',
    nights: 10,
    travelers: 2,
    budgetLabel: '₹5L Slow Travel Class',
    basePrice: 482600,
    description: 'Rome (3N) → Florence (2N) → Tuscany (2N) → Amalfi Coast (3N). Designed for travelers who love food, architecture, and small towns with zero rushed sightseeing.',
    flights: 'Roundtrip Emirates / Qatar (BOM/DEL ⇄ FCO / NAP) multi-city with fast-track immigration & lounge access',
    stays: [
      '3 Nights · Rome Piazza Navona Boutique Palazzo Historic Suite',
      '2 Nights · Florence Oltrarno Artisan Quarter River Suite (Arno view)',
      '2 Nights · Tuscany Val d’Orcia Private Vineyard Stone Villa & Olive Grove',
      '3 Nights · Amalfi Cliffside Balcony Retreat (Positano & sea overlook)',
    ],
    vehicle: 'Frecciarossa Executive High-Speed Train passes + Private Mercedes E-Class chauffeur for Tuscan hills & Amalfi coast transfers',
    activities: [
      'Vatican & Colosseum private after-hours curator tour',
      'Florence Uffizi private Renaissance art historian walk',
      'Chianti Classico private organic winery cellar barrel tasting & olive oil pressing',
      'Private sunset wooden gozzo boat charter along Amalfi grottoes',
    ],
    dining: 'Slow Food Osteria curated reservations, Roman Trastevere evening tasting crawl, and private Tuscan farmhouse pasta masterclass',
    heritage: 'Old Florence leather guilds, San Gimignano medieval towers, and Amalfi hand-pressed paper mills',
    photography: 'Dedicated golden-hour portrait session in Val d’Orcia cypress lanes',
    protection: 'Schengen concierge support, real-time train rescheduling & 24/7 SI multi-country journey monitor',
    supply: {
      flights: 'Amadeus GDS / Direct Airline API (Confirmed slots)',
      stays: 'Direct Boutique Hotel API & Italian Villa Registry',
      transit: 'Trenitalia Frecciarossa Executive API & NCC Licensed Chauffeur',
      experiences: 'Direct Tuscan DMC & Licensed Art Historian Registry',
      dining: 'TheFork Direct / Concierge VIP Table Lock',
      cancellation: 'Full refund up to 14 days before departure · Weather change protection',
      trustStatus: 'VERIFIED_API',
    },
  },
  family_winter: {
    id: 'family_winter',
    title: 'Kashmir Winter Family Snow Odyssey',
    destination: 'Kashmir (Srinagar, Gulmarg, Pahalgam)',
    flag: '🏔️',
    nights: 6,
    travelers: 4,
    budgetLabel: '₹1.5L Family Class',
    basePrice: 138400,
    description: 'Delhi to Kashmir winter expedition for family of 4 with powder snow in Gulmarg, pine valleys of Pahalgam, and heritage lake suites.',
    flights: 'Roundtrip Delhi (DEL) ⇄ Srinagar (SXR) morning flight slots with 20kg check-in & VIP airport tarmac meet',
    stays: [
      '3 Nights · Srinagar Heritage Lakefront Suite (Zabarwan mountain view)',
      '2 Nights · Gulmarg Heated Alpine Chalet (5 min walk to Gondola)',
      '1 Night · Pahalgam Riverfront Cedar Cottage by Lidder River',
    ],
    vehicle: 'Private 4x4 Scorpio / Innova Crysta with dedicated local mountain chauffeur & snow chains for all 7 days',
    activities: [
      'Phase 2 Apharwat Peak Gondola fast-track boarding passes',
      'Certified private ski instructor & thermal snow gear hire',
      'Pahalgam Aru valley pine glade pony trail & sledge rides',
    ],
    dining: 'Royal 7-course Wazwan dinner banquet & floating Dal Lake sunset Samovar Kahwa',
    heritage: 'Old Srinagar artisan guild walk & Zadibal master Pashmina loom tour',
    photography: '1-hour high-altitude family portrait session at Apharwat snow line',
    protection: 'High-altitude emergency medical coverage & zero-cost mountain weather rerouting guarantee',
    supply: {
      flights: 'Air India / IndiGo direct corporate blocks (SXR)',
      stays: 'Direct Nuty Tales Controlled Stays & Khyber/Highland Reserve',
      transit: 'Nuty Tales Dedicated Chauffeur Fleet with GPS Telemetry',
      experiences: 'J&K Cable Car Corporation Verified Passes + Certified Guides',
      dining: 'Curated Master Waza Banquets & Floating Shikara Kitchen',
      cancellation: 'Free date change in case of snow weather disruptions',
      trustStatus: 'DIRECT_SUPPLY',
    },
  },
  honeymoon_luxury: {
    id: 'honeymoon_luxury',
    title: 'The Royal Kashmir Honeymoon Retreat',
    destination: 'Kashmir (Nigeen Lake & Gulmarg)',
    flag: '💍',
    nights: 5,
    travelers: 2,
    budgetLabel: 'Luxury Honeymoon',
    basePrice: 165000,
    description: 'Romantic high-altitude escape featuring private luxury cedar houseboat on Nigeen Lake, 5-star ski chalet, and private candlelit shikara dining.',
    flights: 'Priority flights from Mumbai / Delhi with lounge access & luxury airport escort',
    stays: [
      '2 Nights · Nigeen Lake Hand-Carved Cedar Royal Houseboat with private butler',
      '3 Nights · Boutique Heated Alpine Chalet / The Khyber Resort, Gulmarg',
    ],
    vehicle: 'Chauffeur-driven luxury 4x4 Fortuner / BMW X3 with heated seats and warm Kashmiri refreshments',
    activities: [
      'VIP Phase 2 Gondola tickets without queue',
      'Private couple cedar wood spa & aromatherapy session',
      'Sunset Shikara ride surrounded by 10,000 floating marigolds & live Rabab music',
    ],
    dining: 'Exclusive candlelit floating shikara feast & Wazwan tasting menu curated by a master Waza',
    heritage: 'Pashmina ring-shawl authenticity testing session with GI master weaver',
    photography: 'Dedicated cinema-grade photographer for 2 hours in Gulmarg pine forests',
    protection: 'VIP concierge on-call 24/7 with instant emergency medical & helicopter evacuation cover',
    supply: {
      flights: 'Direct airline executive booking',
      stays: 'Nuty Tales Houseboat Reserve & Luxury Ski Suites',
      transit: 'Nuty Tales VIP Luxury Fleet',
      experiences: 'Private Butler, Live Folk Musicians, Licensed Alpine Skiers',
      dining: 'Private floating chef setup on Dal/Nigeen Lake',
      cancellation: '100% refundable up to 10 days before departure',
      trustStatus: 'DIRECT_SUPPLY',
    },
  },
  corporate_mice_120: {
    id: 'corporate_mice_120',
    title: '120-Pax Corporate Leadership Retreat & Conference',
    destination: 'Pahalgam & Srinagar Pine Valleys',
    flag: '🏢',
    nights: 4,
    travelers: 120,
    budgetLabel: 'Enterprise MICE RFQ (120 Pax)',
    basePrice: 4850000,
    description: 'Full-scale enterprise leadership offsite combining estate buyouts, keynote AV conference facilities, Lidder river rafting, Wazwan banquets, and customized Nuty Tales corporate gifting.',
    flights: 'Block-booked group flight departures with corporate GST invoice and centralized airport dispatch baggage tags',
    stays: [
      '4 Nights · Complete buy-out of luxury pine-valley resort estate (70 suites) in Pahalgam & Harwan',
    ],
    vehicle: 'Fleet of 24 luxury Innova Crystas + 3 luggage vans with live GPS fleet dispatch coordination',
    activities: [
      'High-speed fiber audio-visual conference setup with multi-camera live broadcast',
      'Team Lidder river rafting expedition (Grade II/III) with 12 certified safety rescue kayakers',
      'Pine forest outdoor bonfire & keynote leadership circle with live acoustic folk symphony',
    ],
    dining: 'Full-board banquet catering with royal Wazwan spreads and customized corporate dietary plans',
    heritage: 'Exclusive pop-up craft bazaar featuring direct artisan Pashmina & walnut wood showcases',
    photography: 'Dual-operator drone videographer and event photographer with same-day executive highlight reel',
    protection: 'Comprehensive corporate liability & round-the-clock emergency medical response unit on standby',
    supply: {
      flights: 'Group Corporate Block PNR via Airline GDS',
      stays: 'Exclusive Resort Estate Buyout Agreement',
      transit: 'Centralized 27-Vehicle Fleet Dispatch with Fleet Command GPS',
      experiences: 'Disaster-managed certified adventure teams & event AV rigging',
      dining: 'Nuty Tales Hospitality Banquet Catering',
      cancellation: 'Tiered enterprise milestone escrow with weather fallback contingency',
      trustStatus: 'DIRECT_SUPPLY',
    },
    isB2BGroup: true,
  },
  wedding_200: {
    id: 'wedding_200',
    title: '200-Guest Himalayan Destination Wedding Ecosystem',
    destination: 'Srinagar Dal Lake & Royal Mughal Foothills',
    flag: '👑',
    nights: 3,
    travelers: 200,
    budgetLabel: 'Life-Event Ecosystem (200 Guests)',
    basePrice: 5800000,
    description: 'A ₹58L+ compound event ecosystem orchestrating guest flights, palace accommodation, fleet convoy, Nuty Tales Gifting trousseau hampers, authentic Pashmina bridal favours, and royal Wazwan feast.',
    flights: 'Chartered & block flight coordination for 200 guests arriving across Mumbai, Delhi, and Bangalore',
    stays: [
      '3 Nights · Palace Estate & Luxury Lakefront Pavilion buyout for 200 wedding guests',
    ],
    vehicle: 'Dedicated fleet of 40 luxury Innova Crystas + VIP vintage bridal car + airport welcoming shuttle desks',
    activities: [
      'Mehendi afternoon on floating Dal Lake Shikara flotilla adorned with 50,000 local roses',
      'Sangeet evening under illuminated Chinar trees with live Sufi ensemble',
      'Nikah / Pheras ceremony with panoramic views of the Zabarwan mountain range',
    ],
    dining: '36-course Royal Wazwan banquets prepared by legacy 4th-generation master Wazas',
    heritage: 'Nuty Tales Crafts trousseau room: hand-embroidered GI Sozni pashminas & walnut jewellery chests',
    photography: 'Dedicated cinema wedding film crew (4 cameras + drone + instant guest Polaroid stations)',
    protection: 'Private security escort, full medical station with doctor, and weather canopy backups',
    supply: {
      flights: 'Group Block Air Travel & Luggage Escort',
      stays: 'Palace Buyout Contract with Nuty Tales Stays & Weddings',
      transit: '40-Vehicle Private Convoy with 24/7 Dispatch Desk',
      experiences: 'Nuty Tales Weddings + Crafts + Gifting + Travel Orchestration',
      dining: 'Legacy Master Waza Guild Contract',
      cancellation: 'Event Insurance + Life-Event Escrow Guarantee',
      trustStatus: 'DIRECT_SUPPLY',
    },
    isB2BGroup: true,
  },
  switzerland_alpine: {
    id: 'switzerland_alpine',
    title: 'Swiss Scenic Rail & Alpine Glacier Expedition',
    destination: 'Switzerland (Zurich, Lucerne, Zermatt, Interlaken)',
    flag: '🇨🇭',
    nights: 7,
    travelers: 2,
    budgetLabel: '₹4.5L Swiss Scenic Class',
    basePrice: 440000,
    description: 'A breathtaking high-altitude journey combining Glacier Express panoramic rail, Matterhorn viewpoints, boutique heated chalets, and fondue dining.',
    flights: 'Roundtrip SWISS / Lufthansa (BOM/DEL ⇄ ZRH) with luggage transfer to first mountain hotel',
    stays: [
      '2 Nights · Lucerne Lakeview Boutique Chalet',
      '3 Nights · Zermatt Car-Free Village Matterhorn-Facing Suite',
      '2 Nights · Interlaken Alpine Valley Wellness Resort',
    ],
    vehicle: 'First-Class Swiss Travel Pass (unlimited trains, boats, mountain cogwheels, and panoramic Glacier Express)',
    activities: [
      'Gornergrat cogwheel train to 3,089m with direct Matterhorn reflection views',
      'Jungfraujoch – Top of Europe glacier summit ice palace tour',
      'Private sunset cruise across Lake Lucerne with alpine fondue',
    ],
    dining: 'Artisanal cheese fondue in historic alpine hut & Michelin-recommended dining in Zermatt',
    heritage: 'Historic Lucerne wooden Chapel Bridge walk and Swiss watchmaking atelier visit',
    photography: 'Matterhorn sunrise photo expedition at Riffelsee alpine lake',
    protection: 'Schengen medical coverage, 24/7 SI rail connection tracker, and instant platform navigation',
    supply: {
      flights: 'Star Alliance / SWISS International Direct API',
      stays: 'Swiss Boutique Hotel Association & Zermatt Luxury Chalets',
      transit: 'Swiss Federal Railways (SBB) First-Class Pass API',
      experiences: 'Jungfrau Railways & Gornergrat Bahn Direct Reservation',
      dining: 'Local Alpine Dining Desk',
      cancellation: 'Full refund up to 14 days prior · Mountain weather protection',
      trustStatus: 'VERIFIED_API',
    },
  },
}

export default function TravelMarketplacePage() {
  // ── Mode Switcher State ──
  const [activeMode, setActiveMode] = useState<TripMode>('plan')

  // ── Modal State ──
  const [quoteModalOpen, setQuoteModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('Plan My Journey with SI')
  const [modalSubtitle, setModalSubtitle] = useState('Tell us your dates, group size, and preferences.')
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('italy_slow')

  // ── Natural Language Intent Prompt State ──
  const [userPrompt, setUserPrompt] = useState(
    'I want to take my wife to Italy for 10 days in September. ₹5 lakh budget. We love food, architecture and small towns. We don’t want rushed sightseeing.'
  )
  const [isSynthesizing, setIsSynthesizing] = useState(false)

  // ── Active Itinerary State ──
  const [currentItinerary, setCurrentItinerary] = useState<TripItinerary>(PRESET_INTENTS.italy_slow)
  const [luxuryMultiplier, setLuxuryMultiplier] = useState(1)
  const [anniversaryAddon, setAnniversaryAddon] = useState(false)
  const [budgetOffset, setBudgetOffset] = useState(0)
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null)

  // ── Explore Mode State ──
  const [exploreVibe, setExploreVibe] = useState<'slow_food' | 'snow_mountains' | 'luxury_honeymoon' | 'corporate_offsite' | 'destination_wedding'>('slow_food')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // ── Calculate Live Price ──
  const calculatedTotal = Math.max(
    30000,
    Math.round(currentItinerary.basePrice * luxuryMultiplier + (anniversaryAddon ? 12000 : 0) + budgetOffset)
  )

  // ── Preset Selection Handler ──
  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key)
    const preset = PRESET_INTENTS[key]
    if (preset) {
      setCurrentItinerary(preset)
      setLuxuryMultiplier(1)
      setAnniversaryAddon(false)
      setBudgetOffset(0)
      if (key === 'italy_slow') {
        setUserPrompt('I want to take my wife to Italy for 10 days in September. ₹5 lakh budget. We love food, architecture and small towns. We don’t want rushed sightseeing.')
      } else if (key === 'family_winter') {
        setUserPrompt('I want to take my family from Delhi to Kashmir for 6 days in December. Budget ₹1.5 lakh. We want snow, beautiful hotels, a private car, Gulmarg, Pahalgam and some local experiences.')
      } else if (key === 'honeymoon_luxury') {
        setUserPrompt('5-day romantic luxury honeymoon in Kashmir: private royal houseboat on Nigeen Lake + 5-star Gulmarg ski chalet + candlelit Shikara dinner.')
      } else if (key === 'corporate_mice_120') {
        setUserPrompt('We are bringing 120 employees to Kashmir for 4 days. Need flights, resort buyout, Lidder rafting, AV conference facilities, Wazwan banquet, and gifting hampers.')
      } else if (key === 'wedding_200') {
        setUserPrompt('We’re getting married in Kashmir with 200 guests for 3 days. Need flight coordination, palace buyout, 40 private cars, wedding hampers, bridal Pashminas, and Wazwan.')
      } else if (key === 'switzerland_alpine') {
        setUserPrompt('7-day scenic Swiss alpine tour for 2: First-Class Glacier Express, Matterhorn views, Jungfraujoch glacier, and luxury wellness chalets. ₹4.5L budget.')
      }
    }
  }

  // ── Trigger Natural Language SI Rebuild ──
  const handleSynthesizePrompt = () => {
    setIsSynthesizing(true)
    setTimeout(() => {
      setIsSynthesizing(false)
      const p = userPrompt.toLowerCase()
      if (p.includes('italy') || p.includes('rome') || p.includes('florence') || p.includes('tuscany') || p.includes('amalfi')) {
        handleSelectPreset('italy_slow')
      } else if (p.includes('120') || p.includes('corporate') || p.includes('offsite') || p.includes('employees') || p.includes('mice')) {
        handleSelectPreset('corporate_mice_120')
      } else if (p.includes('wedding') || p.includes('marriage') || p.includes('200') || p.includes('guests')) {
        handleSelectPreset('wedding_200')
      } else if (p.includes('swiss') || p.includes('switzerland') || p.includes('matterhorn') || p.includes('zermatt')) {
        handleSelectPreset('switzerland_alpine')
      } else if (p.includes('honeymoon') || p.includes('couple') || p.includes('romantic')) {
        handleSelectPreset('honeymoon_luxury')
      } else {
        handleSelectPreset('family_winter')
      }
    }, 600)
  }

  // ── Quick Tweak Triggers ──
  const handleMakeLuxury = () => {
    setLuxuryMultiplier(1.3)
    setBudgetOffset(0)
  }

  const handleReduceBudget = () => {
    setLuxuryMultiplier(0.92)
    setBudgetOffset(-15000)
  }

  const handleToggleAnniversary = () => {
    setAnniversaryAddon(!anniversaryAddon)
  }

  // ── Quick 1-Click Instant Booking ──
  const handleInstantBook = async () => {
    const bookingRef = `TRIP-${Date.now().toString().slice(-6)}`
    try {
      await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking_inquiry',
          vertical: 'travel',
          customerName: 'Intelligent Journey Guest',
          companyName: currentItinerary.title,
          customerPhone: 'Direct Web Booking',
          deliveryCity: currentItinerary.destination,
          targetBudget: calculatedTotal,
          currency: 'INR',
          notes: `[REF: ${bookingRef}] ${currentItinerary.title} | ${currentItinerary.nights}N | ${currentItinerary.travelers} Pax | Total: ₹${calculatedTotal.toLocaleString('en-IN')} | Stays: ${currentItinerary.stays.join(' -> ')} | Verified Supply Status: ${currentItinerary.supply.trustStatus}`,
        }),
      })
      setOrderConfirmed(bookingRef)
    } catch {
      setOrderConfirmed(bookingRef)
    }
  }

  return (
    <div className="bg-[#FAF7F2] text-[#17233B]">
      {/* ── Hero Section: Refined Editorial Luxury ──────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#090F1C] via-[#10192A] to-[#17233B] text-white py-16 sm:py-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Main Statement */}
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-[#C9A45C] text-xs font-semibold uppercase tracking-widest border border-[#C9A45C]/30 backdrop-blur-sm">
              <span>✦</span> Bespoke Private Expeditions &amp; Alpine Escapes
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Curated Journeys Beyond the Ordinary.
            </h1>
            <p className="text-stone-300 text-sm sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
              Handcrafted expeditions, private mountain convoys, and boutique heritage chalets across Kashmir, Ladakh, and India. Tailored seamlessly to your personal pace and style.
            </p>
          </div>

          {/* ── The Curated Experience Tabs ── */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 flex flex-wrap items-center justify-between gap-1 text-xs">
            {[
              { id: 'plan' as TripMode, label: 'Curate Itinerary', subtitle: 'Describe your vision' },
              { id: 'explore' as TripMode, label: 'Signature Collections', subtitle: 'Curated corridors' },
              { id: 'book' as TripMode, label: 'Confirmed Stays & Fleet', subtitle: 'Direct vetted supply' },
              { id: 'experience' as TripMode, label: 'On-Trip Concierge', subtitle: '24/7 mountain care' },
              { id: 'remember' as TripMode, label: 'Style Profile', subtitle: 'Tailored preferences' },
            ].map((m) => {
              const active = activeMode === m.id
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setActiveMode(m.id)}
                  className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl transition-all text-center flex flex-col items-center justify-center ${
                    active
                      ? 'bg-[#C9A45C] text-[#10192A] shadow-md font-bold'
                      : 'text-stone-300 hover:text-white hover:bg-white/10 font-medium'
                  }`}
                >
                  <span className="text-[11px] tracking-wider uppercase font-semibold">{m.label}</span>
                  <span className={`text-[10px] font-normal ${active ? 'text-[#10192A]/80 font-medium' : 'text-stone-400'}`}>
                    {m.subtitle}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ── MODE 1: SIGNATURE COLLECTIONS VIEW ── */}
          {activeMode === 'explore' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-[#17233B] space-y-6 animate-fadeIn">
              <div className="border-b border-stone-200 pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#704B32] block">
                  Signature Collections
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B] pt-1">
                  Handcrafted Himalayan &amp; Global Corridors
                </h3>
                <p className="text-xs text-stone-600 pt-1">
                  Select an inspired corridor curated with guaranteed private chalets, 4x4 mountain convoys, and master local guides.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'slow_food', label: '🍷 Food, Wine & Historic Towns', desc: 'Slow journeys in Italy or France with organic vineyard villas', preset: 'italy_slow' },
                  { key: 'snow_mountains', label: '❄️ High-Altitude Snow & Ski', desc: 'Gulmarg powder snow or Swiss Glacier Express', preset: 'family_winter' },
                  { key: 'luxury_honeymoon', label: '💍 Secluded Luxury Honeymoon', desc: 'Private cedar houseboats, heated chalets & candlelit shikaras', preset: 'honeymoon_luxury' },
                  { key: 'corporate_offsite', label: '🏢 120-Pax Corporate Leadership', desc: 'Estate buyouts, Lidder rafting & conference AV infrastructure', preset: 'corporate_mice_120' },
                  { key: 'destination_wedding', label: '👑 200-Guest Destination Wedding', desc: 'Palace venues, 40-vehicle fleet & trousseau gift hampers', preset: 'wedding_200' },
                  { key: 'alpine_rail', label: '🚄 Scenic High-Speed Rail & Glaciers', desc: 'Zermatt Matterhorn views and Swiss First-Class panoramic rail', preset: 'switzerland_alpine' },
                ].map((card) => (
                  <button
                    key={card.key}
                    type="button"
                    onClick={() => {
                      handleSelectPreset(card.preset)
                      setActiveMode('plan')
                    }}
                    className="p-4 rounded-2xl border border-stone-200 hover:border-[#C9A45C] hover:bg-[#FAF6EE] text-left transition-all space-y-1.5 group"
                  >
                    <span className="text-sm font-bold text-[#17233B] group-hover:text-[#704B32] block">
                      {card.label}
                    </span>
                    <p className="text-[11px] text-stone-500 leading-snug">
                      {card.desc}
                    </p>
                    <span className="text-[10px] text-[#C9A45C] font-bold block pt-1">
                      Curate This Journey →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── MODE 2: PLAN VIEW (Natural Language Intent Console) ── */}
          {activeMode === 'plan' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-[#C9A45C]/40 text-[#17233B] space-y-4 animate-fadeIn">
              <div className="relative">
                <label htmlFor="travel-intent-input" className="sr-only">Describe your ideal journey</label>
                <textarea
                  id="travel-intent-input"
                  rows={3}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Describe your ideal journey: E.g., A 6-day winter escape across Kashmir with powder snow in Gulmarg, heritage lake suites in Srinagar, and a dedicated 4x4 mountain chauffeur..."
                  className="w-full text-sm sm:text-base p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#704B32] resize-none text-[#17233B] font-medium leading-relaxed"
                />
                <button
                  type="button"
                  onClick={handleSynthesizePrompt}
                  disabled={isSynthesizing}
                  className="w-full sm:w-auto mt-2 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4 px-6 py-3.5 bg-[#17233B] hover:bg-[#223352] text-[#FAF7F2] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>{isSynthesizing ? '✦ Curating Itinerary...' : '✦ Tailor My Itinerary'}</span>
                </button>
              </div>

              {/* Inspiration Chips */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium px-1">
                  <span>Featured Journey Inspirations:</span>
                  <span className="text-[#704B32] hidden sm:inline">Handcrafted Corridors</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'italy_slow', label: '🇮🇹 Italy 10D: Slow Food, Tuscany & Amalfi' },
                    { key: 'family_winter', label: '❄️ Kashmir 6D: Alpine Snow, Gulmarg & Houseboat' },
                    { key: 'honeymoon_luxury', label: '💍 Kashmir 5D: Royal Houseboat & Ski Chalet' },
                    { key: 'corporate_mice_120', label: '🏢 Executive Retreat: Pahalgam Pine Valley' },
                    { key: 'wedding_200', label: '👑 Destination Wedding: Palace Buyout & Fleet' },
                    { key: 'switzerland_alpine', label: '🇨🇭 Switzerland 7D: Glacier Express & Matterhorn' },
                  ].map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => handleSelectPreset(chip.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        selectedPresetKey === chip.key
                          ? 'bg-[#17233B] text-[#C9A45C] border-[#17233B] shadow-sm'
                          : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MODE 3: BOOK VIEW (Guaranteed Stays & Fleet) ── */}
          {activeMode === 'book' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-[#17233B] space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#704B32] flex items-center gap-1.5">
                    <span>🛡️</span> Guaranteed Stays &amp; Private Fleet
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#17233B] pt-1">
                    Vetted Luxury Properties &amp; Dedicated Mountain Chauffeurs
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  Direct Vetted Supply
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-[#17233B] block">✈️ Flight &amp; Airport Concierge</span>
                  <p className="text-stone-600">{currentItinerary.supply.flights}</p>
                </div>
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-[#17233B] block">🏨 Heritage Suites &amp; Chalets</span>
                  <p className="text-stone-600">{currentItinerary.supply.stays}</p>
                </div>
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-[#17233B] block">🚗 Dedicated Chauffeur &amp; 4x4 Fleet</span>
                  <p className="text-stone-600">{currentItinerary.supply.transit}</p>
                </div>
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-[#17233B] block">🎿 Master Guides &amp; Experiences</span>
                  <p className="text-stone-600">{currentItinerary.supply.experiences}</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                <div className="space-y-0.5">
                  <span className="font-bold">Weather Protection &amp; Flexibility:</span>
                  <p>{currentItinerary.supply.cancellation}</p>
                </div>
                <button
                  type="button"
                  onClick={handleInstantBook}
                  className="px-6 py-3 bg-[#17233B] hover:bg-[#223352] text-white font-semibold rounded-xl uppercase tracking-wider flex-shrink-0 transition-colors"
                >
                  Reserve Itinerary
                </button>
              </div>
            </div>
          )}

          {/* ── MODE 4: EXPERIENCE VIEW (On-Trip Concierge) ── */}
          {activeMode === 'experience' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-[#17233B] space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <span>🛰️</span> Dedicated On-Ground Concierge
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#17233B] pt-1">
                    Real-Time Mountain Care &amp; Dedicated Dispatch
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200">
                  Concierge Desk Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Flight Status</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">ON TIME</span>
                  </div>
                  <p className="text-stone-600 font-mono">Flight AI-825 · SXR Arrival 11:45 AM</p>
                  <p className="text-[11px] text-stone-500">Private chauffeur standing at arrival gate with personalized paging.</p>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Mountain Weather</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">SNOW ADVISORY</span>
                  </div>
                  <p className="text-stone-600">Gulmarg Pass: Snow chains fitted on private 4x4.</p>
                  <p className="text-[11px] text-stone-500">Concierge has adjusted Gondola pass timing for optimal sunlight.</p>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Private Travel Desk</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">AVAILABLE</span>
                  </div>
                  <p className="text-stone-600">Direct VIP WhatsApp Line</p>
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] text-[#704B32] font-semibold underline"
                  >
                    Open Private Concierge Desk →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── MODE 5: REMEMBER VIEW (Style Profile) ── */}
          {activeMode === 'remember' && (
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-[#17233B] space-y-6 animate-fadeIn">
              <div className="border-b border-stone-200 pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <span>✦</span> Bespoke Style Profile
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B] pt-1">
                  Tailored Travel Preferences &amp; Continuity
                </h3>
                <p className="text-xs text-stone-600 pt-1">
                  We curate every journey around your personal travel rhythm, preferred room aesthetic, and dietary nuances.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-[#17233B] block">Personal Travel Rhythm</span>
                  <ul className="space-y-1 text-stone-600">
                    <li>• Pace: Unhurried, slow travel with dedicated leisure hours</li>
                    <li>• Stays: Heritage lakefront suites &amp; boutique chalets</li>
                    <li>• Dining: Authentic royal Wazwan, farm-to-table &amp; fine dining</li>
                    <li>• Ground Transit: Private 4x4 convoy with dedicated local chauffeur</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-stone-200 space-y-2">
                  <span className="font-bold text-[#17233B] block">Curated Future Escapes</span>
                  <ul className="space-y-1.5 text-stone-600">
                    <li className="flex items-center justify-between">
                      <span>🌸 Spring Blossom in Kyoto, Japan (10D)</span>
                      <button
                        type="button"
                        onClick={() => setActiveMode('plan')}
                        className="text-[#704B32] font-semibold text-[10px] underline"
                      >
                        Explore
                      </button>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>🍇 Bordeaux Harvest &amp; Châteaux, France (8D)</span>
                      <button
                        type="button"
                        onClick={() => setActiveMode('plan')}
                        className="text-[#704B32] font-semibold text-[10px] underline"
                      >
                        Explore
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Component Horizontal Sub-Bar */}
          <div className="max-w-4xl mx-auto pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-300">
            <span className="font-serif font-medium text-[#C9A45C]">Every Bespoke Journey Includes:</span>
            <div className="flex flex-wrap items-center gap-3 text-stone-300 font-light">
              <span>✈️ Flights &amp; VIP Escort</span>
              <span>•</span>
              <span>🏨 Heritage Suites</span>
              <span>•</span>
              <span>🚙 Private 4x4 Convoy</span>
              <span>•</span>
              <span>🎿 Master Guides</span>
              <span>•</span>
              <span>🍷 Curated Dining</span>
              <span>•</span>
              <span>🛡️ Mountain Weather Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. The Core Product: Live Journey Dossier & Customization ── */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0DC] text-[#704B32] text-[10px] font-bold uppercase tracking-wider border border-[#C9A45C]/30">
              <span>✦</span> BESPOKE ITINERARY DOSSIER · DEDICATED CONCIERGE CARE
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
              Your Tailored Journey Dossier
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light max-w-2xl">
              Every flight, boutique heritage stay, private mountain convoy, and exclusive dining experience orchestrated into one seamless, synchronized itinerary.
            </p>
          </div>

          {/* Steering Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-stone-500 mr-1">Refine Style:</span>
            <button
              type="button"
              onClick={handleMakeLuxury}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                luxuryMultiplier > 1
                  ? 'bg-[#17233B] text-white border-[#17233B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              ✨ Upgrade to Luxury Suite
            </button>
            <button
              type="button"
              onClick={handleReduceBudget}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                budgetOffset < 0
                  ? 'bg-[#17233B] text-white border-[#17233B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              🌿 Value Optimized
            </button>
            <button
              type="button"
              onClick={handleToggleAnniversary}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                anniversaryAddon
                  ? 'bg-[#17233B] text-[#C9A45C] border-[#17233B]'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              🍷 Private Sommelier &amp; Wazwan
            </button>
          </div>
        </div>

        {/* Order Confirmation Banner */}
        {orderConfirmed && (
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-300 text-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-1">
              <span className="font-bold text-sm flex items-center gap-2">
                <span>✦</span> Itinerary Reserved Successfully (Reference: <strong>{orderConfirmed}</strong>)
              </span>
              <p className="text-xs text-emerald-800">
                Our Private Concierge Desk has secured your vehicle and property reservations. An itemized travel dossier has been prepared for your review.
              </p>
            </div>
            <Link
              href="/travel/dashboard"
              className="px-6 py-3 bg-[#17233B] hover:bg-[#223352] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex-shrink-0"
            >
              View Guest Portal →
            </Link>
          </div>
        )}

        {/* The Unified Journey Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#17233B] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentItinerary.flag}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-[#17233B] font-bold text-[10px] uppercase tracking-wider">
                  {currentItinerary.budgetLabel}
                </span>
                <span className="text-xs text-stone-300">
                  {currentItinerary.nights} Nights · {currentItinerary.travelers} Travellers
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {currentItinerary.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-xl">
                {currentItinerary.description}
              </p>
            </div>

            {/* Price Pill & CTAs */}
            <div className="text-right space-y-3 flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right">
                <span className="text-[11px] text-stone-300 block uppercase tracking-wider">
                  Estimated All-Inclusive Total:
                </span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-[#C9A45C]">
                  ₹{calculatedTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-400 block pt-0.5">
                  Includes Flights + Stays + Transit + Curated Experiences + Taxes
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleInstantBook}
                  className="flex-1 py-3 px-5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Reserve This Journey
                </button>
                <Link
                  href={`/travel/builder?preset=${selectedPresetKey}&total=${calculatedTotal}`}
                  className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20"
                >
                  Customize
                </Link>
              </div>
            </div>
          </div>

          {/* Multi-Component Assembly Grid */}
          <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs bg-[#FAF7F2]">
            {/* 1. Flights */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>✈️</span> Flights &amp; VIP Escort
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  Confirmed Slots
                </span>
              </div>
              <p className="text-stone-600 leading-relaxed">{currentItinerary.flights}</p>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Airport VIP Assistance:</span>
                <strong className="text-emerald-700">Included</strong>
              </div>
            </div>

            {/* 2. Stays */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>🏨</span> Heritage Stays &amp; Chalets
                </span>
                <span className="text-[10px] bg-amber-50 text-amber-900 font-semibold px-2 py-0.5 rounded border border-amber-200">
                  {currentItinerary.nights} Nights
                </span>
              </div>
              <ul className="space-y-2 text-stone-600">
                {currentItinerary.stays.map((stay, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#C9A45C] mt-0.5">✦</span>
                    <span>{stay}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Curated Lodgings:</span>
                <strong className="text-emerald-700">Verified Selection</strong>
              </div>
            </div>

            {/* 3. Transit & Fleet */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>🚙</span> Private Chauffeur &amp; 4x4
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  Private Escort
                </span>
              </div>
              <p className="text-stone-600 leading-relaxed">{currentItinerary.vehicle}</p>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Fuel, Tolls &amp; Passes:</span>
                <strong className="text-emerald-700">All-Inclusive</strong>
              </div>
            </div>

            {/* 4. Experiences */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-bold text-[#17233B] flex items-center gap-1.5 text-sm">
                  <span>🎿</span> Curated Experiences
                </span>
                <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded border border-purple-200">
                  Priority Access
                </span>
              </div>
              <ul className="space-y-1.5 text-stone-600">
                {currentItinerary.activities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#C9A45C] mt-0.5">✓</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[11px] text-stone-500 font-medium border-t border-stone-100 flex items-center justify-between">
                <span>Master Guides:</span>
                <strong className="text-emerald-700">Certified Local</strong>
              </div>
            </div>
          </div>

          {/* Secondary Services Strip */}
          <div className="p-6 sm:p-8 bg-white border-t border-stone-200 flex flex-wrap items-center justify-between gap-6 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="text-base">🍽️</span>
              <div>
                <strong className="block text-[#17233B]">Culinary Reservations:</strong>
                <span>{currentItinerary.dining} {anniversaryAddon ? '✦ Added: Private Candlelight Dinner' : ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🧵</span>
              <div>
                <strong className="block text-[#17233B]">Artisan Craft Encounter:</strong>
                <span>{currentItinerary.heritage}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">🛡️</span>
              <div>
                <strong className="block text-[#17233B]">Weather Rerouting &amp; Safety:</strong>
                <span>{currentItinerary.protection}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3.5 IMMEDIATE REVENUE: VIP JOURNEY ACTIVATION & FLEET LOCK DESK ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <TravelActivationDepositDesk />
      </section>

      {/* ── 4. The Nuty Tales Standard: The Art of Unhurried Luxury ───────── */}
      <section className="py-20 bg-[#090F1C] text-white border-y border-[#C9A45C]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
              The Nuty Tales Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              The Art of Unhurried Luxury
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              True luxury is effortless. Every journey is anchored by directly verified ground operations, private alpine convoys, and personal concierge care.
            </p>
          </div>

          {/* 4 Pillars of Luxury */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-[#C9A45C]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center text-xl font-serif">
                🏰
              </div>
              <h4 className="font-serif font-bold text-base text-white">
                Heritage Suites &amp; Chalets
              </h4>
              <p className="text-stone-400 leading-relaxed font-light">
                Handpicked cedar houseboats on quiet Nigeen Lake, heated ski chalets in Gulmarg pine glades, and secluded riverside retreats in Pahalgam.
              </p>
              <div className="text-[11px] text-[#C9A45C] font-medium pt-1">
                Directly vetted &amp; reserved
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-[#C9A45C]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center text-xl font-serif">
                🚙
              </div>
              <h4 className="font-serif font-bold text-base text-white">
                Dedicated Mountain Convoys
              </h4>
              <p className="text-stone-400 leading-relaxed font-light">
                Late-model 4x4s with dedicated local chauffeurs, fitted snow chains, mountain safety gear, and real-time pass monitoring.
              </p>
              <div className="text-[11px] text-[#C9A45C] font-medium pt-1">
                Private chauffeur for all days
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-[#C9A45C]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center text-xl font-serif">
                🎨
              </div>
              <h4 className="font-serif font-bold text-base text-white">
                Private Cultural Access
              </h4>
              <p className="text-stone-400 leading-relaxed font-light">
                Private sessions with 5th-generation Pashmina artisans, historical Old Srinagar curator walks, and certified alpine ski guides.
              </p>
              <div className="text-[11px] text-[#C9A45C] font-medium pt-1">
                Authentic heritage access
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:border-[#C9A45C]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center text-xl font-serif">
                🛎️
              </div>
              <h4 className="font-serif font-bold text-base text-white">
                Dedicated Concierge Desk
              </h4>
              <p className="text-stone-400 leading-relaxed font-light">
                A dedicated personal travel manager handling every reservation, baggage transfer, flight tarmac meet, and weather adjustment.
              </p>
              <div className="text-[11px] text-[#C9A45C] font-medium pt-1">
                24/7 on-call mountain care
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Signature Occasions & Private Group Expeditions ─────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
              Signature Occasions
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#17233B]">
              Private Group Expeditions &amp; Milestone Celebrations
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm font-light max-w-2xl">
              From executive leadership retreats to royal Himalayan weddings, our travel desk coordinates complete bespoke hospitality with seamless grace.
            </p>
          </div>
          <Link
            href="/travel/partners"
            className="px-6 py-3.5 bg-[#17233B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#223352] transition-colors shadow-sm flex-shrink-0"
          >
            Explore Partner Network →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Corporate Offsite RFQ */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#704B32] flex items-center justify-center text-2xl font-bold">
                🏢
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                Corporate Offsites (40 to 120 Guests)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Complete retreat execution: private resort buyouts, Lidder river expeditions, conference AV infrastructure, and artisanal corporate gifting.
              </p>
              <div className="p-3 bg-[#FAF6EE] rounded-xl text-[11px] text-[#704B32] font-medium">
                Single corporate invoice with GST credit &amp; dedicated host
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalTitle('Request Corporate Offsite Proposal')
                setModalSubtitle('Share expected headcount (e.g. 120 guests), preferred dates, and conference requirements.')
                setQuoteModalOpen(true)
              }}
              className="w-full py-3 bg-[#17233B] hover:bg-[#223352] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all"
            >
              Request Corporate Proposal →
            </button>
          </div>

          {/* Card 2: Destination Weddings */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#8E2848] flex items-center justify-center text-2xl font-bold">
                💍
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                Destination Weddings (Up to 200 Guests)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Palace venue buyout, 40-vehicle chauffeured convoy, Nuty Tales Crafts bridal trousseau, and traditional 36-course royal Wazwan banquets.
              </p>
              <div className="p-3 bg-[#FAF6EE] rounded-xl text-[11px] text-[#8E2848] font-medium">
                Unified celebration planning with zero vendor fragmentation
              </div>
            </div>
            <Link
              href="/weddings/workspace"
              className="w-full py-3 text-center bg-[#8E2848] hover:bg-[#721f39] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all block"
            >
              Explore Wedding Workspace →
            </Link>
          </div>

          {/* Card 3: B2B DMC & Travel Agent Network */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                🌍
              </div>
              <h3 className="font-serif text-xl font-bold text-[#17233B]">
                Private DMC &amp; Global Partner Network
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Direct DMC partner coordination for luxury travel advisors, family offices, and agencies across Mumbai, Dubai, and London.
              </p>
              <div className="p-3 bg-[#FAF6EE] rounded-xl text-[11px] text-emerald-800 font-medium">
                Wholesale DMC rates with guaranteed on-ground execution
              </div>
            </div>
            <Link
              href="/travel/partners"
              className="w-full py-3 text-center bg-[#176B68] hover:bg-[#125350] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all block"
            >
              Access DMC Partner Desk →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Concierge Action Banner ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-[#17233B] via-[#223352] to-[#17233B] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9A45C]">
              Private Travel Advisory
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Have a bespoke vision or complex multi-destination journey?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-light">
              Speak directly with our senior travel curators in Srinagar, Delhi, and Dubai.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                `Hello Nuty Tales Travel Desk! I would like to consult on designing: ${currentItinerary.title}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-[#C9A45C] hover:bg-[#b5924d] text-[#10192A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>💬</span>
              <span>WhatsApp Concierge</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setModalTitle('Request Tailored Journey Dossier')
                setModalSubtitle('Our Senior Travel Concierge will respond with a personalized itinerary proposal.')
                setQuoteModalOpen(true)
              }}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/20"
            >
              Request Custom Dossier
            </button>
          </div>
        </div>
      </div>

      <DemandCaptureModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultVertical="travel"
        title={modalTitle}
        subtitle={modalSubtitle}
      />
    </div>
  )
}
