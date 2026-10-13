import {test,expect} from '@playwright/test';

/** Mobile first-choice clarity QA. Real normal-CSS-viewport screenshots;
 * no consumer/affiliate conversion inference from a passing test.
 */
for(const width of [360,390,430,700,760,1440]){
 test('P0N one useful primary path and genuine direct-category escape '+width+'px',async({page},info)=>{
  await page.setViewportSize({width,height:width<=430?844:960});
  await page.goto('/?p0nqa=1',{waitUntil:'domcontentloaded'});
  const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
  const primary=hero.locator('a[href="/app/"]');
  const secondary=hero.locator('a[href="/#jamfor"]');
  const headerCompare=page.locator('header a[href="#jamfor"]');
  const dock=page.getByRole('navigation',{name:'Snabbnavigering'});
  await expect(hero.getByRole('heading',{level:1,name:/Sänk dina fasta kostnader/})).toBeVisible();
  await expect(primary).toBeVisible();
  await expect(primary).toHaveAttribute('href','/app/');
  await expect(hero.locator('img[src*="39997379"]')).toBeVisible();
  await expect(hero.getByTestId('home-decision-explorer')).toBeVisible();
  if(width<=700){
   await expect(secondary).toBeHidden();
   await expect(headerCompare).toBeVisible();
   const headerFill=await headerCompare.evaluate(node=>getComputedStyle(node).backgroundColor);
   expect(headerFill).toBe('rgba(0, 0, 0, 0)'); // not a competing filled-blue CTA
   await expect(dock).toBeVisible();
   await expect(dock.getByRole('link')).toHaveCount(5);
   await expect(dock.getByRole('link',{name:'Bredband'})).toHaveAttribute('href','/bredband/');
  }else{
   await expect(secondary).toBeVisible();
   await expect(headerCompare).toBeVisible();
   await expect(dock).toBeHidden();
  }
  const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:info.outputPath('p0n-full-'+width+'.png'),fullPage:true});
  await page.screenshot({path:info.outputPath('p0n-first-fold-'+width+'.png'),fullPage:false});
  if(width===390){
   await primary.click();
   await expect(page).toHaveURL(/\/app\//);
   await expect(page.locator('h1')).toBeVisible();
  }
 });
}
