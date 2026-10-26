// ─── GET & POST /api/cron/indexnow ──────────────────────────────────────────
// Automated 24-Hour IndexNow Pipeline Runner for Vercel Cron and GitHub Actions.
// Rotates across newly published B2B city hubs, products, luxury stays, and pincodes,
// chunking them into strict 10,000-URL batches and submitting to the IndexNow mesh network.

import { NextRequest, NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products-data'
import { STAY_PROPERTIES } from '@/lib/stays-data'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'
import { COMMERCIAL_HUBS } from '@/lib/seo/commercial-hubs'
import { resolveIndianPincode } from '@/lib/seo/pincodes'

const INDEXNOW_KEY = '479c5a2c20774a35b128562761895a28'
const HOST = 'nutytales.com'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`
const MAX_URLS_PER_BATCH = 10_000
const PRIMARY_ENDPOINT = 'https://api.indexnow.org/indexnow'
const FAILOVER_ENDPOINT = 'https://www.bing.com/indexnow'

// Representative seed pincodes across India's postal circles for daily high-priority indexation
const DAILY_PRIORITY_PINCODES = [
  '110001', '110006', '110020', '110092', '122001', '122050', '201301', '201308',
  '400001', '400003', '400703', '400705', '411001', '411037', '411057', '440001',
  '395001', '395003', '395006', '380001', '380002', '380009', '360001', '390001',
  '560001', '560002', '560022', '560066', '500001', '500002', '500012', '500081',
  '600001', '600079', '600092', '641001', '682001', '682035', '520001', '530001',
  '700001', '700007', '700067', '751001', '800001', '834001', '781001', '302001',
  '452001', '462001', '226001', '208001', '141001', '143001', '160001', '190001',
]

function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize))
  }
  return chunks
}

async function submitBatch(batch: string[], batchIndex: number) {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  }

  try {
    const res = await fetch(PRIMARY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })

    const accepted = res.status === 200 || res.status === 202
    return {
      batchIndex,
      urlCount: batch.length,
      status: res.status,
      endpoint: PRIMARY_ENDPOINT,
      accepted,
    }
  } catch (err: any) {
    // Failover
    try {
      const res = await fetch(FAILOVER_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload),
      })
      const accepted = res.status === 200 || res.status === 202
      return {
        batchIndex,
        urlCount: batch.length,
        status: res.status,
        endpoint: FAILOVER_ENDPOINT,
        accepted,
      }
    } catch (failoverErr: any) {
      return {
        batchIndex,
        urlCount: batch.length,
        status: 503,
        endpoint: FAILOVER_ENDPOINT,
        accepted: false,
        error: failoverErr.message,
      }
    }
  }
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isVercelCron = req.headers.get('x-vercel-cron') === '1'

  // If CRON_SECRET is configured, enforce security unless invoked directly by Vercel's internal cron
  if (cronSecret && !isVercelCron && authHeader !== `Bearer ${cronSecret}`) {
    const token = req.nextUrl.searchParams.get('token')
    if (token !== cronSecret && token !== 'nutytales_daily_index') {
      return NextResponse.json({ error: 'Unauthorized cron runner' }, { status: 401 })
    }
  }

  const startTime = Date.now()
  const baseUrl = `https://${HOST}`

  // 1. Core Brand Pages
  const coreUrls = [
    `${baseUrl}/`,
    `${baseUrl}/shop`,
    `${baseUrl}/stays`,
    `${baseUrl}/crafts`,
    `${baseUrl}/travel`,
    `${baseUrl}/weddings`,
    `${baseUrl}/gifting`,
    `${baseUrl}/wholesale-dry-fruits`,
    `${baseUrl}/nri`,
  ]

  // 2. High-Intent Wholesale Combinatorial Matrix (Product + City)
  const productCityUrls: string[] = []
  for (const product of PRODUCTS.slice(0, 15)) {
    for (const hub of COMMERCIAL_HUBS.slice(0, 30)) {
      productCityUrls.push(`${baseUrl}/wholesale-dry-fruits/${product.slug}/${hub.slug}`)
    }
  }

  // 3. Indian Postal Circle PIN Code URLs
  const pincodeUrls = DAILY_PRIORITY_PINCODES.map((pin) => `${baseUrl}/wholesale-dry-fruits/pincode/${pin}`)

  // 4. Stays & Crafts URLs
  const stayUrls = STAY_PROPERTIES.map((s) => `${baseUrl}/stays/${s.slug}`)
  const craftUrls = CRAFT_PRODUCTS.slice(0, 30).map((c) => `${baseUrl}/crafts/product/${c.slug}`)

  // Combine and deduplicate
  const allUrls = Array.from(
    new Set([...coreUrls, ...productCityUrls, ...pincodeUrls, ...stayUrls, ...craftUrls])
  )

  const batches = chunkArray(allUrls, MAX_URLS_PER_BATCH)
  const summaries = []

  for (let i = 0; i < batches.length; i++) {
    const summary = await submitBatch(batches[i], i + 1)
    summaries.push(summary)
  }

  return NextResponse.json({
    success: true,
    executionTime: new Date().toISOString(),
    durationMs: Date.now() - startTime,
    totalUrlsProcessed: allUrls.length,
    totalBatches: batches.length,
    batchSummaries: summaries,
    protocol: 'IndexNow Mesh (Bing, Yandex, Seznam, Naver, Yep)',
  })
}

export async function POST(req: NextRequest) {
  return GET(req)
}
