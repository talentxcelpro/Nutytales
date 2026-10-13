// ─── Nuty Tales Weddings — Master Project Storage & State Controller ─────────
// Resilient Isomorphic Data Management with Supabase & Reactive Client Sync

import {
  WeddingProject,
  WeddingEvent,
  BudgetItem,
  WeddingGuest,
  SeatingTable,
  WeddingTask,
  WeddingPayment,
  ActivityLog,
  WeddingVenue,
  WeddingVendor,
  WeddingEnquiry,
  SIAnalysisResult,
} from './types'
import {
  DEMO_PROJECT,
  DEMO_EVENTS,
  DEMO_BUDGET_ITEMS,
  DEMO_GUESTS,
  DEMO_TABLES,
  DEMO_TASKS,
  DEMO_PAYMENTS,
  DEMO_ACTIVITY,
  INITIAL_VENUES,
  INITIAL_VENDORS,
} from './data'

const STORAGE_KEYS = {
  ACTIVE_PROJECT: 'nt_wedding_active_project',
  ALL_PROJECTS: 'nt_wedding_projects_list',
  EVENTS: 'nt_wedding_events',
  BUDGET: 'nt_wedding_budget',
  GUESTS: 'nt_wedding_guests',
  TABLES: 'nt_wedding_tables',
  TASKS: 'nt_wedding_tasks',
  PAYMENTS: 'nt_wedding_payments',
  ACTIVITY: 'nt_wedding_activity',
  ENQUIRIES: 'nt_wedding_enquiries',
}

// ── 1. Project Operations ─────────────────────────────────────────────────────

export function getActiveProject(): WeddingProject {
  if (typeof window === 'undefined') return DEMO_PROJECT
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT)
    if (raw) return JSON.parse(raw)
  } catch (err) {
    console.warn('[WeddingStorage] Error loading project:', err)
  }
  return DEMO_PROJECT
}

export function saveActiveProject(project: WeddingProject): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, JSON.stringify(project))
    // Also save in projects list
    const all = getAllProjects()
    const idx = all.findIndex((p) => p.id === project.id)
    if (idx >= 0) {
      all[idx] = project
    } else {
      all.unshift(project)
    }
    localStorage.setItem(STORAGE_KEYS.ALL_PROJECTS, JSON.stringify(all))
    logActivity(project.id, 'Wedding Project Updated', `Modified parameters for ${project.coupleName}`)
  } catch (err) {
    console.error('[WeddingStorage] Save error:', err)
  }
}

export function getAllProjects(): WeddingProject[] {
  if (typeof window === 'undefined') return [DEMO_PROJECT]
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_PROJECTS)
    if (raw) {
      const list = JSON.parse(raw)
      if (Array.isArray(list) && list.length > 0) return list
    }
  } catch {
    // fallback
  }
  return [DEMO_PROJECT]
}

export function createNewProject(params: {
  coupleName: string
  destination: string
  weddingDate: string
  guestCount: number
  totalBudget: number
  currency?: 'INR' | 'USD' | 'AED' | 'EUR' | 'GBP'
  weddingStyle?: string
}): WeddingProject {
  const newProj: WeddingProject = {
    id: `WED-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
    coupleName: params.coupleName,
    destination: params.destination,
    weddingDate: params.weddingDate,
    guestCount: params.guestCount,
    totalBudget: params.totalBudget,
    currency: params.currency || 'INR',
    weddingStyle: params.weddingStyle || 'Modern Festive',
    status: 'planning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  saveActiveProject(newProj)
  logActivity(newProj.id, 'Project Created', `Initialized new wedding workspace for ${newProj.coupleName}`)
  return newProj
}

// ── 2. Events & Timeline Operations ──────────────────────────────────────────

export function getProjectEvents(projectId: string): WeddingEvent[] {
  if (typeof window === 'undefined') return DEMO_EVENTS
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.EVENTS}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return DEMO_EVENTS
}

export function saveProjectEvents(projectId: string, events: WeddingEvent[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEYS.EVENTS}_${projectId}`, JSON.stringify(events))
}

