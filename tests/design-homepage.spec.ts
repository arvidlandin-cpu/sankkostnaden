import { expect, test } from '@playwright/test';

const route='/?qa=1';
const widths=[360,390,430,1024,1440];
const categories=[
 ['Bredband','/bredband/'],['El','/elavtal/'],['Mobil','/mobil/'],
 ['Försäkring','/forsakring/'],['Lån & ekonomi','/ekonomi/'],
] as const;

test('home V5: clear first action, SEO identity and one visible category directory',async({page})=>{
 await page.goto(route);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/');
 const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
 await expect(hero.getByRole('heading',{level:1,name:/Sänk dina fasta kostnader/})).toBeVisible();
 await expect(hero.getByText('FÖR LIVET HEMMA')).toBeVisible();
 const first=hero.getByRole('link',{name:/Starta Kostnadskollen/});
 await expect(first).toHaveAttribute('href','/app/');
 await expect(first).toContainText('Få en enkel väg att börja');
 await expect(hero.getByRole('link',{name:/Välj en kostnad direkt/})).toHaveAttribute('href','/#jamfor');
 const list=page.locator('#jamfor');
 for(const [name,href] of categories){
  await expect(list.locator('a[href="'+href+'"]')).toHaveCount(1);
  await expect(list.locator('a[href="'+href+'"] strong')).toHaveText(name);
  await expect(hero.locator('a[href="'+href+'"]')).toHaveCount(0);
 }
 const styles=await first.evaluate(el=>({
  background:getComputedStyle(el).backgroundColor,
  desc:getComputedStyle(el.querySelector('small')!).fontSize,
 }));
 expect(styles.background).toBe('rgb(35, 75, 209)');
 expect(parseFloat(styles.desc)).toBeGreaterThanOrEqual(12);
});

for(const width of widths){
 test('home V5 at '+width+'px: legible, responsive, keyboard-ready',async({page},testInfo)=>{
  await page.setViewportSize({width,height:width<=430?844:900});
  await page.goto(route,{waitUntil:'networkidle'});
  const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
  const first=hero.getByRole('link',{name:/Starta Kostnadskollen/});
  await expect(first).toBeVisible();
  const cats=page.locator('#jamfor');
  for(const [,href] of categories){
   await expect(cats.locator('a[href="'+href+'"]')).toBeVisible();
  }
  if(width<=430){
   const quickBar=page.getByRole('navigation',{name:'Snabbnavigering'});
   await expect(quickBar).toBeVisible();
  }
  const d=await page.evaluate(()=>{
   const hero=document.querySelector('section[aria-label="Hitta rätt jämförelse"]')!;
   const tiny=[...hero.querySelectorAll('small')].filter(el=>getComputedStyle(el).display!=='none')
     .map(el=>({text:el.textContent,size:parseFloat(getComputedStyle(el).fontSize)}));
   return {overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth,tiny,
     heading:getComputedStyle(hero.querySelector('h1')!).color};
  });
  expect(d.overflow).toBeLessThanOrEqual(1);
  expect(d.heading).toBe('rgb(20, 37, 70)');
  for(const item of d.tiny)expect(item.size,item.text||'unnamed').toBeGreaterThanOrEqual(12);
  await first.focus();
  const focus=await first.evaluate(el=>({width:parseFloat(getComputedStyle(el).outlineWidth),style:getComputedStyle(el).outlineStyle}));
  expect(focus.style).toBe('solid');
  expect(focus.width).toBeGreaterThanOrEqual(3);
  await page.screenshot({path:'test-results/screenshots/design-v5-home-'+testInfo.project.name+'-'+width+'.png',fullPage:true});
 });
}

