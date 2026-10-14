import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const categories=['el','bredband','mobil','forsakring','ekonomi'] as const;
const hubs=[['/elavtal/','el'],['/bredband/','bredband'],['/mobil/','mobil'],['/forsakring/','forsakring'],['/ekonomi/','ekonomi']] as const;
for(const width of [360,390,768,1440]){
 test('V10 homepage first useful action + sponsor links + mobile '+width,async({page})=>{
  await page.setViewportSize({width,height:width<768?844:950});
  const response=await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
  expect(response?.ok()).toBeTruthy();
  const v10=page.getByTestId('v10-journey');
  await expect(v10).toBeVisible();
  await expect(v10.getByRole('heading',{level:1,name:/Sänk kostnaden/})).toBeVisible();
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://sankkostnaden.se/');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/index,follow/);
  mkdirSync('test-results/v10',{recursive:true});
  await page.screenshot({path:'test-results/v10/home-start-'+width+'.png',fullPage:false,animations:'disabled'});
  for(const category of categories){
   await v10.getByTestId('v10-category-'+category).click();
   await expect(v10.getByTestId('v10-category-'+category)).toHaveAttribute('aria-pressed','true');
   const cards=v10.getByTestId('v10-partner-card');
   await expect(cards.first()).toBeVisible();
   expect(await cards.count()).toBeGreaterThan(0);
   expect(await cards.count()).toBeLessThanOrEqual(3);
   for(const anchor of await cards.all()){
    await expect(anchor).toHaveAttribute('href',/^https?:\/\//);
    await expect(anchor).toHaveAttribute('rel',/sponsored/);
    await expect(anchor).toHaveAttribute('target','_blank');
    await expect(anchor).toHaveAttribute('data-partner',/.+/);
    await expect(anchor).toHaveAttribute('data-category',category);
   }
  }
  await v10.getByTestId('v10-category-mobil').click();
  await v10.getByTestId('v10-filter-family').click();
  await expect(v10.getByTestId('v10-filter-family')).toHaveAttribute('aria-pressed','true');
  await expect(v10.getByTestId('v10-partner-card').first()).toBeVisible();
  await page.screenshot({path:'test-results/v10/home-results-'+width+'.png',fullPage:true,animations:'disabled'});
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const bar=page.getByRole('navigation',{name:'Snabbnavigering'});
  await expect(bar).toHaveCount(0);
  if(width<=760){
   const dock=v10.getByTestId('v10-bottom-cta');
   await expect(dock).toBeVisible();
   await expect(dock).toHaveAttribute('rel',/sponsored/);
   await expect(dock).toHaveAttribute('data-partner',/.+/);
  }
  await v10.getByRole('button',{name:/Varför visas dessa alternativ/}).click();
  await expect(v10).toContainText('inte hela marknaden');
 });
}
for(const [path,category] of hubs){
 test('V10 hub '+category+' keeps crawl identity, genuine partners and one-tap filters',async({page})=>{
  const resp=await page.goto(path+'?qa=1',{waitUntil:'domcontentloaded'});
  expect(resp?.ok()).toBeTruthy();
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://sankkostnaden.se'+path);
  const lane=page.getByTestId('v10-category-lane');
  await expect(lane).toHaveCount(1);
  await expect(lane.getByRole('heading',{name:/Vill du jämföra redan nu/})).toBeVisible();
  await expect(lane.getByTestId('v10-partner-card').first()).toBeVisible();
  if(category==='el')await expect(page.getByTestId('electricity-spot-prices')).toBeVisible();
  for(const card of await lane.getByTestId('v10-partner-card').all()){
   await expect(card).toHaveAttribute('href',/^https?:\/\//);
   await expect(card).toHaveAttribute('rel',/sponsored/);
  }
  await expect(page.locator('main h1')).toHaveCount(1);
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 });
}
test('V10 no unsupported price promise and no inactive partner link in home journey',async({page})=>{
 await page.goto('/?qa=1');
 const journey=page.getByTestId('v10-journey');
 await journey.getByTestId('v10-category-bredband').click();
 const text=await journey.innerText();
 expect(text).not.toMatch(/du sparar [\\d,.]+/i);
 expect(text).toContain('aktuella priser hos partnern');
 await journey.getByTestId('v10-filter-mobile').click();
 await expect(journey.getByTestId('v10-partner-card').first()).toBeVisible();
});

test('Unified home: meaningful category result plus true guide and calculation exits at six widths', async ({page})=>{
 for(const width of [360,390,430,1024,1440,1920]){
  await page.setViewportSize({width,height:width<600?844:960});
  await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
  const journey=page.getByTestId('v10-journey');
  await expect(journey.getByTestId('v11-empty-state')).toBeVisible();
  for(const [category,guide,tool] of [
   ['el','/elavtal/vilket-elavtal-passar-mig/','/verktyg/elavtalskostnad/'],
   ['bredband','/bredband/vilken-hastighet-behover-jag/','/verktyg/forstaarskostnad-bredband/'],
   ['mobil','/mobil/hur-mycket-surf-behover-jag/','/verktyg/forstaarskostnad/'],
   ['forsakring','/forsakring/jamfor-hemforsakring/','/forsakring/hemforsakring-skyddskoll/'],
   ['ekonomi','/ekonomi/kostnadskontroll-och-sparande/','/verktyg/hushallskostnadskollen/']
  ] as const){
   await journey.getByTestId('v10-category-'+category).click();
   await expect(journey.getByTestId('v11-result-routes')).toBeVisible();
   await expect(journey.getByTestId('v11-route-guide')).toHaveAttribute('href',guide);
   await expect(journey.getByTestId('v11-route-tool')).toHaveAttribute('href',tool);
   const link=journey.getByTestId('v10-partner-card').first();
   await expect(link).toBeVisible();
   await expect(link).toHaveAttribute('rel',/sponsored/);
   await expect(link).toHaveAttribute('data-category',category);
  }
  expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/v10/unified-journey-'+width+'.png',fullPage:true,animations:'disabled'});
 }
});
for(const [path,category,guide,tool] of [
 ['/elavtal/','el','/elavtal/vilket-elavtal-passar-mig/','/verktyg/elavtalskostnad/'],
 ['/bredband/','bredband','/bredband/vilken-hastighet-behover-jag/','/verktyg/forstaarskostnad-bredband/'],
 ['/mobil/','mobil','/mobil/hur-mycket-surf-behover-jag/','/verktyg/forstaarskostnad/'],
 ['/forsakring/','forsakring','/forsakring/jamfor-hemforsakring/','/forsakring/hemforsakring-skyddskoll/'],
 ['/ekonomi/','ekonomi','/ekonomi/kostnadskontroll-och-sparande/','/verktyg/hushallskostnadskollen/']
] as const){
 test('Unified category integrates partner, guide and detailed tool: '+category,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(path+'?qa=1',{waitUntil:'domcontentloaded'});
  const lane=page.getByTestId('v10-category-lane');
  await expect(lane.getByTestId('v11-lane-tool')).toHaveAttribute('href',tool);
  await expect(lane.getByTestId('v11-lane-guide')).toHaveAttribute('href',guide);
  const link=lane.getByTestId('v10-partner-card').first();
  await expect(link).toHaveAttribute('rel',/sponsored/);
  await expect(link).toBeVisible();
  expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/v10/unified-category-'+category+'.png',fullPage:true,animations:'disabled'});
 });
}
