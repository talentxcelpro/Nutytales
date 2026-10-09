// ─── Nuty Tales NRI — Persistent Data & State Store ───────────────────────────
// Operating Platform for Indians Living Abroad | nri.nutytales.com

import {
  NriRequest,
  FamilyMemberProfile,
  PropertyProfile,
  ServiceProofItem,
  NriDispute,
  EmergencyLead,
  NriProvider,
  RequestStatus,
} from './types'
import { VERIFIED_PROVIDERS } from './nri-data'

const STORAGE_KEYS = {
  REQUESTS: 'nt_nri_requests_v1',
  FAMILY: 'nt_nri_family_v1',
  PROPERTIES: 'nt_nri_properties_v1',
  DISPUTES: 'nt_nri_disputes_v1',
  EMERGENCY: 'nt_nri_emergency_v1',
  PROVIDERS: 'nt_nri_providers_v1',
  ACTIVE_REQUEST_ID: 'nt_nri_active_req_id',
}

// ── Default Seed Data for Live Experience ─────────────────────────────────────
const INITIAL_FAMILY: FamilyMemberProfile[] = [
  {
    id: 'fam-01',
    userId: 'current-user',
    name: 'Ghulam Mohammad & Fatima Begum',
    relation: 'Parents',
    age: 74,
    city: 'Srinagar',
    address: 'Near Mughal Garden, Harwan, Srinagar, J&K - 190023',
    phone: '+91-9419012345',
    emergencyContact: true,
    preferredDoctor: 'Dr. Rafiq (Cardiology, SMHS Hospital)',
    notes: 'Father takes hypertension medication daily; mother requires walking escort on steps.',
    upcomingVisit: 'Scheduled: Tuesday, 10:30 AM (Medicine Refill & Companion Errand)',
  },
  {
    id: 'fam-02',
    userId: 'current-user',
    name: 'Sunil & Meenakshi Wani',
    relation: 'In-Laws',
    age: 71,
    city: 'Delhi NCR',
    address: 'C-Block, Greater Kailash-I, New Delhi - 110048',
    phone: '+91-9811054321',
    emergencyContact: true,
    preferredDoctor: 'Max Super Speciality Hospital, Saket',
    notes: 'Routine health checkup scheduled quarterly.',
  },
]

const INITIAL_PROPERTIES: PropertyProfile[] = [
  {
    id: 'prop-01',
    userId: 'current-user',
    name: 'Harwan Ancestral Orchard Estate',
    propertyType: 'Orchard / Estate',
    address: 'Syedpora Road, Harwan Upper Canal',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    pincode: '190023',
    status: 'Routine Care',
    inspectionFrequency: 'Bi-Weekly',
    lastInspectionDate: '2026-09-28',
    electricityConsumerNo: 'JKPDD-0194-884920',
    notes: 'Winter pipe insulation and boundary apple tree prune completed in September.',
  },
  {
    id: 'prop-02',
    userId: 'current-user',
    name: 'DLF Phase-5 Luxury Penthouse',
    propertyType: 'Apartment',
    address: 'Tower 3, Apt 1402, DLF Phase 5, Gurugram',
    city: 'Delhi NCR',
    state: 'Haryana',
    pincode: '122009',
    status: 'Tenant Occupied',
    inspectionFrequency: 'Quarterly',
    lastInspectionDate: '2026-08-15',
    electricityConsumerNo: 'DHBVN-GUR-492019',
    notes: 'Tenant lease renewal due November 2026. Quarterly society fee auto-cleared.',
  },
]

