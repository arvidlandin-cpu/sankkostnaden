import crypto from 'node:crypto';

const tokenEndpoint='https://oauth2.googleapis.com/token';

function base64url(value){
  return Buffer.from(value).toString('base64url');
}

export function parseServiceAccount(raw){
  if(!raw) return null;
  const parsed=typeof raw==='string'?JSON.parse(raw):raw;
  if(!parsed?.client_email||!parsed?.private_key){
    throw new Error('Google service account JSON must contain client_email and private_key.');
  }
  return parsed;
}

export async function getGoogleAccessToken(serviceAccount,scopes){
  const now=Math.floor(Date.now()/1000);
  const header=base64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const payload=base64url(JSON.stringify({
    iss:serviceAccount.client_email,
    scope:[...new Set(scopes)].join(' '),
    aud:tokenEndpoint,
    iat:now,
    exp:now+3600,
  }));
  const unsigned=header+'.'+payload;
  const signer=crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const assertion=unsigned+'.'+signer.sign(serviceAccount.private_key).toString('base64url');

  const response=await fetch(tokenEndpoint,{
    method:'POST',
    headers:{'content-type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({
      grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  const body=await response.text();
  if(!response.ok) throw new Error('Google OAuth token exchange failed: '+response.status+' '+body.slice(0,300));
  const data=JSON.parse(body);
  if(!data?.access_token) throw new Error('Google OAuth token exchange returned no access token.');
  return data.access_token;
}

export async function googleJson(url,accessToken,options={}){
  const response=await fetch(url,{
    ...options,
    headers:{
      'authorization':'Bearer '+accessToken,
      'accept':'application/json',
      ...(options.body?{'content-type':'application/json'}:{}),
      ...(options.headers||{}),
    },
  });
  const body=await response.text();
  if(!response.ok) throw new Error(response.status+' '+response.statusText+': '+body.slice(0,500));
  return body?JSON.parse(body):null;
}
