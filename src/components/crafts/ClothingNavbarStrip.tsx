'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRIMARY_CLOTHING_NAV, SECONDARY_COLLECTIONS } from '@/lib/clothing-data'

interface ClothingNavbarStripProps {
  onSearchChange?: (val: string) => void
  activeCollection?: string
  onSelectCollection?: (col: string) => void
}

export default function ClothingNavbarStrip({
  onSearchChange,
  activeCollection,
  onSelectCollection,
}: ClothingNavbarStripProps) {
  const pathname = usePathname()
  const [wishlistCount, setWishlistCount] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const updateCount = () => {
      try {
        const list = JSON.parse(localStorage.getItem('nt_wishlist') || '[]')
        setWishlistCount(list.length)
      } catch {
        // ignore
      }
    }
    updateCount()
    window.addEventListener('nt_wishlist_updated', updateCount)
    return () => window.removeEventListener('nt_wishlist_updated', updateCount)
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (onSearchChange) {
      onSearchChange(e.target.value)
    }
  }

  return (
    <div className="w-full bg-white border-b border-stone-200 sticky top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Primary Department Row ────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-stone-100 py-2.5 overflow-x-auto no-scrollbar gap-4 text-xs font-bold tracking-widest uppercase">
          <nav className="flex items-center space-x-6 sm:space-x-8 whitespace-nowrap">
            {PRIMARY_CLOTHING_NAV.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={`py-1 transition-colors relative ${
                    isActive
                      ? 'text-[#176B68] font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#176B68]'
                      : 'text-[#17233B]/80 hover:text-[#176B68]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions (Search, Wishlist) */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-stone-200 flex-shrink-0">
            {searchOpen ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search craft, fabric, colour..."
                  className="px-3 py-1.5 rounded-full border border-stone-300 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-[#176B68]"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false)
                    setSearchTerm('')
                    if (onSearchChange) onSearchChange('')
                  }}
                  className="ml-1 text-stone-500 hover:text-stone-800 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-stone-600 hover:text-[#176B68] flex items-center gap-1 text-[11px]"
                title="Search Collection"
              >
                <span>🔍</span>
                <span>Search</span>
              </button>
            )}

            <Link
              href="/crafts?wishlist=true"
              className="flex items-center gap-1 text-stone-600 hover:text-[#176B68] text-[11px]"
              title="Saved Items"
            >
              <span className="text-rose-500">♥</span>
              <span>Saved ({wishlistCount})</span>
            </Link>
          </div>
        </div>

        {/* ── 2. Secondary Seasonal Strip ─────────────────────────────────────── */}
        <div className="py-2 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar text-[10px] font-bold tracking-wider uppercase text-stone-600 whitespace-nowrap">
          <div className="flex items-center space-x-5">
            <span className="text-[#C9A45C] font-extrabold flex items-center gap-1">
              <span>✦</span> FALL / WINTER 2026
            </span>
            {SECONDARY_COLLECTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCollection && onSelectCollection(c.id)}
                className={`transition-colors py-0.5 ${
                  activeCollection === c.id
                    ? 'text-[#17233B] font-extrabold underline underline-offset-4'
                    : 'hover:text-[#17233B]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#704B32] font-semibold text-[10px]">
            <span>Verified Kashmir Provenance</span>
            <span>•</span>
            <span>GI Certified Authentic Weaves</span>
          </div>
        </div>
      </div>
    </div>
  )
}
