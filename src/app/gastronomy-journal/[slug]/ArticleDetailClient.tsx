'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { JournalArticle, JOURNAL_ARTICLES } from '@/lib/journal-data'
import { formatGlobalPrice } from '@/lib/global-config'

interface ArticleDetailClientProps {
  article: JournalArticle
}

export default function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})
  const [addedItemKey, setAddedItemKey] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleVariantChange = (productId: string, variantIndex: number) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variantIndex,
    }))
  }

  const handleAddToCart = (product: JournalArticle['products'][0]) => {
    const variantIdx = selectedVariants[product.id] ?? 0
    const chosenVariant = product.variants[variantIdx] || product.variants[0]
    const itemKey = `${product.id}-${chosenVariant.label}`

    try {
      const existingRaw = localStorage.getItem('nutytales_cart')
      const cart = existingRaw ? JSON.parse(existingRaw) : []
      const existingIdx = cart.findIndex((i: any) => i.id === product.id && i.variant === chosenVariant.label)

      if (existingIdx > -1) {
        cart[existingIdx].quantity += 1
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: chosenVariant.retailPrice,
          variant: chosenVariant.label,
          quantity: 1,
        })
      }

      localStorage.setItem('nutytales_cart', JSON.stringify(cart))
      window.dispatchEvent(new Event('cart_updated'))
      setAddedItemKey(itemKey)
      setTimeout(() => setAddedItemKey(null), 2500)
    } catch {
      // Fallback
    }
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  // Related articles
  const otherArticles = JOURNAL_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0C120C] text-[#E8ECE9] font-sans selection:bg-[#E8A838]/30">
      {/* Top Breadcrumb & Share Navigation */}
      <div className="border-b border-[#2D4A3E]/30 bg-[#131D17]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-[#8FA396] overflow-x-auto">
            <Link href="/" className="hover:text-[#E8A838] transition-colors whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/gastronomy-journal" className="hover:text-[#E8A838] transition-colors whitespace-nowrap">The Gastronomy Journal</Link>
            <span>/</span>
            <span className="text-[#E8ECE9] truncate max-w-[200px] sm:max-w-sm">{article.title}</span>
          </nav>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2D4A3E] text-[#8FA396] hover:text-[#E8ECE9] hover:border-[#E8A838] transition-all whitespace-nowrap text-xs"
          >
            {copiedLink ? (
              <span className="text-[#E8A838]">✓ Copied Link</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Monograph Header */}
        <header className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#E8A838]/15 border border-[#E8A838]/30 text-[#E8A838] font-medium tracking-wider uppercase">
              {article.volume}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#1B2820] border border-[#2D4A3E]/40 text-[#8FA396]">
              {article.category}
            </span>
            <span className="text-[#8FA396]">· {article.readTime}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 text-[11px] font-mono">
              ✓ {article.labCertification}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#FAF7F2] leading-[1.15] tracking-tight">
            {article.title}
          </h1>

          <p className="text-lg sm:text-xl text-[#A3B8AC] font-serif italic leading-relaxed">
            {article.subtitle}
          </p>
        </header>

        {/* Lead Quote */}
        <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1B2820]/80 to-[#131D17]/80 border-l-4 border-[#E8A838] border-r border-t border-b border-[#2D4A3E]/30">
          <p className="text-lg sm:text-xl font-serif text-[#FAF7F2] leading-relaxed italic">
            {article.leadQuote}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-[#8FA396]">
            <span className="w-6 h-[1px] bg-[#E8A838]"></span>
            <span>Nuty Tales Himalayan Terroir & Botanical Science Archives</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-12 p-6 rounded-xl bg-[#1B2820]/40 border border-[#2D4A3E]/30 text-sm leading-relaxed text-[#A3B8AC]">
          <strong className="text-[#FAF7F2] font-semibold block mb-1">Archival Summary:</strong>
          {article.summary}
        </div>

        {/* Section 1: Botanical Science & Mechanism */}
        <section className="mb-14 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2] border-b border-[#2D4A3E]/40 pb-3">
            {article.botanicalScience.heading}
          </h2>

          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-[#D0DCD4] font-serif">
            {article.botanicalScience.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Key Analytical Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
            {article.botanicalScience.keyMetrics.map((metric, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#131D17] border border-[#2D4A3E]/40 space-y-1">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#8FA396]">
                  {metric.label}
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#E8A838]">
                  {metric.value}
                </div>
                <div className="text-[11px] text-[#8FA396] leading-tight">
                  {metric.hint}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: The Connoisseur Protocol */}
        <section className="mb-14 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2] border-b border-[#2D4A3E]/40 pb-3">
            {article.theProtocol.heading}
          </h2>

          <div className="space-y-4">
            {article.theProtocol.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-5 sm:p-6 rounded-2xl bg-[#131D17] border border-[#2D4A3E]/40 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start hover:border-[#E8A838]/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8A838]/15 border border-[#E8A838]/40 text-[#E8A838] font-mono font-bold flex items-center justify-center shrink-0 text-base">
                  {step.stepNumber}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#FAF7F2]">
                    {step.stepTitle}
                  </h3>
                  <p className="text-sm sm:text-base text-[#B8C8BE] leading-relaxed">
                    {step.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Connoisseur Tip Alert */}
          <div className="p-5 rounded-xl bg-amber-950/20 border border-amber-600/40 text-amber-200 text-sm leading-relaxed flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div>{article.theProtocol.connoisseurTip}</div>
          </div>
        </section>

        {/* Section 3: Direct Terroir Procurement (Featured Products) */}
        <section className="mb-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#1B2820] to-[#131D17] border border-[#2D4A3E]/60 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D4A3E]/40 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF7F2]">
                Source The Harvest
              </h2>
              <p className="text-xs sm:text-sm text-[#8FA396]">
                Single-origin botanical ingredients referenced in this monograph.
              </p>
            </div>
            <span className="text-xs font-mono text-[#E8A838] uppercase tracking-wider">
              100% Certified Origin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {article.products.map((product) => {
              const selectedIdx = selectedVariants[product.id] ?? 0
              const currentVariant = product.variants[selectedIdx] || product.variants[0]
              const isAdded = addedItemKey === `${product.id}-${currentVariant.label}`

              return (
                <div
                  key={product.id}
                  className="p-5 rounded-2xl bg-[#0C120C]/80 border border-[#2D4A3E]/50 flex flex-col justify-between space-y-4 hover:border-[#E8A838]/50 transition-all shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-xl bg-[#1B2820] border border-[#2D4A3E]/40 overflow-hidden shrink-0 relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-mono text-[#E8A838] tracking-wider uppercase block truncate">
                        {product.tag}
                      </span>
                      <Link
                        href={`/shop/${product.slug}`}
                        className="text-base font-bold text-[#FAF7F2] hover:text-[#E8A838] transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-lg font-bold font-mono text-[#FAF7F2]">
                          {formatGlobalPrice(currentVariant.retailPrice)}
                        </span>
                        {currentVariant.mrp && (
                          <span className="text-xs text-[#8FA396] line-through font-mono">
                            {formatGlobalPrice(currentVariant.mrp)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Variant Selection Pills */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-[#8FA396] uppercase tracking-wider">
                      Select Quantity:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {product.variants.map((v, vIdx) => (
                        <button
                          key={v.label}
                          onClick={() => handleVariantChange(product.id, vIdx)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border transition-all text-center ${
                            selectedIdx === vIdx
                              ? 'bg-[#E8A838] text-[#0C120C] border-[#E8A838] font-bold shadow-md'
                              : 'bg-[#131D17] text-[#D0DCD4] border-[#2D4A3E]/60 hover:border-[#8FA396]'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#E8A838] hover:bg-[#F0B84D] text-[#0C120C]'
                      }`}
                    >
                      {isAdded ? (
                        <>✓ Added to Cart</>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Add to Cart · {formatGlobalPrice(currentVariant.retailPrice)}
                        </>
                      )}
                    </button>
                    <Link
                      href={`/shop/${product.slug}`}
                      className="px-3 py-2.5 rounded-xl border border-[#2D4A3E] text-[#8FA396] hover:text-[#FAF7F2] hover:border-[#8FA396] text-xs font-mono transition-colors"
                      title="View Full Technical Details"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Read Next Recommendations */}
        {otherArticles.length > 0 && (
          <section className="pt-10 border-t border-[#2D4A3E]/40 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FAF7F2]">
                Further Reading from The Archives
              </h2>
              <Link
                href="/gastronomy-journal"
                className="text-xs font-mono text-[#E8A838] hover:underline"
              >
                View All Monographs →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherArticles.map((other) => (
                <Link
                  key={other.id}
                  href={`/gastronomy-journal/${other.id}`}
                  className="group p-5 rounded-2xl bg-[#131D17] border border-[#2D4A3E]/40 hover:border-[#E8A838]/60 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#E8A838] uppercase tracking-wider block">
                      {other.volume}
                    </span>
                    <h3 className="text-sm font-bold font-serif text-[#FAF7F2] group-hover:text-[#E8A838] transition-colors line-clamp-2">
                      {other.title}
                    </h3>
                  </div>
                  <div className="text-xs text-[#8FA396] flex items-center justify-between pt-2 border-t border-[#2D4A3E]/30 font-mono">
                    <span>{other.readTime}</span>
                    <span className="text-[#E8A838] group-hover:translate-x-1 transition-transform">Read →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
