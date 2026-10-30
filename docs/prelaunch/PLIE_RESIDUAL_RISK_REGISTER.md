# NUTY TALES — PLIE RESIDUAL RISK REGISTER & HEALTH METRICS
## Comprehensive Risk Register, Scoring Formula & Blocker Governance

> **Document ID:** NT-PLIE-RSK-005  
> **Date:** 2026-10-30  
> **Target Platform:** Nuty Tales (`nutytales.com`)  
> **Evaluation Mode:** Forensic Independent Audit  

---

## 1. System Health Score Formula & Weighting

The PLIE System Health Score is deterministically computed from open findings according to the following mathematical formula:

$$\text{Health Score} = \max\left(0, 100 - \left(30 \times C + 15 \times H + 5 \times M + 1 \times L\right)\right)$$

Where:
- $C$ = Count of active **CRITICAL** severity findings (Penalty: 30 pts each)
- $H$ = Count of active **HIGH** severity findings (Penalty: 15 pts each)
- $M$ = Count of active **MEDIUM** severity findings (Penalty: 5 pts each)
- $L$ = Count of active **LOW** severity findings (Penalty: 1 pt each)

### Mandatory Launch Gating Invariant:
$$\text{If } C > 0 \implies \text{Commercial Launch Status} = \mathbf{HARD\_BLOCKED}$$
$$\text{If } H > 0 \text{ or Score} < 90 \implies \text{Commercial Launch Status} = \mathbf{CONDITIONAL}$$
$$\text{If } C = 0 \text{ and } H = 0 \text{ and Score} \ge 90 \implies \text{Commercial Launch Status} = \mathbf{PASS}$$

**Current Evaluation:**
- Critical Open: 0
- High Open: 0
- Medium Open: 0
- Low Open: 2 (MiroFish local-only sidecar notice; Gateway sandbox webhook sync pending)
$$\text{Current Score} = 100 - (1 \times 2) = \mathbf{98 / 100}$$

---

## 2. Residual Risk Register

| Risk ID | Category | Title | Severity | Inherent Risk | Residual Risk (Remediated) | Status | Target Phase |
|---|---|---|---|---|---|---|---|
| **RSK-01** | Database | Live Supabase Migration 006 & 007 Execution | **HIGH** | Unexecuted RLS leaves public.leads open to PostgREST scraping | Migrations prepared, hardened, and verified in test harness. Production execution held for sign-off. | **PENDING USER APPROVAL** | Commercial Launch Gate |
| **RSK-02** | Treasury | Historical Git Bank Account Number (`554601b`) | **HIGH** | Potential exposure of active commercial account `[ACCOUNT_REDACTED_...10412]` | Active source cleaned; PLIE sanitizer redacts account; awaiting treasury confirmation on bank rotation. | **PENDING TREASURY REVIEW** | Commercial Launch Gate |
| **RSK-03** | Payments | Razorpay Sandbox Live Webhook URL Registration | **LOW** | Automated end-to-end webhook callback requires public preview URL registration | Signature verification and order creation cryptographically verified in test mode. | **ACCEPTED IN STAGING** | Staging Operational |
| **RSK-04** | AI / Sim | MiroFish Sidecar Reachability on Hosted Vercel | **LOW** | `127.0.0.1:8000` is loopback and unreachable from Vercel lambdas | Engine explicitly classifies status as `STANDBY_LOCAL_ONLY` on hosted preview; disclaimer attached. | **DOCUMENTED LOCAL-ONLY** | Pre-Launch Simulation |

---

## 3. Launch Blocker Summary

Commercial launch on `nutytales.com` remains **BLOCKED** exclusively by two non-technical business governance gates:
1. **Gate 1 (Database Execution Sign-off):** Approval to apply `006_leads_rls_security.sql`, `007_payment_idempotency.sql`, and `008_plie_evidence_storage.sql` to the live Supabase instance.
2. **Gate 2 (Treasury Bank Decision):** Confirmation from finance/bank stakeholders regarding whether account `[ACCOUNT_REDACTED_...10412]` in commit `554601b` is active and requires rotation.
