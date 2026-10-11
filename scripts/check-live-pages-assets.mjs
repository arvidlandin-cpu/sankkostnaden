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
const [a,b]=await Promise.all([assets(preview),assets(live)]);
const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
const result={
  preview:a.url,live:b.url,
  previewAssets:{css:a.css.length,js:a.js.length},
  liveAssets:{css:b.css.length,js:b.js.length},
  cssExactMatch:same(a.css,b.css),
  jsExactMatch:same(a.js,b.js),
  missingCssInLive:a.css.filter(x=>!b.css.includes(x)),
  missingJsInLive:a.js.filter(x=>!b.js.includes(x)),
  extraCssOnLive:b.css.filter(x=>!a.css.includes(x)),
  extraJsOnLive:b.js.filter(x=>!a.js.includes(x))
};
console.log(JSON.stringify(result,null,2));
if(!result.cssExactMatch||!result.jsExactMatch)
  throw new Error('Pages preview and custom domain use different compiled assets; DO NOT claim deploy equivalence');
console.log('PASS: custom domain and chosen Pages preview serve identical Next static asset fingerprints.');
console.log('This verifies asset identity, NOT exact served Cloudflare custom-domain SHA or physical iPhone.');
