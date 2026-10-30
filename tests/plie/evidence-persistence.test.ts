import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { PlieEvidenceCollector } from '@/lib/plie/evidence/collector'
import { PlieExecutionRecord } from '@/lib/plie/types'

describe('Task 004 / Phase 1: PLIE Evidence Persistence Across Execution Restarts', () => {
  const runsDir = path.resolve(process.cwd(), '.data', 'plie-evidence', 'runs')
  const testExecId = 'PLIE-EXEC-TEST-RESTART-001'

  beforeEach(() => {
    // Clean up test file if existing
    const filePath = path.join(runsDir, `${testExecId}.json`)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  })

  it('1. Persists execution record to disk and restores it across fresh collector instance', async () => {
    // 1. Initial collector session
    const collectorSession1 = new PlieEvidenceCollector()

    const record: PlieExecutionRecord = {
      executionId: testExecId,
      timestamp: new Date().toISOString(),
      environment: {
        targetBaseUrl: 'https://nutytales-git-staging-arshidwani.vercel.app',
        isProduction: false,
        razorpayTestModeOnly: true,
        branch: 'staging',
      },
      status: 'COMPLETED',
      personasCount: 20,
      scenariosCount: 20,
      results: {
        passed: 19,
        failed: 1,
        blocked: 0,
        systemHealthScore: 85,
        commercialReadiness: 'CONDITIONAL',
      },
      findings: [
        {
          id: 'find_restart_001',
          executionId: testExecId,
          scenarioId: 'CHK-02',
          category: 'PAYMENTS',
          severity: 'HIGH',
          title: 'Simulated Razorpay Sandbox Webhook Latency',
          description: 'Webhook delivery exceeded normal 3s SLA during synthetic burst.',
          reproductionSteps: ['Initiate checkout', 'Trigger test webhook'],
          evidenceRefs: ['/evidence/network_trace_001.har'],
          remediationRecommendation: 'Verify distributed database idempotency lease time.',
          status: 'OPEN',
        },
      ],
      approvalGates: [
        {
          gateId: 'GATE-01',
          name: 'Staging Isolation Verification',
          description: 'Verification of staging boundaries',
          required: true,
          passed: true,
          blockersCount: 0,
        },
      ],
      durationMs: 4250,
    }

    await collectorSession1.recordExecution(record)

    // Verify file exists on disk
    const filePath = path.join(runsDir, `${testExecId}.json`)
    expect(fs.existsSync(filePath)).toBe(true)

    // 2. Simulate process termination and restart with a brand new collector instance
    const restartedCollector = new PlieEvidenceCollector()
    const restoredRecord = await restartedCollector.getExecution(testExecId)

    expect(restoredRecord).toBeDefined()
    expect(restoredRecord?.executionId).toBe(testExecId)
    expect(restoredRecord?.status).toBe('COMPLETED')
    expect(restoredRecord?.results.passed).toBe(19)
    expect(restoredRecord?.results.failed).toBe(1)
    expect(restoredRecord?.findings.length).toBe(1)
    expect(restoredRecord?.findings[0].title).toBe('Simulated Razorpay Sandbox Webhook Latency')
  })
})
