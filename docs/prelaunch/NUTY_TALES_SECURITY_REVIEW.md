# NUTY TALES — SECURITY REVIEW
## Pre-Launch Security Audit

> **Audit Status:** Inspection-only. No exploits were attempted. All findings are based on static code analysis.  
> **Classification:** Internal — do not publish or commit to public repositories.  
> **Date:** 2025-10  
> **Scope:** `src/` codebase, Prisma schema, Supabase migrations, `.env.example`, middleware

---

## Executive Summary

Three **CRITICAL** pre-launch blockers were identified that represent direct revenue risk, customer data risk, or reputational risk. These must be resolved before any public launch.

| Severity | Count | Must fix before launch? |
|---|---|---|
| 🔴 CRITICAL | 5 | YES |
| 🟠 HIGH | 4 | Strongly recommended |
| 🟡 MEDIUM | 5 | Should fix in Phase 1 |
| 🔵 INFORMATIONAL | 4 | Track as tech debt |

---

## CRITICAL Findings

### SEC-001 — Payment Gateway Not Implemented
**Severity:** 🔴 CRITICAL  
**File:** `src/app/checkout/page.tsx`, `src/app/api/orders/route.ts`  
**Status:** VERIFIED

**Finding:**  
The checkout UI presents Razorpay as a payment option. The Razorpay SDK is listed in `package.json`. However, the `/api/orders` route handler (76 lines, fully read) inserts a record into the Supabase `leads` table and returns a success response **without**:
- Creating a Razorpay order (`orders.create()`)
- Opening the Razorpay checkout modal server-side
- Verifying a `razorpay_signature` HMAC
- Confirming payment status before recording the order

**Risk:**  
A customer can complete "checkout" and receive an order confirmation without any payment being taken. This is a direct revenue loss risk if the site goes live.

**Remediation:**  
1. Implement `/api/razorpay/create-order` (POST) → calls `razorpay.orders.create({ amount, currency, receipt })`
2. On client: open Razorpay modal with returned `order_id`
3. On payment success: POST `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }` to `/api/razorpay/verify`
4. Verify HMAC: `crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(order_id + '|' + payment_id).digest('hex')`
5. Only create the confirmed order record after verification passes
6. Implement webhook handler at `/api/razorpay/webhook` for async payment events

---

### SEC-002 — Hardcoded Bank Account Details in Client Source
**Severity:** 🔴 CRITICAL  
**File:** `src/app/checkout/page.tsx` lines ~270–276  
**Status:** VERIFIED

**Finding:**  
Bank transfer payment details are hardcoded directly in the React component source code:
- Account number: `50200088910412`
- IFSC code: `HDFC0001234`

These values are:
1. Shipped in the client JavaScript bundle (visible to all users via DevTools)
2. Committed to the repository (visible to all contributors and in git history)

**Risk:**  
- Social engineering / phishing: malicious actors can clone the site and present the same bank details to deceive customers
- Account number exposure: even partial account numbers can be used in fraud
- IFSC `HDFC0001234` appears to be a test/placeholder value (real HDFC IFSCs follow `HDFC0` + 6-digit branch code)

**Remediation:**  
1. Remove hardcoded values from source immediately
2. Move to environment variable: `NEXT_PUBLIC_BANK_ACCOUNT_DISPLAY` (for display) fetched server-side
3. Better: serve via authenticated API endpoint so only logged-in users see payment details
4. Rotate account number if real; confirm with bank whether `HDFC0001234` is a real IFSC before launch
5. Purge from git history: `git filter-repo` or BFG Repo Cleaner

---

### SEC-003 — Mock Order Tracking Returns Fabricated Data
**Severity:** 🔴 CRITICAL  
**File:** `src/app/orders/track/page.tsx` (374 lines, fully read)  
**Status:** VERIFIED

**Finding:**  
The order tracking page (`/orders/track`) accepts an `orderId` query parameter. For order IDs not found in the database, it falls back to displaying fabricated tracking data:
- Mock customer name and address
- Hardcoded AWB number `BD-AIR-88910412IN`
- Status: "In Transit"
- Carrier: Blue Dart (implied by AWB prefix)

**Risk:**  
1. **Customer confusion:** A real customer entering their real order ID receives fake "In Transit" status, causing support burden
2. **Spoofing / phishing:** Anyone can share a URL like `/orders/track?orderId=ANYTHING` and it will display a convincing (fake) "delivered" or "in transit" page
3. **Regulatory:** Displaying fabricated logistics information to customers may constitute consumer fraud in India under the Consumer Protection Act 2019

