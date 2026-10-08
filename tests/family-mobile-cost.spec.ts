import { expect, test, type Page } from '@playwright/test';

const route='/mobil/lonar-sig-familjeabonnemang/';

async function fillBaseExample(page:Page){
  await page.getByRole('button',{name:/Ja, räkna på våra priser/}).click();
  await page.getByRole('button',{name:/Exakt – med kampanjer och avgifter/}).click();
  const separate=page.getByTestId('family-exact-calculator').locator('input[type="number"]');
  await separate.nth(0).fill('149');
  await separate.nth(1).fill('149');
  await separate.nth(2).fill('99');
  await separate.nth(3).fill('99');
  await separate.nth(4).fill('299');
  await separate.nth(5).fill('99');
  await separate.nth(6).fill('199');
  await separate.nth(7).fill('49');
  await separate.nth(8).fill('6');
  await separate.nth(9).fill('0');
}

test('family calculator compares full first-year cost correctly',async({page})=>{
  await page.goto(route);
  await fillBaseExample(page);
  await page.getByRole('button',{name:/Räkna hela första året/i}).click();

  await expect(page.getByTestId('separate-annual')).toContainText('5 952');
  await expect(page.getByTestId('family-annual')).toContainText('5 652');
  await expect(page.getByTestId('family-difference')).toContainText('300');
  await expect(page.getByTestId('family-mobile-result')).toContainText('Familjeupplägget är billigare');
  await expect(page.getByTestId('family-mobile-commercial-cta')).toBeVisible();
});

test('commercial partner handoff is family-specific',async({page})=>{
  await page.goto(route);
  await fillBaseExample(page);
  await page.getByRole('button',{name:/Räkna hela första året/i}).click();
  await page.getByTestId('family-mobile-commercial-cta').click();

  await expect(page).toHaveURL(/#family-commercial-options$/);
  await expect(page.getByText(/Aktiva mobilpartners med familjerelevans/i)).toBeVisible();
  await expect(page.locator('a[rel~="sponsored"]')).not.toHaveCount(0);
});

test('family SEO metadata and H1 remain stable',async({page})=>{
  await page.goto(route);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/mobil/lonar-sig-familjeabonnemang/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','index,follow');
  await expect(page.getByRole('heading',{level:1,name:'Lönar sig familjeabonnemang för er?'})).toBeVisible();
});

test('family guide exposes calculator without changing canonical',async({page})=>{
  await page.goto('/mobil/familjeabonnemang/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/mobil/familjeabonnemang/');
  await expect(page.getByRole('link',{name:/Öppna familjekalkylen/i})).toHaveAttribute('href','/mobil/lonar-sig-familjeabonnemang/');
});

for(const viewport of [
  {width:360,height:800},
  {width:390,height:844},
  {width:430,height:932},
]){
  test('family calculator has no horizontal overflow @ '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto(route);
    await fillBaseExample(page);
    await page.getByRole('button',{name:/Räkna hela första året/i}).click();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('family choice is useful without entering any prices or completing a form',async({page})=>{
 await page.goto(route+'?qa=1');
 const start=page.getByTestId('family-start-choice');
 await expect(start.getByRole('heading',{name:/Har du priser att jämföra/})).toBeVisible();
 await expect(page.getByTestId('family-quick-calculator')).toHaveCount(0);
 await expect(page.getByTestId('family-exact-calculator')).toHaveCount(0);
 await page.getByRole('button',{name:'3 personer'}).click();
 await start.getByRole('button',{name:/Nej, visa familjeabonnemang/}).click();
 const option=page.getByTestId('family-mobile-no-prices');
 await expect(option).toBeVisible();
 await expect(option).toContainText('ingen egen liveprislista');
 const exits=option.locator('a[data-placement="family_calculator_no_prices"]');
 await expect(exits).toHaveCount(5);
 const names=await exits.evaluateAll(els=>els.map(el=>el.getAttribute('data-partner')||''));
 expect(names).toEqual([...names].sort((a,b)=>a.localeCompare(b,'sv')));
 for(const exit of await exits.all()){
  await expect(exit).toHaveAttribute('rel',/sponsored/);
  await expect(exit).toHaveAttribute('data-intent','family');
  await expect(exit).toHaveAttribute('data-category','mobil');
 }
 await expect(page.getByTestId('family-mobile-result')).toHaveCount(0);
});

test('three quick prices show a correctly labeled simplified annual comparison',async({page})=>{
 await page.goto(route+'?qa=1');
 await page.getByRole('button',{name:/Ja, räkna på våra priser/}).click();
 const calculator=page.getByTestId('family-quick-calculator');
 await expect(calculator).toBeVisible();
 await calculator.getByLabel('Vad betalar ni tillsammans idag?').fill('550');
 await calculator.getByLabel('Pris för familjens huvudabonnemang').fill('299');
 await expect(page.getByRole('button',{name:/Jämför era månadskostnader/})).toBeDisabled();
 await calculator.getByLabel('Pris per extra person (skriv 0 om gratis)').fill('49');
 await page.getByRole('button',{name:/Jämför era månadskostnader/}).click();
 await expect(page.getByTestId('separate-annual')).toContainText('6 600');
 await expect(page.getByTestId('family-annual')).toContainText('5 352');
 await expect(page.getByTestId('family-difference')).toContainText('1 248');
 await expect(page.getByTestId('family-mobile-result')).toContainText('Förenklad jämförelse');
 await expect(page.getByTestId('family-mobile-commercial-cta')).toBeVisible();
});

test('price-free path and comparison events contain no user-entered bills',async({page})=>{
 await page.addInitScript(()=>{(window as any).dataLayer=[];});
 await page.goto(route+'?qa=1');
 await page.getByRole('button',{name:/Ja, räkna på våra priser/}).click();
 const calculator=page.getByTestId('family-quick-calculator');
 await calculator.getByLabel('Vad betalar ni tillsammans idag?').fill('98765');
 await calculator.getByLabel('Pris för familjens huvudabonnemang').fill('299');
 await calculator.getByLabel('Pris per extra person (skriv 0 om gratis)').fill('0');
 await page.getByRole('button',{name:/Jämför era månadskostnader/}).click();
 const events=await page.evaluate(()=>(window as any).dataLayer||[]);
 const ready=events.find((event:any)=>event.event==='family_mobile_cost_ready');
 expect(ready).toBeTruthy();
 expect(ready.mode).toBe('quick');
 for(const field of ['annual_difference','monthly_cost','people_cost','separate_monthly','family_regular_main','family_regular_extra','price']){
  expect(ready).not.toHaveProperty(field);
 }
});

for(const width of [360,390,430,1024,1440]){
 test('family quick and no-price partner UX at '+width+'px',async({page},info)=>{
  await page.setViewportSize({width,height:width<=430?844:900});
  await page.goto(route+'?qa=1');
  await page.getByRole('button',{name:/Nej, visa familjeabonnemang/}).click();
  await expect(page.getByTestId('family-mobile-no-prices')).toBeVisible();
  let overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('button',{name:/Ja, räkna på våra priser/}).click();
  await expect(page.getByTestId('family-quick-calculator')).toBeVisible();
  overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:`test-results/screenshots/ux-family-${info.project.name}-${width}.png`,fullPage:true});
 });
}
