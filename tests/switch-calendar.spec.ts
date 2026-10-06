import { expect, test, type Page } from '@playwright/test';

const route='/verktyg/byteskalender/';

async function setNotice(page:Page,value:string,unit:'months'|'days'='months'){
  await page.getByLabel('Uppsägningstid').fill(value);
  await page.getByLabel('Enhet för uppsägningstid').selectOption(unit);
}

test('fixed contract calculates action, end and next-start dates',async({page})=>{
  await page.goto(route);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow,noarchive');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/verktyg/byteskalender/');

  await page.locator('input[type="date"]').fill('2027-01-31');
  await setNotice(page,'1','months');
  await page.getByRole('button',{name:/Räkna min bytesplan/i}).click();

  await expect(page.getByTestId('switch-action-date')).toContainText('31 december 2026');
  await expect(page.getByTestId('switch-end-date')).toContainText('31 januari 2027');
  await expect(page.getByTestId('switch-next-date')).toContainText('1 februari 2027');
  await expect(page.getByTestId('switch-calendar-commercial-cta')).toBeVisible();
});

test('rolling contract calculates estimated end from chosen cancellation date',async({page})=>{
  await page.goto(route);
  await page.getByRole('button',{name:/Det löper tills jag säger upp/i}).click();
  await page.locator('input[type="date"]').fill('2026-10-15');
  await setNotice(page,'1','months');
  await page.getByRole('button',{name:/Räkna min bytesplan/i}).click();

  await expect(page.getByTestId('switch-action-date')).toContainText('15 oktober 2026');
  await expect(page.getByTestId('switch-end-date')).toContainText('15 november 2026');
  await expect(page.getByTestId('switch-next-date')).toContainText('16 november 2026');
});

test('broadband branch shows broadband partner handoff',async({page})=>{
  await page.goto(route+'?kategori=bredband&src=test');
  await expect(page.getByRole('button',{name:'Bredband'})).toHaveClass(/selected/);
  await page.locator('input[type="date"]').fill('2027-02-28');
  await setNotice(page,'30','days');
  await page.getByRole('button',{name:/Räkna min bytesplan/i}).click();
  await page.getByTestId('switch-calendar-commercial-cta').click();
  await expect(page).toHaveURL(/#commercial-options$/);
  await expect(page.getByText(/Börja med adressen/i)).toBeVisible();
});

test('byta-elavtal keeps canonical and exposes byteskalender',async({page})=>{
  await page.goto('/elavtal/byta-elavtal/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/byta-elavtal/');
  await expect(page.getByRole('link',{name:/Öppna byteskalendern/i})).toHaveAttribute('href','/verktyg/byteskalender/?kategori=el&src=byta_elavtal');
});

for(const viewport of [
  {width:360,height:800},
  {width:390,height:844},
  {width:430,height:932},
]){
  test('byteskalender has no horizontal overflow @ '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto(route);
    await page.locator('input[type="date"]').fill('2027-01-31');
    await page.getByRole('button',{name:/Räkna min bytesplan/i}).click();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
