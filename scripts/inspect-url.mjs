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

async function inspect(url) {
  const token = await getAccessToken(clientEmail, privateKey);
  const res = await fetch(
    'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Goog-User-Project': 'nuty-tales',
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: 'sc-domain:nutytales.com',
      }),
    }
  );

  const data = await res.json();
  console.log(`\nURL: ${url}`);
  console.log('Result:', JSON.stringify(data.inspectionResult?.indexStatusResult, null, 2));
}

async function run() {
  const testUrls = [
    'https://nutytales.com/',
    'https://nutytales.com/shop',
    'https://nutytales.com/shop/kashmiri-saffron-super-negin',
    'https://nutytales.com/calculator',
  ];
  for (const u of testUrls) {
    try {
      await inspect(u);
    } catch (e) {
      console.error('Error inspecting', u, e);
    }
  }
}

run();
