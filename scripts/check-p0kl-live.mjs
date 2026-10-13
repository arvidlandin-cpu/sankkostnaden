/** P0K/P0L read-only public source/client parity; source bundle versus actual custom domain. */
import fs from 'node:fs';
const origin='https://sankkostnaden.se';
const checks=[
 {route:'/',markers:['39997379','home-decision-explorer']},
 {route:'/bredband/',markers:['category-journey-bredband','p0h-hero-photo-bredband']},
 {route:'/elavtal/',markers:['category-journey-el','p0h-hero-photo-el']},
 {route:'/mobil/',markers:['category-journey-mobil','p0h-hero-photo-mobil']},
 {route:'/forsakring/',markers:['category-journey-forsakring','p0h-hero-photo-forsakring']},
 {route:'/ekonomi/',markers:['category-journey-ekonomi','p0h-hero-photo-ekonomi']},
 {route:'/bredband/vilken-hastighet-behover-jag/',markers:['smartselector-flow','smartselector-active-question']},
 {route:'/mobil/hur-mycket-surf-behover-jag/',markers:['smartselector-flow','smartselector-active-question']},
 {route:'/elavtal/vilket-elavtal-passar-mig/',markers:['smartselector-flow','smartselector-active-question']},
 {route:'/elavtal/kvartspris/',markers:[]}
];
function collect(html){
 const all=[...html.matchAll(/\/_next\/static\/[^"'<>\s?#]+/g)].map(m=>m[0].replace(/&amp;/g,'&'));
 return {css:[...new Set(all.filter(s=>s.endsWith('.css')))].sort(),
         js:[...new Set(all.filter(s=>s.endsWith('.js')&&!/_buildManifest\.js$|_ssgManifest\.js$/.test(s)))].sort()};
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
let pass=0;
for(const x of checks){
 let local='',live='';
 try{
  local=fs.readFileSync('out/'+(x.route==='/'?'':x.route.slice(1))+'index.html','utf8');
  const url=origin+x.route+'?p0kl_live_proof=20261013';
  const res=await fetch(url,{headers:{'cache-control':'no-cache','accept':'text/html','user-agent':'Sankkostnaden-P0KL-readonly-release-check/1.0'},signal:AbortSignal.timeout(25000)});
  if(!res.ok)throw new Error('HTTP '+res.status);
  live=await res.text();
 }catch(error){console.error('P0KL '+x.route+' ERROR '+String(error));process.exitCode=1;continue}
 const src=collect(local),pub=collect(live),css=same(src.css,pub.css),js=same(src.js,pub.js);
 const markerResults=x.markers.map(marker=>({marker,present:live.includes(marker)}));
 const ok=src.css.length>0&&src.js.length>=3&&css&&js&&markerResults.every(x=>x.present);
 console.log('P0KL_ROUTE '+JSON.stringify({route:x.route,cssExact:css,productJsExact:js,markers:markerResults,outcome:ok?'PASS':'MISMATCH',
 missingCss:src.css.filter(z=>!pub.css.includes(z)).slice(0,6),missingJs:src.js.filter(z=>!pub.js.includes(z)).slice(0,6),
 sourceCounts:{css:src.css.length,js:src.js.length},liveCounts:{css:pub.css.length,js:pub.js.length}}));
 if(ok)pass++;else process.exitCode=1;
}
console.log('P0KL_LIVE_SOURCE_ASSET_PARITY '+pass+'/'+checks.length);
if(pass===checks.length)console.log('PASS custom-domain CSS and actual product-JS identity, NOT proof of Cloudflare origin SHA, physical iPhone UX, owner signoff, qualified organic conversions or approved affiliate revenue.');
else console.error('FAIL: source/client parity on current public domain not established; do not claim live product update.');
