'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  getAllProjects,
  getActiveProject,
  saveActiveProject,
  createNewProject,
  getProjectBudget,
  getProjectEvents,
  getProjectGuests,
  getProjectTasks,
} from '@/lib/weddings/storage'
import { WeddingProject, Currency } from '@/lib/weddings/types'

export default function WeddingsDashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<WeddingProject[]>([])
  const [activeProject, setActiveProject] = useState<WeddingProject>(getActiveProject())
  const [showCreateModal, setShowCreateModal] = useState(false)

  // New Project Form State
  const [coupleName, setCoupleName] = useState('')
  const [destination, setDestination] = useState('Jaipur, Rajasthan')
  const [weddingDate, setWeddingDate] = useState('')
  const [guestCount, setGuestCount] = useState(200)
  const [totalBudget, setTotalBudget] = useState(5000000)
  const [currency, setCurrency] = useState<Currency>('INR')
  const [weddingStyle, setWeddingStyle] = useState('Royal Heritage & Contemporary Elegance')

  useEffect(() => {
    const list = getAllProjects()
    setProjects(list)
    setActiveProject(getActiveProject())
  }, [])

  // Aggregate Metrics across all projects
  const totalGmvPlanned = projects.reduce((sum, p) => sum + p.totalBudget, 0)
  const activeEvents = getProjectEvents(activeProject.id)
  const activeBudget = getProjectBudget(activeProject.id)
  const activeGuests = getProjectGuests(activeProject.id)

  const activeContracted = activeBudget.reduce(
    (sum, b) => sum + (b.contractedAmount || b.quotedAmount || 0),
    0
  )
  const activePaid = activeBudget.reduce((sum, b) => sum + (b.paidAmount || 0), 0)

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!coupleName || !weddingDate) return

    const newProject = createNewProject({
      coupleName,
      destination,
      weddingDate,
      guestCount,
      totalBudget,
      currency,
      weddingStyle,
    })

    const updatedList = getAllProjects()
    setProjects(updatedList)
    setActiveProject(newProject)
    setShowCreateModal(false)

    // Navigate to active workspace
    router.push('/workspace')
  }

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
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#FAF7F2] hover:bg-stone-200 text-[#2D1520] border border-stone-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
          >
            + New Wedding Project
          </button>
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
              {Math.round((activeContracted / (activeProject.totalBudget || 1)) * 100)}%
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-xs font-bold px-3 py-1.5 bg-[#8E2848] text-white rounded-xl hover:bg-[#721f39] transition-colors"
            >
              + Add Project
            </button>
            <span className="text-xs font-bold px-3 py-1 bg-stone-100 text-stone-700 rounded-full">
              {projects.length} Workspace{projects.length > 1 ? 's' : ''}
            </span>
          </div>
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
                    <td className="py-3.5 px-4 text-right space-x-3">
                      <Link
                        href={`/rsvp/${proj.id}`}
                        target="_blank"
                        className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                        title="View Guest RSVP Link"
                      >
                        RSVP Link ↗
                      </Link>
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

      {/* ── Create New Wedding Project Modal ──────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E2848] block">
                  New Wedding Project Setup
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#17233B]">
                  Create Wedding Workspace
                </h3>
                <p className="text-xs text-stone-500">
                  Initialize persistent budget ledgers, run of show timelines, and guest management.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Couple / Wedding Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tara & Samar"
                  value={coupleName}
                  onChange={(e) => setCoupleName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Primary Destination *
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  >
                    <option value="Jaipur, Rajasthan">Jaipur, Rajasthan</option>
                    <option value="Udaipur, Rajasthan">Udaipur, Rajasthan</option>
                    <option value="Srinagar, Kashmir">Srinagar, Kashmir</option>
                    <option value="Goa Coastline">Goa Coastline</option>
                    <option value="Dubai, UAE">Dubai, UAE</option>
                    <option value="Lake Como, Italy">Lake Como, Italy</option>
                    <option value="New Delhi NCR">New Delhi NCR</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Wedding Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Estimated Guests
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={5000}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-700 block mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="AED">AED (د.إ)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Target Total Budget ({currency})
                </label>
                <input
                  type="number"
                  step={50000}
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                />
                <span className="text-[10px] text-stone-400 mt-0.5 block">
                  {currency === 'INR' && `Equivalent to ₹${(totalBudget / 100000).toFixed(1)} Lakhs`}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Celebration Style &amp; Theme
                </label>
                <input
                  type="text"
                  value={weddingStyle}
                  onChange={(e) => setWeddingStyle(e.target.value)}
                  placeholder="e.g. Royal Kashmiri Wazwan & Sufi Nights"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs text-[#17233B] focus:outline-none focus:ring-1 focus:ring-[#8E2848]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 text-stone-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  Initialize Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
