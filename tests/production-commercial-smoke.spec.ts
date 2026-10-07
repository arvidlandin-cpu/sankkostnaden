import { expect, test, type Page } from '@playwright/test';

const q=(path:string)=>path+(path.includes('?')?'&':'?')+'qa=1';

async function fillFirstYear(page:Page){
  const a=page.getByTestId('offer-a').locator('input[type="number"]');
  const b=page.getByTestId('offer-b').locator('input[type="number"]');
  for(const [input,value] of [[a.nth(0),'199'],[a.nth(1),'6'],[a.nth(2),'449'],[a.nth(3),'0'],[a.nth(4),'299'],[b.nth(0),'349'],[b.nth(1),'12'],[b.nth(2),'499'],[b.nth(3),'0'],[b.nth(4),'0']] as const){
    await input.fill(value);
  }
}

test('live production: first-year cost reaches commercial handoff without affiliate click',async({page})=>{
  await page.goto(q('/verktyg/forstaarskostnad/'),{waitUntil:'domcontentloaded'});
  await fillFirstYear(page);
  await expect(page.getByTestId('comparison-result')).toContainText('Alternativ A');
  await expect(page.getByTestId('first-year-commercial-cta')).toBeVisible();
});

test('live production: switch calendar calculates a plan',async({page})=>{
  await page.goto(q('/verktyg/byteskalender/'),{waitUntil:'domcontentloaded'});
  await page.locator('input[type="date"]').fill('2027-01-31');
  await page.getByLabel('Antal för uppsägningstid').fill('1');
  await page.getByLabel('Enhet för uppsägningstid').selectOption('months');
  await page.getByRole('button',{name:/Räkna min bytesplan/i}).click();
  await expect(page.getByTestId('switch-action-date')).toContainText('31 december 2026');
  await expect(page.getByTestId('switch-calendar-commercial-cta')).toBeVisible();
});

test('live production: electricity calculator calculates annual comparison',async({page})=>{
  await page.goto(q('/verktyg/elavtalskostnad/'),{waitUntil:'domcontentloaded'});
  await page.getByLabel('Årsförbrukning i kWh').fill('20000');
  const a=page.getByTestId('electricity-offer-a').locator('input[type="number"]');
  const b=page.getByTestId('electricity-offer-b').locator('input[type="number"]');
  await a.nth(0).fill('85');
  await a.nth(1).fill('49');
  await a.nth(2).fill('600');
  await b.nth(0).fill('82');
  await b.nth(1).fill('79');
  await b.nth(2).fill('0');
  await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();
  await expect(page.getByTestId('electricity-cost-result')).toContainText('360');
  await expect(page.getByTestId('electricity-cost-commercial-cta')).toBeVisible();
});

test('live production: family mobile calculator reaches result',async({page})=>{
  await page.goto(q('/mobil/lonar-sig-familjeabonnemang/'),{waitUntil:'domcontentloaded'});
  const inputs=page.locator('section[aria-label="Familjens mobilkostnad"] input[type="number"]');
  for(const [index,value] of [['0','149'],['1','149'],['2','99'],['3','99'],['4','299'],['5','99'],['6','199'],['7','49'],['8','6'],['9','0']] as const){
    await inputs.nth(Number(index)).fill(value);
  }
  await page.getByRole('button',{name:/Räkna hela första året/i}).click();
  await expect(page.getByTestId('family-mobile-result')).toContainText('Familjeupplägget är billigare');
  await expect(page.getByTestId('family-mobile-commercial-cta')).toBeVisible();
});

test('live production: household costs hand off locally to prioritizer',async({page})=>{
  await page.goto(q('/verktyg/hushallskostnadskollen/'),{waitUntil:'domcontentloaded'});
  await page.getByLabel('El, kronor per månad').fill('800');
  await page.getByLabel('Bredband, kronor per månad').fill('500');
  await page.getByLabel('Mobil, kronor per månad').fill('700');
  await page.getByLabel('Försäkringar, kronor per månad').fill('600');
  const link=page.getByRole('link',{name:/Prioritera mina avtal/i});
  await expect(link).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/app\/\?src=hushallskostnadskollen/);
  await expect(page.getByText('2 600 kr')).toBeVisible();
});

test('live production smoke never creates an analytics dataLayer on qa=1',async({page})=>{
  await page.goto(q('/app/'),{waitUntil:'domcontentloaded'});
  const disabled=await page.evaluate(()=>Boolean((window as any)['ga-disable-G-E2XTJVY5EX']));
  expect(disabled).toBe(true);
});


test('live production: Cost Check quick path appears after a high-intent answer',async({page})=>{
  await page.goto(q('/app/'),{waitUntil:'domcontentloaded'});
  await page.getByRole('button',{name:/Priset har ändrats eller avtalet känns dyrt/i}).click();
  await expect(page.getByText('SNABB VÄG')).toBeVisible();
  await expect(page.locator('a[data-placement="cost_check_quick_path"]')).toHaveCount(1);
});
