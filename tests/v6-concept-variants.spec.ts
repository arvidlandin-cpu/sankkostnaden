import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const hub='/experiments/v6-koncept/';
const map='/experiments/kostnadskarta-v6/';
const fast='/experiments/snabbjamfor-v6/';
for(const width of [390,1440]){
 test('V6 design-lab has three navigable distinct concepts '+width,async({page})=>{
  await page.setViewportSize({width,height:width===390?844:900});
  const resp=await page.goto(hub+'?qa=1',{waitUntil:'domcontentloaded'});
  expect(resp?.ok()).toBeTruthy();
  await expect(page.getByTestId('v6-hub')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  for(const [letter,target] of [['a','/experiments/beslutsresa-v6/'],['b',map],['c',fast]]){
   await expect(page.getByTestId('v6-open-'+letter)).toHaveAttribute('href',target);
  }
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
  mkdirSync('test-results/v6-variants',{recursive:true});
  await page.screenshot({path:'test-results/v6-variants/hub-'+width+'.png',fullPage:true});
 });
 test('V6 cost map is interactive, partial, honest and responsive '+width,async({page})=>{
  await page.setViewportSize({width,height:width===390?844:900});
  const resp=await page.goto(map+'?qa=1',{waitUntil:'domcontentloaded'});
  expect(resp?.ok()).toBeTruthy();
  await expect(page.getByTestId('v6-map')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  await expect(page.getByTestId('v6-map-total')).toHaveText('–');
  await page.getByTestId('v6-map-pick-el').click();
  await expect(page.getByTestId('v6-map-editor')).toBeVisible();
  await page.getByRole('spinbutton',{name:'Månadskostnad El'}).fill('500');
  await expect(page.getByTestId('v6-map-total')).toContainText('500 kr');
  await expect(page.getByTestId('v6-map-next')).toHaveAttribute('href','/elavtal/');
  await page.getByRole('button',{name:'År',exact:true}).click();
  await expect(page.getByTestId('v6-map-total')).toContainText('6 000 kr');
  await page.getByTestId('v6-map-pick-mobil').click();
  await page.getByRole('spinbutton',{name:'Månadskostnad Mobil'}).fill('700');
  await expect(page.getByTestId('v6-map-total')).toContainText('14 400 kr');
  await expect(page.getByTestId('v6-map-next')).toHaveAttribute('href','/mobil/');
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/v6-variants/map-'+width+'.png',fullPage:true});
  await page.getByRole('button',{name:/Rensa/}).click();
  await expect(page.getByTestId('v6-map-total')).toHaveText('–');
 });
 test('V6 direct compare shows active sponsored partners, real filters, and mobile usability '+width,async({page})=>{
  await page.setViewportSize({width,height:width===390?844:900});
  const resp=await page.goto(fast+'?qa=1',{waitUntil:'domcontentloaded'});
  expect(resp?.ok()).toBeTruthy();
  await expect(page.getByTestId('v6-fast')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  await expect(page.getByTestId('v6-fast-empty')).toBeVisible();
  await page.getByTestId('v6-fast-pick-mobil').click();
  await expect(page.getByTestId('v6-fast-result')).toBeVisible();
  await expect(page.getByTestId('v6-fast-partner').first()).toBeVisible();
  const cards=page.getByTestId('v6-fast-partner');
  expect(await cards.count()).toBeGreaterThan(0);
  expect(await cards.count()).toBeLessThanOrEqual(3);
  for(const a of await cards.locator('a[data-partner]').all()){
    await expect(a).toHaveAttribute('rel',/sponsored/);
    await expect(a).toHaveAttribute('target','_blank');
    await expect(a).toHaveAttribute('href',/^https?:\/\//);
  }
  await page.getByTestId('v6-fast-filter-family').click();
  await expect(page.getByTestId('v6-fast-filter-family')).toHaveAttribute('aria-pressed','true');
  await expect(page.getByTestId('v6-fast-partner').first()).toBeVisible();
  await page.getByTestId('v6-fast-pick-forsakring').click();
  await expect(page.getByTestId('v6-fast-filter-home')).toHaveAttribute('aria-pressed','true');
  await page.getByTestId('v6-fast-filter-pet').click();
  await expect(page.getByTestId('v6-fast-filter-pet')).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/v6-variants/fast-'+width+'.png',fullPage:true});
 });
}
