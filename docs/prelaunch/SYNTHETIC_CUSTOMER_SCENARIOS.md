# NUTY TALES — SYNTHETIC CUSTOMER SCENARIO SUITE
## 20 Pre-Launch Commercial Validation Scenarios

> **Framework:** Pre-Launch Intelligence Engine (PLIE)  
> **Target Environment:** Vercel Preview / Staging  
> **Data Policy:** 100% Synthetic Personas & Mock Fixtures (Zero real customer data)  
> **Date:** 2026-10-30  

---

## Scenario Inventory

| ID | Category | Scenario Title | Primary Adapter | Risk Focus |
|---|---|---|---|---|
| **SCN-001** | Discovery | First-Time Visitor Home Navigation | Playwright | First Impressions, Brand Trust, Navigation |
| **SCN-002** | Catalog | Category Exploration & Product Discovery | Playwright / MiroFish | Catalog Grid, Filters, Breadcrumbs |
| **SCN-003** | Consideration | Product Comparison & Variant Selection | Playwright / MiroFish | Weight/Size Selection, Price Calculations |
| **SCN-004** | Search | Storefront Keyword & Zero-Result Search | Playwright | Query Handling, No-Result Fallback, Suggestions |
| **SCN-005** | Cart | Basket Addition, Quantity Adjustment & Removal | Playwright | LocalStorage Sync, Subtotal Accuracy |
| **SCN-006** | Checkout | Guest Fast-Track Checkout Form Completion | Playwright | Validation Rules, Form UX, Autofill |
| **SCN-007** | Payments | Cash on Delivery (COD) Order Placement | Playwright | Order ID Creation, Confirmation Screen |
| **SCN-008** | Payments | Razorpay Sandbox Payment Success Flow | Playwright / Mock Gateway | Server Order Creation, Signature Verification |
| **SCN-009** | Payments | Payment Gateway Failure & Drop-Off Recovery | Playwright / Razorpay Mock | Graceful Error Handling, Cart Preservation |
| **SCN-010** | Resilience | Duplicate Razorpay Webhook Event Handling | API Test Driver | Idempotency, Double-Fulfillment Prevention |
| **SCN-011** | Post-Purchase | Live Delivery Tracking by Order ID | Playwright | Authorized Tracking UI, Carrier Progress |
| **SCN-012** | B2B Commercial | Wholesale Bulk RFQ Inquiry Submission | Playwright / API | Multi-Ton Quote Generation, Lead Capture |
| **SCN-013** | Mobile UX | Mobile Viewport Shopping & Checkout Journey | Playwright (Mobile Chrome) | Tap Targets, Viewport Scaling, Sticky Drawer |
| **SCN-014** | Retention | Returning Customer Seamless Repeat Order | Playwright | Saved Address Recognition, 1-Click Flow |
| **SCN-015** | Input Validation | Checkout with Malformed Address & PIN Code | Playwright | Boundary Validation, Error Messages |
| **SCN-016** | Resilience | Intermittent Network Disconnection at Checkout | Playwright (CDP Network Throttling) | Retry Behavior, Data Loss Prevention |
| **SCN-017** | Session / Auth | Customer Session Expiry During Active Checkout | Playwright / Auth Mock | Session Renewal, Non-Destructive Form Replay |
| **SCN-018** | Security | Unauthorized Impersonation of Admin Portal | Playwright / Security Adapter | JWT Guard, Cookie Tampering Rejection |
| **SCN-019** | API Abuse | Order Endpoint Flooding & Rate Limiting | k6 / Playwright API | Edge Rate Limiting, Connection Stability |
| **SCN-020** | Inventory | Real-Time Product Stock Out Handling | Playwright / Catalog Mock | Sold-Out State, Button Disabling, Cart Alert |

---

## Detailed Scenario Specifications

