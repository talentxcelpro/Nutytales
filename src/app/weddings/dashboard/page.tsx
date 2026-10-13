'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  getAllProjects,
  getActiveProject,
  saveActiveProject,
  getProjectBudget,
  getProjectEvents,
  getProjectGuests,
  getProjectTasks,
} from '@/lib/weddings/storage'
import { WeddingProject } from '@/lib/weddings/types'

export default function WeddingsDashboardPage() {
  const [projects, setProjects] = useState<WeddingProject[]>([])
  const [activeProject, setActiveProject] = useState<WeddingProject>(getActiveProject())

  useEffect(() => {
    const list = getAllProjects()
    setProjects(list)
    setActiveProject(getActiveProject())
  }, [])

  // Aggregate Metrics across all projects
  const totalGmvPlanned = projects.reduce((sum, p) => sum + p.totalBudget, 0)
  const totalGuests = projects.reduce((sum, p) => sum + p.guestCount, 0)
  const activeEvents = getProjectEvents(activeProject.id)
  const activeBudget = getProjectBudget(activeProject.id)
  const activeGuests = getProjectGuests(activeProject.id)
  const activeTasks = getProjectTasks(activeProject.id)

  const activeContracted = activeBudget.reduce(
    (sum, b) => sum + (b.contractedAmount || b.quotedAmount || 0),
    0
  )
  const activePaid = activeBudget.reduce((sum, b) => sum + (b.paidAmount || 0), 0)

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#17233B]">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D1520] text-[#C9A45C] text-xs font-semibold tracking-wide">
            <span>💍 WEDDING PORTFOLIO DASHBOARD</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#17233B] mt-2">
            Wedding Planning &amp; Operational Command
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Real project records, milestone payment schedules, guest RSVP breakdowns, and multi-event timelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/workspace"
            className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            Launch Active Workspace →
          </Link>
        </div>
      </div>

      {/* ── Top Metric Cards (Calculated from Real Records) ─────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Active Wedding Pipeline
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              ₹{(totalGmvPlanned / 100000).toFixed(1)}L
            </span>
            <span className="text-emerald-700 font-bold text-xs">Total Planned</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Across {projects.length} wedding project{projects.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Current Committed Spend
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              ₹{(activeContracted / 100000).toFixed(1)}L
            </span>
            <span className="text-[#8E2848] font-bold text-xs">
              {Math.round((activeContracted / activeProject.totalBudget) * 100)}%
            </span>
          </div>
          <p className="text-[11px] text-stone-500">
            Paid: ₹{(activePaid / 100000).toFixed(1)}L ({activeProject.coupleName})
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Guest List Status
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              {activeGuests.filter((g) => g.rsvpStatus === 'attending').length} Confirmed
            </span>
            <span className="text-stone-400 text-xs font-normal">/ {activeGuests.length}</span>
          </div>
          <p className="text-[11px] text-stone-500">
            {activeGuests.filter((g) => g.rsvpStatus === 'pending').length} RSVPs pending response
          </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            Scheduled Ceremonies
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2D1520]">
              {activeEvents.length} Events
            </span>
            <span className="text-stone-500 text-xs font-normal">Active</span>
          </div>
          <p className="text-[11px] text-stone-500">{activeProject.destination}</p>
        </div>
      </div>

      {/* ── Active Projects Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#17233B]">
              Wedding Project Registry
            </h3>
            <p className="text-xs text-stone-500">
              Persistent workspaces with live timelines, budget ledgers, and verified contracts.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-stone-100 text-stone-700 rounded-full">
            {projects.length} Workspace{projects.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#FAF6EE] text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Workspace ID</th>
                <th className="py-3 px-4">Couple &amp; Destination</th>
                <th className="py-3 px-4">Wedding Date</th>
                <th className="py-3 px-4">Guest Count</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {projects.map((proj) => {
                const isActive = proj.id === activeProject.id
                return (
                  <tr key={proj.id} className={`hover:bg-stone-50 ${isActive ? 'bg-stone-50/50' : ''}`}>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2D1520]">
                      {proj.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#17233B]">{proj.coupleName}</div>
                      <div className="text-[10px] text-stone-400">{proj.destination}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{proj.weddingDate}</td>
                    <td className="py-3.5 px-4 font-bold">{proj.guestCount} Guests</td>
                    <td className="py-3.5 px-4 font-bold text-[#8E2848]">
                      ₹{(proj.totalBudget / 100000).toFixed(1)} Lakhs
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {isActive ? '● Active Workspace' : proj.status.toUpperCase()}
                      </span>
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
                        Open Workspace →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
