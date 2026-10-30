import { describe, it, expect } from 'vitest'
import { PlieOrchestrationEngine } from '@/lib/plie/engine'
import {
  calculateHealthScore,
  generateExecutionId,
  validateEnvironmentSafety,
  sanitizeEvidenceArtifact,
  PlieFinding,
} from '@/lib/plie/types'
import { PlaywrightPlieAdapter } from '@/lib/plie/adapters/playwright.adapter'
import { MiroFishSidecarAdapter } from '@/lib/plie/adapters/mirofish.adapter'
import { evidenceCollector } from '@/lib/plie/evidence/collector'

describe('Pre-Launch Intelligence Engine (PLIE) Architecture & Engine Tests', () => {
  it('generates immutable execution IDs with correct standard prefix and format', () => {
    const execId = generateExecutionId()
    expect(execId).toMatch(/^PLIE-EXEC-\d{8}-\d{10}-[A-Z0-9]{4}$/)
  })

  it('calculates System Health Score accurately according to severity weighting formula', () => {
    expect(calculateHealthScore([])).toBe(100)

    const findings: PlieFinding[] = [
      {
        id: 'F-1',
        executionId: 'TEST-EXEC',
        category: 'SECURITY',
        severity: 'CRITICAL',
        title: 'Critical Vulnerability',
        description: 'Test',
        reproductionSteps: [],
        evidenceRefs: [],
        remediationRecommendation: 'Fix immediately',
        status: 'OPEN',
      },
    ]
    expect(calculateHealthScore(findings)).toBe(70)

    findings.push({
      id: 'F-2',
      executionId: 'TEST-EXEC',
      category: 'PAYMENTS',
      severity: 'HIGH',
      title: 'High Severity Finding',
      description: 'Test',
      reproductionSteps: [],
      evidenceRefs: [],
      remediationRecommendation: 'Fix soon',
      status: 'OPEN',
    })
    expect(calculateHealthScore(findings)).toBe(55)

    findings[0].status = 'VERIFIED_FIXED'
    expect(calculateHealthScore(findings)).toBe(85)
  })

  it('Phase E: Rejects production URL independent of caller-controlled flags', () => {
    // Even if isProduction is false, hostname nutytales.com must be blocked
    const res1 = validateEnvironmentSafety({
      targetBaseUrl: 'https://nutytales.com',
      isProduction: false,
      razorpayTestModeOnly: true,
    })
    expect(res1.safe).toBe(false)
    expect(res1.reason).toContain('Production hostname rejected')

    const res2 = validateEnvironmentSafety({
      targetBaseUrl: 'https://www.nutytales.com/checkout',
      isProduction: false,
      razorpayTestModeOnly: true,
    })
    expect(res2.safe).toBe(false)
    expect(res2.reason).toContain('Production hostname rejected')

    // Allowed preview Vercel branch
    const res3 = validateEnvironmentSafety({
      targetBaseUrl: 'https://nutytales-git-preview-arshidwani.vercel.app',
      isProduction: false,
      razorpayTestModeOnly: true,
    })
    expect(res3.safe).toBe(true)
  })

  it('Phase E: Sanitizes evidence artifacts to prevent credential leakage', () => {
    const dirtyArtifact = {
      user: 'test-user',
      password: 'super_secret_password',
      token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.dummy',
      headers: {
        authorization: 'Bearer secret_token_xyz_123',
      },
      bankDetails: {
        rawAccount: '50200088910412',
      },
    }

    const cleaned = sanitizeEvidenceArtifact(dirtyArtifact)
    expect(cleaned.password).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(cleaned.token).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(cleaned.headers.authorization).toBe('[REDACTED_BY_PLIE_SANITIZER]')
    expect(cleaned.bankDetails.rawAccount).toBe('[REDACTED_ACCOUNT]')
  })

  it('Phase E: Handles execution cancellation gracefully via AbortController', async () => {
    const engine = new PlieOrchestrationEngine()
    const controller = new AbortController()
    controller.abort() // Pre-cancelled

    const stagingEnv = {
      targetBaseUrl: 'https://nutytales-git-preview-arshidwani.vercel.app',
      isProduction: false,
      razorpayTestModeOnly: true,
    }

    const record = await engine.runBattery({
      environment: stagingEnv,
      personas: [],
      scenarios: [
        {
          id: 'SCN-CANCEL',
          category: 'COMMERCE',
          title: 'Cancelled Test',
          description: 'Test',
          personaId: 'P1',
          preConditions: [],
          steps: [],
          riskFocus: 'Cancellation',
        },
      ],
      abortSignal: controller.signal,
    })

    expect(record.status).toBe('FAILED')
    expect(record.cancellationReason).toContain('cancelled')
  })

  it('executes a scenario battery across adapters in an isolated staging preview context', async () => {
    const engine = new PlieOrchestrationEngine()
    const playwrightAdapter = new PlaywrightPlieAdapter()
    const mirofishAdapter = new MiroFishSidecarAdapter()

    engine.registerAdapter(playwrightAdapter)
    engine.registerAdapter(mirofishAdapter)

    expect(engine.getRegisteredAdapters().length).toBe(2)

    const stagingEnv = {
      targetBaseUrl: 'https://nutytales-git-preview-arshidwani.vercel.app',
      isProduction: false,
      razorpayTestModeOnly: true,
      branch: 'staging/plie-validation',
    }

    const testPersona = {
      id: 'PERSONA-001',
      name: 'Synthetic First Time Buyer',
      email: 'synthetic.buyer@nutytales-test.local',
      phone: '+919999900001',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      device: 'desktop_chrome' as const,
      intent: 'purchase_cod' as const,
      budgetInr: 1500,
    }

    const testScenario = {
      id: 'SCN-001',
      category: 'COMMERCE' as const,
      title: 'Storefront Browse and Cart Verification',
      description: 'Tests storefront catalog load and item selection',
      personaId: 'PERSONA-001',
      preConditions: ['Empty cart'],
      steps: [
        {
          stepNumber: 1,
          action: 'NAVIGATE_SHOP',
          description: 'Open shop page',
          expectedOutcome: 'Catalog grid renders with items',
        },
      ],
      riskFocus: 'Navigation and Discovery',
    }

    const record = await engine.runBattery({
      environment: stagingEnv,
      personas: [testPersona],
      scenarios: [testScenario],
    })

    expect(record.status).toBe('COMPLETED')
    expect(record.results.passed).toBe(1)
    expect(record.results.failed).toBe(0)
    expect(record.results.systemHealthScore).toBe(100)
    expect(record.results.commercialReadiness).toBe('PASS')
    expect(record.approvalGates.length).toBeGreaterThan(0)
    expect(record.approvalGates[0].passed).toBe(true)

    // Verify evidence record persistence in Unified Evidence Collector
    const retrieved = await evidenceCollector.getExecution(record.executionId)
    expect(retrieved).not.toBeNull()
    expect(retrieved?.executionId).toBe(record.executionId)
  })
})
