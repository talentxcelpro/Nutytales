'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getStoredPurchaseOrders,
  PurchaseOrderRecord,
} from '@/lib/b2b-procurement-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrderRecord[]>([])
  const [selectedPo, setSelectedPo] = useState<PurchaseOrderRecord | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('ALL')

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setOrders(getStoredPurchaseOrders())
  }, [])

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true
    return o.status === filterStatus
  })

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Top Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-1">
            <Link href="/b2b/dashboard" className="hover:text-stone-900">
              Dashboard
            </Link>
            <span>&gt;</span>
            <span className="text-stone-900 font-bold">Purchase Orders</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Purchase Orders &amp; Logistics Tracking
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Confirmed commercial purchase contracts, cold-chain reefer dispatches, and delivery acknowledgements
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/b2b/rfq"
            className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>+</span>
            <span>New Procurement RFQ</span>
          </Link>
        </div>
      </div>

      {/* ── Filter Tabs ───────────────────────────────────────────────────────── */}
      <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'REEFER_TRANSIT', label: 'In-Transit (Reefer)' },
            { id: 'DELIVERED', label: 'Delivered' },
            { id: 'ACKNOWLEDGED', label: 'Processing' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                filterStatus === tab.id
                  ? 'bg-[#17233B] text-white'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-stone-500 text-[11px] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Reefer Monitoring: 14°C - 18°C Controlled</span>
        </div>
      </div>

      {/* ── Purchase Orders Table ─────────────────────────────────────────────── */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 sm:p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 flex items-center justify-center text-3xl mx-auto">
            📦
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">No Purchase Orders Issued Yet</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Once you accept a supplier quotation or confirm a spot contract, your official purchase contract, reefer telemetry, and tax invoice will appear here.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/b2b/rfq"
              className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E65100] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              + Post New Procurement RFQ
            </Link>
            <Link
              href="/b2b/quotes"
              className="px-5 py-2.5 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              View Quotes Desk
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold tracking-wider border-b border-stone-200">
                <th className="py-3.5 px-4">PO Ref</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Commodity Lot</th>
                <th className="py-3.5 px-4">Order Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Terms</th>
                <th className="py-3.5 px-4">Logistics / Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {filteredOrders.map((po) => {
                const isTransit = po.status === 'REEFER_TRANSIT'
                const isDelivered = po.status === 'DELIVERED'

                return (
                  <tr key={po.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {po.poNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      <div>{po.supplierName}</div>
                      <span className="text-[10px] text-stone-400">📍 {po.supplierLocation}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {po.items.map((item) => (
                        <div key={item.name} className="space-y-0.5">
                          <span className="font-semibold text-stone-900">{item.name}</span>
                          <span className="text-[11px] text-stone-500 block">
                            {item.quantityKg} kg @ ₹{item.unitRate}/kg
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{po.orderDate}</td>
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-[#17233B]">
                      ₹{po.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        {po.paymentTerms}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isTransit
                              ? 'bg-blue-100 text-blue-800'
                              : isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {po.status === 'REEFER_TRANSIT' ? '🚚 In Reefer Transit' : po.status}
                        </span>
                        {po.trackingNumber && (
                          <div className="text-[10px] text-stone-500 font-mono">
                            {po.trackingNumber} ({po.reeferTempCelcius}°C)
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPo(po)}
                          className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold text-[11px]"
                        >
                          Invoice &amp; Specs
                        </button>
                        <Link
                          href={`/b2b/deliveries?po=${po.poNumber}`}
                          className="px-3 py-1 bg-[#17233B] hover:bg-[#176B68] text-white rounded-lg font-bold text-[11px]"
                        >
                          Track
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )}

      {/* ── Purchase Order Modal Dossier ─────────────────────────────────────── */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-xl w-full overflow-hidden text-xs">
            <div className="p-6 bg-[#17233B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                  Official Purchase Order Record
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedPo.poNumber}</h3>
                <span className="text-[11px] text-stone-300">Supplier: {selectedPo.supplierName}</span>
              </div>
              <button
                onClick={() => setSelectedPo(null)}
                className="text-stone-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-stone-700">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
                <div>
                  <span className="text-stone-500 block">Linked RFQ:</span>
                  <strong className="text-stone-900 font-mono">{selectedPo.rfqNumber}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Proforma Invoice:</span>
                  <strong className="text-stone-900 font-mono">{selectedPo.invoiceNumber || 'NT-INV-PENDING'}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Delivery Destination:</span>
                  <strong className="text-stone-900">{selectedPo.destination}</strong>
                </div>
                <div>
                  <span className="text-stone-500 block">Target ETA:</span>
                  <strong className="text-stone-900">{selectedPo.deliveryDeadline}</strong>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-500 text-[10px] uppercase font-bold border-b border-stone-200">
                    <tr>
                      <th className="py-2 px-3">Item Description</th>
                      <th className="py-2 px-3">Qty</th>
                      <th className="py-2 px-3">Rate</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedPo.items.map((i) => (
                      <tr key={i.name}>
                        <td className="py-2.5 px-3 font-medium text-stone-900">{i.name}</td>
                        <td className="py-2.5 px-3">{i.quantityKg} kg</td>
                        <td className="py-2.5 px-3">₹{i.unitRate}/kg</td>
                        <td className="py-2.5 px-3 text-right font-bold">₹{i.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#FAF6EE] rounded-xl border border-stone-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <strong className="text-stone-900">₹{selectedPo.subtotal.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Insured Freight:</span>
                  <strong className="text-stone-900">₹{selectedPo.freightAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% ITC Eligible):</span>
                  <strong className="text-stone-900">₹{selectedPo.gstAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-1.5 text-sm">
                  <span>Total Order Payable:</span>
                  <strong className="text-[#17233B]">₹{selectedPo.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center">
              <span className="text-[11px] text-stone-500">
                FSSAI Central Lic. {FSSAI_NUMBER}
              </span>
              <button
                type="button"
                onClick={() => setSelectedPo(null)}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
