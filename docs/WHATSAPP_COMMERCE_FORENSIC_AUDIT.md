# NUTY TALES — WHATSAPP COMMERCE OS: FORENSIC AUDIT
**Date:** 2026-10-30  
**Project:** Nuty Tales (https://nutytales.com)  
**System:** WhatsApp Commerce OS Architecture & Repository Audit  
**Auditor:** Antigravity System Architecture Specialist  
**Status:** COMPLETE FORENSIC DISCOVERY

---

## 1. EXECUTIVE SUMMARY & REPOSITORY OVERVIEW

A comprehensive forensic inspection of the Nuty Tales repository was conducted prior to system design and development. The audit evaluated frontend architecture, routing, middleware, database models, payment systems, product catalogues, customer workflows, authentication mechanisms, and existing WhatsApp touchpoints.

### Core Architecture Matrix
| Component | Existing Technology & Version | Status & Impact on WhatsApp Commerce OS |
|---|---|---|
| **Frontend Framework** | Next.js 16.3.8 (App Router) | High-performance React 19.2.8. Subdomain-aware routing via `middleware.ts`. |
| **Styling & UI** | Tailwind CSS v4 + PostCSS | Theme palette: Brand Navy (`#17233B`), Gold (`#C9A45C`), Warm Cream (`#F7F2E8`). |
| **Authentication** | Dual-Stack: Firebase Auth (B2C) + NextAuth v5 beta (B2B / Admin) | Admin sessions verified by server-side JWT token check (`nt_uid`). |
| **Database ORM** | Prisma 5.19.1 (`postgresql://...`) | Comprehensive schema (`prisma/schema.prisma` - 1,537 lines) with User, Order, Payment, Lead, Cart models. |
| **Database Engine** | Supabase PostgreSQL (`qezkjbzmtfjjmqgzgili.supabase.co`) | Hosts live tables, RLS policies, native migrations (`001` through `004`), and storage buckets. |
| **Payment Gateway** | Razorpay Node.js SDK (`^2.9.8`) | Verified HMAC-SHA256 signature verification in `/api/razorpay/verify` & `/api/razorpay/webhook`. |
| **Product Catalogue** | TypeScript Static Constant (`src/lib/products-data.ts`) | 25+ premium dry fruits, makhana, saffron, and nuts with pricing tiers, nutrition, and variants. |
| **Gifting & Weddings** | Supabase Migrations (`002_weddings_platform_schema.sql`) | Tables for `wedding_projects`, `wedding_enquiries`, `wedding_hampers`, and bespoke packaging. |
| **WhatsApp Current** | Click-to-chat links (`src/lib/whatsapp.ts`) | Only static `wa.me` URL generation; zero backend message orchestration or automation. |
| **Hosting Platform** | Vercel Serverless / Edge Lambdas | Must use stateless, event-driven architecture with queue/webhook reliability. |

---

## 2. EXISTING CAPABILITIES & REUSABLE ASSETS

The Nuty Tales codebase contains mature commerce components that the WhatsApp Commerce OS can directly leverage:

1. **Grounded Product Catalogue (`src/lib/products-data.ts`):**
   - 25+ products with exact pricing: Retail prices, MRP strikethroughs, variant pack sizes (250g, 500g, 1kg, 2kg), and B2B volume discount tiers (5kg to 100+ kg).
   - Rich nutritional data (calories, protein, fats, allergens, FSSAI licence #22724441000048).
   - Sensory profiles, origin data (Mithila, Kashmir, California, Iran, Afghanistan).
   - **Reuse:** Serves as the authoritative source of truth for the AI Shopping Assistant knowledge base.

2. **Server-Side Payment Verification (`src/app/api/razorpay/verify/route.ts` & `src/app/api/razorpay/webhook/route.ts`):**
   - Cryptographic HMAC-SHA256 verification of Razorpay signatures.
   - In-memory event deduplication with bounded cache.
   - Event handling for `payment.captured` and `order.paid`.
   - **Reuse:** Triggers instant, verified WhatsApp payment confirmation messages without trusting client redirects.

3. **Multi-Vendor Order Synchronization (`src/app/api/orders/route.ts`):**
   - Generates standardized order IDs (`NT-ORD-{YYYY}-{RANDOM6}`).
   - Integrates with multi-seller fulfillment desks.
   - **Reuse:** Emits verified order creation events for immediate WhatsApp utility order confirmation dispatch.

4. **Wedding & Gifting Business Layer (`src/lib/weddings/` & Supabase tables):**
   - Dedicated schemas for wedding projects, enquiries, and hampers (`wedding_hampers`, `wedding_enquiries`).
   - High-budget lead pipeline (`src/app/admin/command-center`).
   - **Reuse:** AI assistant can directly qualify wedding hamper inquiries and route them to sales executives.

5. **Supabase Administrative Client (`src/lib/supabase.ts`):**
   - Privileged `getSupabaseAdmin()` factory utilizing `SUPABASE_SERVICE_ROLE_KEY`.
   - Fails closed in production when service credentials are absent.
   - **Reuse:** Executes secure, server-side database operations for WhatsApp message logs, contacts, automations, and campaigns.

---

## 3. IDENTIFIED CAPABILITY GAPS

Prior to Master Task 001, the following capabilities were completely missing:

| Missing Capability | Description | Architectural Risk If Unaddressed |
|---|---|---|
| **Official Meta Cloud API Provider** | No adapter for Meta WhatsApp Business Platform (Graph API v21.0+). | Relies solely on customer clicking `wa.me`, precluding server-to-consumer notifications. |
| **Incoming Webhook Receiver** | No endpoint to receive incoming WhatsApp messages or delivery receipts. | Cannot track message delivery, read receipts, or customer inbound replies. |
| **Unified Administrative Inbox** | No team dashboard to view live chats, customer histories, or agent handover. | Sales team cannot manage inbound WhatsApp conversations in one central desk. |
| **Customer Consent & Opt-Out** | No consent tracking table (`whatsapp_consent_records`) or opt-out suppression. | Violates Meta Business Messaging Policy and Telecom regulations (TRAI/GDPR). |
| **Commerce Event Automation** | No event listener triggering WhatsApp messages upon order, dispatch, or cart abandonment. | Missed recovery of high-intent buyers and manual burden on customer support. |
| **AI Shopping Assistant** | No NLP/AI agent answering dry fruit questions, order status, or wedding hamper queries. | Inquiries outside business hours go unanswered, lowering conversions. |
| **Campaign Manager** | No mechanism to segment customers, preview audiences, schedule broadcasts, or track ROI. | Inability to run seasonal campaigns (Diwali, Eid, New Year) to drive repeat orders. |

---

## 4. DATABASE INTEGRATION OPPORTUNITY & SCHEMA CONVENTIONS

### Existing Schema Alignment
The existing database utilizes Supabase PostgreSQL with two conventions:
1. **Prisma ORM tables:** Pluralized snake_case (`users`, `orders`, `payments`, `leads`, `products`).
2. **Supabase Native Migrations:** Prefixed with domain (`profiles`, `wedding_*`, `stay_*`, `sellers_*`).

### WhatsApp Schema Design
To maintain database integrity without duplicating existing customer or order tables:
- `whatsapp_contacts` links to `users(id)` and `leads(id)` optionally.
- `whatsapp_conversations` tracks active threads, assignments, and AI/Human mode.
- `whatsapp_messages` captures all inbound/outbound messages, Meta WAMIDs, delivery status, and media.
- `whatsapp_message_templates` caches approved Meta templates (Header, Body, Buttons).
- `whatsapp_consent_records` provides an immutable audit log of opt-ins and opt-outs.
- `whatsapp_automation_rules` and `whatsapp_automation_executions` provide idempotent workflow tracking.
- `whatsapp_campaigns` and `whatsapp_campaign_recipients` power targeted promotional messaging.
- `whatsapp_webhook_events` ensures strict deduplication of Meta webhook deliveries.

---

## 5. SECURITY & COMPLIANCE FINDINGS

1. **Meta Webhook Signature Verification:**
   - Meta signs all incoming webhook POST requests with an HMAC-SHA256 signature in the `x-hub-signature-256` header using the Meta App Secret.
   - *Requirement:* Must enforce `crypto.timingSafeEqual` comparison on raw request payload before parsing JSON.

2. **Secrets Protection:**
   - Meta Access Tokens, App Secrets, and Webhook Verify Tokens must reside exclusively in server-side environment variables (`META_WHATSAPP_ACCESS_TOKEN`, `META_APP_SECRET`, etc.).
   - Frontend components must never import or leak provider credentials.

3. **Administrative Access Control:**
   - All `/admin/whatsapp` routes must be protected behind existing server-side JWT verification (`src/app/admin/layout.tsx` and NextAuth/Firebase auth).
   - API endpoints under `/api/admin/whatsapp/*` must validate authorization tokens and reject unauthorized callers.

4. **Non-Blocking Resilience:**
   - WhatsApp message dispatch must be wrapped in resilient try/catch blocks with asynchronous dispatch. Order placement and payment verification must NEVER fail or be blocked by a transient WhatsApp provider error.

---

## 6. RECOMMENDED ARCHITECTURE & DEVELOPMENT SEQUENCE

```
                        NUTY TALES WEB & CHECKOUT
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
        Order Created       Payment Verified      Inbound Chat
              │                    │                    │
              └────────────────────┼────────────────────┘
                                   ▼
                   WHATSAPP COMMERCE ORCHESTRATOR
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
   Customer & Consent      Automation Engine       AI Shopping Assistant
     Manager (E.164)      (Order/Pay/Ship/Cart)     (Catalogue Grounded)
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
                      WHATSAPP PROVIDER ADAPTER
                     (Meta Cloud API + Mock Fallback)
                                   │
                                   ▼
                      META WHATSAPP BUSINESS GRAPH
```

### Development Execution Sequence:
1. Deliver Forensic Audit and WA-AKG Technical Assessment (`Phase 0 & 1`).
2. Design Database Schema Migration (`Phase 9` - `005_whatsapp_commerce_os.sql`).
3. Build Modular Provider Adapter with Meta Cloud API & Mock Engine (`Phase 3`).
4. Build Customer & Consent Manager with international E.164 phone normalization (`Phase 4`).
5. Implement Event-Driven Commerce Automation Engine (`Phase 5`).
6. Develop AI Shopping Assistant with catalogue grounding and human handover (`Phase 6`).
7. Construct Unified WhatsApp Inbox (`Phase 7`).
8. Implement Campaign Management Engine with throttling and opt-out suppression (`Phase 8`).
9. Build Administrative Operations Dashboard at `/admin/whatsapp` (`Phase 10`).
10. Execute Comprehensive Vitest Automated Test Suite (`Phase 12`).
11. Finalize Security Audit, Deployment Guide, and Operations Manual (`Phase 11, 13, 14`).
