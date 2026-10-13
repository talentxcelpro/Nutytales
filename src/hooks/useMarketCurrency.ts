'use client'

import { useState, useEffect } from 'react'
import {
  CurrencyCode,
  SUPPORTED_COUNTRIES,
  SUPPORTED_CURRENCIES,
  formatGlobalPrice,
  convertFromINR,
  formatCraftPrice as formatCraftPriceHelper,
  convertCraftFromINR,
  getCraftMarkupMultiplier,
} from '@/lib/global-config'

export function useMarketCurrency() {
  const [currency, setCurrency] = useState<CurrencyCode>('INR')
  const [country, setCountry] = useState<string>('IN')

  useEffect(() => {
    try {
      const savedCurr = localStorage.getItem('nutytales_currency') as CurrencyCode | null
      const savedCountry = localStorage.getItem('nutytales_country')
      if (savedCurr && SUPPORTED_CURRENCIES[savedCurr]) {
        setCurrency(savedCurr)
      }
      if (savedCountry && SUPPORTED_COUNTRIES[savedCountry]) {
        setCountry(savedCountry)
      }
    } catch {
      // Ignore
    }

    const handleMarketUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ countryCode?: string; currency?: CurrencyCode }>
      if (customEvent.detail?.currency && SUPPORTED_CURRENCIES[customEvent.detail.currency]) {
        setCurrency(customEvent.detail.currency)
      }
      if (customEvent.detail?.countryCode && SUPPORTED_COUNTRIES[customEvent.detail.countryCode]) {
        setCountry(customEvent.detail.countryCode)
      }
    }

    window.addEventListener('nt_market_updated', handleMarketUpdated)
    return () => window.removeEventListener('nt_market_updated', handleMarketUpdated)
  }, [])

  const setMarketCurrency = (newCurrency: CurrencyCode) => {
    try {
      localStorage.setItem('nutytales_currency', newCurrency)
      setCurrency(newCurrency)
      window.dispatchEvent(
        new CustomEvent('nt_market_updated', {
          detail: { currency: newCurrency, countryCode: country },
        })
      )
    } catch {
      // Ignore
    }
  }

  const formatPrice = (amountINR: number) => {
    return formatGlobalPrice(amountINR, currency)
  }

  const formatCraftPrice = (amountINR: number) => {
    return formatCraftPriceHelper(amountINR, currency)
  }

  const getConvertedAmount = (amountINR: number) => {
    return convertFromINR(amountINR, currency)
  }

  const getConvertedCraftAmount = (amountINR: number) => {
    return convertCraftFromINR(amountINR, currency)
  }

  const isWesternMarket = ['USD', 'CAD', 'EUR', 'GBP'].includes(currency)
  const craftMarkupMultiplier = getCraftMarkupMultiplier(currency)

  const currencyConfig = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.INR
  const countryConfig = SUPPORTED_COUNTRIES[country] || SUPPORTED_COUNTRIES.IN

  return {
    currency,
    country,
    currencyConfig,
    countryConfig,
    formatPrice,
    formatCraftPrice,
    getConvertedAmount,
    getConvertedCraftAmount,
    setMarketCurrency,
    isWesternMarket,
    craftMarkupMultiplier,
  }
}
