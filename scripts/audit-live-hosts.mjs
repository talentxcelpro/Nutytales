// Test script to audit all 9 production hostnames
const HOSTS = [
  'https://nri.nutytales.com',
  'https://travel.nutytales.com',
  'https://stays.nutytales.com',
  'https://crafts.nutytales.com',
  'https://weddings.nutytales.com',
  'https://gifting.nutytales.com',
  'https://business.nutytales.com',
  'https://nutytales.com',
  'https://www.nutytales.com',
];

async function checkHost(host) {
  const result = { host };
  try {
    // 1. Root /
    const rootRes = await fetch(`${host}/`, { redirect: 'manual' });
    result.rootStatus = rootRes.status;
    result.rootLocation = rootRes.headers.get('location') || null;
    
    if (rootRes.status === 200) {
      const html = await rootRes.text();
      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      result.title = titleMatch ? titleMatch[1].trim() : null;
      // Extract canonical
      const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) 
        || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
      result.canonical = canonicalMatch ? canonicalMatch[1] : null;
    }

    // 2. /robots.txt
    try {
      const robotsRes = await fetch(`${host}/robots.txt`, { redirect: 'manual' });
      result.robotsStatus = robotsRes.status;
      result.robotsLocation = robotsRes.headers.get('location') || null;
      if (robotsRes.status === 200) {
        const robotsText = await robotsRes.text();
        const sitemapMatches = robotsText.match(/Sitemap:\s*(.+)/gi);
        result.robotsSitemaps = sitemapMatches ? sitemapMatches.map(s => s.replace(/Sitemap:\s*/i, '').trim()) : [];
      }
    } catch (e) {
      result.robotsError = e.message;
    }

    // 3. /sitemap.xml
    try {
      const sitemapRes = await fetch(`${host}/sitemap.xml`, { redirect: 'manual' });
      result.sitemapStatus = sitemapRes.status;
      result.sitemapLocation = sitemapRes.headers.get('location') || null;
      if (sitemapRes.status === 200) {
        const sitemapText = await sitemapRes.text();
        const urlMatches = sitemapText.match(/<loc>([^<]+)<\/loc>/g);
        result.sitemapUrlCount = urlMatches ? urlMatches.length : 0;
        result.sitemapSample = urlMatches ? urlMatches.slice(0, 3).map(u => u.replace(/<\/?loc>/g, '')) : [];
      }
    } catch (e) {
      result.sitemapError = e.message;
    }

  } catch (err) {
    result.error = err.message;
  }
  return result;
}

async function run() {
  console.log('Auditing 9 hostnames...\n');
  for (const host of HOSTS) {
    const res = await checkHost(host);
    console.log(JSON.stringify(res, null, 2));
  }
}

run();
