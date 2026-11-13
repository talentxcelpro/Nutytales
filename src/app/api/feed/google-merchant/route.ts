import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products-data'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutytales.com'

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const items = PRODUCTS.map((product) => {
    const rawImage = product.image || (product.images && product.images[0]) || '/opengraph-image'
    const fullImageUrl = rawImage.startsWith('http') ? rawImage : `${APP_URL}${rawImage}`
    const productUrl = `${APP_URL}/shop/${product.slug}`
    const price = `${product.retailPrice.toFixed(2)} INR`
    const availability = product.stockStatus === 'OUT_OF_STOCK' ? 'out_of_stock' : 'in_stock'

    const googleCategory = product.slug.includes('saffron') || product.slug.includes('mongra')
      ? 'Food, Beverages &amp; Tobacco &gt; Food Items &gt; Seasonings &amp; Spices &gt; Herbs &amp; Spices'
      : product.slug.includes('honey')
      ? 'Food, Beverages &amp; Tobacco &gt; Food Items &gt; Sweeteners &gt; Honey'
      : 'Food, Beverages &amp; Tobacco &gt; Food Items &gt; Nuts &amp; Seeds'

    return `    <item>
      <g:id>NT-${product.id}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.shortDesc || product.longDesc || product.name)}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${fullImageUrl}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:brand>Nuty Tales</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${googleCategory}</g:google_product_category>
      <g:product_type>Dry Fruits &gt; ${escapeXml(product.category)}</g:product_type>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Express Surface / Air</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Nuty Tales — Single-Origin Himalayan Dry Fruits &amp; Gourmet Harvest</title>
    <link>${APP_URL}</link>
    <description>Google Merchant Center Official Product Feed for Nuty Tales</description>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
