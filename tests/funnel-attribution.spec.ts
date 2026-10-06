import { expect, test, type Page } from '@playwright/test';

async function fillElectricity(page:Page){
  await page.getByLabel('Årsförbrukning i kWh').fill('20000');
  const a=page.getByTestId('electricity-offer-a').locator('input[type="number"]');
  const b=page.getByTestId('electricity-offer-b').locator('input[type="number"]');
  await a.nth(0).fill('85');
  await a.nth(1).fill('49');
  await a.nth(2).fill('600');
  await b.nth(0).fill('82');
  await b.nth(1).fill('79');
  await b.nth(2).fill('0');
}

test('calculator and affiliate click share one funnel session without changing partner URL',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/verktyg/elavtalskostnad/?src=attribution_qa');

  await fillElectricity(page);
  await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();
  await page.getByTestId('electricity-cost-commercial-cta').click();

  const sponsored=page.locator('a[rel~="sponsored"]').first();
  await expect(sponsored).toBeVisible();
  const hrefBefore=await sponsored.getAttribute('href');
  await sponsored.evaluate((element:any)=>element.addEventListener('click',(event:Event)=>event.preventDefault()));
  await sponsored.click();
  const hrefAfter=await sponsored.getAttribute('href');

  expect(hrefAfter).toBe(hrefBefore);

  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const ready=events.find((item:any)=>item.event==='electricity_cost_ready');
  const continued=events.find((item:any)=>item.event==='electricity_cost_continue');
  const click=events.find((item:any)=>item.event==='affiliate_click');

  expect(ready?.funnel_session_id).toMatch(/^fs_/);
  expect(continued?.funnel_session_id).toBe(ready.funnel_session_id);
  expect(click?.funnel_session_id).toBe(ready.funnel_session_id);
  expect(click?.local_click_id).toMatch(/^clk_/);
  expect(click?.partner).toBeTruthy();
  expect(click?.placement).toBeTruthy();
});

test('each outbound affiliate click gets a distinct local click id',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/billigaste-elavtalet/?qa=1');

  const sponsored=page.locator('a[rel~="sponsored"]');
  await expect(sponsored.first()).toBeVisible();
  await sponsored.first().evaluate((element:any)=>element.addEventListener('click',(event:Event)=>event.preventDefault()));
  await sponsored.first().click();
  await sponsored.first().click();

  const clicks=await page.evaluate(()=>(window as any).dataLayer.filter((item:any)=>item.event==='affiliate_click'));
  expect(clicks.length).toBeGreaterThanOrEqual(2);
  expect(clicks[0].local_click_id).not.toBe(clicks[1].local_click_id);
  expect(clicks[0].funnel_session_id).toBe(clicks[1].funnel_session_id);
});

test('last click context is session-only and contains no raw calculator values',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/billigaste-elavtalet/?qa=1');
  const sponsored=page.locator('a[rel~="sponsored"]').first();
  await sponsored.evaluate((element:any)=>element.addEventListener('click',(event:Event)=>event.preventDefault()));
  await sponsored.click();

  const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('sankkostnaden-last-affiliate-click-v1')||'{}'));
  expect(stored.local_click_id).toMatch(/^clk_/);
  expect(stored.partner).toBeTruthy();
  expect(stored.page_path).toBe('/elavtal/billigaste-elavtalet/');
  expect(JSON.stringify(stored)).not.toContain('annualKwh');
  expect(JSON.stringify(stored)).not.toContain('monthly');
});
