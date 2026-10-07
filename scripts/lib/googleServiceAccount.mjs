import crypto from 'node:crypto';

const tokenEndpoint='https://oauth2.googleapis.com/token';
const RETRYABLE_STATUS=new Set([429,500,502,503,504]);

function base64url(value){
  return Buffer.from(value).toString('base64url');
}

function sleep(ms){
  return ms>0?new Promise(resolve=>setTimeout(resolve,ms)):Promise.resolve();
}

async function fetchTextWithRetry(url,options={},label='Google request'){
  const attempts=Math.max(1,Number(process.env.GOOGLE_HTTP_RETRY_ATTEMPTS||3));
  const baseMs=Math.max(0,Number(process.env.GOOGLE_HTTP_RETRY_BASE_MS||250));
  let lastError=null;

  for(let attempt=1;attempt<=attempts;attempt+=1){
    try{
      const response=await fetch(url,options);
      const body=await response.text();
      if(response.ok) return {response,body};
      const error=new Error(label+' failed: '+response.status+' '+response.statusText+': '+body.slice(0,500));
      error.status=response.status;
      lastError=error;
      if(!RETRYABLE_STATUS.has(response.status)||attempt===attempts) throw error;
    }catch(error){
      lastError=error;
      const status=Number(error?.status)||0;
      const retryable=status===0||RETRYABLE_STATUS.has(status);
      if(!retryable||attempt===attempts) throw error;
    }
    await sleep(baseMs*Math.pow(2,attempt-1));
  }
  throw lastError||new Error(label+' failed');
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

  const {body}=await fetchTextWithRetry(tokenEndpoint,{
    method:'POST',
    headers:{'content-type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({
      grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  },'Google OAuth token exchange');

  const data=JSON.parse(body);
  if(!data?.access_token) throw new Error('Google OAuth token exchange returned no access token.');
  return data.access_token;
}

export async function googleJson(url,accessToken,options={}){
  const {body}=await fetchTextWithRetry(url,{
    ...options,
    headers:{
      'authorization':'Bearer '+accessToken,
      'accept':'application/json',
      ...(options.body?{'content-type':'application/json'}:{}),
      ...(options.headers||{}),
    },
  },'Google API request');
  return body?JSON.parse(body):null;
}
