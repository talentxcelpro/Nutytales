// ─── Nuty Tales NRI — Core Domain Types & Contracts ───────────────────────────
// Operating Platform for Indians Living Abroad | nri.nutytales.com

export type ServiceCategoryKey =
  | 'property_management'
  | 'parent_care'
  | 'healthcare'
  | 'legal_documents'
  | 'tax_finance'
  | 'home_services'
  | 'travel_stays'
  | 'weddings_events'
  | 'gifting_deliveries'
  | 'crafts_heritage'
  | 'business_procurement'

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'matching'
  | 'quotes_received'
  | 'awaiting_customer_decision'
  | 'accepted'
  | 'payment_pending'
  | 'confirmed'
  | 'in_progress'
  | 'proof_submitted'
  | 'awaiting_approval'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'expired'
  | 'disputed'
  | 'refunded'
  | 'failed'

export type ProviderVerificationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'verified'
  | 'rejected'
  | 'suspended'

export interface RequestStatusEvent {
  status: RequestStatus
  timestamp: string
  actor: 'customer' | 'provider' | 'admin' | 'system'
  note?: string
}

export interface ExtractedPlan {
  title: string
  summary: string
  category: ServiceCategoryKey
  categoryLabel: string
  destination_city: string
  destination_state: string
  country_of_residence: string
  frequency: 'one_time' | 'weekly' | 'bi_weekly' | 'monthly' | 'quarterly' | 'custom'
  urgency: 'normal' | 'priority' | 'emergency'
  estimated_budget: {
    min: number
    max: number
    currency: string
    is_illustrative: boolean
    disclaimer: string
  }
  inclusions: string[]
  deliverables: string[]
  beneficiary_name?: string
  beneficiary_relation?: string
  property_type?: string
  property_address?: string
  target_date?: string
  clarification_needed: string[]
}

export interface MilestoneItem {
  id: string
  title: string
  percentage: number
  amount: number
  status: 'pending' | 'held' | 'released' | 'refunded'
  due_condition: string
}

export interface NriQuote {
  id: string
  requestId: string
  providerId: string
  providerName: string
  providerAvatar?: string
  providerBadge: string
  rating: number
  completedJobs: number
  totalAmount: number
  currency: string
  breakdown: { item: string; amount: number }[]
  milestones: MilestoneItem[]
  estimatedDays: number
  proposalNote: string
  validUntil: string
  createdAt: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
}

export interface ServiceProofItem {
  id: string
  requestId: string
  bookingId?: string
  providerId: string
  providerName: string
  timestamp: string
  locationLabel: string
  checklist: { item: string; completed: boolean; note?: string }[]
  photos: {
    url: string
    caption: string
    timestamp: string
    type: 'before' | 'after' | 'visit_checkin' | 'receipt' | 'document'
  }[]
  reportSummary: string
  customerApproval: 'pending' | 'approved' | 'disputed'
  disputeReason?: string
  approvedAt?: string
}

export interface NriRequest {
  id: string
  userId?: string
  userEmail?: string
  userName?: string
  createdAt: string
  updatedAt: string
  status: RequestStatus
  rawPrompt: string
  extractedPlan: ExtractedPlan
  quotes: NriQuote[]
  selectedQuoteId?: string
  proof?: ServiceProofItem
  history: RequestStatusEvent[]
  notes?: string
}

export interface NriProvider {
  id: string
  name: string
  businessName: string
  avatar: string
  categories: ServiceCategoryKey[]
  cities: string[]
  experienceYears: number
  verificationStatus: ProviderVerificationStatus
  verificationLevel: 'Identity Verified' | 'Background Checked' | 'Licensed Professional' | 'Premier Partner' | 'Platform Managed'
  rating: number
  reviewCount: number
  completedJobs: number
  nriExperience: string
  languages: string[]
  bio: string
  phone: string
  email: string
  panGstDeclared: boolean
  sampleRate: string
  matchReason?: string
  matchScore?: number
}

export interface FamilyMemberProfile {
  id: string
  userId: string
  name: string
  relation: string
  age?: number
  city: string
  address: string
  phone: string
  emergencyContact: boolean
  notes?: string
  preferredDoctor?: string
  upcomingVisit?: string
}

export interface PropertyProfile {
  id: string
  userId: string
  name: string
  propertyType: 'Independent House' | 'Apartment' | 'Orchard / Estate' | 'Commercial Office' | 'Plot / Land'
  address: string
  city: string
  state: string
  pincode: string
  status: 'Owner Vacant' | 'Tenant Occupied' | 'Under Renovation' | 'Routine Care'
  inspectionFrequency: 'Monthly' | 'Quarterly' | 'Bi-Weekly' | 'On-Demand'
  lastInspectionDate?: string
  electricityConsumerNo?: string
  waterAccountNo?: string
  notes?: string
}

export interface NriDispute {
  id: string
  requestId: string
  raisedBy: 'customer' | 'provider'
  category: 'Service Not Completed' | 'Quality Issue' | 'Incorrect Quotation' | 'Missed Visit' | 'Provider Misconduct' | 'Refund Request' | 'Other'
  description: string
  evidenceUrls: string[]
  status: 'submitted' | 'under_investigation' | 'provider_response' | 'resolved' | 'refunded'
  resolutionNotes?: string
  createdAt: string
  resolvedAt?: string
}

export interface EmergencyLead {
  id: string
  userId?: string
  contactName: string
  contactPhone: string
  contactCountry: string
  inIndiaPerson: string
  inIndiaPhone: string
  locationCity: string
  locationAddress: string
  nature: 'Elder Distress / Health' | 'Emergency Property Damage' | 'Urgent Legal / Police Verification' | 'Travel Disruption' | 'Other Urgent'
  urgency: 'Immediate (1-2 Hours)' | 'Same Day'
  createdAt: string
  status: 'Received' | 'Escalated' | 'In Action' | 'Resolved'
  dispatchNotes?: string
}

export interface OperationalCity {
  id: string
  name: string
  state: string
  region?: 'North' | 'West' | 'South' | 'East' | 'Central'
  operationalTier: 'Tier 1 - Full Operational Supply' | 'Tier 2 - Verified Partner Network' | 'On-Demand Coordination' | 'Tier 1 - Direct Fulfillment Hub' | 'Tier 2 - Scoped RFQ Dispatch' | 'Tier 3 - Expanding Network'
  coverageStatus?: 'Available to Book' | 'Request a Quote' | 'Limited Coverage' | 'Coming Soon'
  coverageSummary?: string
  leadCoverage: string[]
  emergencyDirectory: {
    police: string
    ambulance: string
    fire: string
    seniorHelpline: string
    nriCell?: string
  }
}
