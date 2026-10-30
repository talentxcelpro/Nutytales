# NUTY TALES — PRE-LAUNCH INTELLIGENCE ENGINE (PLIE)
## Master Architecture & Integration Specification

> **Classification:** Internal Engineering Architecture  
> **Target Platform:** Nuty Tales Commercial Platform (`nutytales.com` & regional subdomains)  
> **Version:** 1.0.0-rc1  
> **Date:** 2026-10-30  

---

## 1. System Overview & Mission

The **Pre-Launch Intelligence Engine (PLIE)** is an autonomous multi-agent verification and simulation platform designed to validate commercial reliability, security posture, customer experience, and resilience of Nuty Tales before public launch.

PLIE coordinates specialized autonomous testing agents (synthetic customers, browser drivers, load generators, and vulnerability scanners) through a centralized state machine with strict environment isolation, cryptographic evidence collection, automated risk scoring, and human approval gates.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PLIE ORCHESTRATION ENGINE                             │
│  ┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────┐  │
│  │ Execution Controller  │──▶│ Scenario Dispatcher   │──▶│ Risk Engine   │  │
│  └───────────────────────┘   └───────────────────────┘   └───────────────┘  │
│              │                           │                       ▲          │
│              ▼                           ▼                       │          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    PLIE AGENT ADAPTER BUS                             │  │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────┐  │  │
│  │  │ Playwright E2E│ │ MiroFish LLM  │ │ k6 Load Test  │ │ OWASP ZAP │  │  │
│  │  │ Browser Agent │ │ Market Sim    │ │ Concurrency   │ │ Security  │  │  │
│  │  └───────────────┘ └───────────────┘ └───────────────┘ └───────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                  │                                          │
│                                  ▼                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    UNIFIED EVIDENCE LAYER                             │  │
│  │  • Execution Records   • Browser Traces   • HTTP HAR Logs  • Scores   │  │
│  │  • Video & Screenshots • Finding Registry • Approval Gate Audit Log   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
             Target: Isolated Vercel Preview / Staging Deployment
                   (Never points at production infrastructure)
```

---

## 2. Core Architectural Principles

1. **Zero-Production Impact:** PLIE strictly operates against dedicated Vercel Preview deployments and isolated test database branches. No automated agent can ever initiate an action against production endpoints.
2. **Deterministic Execution IDs:** Every test battery, run, scenario, step, and evidence artifact is bound to an immutable execution ID:
   `PLIE-EXEC-{YYYYMMDD}-{EPOCH}-{RAND4}` (e.g., `PLIE-EXEC-20261030-1761817200-8F92`).
3. **Agent Isolation & Least Privilege:** Agents have zero access to production service-role keys or payment secrets. Test accounts use scoped test tokens.
4. **Unified Evidence Chain of Custody:** Every finding (bug, security vulnerability, performance bottleneck) must have an immutable evidence trail: HTTP request/response HAR, browser screenshot, trace zip, and reproducible script.
5. **Human Approval Gates (HAGs):** High-risk actions (payment gateway testing, bulk load injection, production release certification) require explicit human sign-off before execution or sign-off.

---

## 3. Central Orchestration Engine

### 3.1 Execution Lifecycle State Machine

Each PLIE run progresses through 7 deterministic phases:

```
[ REGISTERED ] ──▶ [ PREPARED ] ──▶ [ RUNNING ] ──▶ [ COLLECTING ] ──▶ [ EVALUATING ] ──▶ [ GATED ] ──▶ [ CERTIFIED / REJECTED ]
       │                  │              │                 │                  │               │
       ▼                  ▼              ▼                 ▼                  ▼               ▼
