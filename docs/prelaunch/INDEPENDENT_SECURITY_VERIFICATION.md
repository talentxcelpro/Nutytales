# NUTY TALES — INDEPENDENT FORENSIC SECURITY VERIFICATION
## Phase A: Ground-Truth Verification of Task 002 Remediations

> **Audit Standard:** Zero-Trust Verification. No prior status report is accepted as factual proof. Every finding below is substantiated by direct inspection of the live filesystem, git history, compiled bundles, database migrations, and active API routing.  
> **Date:** 2026-10-30  
> **Auditor:** Pre-Launch Intelligence Engine Core  
> **Environment:** `C:\Users\Arshid.Wani\Nutytales`

---

## 1. Executive Summary: Verified State vs. Prior Claims

| Verification Target | Claimed State (Task 002 Report) | Verified Reality (Task 003 Forensic Inspection) | Discrepancy Severity | Status |
|---|---|---|---|---|
| **1. Razorpay Order Creation & HMAC** | Fully server-side with HMAC-SHA256 constant-time comparison | Order creation, HMAC verification, and timingSafeEqual are properly implemented server-side. However, the order idempotency store is an **in-memory Map**, which will not persist across Vercel serverless function invocations or cold starts. | 🟡 Low (Operational/Scaling) | **VERIFIED IMPLEMENTED** (With ephemeral memory caveat) |
| **2. Razorpay Webhook & Deduplication** | Webhook signature checked, duplicate events prevented | Raw body HMAC verification and `x-razorpay-signature` handling are functional. Event deduplication uses an **in-memory Set**, which is reset on serverless instance restarts. Duplicate webhooks arriving at different Vercel lambdas could be double-processed. | 🟠 Medium (Data Integrity) | **VERIFIED IMPLEMENTED** (Requires DB deduplication for production) |
| **3. Bank Account Exposure** | Hardcoded bank details completely removed from application | Details were removed from `src/app/checkout/page.tsx` and the production bundle. **However:**<br>1. Git commit `554601b` permanently stores account `50200088910412` and IFSC `HDFC0001234` in git history.<br>2. Local Turbopack disk cache (`.next/cache/turbopack/.../00000242.sst`) still contains strings from prior builds until purged. | 🔴 High (Git/Artifact Exposure) | **DISCREPANCY DOCUMENTED** (Source clean; git/cache exposed) |
| **4. Admin JWT Signature & Claims** | Cookie presence check replaced with JWT verification | `isValidJwtStructure()` in `src/middleware.ts` and `src/app/admin/layout.tsx` validates token structure (3 base64url segments), expiry (`exp`), and subject (`sub`/`uid`). **However:** Neither verifies the cryptographic signature against Firebase/Google public certificates. A forged JWT with an unverified signature will pass structural checks. | 🔴 High (Authentication Bypass Risk) | **DISCREPANCY DOCUMENTED** (Structural check only; signature unverified) |
| **5. Supabase Service-Role & RLS** | Fails closed when service role key missing | `getSupabaseAdmin()` in `src/lib/supabase.ts` now fails closed and returns `null` if `SUPABASE_SERVICE_ROLE_KEY` is undefined. **However:** The `leads` table (used for order capture) is defined in `prisma/schema.prisma` but has **no RLS policy** in any Supabase migration script (`001`-`005`). | 🟠 High (Database Exposure) | **DISCREPANCY DOCUMENTED** (`leads` table lacks RLS migration) |
| **6. Order Tracking Authorization** | Fabricated mock tracking eliminated; not-found state returned | Mock fallback generator removed. Unknown order IDs return `order-not-found-card`. Client searches purely `localStorage` (`nt_last_order`). **No public GET order lookup API exists**, preventing unauthorized order enumeration via HTTP API. | 🟢 Low (Working as Intended) | **VERIFIED IMPLEMENTED** |

---

## 2. Detailed Technical Findings

