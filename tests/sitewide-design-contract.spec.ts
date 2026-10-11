import {expect,test} from '@playwright/test';

/**
 * Owner-approved P0D design integrity QA.
 * Observe, do not infer, consistency on indexable first-click routes.
 * QA param disables production analytics; sponsor links are NEVER clicked.
 */
const routes=[
  {path:'/',name:'home'},
  {path:'/app/',name:'costcheck'},
  {path:'/bredband/',name:'broadband-hub'},
  {path:'/elavtal/',name:'electricity-hub'},
  {path:'/mobil/',name:'mobile-hub'},
  {path:'/forsakring/',name:'insurance-hub'},
  {path:'/ekonomi/',name:'finance-hub'},
  {path:'/mobil/hur-mycket-surf-behover-jag/',name:'mobile-selector'},
  {path:'/bredband/vilken-hastighet-behover-jag/',name:'broadband-selector'},
  {path:'/forsakring/hemforsakring-bostadsratt/',name:'condo-guide'},
  {path:'/elavtal/kvartspris/',name:'quarter-hour-guide'},
  {path:'/verktyg/forstaarskostnad/',name:'mobile-first-year'},
  {path:'/verktyg/forstaarskostnad-bredband/',name:'broadband-first-year'},
  {path:'/verktyg/byteskalender/',name:'switch-calendar'},
  {path:'/verktyg/elavtalskostnad/',name:'electricity-total'},
  {path:'/mobil/lonar-sig-familjeabonnemang/',name:'family-mobile'},
] as const;

for(const width of [390,1440]){
  test.describe('P0D whole product at '+width+'px',()=>{
    for(const {path,name} of routes){
      test(name+' keeps coherent canvas, SEO, links and no overflow',async({page},info)=>{
        await page.setViewportSize({width,height:width===390?844:900});
        await page.goto(path+'?qa=1');
        await expect(page.locator('h1').first()).toBeVisible();
        const canonical=page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(1);
        const url=new URL((await canonical.getAttribute('href'))!);
        expect(url.origin).toBe('https://sankkostnaden.se');
        expect(url.pathname).toBe(path);
        const snapshot=await page.evaluate(()=>{
          const body=getComputedStyle(document.body);
          return {
            background:body.backgroundColor,
            overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth,
            focusable:document.querySelectorAll('button,a[href],input,select').length,
          };
        });
        expect(snapshot.background,'sitewide canvas '+path).toBe('rgb(249, 250, 252)');
        expect(snapshot.overflow,'horizontal overflow '+path).toBeLessThanOrEqual(1);
        expect(snapshot.focusable,'functional links or controls '+path).toBeGreaterThan(0);
        await page.screenshot({path:`test-results/screenshots/p0d-journey-${name}-${info.project.name}-${width}.png`,fullPage:true});
      });
    }
  });
}

for(const width of [360,430,1024]){
  test.describe('P0D responsive high-risk family '+width+'px',()=>{
    for(const {path,name} of routes.filter(x=>['home','costcheck','broadband-selector','mobile-selector','condo-guide','electricity-total'].includes(x.name))){
      test(name+' remains reachable and fits the screen',async({page},info)=>{
        await page.setViewportSize({width,height:width<500?844:900});
        await page.goto(path+'?qa=1');
        await expect(page.locator('h1').first()).toBeVisible();
        const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
        expect(overflow,path).toBeLessThanOrEqual(1);
        await page.screenshot({path:`test-results/screenshots/p0d-journey-${name}-${info.project.name}-${width}.png`,fullPage:true});
      });
    }
  });
}


/* P0D: real guide → sponsored partner journey, without firing affiliate clicks. */
const partnerGuides=[
  ['el','/elavtal/byta-elavtal/'],
  ['bredband','/bredband/utan-bindningstid/'],
  ['mobil','/mobil/utan-bindningstid/'],
  ['forsakring','/forsakring/reseforsakring/'],
  ['ekonomi','/ekonomi/kostnadskontroll-och-sparande/'],
] as const;
for(const width of [360,390,430,1024,1440]){
 for(const [name,path] of partnerGuides){
  test('P0D premium guide-to-partner '+name+' '+width+'px',async({page},info)=>{
   await page.setViewportSize({width,height:width<500?844:900});
   await page.goto(path+'?qa=1');
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se'+path);
   if(name==='el'){
    await expect(page.locator('.decisionGateway').first()).toBeVisible();
    await expect(page.locator('#guide-partners')).toBeAttached();
   }else{
    const panel=page.locator('.partnerSectionStrong').first();
    await expect(panel).toBeVisible();
    expect(await panel.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(241, 245, 255)');
    const card=panel.locator('.partnerCardStrong').first();
    const cta=card.locator('a.partnerButtonStrong').first();
    await expect(cta).toHaveAttribute('rel',/sponsored/);
    await expect(cta).toHaveAttribute('data-partner',/.+/);
    expect(await cta.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(35, 75, 209)');
    expect(await cta.evaluate(el=>getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
    expect(await card.locator('.commercialTag').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(12);
   }
   const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
   expect(overflow).toBeLessThanOrEqual(1);
   await page.screenshot({path:'test-results/screenshots/p0d-partner-'+name+'-'+info.project.name+'-'+width+'.png',fullPage:true});
  });
 }
}
test('P0D partner card respects keyboard focus and reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/mobil/utan-bindningstid/?qa=1');
 const card=page.locator('.partnerCardBrand').first();
 await expect(card).toBeVisible();
 expect(await card.evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration))).toBe(0);
 const cta=card.locator('a.partnerButtonStrong');
 await cta.focus();
 await expect(cta).toBeFocused();
 expect(await cta.evaluate(el=>parseFloat(getComputedStyle(el).outlineWidth))).toBeGreaterThanOrEqual(3);
});
