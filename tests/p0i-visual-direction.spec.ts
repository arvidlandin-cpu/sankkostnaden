import { test, expect } from '@playwright/test';

/**
 * P0I: owner-approved visual target is a warm photographic scene that
 * blends behind the editorial text, not a separate floating photo tile.
 * Tests verify geometry and real image delivery, never assert conversion uplift.
 */
for(const width of [390,1024,1440,1920]){
  test('P0I seamless homepage hero and real family photo at '+width,async({page},testInfo)=>{
    await page.setViewportSize({width,height:width===390?844:900});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
    const picture=hero.locator('img[src*="39997379"]');
    await expect(picture).toBeVisible();
    await expect.poll(()=>picture.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>0),{timeout:20000}).toBeTruthy();
    const data=await hero.evaluate(root=>{
      const photo=root.querySelector('img[src*="39997379"]') as HTMLImageElement;
      const copy=root.querySelector('h1')!;
      const imageRect=photo.getBoundingClientRect(),textRect=copy.getBoundingClientRect();
      const overlay=root.querySelector('[class*=photoShade]')!;
      return {
        image:{x:imageRect.x,y:imageRect.y,width:imageRect.width,height:imageRect.height},
        text:{x:textRect.x,y:textRect.y,width:textRect.width,height:textRect.height},
        scrim:getComputedStyle(overlay).backgroundImage,
        naturalWidth:photo.naturalWidth,
        currentSrc:photo.currentSrc,
        viewport:document.documentElement.clientWidth,
        overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth
      };
    });
    expect(data.scrim).toContain('linear-gradient');
    expect(data.image.width).toBeGreaterThan(width<500?300:540);
    expect(data.image.height).toBeGreaterThan(width<500?250:width>=1440?600:350);
    if(width>=1024)expect(data.image.x).toBeLessThan(data.text.x+data.text.width);
    expect(data.overflow).toBeLessThanOrEqual(1);
    await page.screenshot({path:'test-results/screenshots/p0i-home-'+testInfo.project.name+'-'+width+'.png',fullPage:true});
  });
}

test('P0I no fabricated outcome or sponsor implied by the hero family',async({page})=>{
  await page.goto('/');
  const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
  await expect(hero.locator('img[src*="39997379"]')).toHaveAttribute('alt','');
  await expect(hero.getByRole('heading',{level:1,name:/Sänk dina fasta kostnader/})).toBeVisible();
});

for(const width of [390,1440,1920]){
  test('P0I broadband photo blends without disrupting journey at '+width,async({page},testInfo)=>{
    await page.setViewportSize({width,height:width===390?844:930});
    await page.goto('/bredband/',{waitUntil:'domcontentloaded'});
    const hero=page.locator('section.guideHero');
    const photo=hero.getByTestId('p0h-hero-photo-bredband');
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('src',/4008771/);
    await expect.poll(()=>photo.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>0),{timeout:20000}).toBeTruthy();
    const rect=await photo.boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.width).toBeGreaterThan(width===390?320:650);
    const overlay=await hero.locator('[class*=heroArtwork]').evaluate(node=>getComputedStyle(node,'::before').backgroundImage);
    expect(overlay).toContain('linear-gradient');
    const options=page.getByTestId('p0g-insight-bredband').locator('[aria-label="Välj situation"] button');
    await expect(options).toHaveCount(2);
    await options.nth(1).click();
    await expect(options.nth(1)).toHaveAttribute('aria-pressed','true');
    expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({path:'test-results/screenshots/p0i-bredband-'+testInfo.project.name+'-'+width+'.png',fullPage:true});
  });
}
