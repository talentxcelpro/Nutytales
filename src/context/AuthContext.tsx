'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { User, ConfirmationResult } from 'firebase/auth'
import {
  signInWithGoogle,
  signInWithGoogleCredential,
  setupRecaptchaVerifier,
  sendPhoneOtp,
  confirmOtp,
  signOutUser,
  onAuthStateChange
} from '@/lib/firebase/client'
import { UserProfile } from '@/lib/profiles'
import { getAuthenticatedSupabaseClient, getSupabaseClient } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  idToken: string | null
  supabase: SupabaseClient | null
  loading: boolean
  isModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  signInWithGoogle: () => Promise<void>
  signInWithGoogleCredential: (idToken: string) => Promise<void>
  sendPhoneOtp: (phoneNumber: string, containerId: string) => Promise<ConfirmationResult>
  confirmOtp: (confirmationResult: ConfirmationResult, otpCode: string) => Promise<void>
  signOut: () => Promise<void>
  refreshIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  idToken: null,
  supabase: null,
  loading: true,
  isModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithGoogle: async () => {},
  signInWithGoogleCredential: async () => {},
  sendPhoneOtp: async () => { throw new Error('Not implemented') },
  confirmOtp: async () => {},
  signOut: async () => {},
  refreshIdToken: async () => null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Dynamically create authenticated Supabase client when idToken changes
  const supabase = useMemo(() => {
    if (idToken) {
      return getAuthenticatedSupabaseClient(idToken) || getSupabaseClient()
    }
    return getSupabaseClient()
  }, [idToken])

  const refreshIdToken = async (): Promise<string | null> => {
    if (!user) return null
    try {
      const refreshed = await user.getIdToken(true)
      setIdToken(refreshed)
      return refreshed
    } catch (err) {
      console.error('[AuthContext] Token refresh failed:', err)
      return null
    }
  }

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
          provider: providerName || (firebaseUser.phoneNumber ? 'phone' : 'google'),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.profile) {
          setProfile(data.profile)
        }
        // If server assigned role='authenticated' claim, force token refresh
        if (data.claimsUpdated) {
          const freshToken = await firebaseUser.getIdToken(true)
          setIdToken(freshToken)
        }
      }
    } catch (err) {
      console.error('[AuthContext] Failed to sync profile with Supabase:', err)
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

  // Periodically refresh token to maintain fresh claims and session
  useEffect(() => {
    if (!user) return
    const interval = setInterval(async () => {
      try {
        const token = await user.getIdToken(true)
        setIdToken(token)
      } catch (err) {
        console.error('Periodic token refresh failed:', err)
      }
    }, 15 * 60 * 1000) // 15 minutes
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

  const handleSignInWithGoogleCredential = async (idToken: string) => {
    setLoading(true)
    try {
      const loggedInUser = await signInWithGoogleCredential(idToken)
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
        supabase,
        loading,
        isModalOpen,
        openAuthModal: () => setIsModalOpen(true),
        closeAuthModal: () => setIsModalOpen(false),
        signInWithGoogle: handleSignInWithGoogle,
        signInWithGoogleCredential: handleSignInWithGoogleCredential,
        sendPhoneOtp: handleSendPhoneOtp,
        confirmOtp: handleConfirmOtp,
        signOut: handleSignOut,
        refreshIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