### 2.1 Razorpay Server-Side Order Creation & HMAC Verification
- **Code Inspected:** [`src/app/api/razorpay/create-order/route.ts`](file:///c:/Users/Arshid.Wani/Nutytales/src/app/api/razorpay/create-order/route.ts) and [`src/app/api/razorpay/verify/route.ts`](file:///c:/Users/Arshid.Wani/Nutytales/src/app/api/razorpay/verify/route.ts).
- **Verified Facts:**
  - `create-order` enforces positive amount validation (minimum ₹1, checks for valid number) and max 40-character receipt ID.
  - Razorpay Orders API (`https://api.razorpay.com/v1/orders`) is called strictly server-side using HTTP Basic Authentication (`RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET`).
  - Only the public `keyId` and generated `orderId` are returned to the client; `RAZORPAY_KEY_SECRET` never enters client-accessible scope.
  - `verify` computes HMAC-SHA256 across `${razorpay_order_id}|${razorpay_payment_id}` using `crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)`.
  - Signature equality is compared via `crypto.timingSafeEqual` over hex Buffers, mitigating timing side-channel attacks.
- **Discrepancy / Architectural Gap:**
  - Idempotency in `create-order` is managed via `const idempotencyCache = new Map<string, ...>()`. In serverless deployments (Vercel), each cold start or concurrent container instantiates an isolated memory space. Concurrent duplicate requests routed to separate lambdas will create multiple Razorpay orders.
  - *Recommendation:* Move idempotency keys to a Redis store (e.g., Upstash) or Supabase table before high-volume commercial launch.

---

### 2.2 Webhook Signature Verification and Durable Idempotency
- **Code Inspected:** [`src/app/api/razorpay/webhook/route.ts`](file:///c:/Users/Arshid.Wani/Nutytales/src/app/api/razorpay/webhook/route.ts).
- **Verified Facts:**
  - Reads raw request body via `request.text()` prior to parsing, preserving raw byte order for cryptographic HMAC verification.
  - Compares computed HMAC of raw payload against `x-razorpay-signature` header using `crypto.timingSafeEqual`.
  - Rejects missing secrets and invalid signatures with HTTP 500 and 401 respectively.
- **Discrepancy / Architectural Gap:**
  - Deduplication uses `const processedEvents = new Set<string>()`. On Vercel, serverless function instances terminate after execution. An async webhook retried by Razorpay after an instance recycle will not be detected as a duplicate in memory.
  - *Recommendation:* Persist `event_id` in a database table (`webhook_events` with unique constraint on `event_id`) to ensure durable deduplication across multiple serverless execution instances.

---

### 2.3 Bank Account Exposure: Source, Git History & Build Artifacts
- **Inspection Scope:**
  1. Active source tree: `src/**`
  2. Git history: `git log -S "50200088910412"`
  3. Build artifacts: `.next/**`
- **Verified Facts:**
  1. **Active Source:** Clean. Account `50200088910412` and IFSC `HDFC0001234` do not exist anywhere in `src/app/checkout/page.tsx` or any other `.ts`/`.tsx` file in `src/`.
  2. **Git Commit History:** Exposed. Commit `554601b` ("feat: complete luxury brand redesign, B2B wholesale, corporate gifting, stays, cart and checkout engine", authored Oct 6 2026) added lines 268-274 containing:
     ```
     Account Name: Nutty Tales Foods
     Bank: HDFC Bank / ICICI Bank
     Account No: 50200088910412
     IFSC Code: HDFC0001234
     Branch: Sector 62, Noida, NCR
     GSTIN: 09AAECN1234F1Z5
     ```
     Anyone with repository read access (or if the repo was ever cloned or made public) can extract these details using `git show 554601b`.
  3. **Build Artifacts:** Local Turbopack cache file `C:\Users\Arshid.Wani\Nutytales\.next\cache\turbopack\v16.3.8-b0fad0d4\00000242.sst` contains residual cached strings from earlier builds. Running `rm -rf .next` and a clean build purges this local cache.
  4. **Deployment Artifacts:** Any past Vercel deployment built from commits between `554601b` and `Task 002` will contain these details in the published client `.js` chunk for `/checkout`.
- *Required Action:* Confirm with management whether account `50200088910412` is a real corporate bank account. If real, advise treasury to monitor/rotate the account, and run a git history filter (BFG Repo-Cleaner) prior to making the repository public or onboarding external contributors.

---

### 2.4 Admin JWT Signature and Claims Verification
- **Code Inspected:** [`src/middleware.ts`](file:///c:/Users/Arshid.Wani/Nutytales/src/middleware.ts) and [`src/app/admin/layout.tsx`](file:///c:/Users/Arshid.Wani/Nutytales/src/app/admin/layout.tsx).
- **Verified Facts:**
  - `isValidJwtStructure(token)` validates that:
    1. Token has exactly 3 segments separated by `.` (`header.payload.signature`).
    2. Base64 payload decodes to valid JSON.
    3. `payload.exp` is greater than `Date.now() / 1000`.
    4. At least one user identifier (`sub`, `uid`, or `user_id`) is present.
  - This successfully prevents raw cookie presence spoofing (e.g. `nt_uid=admin` or `nt_uid=1`).
- **Discrepancy / Architectural Gap (CRITICAL):**
  - **No Cryptographic Signature Verification in Middleware:** Middleware runs on Next.js Edge runtime and does not call `verifyIdToken()` from Firebase Admin SDK.
  - **No Cryptographic Signature Verification in `admin/layout.tsx`:** The layout decodes the payload with `JSON.parse(Buffer.from(parts[1], 'base64'))` and checks `exp`, but does NOT verify the signature against Google's public keys.
  - **Exploit Vector:** An attacker can generate a JWT using any signing key (or unsigned) with `{ "sub": "admin", "exp": 2524608000 }` and set `nt_uid=<forged_token>`. It passes both the middleware and the admin layout.
  - *Remediation Plan (Phase 1):*
    1. In `src/app/admin/layout.tsx` (Node.js runtime), import `verifyIdToken` from `@/lib/firebase/admin`.
    2. Verify the token cryptographically on every admin render. If verification fails or returns null, redirect to `/login`.

---

### 2.5 Supabase Service-Role Isolation and RLS Policies
- **Code Inspected:** [`src/lib/supabase.ts`](file:///c:/Users/Arshid.Wani/Nutytales/src/lib/supabase.ts), [`prisma/schema.prisma`](file:///c:/Users/Arshid.Wani/Nutytales/prisma/schema.prisma), and `supabase/migrations/*.sql`.
- **Verified Facts:**
  - `getSupabaseAdmin()` no longer falls back to `SUPABASE_ANON_KEY`. If `SUPABASE_SERVICE_ROLE_KEY` is missing, it returns `null` (fail-closed).
  - Migrations `001_firebase_auth_profiles.sql`, `002_weddings_platform_schema.sql`, `003_stays_platform_schema.sql`, `004_seller_central_platform.sql`, and `005_whatsapp_commerce_os.sql` properly execute `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and create role-restricted policies.
- **Discrepancy / Architectural Gap:**
  - The `leads` table (which is where all B2C orders and checkout submissions are inserted via `/api/orders` and `/api/razorpay/verify`) was created via Prisma (`@@map("leads")`), NOT via Supabase SQL migrations.
  - No migration file enables Row Level Security on `public.leads`.
  - If RLS is disabled on `leads` in the Supabase PostgreSQL database, any client holding the public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) could issue a PostgREST query:
    `GET https://qezkjbzmtfjjmqgzgili.supabase.co/rest/v1/leads`
    and read all customer names, phone numbers, delivery addresses, and payment details.
  - *Remediation Plan (Phase 1):* Create migration `006_leads_rls.sql` to explicitly `ENABLE ROW LEVEL SECURITY` on `public.leads` and grant `INSERT` only to anonymous/authenticated users, with `SELECT` restricted exclusively to `service_role`.

---

### 2.6 Order Tracking Authorization & Enumeration Resistance
- **Code Inspected:** [`src/app/orders/track/page.tsx`](file:///c:/Users/Arshid.Wani/Nutytales/src/app/orders/track/page.tsx) and `src/app/api/orders/**`.
- **Verified Facts:**
  - Fabricated mock data ("Valued Customer", "+91 98110XXXXX", "BD-AIR-88910412IN") was verified as completely removed.
  - When an order ID is not present in the user's `localStorage` (`nt_last_order`, `nt_order_history`), the UI displays `data-testid="order-not-found-card"` with guidance to contact WhatsApp support.
  - **No HTTP API Route for Order Enumeration Exists:** There is no `GET /api/orders` or `GET /api/orders/[id]` endpoint. An attacker cannot query the server to scrape or enumerate orders.
- **Discrepancy / Architectural Gap:**
  - Order tracking is 100% device-local. If a customer orders on desktop, they cannot track on mobile. If they clear browser data, tracking is lost.
  - *Recommendation:* When building the server-side order lookup API, require phone OTP or authenticated Firebase user ID match. Never allow unauthenticated lookup by order ID alone.

---

## 3. Discrepancy Action Matrix

| Issue | Risk | Recommended Action | Approved Scope |
|---|---|---|---|
| In-memory Razorpay & webhook idempotency | Duplicate orders / double webhook capture across serverless lambdas | Create `idempotency_keys` and `webhook_events` DB tables | Phase 1 (Needs schema review) |
| Git history contains hardcoded bank details in commit `554601b` | Secret extraction from git history | Run BFG Repo-Cleaner before open-sourcing; verify with bank | Phase 1 (Operational) |
| Admin JWT signature not cryptographically verified | Forged JWT bypasses admin routes | Add `verifyIdToken()` from Firebase Admin into `src/app/admin/layout.tsx` | Phase 1 (Code remediation) |
| `leads` table lacks explicit RLS migration | Potential PostgREST data scraping with public anon key | Add migration `006_leads_rls.sql` | Phase 1 (Schema review) |
| Order tracking is purely localStorage | Customer loses order tracking on device switch or cache clear | Build authenticated `/api/orders/[id]/track` endpoint with OTP | Phase 1 (Feature roadmap) |
