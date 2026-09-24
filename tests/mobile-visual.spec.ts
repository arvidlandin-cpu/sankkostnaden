import { test, expect } from '@playwright/test';

const viewports = [
  { name: '360', width: 360, height: 800 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
];

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

for (const viewport of viewports) {
  for (const route of routes) {
    test(`${route.slug} @ ${viewport.name}px has no page overflow`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route.path, { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
      }));

      expect(
        Math.max(overflow.scrollWidth, overflow.bodyScrollWidth),
        `Horizontal overflow on ${route.path}: ${JSON.stringify(overflow)}`
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);

      const quickBar = page.locator('.mobileQuickBar');
      if (await quickBar.count()) {
        await expect(quickBar).toBeVisible();
        const box = await quickBar.boundingBox();
        expect(box).not.toBeNull();
        if (box) {
          expect(box.x).toBeGreaterThanOrEqual(-1);
          expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
        }
      }

      await page.screenshot({
        path: `test-results/screenshots/${testInfo.project.name}-${route.slug}-${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
}

test('Kostnadskollen works on 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/app/', { waitUntil: 'networkidle' });

  const answerFirstVisible = async () => {
    const question = page.locator('[class*="question"]').filter({ has: page.locator('button') }).first();
    const buttons = question.locator('button');
    await expect(buttons.first()).toBeVisible();
    await buttons.first().click();
  };

  await answerFirstVisible();
  const next = page.getByRole('button', { name: /Klart – till/i });
  await expect(next).toBeEnabled();
  await next.click();

  await page.screenshot({
    path: 'test-results/screenshots/kostnadskollen-interaction-390.png',
    fullPage: true,
  });
});

test('Insurance choice reveals relevant partners on 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/forsakring/', { waitUntil: 'networkidle' });

  const home = page.getByRole('button', { name: /^Hem$/i });
  if (await home.count()) {
    await home.click();
    await expect(page.getByText(/Jämför hemförsäkring direkt/i)).toBeVisible();
  }

  await page.screenshot({
    path: 'test-results/screenshots/forsakring-interaction-390.png',
    fullPage: true,
  });
});
