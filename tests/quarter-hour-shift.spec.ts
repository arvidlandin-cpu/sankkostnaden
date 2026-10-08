import {expect,test} from '@playwright/test';
test('quarter-hour guide has a useful two-choice example and preserves canonical',async({page})=>{
 await page.goto('/elavtal/kvartspris/');
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/kvartspris/');
 const tool=page.getByTestId('quarter-hour-shift-value');
 await expect(tool).toBeVisible();
 await expect(tool.getByTestId('quarter-hour-example-result')).toContainText('375');
 await tool.getByRole('button',{name:/Mycket/}).click();
 await tool.getByRole('button',{name:/50 öre/}).click();
 await expect(tool.getByTestId('quarter-hour-example-result')).toContainText('1 500');
 await expect(tool.getByRole('link',{name:/Jämför avtalsformerna/})).toHaveAttribute('href','/elavtal/rorligt-fast-kvartspris/');
});
test('quarter-hour analytics has coarse categories only',async({page})=>{
 await page.addInitScript(()=>{(window as any).dataLayer=[];});
 await page.goto('/elavtal/kvartspris/');
 await page.getByTestId('quarter-hour-shift-value').getByRole('button',{name:/Mycket/}).click();
 const events=await page.evaluate(()=>(window as any).dataLayer||[]);
 const matching=events.filter((e:any)=>e.event==='quarter_hour_example_used');
 expect(matching).toHaveLength(1);
 expect(matching[0].shift_band).toBe('large');
 expect(JSON.stringify(matching)).not.toContain('3000');
});
for(const width of [360,390,430]){
 test('quarter-hour page has no horizontal overflow '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/elavtal/kvartspris/');
  await expect(page.getByTestId('quarter-hour-shift-value')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
