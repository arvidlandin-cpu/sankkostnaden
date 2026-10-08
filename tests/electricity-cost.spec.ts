import { expect, test, type Page } from '@playwright/test';

const route='/verktyg/elavtalskostnad/';

async function fillExample(page:Page){
  await page.getByRole('button',{name:/Ja, jämför mina erbjudanden/}).click();
  await page.getByLabel('Årsförbrukning i kWh').fill('20000');
  const cardA=page.getByTestId('electricity-offer-a');
  const cardB=page.getByTestId('electricity-offer-b');
  await cardA.getByLabel('Elhandelspris att jämföra').fill('85');
  await cardA.getByLabel('Fast avgift (skriv 0 om ingen)').fill('49');
  await cardB.getByLabel('Elhandelspris att jämföra').fill('82');
  await cardB.getByLabel('Fast avgift (skriv 0 om ingen)').fill('79');
  await cardA.getByText('Rabatt och namn (valfritt)').click();
  await cardB.getByText('Rabatt och namn (valfritt)').click();
  await cardA.getByLabel('Rabatt totalt under 12 mån').fill('600');
  await cardB.getByLabel('Rabatt totalt under 12 mån').fill('0');
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

test('exact comparison CTA appears only after correct prices and explicit fixed-fee values',async({page})=>{
  await page.goto(route);
  await page.getByRole('button',{name:/Ja, jämför mina erbjudanden/}).click();
  await page.getByLabel('Årsförbrukning i kWh').fill('20000');
  await page.getByTestId('electricity-offer-a').getByLabel('Elhandelspris att jämföra').fill('85');
  await page.getByTestId('electricity-offer-b').getByLabel('Elhandelspris att jämföra').fill('82');
  await expect(page.getByRole('button',{name:/Räkna årskostnaden/})).toBeDisabled();
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
  // Session identifiers can randomly contain "82", "85" or "20000".
  // Validate the outbound event SCHEMA rather than searching serialized IDs.
  const allowed=new Set(['event','source','consumption_band','difference_band','winner','funnel_session_id','gtm.uniqueEventId']);
  expect(Object.keys(event).filter((key:string)=>!allowed.has(key))).toEqual([]);
  for(const raw of ['annual_kwh','kwh','consumption','unit_price','price_ore','monthly_fee','annual_total','price_a','price_b','total_a','total_b']){
    expect(event).not.toHaveProperty(raw);
  }
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
  // Validate the event payload by exact keys instead of searching serialized JSON:
  // random funnel IDs may legitimately contain the digit sequences "30" or "20000".
  expect(used).toMatchObject({
    event:'electricity_sensitivity_used',
    source:'billigaste_elavtalet',
    consumption_band:'15000_24999',
  });
  const permitted=new Set(['event','source','consumption_band','funnel_session_id','gtm.uniqueEventId']);
  expect(Object.keys(used).filter(key=>!permitted.has(key))).toEqual([]);
  for(const forbidden of ['annual_kwh','kwh','monthly_fee','unit_price','price','monthly_cost','annual_cost']){
    expect(used).not.toHaveProperty(forbidden);
  }
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

// The user's default path must give value even without a kWh number or quote.
test('electricity offers a real comparison service before any form fields',async({page})=>{
  await page.goto(route+'?qa=1');
  const chooser=page.getByTestId('electricity-start-choice');
  await expect(chooser.getByRole('heading',{name:/Har du två erbjudanden med priser/i})).toBeVisible();
  await expect(page.getByLabel('Årsförbrukning i kWh')).toHaveCount(0);
  await chooser.getByRole('button',{name:/Nej, visa aktuella elavtal/}).click();
  const routePanel=page.getByTestId('electricity-no-offer-path');
  await expect(routePanel).toBeVisible();
  const partner=routePanel.getByRole('link',{name:/Jämför elavtal hos Elskling/});
  await expect(partner).toHaveAttribute('data-partner','Elskling');
  await expect(partner).toHaveAttribute('rel',/sponsored/);
  await expect(partner).toHaveAttribute('data-placement','electricity_calculator_no_offer');
  await expect(routePanel.getByRole('link',{name:/Se våra aktiva elbolag/})).toHaveAttribute('href','/elavtal/');
  await expect(page.getByTestId('electricity-cost-result')).toHaveCount(0);
  await expect(page.locator('section[aria-label="Jämför två elavtal"]')).toHaveCount(0);
});

test('fee fields require explicit confirmation, including zero, before full-year winner',async({page})=>{
  await page.goto(route+'?qa=1');
  await page.getByRole('button',{name:/Ja, jämför mina erbjudanden/}).click();
  await page.getByRole('button',{name:'5 000 kWh'}).click();
  await expect(page.getByText(/Du använder just nu ett räkneexempel/)).toBeVisible();
  const a=page.getByTestId('electricity-offer-a');
  const b=page.getByTestId('electricity-offer-b');
  await a.getByLabel('Elhandelspris att jämföra').fill('85');
  await b.getByLabel('Elhandelspris att jämföra').fill('82');
  await expect(page.getByRole('button',{name:/Räkna årskostnaden/})).toBeDisabled();
  await a.getByLabel('Fast avgift (skriv 0 om ingen)').fill('0');
  await b.getByLabel('Fast avgift (skriv 0 om ingen)').fill('0');
  await expect(a.getByLabel('Fast avgift (skriv 0 om ingen)')).toHaveValue('0');
  await expect(page.getByRole('button',{name:/Räkna årskostnaden/})).toBeEnabled();
  await page.getByRole('button',{name:/Räkna årskostnaden/}).click();
  await expect(page.getByTestId('electricity-cost-result')).toContainText('illustrativt');
  await expect(page.getByTestId('electricity-cost-result')).toContainText('150');
});

for(const width of [360,390,430,1024,1440]){
  test('electricity quick vs exact has no overflow at '+width+'px',async({page},info)=>{
    await page.setViewportSize({width,height:844});
    await page.goto(route+'?qa=1');
    await expect(page.getByTestId('electricity-start-choice')).toBeVisible();
    await page.getByRole('button',{name:/Nej, visa aktuella elavtal/}).click();
    await expect(page.getByTestId('electricity-no-offer-path')).toBeVisible();
    let overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.getByRole('button',{name:/Ja, jämför mina erbjudanden/}).click();
    await expect(page.getByTestId('electricity-offer-a')).toBeVisible();
    overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({path:`test-results/screenshots/ux-electricity-${info.project.name}-${width}.png`,fullPage:true});
  });
}
