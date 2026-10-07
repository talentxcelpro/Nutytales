'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  ConfirmationResult,
  RecaptchaVerifier,
} from 'firebase/auth'
import {
  getFirebaseAuth,
  signInWithGoogle as fbSignInWithGoogle,
  setupRecaptcha,
  sendPhoneOtp as fbSendPhoneOtp,
  confirmPhoneOtp as fbConfirmPhoneOtp,
  logoutUser as fbLogoutUser,
} from '@/lib/firebase'
import { UserProfile } from '@/lib/profiles'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  loginWithGoogle: () => Promise<void>
  requestPhoneOtp: (phoneNumber: string, containerId?: string) => Promise<ConfirmationResult>
  confirmPhoneOtp: (confirmationResult: ConfirmationResult, otpCode: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  loginWithGoogle: async () => {},
  requestPhoneOtp: async () => { throw new Error('Not implemented') },
  confirmPhoneOtp: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Synchronize authenticated Firebase user with Supabase public.profiles
  const syncWithSupabase = async (firebaseUser: User, providerName?: string) => {
    try {
      const idToken = await firebaseUser.getIdToken()
      const res = await fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          idToken,
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          phone: firebaseUser.phoneNumber,
          avatar: firebaseUser.photoURL,
          provider: providerName || (firebaseUser.phoneNumber ? 'phone' : 'google'),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setProfile(data.profile)
        }
      }
    } catch (err) {
      console.error('[AuthContext] Failed to sync profile with Supabase:', err)
    }
  }

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await syncWithSupabase(currentUser)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    setLoading(true)
    try {
      const loggedInUser = await fbSignInWithGoogle()
      if (loggedInUser) {
        setUser(loggedInUser)
        await syncWithSupabase(loggedInUser, 'google')
        setIsModalOpen(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const requestPhoneOtp = async (
    phoneNumber: string,
    containerId: string = 'recaptcha-container'
  ): Promise<ConfirmationResult> => {
    const verifier = setupRecaptcha(containerId)
    const confirmationResult = await fbSendPhoneOtp(phoneNumber, verifier)
    return confirmationResult
  }

  const confirmPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    otpCode: string
  ): Promise<void> => {
    setLoading(true)
    try {
      const loggedInUser = await fbConfirmPhoneOtp(confirmationResult, otpCode)
      setUser(loggedInUser)
      await syncWithSupabase(loggedInUser, 'phone')
      setIsModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await fbLogoutUser()
      await fetch('/api/auth/sync-profile', { method: 'DELETE' }).catch(() => {})
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isModalOpen,
        openAuthModal: () => setIsModalOpen(true),
        closeAuthModal: () => setIsModalOpen(false),
        loginWithGoogle,
        requestPhoneOtp,
        confirmPhoneOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
