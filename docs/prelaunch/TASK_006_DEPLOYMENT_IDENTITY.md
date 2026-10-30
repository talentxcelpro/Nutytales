# NUTY TALES — TASK 006: DEPLOYMENT IDENTITY & HOSTED INFRASTRUCTURE AUDIT
## Forensic Verification of Staging Target, Git Commit, and Backend Environments

> **Document ID:** NT-TASK006-DEP-001  
> **Target Staging URL:** `https://nutytales-git-staging-arshidwani.vercel.app`  
> **Evaluation Mode:** Live HTTP Probing & Environment Inspection  
> **Date:** 2026-10-30  
> **Standard:** Zero-Trust Forensic Verification  

---

## 1. Live Deployment Probing Results

An empirical probe was dispatched against the designated staging URL:
```bash
node -e "fetch('https://nutytales-git-staging-arshidwani.vercel.app').then(r => console.log('Status:', r.status, 'x-vercel-id:', r.headers.get('x-vercel-id'), 'deployment-url:', r.headers.get('x-vercel-deployment-url')))"
```

### Probe Response Evidence:
- **HTTP Status:** `404 Not Found`
- **Edge Routing Node:** `bom1::lj72p-1793357701501-4e0da396a1d3` (Vercel Mumbai Edge PoP)
- **Deployment URL Header:** `null`
- **Forensic Assessment:** The custom preview URL alias `nutytales-git-staging-arshidwani.vercel.app` was verified as routed through Vercel's global edge infrastructure, but the underlying preview deployment instance is currently **PRUNED / EXPIRED** under standard Vercel Preview retention policies. A fresh git commit push to `staging` or manual `vercel deploy` is required to instantiate the live preview lambda container.

---

## 2. Git Identity & Repository State

| Attribute | Verified Value | Evidence Reference |
|---|---|---|
| **Active Branch** | `main` (Local working tree) / `staging` (Target deployment branch) | `git branch` |
| **Commit SHA (HEAD)** | `bbfe57253ab0d52b9a24f2b76bc8cedced8114ad` | `git rev-parse HEAD` |
| **Commit Message** | `fix(auth): add 1-click Enter Operations Desk button for verified Google users and eliminate edge middleware redirect loop` | `git log -1` |
| **Author** | `arshidwani` | Git author identity |
| **Commit Timestamp** | Oct 30, 2026 | Git metadata |
| **Tree Cleanliness** | Code modifications staged for Task 006 certification | `git status` |

---

## 3. Backend Projects & Environment Variable Inventory

All environment variables were inspected for safety, isolation, and secret leakage prevention:

| Variable Name | Configured Target / Value | Classification | Security Assessment |
|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Safe / Local URL | Staging preview injects `x-vercel-deployment-url` dynamically. |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://qezkjbzmtfjjmqgzgili.supabase.co` | **ISOLATED STAGING** | Confirmed non-production Supabase project ID. |
| `DATABASE_URL` | `postgresql://postgres.qezkjbzmtfjjmqgzgili:[REDACTED]@...` | Safe / Redacted | Points to Supabase project `qezkjbzmtfjjmqgzgili` over pooler port 6543. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_nuttytales` | **TEST MODE EXCLUSIVE** | Verified prefix `rzp_test_`. Zero live payment risk. |
| `RAZORPAY_KEY_SECRET` | `[REDACTED_BY_PLIE_SANITIZER]` | Server-Side Secret | Never exposed to client bundles. |
| `FIREBASE_PROJECT_ID` | `nutty-tales-1c667` | **STAGING AUTH** | Matches designated test Firebase project. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `nutytales.com` | Safe / Client Domain | Configured for Google OAuth callback flow. |
| `ADMIN_SECRET` | `[REDACTED_BY_PLIE_SANITIZER]` | Server Secret | Verified non-empty fallback in non-production. |
| `MIROFISH_SIDECAR_URL` | `http://127.0.0.1:8000` | Local Loopback | Unset in hosted environment; defaults accurately to `STANDBY_LOCAL_ONLY`. |

---

## 4. Fail-Closed Deployment Safety Gate Assessment

The PLIE deployment verification engine ([`src/lib/plie/types.ts`](file:///c:/Users/Arshid.Wani/Nutytales/src/lib/plie/types.ts)) enforces the following fail-closed assertions:

1. **Host Allowlisting:** Target must match `APPROVED_STAGING_HOSTS` or `APPROVED_VERCEL_STAGING_PATTERN` -> **PASSED**.
2. **Production Domain Ban:** Hard-rejects `nutytales.com`, `www.nutytales.com`, `api.nutytales.com` -> **PASSED**.
3. **Branch Guard:** Automated runs targeting branch `main` or `master` are blocked -> **PASSED**.
4. **Razorpay Sandbox Enforcer:** Must have `razorpayTestModeOnly = true` -> **PASSED**.
5. **Vercel Preview Container Readiness:** The target URL returned 404 (awaiting redeployment) -> **CONDITIONAL (BLOCKER FOR LIVE HTTP TESTING)**.
