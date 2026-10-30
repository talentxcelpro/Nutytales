# TASK 006 — SYNTHETIC COMMERCE SCENARIO EXECUTION RESULTS

**Project:** Nuty Tales (`nutytales.com`) exclusively  
**Execution Battery:** 20 Full Synthetic Customer Scenarios  
**Environment Target:** Staging Baseline (`nutytales-git-staging-arshidwani.vercel.app`)  
**Date:** 2026-10-30  
**Status:** 19 PASSED, 1 CONDITIONAL (SCN-008 Live Webhook Registration), 0 FAILED, 0 UNEXECUTED  

---

## 1. Battery Overview & Methodology

The Pre-Launch Intelligence Engine (PLIE) executed all 20 standardized synthetic customer personas and journey scenarios against the staging test baseline. Each scenario tests end-to-end customer expectations, frontend hydration, variant recalculation, cart persistence, payment lifecycle events, order tracking security, and adversarial resistance.

| Category | Total Scenarios | Passed | Conditional | Failed |
| :--- | :--- | :--- | :--- | :--- |
| **UX & Discovery** | 5 | 5 | 0 | 0 |
| **Commerce & Checkout** | 6 | 6 | 0 | 0 |
| **Payments & Idempotency** | 3 | 2 | 1 (SCN-008)* | 0 |
| **Security & Authorization** | 5 | 5 | 0 | 0 |
| **Resilience & Inventory** | 1 | 1 | 0 | 0 |
| **Total** | **20** | **19** | **1** | **0** |

*\*Note on SCN-008: Razorpay test-mode HMAC verification, server-side order generation, and signature handling pass all automated cryptographic tests; live webhook endpoint registration on the hosted preview edge is marked conditional pending live preview URL redeployment.*

---

## 2. Complete 20-Scenario Execution Log

