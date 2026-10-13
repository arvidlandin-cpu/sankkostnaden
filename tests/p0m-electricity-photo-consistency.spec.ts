import {test,expect} from '@playwright/test';

/** Actual 390/1440 browser visual proof for the 12 Oct owner-directed warm
 * real-household photography; human images are illustrations, not endorsements.
 * We protect the prominent first decision and sponsor/SEO contracts separately.
 */
for(const width of [390,1440]){
 const height=width===390?844:900;
 test('P0M warm and distinct electricity photos across 3-step journey at '+width,async({page},info)=>{
  await page.setViewportSize({width,height});
  await page.goto('/?p0mqa=1',{waitUntil:'domcontentloaded'});
  const homeHero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
  await expect(homeHero.locator('img[src*="39997379"]')).toBeVisible();
  const tile=page.locator('#jamfor a[href="/elavtal/"] img');
  await expect(tile).toHaveAttribute('src',/3875175/);
  await expect.poll(()=>tile.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0),{timeout:25000}).toBeTruthy();
  await expect(tile).toHaveAttribute('alt','');
  await expect(page.locator('#startval')).toBeVisible();
  await page.screenshot({path:info.outputPath('p0m-home-'+width+'.png'),fullPage:true});
  await page.goto('/elavtal/?p0mqa=1',{waitUntil:'domcontentloaded'});
  const hero=page.locator('section.guideHero');
  const img=hero.getByTestId('p0h-hero-photo-el');
  await expect(img).toHaveAttribute('src',/3875141/);
  await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0),{timeout:25000}).toBeTruthy();
  await expect(img).toHaveAttribute('alt','');
  await expect(hero.getByRole('heading',{level:1,name:/Jämför elavtal/i})).toBeVisible();
  const journey=page.getByTestId('category-journey-el');
  await expect(journey).toBeVisible();
  await journey.getByRole('button',{name:/Jag vill jämföra/i}).click();
  await expect(journey.getByRole('button',{name:/Jag vill jämföra/i})).toHaveAttribute('aria-pressed','true');
  await page.screenshot({path:info.outputPath('p0m-el-hub-'+width+'.png'),fullPage:true});
  await page.goto('/elavtal/vilket-elavtal-passar-mig/?p0mqa=1',{waitUntil:'domcontentloaded'});
  const tool=page.getByTestId('smartselector-flow');
  const advisorPhoto=tool.getByTestId('smartselector-hero-photo');
  await expect(advisorPhoto).toHaveAttribute('src',/3875160/);
  await expect.poll(()=>advisorPhoto.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0),{timeout:25000}).toBeTruthy();
  await expect(tool.getByTestId('smartselector-active-question')).toBeVisible();
  await expect(tool.getByRole('link',{name:/jämföra direkt/i}).last()).toHaveAttribute('href','/elavtal/');
  await page.screenshot({path:info.outputPath('p0m-el-tool-'+width+'.png'),fullPage:true});
  const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