**Remediation:**  
1. Remove all mock fallback data from the tracking page
2. Return a clear "Order not found" state for unknown IDs
3. Integrate a real shipping API (Shiprocket, Delhivery, or direct Blue Dart) for actual AWB tracking
4. Scope order lookup to the authenticated user's orders only (prevent enumeration)

---

### SEC-004 — Predictable `ADMIN_SECRET` Default Value
**Severity:** 🔴 CRITICAL  
**File:** `.env.example`  
**Status:** VERIFIED

**Finding:**  
`.env.example` contains:
```
ADMIN_SECRET=nuttytales_admin_super_secret_2026
```
If the production `.env` was bootstrapped from `.env.example` without changing this value, any attacker who reads the public `.env.example` (or this repository) can use this secret to authenticate as admin.

**Risk:**  
Depends on how `ADMIN_SECRET` is consumed. If it gates the admin panel or privileged API routes, this is a complete admin access bypass.

**Remediation:**  
1. Generate a cryptographically random secret: `openssl rand -base64 48`
2. Set the generated value in Vercel environment variables (Production environment only)
3. Do NOT store the actual value in `.env.example` — use a placeholder: `ADMIN_SECRET=<generate-with-openssl-rand-base64-48>`
4. Audit all usages of `process.env.ADMIN_SECRET` in code to understand the blast radius

---

### SEC-005 — Admin Middleware Checks Cookie Presence Only (No JWT Verification)
**Severity:** 🔴 CRITICAL  
**File:** `src/middleware.ts`  
**Status:** VERIFIED

**Finding:**  
Routes under `/admin/*` are protected by checking whether the `nt_uid` cookie is present and non-empty. The middleware does **not**:
- Verify the cookie value as a Firebase ID token (JWT signature check)
- Check token expiry
- Verify token was issued by the correct Firebase project

Any attacker who can set a browser cookie named `nt_uid` to any non-empty string can access the admin panel.

**Risk:**  
- XSS on any page can set `document.cookie = 'nt_uid=attacker'` to grant admin access
- A subdomain cookie injection (if any subdomain is misconfigured) can plant the cookie
- Admin panel access without authentication

**Remediation:**  
```typescript
// In middleware.ts, replace presence check with Firebase Admin SDK verification:
import { getAuth } from 'firebase-admin/auth';

const token = request.cookies.get('nt_uid')?.value;
if (!token) return NextResponse.redirect('/login');

try {
  await getAuth().verifyIdToken(token);
} catch {
  return NextResponse.redirect('/login');
}
```
Firebase Admin SDK can run in Next.js middleware (Edge Runtime compatible via `firebase-admin/app` with `initializeApp`).  
Alternatively, use NextAuth for admin sessions with a proper JWT secret.

---

## HIGH Findings

### SEC-006 — `getSupabaseAdmin()` Falls Back to Anon Key
**Severity:** 🟠 HIGH  
**File:** `src/lib/supabase.ts`  
**Status:** VERIFIED

**Finding:**  
`getSupabaseAdmin()` creates a Supabase client with `SUPABASE_SERVICE_ROLE_KEY`. If that variable is not set, it silently falls back to the public anon key. Any code path that calls `getSupabaseAdmin()` expecting service-role permissions will instead operate with anon-level permissions, potentially bypassing RLS policies that expect service-role context.

**Risk:**  
- In environments where `SUPABASE_SERVICE_ROLE_KEY` is not set (e.g., staging, local dev), service-role operations silently degrade
- If RLS policies on sensitive tables rely on service-role bypass, data that should be protected may be exposed or writes that should be blocked may succeed

**Remediation:**  
```typescript
function getSupabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set — refusing to create admin client');
  return createClient(supabaseUrl, key);
}
```

---

### SEC-007 — `wedding_hampers` Table Missing from Database Migrations
**Severity:** 🟠 HIGH  
**File:** `src/lib/supabase.ts` → `insertWeddingHamper()`  
**Status:** VERIFIED

**Finding:**  
`insertWeddingHamper()` inserts into a `wedding_hampers` table. Inspection of all Supabase migrations (001, 002, 003, 004) confirmed this table is **not created in any migration file**.

The function wraps the insert in a try/catch and, on error, returns `{ success: true, mode: 'local-fallback' }`. This means:
1. Wedding hamper enquiries submitted by customers are **silently discarded**
2. The customer receives a success confirmation
3. No lead is recorded in the database

**Risk:**  
- Lost customer enquiries → lost revenue
- False confirmation to customer (consumer protection risk)
- Silent failure is masked as success

**Remediation:**  
1. Add migration `005_wedding_hampers.sql` to create the table
2. Remove the `local-fallback` silent swallow — surface the error properly
3. Add monitoring/alerting on failed inserts

