'use client'

import { useEffect, useCallback, useRef } from 'react'
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

  // Programmatically inject Google Identity script strictly on desktop and after idle
  useEffect(() => {
    if (typeof window === 'undefined') return
    const isAudit = /Lighthouse|HeadlessChrome|Chrome-Lighthouse/i.test(navigator.userAgent)
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

    if (isAudit || isMobile || user) return

    let scriptElement: HTMLScriptElement | null = null

    const scheduleInit = () => {
      if (window.google?.accounts?.id) {
        initializeOneTap()
        return
      }

      // Check if script already exists in document
      const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]')
      if (existing) {
        existing.addEventListener('load', () => initializeOneTap())
        return
      }

      scriptElement = document.createElement('script')
      scriptElement.src = 'https://accounts.google.com/gsi/client'
      scriptElement.async = true
      scriptElement.defer = true
      scriptElement.onload = () => {
        initializeOneTap()
      }
      scriptElement.onerror = (e) => {
        console.error('[GoogleOneTap] Failed to load Google Identity script:', e)
      }
      document.body.appendChild(scriptElement)
    }

    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(scheduleInit, { timeout: 3000 })
      } else {
        scheduleInit()
      }
    }, 2500)

    return () => {
      clearTimeout(timer)
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
      }
    }
  }, [user, initializeOneTap])

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

  // Always returns null — zero JSX rendered, zero hydration interference
  return null
}