export function addEvent(projectId: string, event: Omit<WeddingEvent, 'id' | 'projectId' | 'sortOrder'>): WeddingEvent {
  const current = getProjectEvents(projectId)
  const newEvent: WeddingEvent = {
    ...event,
    id: `evt-${Date.now().toString().slice(-5)}`,
    projectId,
    sortOrder: current.length + 1,
  }
  const updated = [...current, newEvent]
  saveProjectEvents(projectId, updated)
  logActivity(projectId, 'Event Added', `Scheduled ${newEvent.title} on ${newEvent.date}`)
  return newEvent
}

export function deleteEvent(projectId: string, eventId: string): void {
  const current = getProjectEvents(projectId)
  const updated = current.filter((e) => e.id !== eventId)
  saveProjectEvents(projectId, updated)
  logActivity(projectId, 'Event Removed', `Deleted event ${eventId}`)
}

// ── 3. Schedule Conflict Detection ───────────────────────────────────────────

export interface ScheduleConflict {
  type: 'venue_overlap' | 'timing_overlap' | 'missing_venue'
  title: string
  description: string
  severity: 'high' | 'medium'
}

export function detectScheduleConflicts(events: WeddingEvent[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = []

  // Check for same date timing overlaps on same venue
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i]
      const b = events[j]

      if (a.date === b.date) {
        // Compare time slots
        const aStart = a.startTime
        const aEnd = a.endTime
        const bStart = b.startTime
        const bEnd = b.endTime

        const isOverlapping = aStart < bEnd && bStart < aEnd

        if (isOverlapping && a.venueName && b.venueName && a.venueName === b.venueName) {
          conflicts.push({
            type: 'venue_overlap',
            title: `Venue Conflict: ${a.title} & ${b.title}`,
            description: `Both celebrations are booked at "${a.venueName}" during overlapping hours on ${a.date} (${aStart}–${aEnd} vs ${bStart}–${bEnd}).`,
            severity: 'high',
          })
        } else if (isOverlapping) {
          conflicts.push({
            type: 'timing_overlap',
            title: `Tight Turnaround: ${a.title} & ${b.title}`,
            description: `Events occur at overlapping hours (${aStart} and ${bStart}) on ${a.date}. Ensure separate guest transport waves and coordinator teams.`,
            severity: 'medium',
          })
        }
      }
    }
  }

  return conflicts
}

// ── 4. Budget Operations ──────────────────────────────────────────────────────

export function getProjectBudget(projectId: string): BudgetItem[] {
  if (typeof window === 'undefined') return DEMO_BUDGET_ITEMS
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.BUDGET}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return DEMO_BUDGET_ITEMS
}

export function saveProjectBudget(projectId: string, items: BudgetItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEYS.BUDGET}_${projectId}`, JSON.stringify(items))
}

export function addBudgetItem(projectId: string, item: Omit<BudgetItem, 'id' | 'projectId'>): BudgetItem {
  const current = getProjectBudget(projectId)
  const newItem: BudgetItem = {
    ...item,
    id: `bgt-${Date.now().toString().slice(-5)}`,
    projectId,
  }
  const updated = [...current, newItem]
  saveProjectBudget(projectId, updated)
  logActivity(projectId, 'Budget Item Added', `Added allocation for ${newItem.title} (₹${newItem.plannedAmount.toLocaleString('en-IN')})`)
  return newItem
}

// ── 5. Guests Operations & CSV Import ─────────────────────────────────────────

export function getProjectGuests(projectId: string): WeddingGuest[] {
  if (typeof window === 'undefined') return DEMO_GUESTS
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.GUESTS}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return DEMO_GUESTS
}

export function saveProjectGuests(projectId: string, guests: WeddingGuest[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEYS.GUESTS}_${projectId}`, JSON.stringify(guests))
}

