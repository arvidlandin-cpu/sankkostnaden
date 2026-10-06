import { expect, test, type Page } from '@playwright/test';
import { buildAffiliateAttributionUrl } from '../lib/clientAttribution';

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

test('calculator and affiliate click share one funnel session and use verified network click reference',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/verktyg/elavtalskostnad/?src=attribution_qa');

  await fillElectricity(page);
  await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();
  await page.getByTestId('electricity-cost-commercial-cta').click();

  const sponsored=page.locator('a[rel~="sponsored"]').first();
  await expect(sponsored).toBeVisible();
  const hrefBefore=await sponsored.getAttribute('href');
  await sponsored.evaluate((element:any)=>{
    element.addEventListener('click',(event:Event)=>{
      (window as any).__networkHref=element.href;
      event.preventDefault();
    });
  });
  await sponsored.click();
  await page.waitForTimeout(10);
  const hrefAfter=await sponsored.getAttribute('href');
  const networkHref=await page.evaluate(()=>(window as any).__networkHref||'');

  expect(hrefAfter).toBe(hrefBefore);
  expect(networkHref).toContain('epi=clk_');

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
  expect(click?.affiliate_network).toBe('adtraction');
  expect(click?.network_click_reference).toBe(1);
  expect(networkHref).toContain('epi='+click.local_click_id);
});

test('network URL builder preserves Adtraction deeplink ordering and Addrevenue clickRef',()=>{
  const adtraction=buildAffiliateAttributionUrl(
    'https://at.to.tele2.se/t/t?a=1864648074&as=2111115937&t=2&tk=1&url=https%3A%2F%2Fwww.tele2.se%2Fmobilabonnemang',
    'clk_test123'
  );
  expect(adtraction.network).toBe('adtraction');
  expect(adtraction.parameter).toBe('epi');
  expect(adtraction.url).toContain('epi=clk_test123');
  expect(adtraction.url.indexOf('epi=clk_test123')).toBeLessThan(adtraction.url.indexOf('url='));

  const addrevenue=buildAffiliateAttributionUrl(
    'https://addrevenue.io/t?a=985083&c=3469603',
    'clk_test456'
  );
  expect(addrevenue.network).toBe('addrevenue');
  expect(addrevenue.parameter).toBe('clickRef');
  expect(addrevenue.url).toContain('clickRef=clk_test456');

  const unsupported=buildAffiliateAttributionUrl('https://example.com/path?x=1','clk_test789');
  expect(unsupported.network).toBe('unsupported');
  expect(unsupported.url).toBe('https://example.com/path?x=1');
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
