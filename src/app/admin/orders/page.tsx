'use client'

import React, { useEffect, useState, useCallback } from 'react'

interface AdminOrderRow {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_amount: number
  payment_method: string
  payment_status: string
  order_status: string
  fulfillment_status: string
  created_at: string
}

interface Metrics {
  totalOrders: number
  ordersToday: number
  ordersThisMonth: number
  pendingPayment: number
  paid: number
  processing: number
  readyToDispatch: number
  shipped: number
  delivered: number
  cancelled: number
  returnRequests: number
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [courierName, setCourierName] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingUrl, setTrackingUrl] = useState('')
  const [actionMsg, setActionMsg] = useState<string | null>(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/admin/orders?${params.toString()}`)
    const data = await res.json()
    if (data.success) {
      setOrders(data.orders || [])
      setMetrics(data.metrics || null)
    }
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleStatusUpdate = async (orderId: string, orderStatus: string) => {
    setActionMsg(null)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus }),
    })
    const data = await res.json()
    if (data.success) {
      setActionMsg(`Order updated to ${orderStatus}`)
      loadOrders()
    } else {
      setActionMsg(data.error || 'Update failed')
    }
  }

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId || !courierName.trim()) return
    setActionMsg(null)
    const res = await fetch(`/api/admin/orders/${selectedOrderId}/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courierName, trackingNumber, trackingUrl }),
    })
    const data = await res.json()
    if (data.success) {
      setActionMsg('Shipment created & order marked shipped.')
      setSelectedOrderId(null)
      setCourierName('')
      setTrackingNumber('')
      setTrackingUrl('')
      loadOrders()
    } else {
      setActionMsg(data.error || 'Shipment creation failed')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#17233B]">Order &amp; Fulfillment Operations</h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage customer orders, lifecycle transitions, and courier shipments.
        </p>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Orders', value: metrics.totalOrders },
            { label: 'Today', value: metrics.ordersToday },
            { label: 'Paid', value: metrics.paid },
            { label: 'Processing', value: metrics.processing },
            { label: 'Shipped', value: metrics.shipped },
            { label: 'Delivered', value: metrics.delivered },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-2xl border border-stone-200 p-4">
              <p className="text-[11px] uppercase font-bold text-stone-500">{m.label}</p>
              <p className="text-2xl font-bold text-[#17233B] mt-1">{m.value}</p>
            </div>
          ))}
        </div>
      )}

      {actionMsg && (
        <div className="rounded-xl bg-[#FAF6EE] border border-[#C9A45C]/40 px-4 py-2.5 text-xs font-semibold text-[#17233B]">
          {actionMsg}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #, name, email, phone..."
          className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs w-72"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-stone-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-stone-50/70">
                  <td className="py-3 px-4 font-mono font-bold">{o.order_number}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#17233B]">{o.customer_name}</div>
                    <div className="text-[11px] text-stone-500">
                      {o.customer_email || o.customer_phone}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold">
                    ₹{Number(o.total_amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 uppercase">{o.payment_status}</td>
                  <td className="py-3 px-4 uppercase font-semibold">{o.order_status}</td>
                  <td className="py-3 px-4 space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(o.id, 'processing')}
                      className="px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100"
                    >
                      Process
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(o.id)}
                      className="px-2.5 py-1 rounded-lg bg-[#17233B] text-white"
                    >
                      Ship
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(o.id, 'delivered')}
                      className="px-2.5 py-1 rounded-lg bg-[#176B68] text-white"
                    >
                      Deliver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrderId && (
        <form
          onSubmit={handleCreateShipment}
          className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 max-w-lg"
        >
          <h2 className="font-bold text-sm text-[#17233B]">Create Shipment</h2>
          <input
            type="text"
            required
            value={courierName}
            onChange={(e) => setCourierName(e.target.value)}
            placeholder="Courier Name (e.g. BlueDart, Delhivery)"
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
          />
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Tracking / AWB Number"
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
          />
          <input
            type="url"
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="Tracking URL (optional)"
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#17233B] text-white text-xs font-bold"
            >
              Dispatch Shipment
            </button>
            <button
              type="button"
              onClick={() => setSelectedOrderId(null)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
