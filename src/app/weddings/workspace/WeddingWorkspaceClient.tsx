'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  WeddingProject,
  WeddingEvent,
  BudgetItem,
  WeddingGuest,
  SeatingTable,
  WeddingTask,
  WeddingPayment,
  ActivityLog,
  WeddingEnquiry,
  EventType,
  BudgetCategory,
  TaskPriority,
  TaskPhase,
} from '@/lib/weddings/types'
import {
  getActiveProject,
  saveActiveProject,
  getAllProjects,
  createNewProject,
  getProjectEvents,
  saveProjectEvents,
  addEvent,
  deleteEvent,
  detectScheduleConflicts,
  getProjectBudget,
  saveProjectBudget,
  addBudgetItem,
  getProjectGuests,
  saveProjectGuests,
  addGuest,
  importGuestsFromCsv,
  getProjectTables,
  saveProjectTables,
  assignGuestToTable,
  getProjectTasks,
  saveProjectTasks,
  addTask,
  toggleTaskStatus,
  getProjectPayments,
  saveProjectPayments,
  recordPayment,
  getProjectActivity,
  getProjectEnquiries,
  analyzeWeddingProject,
} from '@/lib/weddings/storage'
import { INITIAL_VENUES, INITIAL_VENDORS } from '@/lib/weddings/data'
import { WEDDING_CURATIONS } from '@/lib/weddings-data'

type WorkspaceTab =
  | 'overview'
  | 'events'
  | 'budget'
  | 'guests'
  | 'venues'
  | 'vendors'
  | 'tasks'
  | 'stays'
  | 'invitations'
  | 'favors'
  | 'documents'
  | 'payments'
  | 'activity'
  | 'reports'
  | 'settings'

