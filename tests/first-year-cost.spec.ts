import { expect, test, type Page } from '@playwright/test';

const prototypeRoute = '/experiments/forstaarskostnad/';
const commercialRoute = '/verktyg/forstaarskostnad/';
const broadbandRoute = '/verktyg/forstaarskostnad-bredband/';

async function openExactComparison(page: Page) {
  const start = page.getByTestId('first-year-start');
  await start.getByRole('button', {name: /Ja, jämför mina priser/}).click();
  await page.getByRole('button', {name: /Exakt med kampanjer och avgifter/}).click();
}

async function fillOfferA(page: Page) {
  await openExactComparison(page);
  const offer = page.getByTestId('offer-a');
  const inputs = offer.locator('input[type="number"]');
  await inputs.nth(0).fill('199');
  await inputs.nth(1).fill('6');
  await inputs.nth(2).fill('449');
  await inputs.nth(3).fill('0');
  await inputs.nth(4).fill('299');
}

async function fillOfferB(page: Page) {
  const offer = page.getByTestId('offer-b');
  const inputs = offer.locator('input[type="number"]');
  await inputs.nth(0).fill('349');
  await inputs.nth(1).fill('12');
  await inputs.nth(2).fill('499');
  await inputs.nth(3).fill('0');
  await inputs.nth(4).fill('0');
}

test('calculates first-year cost and comparison correctly', async ({ page }) => {
  await page.goto(prototypeRoute);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow,noarchive');

  await fillOfferA(page);
  await fillOfferB(page);

  await expect(page.getByTestId('offer-a-total')).toContainText('4 187');
  await expect(page.getByTestId('offer-b-total')).toContainText('4 188');
  await expect(page.getByTestId('comparison-result')).toContainText('Alternativ A');
  await expect(page.getByTestId('comparison-result')).toContainText('1 kr');
});

test('never compares a filled offer against an empty offer', async ({ page }) => {
  await page.goto(commercialRoute);
  await fillOfferA(page);

  await expect(page.getByTestId('comparison-result')).toContainText('Fyll i det andra alternativet också');
  await expect(page.getByTestId('comparison-result')).not.toContainText('billigare första året');
  await expect(page.getByTestId('first-year-commercial-cta')).toHaveCount(0);
});

test('commercial tool hands off to active mobile comparison only after both offers are filled', async ({ page }) => {
  await page.goto(commercialRoute);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow,noarchive');

  await fillOfferA(page);
  await fillOfferB(page);

  const cta = page.getByTestId('first-year-commercial-cta');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '#commercial-mobile-options');
  await cta.click();

  await expect(page).toHaveURL(/#commercial-mobile-options$/);
  await expect(page.getByText('Vilka operatörer är mest relevanta för dig?')).toBeVisible();
  await expect(page.locator('a[rel~="sponsored"]')).not.toHaveCount(0);
});

