// Test sitemap URLs for each subdomain to check HTTP status and canonical tag
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

async function checkSitemapUrls() {
  for (const sitemapUrl of SITEMAPS) {
    const res = await fetch(sitemapUrl);
    const text = await res.text();
    const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    const domain = new URL(sitemapUrl).hostname;
    console.log(`\nTesting sample URLs for ${domain} (${locs.length} total in sitemap)...`);

    // Test first 4 URLs
    const samples = locs.slice(0, 4);
    for (const url of samples) {
      try {
        const pageRes = await fetch(url, { redirect: 'manual' });
        const status = pageRes.status;
        const location = pageRes.headers.get('location');
        let canonical = null;
        let title = null;
        if (status === 200) {
          const html = await pageRes.text();
          const canonMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
            || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
          canonical = canonMatch ? canonMatch[1] : null;
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          title = titleMatch ? titleMatch[1].trim() : null;
        }
        console.log(`  [${status}] ${url}`);
        if (location) console.log(`     -> Redirects to: ${location}`);
        if (canonical) console.log(`     -> Canonical: ${canonical}`);
        if (title) console.log(`     -> Title: ${title}`);
      } catch (e) {
        console.log(`  [ERR] ${url}: ${e.message}`);
      }
    }
  }
}

checkSitemapUrls();