export default function WeddingWorkspaceClient() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview')
  const [project, setProject] = useState<WeddingProject>(getActiveProject())
  const [allProjects, setAllProjects] = useState<WeddingProject[]>([])
  const [events, setEvents] = useState<WeddingEvent[]>([])
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [guests, setGuests] = useState<WeddingGuest[]>([])
  const [tables, setTables] = useState<SeatingTable[]>([])
  const [tasks, setTasks] = useState<WeddingTask[]>([])
  const [payments, setPayments] = useState<WeddingPayment[]>([])
  const [activity, setActivity] = useState<ActivityLog[]>([])
  const [enquiries, setEnquiries] = useState<WeddingEnquiry[]>([])

  // SI Drawer
  const [isSiOpen, setIsSiOpen] = useState(false)
  const [siQuery, setSiQuery] = useState('')
  const [siChatHistory, setSiChatHistory] = useState<{ sender: 'user' | 'si'; text: string }[]>([])

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false)
  const [showAddGuestModal, setShowAddGuestModal] = useState(false)
  const [showCsvModal, setShowCsvModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showLogPaymentModal, setShowLogPaymentModal] = useState(false)

  // Forms states
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventType, setNewEventType] = useState<EventType>('ceremony')
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventStartTime, setNewEventStartTime] = useState('17:00')
  const [newEventEndTime, setNewEventEndTime] = useState('21:00')
  const [newEventVenue, setNewEventVenue] = useState('')
  const [newEventGuests, setNewEventGuests] = useState(250)

  const [newBudgetCategory, setNewBudgetCategory] = useState<BudgetCategory>('catering')
  const [newBudgetTitle, setNewBudgetTitle] = useState('')
  const [newBudgetPlanned, setNewBudgetPlanned] = useState(500000)
  const [newBudgetQuoted, setNewBudgetQuoted] = useState(480000)
  const [newBudgetVendor, setNewBudgetVendor] = useState('')

  const [newGuestFirst, setNewGuestFirst] = useState('')
  const [newGuestLast, setNewGuestLast] = useState('')
  const [newGuestHousehold, setNewGuestHousehold] = useState('')
  const [newGuestEmail, setNewGuestEmail] = useState('')
  const [newGuestPhone, setNewGuestPhone] = useState('')
  const [newGuestMeal, setNewGuestMeal] = useState('Royal Wazwan & Multi-Cuisine')

  const [csvContent, setCsvContent] = useState('')
  const [csvImportResult, setCsvImportResult] = useState<string | null>(null)

  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium')
  const [newTaskPhase, setNewTaskPhase] = useState<TaskPhase>('1_month')
  const [newTaskAssignee, setNewTaskAssignee] = useState('')

  const [newPayRecipient, setNewPayRecipient] = useState('')
  const [newPayMilestone, setNewPayMilestone] = useState('')
  const [newPayAmount, setNewPayAmount] = useState(200000)
  const [newPayCategory, setNewPayCategory] = useState<BudgetCategory>('catering')
  const [newPayDueDate, setNewPayDueDate] = useState('')

  // Load project data
  const reloadData = (proj: WeddingProject) => {
    setProject(proj)
    setEvents(getProjectEvents(proj.id))
    setBudgetItems(getProjectBudget(proj.id))
    setGuests(getProjectGuests(proj.id))
    setTables(getProjectTables(proj.id))
    setTasks(getProjectTasks(proj.id))
    setPayments(getProjectPayments(proj.id))
    setActivity(getProjectActivity(proj.id))
    setEnquiries(getProjectEnquiries(proj.id))
    setAllProjects(getAllProjects())
  }

  useEffect(() => {
    const active = getActiveProject()
    reloadData(active)
    setNewEventDate(active.weddingDate)
    setNewPayDueDate(active.weddingDate)
  }, [])

  // ── Calculated Real Statistics ─────────────────────────────────────────────
  const daysUntilWedding = useMemo(() => {
    const target = new Date(project.weddingDate).getTime()
    const now = new Date().getTime()
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
    return isNaN(diff) ? 0 : diff
  }, [project.weddingDate])

  const totalPlannedBudget = project.totalBudget
  const totalContractedSpend = useMemo(
    () => budgetItems.reduce((acc, item) => acc + (item.contractedAmount || item.quotedAmount || 0), 0),
    [budgetItems]
  )
  const totalPaidAmount = useMemo(
    () => budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0),
    [budgetItems]
  )
  const totalOutstanding = useMemo(
    () => Math.max(0, totalContractedSpend - totalPaidAmount),
    [totalContractedSpend, totalPaidAmount]
  )
  const remainingBudget = useMemo(
    () => Math.max(0, totalPlannedBudget - totalContractedSpend),
    [totalPlannedBudget, totalContractedSpend]
  )

  const guestStats = useMemo(() => {
    const attending = guests.filter((g) => g.rsvpStatus === 'attending')
    const declined = guests.filter((g) => g.rsvpStatus === 'declined')
    const pending = guests.filter((g) => g.rsvpStatus === 'pending')
    const totalHeadcount = attending.reduce((sum, g) => sum + (g.attendingCount || 1), 0)
    return {
      attendingCount: attending.length,
      declinedCount: declined.length,
      pendingCount: pending.length,
      totalHeadcount,
    }
  }, [guests])

  const completedTasksCount = useMemo(
    () => tasks.filter((t) => t.status === 'completed').length,
    [tasks]
  )

  // Real-time Schedule Conflicts
  const scheduleConflicts = useMemo(() => detectScheduleConflicts(events), [events])

  // SI Intelligence Analysis
  const siAnalysis = useMemo(() => analyzeWeddingProject(project.id), [project.id, budgetItems, events, tasks, guests])

  // Switch Active Project
  const handleSwitchProject = (selectedId: string) => {
    const found = allProjects.find((p) => p.id === selectedId)
    if (found) {
      saveActiveProject(found)
      reloadData(found)
    }
  }

  // Handle SI Query Prompt
  const handleAskSi = (question?: string) => {
    const q = (question || siQuery).trim()
    if (!q) return

    setSiChatHistory((prev) => [...prev, { sender: 'user', text: q }])
    setSiQuery('')

    setTimeout(() => {
      let reply = ''
      const lower = q.toLowerCase()
      if (lower.includes('budget') || lower.includes('cost') || lower.includes('spend')) {
        reply = `Your planned budget is ₹${(totalPlannedBudget / 100000).toFixed(1)} Lakhs. Committed spend across contracted venues and vendors is ₹${(totalContractedSpend / 100000).toFixed(1)} Lakhs (${Math.round((totalContractedSpend / totalPlannedBudget) * 100)}%). ₹${(remainingBudget / 100000).toFixed(1)} Lakhs remains uncommitted.`
      } else if (lower.includes('conflict') || lower.includes('overlap') || lower.includes('schedule')) {
        if (scheduleConflicts.length > 0) {
          reply = `I detected ${scheduleConflicts.length} schedule conflict(s): ${scheduleConflicts.map((c) => c.description).join(' ')}`
        } else {
          reply = `All ${events.length} events are scheduled cleanly across venues with zero overlapping hours.`
        }
      } else if (lower.includes('guest') || lower.includes('rsvp') || lower.includes('seat')) {
        reply = `You have ${guests.length} guest households recorded: ${guestStats.attendingCount} attending (${guestStats.totalHeadcount} total seats required), ${guestStats.pendingCount} pending RSVP, and ${guestStats.declinedCount} declined.`
      } else if (lower.includes('payment') || lower.includes('due')) {
        reply = `Outstanding commitments total ₹${(totalOutstanding / 100000).toFixed(1)} Lakhs. Next upcoming milestone is the 50% catering advance for Ustad Gani Wazwan due on Nov 05, 2026.`
      } else {
        reply = `Based on your ${project.destination} wedding parameters for ${project.guestCount} guests, your plan is in healthy shape. I recommend verifying airport transfer waves for out-of-town guests and confirming table assignments for ${guests.filter((g) => g.rsvpStatus === 'attending' && !g.tableId).length} unseated guests.`
      }
      setSiChatHistory((prev) => [...prev, { sender: 'si', text: reply }])
    }, 400)
  }

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-[#17233B]">
      {/* ── Top Project Identity Bar ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#2D1520] text-[#C9A45C] text-[10px] font-bold uppercase tracking-wider">
              Wedding Command Center
            </span>
            <span className="text-stone-300">•</span>
            <span className="font-mono text-xs font-bold text-stone-500">{project.id}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#17233B]">
              {project.coupleName}
            </h1>
            <span className="text-sm text-stone-500 font-medium">
              📍 {project.destination} · 🗓️ {project.weddingDate}
            </span>
          </div>
          <p className="text-xs text-stone-500 font-light">
            Style: <strong>{project.weddingStyle}</strong> · Target Guests: <strong>{project.guestCount}</strong> · Budget: <strong>₹{(project.totalBudget / 100000).toFixed(1)} Lakhs</strong>
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Switcher */}
          {allProjects.length > 1 && (
            <select
              aria-label="Switch wedding project"
              value={project.id}
              onChange={(e) => handleSwitchProject(e.target.value)}
              className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none"
            >
              {allProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.coupleName} ({p.destination})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            + New Project
          </button>

          {/* SI Intelligence Launcher */}
          <button
            onClick={() => setIsSiOpen(!isSiOpen)}
            className="px-4 py-2 bg-[#2D1520] hover:bg-[#8E2848] text-[#C9A45C] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>✨</span>
            <span>Ask SI Intelligence</span>
          </button>
        </div>
      </div>

      {/* ── Conflict Alert Banner (If Any) ───────────────────────────────────── */}
      {scheduleConflicts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-900 animate-fadeIn">
          <span className="text-xl">⚠️</span>
          <div className="space-y-1">
            <strong className="block font-bold">Schedule Conflict Detected in Event Timeline:</strong>
            {scheduleConflicts.map((c, i) => (
              <p key={i} className="text-amber-800">{c.description}</p>
            ))}
          </div>
        </div>
      )}

      {/* ── Master Tab Navigation (15 Core Tabs) ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 p-1.5 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'events', label: 'Events & Timeline', icon: '🗓️', badge: events.length },
            { id: 'budget', label: 'Budget & Finance', icon: '💰' },
            { id: 'guests', label: 'Guests & Seating', icon: '👥', badge: guests.length },
            { id: 'venues', label: 'Venues', icon: '🏰' },
            { id: 'vendors', label: 'Vendors & RFPs', icon: '🤝', badge: enquiries.length },
            { id: 'tasks', label: 'Tasks & Checklist', icon: '✅', badge: tasks.length - completedTasksCount },
            { id: 'stays', label: 'Travel & Stays', icon: '🏨' },
            { id: 'invitations', label: 'Invitations', icon: '✉️' },
            { id: 'favors', label: 'Favors & Trousseau', icon: '🎁' },
            { id: 'documents', label: 'Documents', icon: '📁' },
            { id: 'payments', label: 'Invoices & Payments', icon: '💳' },
            { id: 'activity', label: 'Activity Log', icon: '📜' },
            { id: 'reports', label: 'Reports', icon: '📑' },
            { id: 'settings', label: 'Permissions', icon: '⚙️' },
          ].map((tab) => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  active
                    ? 'bg-[#8E2848] text-white font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      active ? 'bg-[#C9A45C] text-[#2D1520]' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── TAB 1: OVERVIEW DASHBOARD ────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Countdown
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-[#8E2848]">
                  {daysUntilWedding > 0 ? `${daysUntilWedding} Days` : 'Celebration Day'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-light">Until {project.weddingDate}</p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Committed Spend
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-[#17233B]">
                  ₹{(totalContractedSpend / 100000).toFixed(1)}L
                </span>
                <span className="text-xs font-semibold text-stone-400">
                  / ₹{(totalPlannedBudget / 100000).toFixed(0)}L
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                ₹{(remainingBudget / 100000).toFixed(1)}L remaining uncommitted
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Confirmed Guests
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-[#17233B]">
                  {guestStats.totalHeadcount}
                </span>
                <span className="text-xs font-semibold text-stone-400">
                  ({guestStats.attendingCount} households)
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-light">
                {guestStats.pendingCount} pending responses
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Tasks Completed
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-[#17233B]">
                  {completedTasksCount} / {tasks.length}
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  {Math.round((completedTasksCount / (tasks.length || 1)) * 100)}%
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-light">Milestones on schedule</p>
            </div>
          </div>

          {/* Action Priorities Card & Multi-Event Timeline Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Priorities & Next Actions (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#17233B] flex items-center gap-2">
                  <span>⚡</span> Prioritized Next Actions
                </h3>
                <span className="text-xs font-bold text-[#8E2848]">Real Project Records</span>
              </div>

              <div className="space-y-3 text-xs">
                {siAnalysis.actionPriorities.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#8E2848] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-stone-700 leading-relaxed font-medium">{action}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('events')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-800 transition-colors"
                >
                  Manage Events ({events.length}) →
                </button>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-800 transition-colors"
                >
                  View Budget Breakdown →
                </button>
                <button
                  onClick={() => setActiveTab('guests')}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-800 transition-colors"
                >
                  Open Seating Planner →
                </button>
              </div>
            </div>

            {/* Right Multi-Event Timeline Summary (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-[#17233B]">Multi-Day Timeline</h3>
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="text-xs font-bold text-[#8E2848] hover:underline"
                >
                  + Add Ceremony
                </button>
              </div>

              <div className="space-y-3">
                {events.slice(0, 4).map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-1 text-xs"
                  >
                    <div className="flex justify-between font-bold text-[#17233B]">
                      <span>{evt.title}</span>
                      <span className="text-[#8E2848]">{evt.date}</span>
                    </div>
                    <div className="flex justify-between text-stone-500 text-[11px]">
                      <span>⏰ {evt.startTime} – {evt.endTime}</span>
                      <span>👥 {evt.expectedGuests} Guests</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('events')}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold uppercase transition-colors"
              >
                View Full Timeline &amp; Conflict Checks →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MULTI-EVENT PLANNER & TIMELINE ─────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Ceremonies &amp; Event Timelines
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Multi-day celebration structure with automatic schedule conflict detection across shared venues.
              </p>
            </div>
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + Add Ceremony / Event
            </button>
          </div>

          <div className="space-y-4">
            {events.map((evt, idx) => (
              <div
                key={evt.id}
                className="p-5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all space-y-3 bg-stone-50/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#8E2848] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#17233B]">
                        {evt.title}
                      </h3>
                      <span className="text-[11px] text-stone-500">
                        {evt.eventType.toUpperCase()} · Time Zone: {evt.timeZone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono bg-white border border-stone-200 px-2.5 py-1 rounded-lg text-stone-700">
                      📅 {evt.date} · ⏰ {evt.startTime}–{evt.endTime}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`Remove event "${evt.title}"?`)) {
                          deleteEvent(project.id, evt.id)
                          reloadData(project)
                        }
                      }}
                      className="text-stone-400 hover:text-red-700 p-1 text-sm"
                      title="Delete event"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600 bg-white p-3 rounded-xl border border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Venue</span>
                    <strong>{evt.venueName || 'Not Assigned'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Expected Attendance</span>
                    <strong>{evt.expectedGuests} Guests</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Allocated Budget</span>
                    <strong className="text-[#8E2848]">₹{(evt.budgetAllocated / 100000).toFixed(1)} Lakhs</strong>
                  </div>
                </div>

                {evt.notes && (
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    📝 {evt.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: BUDGET & FINANCIAL CONTROL ─────────────────────────────────── */}
      {activeTab === 'budget' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Budget &amp; Financial Control
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                First-class financial ledger keeping planned, estimated, quoted, contracted, and paid amounts strictly separate.
              </p>
            </div>
            <button
              onClick={() => setShowAddBudgetModal(true)}
              className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + Add Budget Line Item
            </button>
          </div>

          {/* Budget Overview Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Planned</span>
              <span className="font-serif text-xl font-bold text-[#17233B]">
                ₹{(totalPlannedBudget / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Contracted Spend</span>
              <span className="font-serif text-xl font-bold text-[#17233B]">
                ₹{(totalContractedSpend / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Paid So Far</span>
              <span className="font-serif text-xl font-bold text-emerald-900">
                ₹{(totalPaidAmount / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">Outstanding Payable</span>
              <span className="font-serif text-xl font-bold text-rose-900">
                ₹{(totalOutstanding / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase block">Unallocated Buffer</span>
              <span className="font-serif text-xl font-bold text-stone-800">
                ₹{(remainingBudget / 100000).toFixed(1)}L
              </span>
            </div>
          </div>

          {/* Detailed Budget Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Item / Service</th>
                  <th className="py-3 px-3">Planned</th>
                  <th className="py-3 px-3">Quoted</th>
                  <th className="py-3 px-3">Contracted</th>
                  <th className="py-3 px-3">Paid</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Vendor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {budgetItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 uppercase text-[10px] font-bold text-stone-500">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#17233B]">
                      {item.title}
                    </td>
                    <td className="py-3 px-3 text-stone-600">₹{(item.plannedAmount / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-3 text-stone-600">₹{(item.quotedAmount / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-3 font-bold text-[#17233B]">₹{(item.contractedAmount / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">₹{(item.paidAmount / 100000).toFixed(2)}L</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.paymentStatus === 'partial'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-stone-500 font-medium">
                      {item.vendorName || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: GUEST LIST & INTERACTIVE SEATING PLANNER ───────────────────── */}
      {activeTab === 'guests' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-8 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Guest Management &amp; Table Seating
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Households, dietary preferences, CSV import/export, and visual capacity-validated table seating.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCsvModal(true)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-stone-700 transition-colors"
              >
                📁 Import / Export CSV
              </button>
              <button
                onClick={() => setShowAddGuestModal(true)}
                className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                + Add Guest
              </button>
            </div>
          </div>

          {/* Interactive Seating Tables Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#17233B]">
                🍽️ Table Seating Planner
              </h3>
              <span className="text-xs text-stone-500">
                Unseated confirmed guests: <strong>{guests.filter((g) => g.rsvpStatus === 'attending' && !g.tableId).length}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tables.map((table) => {
                const assigned = guests.filter((g) => g.tableId === table.id)
                const isFull = assigned.length >= table.capacity
                return (
                  <div
                    key={table.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                      <strong className="text-stone-800">{table.name}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isFull ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {assigned.length}/{table.capacity} Seats
                      </span>
                    </div>

                    <div className="space-y-1.5 min-h-[80px]">
                      {assigned.length > 0 ? (
                        assigned.map((g) => (
                          <div
                            key={g.id}
                            className="p-1.5 bg-white rounded-lg border border-stone-200 flex justify-between items-center text-[11px]"
                          >
                            <span>{g.firstName} {g.lastName}</span>
                            <button
                              onClick={() => {
                                assignGuestToTable(project.id, g.id, null)
                                reloadData(project)
                              }}
                              className="text-stone-400 hover:text-stone-700"
                              title="Unseat guest"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-stone-400 italic text-center py-4">
                          No guests assigned yet.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Guest Records Table */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            <h3 className="font-serif font-bold text-base text-[#17233B]">
              Master Guest Directory ({guests.length} Households)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-3">Guest / Household</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3">RSVP Status</th>
                    <th className="py-3 px-3">Dietary / Meal</th>
                    <th className="py-3 px-3">Table Assignment</th>
                    <th className="py-3 px-3 text-right">Logistics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {guests.map((g) => (
                    <tr key={g.id} className="hover:bg-stone-50">
                      <td className="py-3 px-3">
                        <strong className="text-[#17233B] block">{g.firstName} {g.lastName}</strong>
                        <span className="text-[10px] text-stone-400">{g.household || 'Individual'}</span>
                      </td>
                      <td className="py-3 px-3 text-stone-500 text-[11px]">
                        <span>{g.phone || g.email || '—'}</span>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          aria-label={`Update RSVP status for ${g.firstName} ${g.lastName}`}
                          value={g.rsvpStatus}
                          onChange={(e) => {
                            g.rsvpStatus = e.target.value as any
                            saveProjectGuests(project.id, guests)
                            reloadData(project)
                          }}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                            g.rsvpStatus === 'attending'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : g.rsvpStatus === 'declined'
                              ? 'bg-red-50 text-red-800 border-red-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="attending">✓ Attending</option>
                          <option value="pending">⏳ Pending</option>
                          <option value="declined">✕ Declined</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-stone-600">
                        <span>{g.mealPreference}</span>
                        {g.dietaryRestrictions && (
                          <span className="text-[10px] text-rose-700 block font-medium">
                            ⚠️ {g.dietaryRestrictions}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          aria-label={`Assign table for ${g.firstName} ${g.lastName}`}
                          value={g.tableId || ''}
                          onChange={(e) => {
                            assignGuestToTable(project.id, g.id, e.target.value || null)
                            reloadData(project)
                          }}
                          className="bg-stone-50 border border-stone-200 text-xs rounded-lg p-1 text-stone-700"
                        >
                          <option value="">Unassigned</option>
                          {tables.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right text-[11px] text-stone-500">
                        {g.accommodationNeeded && <span className="mr-1">🏨 Room</span>}
                        {g.transportNeeded && <span>🚗 Chauffeur</span>}
                        {!g.accommodationNeeded && !g.transportNeeded && <span>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: VENUES (PROJECT SHORTLIST & BOOKINGS) ─────────────────────── */}
      {activeTab === 'venues' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Project Venues &amp; Site Allocations
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Active anchor venue holds, room block quotas, and direct inquiry statuses.
              </p>
            </div>
            <Link
              href="/venues"
              className="px-5 py-2.5 bg-[#8E2848] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + Browse Venues Marketplace
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_VENUES.slice(0, 2).map((venue) => (
              <div
                key={venue.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#8E2848] font-bold uppercase tracking-wider block">
                      {venue.venueType.toUpperCase()} · {venue.destination}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#17233B]">{venue.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    ✓ Contracted Hold
                  </span>
                </div>
                <p className="text-stone-500 font-light">{venue.description}</p>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-[11px]">
                  <span>Capacity: <strong>{venue.capacityMin}–{venue.capacityMax} Guests</strong></span>
                  <span className="font-bold text-[#8E2848]">Starting: ₹{(venue.priceStarting / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 6: VENDORS & ACTIVE RFPS ──────────────────────────────────────── */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Vendor Contracts &amp; Active Proposals
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Quotation lifecycle from initial RFP to contract confirmation and milestone delivery.
              </p>
            </div>
            <Link
              href="/vendors"
              className="px-5 py-2.5 bg-[#8E2848] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + Find More Vendors
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_VENDORS.slice(0, 4).map((vnd) => (
              <div
                key={vnd.id}
                className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-[#8E2848] font-bold uppercase tracking-wider block">
                      {vnd.category.toUpperCase()} · {vnd.destination}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#17233B]">{vnd.businessName}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    Quotation Confirmed
                  </span>
                </div>
                <p className="text-stone-500 font-light">{vnd.bio}</p>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-[11px]">
                  <span>Rating: <strong>★ {vnd.rating}</strong></span>
                  <span className="font-bold text-[#8E2848]">Starting: ₹{vnd.startingPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 7: TASKS & CHECKLIST ──────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Tasks &amp; Milestones Checklist
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Phased accountability checklist across couple, family members, wedding planners, and verified vendors.
              </p>
            </div>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + Create New Task
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isDone = task.status === 'completed'
              return (
                <div
                  key={task.id}
                  onClick={() => {
                    toggleTaskStatus(project.id, task.id)
                    reloadData(project)
                  }}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer text-xs ${
                    isDone
                      ? 'bg-stone-50/50 border-stone-200 opacity-60'
                      : 'bg-white border-stone-300 shadow-xs hover:border-[#8E2848]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      readOnly
                      className="mt-1 w-4 h-4 accent-[#8E2848] cursor-pointer"
                    />
                    <div>
                      <h4 className={`font-bold text-sm ${isDone ? 'line-through text-stone-400' : 'text-[#17233B]'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-stone-500 text-[11px] mt-0.5">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        task.priority === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Assignee: {task.assigneeName || 'Unassigned'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── TAB 8: TRAVEL & ACCOMMODATION ─────────────────────────────────────── */}
      {activeTab === 'stays' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Guest Travel, Room Blocks &amp; Chauffeurs
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Coordinating airport arrival waves, chauffeured escorts, and hotel room inventory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Hotel Room Blocks */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Hotel Room Block Allocation
              </span>
              <h3 className="font-serif font-bold text-base text-[#17233B]">
                The Jai Mahal Palace — Luxury Wing
              </h3>
              <div className="space-y-1.5 text-stone-600">
                <p>Total Rooms Blocked: <strong>75 Deluxe Garden Suites</strong></p>
                <p>Check-In: <strong>Nov 19, 2026</strong> | Check-Out: <strong>Nov 22, 2026</strong></p>
                <p>Rooms Allocated to Guests: <strong>68 / 75 Rooms</strong></p>
              </div>
            </div>

            {/* Airport Shuttles */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Airport Chauffeur Waves
              </span>
              <h3 className="font-serif font-bold text-base text-[#17233B]">
                Jaipur International (JAI) Fleet
              </h3>
              <div className="space-y-1.5 text-stone-600">
                <p>Wave 1 (Nov 18, 14:00): <strong>London &amp; Mumbai Arrivals (12 Sedans)</strong></p>
                <p>Wave 2 (Nov 19, 10:30): <strong>Delhi Morning Flights (3 Coaches)</strong></p>
                <p>Wave 3 (Nov 19, 15:00): <strong>Bangalore &amp; Dubai Connections (6 Sedans)</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 9: INVITATIONS & SAVE THE DATE ─────────────────────────────────── */}
      {activeTab === 'invitations' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Invitations &amp; Digital Save-the-Date
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Live preview of your couple invitation card with personalized RSVP link.
            </p>
          </div>

          <div className="max-w-md mx-auto p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#C9A45C]/50 text-center space-y-4 shadow-md">
            <span className="text-2xl block">💍</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#704B32] font-bold block">
              Together with their families
            </span>
            <h3 className="font-serif text-3xl font-extrabold text-[#2D1520]">
              {project.coupleName}
            </h3>
            <p className="text-xs text-stone-600 font-light italic">
              Request the honour of your presence to celebrate their wedding ceremonies.
            </p>
            <div className="py-2 border-y border-stone-200 text-xs font-semibold text-stone-700">
              {project.weddingDate} · {project.destination}
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-[11px] font-mono text-stone-600">
              RSVP Link: https://weddings.nutytales.com/rsvp/{project.id}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 10: FAVORS & TROUSSEAU ATELIER ─────────────────────────────────── */}
      {activeTab === 'favors' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Bespoke Favors &amp; Monogram Trousseau
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Laser-foiled dry fruit hampers, Kashmiri walnut chests, and suite deliveries for {project.guestCount} guests.
              </p>
            </div>
            <Link
              href="/wedding-return-gifts"
              className="px-5 py-2.5 bg-[#8E2848] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Order Sample Box →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WEDDING_CURATIONS.slice(0, 3).map((cur) => (
              <div
                key={cur.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3 text-xs"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image src={cur.image} alt={cur.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#17233B]">{cur.name}</h4>
                  <span className="text-stone-500 text-[11px]">₹{cur.price} / unit</span>
                </div>
                <p className="text-[11px] text-stone-500 font-light">
                  Estimated for {project.guestCount} units: ₹{(cur.price * project.guestCount).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 11: DOCUMENTS & CONTRACTS ─────────────────────────────────────── */}
      {activeTab === 'documents' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Contracts, Floor Plans &amp; Permits
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Secure centralized repository for venue contracts, sound licenses, and catering tasting signoffs.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { name: 'Jai_Mahal_Palace_Grounds_Agreement_2026.pdf', size: '2.4 MB', date: 'Oct 05, 2026', type: 'Venue Contract' },
              { name: 'Ustad_Gani_36_Course_Traami_Menu_Approved.pdf', size: '1.1 MB', date: 'Oct 08, 2026', type: 'Catering Signoff' },
              { name: 'Nuty_Tales_Foil_Monogram_Lid_Proof_v2.pdf', size: '4.8 MB', date: 'Oct 10, 2026', type: 'Gifting Design' },
            ].map((doc, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <strong className="text-stone-800 block">{doc.name}</strong>
                    <span className="text-[10px] text-stone-400">{doc.type} · {doc.size} · Uploaded {doc.date}</span>
                  </div>
                </div>
                <button className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-semibold hover:bg-stone-100">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 12: INVOICES & PAYMENTS ───────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#17233B]">
                Invoices &amp; Payment Schedules
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Track advance deposits, milestone settlements, transaction references, and payment due dates.
              </p>
            </div>
            <button
              onClick={() => setShowLogPaymentModal(true)}
              className="px-5 py-2.5 bg-[#8E2848] hover:bg-[#721f39] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + Log New Payment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-[10px] uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-3">Milestone / Invoice</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Due Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Transaction Ref</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3">
                      <strong className="text-[#17233B] block">{p.milestoneTitle}</strong>
                      <span className="text-[10px] text-stone-400">{p.invoiceNumber || 'Invoice Pending'}</span>
                    </td>
                    <td className="py-3 px-3 text-stone-600">{p.vendorOrRecipient}</td>
                    <td className="py-3 px-3 font-bold text-[#8E2848]">₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-stone-500">{p.dueDate}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-stone-500 text-[11px]">
                      {p.transactionRef || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 13: ACTIVITY AUDIT LOG ────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Project Activity &amp; Audit Trail
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Immutable timeline recording who performed important budget, event, or guest modifications.
            </p>
          </div>

          <div className="space-y-4">
            {activity.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#8E2848] mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <strong className="text-stone-800">{log.actorName}</strong>
                    <span className="text-stone-400 text-[10px]">• {new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-stone-600 font-light">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 14: REPORTS & RECONCILIATION ───────────────────────────────────── */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Executive Wedding Summary &amp; Reconciliation
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Printable master summary for couples, family elders, and finance controllers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs">
            <h3 className="font-serif font-bold text-lg text-[#17233B]">
              Wedding Project Financial &amp; Operational Reconciliation
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-700">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Planned Budget</span>
                <strong>₹{(totalPlannedBudget / 100000).toFixed(1)} Lakhs</strong>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Contracted Spend</span>
                <strong>₹{(totalContractedSpend / 100000).toFixed(1)} Lakhs</strong>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Paid Amount</span>
                <strong className="text-emerald-700">₹{(totalPaidAmount / 100000).toFixed(1)} Lakhs</strong>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">Uncommitted Buffer</span>
                <strong>₹{(remainingBudget / 100000).toFixed(1)} Lakhs</strong>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-[#17233B] text-white rounded-xl text-xs font-bold uppercase"
            >
              Print / Save Reconciliation PDF
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 15: SETTINGS & PERMISSIONS ────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
          <div className="border-b border-stone-100 pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#17233B]">
              Collaborators &amp; Role-Based Permissions
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Granular project access controls protecting budgets, payments, and guest lists from unauthorized view.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {[
              { name: 'Ananya Singhania (Bride)', role: 'Project Owner', permissions: 'Full Access (Budget, Contracts, Guests)' },
              { name: 'Vikramaditya Rathore (Groom)', role: 'Project Owner', permissions: 'Full Access (Budget, Contracts, Guests)' },
              { name: 'Noor-e-Shaadi Team', role: 'Wedding Planner', permissions: 'Can edit events, manage tasks, coordinate vendors' },
              { name: 'Raghav Singhania', role: 'Family Member', permissions: 'Can view guest list and room allotments' },
            ].map((collab, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <div>
                  <strong className="text-stone-800 text-sm block">{collab.name}</strong>
                  <span className="text-[11px] text-stone-500">{collab.permissions}</span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-stone-200 text-stone-700">
                  {collab.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SI WEDDING INTELLIGENCE DRAWER ───────────────────────────────────── */}
      {isSiOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[94vw] sm:w-[440px] max-h-[620px] h-[85vh] bg-[#FAF6EE] text-[#17233B] rounded-3xl shadow-2xl border-2 border-[#C9A45C] flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#2D1520] text-white p-4 flex items-center justify-between border-b border-[#C9A45C]/30">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">✨</span>
              <div>
                <h3 className="font-serif font-bold text-sm text-[#C9A45C]">
                  SI Wedding Intelligence
                </h3>
                <span className="text-[10px] text-stone-300">
                  Connected to: {project.coupleName} ({project.destination})
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSiOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            <div className="p-3 bg-white rounded-2xl border border-stone-200 text-stone-800 space-y-1">
              <strong className="text-[#8E2848] block">SI Analysis Ready:</strong>
              <p className="font-light leading-relaxed">
                I am actively monitoring your <strong>{project.coupleName}</strong> project. Planned budget is ₹{(totalPlannedBudget / 100000).toFixed(1)}L, with {events.length} scheduled events and {guests.length} guest records.
              </p>
            </div>

            {siChatHistory.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#8E2848] text-white ml-8 rounded-br-none'
                    : 'bg-white text-stone-800 border border-stone-200 mr-8 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2 bg-stone-100 border-t border-stone-200 flex flex-wrap gap-1.5 text-[10px]">
            <button
              onClick={() => handleAskSi('Check budget status and variance')}
              className="px-2 py-1 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
            >
              💰 Budget Check
            </button>
            <button
              onClick={() => handleAskSi('Check timeline for schedule conflicts')}
              className="px-2 py-1 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
            >
              ⚠️ Conflict Check
            </button>
            <button
              onClick={() => handleAskSi('Summarize upcoming payments due')}
              className="px-2 py-1 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 font-medium"
            >
              💳 Payments Due
            </button>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleAskSi()
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={siQuery}
              onChange={(e) => setSiQuery(e.target.value)}
              placeholder="Ask SI anything about your wedding plan..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="p-2 bg-[#8E2848] text-white rounded-xl text-xs font-bold"
            >
              →
            </button>
          </form>
        </div>
      )}

      {/* ── MODAL 1: ADD EVENT ──────────────────────────────────────────────── */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17233B]">Add New Ceremony</h3>
              <button onClick={() => setShowAddEventModal(false)} className="text-stone-400">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addEvent(project.id, {
                  title: newEventTitle,
                  eventType: newEventType,
                  date: newEventDate,
                  startTime: newEventStartTime,
                  endTime: newEventEndTime,
                  timeZone: 'Asia/Kolkata',
                  venueName: newEventVenue,
                  expectedGuests: newEventGuests,
                  budgetAllocated: 500000,
                })
                reloadData(project)
                setShowAddEventModal(false)
                setNewEventTitle('')
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Ceremony Title *</label>
                <input
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Haldi & Phoolon Ki Holi"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Event Type</label>
                  <select
                    aria-label="Event type"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  >
                    <option value="mehendi">Mehendi</option>
                    <option value="haldi">Haldi</option>
                    <option value="sangeet">Sangeet</option>
                    <option value="ceremony">Ceremony / Shaadi</option>
                    <option value="reception">Reception</option>
                    <option value="farewell_brunch">Brunch</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEventStartTime}
                    onChange={(e) => setNewEventStartTime(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={newEventEndTime}
                    onChange={(e) => setNewEventEndTime(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Venue Location</label>
                <input
                  type="text"
                  value={newEventVenue}
                  onChange={(e) => setNewEventVenue(e.target.value)}
                  placeholder="e.g. Lotus Pavilion Lawn"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#8E2848] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Schedule Ceremony
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ADD BUDGET ITEM ────────────────────────────────────────── */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17233B]">Add Budget Allocation</h3>
              <button onClick={() => setShowAddBudgetModal(false)} className="text-stone-400">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addBudgetItem(project.id, {
                  category: newBudgetCategory,
                  title: newBudgetTitle,
                  plannedAmount: newBudgetPlanned,
                  estimatedCost: newBudgetPlanned,
                  quotedAmount: newBudgetQuoted,
                  contractedAmount: 0,
                  paidAmount: 0,
                  paymentStatus: 'pending',
                  vendorName: newBudgetVendor,
                })
                reloadData(project)
                setShowAddBudgetModal(false)
                setNewBudgetTitle('')
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={newBudgetTitle}
                  onChange={(e) => setNewBudgetTitle(e.target.value)}
                  placeholder="e.g. Live Sufi Rabab Ensemble"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    aria-label="Budget category"
                    value={newBudgetCategory}
                    onChange={(e) => setNewBudgetCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  >
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="decor">Decor</option>
                    <option value="photography">Photography</option>
                    <option value="trousseau_favors">Gifting &amp; Favors</option>
                    <option value="music">Music</option>
                    <option value="transport">Transport</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Planned Budget (₹)</label>
                  <input
                    type="number"
                    value={newBudgetPlanned}
                    onChange={(e) => setNewBudgetPlanned(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#8E2848] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Save Budget Allocation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ADD GUEST ──────────────────────────────────────────────── */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17233B]">Add Guest Household</h3>
              <button onClick={() => setShowAddGuestModal(false)} className="text-stone-400">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addGuest(project.id, {
                  firstName: newGuestFirst,
                  lastName: newGuestLast,
                  household: newGuestHousehold,
                  email: newGuestEmail,
                  phone: newGuestPhone,
                  rsvpStatus: 'pending',
                  attendingCount: 1,
                  eventsAttending: ['ceremony', 'reception'],
                  mealPreference: newGuestMeal,
                  accommodationNeeded: false,
                  transportNeeded: false,
                })
                reloadData(project)
                setShowAddGuestModal(false)
                setNewGuestFirst('')
                setNewGuestLast('')
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newGuestFirst}
                    onChange={(e) => setNewGuestFirst(e.target.value)}
                    placeholder="e.g. Radhika"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={newGuestLast}
                    onChange={(e) => setNewGuestLast(e.target.value)}
                    placeholder="e.g. Sharma"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">WhatsApp Phone</label>
                <input
                  type="tel"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Dietary Preference</label>
                <select
                  aria-label="Dietary preference"
                  value={newGuestMeal}
                  onChange={(e) => setNewGuestMeal(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                >
                  <option value="Royal Wazwan & Multi-Cuisine">Royal Wazwan &amp; Multi-Cuisine</option>
                  <option value="Pure Vegetarian">Pure Vegetarian</option>
                  <option value="Strict Jain (No Root Veg)">Strict Jain (No Root Veg)</option>
                  <option value="Halal Certified">Halal Certified</option>
                  <option value="Vegan / Gluten-Free">Vegan / Gluten-Free</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#8E2848] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Save Guest Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 4: CSV IMPORT & EXPORT ────────────────────────────────────── */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17233B]">CSV Guest Import &amp; Export</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-stone-400">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-stone-600 font-light leading-relaxed">
                Paste your CSV lines below (Header format: <code>First Name, Last Name, Phone, Email, RSVP, Meal</code>) or export your current active guest list.
              </p>
              <textarea
                rows={5}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="First Name,Last Name,Phone,Email,RSVP,Meal&#10;Kunal,Verma,+919810012345,kunal@example.com,attending,Vegetarian&#10;Pooja,Bhatia,+919820067890,pooja@example.com,pending,Wazwan"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 font-mono text-[11px]"
              />

              {csvImportResult && (
                <div className="p-2 bg-stone-100 rounded-lg text-stone-700 font-semibold text-[11px]">
                  {csvImportResult}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const res = importGuestsFromCsv(project.id, csvContent)
                    if (res.error) {
                      setCsvImportResult(`Error: ${res.error}`)
                    } else {
                      setCsvImportResult(`Successfully imported ${res.imported} guests!`)
                      reloadData(project)
                      setTimeout(() => setShowCsvModal(false), 1200)
                    }
                  }}
                  className="flex-1 py-3 bg-[#8E2848] text-white rounded-xl font-bold uppercase"
                >
                  Parse &amp; Import
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const csvRows = ['First Name,Last Name,Phone,Email,RSVP,Meal,Table']
                    guests.forEach((g) => {
                      csvRows.push(`"${g.firstName}","${g.lastName}","${g.phone || ''}","${g.email || ''}","${g.rsvpStatus}","${g.mealPreference}","${g.tableId || ''}"`)
                    })
                    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Wedding_Guests_${project.id}.csv`
                    a.click()
                  }}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold uppercase"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: ADD TASK ────────────────────────────────────────────────── */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17233B]">Add New Task</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-stone-400">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                addTask(project.id, {
                  title: newTaskTitle,
                  category: 'general',
                  priority: newTaskPriority,
                  phase: newTaskPhase,
                  status: 'pending',
                  assigneeName: newTaskAssignee || 'Unassigned',
                })
                reloadData(project)
                setShowAddTaskModal(false)
                setNewTaskTitle('')
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Schedule final tasting with Wazwan Waza"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Priority</label>
                  <select
                    aria-label="Task priority"
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Timeline Phase</label>
                  <select
                    aria-label="Timeline phase"
                    value={newTaskPhase}
                    onChange={(e) => setNewTaskPhase(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  >
                    <option value="1_month">1 Month Out</option>
                    <option value="week_of">Week Of</option>
                    <option value="day_of">Day Of Event</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Assignee</label>
                <input
                  type="text"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  placeholder="e.g. Vikramaditya (Groom)"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#8E2848] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: LOG PAYMENT ────────────────────────────────────────────── */}
      {showLogPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17233B]">Log Milestone Payment</h3>
              <button onClick={() => setShowLogPaymentModal(false)} className="text-stone-400">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                recordPayment(project.id, {
                  vendorOrRecipient: newPayRecipient,
                  category: newPayCategory,
                  milestoneTitle: newPayMilestone,
                  amount: newPayAmount,
                  currency: project.currency,
                  dueDate: newPayDueDate,
                  status: 'paid',
                  paidDate: new Date().toISOString().split('T')[0],
                  transactionRef: `TXN-${Date.now().toString().slice(-6)}`,
                })
                reloadData(project)
                setShowLogPaymentModal(false)
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Recipient / Vendor *</label>
                <input
                  type="text"
                  required
                  value={newPayRecipient}
                  onChange={(e) => setNewPayRecipient(e.target.value)}
                  placeholder="e.g. Ustad Gani Wazwan Guild"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Milestone Description *</label>
                <input
                  type="text"
                  required
                  value={newPayMilestone}
                  onChange={(e) => setNewPayMilestone(e.target.value)}
                  placeholder="e.g. 50% Woodfire advance"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPayAmount}
                    onChange={(e) => setNewPayAmount(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category</label>
                  <select
                    aria-label="Payment category"
                    value={newPayCategory}
                    onChange={(e) => setNewPayCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  >
                    <option value="catering">Catering</option>
                    <option value="venue">Venue</option>
                    <option value="decor">Decor</option>
                    <option value="photography">Photography</option>
                    <option value="trousseau_favors">Gifts &amp; Favors</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#8E2848] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Record Payment Settlement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 7: CREATE NEW PROJECT ─────────────────────────────────────── */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-[#17233B]">Initialize New Wedding</h3>
              <button onClick={() => setShowNewProjectModal(false)} className="text-stone-400">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const cName = (form.elements.namedItem('cName') as HTMLInputElement).value
                const dest = (form.elements.namedItem('dest') as HTMLInputElement).value
                const date = (form.elements.namedItem('date') as HTMLInputElement).value
                const guests = Number((form.elements.namedItem('guests') as HTMLInputElement).value)
                const budgetLakhs = Number((form.elements.namedItem('budget') as HTMLInputElement).value)

                const newProj = createNewProject({
                  coupleName: cName,
                  destination: dest,
                  weddingDate: date,
                  guestCount: guests,
                  totalBudget: budgetLakhs * 100000,
                })
                reloadData(newProj)
                setShowNewProjectModal(false)
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-stone-700 block mb-1">Couple Name *</label>
                <input
                  name="cName"
                  type="text"
                  required
                  placeholder="e.g. Meera & Siddharth"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Destination *</label>
                  <input
                    name="dest"
                    type="text"
                    required
                    placeholder="e.g. Udaipur, Rajasthan"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Wedding Date *</label>
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Guest Estimate</label>
                  <input
                    name="guests"
                    type="number"
                    defaultValue={200}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Budget (₹ Lakhs)</label>
                  <input
                    name="budget"
                    type="number"
                    defaultValue={50}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#8E2848] text-white rounded-xl font-bold uppercase tracking-wider"
              >
                Create Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
