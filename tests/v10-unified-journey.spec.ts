import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const hubs=[['/elavtal/','el'],['/bredband/','bredband'],['/mobil/','mobil'],['/forsakring/','forsakring'],['/ekonomi/','ekonomi']] as const;

// The Cost Map behavior is covered in cost-map-journey.spec.ts. Keep this
// homepage check for real visual evidence required by the release workflow.
for(const width of [360,390,430,1024,1440,1920]){
 test('Cost Map homepage visual evidence at '+width,async({page})=>{
  await page.setViewportSize({width,height:width<600?844:960});
  const response=await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('main h1')).toHaveCount(1);
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://sankkostnaden.se/');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content',/index,follow/);
  const map=page.getByTestId('cost-map-journey');
  await expect(map).toBeVisible();
  mkdirSync('test-results/v10',{recursive:true});
  await page.screenshot({path:'test-results/v10/home-start-'+width+'.png',fullPage:true,animations:'disabled'});
  await map.getByTestId('v10-category-bredband').click();
  await expect(map.getByTestId('cost-map-panel-title')).toBeVisible();
  await page.screenshot({path:'test-results/v10/home-results-'+width+'.png',fullPage:true,animations:'disabled'});
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
