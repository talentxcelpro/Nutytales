import { getSupabaseAdmin, getSupabaseClient } from '@/lib/supabase'

export interface UserProfile {
  id: string // Firebase UID
  name?: string | null
  email?: string | null
  phone?: string | null
  avatar_url?: string | null
  auth_provider: 'google' | 'phone' | 'password' | string
  role?: string
  created_at?: string
  updated_at?: string
}

/**
 * Upserts a user profile into Supabase public.profiles linked to their Firebase UID.
 * Executed server-side using the privileged Supabase Admin client.
 */
export async function upsertUserProfile(profile: Partial<UserProfile> & { id: string }) {
  const client = getSupabaseAdmin() || getSupabaseClient()
  if (!client) {
    console.warn('[Profiles] Supabase client unavailable, skipping profile sync')
    return null
  }

  try {
    const payload = {
      id: profile.id,
      name: profile.name || null,
      email: profile.email || null,
      phone: profile.phone || null,
      avatar_url: profile.avatar_url || null,
      auth_provider: profile.auth_provider || 'google',
      role: profile.role || 'customer',
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await client
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    if (error) {
      console.warn('[Profiles] Supabase upsert error:', error.message)
      return null
    }

    return data as UserProfile
  } catch (err: any) {
    console.error('[Profiles] Unexpected error upserting profile:', err?.message)
    return null
  }
}

/**
 * Retrieves a user profile by Firebase UID
 */
export async function getUserProfile(firebaseUid: string): Promise<UserProfile | null> {
  const client = getSupabaseAdmin() || getSupabaseClient()
  if (!client) return null

  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', firebaseUid)
      .single()

    if (error) return null
    return data as UserProfile
  } catch {
    return null
  }
}
