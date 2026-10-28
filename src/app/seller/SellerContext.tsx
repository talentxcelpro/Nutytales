'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  SellerProfile,
  SupportedCurrency,
  CURRENCY_SYMBOLS,
} from '@/lib/seller-portal/types'
import { convertCurrencyLive } from '@/lib/seller-portal/forex'
import { useAuth } from '@/context/AuthContext'

interface SellerContextType {
  seller: SellerProfile | null
  loading: boolean
  availableSellers: SellerProfile[]
  switchSeller: (id: string) => Promise<void>
  refreshSeller: () => Promise<void>
  // Global reporting controls
  reportingCurrency: SupportedCurrency
  setReportingCurrency: (curr: SupportedCurrency) => void
  regionFilter: string
  setRegionFilter: (reg: string) => void
  dateRange: string
  setDateRange: (range: string) => void
  formatCurrencyAmount: (amount: number, sourceCurrency?: SupportedCurrency) => string
}

const SellerContext = createContext<SellerContextType>({
  seller: null,
  loading: true,
  availableSellers: [],
  switchSeller: async () => {},
  refreshSeller: async () => {},
  reportingCurrency: 'USD',
  setReportingCurrency: () => {},
  regionFilter: 'all',
  setRegionFilter: () => {},
  dateRange: '30d',
  setDateRange: () => {},
  formatCurrencyAmount: (val) => `$${val}`,
})

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const { idToken, user } = useAuth()
  const [seller, setSeller] = useState<SellerProfile | null>(null)
  const [availableSellers, setAvailableSellers] = useState<SellerProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [reportingCurrency, setReportingCurrency] = useState<SupportedCurrency>('USD')
  const [regionFilter, setRegionFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30d')

  const loadCurrentSeller = useCallback(async () => {
    try {
      const headers: Record<string, string> = { 'Accept': 'application/json' }
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`
      }

      const meRes = await fetch('/api/seller/auth/me', { headers })
      if (meRes.ok) {
        const meData = await meRes.json()
        if (meData.seller) {
          setSeller(meData.seller)
          if (meData.seller.preferredCurrency) {
            setReportingCurrency(meData.seller.preferredCurrency)
          }
        } else {
          setSeller(null)
        }

        // Only super administrators can query all sellers for context switching
        if (meData.session?.isSuperAdmin) {
          const allRes = await fetch('/api/seller/admin', { headers })
          if (allRes.ok) {
            const allData = await allRes.json()
            if (allData.sellers) setAvailableSellers(allData.sellers)
          }
        }
      } else {
        setSeller(null)
      }
    } catch (err) {
      console.error('[SellerContext] Failed to load seller session:', err)
      setSeller(null)
    } finally {
      setLoading(false)
    }
  }, [idToken])

  const switchSeller = async (id: string) => {
    setLoading(true)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (idToken) headers['Authorization'] = `Bearer ${idToken}`

      const res = await fetch('/api/seller/auth/me', {
        method: 'POST',
        headers,
        body: JSON.stringify({ sellerId: id }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.seller) {
          setSeller(data.seller)
          if (data.seller.preferredCurrency) {
            setReportingCurrency(data.seller.preferredCurrency)
          }
        }
      }
    } catch (err) {
      console.error('Failed to switch seller:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCurrentSeller()
  }, [loadCurrentSeller, user])

  const formatCurrencyAmount = (amount: number, sourceCurrency?: SupportedCurrency): string => {
    const from = sourceCurrency || reportingCurrency
    const converted = convertCurrencyLive(amount, from, reportingCurrency)
    const symbol = CURRENCY_SYMBOLS[reportingCurrency] || '$'
    return `${symbol}${Math.round(converted).toLocaleString('en-US')}`
  }

  return (
    <SellerContext.Provider
      value={{
        seller,
        loading,
        availableSellers,
        switchSeller,
        refreshSeller: loadCurrentSeller,
        reportingCurrency,
        setReportingCurrency,
        regionFilter,
        setRegionFilter,
        dateRange,
        setDateRange,
        formatCurrencyAmount,
      }}
    >
      {children}
    </SellerContext.Provider>
  )
}

export function useSeller() {
  return useContext(SellerContext)
}
