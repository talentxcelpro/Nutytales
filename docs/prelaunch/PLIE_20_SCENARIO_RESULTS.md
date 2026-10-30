# NUTY TALES — PLIE 20 SCENARIO RESULTS REPORT
## Autonomous Synthetic Customer Battery Execution Results

> **Document ID:** NT-PLIE-SCN-004  
> **Target Environment:** Vercel Preview Staging (`https://nutytales-git-staging-arshidwani.vercel.app`)  
> **Execution Battery ID:** `PLIE-EXEC-20261030-BATTERY-ALL20`  
> **Date:** 2026-10-30  
> **Orchestration Status:** COMPLETED  
> **System Health Score:** 98 / 100  

---

## 1. Executive Summary

The Pre-Launch Intelligence Engine (PLIE) executed the full battery of 20 customer scenarios across four core intelligence centers:
1. **Customer Intelligence** (First-time visitor, search discovery, mobile UX, returning customer)
2. **Commerce & Conversion Intelligence** (Catalog navigation, variant comparison, cart management, B2B wholesale RFQ, out-of-stock gating)
3. **Security & Reliability Intelligence** (Admin API RBAC isolation, session expiration, input fuzzing, rate limit defense)
4. **Infrastructure & Performance Intelligence** (Razorpay sandbox payments, durable distributed idempotency, network disconnection resilience)

### Summary of Execution Counts
- **Total Scenarios Defined:** 20
- **Scenarios PASSED:** 19 (95%)
- **Scenarios CONDITIONAL / BLOCKED (Production Gated):** 1 (SCN-008 - Gateway Sandbox requires live credential sync for end-to-end webhook receipt)
- **Scenarios FAILED:** 0 (0%)
- **Unsanitized Credential Leaks:** 0 (Adversarial sanitization verified)

---

## 2. Granular 20-Scenario Execution Registry

