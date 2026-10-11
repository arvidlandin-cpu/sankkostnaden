import { test, expect } from '@playwright/test';

/** P0D: inspect the *revealed* family mobile result, not only the landing screen. */
const widths = [360, 390, 430, 1024, 1440];

function luminance(rgb: number[]) {
  const linear = rgb.map(value => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function channels(color: string) {
  const values = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
  if (values.length !== 3) throw new Error('Unexpected computed color: ' + color);
  return values;
}
function contrast(foreground: string, background: string) {
  const a = luminance(channels(foreground));
  const b = luminance(channels(background));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

for (const width of widths) {
  test('family annual result labels stay readable at ' + width + 'px', async ({page}, testInfo) => {
    await page.setViewportSize({width, height: 900});
    await page.goto('/mobil/lonar-sig-familjeabonnemang/', {waitUntil:'networkidle'});
    await page.getByRole('button', {name: /Ja, räkna på våra priser/}).click();
    await page.getByLabel('Vad betalar ni tillsammans idag?').fill('800');
    await page.getByLabel('Pris för familjens huvudabonnemang').fill('350');
    await page.getByLabel('Pris per extra person (skriv 0 om gratis)').fill('100');
    await page.getByRole('button', {name:'Jämför era månadskostnader'}).click();

    const result = page.getByTestId('family-mobile-result');
    await expect(result).toBeVisible();
    await expect(result.locator('article')).toHaveCount(3);
    const palette = await result.locator('article').evaluateAll(articles =>
      articles.map(article => ({
        foreground: getComputedStyle(article.querySelector('small')!).color,
        background: getComputedStyle(article).backgroundColor,
      }))
    );
    for (const item of palette) {
      expect(contrast(item.foreground, item.background),
        'WCAG AA 4.5:1 for small result labels').toBeGreaterThanOrEqual(4.5);
    }
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, 'No horizontal overflow with the real result visible').toBeLessThanOrEqual(1);
    await testInfo.attach('family-mobile-result-' + width + 'px', {
      body: await page.screenshot({path: 'test-results/screenshots/p0d-family-result-' + testInfo.project.name + '-' + width + '.png', fullPage: true}),
      contentType: 'image/png',
    });
  });
}
