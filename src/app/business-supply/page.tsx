'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  INDUSTRIES,
  BULK_INGREDIENTS_CATALOG,
  ENTERPRISE_FEATURES,
  NUT_PROCESSING_CUTS,
  BULK_PACKAGING_TIERS,
  SUPPLY_HUBS,
  IndustryProfile,
} from '@/lib/business-supply-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

// "WHAT DO YOU MAKE?" Primary Interactive Categories
const WHAT_DO_YOU_MAKE_OPTIONS = [
  { id: 'cat-hospitality', label: 'Hospitality', sub: 'Hotels · Resorts · Restaurants · Cafés', icon: '🏨', defaultIndSlug: 'hotels-resorts' },
  { id: 'cat-bakery', label: 'Bakery & Confectionery', sub: 'Bakeries · Cakes · Biscuits · Chocolates', icon: '🍰', defaultIndSlug: 'bakeries' },
  { id: 'cat-mithai', label: 'Sweets & Mithai', sub: 'Mithai · Kaju Katli · Barfi · Laddoo', icon: '🍬', defaultIndSlug: 'sweet-shops' },
  { id: 'cat-food-mfg', label: 'Food Manufacturing', sub: 'Snacks · Cereals · Granola · Energy Bars', icon: '🏭', defaultIndSlug: 'food-snack-manufacturers' },
  { id: 'cat-dairy', label: 'Dairy & Desserts', sub: 'Ice Cream · Kulfi · Shakes · Dairy Desserts', icon: '🥛', defaultIndSlug: 'ice-cream-dairy' },
  { id: 'cat-wellness', label: 'Health & Wellness', sub: 'Healthy Snacks · Nut Mixes · Protein Blends', icon: '🌿', defaultIndSlug: 'health-wellness-brands' },
  { id: 'cat-trade', label: 'Retail & Distribution', sub: 'Retailers · Supermarkets · Regional Distributors', icon: '📦', defaultIndSlug: 'retailers-supermarkets' },
  { id: 'cat-gifting', label: 'Gifting & Events', sub: 'Corporates · Weddings · Event Companies', icon: '🎁', defaultIndSlug: 'gifting-wedding-planners' },
  { id: 'cat-private-label', label: 'Private Label', sub: 'D2C Brands · Custom Packaging · Own Brand', icon: '🏷️', defaultIndSlug: 'private-label-d2c' },
]

