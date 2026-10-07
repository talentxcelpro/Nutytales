/**
 * Nutty Tales — Automated Google Search Console Sitemap Submitter & Telemetry Engine
 *
 * Uses the existing Google Cloud Service Account in .env.local to:
 * 1. Mint a signed Google OAuth2 JWT for Google Search Console API
 * 2. Connect to the domain property: sc-domain:nutytales.com
 * 3. Automatically submit all 7 business sitemaps
 * 4. Verify index status and log response
 */

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
    if (trimmed.startsWith('FIREBASE_CLIENT_EMAIL=')) {
      clientEmail = trimmed.split('=', 2)[1].replace(/^["']|["']$/g, '').trim();
    }
    if (trimmed.startsWith('FIREBASE_PRIVATE_KEY=')) {
      let rawKey = trimmed.substring('FIREBASE_PRIVATE_KEY='.length).replace(/^["']|["']$/g, '');
      privateKey = rawKey.replace(/\\n/g, '\n');
    }
  }
}

if (!clientEmail || !privateKey) {
  console.error('❌ Could not find FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY in .env.local');
  process.exit(1);
}

console.log('============================================================');
console.log('GOOGLE SEARCH CONSOLE — AUTOMATED API SITEMAP SUBMITTER');
console.log('============================================================');
console.log(`Service Account: ${clientEmail}`);
console.log(`Target Property: sc-domain:nutytales.com\n`);

function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(email: string, key: string): Promise<string> {
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

const SITEMAPS_TO_SUBMIT = [
  'https://nutytales.com/sitemap.xml',
  'https://nutytales.com/travel/sitemap.xml',
  'https://nutytales.com/stays/sitemap.xml',
  'https://nutytales.com/crafts/sitemap.xml',
  'https://nutytales.com/weddings/sitemap.xml',
  'https://nutytales.com/gifting/sitemap.xml',
  'https://nutytales.com/business/sitemap.xml',
  'https://business.nutytales.com/sitemap.xml',
  'https://travel.nutytales.com/sitemap.xml',
  'https://stays.nutytales.com/sitemap.xml',
  'https://crafts.nutytales.com/sitemap.xml',
  'https://weddings.nutytales.com/sitemap.xml',
  'https://gifting.nutytales.com/sitemap.xml',
];

async function main() {
  try {
    console.log('1. Requesting Google OAuth2 authorization token...');
    const accessToken = await getAccessToken(clientEmail, privateKey);
    console.log('✓ Successfully authenticated with Google Cloud OAuth2!\n');

    console.log('2. Querying accessible Search Console properties for service account...');
    const sitesRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Goog-User-Project': 'nuty-tales',
        },
      }
    );

    console.log(`Sites endpoint status: ${sitesRes.status}`);
    const sitesBody = await sitesRes.text();
    console.log(`Sites response body:\n${sitesBody}\n`);

    const siteUrl = encodeURIComponent('sc-domain:nutytales.com');

    console.log('3. Querying current Search Console sitemaps...');
    const listRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const listBody = await listRes.text();
    let listData: any = {};
    try {
      listData = JSON.parse(listBody);
    } catch {}

    const existingSitemaps = listData.sitemap || [];
    console.log(`Current registered sitemaps on property: ${existingSitemaps.length}`);
    for (const sm of existingSitemaps) {
      console.log(`  • ${sm.path} (lastDownloaded: ${sm.lastDownloaded || 'pending'}, errors: ${sm.errors || 0})`);
    }
    console.log('');

    console.log('3. Submitting all 7 business sitemaps...');
    for (const smUrl of SITEMAPS_TO_SUBMIT) {
      const encodedSm = encodeURIComponent(smUrl);
      const submitRes = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${encodedSm}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (submitRes.ok || submitRes.status === 204) {
        console.log(`  ✓ Submitted: ${smUrl}`);
      } else {
        const txt = await submitRes.text();
        console.log(`  ✕ ${smUrl} (${submitRes.status}): ${txt}`);
      }
    }

    console.log('\n✅ All sitemaps processed successfully!');
  } catch (err: any) {
    console.error('Error during GSC automation:', err.message);
  }
}

main();