test('repeated household tools stay optional and their SEO routes remain reachable',async({page})=>{
 await page.goto(route);
 const panel=page.getByTestId('home-household-tools');
 await expect(panel).not.toHaveAttribute('open');
 await expect(panel.getByRole('link',{name:/Räkna hushållets kostnader/})).not.toBeVisible();
 const summary=panel.locator('summary');
 await expect(summary).toContainText('Vill du få koll på hela hushållet?');
 await summary.focus();
 await page.keyboard.press('Enter');
 await expect(panel).toHaveAttribute('open','');
 await expect(panel.getByRole('link',{name:/Räkna hushållets kostnader/})).toHaveAttribute('href','/verktyg/hushallskostnadskollen/');
 await expect(panel.locator('a[href="/guide/arskoll-fasta-kostnader/"]')).toBeVisible();
 await expect(panel.locator('a[href="/app/"]')).toBeVisible();
 await page.keyboard.press('Enter');
 await expect(panel).not.toHaveAttribute('open');
});
for(const width of [360,390,430,1024,1440]){
 test('expanded household tools are accessible without overflow at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:860});
  await page.goto(route);
  const panel=page.getByTestId('home-household-tools');
  await panel.locator('summary').click();
  await expect(panel.locator('a[href="/verktyg/hushallskostnadskollen/"]')).toBeVisible();
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}

for(const width of [360,390,430,1024,1440]){
 test('P0D same blue brand and trust footer across home journey at '+width+'px',async({page},info)=>{
  await page.setViewportSize({width,height:width<=430?844:900});
  await page.goto('/?qa=1');
  const marks=page.locator('header span[class*="brandMark"],footer span[class*="brandMark"]');
  await expect(marks).toHaveCount(2);
  const colors=await marks.evaluateAll(nodes=>nodes.map(el=>({
    background:getComputedStyle(el).backgroundColor,
    ink:getComputedStyle(el).color,
  })));
  expect(colors.map(x=>x.background)).toEqual(['rgb(219, 231, 255)','rgb(219, 231, 255)']);
  expect(colors.map(x=>x.ink)).toEqual(['rgb(33, 70, 157)','rgb(33, 70, 157)']);
  const footer=page.getByRole('contentinfo');
  await expect(footer.getByRole('link',{name:'Så jämför vi'})).toHaveAttribute('href','/sa-jamfor-vi/');
  const principle=page.getByText('Besparing först.',{exact:false});
  await expect(principle).toBeVisible();
  const explanation=page.locator('div[class*="principle"] > div:last-child > p:first-child');
  await expect(explanation).toContainText('Sänk Kostnaden hjälper dig förstå');
  expect(await explanation.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(14);
  const excess=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(excess).toBeLessThanOrEqual(1);
  await page.screenshot({path:`test-results/screenshots/p0d-home-header-footer-${info.project.name}-${width}.png`,fullPage:true});
 });
}

test('experience P0: living hero selection changes the next step without a page reload',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/?qa=1');
 const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
 const picker=hero.getByTestId('home-decision-explorer');
 await expect(picker).toBeVisible();
 const before=await picker.getByTestId('home-explorer-panel').textContent();
 await picker.getByRole('button',{name:'Var ska jag börja?'}).click();
 await expect(picker.getByTestId('home-explorer-panel')).toContainText('Få en första startpunkt');
 await expect(picker.getByRole('link',{name:/Starta Kostnadskollen/})).toHaveAttribute('href','/app/');
 expect(await picker.getByTestId('home-explorer-panel').textContent()).not.toEqual(before);
 await picker.getByRole('button',{name:'Jämför två erbjudanden'}).click();
 await expect(picker.locator('a[href="/verktyg/elavtalskostnad/"]')).toBeVisible();
 const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(1);
 await page.screenshot({path:'test-results/screenshots/experience-p0-home-interactive-390.png',fullPage:true});
});

for(const width of [360,390,430]){
 test('P0E hero fits four useful ways forward as a 2x2 mobile action deck '+width,async({page},info)=>{
   await page.setViewportSize({width,height:844});
   await page.goto('/?qa=1',{waitUntil:'networkidle'});
   const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
   const picker=hero.getByTestId('home-decision-explorer');
   const panel=picker.getByTestId('home-explorer-panel');
   await expect(picker.getByRole('button',{name:'Hitta rätt nivå'})).toHaveAttribute('aria-pressed','true');
   const links=panel.locator('a');
   await expect(links).toHaveCount(4);
   for(const link of await links.all()){
     await expect(link).toBeVisible();
     const rect=await link.boundingBox();
     expect(rect!.width).toBeGreaterThan(110);
     expect(rect!.height).toBeGreaterThanOrEqual(64);
   }
   const grid=await panel.locator('div[class*="actions"]').evaluate(el=>getComputedStyle(el).gridTemplateColumns);
   expect(grid.split(' ').length,'Two quick-access columns').toBe(2);
   const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
   expect(overflow).toBeLessThanOrEqual(1);
   await page.screenshot({path:'test-results/screenshots/p0e-mobile-faststart-'+info.project.name+'-'+width+'.png',fullPage:true});
 });
}

for(const width of [320,360]){
 test('P0E narrow phone header keeps full brand on one line '+width,async({page})=>{
  await page.setViewportSize({width,height:800});
  await page.goto('/?qa=1');
  const header=page.locator('header');
  const brand=header.getByRole('link',{name:'Sänk Kostnaden'});
  const brandText=brand.locator('span').last();
  const logoBox=await brandText.boundingBox();
  expect(logoBox!.height,'Brand must not wrap into two lines').toBeLessThan(25);
  const cta=header.getByRole('link',{name:/Börja jämföra/});
  for(const link of [brand,cta]){
   const box=await link.boundingBox();
   expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/p0e-compact-header-'+width+'.png',fullPage:true});
 });
}
