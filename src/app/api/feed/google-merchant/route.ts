import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products-data'
import { CLOTHING_PRODUCTS } from '@/lib/clothing-data'
import { CRAFT_PRODUCTS } from '@/lib/crafts-data'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://nutytales.com'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  // 1. Food & Gourmet Harvest Items
  const foodItems = PRODUCTS.map((product) => {
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
  })

  // 2. Crafts & Indian Handcrafted Heritage Apparel Items
  const seenCraftSlugs = new Set<string>()
  const craftList = []

  for (const item of CLOTHING_PRODUCTS) {
    if (!seenCraftSlugs.has(item.slug)) {
      seenCraftSlugs.add(item.slug)
      craftList.push(item)
    }
  }
  for (const item of CRAFT_PRODUCTS) {
    if (!seenCraftSlugs.has(item.slug)) {
      seenCraftSlugs.add(item.slug)
      craftList.push(item)
    }
  }

  const craftItems = craftList.map((item) => {
    const rawImage = item.image || (item as any).additionalImages?.[0] || '/opengraph-image'
    const fullImageUrl = rawImage.startsWith('http') ? rawImage : `${APP_URL}${rawImage}`
    const productUrl = `${APP_URL}/crafts/product/${item.slug}`
    const price = `${item.price.toFixed(2)} INR`
    const availability = (item as any).stockStatus === 'OUT_OF_STOCK' ? 'out_of_stock' : 'in_stock'
    const gender = (item as any).gender === 'men' ? 'male' : (item as any).gender === 'women' ? 'female' : 'unisex'
    const categoryLabel = (item as any).categoryLabel || (item as any).primaryCategory || (item as any).category || 'Handcrafted Ethnic Wear'

    return `    <item>
      <g:id>NT-CRF-${item.id}</g:id>
      <g:title>${escapeXml(item.name)}</g:title>
      <g:description>${escapeXml(item.shortDesc || (item as any).longDesc || item.name)}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${fullImageUrl}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${price}</g:price>
      <g:brand>Nuty Tales Crafts</g:brand>
      <g:gender>${gender}</g:gender>
      <g:age_group>adult</g:age_group>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>Apparel &amp; Accessories &gt; Clothing &gt; Traditional &amp; Ethnic Wear</g:google_product_category>
      <g:product_type>Crafts &amp; Handlooms &gt; ${escapeXml(categoryLabel)}</g:product_type>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Insured White-Glove Courier</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>`
  })

  const allXmlItems = [...foodItems, ...craftItems].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Nuty Tales — Single-Origin Himalayan Dry Fruits &amp; GI Certified Crafts</title>
    <link>${APP_URL}</link>
    <description>Google Merchant Center Official Product Feed for Nuty Tales &amp; Nuty Tales Crafts</description>
${allXmlItems}
  </channel>
</rss>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
    },
  })
}