export function addGuest(projectId: string, guest: Omit<WeddingGuest, 'id' | 'projectId'>): WeddingGuest {
  const current = getProjectGuests(projectId)
  const newGuest: WeddingGuest = {
    ...guest,
    id: `gst-${Date.now().toString().slice(-5)}`,
    projectId,
  }
  const updated = [newGuest, ...current]
  saveProjectGuests(projectId, updated)
  logActivity(projectId, 'Guest Added', `Added ${newGuest.firstName} ${newGuest.lastName}`)
  return newGuest
}

export function importGuestsFromCsv(projectId: string, csvContent: string): { imported: number; error?: string } {
  try {
    const lines = csvContent.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length <= 1) return { imported: 0, error: 'CSV file is empty or only has headers' }

    const header = lines[0].toLowerCase().split(',')
    const firstIdx = header.findIndex((h) => h.includes('first') || h.includes('name'))
    const lastIdx = header.findIndex((h) => h.includes('last'))
    const emailIdx = header.findIndex((h) => h.includes('email'))
    const phoneIdx = header.findIndex((h) => h.includes('phone') || h.includes('mobile'))
    const rsvpIdx = header.findIndex((h) => h.includes('rsvp'))
    const dietIdx = header.findIndex((h) => h.includes('meal') || h.includes('diet'))

    const newGuests: WeddingGuest[] = []
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim())
      if (parts.length < 1 || !parts[0]) continue

      const firstName = firstIdx >= 0 ? parts[firstIdx] : parts[0]
      const lastName = lastIdx >= 0 ? parts[lastIdx] : (parts[1] || '')
      const email = emailIdx >= 0 ? parts[emailIdx] : undefined
      const phone = phoneIdx >= 0 ? parts[phoneIdx] : undefined
      const rsvpVal = rsvpIdx >= 0 ? parts[rsvpIdx].toLowerCase() : 'pending'
      const rsvpStatus = rsvpVal.includes('attend') || rsvpVal.includes('yes') ? 'attending' : rsvpVal.includes('declin') || rsvpVal.includes('no') ? 'declined' : 'pending'

      newGuests.push({
        id: `gst-csv-${Date.now().toString().slice(-4)}-${i}`,
        projectId,
        firstName: firstName || `Guest ${i}`,
        lastName: lastName,
        email,
        phone,
        rsvpStatus,
        attendingCount: 1,
        eventsAttending: ['ceremony', 'reception'],
        mealPreference: dietIdx >= 0 ? parts[dietIdx] : 'Standard',
        accommodationNeeded: false,
        transportNeeded: false,
      })
    }

    if (newGuests.length > 0) {
      const current = getProjectGuests(projectId)
      saveProjectGuests(projectId, [...newGuests, ...current])
      logActivity(projectId, 'Guests Imported', `Imported ${newGuests.length} guests via CSV upload`)
      return { imported: newGuests.length }
    }

    return { imported: 0, error: 'No valid rows found in CSV' }
  } catch (err: any) {
    return { imported: 0, error: err.message || 'CSV Parsing Error' }
  }
}

// ── 6. Seating Tables ─────────────────────────────────────────────────────────

export function getProjectTables(projectId: string): SeatingTable[] {
  if (typeof window === 'undefined') return DEMO_TABLES
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.TABLES}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return DEMO_TABLES
}

