import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

export interface FirebaseTokenPayload {
  uid: string
  email?: string
  phone_number?: string
  name?: string
  picture?: string
  sign_in_provider?: string
  role?: string
  hasRoleClaim: boolean
}

export function getAdminApp(): App | null {
  const apps = getApps()
  if (apps.length > 0 && apps[0]) {
    return apps[0]
  }

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId) {
    return null
  }

  try {
    if (clientEmail && rawPrivateKey) {
      const privateKey = rawPrivateKey.replace(/\\n/g, '\n')
      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    }

    return initializeApp({ projectId })
  } catch (error) {
    console.error('[Firebase Admin] Initialization error:', error)
    return null
  }
}

/**
 * Verifies a Firebase ID token cryptographically on the server.
 * Restricts validation to project: nutty-tales-1c667.
 */
export async function verifyIdToken(
  idToken: string
): Promise<FirebaseTokenPayload | null> {
  const adminApp = getAdminApp()
  if (!adminApp) {
    console.warn('[Firebase Admin] Admin app not initialized - check service account credentials')
    return null
  }

  try {
    const auth = getAuth(adminApp)
    const decoded = await auth.verifyIdToken(idToken)

    return {
      uid: decoded.uid,
      email: decoded.email,
      phone_number: decoded.phone_number,
      name: decoded.name,
      picture: decoded.picture,
      sign_in_provider: decoded.firebase?.sign_in_provider,
      role: (decoded as any).role,
      hasRoleClaim: (decoded as any).role === 'authenticated',
    }
  } catch (error: any) {
    console.error('[Firebase Admin] Token verification failed:', error?.message)
    return null
  }
}

/**
 * Ensures the Firebase user has the custom claim: { role: 'authenticated' }.
 * This is explicitly required by Supabase's third-party Firebase Auth integration.
 * Returns true if the claim was newly added (client needs to force token refresh).
 */
export async function ensureAuthenticatedClaim(uid: string): Promise<boolean> {
  const adminApp = getAdminApp()
  if (!adminApp) {
    console.warn('[Firebase Admin] Cannot set claims: Admin app not initialized')
    return false
  }

  try {
    const auth = getAuth(adminApp)
    const user = await auth.getUser(uid)
    
    if (user.customClaims?.role !== 'authenticated') {
      await auth.setCustomUserClaims(uid, {
        ...(user.customClaims || {}),
        role: 'authenticated',
      })
      console.log(`[Firebase Admin] Assigned role='authenticated' claim to user ${uid}`)
      return true
    }
    return false
  } catch (error: any) {
    console.error('[Firebase Admin] Failed to assign role claim:', error?.message)
    return false
  }
}
