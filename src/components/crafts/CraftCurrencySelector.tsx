'use client'

import React, { useState, useRef, useEffect } from 'react'
import { CurrencyCode } from '@/lib/global-config'
import { useMarketCurrency } from '@/hooks/useMarketCurrency'

export interface CurrencyItem {
  code: CurrencyCode
  symbol: string
  label: string
  flag: string
  region: 'India' | 'America' | 'Europe' | 'Gulf' | 'Asia Pacific'
  markupTag: string
  isInflated200: boolean
}

export const CRAFT_CURRENCIES: CurrencyItem[] = [
  {
    code: 'INR',
    symbol: '₹',
    label: 'Indian Rupee',
    flag: '🇮🇳',
    region: 'India',
    markupTag: 'Base Weaver Rate (Domestic)',
    isInflated200: false,
  },
  {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar',
    flag: '🇺🇸',
    region: 'America',
    markupTag: '+200% Luxury Export & Insured Cargo',
    isInflated200: true,
  },
  {
    code: 'EUR',
    symbol: '€',
    label: 'Euro',
    flag: '🇪🇺',
    region: 'Europe',
    markupTag: '+200% European Air Freight & Duties',
    isInflated200: true,
  },
  {
    code: 'GBP',
    symbol: '£',
    label: 'British Pound',
    flag: '🇬🇧',
    region: 'Europe',
    markupTag: '+200% UK Luxury Handloom Courier',
    isInflated200: true,
  },
  {
    code: 'CAD',
    symbol: 'CA$',
    label: 'Canadian Dollar',
    flag: '🇨🇦',
    region: 'America',
    markupTag: '+200% North American Air Freight',
    isInflated200: true,
  },
  {
    code: 'AED',
    symbol: 'AED',
    label: 'UAE Dirham',
    flag: '🇦🇪',
    region: 'Gulf',
    markupTag: 'Gulf Air Express',
    isInflated200: false,
  },
  {
    code: 'AUD',
    symbol: 'A$',
    label: 'Australian Dollar',
    flag: '🇦🇺',
    region: 'Asia Pacific',
    markupTag: 'Pacific Insured Cargo',
    isInflated200: false,
  },
  {
    code: 'SAR',
    symbol: 'SAR',
    label: 'Saudi Riyal',
    flag: '🇸🇦',
    region: 'Gulf',
    markupTag: 'Middle East Express',
    isInflated200: false,
  },
  {
    code: 'SGD',
    symbol: 'S$',
    label: 'Singapore Dollar',
    flag: '🇸🇬',
    region: 'Asia Pacific',
    markupTag: 'ASEAN Air Express',
    isInflated200: false,
  },
]

export default function CraftCurrencySelector({
  variant = 'compact',
}: {
  variant?: 'compact' | 'header' | 'footer'
}) {
  const { currency, setMarketCurrency, isWesternMarket } = useMarketCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeItem =
    CRAFT_CURRENCIES.find((c) => c.code === currency) || CRAFT_CURRENCIES[0]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (code: CurrencyCode) => {
    setMarketCurrency(code)
    setIsOpen(false)
  }

  if (variant === 'compact') {
    return (
      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            isWesternMarket
              ? 'bg-[#C9A45C] text-[#17233B] shadow-xs'
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title="Switch Global Currency & Export Pricing"
        >
          <span>{activeItem.flag}</span>
          <span>{activeItem.code}</span>
          <span className="opacity-70">({activeItem.symbol})</span>
          {isWesternMarket && (
            <span className="hidden sm:inline text-[9px] bg-[#10192A] text-[#C9A45C] px-1 py-0.2 rounded font-extrabold uppercase">
              +200% Export
            </span>
          )}
          <span className="text-[9px] opacity-75">▼</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-[#10192A] border border-white/15 text-white shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl animate-fadeIn">
            <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9A45C]">
                Global Currency Switcher
              </span>
              <span className="text-[9px] text-stone-400">9 Currencies</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-0.5 py-1">
              {CRAFT_CURRENCIES.map((item) => {
                const isSelected = item.code === currency
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors text-left ${
                      isSelected
                        ? 'bg-[#C9A45C] text-[#17233B] font-bold'
                        : 'hover:bg-white/10 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{item.code}</span>
                          <span className="opacity-75">({item.symbol})</span>
                        </div>
                        <span
                          className={`text-[10px] block ${
                            isSelected ? 'text-[#17233B]/80' : 'text-stone-400'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {item.isInflated200 ? (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-[#17233B] text-[#C9A45C]'
                              : 'bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/40'
                          }`}
                        >
                          +200% Export
                        </span>
                      ) : (
                        <span
                          className={`text-[9px] ${
                            isSelected ? 'text-[#17233B]/70' : 'text-stone-500'
                          }`}
                        >
                          {item.code === 'INR' ? 'Weaver Base' : 'Export'}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="px-3 py-1.5 border-t border-white/10 text-[9px] text-stone-400 leading-tight">
              🇺🇸/🇪🇺 American &amp; European currencies feature a 200% export markup for insured global air freight, customs, and artisan guild reserves.
            </div>
          </div>
        )}
      </div>
    )
  }

  // Header pill variant
  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
          isWesternMarket
            ? 'bg-[#10192A] text-white border-[#C9A45C]/60 shadow-xs'
            : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
        }`}
        title="Switch Marketplace Currency"
      >
        <span>{activeItem.flag}</span>
        <span>{activeItem.code}</span>
        <span className="text-stone-500">({activeItem.symbol})</span>
        <span className="text-[9px] text-stone-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-stone-200 text-stone-800 shadow-2xl z-50 p-2 space-y-1 animate-fadeIn">
          <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#704B32]">
              Global Currency
            </span>
            <span className="text-[10px] text-stone-400 font-mono">Live Rates</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 py-1">
            {CRAFT_CURRENCIES.map((item) => {
              const isSelected = item.code === currency
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-[#17233B] text-white font-bold'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{item.code}</span>
                        <span className="opacity-75">({item.symbol})</span>
                      </div>
                      <span
                        className={`text-[10px] block ${
                          isSelected ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {item.markupTag}
                      </span>
                    </div>
                  </div>

                  {item.isInflated200 && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#C9A45C] text-[#17233B]'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      +200%
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="px-3 py-2 border-t border-stone-100 text-[10px] text-stone-500 leading-snug">
            💡 Overseas orders include insured DHL/FedEx Express international air transport and export duties.
          </div>
        </div>
      )}
    </div>
  )
}