test('mobile comparison exposes the first-year cost tool without changing metadata', async ({ page }) => {
  await page.goto('/mobil/billigaste-mobilabonnemanget/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sankkostnaden.se/mobil/billigaste-mobilabonnemanget/');
  const link = page.getByRole('link', { name: /Räkna förstaårskostnaden/i });
  await expect(link).toHaveAttribute('href', '/verktyg/forstaarskostnad/?src=mobil_billigaste');
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  test(`commercial mobile layout has no horizontal overflow @ ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(commercialRoute);
    await fillOfferA(page);
    await fillOfferB(page);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('campaign period is capped at 12 months', async ({ page }) => {
  await page.goto(prototypeRoute);
  await openExactComparison(page);
  const inputs = page.getByTestId('offer-a').locator('input[type="number"]');
  await inputs.nth(0).fill('100');
  await inputs.nth(1).fill('24');
  await inputs.nth(2).fill('999');
  await expect(page.getByTestId('offer-a-total')).toContainText('1 200');
});


test('broadband first-year tool is noindex and hands off to broadband partners', async ({ page }) => {
  await page.goto(broadbandRoute);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow,noarchive');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sankkostnaden.se/verktyg/forstaarskostnad-bredband/');
  await expect(page.getByText('KOSTNADSKALKYL · BREDBAND')).toBeVisible();

  await fillOfferA(page);
  await fillOfferB(page);

  const cta = page.getByTestId('first-year-commercial-cta');
  await expect(cta).toHaveAttribute('href', '#commercial-broadband-options');
  await cta.click();

  await expect(page).toHaveURL(/#commercial-broadband-options$/);
  await expect(page.getByText(/Börja med adressen/i)).toBeVisible();
  await expect(page.locator('a[rel~="sponsored"]')).not.toHaveCount(0);
});

test('cheapest broadband guide exposes first-year calculator without changing metadata', async ({ page }) => {
  await page.goto('/bredband/billigaste-bredbandet/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sankkostnaden.se/bredband/billigaste-bredbandet/');
  await expect(page.getByRole('heading', { level: 1, name: /Billigaste bredbandet/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Räkna förstaårskostnaden/i })).toHaveAttribute('href', '/verktyg/forstaarskostnad-bredband/?src=billigaste_bredbandet');
});

test('broadband no-binding guide exposes switch calendar without changing metadata', async ({ page }) => {
  await page.goto('/bredband/utan-bindningstid/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sankkostnaden.se/bredband/utan-bindningstid/');
  await expect(page.getByRole('link', { name: /Öppna byteskalendern/i })).toHaveAttribute('href', '/verktyg/byteskalender/?kategori=bredband&src=bredband_utan_bindning');
});

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  test(`commercial broadband layout has no horizontal overflow @ ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto(broadbandRoute);
    await fillOfferA(page);
    await fillOfferB(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

for (const [route, category] of [[commercialRoute,'mobil'],[broadbandRoute,'bredband']] as const) {
  test('first useful result without any bill fields for '+category, async ({page}) => {
    await page.goto(route);
    await expect(page.getByTestId('first-year-start')).toBeVisible();
    await expect(page.getByTestId('offer-a')).toHaveCount(0);
    await page.getByRole('button',{name:/Visa aktuella alternativ/}).click();
    await expect(page.getByTestId('first-year-no-prices')).toBeVisible();
    const early = page.getByTestId('first-year-early-partners');
    await expect(early).toHaveAttribute('href',category==='mobil'?'#commercial-mobile-options':'#commercial-broadband-options');
    await early.click();
    await expect(page.locator('a[rel~="sponsored"]')).not.toHaveCount(0);
    await expect(page.getByTestId('comparison-result')).toHaveCount(0);
  });
  test('quick ordinary prices compare only stated 12-month scenario for '+category, async ({page}) => {
    await page.goto(route);
    await page.getByRole('button',{name:/Ja, jämför mina priser/}).click();
    const a = page.getByTestId('offer-a');
    const b = page.getByTestId('offer-b');
    await expect(a.locator('input[type="number"]')).toHaveCount(1);
    await a.getByLabel('Ordinarie månadspris').fill('249');
    await b.getByLabel('Ordinarie månadspris').fill('299');
    await expect(a.getByTestId('offer-a-total')).toContainText('2 988');
    await expect(b.getByTestId('offer-b-total')).toContainText('3 588');
    await expect(page.getByTestId('comparison-result')).toContainText('600 kr');
    await expect(page.getByTestId('comparison-result')).toContainText('Förenklad beräkning');
    await page.getByRole('button',{name:/Exakt med kampanjer och avgifter/}).click();
    await expect(a.locator('input[type="number"]')).toHaveCount(5);
    await expect(a.getByLabel('Ordinarie pris / mån')).toHaveValue('249');
  });
}
for(const width of [360,390,430,1024,1440]){
 test('first-year click-first layout no horizontal overflow '+width,async({page})=>{
  await page.setViewportSize({width,height:860});
  await page.goto(commercialRoute);
  await page.getByRole('button',{name:/Visa aktuella alternativ/}).click();
  const overflow = await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
