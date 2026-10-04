import { test, expect, type Page } from '@playwright/test';

const route = '/experiments/mobile-surf-pilot/';

async function answerLowProfile(page: Page) {
  await page.getByRole('button', { name: 'Nästan alltid wifi' }).click();
  await page.getByRole('button', { name: 'Meddelanden, kartor, bank' }).click();
  await page.getByRole('button', { name: 'Bara mitt abonnemang' }).click();
  await expect(page.getByText('SURFPROFIL · LÅG')).toBeVisible();
}

for (const variant of ['a', 'b'] as const) {
  test(`real iPhone pilot variant ${variant.toUpperCase()}`, async ({ page }) => {
    await page.goto(`${route}?variant=${variant}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Hur mycket surf behöver du/i })).toBeVisible();
    const robots = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') || '');
    expect(robots).toBe('noindex,nofollow,noarchive');

    await answerLowProfile(page);

    if (variant === 'a') {
      await expect(page.getByTestId('pilot-partner-card')).toHaveCount(0);
      await page.getByTestId('pilot-control-continue').click();
    }

    const card = page.getByTestId('pilot-partner-card');
    await expect(card).toBeVisible();

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

    const metrics = await page.evaluate(() => ({
      docScrollWidth: document.documentElement.scrollWidth,
      docClientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
    }));

    expect(Math.max(metrics.docScrollWidth, metrics.bodyScrollWidth)).toBeLessThanOrEqual(metrics.docClientWidth + 1);
    await expect(page.getByText(/Annonslänk/i)).toBeVisible();
  });
}
