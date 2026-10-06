import { expect, test, type Page } from '@playwright/test';

const prototypeRoute = '/experiments/forstaarskostnad/';
const commercialRoute = '/verktyg/forstaarskostnad/';

async function fillOfferA(page: Page) {
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
  await expect(cta).toHaveAttribute('href', '#partners');
  await cta.click();

  await expect(page).toHaveURL(/#partners$/);
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
  const inputs = page.getByTestId('offer-a').locator('input[type="number"]');
  await inputs.nth(0).fill('100');
  await inputs.nth(1).fill('24');
  await inputs.nth(2).fill('999');
  await expect(page.getByTestId('offer-a-total')).toContainText('1 200');
});