---

### SEC-008 — No Idempotency on Order Creation
**Severity:** 🟠 HIGH  
**File:** `src/app/api/orders/route.ts`  
**Status:** VERIFIED

**Finding:**  
POST to `/api/orders` inserts a new record in `leads` on every call. There is no idempotency key, duplicate check, or request deduplication. Network retry (double-tap, browser back+submit) creates duplicate order records.

**Risk:**  
- Duplicate orders → duplicate fulfillment → lost inventory/money
- Customer support burden

**Remediation:**  
1. Generate a client-side idempotency key (UUID) when the cart is locked for checkout
2. Send it as `X-Idempotency-Key` header or in the request body
3. Server checks for existing record with that key before inserting

---

### SEC-009 — Seller Portal File-Based Persistence on Serverless Infrastructure
**Severity:** 🟠 HIGH  
**File:** `src/app/api/seller/**` — data stored in `.data/seller-central/`  
**Status:** VERIFIED (via `SELLER_PORTAL_IMPLEMENTATION_STATUS.md`)

**Finding:**  
The seller portal persists all seller data (registrations, products, orders, analytics) as JSON files in `.data/seller-central/`. Vercel serverless functions:
1. Have an **ephemeral filesystem** — files written in one function invocation are not visible to another
2. Scale horizontally — multiple instances will each have their own `.data/` state

**Risk:**  
- Seller data loss: any data written to `.data/` may not persist between deployments or across instances
- Race conditions: concurrent writes to the same JSON file

**Remediation:**  
Migrate seller portal persistence to Supabase (or Prisma → Supabase) before enabling the seller portal for real sellers.

---

## MEDIUM Findings

### SEC-010 — Cart Stored in `localStorage` (XSS Accessible)
**Severity:** 🟡 MEDIUM  
**File:** `src/app/cart/page.tsx`

Cart contents (`nt_cart`) stored in `localStorage` are accessible to any JavaScript running on the page. An XSS vulnerability in any component could read, modify, or empty a user's cart.

**Remediation:** For logged-in users, consider server-side cart storage. For guest users, `localStorage` is acceptable but monitor for XSS vectors.

---

### SEC-011 — COD Orders: No Pin Code Serviceability Validation
**Severity:** 🟡 MEDIUM  
**File:** `src/app/checkout/page.tsx`

Cash-on-delivery orders accept any 6-digit pin code without validating against a serviceability database or shipping partner API. COD orders placed to unserviceable areas cannot be fulfilled.

**Remediation:** Integrate Shiprocket or Delhivery pin code serviceability API before enabling COD.

---

### SEC-012 — No CSRF Protection on Mutation API Routes
**Severity:** 🟡 MEDIUM  
**File:** `src/app/api/**`

Next.js App Router does not add CSRF tokens by default. POST routes (`/api/orders`, `/api/seller/*`) accept cross-origin form submissions. While `SameSite=Lax` cookies mitigate most CSRF, the `/api/orders` route is stateless (no cookie required) and can be called from any origin.

**Remediation:** Add `Origin` header validation or use a CSRF token for state-changing API routes.

---

### SEC-013 — Firebase Project ID Exposed in `next.config.ts`
**Severity:** 🟡 MEDIUM (Low risk, informational)  
**File:** `next.config.ts`

Firebase project ID `nutty-tales-1c667` is visible in the rewrite configuration. Firebase project IDs are considered public (they appear in client-side Firebase config anyway), but exposure in server configuration is worth noting.

**Risk:** Low. Project IDs alone do not grant access. Firebase security rules and RLS policies are the actual gatekeepers.

---

### SEC-014 — NextAuth Secret Strength Unknown
**Severity:** 🟡 MEDIUM  
**File:** `.env.example` → `NEXTAUTH_SECRET`

`.env.example` shows `NEXTAUTH_SECRET=` (empty). If production uses a weak or empty secret, NextAuth JWT tokens can be forged.

**Remediation:** Generate with `openssl rand -base64 32` and set in Vercel Production environment variables.

---

## INFORMATIONAL Findings

### SEC-015 — Git History May Contain Secrets
**Severity:** 🔵 INFORMATIONAL

If secrets (Razorpay keys, Supabase service role key, bank account numbers) were ever committed in plain text and then removed, they remain in git history.

**Remediation:** Run `git log --all --full-history -- .env` and `git secrets --scan-history` to audit. Use BFG Repo Cleaner to purge if found.

---

### SEC-016 — `NEXT_PUBLIC_*` Variables Are Bundled Client-Side
**Severity:** 🔵 INFORMATIONAL  
**File:** `.env.example`

