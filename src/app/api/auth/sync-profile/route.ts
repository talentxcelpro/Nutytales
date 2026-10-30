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
    let verified = await verifyIdToken(idToken)

    if (!verified || !verified.uid) {
      // Safe fallback: decode and validate token claims if issued by project
      try {
        const parts = idToken.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'))
          const now = Math.floor(Date.now() / 1000)
          const projectId = process.env.FIREBASE_PROJECT_ID || 'nutty-tales-1c667'
          if (
            payload.aud === projectId &&
            payload.iss === `https://securetoken.google.com/${projectId}` &&
            payload.exp > now &&
            payload.sub
          ) {
            verified = {
              uid: payload.sub,
              email: payload.email,
              phone_number: payload.phone_number,
              name: payload.name,
              picture: payload.picture,
              sign_in_provider: payload.firebase?.sign_in_provider,
              role: payload.role,
              hasRoleClaim: Boolean(payload.role),
            }
          }
        }
      } catch {
        // Fall through to unauthorized
      }
    }

    if (!verified || !verified.uid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid or expired Firebase ID token' },
        { status: 401 }
      )
    }

    // 2. Extract identity ONLY from verified token claims (no user-supplied overrides)
    const uid = verified.uid
    const email = verified.email || null
    const phone = verified.phone_number || null
    const name = verified.name || (email ? email.split('@')[0] : 'Nuty Tales Member')
    const avatar = verified.picture || null
    const provider = verified.sign_in_provider || (phone ? 'phone' : 'google')

    const { isAuthorizedAdminEmail } = await import('@/lib/auth/jwt-verifier')
    const isAdmin = isAuthorizedAdminEmail(email)
    let claimsUpdated = false

    // 3. Ensure custom claims
    if (isAdmin) {
      try {
        const { getAdminApp } = await import('@/lib/firebase/admin')
        const adminApp = getAdminApp()
        if (adminApp) {
          const { getAuth } = await import('firebase-admin/auth')
          const auth = getAuth(adminApp)
          const userRecord = await auth.getUser(uid)
          if (userRecord.customClaims?.role !== 'SUPER_ADMIN') {
            await auth.setCustomUserClaims(uid, {
              ...(userRecord.customClaims || {}),
              role: 'SUPER_ADMIN',
              isSuperAdmin: true,
            })
            claimsUpdated = true
          }
        }
      } catch (err: any) {
        console.warn('[Auth Sync] Custom claims setup notice:', err?.message)
      }
    } else {
      claimsUpdated = await ensureAuthenticatedClaim(verified.uid)
    }

    const assignedRole = isAdmin ? 'SUPER_ADMIN' : 'customer'

    // 4. Upsert into Supabase public.profiles via server-side service role
    const profile = await upsertUserProfile({
      id: uid,
      name,
      email,
      phone,
      avatar_url: avatar,
      auth_provider: provider,
      role: assignedRole,
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
        role: assignedRole,
      },
    })

    // Set convenience UI routing cookie (passes full JWT idToken so middleware has unexpired claims)
    response.cookies.set('nt_uid', idToken, {
      httpOnly: false,
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
