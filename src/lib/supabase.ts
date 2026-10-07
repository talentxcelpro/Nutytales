// ─── Nutty Tales — Supabase Client & Database Services ─────────────────────────
// Project URL: https://qezkjbzmtfjjmqgzgili.supabase.co
// Supports safe isomorphic client & server usage with resilient fallback

import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qezkjbzmtfjjmqgzgili.supabase.co'

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''

export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  ''

let browserClient: SupabaseClient | null = null

/**
 * Returns the client-side Supabase client.
 * Falls back safely if the anon key is still pending configuration.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') {
    if (!SUPABASE_ANON_KEY) return null
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  if (browserClient) return browserClient

  if (SUPABASE_ANON_KEY) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    return browserClient
  }

  return null
}

/**
 * Returns the privileged server-side Supabase client for API routes.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const key = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY
  if (!key) return null
  return createClient(SUPABASE_URL, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// ── Database Helper Operations ──────────────────────────────────────────────────

export interface LeadSubmission {
  name: string
  phone: string
  email?: string
  city?: string
  businessName?: string
  source: string
  message: string
  metadata?: Record<string, any>
}

/**
 * Persists a commercial lead, RFQ, or founder inquiry to Supabase
 */
export async function insertLead(lead: LeadSubmission) {
  const admin = getSupabaseAdmin() || getSupabaseClient()
  if (!admin) {
    console.warn('[Supabase] Warning: Missing API key, lead logged locally:', lead)
    return { success: true, mode: 'local-fallback', data: lead }
  }

  try {
    const { data, error } = await admin.from('leads').insert([
      {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        city: lead.city,
        business_name: lead.businessName,
        source: lead.source,
        message: lead.message,
        metadata: lead.metadata || {},
        created_at: new Date().toISOString(),
      },
    ]).select()

    if (error) {
      console.warn('[Supabase] Insert error:', error.message)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error('[Supabase] Unexpected error inserting lead:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Saves a bespoke wedding hamper configuration to Supabase
 */
export async function insertWeddingHamper(hamper: {
  coupleNames: string
  weddingDate?: string
  boxType: string
  items: string[]
  budgetPerBox: number
  quantity: number
  clientPhone: string
  clientEmail?: string
}) {
  const admin = getSupabaseAdmin() || getSupabaseClient()
  if (!admin) {
    return { success: true, mode: 'local-fallback', data: hamper }
  }

  try {
    const { data, error } = await admin.from('wedding_hampers').insert([
      {
        couple_names: hamper.coupleNames,
        wedding_date: hamper.weddingDate,
        box_type: hamper.boxType,
        items: hamper.items,
        budget_per_box: hamper.budgetPerBox,
        quantity: hamper.quantity,
        client_phone: hamper.clientPhone,
        client_email: hamper.clientEmail,
        created_at: new Date().toISOString(),
      },
    ]).select()

    if (error) return { success: false, error: error.message }
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
