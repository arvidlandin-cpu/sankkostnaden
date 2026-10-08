import { test, expect } from '@playwright/test';

const route='/bredband/?qa=1';

test('broadband starts with a real address-checking partner rather than a fake local quote',async({page})=>{
 await page.goto(route);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/bredband/');
 await expect(page.getByRole('heading',{level:1,name:/Hitta bredband som passar ditt hem/})).toBeVisible();
 const section=page.getByTestId('broadband-market');
 await expect(section.getByRole('heading',{name:'Vad kan du faktiskt få på din adress?'})).toBeVisible();
 await expect(section).toContainText('ingen egen databas med adressunika bredbandspriser');
 await expect(section.getByText('3 aktiva bredbandspartners')).toBeVisible();
 const comparison=page.locator('a[data-placement="broadband_hub_comparison"]');
 await expect(comparison).toHaveCount(1);
 await expect(comparison).toHaveAttribute('data-partner','Bredbandsval.se');
 await expect(comparison).toHaveAttribute('rel',/sponsored/);
 await expect(comparison).toHaveAttribute('target','_blank');
 const suppliers=page.locator('a[data-placement="broadband_hub_supplier"]');
 await expect(suppliers).toHaveCount(2);
 const names=await suppliers.evaluateAll(anchors=>anchors.map(a=>a.getAttribute('data-partner')));
 expect(names).toEqual(['Internetport','Ownit']);
 for(const supplier of await suppliers.all()){
  await expect(supplier).toHaveAttribute('data-category','bredband');
  await expect(supplier).toHaveAttribute('rel',/sponsored/);
 }
 await expect(section.getByRole('link',{name:/Räkna förstaårskostnaden/})).toHaveAttribute('href','/verktyg/forstaarskostnad-bredband/?src=bredband');
 await expect(section.getByRole('link',{name:/Hjälp mig välja hastighet/})).toHaveAttribute('href','/bredband/vilken-hastighet-behover-jag/');
 await expect(section).toContainText('inga priser är hämtade live');
});

for(const viewport of [
 {width:360,height:800},{width:390,height:844},{width:430,height:932},
 {width:1024,height:768},{width:1440,height:900},
]){
 test('broadband redesign preserves navigation and layout at '+viewport.width+'px',async({page},info)=>{
  await page.setViewportSize(viewport);
  await page.goto(route);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const start=page.getByRole('link',{name:/Kontrollera bredbandsalternativ/});
  await expect(start).toBeVisible();
  await start.click();
  await expect(page).toHaveURL(/#category-partners$/);
  await expect(page.locator('a[data-placement="broadband_hub_comparison"]')).toBeVisible();
  await page.screenshot({path:`test-results/screenshots/masterplan-broadband-${info.project.name}-${viewport.width}.png`,fullPage:true});
 });
}
