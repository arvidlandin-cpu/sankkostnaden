import { expect, test } from '@playwright/test';

const route='/forsakring/?qa=1';

test('insurance category separates home, pet, travel and claims with full active partner coverage',async({page})=>{
 await page.goto(route);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/forsakring/');
 await expect(page.getByRole('heading',{level:1,name:/Välj rätt försäkringsskydd innan du jämför priset/})).toBeVisible();
 const hub=page.getByTestId('insurance-market');
 await expect(hub.getByText('9 aktiva försäkringspartners')).toBeVisible();
 await expect(hub.getByRole('heading',{name:'Vad vill du försäkra eller kontrollera?'})).toBeVisible();
 await expect(hub.getByRole('link',{name:/Kontrollera hemskyddet/})).toHaveAttribute('href','/forsakring/hemforsakring-skyddskoll/');
 const home=page.locator('a[data-placement="insurance_hub_home"]');
 const pet=page.locator('a[data-placement="insurance_hub_pet"]');
 const travel=page.locator('a[data-placement="insurance_hub_travel"]');
 const claims=page.locator('a[data-placement="insurance_hub_claims"]');
 await expect(home).toHaveCount(5);
 await expect(pet).toHaveCount(4);
 await expect(travel).toHaveCount(1);
 await expect(claims).toHaveCount(1);
 const all=await page.locator('a[data-placement^="insurance_hub_"]').evaluateAll(els=>els.map(a=>a.getAttribute('data-partner')||''));
 expect(new Set(all).size).toBe(9);
 for(const link of await page.locator('a[data-placement^="insurance_hub_"]').all()){
  await expect(link).toHaveAttribute('rel',/sponsored/);
  await expect(link).toHaveAttribute('target','_blank');
  await expect(link).toHaveAttribute('data-category','forsakring');
 }
 const names=await home.evaluateAll(els=>els.map(a=>a.getAttribute('data-partner')||''));
 expect(names).toEqual([...names].sort((a,b)=>a.localeCompare(b,'sv')));
 await expect(hub).toContainText('inte på provision eller livepremie');
 const optional=hub.getByTestId('insurance-other-needs');
 await expect(optional).not.toHaveAttribute('open');
 await optional.locator('summary').click();
 await expect(optional).toHaveAttribute('open','');
 await expect(hub.getByRole('link',{name:/Läs om ersättningsärenden/})).toHaveAttribute('href','/forsakring/forsakringsersattning/');
 await expect(hub.getByRole('link',{name:/Förstå reseskyddet/})).toHaveAttribute('href','/forsakring/reseforsakring/');
 await optional.locator('summary').click();
 await expect(optional).not.toHaveAttribute('open');
});

for(const viewport of [
 {width:360,height:800},{width:390,height:844},{width:430,height:932},
 {width:1024,height:768},{width:1440,height:900}
]){
 test('insurance page is usable without overflow at '+viewport.width+'px',async({page},info)=>{
  await page.setViewportSize(viewport);
  await page.goto(route);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const hero=page.getByRole('link',{name:'Se försäkringsalternativen',exact:true});
  await expect(hero).toBeVisible();
  await hero.click();
  await expect(page).toHaveURL(/#category-partners$/);
  await expect(page.locator('a[data-placement="insurance_hub_home"]').first()).toBeVisible();
  await page.screenshot({path:`test-results/screenshots/masterplan-insurance-${info.project.name}-${viewport.width}.png`,fullPage:true});
 });
}
