'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { SellerOrder, OrderFulfilmentStatus, CURRENCY_SYMBOLS, SupportedCurrency } from '@/lib/seller-portal/types'

export default function SellerOrdersPage() {
  const { seller, reportingCurrency, formatCurrencyAmount } = useSeller()
  const [orders, setOrders] = useState<SellerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [carrierInput, setCarrierInput] = useState({
    carrierName: 'DHL Express Worldwide',
    trackingNumber: '',
  })

  const fetchOrders = async (sellerId: string, status = 'all') => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/orders?sellerId=${sellerId}&status=${status}`)
      if (res.ok) {
        const data = await res.json()
        if (data.orders) setOrders(data.orders)
      }
    } catch (err) {
      console.error('Failed to load seller orders:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchOrders(seller.id, statusFilter)
    }
  }, [seller?.id, statusFilter])

  const handleStatusTransition = async (orderId: string, nextStatus: OrderFulfilmentStatus) => {
    setActionLoading(true)
    try {
      const payload: any = { status: nextStatus }
      if (nextStatus === 'packed' || nextStatus === 'ready_for_pickup' || nextStatus === 'shipped') {
        payload.carrierName = carrierInput.carrierName
        payload.trackingNumber =
          carrierInput.trackingNumber || `BLUEDART-${Math.floor(1000000000 + Math.random() * 9000000000)}`
        payload.awbCode = `AWB-${payload.trackingNumber.slice(-8)}`
        payload.pickupScheduledAt = new Date().toISOString()
      }

      const res = await fetch(`/api/seller/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)))
          if (selectedOrder?.id === orderId) {
            setSelectedOrder(data.order)
          }
        }
      }
    } catch (err) {
      console.error('Failed to transition order status:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const formatOrderCurrency = (val: number, curr?: SupportedCurrency) => {
    const symbol = curr ? (CURRENCY_SYMBOLS[curr] || '$') : (CURRENCY_SYMBOLS[reportingCurrency] || '$')
    return `${symbol}${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getStatusBadge = (status: OrderFulfilmentStatus) => {
    const map: Record<string, string> = {
      new: 'bg-amber-100 text-amber-800 border-amber-200',
      accepted: 'bg-sky-100 text-sky-800 border-sky-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      packed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      ready_for_pickup: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-violet-100 text-violet-800 border-violet-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
      returned: 'bg-stone-200 text-stone-800 border-stone-300',
    }

    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          map[status] || 'bg-stone-100 text-stone-700'
        }`}
      >
        {status.replace(/_/g, ' ')}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Fulfilment Operations</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A3E2F] mt-1">Orders & Dispatch</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Isolated vendor fulfillment sub-orders with packing slips, carrier scheduling and delivery reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Pickup Warehouse:</span>
          <span className="text-xs font-mono font-semibold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200">
            {seller?.city} ({seller?.pincode})
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-xs flex flex-wrap gap-1">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'new', label: 'New Action Required' },
          { key: 'packed', label: 'Packed & Awaiting Courier' },
          { key: 'shipped', label: 'In Transit' },
          { key: 'delivered', label: 'Delivered (Settled)' },
          { key: 'cancelled', label: 'Cancelled / Returns' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === tab.key
                ? 'bg-[#1A3E2F] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className={`bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden ${selectedOrder ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500">Loading fulfillment orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="text-4xl">🚚</div>
              <h3 className="font-serif font-bold text-stone-800 text-base">No Orders in this Status</h3>
              <p className="text-xs text-stone-500">There are no sub-orders matching the selected filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Sub-Order #</th>
                    <th className="py-3 px-4">Parent Order</th>
                    <th className="py-3 px-4">Customer & City</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer transition hover:bg-stone-50 ${
                        selectedOrder?.id === order.id ? 'bg-[#FAF6EF]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-stone-900">
                        {order.id}
                        <div className="text-[10px] text-stone-400 font-sans">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                        {order.parentOrderNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{order.customerName}</div>
                        <div className="text-[10px] text-stone-500">
                          {order.customerCity}, {order.customerState}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-stone-700">
                        <span className="font-medium">{order.itemsCount} Unit(s)</span>
                        <div className="text-[10px] text-stone-400 truncate max-w-[140px]">
                          {order.items[0]?.title}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {formatOrderCurrency(order.netPayout, order.currency)}
                      </td>

                      <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOrder(order)
                          }}
                          className="px-2.5 py-1 rounded bg-stone-100 hover:bg-[#1A3E2F] hover:text-white transition font-medium text-[11px]"
                        >
                          Fulfill →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details & Workflow Drawer */}
        {selectedOrder && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#C5A869]">Fulfilment Details</span>
                <h3 className="font-serif font-bold text-lg text-stone-900">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            {/* Status Lifecycle Stepper */}
            <div className="p-3 bg-[#FAF6EF] rounded-xl border border-[#C5A869]/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600 font-medium">Lifecycle Status:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className="text-[11px] text-stone-500">
                Parent Customer Order: <span className="font-mono font-medium text-stone-800">{selectedOrder.parentOrderNumber}</span>
              </div>
            </div>

            {/* Customer Sanitized Delivery Info */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">
                Sanitized Delivery Address
              </h4>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-stone-700 space-y-0.5">
                <div className="font-semibold text-stone-900">{selectedOrder.customerName}</div>
                <div>{selectedOrder.deliveryAddress}</div>
                <div>{selectedOrder.customerCity}, {selectedOrder.customerState} - {selectedOrder.customerPincode}</div>
                <div className="text-[10px] text-stone-400 font-mono">Masked Contact: {selectedOrder.customerPhoneMasked}</div>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">Line Items</h4>
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-stone-900">{item.title}</div>
                      <div className="text-[10px] text-stone-500">
                        {item.variantName} · SKU: {item.sku}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.qty} × {formatOrderCurrency(item.unitPrice, selectedOrder.currency)}</div>
                      <div className="text-[10px] text-stone-500 font-mono">{formatOrderCurrency(item.totalPrice, selectedOrder.currency)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Ledger Breakdown */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Order Subtotal:</span>
                <span className="font-mono">{formatOrderCurrency(selectedOrder.subtotal, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Platform Commission ({selectedOrder.commissionRate}%):</span>
                <span className="font-mono text-rose-700">-{formatOrderCurrency(selectedOrder.commissionAmount, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Taxes & Compliance on Fee:</span>
                <span className="font-mono text-rose-700">-{formatOrderCurrency(selectedOrder.gstOnCommission || selectedOrder.taxOnCommission || 0, selectedOrder.currency)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Tax Withholding:</span>
                <span className="font-mono text-rose-700">-{formatOrderCurrency(selectedOrder.tdsAmount || selectedOrder.withholdingTaxAmount || 0, selectedOrder.currency)}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-emerald-800 text-sm">
                <span>Net Seller Payable:</span>
                <span className="font-mono">{formatOrderCurrency(selectedOrder.netPayout, selectedOrder.currency)}</span>
              </div>
            </div>

            {/* Carrier Tracking (if shipped/packed) */}
            {selectedOrder.trackingNumber && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-blue-900 text-xs">Carrier Dispatched</div>
                <div className="text-blue-800">{selectedOrder.carrierName}</div>
                <div className="font-mono text-[11px] text-blue-900">AWB: {selectedOrder.trackingNumber}</div>
              </div>
            )}

            {/* Action Buttons Workflow */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              {selectedOrder.status === 'new' && (
                <button
                  onClick={() => handleStatusTransition(selectedOrder.id, 'accepted')}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-[#1A3E2F] hover:bg-[#143226] text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  Accept Sub-Order & Begin Packing
                </button>
              )}

              {selectedOrder.status === 'accepted' && (
                <div className="space-y-2">
                  <div className="text-xs space-y-1">
                    <label className="font-semibold text-stone-700">Select Logistics Carrier:</label>
                    <select
                      value={carrierInput.carrierName}
                      onChange={(e) => setCarrierInput({ ...carrierInput, carrierName: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg text-xs"
                    >
                      <option value="DHL Express Worldwide">DHL Express Worldwide</option>
                      <option value="FedEx International Priority">FedEx International Priority</option>
                      <option value="UPS Worldwide Express">UPS Worldwide Express</option>
                      <option value="BlueDart Express Air Cargo">BlueDart Express Air Cargo</option>
                      <option value="Aramex International">Aramex International</option>
                      <option value="Royal Mail International Tracked">Royal Mail International Tracked</option>
                    </select>
                  </div>
                  <button
                    onClick={() => handleStatusTransition(selectedOrder.id, 'packed')}
                    disabled={actionLoading}
                    className="w-full py-2.5 bg-[#1A3E2F] hover:bg-[#143226] text-white text-xs font-bold rounded-lg shadow-xs transition"
                  >
                    Pack Parcel & Generate Shipping Manifest
                  </button>
                </div>
              )}

              {selectedOrder.status === 'packed' && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusTransition(selectedOrder.id, 'shipped')}
                    disabled={actionLoading}
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
                  >
                    Handover to Courier Van & Mark Shipped
                  </button>
                  <button
                    onClick={() => alert(`Printing Packing Slip for ${selectedOrder.id}...`)}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300"
                  >
                    🖨️ Print Packing Slip & Shipping Label
                  </button>
                </div>
              )}

              {selectedOrder.status === 'shipped' && (
                <button
                  onClick={() => handleStatusTransition(selectedOrder.id, 'delivered')}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  Confirm Delivery & Unlock Payout Ledger
                </button>
              )}

              {selectedOrder.status === 'delivered' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs text-center font-medium">
                  ✓ Order Delivered. Credited to financial settlement queue.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
