// ─── GET /sitemaps/[shard] ──────────────────────────────────────────────────
// Programmatic shards permanently decommissioned in favor of unified https://nutytales.com/sitemap.xml
// Returns RFC 9110 HTTP 410 Gone so search engine crawlers immediately purge all phantom shard URLs.

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?>\n<!-- 410 Gone: This sitemap shard has been permanently decommissioned. Please use the master sitemap at https://nutytales.com/sitemap.xml -->',
    {
      status: 410,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=604800, s-maxage=604800',
      },
    }
  )
}
