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

const fallbackConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD4cD89kiA9iVuZpV-AcnMYITK2V1fbCk4',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nutty-tales-1c667.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nutty-tales-1c667',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'nutty-tales-1c667.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '812303172678',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:812303172678:web:f6e5008768eba9d7f7b647',
}

let app: FirebaseApp | null = null
let auth: Auth | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(fallbackConfig)
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
  if (typeof error === 'object' && error !== null) {
    const err = error as any
    if (err.code) {
      switch (err.code) {
        case 'auth/unauthorized-domain':
          return 'Domain nutytales.com is not authorized. Please add nutytales.com in Firebase Console > Authentication > Settings > Authorized domains.'
        case 'auth/operation-not-allowed':
          return 'This sign-in method is not enabled. Please enable Phone & Google in Firebase Console > Authentication > Sign-in method.'
        case 'auth/popup-blocked':
          return 'Google sign-in popup was blocked. Please allow popups for nutytales.com.'
        case 'auth/popup-closed-by-user':
          return 'Sign-in was cancelled.'
        case 'auth/invalid-phone-number':
          return 'Please enter a valid 10-digit phone number.'
        case 'auth/invalid-verification-code':
          return 'Invalid verification code. Please check and try again.'
        case 'auth/code-expired':
          return 'The verification code has expired. Please request a new code.'
        case 'auth/too-many-requests':
          return 'Too many attempts. Please wait a few minutes and try again.'
        case 'auth/quota-exceeded':
          return 'SMS quota exceeded for today. Please use Google Sign-In or contact support.'
        case 'auth/captcha-check-failed':
          return 'reCAPTCHA verification failed. Please refresh the page and try again.'
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection.'
        case 'auth/account-exists-with-different-credential':
          return 'An account already exists with this email using a different sign-in method.'
        case 'auth/invalid-api-key':
          return 'Invalid Firebase API key. Please check Firebase credentials in project settings.'
        default:
          return `Authentication error (${err.code}): ${err.message || 'Please try again.'}`
      }
    }
    if (err.message) {
      return err.message
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
