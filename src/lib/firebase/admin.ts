import { getApps, initializeApp, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

export interface FirebaseTokenPayload {
  uid: string
  email?: string
  phone_number?: string
  name?: string
  picture?: string
  sign_in_provider?: string
}

function getAdminApp(): App | null {
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

export async function verifyIdToken(
  idToken: string
): Promise<FirebaseTokenPayload | null> {
  const adminApp = getAdminApp()
  if (!adminApp) {
    console.warn('[Firebase Admin] Admin app not initialized')
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
    }
  } catch (error: any) {
    console.error('[Firebase Admin] Token verification failed:', error?.message)
    return null
  }
}
