import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  Auth,
  ConfirmationResult,
  User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let googleProvider: GoogleAuthProvider | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return null
  }
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
  }
  return app
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null
  const currentApp = getFirebaseApp()
  if (!currentApp) return null
  if (!auth) {
    auth = getAuth(currentApp)
  }
  return auth
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProvider) {
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({ prompt: 'select_account' })
  }
  return googleProvider
}

/**
 * Initiates Google OAuth sign-in flow via popup
 */
export async function signInWithGoogle(): Promise<User | null> {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not configured. Please check your environment variables.')
  }
  const provider = getGoogleProvider()
  const result = await signInWithPopup(firebaseAuth, provider)
  return result.user
}

/**
 * Initializes invisible / badge RecaptchaVerifier for Phone OTP verification
 */
export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not configured.')
  }

  // Clear existing verifier attached to window if present
  if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear()
    } catch {
      // ignore
    }
  }

  const verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      // Response expired
    },
  })

  if (typeof window !== 'undefined') {
    (window as any).recaptchaVerifier = verifier
  }

  return verifier
}

/**
 * Sends real SMS OTP to phone number (+91xxxxxxxxxx)
 */
export async function sendPhoneOtp(
  phoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not configured.')
  }

  return await signInWithPhoneNumber(firebaseAuth, phoneNumber, verifier)
}

/**
 * Confirms OTP code received via SMS
 */
export async function confirmPhoneOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<User> {
  const result = await confirmationResult.confirm(otpCode)
  return result.user
}

/**
 * Signs the current user out of Firebase
 */
export async function logoutUser(): Promise<void> {
  const firebaseAuth = getFirebaseAuth()
  if (firebaseAuth) {
    await signOut(firebaseAuth)
  }
}
