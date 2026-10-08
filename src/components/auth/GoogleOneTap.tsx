'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Script from 'next/script'
import { useAuth } from '@/context/AuthContext'

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          cancel: () => void
          renderButton?: (parent: HTMLElement, options: any) => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '812303172678-jjhpt3fu0cp2gitntp0due7lasadsses.apps.googleusercontent.com'

export default function GoogleOneTap() {
  const { user, loading, signInWithGoogleCredential } = useAuth()
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const initializedRef = useRef(false)

  const handleCredentialResponse = useCallback(
    async (response: { credential?: string }) => {
      if (!response?.credential) return
      try {
        await signInWithGoogleCredential(response.credential)
      } catch (err) {
        console.error('[GoogleOneTap] Credential sign-in failed:', err)
      }
    },
    [signInWithGoogleCredential]
  )

  const initializeOneTap = useCallback(() => {
    if (typeof window === 'undefined' || !window.google?.accounts?.id) return
    if (user || loading) return

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
        itp_support: true,
        use_fedcm_for_prompt: true,
      })

      window.google.accounts.id.prompt((notification: any) => {
        if (notification?.isNotDisplayed?.()) {
          const reason = notification.getNotDisplayedReason?.()
          console.log('[GoogleOneTap] Prompt not displayed:', reason)
        } else if (notification?.isSkippedMoment?.()) {
          const reason = notification.getSkippedReason?.()
          console.log('[GoogleOneTap] Skipped moment:', reason)
        } else if (notification?.isDismissedMoment?.()) {
          const reason = notification.getDismissedReason?.()
          console.log('[GoogleOneTap] Dismissed moment:', reason)
        }
      })

      initializedRef.current = true
    } catch (err) {
      console.error('[GoogleOneTap] Initialization failed:', err)
    }
  }, [user, loading, handleCredentialResponse])

  // Initialize once script is ready and auth state has resolved
  useEffect(() => {
    if (scriptLoaded && !loading && !user && !initializedRef.current) {
      // Small timeout to allow hydration to settle cleanly
      const timer = setTimeout(() => {
        initializeOneTap()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [scriptLoaded, loading, user, initializeOneTap])

  // When user logs in, dismiss/cancel prompt
  useEffect(() => {
    if (user && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.cancel()
      } catch {
        // ignore
      }
      initializedRef.current = false
    }
  }, [user])

  // If already logged in, do not load or render anything
  if (user) {
    return null
  }

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptLoaded(true)}
      onError={(e) => {
        console.error('[GoogleOneTap] Failed to load Google Identity script:', e)
      }}
    />
  )
}
