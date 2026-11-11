import {expect,test} from '@playwright/test';
import { getSocialPreviewImage } from '../lib/socialPreview';

/** Keep the protected quarter-price observation intact. Other guides deliver
 * their factual answer before offering another decision, with commercial exits intact. */
const pages=[
 {path:'/elavtal/kvartspris/',category:'el',label:'Hjälp mig välja avtalsform'},
 {path:'/mobil/familjeabonnemang/',category:'mobil',label:'Hjälp mig välja surf'},
 {path:'/forsakring/hemforsakring-bostadsratt/',category:'forsakring',label:'Kontrollera mitt skydd'},
 {path:'/bredband/utan-bindningstid/',category:'bredband',label:'Hjälp mig välja hastighet'},
 {path:'/ekonomi/jamfor-privatlan/',category:'ekonomi',label:'Se hushållets kostnader'},
] as const;

for(const {path,label} of pages){
 test('P0 guide keeps quick actions and original SEO identity '+path,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(path+'?qa=1');
  const gateway=page.locator('.decisionGatewayCompact');
  await expect(gateway).toBeVisible();
  const first= gateway.locator('a.gatewayDirect');
  await expect(first).toBeVisible();
  const second=gateway.getByRole('link',{name:new RegExp(label,'i')});
  await expect(second).toBeVisible();
  const rect=await gateway.boundingBox();
  expect(rect?.height||0,'compact guide entry height').toBeLessThan(325);
  const flow=page.getByTestId('guide-reading-flow');
  await expect(flow).toBeVisible();
  const contentAfter=await flow.boundingBox();
  if(path==='/elavtal/kvartspris/'){
   expect((contentAfter?.y||0)-(rect?.y||0)).toBeGreaterThan(0);
   expect((contentAfter?.y||0)-(rect?.y||0)).toBeLessThan(365);
  }else{
   expect(contentAfter!.y).toBeLessThan(rect!.y);
   const summary=page.locator('#guide-summary');
   await expect(summary.getByTestId('guide-reading-flow')).toBeVisible();
   await expect(page.getByTestId('editorial-guide-hero').getByRole('link',{name:'Börja med råden'})).toHaveAttribute('href','#guide-summary');
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se'+path);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
for(const width of [360,390,430,1024,1440]){
 test('P0 guide starts immediately with real choices at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:width<=430?844:900});
  await page.goto('/elavtal/kvartspris/?qa=1',{waitUntil:'networkidle'});
  const g=page.locator('.decisionGatewayCompact');
  const actions=g.locator('.gatewayPaths a');
  await expect(actions).toHaveCount(2);
  const size=await g.boundingBox();
  expect(size?.height||0).toBeLessThan(width<650?325:225);
  await page.screenshot({path:'test-results/screenshots/experience-p0-guide-fast-entry-'+width+'.png',fullPage:true});
 });
}

test('share images use only owned fixed assets and exclude active or prototype routes',()=>{
  expect(getSocialPreviewImage('/mobil/familjeabonnemang/?qa=1#guide-summary')?.url).toBe('https://sankkostnaden.se/design/category-mobil.webp');
  expect(getSocialPreviewImage('/mobilitet/')?.url).toBe('https://sankkostnaden.se/design/cost-map-home.webp');
  for(const path of ['/elavtal/kvartspris/','/forsakring/hemforsakring-bostadsratt/','/experiments/mobile-surf-pilot/','/experiments/','/404','/_error']){
    expect(getSocialPreviewImage(path)).toBeNull();
  }
});

test('share image metadata exists once in server HTML and references a real owned image',async({page,request})=>{
  for(const path of ['/','/bredband/100-100/','/elavtal/rorligt-elpris/','/mobil/familjeabonnemang/','/forsakring/trygghetsforsakring/','/ekonomi/jamfor-privatlan/','/om/']){
    const expected=getSocialPreviewImage(path)!;
    const response=await request.get(path+'?qa=1');
    expect(response.ok()).toBeTruthy();
    const html=await response.text();
    expect(html.match(/property="og:image"/g)||[]).toHaveLength(1);
    expect(html.match(/name="twitter:image"/g)||[]).toHaveLength(1);
    expect(html).toContain(`content="${expected.url}"`);
    const asset=await request.get(new URL(expected.url).pathname);
    expect(asset.status()).toBe(200);
    expect(asset.headers()['content-type']).toContain('image/webp');
    await page.goto(path+'?qa=1');
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content',expected.url);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content',expected.url);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content',String(expected.width));
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content',String(expected.height));
    const size=await page.evaluate(async src=>new Promise<{width:number;height:number}>((resolve,reject)=>{
      const image=new Image();image.onload=()=>resolve({width:image.naturalWidth,height:image.naturalHeight});image.onerror=()=>reject(Error('Image did not load'));image.src=src;
    }),new URL(expected.url).pathname);
    expect(size).toEqual({width:expected.width,height:expected.height});
  }
});

test('share metadata reconciles on real Next links into and out of protected guides',async({page})=>{
  await page.goto('/forsakring/?qa=1');
  await page.evaluate(()=>{(window as Window&{shareNavigationMarker?:string}).shareNavigationMarker='same-document';});
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://sankkostnaden.se/design/category-forsakring.webp');
  await page.locator('a[href="/forsakring/hemforsakring-bostadsratt/"]').first().click();
  await expect(page).toHaveURL(/\/forsakring\/hemforsakring-bostadsratt\//);
  await expect(page.locator('meta[property="og:image"],meta[name="twitter:image"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/');
  await page.locator('.topbar a[href="/mobil/"]').click();
  await expect(page).toHaveURL(/\/mobil\//);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://sankkostnaden.se/design/category-mobil.webp');
  await page.locator('.topbar a[href="/elavtal/"]').click();
  await page.locator('a[href="/elavtal/kvartspris/"]').first().click();
  await expect(page).toHaveURL(/\/elavtal\/kvartspris\//);
  await expect(page.locator('meta[property="og:image"],meta[name="twitter:image"]')).toHaveCount(0);
  await page.locator('.topbar a[href="/bredband/"]').click();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content','https://sankkostnaden.se/design/category-bredband.webp');
  expect(await page.evaluate(()=>(window as Window&{shareNavigationMarker?:string}).shareNavigationMarker)).toBe('same-document');
});
