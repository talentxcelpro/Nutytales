'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { SellerSupportTicket } from '@/lib/seller-portal/types'

export default function SellerSupportPage() {
  const { seller } = useSeller()
  const [tickets, setTickets] = useState<SellerSupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<SellerSupportTicket | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    subject: '',
    category: 'order_fulfilment' as SellerSupportTicket['category'],
    message: '',
    orderId: '',
  })

  const fetchTickets = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/support?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.tickets) {
          setTickets(data.tickets)
          if (data.tickets.length > 0 && !selectedTicket) {
            setSelectedTicket(data.tickets[0])
          }
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) {
      fetchTickets(seller.id)
    }
  }, [seller?.id])

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!seller?.id) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/seller/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: seller.id,
          subject: form.subject,
          category: form.category,
          message: form.message,
          orderId: form.orderId || undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.ticket) {
          setTickets([data.ticket, ...tickets])
          setSelectedTicket(data.ticket)
          setShowCreateModal(false)
          setForm({
            subject: '',
            category: 'order_fulfilment',
            message: '',
            orderId: '',
          })
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Merchant Assistance</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A3E2F] mt-1">Help & Support Desk</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Dedicated vendor support for courier pickup delays, payout reconciliation, and catalogue approvals.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A3E2F] hover:bg-[#143226] text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          <span>+</span> Open Support Ticket
        </button>
      </div>

      {/* Grid: Tickets List + Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-sm">Your Tickets</h3>
            <span className="text-xs font-mono text-stone-500">{tickets.length} total</span>
          </div>

          <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-stone-400">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">No support tickets opened.</div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 cursor-pointer transition text-xs space-y-1.5 ${
                    selectedTicket?.id === t.id ? 'bg-[#FAF6EF]' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-stone-500">{t.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-semibold text-stone-900 truncate">{t.subject}</h4>
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span className="capitalize">{t.category.replace(/_/g, ' ')}</span>
                    <span>{new Date(t.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="border-b border-stone-100 pb-3 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-stone-400">{selectedTicket.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 capitalize">
                      {selectedTicket.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 mt-1">{selectedTicket.subject}</h3>
                </div>
                {selectedTicket.orderId && (
                  <span className="text-xs font-mono bg-[#FAF6EF] border border-[#C5A869]/30 px-2.5 py-1 rounded-lg">
                    Order: {selectedTicket.orderId}
                  </span>
                )}
              </div>

              {/* Messages History */}
              <div className="space-y-3 min-h-[300px]">
                {selectedTicket.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl text-xs space-y-1 ${
                      m.sender === 'admin'
                        ? 'bg-[#1A3E2F]/5 border border-[#1A3E2F]/15 ml-6'
                        : 'bg-stone-50 border border-stone-200 mr-6'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className={m.sender === 'admin' ? 'text-[#1A3E2F]' : 'text-stone-800'}>
                        {m.senderName} {m.sender === 'admin' && '🛡️ (Marketplace Ops)'}
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        {new Date(m.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-stone-400">
              Select a ticket to view conversation history.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateTicket}
            className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif font-bold text-stone-900 text-base">Open Support Inquiry</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Issue Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#1A3E2F]"
              >
                <option value="shipping">Logistics & Courier Pickup Delay</option>
                <option value="order_fulfilment">Order Packaging & Customer Instruction</option>
                <option value="payout">Financial Settlement & Payout Query</option>
                <option value="product_approval">Catalogue Approval & Compliance</option>
                <option value="other">General Merchant Support</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Related Order ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. SO-2026-89101"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Subject *</label>
              <input
                type="text"
                placeholder="Brief summary of the issue..."
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Message *</label>
              <textarea
                rows={4}
                placeholder="Explain the issue with relevant batch numbers, AWB tracking, or dates..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 text-xs bg-[#1A3E2F] hover:bg-[#143226] text-white font-bold rounded-lg shadow-xs"
              >
                {submitting ? 'Submitting...' : 'Send to Support Desk'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
