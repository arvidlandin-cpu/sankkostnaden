import { expect, test } from '@playwright/test';

const route='/elavtal/?qa=1';
const widths=[360,390,430,1024,1440];

test('Elavtal 5.0 retains SEO, honest comparison and commercial tracking',async({page})=>{
 await page.goto(route);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/');
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/index,follow/);
 await expect(page.getByRole('heading',{level:1,name:'Jämför elavtal. Välj med bättre koll.'})).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'Välj hur du vill jämföra'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Se när elen är billigare'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Våra aktiva elbolag'})).toBeVisible();
 await expect(page.locator('a[data-placement="electricity_hub_comparison"]')).toHaveAttribute('rel',/sponsored/);
 await expect(page.locator('a[data-placement="electricity_hub_supplier"]')).toHaveCount(12);
 await expect(page.getByText(/inte baserad på provision eller aktuella priser/i)).toBeVisible();
 await expect(page.locator('a[data-partner="Tibber"]')).toHaveAttribute('href',/go\.adt242\.com/);
 await expect(page.getByRole('link',{name:/Räkna hela årskostnaden/})).toHaveAttribute('href','/verktyg/elavtalskostnad/?src=elavtal');
});

test('Elavtal 5.0 has the blue premium shell without green/lime CTAs',async({page})=>{
 await page.goto(route);
 const data=await page.evaluate(()=>{
  const hero=document.querySelector('section.guideHero')!;
  const cta=hero.querySelector<HTMLAnchorElement>('.categoryHeroActions a.primary')!;
  const main=document.querySelector('main')!;
  const brand=document.querySelector<HTMLElement>('.topbar .brandMark')!;
  const route=document.querySelector<HTMLAnchorElement>('a[data-placement="electricity_hub_comparison"]')!;
  return {
   headline:getComputedStyle(hero.querySelector('h1')!).color,
   heroBackground:getComputedStyle(hero).backgroundImage,
   heroCta:getComputedStyle(cta).backgroundColor,
   partnerCta:getComputedStyle(route).backgroundColor,
   brandBackground:getComputedStyle(brand).backgroundColor,
   mainBackground:getComputedStyle(main).backgroundColor,
  };
 });
 expect(data.headline).toBe('rgb(16, 29, 66)');
 expect(data.heroCta).toBe('rgb(35, 75, 209)');
 expect(data.partnerCta).toBe('rgb(35, 75, 209)');
 expect(data.brandBackground).toBe('rgb(232, 239, 255)');
 expect(data.heroBackground).not.toContain('pexels-photo-14408369');
 expect(data.mainBackground).toBe('rgb(248, 250, 255)');
});

for(const width of widths){
 test('Elavtal 5.0 fits '+width+'px with accessible actions',async({page},testInfo)=>{
  await page.setViewportSize({width,height:width<=430?844:900});
  await page.goto(route,{waitUntil:'networkidle'});
  const hero=page.locator('section.guideHero');
  await expect(hero.getByRole('link',{name:/Jämför elavtal/})).toBeVisible();
  const documentMetrics=await page.evaluate(()=>({
   overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth,
   heroHeadingHeight:document.querySelector('section.guideHero h1')?.getBoundingClientRect().height || 0,
  }));
  expect(documentMetrics.overflow).toBeLessThanOrEqual(1);
  expect(documentMetrics.heroHeadingHeight).toBeGreaterThan(40);
  await hero.getByRole('link',{name:/Jämför elavtal/}).focus();
  const outline=await hero.getByRole('link',{name:/Jämför elavtal/}).evaluate(el=>({
   style:getComputedStyle(el).outlineStyle,width:parseFloat(getComputedStyle(el).outlineWidth),
  }));
  expect(outline.style).toBe('solid');
  expect(outline.width).toBeGreaterThanOrEqual(3);
  await page.screenshot({path:'test-results/screenshots/elavtal-v5-'+testInfo.project.name+'-'+width+'.png',fullPage:true});
 });
}
