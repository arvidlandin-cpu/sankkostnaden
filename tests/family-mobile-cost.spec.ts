import { expect, test, type Page } from '@playwright/test';

const route='/mobil/lonar-sig-familjeabonnemang/';

async function fillBaseExample(page:Page){
  const separate=page.locator('section[aria-label="Familjens mobilkostnad"] input[type="number"]');
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
