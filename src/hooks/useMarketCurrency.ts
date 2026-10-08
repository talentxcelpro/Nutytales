'use client'

import { useState, useEffect } from 'react'
import {
  CurrencyCode,
  SUPPORTED_COUNTRIES,
  SUPPORTED_CURRENCIES,
  formatGlobalPrice,
  convertFromINR,
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
      const customEvent = e as CustomEvent<{ countryCode: string; currency: CurrencyCode }>
      if (customEvent.detail?.currency) {
        setCurrency(customEvent.detail.currency)
      }
      if (customEvent.detail?.countryCode) {
        setCountry(customEvent.detail.countryCode)
      }
    }

    window.addEventListener('nt_market_updated', handleMarketUpdated)
    return () => window.removeEventListener('nt_market_updated', handleMarketUpdated)
  }, [])

  const formatPrice = (amountINR: number) => {
    return formatGlobalPrice(amountINR, currency)
  }

  const getConvertedAmount = (amountINR: number) => {
    return convertFromINR(amountINR, currency)
  }

  const currencyConfig = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.INR
  const countryConfig = SUPPORTED_COUNTRIES[country] || SUPPORTED_COUNTRIES.IN

  return {
    currency,
    country,
    currencyConfig,
    countryConfig,
    formatPrice,
    getConvertedAmount,
  }
}
