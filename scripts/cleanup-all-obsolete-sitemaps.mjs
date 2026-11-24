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

const obsoleteSitemaps = [
  'https://nutytales.com/sitemaps/diaspora-eu.xml',
  'https://nutytales.com/sitemaps/diaspora-us.xml',
  'https://nutytales.com/sitemaps/diaspora-me.xml',
  'https://nutytales.com/sitemaps/gifting-geo.xml',
  'https://nutytales.com/sitemaps/stays-geo.xml',
  'https://nutytales.com/sitemaps/crafts-geo.xml',
  'https://nutytales.com/sitemaps/pincodes-east.xml',
  'https://nutytales.com/sitemaps/pincodes-south.xml',
  'https://nutytales.com/sitemaps/pincodes-west.xml',
  'https://nutytales.com/sitemaps/pincodes-north.xml',
  'https://nutytales.com/sitemaps/b2b-matrix-2.xml',
  'https://nutytales.com/sitemaps/b2b-matrix-1.xml',
];

async function run() {
  const token = await getAccessToken(clientEmail, privateKey);
  const siteUrl = encodeURIComponent('sc-domain:nutytales.com');

  for (const sm of obsoleteSitemaps) {
    const feedpath = encodeURIComponent(sm);
    try {
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
      console.log(`Deleting ${sm} -> status ${res.status}`);
    } catch (e) {
      console.error(`Error deleting ${sm}:`, e);
    }
  }
  console.log('Finished cleanup of obsolete sitemaps!');
}

run();
