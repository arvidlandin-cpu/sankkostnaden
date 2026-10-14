import {test,expect} from '@playwright/test';

const paths=[
 {category:'el',url:'/elavtal/',guide:'/elavtal/vilket-elavtal-passar-mig/',tool:'/verktyg/elavtalskostnad/'},
 {category:'bredband',url:'/bredband/',guide:'/bredband/vilken-hastighet-behover-jag/',tool:'/verktyg/forstaarskostnad-bredband/'},
 {category:'mobil',url:'/mobil/',guide:'/mobil/hur-mycket-surf-behover-jag/',tool:'/verktyg/forstaarskostnad/'},
 {category:'forsakring',url:'/forsakring/',guide:'/forsakring/hemforsakring-skyddskoll/',tool:'/forsakring/hemforsakring-bostadsratt/'},
 {category:'ekonomi',url:'/ekonomi/',guide:'/ekonomi/kostnadskontroll-och-sparande/',tool:'/verktyg/hushallskostnadskollen/'}
] as const;

for(const width of [360,390,430,1024,1440,1920]){
 test('Unified journey works in '+width+'px without forced data entry',async({page})=>{
  await page.setViewportSize({width,height:width<600?844:960});
  await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
  const journey=page.getByTestId('v10-journey');
  await expect(journey.getByTestId('v11-empty-state')).toBeVisible();
  for(const {category,guide,tool} of paths){
   await journey.getByTestId('v10-category-'+category).click();
   await expect(journey.getByTestId('v11-result-routes')).toBeVisible();
   await expect(journey.getByTestId('v11-route-guide')).toHaveAttribute('href',guide);
   await expect(journey.getByTestId('v11-route-tool')).toHaveAttribute('href',tool);
   const partner=journey.getByTestId('v10-partner-card').first();
   await expect(partner).toBeVisible();
   await expect(partner).toHaveAttribute('rel',/sponsored/);
   await expect(partner).toHaveAttribute('data-category',category);
  }
  const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/v10/unified-home-'+width+'.png',fullPage:true,animations:'disabled'});
 });
}
for(const {category,url,guide,tool} of paths){
 test('Unified hub '+category+' offers partner, guide and exact path together',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(url+'?qa=1',{waitUntil:'domcontentloaded'});
  const lane=page.getByTestId('v10-category-lane');
  await expect(lane.getByTestId('v11-lane-guide')).toHaveAttribute('href',guide);
  await expect(lane.getByTestId('v11-lane-tool')).toHaveAttribute('href',tool);
  const partner=lane.getByTestId('v10-partner-card').first();
  await expect(partner).toBeVisible();
  await expect(partner).toHaveAttribute('rel',/sponsored/);
  expect(await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/v10/unified-hub-'+category+'-390.png',fullPage:true,animations:'disabled'});
 });
}
