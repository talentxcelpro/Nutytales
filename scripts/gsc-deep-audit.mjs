import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 1. Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let clientEmail = '';
let privateKey = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('GSC_CLIENT_EMAIL=')) {
      clientEmail = trimmed.split('=', 2)[1].replace(/^["']|["']$/g, '').trim();
    }
    if (trimmed.startsWith('GSC_PRIVATE_KEY=')) {
      let rawKey = trimmed.substring('GSC_PRIVATE_KEY='.length).replace(/^["']|["']$/g, '');
      privateKey = rawKey.replace(/\\n/g, '\n');
    }
  }
}

function base64url(input) {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(email, key) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/webmasters',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(key);
  const jwt = `${signatureInput}.${base64url(signature)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to obtain Google OAuth access token: ${errorText}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken(clientEmail, privateKey);
  console.log('=== GSC DEEP AUDIT FOR NUTY TALES ===\n');

  const PROPERTIES = [
    'sc-domain:nutytales.com',
    'sc-domain:weddings.nutytales.com',
    'sc-domain:gifting.nutytales.com',
    'sc-domain:business.nutytales.com',
    'sc-domain:crafts.nutytales.com',
    'sc-domain:stays.nutytales.com',
    'sc-domain:travel.nutytales.com',
    'sc-domain:nri.nutytales.com',
  ];

  for (const prop of PROPERTIES) {
    console.log(`\n============================================================`);
    console.log(`PROPERTY: ${prop}`);
    console.log(`============================================================`);

    const encodedProp = encodeURIComponent(prop);

    // 1. Sitemaps
    try {
      const smRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedProp}/sitemaps`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Goog-User-Project': 'nuty-tales',
          },
        }
      );
      if (smRes.ok) {
        const smData = await smRes.json();
        const sitemaps = smData.sitemap || [];
        console.log(`Sitemaps (${sitemaps.length}):`);
        for (const sm of sitemaps) {
          console.log(`  - Path: ${sm.path}`);
          console.log(`    Last Downloaded: ${sm.lastDownloaded || 'Pending'}`);
          console.log(`    Last Submitted:  ${sm.lastSubmitted || 'N/A'}`);
          console.log(`    Errors: ${sm.errors || 0}, Warnings: ${sm.warnings || 0}`);
          if (sm.contents && sm.contents.length > 0) {
            for (const c of sm.contents) {
              console.log(`    Type: ${c.type}, Submitted: ${c.submitted}, Indexed: ${c.indexed}`);
            }
          }
        }
      } else {
        console.log(`  Sitemaps fetch failed: ${smRes.status} ${await smRes.text()}`);
      }
    } catch (e) {
      console.log(`  Error querying sitemaps: ${e.message}`);
    }

    // 2. Search Analytics (Last 28 Days)
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const saRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedProp}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Goog-User-Project': 'nuty-tales',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions: ['query'],
            rowLimit: 10,
          }),
        }
      );

      if (saRes.ok) {
        const saData = await saRes.json();
        const rows = saData.rows || [];
        console.log(`Search Analytics (Last 28 days - Queries: ${rows.length}):`);
        if (rows.length === 0) {
          console.log('  No clicks/impressions recorded yet (New property / data accumulating).');
        } else {
          for (const r of rows) {
            console.log(
              `  - "${r.keys[0]}": Clicks=${r.clicks}, Impressions=${r.impressions}, CTR=${(r.ctr * 100).toFixed(1)}%, Position=${r.position.toFixed(1)}`
            );
          }
        }
      } else {
        const txt = await saRes.text();
        console.log(`  Search Analytics error (${saRes.status}): ${txt}`);
      }
    } catch (e) {
      console.log(`  Error querying analytics: ${e.message}`);
    }

    // 3. Search Analytics by Page
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000);
      const startDate = thirtyDaysAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];

      const saPageRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodedProp}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Goog-User-Project': 'nuty-tales',
          },
          body: JSON.stringify({
            startDate,
            endDate,
            dimensions: ['page'],
            rowLimit: 5,
          }),
        }
      );

      if (saPageRes.ok) {
        const saPageData = await saPageRes.json();
        const rows = saPageData.rows || [];
        if (rows.length > 0) {
          console.log(`Top Pages:`);
          for (const r of rows) {
            console.log(`  - ${r.keys[0]}: Clicks=${r.clicks}, Impressions=${r.impressions}`);
          }
        }
      }
    } catch (e) {}
  }
}

run().catch(console.error);
