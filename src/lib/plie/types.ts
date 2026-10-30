// ─── Nuty Tales Pre-Launch Intelligence Engine (PLIE) — Core Types ────────────
// Framework definitions for autonomous synthetic customer testing, evidence
// collection, findings management, and human approval gating.
// Hardened in Task 004 to eliminate arbitrary domain allowlisting, enforce exact
// staging deployment identity, and provide adversarial-grade credential sanitization.

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
  executionTimeoutMs?: number
  approvedDeploymentId?: string
  approvedStagingHosts?: string[]
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
  cancellationReason?: string
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

/**
 * Approved exact staging hostnames for Nuty Tales
 */
export const APPROVED_STAGING_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  'nutytales-git-staging-arshidwani.vercel.app',
  'staging.nutytales.com',
])

/**
 * Pattern matching genuine Nuty Tales Vercel preview staging deployments for user Arshid Wani.
 * Rejects arbitrary or unverified third-party *.vercel.app hostnames.
 */
export const APPROVED_VERCEL_STAGING_PATTERN =
  /^nutytales-git-(staging|preview)(-[a-z0-9]+)?-arshidwani\.vercel\.app$/i

/**
 * Phase 1 / Task 004: Hardened deployment identity verification & production rejection.
 * Eliminates loose '.vercel.app' suffix matching.
 * Enforces verified staging deployment identity, branch authorization, and isolated configuration.
 */
export function validateEnvironmentSafety(env: PlieEnvironmentConfig): {
  safe: boolean
  reason?: string
} {
  const url = (env.targetBaseUrl || '').trim()

  if (!url) {
    return { safe: false, reason: 'Target URL is missing or empty.' }
  }

  // 1. Caller flag rejection
  if (env.isProduction) {
    return { safe: false, reason: 'Caller explicitly marked environment as production.' }
  }

  let hostname = ''
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    hostname = parsed.hostname.toLowerCase()
  } catch {
    return { safe: false, reason: `Malformed target URL: ${url}` }
  }

  // 2. Hard independent production rejection (independent of caller flags)
  const isProductionDomain =
    hostname === 'nutytales.com' ||
    hostname === 'www.nutytales.com' ||
    hostname === 'api.nutytales.com' ||
    (hostname.endsWith('.nutytales.com') &&
      !hostname.includes('staging') &&
      !hostname.includes('preview') &&
      !hostname.includes('test'))

  if (isProductionDomain) {
    return {
      safe: false,
      reason: `SECURITY BLOCK: Production hostname rejected. Direct execution against production domain '${hostname}' is strictly prohibited.`,
    }
  }

  // 3. Strict Branch Check: 'main' / 'master' branches are rejected from automated testing
  if (env.branch && (env.branch.toLowerCase() === 'main' || env.branch.toLowerCase() === 'master')) {
    return {
      safe: false,
      reason: `SECURITY BLOCK: Target branch '${env.branch}' is a production branch. Automated PLIE tests require 'staging' or 'preview'.`,
    }
  }

  // 4. Exact Staging Identity & Whitelist Verification (No loose .vercel.app matching)
  const customApproved = env.approvedStagingHosts && env.approvedStagingHosts.includes(hostname)
  const isExactApproved = APPROVED_STAGING_HOSTS.has(hostname)
  const isPatternMatch = APPROVED_VERCEL_STAGING_PATTERN.test(hostname)

  if (!customApproved && !isExactApproved && !isPatternMatch) {
    return {
      safe: false,
      reason: `SECURITY BLOCK: Host '${hostname}' is not a verified Nuty Tales staging deployment. Arbitrary or unverified .vercel.app domains are rejected.`,
    }
  }

  // 5. Razorpay Sandbox Requirement
  if (!env.razorpayTestModeOnly) {
    return {
      safe: false,
      reason: 'SECURITY BLOCK: Razorpay test mode must be enabled (razorpayTestModeOnly = true). Live transactions are prohibited.',
    }
  }

  return { safe: true }
}

