import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {validateSitemapLastmod} from './check-sitemap-lastmod.mjs';



export const ORIGIN='https://sankkostnaden.se';
export const ENDPOINT='https://api.indexnow.org/indexnow';
const protectedPath='/elavtal/kvartspris/';
const day=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
export function canonical(value){
  try{const u=new URL(value);return u.origin===ORIGIN&&u.href===value&&u.pathname.endsWith('/')&&!u.search&&!u.hash&&!u.username&&!u.password;}catch{return false;}
}
export function sitemapDates(xml){
  if(/<!DOCTYPE|<!ENTITY/i.test(xml))throw new Error('Unsupported sitemap declaration');
  const rows=new Map();
  for(const block of xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/g)){
    const urls=[...block[1].matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)],dates=[...block[1].matchAll(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/g)];
    if(urls.length!==1||dates.length!==1||!canonical(urls[0][1])||!day(dates[0][1])||rows.has(urls[0][1]))throw new Error('Invalid or duplicate sitemap entry');
    rows.set(urls[0][1],dates[0][1]);
  }
  if(!rows.size)throw new Error('Empty sitemap');
  return rows;
}
export function planNotification({beforeXml,afterXml,allowedUrls,changes,today=new Date().toISOString().slice(0,10),maxUrls=20}){
  if(!day(today)||!Number.isInteger(maxUrls)||maxUrls<1||maxUrls>20)throw new Error('Invalid notification bounds');
  const before=sitemapDates(beforeXml),after=sitemapDates(afterXml),allowed=new Set(allowedUrls);
  if(allowed.size!==allowedUrls.length||[...allowed].some(u=>!canonical(u))||before.size!==allowed.size||after.size!==allowed.size||[...before.keys(),...after.keys()].some(u=>!allowed.has(u)))throw new Error('Sitemap canonical set changed; review required');
  const reviewed=new Map();
  for(const change of changes||[]){if(reviewed.has(change.url))throw new Error('Duplicate review');reviewed.set(change.url,change);}
  const urls=[];
  for(const [url,date] of after){
    if(date>today)throw new Error('Future lastmod');
    if(before.get(url)===date||new URL(url).pathname===protectedPath)continue;
    const evidence=reviewed.get(url);
    if(!evidence||evidence.lastmod!==date||!evidence.reason||!evidence.sourcePaths?.length)throw new Error('Changed date lacks matching content review');
    // A timestamp correction backwards or an old historical page is not a new-content signal.
    if(date<before.get(url)||(Date.parse(today)-Date.parse(date))/86400000>30)continue;
    urls.push(url);
  }
  if(urls.length>maxUrls)throw new Error('More than 20 reviewed changes; split and review the batch');
  return urls.sort();
}
const blocks=value=>/\b(noindex|none)\b/i.test(value||'');
function attributes(tag){return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map(m=>[m[1].toLowerCase(),m[3]]));}
export async function verifyPage(url,fetcher=fetch){
  if(!canonical(url)||new URL(url).pathname===protectedPath)throw new Error('URL not eligible');
  const response=await fetcher(url,{redirect:'manual',signal:AbortSignal.timeout(20000)});
  if(response.status!==200||response.redirected||blocks(response.headers.get('x-robots-tag'))||!response.headers.get('content-type')?.toLowerCase().includes('text/html'))throw new Error('Page not directly indexable');
  const body=await response.text();if(body.length>2000000)throw new Error('Oversized page');
  const canonicals=[...body.matchAll(/<link\b[^>]*>/gi)].map(m=>attributes(m[0])).filter(a=>(a.rel||'').toLowerCase().split(/\s+/).includes('canonical'));
  const robots=[...body.matchAll(/<meta\b[^>]*>/gi)].map(m=>attributes(m[0])).filter(a=>/^(robots|bingbot|googlebot)$/i.test(a.name||''));
  if(canonicals.length!==1||canonicals[0].href!==url||robots.some(a=>blocks(a.content)))throw new Error('Canonical or robots verification failed');
}
export async function notify({key,urls,fetcher=fetch}){
  if(!/^[a-f0-9]{32}$/.test(key)||!Array.isArray(urls)||urls.length>20||new Set(urls).size!==urls.length||urls.some(u=>!canonical(u)||new URL(u).pathname===protectedPath))throw new Error('Invalid notification');
  if(!urls.length)return {status:'no_changes',httpStatus:null,urls:[],indexingStatus:'UNKNOWN'};
  const keyLocation=ORIGIN+'/'+key+'.txt';
  const proof=await fetcher(keyLocation,{redirect:'manual',signal:AbortSignal.timeout(20000)});
  if(proof.status!==200||proof.redirected||(await proof.text()).trim()!==key)throw new Error('Live ownership key not verified');
  for(const url of urls)await verifyPage(url,fetcher);
  const response=await fetcher(ENDPOINT,{method:'POST',redirect:'error',headers:{'content-type':'application/json; charset=utf-8'},body:JSON.stringify({host:new URL(ORIGIN).hostname,key,keyLocation,urlList:urls}),signal:AbortSignal.timeout(20000)});
  if(response.status!==200&&response.status!==202)throw new Error('IndexNow HTTP '+response.status+'; not retried automatically'+(/^\d{1,7}$/.test(response.headers.get('retry-after')||'')?'; Retry-After seconds: '+response.headers.get('retry-after'):''));
  return {status:response.status===200?'submitted':'received_key_validation_pending',httpStatus:response.status,urls,liveKeyFileVerified:true,engineKeyValidation:response.status===202?'pending':'not_reported',indexingStatus:'UNKNOWN'};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
const root=fileURLToPath(new URL('../',import.meta.url));
const out=process.env.INDEXNOW_OUT_DIR||'/tmp/sankkostnaden-indexnow';
const read=file=>fs.readFile(path.join(root,file),'utf8');
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
let receipt={generatedAt:new Date().toISOString(),status:'failed',indexingStatus:'UNKNOWN'};
try{
  const head=git('rev-parse','HEAD');
  let base=process.env.INDEXNOW_BASE_SHA||git('rev-parse','HEAD^1');
  const files=(await fs.readdir(path.join(root,'public'))).filter(name=>/^[a-f0-9]{32}\.txt$/.test(name));
  if(files.length!==1)throw new Error('Exactly one public ownership key file is required');
  const baseline=JSON.parse(await read('tests/fixtures/seo-continuity-baseline.json'));
  const manifest=JSON.parse(await read('autopilot/search-content-changes.json'));
  if(!process.env.INDEXNOW_BASE_SHA&&manifest.indexNowBootstrapBaseCommit){
    let keyExisted=true;try{git('cat-file','-e',base+':public/'+files[0]);}catch{keyExisted=false;}
    if(!keyExisted)base=manifest.indexNowBootstrapBaseCommit;
  }
  if(!/^[a-f0-9]{40}$/.test(base))throw new Error('Invalid base commit');
  git('merge-base','--is-ancestor',base,head);
  const beforeXml=git('show',base+':public/sitemap.xml'),afterXml=await read('public/sitemap.xml');
  const evidenceErrors=validateSitemapLastmod({sitemap:afterXml,manifest,baseline});
  if(evidenceErrors.length)throw new Error('Sitemap evidence verification failed: '+evidenceErrors.join('; '));
  const urls=planNotification({beforeXml,afterXml,allowedUrls:baseline.pages.map(p=>p.canonical),changes:manifest.changes});
  receipt={...receipt,sourceCommit:head,baseCommit:base,urls,status:urls.length?'prepared_not_submitted':'no_changes'};
  if(process.argv.includes('--submit')&&urls.length){
    const key=(await read('public/'+files[0])).trim();
    if(files[0]!==key+'.txt')throw new Error('Key file/content mismatch');
    receipt={...receipt,...await notify({key,urls})};
  }
}catch(error){receipt={...receipt,status:'failed',error:error.message};process.exitCode=1;}
await fs.mkdir(out,{recursive:true});await fs.writeFile(path.join(out,'indexnow-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt,null,2));

}
