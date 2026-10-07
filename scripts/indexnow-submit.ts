/**
 * Nutty Tales — Automated IndexNow Search Engine Ingestion Script
 *
 * Instantly broadcasts verified indexable URLs across all 6 business verticals
 * to Bing, Yandex, Seznam, and partner engines via the open IndexNow protocol.
 */

import { PRODUCTS } from '../src/lib/products-data';
import { CRAFT_PRODUCTS } from '../src/lib/crafts-data';
import { STAY_PROPERTIES } from '../src/lib/stays-data';
import { KASHMIR_TRAVEL_PACKAGES } from '../src/lib/travel-data';
import { INDUSTRIES } from '../src/lib/business-supply-data';

const HOST = 'nutytales.com';
const INDEXNOW_KEY = '9872e90f23b145a6c8e310d54fa1128c';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// Gather all high-value indexable URLs
const URLS_TO_INDEX: string[] = [
  `https://${HOST}/`,
  `https://${HOST}/shop`,
  `https://${HOST}/wholesale-dry-fruits`,
  `https://${HOST}/corporate-gifts`,
  `https://${HOST}/destination-weddings`,
  `https://${HOST}/pashmina-shawls`,
  `https://${HOST}/wedding-return-gifts`,
  `https://${HOST}/stays`,
  `https://${HOST}/travel`,

  // Wholesale city & industry landing pages
  `https://${HOST}/wholesale-dry-fruits/noida`,
  `https://${HOST}/wholesale-dry-fruits/kashmir`,
  `https://${HOST}/wholesale-dry-fruits/patna`,
  ...INDUSTRIES.map((ind) => `https://${HOST}/wholesale-dry-fruits/${ind.slug}`),

  // Kashmir travel packages
  ...KASHMIR_TRAVEL_PACKAGES.map((pkg) => `https://${HOST}/travel/kashmir/${pkg.slug}`),

  // Boutique stays
  ...STAY_PROPERTIES.map((stay) => `https://${HOST}/stays/${stay.slug}`),

  // Corporate gifts
  `https://${HOST}/corporate-gifts/diwali`,
  `https://${HOST}/corporate-gifts/dubai`,
  `https://${HOST}/corporate-gifts/mumbai`,
  `https://${HOST}/corporate-gifts/employee-gifts`,
  `https://${HOST}/corporate-gifts/client-gifts`,

  // Destination weddings
  `https://${HOST}/destination-weddings/kashmir`,
  `https://${HOST}/destination-weddings/dubai`,
  `https://${HOST}/destination-weddings/italy`,

  // Products & Crafts
  ...PRODUCTS.map((prod) => `https://${HOST}/shop/${prod.slug}`),
  ...CRAFT_PRODUCTS.map((craft) => `https://${HOST}/crafts/product/${craft.slug}`),
];

async function submitIndexNow() {
  console.log('============================================================');
  console.log('NUTTY TALES — INDEXNOW INSTANT INGESTION DISPATCHER');
  console.log('============================================================');
  console.log(`Host: ${HOST}`);
  console.log(`Key Location: ${KEY_LOCATION}`);
  console.log(`Total URLs to broadcast: ${URLS_TO_INDEX.length}\n`);

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS_TO_INDEX,
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
    'https://yandex.com/indexnow',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Broadcasting to ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      console.log(`  Status: ${res.status} (${res.statusText})`);
      if (res.status === 200 || res.status === 202) {
        console.log(`  ✓ Successfully submitted ${URLS_TO_INDEX.length} URLs to ${endpoint}!`);
      } else {
        const text = await res.text();
        console.log(`  Info / Response: ${text || 'Acknowledged'}`);
      }
    } catch (err: any) {
      console.error(`  ✕ Error broadcasting to ${endpoint}:`, err.message);
    }
  }

  console.log('\n✅ IndexNow dispatch complete!');
}

submitIndexNow();