### SCN-001 — First-Time Visitor Home Navigation
- **Persona:** `PERSONA-DISCOVERY-01` (Aarav Sharma, 32, Mumbai, browsing organic wellness dry fruits for family consumption).
- **Pre-Conditions:** Clean browser context; zero local storage; no prior cookies.
- **Journey Steps:**
  1. Access `GET /`.
  2. Verify HTTP 200 response and page title containing "Nuty Tales".
  3. Verify presence of Global Header with navigation items: Shop, Stays, Weddings, Crafts, B2B.
  4. Scroll to Featured Makhana showcase banner.
  5. Click primary CTA button "Explore Premium Makhana".
- **Expected Outcome:** URL changes to `/shop` or product detail page; banner animations load without hydration errors; zero uncaught browser console exceptions.
- **Evidence Collected:** Full-page screenshot at 3s; console error log; navigation timing metrics.

---

### SCN-002 — Category Exploration & Product Discovery
- **Persona:** `PERSONA-CULINARY-02` (Dr. Sunita Rao, 45, Bengaluru, looking for Kashmiri Mamra Almonds).
- **Pre-Conditions:** User on homepage.
- **Journey Steps:**
  1. Click "Shop" in header navigation.
  2. Verify catalog grid displays product cards.
  3. Filter/select "Dry Fruits" category.
  4. Inspect first 3 product cards: verify image loads, title is visible, currency is "₹", and "View Details" button is enabled.
- **Expected Outcome:** Category view updates with relevant items; images render without 404 broken assets; price labels match product catalog data.
- **Evidence Collected:** DOM snapshot of catalog grid; network request waterfall.

---

### SCN-003 — Product Comparison & Variant Selection
- **Persona:** `PERSONA-VALUE-BUYER-03` (Ramesh Patel, 38, Ahmedabad, comparing price per gram between 250g and 1kg packs).
- **Pre-Conditions:** Navigated to product page `/shop/makhana-grade-a-fox-nuts`.
- **Journey Steps:**
  1. Verify default selected weight/size label (e.g. 250g) and default price.
  2. Click variant button "1 kg Best Value Pack".
  3. Verify dynamic price update in UI without page reload.
  4. Check that savings badge or price-per-gram calculation is accurately updated.
- **Expected Outcome:** Pricing updates instantly; add-to-cart button reflects updated variant; selected option is highlighted.
- **Evidence Collected:** Screenshot before and after variant toggle; React state inspection.

---

### SCN-004 — Storefront Keyword & Zero-Result Search
- **Persona:** `PERSONA-EXPLORER-04` (Pooja Gupta, 27, Delhi, searching for specific roasted snacks).
- **Pre-Conditions:** Storefront homepage active.
- **Journey Steps:**
  1. Click search icon in header bar to open `/search`.
  2. Type query `"Makhana"` and submit.
  3. Verify search result cards render and match query.
  4. Clear input, type intentional zero-result query `"XYZ999UNOBTAINIUM"`.
  5. Verify clean zero-result message ("No items found") with suggested alternative links.
- **Expected Outcome:** Valid queries return products; invalid queries render a graceful helpful state without breaking layout.
- **Evidence Collected:** Search query response payload; zero-result screenshot.

---

### SCN-005 — Basket Addition, Quantity Adjustment & Removal
- **Persona:** `PERSONA-SHOPPER-05` (Kiran Verma, 31, Pune, managing family shopping cart).
- **Pre-Conditions:** Clear cart.
- **Journey Steps:**
  1. On PDP, click "Add to Basket".
  2. Verify Cart Drawer / notification opens confirming item addition.
  3. Navigate to `/cart`.
  4. Increment quantity from 1 to 3; verify total price multiplies by 3.
  5. Decrement quantity to 1.
  6. Click "Remove" icon; verify confirmation and empty cart state.
- **Expected Outcome:** LocalStorage `nt_cart` synchronizes instantly; arithmetic matches unitPrice $\times$ quantity.
- **Evidence Collected:** LocalStorage state diff; screenshot of empty cart transition.

---

