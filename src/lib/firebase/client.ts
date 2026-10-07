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
  onAuthStateChanged,
  AuthError
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

export function getFirebaseErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case 'auth/popup-blocked':
        return 'Google sign-in was blocked. Please allow popups and try again.'
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.'
      case 'auth/invalid-phone-number':
        return 'Please enter a valid phone number.'
      case 'auth/invalid-verification-code':
        return 'Invalid code. Please check and try again.'
      case 'auth/code-expired':
        return 'The verification code has expired. Please request a new one.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a few minutes and try again.'
      case 'auth/quota-exceeded':
        return 'SMS verification is temporarily unavailable. Please try Google sign-in or contact support.'
      case 'auth/captcha-check-failed':
        return 'Security check failed. Please refresh and try again.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.'
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with this email using a different sign-in method.'
    }
  }
  return 'Authentication failed. Please try again.'
}

export async function signInWithGoogle(): Promise<User | null> {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not configured. Please check your environment variables.')
  }
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const result = await signInWithPopup(firebaseAuth, provider)
  return result.user
}

export function setupRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  const firebaseAuth = getFirebaseAuth()
  if (!firebaseAuth) {
    throw new Error('Firebase Auth is not configured.')
  }

  if (typeof window !== 'undefined' && (window as any).recaptchaVerifier) {
    try {
      (window as any).recaptchaVerifier.clear()
    } catch {
      // ignore
    }
  }

  const verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
    size: 'invisible',
  })

  if (typeof window !== 'undefined') {
    (window as any).recaptchaVerifier = verifier
  }

  return verifier
}

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

export async function confirmOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<User> {
  const result = await confirmationResult.confirm(otpCode)
  return result.user
}

export async function signOutUser(): Promise<void> {
  const firebaseAuth = getFirebaseAuth()
  if (firebaseAuth) {
    await signOut(firebaseAuth)
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth()
  if (!auth) return () => {}
  return onAuthStateChanged(auth, callback)
}
