import { expect, test } from '@playwright/test';

for (const width of [360, 390, 430, 1440]) {
  test('home explorer is usable at ' + width + 'px without hidden links or overflow', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const explorer = page.getByTestId('home-decision-explorer');
    await expect(explorer.getByRole('button', { name: 'Bredband' })).toBeVisible();
    await expect(explorer.getByRole('button', { name: 'El', exact: true })).toBeVisible();
    await expect(explorer.getByRole('button', { name: 'Mobil', exact: true })).toBeVisible();
    await expect(explorer.getByRole('button', { name: 'Försäkring', exact: true })).toBeVisible();

    const el = explorer.getByRole('button', { name: 'El', exact: true });
    await el.click();
    await expect(el).toHaveAttribute('aria-pressed', 'true');
    await expect(explorer.getByTestId('home-explorer-panel')).toContainText('Börja med rätt sorts elavtal.');
    await expect(explorer.getByRole('link', { name: /Se elavtalsalternativ/ })).toHaveAttribute('href', '/elavtal/');
    await expect(explorer.getByRole('link', { name: /Hitta rätt avtalsform/ })).toHaveAttribute('href', '/elavtal/vilket-elavtal-passar-mig/');

    const mobile = explorer.getByRole('button', { name: 'Mobil', exact: true });
    await mobile.focus();
    await page.keyboard.press('Enter');
    await expect(mobile).toHaveAttribute('aria-pressed', 'true');
    await expect(el).toHaveAttribute('aria-pressed', 'false');
    await expect(explorer.getByRole('link', { name: /Se mobilalternativ/ })).toHaveAttribute('href', '/mobil/');

    // Existing quick-test internal links remain in the HTML, for visitors and crawlers.
    for (const href of [
      '/bredband/vilken-hastighet-behover-jag/',
      '/elavtal/vilket-elavtal-passar-mig/',
      '/mobil/hur-mycket-surf-behover-jag/',
      '/forsakring/hemforsakring-skyddskoll/',
    ]) {
      await expect(explorer.locator('nav a[href="' + href + '"]')).toHaveCount(1);
    }

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
}
