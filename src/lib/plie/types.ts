// ─── Nuty Tales Pre-Launch Intelligence Engine (PLIE) — Core Types ────────────
// Framework definitions for autonomous synthetic customer testing, evidence
// collection, findings management, and human approval gating.

export type PlieSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
export type PlieFindingCategory = 'SECURITY' | 'COMMERCE' | 'PAYMENTS' | 'PERFORMANCE' | 'UX'
export type PlieScenarioStatus = 'PASS' | 'FAIL' | 'BLOCKED' | 'PENDING'
export type PlieRunStatus = 'REGISTERED' | 'PREPARED' | 'RUNNING' | 'COLLECTING' | 'EVALUATING' | 'GATED' | 'COMPLETED' | 'FAILED'

export interface PlieEnvironmentConfig {
  targetBaseUrl: string
  gitCommitSha?: string
  branch?: string
  isProduction: boolean
  razorpayTestModeOnly: boolean
}

export interface PlieSyntheticPersona {
  id: string
  name: string
  email: string
  phone: string
  city: string
  state: string
  pincode: string
  device: 'desktop_chrome' | 'mobile_chrome' | 'mobile_safari'
  intent: 'browse' | 'purchase_cod' | 'purchase_razorpay' | 'bulk_rfq' | 'adversary'
  budgetInr: number
}

export interface PlieScenarioStep {
  stepNumber: number
  description: string
  action: string
  expectedOutcome: string
  actualOutcome?: string
  status: 'PASS' | 'FAIL' | 'SKIPPED'
  durationMs: number
  screenshotRef?: string
  networkHarRef?: string
}

export interface PlieScenarioDefinition {
  id: string
  category: PlieFindingCategory
  title: string
  description: string
  personaId: string
  preConditions: string[]
  steps: Array<{
    stepNumber: number
    action: string
    description: string
    expectedOutcome: string
  }>
  riskFocus: string
}

export interface PlieFinding {
  id: string
  executionId: string
  scenarioId?: string
  category: PlieFindingCategory
  severity: PlieSeverity
  title: string
  description: string
  cwe?: string
  owaspCategory?: string
  reproductionSteps: string[]
  evidenceRefs: string[]
  remediationRecommendation: string
  status: 'OPEN' | 'VERIFIED_FIXED' | 'ACCEPTED_RISK'
}

export interface PlieHumanApprovalGate {
  gateId: string
  name: string
  description: string
  required: boolean
  passed: boolean
  approvedBy?: string
  approvedAt?: string
  blockersCount: number
  decisionNotes?: string
}

export interface PlieExecutionRecord {
  executionId: string
  timestamp: string
  environment: PlieEnvironmentConfig
  status: PlieRunStatus
  personasCount: number
  scenariosCount: number
  results: {
    passed: number
    failed: number
    blocked: number
    systemHealthScore: number
    commercialReadiness: 'PASS' | 'CONDITIONAL' | 'BLOCKED'
  }
  findings: PlieFinding[]
  approvalGates: PlieHumanApprovalGate[]
  durationMs: number
}

/**
 * Calculates deterministic PLIE System Health Score (0 - 100)
 */
export function calculateHealthScore(findings: PlieFinding[]): number {
  const activeFindings = findings.filter((f) => f.status === 'OPEN')
  const criticalCount = activeFindings.filter((f) => f.severity === 'CRITICAL').length
  const highCount = activeFindings.filter((f) => f.severity === 'HIGH').length
  const mediumCount = activeFindings.filter((f) => f.severity === 'MEDIUM').length
  const lowCount = activeFindings.filter((f) => f.severity === 'LOW').length

  const score = 100 - (30 * criticalCount + 15 * highCount + 5 * mediumCount + 1 * lowCount)
  return Math.max(0, score)
}

/**
 * Generates an immutable execution ID following standard format
 */
export function generateExecutionId(): string {
  const now = new Date()
  const yyyy = now.getUTCFullYear()
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(now.getUTCDate()).padStart(2, '0')
  const epoch = Math.floor(now.getTime() / 1000)
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PLIE-EXEC-${yyyy}${mm}${dd}-${epoch}-${rand}`
}
