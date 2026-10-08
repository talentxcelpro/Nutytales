import crypto from 'crypto';
import fs from 'fs';

async function addTestPhoneNumber() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const getEnv = (key) => {
    const lines = env.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith(key + '=')) {
        let val = line.slice(key.length + 1).trim();
        if (val.startsWith('"')) {
          let full = val.slice(1);
          if (full.endsWith('"')) {
            val = full.slice(0, -1);
          } else {
            while (++i < lines.length) {
              if (lines[i].endsWith('"')) {
                full += '\n' + lines[i].slice(0, -1);
                break;
              } else {
                full += '\n' + lines[i];
              }
            }
            val = full;
          }
        }
        return val.replace(/\\n/g, '\n');
      }
    }
    return null;
  };

  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getEnv('FIREBASE_PRIVATE_KEY');
  const projectId = getEnv('FIREBASE_PROJECT_ID');

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  })).toString('base64url');

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(header + '.' + payload);
  const signature = signer.sign(privateKey, 'base64url');
  const jwt = header + '.' + payload + '.' + signature;

  const bodyParams = new URLSearchParams();
  bodyParams.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  bodyParams.append('assertion', jwt);

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyParams.toString()
  }).then(r => r.json());

  const patchBody = {
    signIn: {
      phoneNumber: {
        enabled: true,
        testPhoneNumbers: {
          "+919999999999": "123456",
          "+919717845477": "999888"
        }
      }
    }
  };

  const patchUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config?updateMask=signIn.phoneNumber`;
  const res = await fetch(patchUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${tokenRes.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patchBody)
  });

  console.log('PATCH Status:', res.status);
  const data = await res.json();
  console.log('PATCH Response:', JSON.stringify(data.signIn?.phoneNumber, null, 2));
}

addTestPhoneNumber().catch(console.error);