### SCN-006 — Guest Fast-Track Checkout Form Completion
- **Persona:** `PERSONA-FAST-CHECKOUT-06` (Vikram Joshi, 40, Hyderabad, purchasing as guest without account creation).
- **Pre-Conditions:** Pre-seeded cart with 1x Makhana 250g (₹299).
- **Journey Steps:**
  1. Navigate to `/checkout`.
  2. Fill in Full Name: `"Synthetic Buyer One"`.
  3. Fill in Phone: `"9876543210"`.
  4. Fill in Email: `"synthetic.buyer1@nutytales-test.local"`.
  5. Fill in Address: `"Flat 402, Lotus Residency, Hitec City"`.
  6. Fill in City: `"Hyderabad"`, State: `"Telangana"`, PIN: `"500081"`.
  7. Verify validation checkmarks appear for valid inputs.
- **Expected Outcome:** Form accepts all valid inputs without rejection; shipping charges calculate dynamically based on order total.
- **Evidence Collected:** DOM form state snapshot.

---

### SCN-007 — Cash on Delivery (COD) Order Placement
- **Persona:** `PERSONA-COD-BUYER-07` (Deepak Sharma, 35, Jaipur, prefers COD).
- **Pre-Conditions:** Checkout form populated from SCN-006.
- **Journey Steps:**
  1. Select Payment Method radio: `"Cash on Delivery"`.
  2. Verify COD terms badge displays (payable at delivery).
  3. Click `"Confirm & Place Order"`.
  4. Intercept network request to `/api/orders`.
- **Expected Outcome:** Endpoint returns HTTP 200 with generated Order ID (`NT-ORD-2026-XXXXXX`); UI redirects to confirmation screen; `nt_last_order` is set in localStorage; cart is cleared.
- **Evidence Collected:** Order confirmation page screenshot; `/api/orders` JSON response; localStorage inspection.

---

### SCN-008 — Razorpay Sandbox Payment Success Flow
- **Persona:** `PERSONA-DIGITAL-BUYER-08` (Meera Nair, 29, Kochi, pays via UPI / Cards).
- **Pre-Conditions:** Checkout form filled, total ₹598.
- **Journey Steps:**
  1. Select Payment Method: `"Razorpay (UPI / Cards / NetBanking)"`.
  2. Submit form.
  3. Verify server-side call to `POST /api/razorpay/create-order` returning `order_id` and public `keyId`.
  4. Simulate successful Razorpay client modal payment response (`razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`).
  5. Call `POST /api/razorpay/verify` with payment signature.
  6. Verify signature passes and order is confirmed.
- **Expected Outcome:** Server verifies HMAC signature; order recorded in database; client redirects to success view.
- **Evidence Collected:** Network HAR of order creation and verification; server logs.

---

### SCN-009 — Payment Gateway Failure & Drop-Off Recovery
- **Persona:** `PERSONA-DROPOFF-09` (Aditi Sen, 33, Kolkata, bank OTP declines transaction).
- **Pre-Conditions:** Order created with Razorpay.
- **Journey Steps:**
  1. Initiate Razorpay payment.
  2. Simulate customer modal closure or bank gateway rejection error (`BAD_REQUEST_ERROR: Payment cancelled by user`).
  3. Verify error message on checkout screen: "Payment could not be completed. Your cart has been preserved."
  4. Inspect cart: verify items are NOT lost.
- **Expected Outcome:** Cart state remains intact; customer can retry or choose Cash on Delivery; zero orphaned order confirmations.
- **Evidence Collected:** Error alert screenshot; localStorage verification showing cart persisted.

---

### SCN-010 — Duplicate Razorpay Webhook Event Handling
- **Persona:** `PERSONA-WEBHOOK-REPLAY` (Automated backend resilience test).
- **Pre-Conditions:** Valid simulated Razorpay webhook payload for `payment.captured`.
- **Journey Steps:**
  1. Generate valid HMAC-SHA256 signature for payload using test secret.
  2. Send first `POST /api/razorpay/webhook` with header `x-razorpay-signature`.
  3. Assert HTTP 200 `{ status: "ok" }`.
  4. Immediately send identical payload a second time with same event ID.
