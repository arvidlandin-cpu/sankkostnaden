import { test, expect } from '@playwright/test';

const routes = [
  { slug: 'home', path: '/' },
  { slug: 'bredband', path: '/bredband/' },
  { slug: 'mobil', path: '/mobil/' },
  { slug: 'el', path: '/elavtal/' },
  { slug: 'forsakring', path: '/forsakring/' },
  { slug: 'ekonomi', path: '/ekonomi/' },
  { slug: 'kostnadskollen', path: '/app/' },
  { slug: 'trygghetsforsakring', path: '/forsakring/trygghetsforsakring/' },
];

test('full real-iPhone QA', async ({ page }) => {
  for (const route of routes) {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(450);

    const metrics = await page.evaluate(() => ({
      docScrollWidth: document.documentElement.scrollWidth,
      docClientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
    }));

    expect(
      Math.max(metrics.docScrollWidth, metrics.bodyScrollWidth),
      `Horizontal overflow on ${route.path}: ${JSON.stringify(metrics)}`
    ).toBeLessThanOrEqual(metrics.docClientWidth + 1);

    const quickBar = page.locator('.mobileQuickBar');
    if (await quickBar.count()) {
      await expect(quickBar).toBeVisible();
      const box = await quickBar.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.x).toBeGreaterThanOrEqual(-1);
        expect(box.x + box.width).toBeLessThanOrEqual(metrics.docClientWidth + 1);
      }
    }

    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(100);
  }

  await page.goto('/app/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(350);
  const question = page.locator('[class*="question"]').filter({ has: page.locator('button') }).first();
  const options = question.locator('button');
  await expect(options.first()).toBeVisible();
  await options.first().click();
  const next = page.getByRole('button', { name: /Klart – till/i });
  await expect(next).toBeEnabled();
  await next.click();

  await page.goto('/forsakring/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(350);
  const home = page.getByRole('button', { name: /^Hem$/i });
  if (await home.count()) {
    await home.click();
    await expect(page.getByText(/Jämför hemförsäkring direkt/i)).toBeVisible();
  }
});
