import { test, expect } from '@playwright/test';
import {getActivePartners} from '../lib/partners';

const route='/bredband/?qa=1';

test('broadband starts with a real address-checking partner rather than a fake local quote',async({page})=>{
 await page.goto(route);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/bredband/');
 await expect(page.getByRole('heading',{level:1,name:/Hitta bredband som passar ditt hem/})).toBeVisible();
 const section=page.getByTestId('v10-category-lane');
 await expect(section).toHaveCount(1);
 await expect(page.getByTestId('broadband-market')).toHaveCount(0);
 await expect(section.getByRole('heading',{name:'Vill du jämföra redan nu?'})).toBeVisible();
 const heroComparison=page.locator('a[data-placement="broadband_hero_comparison"]');
 await expect(heroComparison).toHaveCount(1);
 await expect(heroComparison).toHaveAttribute('data-partner','Bredbandsval.se');
 await expect(heroComparison).toHaveAttribute('rel',/sponsored/);
 await expect(heroComparison).toHaveAttribute('target','_blank');
 await expect(heroComparison).toHaveAttribute('href',/visit\.bredbandsval\.se/);
 await expect(page.getByText(/adressuppgifter hos Bredbandsval/)).toBeVisible();
 const partners=section.getByTestId('v10-partner-card');
 const active=getActivePartners('bredband','compare',Infinity);
 await expect(partners).toHaveCount(active.length);
 expect(await partners.evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-partner')).sort())).toEqual(active.map(p=>p.name).sort());
 for(const partner of active){
  const link=section.locator('a[data-partner="'+partner.name+'"]');
  await expect(link).toHaveAttribute('href',partner.trackingUrl);
  await expect(link).toHaveAttribute('data-category','bredband');
  await expect(link).toHaveAttribute('data-intent','compare');
  await expect(link).toHaveAttribute('data-placement','v10_category_lane');
  await expect(link).toHaveAttribute('rel',/sponsored/);
  await expect(link).toHaveAttribute('target','_blank');
 }
 await expect(section.getByTestId('v11-lane-tool')).toHaveAttribute('href','/verktyg/forstaarskostnad-bredband/');
 await expect(section.getByTestId('v11-lane-guide')).toHaveAttribute('href','/bredband/vilken-hastighet-behover-jag/');
 await expect(page.getByRole('link',{name:/Fiber eller mobilt bredband/})).toHaveAttribute('href','/bredband/fiber-eller-mobilt-bredband/');
 await expect(section).toContainText('inte hela marknaden');
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
  const start=page.getByRole('link',{name:/Kontrollera utbud på min adress/});
  await expect(start).toBeVisible();
  const partnerHref=await start.getAttribute('href');
  expect(partnerHref).toContain('visit.bredbandsval.se');
  await expect(page.getByTestId('v10-category-lane').locator('a[data-partner="Bredbandsval.se"]')).toBeVisible();
  await page.screenshot({path:`test-results/screenshots/masterplan-broadband-${info.project.name}-${viewport.width}.png`,fullPage:true});
 });
}
