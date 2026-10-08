import { expect, test } from '@playwright/test';

test('bostadsrätt insurance keeps SEO metadata and adds focused decision support',async({page})=>{
  await page.goto('/forsakring/hemforsakring-bostadsratt/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/');
  await expect(page.getByRole('heading',{level:1,name:'Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'})).toBeVisible();
  await expect(page.getByRole('heading',{level:2,name:'Behöver jag bostadsrättstillägg?'})).toBeVisible();
  await expect(page.getByRole('heading',{level:2,name:'Har föreningen kollektivt bostadsrättstillägg?'})).toBeVisible();
  await expect(page.getByRole('link',{name:'Gör skyddskollen',exact:true})).toHaveAttribute('href','/forsakring/hemforsakring-skyddskoll/');
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


test('condo decision aid provides conditional next step before insurance offers',async({page})=>{
 await page.goto('/forsakring/hemforsakring-bostadsratt/?qa=1');
 const aid=page.getByTestId('condo-insurance-check');
 await expect(aid).toBeVisible();
 await expect(aid.getByRole('heading',{name:/Betalar du för ett tillägg/i})).toBeVisible();
 const choices=aid.getByRole('group').first().getByRole('button');
 await expect(choices).toHaveCount(3);
 await choices.nth(0).click(); // Föreningen har tillägg
 await expect(aid.getByText(/Kontrollera vad föreningens tillägg faktiskt omfattar/i)).toBeVisible();
 await expect(aid.getByText(/Avsluta inte ett befintligt tillägg/i)).toBeVisible();
 await aid.getByRole('group').nth(1).getByRole('button',{name:'Nej'}).click();
 await expect(aid.getByText(/Se först till att du har en vanlig hemförsäkring/i)).toBeVisible();
 await expect(aid.getByRole('link',{name:/Se relevanta hemförsäkringsalternativ/})).toHaveAttribute('href','/forsakring/jamfor-hemforsakring/');
 await expect(aid.getByRole('link',{name:/Konsumenternas information/})).toHaveAttribute('href','https://www.konsumenternas.se/forsakringar/boendeforsakringar/bostadsrattsforsakringar/');
 await aid.getByRole('button',{name:'Börja om'}).click();
 await expect(aid.getByRole('group')).toHaveCount(1);
});

test('condo guidance for unknown collective coverage starts with contacting the board',async({page})=>{
 await page.goto('/forsakring/hemforsakring-bostadsratt/?qa=1');
 const aid=page.getByTestId('condo-insurance-check');
 await aid.getByRole('group').first().getByRole('button',{name:'Vet inte'}).click();
 await expect(aid.getByText(/Börja med att fråga föreningen/i)).toBeVisible();
 await expect(aid.getByText(/Fråga styrelsen eller förvaltaren om ett kollektivt/i)).toBeVisible();
 await expect(aid.getByText(/faktiska villkor avgör ditt skydd/i)).toBeVisible();
});

for(const width of [360,390,430,1024,1440]){
 test('condo utility mobile and desktop integrity at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:850});
  await page.goto('/forsakring/hemforsakring-bostadsratt/?qa=1');
  const aid=page.getByTestId('condo-insurance-check');
  await aid.getByRole('group').first().getByRole('button',{name:'Ja'}).click();
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(aid.getByRole('heading',{name:/Betalar du för ett tillägg/i})).toBeVisible();
 });
}
