// ─── Nuty Tales PLIE — Unified Evidence Collector ─────────────────────────────
// Aggregates, structures, and persists execution artifacts, logs, and findings.

import { PlieExecutionRecord, PlieFinding } from '../types'

export class PlieEvidenceCollector {
  private inMemoryEvidence: Map<string, PlieExecutionRecord> = new Map()

  /**
   * Records or updates a full execution record
   */
  async recordExecution(record: PlieExecutionRecord): Promise<void> {
    this.inMemoryEvidence.set(record.executionId, record)
  }

  /**
   * Retrieves an execution record by immutable Execution ID
   */
  async getExecution(executionId: string): Promise<PlieExecutionRecord | null> {
    return this.inMemoryEvidence.get(executionId) || null
  }

  /**
   * Lists all recorded executions
   */
  async listExecutions(): Promise<PlieExecutionRecord[]> {
    return Array.from(this.inMemoryEvidence.values())
  }

  /**
   * Appends an identified finding to an active execution record
   */
  async appendFinding(executionId: string, finding: PlieFinding): Promise<boolean> {
    const record = this.inMemoryEvidence.get(executionId)
    if (!record) return false

    record.findings.push(finding)
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

    return true
  }
}

export const evidenceCollector = new PlieEvidenceCollector()
