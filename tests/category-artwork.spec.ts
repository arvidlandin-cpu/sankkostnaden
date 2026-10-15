import { test, expect } from '@playwright/test';
import { getCategoryArtwork, type ArtworkCategory } from '../lib/categoryArtwork';

const hubs: { category: ArtworkCategory; route: string }[] = [
  { category: 'bredband', route: '/bredband/' },
  { category: 'el', route: '/elavtal/' },
  { category: 'mobil', route: '/mobil/' },
  { category: 'forsakring', route: '/forsakring/' },
  { category: 'ekonomi', route: '/ekonomi/' },
];

for (const hub of hubs) {
  test(`${hub.category}: local editorial artwork actually loads on desktop`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${hub.route}?qa=1`, { waitUntil: 'domcontentloaded' });
    const image = page.getByTestId(`p0h-hero-photo-${hub.category}`);
    const currentBreadcrumb = page.locator('.categoryHero .breadcrumbs [aria-current="page"]');
    if (await currentBreadcrumb.count()) {
      const contrast = await currentBreadcrumb.evaluate(node => {
        const luminance = (color: string) => {
          const rgb = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(channel => {
            const value = channel / 255;
            return value <= .04045 ? value / 12.92 : Math.pow((value + .055) / 1.055, 2.4);
          });
          return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
        };
        const foreground = luminance(getComputedStyle(node).color);
        const background = luminance(getComputedStyle(node.closest('.categoryHero')!).backgroundColor);
        return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05);
      });
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    }
    const artwork = getCategoryArtwork(hub.category);
    await expect(image).toHaveAttribute('src', artwork.src);
    await expect(image).toHaveAttribute('width', String(artwork.width));
    await expect(image).toHaveAttribute('height', String(artwork.height));
    await expect(image).toHaveAttribute('alt', '');
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth >= 1000)).toBe(true);
    const imageBox = await image.boundingBox();
    const titleBox = await page.locator('h1').boundingBox();
    expect(imageBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    expect(imageBox!.x).toBeGreaterThanOrEqual(titleBox!.x + titleBox!.width - 1);
    expect(imageBox!.width / imageBox!.height).toBeGreaterThan(1.4);
    expect(imageBox!.width / imageBox!.height).toBeLessThan(1.6);
    const disclosureBox = await page.locator('.categoryHero .fine').boundingBox();
    const laneBox = await page.getByTestId('v10-category-lane').boundingBox();
    expect(disclosureBox).not.toBeNull();
    expect(laneBox).not.toBeNull();
    expect(laneBox!.y - disclosureBox!.y - disclosureBox!.height).toBeGreaterThanOrEqual(44);
  });

  for (const width of [360, 390, 430]) {
    test(`${hub.category}: ${width}px keeps the action before decorative imagery`, async ({ page }) => {
      await page.setViewportSize({ width, height: 932 });
      await page.goto(`${hub.route}?qa=1`, { waitUntil: 'domcontentloaded' });
      const image = page.getByTestId(`p0h-hero-photo-${hub.category}`);
      const action = page.locator('.categoryHeroActions a').first();
      await expect(action).toBeVisible();
      await expect(image).toBeVisible();
      const actionBox = await action.boundingBox();
      const imageBox = await image.boundingBox();
      expect(actionBox).not.toBeNull();
      expect(imageBox).not.toBeNull();
      expect(actionBox!.height).toBeGreaterThanOrEqual(44);
      expect(imageBox!.y).toBeGreaterThanOrEqual(actionBox!.y + actionBox!.height);
      expect(imageBox!.height).toBeLessThanOrEqual(221);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

for (const guide of [
  { category: 'bredband' as const, route: '/bredband/billigaste-bredbandet/' },
  { category: 'el' as const, route: '/elavtal/sa-laser-du-elfakturan/' },
]) {
  test(`${guide.category}: legacy guide uses its own artwork without a mobile image barrier`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${guide.route}?qa=1`, { waitUntil: 'domcontentloaded' });
    const image = page.getByTestId(`legacy-photo-${guide.category}`);
    await expect(image).toHaveAttribute('src', getCategoryArtwork(guide.category).src);
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth >= 1000)).toBe(true);
    const gatewayHeading = page.locator('.gatewayHead h2');
    if (await gatewayHeading.count()) await expect(gatewayHeading).toHaveCSS('color', 'rgb(255, 255, 255)');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(image).toBeHidden();
  });
}