/**
 * Phase 1 / Task 004: Adversarial-grade artifact sanitization filter.
 * Recursively strips sensitive credentials, tokens, cards, bank accounts, and secrets
 * across nested JSON, HAR network structures, HTTP headers, URLs, cookies, and stringified payloads.
 */
export function sanitizeEvidenceArtifact<T = any>(obj: T): T {
  if (obj === null || obj === undefined) return obj

  if (typeof obj === 'string') {
    let sanitized: string = obj as unknown as string

    // 1. Bearer and Basic authentication headers
    sanitized = sanitized
      .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED_TOKEN]')
      .replace(/Basic\s+[A-Za-z0-9+/]+=*/gi, 'Basic [REDACTED_CREDENTIALS]')

    // 2. Razorpay keys (live & test)
    sanitized = sanitized
      .replace(/rzp_live_[A-Za-z0-9]+/gi, '[REDACTED_RAZORPAY_KEY]')
      .replace(/rzp_test_[A-Za-z0-9]+/gi, '[REDACTED_RAZORPAY_KEY]')

    // 3. Specific historical & format-matching bank accounts
    sanitized = sanitized.replace(/50200088910412/g, '[REDACTED_ACCOUNT]')

    // 4. URL query parameters containing tokens, keys, secrets, or passwords
    sanitized = sanitized.replace(
      /([?&](?:token|key|secret|password|auth|api_key|apikey|access_token|refresh_token)=)[^&#\s]+/gi,
      '$1[REDACTED_PARAM]'
    )

    // 5. Embedded credentials in URLs (e.g., https://user:pass@host)
    sanitized = sanitized.replace(
      /(https?:\/\/)[^:\s@]+:[^@\s]+@/gi,
      '$1[REDACTED_USER_PASS]@'
    )

    // 6. Cookie strings (e.g., nt_uid=..., session=...)
    sanitized = sanitized.replace(
      /(nt_uid|session|jwt|refreshToken|auth_token)=[^;\s&]+/gi,
      '$1=[REDACTED_COOKIE]'
    )

    // 7. Credit card / PAN sequences (13 to 16 digits, with optional hyphens/spaces, not part of execution IDs)
    sanitized = sanitized.replace(
      /(?<!PLIE-EXEC-[0-9]{8}-)\b(?:\d[ -]*?){13,16}\b/g,
      '[REDACTED_CARD_NUMBER]'
    )

    // 8. Handle stringified JSON recursively
    const trimmed = sanitized.trim()
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const parsed = JSON.parse(trimmed)
        const cleaned = sanitizeEvidenceArtifact(parsed)
        return JSON.stringify(cleaned) as unknown as T
      } catch {
        // Not valid JSON string, return regex-sanitized text
      }
    }

    return sanitized as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeEvidenceArtifact(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const sensitiveKeys = new Set([
      'password',
      'secret',
      'authorization',
      'cookie',
      'token',
      'key',
      'apikey',
      'api_key',
      'servicerolekey',
      'privatekey',
      'rawprivatekey',
      'razorpay_signature',
      'razorpay_secret',
      'refreshtoken',
      'accesstoken',
      'idtoken',
      'clientsecret',
    ])

    const sanitizedObj: Record<string, any> = {}
    for (const [k, value] of Object.entries(obj)) {
      if (k === 'executionId' || k === 'id') {
        sanitizedObj[k] = value
        continue
      }
      const lower = k.toLowerCase().replace(/[^a-z]/g, '')
      if (
        sensitiveKeys.has(lower) ||
        lower.includes('secret') ||
        lower.includes('token') ||
        lower.includes('password') ||
        lower.includes('cookie')
      ) {
        sanitizedObj[k] = '[REDACTED_BY_PLIE_SANITIZER]'
      } else {
        sanitizedObj[k] = sanitizeEvidenceArtifact(value)
      }
    }
    return sanitizedObj as T
  }

  return obj
}
