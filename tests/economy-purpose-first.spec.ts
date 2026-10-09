import {expect,test} from '@playwright/test';
for(const width of [360,390,430,1024,1440]){
 test('economy gives loan comparison before detailed checklist at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:width<500?844:900});
  await page.goto('/ekonomi/?qa=1');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/ekonomi/');
  const order=await page.evaluate(()=>{
   const main=document.querySelector('main')!;
   const partner=main.querySelector('.mobileMatcher')!;
   const intro=main.querySelector('.categoryIntro')!;
   return {partnerTop:partner.getBoundingClientRect().top+window.scrollY,introTop:intro.getBoundingClientRect().top+window.scrollY};
  });
  expect(order.partnerTop).toBeLessThan(order.introTop);
  const partner=page.getByRole('region',{name:'Hitta relevant lånejämförelse'});
  await expect(partner.getByRole('button',{name:'Nytt privatlån'})).toBeVisible();
  await expect(partner.getByRole('button',{name:'Samla lån'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Fyra uppgifter gör låneerbjudanden jämförbara'})).toBeVisible();
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