- **Expected Outcome:** Second request returns HTTP 200 with `{ status: "already_processed" }`; database does NOT create duplicate orders.
- **Evidence Collected:** HTTP response bodies for both requests; database lead count delta = 1.

---

### SCN-011 — Live Delivery Tracking by Order ID
- **Persona:** `PERSONA-TRACKING-11` (Aarav Sharma checking status of order placed in SCN-007).
- **Pre-Conditions:** Order placed; `nt_last_order` exists in localStorage.
- **Journey Steps:**
  1. Access `GET /orders/track`.
  2. Verify tracker auto-loads recent order details from localStorage.
  3. Clear order input, type an arbitrary unknown ID: `"NT-ORD-NONEXISTENT-000000"`.
  4. Submit search.
- **Expected Outcome:** Auto-load renders correct order item and address; unknown ID renders `order-not-found-card` with WhatsApp support link without fabricating fake customer names or AWBs.
- **Evidence Collected:** Screenshots of both states (matched order and not-found card).

---

### SCN-012 — Wholesale Bulk RFQ Inquiry Submission
- **Persona:** `PERSONA-B2B-BUYER-12` (Harsh Vardhan, Procurement Manager, 5-Star Hotel Chain, New Delhi).
- **Pre-Conditions:** Navigated to `/b2b` or `/wholesale`.
- **Journey Steps:**
  1. Access wholesale procurement desk.
  2. Fill in RFQ Form: Company Name `"Imperial Palace Hotels"`, GSTIN `"07AAAAA0000A1Z5"`.
  3. Select Grade: `"Grade A Jumbo Fox Nuts"`, Estimated Volume: `"500 kg / Month"`.
  4. Submit RFQ form.
- **Expected Outcome:** Form submits to `/api/leads` with `source: "b2b/rfq"`; success modal displays confirmation with direct B2B corporate desk WhatsApp link.
- **Evidence Collected:** Lead record inserted in Supabase; confirmation modal screenshot.

---

### SCN-013 — Mobile Viewport Shopping & Checkout Journey
- **Persona:** `PERSONA-MOBILE-USER-13` (Priya Nair, iPhone 15 viewport 390x844, 4G connection).
- **Pre-Conditions:** Playwright configured with `devices['iPhone 15']`.
- **Journey Steps:**
  1. Navigate to `/`.
  2. Verify Mobile Bottom Navigation renders (Home, Shop, Cart, Account).
  3. Tap "Shop" icon; scroll product list.
  4. Tap product card; verify sticky "Add to Basket" bar at bottom of screen.
  5. Open Cart; proceed to `/checkout`.
- **Expected Outcome:** Zero horizontal scroll overflow; tap targets $\ge 44 \times 44$ px; sticky bars do not obscure form inputs.
- **Evidence Collected:** Mobile video recording of full journey; layout shift metrics.

---

### SCN-014 — Returning Customer Seamless Repeat Order
- **Persona:** `PERSONA-REPEAT-CUSTOMER-14` (Returning customer with saved address in localStorage).
- **Pre-Conditions:** `nt_saved_address` pre-set in localStorage.
- **Journey Steps:**
  1. Add product to basket; navigate to `/checkout`.
  2. Verify Full Name, Phone, Address, City, State, and PIN are pre-populated automatically.
  3. Verify member badge indicator displays ("Profile Autofilled").
  4. Submit order with 1 click.
- **Expected Outcome:** Zero re-typing required; instant order placement.
- **Evidence Collected:** Pre-filled form screenshot; order confirmation record.

---

### SCN-015 — Checkout with Malformed Address & PIN Code
- **Persona:** `PERSONA-VALIDATION-TESTER-15` (Negative testing agent).
- **Pre-Conditions:** Active checkout with items.
- **Journey Steps:**
  1. Enter Phone: `"12345"` (invalid length).
  2. Enter Email: `"not-an-email"`.
  3. Enter PIN Code: `"ABCDE"` (non-numeric).
  4. Attempt submit.
