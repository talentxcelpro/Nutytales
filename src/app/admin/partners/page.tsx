'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  PartnerApplication,
  PARTNER_TYPE_META,
  PartnerType,
  PartnerStatus,
} from '@/lib/seller-partner-system'

export default function AdminPartnersVerificationPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')

  const fetchApplications = () => {
    setLoading(true)
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.applications) {
          setApplications(data.applications)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: PartnerStatus) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: newStatus,
          notes: adminNotes || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus, notes: adminNotes || app.notes } : app))
        )
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus, notes: adminNotes || selectedApp.notes })
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false
    if (typeFilter !== 'all' && app.partnerType !== typeFilter) return false
    return true
  })

  const pendingCount = applications.filter((a) => a.status === 'PENDING_REVIEW' || a.status === 'KYC_SUBMITTED').length
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length

  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#17233B] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-300 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17233B] text-[#C9A45C] text-[10px] font-bold uppercase tracking-widest">
              <span>🛡️</span> NUTY TALES MARKETPLACE ADMIN
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17233B]">
              Seller &amp; Partner Verification Desk
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              KYC verification and merchant vetting across Farmers, Artisans, Stays, DMCs, and B2B Wholesalers.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/admin/revenue-os"
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl font-bold hover:bg-stone-50"
            >
              Revenue OS ↗
            </Link>
            <Link
              href="/admin/command-center"
              className="px-4 py-2 bg-white border border-stone-300 rounded-xl font-bold hover:bg-stone-50"
            >
              Sales Pipeline ↗
            </Link>
            <Link
              href="/partners"
              target="_blank"
              className="px-4 py-2 bg-[#17233B] text-white rounded-xl font-bold hover:bg-[#203050]"
            >
              + Public Application Portal ↗
            </Link>
          </div>
        </div>

        {/* ── KPI Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-300 shadow-sm">
            <p className="text-[11px] font-bold uppercase text-stone-500">Total Partners</p>
            <p className="text-2xl font-bold text-[#17233B] mt-1">{applications.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-300 shadow-sm">
            <p className="text-[11px] font-bold uppercase text-amber-600">Pending Review</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-300 shadow-sm">
            <p className="text-[11px] font-bold uppercase text-emerald-600">Verified &amp; Active</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{approvedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-stone-300 shadow-sm">
            <p className="text-[11px] font-bold uppercase text-stone-500">Global Hubs</p>
            <p className="text-2xl font-bold text-[#17233B] mt-1">8 Markets</p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="bg-white p-4 rounded-2xl border border-stone-300 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-500 mr-1">Status:</span>
            {['all', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  statusFilter === st
                    ? 'bg-[#17233B] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st === 'all' ? 'All Statuses' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">Category:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-medium"
            >
              <option value="all">All Categories</option>
              {Object.keys(PARTNER_TYPE_META).map((k) => (
                <option key={k} value={k}>
                  {PARTNER_TYPE_META[k as PartnerType].title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Partner List ── */}
        <div className="bg-white rounded-3xl border border-stone-300 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-stone-500 text-sm">Loading applications...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-sm">No partner applications match the selected criteria.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17233B]">
                <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Partner Entity</th>
                    <th className="p-4">Type &amp; Vertical</th>
                    <th className="p-4">Hub / Location</th>
                    <th className="p-4">Commercial Tier</th>
                    <th className="p-4">Credentials &amp; KYC</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {filtered.map((app) => {
                    const meta = PARTNER_TYPE_META[app.partnerType] || PARTNER_TYPE_META.farmer
                    const isPending = app.status === 'PENDING_REVIEW' || app.status === 'KYC_SUBMITTED'
                    return (
                      <tr key={app.id} className="hover:bg-stone-50/70 transition">
                        <td className="p-4">
                          <div className="font-bold text-sm text-[#17233B]">{app.businessName}</div>
                          <div className="text-stone-500 text-[11px] mt-0.5">
                            {app.contactPerson} · {app.email}
                          </div>
                          <div className="font-mono text-[10px] text-stone-400 mt-0.5">{app.id}</div>
                        </td>

                        <td className="p-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 font-semibold text-[11px]">
                            <span>{meta.icon}</span>
                            <span>{meta.badge}</span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-1 capitalize">
                            {app.verticals.join(', ')}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="font-medium text-stone-800">{app.city || 'Regional Hub'}</div>
                          <div className="text-stone-500 text-[11px]">{app.country}</div>
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-stone-800">
                            {app.commissionTier?.standardTakeRatePercent}% Take-Rate
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {app.commissionTier?.payoutCycleDays}d Payout Cycle
                          </div>
                        </td>

                        <td className="p-4 space-y-1">
                          {app.taxId && (
                            <div className="text-[10px] font-mono bg-stone-100 px-1.5 py-0.5 rounded w-fit">
                              Tax: {app.taxId}
                            </div>
                          )}
                          {app.fssaiNumber && (
                            <div className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit font-mono">
                              FSSAI: {app.fssaiNumber}
                            </div>
                          )}
                          {app.craftCertifications && app.craftCertifications.length > 0 && (
                            <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                              {app.craftCertifications[0]}
                            </div>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              app.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
                          >
                            Review Details
                          </button>
                          {isPending && (
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Partner Detail Inspection Modal ── */}
        {selectedApp && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-stone-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Partner Dossier #{selectedApp.id}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#17233B]">{selectedApp.businessName}</h2>
                  <p className="text-xs text-stone-500">
                    Applied on {new Date(selectedApp.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block font-semibold">Contact Person</span>
                  <span className="font-bold text-[#17233B]">{selectedApp.contactPerson}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Phone / WhatsApp</span>
                  <a
                    href={`https://wa.me/${selectedApp.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 underline"
                  >
                    {selectedApp.whatsapp} ↗
                  </a>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Email</span>
                  <span className="font-bold text-[#17233B]">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Location / Address</span>
                  <span className="font-medium text-stone-800">
                    {selectedApp.address}, {selectedApp.city}, {selectedApp.country}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Tax / Registration ID</span>
                  <span className="font-mono font-bold text-[#17233B]">{selectedApp.taxId || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">FSSAI / License</span>
                  <span className="font-mono font-bold text-[#17233B]">{selectedApp.fssaiNumber || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Agreed Take Rate</span>
                  <span className="font-bold text-amber-700">
                    {selectedApp.commissionTier?.standardTakeRatePercent}%
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Settlement Cycle</span>
                  <span className="font-bold text-stone-800">
                    {selectedApp.commissionTier?.payoutCycleDays} Days
                  </span>
                </div>
              </div>

              {selectedApp.craftCertifications && selectedApp.craftCertifications.length > 0 && (
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-stone-600">Certifications &amp; Accreditations</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApp.craftCertifications.map((c, i) => (
                      <span key={i} className="text-[11px] bg-white border border-stone-200 px-2 py-0.5 rounded font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedApp.notes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900">
                  <strong>Notes:</strong> {selectedApp.notes}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Admin Internal Notes / Review Summary</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. FSSAI verified against portal. Ready for catalogue onboarding."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#17233B]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-200">
                <button
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedApp.id, 'REJECTED')}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  Reject Application
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold text-stone-700"
                  >
                    Close
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(selectedApp.id, 'APPROVED')}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
                  >
                    {actionLoading ? 'Updating...' : 'Approve & Activate Partner'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
