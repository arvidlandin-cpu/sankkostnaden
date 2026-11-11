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

const legacyArtworkGuides = [
  { category: 'bredband' as const, route: '/bredband/bredband-pa-min-adress/' },
  { category: 'bredband' as const, route: '/bredband/billigaste-bredbandet/' },
  { category: 'bredband' as const, route: '/bredband/basta-bredbandet/' },
  { category: 'el' as const, route: '/elavtal/sa-laser-du-elfakturan/' },
  { category: 'el' as const, route: '/elavtal/rorligt-fast-kvartspris/' },
  { category: 'el' as const, route: '/elavtal/billigaste-elavtalet/' },
];

for (const guide of legacyArtworkGuides) {
  for (const width of [390, 760, 761, 1440]) {
    test(`${guide.route}: ${width}px requests only artwork the guide displays`, async ({ page }) => {
      const artwork = getCategoryArtwork(guide.category);
      const artworkRequests: string[] = [];
      page.on('request', request => {
        if (new URL(request.url()).pathname === artwork.src) artworkRequests.push(request.url());
      });
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${guide.route}?qa=1`, { waitUntil: 'load' });
      const image = page.getByTestId(`legacy-photo-${guide.category}`);
      await expect(image).toHaveAttribute('src', artwork.src);
      await expect(image).toHaveAttribute('alt', '');
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
      if (width <= 760) {
        await expect(image).toBeHidden();
        expect(await image.evaluate((node: HTMLImageElement) => node.currentSrc)).toMatch(/^data:image\/gif;base64,/);
        expect(artworkRequests).toEqual([]);
      } else {
        await expect(image).toBeVisible();
        expect(await image.evaluate((node: HTMLImageElement) => new URL(node.currentSrc).pathname)).toBe(artwork.src);
        expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBe(artwork.width);
        expect(artworkRequests).toHaveLength(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

for (const guide of [legacyArtworkGuides[0], legacyArtworkGuides[3]]) {
  test(`${guide.category}: enlarging a mobile guide loads its desktop artwork`, async ({ page }) => {
    const artwork = getCategoryArtwork(guide.category);
    const artworkRequests: string[] = [];
    page.on('request', request => {
      if (new URL(request.url()).pathname === artwork.src) artworkRequests.push(request.url());
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${guide.route}?qa=1`, { waitUntil: 'load' });
    const image = page.getByTestId(`legacy-photo-${guide.category}`);
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.currentSrc.startsWith('data:image/gif;'))).toBe(true);
    expect(artworkRequests).toEqual([]);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth === 1280)).toBe(true);
    expect(await image.evaluate((node: HTMLImageElement) => new URL(node.currentSrc).pathname)).toBe(artwork.src);
    expect(artworkRequests).toHaveLength(1);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(image).toBeHidden();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.currentSrc.startsWith('data:image/gif;'))).toBe(true);
    expect(artworkRequests).toHaveLength(1);
  });
}

// Original partner artwork must stay legible, and a failed asset must leave a
// readable identity rather than an empty or broken-image commercial card.
test('partner originals render in the mobile directory without a favicon', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/mobil/?qa=1');
  const identity=page.locator('[data-testid="mobile-market"] [data-brand-name="Telia"]');
  const image=identity.locator('img');
  await expect(image).toBeVisible();
  await expect.poll(()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>0)).toBe(true);
  const box=await image.boundingBox();
  expect(box!.width).toBeGreaterThan(50);
  expect(box!.height).toBeGreaterThan(20);
  expect(await page.locator('main img[src*="google.com/s2/favicons"]').count()).toBe(0);
});

test('failed partner artwork retains a visible accessible partner name', async ({ page }) => {
  await page.route('**/partner-brands.svg*',route=>route.fulfill({status:404,body:''}));
  await page.goto('/mobil/?qa=1');
  const identity=page.locator('[data-testid="mobile-market"] [data-brand-name="Telia"]');
  await expect(identity.locator('img')).toHaveCount(0);
  await expect(identity).toContainText('Telia');
  await expect(identity.locator('span').last()).not.toHaveCSS('position','absolute');
});

test('income-protection guide shows the original partner identity and consumer terms', async ({ page }) => {
  await page.goto('/forsakring/trygghetsforsakring/?qa=1');
  const panel=page.locator('#hedvig-trygghet');
  await expect(panel.locator('[data-brand-name="Hedvig"] img')).toBeVisible();
  await expect(panel).toContainText('premie, karens');
  await expect(page.locator('main')).not.toContainText('provisionen 500 kr');
  const sponsored=panel.locator('a[data-partner="Hedvig"]');
  await expect(sponsored).toHaveAttribute('rel',/sponsored/);
  await expect(sponsored).toHaveAttribute('data-intent','income-protection');
});

test('insurance comparison callout heading and action meet text contrast', async ({ page }) => {
  await page.goto('/forsakring/jamfor-forsakring/?qa=1');
  for(const selector of ['.partnerBox h3','.partnerBox a.primary']){
    const ratio=await page.locator(selector).evaluate(node=>{
      const luminance=(color:string)=>color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
      let ancestor:Element|null=node,background='rgba(0, 0, 0, 0)';
      while(ancestor&&background==='rgba(0, 0, 0, 0)'){background=getComputedStyle(ancestor).backgroundColor;ancestor=ancestor.parentElement;}
      const a=luminance(getComputedStyle(node).color),b=luminance(background);
      return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
});

test('shared footer exposes privacy and cookie information directly', async ({ page }) => {
  await page.goto('/bredband/100-100/?qa=1');
  const footer=page.locator('footer');
  await expect(footer.getByRole('link',{name:'Integritet',exact:true})).toHaveAttribute('href','/integritet/');
  await expect(footer.getByRole('link',{name:'Cookiepolicy',exact:true})).toHaveAttribute('href','/cookies/');
});
