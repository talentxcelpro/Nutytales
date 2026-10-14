'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { WHATSAPP_NUMBERS, DEFAULT_CONTACT_PHONE, FSSAI_NUMBER } from '@/lib/constants'

interface InvoiceItem {
  id: string
  invoiceNumber: string
  poNumber: string
  supplier: string
  date: string
  dueDate: string
  items: string
  quantityKg: number
  taxableAmount: number
  gstAmount: number
  totalAmount: number
  hsnCode: string
  status: 'PAID' | 'PAYMENT_DUE' | 'OVERDUE'
  paymentMethod: string
  gstinSupplier: string
}

const SEED_INVOICES: InvoiceItem[] = [
  {
    id: 'INV-2026-0412',
    invoiceNumber: 'NT-INV-2026-0412',
    poNumber: 'PO-2026-089',
    supplier: 'Kashmir Valley Nut Agro-Procurement Hub',
    date: '2026-10-12',
    dueDate: '2026-11-11',
    items: 'Kashmiri Organic Walnuts (Grade 1 Halves)',
    quantityKg: 500,
    taxableAmount: 420000,
    gstAmount: 21000,
    totalAmount: 441000,
    hsnCode: '0802.31.00',
    status: 'PAYMENT_DUE',
    paymentMethod: 'Net-30 Corporate Facility',
    gstinSupplier: '01AABCK1234F1Z8',
  },
  {
    id: 'INV-2026-0398',
    invoiceNumber: 'NT-INV-2026-0398',
    poNumber: 'PO-2026-088',
    supplier: 'Golden Valley Nut Growers Co-op',
    date: '2026-10-08',
    dueDate: '2026-11-07',
    items: 'California Nonpareil Almonds (Extra #1, 23/25)',
    quantityKg: 1200,
    taxableAmount: 852000,
    gstAmount: 42600,
    totalAmount: 894600,
    hsnCode: '0802.12.00',
    status: 'PAID',
    paymentMethod: 'RTGS Electronic Transfer',
    gstinSupplier: '27AABCG5544B1ZV',
  },
  {
    id: 'INV-2026-0382',
    invoiceNumber: 'NT-INV-2026-0382',
    poNumber: 'PO-2026-084',
    supplier: 'Pampore Royal Saffron Syndicate',
    date: '2026-09-28',
    dueDate: '2026-10-28',
    items: 'Kashmir GI Saffron (Grade A1 Mongra, 5kg)',
    quantityKg: 5,
    taxableAmount: 1100000,
    gstAmount: 55000,
    totalAmount: 1155000,
    hsnCode: '0910.20.10',
    status: 'PAID',
    paymentMethod: 'Net-30 Corporate Facility',
    gstinSupplier: '01AABCP9988C1ZR',
  },
  {
    id: 'INV-2026-0365',
    invoiceNumber: 'NT-INV-2026-0365',
    poNumber: 'PO-2026-079',
    supplier: 'Mithila Makhana Farmers Alliance',
    date: '2026-09-15',
    dueDate: '2026-10-15',
    items: 'GI Mithila Makhana (6 Suta Jumbo 24mm+)',
    quantityKg: 2000,
    taxableAmount: 1440000,
    gstAmount: 72000,
    totalAmount: 1512000,
    hsnCode: '1904.10.20',
    status: 'PAID',
    paymentMethod: 'RTGS Electronic Transfer',
    gstinSupplier: '10AABCM4433D1ZS',
  },
]

