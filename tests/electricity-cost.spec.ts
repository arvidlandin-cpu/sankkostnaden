import { expect, test, type Page } from '@playwright/test';

const route='/verktyg/elavtalskostnad/';

async function fillExample(page:Page){
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

test('electricity tool calculates annual contract cost correctly',async({page})=>{
  await page.goto(route+'?src=test');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow,noarchive');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/verktyg/elavtalskostnad/');

  await fillExample(page);
  await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();

  await expect(page.getByTestId('electricity-total-a')).toContainText('16 988');
  await expect(page.getByTestId('electricity-total-b')).toContainText('17 348');
  await expect(page.getByTestId('electricity-cost-result')).toContainText('360');
  await expect(page.getByTestId('electricity-cost-result')).toContainText('Alternativ A');
});

test('electricity tool only hands off after a complete comparison',async({page})=>{
  await page.goto(route);
  await page.getByLabel('Årsförbrukning i kWh').fill('20000');
  await page.getByTestId('electricity-offer-a').locator('input[type="number"]').nth(0).fill('85');
  await expect(page.getByTestId('electricity-cost-commercial-cta')).toHaveCount(0);

  await fillExample(page);
  await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();
  const cta=page.getByTestId('electricity-cost-commercial-cta');
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/#electricity-commercial-options$/);
  await expect(page.locator('a[rel~="sponsored"]')).not.toHaveCount(0);
});

test('analytics do not receive raw consumption or price inputs',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto(route+'?src=privacy_test');
  await fillExample(page);
  await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();

  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const event=events.find((item:any)=>item.event==='electricity_cost_ready');
  expect(event).toBeTruthy();
  expect(event.source).toBe('privacy_test');
  expect(event.consumption_band).toBe('15000_24999');
  expect(event.difference_band).toBe('under_500');
  expect(JSON.stringify(event)).not.toContain('20000');
  expect(JSON.stringify(event)).not.toContain('85');
  expect(JSON.stringify(event)).not.toContain('82');
});

test('indexed electricity guides keep metadata and expose calculator',async({page})=>{
  await page.goto('/elavtal/jamfor-elavtal/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/jamfor-elavtal/');
  await expect(page.getByRole('link',{name:/Räkna årskostnaden/i})).toHaveAttribute('href','/verktyg/elavtalskostnad/?src=jamfor_elavtal');

  await page.goto('/elavtal/billigaste-elavtalet/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/billigaste-elavtalet/');
  await expect(page.getByRole('heading',{level:1,name:/Billigaste elavtalet/i})).toBeVisible();
  await expect(page.getByRole('link',{name:/Räkna årskostnaden/i})).toHaveAttribute('href','/verktyg/elavtalskostnad/?src=billigaste_elavtalet');

  await page.goto('/elavtal/rorligt-elpris/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/rorligt-elpris/');
  await expect(page.getByRole('link',{name:/Öppna elkalkylen/i})).toHaveAttribute('href','/verktyg/elavtalskostnad/?src=rorligt_elpris');
});

for(const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
  test('electricity calculator has no horizontal overflow @ '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto(route);
    await fillExample(page);
    await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}


test('inline electricity savings sensitivity explains fee trade-off without provider price claims',async({page})=>{
  await page.goto('/elavtal/billigaste-elavtalet/?qa=1');
  const tool=page.getByTestId('electricity-sensitivity');
  await expect(tool).toBeVisible();
  await expect(tool).toContainText('räkneexempel');
  await expect(tool.getByTestId('electricity-sensitivity-outcome')).toContainText('110');
  await expect(tool).toContainText('7 200 kWh/år');

  await tool.getByRole('button',{name:'20 000 kWh'}).click();
  await expect(tool.getByTestId('electricity-sensitivity-outcome')).toContainText('640');
  await expect(tool.getByTestId('electricity-sensitivity-outcome')).toContainText('lägre årskostnad');
  await expect(tool.getByRole('link',{name:/Räkna årskostnaden för två erbjudanden/})).toHaveAttribute('href','/verktyg/elavtalskostnad/?src=billigaste_elavtalet');

  await tool.getByLabel('Lägre elhandelspris med').fill('0');
  await expect(tool.getByTestId('electricity-sensitivity-outcome')).toContainText('360');
  await expect(tool.getByTestId('electricity-sensitivity-outcome')).toContainText('högre årskostnad');
});

test('sensitivity interaction analytics includes only a consumption band',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/billigaste-elavtalet/?qa=1');
  const tool=page.getByTestId('electricity-sensitivity');
  await tool.getByRole('button',{name:'20 000 kWh'}).click();
  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const used=events.find((item:any)=>item.event==='electricity_sensitivity_used');
  expect(used).toBeTruthy();
  expect(used.consumption_band).toBe('15000_24999');
  expect(used.source).toBe('billigaste_elavtalet');
  expect(JSON.stringify(used)).not.toContain('20000');
  expect(JSON.stringify(used)).not.toContain('30');
});

for(const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
  test('inline electricity sensitivity does not overflow at '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto('/elavtal/billigaste-elavtalet/?qa=1');
    const tool=page.getByTestId('electricity-sensitivity');
    await expect(tool).toBeVisible();
    await tool.getByRole('button',{name:'20 000 kWh'}).click();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
