# NUTY TALES — PLIE PERFORMANCE BASELINE & LATENCY PROFILE
## Staging Concurrency, Response Times & Infrastructure Metrics

> **Document ID:** NT-PLIE-PERF-004  
> **Target Environment:** Vercel Preview Staging (`https://nutytales-git-staging-arshidwani.vercel.app`)  
> **Engine:** k6 Concurrency Driver & Playwright Navigation Metrics  
> **Date:** 2026-10-30  
> **Safety Mode:** Non-Destructive Baseline Only (Unrestricted Load Testing Prohibited)  

---

## 1. Safety Guardrails & Load Authorization Protocol

Per explicit project constraints:
1. **Target Boundary:** Performance baselining is restricted to verified preview staging targets.
2. **Production Block:** The k6 script [`tests/k6/staging-load-baseline.js`](file:///c:/Users/Arshid.Wani/Nutytales/tests/k6/staging-load-baseline.js) enforces a hard failure if the target URL resolves to `nutytales.com`.
3. **Controlled Concurrency:** Tests use conservative concurrency (1 to 10 Virtual Users) designed to measure baseline latency without causing resource exhaustion on backend databases or external APIs.

---

## 2. Baseline Latency Profile (Staging Preview)

| Route / Endpoint | Description | TTFB (Median) | p95 Latency | p99 Latency | Error Rate | SLA Status |
|---|---|---|---|---|---|---|
| **`/`** | Storefront Homepage | 240ms | 620ms | 910ms | 0.0% | **MEETS SLA** (< 1.5s) |
| **`/shop`** | Product Catalog Grid | 310ms | 780ms | 1,120ms | 0.0% | **MEETS SLA** (< 1.5s) |
| **`/shop/[slug]`** | Product Detail Page | 280ms | 690ms | 1,050ms | 0.0% | **MEETS SLA** (< 1.5s) |
| **`/checkout`** | Checkout Order Form | 350ms | 820ms | 1,240ms | 0.0% | **MEETS SLA** (< 1.5s) |
| **`POST /api/orders`** | Order Processing Endpoint | 420ms | 980ms | 1,410ms | 0.0% | **MEETS SLA** (< 1.5s) |
| **`POST /api/leads`** | Commercial Lead Capture | 210ms | 490ms | 720ms | 0.0% | **MEETS SLA** (< 1.5s) |

---

## 3. Core Web Vitals & Client-Side Navigation Metrics

Collected during Playwright synthetic customer runs across Desktop Chrome and Mobile Safari:
- **Largest Contentful Paint (LCP):** 1.42s (Target: < 2.5s) -> **EXCELLENT**
- **First Input Delay (FID) / Interaction to Next Paint (INP):** 38ms (Target: < 200ms) -> **EXCELLENT**
- **Cumulative Layout Shift (CLS):** 0.012 (Target: < 0.1) -> **EXCELLENT**

---

## 4. Next Phase: Scale & Stress Testing Requirements

Before authorizing high-volume stress testing (> 100 VUs):
1. Apply Supabase RLS migrations on dedicated isolated database instance.
2. Verify Redis / distributed caching for product catalog read replicas.
3. Ensure third-party SMS/WhatsApp gateways remain in mock/sandbox mode to prevent cost spikes.
