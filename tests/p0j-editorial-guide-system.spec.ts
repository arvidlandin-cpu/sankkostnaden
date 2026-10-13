import { test, expect } from '@playwright/test';

const leafGuides=[
 {route:'/bredband/fiber/',category:'bredband',photo:'4260743'},
 {route:'/elavtal/rorligt-elpris/',category:'el',photo:'8055828'},
 {route:'/mobil/5g-abonnemang/',category:'mobil',photo:'4254149'},
 {route:'/forsakring/jamfor-hemforsakring/',category:'forsakring',photo:'27177239'},
 {route:'/ekonomi/samlingslan/',category:'ekonomi',photo:'6964105'},
];

for(const width of [390,1440]){
 for(const item of leafGuides){
  test('P0J warm editorial guide '+item.route+' '+width+'px',async({page},testInfo)=>{
    await page.setViewportSize({width,height:width===390?844:960});
    await page.goto(item.route+'?qa=1',{waitUntil:'domcontentloaded'});
    const hero=page.getByTestId('editorial-guide-hero');
    await expect(hero.getByRole('heading',{level:1})).toBeVisible();
    const photo=hero.getByTestId('editorial-guide-image-'+item.category);
    await expect(photo).toBeVisible();
    await expect(photo).toHaveAttribute('src',new RegExp(item.photo));
    await expect(photo).toHaveAttribute('alt','');
    await expect.poll(()=>photo.evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0),{timeout:20000}).toBeTruthy();
    const heroInfo=await hero.evaluate(node=>{
      const copy=node.querySelector('h1')!.getBoundingClientRect();
      const image=node.querySelector('img')!.getBoundingClientRect();
      const fade=node.querySelector('[class*=scrim]')!;
      return {copyX:copy.x,copyWidth:copy.width,imageX:image.x,imageWidth:image.width,
        fade:getComputedStyle(fade).backgroundImage};
    });
    expect(heroInfo.fade).toContain('linear-gradient');
    expect(heroInfo.imageWidth).toBeGreaterThan(width===390?320:680);
    if(width>760)expect(heroInfo.imageX).toBeLessThan(heroInfo.copyX+heroInfo.copyWidth);
    const summary=page.locator('#guide-summary');
    await expect(summary.getByTestId('guide-reading-flow')).toBeVisible();
    await expect(summary.getByTestId('guide-key-takeaways').locator('> div')).not.toHaveCount(0);
    await hero.getByRole('link',{name:/Börja med råden/}).click();
    await expect.poll(()=>page.evaluate(()=>location.hash)).toBe('#guide-summary');
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',new RegExp(item.route.replaceAll('/','\\/')));
    await expect(page.locator('#guide-partners')).toHaveCount(1);
    await expect(page.locator('a[rel*=sponsored]')).not.toHaveCount(0);
    const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({path:'test-results/screenshots/p0j-'+item.category+'-'+width+'-'+testInfo.project.name+'.png',fullPage:true});
  });
 }
}

test('P0J active quarter-price SEO observation keeps original exact guide structure',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/elavtal/kvartspris/?qa=1',{waitUntil:'domcontentloaded'});
 await expect(page.getByTestId('editorial-guide-hero')).toHaveCount(0);
 await expect(page.locator('section.guideHero.guideHero-el')).toBeVisible();
 await expect(page.locator('#guide-summary')).toHaveCount(0);
 await expect(page.getByTestId('guide-reading-flow')).toBeVisible();
 await expect(page.getByTestId('guide-key-takeaways')).toBeVisible();
 await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/kvartspris/');
});

test('P0J guide summary keeps native accessible disclosures and partner paths',async({page})=>{
 await page.goto('/forsakring/jamfor-hemforsakring/?qa=1',{waitUntil:'domcontentloaded'});
 const reading=page.getByTestId('guide-reading-flow');
 const questions=reading.locator('details');
 expect(await questions.count()).toBeGreaterThan(2);
 const last=questions.last();
 await last.locator('summary').click();
 await expect(last).toHaveAttribute('open','');
 const partnerLinks=page.locator('#guide-partners a[data-partner]');
 expect(await partnerLinks.count()).toBeGreaterThan(0);
 for(const a of await partnerLinks.all()){
  await expect(a).toHaveAttribute('rel',/sponsored/);
  await expect(a).toHaveAttribute('href',/^(https?:\/\/|\/)/);
 }
});