(Validate Env)     (Seed Personas)  (Run Steps)     (Capture HAR/Traces) (Risk Score)   (Human Sign-off)
```

1. **REGISTERED:** PLIE validates environment variables (`PLAYWRIGHT_TEST_BASE_URL`, `RAZORPAY_KEY_ID=rzp_test_*`), ensures target is NOT production, checks agent heartbeats.
2. **PREPARED:** Generates synthetic personas, initializes sandbox data (`localStorage` states, mock carts, test credit tokens).
3. **RUNNING:** Dispatches scenarios to registered agent adapters concurrently or sequentially according to scenario dependency graph.
4. **COLLECTING:** Ingests browser traces, screenshots, video recordings, server response codes, latency metrics, and API payloads into the Unified Evidence Layer.
5. **EVALUATING:** Runs deterministic scoring rules against findings; calculates System Health Score (0–100) and Commercial Readiness Index.
6. **GATED:** Evaluates against Human Approval Gates. If Critical/High findings are present, blocks release promotion automatically.
7. **CERTIFIED / REJECTED:** Produces structured audit report and signs execution receipt.

---

## 4. Agent Registration & Execution Lifecycle

### 4.1 Agent Roles & Classification

| Agent Type | Provider / Binary | Role in PLIE | Permissions / Boundary |
|---|---|---|---|
| **Synthetic Shopper** | MiroFish (OASIS Sidecar) | Simulates exploratory human browsing, market choice, cart abandonment, intent drift | Read-only browsing; submits synthetic inquiries via HTTP API; isolated Python host |
| **Browser Driver** | `@playwright/test` | Deterministic E2E customer journey execution, UI assertions, checkout verification | Local browser context; localStorage manipulation; Chromium headless |
| **Concurrency Agent** | `k6` | High-volume simulated checkout, cart contention, flash-sale spikes | Rate-limited against preview endpoint; synthetic mock IPs |
| **Security Agent** | OWASP ZAP (API Scanner) | Dynamic Application Security Testing (DAST), CSRF, injection, header inspection | Scoped to `/api/*` on preview branch; safe scan policies only |

### 4.2 Agent Adapter Interface (TypeScript Contract)

```typescript
export interface PlieAgentAdapter {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly capabilities: Array<'browser' | 'load' | 'security' | 'market_sim'>;

  initialize(config: PlieRunConfig): Promise<void>;
  healthCheck(): Promise<{ ok: boolean; message?: string }>;
  executeScenario(scenario: PlieScenario, context: PlieExecutionContext): Promise<PlieScenarioResult>;
  teardown(): Promise<void>;
}
```

---

## 5. Integration Architecture (Adapters)

### 5.1 MiroFish Adapter (Synthetic Customer Simulation)
- **Architecture Pattern:** HTTP REST Sidecar. MiroFish runs on a dedicated Python service (FastAPI/uvicorn) on an isolated host (e.g. Railway/Render).
- **AGPL-3.0 Compliance Boundary:** MiroFish is **never imported or bundled** into the proprietary Nuty Tales Next.js codebase. It communicates exclusively over standard HTTP JSON APIs.
- **Workflow:**
  1. PLIE sends persona configuration (`{ budget: 1500, intent: "dry-fruits-gifting", familiarity: "first-time" }`) to MiroFish sidecar: `POST /api/v1/simulate-session`.
  2. MiroFish generates decision sequence (e.g. `[visit_home, search_makhana, view_pdp_jumbo, compare_weights, add_to_cart, go_checkout]`).
  3. PLIE translates the sequence into automated Playwright actions or CDP browser commands.
  4. MiroFish observes outcomes and reports behavioral friction points.

### 5.2 Playwright Adapter (Deterministic Browser Journeys)
- **Runner:** Direct `@playwright/test` runner invoked programmatically or via CLI wrapper.
- **Artifacts:**
  - `screenshot: 'only-on-failure'`
  - `video: 'retain-on-failure'`
  - `trace: 'retain-on-failure'` (Playwright Trace Viewer archives `.zip`)
- **Isolation:** Each scenario runs in an isolated `BrowserContext` with dedicated cookie jar, zero shared storage, and deterministic viewport (1280x720).

### 5.3 k6 Adapter (Load & Concurrency Simulation)
- **Scope:** Simulates concurrent buyers adding the same SKU to cart, concurrent checkout submissions to `/api/orders`, and simultaneous calls to `/api/razorpay/create-order`.
- **Target:** Staging/preview environments with synthetic load rate of 5–50 Virtual Users (VU), validating that database connection pools and rate limiters hold.
- **Output:** Latency p95, p99, HTTP 429 rate limit adherence, and failure rate.

### 5.4 OWASP ZAP Adapter (Automated Security Testing)
- **Scope:** Automated active and passive scanning of public storefront endpoints and protected `/api/*` routes.
- **Rules:**
  - Verifies presence of security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`).
  - Tests for injection vulnerabilities in checkout form inputs and query parameters (`?id=`, `?search=`).
  - Verifies that unauthenticated callers cannot reach protected admin or seller endpoints.

---

## 6. Unified Evidence Layer

Evidence is structured into a unified document model stored locally in `.data/plie-evidence/` and indexable in PostgreSQL:

```typescript
export interface PlieEvidenceRecord {
  executionId: string;           // PLIE-EXEC-20261030-1761817200-8F92
  timestamp: string;             // ISO-8601
  environment: {
    targetUrl: string;           // https://nutytales-git-preview-...vercel.app
    gitCommit: string;           // Commit SHA tested
    branch: string;              // staging / main / preview branch
    nodeVersion: string;
  };
  summary: {
    scenariosTotal: number;
    scenariosPassed: number;
    scenariosFailed: number;
    findingsCount: { critical: number; high: number; medium: number; low: number };
    systemHealthScore: number;   // 0 - 100
    commercialReadiness: 'PASS' | 'CONDITIONAL' | 'BLOCKED';
  };
  scenarios: Array<{
    scenarioId: string;
    personaId: string;
    status: 'PASS' | 'FAIL' | 'BLOCKED';
    durationMs: number;
    steps: Array<{
      stepNumber: number;
      action: string;
      status: 'PASS' | 'FAIL';
      durationMs: number;
      evidencePath?: string;
    }>;
    artifacts: {
      screenshots: string[];
      videoPath?: string;
      traceZipPath?: string;
      harLogPath?: string;
    };
  }>;
  findings: Array<{
    findingId: string;
    cwe?: string;
    owaspCategory?: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    reproductionSteps: string[];
    evidenceRefs: string[];
    remediationRecommendation: string;
  }>;
  approvalGates: Array<{
    gateName: string;
    required: boolean;
    approved: boolean;
    approver?: string;
    approvedAt?: string;
    notes?: string;
  }>;
}
```

---

## 7. Findings Classification & Risk Scoring

### 7.1 Severity Matrix

| Severity | Criteria | Impact on Launch |
|---|---|---|
| **CRITICAL** | Revenue loss (unpaid order confirmation), authentication bypass, hardcoded credentials, customer PII exposure, data tampering | **HARD LAUNCH BLOCKER** (Zero tolerance) |
| **HIGH** | Missing RLS policies, duplicate order processing, order enumeration, silent lead drop, key customer journey failure | **SOFT BLOCKER** (Requires explicit C-level sign-off) |
| **MEDIUM** | Missing SEO metadata, sub-optimal mobile layout, lack of CSRF tokens on non-critical endpoints, UI latency > 3.0s | **NON-BLOCKING** (Fix within Phase 1 sprint) |
| **LOW** | Minor console warnings, missing icons, copy formatting discrepancies | **TRACKED AS TECH DEBT** |

### 7.2 System Health Score Formula

$$\text{HealthScore} = \max\left(0, 100 - (30 \times C + 15 \times H + 5 \times M + 1 \times L)\right)$$

Where:
- $C$ = Number of unmitigated CRITICAL findings
- $H$ = Number of unmitigated HIGH findings
- $M$ = Number of unmitigated MEDIUM findings
- $L$ = Number of unmitigated LOW findings

**Commercial Launch Threshold:**
- Health Score $\ge 90$
- $C = 0$
- $H \le 1$ (with signed mitigation plan)
- All 5 Core Human Approval Gates passed

---

## 8. Human Approval Gates (HAGs)

PLIE enforces five mandatory human checkpoints:

1. **HAG-01: Environment Safety Certification:** Confirms that the target is an isolated preview deployment and no production database or payment keys are reachable.
2. **HAG-02: Payment Sandbox Clearance:** Authorizes execution of simulated transactions against Razorpay `rzp_test_*` credentials.
3. **HAG-03: Security Exception Sign-off:** Evaluates any open High or Medium security findings before proceeding to load tests.
4. **HAG-04: Load Testing Authorization:** Approves execution of concurrency tests to prevent unexpected third-party API throttling.
5. **HAG-05: Final Pre-Launch Sign-off:** Formal stakeholder sign-off certifying that all 20 customer journeys passed and findings are resolved.
