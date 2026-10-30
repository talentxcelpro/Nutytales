import { describe, it, expect } from 'vitest'
import { PlieOrchestrationEngine } from '@/lib/plie/engine'
import {
  validateEnvironmentSafety,
  PlieEnvironmentConfig,
  PlieSyntheticPersona,
  PlieScenarioDefinition,
  calculateHealthScore,
} from '@/lib/plie/types'
import { PlaywrightPlieAdapter } from '@/lib/plie/adapters/playwright.adapter'
import { evidenceCollector } from '@/lib/plie/evidence/collector'

describe('Phase G: PLIE Staging Authorization & Demonstration', () => {
  const stagingPreviewUrl = 'https://nutytales-git-staging-arshidwani.vercel.app'
  const productionUrl = 'https://nutytales.com'

  const stagingEnv: PlieEnvironmentConfig = {
    targetBaseUrl: stagingPreviewUrl,
    branch: 'staging/plie-rc1',
    gitCommitSha: 'test-staging-sha-12345',
    isProduction: false,
    razorpayTestModeOnly: true,
  }

  const syntheticPersona: PlieSyntheticPersona = {
    id: 'PERSONA-STAGE-01',
    name: 'Synthetic Staging Customer',
    email: 'staging.tester@nutytales-test.local',
    phone: '+919999911111',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    device: 'desktop_chrome',
    intent: 'purchase_cod',
    budgetInr: 2500,
  }

  it('1. Correctly identifies and approves dedicated Vercel Preview environment', () => {
    const safety = validateEnvironmentSafety(stagingEnv)
    expect(safety.safe).toBe(true)
    expect(safety.reason).toBeUndefined()
  })

  it('2. Hard-rejects production target URL independent of caller flags', () => {
    const dangerousEnv: PlieEnvironmentConfig = {
      targetBaseUrl: productionUrl,
      isProduction: false, // Caller maliciously or mistakenly says false
      razorpayTestModeOnly: true,
    }

    const safety = validateEnvironmentSafety(dangerousEnv)
    expect(safety.safe).toBe(false)
    expect(safety.reason).toContain('SECURITY BLOCK')
  })

  it('2b. Rejects arbitrary / unapproved third-party vercel.app domains', () => {
    const unapprovedVercelEnv: PlieEnvironmentConfig = {
      targetBaseUrl: 'https://malicious-phishing-app.vercel.app',
      isProduction: false,
      razorpayTestModeOnly: true,
      branch: 'staging',
    }

    const safety = validateEnvironmentSafety(unapprovedVercelEnv)
    expect(safety.safe).toBe(false)
    expect(safety.reason).toContain('not a verified Nuty Tales staging deployment')
  })

  it('2c. Rejects targeting production branches like main or master', () => {
    const mainBranchEnv: PlieEnvironmentConfig = {
      targetBaseUrl: stagingPreviewUrl,
      isProduction: false,
      razorpayTestModeOnly: true,
      branch: 'main',
    }

    const safety = validateEnvironmentSafety(mainBranchEnv)
    expect(safety.safe).toBe(false)
    expect(safety.reason).toContain('production branch')
  })

  it('3 & 4 & 5. Demonstrates valid browser agent execution, synthetic journey, and evidence collection', async () => {
    const engine = new PlieOrchestrationEngine()
    const playwrightAdapter = new PlaywrightPlieAdapter()
    engine.registerAdapter(playwrightAdapter)

    const customerJourneyScenario: PlieScenarioDefinition = {
      id: 'SCN-007-STAGING',
      category: 'COMMERCE',
      title: 'Storefront COD Checkout End-to-End Journey',
      description: 'Navigates from shop to cart and places COD order in staging preview',
      personaId: syntheticPersona.id,
      preConditions: ['Empty cart', 'Valid staging URL'],
      steps: [
        {
          stepNumber: 1,
          action: 'DISCOVER_PRODUCT',
          description: 'Access shop catalog and select Grade A Makhana',
          expectedOutcome: 'Product detail view renders',
        },
        {
          stepNumber: 2,
          action: 'ADD_TO_BASKET',
          description: 'Add 1kg value pack to basket',
          expectedOutcome: 'Cart count increments to 1',
        },
        {
          stepNumber: 3,
          action: 'SUBMIT_COD_CHECKOUT',
          description: 'Enter shipping details and choose COD',
          expectedOutcome: 'Order confirmation reference generated',
        },
      ],
      riskFocus: 'End-to-End Commerce Flow',
    }

    const record = await engine.runBattery({
      environment: stagingEnv,
      personas: [syntheticPersona],
      scenarios: [customerJourneyScenario],
    })

    // Assert execution outcome
    expect(record.status).toBe('COMPLETED')
    expect(record.results.passed).toBe(1)
    expect(record.results.failed).toBe(0)
    expect(record.results.commercialReadiness).toBe('PASS')

    // Assert evidence collection
    const storedEvidence = await evidenceCollector.getExecution(record.executionId)
    expect(storedEvidence).not.toBeNull()
    expect(storedEvidence?.executionId).toBe(record.executionId)
    expect(storedEvidence?.environment.targetBaseUrl).toBe(stagingPreviewUrl)
  })

  it('6 & 7. Demonstrates failed journey classification, finding logging, and remediation retest', async () => {
    const engine = new PlieOrchestrationEngine()
    const playwrightAdapter = new PlaywrightPlieAdapter()
    engine.registerAdapter(playwrightAdapter)

    const initialExecution = await engine.runBattery({
      environment: stagingEnv,
      personas: [syntheticPersona],
      scenarios: [],
    })

    // Simulate identification of a High severity finding during testing
    await evidenceCollector.appendFinding(initialExecution.executionId, {
      id: 'FINDING-STAGE-001',
      executionId: initialExecution.executionId,
      scenarioId: 'SCN-007-STAGING',
      category: 'COMMERCE',
      severity: 'HIGH',
      title: 'Missing PIN Code Serviceability Check',
      description: 'COD checkout permits unserviceable PIN codes',
      reproductionSteps: ['Enter PIN 999999', 'Submit COD'],
      evidenceRefs: ['/evidence/trace-pin.zip'],
      remediationRecommendation: 'Implement logistics pincode check',
      status: 'OPEN',
    })

    // Verify finding classification blocks ready status
    const updatedRecord = await evidenceCollector.getExecution(initialExecution.executionId)
    expect(updatedRecord?.findings.length).toBe(1)
    expect(updatedRecord?.results.systemHealthScore).toBe(85) // 100 - 15 = 85
    expect(updatedRecord?.results.commercialReadiness).toBe('CONDITIONAL')

    // Simulate remediation and successful retest
    if (updatedRecord) {
      updatedRecord.findings[0].status = 'VERIFIED_FIXED'
      updatedRecord.results.systemHealthScore = calculateHealthScore(updatedRecord.findings)
      updatedRecord.results.commercialReadiness =
        updatedRecord.results.systemHealthScore >= 90 ? 'PASS' : 'CONDITIONAL'
      await evidenceCollector.recordExecution(updatedRecord)
    }

    const retestedRecord = await evidenceCollector.getExecution(initialExecution.executionId)
    expect(retestedRecord?.findings[0].status).toBe('VERIFIED_FIXED')
    expect(retestedRecord?.results.systemHealthScore).toBe(100)
    expect(retestedRecord?.results.commercialReadiness).toBe('PASS')
  })
})
