'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { RegionalConfig, RegionalProductItem, getRegionalProductPrice, formatRegionalPrice } from '@/lib/regional-data'
import { CurrencyCode, formatGlobalPrice, SUPPORTED_CURRENCIES } from '@/lib/global-config'

export default function RegionalCatalogClient({
  config,
  products,
  initialCurrency,
}: {
  config: RegionalConfig
  products: RegionalProductItem[]
  initialCurrency?: CurrencyCode
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(
    initialCurrency || config.defaultCurrency
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const categories = useMemo(() => {
    const set = new Set<string>()
    products.forEach((p) => {
      if (p.baseProduct.category) set.add(p.baseProduct.category)
    })
    return ['all', ...Array.from(set)]
  }, [products])

  const displayProducts = useMemo(() => {
    return products.map((p) => {
      if (activeCurrency === p.currency) return p
      const price = getRegionalProductPrice(p.baseProduct, config.key, activeCurrency)
      return {
        ...p,
        regionalPrice: price,
        formattedPrice: formatRegionalPrice(price, activeCurrency),
        currency: activeCurrency,
      }
    })
  }, [products, activeCurrency, config.key])

  const filteredProducts = useMemo(() => {
    return displayProducts
      .filter((p) => {
        const matchCategory =
          selectedCategory === 'all' ||
          p.baseProduct.category?.toLowerCase() === selectedCategory.toLowerCase()
        const matchQuery =
          !searchQuery ||
          p.regionalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.baseProduct.shortDesc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.baseProduct.origin?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchCategory && matchQuery
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.regionalPrice - b.regionalPrice
        if (sortBy === 'price-desc') return b.regionalPrice - a.regionalPrice
        return 0
      })
  }, [displayProducts, searchQuery, selectedCategory, sortBy])

  const handleAddToCart = (e: React.MouseEvent, item: RegionalProductItem) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const cartItem = {
        id: `${item.baseProduct.id}-${config.key}`,
        productId: item.baseProduct.id,
        name: `${item.regionalName} (${item.packagingBadge})`,
        slug: item.regionalSlug,
        price: item.regionalPrice,
        formattedPrice: item.formattedPrice,
        currency: activeCurrency,
        image: item.baseProduct.image || '/images/luxury-hamper-jars.webp',
        quantity: 1,
        variant: '1kg / Standard Pack',
        region: config.key,
      }

      const matchIndex = existing.findIndex((c: any) => c.id === cartItem.id)
      if (matchIndex > -1) {
        existing[matchIndex].quantity += 1
      } else {
        existing.push(cartItem)
      }

      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))

      setToastMessage(`Added "${item.regionalName}" (${item.formattedPrice}) to your international bag!`)
      setTimeout(() => setToastMessage(null), 3500)
    } catch {
      // Ignore
    }
  }

  const pathname = usePathname()
  const storeHref = pathname?.startsWith(config.pathPrefix) ? `${config.pathPrefix}/store` : '/store'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 bg-emerald-600 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span>✓</span>
          <span>{toastMessage}</span>
          <Link href={`${config.pathPrefix}/cart`} className="underline ml-2 text-stone-100 hover:text-white">
            View Cart
          </Link>
        </div>
      )}

      {/* Catalog Header */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                {config.subdomain}
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-400">{config.packagingBadge} Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
              {config.offeringTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-light mt-1 max-w-2xl">
              All items are assembled under strict export quality protocols with pre-paid import duties and direct dispatch from {config.regionalHub}.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1 text-right">
            <span className="text-stone-400 block">Active Delivery Region</span>
            <span className="font-bold text-amber-400">{config.brandName}</span>
            <span className="block text-[10px] text-stone-400">
              Free Shipping threshold: <strong className="text-white">{config.freeShippingLabel}</strong>
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search almonds, saffron, walnuts, makhana..."
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Currency Switcher & Sort Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Currency Selector */}
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

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#121B2D] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                <option value="featured">Featured Editions</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition capitalize ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                  : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat === 'all' ? 'All Selections' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="text-4xl">🔍</p>
          <h3 className="font-serif text-xl font-bold text-white">No products found</h3>
          <p className="text-xs text-stone-400">
            Try adjusting your search query or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.regionalSlug}
              className="group rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition p-4 flex flex-col justify-between"
            >
              <Link href={`${storeHref}/${item.regionalSlug}`} className="space-y-3 block">
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-stone-900 border border-white/10">
                  <Image
                    src={item.baseProduct.image || '/images/luxury-hamper-jars.webp'}
                    alt={item.regionalName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/20">
                    {item.packagingBadge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-400">
                    <span>{item.baseProduct.origin}</span>
                    <span className="font-semibold text-emerald-400">Grade: {item.baseProduct.grade}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold text-white group-hover:text-amber-300 transition">
                    {item.regionalName}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 font-light">
                    {item.baseProduct.shortDesc}
                  </p>
                  <p className="text-[10px] text-stone-500 font-mono">
                    Pattern: /store/{item.regionalSlug}
                  </p>
                </div>
              </Link>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase">1kg Sealed Unit</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {item.formattedPrice}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAddToCart(e, item)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition flex items-center gap-1"
                >
                  <span>+</span>
                  <span>Add to Box</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
