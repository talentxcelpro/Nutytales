'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, ConfirmationResult, RecaptchaVerifier } from 'firebase/auth'
import {
  signInWithGoogle,
  setupRecaptchaVerifier,
  sendPhoneOtp,
  confirmOtp,
  signOutUser,
  onAuthStateChange
} from '@/lib/firebase/client'
import { UserProfile } from '@/lib/profiles'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  idToken: string | null
  loading: boolean
  isModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  signInWithGoogle: () => Promise<void>
  sendPhoneOtp: (phoneNumber: string, containerId: string) => Promise<ConfirmationResult>
  confirmOtp: (confirmationResult: ConfirmationResult, otpCode: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  idToken: null,
  loading: true,
  isModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithGoogle: async () => {},
  sendPhoneOtp: async () => { throw new Error('Not implemented') },
  confirmOtp: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const syncWithSupabase = async (firebaseUser: User, providerName?: string) => {
    try {
      const token = await firebaseUser.getIdToken(true)
      setIdToken(token)
      
      const res = await fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idToken: token,
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
      console.error('[AuthContext] Failed to sync profile:', err)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await syncWithSupabase(currentUser)
      } else {
        setProfile(null)
        setIdToken(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Periodically refresh token
  useEffect(() => {
    if (!user) return
    const interval = setInterval(async () => {
      try {
        const token = await user.getIdToken(true)
        setIdToken(token)
      } catch (err) {
        console.error('Token refresh failed', err)
      }
    }, 10 * 60 * 1000) // 10 minutes
    return () => clearInterval(interval)
  }, [user])

  const handleSignInWithGoogle = async () => {
    setLoading(true)
    try {
      const loggedInUser = await signInWithGoogle()
      if (loggedInUser) {
        setUser(loggedInUser)
        await syncWithSupabase(loggedInUser, 'google')
        setIsModalOpen(false)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSendPhoneOtp = async (
    phoneNumber: string,
    containerId: string
  ): Promise<ConfirmationResult> => {
    const verifier = setupRecaptchaVerifier(containerId)
    return await sendPhoneOtp(phoneNumber, verifier)
  }

  const handleConfirmOtp = async (
    confirmationResult: ConfirmationResult,
    otpCode: string
  ): Promise<void> => {
    setLoading(true)
    try {
      const loggedInUser = await confirmOtp(confirmationResult, otpCode)
      setUser(loggedInUser)
      await syncWithSupabase(loggedInUser, 'phone')
      setIsModalOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOutUser()
      await fetch('/api/auth/sync-profile', { method: 'DELETE' }).catch(() => {})
      setUser(null)
      setProfile(null)
      setIdToken(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        idToken,
        loading,
        isModalOpen,
        openAuthModal: () => setIsModalOpen(true),
        closeAuthModal: () => setIsModalOpen(false),
        signInWithGoogle: handleSignInWithGoogle,
        sendPhoneOtp: handleSendPhoneOtp,
        confirmOtp: handleConfirmOtp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
