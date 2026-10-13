import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const route='/experiments/beslutsresa-v6/';
const goals=['unsure','compare','overview'] as const;
const areas=['bredband','el','mobil','forsakring'] as const;
for(const width of [390,1440]){
 test('V6 prototype first screen responsive '+width,async({page})=>{
  await page.setViewportSize({width,height:width===390?844:900});
  await page.goto(route+'?qa=1',{waitUntil:'domcontentloaded'});
  await expect(page.getByTestId('v6-goal-choice')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  await expect(page.locator('main h1')).toHaveCount(1);
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  mkdirSync('test-results/v6-journey',{recursive:true});
  await page.screenshot({path:'test-results/v6-journey/start-'+width+'.png',fullPage:true});
  await page.getByTestId('v6-goal-compare').click();
  await expect(page.getByTestId('v6-area-choice')).toBeVisible();
  await page.screenshot({path:'test-results/v6-journey/area-'+width+'.png',fullPage:true});
  await page.getByTestId('v6-area-bredband').click();
  await expect(page.getByTestId('v6-result')).toBeVisible();
  await page.screenshot({path:'test-results/v6-journey/result-'+width+'.png',fullPage:true});
  await page.getByTestId('v6-refine-toggle').click();
  await expect(page.getByTestId('v6-refine-options')).toBeVisible();
  await page.getByRole('button',{name:/Fiber \/ fast bredband/}).click();
  await expect(page.getByTestId('v6-next-step')).toHaveAttribute('href','/bredband/billigaste-bredbandet/');
  await page.screenshot({path:'test-results/v6-journey/refined-'+width+'.png',fullPage:true});
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 });
}
test('V6 12 journeys produce a useful result in two selections, preserve navigation and avoid fictional savings',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 for(const goal of goals){
  for(const area of areas){
   await page.goto(route+'?qa=1',{waitUntil:'domcontentloaded'});
   await page.getByTestId('v6-goal-'+goal).click();
   await page.getByTestId('v6-area-'+area).click();
   const result=page.getByTestId('v6-result');
   await expect(result).toBeVisible();
   const next=page.getByTestId('v6-next-step');
   await expect(next).toHaveAttribute('href',/^\/(?!\/)/);
   await expect(next).toBeVisible();
   await expect(result).not.toContainText('du sparar');
   await expect(result.getByRole('link',{name:/förstå mer/})).toBeVisible();
   await page.getByRole('button',{name:'Byt område'}).click();
   await expect(page.getByTestId('v6-area-choice')).toBeVisible();
   await page.getByRole('button',{name:/Tillbaka/}).click();
   await expect(page.getByTestId('v6-goal-choice')).toBeVisible();
  }
 }
});
