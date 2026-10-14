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
