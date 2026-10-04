import { expect, test, type Page } from '@playwright/test';

const route = '/experiments/mobile-surf-pilot/';

async function answerLowProfile(page: Page) {
  await page.getByRole('button', { name: 'Nästan alltid wifi' }).click();
  await page.getByRole('button', { name: 'Meddelanden, kartor, bank' }).click();
  await page.getByRole('button', { name: 'Bara mitt abonnemang' }).click();
  await expect(page.getByText('SURFPROFIL · LÅG')).toBeVisible();
}

async function expectTrackedAffiliateLink(page: Page, variant: 'a' | 'b') {
  const link = page.getByTestId('pilot-affiliate-link');
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  expect(href).toBeTruthy();
  const url = new URL(href!);
  expect(url.hostname).toBe('go.hallon.se');
  expect(url.searchParams.get('epi')).toMatch(/^[a-z0-9]{16,40}$/i);
  expect(url.searchParams.get('epi2')).toBe(`v${variant}`);
  expect(url.searchParams.get('epi3')).toBe('surf_low_own');
  expect(url.searchParams.get('epi5')).toBe('msv1');
  await expect(link).toHaveAttribute('data-affiliate-partner', 'Hallon');
  await expect(link).toHaveAttribute('data-affiliate-category', 'mobil');
  await expect(link).toHaveAttribute('data-affiliate-intent', 'data');
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
      await expectTrackedAffiliateLink(page, variant);
      await expect(page.getByTestId('pilot-affiliate-link')).toHaveAttribute(
        'data-affiliate-placement',
        variant === 'a' ? 'pilot_compare_result' : 'pilot_result_direct'
      );

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
  await expect(page.locator('a[rel~="sponsored"]')).toHaveCount(0);
});

test('affiliate click stores local click id and emits pilot click event without navigation', async ({ page }) => {
  await page.goto(`${route}?variant=b`);
  await answerLowProfile(page);
  await expectTrackedAffiliateLink(page, 'b');

  await page.evaluate(() => {
    document.addEventListener('click', event => {
      const target = event.target;
      if (target instanceof Element && target.closest('[data-testid="pilot-affiliate-link"]')) {
        event.preventDefault();
      }
    }, true);
  });

  await page.getByTestId('pilot-affiliate-link').click();

  const state = await page.evaluate(() => ({
    clicks: window.__SK_MOBILE_SURF_PILOT_CLICKS__ || [],
    events: window.__SK_MOBILE_SURF_PILOT_EVENTS__ || [],
    stored: JSON.parse(window.localStorage.getItem('sk-mobile-surf-pilot-v1-clicks') || '[]'),
  }));

  expect(state.clicks).toHaveLength(1);
  expect(state.stored).toHaveLength(1);
  expect(state.clicks[0].click_id).toBe(state.stored[0].click_id);
  expect(state.events.some(event => event.event === 'pilot_affiliate_click')).toBeTruthy();
});
