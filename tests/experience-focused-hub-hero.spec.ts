import {expect,test} from '@playwright/test';

/** Hero has one quick action; help and deep-dive remain in the actual live
 * chooser directly below, rather than repeating the same button twice. */
const hubs=[
 {path:'/bredband/',id:'bredband',help:'/bredband/vilken-hastighet-behover-jag/'},
 {path:'/elavtal/',id:'el',help:'/elavtal/vilket-elavtal-passar-mig/'},
 {path:'/mobil/',id:'mobil',help:'/mobil/hur-mycket-surf-behover-jag/'},
 {path:'/forsakring/',id:'forsakring',help:'/forsakring/hemforsakring-skyddskoll/'},
 {path:'/ekonomi/',id:'ekonomi',help:'/verktyg/hushallskostnadskollen/'},
] as const;

for(const {path,id,help} of hubs){
 test('focused category hero and accessible help '+path,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(path+'?qa=1');
  const hero=page.locator('section.categoryHero');
  await expect(hero.locator('.categoryHeroActions a')).toHaveCount(1);
  const journey=page.getByTestId('category-journey-'+id);
  await expect(journey).toBeVisible();
  await expect(journey.getByTestId('category-journey-result').locator('a')).toHaveAttribute('href',help);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
