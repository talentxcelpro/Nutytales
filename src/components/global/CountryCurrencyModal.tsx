'use client'

import React, { useState, useEffect } from 'react'
import {
  SUPPORTED_COUNTRIES,
  SUPPORTED_CURRENCIES,
  CurrencyCode,
  formatGlobalPrice,
} from '@/lib/global-config'

export interface MarketPreference {
  countryCode: string
  currency: CurrencyCode
}

const COUNTRY_FLAGS: Record<string, string> = {
  IN: '🇮🇳',
  AE: '🇦🇪',
  GB: '🇬🇧',
  US: '🇺🇸',
  CA: '🇨🇦',
  AU: '🇦🇺',
  SG: '🇸🇬',
  SA: '🇸🇦',
}

export default function CountryCurrencyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [selectedCountry, setSelectedCountry] = useState<string>('IN')
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('INR')

  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem('nutytales_country')
      const savedCurrency = localStorage.getItem('nutytales_currency') as CurrencyCode | null
      if (savedCountry && SUPPORTED_COUNTRIES[savedCountry]) {
        setSelectedCountry(savedCountry)
      }
      if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
        setSelectedCurrency(savedCurrency)
      }
    } catch {
      // Ignore
    }
  }, [])

  if (!isOpen) return null

  const activeCountryConfig = SUPPORTED_COUNTRIES[selectedCountry] || SUPPORTED_COUNTRIES.IN

  const handleCountrySelect = (code: string) => {
    setSelectedCountry(code)
    const countryConf = SUPPORTED_COUNTRIES[code]
    if (countryConf) {
      setSelectedCurrency(countryConf.defaultCurrency)
    }
  }

  const handleSave = () => {
    try {
      localStorage.setItem('nutytales_country', selectedCountry)
      localStorage.setItem('nutytales_currency', selectedCurrency)
      document.cookie = `nt_country=${selectedCountry}; path=/; max-age=31536000; SameSite=Lax`
      document.cookie = `nt_currency=${selectedCurrency}; path=/; max-age=31536000; SameSite=Lax`
      window.dispatchEvent(
        new CustomEvent('nt_market_updated', {
          detail: { countryCode: selectedCountry, currency: selectedCurrency },
        })
      )
    } catch {
      // Ignore
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] text-[#17233B] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-300 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#704B32]">
              Regional Market &amp; Currency
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Select Destination &amp; Currency
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Prices, local taxes, fulfillment routes, and legal compliance adapt dynamically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 text-stone-600 font-bold flex items-center justify-center border border-stone-200"
          >
            ✕
          </button>
        </div>

        {/* Country Grid */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
            1. Select Operating Market
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.keys(SUPPORTED_COUNTRIES).map((code) => {
              const country = SUPPORTED_COUNTRIES[code]
              const isSelected = selectedCountry === code
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleCountrySelect(code)}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#17233B] text-white border-[#17233B] shadow-sm'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span className="text-2xl">{COUNTRY_FLAGS[code] || '🌐'}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">{country.countryName}</p>
                    <p className={`text-[10px] truncate ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                      {country.defaultCurrency}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Currency Selector */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block uppercase tracking-wider">
            2. Preferred Display Currency
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((cur) => {
              const conf = SUPPORTED_CURRENCIES[cur]
              const isSelected = selectedCurrency === cur
              return (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setSelectedCurrency(cur)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    isSelected
                      ? 'bg-[#176B68] text-white border-[#176B68] font-bold shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <span className="text-xs font-bold block">{cur}</span>
                  <span className={`text-[10px] block ${isSelected ? 'text-stone-100' : 'text-stone-400'}`}>
                    {conf.symbol.trim()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Summary Info Banner */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <p className="font-bold text-[#17233B]">
              Market: {COUNTRY_FLAGS[selectedCountry]} {activeCountryConfig.countryName} ({activeCountryConfig.region})
            </p>
            <p className="text-[11px] text-stone-500">
              Tax Regime: {activeCountryConfig.tax.taxName} · Hubs: {activeCountryConfig.fulfillmentHubs.join(', ')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block uppercase">Sample Pricing Rate</span>
            <span className="font-serif font-bold text-sm text-[#17233B]">
              {formatGlobalPrice(10000, selectedCurrency)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#17233B] hover:bg-[#203050] text-white text-xs font-bold shadow-md transition"
          >
            Save &amp; Update Platform
          </button>
        </div>
      </div>
    </div>
  )
}
