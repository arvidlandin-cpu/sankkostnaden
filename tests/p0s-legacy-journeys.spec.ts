import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
/* P0S browser evidence: ten legacy guide routes and household tool.
   No outbound partner clicks, no analytics requests intentionally fired. */
const routes=[
 ['basta-bredbandet','/bredband/basta-bredbandet/','bredband'],
 ['billigaste-bredbandet','/bredband/billigaste-bredbandet/','bredband'],
 ['bredband-adress','/bredband/bredband-pa-min-adress/','bredband'],
 ['billigaste-elavtalet','/elavtal/billigaste-elavtalet/','el'],
 ['rorligt-fast-kvartspris','/elavtal/rorligt-fast-kvartspris/','el'],
 ['elfaktura','/elavtal/sa-laser-du-elfakturan/','el'],
 ['arskoll','/guide/arskoll-fasta-kostnader/','text'],
 ['hushallets-fasta-kostnader','/guide/hushallets-fasta-kostnader-2026/','text'],
 ['sank-fasta-kostnader','/guide/sank-fasta-kostnader/','text'],
 ['sank-kostnader-automatiskt','/guide/sank-kostnader-automatiskt/','text'],
 ['hushallskostnadskollen','/verktyg/hushallskostnadskollen/','tool']
] as const;
for(const width of [390,1440]){
 test('P0S genuine screenshots and structure at '+width,async({page})=>{
  test.setTimeout(240000);
  await page.setViewportSize({width,height:width===390?844:900});
  mkdirSync('test-results/p0s-legacy-journey-evidence',{recursive:true});
  for(const [name,path,kind] of routes){
   const resp=await page.goto(path+'?qa=1',{waitUntil:'domcontentloaded'});
   expect(resp?.ok(),name+' HTTP').toBeTruthy();
   await expect(page.locator('main h1')).toHaveCount(1);
   const hero=page.locator('main section.guideHero').first();
   await expect(hero).toBeVisible();
   const bg=await hero.evaluate(el=>getComputedStyle(el).backgroundImage);
   expect(bg,name+' must not load generic old photo').not.toContain('7019025');
   const photo=hero.locator('[data-testid^="legacy-photo-"]');
   if(kind==='bredband'||kind==='el'){
     await expect(photo).toHaveCount(1);
     await expect(photo).toHaveAttribute('srcset',/640w/);
     await expect.poll(()=>photo.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0),{timeout:20000,message:name+' real image should decode'}).toBeTruthy();
     const meta=await photo.evaluate((e:HTMLImageElement)=>({complete:e.complete,width:e.naturalWidth,src:e.currentSrc}));
     expect(meta.src).toContain(kind==='bredband'?'4260743':'8055828');
   }else{
     await expect(photo).toHaveCount(0);
   }
   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se'+path);
   expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth),name+' overflow').toBeLessThanOrEqual(1);
   await page.screenshot({path:'test-results/p0s-legacy-journey-evidence/'+name+'-'+width+'-firstscreen.png',fullPage:false,animations:'disabled'});
   await page.screenshot({path:'test-results/p0s-legacy-journey-evidence/'+name+'-'+width+'-fullpage.png',fullPage:true,animations:'disabled'});
   if(kind==='tool'){
     const picker=page.getByTestId('household-category-picker');
     await expect(picker).toBeVisible();
     await picker.getByRole('button',{name:'El',exact:true}).click();
     await expect(page.getByRole('textbox',{name:/El, kronor per månad/})).toBeVisible();
     await page.getByRole('textbox',{name:/El, kronor per månad/}).fill('500');
     await expect(page.getByTestId('household-known-subtotal')).toContainText('6 000 kr per år');
   }
  }
 });
}
