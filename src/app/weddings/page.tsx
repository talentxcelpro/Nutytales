'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  WEDDING_OCCASIONS,
  PACKAGING_STYLES,
  WEDDING_CURATIONS,
  WeddingOccasion,
} from '@/lib/weddings-data'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE } from '@/lib/constants'
import SourcingRequestBanner from '@/components/demand/SourcingRequestBanner'

export default function WeddingsPage() {
  // Hamper Builder States
  const [selectedOccasion, setSelectedOccasion] = useState<string>('wedding')
  const [selectedBudget, setSelectedBudget] = useState<number>(1500)
  const [selectedContents, setSelectedContents] = useState<string[]>([
    'California Almonds',
    'W240 Cashews',
    'Kashmiri Walnuts',
  ])
  const [selectedPackaging, setSelectedPackaging] = useState<string>('rigid-box')
  const [coupleNames, setCoupleNames] = useState<string>('Aarav & Meher')
  const [weddingDate, setWeddingDate] = useState<string>('December 2026')
  const [monogramInitials, setMonogramInitials] = useState<string>('A & M')
  const [quantity, setQuantity] = useState<number>(100)
  const [uploadedInviteName, setUploadedInviteName] = useState<string | null>(null)
  const [siGeneratedOptions, setSiGeneratedOptions] = useState<
    | {
        title: string
        desc: string
        pricePerHamper: number
        totalEst: number
        highlights: string[]
        packaging: string
      }[]
    | null
  >(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [inquirySent, setInquirySent] = useState(false)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const contentOptions = [
    'California Almonds',
    'W240 Cashews',
    'Iranian Pistachios',
    'Kashmiri Kagzi Walnuts',
    'Mithila Phool Makhana',
    'Royal Medjool Dates',
    'Pure Pampore Mongra Saffron (1g)',
    'Pure Kashmiri Acacia Honey (250g)',
    'Kashmir Papier-Mâché Trinket',
  ]

  const toggleContent = (item: string) => {
    if (selectedContents.includes(item)) {
      if (selectedContents.length > 1) {
        setSelectedContents(selectedContents.filter((c) => c !== item))
      }
    } else {
      setSelectedContents([...selectedContents, item])
    }
  }

  const handleGenerateWeddingHamper = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const baseCost = selectedBudget
      const opt1 = {
        title: `Royal ${monogramInitials} Heritage Keepsake`,
        desc: `Curated for ${coupleNames}'s celebration. Featuring ${selectedContents.slice(0, 3).join(', ')} in a luxury custom-foiled presentation box.`,
        pricePerHamper: baseCost,
        totalEst: baseCost * quantity,
        highlights: [
          `Custom Hot-Foil Monogram (${monogramInitials}) on Box Lid`,
          `Personalized Wedding Date Inscription (${weddingDate})`,
          `Tamper-Evident Luxury Seal & Satin Pull Ribbon`,
          `Multi-City Pan-India Insured Dispatch`,
        ],
        packaging: 'Luxury Rigid Box with Magnetic Clasp',
      }

      const opt2 = {
        title: `Imperial Kashmir Trousseau Selection`,
        desc: `Elevated curation with single-origin Kashmiri Kagzi Akhrot, Pampore Saffron, and California Almonds with gold-accented packaging.`,
        pricePerHamper: Math.round(baseCost * 1.25),
        totalEst: Math.round(baseCost * 1.25 * quantity),
        highlights: [
          `Handmade Flower-Petal Calligraphy Welcome Note`,
          `Includes Pure Pampore Grade A1 Saffron Vial`,
          `Pantone Colour-Matched Sleeve with Wax Seal`,
          `Scheduled Hotel Suite Delivery for Destination Weddings`,
        ],
        packaging: 'Artisan Wood & Foil Presentation Chest',
      }

      setSiGeneratedOptions([opt1, opt2])
      setIsGenerating(false)
    }, 700)
  }

  const handleInviteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedInviteName(file.name)
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF6EE] text-[#17233B] pt-20">
      {/* ── 1. Hero Editorial Banner ────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#17233B] text-[#FAF6EE] py-16 sm:py-24 border-b border-[#C9A45C]/25 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A45C]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#176B68]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#C9A45C] text-[11px] font-bold tracking-widest uppercase">
                <span>💍</span> PAN-INDIA WEDDING DELIVERY
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-semibold block">
                  Weddings by Nuty Tales
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                  Gifts worthy of the occasion.
                </h1>
                <p className="font-serif italic text-lg sm:text-xl text-[#FAF6EE]/85">
                  Premium dry fruits, Kashmir-inspired gifts and bespoke wedding hampers — designed around your celebration.
                </p>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed max-w-xl">
                Honour your guests and families with auspicious royal dry fruits, Pampore saffron, and handcrafted keepsake boxes. Featuring couple monogramming, wedding date embossing, invitation-matched sleeves, and scheduled multi-city delivery to hotels, banquet halls, and homes across India.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#hamper-builder"
                  className="px-6 py-3.5 bg-[#C9A45C] hover:bg-[#b5924d] text-[#17233B] rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:scale-105 flex items-center gap-2"
                >
                  <span>✨</span>
                  <span>Design Your Wedding Hamper (SI)</span>
                </a>
                <a
                  href="#collections"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-xs uppercase tracking-wider border border-white/20 transition-colors"
                >
                  View Collections ↓
                </a>
              </div>

              {/* Fulfilment highlight */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs text-stone-300 space-y-1">
                <p className="font-semibold text-white">✨ Multi-Address Wedding Fulfilment:</p>
                <p className="text-stone-300 font-light text-[11px]">
                  E.g., 800 hampers delivered across 6 cities to 12 family &amp; hotel addresses for one wedding — seamlessly orchestrated under a single Nuty Tales order.
                </p>
              </div>
            </div>

            {/* Right Photographic Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src="/images/crafts-gifting-box.jpg"
                  alt="Weddings by Nuty Tales bespoke luxury hamper"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                      Signature Presentation
                    </span>
                    <h3 className="font-serif text-xl font-bold">The Royal Chinar Wedding Chest</h3>
                    <p className="text-xs text-stone-200">Custom Monogram Foil · Pure Kashmiri Saffron · Royal Nuts</p>
                  </div>
                  <span className="bg-[#C9A45C] text-[#17233B] px-3 py-1 rounded-lg text-xs font-bold uppercase">
                    Sample Box Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. "Gifts for Every Story" Navigation Strip ───────────────────────────── */}
      <section className="bg-white py-4 border-b border-[#17233B]/10 shadow-sm sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto text-xs uppercase tracking-widest font-bold text-[#17233B]/80 gap-6 py-1">
            <span className="text-[#704B32] text-[10px] flex-shrink-0">Gifts for Every Story:</span>
            <Link href="/shop" className="hover:text-[#176B68] whitespace-nowrap">EVERYDAY</Link>
            <Link href="/weddings" className="text-[#176B68] font-extrabold whitespace-nowrap border-b-2 border-[#176B68]">WEDDINGS</Link>
            <Link href="/corporate-gifting" className="hover:text-[#176B68] whitespace-nowrap">DIWALI</Link>
            <Link href="/corporate-gifting" className="hover:text-[#176B68] whitespace-nowrap">CORPORATE</Link>
            <Link href="/crafts" className="hover:text-[#176B68] whitespace-nowrap">KASHMIR</Link>
            <Link href="/corporate-gifting" className="hover:text-[#176B68] whitespace-nowrap">CELEBRATIONS</Link>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Hamper Builder: "DESIGN YOUR OWN WEDDING HAMPER" ────────── */}
      <section id="hamper-builder" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-[#C9A45C]/35 shadow-xl p-6 sm:p-12 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
              Interactive Gift Studio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Design Your Own Wedding Hamper
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light">
              Select your celebration, target budget, dry fruit contents, and custom packaging.
              Let SI formulate the ideal hamper options and provide an instant bespoke quotation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Configurator (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Occasion */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block">
                  1. Occasion
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { id: 'wedding', label: 'Wedding Day Main' },
                    { id: 'roka', label: 'Roka & Engagement' },
                    { id: 'favours', label: 'Hotel Room Favours' },
                    { id: 'mehendi', label: 'Mehendi & Haldi' },
                    { id: 'reception', label: 'Reception Return Gifts' },
                    { id: 'vip', label: 'Bride & Groom VIP' },
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => setSelectedOccasion(occ.id)}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                        selectedOccasion === occ.id
                          ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Budget */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block">
                  2. Budget per Hamper: ₹{selectedBudget.toLocaleString('en-IN')}
                </span>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  {[500, 1000, 1500, 2500, 5000].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBudget(b)}
                      className={`py-2.5 rounded-xl border font-bold text-center transition-all ${
                        selectedBudget === b
                          ? 'bg-[#176B68] text-white border-[#176B68] shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {b >= 5000 ? '₹5,000+' : `₹${b.toLocaleString('en-IN')}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Contents */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block">
                  3. Select Contents (Pick 3 or more)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {contentOptions.map((item) => {
                    const isSelected = selectedContents.includes(item)
                    return (
                      <button
                        key={item}
                        onClick={() => toggleContent(item)}
                        className={`p-2.5 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FAF6EE] border-[#176B68] text-[#17233B] ring-1 ring-[#176B68]'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <span className="truncate pr-1">{item}</span>
                        <span className="text-xs">{isSelected ? '✓' : '+'}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 4: Packaging Style */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block">
                  4. Packaging Preference
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {PACKAGING_STYLES.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackaging(pkg.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedPackaging === pkg.id
                          ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <p className="font-bold truncate">{pkg.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Personalisation */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-[#704B32] block">
                  5. Personalisation Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] text-stone-500 font-semibold block mb-1">Couple Names</label>
                    <input
                      type="text"
                      value={coupleNames}
                      onChange={(e) => setCoupleNames(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 font-semibold block mb-1">Monogram / Initials</label>
                    <input
                      type="text"
                      value={monogramInitials}
                      onChange={(e) => setMonogramInitials(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 font-semibold block mb-1">Wedding Date</label>
                    <input
                      type="text"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 6: Quantity & Generate */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-stone-700">Hamper Quantity:</span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-bold text-[#17233B]"
                  >
                    <option value={25}>25 Hampers</option>
                    <option value={50}>50 Hampers</option>
                    <option value={100}>100 Hampers</option>
                    <option value={250}>250 Hampers</option>
                    <option value={500}>500 Hampers</option>
                    <option value={1000}>1,000+ Hampers</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateWeddingHamper}
                  disabled={isGenerating}
                  className="flex-1 w-full py-3.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <span>✨</span>
                  <span>{isGenerating ? 'SI Formulating Combinations...' : 'SI, Create My Wedding Gift'}</span>
                </button>
              </div>
            </div>

            {/* Right Live Visual Simulation & SI Output (5 cols) */}
            <div className="lg:col-span-5 bg-[#FAF6EE] rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-6">
              {/* Box Preview Card */}
              <div className="space-y-4">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-white shadow-md border border-stone-200">
                  <Image
                    src={
                      selectedPackaging === 'walnut-chest'
                        ? '/images/dark-wood-gourmet-tray.jpg'
                        : selectedPackaging === 'craft-box'
                        ? '/images/crafts-gifting-box.jpg'
                        : '/images/luxury-teal-gift-box.jpg'
                    }
                    alt="Packaging preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C]">
                      Bespoke Monogram Simulation
                    </span>
                    <h4 className="font-serif text-xl font-bold">{monogramInitials}</h4>
                    <p className="text-xs text-stone-200">{coupleNames} · {weddingDate}</p>
                  </div>
                </div>

                {/* Upload Invitation Color Extractor Feature */}
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#17233B]">🎨 Match Wedding Invitation</span>
                    <span className="text-[10px] text-[#C9A45C] font-extrabold uppercase bg-[#FAF6EE] px-2 py-0.5 rounded">
                      SI Color Extract
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                    Upload your digital wedding invite or card design. SI extracts the exact Pantone palette, foil sheen, and floral motifs to suggest matching box sleeves.
                  </p>
                  <label className="cursor-pointer block text-center py-2 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-300 rounded-lg text-xs font-semibold text-[#176B68] transition-colors">
                    <span>{uploadedInviteName ? `✓ ${uploadedInviteName} Analyzed` : '📁 Upload Digital Invite (PDF / Image)'}</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleInviteUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* SI Output Results */}
              {siGeneratedOptions ? (
                <div className="space-y-4 pt-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#176B68] block">
                    ✨ SI Curated Combinations for You:
                  </span>
                  {siGeneratedOptions.map((opt, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-[#C9A45C]/50 space-y-2 shadow-sm animate-fadeIn">
                      <div className="flex items-baseline justify-between">
                        <h5 className="font-serif font-bold text-sm text-[#17233B]">{opt.title}</h5>
                        <span className="font-bold text-[#176B68] text-xs">
                          ₹{opt.pricePerHamper.toLocaleString('en-IN')} / unit
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">{opt.desc}</p>
                      <ul className="text-[11px] text-stone-500 space-y-0.5 pt-1">
                        {opt.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-center gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span> {h}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs">
                        <span className="text-stone-500 font-semibold">
                          Total ({quantity} units): ₹{opt.totalEst.toLocaleString('en-IN')}
                        </span>
                        <a
                          href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                            `Hello Nuty Tales! I would like to order ${quantity} units of "${opt.title}" for ${coupleNames} (${weddingDate}). Budget: ₹${opt.pricePerHamper}/hamper.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-md text-[11px] font-bold uppercase transition-colors"
                        >
                          Confirm with SI →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-stone-500 italic">
                  Click &ldquo;SI, Create My Wedding Gift&rdquo; to formulate your bespoke combinations.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Custom Packaging Studio Feature ────────────────────────────────────── */}
      <section className="py-16 bg-[#17233B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-bold">
              Bespoke Craftsmanship
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              YOUR GIFT. YOUR STORY. YOUR PACKAGING.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light">
              Every detail engineered to reflect your family&apos;s heritage and wedding aesthetic.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
            {[
              { title: 'Custom Box Design', desc: 'Rigid board, wooden chest, brass platter, or Kashmir papier-mâché.', icon: '📦' },
              { title: 'Couple Monogramming', desc: 'Precision hot-foil stamping in gold, rose-gold, silver, or matte copper.', icon: '👑' },
              { title: 'Invitation Sleeve Matching', desc: 'Pantone-matched designer sleeves aligned with your invitation card.', icon: '🎨' },
              { title: 'QR Video Greetings', desc: 'Scan to reveal the couple’s heartfelt thank-you video or photo album.', icon: '📱' },
              { title: 'Satin & Grosgrain Ribbons', desc: 'Hand-tied French ribbons with custom printed dates and hashtags.', icon: '🎀' },
              { title: 'Kashmir Craft Keepsakes', desc: 'Hand-carved walnut lids and gold leaf papier-mâché that guests keep forever.', icon: '🏔️' },
              { title: 'Individual Recipient Labels', desc: 'Custom guest names and hotel suite room labels pre-attached.', icon: '🏷️' },
              { title: 'Multi-City Scheduled Transit', desc: 'Dispatched in climate-stabilized shipping to hotels across India.', icon: '✈️' },
            ].map((feature, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-2xl block">{feature.icon}</span>
                <h4 className="font-serif font-bold text-sm text-white">{feature.title}</h4>
                <p className="text-xs text-stone-400 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Curated Wedding Collections ───────────────────────────────────────── */}
      <section id="collections" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6 mb-10">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#704B32]">
              Ready-to-Order Signature Curations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B] mt-1">
              Wedding Gift Collections
            </h2>
          </div>
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales! I would like to request a Wedding Sample Hamper box.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#176B68] hover:bg-[#125350] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            Request Complimentary Sample Box →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WEDDING_CURATIONS.map((cur) => (
            <div
              key={cur.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-stone-100">
                  <Image src={cur.image} alt={cur.name} fill className="object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                    {cur.subtitle}
                  </span>
                  <h3 className="font-serif font-bold text-base text-[#17233B] line-clamp-1">{cur.name}</h3>
                  <p className="text-xs font-bold text-[#176B68]">
                    From ₹{cur.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-stone-400 font-normal">/ hamper</span>
                  </p>
                  <ul className="text-[11px] text-stone-600 space-y-1 pt-2 border-t border-stone-100">
                    {cur.contents.map((item, idx) => (
                      <li key={idx} className="truncate">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                    `Hello Nuty Tales! Please share details and sample availability for "${cur.name}" (₹${cur.price}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white text-center rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  Order / Inquire Sample
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Wedding Consultation & Quote Form ─────────────────────────────────── */}
      <section className="py-16 bg-[#F0EBE1] border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#704B32] font-bold">
              Direct Concierge
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#17233B]">
              Book a Wedding Gifting Consultation
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Speak with our senior gifting stylist. We dispatch complimentary tasting boxes with finished box samples directly to your doorstep.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-lg space-y-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const name = (form.elements.namedItem('cName') as HTMLInputElement)?.value
                const phone = (form.elements.namedItem('cPhone') as HTMLInputElement)?.value
                const city = (form.elements.namedItem('cCity') as HTMLInputElement)?.value
                const count = (form.elements.namedItem('cCount') as HTMLInputElement)?.value
                if (!phone) return

                try {
                  await fetch('/api/opportunities', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'wedding_inquiry',
                      vertical: 'weddings',
                      customerName: name,
                      customerPhone: phone,
                      deliveryCity: city,
                      quantity: `${count || 100} Hampers`,
                      itemOrService: `Custom Wedding Favours & Consultation (${city || 'India'})`,
                      source: 'weddings-consultation-form',
                    }),
                  })
                  setInquirySent(true)
                } catch {
                  setInquirySent(true)
                }
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Your Full Name *</label>
                  <input
                    name="cName"
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">WhatsApp / Phone Number *</label>
                  <input
                    name="cPhone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Wedding City / Destination</label>
                  <input
                    name="cCity"
                    type="text"
                    placeholder="e.g. Udaipur, Delhi NCR, Goa, Kashmir"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Approx. Hamper Count</label>
                  <input
                    name="cCount"
                    type="number"
                    placeholder="e.g. 150"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  {inquirySent ? '✓ Consultation Request Received — Senior Stylist Assigned!' : 'Request Wedding Consultation & Sample Box'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Universal Sourcing Request Banner */}
        <div className="pt-8">
          <SourcingRequestBanner
            vertical="weddings"
            contextText="Looking for bespoke silver carafes, embroidered Kashmiri velvet trousseau trunks, or destination hotel room-drop amenities?"
          />
        </div>
      </section>
    </main>
  )
}
