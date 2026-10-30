import { describe, it, expect } from 'vitest'
import {
  validateEnvironmentSafety,
  APPROVED_STAGING_HOSTS,
  APPROVED_VERCEL_STAGING_PATTERN,
  PlieEnvironmentConfig,
} from '@/lib/plie/types'
import { SUPABASE_URL } from '@/lib/supabase'

describe('Task 005 / Acceptance #1: Exact Staging Deployment Identity & Fail-Closed Guardrails', () => {
  const verifiedStagingConfig: PlieEnvironmentConfig = {
    targetBaseUrl: 'https://nutytales-git-staging-arshidwani.vercel.app',
    branch: 'staging',
    gitCommitSha: '554601b-task005-gate',
    isProduction: false,
    razorpayTestModeOnly: true,
    approvedDeploymentId: 'dpl_nutytales_staging_arshidwani',
  }

  it('1. Authorizes verified Vercel preview staging deployment with valid metadata', () => {
    const safety = validateEnvironmentSafety(verifiedStagingConfig)
    expect(safety.safe).toBe(true)
    expect(APPROVED_STAGING_HOSTS.has('nutytales-git-staging-arshidwani.vercel.app')).toBe(true)
    expect(APPROVED_VERCEL_STAGING_PATTERN.test('nutytales-git-staging-arshidwani.vercel.app')).toBe(true)
  })

  it('2. Fails closed if Git branch is main or master', () => {
    const mainBranchAttempt: PlieEnvironmentConfig = {
      ...verifiedStagingConfig,
      branch: 'main',
    }
    const safetyMain = validateEnvironmentSafety(mainBranchAttempt)
    expect(safetyMain.safe).toBe(false)
    expect(safetyMain.reason).toContain('production branch')

    const masterBranchAttempt: PlieEnvironmentConfig = {
      ...verifiedStagingConfig,
      branch: 'master',
    }
    const safetyMaster = validateEnvironmentSafety(masterBranchAttempt)
    expect(safetyMaster.safe).toBe(false)
    expect(safetyMaster.reason).toContain('production branch')
  })

  it('3. Fails closed if host is an arbitrary or unverified third-party Vercel domain', () => {
    const maliciousHostAttempt: PlieEnvironmentConfig = {
      ...verifiedStagingConfig,
      targetBaseUrl: 'https://phishing-attacker-app.vercel.app',
    }
    const safety = validateEnvironmentSafety(maliciousHostAttempt)
    expect(safety.safe).toBe(false)
    expect(safety.reason).toContain('not a verified Nuty Tales staging deployment')
  })

  it('4. Fails closed if target base URL is production domain', () => {
    const prodAttempts = [
      'https://nutytales.com',
      'https://www.nutytales.com',
      'https://api.nutytales.com',
    ]

    for (const host of prodAttempts) {
      const res = validateEnvironmentSafety({
        targetBaseUrl: host,
        isProduction: false,
        razorpayTestModeOnly: true,
        branch: 'staging',
      })
      expect(res.safe).toBe(false)
      expect(res.reason).toContain('SECURITY BLOCK')
    }
  })

  it('5. Fails closed if Razorpay test mode is disabled', () => {
    const liveAttempt: PlieEnvironmentConfig = {
      ...verifiedStagingConfig,
      razorpayTestModeOnly: false,
    }
    const safety = validateEnvironmentSafety(liveAttempt)
    expect(safety.safe).toBe(false)
    expect(safety.reason).toContain('Razorpay test mode must be enabled')
  })

  it('6. Verifies staging Supabase project identity and prevents production project binding', () => {
    // Verified staging project
    expect(SUPABASE_URL).toBe('https://qezkjbzmtfjjmqgzgili.supabase.co')
    expect(SUPABASE_URL).not.toContain('production-supabase')
  })
})
