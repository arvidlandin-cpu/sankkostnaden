import { expect, test, type Page } from '@playwright/test';

const route = '/experiments/mobile-surf-pilot/';

async function answerLowProfile(page: Page) {
  await page.getByRole('button', { name: 'Nästan alltid wifi' }).click();
  await page.getByRole('button', { name: 'Meddelanden, kartor, bank' }).click();
  await page.getByRole('button', { name: 'Bara mitt abonnemang' }).click();
  await expect(page.getByText('SURFPROFIL · LÅG')).toBeVisible();
}

for (const viewport of [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
]) {
  for (const variant of ['a', 'b'] as const) {
    test(`pilot variant ${variant.toUpperCase()} @ ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${route}?variant=${variant}`);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow,noarchive');
      await expect(page.getByTestId('pilot-variant')).toHaveText(`Variant ${variant.toUpperCase()}`);

      await answerLowProfile(page);

      if (variant === 'a') {
        await expect(page.getByTestId('pilot-partner-card')).toHaveCount(0);
        await page.getByTestId('pilot-control-continue').click();
      } else {
        await expect(page.getByTestId('pilot-partner-card')).toBeVisible();
      }

      await expect(page.getByTestId('pilot-partner-card')).toBeVisible();
      await expect(page.getByTestId('pilot-commercial-locked')).toHaveAttribute('aria-disabled', 'true');

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);

      await page.screenshot({
        path: `test-results/mobile-surf-pilot-${variant}-${viewport.width}.png`,
        fullPage: true,
      });
    });
  }
}

test('changed answer leaves the pilot branch and removes direct partner', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${route}?variant=b`);
  await answerLowProfile(page);
  await expect(page.getByTestId('pilot-partner-card')).toBeVisible();

  await page.getByRole('button', { name: 'Mobilen är mitt huvudinternet' }).click();
  await expect(page.getByText('SURFPROFIL · NORMAL')).toBeVisible();
  await expect(page.getByTestId('pilot-partner-card')).toHaveCount(0);
  await expect(page.getByTestId('pilot-neutral-continuation')).toBeVisible();
});

test('no verified partner shows no-match state and never fabricates a link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${route}?variant=b&partner=none`);
  await answerLowProfile(page);
  await expect(page.getByTestId('pilot-no-match')).toBeVisible();
  await expect(page.getByTestId('pilot-partner-card')).toHaveCount(0);
});

test('pilot keeps QA telemetry local and exposes no active sponsored CTA', async ({ page }) => {
  await page.goto(`${route}?variant=b`);
  await answerLowProfile(page);

  const events = await page.evaluate(() => window.__SK_MOBILE_SURF_PILOT_EVENTS__ || []);
  expect(events.some(event => event.event === 'pilot_assignment')).toBeTruthy();
  expect(events.some(event => event.event === 'pilot_result_view')).toBeTruthy();
  await expect(page.locator('a[rel~="sponsored"]')).toHaveCount(0);
});
