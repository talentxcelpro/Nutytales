import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken(clientEmail, privateKey);
  const siteUrl = encodeURIComponent('sc-domain:nutytales.com');
  const feedpath = encodeURIComponent('https://nutytales.com/sitemap_index.xml');

  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${siteUrl}/sitemaps/${feedpath}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Goog-User-Project': 'nuty-tales',
      },
    }
  );

  console.log(`Delete sitemap_index.xml status: ${res.status}`);
  if (res.ok || res.status === 204) {
    console.log('✓ Successfully removed obsolete sitemap_index.xml from GSC!');
  } else {
    console.log('Response:', await res.text());
  }
}

run().catch(console.error);
