import http from 'k6/http'
import { check, sleep } from 'k6'

// ─── Nuty Tales PLIE — Staging Load & Concurrency Baseline (k6) ────────────────
// Targets designated Vercel Preview Staging environment.
// SAFETY: Contains hard safety check prohibiting execution against production.
// Concurrency: Conservative ramp from 1 to 10 VUs for baseline latency profiling.

const TARGET_URL = __ENV.TARGET_BASE_URL || 'https://nutytales-git-staging-arshidwani.vercel.app'

// Mandatory Safety Guard
if (TARGET_URL.includes('nutytales.com') && !TARGET_URL.includes('staging') && !TARGET_URL.includes('preview')) {
  throw new Error(`CRITICAL SECURITY BLOCK: k6 load test cannot target production (${TARGET_URL})!`)
}

export const options = {
  stages: [
    { duration: '10s', target: 2 }, // Warmup
    { duration: '30s', target: 5 }, // Baseline throughput
    { duration: '10s', target: 0 }, // Cooldown
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500', 'p(99)<2500'], // 95% of requests under 1.5s
    http_req_failed: ['rate<0.01'],                  // Error rate under 1%
  },
}

export default function () {
  const headers = {
    'User-Agent': 'PLIE-k6-Performance-Agent/1.0',
    'x-plie-synthetic-run': 'true',
  }

  // 1. Homepage Latency Profile
  const resHome = http.get(`${TARGET_URL}/`, { headers })
  check(resHome, {
    'Homepage status is 200': (r) => r.status === 200,
    'Homepage TTFB under 800ms': (r) => r.timings.waiting < 800,
  })

  sleep(1)

  // 2. Product Detail Page Latency Profile
  const resProduct = http.get(`${TARGET_URL}/products/kashmiri-walnuts-snow-white`, { headers })
  check(resProduct, {
    'Product page status is 200': (r) => r.status === 200,
    'Product TTFB under 1000ms': (r) => r.timings.waiting < 1000,
  })

  sleep(1)

  // 3. Category Page Latency Profile
  const resCategory = http.get(`${TARGET_URL}/collections/walnuts`, { headers })
  check(resCategory, {
    'Collection status is 200': (r) => r.status === 200,
  })

  sleep(2)
}
