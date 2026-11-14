'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatGlobalPrice } from '@/lib/global-config'

import { JournalArticle, JOURNAL_ARTICLES as ARTICLES } from '@/lib/journal-data'
export type { JournalArticle }

export default function GastronomyJournalClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [expandedArticleId, setExpandedArticleId] = useState<string>('mamra-enzymatic-awakening')
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})
  const [addedItemKey, setAddedItemKey] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Saffron Blooming Simulator State
  const [saffronLiquid, setSaffronLiquid] = useState<'water' | 'milk' | 'kehwa' | 'ice'>('ice')
  const [saffronThreads, setSaffronThreads] = useState<number>(6)
  const [simulatedMinutes, setSimulatedMinutes] = useState<number>(18)

  // Mamra Soaking Helper State
  const [mamraCount, setMamraCount] = useState<number>(7)

  const filteredArticles =
    activeCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) => a.categorySlug === activeCategory)

  const handleSelectVariant = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }))
  }

  const handleAddToCart = (product: JournalArticle['products'][0]) => {
    try {
      const variantIdx = selectedVariants[product.id] || 0
      const currentVariant = product.variants[variantIdx] || product.variants[0]
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const item = {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        mode: 'retail',
        sizeLabel: currentVariant.label,
        unitPrice: currentVariant.retailPrice,
        quantity: 1,
        totalPrice: currentVariant.retailPrice,
        image: product.image,
      }
      existing.push(item)
      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))
      window.dispatchEvent(new Event('nt_open_cart'))

      const itemKey = `${product.id}-${currentVariant.label}`
      setAddedItemKey(itemKey)
      setTimeout(() => setAddedItemKey(null), 2500)
    } catch {
      // Fallback
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#17233B]">
      {/* ── 1. Masthead & Editorial Header ── */}
      <section className="border-b border-[#EAE3D5] bg-[#FAF5ED]/60 pt-28 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17233B]/5 border border-[#17233B]/10 text-xs font-semibold uppercase tracking-[0.2em] text-[#704B32]">
            <span>📖</span> Nuty Tales Himalayan Terroir Archives
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#17233B] leading-[1.08]">
            The Gastronomy Journal
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-[#8C7E70] max-w-3xl mx-auto font-normal">
            Botanical science, bioactive lipid profiles, and ancient culinary rituals from the high valleys of Kashmir and the Silk Route.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-[#8C7E70] font-mono">
            <span>Volume IV · Year 2026</span>
            <span>•</span>
            <span>Central FSSAI: 22724441000048</span>
            <span>•</span>
            <span>Himalayan Single-Origin Verified</span>
            <span>•</span>
            <button
              onClick={handleCopyLink}
              className="text-[#17233B] hover:text-[#C9A45C] underline underline-offset-4 font-sans font-semibold transition"
            >
              {copiedLink ? '✓ Link Copied' : 'Share Journal'}
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Editorial Filter Nav ── */}
      <section className="sticky top-20 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE3D5] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 flex-nowrap">
            {[
              { id: 'all', label: 'All Monographs' },
              { id: 'rituals', label: 'Morning Rituals & Lipids' },
              { id: 'saffron', label: 'Saffron Chemistry' },
              { id: 'terroir', label: 'Walnut Pellicle & Terroir' },
              { id: 'ancient', label: 'Mithila Makhana Ethnobotany' },
              { id: 'pairings', label: 'Silk Route Pairings & Wazwan' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#17233B] text-white shadow-xs'
                    : 'bg-white text-[#704B32] hover:bg-stone-100 border border-[#EAE3D5]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#17233B] hover:text-[#C9A45C] transition uppercase tracking-wider whitespace-nowrap"
          >
            <span>Explore All Gourmet Harvest</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── 3. Interactive Saffron & Bioactive Connoisseur Labs (Top Bar Feature) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lab 1: Saffron Crocin Bloom Kinetics Simulator */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-2xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                  Interactive Micro-Lab · Spectrophotometry
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
                  Saffron Crocin Blooming Simulator
                </h3>
              </div>
              <span className="text-2xl">✨</span>
            </div>

            <p className="text-xs text-[#7A6D5E] leading-relaxed">
              Experience why authentic Grade-1 Pampore Mongra takes 20 minutes to reach its peak imperial sunset hue, rather than bleeding synthetic color instantly.
            </p>

            {/* Preparation Liquid Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8C7E70] block">
                Infusion Medium
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'ice', label: '🧊 Ice Shock (Royal)' },
                  { id: 'water', label: '💧 Spring Water (22°C)' },
                  { id: 'milk', label: '🥛 Warm A2 Milk (45°C)' },
                  { id: 'kehwa', label: '🍵 Kashmiri Kehwa' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSaffronLiquid(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition text-center ${
                      saffronLiquid === item.id
                        ? 'bg-[#17233B] text-white shadow-xs'
                        : 'bg-[#FAF5ED] text-[#704B32] hover:bg-stone-200 border border-[#EAE3D5]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thread Count & Time Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8C7E70] font-medium">Stigma Threads:</span>
                  <span className="font-mono font-bold text-[#17233B]">{saffronThreads} threads</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="14"
                  value={saffronThreads}
                  onChange={(e) => setSaffronThreads(Number(e.target.value))}
                  className="w-full accent-[#B8934A]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#8C7E70] font-medium">Steeping Duration:</span>
                  <span className="font-mono font-bold text-[#17233B]">{simulatedMinutes} minutes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={simulatedMinutes}
                  onChange={(e) => setSimulatedMinutes(Number(e.target.value))}
                  className="w-full accent-[#B8934A]"
                />
              </div>
            </div>

            {/* Visual Bloom Gauge */}
            <div className="p-4 rounded-2xl bg-[#FAF5ED] border border-[#EAE3D5] flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex-shrink-0 border-2 border-white shadow-inner flex items-center justify-center transition-colors duration-500"
                style={{
                  backgroundColor:
                    simulatedMinutes < 5
                      ? '#FEF3C7'
                      : simulatedMinutes < 12
                      ? '#FBBF24'
                      : simulatedMinutes < 20
                      ? '#F59E0B'
                      : '#D97706',
                }}
              >
                <span className="text-sm font-bold text-[#17233B]">
                  {Math.min(100, Math.round((simulatedMinutes / 20) * 100))}%
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-semibold text-[#17233B]">
                  {simulatedMinutes < 5 && 'Phase 1: Pale Tendril Diffusion (Delicate golden streamers)'}
                  {simulatedMinutes >= 5 && simulatedMinutes < 12 && 'Phase 2: Carotenoid Dissolution (Crocin active dispersion)'}
                  {simulatedMinutes >= 12 && simulatedMinutes < 20 && 'Phase 3: Deep Sunset Amber (Peak optical density & Safranal release)'}
                  {simulatedMinutes >= 20 && 'Phase 4: Imperial Royal Extraction (Maximum bio-availability attained)'}
                </p>
                <p className="text-[#8C7E70]">
                  Crocin Index reading: ~{(simulatedMinutes * 8.5 + saffronThreads * 12).toFixed(0)} units. Authentic Mongra stigmas remain completely intact.
                </p>
              </div>
            </div>
          </div>

          {/* Lab 2: Mamra Soaking & Activation Helper */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D5] shadow-2xs space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                  Interactive Micro-Lab · Enzymatic Phytase
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#17233B]">
                  Mamra Dawn Soaking Calculator
                </h3>
              </div>
              <span className="text-2xl">🌱</span>
            </div>

            <p className="text-xs text-[#7A6D5E] leading-relaxed">
              Calculate your personal morning ration of wild mountain seedling Mamra badam, water volume, and unlocked lipid bio-availability.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#8C7E70] font-medium">Daily Connoisseur Kernels:</span>
                <span className="font-mono font-bold text-[#17233B]">{mamraCount} Kernels (~{(mamraCount * 1.1).toFixed(1)}g)</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={mamraCount}
                onChange={(e) => setMamraCount(Number(e.target.value))}
                className="w-full accent-[#B8934A]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#EAE3D5]">
                <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">Water Volume</span>
                <span className="font-mono text-base font-bold text-[#17233B]">{mamraCount * 15} ml</span>
                <span className="text-[9px] text-[#8C7E70]">Glass / terracotta</span>
              </div>

              <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#EAE3D5]">
                <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">Soak Duration</span>
                <span className="font-mono text-base font-bold text-[#17233B]">8 Hours</span>
                <span className="text-[9px] text-[#8C7E70]">Overnight at 18°C</span>
              </div>

              <div className="p-3 bg-[#FAF5ED] rounded-2xl border border-[#EAE3D5]">
                <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">Lipid Yield</span>
                <span className="font-mono text-base font-bold text-emerald-800">
                  +310%
                </span>
                <span className="text-[9px] text-[#8C7E70]">Enzyme access</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#5C4F41] flex items-center gap-3">
              <span className="text-lg">🍯</span>
              <p className="leading-snug">
                <strong>Synergy Pairing:</strong> Combine with 1 tsp raw Kashmiri Acacia Honey. The non-crystallizing levulose prevents morning glycemic spikes while assisting cellular absorption of oleic acid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Main Monographs Catalog ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {filteredArticles.map((article, idx) => {
          const isExpanded = expandedArticleId === article.id

          return (
            <article
              key={article.id}
              id={article.id}
              className="bg-white rounded-3xl border border-[#EAE3D5] overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300"
            >
              {/* Article Hero Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-[#EAE3D5]">
                {/* Visual Image Canvas (5 cols) */}
                <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full bg-stone-100">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    priority={idx === 0}
                    quality={80}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                  <div className="absolute bottom-4 left-4 right-4 lg:hidden text-white">
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Editorial Monograph Details (7 cols) */}
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#B8934A]">
                        {article.volume}
                      </span>
                      <span className="text-[#8C7E70] font-mono">
                        {article.readTime} • {article.labCertification}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#17233B] leading-tight">
                      {article.title}
                    </h2>

                    <p className="text-sm sm:text-base text-[#7A6D5E] font-light leading-relaxed">
                      {article.subtitle}
                    </p>

                    <blockquote className="border-l-2 border-[#B8934A] pl-4 italic text-sm text-[#5C4F41] bg-[#FAF5ED]/50 py-2 rounded-r-xl">
                      {article.leadQuote}
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t border-[#F0EBE1] flex flex-wrap items-center justify-between gap-4">
                    <button
                      onClick={() => setExpandedArticleId(isExpanded ? '' : article.id)}
                      className="px-6 py-2.5 rounded-full bg-[#17233B] hover:bg-[#203050] text-white text-xs font-semibold uppercase tracking-wider transition shadow-2xs"
                    >
                      {isExpanded ? 'Collapse Monograph ▴' : 'Read Full Scientific Monograph ▾'}
                    </button>

                    <div className="flex items-center gap-2 text-xs text-[#8C7E70]">
                      <span>Terroir: High Himalayas</span>
                      <span>•</span>
                      <span className="text-emerald-800 font-semibold">100% Single-Tree Traceable</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Deep Scientific Monograph & Protocol */}
              {isExpanded && (
                <div className="p-6 sm:p-10 space-y-12 bg-[#FAF5ED]/30 animate-in fade-in duration-300">
                  {/* Botanical Science & Metrics */}
                  <div className="space-y-6">
                    <div className="border-b border-[#EAE3D5] pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                        Section I · Phytochemical Analysis
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                        {article.botanicalScience.heading}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#5C4F41] leading-relaxed font-light">
                      <div className="space-y-4">
                        <p>{article.botanicalScience.paragraphs[0]}</p>
                        {article.botanicalScience.paragraphs[1] && (
                          <p>{article.botanicalScience.paragraphs[1]}</p>
                        )}
                      </div>
                      <div className="space-y-4">
                        {article.botanicalScience.paragraphs[2] && (
                          <p>{article.botanicalScience.paragraphs[2]}</p>
                        )}
                        {article.botanicalScience.paragraphs[3] && (
                          <p>{article.botanicalScience.paragraphs[3]}</p>
                        )}
                      </div>
                    </div>

                    {/* Scientific Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                      {article.botanicalScience.keyMetrics.map((metric) => (
                        <div
                          key={metric.label}
                          className="bg-white p-4 rounded-2xl border border-[#EAE3D5] space-y-1"
                        >
                          <span className="text-[10px] text-[#8C7E70] uppercase font-bold block">
                            {metric.label}
                          </span>
                          <span className="font-mono text-xl font-bold text-[#17233B] block">
                            {metric.value}
                          </span>
                          <span className="text-[10px] text-[#8C7E70] block leading-tight">
                            {metric.hint}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* The Culinary / Medicinal Protocol */}
                  <div className="space-y-6">
                    <div className="border-b border-[#EAE3D5] pb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                        Section II · The Connoisseur Ritual
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                        {article.theProtocol.heading}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {article.theProtocol.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="bg-white p-5 rounded-2xl border border-[#EAE3D5] space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1.5">
                            <span className="font-mono text-sm font-bold text-[#B8934A]">
                              {st.stepNumber}
                            </span>
                            <h4 className="font-serif text-base font-bold text-[#17233B]">
                              {st.stepTitle}
                            </h4>
                            <p className="text-xs text-[#5C4F41] leading-relaxed font-light">
                              {st.instruction}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-[#17233B] text-white text-xs flex items-center gap-3">
                      <span className="text-lg">💡</span>
                      <p className="leading-relaxed">
                        {article.theProtocol.connoisseurTip}
                      </p>
                    </div>
                  </div>

                  {/* Harvest Used in this Ritual (Direct Commerce Integration) */}
                  <div className="space-y-6 pt-4 border-t border-[#EAE3D5]">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8934A]">
                          Section III · Sourced Harvest
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                          Gourmet Harvest Used in this Ritual
                        </h3>
                      </div>
                      <span className="text-xs text-[#8C7E70]">
                        Packed in airtight nitrogen-flushed standing pouches
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {article.products.map((prod) => {
                        const variantIdx = selectedVariants[prod.id] || 0
                        const currentVariant = prod.variants[variantIdx] || prod.variants[0]
                        const isAdded = addedItemKey === `${prod.id}-${currentVariant.label}`

                        return (
                          <div
                            key={prod.id}
                            className="bg-white rounded-2xl border border-[#EAE3D5] p-5 space-y-4 flex flex-col justify-between hover:border-[#B8934A] transition-colors"
                          >
                            <div className="space-y-3">
                              <div className="relative h-44 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 flex items-center justify-center">
                                <Image
                                  src={prod.image}
                                  alt={prod.name}
                                  fill
                                  sizes="(max-width: 640px) 100vw, 30vw"
                                  className="object-contain p-2"
                                />
                                <span className="absolute top-2.5 left-2.5 text-[9px] bg-[#17233B]/85 text-white uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full">
                                  {prod.tag}
                                </span>
                              </div>

                              <Link
                                href={`/shop/${prod.slug}`}
                                className="font-serif text-lg font-bold text-[#17233B] hover:text-[#B8934A] transition-colors block line-clamp-1"
                              >
                                {prod.name}
                              </Link>

                              {/* Pack Size Segmented Toggle */}
                              <div className="flex rounded-full bg-[#FAF5ED] p-1 border border-[#EAE3D5]">
                                {prod.variants.map((v, vIndex) => (
                                  <button
                                    key={v.label}
                                    type="button"
                                    onClick={() => handleSelectVariant(prod.id, vIndex)}
                                    className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all text-center ${
                                      variantIdx === vIndex
                                        ? 'bg-[#17233B] text-white shadow-2xs'
                                        : 'text-[#704B32] hover:text-[#17233B]'
                                    }`}
                                  >
                                    {v.label}
                                  </button>
                                ))}
                              </div>

                              {/* Price */}
                              <div className="flex items-baseline justify-between pt-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="font-serif text-xl font-bold text-[#17233B]">
                                    {formatGlobalPrice(currentVariant.retailPrice)}
                                  </span>
                                  {currentVariant.mrp && currentVariant.mrp > currentVariant.retailPrice && (
                                    <span className="text-xs text-stone-400 line-through">
                                      {formatGlobalPrice(currentVariant.mrp)}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-emerald-800 font-semibold uppercase">
                                  ✓ In Stock
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2">
                              <button
                                type="button"
                                onClick={() => handleAddToCart(prod)}
                                className={`w-full py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs active:scale-95 flex items-center justify-center gap-1.5 ${
                                  isAdded
                                    ? 'bg-emerald-700 text-white'
                                    : 'bg-[#17233B] hover:bg-[#203050] text-white'
                                }`}
                              >
                                <span>{isAdded ? '✓ Added to Basket' : 'Add Harvest to Basket'}</span>
                              </button>

                              <Link
                                href={`/shop/${prod.slug}`}
                                className="block text-center text-[11px] text-[#8C7E70] hover:text-[#17233B] underline underline-offset-2"
                              >
                                View Detailed Terroir &amp; Specs →
                              </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </section>

      {/* ── 5. Editorial Footer & Connoisseur Guild Invitation ── */}
      <section className="bg-[#FAF5ED] border-t border-[#EAE3D5] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8934A]">
            The Himalayan Terroir Charter
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
            Preserving Single-Origin Himalayan Heritage
          </h2>

          <p className="text-sm sm:text-base text-[#7A6D5E] font-light leading-relaxed max-w-2xl mx-auto">
            Every harvest documented in this journal is procured directly from family-tended mountain orchards and aquatic wetlands, tested by NABL-accredited laboratories, and shipped in nitrogen-flushed barrier pouches.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="px-8 py-3.5 bg-[#17233B] hover:bg-[#203050] text-white rounded-full text-xs font-semibold uppercase tracking-widest shadow-sm transition"
            >
              Shop All Harvest Collections
            </Link>
            <Link
              href="/explore"
              className="px-8 py-3.5 bg-white hover:bg-stone-100 text-[#17233B] border border-[#EAE3D5] rounded-full text-xs font-semibold uppercase tracking-widest transition"
            >
              Discover Terroir Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
