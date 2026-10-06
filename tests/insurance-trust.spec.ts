import { expect, test } from '@playwright/test';

test('bostadsrätt page keeps SEO metadata and adds focused insurance guidance',async({page})=>{
  await page.goto('/forsakring/hemforsakring-bostadsratt/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/');
  await expect(page.getByRole('heading',{level:1,name:'Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Behöver du bostadsrättstillägg?'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Kollektivt tillägg kan ändra vad du behöver köpa själv'})).toBeVisible();
  await expect(page.getByRole('link',{name:/Gör skyddskollen/i}).first()).toHaveAttribute('href','/forsakring/hemforsakring-skyddskoll/');
});

test('priority insurance pages expose protection check without metadata changes',async({page})=>{
  for(const route of [
    {path:'/forsakring/hemforsakring-hyresratt/',canonical:'https://sankkostnaden.se/forsakring/hemforsakring-hyresratt/'},
    {path:'/forsakring/vad-kostar-hemforsakring/',canonical:'https://sankkostnaden.se/forsakring/vad-kostar-hemforsakring/'},
    {path:'/forsakring/jamfor-hemforsakring/',canonical:'https://sankkostnaden.se/forsakring/jamfor-hemforsakring/'},
  ]){
    await page.goto(route.path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',route.canonical);
    await expect(page.getByRole('link',{name:/Gör skyddskollen/i}).first()).toHaveAttribute('href','/forsakring/hemforsakring-skyddskoll/');
  }
});

test('site-wide trust footer links to comparison method and affiliate disclosure',async({page})=>{
  await page.goto('/forsakring/hemforsakring-bostadsratt/');
  const footer=page.locator('footer.siteFooter');
  await expect(footer).toBeVisible();
  await expect(footer.getByRole('link',{name:'Så jämför vi'})).toHaveAttribute('href','/sa-jamfor-vi/');
  await expect(footer.getByRole('link',{name:'Affiliateinformation'})).toHaveAttribute('href','/affiliate/');
  await expect(footer.getByRole('link',{name:'Om sajten'})).toHaveAttribute('href','/om/');
});

for(const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
  test('insurance trust layer has no horizontal overflow @ '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto('/forsakring/hemforsakring-bostadsratt/');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