const INITIAL_REQUESTS: NriRequest[] = [
  {
    id: 'req-srinagar-prop-101',
    userId: 'current-user',
    userName: 'Tariq Wani (London)',
    userEmail: 'tariq.wani@london-nri.co.uk',
    createdAt: '2026-10-02T10:30:00Z',
    updatedAt: '2026-10-08T14:15:00Z',
    status: 'proof_submitted',
    rawPrompt: 'Inspect my ancestral house and orchard in Harwan Srinagar before winter snow.',
    extractedPlan: {
      title: 'Harwan Orchard Estate Pre-Winter Physical Audit',
      summary: 'Comprehensive 42-point structural walkthrough, roof leakage check, plumbing winterization, and apple orchard boundary security.',
      category: 'property_management',
      categoryLabel: 'Property & Home Management',
      destination_city: 'Srinagar',
      destination_state: 'Jammu & Kashmir',
      country_of_residence: 'United Kingdom',
      frequency: 'one_time',
      urgency: 'normal',
      estimated_budget: {
        min: 3499,
        max: 4999,
        currency: 'INR',
        is_illustrative: false,
        disclaimer: 'Contracted flat fee for certified comprehensive structural inspection dossier.',
      },
      inclusions: [
        'Roof and attic snow load moisture inspection',
        'Pipe insulation and winter drainage flush',
        '32 High-resolution GPS-timestamped photos',
        'Direct check-in with on-site caretaker',
      ],
      deliverables: ['PDF Structural Health Dossier', 'Utility Meter Verification', 'Boundary Gate Integrity Video'],
      property_address: 'Syedpora Road, Harwan Upper Canal, Srinagar',
      clarification_needed: [],
    },
    quotes: [
      {
        id: 'q-mir-101',
        requestId: 'req-srinagar-prop-101',
        providerId: 'prov-kash-prop-01',
        providerName: 'Farooq Ahmad Mir (Mir Estate Solutions)',
        providerBadge: 'Premier Partner',
        rating: 4.96,
        completedJobs: 132,
        totalAmount: 3999,
        currency: 'INR',
        breakdown: [
          { item: 'Physical 42-point site audit & structural report', amount: 2799 },
          { item: 'GPS-timestamped photo dossier & meter readings', amount: 800 },
          { item: 'Platform verified milestone protection & QA', amount: 400 },
        ],
        milestones: [
          { id: 'm1', title: 'Inspection Mobilization', percentage: 40, amount: 1600, status: 'held', due_condition: 'Coordinator dispatch' },
          { id: 'm2', title: 'Customer Dossier Approval', percentage: 60, amount: 2399, status: 'pending', due_condition: 'Customer proof sign-off' },
        ],
        estimatedDays: 2,
        proposalNote: 'Visited on Oct 6. Detailed 32-photo inspection conducted and uploaded to your portal.',
        validUntil: '2026-10-15',
        createdAt: '2026-10-03T11:00:00Z',
        status: 'accepted',
      },
    ],
    selectedQuoteId: 'q-mir-101',
    proof: {
      id: 'proof-101',
      requestId: 'req-srinagar-prop-101',
      providerId: 'prov-kash-prop-01',
      providerName: 'Farooq Ahmad Mir',
      timestamp: '2026-10-07T14:30:00Z',
      locationLabel: 'Harwan Upper Canal, Srinagar (34.1526° N, 74.8994° E)',
      checklist: [
        { item: 'Main gate & perimeter wall check', completed: true, note: 'All latches and boundary locks secure.' },
        { item: 'Tin roof & chimney brickwork check', completed: true, note: 'No loose sheets; rain gutter cleared of autumn leaves.' },
        { item: 'Plumbing & pipe thermal wrapping', completed: true, note: 'Main exterior shutoff valve wrapped in fiberglass insulation.' },
        { item: 'Electricity meter reading check', completed: true, note: 'Reading verified: 48,291 units. Bill cleared.' },
        { item: 'Interior woodwork & moisture audit', completed: true, note: 'Dry interiors. No window sill seepage detected.' },
      ],
      photos: [
        {
          url: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=600&auto=format&fit=crop&q=80',
          caption: 'North Perimeter Boundary Wall & Apple Orchard Gate (Secure)',
          timestamp: '2026-10-07 14:12 IST',
          type: 'before',
        },
        {
          url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
          caption: 'Main Living Room Cedar Woodwork & Ceiling Condition',
          timestamp: '2026-10-07 14:24 IST',
          type: 'after',
        },
        {
          url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
          caption: 'Thermal Insulation Applied to Exterior Water Supply Mains',
          timestamp: '2026-10-07 14:35 IST',
          type: 'visit_checkin',
        },
      ],
      reportSummary: 'Property is in excellent physical condition. Thermal winter wrap applied to all outdoor lines. Caretaker Ghulam was present. Meter reading photographed.',
      customerApproval: 'pending',
    },
    history: [
      { status: 'submitted', timestamp: '2026-10-02T10:30:00Z', actor: 'customer', note: 'Request initiated from London, UK' },
      { status: 'matching', timestamp: '2026-10-02T10:31:00Z', actor: 'system', note: 'Matched with Farooq Ahmad Mir (Srinagar)' },
      { status: 'quotes_received', timestamp: '2026-10-03T11:00:00Z', actor: 'provider', note: 'Formal inspection quote of ₹3,999 submitted' },
      { status: 'accepted', timestamp: '2026-10-03T15:20:00Z', actor: 'customer', note: 'Quote accepted; milestone payment authorized' },
      { status: 'in_progress', timestamp: '2026-10-05T09:00:00Z', actor: 'provider', note: 'Coordinator mobilized to site' },
      { status: 'proof_submitted', timestamp: '2026-10-07T15:00:00Z', actor: 'provider', note: 'Inspection dossier and 32 photos uploaded' },
    ],
  },
]

// ── Store Operations ──────────────────────────────────────────────────────────

