import { expect, test } from '@playwright/test';

for (const width of [360, 390, 430, 1440]) {
  test('goal-driven home explorer is usable at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const explorer = page.getByTestId('home-decision-explorer');

    const level = explorer.getByRole('button', { name: 'Hitta rätt nivå' });
    await expect(level).toBeVisible();
    await expect(level).toHaveAttribute('aria-pressed', 'true');
    for (const href of [
      '/bredband/vilken-hastighet-behover-jag/',
      '/mobil/hur-mycket-surf-behover-jag/',
      '/elavtal/vilket-elavtal-passar-mig/',
      '/forsakring/hemforsakring-skyddskoll/',
    ]) {
      await expect(explorer.locator('#home-explorer-panel a[href="' + href + '"]')).toBeVisible();
    }

    const compare = explorer.getByRole('button', { name: 'Jämför två erbjudanden' });
    await compare.click();
    await expect(compare).toHaveAttribute('aria-pressed', 'true');
    await expect(level).toHaveAttribute('aria-pressed', 'false');
    await expect(explorer.getByTestId('home-explorer-panel')).toContainText('Se vad erbjudandena faktiskt kostar.');
    for (const href of ['/verktyg/elavtalskostnad/', '/verktyg/forstaarskostnad-bredband/', '/verktyg/forstaarskostnad/']) {
      await expect(explorer.locator('#home-explorer-panel a[href="' + href + '"]')).toBeVisible();
    }

    const household = explorer.getByRole('button', { name: 'Se hela hushållet' });
    await household.focus();
    await page.keyboard.press('Enter');
    await expect(household).toHaveAttribute('aria-pressed', 'true');
    await expect(explorer.getByRole('link', { name: /Räkna på hushållets kostnader/ })).toHaveAttribute('href', '/verktyg/hushallskostnadskollen/');

    const prioritize = explorer.getByRole('button', { name: 'Var ska jag börja?' });
    await prioritize.click();
    await expect(explorer.getByRole('link', { name: /Starta Kostnadskollen/ })).toHaveAttribute('href', '/app/');

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
}
