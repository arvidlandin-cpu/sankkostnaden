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

test('kvartspris gives a truthful next step after one click and an optional second choice',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/kvartspris/?qa=1');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/kvartspris/');
  await expect(page.getByRole('heading',{level:1,name:'Kvartspris på el 2026 – när kan det löna sig?'})).toBeVisible();
  await expect(page.getByText('Spotpriset på elbörsen ändras var 15:e minut')).toBeVisible();
  const aid=page.getByTestId('quarter-price-decision');
  await expect(aid.getByRole('heading',{name:'Kan kvartspris passa dig?'})).toBeVisible();
  await expect(aid.getByTestId('quarter-price-result')).toHaveCount(0);
  const initialOptions=aid.getByRole('group',{name:/Kan du flytta större elanvändning/i}).getByRole('button');
  await expect(initialOptions).toHaveCount(3);
  await expect(page.locator('a[rel~="sponsored"]').first()).toBeVisible();

  await initialOptions.first().click();
  await expect(aid.getByTestId('quarter-price-result')).toContainText('Kvartspris kan vara värt att undersöka');
  await expect(aid.getByTestId('quarter-price-result')).toContainText('ingen garanti');
  await expect(aid.getByRole('link',{name:'Jämför elavtal och villkor'})).toHaveAttribute('href','/elavtal/jamfor-elavtal/');

  const risk=aid.getByTestId('quarter-price-risk');
  await expect(risk.getByRole('button')).toHaveCount(2);
  await risk.getByRole('button',{name:/Jag vill ha jämnare kostnad/i}).click();
  await expect(aid.getByTestId('quarter-price-result')).toContainText('Väg styrbarheten mot prisvariationerna');
  await expect(aid.getByRole('link',{name:'Jämför avtalsformer'})).toHaveAttribute('href','/elavtal/rorligt-fast-kvartspris/');

  await initialOptions.nth(1).click();
  await expect(aid.getByTestId('quarter-price-result')).toContainText('Jämför avgifter och avtalsform först');
  await expect(aid.getByTestId('quarter-price-risk')).toHaveCount(0);
  await initialOptions.nth(2).click();
  await expect(aid.getByTestId('quarter-price-result')).toContainText('Börja med att se vad du kan styra');
  await expect(aid.getByTestId('quarter-price-risk')).toHaveCount(0);
  await expect(aid.getByRole('link',{name:/Energimarknadsinspektionens vägledning/i})).toHaveAttribute('href','https://ei.se/konsument/el/elavtal/olika-avtalstyper/kan-kvartsprisavtal-vara-bra-for-dig');

  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const answers=events.filter((event:any)=>event.event==='quarter_price_decision_answer');
  expect(answers).toHaveLength(4);
  expect(answers.every((event:any)=>event.source==='kvartspris_guide'&&!('monthly' in event)&&!('annual_cost' in event))).toBe(true);
});

for(const width of [360,390,430,1024,1440]){
  test('kvartspris original utility is accessible and responsive at '+width+'px',async({page},info)=>{
    await page.setViewportSize({width,height:width<=430?844:900});
    await page.goto('/elavtal/kvartspris/?qa=1');
    const aid=page.getByTestId('quarter-price-decision');
    const first=aid.getByRole('group',{name:/Kan du flytta större elanvändning/i}).getByRole('button').first();
    await first.focus();
    await expect(first).toBeFocused();
    const ring=await first.evaluate(element=>parseFloat(getComputedStyle(element).outlineWidth));
    expect(ring).toBeGreaterThanOrEqual(3);
    await first.click();
    await expect(aid.getByTestId('quarter-price-result')).toBeVisible();
      const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({path:`test-results/screenshots/kvartspris-decision-${info.project.name}-${width}.png`,fullPage:true});
  });
}
