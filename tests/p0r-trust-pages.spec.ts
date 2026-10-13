import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
/* Genuine browser QA of editorial trust and policy pages. No affiliate clicks or GA4 traffic. */
const routes=[
 ['affiliate','/affiliate/','Så fungerar affiliatelänkar'],
 ['cookies','/cookies/','Cookiepolicy'],
 ['integritet','/integritet/','Integritet'],
 ['om','/om/','Om Sänk Kostnaden'],
 ['sa-jamfor-vi','/sa-jamfor-vi/','Så jämför vi']
] as const;
for(const width of [390,1440]){
 test('P0R trust pages preserve accessible content without marketing photo at '+width,async({page})=>{
   test.setTimeout(180000);
   await page.setViewportSize({width,height:width===390?844:920});
   mkdirSync('test-results/p0r-trust-page-evidence',{recursive:true});
   for(const [name,path,heading] of routes){
     const res=await page.goto(path+'?qa=1',{waitUntil:'domcontentloaded'});
     expect(res?.ok(),name+' HTTP').toBeTruthy();
     const hero=page.locator('main section.guideHero').first();
     await expect(hero).toBeVisible();
     await expect(hero.getByRole('heading',{name:heading,exact:true})).toBeVisible();
     await expect(hero.locator('a.back')).toHaveAttribute('href','/');
     const computed=await hero.evaluate(el=>({background:getComputedStyle(el).backgroundImage,color:getComputedStyle(el.querySelector('h1')!).color,height:el.getBoundingClientRect().height}));
     expect(computed.background,'P0R trust pages must use only CSS gradients').not.toContain('pexels');
     expect(computed.background).not.toContain('http');
     expect(computed.color).toBe('rgb(23, 41, 70)');
     expect(computed.height).toBeLessThan(width===390?490:530);
     const canonical=page.locator('link[rel=canonical]');
     await expect(canonical).toHaveAttribute('href','https://sankkostnaden.se'+path);
     expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
     await page.screenshot({path:'test-results/p0r-trust-page-evidence/'+name+'-'+width+'-firstscreen.png',fullPage:false,animations:'disabled'});
     await page.screenshot({path:'test-results/p0r-trust-page-evidence/'+name+'-'+width+'-fullpage.png',fullPage:true,animations:'disabled'});
   }
 });
}
