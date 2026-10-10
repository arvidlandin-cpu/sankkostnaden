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

/* P0D: the existing mobile and broadband need selectors should feel like
   the same product as the now-blue homepage. Actual screenshot QA at 5 widths. */
for(const width of [360,390,430,1024,1440]){
  test('P0D smart selectors keep navy result and blue choice at '+width+'px',async({page},info)=>{
    await page.setViewportSize({width,height:width<=430?844:900});
    await page.goto('/mobil/hur-mycket-surf-behover-jag/?qa=1');
    await expect(page.getByRole('heading',{level:1,name:/Hur mycket surf behöver jag/i})).toBeVisible();
    const result=page.locator('main aside').first();
    await expect(result).toBeVisible();
    expect(await result.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(16, 37, 77)');
    const first=page.getByRole('button',{name:'Nästan alltid wifi'});
    await first.click();
    expect(await first.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(231, 238, 255)');
    await page.getByRole('button',{name:'Meddelanden, kartor, bank'}).click();
    await page.getByRole('button',{name:'Bara mitt abonnemang'}).click();
    await expect(result.getByRole('heading',{name:/Du behöver sannolikt inte fri surf/})).toBeVisible();
    await expect(result.getByRole('link',{name:/Jämför billigare mobil/})).toHaveAttribute('href','/mobil/billigaste-mobilabonnemanget/');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/mobil/hur-mycket-surf-behover-jag/');
    const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({path:`test-results/screenshots/p0d-smart-selector-${info.project.name}-${width}.png`,fullPage:true});

    await page.goto('/bredband/vilken-hastighet-behover-jag/?qa=1');
    await expect(page.getByRole('heading',{level:1,name:/Vilken bredbandshastighet behöver jag/i})).toBeVisible();
    const broadbandResult=page.locator('main aside').first();
    expect(await broadbandResult.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(16, 37, 77)');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/bredband/vilken-hastighet-behover-jag/');
    const broadbandOverflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
    expect(broadbandOverflow).toBeLessThanOrEqual(1);
  });
}
test('P0D home-explorer selected decision still honors shared blue choice',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/?qa=1');
  const explorer=page.getByTestId('home-decision-explorer');
  const btn=explorer.getByRole('button',{name:'Var ska jag börja?'});
  await btn.click();
  expect(await btn.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(237, 243, 255)');
  await expect(explorer.getByRole('link',{name:/Starta Kostnadskollen/})).toHaveAttribute('href','/app/');
});