export default function B2BInvoicesPage() {
  const [invoices] = useState<InvoiceItem[]>(SEED_INVOICES)
  const [activeTab, setActiveTab] = useState<'ALL' | 'DUE' | 'PAID'>('ALL')
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null)

  const whatsappPhone = (WHATSAPP_NUMBERS.SUPPORT || DEFAULT_CONTACT_PHONE).replace(/\D/g, '')

  const filteredInvoices = invoices.filter((inv) => {
    if (activeTab === 'DUE') return inv.status === 'PAYMENT_DUE'
    if (activeTab === 'PAID') return inv.status === 'PAID'
    return true
  })

  // Summary Metrics
  const totalTaxable = invoices.reduce((acc, i) => acc + i.taxableAmount, 0)
  const totalGstAccrued = invoices.reduce((acc, i) => acc + i.gstAmount, 0)
  const totalOutstanding = invoices
    .filter((i) => i.status === 'PAYMENT_DUE')
    .reduce((acc, i) => acc + i.totalAmount, 0)

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#17233B] text-[#C9A45C]">
              Commercial Accounting
            </span>
            <span className="text-xs text-stone-500 font-medium">GSTR-2B Ready · 5% Input Credit</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1322] mt-1">
            Tax Invoices &amp; Credit Ledger
          </h1>
          <p className="text-xs text-stone-600 mt-0.5">
            Manage tax-compliant e-invoices, verify HSN classifications, reconcile GST input credit, and track Net-30 working capital settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
              'Hello Accounts Desk! I need statements for GSTR-2B reconciliation for Royal Confectionery Ltd.',
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-700 shadow-sm"
          >
            <span>💬</span> Accounts Desk Support
          </a>
          <button
            onClick={() => alert('Exporting GSTR-2B compatible JSON & CSV spreadsheet...')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1322] hover:bg-[#17233B] text-xs font-bold text-white shadow-sm"
          >
            <span>📥</span> Export Tax Ledger
          </button>
        </div>
      </div>

      {/* Credit & Financial Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Net-30 Credit Line
          </div>
          <div className="text-2xl font-bold text-[#0A1322]">₹50,00,000</div>
          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved Facility · 0% Interest within 30d
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Current Outstanding
          </div>
          <div className="text-2xl font-bold text-amber-700">₹{totalOutstanding.toLocaleString('en-IN')}</div>
          <div className="text-xs text-stone-500">
            1 invoice due on Nov 11, 2026
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Available Credit
          </div>
          <div className="text-2xl font-bold text-emerald-800">
            ₹{(5000000 - totalOutstanding).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-500">
            Immediate dispatch buffer without prepayment
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            GST Input Credit Accrued
          </div>
          <div className="text-2xl font-bold text-[#176B68]">₹{totalGstAccrued.toLocaleString('en-IN')}</div>
          <div className="text-xs text-stone-500">
            Automated upload to GST Portal by 11th of month
          </div>
        </div>
      </div>

      {/* Tabs & Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4 bg-stone-50/60">
          <div className="flex items-center gap-2">
            {(['ALL', 'DUE', 'PAID'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === tab
                    ? 'bg-[#0A1322] text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {tab === 'ALL' ? 'All Invoices' : tab === 'DUE' ? 'Payment Due' : 'Settled / Paid'}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500">
            Showing <strong className="text-stone-800">{filteredInvoices.length}</strong> tax invoices
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3.5 pl-5">Invoice &amp; PO Ref</th>
                <th className="p-3.5">Vendor / Supplier</th>
                <th className="p-3.5">HSN &amp; Commodity</th>
                <th className="p-3.5 text-right">Taxable (₹)</th>
                <th className="p-3.5 text-right">GST (5%)</th>
                <th className="p-3.5 text-right">Total (₹)</th>
                <th className="p-3.5 text-center">Due Date</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3.5 pl-5 font-medium">
                    <div className="font-bold text-stone-900 font-mono">{inv.invoiceNumber}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{inv.poNumber}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900">{inv.supplier}</div>
                    <div className="text-[10px] text-stone-500 font-mono">GSTIN: {inv.gstinSupplier}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-stone-800 line-clamp-1">{inv.items}</div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      HSN {inv.hsnCode} · {inv.quantityKg} kg
                    </div>
                  </td>
                  <td className="p-3.5 text-right font-mono font-medium text-stone-800">
                    ₹{inv.taxableAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-mono text-emerald-700 font-semibold">
                    ₹{inv.gstAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-stone-900">
                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center text-[11px] font-mono text-stone-600">
                    {inv.dueDate}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {inv.status === 'PAID' ? 'Settled' : 'Payment Due'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right pr-5">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1 rounded-lg border border-stone-300 hover:border-stone-400 bg-white text-[11px] font-bold text-[#0A1322] shadow-sm"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#704B32] block">
                  Tax Proforma &amp; Commercial Invoice
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0A1322]">
                  {selectedInvoice.invoiceNumber}
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Linked to Purchase Order: {selectedInvoice.poNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Bill To & Bill From */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">Supplier (Billed From)</div>
                <div className="font-bold text-stone-900">{selectedInvoice.supplier}</div>
                <div className="text-stone-600 font-mono mt-0.5">GSTIN: {selectedInvoice.gstinSupplier}</div>
                <div className="text-stone-500 text-[11px]">FSSAI Lic. #{FSSAI_NUMBER}</div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold text-stone-500 mb-1">Purchaser (Billed To)</div>
                <div className="font-bold text-stone-900">Royal Confectionery Ltd</div>
                <div className="text-stone-600 font-mono mt-0.5">GSTIN: 07AAAAA0000A1Z5</div>
                <div className="text-stone-500 text-[11px]">Noida Special Economic Zone, UP</div>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Itemized Commercial Valuation
              </div>
              <div className="rounded-xl border border-stone-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 text-stone-600 font-semibold text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3">HSN Code</th>
                      <th className="p-3 text-right">Weight</th>
                      <th className="p-3 text-right">Taxable</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 font-medium text-stone-800">{selectedInvoice.items}</td>
                      <td className="p-3 font-mono text-stone-600">{selectedInvoice.hsnCode}</td>
                      <td className="p-3 text-right font-mono">{selectedInvoice.quantityKg} kg</td>
                      <td className="p-3 text-right font-mono font-bold text-stone-900">
                        ₹{selectedInvoice.taxableAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tax Computation Summary */}
            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal (Assessable Value):</span>
                <span className="font-mono font-medium">₹{selectedInvoice.taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>CGST (2.5%) + SGST (2.5%) / IGST (5%):</span>
                <span className="font-mono font-bold">+₹{selectedInvoice.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-[#0A1322]">
                <span>Total Gross Landed Value:</span>
                <span className="font-mono">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-[11px] text-stone-500">
                Payment Terms: <strong className="text-stone-800">{selectedInvoice.paymentMethod}</strong>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => alert(`Downloading signed PDF invoice: ${selectedInvoice.invoiceNumber}...`)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-xs font-bold text-stone-800"
                >
                  Download PDF
                </button>
                {selectedInvoice.status === 'PAYMENT_DUE' ? (
                  <button
                    onClick={() => {
                      alert('Processing payment via Corporate Escrow Gateway...')
                      setSelectedInvoice(null)
                    }}
                    className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white shadow-sm"
                  >
                    Initiate RTGS Transfer
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
                    ✓ Paid &amp; Reconciled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
