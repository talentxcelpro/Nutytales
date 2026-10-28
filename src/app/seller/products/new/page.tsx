'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSeller } from '../../SellerContext'
import { GLOBAL_PRODUCT_CATEGORIES } from '@/lib/seller-portal/mock-data'
import { SupportedCurrency, CURRENCY_SYMBOLS, CategoryAttributeField } from '@/lib/seller-portal/types'

export default function AddProductPage() {
  const router = useRouter()
  const { seller, reportingCurrency, formatCurrencyAmount } = useSeller()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Selected Category
  const [selectedCatSlug, setSelectedCatSlug] = useState<string>(
    seller?.approvedCategories?.[0] || 'fashion-apparel'
  )

  const currentCategory =
    GLOBAL_PRODUCT_CATEGORIES.find((c) => c.slug === selectedCatSlug) ||
    GLOBAL_PRODUCT_CATEGORIES[0]

  // Form core state
  const [form, setForm] = useState({
    title: '',
    sku: `SKU-${Math.floor(100000 + Math.random() * 900000)}`,
    subcategory: currentCategory.subcategories[0] || '',
    brand: seller?.storeName || '',
    description: '',
    currency: (seller?.preferredCurrency || reportingCurrency || 'USD') as SupportedCurrency,
    mrp: 120,
    sellingPrice: 95,
    compareAtPrice: 130,
    wholesalePrice: 70,
    stockAvailable: 45,
    lowStockThreshold: 10,
    weightGrams: 500,
    lengthCm: 20,
    widthCm: 15,
    heightCm: 10,
    shippingClass: 'standard' as 'standard' | 'express' | 'fragile' | 'temperature_controlled' | 'heavy_freight',
    countryOfOrigin: seller?.country || 'United States',
    hsnOrTariffCode: '6109.10.00',
    taxRatePercent: 10.0,
    fulfillmentType: 'both' as 'domestic' | 'cross_border' | 'both',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    packName: 'Standard Unit',
  })

  // Dynamic category custom attributes
  const [dynamicAttributes, setDynamicAttributes] = useState<Record<string, any>>({})

  const handleCategoryChange = (slug: string) => {
    setSelectedCatSlug(slug)
    const cat = GLOBAL_PRODUCT_CATEGORIES.find((c) => c.slug === slug)
    if (cat) {
      setForm((prev) => ({
        ...prev,
        subcategory: cat.subcategories[0] || '',
      }))
      // Reset dynamic attributes
      setDynamicAttributes({})
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleDynamicAttrChange = (key: string, value: any) => {
    setDynamicAttributes((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!seller?.id) {
      setError('Active seller profile required.')
      return
    }
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        sellerId: seller.id,
        title: form.title,
        sku: form.sku,
        categorySlug: currentCategory.slug,
        categoryName: currentCategory.name,
        subcategory: form.subcategory,
        brand: form.brand || seller.storeName,
        description: form.description,
        currency: form.currency,
        weightGrams: Number(form.weightGrams),
        dimensionsCm: {
          length: Number(form.lengthCm),
          width: Number(form.widthCm),
          height: Number(form.heightCm),
        },
        shippingClass: form.shippingClass,
        countryOfOrigin: form.countryOfOrigin,
        hsnOrTariffCode: form.hsnOrTariffCode,
        taxRatePercent: Number(form.taxRatePercent),
        mrp: Number(form.mrp),
        sellingPrice: Number(form.sellingPrice),
        compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
        wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : undefined,
        stockAvailable: Number(form.stockAvailable),
        lowStockThreshold: Number(form.lowStockThreshold),
        fulfillmentType: form.fulfillmentType,
        images: [
          {
            url: form.imageUrl || '/images/products/placeholder.png',
            isPrimary: true,
            alt: form.title,
          },
        ],
        packSizes: [
          {
            id: `PK-${Date.now()}`,
            name: form.packName,
            sku: form.sku,
            mrp: Number(form.mrp),
            price: Number(form.sellingPrice),
            wholesalePrice: form.wholesalePrice ? Number(form.wholesalePrice) : undefined,
            stock: Number(form.stockAvailable),
            weightGrams: Number(form.weightGrams),
          },
        ],
        attributes: dynamicAttributes,
      }

      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit listing')
      }

      router.push('/seller/products')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const currSymbol = CURRENCY_SYMBOLS[form.currency] || '$'

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-12 px-1 sm:px-0">
      {/* Page Header */}
      <div className="bg-[#163326] text-white p-4 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#24523F] shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <Link href="/seller/products" className="text-xs text-[#C5A869] hover:underline flex items-center gap-1 font-medium">
            ← Back to Catalogue
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF6EF] text-[#163326] border border-[#C5A869]">
            ✨ 100% Free Listing · 0% Insertion Fee · 0% Commission
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A869] block">
          Nuty Tales Global Marketplace Studio
        </span>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-50 mt-1">
          Create Universal Product Listing
        </h1>
        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
          List your products across any of the 20 global marketplace taxonomy categories with dynamic attribute validation, international shipping classes, and cross-border customs declarations. Zero listing fees charged.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Global Taxonomy & Category */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">Section 1</span>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Global Category & Subcategory Taxonomy
              </h3>
            </div>
            <span className="text-xs text-stone-400">20 Global Categories Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Primary Product Category *
              </label>
              <select
                value={selectedCatSlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] bg-white font-medium"
              >
                {GLOBAL_PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 mt-1">
                {currentCategory.description}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Subcategory Specification *
              </label>
              <select
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] bg-white"
              >
                {currentCategory.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Core Identity & Media */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">Section 2</span>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Listing Title, Brand & Imagery
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Product Title (Global Storefront Display) *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Pure Mongolian Cashmere Sweater, Kashmiri Saffron Threads 5g, Solid Oak Dining Chair"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Brand / Maker Name
              </label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Apex Global, Nordic Craft, Valley Heritage"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Merchant SKU (Stock Keeping Unit) *
              </label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326] font-mono bg-stone-50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Primary Product Image URL
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.example.com/product.jpg"
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
                />
                {form.imageUrl && (
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Comprehensive Product Description & Story
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe material provenance, craft techniques, sizing, specifications and use cases..."
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#163326]"
              />
            </div>
          </div>
        </div>

        {/* 3. Dynamic Category-Specific Attributes */}
        {currentCategory.attributeSchema && currentCategory.attributeSchema.length > 0 && (
          <div className="bg-[#FAF6EF] p-6 sm:p-7 rounded-3xl border border-[#C5A869]/40 shadow-xs space-y-4">
            <div className="border-b border-[#C5A869]/30 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#163326] font-bold">Section 3 · Category Attributes</span>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  {currentCategory.name} Specifications
                </h3>
              </div>
              <span className="text-xs bg-white px-2 py-0.5 rounded border border-[#C5A869]/40 text-stone-600 font-medium">
                Dynamic Schema
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentCategory.attributeSchema.map((attr) => (
                <div key={attr.key}>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {attr.label} {attr.required && '*'}
                  </label>
                  {attr.type === 'select' ? (
                    <select
                      value={dynamicAttributes[attr.key] || ''}
                      onChange={(e) => handleDynamicAttrChange(attr.key, e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="">Select {attr.label}...</option>
                      {attr.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : attr.type === 'number' ? (
                    <input
                      type="number"
                      value={dynamicAttributes[attr.key] || ''}
                      onChange={(e) => handleDynamicAttrChange(attr.key, e.target.value)}
                      placeholder={attr.placeholder}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
                    />
                  ) : attr.type === 'boolean' ? (
                    <label className="flex items-center gap-2 text-xs text-stone-700 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(dynamicAttributes[attr.key])}
                        onChange={(e) => handleDynamicAttrChange(attr.key, e.target.checked)}
                        className="h-4 w-4 rounded text-[#163326]"
                      />
                      <span>Yes, compliant / applicable</span>
                    </label>
                  ) : (
                    <input
                      type="text"
                      value={dynamicAttributes[attr.key] || ''}
                      onChange={(e) => handleDynamicAttrChange(attr.key, e.target.value)}
                      placeholder={attr.placeholder}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
                    />
                  )}
                  {attr.helperText && (
                    <span className="text-[10px] text-stone-500 mt-0.5 block">{attr.helperText}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Pricing & Inventory */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">Section 4</span>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Pricing, B2B Tier & Inventory
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Transaction Currency:</span>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="text-xs font-bold px-2 py-1 bg-stone-100 rounded-lg border border-stone-200"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="SGD">SGD (S$)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Selling Price ({currSymbol}) *
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={form.sellingPrice}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                MSRP / Listed Price ({currSymbol})
              </label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Wholesale B2B Tier ({currSymbol})
              </label>
              <input
                type="number"
                name="wholesalePrice"
                value={form.wholesalePrice}
                onChange={handleChange}
                placeholder="Bulk buyer price"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Tax / VAT Rate (%)
              </label>
              <input
                type="number"
                name="taxRatePercent"
                value={form.taxRatePercent}
                onChange={handleChange}
                step="0.5"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Available Stock Units *
              </label>
              <input
                type="number"
                name="stockAvailable"
                value={form.stockAvailable}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={form.lowStockThreshold}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Variant / Pack Name
              </label>
              <input
                type="text"
                name="packName"
                value={form.packName}
                onChange={handleChange}
                placeholder="e.g. Standard Unit, 500g Jar, Large / Black"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>
          </div>
        </div>

        {/* 5. Shipping, Dimensions & International Customs */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <span className="text-[10px] uppercase tracking-wider text-[#C5A869] font-bold">Section 5</span>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Fulfillment, Shipping Class & Customs Declarations
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Shipping Class *
              </label>
              <select
                name="shippingClass"
                value={form.shippingClass}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="standard">Standard Parcel</option>
                <option value="express">Express Air Cargo</option>
                <option value="fragile">Fragile / White Glove Handling</option>
                <option value="temperature_controlled">Temperature Controlled / Cold Chain</option>
                <option value="heavy_freight">Heavy Freight / Pallet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Harmonized Tariff / HSN Code *
              </label>
              <input
                type="text"
                name="hsnOrTariffCode"
                value={form.hsnOrTariffCode}
                onChange={handleChange}
                required
                placeholder="e.g. 6109.10, 0802.12"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">Required for international customs clearance</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Country of Origin *
              </label>
              <input
                type="text"
                name="countryOfOrigin"
                value={form.countryOfOrigin}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Package Weight (Grams) *
              </label>
              <input
                type="number"
                name="weightGrams"
                value={form.weightGrams}
                onChange={handleChange}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Dimensions (L × W × H in cm)
              </label>
              <div className="flex gap-1.5 items-center">
                <input
                  type="number"
                  name="lengthCm"
                  value={form.lengthCm}
                  onChange={handleChange}
                  className="w-full text-xs p-2 text-center rounded-xl border border-stone-300"
                />
                <span className="text-stone-400">×</span>
                <input
                  type="number"
                  name="widthCm"
                  value={form.widthCm}
                  onChange={handleChange}
                  className="w-full text-xs p-2 text-center rounded-xl border border-stone-300"
                />
                <span className="text-stone-400">×</span>
                <input
                  type="number"
                  name="heightCm"
                  value={form.heightCm}
                  onChange={handleChange}
                  className="w-full text-xs p-2 text-center rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Fulfillment Channels
              </label>
              <select
                name="fulfillmentType"
                value={form.fulfillmentType}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white"
              >
                <option value="both">Both Domestic & Cross-Border Export</option>
                <option value="domestic">Domestic Fulfillment Only</option>
                <option value="cross_border">Cross-Border International Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-16 lg:static z-30 p-3 sm:p-4 bg-white/95 backdrop-blur-md lg:bg-stone-100 rounded-2xl border border-stone-200/90 shadow-lg lg:shadow-none flex items-center justify-between gap-3">
          <Link
            href="/seller/products"
            className="px-4 sm:px-5 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-[#163326] hover:bg-[#11291E] disabled:bg-stone-400 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
          >
            {submitting ? 'Publishing Free Listing...' : 'Publish Listing (Free) →'}
          </button>
        </div>
      </form>
    </div>
  )
}
