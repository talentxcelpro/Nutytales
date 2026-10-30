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

const SUBDOMAIN_SITEMAP_MAPPING = [
  { prop: 'sc-domain:nutytales.com', sitemaps: [
    'https://nutytales.com/sitemap.xml',
    'https://nutytales.com/sitemaps/b2b-matrix-1.xml',
    'https://nutytales.com/sitemaps/b2b-matrix-2.xml',
    'https://nutytales.com/sitemaps/pincodes-north.xml',
    'https://nutytales.com/sitemaps/pincodes-west.xml',
    'https://nutytales.com/sitemaps/pincodes-south.xml',
    'https://nutytales.com/sitemaps/pincodes-east.xml',
    'https://nutytales.com/sitemaps/crafts-geo.xml',
    'https://nutytales.com/sitemaps/stays-geo.xml',
    'https://nutytales.com/sitemaps/gifting-geo.xml',
    'https://nutytales.com/sitemaps/diaspora-me.xml',
    'https://nutytales.com/sitemaps/diaspora-us.xml',
    'https://nutytales.com/sitemaps/diaspora-eu.xml',
  ]},
  { prop: 'sc-domain:crafts.nutytales.com', sitemaps: ['https://crafts.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:stays.nutytales.com', sitemaps: ['https://stays.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:travel.nutytales.com', sitemaps: ['https://travel.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:weddings.nutytales.com', sitemaps: ['https://weddings.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:gifting.nutytales.com', sitemaps: ['https://gifting.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:business.nutytales.com', sitemaps: ['https://business.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:nri.nutytales.com', sitemaps: ['https://nri.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:middleeast.nutytales.com', sitemaps: ['https://middleeast.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:america.nutytales.com', sitemaps: ['https://america.nutytales.com/sitemap.xml'] },
  { prop: 'sc-domain:europe.nutytales.com', sitemaps: ['https://europe.nutytales.com/sitemap.xml'] },
];

async function main() {
  console.log('============================================================');
  console.log('PUSH ALL SUBDOMAINS DEEP GSC INGESTION ENGINE');
  console.log('============================================================');

  const token = await getAccessToken(clientEmail, privateKey);
  console.log('✓ Google Cloud OAuth2 token minted.\n');

  // 1. Get all accessible properties
  const sitesRes = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Goog-User-Project': 'nuty-tales',
    },
  });
  const sitesData = await sitesRes.json();
  const accessibleSites = (sitesData.siteEntry || []).map(s => s.siteUrl);
  console.log(`Accessible GSC Properties (${accessibleSites.length}):`);
  accessibleSites.forEach(s => console.log(`  • ${s}`));
  console.log('');

  // 2. Submit sitemaps to every single accessible subdomain
  for (const item of SUBDOMAIN_SITEMAP_MAPPING) {
    console.log(`\n------------------------------------------------------------`);
    console.log(`Processing Property: ${item.prop}`);

    const isAccessible = accessibleSites.includes(item.prop);
    if (!isAccessible) {
      console.log(`  ⚠️ Service account does not have permission on ${item.prop} yet.`);
      console.log(`     (Add seo-agent@nuty-tales.iam.gserviceaccount.com to ${item.prop} in GSC Settings > Users)`);
      continue;
    }

    const encodedProp = encodeURIComponent(item.prop);

    for (const smUrl of item.sitemaps) {
      const encodedSm = encodeURIComponent(smUrl);
      try {
        const res = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${encodedProp}/sitemaps/${encodedSm}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Goog-User-Project': 'nuty-tales',
            },
          }
        );
        if (res.ok || res.status === 204) {
          console.log(`  ✓ Successfully submitted sitemap: ${smUrl}`);
        } else {
          console.log(`  ✕ Sitemap ${smUrl} status ${res.status}: ${await res.text()}`);
        }
      } catch (e) {
        console.log(`  ✕ Error submitting ${smUrl}: ${e.message}`);
      }
    }
  }

  console.log('\n✅ All subdomains push complete!');
}

main().catch(console.error);
