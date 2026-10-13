// ─── Nuty Tales Weddings — Master Type Definitions ───────────────────────────
// Core Lifecycle: DISCOVER → PLAN → BUDGET → BOOK → COORDINATE → EXECUTE → RECONCILE

export type WeddingStatus = 'planning' | 'booked' | 'executing' | 'completed' | 'archived'

export type Currency = 'INR' | 'USD' | 'AED' | 'EUR' | 'GBP'

export interface WeddingProject {
  id: string
  userId?: string
  coupleName: string
  partnerOneName?: string
  partnerTwoName?: string
  destination: string
  weddingDate: string // YYYY-MM-DD
  guestCount: number
  totalBudget: number
  currency: Currency
  weddingStyle: string
  status: WeddingStatus
  createdAt: string
  updatedAt: string
}

export type EventType =
  | 'roka'
  | 'mehendi'
  | 'haldi'
  | 'sangeet'
  | 'ceremony'
  | 'reception'
  | 'welcome_dinner'
  | 'farewell_brunch'
  | 'afterparty'
  | 'custom'

export interface WeddingEvent {
  id: string
  projectId: string
  title: string
  eventType: EventType
  date: string // YYYY-MM-DD
  startTime: string // HH:MM
  endTime: string // HH:MM
  timeZone: string
  venueName?: string
  venueId?: string
  expectedGuests: number
  budgetAllocated: number
  dressCode?: string
  assignedVendors?: string[]
  notes?: string
  sortOrder: number
}

export type VenueType =
  | 'palace'
  | 'resort'
  | 'orchard'
  | 'beachfront'
  | 'villa'
  | 'mountain'
  | 'ballroom'
  | 'heritage_haveli'

export interface WeddingVenue {
  id: string
  name: string
  slug: string
  destination: string
  city: string
  country: string
  venueType: VenueType
  capacityMin: number
  capacityMax: number
  accommodationRooms: number
  indoorOutdoor: 'indoor' | 'outdoor' | 'both'
  priceStarting: number
  currency: Currency
  cateringPolicy: string
  rating: number
  reviewsCount: number
  verified: boolean
  images: string[]
  amenities: string[]
  description: string
  featured?: boolean
}

export type VendorCategory =
  | 'planner'
  | 'catering'
  | 'photography'
  | 'decor'
  | 'makeup'
  | 'music'
  | 'transport'
  | 'favors'
  | 'outfits'
  | 'invitations'

export interface VendorPackage {
  name: string
  price: number
  inclusions: string[]
}

export interface WeddingVendor {
  id: string
  businessName: string
  slug: string
  category: VendorCategory
  destination: string
  city: string
  country: string
  startingPrice: number
  currency: Currency
  rating: number
  reviewsCount: number
  verified: boolean
  portfolio: string[]
  packages: VendorPackage[]
  contactPhone?: string
  contactEmail?: string
  bio: string
  featured?: boolean
}

export type QuotationStatus =
  | 'draft'
  | 'submitted'
  | 'received'
  | 'under_review'
  | 'accepted'
  | 'declined'
  | 'confirmed'
  | 'cancelled'

export interface WeddingEnquiry {
  id: string
  projectId: string
  vendorId?: string
  vendorName?: string
  venueId?: string
  venueName?: string
  eventId?: string
  eventTitle?: string
  category: VendorCategory | 'venue'
  targetDate: string
  guestCount: number
  requirements: string
  quoteAmount?: number
  currency: Currency
  status: QuotationStatus
  contractUrl?: string
  lineItems?: { desc: string; amount: number }[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export type BudgetCategory =
  | 'venue'
  | 'catering'
  | 'decor'
  | 'photography'
  | 'trousseau_favors'
  | 'music'
  | 'transport'
  | 'attire'
  | 'invitations'
  | 'planner_fees'
  | 'contingency'
  | 'other'

export interface BudgetItem {
  id: string
  projectId: string
  category: BudgetCategory
  title: string
  plannedAmount: number
  estimatedCost: number
  quotedAmount: number
  contractedAmount: number
  paidAmount: number
  dueDate?: string
  paymentStatus: 'pending' | 'partial' | 'paid' | 'overdue'
  vendorName?: string
  notes?: string
}

export type RsvpStatus = 'attending' | 'declined' | 'pending'

export interface WeddingGuest {
  id: string
  projectId: string
  firstName: string
  lastName: string
  household?: string
  email?: string
  phone?: string
  rsvpStatus: RsvpStatus
  attendingCount: number
  eventsAttending: string[]
  mealPreference: string
  dietaryRestrictions?: string
  accommodationNeeded: boolean
  transportNeeded: boolean
  tableId?: string
  seatNumber?: string
  notes?: string
}

export interface SeatingTable {
  id: string
  projectId: string
  name: string
  shape: 'round' | 'long' | 'head_table' | 'lounge'
  capacity: number
  assignedGuestIds: string[]
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskPhase =
  | '12_months'
  | '6_months'
  | '3_months'
  | '1_month'
  | 'week_of'
  | 'day_of'

export interface WeddingTask {
  id: string
  projectId: string
  eventId?: string
  title: string
  description?: string
  category: string
  phase: TaskPhase
  deadline?: string
  priority: TaskPriority
  status: TaskStatus
  assigneeName?: string
  assigneeRole?: string
}

export interface AccommodationBlock {
  id: string
  projectId: string
  hotelName: string
  roomType: string
  roomsReserved: number
  roomsAllocated: number
  checkInDate: string
  checkOutDate: string
  ratePerNight: number
  assignedGuests: string[]
}

export interface TransferRecord {
  id: string
  projectId: string
  guestNames: string[]
  pickupLocation: string
  dropLocation: string
  pickupTime: string
  vehicleType: string
  driverContact?: string
  status: 'scheduled' | 'in_transit' | 'completed'
}

export interface WeddingPayment {
  id: string
  projectId: string
  vendorOrRecipient: string
  category: BudgetCategory
  milestoneTitle: string
  amount: number
  currency: Currency
  dueDate: string
  paidDate?: string
  status: 'scheduled' | 'paid' | 'overdue'
  transactionRef?: string
  invoiceNumber?: string
}

export interface ActivityLog {
  id: string
  projectId: string
  actorName: string
  actionType: string
  description: string
  timestamp: string
}

export interface Collaborator {
  id: string
  projectId: string
  name: string
  email: string
  role: 'owner' | 'partner' | 'planner' | 'family' | 'vendor' | 'viewer'
  permissions: {
    canEditBudget: boolean
    canManageGuests: boolean
    canApproveQuotes: boolean
    canEditEvents: boolean
  }
}

export interface SIAnalysisResult {
  budgetStatus: 'healthy' | 'caution' | 'critical'
  budgetNotes: string[]
  timelineConflicts: {
    eventA: string
    eventB: string
    conflictDetail: string
  }[]
  actionPriorities: string[]
  suggestedChecklist: string[]
}
