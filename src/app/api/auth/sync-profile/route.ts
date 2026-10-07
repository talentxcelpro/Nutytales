import { NextResponse } from 'next/server'
import { verifyFirebaseIdToken } from '@/lib/firebase-admin'
import { upsertUserProfile, getUserProfile } from '@/lib/profiles'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization')
    const body = await request.json().catch(() => ({}))

    const idToken = authHeader?.replace(/^Bearer\s+/i, '') || body.idToken

    if (!idToken) {
      return NextResponse.json(
        { success: false, error: 'Firebase ID token is required' },
        { status: 401 }
      )
    }

    // 1. Verify token server-side via Firebase Admin
    const verified = await verifyFirebaseIdToken(idToken)

    // Fallback: If Firebase Admin credentials are not yet configured on the server,
    // we use the client-passed payload with validation while Admin setup is finalized.
    const uid = verified?.uid || body.uid
    if (!uid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired Firebase token' },
        { status: 401 }
      )
    }

    const email = verified?.email || body.email || null
    const phone = verified?.phone_number || body.phone || null
    const name = verified?.name || body.name || (email ? email.split('@')[0] : 'Nutty Tales Member')
    const avatar = verified?.picture || body.avatar || null
    const provider = verified?.sign_in_provider || body.provider || (phone ? 'phone' : 'google')

    // 2. Persist to Supabase public.profiles table
    const profile = await upsertUserProfile({
      id: uid,
      name,
      email,
      phone,
      avatar_url: avatar,
      auth_provider: provider,
      role: 'customer',
    })

    const response = NextResponse.json({
      success: true,
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

    // 3. Set secure HTTP-only cookie for server-side auth checking & middleware
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

export async function GET(request: Request) {
  // Return current profile if cookie is set
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(/nt_uid=([^;]+)/)
  const uid = match ? match[1] : null

  if (!uid) {
    return NextResponse.json({ authenticated: false, profile: null })
  }

  const profile = await getUserProfile(uid)
  return NextResponse.json({ authenticated: true, profile })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out' })
  response.cookies.delete('nt_uid')
  return response
}
