import test from 'node:test';
import assert from 'node:assert/strict';
import {ORIGIN,ENDPOINT,sitemapDates,planNotification,notify,verifyPage,canonical} from '../scripts/indexnow-submit.mjs';
const a=ORIGIN+'/forsakring/jamfor-forsakring/',b=ORIGIN+'/forsakring/hemforsakring-bostadsratt/',q=ORIGIN+'/elavtal/kvartspris/';
const xml=(urls,date)=>'<urlset>'+urls.map(url=>`<url><loc>${url}</loc><lastmod>${date}</lastmod></url>`).join('')+'</urlset>';
const review=urls=>urls.map(url=>({url,lastmod:'2026-10-26',reason:'Reviewed substantive copy',sourcePaths:['pages/example.tsx']}));
const plan=(overrides={})=>planNotification({beforeXml:xml([a,b],'2026-09-24'),afterXml:xml([a,b],'2026-10-26'),allowedUrls:[a,b],changes:review([a,b]),today:'2026-10-26',...overrides});
const key='a'.repeat(32);
const page=(url,extra='')=>new Response(`<link rel="canonical" href="${url}"><meta name="robots" content="index,follow">${extra}`,{headers:{'content-type':'text/html; charset=utf-8'}});
function server({status=200,badKey=false,badPage=false,headers={}}={}){
 const calls=[];return {calls,fetcher:async(url,options={})=>{calls.push({url,options});if(url===ENDPOINT)return new Response('',{status,headers});if(url.endsWith('.txt'))return new Response(badKey?'wrong':key);return badPage?page(url,'<meta name="bingbot" content="noindex">'):page(url);}};
}
test('only explicitly reviewed changed canonicals enter the batch',()=>{assert.deepEqual(plan(),[b,a].sort());});
test('unchanged sitemap dates never send a cosmetic/build notification',()=>{assert.deepEqual(plan({afterXml:xml([a,b],'2026-09-24'),changes:[]}),[]);});
test('protected quarter-price never enters the batch',()=>{assert.deepEqual(plan({beforeXml:xml([q],'2026-09-20'),afterXml:xml([q],'2026-10-26'),allowedUrls:[q],changes:review([q])}),[]);});
test('foreign, private-parameter and alias URLs are rejected',()=>{for(const value of ['https://example.com/x/',a+'?email=a@b.test',a+'#x','http://sankkostnaden.se/x/',ORIGIN+'/x',ORIGIN+'/x/../'])assert.equal(canonical(value),false);});
test('invalid, duplicate and changed sitemap URL sets fail closed',()=>{assert.throws(()=>sitemapDates(xml([a,a],'2026-10-26')));assert.throws(()=>sitemapDates(xml([a],'2026-02-30')));assert.throws(()=>sitemapDates('<!DOCTYPE x><urlset/>'));assert.throws(()=>plan({allowedUrls:[a]}));});
test('future or unreviewed changes cannot notify',()=>{assert.throws(()=>plan({today:'2026-10-25'}));assert.throws(()=>plan({changes:[]}));assert.throws(()=>plan({changes:[...review([a,b]),...review([a])]}));});
test('old history and backwards timestamp corrections are not new-change signals',()=>{assert.deepEqual(plan({beforeXml:xml([a,b],'2026-10-26'),afterXml:xml([a,b],'2026-09-24'),changes:review([a,b]).map(r=>({...r,lastmod:'2026-09-24'}))}),[]);assert.deepEqual(plan({today:'2026-12-01'}),[]);});
test('a batch over twenty requires explicit review rather than silent truncation',()=>{const urls=Array.from({length:21},(_,i)=>ORIGIN+'/guide/'+i+'/');assert.throws(()=>plan({beforeXml:xml(urls,'2026-09-24'),afterXml:xml(urls,'2026-10-26'),allowedUrls:urls,changes:review(urls)}));});
test('empty notification does no network IO',async()=>{const result=await notify({key,urls:[],fetcher:()=>{throw new Error('Must not fetch')}});assert.equal(result.status,'no_changes');});
test('200 records receipt, not indexing, and sends one protocol payload',async()=>{const s=server();const result=await notify({key,urls:[a,b],fetcher:s.fetcher});assert.equal(result.status,'submitted');assert.equal(result.indexingStatus,'UNKNOWN');assert.equal(result.liveKeyFileVerified,true);const posts=s.calls.filter(c=>c.url===ENDPOINT);assert.equal(posts.length,1);assert.deepEqual(JSON.parse(posts[0].options.body),{host:'sankkostnaden.se',key,keyLocation:ORIGIN+'/'+key+'.txt',urlList:[a,b]});assert(!JSON.stringify(result).includes(key));});
test('202 keeps engine key validation pending despite our live-key preflight',async()=>{const s=server({status:202});const result=await notify({key,urls:[a],fetcher:s.fetcher});assert.equal(result.status,'received_key_validation_pending');assert.equal(result.engineKeyValidation,'pending');assert.equal(result.indexingStatus,'UNKNOWN');assert.equal(result.liveKeyFileVerified,true);});
test('missing/mismatched live key and noindex pages prevent all API submissions',async()=>{for(const options of [{badKey:true},{badPage:true}]){const s=server(options);await assert.rejects(notify({key,urls:[a],fetcher:s.fetcher}));assert.equal(s.calls.filter(c=>c.url===ENDPOINT).length,0);}});
test('redirects, wrong canonical and header noindex fail preflight',async()=>{for(const response of [new Response('',{status:302}),page(b),new Response(`<link rel="canonical" href="${a}">`,{headers:{'content-type':'text/html','x-robots-tag':'noindex'}})])await assert.rejects(verifyPage(a,async()=>response));});
test('403/422/429 fail visibly without automatic retry',async()=>{for(const status of [403,422,429]){const s=server({status,headers:{'retry-after':'3600'}});await assert.rejects(notify({key,urls:[a],fetcher:s.fetcher}),new RegExp('HTTP '+status));assert.equal(s.calls.filter(c=>c.url===ENDPOINT).length,1);}});
test('direct callers cannot submit duplicates, arbitrary hosts or quarter-price',async()=>{for(const urls of [[a,a],[q],['https://example.com/']])await assert.rejects(notify({key,urls}));});

