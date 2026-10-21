'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { RegionalConfig, RegionalProductItem, cleanRegionalSlug, REGIONAL_CONFIGS, getRegionalProductPrice, formatRegionalPrice } from '@/lib/regional-data'
import { CurrencyCode, formatGlobalPrice, convertFromINR, SUPPORTED_CURRENCIES } from '@/lib/global-config'

export default function RegionalProductClient({
  config,
  productItem,
  initialCurrency,
}: {
  config: RegionalConfig
  productItem: RegionalProductItem
  initialCurrency?: CurrencyCode
}) {
  const pathname = usePathname()
  const checkoutHref = pathname?.startsWith(config.pathPrefix) ? `${config.pathPrefix}/checkout` : '/checkout'
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>(
    initialCurrency || config.defaultCurrency
  )
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const product = productItem.baseProduct

  // Calculate authentic 1kg destination market price in active currency
  const base1kgMarketPrice = getRegionalProductPrice(product, config.key, activeCurrency)

  const regionalVariants = [
    {
      sizeG: 500,
      label: config.key === 'me' ? '500g Presentation Hamper' : config.key === 'eu' ? '500g Heritage Glass/Kraft Pack' : '500g Standup Barrier Pouch',
      price: Math.round(base1kgMarketPrice * 0.55),
      formattedPrice: formatRegionalPrice(Math.round(base1kgMarketPrice * 0.55), activeCurrency),
    },
    {
      sizeG: 1000,
      label: config.key === 'me' ? '1kg Luxury Silk-Lined Hamper' : config.key === 'eu' ? '1kg Organic Heritage Pack' : '1kg Gourmet Orchard Edition',
      price: base1kgMarketPrice,
      formattedPrice: formatRegionalPrice(base1kgMarketPrice, activeCurrency),
    },
    {
      sizeG: 2000,
      label: config.key === 'me' ? '2kg Royal Grand Trunk Hamper' : config.key === 'eu' ? '2kg Organic Family Reserve' : '2kg Pantry Multi-Pack',
      price: Math.round(base1kgMarketPrice * 1.88),
      formattedPrice: formatRegionalPrice(Math.round(base1kgMarketPrice * 1.88), activeCurrency),
    },
  ]

  const activeVariant = regionalVariants[selectedVariantIndex] || regionalVariants[1]
  const formattedVariantPrice = activeVariant.formattedPrice

  const handleAddToCart = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('nt_cart') || '[]')
      const cartItem = {
        id: `${product.id}-${config.key}-${activeVariant.sizeG}`,
        productId: product.id,
        name: `${productItem.regionalName} (${productItem.packagingBadge})`,
        slug: productItem.regionalSlug,
        price: activeVariant.price,
        formattedPrice: activeVariant.formattedPrice,
        currency: activeCurrency,
        image: product.image || '/images/luxury-hamper-jars.png',
        quantity: quantity,
        variant: `${activeVariant.label} (${activeVariant.sizeG}g)`,
        region: config.key,
      }

      const matchIndex = existing.findIndex((c: any) => c.id === cartItem.id)
      if (matchIndex > -1) {
        existing[matchIndex].quantity += quantity
      } else {
        existing.push(cartItem)
      }

      localStorage.setItem('nt_cart', JSON.stringify(existing))
      window.dispatchEvent(new Event('nt_cart_updated'))

      setToastMessage(`Added ${quantity}x "${productItem.regionalName} (${activeVariant.label})" (${activeVariant.formattedPrice}) to cart!`)
      setTimeout(() => setToastMessage(null), 3500)
    } catch {
      // Ignore
    }
  }

  const baseSlug = cleanRegionalSlug(productItem.regionalSlug)
  const meSlug = `${baseSlug}-luxury-hamper`
  const euSlug = `${baseSlug}-organic-heritage`
  const usSlug = `${baseSlug}-gourmet-orchard`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
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

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-400">
        <Link href={config.pathPrefix} className="hover:text-white transition">
          {config.brandName}
        </Link>
        <span>/</span>
        <Link href={`${config.pathPrefix}/store`} className="hover:text-white transition">
          Store Catalog
        </Link>
        <span>/</span>
        <span className="text-amber-400 font-medium truncate max-w-xs">
          {productItem.regionalName}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Image & Packaging Details (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="aspect-square rounded-3xl overflow-hidden relative bg-stone-900 border border-white/15 shadow-2xl">
            <Image
              src={product.image || '/images/luxury-hamper-jars.png'}
              alt={productItem.regionalName}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-bold text-amber-300 border border-white/20">
              {productItem.packagingBadge}
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-emerald-600/90 text-xs font-bold text-white shadow">
              Dispatches from {config.regionalHub.split('&')[0]}
            </div>
          </div>

          {/* Regional Packaging Spotlight */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <span>🎁</span>
              <span>Regional Packaging Standards</span>
            </div>
            <p className="text-stone-300 leading-relaxed font-light">
              {config.packagingDescription}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-stone-400">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">🛡️ Nitrogen Sealed</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">🌡️ Temperature Monitored</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">📦 Tamper Evident</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Buy Actions & Guarantee (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Identity & Origin */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-amber-500/30">
                {product.origin}
              </span>
              <span className="text-xs text-stone-400">Grade: <strong className="text-white">{product.grade}</strong></span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-400">FSSAI &amp; GI Verified</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              {productItem.regionalEditionTitle}
            </h1>

            <p className="text-xs font-mono text-stone-400">
              Canonical URL: <span className="text-amber-300">{productItem.canonicalUrl}</span>
            </p>

            <p className="text-sm text-stone-300 leading-relaxed font-light pt-2">
              {product.longDesc || product.shortDesc}
            </p>
          </div>

          {/* Pricing & Currency Switcher */}
          <div className="p-5 rounded-3xl bg-white/5 border border-white/15 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                  International Price (Taxes &amp; Duties Pre-Cleared)
                </span>
                <span className="font-mono text-3xl font-bold text-amber-400">
                  {formattedVariantPrice}
                </span>
                <span className="text-xs text-stone-400 ml-2 font-light">
                  ({activeCurrency})
                </span>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center self-start sm:self-auto gap-1 bg-[#121B2D] p-1 rounded-xl border border-white/10">
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

            {/* Size / Variant Picker */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-stone-300 block">
                Select Edition / Weight:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {regionalVariants.map((v, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition ${
                      selectedVariantIndex === idx
                        ? 'bg-amber-500/20 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-bold text-xs block">{v.sizeG}g</span>
                    <span className="text-[10px] text-stone-400 block truncate">
                      {v.formattedPrice}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Buy Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/20 rounded-2xl bg-white/5">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-stone-300 hover:text-white font-bold"
                  >
                    −
                  </button>
                  <span className="px-3 font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-3 text-stone-300 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial py-3.5 px-4 sm:px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-xl transition flex items-center justify-center gap-2"
                >
                  <span>🛒</span>
                  <span>Add to {config.packagingBadge}</span>
                </button>
              </div>

              <Link
                href={checkoutHref}
                onClick={handleAddToCart}
                className="w-full sm:w-auto text-center py-3.5 px-6 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition"
              >
                Instant Checkout
              </Link>
            </div>
          </div>

          {/* Regional Delivery Guarantee Card */}
          <div className="rounded-3xl bg-white/5 border border-white/10 p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <span>✈️</span>
              <span>{config.deliveryEstimate}</span>
            </h4>
            <div className="space-y-1.5 text-stone-300 font-light">
              <p>• <strong>Hub of Origin:</strong> {config.regionalHub}</p>
              <p>• <strong>Direct Carriers:</strong> {config.shippingCarriers.join(', ')}</p>
              <p>• <strong>Customs Duty:</strong> 100% Pre-Paid (DDP) — Zero Recipient Surcharge</p>
              <p>• <strong>Food Standard Compliance:</strong> {config.complianceBadge}</p>
            </div>
          </div>

          {/* Cross-Regional Editions / Hreflang Alternates */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Available in Other Regional Portals:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <Link
                href={`/me/store/${meSlug}`}
                className={`p-2.5 rounded-xl border text-left transition ${
                  config.key === 'me'
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                    : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                <span className="block font-semibold">🇦🇪 Middle East</span>
                <span className="text-[10px] text-stone-400">...-luxury-hamper</span>
              </Link>

              <Link
                href={`/eu/store/${euSlug}`}
                className={`p-2.5 rounded-xl border text-left transition ${
                  config.key === 'eu'
                    ? 'border-emerald-400 bg-emerald-500/10 text-emerald-300 font-bold'
                    : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                <span className="block font-semibold">🇬🇧 Europe</span>
                <span className="text-[10px] text-stone-400">...-organic-heritage</span>
              </Link>

              <Link
                href={`/us/store/${usSlug}`}
                className={`p-2.5 rounded-xl border text-left transition ${
                  config.key === 'us'
                    ? 'border-blue-400 bg-blue-500/10 text-blue-300 font-bold'
                    : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                <span className="block font-semibold">🇺🇸 Americas</span>
                <span className="text-[10px] text-stone-400">...-gourmet-orchard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
