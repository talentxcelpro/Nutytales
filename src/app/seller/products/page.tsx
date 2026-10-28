'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSeller } from '../SellerContext'
import { SellerProduct, CURRENCY_SYMBOLS } from '@/lib/seller-portal/types'

export default function SellerProductsPage() {
  const { seller } = useSeller()
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [quickStockProduct, setQuickStockProduct] = useState<SellerProduct | null>(null)
  const [newStockVal, setNewStockVal] = useState<number>(0)
  const [stockUpdating, setStockUpdating] = useState(false)

  const fetchProducts = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/products?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.products) setProducts(data.products)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchProducts(seller.id)
    }
  }, [seller?.id])

  const handleUpdateStock = async () => {
    if (!quickStockProduct || !seller?.id) return
    setStockUpdating(true)
    try {
      const res = await fetch('/api/seller/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          productId: quickStockProduct.id,
          newStockQty: newStockVal,
          reason: 'Quick inventory restock',
        }),
      })
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === quickStockProduct.id ? { ...p, stockAvailable: newStockVal } : p
          )
        )
        setQuickStockProduct(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setStockUpdating(false)
    }
  }

  const filtered = products.filter((p) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'low_stock'
        ? p.stockAvailable > 0 && p.stockAvailable <= p.lowStockThreshold
        : p.status === statusFilter

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Catalogue</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full border border-emerald-300">
              ✨ 0% Commission & Free Unlimited Listings
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A3E2F] mt-1">Product Management</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your listings, pack sizes, pricing, and stock availability. All catalogue listings are 100% free with 0% insertion fee.
          </p>
        </div>

        <Link
          href="/seller/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1A3E2F] hover:bg-[#143226] text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95 shrink-0"
        >
          <span>+</span> Create New Listing
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { key: 'all', label: 'All Products', count: products.length },
            {
              key: 'approved',
              label: 'Active & Approved',
              count: products.filter((p) => p.status === 'approved').length,
            },
            {
              key: 'pending_review',
              label: 'Moderation Queue',
              count: products.filter((p) => p.status === 'pending_review').length,
            },
            {
              key: 'low_stock',
              label: 'Low Stock',
              count: products.filter((p) => p.stockAvailable > 0 && p.stockAvailable <= p.lowStockThreshold).length,
            },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === f.key
                  ? 'bg-[#1A3E2F] text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search by title, SKU, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#1A3E2F]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="text-4xl">📦</div>
            <h3 className="font-serif font-bold text-stone-800 text-base">No Products Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {searchQuery
                ? 'No listings matched your search criteria.'
                : 'You have not listed any items in this filter yet. Create your first listing to start selling.'}
            </p>
            <Link
              href="/seller/products/new"
              className="inline-block px-4 py-2 bg-[#1A3E2F] text-white text-xs font-semibold rounded-lg hover:bg-[#143226]"
            >
              + Create First Listing
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">SKU / HSN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price / MRP</th>
                  <th className="py-3 px-4">Stock Available</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((product) => {
                  const isLow =
                    product.stockAvailable > 0 &&
                    product.stockAvailable <= product.lowStockThreshold
                  const isOut = product.stockAvailable <= 0

                  const curr = CURRENCY_SYMBOLS[product.currency] || '$'
                  const catLabel = product.categoryName || product.categorySlug || (product as any).category || 'General'

                  return (
                    <tr key={product.id} className="hover:bg-stone-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-lg overflow-hidden shrink-0">
                            {product.images && product.images[0]?.url && !product.images[0].url.includes('placeholder') ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                              <span>📦</span>
                            )}
                          </div>
                          <div className="truncate max-w-xs">
                            <h4 className="font-semibold text-stone-900 truncate text-xs">{product.title}</h4>
                            <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5">
                              <span>{product.packSizes?.length || 1} Pack Size(s)</span>
                              <span>·</span>
                              <span>{product.weightGrams}g</span>
                              <span className="text-[#163326] font-medium font-mono">· {product.shippingClass}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">
                        <div>{product.sku}</div>
                        <div className="text-[10px] text-stone-400">Tariff: {product.hsnOrTariffCode || (product as any).hsnCode || '6109.10'}</div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-700 capitalize">
                        {catLabel}
                        {product.subcategory && (
                          <div className="text-[10px] text-stone-400">{product.subcategory}</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">
                          {curr}{Number(product.sellingPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-stone-400 line-through">
                          MRP {curr}{Number(product.mrp).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-stone-800'
                            }`}
                          >
                            {product.stockAvailable} units
                          </span>
                          <button
                            onClick={() => {
                              setQuickStockProduct(product)
                              setNewStockVal(product.stockAvailable)
                            }}
                            className="p-1 text-stone-400 hover:text-[#1A3E2F] text-[10px] rounded hover:bg-stone-100"
                            title="Quick Adjust Stock"
                          >
                            ✏️
                          </button>
                        </div>
                        {isLow && (
                          <span className="text-[10px] text-amber-700 font-semibold block">Low safety level</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            product.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : product.status === 'pending_review'
                              ? 'bg-amber-100 text-amber-800'
                              : product.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {product.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setQuickStockProduct(product)
                              setNewStockVal(product.stockAvailable)
                            }}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition"
                          >
                            Stock
                          </button>
                          <Link
                            href={`/seller/products/new?duplicate=${product.id}`}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition"
                          >
                            Duplicate
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Products Card View */}
          <div className="md:hidden divide-y divide-stone-100">
            {filtered.map((product) => {
              const isLow =
                product.stockAvailable > 0 &&
                product.stockAvailable <= product.lowStockThreshold
              const isOut = product.stockAvailable <= 0
              const curr = CURRENCY_SYMBOLS[product.currency] || '$'
              const catLabel = product.categoryName || product.categorySlug || (product as any).category || 'General'

              return (
                <div key={product.id} className="p-3.5 space-y-2.5 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-xl overflow-hidden shrink-0">
                      {product.images && product.images[0]?.url && !product.images[0].url.includes('placeholder') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0].url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <span>📦</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-stone-900 text-xs truncate">{product.title}</h4>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                            product.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : product.status === 'pending_review'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                        {product.sku} · {catLabel}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-stone-900 text-sm">
                          {curr}{Number(product.sellingPrice).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-400 line-through">
                          MRP {curr}{Number(product.mrp).toLocaleString()}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200">
                          0% Fee
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-stone-500 text-[11px]">Stock:</span>
                      <span
                        className={`font-bold font-mono text-xs ${
                          isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-stone-900'
                        }`}
                      >
                        {product.stockAvailable} units
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setQuickStockProduct(product)
                          setNewStockVal(product.stockAvailable)
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold active:scale-95 transition"
                      >
                        Adjust Stock ✏️
                      </button>
                      <Link
                        href={`/seller/products/new?duplicate=${product.id}`}
                        className="px-2.5 py-1 rounded-lg bg-[#FAF6EF] text-[#163326] border border-[#C5A869]/60 text-xs font-semibold active:scale-95 transition"
                      >
                        Duplicate
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          </>
        )}
      </div>

      {/* Quick Stock Adjustment Modal */}
      {quickStockProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-stone-900 text-base">Adjust Warehouse Stock</h3>
              <button
                onClick={() => setQuickStockProduct(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-xs font-semibold text-stone-800 truncate">{quickStockProduct.title}</p>
              <p className="text-[10px] text-stone-400 font-mono">SKU: {quickStockProduct.sku}</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                New Available Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                value={newStockVal}
                onChange={(e) => setNewStockVal(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-base font-bold p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#1A3E2F]"
              />
              <p className="text-[10px] text-stone-500 mt-1">
                Previous count: {quickStockProduct.stockAvailable} units. This will append a record to your stock ledger.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setQuickStockProduct(null)}
                className="px-3 py-1.5 text-xs text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                disabled={stockUpdating}
                className="px-4 py-1.5 text-xs bg-[#1A3E2F] hover:bg-[#143226] text-white font-semibold rounded-lg"
              >
                {stockUpdating ? 'Saving...' : 'Update Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