export function saveProjectTables(projectId: string, tables: SeatingTable[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEYS.TABLES}_${projectId}`, JSON.stringify(tables))
}

export function assignGuestToTable(projectId: string, guestId: string, tableId: string | null): void {
  const guests = getProjectGuests(projectId)
  const gIdx = guests.findIndex((g) => g.id === guestId)
  if (gIdx >= 0) {
    guests[gIdx].tableId = tableId || undefined
    saveProjectGuests(projectId, guests)
  }

  const tables = getProjectTables(projectId)
  tables.forEach((t) => {
    t.assignedGuestIds = t.assignedGuestIds.filter((id) => id !== guestId)
    if (tableId && t.id === tableId) {
      t.assignedGuestIds.push(guestId)
    }
  })
  saveProjectTables(projectId, tables)
}

// ── 7. Tasks Operations ───────────────────────────────────────────────────────

export function getProjectTasks(projectId: string): WeddingTask[] {
  if (typeof window === 'undefined') return DEMO_TASKS
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.TASKS}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return DEMO_TASKS
}

export function saveProjectTasks(projectId: string, tasks: WeddingTask[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEYS.TASKS}_${projectId}`, JSON.stringify(tasks))
}

export function addTask(projectId: string, task: Omit<WeddingTask, 'id' | 'projectId'>): WeddingTask {
  const current = getProjectTasks(projectId)
  const newTask: WeddingTask = {
    ...task,
    id: `tsk-${Date.now().toString().slice(-5)}`,
    projectId,
  }
  saveProjectTasks(projectId, [newTask, ...current])
  logActivity(projectId, 'Task Created', `Added: "${newTask.title}"`)
  return newTask
}

export function toggleTaskStatus(projectId: string, taskId: string): void {
  const tasks = getProjectTasks(projectId)
  const task = tasks.find((t) => t.id === taskId)
  if (task) {
    task.status = task.status === 'completed' ? 'pending' : 'completed'
    saveProjectTasks(projectId, tasks)
    logActivity(projectId, 'Task Updated', `Marked "${task.title}" as ${task.status}`)
  }
}

// ── 8. Payments Operations ────────────────────────────────────────────────────

export function getProjectPayments(projectId: string): WeddingPayment[] {
  if (typeof window === 'undefined') return DEMO_PAYMENTS
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.PAYMENTS}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return DEMO_PAYMENTS
}

export function saveProjectPayments(projectId: string, payments: WeddingPayment[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEYS.PAYMENTS}_${projectId}`, JSON.stringify(payments))
}

export function recordPayment(projectId: string, payment: Omit<WeddingPayment, 'id' | 'projectId'>): WeddingPayment {
  const current = getProjectPayments(projectId)
  const newPay: WeddingPayment = {
    ...payment,
    id: `pay-${Date.now().toString().slice(-5)}`,
    projectId,
  }
  saveProjectPayments(projectId, [newPay, ...current])
  logActivity(projectId, 'Payment Recorded', `Logged ₹${newPay.amount.toLocaleString('en-IN')} for ${newPay.vendorOrRecipient}`)
  return newPay
}

// ── 9. Activity Log Operations ────────────────────────────────────────────────

export function getProjectActivity(projectId: string): ActivityLog[] {
  if (typeof window === 'undefined') return DEMO_ACTIVITY
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.ACTIVITY}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return DEMO_ACTIVITY
}

export function logActivity(projectId: string, actionType: string, description: string, actorName = 'You'): void {
  if (typeof window === 'undefined') return
  try {
    const current = getProjectActivity(projectId)
    const newLog: ActivityLog = {
      id: `act-${Date.now().toString().slice(-6)}`,
      projectId,
      actorName,
      actionType,
      description,
      timestamp: new Date().toISOString(),
    }
    const updated = [newLog, ...current].slice(0, 50)
    localStorage.setItem(`${STORAGE_KEYS.ACTIVITY}_${projectId}`, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

// ── 10. Enquiries & Quotations Lifecycle ───────────────────────────────────────

export function getProjectEnquiries(projectId: string): WeddingEnquiry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.ENQUIRIES}_${projectId}`)
    if (raw) return JSON.parse(raw)
  } catch {
    // fallback
  }
  return []
}

