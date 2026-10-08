import { expect, test } from '@playwright/test';

const route='/ekonomi/jamfor-privatlan/?qa=1';

test('example demonstrates why a lower monthly payment may cost more overall',async({page})=>{
 await page.goto(route);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/ekonomi/jamfor-privatlan/');
 const tool=page.getByTestId('loan-total-tool');
 await expect(tool.getByTestId('loan-a-total')).toContainText('139 700');
 await expect(tool.getByTestId('loan-b-total')).toContainText('161 000');
 await expect(tool.getByTestId('loan-difference')).toContainText('21 300');
 await expect(tool.getByTestId('loan-lower-monthly-warning')).toContainText('Alternativ B har lägre månadsbetalning');
});

test('user can compare full-term numbers and see when entered quote is invalid',async({page})=>{
 await page.goto(route);
 const tool=page.getByTestId('loan-total-tool');
 const second=tool.getByRole('group',{name:'Alternativ B'});
 await second.getByLabel('Återstående återbetalningstid').fill('60');
 await expect(tool.getByTestId('loan-b-total')).toContainText('100 700');
 await second.getByLabel('Månadsbetalning utan separat avgift').fill('100');
 await expect(tool).toContainText('Eventuell restskuld');
 await expect(tool.getByTestId('loan-difference')).toHaveCount(0);
});

for(const width of [360,390,430,1024]){
 test('no loan total calculator horizontal overflow at '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto(route);
  await expect(page.getByTestId('loan-total-tool')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
