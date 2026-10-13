/**
 * P0I 2026-10-13 read-only public release verification.
 * Compares SOURCE-EXPORTED client CSS and real product JS file fingerprints
 * against actually served pages on sankkostnaden.se. Additional independently
 * served HTML guards verify approved P0I sunlit family imagery and retained P0G
 * category journeys. DO NOT equate with exact origin-side SHA or owner signoff.
 */
import fs from 'node:fs';
const origin='https://sankkostnaden.se';
const checks=[
 {route:'/',p0i:'39997379'},
 {route:'/bredband/',p0i:'4008771',photo:'p0h-hero-photo-bredband',insight:'p0g-insight-bredband'},
 {route:'/elavtal/',photo:'p0h-hero-photo-el',insight:'p0g-insight-el'},
 {route:'/mobil/',photo:'p0h-hero-photo-mobil',insight:'p0g-insight-mobil'},
 {route:'/forsakring/',photo:'p0h-hero-photo-forsakring',insight:'p0g-insight-forsakring'},
 {route:'/ekonomi/',photo:'p0h-hero-photo-ekonomi',insight:'p0g-insight-ekonomi'},
 {route:'/elavtal/kvartspris/'}
];
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function collect(html){
 const all=[...html.matchAll(/\/_next\/static\/[^"'<>\s?#]+/g)].map(m=>m[0].replace(/&amp;/g,'&'));
 return {css:[...new Set(all.filter(s=>s.endsWith('.css')))].sort(),
         js:[...new Set(all.filter(s=>s.endsWith('.js')&&!/_buildManifest\.js$|_ssgManifest\.js$/.test(s)))].sort()};
}
let successful=0;
for(const check of checks){
 const local=fs.readFileSync('out/'+(check.route==='/'?'':check.route.slice(1))+'index.html','utf8');
 const url=origin+check.route+'?p0i_release_audit=20261013';
 const response=await fetch(url,{headers:{'cache-control':'no-cache','accept':'text/html','user-agent':'Sankkostnaden-P0I-independent-release-audit/1.0'},signal:AbortSignal.timeout(24000)});
 if(!response.ok){console.error('LIVE HTTP FAILURE '+response.status+' '+url);process.exitCode=1;continue;}
 const live=await response.text();
 const own=collect(local),remote=collect(live);
 const css=same(own.css,remote.css),js=same(own.js,remote.js);
 const family=check.p0i?live.includes(check.p0i):true;
 const photo=check.photo?live.includes(check.photo):true;
 const insight=check.insight?live.includes(check.insight):true;
 const ok=own.css.length>0&&own.js.length>=3&&css&&js&&family&&photo&&insight;
 console.log('P0I_RELEASE '+JSON.stringify({
   route:check.route,cssExact:css,productJsExact:js,
   p0iApprovedPhotoIdPresent:family,categoryPhotoMarker:photo,p0gCategoryInsight:insight,
   localCounts:{css:own.css.length,js:own.js.length},publicCounts:{css:remote.css.length,js:remote.js.length},
   missingCss:own.css.filter(f=>!remote.css.includes(f)).slice(0,8),
   missingJs:own.js.filter(f=>!remote.js.includes(f)).slice(0,8),outcome:ok?'PASS':'MISMATCH'
 }));
 if(ok)successful++;
}
console.log('P0I_LIVE_CLIENT_MATCH '+successful+'/'+checks.length);
if(successful!==checks.length){process.exitCode=1;console.error('P0I live product client asset parity NOT verified. Do not claim deployed.');}
else console.log('VERIFIED public P0I client CSS/JS and HTML marker identity on seven URLs; not proof of exact origin SHA, physical iPhone testing, owner visual acceptance or affiliate payout.');