// Real CLI/bootstrap coverage in isolated Git histories. Every child has a fetch
// tripwire; these tests never submit to an external service or touch the checkout.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
const gitIn=(cwd,...args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['pipe','pipe','pipe']}).trim();
async function fixture(t,{existingKey=false}={}){
 const reviewDate=new Date().toISOString().slice(0,10);
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'sk-indexnow-cli-'));
 t.after(()=>fs.rm(root,{recursive:true,force:true}));
 for(const dir of ['scripts','public','autopilot','tests/fixtures'])await fs.mkdir(path.join(root,dir),{recursive:true});
 for(const file of ['indexnow-submit.mjs','check-sitemap-lastmod.mjs'])await fs.copyFile(new URL('../scripts/'+file,import.meta.url),path.join(root,'scripts',file));
 const allowed=[a,b,q,...Array.from({length:60},(_,i)=>ORIGIN+'/guide/fixture-'+i+'/')];
 const makeXml=changed=>'<urlset>'+allowed.map(url=>`<url><loc>${url}</loc><lastmod>${changed&&[a,b].includes(url)?reviewDate:'2026-09-20'}</lastmod></url>`).join('')+'</urlset>';
 const write=(file,data)=>fs.writeFile(path.join(root,file),typeof data==='string'?data:JSON.stringify(data));
 await write('public/sitemap.xml',makeXml(false));
 await write('tests/fixtures/seo-continuity-baseline.json',{pages:allowed.map(canonical=>({canonical}))});
 if(existingKey)await write('public/'+key+'.txt',key+'\n');
 gitIn(root,'init','--quiet');gitIn(root,'config','user.name','Offline Test');gitIn(root,'config','user.email','offline@example.invalid');
 gitIn(root,'add','.');gitIn(root,'commit','--quiet','-m','before reviewed content');const ancestor=gitIn(root,'rev-parse','HEAD');
 await write('marker.txt','unrelated prior change');gitIn(root,'add','.');gitIn(root,'commit','--quiet','-m','unrelated intermediate commit');const parent=gitIn(root,'rev-parse','HEAD');
 await write('public/sitemap.xml',makeXml(true));await write('public/'+key+'.txt',key+'\n');
 const manifest={schemaVersion:1,protectedPaths:['/elavtal/kvartspris/'],indexNowBootstrapBaseCommit:ancestor,changes:review([a,b]).map(x=>({...x,lastmod:reviewDate,evidence:'current-reviewed-content'}))};
 await write('autopilot/search-content-changes.json',manifest);
 gitIn(root,'add','.');gitIn(root,'commit','--quiet','-m','reviewed content and public key');
 await write('network-tripwire.mjs',"globalThis.fetch=async()=>{process.stderr.write('UNEXPECTED_NETWORK');throw new Error('No network permitted in offline CLI tests');};\n");
 const run=(override)=>{
  const out=path.join(root,'receipt');
  const env={...process.env,INDEXNOW_OUT_DIR:out};delete env.INDEXNOW_BASE_SHA;if(override!==undefined)env.INDEXNOW_BASE_SHA=override;
  const result=spawnSync(process.execPath,['--import',path.join(root,'network-tripwire.mjs'),path.join(root,'scripts/indexnow-submit.mjs')],{cwd:root,env,encoding:'utf8',timeout:15000});
  assert.ifError(result.error);assert.doesNotMatch(result.stderr,/UNEXPECTED_NETWORK/);
  return {...result,receipt:JSON.parse(result.stdout)};
 };
 return {root,ancestor,parent,manifest,write,run};
}

