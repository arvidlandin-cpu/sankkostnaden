/**
 * P0G read-only release audit.
 * Compares built JS/CSS product asset paths from current source tree with
 * the actual response from sankkostnaden.se. No Cloudflare key, cookies or writes.
 * A match proves product asset identity, not an exact origin commit SHA,
 * user acceptance, or real-device / conversion QA.
 */
import fs from 'node:fs';
const base='https://sankkostnaden.se';
const routes=[
 ['/',null],
 ['/bredband/','p0g-insight-bredband'],
 ['/elavtal/','p0g-insight-el'],
 ['/mobil/','p0g-insight-mobil'],
 ['/forsakring/','p0g-insight-forsakring'],
 ['/ekonomi/','p0g-insight-ekonomi'],
 ['/elavtal/kvartspris/',null]
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const assets=html=>{
 const matches=[...html.matchAll(/\/_next\/static\/[^"'<>\s?#]+/g)].map(x=>x[0].replace(/&amp;/g,'&'));
 const css=[...new Set(matches.filter(p=>p.endsWith('.css')))].sort();
 const js=[...new Set(matches.filter(p=>p.endsWith('.js')&&!/_buildManifest\.js$|_ssgManifest\.js$/.test(p)))].sort();
 return {css,js};
};
async function fetchWithRetry(url){
 let last;
 for(let n=0;n<4;n++){
  try{
   const response=await fetch(url,{signal:AbortSignal.timeout(24000),headers:{accept:'text/html','user-agent':'Sankkostnaden-P0G-release-audit/1.0','cache-control':'no-cache'}});
   if(!response.ok)throw Error('HTTP '+response.status);
   return await response.text();
  }catch(error){last=error;if(n<3)await new Promise(resolve=>setTimeout(resolve,3500));}
 }
 throw last;
}
let count=0;
for(const [route,marker] of routes){
 const local=fs.readFileSync('out/'+(route==='/'?'':route.slice(1))+'index.html','utf8');
 const live=await fetchWithRetry(base+route+'?release-audit=20261012');
 const a=assets(local),b=assets(live);
 const markerPresent=marker?live.includes(marker):true;
 const good=a.css.length>0&&a.js.length>=3&&same(a.css,b.css)&&same(a.js,b.js)&&markerPresent;
 const result={
  route,
  exactCSSAssetPaths:same(a.css,b.css),
  exactProductJSAssetPaths:same(a.js,b.js),
  sourceCounts:{css:a.css.length,js:a.js.length},
  publicCounts:{css:b.css.length,js:b.js.length},
  expectedP0GHTMLMarker:marker||'not-required',
  p0gMarkerPresent:markerPresent,
  missingCSS:a.css.filter(p=>!b.css.includes(p)),
  missingJS:a.js.filter(p=>!b.js.includes(p)).slice(0,12),
  outcome:good?'MATCH':'MISMATCH'
 };
 console.log(JSON.stringify(result));
 if(good)count++;
}
if(count!==routes.length){
 console.error('NOT VERIFIED: '+count+'/'+routes.length+' routes have live CSS/JS and P0G HTML identity');
 process.exitCode=1;
}else{
 console.log('VERIFIED LIVE PRODUCT ASSET IDENTITY: '+count+'/'+routes.length+' routes match current exported JS/CSS with P0G HTML markers.');
 console.log('An identical product asset fingerprint is NOT proof of exact served Git commit, real iPhone QA or visual/commercial success.');
}