export default function BusinessSupplyPage() {
  // Selected category in "What do you make?"
  const [activeCategory, setActiveCategory] = useState<string>('cat-bakery')
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryProfile>(INDUSTRIES[2]) // Bakeries

  // SI Business Supply Plan State
  const [mfgItem, setMfgItem] = useState<string>('Cakes & Pastries')
  const [mfgMonthlyKg, setMfgMonthlyKg] = useState<string>('500 kg')
  const [mfgProducts, setMfgProducts] = useState<string>('Almonds (Sliced) + Walnuts + Raisins')
  const [mfgLocation, setMfgLocation] = useState<string>('Delhi NCR / Noida Hub')
  const [siPlanGenerated, setSiPlanGenerated] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false)

  // Bulk Ingredients Filter
  const [activeIngredientCategory, setActiveIngredientCategory] = useState<string>('Whole Tree Nuts')

  // RFQ Form State
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [rfqNote, setRfqNote] = useState('')
  const [isSubmittingRfq, setIsSubmittingRfq] = useState(false)
  const [rfqSubmitted, setRfqSubmitted] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  // Handle switching in "What do you make?"
  const handleCategorySelect = (opt: typeof WHAT_DO_YOU_MAKE_OPTIONS[0]) => {
    setActiveCategory(opt.id)
    const match = INDUSTRIES.find((i) => i.slug === opt.defaultIndSlug) || INDUSTRIES[0]
    setSelectedIndustry(match)
    setMfgItem(match.useCases[0] || match.name)
    setMfgProducts(match.primaryProducts.slice(0, 3).join(' + '))
    setSiPlanGenerated(false)
  }

  // Generate SI Plan
  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true)
    setTimeout(() => {
      setIsGeneratingPlan(false)
      setSiPlanGenerated(true)
    }, 500)
  }

  // Submit RFQ
  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingRfq(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName || 'B2B Procurement Lead',
          phone,
          email,
          city: deliveryCity,
          businessName: companyName,
          message: `[B2B RFQ] Industry: ${selectedIndustry.name} | Monthly Vol: ${mfgMonthlyKg} | Products: ${mfgProducts} | Plant: ${mfgLocation} | Notes: ${rfqNote}`,
          source: 'business-supply-marketplace',
        }),
      })
    } catch {
      // ignore
    } finally {
      setIsSubmittingRfq(false)
      setRfqSubmitted(true)
    }
  }

  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Nutty Tales B2B Supply! 🏭\n\nI want to discuss an industrial supply contract:\n• Company: ${companyName || 'Corporate Client'}\n• Industry: ${selectedIndustry.name}\n• Monthly Volume: ${mfgMonthlyKg}\n• Ingredients: ${mfgProducts}\n• Plant City: ${mfgLocation || deliveryCity || 'PAN-India'}\n\nPlease share the formal quotation and product specification sheets!`,
  )}`

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      {/* ── 1. Hero Executive Sourcing Banner ────────────────────────────────────── */}
      <section className="relative w-full bg-[#17233B] text-white py-16 sm:py-24 border-b border-[#C9A45C]/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[11px] font-bold tracking-widest uppercase">
                <span>🏭</span> B2B INDUSTRIAL INGREDIENT MARKETPLACE
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
                  Nutty Tales Business Supply
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  Premium ingredients for businesses that make, serve and gift.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-stone-300">
                  Reliable raw ingredient procurement, mechanical processing cuts, and recurring contracts.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-2xl">
                We supply hotels, sweet manufacturers, commercial bakeries, biscuit plants, and confectionery brands across India. From whole jumbo nuts to paper-thin slices, slivers, dices, and blanched kernels — backed by FSSAI Central Reg. {FSSAI_NUMBER}, NABL batch analysis, and scheduled monthly freight.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#what-do-you-make"
                  className="px-6 py-3.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  <span>⚙️</span>
                  <span>Explore Industries: What Do You Make? ↓</span>
                </a>
                <a
                  href="#bulk-ingredients"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  Bulk Ingredients Catalog →
                </a>
              </div>

              {/* Multi-Warehouse Hub Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Noida HQ</span>
                  <span className="font-semibold text-white">Central Processing &amp; NCR Hub</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Kashmir Valley</span>
                  <span className="font-semibold text-white">Walnut &amp; Saffron Aggregation</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Patna / Bihar</span>
                  <span className="font-semibold text-white">Makhana Wetland Sourcing</span>
                </div>
              </div>
            </div>

            {/* Right Graphic Overview Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Campaign Poster Card */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/20 shadow-2xl group">
                <Image
                  src="/images/campaign-good-food-story.jpg"
                  alt="Good Food Has A Story — Nutty Tales Business Supply"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#10192A]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                    🏭 Thoughtfully Sourced · Responsibly Supplied
                  </span>
                  <p className="text-xs text-stone-200 font-light leading-snug">
                    Whole tree nuts, mechanical cuts &amp; recurring freight contracts across 15+ Indian commercial sectors.
                  </p>
                </div>
              </div>

              <div className="bg-[#10192A] rounded-3xl p-6 sm:p-7 border border-white/15 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#C9A45C]">
                    Recurring Supply Contract
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                    Active Capacity
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>Batch Quality Assurance:</span>
                    <span className="font-bold text-white">COA + NABL Lab Passed</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Packaging Formats:</span>
                    <span className="font-bold text-white">10kg Tin / 25kg Vacuum Sack</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Delivery Frequency:</span>
                    <span className="font-bold text-white">Weekly / Monthly Scheduled</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Price Protection:</span>
                    <span className="font-bold text-white">Quarterly Contract Locks</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Credit &amp; GST:</span>
                    <span className="font-bold text-white">Input Tax Credit (5% GST)</span>
                  </div>
                </div>

                {/* Banner Callout for Founder Program */}
                <div className="p-3.5 bg-gradient-to-r from-[#176B68]/30 to-[#C9A45C]/20 rounded-xl border border-[#C9A45C]/30 text-xs text-stone-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                    🚀 Launching a New Venture?
                  </span>
                  <p className="text-[11px] leading-snug">
                    Are you a D2C food brand, travel startup, clothing label or cloud kitchen? Check out our <strong>Nutty Tales Founder Program</strong>.
                  </p>
                  <Link href="/founders" className="inline-block text-[11px] font-bold text-[#C9A45C] hover:underline pt-0.5">
                    Explore Founder Program &amp; Small MOQs →
                  </Link>
                </div>

                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                  <span className="text-[11px] text-stone-300 block mb-2">Speak to Corporate Procurement Desk:</span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-2.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                  >
                    WhatsApp +91 9717161809
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Interactive Marketplace: "WHAT DO YOU MAKE?" ─────────────────────── */}
      <section id="what-do-you-make" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
            Interactive B2B Selector
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            What Do You Make?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Select your industry below. Our SI Supply Engine tailors product specs, precision cuts, and monthly contract ladders specifically to your production line.
          </p>
        </div>

        {/* 9 Category Visual Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {WHAT_DO_YOU_MAKE_OPTIONS.map((opt) => {
            const isSelected = opt.id === activeCategory
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleCategorySelect(opt)}
                className={`p-4 rounded-2xl text-center border transition-all flex flex-col items-center justify-between gap-2 shadow-sm ${
                  isSelected
                    ? 'bg-[#17233B] text-white border-[#C9A45C] ring-2 ring-[#C9A45C]/40 scale-105'
                    : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-800'
                }`}
              >
                <span className="text-2xl block">{opt.icon}</span>
                <span className="font-serif font-bold text-xs leading-tight block">{opt.label}</span>
                <span className={`text-[9px] line-clamp-2 block ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {opt.sub}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Selected Industry Dossier + Dynamic SI Supply Planner ─────────────── */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Industry Specs (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#FAF6EE] border-b lg:border-b-0 lg:border-r border-stone-200 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{selectedIndustry.icon}</span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#176B68]">
                  {selectedIndustry.categoryLabel} Profile
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                {selectedIndustry.name}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {selectedIndustry.tagline}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                  Primary Raw Materials:
                </span>
                <p className="font-medium text-[#17233B]">{selectedIndustry.primaryProducts.join(', ')}</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                  Precision Mechanical Cuts:
                </span>
                <p className="font-medium text-[#17233B]">{selectedIndustry.cutTypes.join(', ')}</p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32] block">
                  Quality &amp; Lab Standards:
                </span>
                <p className="font-medium text-[#17233B]">{selectedIndustry.fssaiStandard}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-[#17233B] block">
                Typical Production Use Cases:
              </span>
              <ul className="text-xs text-stone-600 space-y-1.5">
                {selectedIndustry.useCases.map((uc, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[#176B68] font-bold">✓</span>
                    <span>{uc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Dynamic SI Assistant "Your Business Supply Plan" (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#17233B] text-[#C9A45C] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <span>✨</span> SI BUSINESS SUPPLY COPILOT
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                Build Your Production Supply Plan
              </h3>
              <p className="text-xs text-stone-600">
                Configure your manufacturing parameters and let SI generate an instant allocation schedule.
              </p>
            </div>

            {/* Configurator Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-stone-700 font-bold mb-1.5">What do you manufacture?</label>
                <input
                  type="text"
                  value={mfgItem}
                  onChange={(e) => setMfgItem(e.target.value)}
                  placeholder="e.g. Cakes, Cookies, Kaju Katli, Ice Cream"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1.5">Approximate monthly requirement?</label>
                <select
                  value={mfgMonthlyKg}
                  onChange={(e) => setMfgMonthlyKg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
                >
                  <option value="100 kg">100 kg - 250 kg (Starter Batch)</option>
                  <option value="500 kg">500 kg - 1,000 kg (Commercial Line)</option>
                  <option value="2,500 kg">2,500 kg - 5,000 kg (Factory Run)</option>
                  <option value="10 Tons+">10 Tons+ (Container Volume)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1.5">Which products?</label>
                <input
                  type="text"
                  value={mfgProducts}
                  onChange={(e) => setMfgProducts(e.target.value)}
                  placeholder="e.g. Almonds + Walnuts + Raisins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1.5">Plant / Delivery Location?</label>
                <input
                  type="text"
                  value={mfgLocation}
                  onChange={(e) => setMfgLocation(e.target.value)}
                  placeholder="e.g. Delhi NCR, Mumbai, Bengaluru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm text-[#17233B] focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-stone-50"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="w-full py-3 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{isGeneratingPlan ? 'SI is compiling plan...' : '✨ Generate My Business Supply Plan'}</span>
            </button>

            {/* ── Generated Business Supply Plan Table ────────────────────────── */}
            {siPlanGenerated && (
              <div className="p-5 bg-[#FAF6EE] rounded-2xl border border-[#C9A45C]/50 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                      SI Recommended Allocation
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#17233B]">
                      YOUR BUSINESS SUPPLY PLAN ({mfgMonthlyKg} / Month)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                    NABL Lab Verified
                  </span>
                </div>

                {/* Structured Plan Table */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-300 text-[#704B32] uppercase text-[10px] tracking-wider">
                        <th className="py-2 font-bold">Product</th>
                        <th className="py-2 font-bold">Suggested Cut / Grade</th>
                        <th className="py-2 font-bold">Packaging</th>
                        <th className="py-2 font-bold">Monthly Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 text-stone-800">
                      <tr>
                        <td className="py-2.5 font-bold">Almonds</td>
                        <td className="py-2.5 text-stone-600">Precision Sliced 0.8–1.2mm</td>
                        <td className="py-2.5">25 kg Vacuum Sack</td>
                        <td className="py-2.5 font-bold text-[#176B68]">200 kg</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">Walnuts</td>
                        <td className="py-2.5 text-stone-600">Extra Light Kashmiri Halves (80%)</td>
                        <td className="py-2.5">10 kg Nitrogen Tin</td>
                        <td className="py-2.5 font-bold text-[#176B68]">100 kg</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">Raisins</td>
                        <td className="py-2.5 text-stone-600">Afghan Seedless Green Kishmish</td>
                        <td className="py-2.5">25 kg Export Box</td>
                        <td className="py-2.5 font-bold text-[#176B68]">200 kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
                  <span>📍 Recommended Fulfilment: <strong>{mfgLocation}</strong> via Nutty Tales Hub</span>
                  <span className="text-emerald-700 font-bold">Moisture &lt; 5% · Zero Foreign Shell</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="#rfq-form"
                    className="flex-1 py-3 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
                  >
                    Request Formal Business Quote ↓
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Instant WhatsApp Contract Desk</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. Complete Bulk Ingredients Catalog ──────────────────────────────────── */}
      <section id="bulk-ingredients" className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
              Industrial Raw Materials
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Bulk Ingredients Catalog
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              We are not just a dry-fruit seller. We are your commercial ingredient supplier across whole nuts, mechanical cuts, dried fruits, seeds, and graded makhana.
            </p>
          </div>

          {/* Catalog Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            {BULK_INGREDIENTS_CATALOG.map((grp) => (
              <button
                key={grp.category}
                type="button"
                onClick={() => setActiveIngredientCategory(grp.category)}
                className={`px-4 py-2 rounded-xl font-bold transition-all border ${
                  activeIngredientCategory === grp.category
                    ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {grp.category}
              </button>
            ))}
          </div>

          {/* Active Ingredients Grid */}
          {(() => {
            const currentGrp =
              BULK_INGREDIENTS_CATALOG.find((g) => g.category === activeIngredientCategory) ||
              BULK_INGREDIENTS_CATALOG[0]
            return (
              <div className="space-y-4">
                <div className="text-center text-xs text-stone-500 italic">
                  {currentGrp.tagline}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentGrp.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-[#FAF6EE] rounded-2xl border border-stone-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-lg text-[#17233B]">{item.name}</h4>
                          <span className="text-[10px] font-bold text-[#176B68] bg-white px-2 py-0.5 rounded border border-stone-200">
                            MOQ {item.moqKg} kg
                          </span>
                        </div>

                        <div className="text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#704B32] block">Grades:</span>
                          <p className="text-stone-700 font-medium">{item.grades.join(', ')}</p>
                        </div>

                        <div className="text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#704B32] block">Cuts &amp; Forms:</span>
                          <p className="text-stone-700">{item.availableCuts.join(', ')}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
                        <div>Origin: <strong className="text-stone-800">{item.origin}</strong></div>
                        <div>Pack: <span className="text-stone-700">{item.packaging}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      {/* ── 4. Nutty Tales Enterprise Supply ────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-[#17233B] text-white rounded-3xl p-8 sm:p-12 border border-[#C9A45C]/30 shadow-2xl space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#C9A45C] block">
              Multi-Location Procurement Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Nutty Tales Enterprise Supply: One Supplier. Multiple Locations.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              For hotel groups, restaurant chains, and national food manufacturers operating in multiple cities: centralized contract management, uniform nationwide pricing, and local hub dispatches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENTERPRISE_FEATURES.map((feat, idx) => (
              <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <span className="text-3xl block">{feat.icon}</span>
                <h4 className="font-serif font-bold text-base text-white">{feat.title}</h4>
                <p className="text-xs text-stone-300 font-light leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Example Contract Card */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/15 text-xs text-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                Representative Enterprise Model: National Hotel Chain
              </span>
              <p className="font-mono text-sm text-white">
                Delhi (300 kg) · Mumbai (200 kg) · Bengaluru (250 kg) · Srinagar (100 kg)
              </p>
              <p className="text-[11px] text-stone-400">
                Nutty Tales manages: Quote → Procurement → Warehousing → Allocation → Scheduled Delivery → Automated Reordering
              </p>
            </div>
            <a
              href="#rfq-form"
              className="px-6 py-3 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md whitespace-nowrap"
            >
              Set Up Enterprise Account →
            </a>
          </div>
        </div>
      </section>

      {/* ── 5. Formal RFQ Request Form ───────────────────────────────────────────── */}
      <section id="rfq-form" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#704B32] block">
              Direct Wholesale Procurement Desk
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#17233B] mt-1">
              Request Official Business Quote
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Receive a formal commercial proposal with lab specification sheets, GST input breakdown, and sample kit dispatch within 4 hours.
            </p>
          </div>

          <form onSubmit={handleRfqSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Oberoi Hotels / Haldiram's / Blue Tokai"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Procurement Officer / Contact Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="procurement@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Delivery City / Warehouse Hub *</label>
                <input
                  type="text"
                  required
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  placeholder="e.g. Noida / Mumbai / Bengaluru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Industry Sector</label>
                <select
                  value={selectedIndustry.id}
                  onChange={(e) => {
                    const match = INDUSTRIES.find((i) => i.id === e.target.value)
                    if (match) setSelectedIndustry(match)
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none bg-white"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Required Products, Cuts &amp; Monthly Volume Specifications
              </label>
              <textarea
                rows={3}
                value={rfqNote}
                onChange={(e) => setRfqNote(e.target.value)}
                placeholder="Mention specific grades (e.g. 500kg Sliced California Almonds 1.0mm, 200kg Kashmiri Walnut Halves, 50kg Mongra Saffron)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#176B68] focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmittingRfq}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmittingRfq ? 'Submitting...' : rfqSubmitted ? '✓ Quote Request Sent' : 'Submit Formal B2B RFQ'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Or Chat with Corporate Desk on WhatsApp (+91 9717161809)</span>
                <span>→</span>
              </a>
            </div>

            {rfqSubmitted && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                <span>
                  ✓ Your procurement RFQ has been received! Our B2B Account Specialist will dispatch the formal quotation and sample kit within 4 hours.
                </span>
                <button
                  type="button"
                  onClick={() => setRfqSubmitted(false)}
                  className="text-emerald-900 font-bold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
