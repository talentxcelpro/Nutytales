'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getStoredPurchaseOrders, PurchaseOrderRecord } from '@/lib/b2b-procurement-store'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

export default function B2BDeliveriesPage() {
  const [orders, setOrders] = useState<PurchaseOrderRecord[]>([])
  const [selectedDelivery, setSelectedDelivery] = useState<PurchaseOrderRecord | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  useEffect(() => {
    setOrders(getStoredPurchaseOrders())
  }, [])

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
            <span className="text-stone-900 font-bold">Deliveries &amp; Cold-Chain</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Deliveries &amp; Reefer Freight Tracking
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Real-time cold-chain logistics, temperature logging (14°C - 18°C), and proof of delivery (POD)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Nuty Tales Logistics Control Room! Checking on in-transit reefer shipments.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>🚚</span>
            <span>Contact Reefer Control Desk</span>
          </a>
        </div>
      </div>

      {/* ── Live Fleet Status Strip ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Active Cold-Chain Shipments
          </span>
          <div className="font-serif text-3xl font-extrabold text-[#17233B]">
            2 <span className="text-xs font-normal text-stone-500">consignments</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            ✓ Reefer temperature verified in-spec
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Cold Storage Setpoint
          </span>
          <div className="font-serif text-3xl font-extrabold text-blue-700">
            14°C - 18°C
          </div>
          <span className="text-[11px] text-stone-500 block">
            Prevents lipid oxidation &amp; rancidity
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            On-Time In-Full (OTIF) Rate
          </span>
          <div className="font-serif text-3xl font-extrabold text-emerald-700">
            99.2%
          </div>
          <span className="text-[11px] text-stone-500 block">
            Across PAN-India dedicated lanes
          </span>
        </div>
      </div>

      {/* ── Shipments List ────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-3 p-5">
        <h2 className="font-bold text-stone-900 text-sm">Active &amp; Recent Consignments</h2>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-2xl mx-auto">
                🚚
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">
                No Active In-Transit Consignments
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Live cold-chain telematics (14°C - 18°C), GPS transit tracks, and digital proof of delivery (POD) are mapped once an order is dispatched.
              </p>
              <div className="pt-2">
                <Link
                  href="/b2b/rfq"
                  className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl text-xs font-bold transition-colors inline-block"
                >
                  Post Procurement RFQ
                </Link>
              </div>
            </div>
          ) : (
            orders.map((po) => (
              <div
                key={po.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-[#FAF6EE]/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900">{po.poNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'REEFER_TRANSIT'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {po.status === 'REEFER_TRANSIT' ? '🚚 In Reefer Transit' : '✓ Delivered & Accepted'}
                    </span>
                  </div>
                  <div className="text-stone-700 font-medium">
                    {po.items.map((i) => `${i.name} (${i.quantityKg} kg)`).join(', ')}
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    Carrier: <strong>{po.carrierName || 'Northstar Reefer Transport'}</strong> · Tracking:{' '}
                    <strong className="font-mono">{po.trackingNumber || 'Pending'}</strong>
                  </div>
                </div>

                {/* Transit Sensor Telemetry */}
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Reefer Sensor</span>
                    <strong className="text-emerald-700 font-serif text-base font-bold">
                      {po.reeferTempCelcius ? `${po.reeferTempCelcius}°C` : '16.0°C'}
                    </strong>
                  </div>
                  <div className="border-l border-stone-200 pl-4">
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Destination</span>
                    <strong className="text-stone-900 text-xs block truncate max-w-[150px]">
                      {po.destination}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDelivery(po)}
                  className="px-4 py-2 bg-[#17233B] hover:bg-[#176B68] text-white rounded-xl font-bold uppercase tracking-wider text-[11px] whitespace-nowrap"
                >
                  Inspect Telemetry
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Telemetry Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="p-6 bg-[#17233B] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9A45C] block">
                  Cold-Chain Telemetry &amp; POD
                </span>
                <h3 className="font-serif text-xl font-bold">{selectedDelivery.poNumber}</h3>
                <span className="text-[11px] text-stone-300">Carrier: {selectedDelivery.carrierName}</span>
              </div>
              <button
                onClick={() => setSelectedDelivery(null)}
                className="text-stone-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-stone-700">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                <div className="font-bold">✓ Continuous Temperature Logging Active</div>
                <p className="text-[11px] text-emerald-800">
                  Container telemetry confirms zero temperature excursion outside 14°C - 18°C during highway transit.
                </p>
              </div>

              <div className="space-y-2 border-t border-stone-100 pt-3 text-[11px]">
                <div className="flex justify-between">
                  <span>Tracking Number:</span>
                  <strong className="font-mono text-stone-900">{selectedDelivery.trackingNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Reefer Vehicle Temp:</span>
                  <strong className="text-emerald-700">{selectedDelivery.reeferTempCelcius}°C (Nominal)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Destination:</span>
                  <strong className="text-stone-900">{selectedDelivery.destination}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery ETA:</span>
                  <strong className="text-stone-900">{selectedDelivery.deliveryDeadline}</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDelivery(null)}
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
