'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { StockMovement } from '@/lib/seller-portal/types'

interface InventoryItem {
  productId: string
  sku: string
  title: string
  category: string
  stockAvailable: number
  stockReserved: number
  lowStockThreshold: number
  status: string
}

export default function SellerInventoryPage() {
  const { seller } = useSeller()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [adjustItem, setAdjustItem] = useState<InventoryItem | null>(null)
  const [adjustQty, setAdjustQty] = useState(0)
  const [adjustReason, setAdjustReason] = useState('New production batch restock')
  const [adjustNotes, setAdjustNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchInventory = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/inventory?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.inventory) setItems(data.inventory)
        if (data.movements) setMovements(data.movements)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchInventory(seller.id)
    }
  }, [seller?.id])

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustItem || !seller?.id) return
    setUpdating(true)

    try {
      const res = await fetch('/api/seller/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          productId: adjustItem.productId,
          newStockQty: adjustQty,
          reason: adjustReason,
          notes: adjustNotes,
        }),
      })

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.productId === adjustItem.productId ? { ...i, stockAvailable: adjustQty } : i
          )
        )
        setMovements((prev) => [
          {
            id: `SMOV-${Date.now().toString().slice(-4)}`,
            sellerId: seller.id,
            productId: adjustItem.productId,
            sku: adjustItem.sku,
            productTitle: adjustItem.title,
            changeQty: adjustQty - adjustItem.stockAvailable,
            balanceAfter: adjustQty,
            movementType: 'manual_adjustment',
            referenceId: adjustReason,
            notes: adjustNotes || adjustReason,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ])
        setAdjustItem(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Warehouse Tracking</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A3E2F] mt-1">Inventory & Stock Movement</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time SKU stock levels, reservation holds for open customer orders, and immutable audit ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold">
            Transactional Reservation Active
          </span>
        </div>
      </div>

      {/* Grid: Stock Table + Movements Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: SKU Inventory Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-base">Per-SKU Stock Levels</h3>
            <span className="text-xs text-stone-500">{items.length} Active SKUs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Product Title</th>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Available</th>
                  <th className="py-3 px-4">Reserved</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4 text-right">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-stone-400">Loading stock...</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-stone-400">No products configured yet.</td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isLow =
                      item.stockAvailable > 0 && item.stockAvailable <= item.lowStockThreshold
                    const isOut = item.stockAvailable <= 0

                    return (
                      <tr key={item.sku} className="hover:bg-stone-50 transition">
                        <td className="py-3.5 px-4 font-semibold text-stone-900 truncate max-w-xs">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-600">{item.sku}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-bold ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-stone-900'
                            }`}
                          >
                            {item.stockAvailable} units
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-stone-500">
                          {item.stockReserved} units
                        </td>
                        <td className="py-3.5 px-4 text-stone-500">{item.lowStockThreshold} units</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setAdjustItem(item)
                              setAdjustQty(item.stockAvailable)
                            }}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-[#1A3E2F] hover:text-white transition font-medium text-[11px]"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Audit Ledger Movements */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif font-bold text-stone-900 text-base">Movement Ledger</h3>
            <span className="text-[10px] uppercase font-bold text-[#C5A869]">Audit Trail</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {movements.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-6">No movement events logged yet.</p>
            ) : (
              movements.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-stone-500">{m.sku}</span>
                    <span
                      className={`font-bold font-mono ${
                        m.changeQty > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {m.changeQty > 0 ? `+${m.changeQty}` : m.changeQty} units
                    </span>
                  </div>
                  <div className="font-medium text-stone-800 capitalize">
                    {m.movementType.replace(/_/g, ' ')}
                  </div>
                  {m.notes && <p className="text-[11px] text-stone-600">{m.notes}</p>}
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                    <span>Balance After: {m.balanceAfter}</span>
                    <span>
                      {new Date(m.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustStock}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif font-bold text-stone-900 text-base">Record Stock Adjustment</h3>
              <button
                type="button"
                onClick={() => setAdjustItem(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="text-xs font-semibold text-stone-800">{adjustItem.title}</div>
              <div className="text-[10px] text-stone-400 font-mono">SKU: {adjustItem.sku}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Current Stock</label>
                <div className="text-base font-bold text-stone-500 p-2 bg-stone-100 rounded-lg">
                  {adjustItem.stockAvailable} units
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">New Total Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-full text-base font-bold p-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#1A3E2F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Adjustment Reason *</label>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#1A3E2F]"
              >
                <option value="New production batch restock">New production batch restock</option>
                <option value="Physical warehouse stock count reconciliation">Physical warehouse stock count reconciliation</option>
                <option value="Damaged in transit / defective write-off">Damaged in transit / defective write-off</option>
                <option value="B2B wholesale allocation">B2B wholesale allocation</option>
                <option value="Sample / marketing dispatch">Sample / marketing dispatch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Internal Notes</label>
              <input
                type="text"
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
                placeholder="e.g. Batch Lot #26-NOV cracked and vacuum packed"
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustItem(null)}
                className="px-4 py-2 text-xs text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 text-xs bg-[#1A3E2F] hover:bg-[#143226] text-white font-bold rounded-lg shadow-xs"
              >
                {updating ? 'Saving...' : 'Apply & Append Ledger'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
