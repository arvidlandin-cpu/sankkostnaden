/**
 * Read-only production asset identity for post-merge P0J leaf guides.
 * Real public-domain HTML is compared with Next static export for exact
 * CSS+product JS filenames, photo IDs and genuine same-page CTA targets.
 */
import fs from 'node:fs';
const host='https://sankkostnaden.se';
const cases=[
 {path:'/bredband/fiber/',photo:'4260743'},
 {path:'/elavtal/rorligt-elpris/',photo:'8055828'},
 {path:'/mobil/5g-abonnemang/',photo:'4254149'},
 {path:'/forsakring/jamfor-hemforsakring/',photo:'27177239'},
 {path:'/ekonomi/samlingslan/',photo:'6964105'},
 {path:'/elavtal/kvartspris/',hold:true},
];
function assets(html){
 const all=[...html.matchAll(/\/_next\/static\/[^"'<>\s?#]+/g)].map(x=>x[0].replace(/&amp;/g,'&'));
 return {css:[...new Set(all.filter(x=>x.endsWith('.css')))].sort(),
  js:[...new Set(all.filter(x=>x.endsWith('.js')&&!/_buildManifest\.js$|_ssgManifest\.js$/.test(x)))].sort()};
}
let ok=0;
for(const row of cases){
 try{
  const local=fs.readFileSync('out/'+row.path.slice(1)+'index.html','utf8');
  const rsp=await fetch(host+row.path+'?p0j_audit=20261013',{headers:{'cache-control':'no-cache','user-agent':'SankKostnaden-readonly-public-release-check/1'},signal:AbortSignal.timeout(25000)});
  if(!rsp.ok)throw Error('live HTTP '+rsp.status);
  const live=await rsp.text();
  const a=assets(local),b=assets(live);
  const css=a.css.length>0&&JSON.stringify(a.css)===JSON.stringify(b.css);
  const js=a.js.length>=3&&JSON.stringify(a.js)===JSON.stringify(b.js);
  const photo=row.hold?!live.includes('data-testid="editorial-guide-hero"'):live.includes(row.photo)&&live.includes('data-testid="editorial-guide-hero"');
  const guide=row.hold?!live.includes('id="guide-summary"'):live.includes('id="guide-summary"')&&live.includes('id="guide-partners"');
  const pass=css&&js&&photo&&guide;
  console.log('P0J_PUBLIC '+JSON.stringify({route:row.path,css,productJs:js,approvedPhotoOrQuarterHold:photo,correctGuideOrQuarterMarkup:guide,outcome:pass?'PASS':'MISMATCH',sourceCss:a.css.length,publicCss:b.css.length,sourceJs:a.js.length,publicJs:b.js.length,missingCss:a.css.filter(x=>!b.css.includes(x)).slice(0,3),missingJs:a.js.filter(x=>!b.js.includes(x)).slice(0,3)}));
  if(pass)ok++;
 }catch(err){console.error('P0J_PUBLIC '+row.path+' ERROR '+String(err));}
}
console.log('P0J_PUBLIC_RELEASE_PASSED '+ok+'/'+cases.length);
if(ok!==cases.length){process.exitCode=1;console.error('Public client asset parity or quarter-price isolation not verified. Do not claim live.');}
else console.log('Verified six actual publicly served client asset sets and five photo+guide markers; origin SHA, owner live approval, real-phone browser, GA4 improvement and APPROVED commission not inferred.');
