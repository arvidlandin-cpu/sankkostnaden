import {expect,test} from '@playwright/test';

/** The user's first useful decision must no longer be buried behind a tall
 * paragraph-heavy gateway on 390px mobile. Preserve real commercial handoff. */
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
  expect((contentAfter?.y||0)-(rect?.y||0)).toBeLessThan(365);
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
