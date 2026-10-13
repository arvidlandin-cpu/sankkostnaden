import { expect, test } from '@playwright/test';

// The owner's uploaded 13 Oct screenshots were taken at extremely low browser
// zoom. Visual acceptance must use real, declared CSS viewport pixels, not the
// physical page width of a browser scaled to ~20–25%.
const categories = ['bredband', 'elavtal', 'mobil', 'forsakring', 'ekonomi'] as const;

for (const width of [390, 1440]) {
  test('P0L home preserves large, useful first-screen journey at ' + width, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto('/?p0lqa=1', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { level: 1, name: /Sänk dina fasta kostnader/i })).toBeVisible();
    await expect(page.getByTestId('home-decision-explorer')).toBeVisible();
    await expect(page.locator('#startval')).toBeVisible();
    await expect(page.getByRole('link', { name: /Starta Kostnadskollen/ }).first()).toHaveAttribute('href', '/app/');

    const position = await page.locator('#startval').boundingBox();
    expect(position).not.toBeNull();
    // Desktop: at least the beginning of the actual choice should be within
    // the first screen; mobile: do not clip or horizontally hide the chooser.
    if (width === 1440) expect(position!.y).toBeLessThan(900);

    const overflow = await page.evaluate(() =>
      Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: testInfo.outputPath('p0l-home-' + width + '.png'), fullPage: true });
  });

  for (const category of categories) {
    test('P0L ' + category + ' shows quickstart early at ' + width, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto('/' + category + '/?p0lqa=1', { waitUntil: 'networkidle' });
      const quickstart = page.getByTestId('category-journey-' + (category === 'elavtal' ? 'el' : category === 'forsakring' ? 'forsakring' : category === 'ekonomi' ? 'ekonomi' : category));
      await expect(quickstart).toBeVisible();
      await expect(quickstart.getByRole('button', { name: /Jag vill jämföra/i })).toBeVisible();
      const position = await quickstart.boundingBox();
      expect(position).not.toBeNull();
      if (width === 1440) expect(position!.y).toBeLessThan(900);
      await quickstart.getByRole('button', { name: /Jag vill jämföra/i }).click();
      await expect(quickstart.getByRole('button', { name: /Jag vill jämföra/i })).toHaveAttribute('aria-pressed', 'true');

      const overflow = await page.evaluate(() =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      await page.screenshot({ path: testInfo.outputPath('p0l-' + category + '-' + width + '.png'), fullPage: true });
    });
  }
}
