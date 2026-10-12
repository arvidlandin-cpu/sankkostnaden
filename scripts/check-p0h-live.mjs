/**
 * Read-only P0H live acceptance gate (independent of GitHub merge).
 * Compares actual public HTML's CSS/product-JS paths to this branch's source
 * export and requires both new P0H photo markers and existing P0G insights.
 * Evidence of live client code identity, not origin Git SHA or device QA.
 */
import fs from 'node:fs';
const base='https://sankkostnaden.se';
const routes=[
 {path:'/',marker:'pexels-photo-3875141'},
 {path:'/bredband/',marker:'p0h-hero-photo-bredband',prior:'p0g-insight-bredband'},
 {path:'/elavtal/',marker:'p0h-hero-photo-el',prior:'p0g-insight-el'},
 {path:'/mobil/',marker:'p0h-hero-photo-mobil',prior:'p0g-insight-mobil'},
 {path:'/forsakring/',marker:'p0h-hero-photo-forsakring',prior:'p0g-insight-forsakring'},
 {path:'/ekonomi/',marker:'p0h-hero-photo-ekonomi',prior:'p0g-insight-ekonomi'},
 {path:'/elavtal/kvartspris/',marker:null}
];
function assets(html){
 const matches=[...html.matchAll(/\/_next\/static\/[^"'<>\s?#]+/g)].map(x=>x[0].replace(/&amp;/g,'&'));
 return {css:[...new Set(matches.filter(p=>p.endsWith('.css')))].sort(),
  js:[...new Set(matches.filter(p=>p.endsWith('.js')&&!/_buildManifest\.js$|_ssgManifest\.js$/.test(p)))].sort()};
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
let matches=0;
for(const route of routes){
 const local=fs.readFileSync('out/'+(route.path==='/'?'':route.path.slice(1))+'index.html','utf8');
 const response=await fetch(base+route.path+'?p0h-live=20261012',{headers:{'cache-control':'no-cache','user-agent':'Sankkostnaden-P0H-verify/1.0'},signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error(route.path+' live HTTP '+response.status);
 const live=await response.text();
 const source=assets(local),deployed=assets(live);
 const css=same(source.css,deployed.css),js=same(source.js,deployed.js);
 const marker=route.marker?live.includes(route.marker):true,prior=route.prior?live.includes(route.prior):true;
 const success=css&&js&&marker&&prior&&source.css.length>0&&source.js.length>=3;
 console.log(JSON.stringify({route:route.path,css,js,expectedPhotoMarker:route.marker||'n/a',p0hPhotoPresent:marker,p0gInsightPresent:prior,sourceCss:source.css.length,sourceJs:source.js.length,liveCss:deployed.css.length,liveJs:deployed.js.length,missingCss:source.css.filter(x=>!deployed.css.includes(x)),missingJs:source.js.filter(x=>!deployed.js.includes(x)).slice(0,6),outcome:success?'MATCH':'MISMATCH'}));
 if(success)matches++;
}
console.log('P0H_PUBLIC_CLIENT_PARITY '+matches+'/'+routes.length);
if(matches!==routes.length)process.exitCode=1;
else console.log('VERIFIED: new P0H client assets and HTML presence on public domain, not origin SHA, visual signoff, real iPhone or network-approved earnings.');
