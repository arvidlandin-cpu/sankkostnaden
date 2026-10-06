import { expect, test } from '@playwright/test';

test('bostadsrätt insurance keeps SEO metadata and adds focused decision support',async({page})=>{
  await page.goto('/forsakring/hemforsakring-bostadsratt/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/');
  await expect(page.getByRole('heading',{level:1,name:'Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'})).toBeVisible();
  await expect(page.getByRole('heading',{level:2,name:'Behöver jag bostadsrättstillägg?'})).toBeVisible();
  await expect(page.getByRole('heading',{level:2,name:'Har föreningen kollektivt bostadsrättstillägg?'})).toBeVisible();
  await expect(page.getByRole('link',{name:/Gör skyddskollen/i})).toHaveAttribute('href','/forsakring/hemforsakring-skyddskoll/');
});

test('100/100 keeps SEO metadata and links to broadband first-year calculator',async({page})=>{
  await page.goto('/bredband/100-100/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/bredband/100-100/');
  await expect(page.getByRole('heading',{level:1,name:'Bredband 100/100 – räcker 100 Mbit/s 2026?'})).toBeVisible();
  await expect(page.getByRole('link',{name:/Räkna förstaårskostnaden/i})).toHaveAttribute('href','/verktyg/forstaarskostnad-bredband/?src=bredband_100_100');
});

for(const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
  test('priority SEO pages have no horizontal overflow @ '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    for(const route of ['/forsakring/hemforsakring-bostadsratt/','/bredband/100-100/']){
      await page.goto(route);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
      expect(overflow,route).toBeLessThanOrEqual(1);
    }
  });
}
