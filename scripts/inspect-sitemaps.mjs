// Script to inspect sitemaps of all subdomains
const SITEMAPS = [
  'https://nri.nutytales.com/sitemap.xml',
  'https://travel.nutytales.com/sitemap.xml',
  'https://stays.nutytales.com/sitemap.xml',
  'https://crafts.nutytales.com/sitemap.xml',
  'https://weddings.nutytales.com/sitemap.xml',
  'https://gifting.nutytales.com/sitemap.xml',
  'https://business.nutytales.com/sitemap.xml',
  'https://nutytales.com/sitemap.xml'
];

async function inspectSitemap(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`[FAIL] ${url}: Status ${res.status}`);
      return;
    }
    const text = await res.text();
    const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    console.log(`\n=== ${url} (${locs.length} URLs) ===`);
    const hostname = new URL(url).hostname;
    const foreign = locs.filter(l => !l.includes(hostname));
    if (foreign.length > 0) {
      console.log(`⚠️ Foreign URLs found (${foreign.length}):`, foreign.slice(0, 5));
    } else {
      console.log(`✅ All ${locs.length} URLs correctly reference ${hostname}`);
    }
    console.log(`Sample URLs:`, locs.slice(0, 5));
  } catch (e) {
    console.error(`Error fetching ${url}:`, e.message);
  }
}

async function run() {
  for (const s of SITEMAPS) {
    await inspectSitemap(s);
  }
}

run();
