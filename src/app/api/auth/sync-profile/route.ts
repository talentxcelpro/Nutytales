import { NextResponse } from 'next/server'
import { verifyIdToken, ensureAuthenticatedClaim } from '@/lib/firebase/admin'
import { upsertUserProfile, getUserProfile } from '@/lib/profiles'

/**
 * POST /api/auth/sync-profile
 * Synchronizes Firebase authenticated user with Supabase public.profiles table.
 *
 * Security Requirements:
 * 1. Must cryptographically verify Firebase ID token server-side.
 * 2. Never accepts or trusts client-supplied UID, role, or identity overrides.
 * 3. Enforces { role: 'authenticated' } Firebase custom claim for Supabase third-party auth.
 * 4. Application role is locked to 'customer' — admin/staff roles cannot be self-assigned.
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const body = await request.json().catch(() => ({}))

    const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim() || body.idToken

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'Authorization Bearer token is required' },
        { status: 401 }
      )
    }

    // 1. Cryptographically verify Firebase ID token
    const verified = await verifyIdToken(idToken)

    if (!verified || !verified.uid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or expired Firebase ID token' },
        { status: 401 }
      )
    }

    // 2. Ensure Firebase custom claim { role: 'authenticated' } is assigned
    // This is mandatory for Supabase Third-Party Firebase Auth RLS enforcement
    const claimsUpdated = await ensureAuthenticatedClaim(verified.uid)

    // 3. Extract identity ONLY from verified token claims (no user-supplied overrides)
    const uid = verified.uid
    const email = verified.email || null
    const phone = verified.phone_number || null
    const name = verified.name || (email ? email.split('@')[0] : 'Nuty Tales Member')
    const avatar = verified.picture || null
    const provider = verified.sign_in_provider || (phone ? 'phone' : 'google')

    // 4. Upsert into Supabase public.profiles via server-side service role
    const profile = await upsertUserProfile({
      id: uid,
      name,
      email,
      phone,
      avatar_url: avatar,
      auth_provider: provider,
      // Application role cannot be escalated by client
      role: 'customer',
    })

    const response = NextResponse.json({
      success: true,
      claimsUpdated,
      profile: profile || {
        id: uid,
        name,
        email,
        phone,
        avatar_url: avatar,
        auth_provider: provider,
        role: 'customer',
      },
    })

    // Set convenience UI routing cookie (NOT used as authorization credential for sensitive data)
    response.cookies.set('nt_uid', uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return response
  } catch (error: any) {
    console.error('[Auth Sync] Error synchronizing profile:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/sync-profile
 * Fetches profile for a verified Firebase ID token.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const idToken = authHeader?.replace(/^Bearer\s+/i, '').trim()

  if (!idToken) {
    return NextResponse.json(
      { authenticated: false, error: 'Missing Authorization header' },
      { status: 401 }
    )
  }

  const verified = await verifyIdToken(idToken)
  if (!verified || !verified.uid) {
    return NextResponse.json(
      { authenticated: false, error: 'Invalid token' },
      { status: 401 }
    )
  }

  const profile = await getUserProfile(verified.uid)
  return NextResponse.json({ authenticated: true, profile })
}

/**
 * DELETE /api/auth/sync-profile
 * Clears the convenience UI routing cookie.
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete('nt_uid')
  return response
}