export const NriStore = {
  getRequests(): NriRequest[] {
    if (typeof window === 'undefined') return INITIAL_REQUESTS
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS)
      if (stored) return JSON.parse(stored)
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS))
      return INITIAL_REQUESTS
    } catch {
      return INITIAL_REQUESTS
    }
  },

  saveRequest(req: NriRequest): NriRequest {
    if (typeof window === 'undefined') return req
    try {
      const all = this.getRequests()
      const idx = all.findIndex((r) => r.id === req.id)
      let updated: NriRequest[]
      if (idx >= 0) {
        all[idx] = { ...req, updatedAt: new Date().toISOString() }
        updated = all
      } else {
        updated = [req, ...all]
      }
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated))
      localStorage.setItem(STORAGE_KEYS.ACTIVE_REQUEST_ID, req.id)
      return req
    } catch {
      return req
    }
  },

  getRequestById(id: string): NriRequest | null {
    const all = this.getRequests()
    return all.find((r) => r.id === id) || null
  },

  updateRequestStatus(
    id: string,
    status: RequestStatus,
    note?: string,
    actor: 'customer' | 'provider' | 'admin' = 'customer'
  ): NriRequest | null {
    const req = this.getRequestById(id)
    if (!req) return null

    req.status = status
    req.updatedAt = new Date().toISOString()
    req.history.push({
      status,
      timestamp: new Date().toISOString(),
      actor,
      note,
    })

    return this.saveRequest(req)
  },

  approveProof(requestId: string): NriRequest | null {
    const req = this.getRequestById(requestId)
    if (!req || !req.proof) return null

    req.proof.customerApproval = 'approved'
    req.proof.approvedAt = new Date().toISOString()
    req.status = 'completed'
    req.history.push({
      status: 'completed',
      timestamp: new Date().toISOString(),
      actor: 'customer',
      note: 'Inspection proof reviewed and approved. Final milestone released to provider.',
    })

    return this.saveRequest(req)
  },

  disputeProof(requestId: string, reason: string): NriRequest | null {
    const req = this.getRequestById(requestId)
    if (!req || !req.proof) return null

    req.proof.customerApproval = 'disputed'
    req.proof.disputeReason = reason
    req.status = 'disputed'
    req.history.push({
      status: 'disputed',
      timestamp: new Date().toISOString(),
      actor: 'customer',
      note: `Dispute raised: ${reason}. Escalated to Operations Supervisor.`,
    })

    return this.saveRequest(req)
  },

  getFamilyMembers(): FamilyMemberProfile[] {
    if (typeof window === 'undefined') return INITIAL_FAMILY
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAMILY)
      if (stored) return JSON.parse(stored)
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(INITIAL_FAMILY))
      return INITIAL_FAMILY
    } catch {
      return INITIAL_FAMILY
    }
  },

  saveFamilyMember(member: FamilyMemberProfile): FamilyMemberProfile[] {
    if (typeof window === 'undefined') return INITIAL_FAMILY
    try {
      const all = this.getFamilyMembers()
      const idx = all.findIndex((m) => m.id === member.id)
      let updated: FamilyMemberProfile[]
      if (idx >= 0) {
        all[idx] = member
        updated = all
      } else {
        updated = [...all, member]
      }
      localStorage.setItem(STORAGE_KEYS.FAMILY, JSON.stringify(updated))
      return updated
    } catch {
      return INITIAL_FAMILY
    }
  },

  getProperties(): PropertyProfile[] {
    if (typeof window === 'undefined') return INITIAL_PROPERTIES
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROPERTIES)
      if (stored) return JSON.parse(stored)
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES))
      return INITIAL_PROPERTIES
    } catch {
      return INITIAL_PROPERTIES
    }
  },

  saveProperty(prop: PropertyProfile): PropertyProfile[] {
    if (typeof window === 'undefined') return INITIAL_PROPERTIES
    try {
      const all = this.getProperties()
      const idx = all.findIndex((p) => p.id === prop.id)
      let updated: PropertyProfile[]
      if (idx >= 0) {
        all[idx] = prop
        updated = all
      } else {
        updated = [...all, prop]
      }
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(updated))
      return updated
    } catch {
      return INITIAL_PROPERTIES
    }
  },

  getProviders(): NriProvider[] {
    if (typeof window === 'undefined') return VERIFIED_PROVIDERS
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROVIDERS)
      if (stored) return JSON.parse(stored)
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(VERIFIED_PROVIDERS))
      return VERIFIED_PROVIDERS
    } catch {
      return VERIFIED_PROVIDERS
    }
  },

  saveProvider(provider: NriProvider): NriProvider[] {
    if (typeof window === 'undefined') return VERIFIED_PROVIDERS
    try {
      const all = this.getProviders()
      const idx = all.findIndex((p) => p.id === provider.id)
      let updated: NriProvider[]
      if (idx >= 0) {
        all[idx] = provider
        updated = all
      } else {
        updated = [provider, ...all]
      }
      localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(updated))
      return updated
    } catch {
      return VERIFIED_PROVIDERS
    }
  },

  saveEmergencyLead(lead: EmergencyLead): EmergencyLead[] {
    if (typeof window === 'undefined') return [lead]
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EMERGENCY)
      const all: EmergencyLead[] = stored ? JSON.parse(stored) : []
      const updated = [lead, ...all]
      localStorage.setItem(STORAGE_KEYS.EMERGENCY, JSON.stringify(updated))
      return updated
    } catch {
      return [lead]
    }
  },

  getEmergencyLeads(): EmergencyLead[] {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EMERGENCY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },
}