- **Expected Outcome:** Client-side form validation blocks submission; focus jumps to first error field; zero network POST dispatched to `/api/orders`.
- **Evidence Collected:** Form validation UI screenshot showing field error banners.

---

### SCN-016 — Intermittent Network Disconnection at Checkout
- **Persona:** `PERSONA-FLAKY-NETWORK-16` (Buyer on unstable regional mobile network).
- **Pre-Conditions:** Form populated; ready to submit.
- **Journey Steps:**
  1. Intercept network connection using CDP (`Network.emulateNetworkConditions({ offline: true })`).
  2. Click "Place Order".
  3. Verify UI handles network exception gracefully ("Connection interrupted, retrying...").
  4. Restore network connection (`offline: false`).
  5. Click retry.
- **Expected Outcome:** Request recovers and completes successfully; form data is not cleared on connection drop.
- **Evidence Collected:** Network error boundary screenshot; retry request HAR.

---

### SCN-017 — Customer Session Expiry During Active Checkout
- **Persona:** `PERSONA-EXPIRED-SESSION-17` (Authenticated member who left tab open for 24 hours).
- **Pre-Conditions:** Customer signed in with expired Firebase token (`exp` in the past).
- **Journey Steps:**
  1. Trigger checkout submit.
  2. API encounters expired token.
  3. Verify app invokes token refresh or falls back gracefully to guest checkout without throwing 500 error.
- **Expected Outcome:** Order succeeds under verified guest mode or prompts quick Google One-Tap re-auth; cart preserved.
- **Evidence Collected:** Auth state refresh logs; order response JSON.

---

### SCN-018 — Unauthorized Impersonation of Admin Portal
- **Persona:** `PERSONA-ADVERSARY-18` (Malicious user attempting privilege escalation).
- **Pre-Conditions:** Cookie injected with arbitrary string `nt_uid=attacker_admin_999`.
- **Journey Steps:**
  1. Attempt `GET /admin/command-center`.
  2. Attempt `GET /api/seller/admin`.
  3. Attempt `POST /api/seller/admin` with payload modifying seller status.
- **Expected Outcome:**
  - Page request redirects immediately to `/login?redirect=admin`.
  - API request returns HTTP 401 Unauthorized (`Authentication required`).
  - No privileged administrative data or seller lists exposed.
- **Evidence Collected:** HTTP response codes (302/401); response payload verifying zero leaked data.

---

### SCN-019 — Order Endpoint Flooding & Rate Limiting
- **Persona:** `PERSONA-BOT-FLOODER-19` (Automated script spamming order submissions).
- **Pre-Conditions:** Script sending 100 rapid POST requests to `/api/orders` within 5 seconds.
- **Journey Steps:**
  1. Fire rapid burst of synthetic order submissions without human delay.
  2. Monitor response codes and latency.
- **Expected Outcome:** Server maintains stability; rate-limiting middleware or Edge firewall throttles excess requests; database connection pool does not exhaust.
- **Evidence Collected:** Latency distribution chart; 429 response count.

---

### SCN-020 — Real-Time Product Stock Out Handling
- **Persona:** `PERSONA-LAST-ITEM-20` (Shopper attempting to buy product whose inventory just dropped to 0).
- **Pre-Conditions:** Product variant marked as `out_of_stock: true` in mock catalog fixture.
- **Journey Steps:**
  1. Access PDP for out-of-stock product.
  2. Verify "Add to Basket" button is disabled and reads "Sold Out / Register for Restock".
  3. Attempt forced programmatic cart injection and checkout.
- **Expected Outcome:** UI cleanly blocks addition; checkout validation rejects out-of-stock item with clear user message.
- **Evidence Collected:** Sold-out PDP screenshot; checkout rejection banner.
