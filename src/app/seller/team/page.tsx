'use client'

import React, { useState } from 'react'
import { useSeller } from '../SellerContext'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'manager' | 'operations' | 'finance'
  status: 'active' | 'invited'
  joinedAt: string
}

export default function SellerTeamPage() {
  const { seller } = useSeller()
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'MEM-1',
      name: seller?.storeName ? `${seller.storeName} (Primary Admin)` : 'Merchant Account Owner',
      email: seller?.email || 'owner@merchantstore.com',
      role: 'owner',
      status: 'active',
      joinedAt: '2026-08-10',
    },
    {
      id: 'MEM-2',
      name: 'Warehouse Operations & Dispatch Desk',
      email: seller?.email ? `dispatch@${seller.email.split('@')[1] || 'merchantstore.com'}` : 'dispatch@merchantstore.com',
      role: 'operations',
      status: 'active',
      joinedAt: '2026-09-02',
    },
    {
      id: 'MEM-3',
      name: 'Finance & Settlement Controller',
      email: seller?.email ? `finance@${seller.email.split('@')[1] || 'merchantstore.com'}` : 'finance@merchantstore.com',
      role: 'finance',
      status: 'active',
      joinedAt: '2026-09-15',
    },
  ])

  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'manager' as TeamMember['role'],
  })

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteForm.name || !inviteForm.email) return

    const newMember: TeamMember = {
      id: `MEM-${Date.now().toString().slice(-4)}`,
      name: inviteForm.name,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'invited',
      joinedAt: new Date().toISOString().split('T')[0],
    }

    setMembers([...members, newMember])
    setShowInviteModal(false)
    setInviteForm({ name: '', email: '', role: 'manager' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#C5A869] font-bold">Access Governance</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A3E2F] mt-1">Team & Permissions</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage authorized staff members, role boundaries, and warehouse packing permissions.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A3E2F] hover:bg-[#143226] text-white text-xs font-semibold rounded-lg shadow-xs transition"
        >
          <span>+</span> Invite Team Member
        </button>
      </div>

      {/* Team Members Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-stone-900 text-base">Authorized Collaborators</h3>
          <span className="text-xs text-stone-500">{members.length} Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF6EF] text-stone-600 text-[10px] uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-4">Access Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Added Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">{m.name}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{m.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        m.role === 'owner'
                          ? 'bg-[#1A3E2F] text-white'
                          : m.role === 'finance'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.role === 'operations'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        m.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">{m.joinedAt}</td>
                  <td className="py-3.5 px-4 text-right">
                    {m.role !== 'owner' ? (
                      <button
                        onClick={() => setMembers(members.filter((mem) => mem.id !== m.id))}
                        className="text-rose-600 hover:text-rose-800 text-[11px] font-medium"
                      >
                        Remove
                      </button>
                    ) : (
                      <span className="text-stone-400 text-[11px]">Primary Owner</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Reference */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
          <span className="font-bold text-stone-900">Operations Role</span>
          <p className="text-stone-500 leading-relaxed">
            Can pack orders, print courier shipping manifests, update inventory quantities, and mark parcels ready for pickup.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
          <span className="font-bold text-stone-900">Finance Role</span>
          <p className="text-stone-500 leading-relaxed">
            Has access to transaction ledger, bi-weekly payout statements, GST invoices, and settlement requests.
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
          <span className="font-bold text-stone-900">Manager Role</span>
          <p className="text-stone-500 leading-relaxed">
            Full operational control over listings, prices, promotions, customer fulfillment, and support disputes.
          </p>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleInvite}
            className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif font-bold text-stone-900 text-base">Invite Team Member</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Ahmad"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="tariq@yourdomain.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Role *</label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
              >
                <option value="manager">Manager (Full store operations)</option>
                <option value="operations">Operations (Packing & Dispatch only)</option>
                <option value="finance">Finance (Ledger & Payouts only)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-xs text-stone-600 font-semibold hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs bg-[#1A3E2F] hover:bg-[#143226] text-white font-bold rounded-lg shadow-xs"
              >
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