test('CLI uses the reviewed ancestor when the public ownership key is newly introduced',async t=>{
 const f=await fixture(t);const result=f.run();assert.equal(result.status,0);assert.equal(result.receipt.baseCommit,f.ancestor);
 assert.notEqual(result.receipt.baseCommit,f.parent);assert.deepEqual(result.receipt.urls,[a,b].sort());assert.equal(result.receipt.status,'prepared_not_submitted');assert.equal(result.receipt.indexingStatus,'UNKNOWN');
 const saved=JSON.parse(await fs.readFile(path.join(f.root,'receipt/indexnow-receipt.json'),'utf8'));assert.deepEqual(saved,result.receipt);
});

test('CLI uses HEAD first parent after the ownership key already exists',async t=>{
 const f=await fixture(t,{existingKey:true});const result=f.run();assert.equal(result.status,0);assert.equal(result.receipt.baseCommit,f.parent);assert.deepEqual(result.receipt.urls,[a,b].sort());
});

test('an explicit valid ancestor overrides the existing-key default',async t=>{
 const f=await fixture(t,{existingKey:true});const result=f.run(f.ancestor);assert.equal(result.status,0);assert.equal(result.receipt.baseCommit,f.ancestor);
});

test('an explicit first-parent override takes precedence over bootstrap selection',async t=>{
 const f=await fixture(t);const result=f.run(f.parent);assert.equal(result.status,0);assert.equal(result.receipt.baseCommit,f.parent);
});

test('invalid or non-ancestor explicit bases fail closed without network activity',async t=>{
 const f=await fixture(t);const disconnected=gitIn(f.root,'commit-tree','HEAD^{tree}','-m','disconnected test commit');
 for(const base of ['HEAD^1','a'.repeat(40),disconnected]){
  const result=f.run(base);assert.equal(result.status,1);assert.equal(result.receipt.status,'failed');assert.equal(result.receipt.indexingStatus,'UNKNOWN');assert.equal(result.receipt.urls,undefined);
 }
});

test('an invalid or non-ancestor reviewed bootstrap cannot fall back silently',async t=>{
 const f=await fixture(t);const disconnected=gitIn(f.root,'commit-tree','HEAD^{tree}','-m','disconnected bootstrap');
 for(const base of ['not-a-commit',disconnected]){
  await f.write('autopilot/search-content-changes.json',{...f.manifest,indexNowBootstrapBaseCommit:base});
  const result=f.run();assert.equal(result.status,1);assert.equal(result.receipt.status,'failed');assert.equal(result.receipt.urls,undefined);
 }
});

test('importing the module performs no Git work, network request or receipt write',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'sk-indexnow-import-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));
 const receipt=path.join(root,'must-not-exist');const moduleUrl=new URL('../scripts/indexnow-submit.mjs',import.meta.url).href;
 const code=`globalThis.fetch=async()=>{throw new Error('Unexpected network');}; await import(${JSON.stringify(moduleUrl)}); console.log('IMPORT_ONLY_OK');`;
 const result=spawnSync(process.execPath,['--input-type=module','-e',code],{cwd:root,env:{...process.env,INDEXNOW_OUT_DIR:receipt},encoding:'utf8',timeout:15000});
 assert.ifError(result.error);assert.equal(result.status,0);assert.equal(result.stdout.trim(),'IMPORT_ONLY_OK');assert.equal(result.stderr,'');
 await assert.rejects(fs.access(receipt));
});