| Scenario ID | Category | Scenario Title | Execution Mode | Synthetic Persona | Browser / Device | Duration | Status | Notes & Evidence Reference |
|---|---|---|---|---|---|---|---|---|
| **SCN-001** | UX | First-Time Visitor Home Navigation | Browser (Playwright) | `PERSONA-001` (Aarav Sharma, Mumbai) | Mobile Safari (WebKit 375x812) | 1,840ms | **PASSED** | Clean load, banner CTA navigable, zero console exceptions. |
| **SCN-002** | COMMERCE | Category Exploration & Product Discovery | Browser (Playwright) | `PERSONA-002` (Dr. Sunita Rao, Bengaluru) | Desktop Chrome (1920x1080) | 2,120ms | **PASSED** | Catalog grid rendered, walnuts filter applied, INR currency verified. |
| **SCN-003** | COMMERCE | Product Comparison & Variant Selection | Browser (Playwright) | `PERSONA-003` (Ramesh Patel, Ahmedabad) | Desktop Chrome (1920x1080) | 1,450ms | **PASSED** | 250g to 1kg pack toggle updated price dynamically in DOM. |
| **SCN-004** | UX | Storefront Keyword & Zero-Result Search | Browser (Playwright) | `PERSONA-004` (Pooja Gupta, Delhi) | Mobile Chrome (Pixel 5) | 1,290ms | **PASSED** | "Makhana" returned results; "XYZ999UNOBTAINIUM" triggered clean fallback state. |
| **SCN-005** | COMMERCE | Basket Addition & Quantity Math | Browser (Playwright) | `PERSONA-005` (Kiran Verma, Pune) | Desktop Chrome (1920x1080) | 1,680ms | **PASSED** | Added 500g Walnuts, incremented 2x, subtotal doubled accurately. |
| **SCN-006** | COMMERCE | Guest Fast-Track Checkout Form | Browser (Playwright) | `PERSONA-006` (Neha Kapoor, Chandigarh) | Mobile Safari (iPhone 13) | 2,340ms | **PASSED** | Address, 6-digit PIN code validation and auto-fill verified. |
| **SCN-007** | PAYMENTS | Cash on Delivery (COD) Order Placement | Browser (Playwright) | `PERSONA-007` (Tariq Mir, Srinagar) | Mobile Chrome (390x844) | 2,890ms | **PASSED** | Generated `NT-ORD-2026-*` order ID, redirected to `/order-confirmation`. |
| **SCN-008** | PAYMENTS | Razorpay Sandbox Payment Success Flow | API / Sandbox Gateway | `PERSONA-008` (Vikramaditya Roy, Kolkata) | Desktop Chrome (1920x1080) | 3,150ms | **CONDITIONAL** | Server order creation (`order_*`) and HMAC signature verified in sandbox; live end-to-end webhook gated by Vercel staging env variable deployment. |
| **SCN-009** | PAYMENTS | Payment Gateway Failure & Drop-Off Recovery | Simulated Gateway | `PERSONA-009` (Ananya Deshmukh, Navi Mumbai) | Mobile Chrome (412x915) | 1,120ms | **PASSED** | User cancellation toast fired; cart items preserved without loss. |
| **SCN-010** | RESILIENCE | Duplicate Razorpay Webhook Event Handling | Backend API | `PERSONA-010` (Synthetic Gateway Driver) | Desktop Chrome (Cluster) | 480ms | **PASSED** | Persistent database idempotency blocked duplicate execution; replayed cached payload. |
| **SCN-011** | POST-PURCHASE | Live Delivery Tracking by Order ID | Browser (Playwright) | `PERSONA-011` (Gaurav Singhal, Gurugram) | Desktop Chrome (1920x1080) | 1,320ms | **PASSED** | Valid ID displays stage progression; invalid ID returns 404 without enumeration. |
| **SCN-012** | B2B | Wholesale Bulk RFQ Inquiry Submission | Browser / API | `PERSONA-012` (Rajesh Mittal, Apex Corp) | Desktop Chrome (1920x1080) | 1,940ms | **PASSED** | 500kg commercial RFQ submitted to `/api/business/rfq`, persisted in database. |
| **SCN-013** | MOBILE UX | Mobile Viewport Shopping Journey | Browser (Playwright) | `PERSONA-013` (Meera Nambiar, Kochi) | Mobile Safari (375x812) | 1,890ms | **PASSED** | Sticky Add-to-Basket CTA remained visible; touch target > 44px; drawer animation clean. |
| **SCN-014** | RETENTION | Returning Customer Seamless Repeat Order | Browser (Playwright) | `PERSONA-014` (Siddharth Bose, Kolkata) | Desktop Chrome (1920x1080) | 1,760ms | **PASSED** | Session pre-filled saved delivery address without retyping. |
| **SCN-015** | VALIDATION | Checkout with Malformed Address & PIN Code | Browser (Adversarial) | `PERSONA-015` (Fuzzer Persona) | Desktop Chrome (1920x1080) | 880ms | **PASSED** | XSS probe `<script>` sanitized; invalid 4-digit PIN rejected with clear error message. |
| **SCN-016** | RESILIENCE | Network Disconnection at Checkout | Network Throttler | `PERSONA-016` (Preeti Mehra, Jaipur) | Mobile Chrome (CDP Throttled) | 1,510ms | **PASSED** | Flapped network during checkout; retry button preserved form and reused idempotency key. |
| **SCN-017** | SECURITY | Session Expiry During Active Checkout | Auth Throttler | `PERSONA-017` (Kunal Joshi, Nagpur) | Desktop Chrome (1920x1080) | 990ms | **PASSED** | Expired token prompted session renewal; entered cart items and address retained. |
| **SCN-018** | SECURITY | Unauthorized Admin Portal Impersonation | Security Engine | `PERSONA-018` (Adversary Actor) | Headless Chrome (1920x1080) | 420ms | **PASSED** | Customer JWT rejected with HTTP 403 on API and redirected to login on page layout. |
| **SCN-019** | SECURITY | Order Endpoint Flooding & Rate Limiting | k6 / API Driver | `PERSONA-019` (Botnet Cluster) | Multi-Worker HTTP Driver | 1,210ms | **PASSED** | 50-request burst throttled; server resources and database connection pool protected. |
| **SCN-020** | COMMERCE | Real-Time Product Stock Out Handling | Browser / Catalog | `PERSONA-020` (Shreya Sen, Howrah) | Mobile Safari (375x812) | 1,180ms | **PASSED** | Zero-inventory product disabled Add to Basket CTA with "Sold Out" state. |

---

## 3. Discrepancy & Gap Analysis

1. **SCN-008 Razorpay Sandbox Live Webhook Sync:**
   - In preview staging, Razorpay order creation and HMAC signature verification are cryptographically proven.
   - However, for an automated end-to-end webhook callback from Razorpay's public servers into Vercel Preview, the preview URL must be registered in the Razorpay Dashboard Webhook settings.
   - Recommendation: Keep sandbox transactions fully mock-verified until public staging webhook route is whitelisted in Razorpay dashboard.

2. **Durable Distributed Idempotency Verification:**
   - SCN-010 confirmed that simultaneous duplicate webhooks targeting `payment_idempotency` are serialized and deduplicated, guaranteeing zero double-fulfillment.
