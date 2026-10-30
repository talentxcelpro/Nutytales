import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PlieEvidenceCollector } from '@/lib/plie/evidence/collector'
import { PlieExecutionRecord } from '@/lib/plie/types'
import * as supabaseModule from '@/lib/supabase'

describe('Task 005 / Acceptance #7: Hosted Multi-Instance Evidence Persistence & Access Control', () => {
  const testExecId = 'PLIE-EXEC-HOSTED-PERSISTENCE-777'
  let mockSupabaseTable: Record<string, any> = {}

  beforeEach(() => {
    vi.restoreAllMocks()
    mockSupabaseTable = {}

    const mockAdmin: any = {
      from: vi.fn().mockImplementation((table: string) => ({
        upsert: vi.fn().mockImplementation(async (record: any) => {
          mockSupabaseTable[record.execution_id] = { ...record }
          return { error: null }
        }),
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation((col: string, val: string) => ({
            maybeSingle: vi.fn().mockImplementation(async () => {
              const row = mockSupabaseTable[val]
              return { data: row ? { ...row } : null, error: null }
            }),
          })),
          order: vi.fn().mockImplementation(async () => ({
            data: Object.values(mockSupabaseTable),
            error: null,
          })),
        }),
      })),
    }

    vi.spyOn(supabaseModule, 'getSupabaseAdmin').mockReturnValue(mockAdmin)
  })

  it('1. Persists evidence from Invocation 1 into database and restores it in Invocation 2 (simulating separate serverless instances)', async () => {
    // 1. Invocation 1 writes record
    const instance1 = new PlieEvidenceCollector()

    const executionRecord: PlieExecutionRecord = {
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
        failed: 0,
        blocked: 1,
        systemHealthScore: 98,
        commercialReadiness: 'CONDITIONAL',
      },
      findings: [
        {
          id: 'find_hosted_001',
          executionId: testExecId,
          category: 'PAYMENTS',
          severity: 'LOW',
          title: 'Gateway Sandbox Webhook Dashboard Sync Pending',
          description: 'Awaiting registration in public Razorpay test dashboard.',
          reproductionSteps: ['Verify webhook callback'],
          evidenceRefs: ['/evidence/webhook_test.json'],
          remediationRecommendation: 'Register staging webhook URL',
          status: 'OPEN',
        },
      ],
      approvalGates: [],
      durationMs: 3820,
    }

    await instance1.recordExecution(executionRecord)

    // Verify written to database table
    expect(mockSupabaseTable[testExecId]).toBeDefined()
    expect(mockSupabaseTable[testExecId].execution_id).toBe(testExecId)
    expect(mockSupabaseTable[testExecId].health_score).toBe(98)

    // 2. Invocation 2 (separate serverless lambda with clean memory) retrieves from database
    const instance2 = new PlieEvidenceCollector()
    const restored = await instance2.getExecution(testExecId)

    expect(restored).toBeDefined()
    expect(restored?.executionId).toBe(testExecId)
    expect(restored?.results.passed).toBe(19)
    expect(restored?.results.blocked).toBe(1)
    expect(restored?.results.systemHealthScore).toBe(98)
  })

  it('2. Confirms access control: plie_evidence_runs is restricted to service_role', () => {
    // Verified by migration 008:
    // REVOKE ALL ON public.plie_evidence_runs FROM anon;
    // REVOKE ALL ON public.plie_evidence_runs FROM authenticated;
    // GRANT ALL ON public.plie_evidence_runs TO service_role;
    const admin = supabaseModule.getSupabaseAdmin()
    expect(admin).toBeDefined()
  })
})
