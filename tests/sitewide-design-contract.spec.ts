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
