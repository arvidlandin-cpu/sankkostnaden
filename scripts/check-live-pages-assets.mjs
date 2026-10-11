/**
 * Independently compare actual Next client assets from Pages preview and custom
 * domain; no Cloudflare keys, no production writes. Not exact served SHA proof.
 */
const preview=process.env.SK_PAGES_PREVIEW_URL;
const live=process.env.SK_CUSTOM_DOMAIN_URL||'https://sankkostnaden.se/';
if(!preview)throw new Error('Missing SK_PAGES_PREVIEW_URL');

async function assets(url) {
  const response=await fetch(url,{signal:AbortSignal.timeout(25000),headers:{'user-agent':'Sankkostnaden-P0D-QA/1.0','accept':'text/html'}});
  if(!response.ok)throw new Error(url+' responded '+response.status);
  const html=await response.text();
  const paths=[...html.matchAll(/\/_next\/static\/[^"'<>\s?#]+/g)].map(match=>match[0].replace(/&amp;/g,'&'));
  const css=[...new Set(paths.filter(v=>v.endsWith('.css')))].sort();
  const js=[...new Set(paths.filter(v=>v.endsWith('.js')))].sort();
  if(!css.length||js.length<3)throw new Error('Cannot find reliable Next assets at '+url+': css='+css.length+' js='+js.length);
  return {url,status:response.status,css,js};
}
// These manifests carry an opaque Next build ID. A docs-only rebuild may change
// their path without changing any actual product CSS or JS chunk.
const regularJs=paths=>paths.filter(p=>!/_buildManifest\.js$|_ssgManifest\.js$/.test(p));
const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const routes=["/","/app/","/elavtal/","/bredband/","/mobil/","/forsakring/","/ekonomi/","/elavtal/kvartspris/","/mobil/lonar-sig-familjeabonnemang/","/forsakring/hemforsakring-bostadsratt/","/guide/arskoll-fasta-kostnader/"];
const checks=[];
for(const route of routes) {
  const [a,b]=await Promise.all([
    assets(new URL(route,preview).toString()),
    assets(new URL(route,live).toString()),
  ]);
  const productA=regularJs(a.js),productB=regularJs(b.js);
  const result={
    route,
    previewAssets:{css:a.css.length,productJs:productA.length},
    liveAssets:{css:b.css.length,productJs:productB.length},
    cssExactMatch:same(a.css,b.css),
    productJsExactMatch:same(productA,productB),
    previewManifestIds:a.js.filter(x=>!productA.includes(x)),
    liveManifestIds:b.js.filter(x=>!productB.includes(x)),
    missingCssInLive:a.css.filter(x=>!b.css.includes(x)),
    missingProductJsInLive:productA.filter(x=>!productB.includes(x)),
  };
  console.log(JSON.stringify(result,null,2));
  checks.push(result);
}
if(checks.some(x=>!x.cssExactMatch||!x.productJsExactMatch||x.previewAssets.css<1||x.previewAssets.productJs<3))
  throw new Error('Pages preview and custom domain differ in actual product assets, NOT verified');
console.log('PASS: all '+checks.length+' routes have identical compiled CSS and actual JS chunks.');
console.log('Next build-ID manifests can differ after a docs-only rebuild.');
console.log('This is independent evidence of client-asset identity, NOT full origin SHA proof or real-device QA.');
