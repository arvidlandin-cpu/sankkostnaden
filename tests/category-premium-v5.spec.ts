import { expect, test } from '@playwright/test';

const targets=[
 {path:'/bredband/',canonical:'https://sankkostnaden.se/bredband/',h1:'Hitta bredband som passar ditt hem – inte bara ett lockpris.'},
 {path:'/mobil/',canonical:'https://sankkostnaden.se/mobil/',h1:'Jämför mobilabonnemang utan att betala för surf du inte behöver.'},
 {path:'/forsakring/',canonical:'https://sankkostnaden.se/forsakring/',h1:'Välj rätt försäkringsskydd innan du jämför priset.'},
 {path:'/ekonomi/',canonical:'https://sankkostnaden.se/ekonomi/',h1:'Jämför hela lånekostnaden – inte bara månadsbeloppet.'},
] as const;

for(const target of targets){
 test('V5 landing '+target.path+' has original SEO intent and real commercial paths',async({page})=>{
  await page.goto(target.path+'?qa=1');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',target.canonical);
  await expect(page.getByRole('heading',{level:1,name:target.h1})).toHaveCount(1);
  const hero=page.locator('section.categoryHero');
  await expect(hero).toBeVisible();
  const colors=await hero.evaluate(el=>({
   title:getComputedStyle(el.querySelector('h1')!).color,
   background:getComputedStyle(el).backgroundColor,
  }));
  expect(colors.title).toBe('rgb(16, 29, 66)');
  const partners=page.locator('a[rel~="sponsored"]');
  expect(await partners.count()).toBeGreaterThan(0);
  const guides=page.locator('section.categoryGuideSection a[href^="/"]');
  expect(await guides.count()).toBeGreaterThan(2);
  await expect(hero.locator('.categoryHeroActions a').first()).toBeVisible();
 });

 for(const width of [360,390,430,1024,1440]){
  test('V5 '+target.path+' at '+width+'px has no horizontal overflow',async({page},info)=>{
   await page.setViewportSize({width,height:width<500?844:900});
   await page.goto(target.path+'?qa=1',{waitUntil:'networkidle'});
   const extent=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
   expect(extent,target.path+' viewport '+width).toBeLessThanOrEqual(1);
   const hero=page.locator('section.categoryHero');
   await expect(hero.getByRole('heading',{level:1,name:target.h1})).toBeVisible();
   await expect(hero.locator('.categoryHeroActions a').first()).toBeVisible();
   await page.screenshot({path:'test-results/screenshots/category-v5-'+target.path.replaceAll('/','')+'-'+width+'.png',fullPage:true});
  });
 }
}
