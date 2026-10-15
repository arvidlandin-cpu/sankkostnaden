import { expect, test } from '@playwright/test';

const cases = [
  { category: 'bredband', guide: '/bredband/100-100/?qa=1', path: '/verktyg/forstaarskostnad-bredband/', destination: '#commercial-broadband-options' },
  { category: 'mobil', guide: '/mobil/billigaste-mobilabonnemanget/?qa=1', path: '/verktyg/forstaarskostnad/', destination: '#commercial-mobile-options' },
] as const;

for (const entry of cases) {
  test(`${entry.category}: an explicit guide calculator link opens both price fields immediately`, async ({ page }) => {
    await page.goto(entry.guide);
    await page.getByRole('link', { name: 'Räkna förstaårskostnaden', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(entry.path));
    const a = page.getByTestId('offer-a').getByLabel('Ordinarie månadspris');
    const b = page.getByTestId('offer-b').getByLabel('Ordinarie månadspris');
    await expect(a).toBeVisible();
    await expect(b).toBeVisible();
    await expect(a).toHaveValue('');
    await expect(b).toHaveValue('');
    await expect(page.getByRole('heading', { name: 'Vad vill du göra?', exact: true })).toHaveCount(0);
    await expect(page.getByTestId('first-year-timeline')).toHaveCount(0);
    await expect(page.getByTestId('first-year-commercial-cta')).toHaveCount(0);
    await a.fill('249');
    await expect(page.getByTestId('first-year-timeline')).toHaveCount(0);
    await b.fill('299');
    await expect(page.getByTestId('comparison-result')).toContainText('600');
    await expect(page.getByTestId('first-year-timeline')).toBeVisible();
    await expect(page.getByTestId('first-year-commercial-cta')).toHaveAttribute('href', entry.destination);
    await page.getByRole('button', { name: 'Exakt med kampanjer och avgifter', exact: true }).click();
    await expect(page.getByTestId('offer-a').getByLabel('Ordinarie pris / mån')).toHaveValue('249');
    await expect(page.getByTestId('offer-a').locator('input[type="number"]')).toHaveCount(5);
    await expect(page.getByTestId('offer-a').getByLabel('Kampanjmånader')).toBeVisible();
  });

  test(`${entry.category}: no-price route stays available as a secondary action and preserves entered prices`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(entry.path + '?qa=1');
    await page.getByTestId('offer-a').getByLabel('Ordinarie månadspris').fill('249');
    await page.getByRole('button', { name: 'Visa aktuella alternativ', exact: true }).click();
    await expect(page.getByTestId('first-year-no-prices')).toBeVisible();
    await expect(page.getByTestId('offer-a')).toHaveCount(0);
    await expect(page.getByTestId('first-year-timeline')).toHaveCount(0);
    const early = page.getByTestId('first-year-early-partners');
    await expect(early).toHaveAttribute('href', entry.destination);
    await early.click();
    await expect(page).toHaveURL(new RegExp(entry.destination + '$'));
    const sponsored = page.locator(`${entry.destination} a[rel~="sponsored"]`);
    expect(await sponsored.count()).toBeGreaterThan(0);
    await expect(sponsored.first()).toHaveAttribute('data-category', entry.category);
    // Return without leaving this page or discarding the original known price.
    await page.getByRole('button', { name: 'Ja, jämför mina priser', exact: true }).click();
    await expect(page.getByTestId('offer-a').getByLabel('Ordinarie månadspris')).toHaveValue('249');
    await expect(page.getByTestId('offer-b').getByLabel('Ordinarie månadspris')).toHaveValue('');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });
}

test.describe('Server-rendered entry contract', () => {
  test.use({ javaScriptEnabled: false });
  for (const entry of cases) {
    test(`${entry.category}: prices exist before hydration and metadata is preserved`, async ({ page }) => {
      await page.goto(entry.path + '?qa=1');
      await expect(page.getByTestId('offer-a').getByLabel('Ordinarie månadspris')).toBeVisible();
      await expect(page.getByTestId('offer-b').getByLabel('Ordinarie månadspris')).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://sankkostnaden.se' + entry.path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow,noarchive');
    });
  }
  test('prototype retains its original initial choice and no price fields', async ({ page }) => {
    await page.goto('/experiments/forstaarskostnad/?qa=1');
    await expect(page.getByRole('heading', { name: 'Vad vill du göra?', exact: true })).toBeVisible();
    await expect(page.getByTestId('offer-a')).toHaveCount(0);
    await expect(page.getByTestId('offer-b')).toHaveCount(0);
  });
});
