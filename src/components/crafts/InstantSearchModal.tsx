'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CLOTHING_PRODUCTS, ClothingProduct } from '@/lib/clothing-data'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

interface InstantSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectProduct?: (product: ClothingProduct) => void
}

const POPULAR_CRAFT_TAGS = [
  'Pashmina Shawls',
  'Kutch Ajrakh',
  'Lucknowi Chikankari',
  'Banarasi Brocade',
  'Ahimsa Eri Silk',
  'Pochampally Ikat',
  'Kashmir Pherans',
  'Kota Doria',
  'Patola Silk',
  'Kanchipuram',
]

export default function InstantSearchModal({
  isOpen,
  onClose,
  onSelectProduct,
}: InstantSearchModalProps) {
  const { formatCraftPrice } = useMarketCurrency()
  const [query, setQuery] = useState('')
  const [searchLatency, setSearchLatency] = useState(0.8)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Instant in-memory search
  const results = useMemo(() => {
    const start = performance.now()
    if (!query.trim()) {
      return CLOTHING_PRODUCTS.slice(0, 6)
    }
    const q = query.toLowerCase().trim()
    const matches = CLOTHING_PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.craft.toLowerCase().includes(q) ||
        (p.state && p.state.toLowerCase().includes(q)) ||
        (p.region && p.region.toLowerCase().includes(q)) ||
        p.material.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        (p.provenance.origin && p.provenance.origin.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      )
    })
    const duration = performance.now() - start
    setSearchLatency(Math.max(0.4, parseFloat(duration.toFixed(2))))
    return matches
  }, [query])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(results.length - 1, prev + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#10192A] text-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#C9A45C]/40 overflow-hidden font-sans space-y-0">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5">
          <span className="text-[#C9A45C] text-lg font-bold">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search all-India craft clothing (e.g. Ajrakh, Pashmina, Banarasi, Chikankari, Ikat)..."
            className="flex-1 bg-transparent text-white placeholder-stone-400 text-sm sm:text-base outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
            >
              Clear
            </button>
          )}
          <span className="px-2 py-1 rounded bg-white/10 text-stone-300 text-[10px] font-mono">
            ESC
          </span>
        </div>

        {/* Speed Telemetry & Tag Recommendations */}
        <div className="px-4 py-2.5 bg-black/40 border-b border-white/10 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-stone-300">
            <span className="text-emerald-400 font-mono font-bold">⚡ {searchLatency}ms</span>
            <span className="text-stone-400">· {results.length} matches across 46 Pan-India items</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[#C9A45C]">
            <span>Tip: Press [↑] [↓] to navigate, [Enter] to open</span>
          </div>
        </div>

        {/* Quick Tag Pills */}
        {!query && (
          <div className="p-4 border-b border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Popular Craft Traditions Across India
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_CRAFT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#C9A45C] hover:text-[#17233B] text-stone-300 text-xs transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-[55vh] overflow-y-auto divide-y divide-white/5 p-2">
          {results.length > 0 ? (
            results.map((product, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <Link
                  key={product.id}
                  href={`/crafts/product/${product.slug}`}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                    isSelected ? 'bg-white/15 scale-[1.01]' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-white hover:text-[#C9A45C]">
                          {product.name}
                        </span>
                        {product.provenance?.giTagCertified && (
                          <span className="px-1.5 py-0.2 rounded bg-[#C9A45C]/20 border border-[#C9A45C]/40 text-[#C9A45C] text-[9px] font-bold">
                            GI Certified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-300">
                        📍 {product.state || product.provenance.origin} · {product.craft}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {product.material} · ⏱️ {product.loomHours || product.provenance.artisanHours} Loom Hrs
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="font-serif font-bold text-sm text-[#C9A45C]">
                      {formatCraftPrice(product.price)}
                    </span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                      View Piece →
                    </span>
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="py-12 text-center text-stone-400 space-y-2">
              <span className="text-2xl block">🔍</span>
              <p className="text-sm font-medium">No handcrafted garments match &quot;{query}&quot;</p>
              <p className="text-xs text-stone-500">Try searching for Kashmir, Gujarat, Banaras, Kutch, or Silk.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/5 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
          <span>World’s Fastest Crafts E-Commerce Search</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-white"
          >
            Close Search [ESC]
          </button>
        </div>
      </div>
    </div>
  )
}