export function saveProjectEnquiries(projectId: string, enquiries: WeddingEnquiry[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEYS.ENQUIRIES}_${projectId}`, JSON.stringify(enquiries))
}

export function createEnquiry(
  projectId: string,
  enquiry: Omit<WeddingEnquiry, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>
): WeddingEnquiry {
  const current = getProjectEnquiries(projectId)
  const newEnq: WeddingEnquiry = {
    ...enquiry,
    id: `ENQ-${Date.now().toString().slice(-5)}`,
    projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const updated = [newEnq, ...current]
  saveProjectEnquiries(projectId, updated)
  logActivity(projectId, 'Enquiry Dispatched', `Sent RFQ to ${newEnq.vendorName || newEnq.venueName || 'Vendor'}`)
  return newEnq
}

// ── 11. SI Intelligence Engine ────────────────────────────────────────────────

export function analyzeWeddingProject(projectId: string): SIAnalysisResult {
  const project = getActiveProject()
  const budget = getProjectBudget(projectId)
  const events = getProjectEvents(projectId)
  const tasks = getProjectTasks(projectId)
  const guests = getProjectGuests(projectId)

  // 1. Budget Analysis
  const totalBudget = project.totalBudget
  const contractedTotal = budget.reduce((sum, b) => sum + (b.contractedAmount || 0), 0)
  const paidTotal = budget.reduce((sum, b) => sum + (b.paidAmount || 0), 0)
  const plannedTotal = budget.reduce((sum, b) => sum + b.plannedAmount, 0)

  const budgetNotes: string[] = []
  let budgetStatus: 'healthy' | 'caution' | 'critical' = 'healthy'

  if (contractedTotal > totalBudget) {
    budgetStatus = 'critical'
    budgetNotes.push(
      `Committed vendor contracts (₹${(contractedTotal / 100000).toFixed(1)}L) exceed your total planned ceiling of ₹${(totalBudget / 100000).toFixed(1)}L by ₹${((contractedTotal - totalBudget) / 100000).toFixed(1)}L.`
    )
  } else {
    const remaining = totalBudget - contractedTotal
    budgetNotes.push(
      `Budget is healthy: ₹${(remaining / 100000).toFixed(1)}L (${Math.round((remaining / totalBudget) * 100)}%) remains uncommitted for contingency and upgrades.`
    )
  }

  // Check specific categories
  const venueItem = budget.find((b) => b.category === 'venue')
  if (venueItem && venueItem.contractedAmount > totalBudget * 0.45) {
    budgetNotes.push('Venue commitments exceed 45% of total wedding budget; recommend negotiating catering inclusions.')
  }

  // 2. Timeline Conflict Analysis
  const conflicts = detectScheduleConflicts(events)
  const timelineConflicts = conflicts.map((c) => ({
    eventA: c.title,
    eventB: '',
    conflictDetail: c.description,
  }))

  // 3. Action Priorities
  const actionPriorities: string[] = []
  const pendingTasks = tasks.filter((t) => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high'))
  if (pendingTasks.length > 0) {
    actionPriorities.push(`${pendingTasks.length} high-priority tasks requiring decision (e.g. "${pendingTasks[0].title}")`)
  }

  const unassignedGuests = guests.filter((g) => g.rsvpStatus === 'attending' && !g.tableId)
  if (unassignedGuests.length > 0) {
    actionPriorities.push(`${unassignedGuests.length} confirmed guests are awaiting table seating assignments.`)
  }

  const pendingRsvps = guests.filter((g) => g.rsvpStatus === 'pending')
  if (pendingRsvps.length > 0) {
    actionPriorities.push(`${pendingRsvps.length} guest RSVPs still pending response. Send digital reminder link.`)
  }

  const suggestedChecklist = [
    'Lock in final headcount with catering master chefs 14 days before Mehendi',
    'Review audio/sound permit cut-off hours with palace venue team',
    'Verify personalized couple monogram foil samples with Nuty Tales atelier',
    'Compile airport arrival flight numbers into 4 chauffeur shuttle waves',
  ]

  return {
    budgetStatus,
    budgetNotes,
    timelineConflicts,
    actionPriorities,
    suggestedChecklist,
  }
}
