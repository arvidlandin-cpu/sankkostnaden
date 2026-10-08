import { expect, test, type Page } from '@playwright/test';

async function answerAll(page:Page){
  const labels=[
    /Priset har ändrats eller avtalet känns dyrt/i,
    /Nyligen jämfört – fart och pris känns rätt/i,
    /Nyligen jämfört – surf och pris passar bra/i,
    /Nyligen jämfört – bra koll på skydd och självrisk/i,
  ];
  for(let i=0;i<labels.length;i++){
    await page.getByRole('button',{name:labels[i]}).click();
    if(i<labels.length-1) await page.getByRole('button',{name:/Klart – till/i}).click();
  }
}

test('household costs transfer locally into Kostnadskollen',async({page})=>{
  await page.goto('/verktyg/hushallskostnadskollen/');
  await page.getByLabel('El, kronor per månad').fill('800');
  await page.getByLabel('Bredband, kronor per månad').fill('500');
  await page.getByLabel('Mobil, kronor per månad').fill('700');
  await page.getByLabel('Försäkringar, kronor per månad').fill('600');

  await page.getByRole('link',{name:/Prioritera mina avtal/i}).click();
  await expect(page).toHaveURL(/\/app\/\?src=hushallskostnadskollen/);
  await expect(page.getByText('2 600 kr')).toBeVisible();

  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('sankkostnaden-cost-check-v5')||'{}'));
  expect(saved.answers.el.monthly).toBe(800);
  expect(saved.answers.bredband.monthly).toBe(500);
  expect(saved.answers.mobil.monthly).toBe(700);
  expect(saved.answers.forsakring.monthly).toBe(600);
});

test('savings scenario is explicitly hypothetical and calculated locally',async({page})=>{
  await page.goto('/app/');
  await page.getByText('Lägg till månadskostnad').click();
  await page.locator('input[placeholder="t.ex. 499"]').fill('1000');
  await answerAll(page);

  await expect(page.getByText(/BESPARINGSSCENARIO · INTE EN PROGNOS/i)).toBeVisible();
  await expect(page.locator('#result-el')).toContainText('1 200 kr/år');
  await page.getByRole('button',{name:'20%'}).click();
  await expect(page.locator('#result-el')).toContainText('2 400 kr/år');
});

test('raw monthly cost is not placed in cost-check analytics event',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/app/');
  await page.getByText('Lägg till månadskostnad').click();
  await page.locator('input[placeholder="t.ex. 499"]').fill('9876');

  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const costEvents=events.filter((event:any)=>event.event==='cost_check_cost_added');
  expect(costEvents.length).toBeGreaterThan(0);
  expect(costEvents.some((event:any)=>event.value===9876||event.monthly_total===9876)).toBeFalsy();
  expect(costEvents[costEvents.length-1].has_value).toBe(1);
});

test('SEO metadata remains stable on both indexed tools',async({page})=>{
  await page.goto('/app/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/app/');
  await expect(page.getByRole('heading',{level:1,name:'Vilket avtal bör du kontrollera först?'})).toBeVisible();

  await page.goto('/verktyg/hushallskostnadskollen/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/verktyg/hushallskostnadskollen/');
  await expect(page.getByRole('heading',{level:1,name:'Hushållskostnadskollen'})).toBeVisible();
});

for(const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
  test('cost prioritizer has no horizontal overflow @ '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto('/app/');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}


test('high-intent answer exposes quick path without changing the full-flow result',async({page})=>{
  await page.goto('/app/');
  await page.getByRole('button',{name:/Priset har ändrats eller avtalet känns dyrt/i}).click();

  await expect(page.getByText('SNABB VÄG')).toBeVisible();
  await expect(page.locator('a[data-placement="cost_check_quick_path"]')).toHaveCount(1);
  await expect(page.getByRole('button',{name:/Klart – till Bredband/i})).toBeEnabled();
});

test('Cost Check start event is emitted only on the first answer',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/app/');
  await page.getByRole('button',{name:/Priset har ändrats eller avtalet känns dyrt/i}).click();
  await page.getByRole('button',{name:/Klart – till Bredband/i}).click();
  await page.getByRole('button',{name:/Priset har höjts eller känns högt/i}).click();

  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const starts=events.filter((event:any)=>event.event==='cost_check_start');
  const quickShown=events.filter((event:any)=>event.event==='cost_check_quick_path_shown');
  expect(starts).toHaveLength(1);
  expect(quickShown).toHaveLength(2);
  expect(quickShown.map((event:any)=>event.category).sort()).toEqual(['bredband','el']);
});


test('hero start CTA scrolls to the first question and records intent',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/app/');
  const cta=page.getByRole('link',{name:/Få en första startpunkt efter en fråga/i});
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page).toHaveURL(/#fragor$/);
  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  expect(events.filter((event:any)=>event.event==='cost_check_hero_start_click')).toHaveLength(1);
});


test('Kostnadskollen gives a truthful useful provisional action after one warning answer',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:/Priset har ändrats eller avtalet känns dyrt/i}).click();
 const early=page.getByTestId('cost-check-early-result');
 await expect(early).toBeVisible();
 await expect(early).toContainText('1 AV 4 OMRÅDEN');
 await expect(early).toContainText('preliminär väg vidare');
 await expect(early.getByRole('link',{name:/Kontrollera el nu/})).toHaveAttribute('href','/elavtal/jamfor-elavtal/');
 await expect(page.getByRole('link',{name:'Se din första startpunkt'})).toHaveAttribute('href','#resultat');
 await expect(early.getByRole('button',{name:/Kontrollera även bredband/i})).toBeVisible();
 await expect(early).not.toContainText('kr/år');
});

test('an up-to-date contract answer never pressures visitor into affiliate click',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:/Nyligen jämfört – jag har koll på pris och avgifter/i}).click();
 const early=page.getByTestId('cost-check-early-result');
 await expect(early).toContainText('Ingen tydlig brist');
 await expect(early.locator('a')).toHaveCount(0);
 await early.getByRole('button',{name:/Kontrollera även bredband/i}).click();
 await expect(page.getByRole('heading',{name:'Bredband'})).toBeVisible();
});

test('first useful Kostnadskollen event excludes any actual cost amounts',async({page})=>{
 await page.addInitScript(()=>{(window as any).dataLayer=[];});
 await page.goto('/app/?qa=1');
 await page.getByText('Lägg till månadskostnad').click();
 await page.locator('input[placeholder="t.ex. 499"]').fill('9876');
 await page.getByRole('button',{name:/Osäker på avgifter\/villkor eller länge sedan jag jämförde/i}).click();
 await expect(page.getByTestId('cost-check-early-result')).toBeVisible();
 const events=await page.evaluate(()=>(window as any).dataLayer||[]);
 const early=events.find((item:any)=>item.event==='cost_check_early_result_available');
 expect(early).toBeTruthy();
 expect(early.questions_answered).toBe(1);
 expect(early.has_signal).toBe(1);
 expect(early.category).toBe('el');
 expect(early).not.toHaveProperty('monthly');
 expect(early).not.toHaveProperty('monthly_cost');
});

for(const width of [360,390,430]){
 test('early cost result does not overflow at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/app/?qa=1');
  await page.getByRole('button',{name:/Priset har ändrats eller avtalet känns dyrt/i}).click();
  await expect(page.getByTestId('cost-check-early-result')).toBeVisible();
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
