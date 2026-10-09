import { expect, test } from '@playwright/test';

const route='/mobil/?qa=1';

test('mobile decision page keeps metadata and displays all real operators without gating',async({page})=>{
  await page.goto(route);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/mobil/');
  await expect(page.getByRole('heading',{level:1,name:/Jämför mobilabonnemang utan att betala för surf/i})).toBeVisible();
  const hub=page.getByTestId('mobile-market');
  await expect(hub.getByRole('heading',{name:'Vad vill du få ordning på?'})).toBeVisible();
  await expect(hub.getByText('10 aktiva mobilpartners')).toBeVisible();
  await expect(hub.getByRole('link',{name:/Hitta rätt nivå av surf/i})).toHaveAttribute('href','/mobil/hur-mycket-surf-behover-jag/');
  const familyLinks=hub.getByRole('link',{name:/Räkna familjens totalkostnad|Räkna för två till fem personer/});
  await expect(familyLinks).toHaveCount(1);
  await expect(familyLinks.first()).toHaveAttribute('href','/mobil/lonar-sig-familjeabonnemang/');
  await expect(hub.getByRole('heading',{name:'Jämför hela familjens förstaårskostnad'})).toHaveCount(0);
  const links=page.locator('a[data-placement="mobile_hub_operator"]');
  await expect(links).toHaveCount(10);
  const names=await links.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-partner')||''));
  expect(names).toEqual([...names].sort((a,b)=>a.localeCompare(b,'sv')));
  for(const link of await links.all()){
    await expect(link).toHaveAttribute('rel',/sponsored/);
    await expect(link).toHaveAttribute('target','_blank');
    await expect(link).toHaveAttribute('data-category','mobil');
  }
  await expect(hub).toContainText('Ordningen är alfabetisk');
  await expect(hub).toContainText('inga kompletta livepriser');
  await expect(page.locator('a[data-placement="mobile_hub_refurbished"]')).toHaveCount(0);
});

for(const viewport of [
 {width:360,height:800},
 {width:390,height:844},
 {width:430,height:932},
 {width:1024,height:768},
 {width:1440,height:900},
]){
 test('mobile category is responsive and direct entry works @ '+viewport.width,async({page},testInfo)=>{
   await page.setViewportSize(viewport);
   await page.goto(route);
   const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
   expect(overflow).toBeLessThanOrEqual(1);
   const hero=page.getByRole('link',{name:'Se mobilalternativ',exact:true});
   await expect(hero).toBeVisible();
   await hero.click();
   await expect(page).toHaveURL(/#category-partners$/);
   await expect(page.locator('a[data-placement="mobile_hub_operator"]').first()).toBeVisible();
   await page.screenshot({path:`test-results/screenshots/masterplan-mobile-${testInfo.project.name}-${viewport.width}.png`,fullPage:true});
 });
}