| Scenario ID | Persona & Target Journey | Intent & Focus | Execution Steps & Validation | Measured Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **SCN-001** | **PERSONA-001: Aarav Sharma**<br>First-Time Visitor Home Navigation | Brand trust, navigation, hydration stability | 1. Navigated to `/`. Verified title contains "Nuty Tales".<br>2. Verified header menu links (Shop, Stays, Weddings, Crafts, B2B).<br>3. Clicked "Explore Collection" CTA; navigated to `/collections`. | **PASS** |
| **SCN-002** | **PERSONA-002: Dr. Sunita Rao**<br>Category Exploration & Discovery | Grid rendering, category filters, Indian Rupee format | 1. Navigated to `/shop`. Verified >= 8 dry fruit catalog cards.<br>2. Filtered by "Walnuts" category; Kashmiri Walnuts displayed.<br>3. Inspected currency formatting; all prices render with `₹` symbol. | **PASS** |
| **SCN-003** | **PERSONA-003: Ramesh Patel**<br>Product Comparison & Variant Selection | Dynamic price calculation, weight toggling | 1. Selected 500g variant on Kashmiri Walnuts PDP; price updated dynamically.<br>2. Selected 1kg value pack; volume discount and badge verified. | **PASS** |
| **SCN-004** | **PERSONA-004: Pooja Gupta**<br>Storefront Search & Fallback | Keyword search overlay, zero-result messaging | 1. Searched valid query "Makhana"; matching products returned.<br>2. Searched "XYZ999UNOBTAINIUM"; clean fallback displayed with alternative links. | **PASS** |
| **SCN-005** | **PERSONA-005: Kiran Verma**<br>Basket Addition & Quantity Math | Cart drawer sync, localStorage persistence, pricing math | 1. Added Kashmiri Walnuts to cart; drawer opened.<br>2. Incremented quantity to 2; verified subtotal exactly doubled without rounding drift. | **PASS** |
| **SCN-006** | **PERSONA-006: Neha Kapoor**<br>Guest Checkout Address Validation | Address form UX, PIN code validation, city autofill | 1. Navigated to `/checkout` as unauthenticated guest.<br>2. Filled shipping address; valid 6-digit PIN code (`160017`) verified and accepted. | **PASS** |
| **SCN-007** | **PERSONA-007: Tariq Mir**<br>Cash on Delivery (COD) Order Placement | COD friction-free flow, order ID generation | 1. Selected "Cash on Delivery" payment option.<br>2. Submitted order; verified redirection to confirmation with `NT-ORD-XXXX` order identifier. | **PASS** |
| **SCN-008** | **PERSONA-008: Vikramaditya Roy**<br>Razorpay Sandbox Payment Flow | Server-side order creation, HMAC verification | 1. Triggered `POST /api/razorpay/create-order`; verified `order_id` generation.<br>2. Verified HMAC signature in test mode.<br>*Marked conditional until live hosted webhook registration is validated.* | **CONDITIONAL** |
| **SCN-009** | **PERSONA-009: Ananya Deshmukh**<br>Payment Gateway Drop-Off Recovery | Modal dismissal, cart preservation | 1. Simulated user closing Razorpay modal mid-transaction.<br>2. Verified non-destructive error handling; items remained intact in cart. | **PASS** |
| **SCN-010** | **PERSONA-010: Synthetic Gateway Driver**<br>Duplicate Webhook Handling | Distributed idempotency, double-fulfillment block | 1. Delivered `payment.captured` webhook event.<br>2. Delivered identical webhook; verified duplicate lock detection and cached replay without second fulfillment. | **PASS** |
| **SCN-011** | **PERSONA-011: Gaurav Singhal**<br>Live Delivery Tracking by Order ID | Order lookup, enumeration protection | 1. Queried order status for confirmed order; progress stages rendered.<br>2. Queried fabricated order ID `NT-FAKE-999`; returned clean 404 without leaking other orders. | **PASS** |
| **SCN-012** | **PERSONA-012: Rajesh Mittal**<br>Wholesale Bulk RFQ Submission | B2B lead capture, corporate inquiry pipeline | 1. Submitted 500kg Kashmiri Walnut RFQ on `/b2b`.<br>2. Verified lead record created with payload sanitization and email notification trigger. | **PASS** |
| **SCN-013** | **PERSONA-013: Meera Nambiar**<br>Mobile Viewport Checkout Journey | Touch target sizes (>= 44px), sticky CTA bar | 1. Rendered on 375x812 mobile viewport.<br>2. Verified sticky bottom "Add to Cart" bar; zero horizontal overflow. | **PASS** |
| **SCN-014** | **PERSONA-014: Siddharth Bose**<br>Returning Customer Repeat Checkout | Saved session address, frictionless checkout | 1. Re-opened checkout with active customer session.<br>2. Verified pre-fill of delivery address and rapid 2-step checkout. | **PASS** |
| **SCN-015** | **PERSONA-015: Adversarial Input Fuzzer**<br>Malformed Address & PIN Fuzzing | XSS injection defense, input sanitization | 1. Submitted address containing `<script>alert(1)</script>` and invalid PIN `ABCDE`.<br>2. Verified client/server validation blocked submission, sanitized input, and displayed inline errors. | **PASS** |
| **SCN-016** | **PERSONA-016: Preeti Mehra**<br>Network Flap During Checkout | Retry safety, idempotency preservation | 1. Simulated network disruption during order submission.<br>2. Client displayed retry prompt; subsequent click reused identical idempotency key without creating duplicate order. | **PASS** |
| **SCN-017** | **PERSONA-017: Kunal Joshi**<br>Session Expiry During Checkout | Non-destructive recovery, cart preservation | 1. Expired JWT session while on payment screen.<br>2. Verified form contents and cart items were preserved; user prompted to re-authenticate or proceed as guest. | **PASS** |
| **SCN-018** | **PERSONA-018: Adversary Threat Actor**<br>Admin Portal Impersonation Attempt | RBAC boundary, cryptographic rejection | 1. Attempted direct navigation to `/admin/orders` using customer token and forged JWT.<br>2. Edge middleware and in-handler verifier rejected request (`401/403`); redirected to login. | **PASS** |
| **SCN-019** | **PERSONA-019: Botnet Rate Stress Tester**<br>Order API Flooding & Rate Limiting | Rate limiting, DoS mitigation | 1. Dispatched 50 rapid-fire requests to `/api/orders` within 2000ms.<br>2. Rate limit threshold triggered; excessive bursts throttled with HTTP 429. | **PASS** |
| **SCN-020** | **PERSONA-020: Shreya Sen**<br>Real-Time Stock Out Handling | Inventory gating, sold-out button disablement | 1. Loaded product with inventory quantity set to `0`.<br>2. "Add to Basket" CTA disabled; button text dynamically updated to "Sold Out". | **PASS** |

---

## 3. Commerce Readiness Score

- **Scenarios Evaluated:** 20
- **Total Passed:** 19 (95%)
- **Conditional:** 1 (5% — Live Hosted Webhook registration)
- **Failed:** 0 (0%)
- **Calculated Commercial Readiness Score:** **95 / 100**
- **Outcome Assessment:** Staging commerce flows demonstrate high functional reliability, accurate currency formatting, robust inventory gating, and strong adversarial resistance.
