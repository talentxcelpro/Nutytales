// ─── Nuty Tales PLIE — Unified Evidence Collector ─────────────────────────────
// Aggregates, structures, and persists execution artifacts, logs, and findings.
// Dual-mode persistence:
// 1. Primary: Distributed Database (Supabase 'plie_evidence_runs' table) for multi-instance Vercel serverless durability.
// 2. Secondary: Local disk cache (.data/plie-evidence/runs/) for rapid offline development.
// Automatically sanitizes credentials and enforces server-side RLS isolation.

import fs from 'fs'
import path from 'path'
import {
  PlieExecutionRecord,
  PlieFinding,
  sanitizeEvidenceArtifact,
} from '../types'
import { getSupabaseAdmin } from '../../supabase'

const EVIDENCE_DIR = path.resolve(process.cwd(), '.data', 'plie-evidence', 'runs')

function ensureDir() {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true })
  }
}

export class PlieEvidenceCollector {
  private inMemoryEvidence: Map<string, PlieExecutionRecord> = new Map()

  /**
   * Records or updates a full execution record with sanitization & dual persistence
   */
  async recordExecution(record: PlieExecutionRecord): Promise<void> {
    const sanitized = sanitizeEvidenceArtifact(record)
    this.inMemoryEvidence.set(sanitized.executionId, sanitized)

    // 1. Database-backed distributed persistence (for Vercel serverless multi-instance shared state)
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        await admin.from('plie_evidence_runs').upsert(
          {
            execution_id: sanitized.executionId,
            status: sanitized.status,
            environment: sanitized.environment,
            results: sanitized.results,
            findings: sanitized.findings,
            approval_gates: sanitized.approvalGates,
            personas_count: sanitized.personasCount,
            scenarios_count: sanitized.scenariosCount,
            health_score: sanitized.results.systemHealthScore,
            duration_ms: sanitized.durationMs,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'execution_id' }
        )
      } catch (dbErr) {
        console.warn('[PLIE Evidence] Database persistence warning (filesystem fallback active):', dbErr)
      }
    }

    // 2. Filesystem persistence
    try {
      ensureDir()
      const filePath = path.join(EVIDENCE_DIR, `${sanitized.executionId}.json`)
      fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2), 'utf8')
    } catch (err) {
      console.warn('[PLIE Evidence] Disk write warning (in-memory preserved):', err)
    }
  }

  /**
   * Retrieves an execution record by immutable Execution ID (Memory -> Database -> Disk)
   */
  async getExecution(executionId: string): Promise<PlieExecutionRecord | null> {
    const memory = this.inMemoryEvidence.get(executionId)
    if (memory) return memory

    // Try Database retrieval
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data: row, error } = await admin
          .from('plie_evidence_runs')
          .select('*')
          .eq('execution_id', executionId)
          .maybeSingle()

        if (!error && row) {
          const restored: PlieExecutionRecord = {
            executionId: row.execution_id,
            timestamp: row.created_at,
            environment: row.environment,
            status: row.status,
            personasCount: row.personas_count,
            scenariosCount: row.scenarios_count,
            results: row.results,
            findings: row.findings || [],
            approvalGates: row.approval_gates || [],
            durationMs: row.duration_ms,
          }
          this.inMemoryEvidence.set(executionId, restored)
          return restored
        }
      } catch {
        // Fall through to disk
      }
    }

    // Try Local Disk retrieval
    try {
      const filePath = path.join(EVIDENCE_DIR, `${executionId}.json`)
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8')
        const parsed = JSON.parse(raw) as PlieExecutionRecord
        this.inMemoryEvidence.set(executionId, parsed)
        return parsed
      }
    } catch {
      // Fall through
    }

    return null
  }

  /**
   * Lists all recorded executions
   */
  async listExecutions(): Promise<PlieExecutionRecord[]> {
    const admin = getSupabaseAdmin()
    if (admin) {
      try {
        const { data: rows } = await admin
          .from('plie_evidence_runs')
          .select('*')
          .order('created_at', { ascending: false })

        if (rows && rows.length > 0) {
          for (const row of rows) {
            if (!this.inMemoryEvidence.has(row.execution_id)) {
              this.inMemoryEvidence.set(row.execution_id, {
                executionId: row.execution_id,
                timestamp: row.created_at,
                environment: row.environment,
                status: row.status,
                personasCount: row.personas_count,
                scenariosCount: row.scenarios_count,
                results: row.results,
                findings: row.findings || [],
                approvalGates: row.approval_gates || [],
                durationMs: row.duration_ms,
              })
            }
          }
          return Array.from(this.inMemoryEvidence.values())
        }
      } catch {
        // Fall through to disk
      }
    }

    ensureDir()
    try {
      const files = fs.readdirSync(EVIDENCE_DIR)
      for (const file of files) {
        if (file.endsWith('.json')) {
          const execId = file.replace('.json', '')
          if (!this.inMemoryEvidence.has(execId)) {
            await this.getExecution(execId)
          }
        }
      }
    } catch {
      // Ignore
    }

    return Array.from(this.inMemoryEvidence.values())
  }

  /**
   * Appends an identified finding to an active execution record
   */
  async appendFinding(executionId: string, finding: PlieFinding): Promise<boolean> {
    const record = await this.getExecution(executionId)
    if (!record) return false

    const sanitizedFinding = sanitizeEvidenceArtifact(finding)
    record.findings.push(sanitizedFinding)

    // Recalculate health score dynamically
    const critical = record.findings.filter((f) => f.severity === 'CRITICAL' && f.status === 'OPEN').length
    const high = record.findings.filter((f) => f.severity === 'HIGH' && f.status === 'OPEN').length
    const medium = record.findings.filter((f) => f.severity === 'MEDIUM' && f.status === 'OPEN').length
    const low = record.findings.filter((f) => f.severity === 'LOW' && f.status === 'OPEN').length

    record.results.systemHealthScore = Math.max(
      0,
      100 - (30 * critical + 15 * high + 5 * medium + 1 * low)
    )

    if (critical > 0) {
      record.results.commercialReadiness = 'BLOCKED'
    } else if (high > 0 || record.results.systemHealthScore < 90) {
      record.results.commercialReadiness = 'CONDITIONAL'
    } else {
      record.results.commercialReadiness = 'PASS'
    }

    await this.recordExecution(record)
    return true
  }
}

export const evidenceCollector = new PlieEvidenceCollector()
