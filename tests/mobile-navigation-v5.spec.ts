import { expect, test } from '@playwright/test';

for(const width of [360,390,430]){
 test('mobile quick navigation V5 at '+width+'px has readable active state and no overflow',async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/mobil/?qa=1');
  const nav=page.getByRole('navigation',{name:'Snabbnavigering'});
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link')).toHaveCount(5);
  const active=nav.getByRole('link',{name:'Mobil'});
  await expect(active).toHaveAttribute('aria-current','page');
  const state=await active.evaluate(el=>{
   const s=getComputedStyle(el);
   return {color:s.color,background:s.backgroundColor,minHeight:parseFloat(s.minHeight)};
  });
  expect(state.background).toBe('rgb(231, 238, 255)');
  expect(state.color).toBe('rgb(23, 63, 178)');
  expect(state.minHeight).toBeGreaterThanOrEqual(44);
  const excess=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(excess).toBeLessThanOrEqual(1);
  await active.focus();
  const focus=await active.evaluate(el=>parseFloat(getComputedStyle(el).outlineWidth));
  expect(focus).toBeGreaterThanOrEqual(3);
  await page.screenshot({path:'test-results/screenshots/mobile-nav-v5-'+width+'.png'});
 });
}
test('mobile bar never competes with the first Kostnadskollen question',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/app/?qa=1');
 await expect(page.getByRole('navigation',{name:'Snabbnavigering'})).toHaveCount(0);
});
