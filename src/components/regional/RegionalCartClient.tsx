'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  RegionalConfig,
  formatRegionalPrice,
  getRegionalProductPrice,
} from '@/lib/regional-data'
import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/lib/global-config'

interface CartItem {
  id: string
  productId: string
  name: string
  slug: string
  price?: number
  formattedPrice?: string
  currency?: CurrencyCode
  image?: string
  quantity: number
  variant?: string
  region?: string
}

export default function RegionalCartClient({
  config,
  initialCurrency,
}: {
  config: RegionalConfig
  initialCurrency?: CurrencyCode
}) {
  const pathname = usePathname()
  const homeHref = pathname?.startsWith(config.pathPrefix) ? config.pathPrefix : '/'
  const storeHref = pathname?.startsWith(config.pathPrefix) ? `${config.pathPrefix}/store` : '/store'
  const checkoutHref = pathname?.startsWith(config.pathPrefix) ? `${config.pathPrefix}/checkout` : '/checkout'

  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(
    initialCurrency || config.defaultCurrency
  )

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nt_cart')
      if (stored) {
        setCart(JSON.parse(stored))
      }
    } catch {
      setCart([])
    }
    setIsLoaded(true)
  }, [])

  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart)
    try {
      localStorage.setItem('nt_cart', JSON.stringify(newCart))
      window.dispatchEvent(new Event('nt_cart_updated'))
    } catch {
      // Ignore
    }
  }

  const handleQuantity = (index: number, delta: number) => {
    const updated = [...cart]
    const nextQty = updated[index].quantity + delta
    if (nextQty <= 0) {
      updated.splice(index, 1)
    } else {
      updated[index].quantity = nextQty
    }
    updateCartState(updated)
  }

  const handleRemove = (index: number) => {
    const updated = cart.filter((_, i) => i !== index)
    updateCartState(updated)
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const isFreeShip = subtotal >= config.freeShippingThreshold || subtotal === 0
  const standardFee = config.key === 'me' ? 35 : config.key === 'eu' ? 10 : 12
  const shippingFee = isFreeShip ? 0 : standardFee
  const grandTotal = subtotal + shippingFee

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / config.freeShippingThreshold) * 100)
  )
  const remainingForFree = Math.max(0, config.freeShippingThreshold - subtotal)

  const formattedSubtotal = formatRegionalPrice(subtotal, activeCurrency)
  const formattedShipping = isFreeShip ? 'FREE' : formatRegionalPrice(shippingFee, activeCurrency)
  const formattedGrandTotal = formatRegionalPrice(grandTotal, activeCurrency)

  if (isLoaded && cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl">
          🧺
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-white">
            Your {config.packagingBadge} Basket is Empty
          </h1>
          <p className="text-sm text-stone-300 font-light max-w-md mx-auto">
            Explore our harvest selections pre-cleared for direct delivery to your country.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={`${config.pathPrefix}/store`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl transition"
          >
            <span>Open {config.brandName} Catalog</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href={homeHref} className="hover:text-white transition">
          {config.brandName}
        </Link>
        <span>/</span>
        <Link href={storeHref} className="hover:text-white transition">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-amber-400 font-medium">Shopping Basket</span>
      </nav>

      {/* Header & Currency Switcher */}
      <div className="border-b border-white/10 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            {config.subdomain}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
            Your Regional Hamper Basket
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light mt-1">
            All prices are in {activeCurrency} with pre-paid import duties and direct dispatch from {config.regionalHub}.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl text-xs">
          <span className="text-stone-400">Currency:</span>
          <div className="flex items-center gap-1 bg-[#121B2D] p-1 rounded-xl border border-white/10">
            {config.supportedCurrencies.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCurrency(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  activeCurrency === c
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          {isFreeShip ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span>✨</span>
              <span>Congratulations! Your consignment qualifies for Free Air Cargo Delivery!</span>
            </span>
          ) : (
            <span className="text-stone-300">
              Add{' '}
              <strong className="text-amber-400">
                {formatRegionalPrice(remainingForFree, activeCurrency)}
              </strong>{' '}
              more to unlock Free International Air Freight!
            </span>
          )}
          <span className="font-mono text-stone-400 font-bold">{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Items (8 cols) + Summary (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 flex-shrink-0">
                  <Image
                    src={item.image || '/images/luxury-hamper-jars.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="font-serif text-base font-bold text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-stone-400">
                    {item.variant || 'Standard 1kg Sealed Unit'}
                  </p>
                  <p className="text-sm font-mono font-bold text-amber-400">
                    {item.formattedPrice ||
                      formatRegionalPrice(item.price || 0, activeCurrency)}
                    <span className="text-[10px] text-stone-500 ml-1">/ unit</span>
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-none border-white/10">
                <div className="flex items-center border border-white/20 rounded-xl bg-white/5">
                  <button
                    type="button"
                    onClick={() => handleQuantity(idx, -1)}
                    className="px-3 py-1.5 text-stone-300 hover:text-white font-bold text-sm"
                  >
                    −
                  </button>
                  <span className="px-3 font-mono font-bold text-xs text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuantity(idx, 1)}
                    className="px-3 py-1.5 text-stone-300 hover:text-white font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[80px]">
                  <span className="font-mono text-base font-bold text-white block">
                    {formatRegionalPrice((item.price || 0) * item.quantity, activeCurrency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-[11px] text-stone-400 hover:text-rose-400 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2 flex justify-between items-center text-xs text-stone-400">
            <Link
              href={`${config.pathPrefix}/store`}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <span>←</span>
              <span>Continue Shopping</span>
            </Link>

            <button
              type="button"
              onClick={() => updateCartState([])}
              className="hover:text-rose-400 transition"
            >
              Clear Basket
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/15 space-y-5 shadow-2xl backdrop-blur-md">
            <h3 className="font-serif text-lg font-bold text-white border-b border-white/10 pb-3">
              Consignment Summary
            </h3>

            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((n, i) => n + i.quantity, 0)} items)</span>
                <span className="font-mono text-white font-semibold">{formattedSubtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>International Air Cargo</span>
                <span className="font-mono text-emerald-400 font-semibold">{formattedShipping}</span>
              </div>

              <div className="flex justify-between">
                <span>Customs Clearance (DDP)</span>
                <span className="text-emerald-400 font-bold">100% Pre-Paid</span>
              </div>

              <div className="border-t border-white/15 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base font-bold text-white block">
                    Total
                  </span>
                  <span className="text-[10px] text-stone-400">All duties pre-cleared</span>
                </div>
                <span className="font-mono text-2xl font-bold text-amber-400">
                  {formattedGrandTotal}
                </span>
              </div>
            </div>

            <Link
              href={checkoutHref}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 transition"
            >
              <span>Proceed to Checkout</span>
              <span>→</span>
            </Link>

            <div className="space-y-1 text-[11px] text-stone-400 text-center font-light">
              <p>✈️ Dispatches from {config.regionalHub}</p>
              <p>🛡️ Cold-chain temperature monitored</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
