import { test, expect } from '@playwright/test';

const routes=[
  {name:'bredband',url:'/bredband/',category:'bredband'},
  {name:'el',url:'/elavtal/',category:'el'},
  {name:'mobil',url:'/mobil/',category:'mobil'},
  {name:'forsakring',url:'/forsakring/',category:'forsakring'},
  {name:'ekonomi',url:'/ekonomi/',category:'ekonomi'}
] as const;

for(const width of [360,390,430,1024,1440]){
  test('P0G home photo composition and no overflow at '+width,async({page},testInfo)=>{
    await page.setViewportSize({width,height:width<650?844:900});
    await page.goto('/',{waitUntil:'domcontentloaded'});
    const imgs=page.locator('main #jamfor img');
    await expect(imgs).toHaveCount(5);
    for(const image of await imgs.all()){
      await expect(image).toHaveAttribute('src',/images\.pexels\.com\/photos\//);
      await expect(image).toHaveAttribute('srcset',/1800w/);
    }
    expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({path:'test-results/screenshots/p0g-home-'+testInfo.project.name+'-'+width+'.png',fullPage:true});
  });
  for(const route of routes){
    test('P0G '+route.name+' interactive signature, live flow and overflow @'+width,async({page},testInfo)=>{
      await page.setViewportSize({width,height:width<650?844:900});
      await page.goto(route.url,{waitUntil:'domcontentloaded'});
      const section=page.getByTestId('p0g-insight-'+route.category);
      await expect(section).toBeVisible();
      await expect(section.locator('[class*=editorial] h2')).toHaveCount(1);
      const options=section.locator('[role="group"][aria-label="Välj situation"] button');
      await expect(options).toHaveCount(2);
      const first=await section.locator('a').first().getAttribute('href');
      await options.nth(1).click();
      await expect(options.nth(1)).toHaveAttribute('aria-pressed','true');
      const second=await section.locator('a').first().getAttribute('href');
      expect(first).not.toEqual(second);
      const image=page.locator('[class*=heroArtwork]').first();
      await expect(image).toHaveCount(1);
      expect(await image.evaluate(el=>getComputedStyle(el).backgroundImage)).toMatch(/pexels-photo-/);
      expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({path:'test-results/screenshots/p0g-'+route.name+'-'+testInfo.project.name+'-'+width+'.png',fullPage:true});
    });
  }
}

test('P0G electricity features Tibber as labelled sponsor, keeps one independent spot-price instrument',async({page})=>{
  await page.goto('/elavtal/',{waitUntil:'domcontentloaded'});
  const tibber=page.locator('a[data-placement="electricity_insight_tibber"]');
  await expect(tibber).toHaveCount(1);
  await expect(tibber).toHaveAttribute('rel',/sponsored/);
  await expect(tibber).toHaveAttribute('href',/adt242/);
  await expect(page.getByText(/spotdata och visar inte Tibbers/i)).toBeVisible();
  await expect(page.getByRole('heading',{name:/Se när elen är billigare/i})).toHaveCount(1);
  await expect(page.locator('a[data-placement="electricity_hub_supplier"]')).toHaveCount(12);
});

test('P0G partner names are crisp HTML identities rather than magnified third-party favicons',async({page})=>{
  await page.goto('/mobil/');
  const cards=page.locator('[data-testid="mobile-market"] [data-brand-name]');
  expect(await cards.count()).toBeGreaterThanOrEqual(8);
  for(const card of await cards.all()) await expect(card).toBeVisible();
  await expect(page.locator('[data-testid="mobile-market"] img[src*="google.com/s2/favicons"]')).toHaveCount(0);
});

test('P0G home CDN sources deliver real imagery rather than placeholder thumbnails',async({page})=>{
  await page.goto('/',{waitUntil:'domcontentloaded'});
  const imgs=page.locator('main #jamfor img');
  for(const image of await imgs.all()){
    await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.complete && el.naturalWidth>=700),{timeout:18000,intervals:[500,1000,2000]}).toBeTruthy();
  }
});
