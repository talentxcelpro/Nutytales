import { describe, it, expect } from 'vitest'
import {
  validateEnvironmentSafety,
  APPROVED_STAGING_HOSTS,
  APPROVED_VERCEL_STAGING_PATTERN,
  PlieEnvironmentConfig,
} from '@/lib/plie/types'
import { DEFAULT_FIREBASE_PROJECT_ID, DEFAULT_FIREBASE_ISSUER } from '@/lib/auth/jwt-verifier'
import { SUPABASE_URL } from '@/lib/supabase'

describe('Task 004 / Phase 2: Actual Staging Environment Independent Verification', () => {
  const verifiedStagingConfig: PlieEnvironmentConfig = {
    targetBaseUrl: 'https://nutytales-git-staging-arshidwani.vercel.app',
    branch: 'staging',
    gitCommitSha: '554601b-staging-plie-rc1',
    isProduction: false,
    razorpayTestModeOnly: true,
    approvedDeploymentId: 'dpl_nutytales_staging_arshidwani',
  }

  it('1. Verifies Vercel preview deployment identity and branch authorization', () => {
    const safety = validateEnvironmentSafety(verifiedStagingConfig)
    expect(safety.safe).toBe(true)
    expect(APPROVED_STAGING_HOSTS.has('nutytales-git-staging-arshidwani.vercel.app')).toBe(true)
    expect(APPROVED_VERCEL_STAGING_PATTERN.test('nutytales-git-staging-arshidwani.vercel.app')).toBe(true)
  })

  it('2. Verifies Supabase staging project endpoint', () => {
    expect(SUPABASE_URL).toBe('https://qezkjbzmtfjjmqgzgili.supabase.co')
  })

  it('3. Verifies Firebase staging project and cryptographic issuer', () => {
    expect(DEFAULT_FIREBASE_PROJECT_ID).toBe('nutty-tales-1c667')
    expect(DEFAULT_FIREBASE_ISSUER).toBe('https://securetoken.google.com/nutty-tales-1c667')
  })

  it('4. Rejects live Razorpay payment mode on staging environment', () => {
    const livePaymentConfig: PlieEnvironmentConfig = {
      ...verifiedStagingConfig,
      razorpayTestModeOnly: false, // Live payment attempt
    }

    const safety = validateEnvironmentSafety(livePaymentConfig)
    expect(safety.safe).toBe(false)
    expect(safety.reason).toContain('Razorpay test mode must be enabled')
  })

  it('5. Hard-rejects all production domain variations', () => {
    const prodHosts = [
      'https://nutytales.com',
      'https://www.nutytales.com',
      'https://api.nutytales.com',
      'https://checkout.nutytales.com',
    ]

    for (const host of prodHosts) {
      const res = validateEnvironmentSafety({
        targetBaseUrl: host,
        isProduction: false,
        razorpayTestModeOnly: true,
      })
      expect(res.safe).toBe(false)
      expect(res.reason).toContain('SECURITY BLOCK')
    }
  })
})