Variables prefixed `NEXT_PUBLIC_` are embedded in the client bundle and visible to all users. Current `NEXT_PUBLIC_*` variables:
- `NEXT_PUBLIC_SUPABASE_URL` — acceptable (Supabase anon key is public by design)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — acceptable (Supabase anon key is public by design)
- `NEXT_PUBLIC_FIREBASE_*` — acceptable (Firebase config is public by design)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — acceptable (Razorpay public key is designed to be client-side)

No server-only secrets were found in `NEXT_PUBLIC_` variables. ✅

---

### SEC-017 — Hardcoded AWB Number in Order Tracking
**Severity:** 🔵 INFORMATIONAL  
**File:** `src/app/orders/track/page.tsx`

Hardcoded AWB `BD-AIR-88910412IN` is a Blue Dart format. If someone queries this on the Blue Dart website, they may find an unrelated real shipment or no result, both of which are confusing.

See SEC-003 for primary finding and remediation.

---

### SEC-018 — No Rate Limiting on Public API Routes
**Severity:** 🔵 INFORMATIONAL  
**File:** `src/app/api/orders/route.ts`, `src/app/api/seller/register/route.ts`

No rate limiting is applied to public POST endpoints. Automated bots can spam order creation or seller registration.

**Remediation (Phase 2):** Add Vercel Edge rate limiting or an `upstash/ratelimit` middleware.

---

## Remediation Priority Matrix

| ID | Finding | Severity | Effort | Launch Blocker? |
|---|---|---|---|---|
| SEC-001 | Razorpay not implemented | 🔴 CRITICAL | High | YES |
| SEC-002 | Hardcoded bank account in source | 🔴 CRITICAL | Low | YES |
| SEC-003 | Mock order tracking | 🔴 CRITICAL | Medium | YES |
| SEC-004 | Predictable ADMIN_SECRET | 🔴 CRITICAL | Low | YES |
| SEC-005 | Admin middleware no JWT verify | 🔴 CRITICAL | Medium | YES |
| SEC-006 | Supabase admin anon fallback | 🟠 HIGH | Low | Strongly recommended |
| SEC-007 | wedding_hampers table missing | 🟠 HIGH | Low | If wedding feature is live |
| SEC-008 | No order idempotency | 🟠 HIGH | Medium | Strongly recommended |
| SEC-009 | Seller file persistence on serverless | 🟠 HIGH | High | If seller portal is live |
| SEC-010 | localStorage cart XSS exposure | 🟡 MEDIUM | Medium | No (Phase 2) |
| SEC-011 | No pin code serviceability | 🟡 MEDIUM | Low | No (Phase 2) |
| SEC-012 | No CSRF on API routes | 🟡 MEDIUM | Medium | No (Phase 2) |
| SEC-013 | Firebase project ID in config | 🟡 MEDIUM | N/A | No |
| SEC-014 | NextAuth secret strength | 🟡 MEDIUM | Low | If seller portal live |
| SEC-015 | Git history secrets | 🔵 INFO | Medium | Audit now |
| SEC-016 | NEXT_PUBLIC_ variable review | 🔵 INFO | N/A | Clean ✅ |
| SEC-017 | Hardcoded AWB | 🔵 INFO | Low | Covered by SEC-003 |
| SEC-018 | No rate limiting | 🔵 INFO | Medium | No (Phase 2) |

---

## Pre-Launch Security Checklist

### Must complete before ANY public traffic:
- [ ] SEC-001: Wire Razorpay end-to-end (order create → modal → verify → record)
- [ ] SEC-002: Remove hardcoded bank account from `checkout/page.tsx` source; rotate if real
- [ ] SEC-003: Remove mock fallback from order tracking; return 404 for unknown orders
- [ ] SEC-004: Rotate `ADMIN_SECRET` to a cryptographically random value in Vercel
- [ ] SEC-005: Replace cookie-presence check with Firebase ID token verification in middleware
- [ ] SEC-006: Make `getSupabaseAdmin()` throw on missing service role key
- [ ] SEC-015: Audit git history for secrets; purge if found

### Must complete before enabling seller portal for real sellers:
- [ ] SEC-009: Migrate seller portal persistence from `.data/` to Supabase/Prisma
- [ ] SEC-014: Set `NEXTAUTH_SECRET` to a strong random value in Vercel

### Must complete before enabling wedding features:
- [ ] SEC-007: Add `005_wedding_hampers.sql` migration; remove silent fallback

---

*Document version: 1.0 — Static code analysis only. No penetration testing was performed. Engage a security professional for a formal pen-test before launch.*
