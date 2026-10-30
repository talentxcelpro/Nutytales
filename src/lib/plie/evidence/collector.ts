// ─── Nuty Tales PLIE — Unified Evidence Collector ─────────────────────────────
// Aggregates, structures, and persists execution artifacts, logs, and findings.
// Automatically sanitizes credentials and persists execution records durably to disk.

import fs from 'fs'
import path from 'path'
import {
  PlieExecutionRecord,
  PlieFinding,
  sanitizeEvidenceArtifact,
} from '../types'

const EVIDENCE_DIR = path.resolve(process.cwd(), '.data', 'plie-evidence', 'runs')

function ensureDir() {
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true })
  }
}

export class PlieEvidenceCollector {
  private inMemoryEvidence: Map<string, PlieExecutionRecord> = new Map()

  /**
   * Records or updates a full execution record with sanitization & disk persistence
   */
  async recordExecution(record: PlieExecutionRecord): Promise<void> {
    const sanitized = sanitizeEvidenceArtifact(record)
    this.inMemoryEvidence.set(sanitized.executionId, sanitized)

    try {
      ensureDir()
      const filePath = path.join(EVIDENCE_DIR, `${sanitized.executionId}.json`)
      fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2), 'utf8')
    } catch (err) {
      console.warn('[PLIE Evidence] Disk write warning (in-memory preserved):', err)
    }
  }

  /**
   * Retrieves an execution record by immutable Execution ID (from memory or disk)
   */
  async getExecution(executionId: string): Promise<PlieExecutionRecord | null> {
    const memory = this.inMemoryEvidence.get(executionId)
    if (memory) return memory

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
    } else if (high > 0) {
      record.results.commercialReadiness = 'CONDITIONAL'
    } else {
      record.results.commercialReadiness = 'PASS'
    }

    await this.recordExecution(record)
    return true
  }
}

export const evidenceCollector = new PlieEvidenceCollector()
