'use client'

import React, { useState, useEffect } from 'react'
import { useSeller } from '../SellerContext'
import { SellerLedgerEntry, SellerPayoutBatch } from '@/lib/seller-portal/types'

export default function SellerFinancePage() {
  const { seller, reportingCurrency, formatCurrencyAmount } = useSeller()
  const [ledger, setLedger] = useState<SellerLedgerEntry[]>([])
  const [payouts, setPayouts] = useState<SellerPayoutBatch[]>([])
  const [availableBalance, setAvailableBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchFinance = async (sellerId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/finance?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.ledger) setLedger(data.ledger)
        if (data.payouts) setPayouts(data.payouts)
        if (data.financialSummary?.availableBalance !== undefined) {
          setAvailableBalance(data.financialSummary.availableBalance)
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
      fetchFinance(seller.id)
    }
  }, [seller?.id])

  const handleRequestPayout = async () => {
    if (!seller?.id) return
    setRequesting(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/seller/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: seller.id }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payout request failed')
      }

      setMessage(`Payout request ${data.payout.id} queued for settlement.`)
      await fetchFinance(seller.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setRequesting(false)
    }
  }

  const handleDownloadCsv = () => {
    if (ledger.length === 0) return
    const headers = ['Transaction ID', 'Date', 'Type', `Amount (${reportingCurrency})`, `Balance After (${reportingCurrency})`, 'Reference', 'Description']
    const rows = ledger.map((l) => [
      l.id,
      new Date(l.createdAt).toISOString(),
      l.entryType,
      l.amount,
      l.balanceAfter,
      l.referenceCode || '',
      `"${l.description.replace(/"/g, '""')}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `nutytales_seller_ledger_${seller?.id}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatAmount = (val: number) => formatCurrencyAmount(val)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Financial Operations</span>
          <h1 className="text-2xl font-serif font-bold text-[#163326] mt-1">Finance & Payouts</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent double-entry ledger, multi-currency reporting ({reportingCurrency}), platform commission deductions, and automated bank settlements.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          disabled={ledger.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition"
        >
          <span>📥</span> Download Ledger Statement (CSV)
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance & Request Payout */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs text-stone-500 font-medium">Available Payout Balance ({reportingCurrency})</span>
            <div className="text-3xl font-serif font-bold text-[#163326] mt-1">
              {formatAmount(availableBalance)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Cleared funds ready for disbursement to your bank account.
            </p>
          </div>

          <button
            onClick={handleRequestPayout}
            disabled={requesting || availableBalance < 10}
            className="w-full py-2.5 bg-[#163326] hover:bg-[#11291E] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition"
          >
            {requesting ? 'Processing Settlement...' : 'Request Payout Settlement'}
          </button>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 font-medium">Verified Settlement Account</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              ✓ Verified
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="font-bold text-stone-900 text-sm">
              {seller?.bankDetails?.bankName || 'Verified Settlement Bank'}
            </div>
            <div className="font-mono text-stone-600">
              Account: {seller?.bankDetails?.accountNumberMasked || '•••• •••• 9921'}
            </div>
            <div className="font-mono text-stone-600">
              Routing / SWIFT: {seller?.bankDetails?.routingCode || 'SWIFT/ROUTING'}
            </div>
            <div className="text-[11px] text-stone-500 pt-1">
              Beneficiary: {seller?.bankDetails?.beneficiaryName || seller?.storeName}
            </div>
          </div>
        </div>

        {/* Contract & Deductions */}
        <div className="bg-[#FAF6EF] p-5 sm:p-6 rounded-2xl border border-[#C5A869]/40 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163326]">
              Contract Deductions
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              0% Fee Tier
            </span>
          </div>
          <div className="space-y-1.5 pt-1 text-stone-700">
            <div className="flex justify-between">
              <span>Platform Take-Rate:</span>
              <span className="font-bold text-emerald-800 font-mono">
                {seller?.defaultCommissionRate ?? 0}% (Free Listing)
              </span>
            </div>
            <div className="flex justify-between">
              <span>Platform Deductions:</span>
              <span className="font-bold text-stone-900">₹0.00 / $0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Settlement Cycle:</span>
              <span className="font-bold">T+{seller?.settlementHoldDays || 7} Days</span>
            </div>
          </div>
          <p className="text-[10px] text-stone-500 pt-1 border-t border-stone-200/60 leading-relaxed">
            ✨ Founder Promotion: Enjoy 0% commission on all product sales and zero catalogue listing fees.
          </p>
        </div>
      </div>

      {/* Payout History & Ledger */}
      <div className="space-y-6">
        {/* Payout Batches Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 text-base">Settlement Disbursements</h3>
            <span className="text-xs text-stone-500">{payouts.length} Batches Completed</span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Disbursement Amount</th>
                  <th className="py-3 px-4">Settlement Period</th>
                  <th className="py-3 px-4">Bank Reference (UTR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Processed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-stone-400">
                      No payout batches processed yet.
                    </td>
                  </tr>
                ) : (
                  payouts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{p.id}</td>
                      <td className="py-3 px-4 font-bold text-emerald-800 text-sm">
                        {formatAmount(p.amount)}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {p.periodStart} to {p.periodEnd}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-700">
                        {p.bankRefUtr || 'Pending bank clearance'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-stone-500">
                        {p.processedAt
                          ? new Date(p.processedAt).toLocaleDateString('en-IN')
                          : 'In clearing queue'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden divide-y divide-stone-100">
            {payouts.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-400">
                No payout batches processed yet.
              </div>
            ) : (
              payouts.map((p) => (
                <div key={p.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-900">{p.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-500">Disbursement</span>
                    <span className="text-sm font-bold text-emerald-800">{formatAmount(p.amount)}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex justify-between">
                    <span>Period: {p.periodStart} - {p.periodEnd}</span>
                    <span>{p.processedAt ? new Date(p.processedAt).toLocaleDateString() : 'Clearing'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transaction Ledger Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Transaction Ledger</h3>
              <p className="text-xs text-stone-500">Complete auditable record of credits and debits</p>
            </div>
            <span className="text-xs font-mono text-stone-500">{ledger.length} Entries</span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Reference</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {ledger.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-stone-400">
                      No ledger transactions yet.
                    </td>
                  </tr>
                ) : (
                  ledger.map((entry) => (
                    <tr key={entry.id} className="hover:bg-stone-50 transition">
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize font-medium text-stone-700">
                          {entry.entryType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                        {entry.referenceCode || '-'}
                      </td>
                      <td className="py-3 px-4 text-stone-700 max-w-sm">{entry.description}</td>
                      <td
                        className={`py-3 px-4 text-right font-bold font-mono ${
                          entry.amount > 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {entry.amount > 0 ? `+${formatAmount(entry.amount)}` : formatAmount(entry.amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono text-stone-900">
                        {formatAmount(entry.balanceAfter)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Ledger Cards */}
          <div className="md:hidden divide-y divide-stone-100">
            {ledger.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-400">
                No ledger transactions yet.
              </div>
            ) : (
              ledger.map((entry) => (
                <div key={entry.id} className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize font-semibold text-stone-800">
                      {entry.entryType.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`font-bold font-mono text-xs ${
                        entry.amount > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {entry.amount > 0 ? `+${formatAmount(entry.amount)}` : formatAmount(entry.amount)}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-tight">{entry.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>Ref: {entry.referenceCode || entry.id.slice(0, 12)}</span>
                    <span>Bal: {formatAmount(entry.balanceAfter)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
