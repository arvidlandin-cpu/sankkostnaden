import { expect, test } from '@playwright/test';

test('electricity spot chart shows real-data controls or a clear unavailable state',async({page})=>{
 await page.goto('/elavtal/?qa=1');
 const section=page.getByTestId('electricity-spot-prices');
 await expect(section.getByRole('heading',{name:'Se när elen är billigare'})).toBeVisible();
 await expect(section.getByLabel('Välj elområde')).toBeVisible();
 await expect(section.getByRole('button',{name:'I dag'})).toBeVisible();
 await expect(section.getByRole('button',{name:'I morgon'})).toBeVisible();
 await expect(section.getByRole('link',{name:'Elpriset just nu.se'})).toHaveAttribute('href','https://www.elprisetjustnu.se/elpris-api');
});

for(const width of [360,390,430,1024,1440]){
 test('responsive price module at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:850});
  await page.goto('/elavtal/?qa=1');
  await expect(page.getByTestId('electricity-spot-prices')).toBeVisible();
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
