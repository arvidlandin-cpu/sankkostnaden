import {expect,test} from '@playwright/test';

const sampleRoutes=[
 '/elavtal/kvartspris/',
 '/bredband/utan-bindningstid/',
 '/mobil/familjeabonnemang/',
 '/forsakring/hemforsakring-bostadsratt/',
 '/ekonomi/jamfor-privatlan/',
] as const;

for(const path of sampleRoutes){
 test('living guide reading flow '+path,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(path+'?qa=1');
  const panel=page.getByTestId('guide-reading-flow');
  await expect(panel).toBeVisible();
  await expect(panel.getByTestId('guide-key-takeaways').locator('p').first()).toBeVisible();
  const first=panel.locator('details').first();
  await expect(first).toHaveAttribute('open','');
  await expect(first.locator('div p')).toBeVisible();
  const next=panel.locator('details').nth(1);
  await expect(next).not.toHaveAttribute('open');
  await next.locator('summary').click();
  await expect(next).toHaveAttribute('open','');
  await expect(next.locator('div p')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se'+path);
  const diff=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(diff).toBeLessThanOrEqual(1);
 });
}
for(const width of [360,390,430,1024,1440]){
 test('guide feels like interactive cards at '+width+'px',async({page},info)=>{
  await page.setViewportSize({width,height:width<500?844:900});
  await page.goto('/elavtal/kvartspris/?qa=1',{waitUntil:'networkidle'});
  const flow=page.getByTestId('guide-reading-flow');
  await expect(flow.locator('details')).toHaveCount(5);
  const summary=flow.locator('details').nth(2).locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(flow.locator('details').nth(2)).toHaveAttribute('open','');
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/experience-p0-guide-'+width+'.png',fullPage:true});
 });
}
