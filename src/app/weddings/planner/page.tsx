'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { getAllProjects, getActiveProject, saveActiveProject } from '@/lib/weddings/storage'
import { WeddingProject } from '@/lib/weddings/types'

export default function WeddingPlannerPortalPage() {
  const [projects] = useState<WeddingProject[]>(getAllProjects())
  const [activeProject, setActiveProject] = useState<WeddingProject>(getActiveProject())

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#17233B]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>📋 PROFESSIONAL PLANNER WORKSPACE</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Wedding Operator &amp; Concierge Console
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Manage multi-client wedding operations, staff assignments, run-of-show sheets, and vendor settlements without data cross-contamination.
          </p>
        </div>

        <Link
          href="/workspace"
          className="px-5 py-2.5 bg-[#8E2848] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
        >
          Open Client Workspace →
        </Link>
      </div>

      {/* ── Planner Client Portfolio ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Active Client Weddings
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#2D1520]">
            {projects.length} Weddings
          </span>
          <p className="text-[11px] text-stone-500">Destination Rajasthan &amp; Kashmir</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Total Operational GMV
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#2D1520]">
            ₹{(projects.reduce((sum, p) => sum + p.totalBudget, 0) / 100000).toFixed(1)}L
          </span>
          <p className="text-[11px] text-emerald-700 font-medium">Escrow milestone secured</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
            Field Coordinators Active
          </span>
          <span className="font-serif text-3xl font-extrabold text-[#2D1520]">
            15 Staff
          </span>
          <p className="text-[11px] text-stone-500">Day-Of run of show leads</p>
        </div>
      </div>

      {/* ── Client Registry Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-lg text-[#17233B]">
          Client Wedding Projects Registry
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Project ID</th>
                <th className="py-3 px-4">Couple Name</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Wedding Date</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-stone-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-stone-700">{proj.id}</td>
                  <td className="py-3.5 px-4 font-bold text-[#17233B]">{proj.coupleName}</td>
                  <td className="py-3.5 px-4 text-stone-600">{proj.destination}</td>
                  <td className="py-3.5 px-4 font-medium">{proj.weddingDate}</td>
                  <td className="py-3.5 px-4 font-bold text-[#8E2848]">
                    ₹{(proj.totalBudget / 100000).toFixed(1)}L
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/workspace"
                      onClick={() => {
                        saveActiveProject(proj)
                        setActiveProject(proj)
                      }}
                      className="text-xs font-bold text-[#8E2848] hover:underline"
                    >
                      Open Command Desk →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
