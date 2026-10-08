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
  for(const name of ['El','Bredband','Mobil','Försäkringar']) await page.getByRole('group',{name:'Välj kostnadskategori'}).getByRole('button',{name:new RegExp('^'+name)}).click();
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


test('clean Kostnadskollen begins immediately with one accessible question, no empty statistics',async({page})=>{
  await page.setViewportSize({width:1440,height:900});
  await page.goto('/app/?qa=1');
  await expect(page.getByRole('heading',{level:1,name:'Vilket avtal bör du kontrollera först?'})).toBeVisible();
  await expect(page.locator('[class*="heroStats"]')).toHaveCount(0);
  await expect(page.locator('[class*="scoreOrb"]')).toHaveCount(0);
  await expect(page.locator('#resultat')).toHaveCount(0);
  const firstQuestion=page.getByRole('group',{name:'Vad stämmer bäst om ditt elavtal?'});
  await expect(firstQuestion.getByRole('button')).toHaveCount(3);
  const box=await firstQuestion.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(800);
  const picker=page.getByRole('button',{name:'Byt område'});
  await expect(picker).toHaveAttribute('aria-expanded','false');
  await picker.click();
  await expect(picker).toHaveAttribute('aria-expanded','true');
  await page.getByRole('button',{name:/^Mobil\s*–?$/}).first().click();
  await expect(page.getByRole('heading',{name:'Mobilabonnemang'})).toBeVisible();
  await expect(page.getByRole('group',{name:'Vad stämmer bäst om mobilabonnemanget?'})).toBeVisible();
});

for(const width of [360,390,430,1024,1440]){
  test('Kostnadskollen clean entry and readable choice cards @ '+width+'px',async({page},info)=>{
    await page.setViewportSize({width,height:844});
    await page.goto('/app/?qa=1');
    const first=page.getByRole('group',{name:'Vad stämmer bäst om ditt elavtal?'});
    await expect(first).toBeVisible();
    // No floating five-category toolbar obscuring the task: category switching
    // remains available via the explicit on-page "Byt område" control.
    await expect(page.locator('.mobileQuickBar')).toHaveCount(0);
    const css=await first.getByRole('button').first().evaluate(el=>({
      fontSize:parseFloat(getComputedStyle(el).fontSize),
      minHeight:parseFloat(getComputedStyle(el).minHeight),
    }));
    expect(css.fontSize).toBeGreaterThanOrEqual(14);
    expect(css.minHeight).toBeGreaterThanOrEqual(56);
    const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await page.screenshot({path:`test-results/screenshots/design-v1-costcheck-${info.project.name}-${width}.png`,fullPage:true});
  });
}


test('Kostnadskollen gives a truthful useful provisional action after one warning answer',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:/Priset har ändrats eller avtalet känns dyrt/i}).click();
 const early=page.getByTestId('cost-check-early-result');
 await expect(early).toBeVisible();
 await expect(early).toContainText('1 AV 4 OMRÅDEN');
 await expect(early).toContainText('inte kontrollerat avtalet');
 await expect(early.getByRole('link',{name:/Se alternativ för el/})).toHaveAttribute('href','/elavtal/jamfor-elavtal/');
 await expect(page.getByRole('link',{name:'Se din första startpunkt'})).toHaveAttribute('href','#resultat');
 await expect(early.getByRole('button',{name:/Fortsätt med bredband/i})).toBeVisible();
 await expect(early).not.toContainText('kr/år');
});

test('up-to-date answer gives modest inline feedback, not a false preliminary verdict',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:/Nyligen jämfört – jag har koll på pris och avgifter/i}).click();
 const safe=page.getByTestId('cost-check-safe-feedback');
 await expect(safe).toContainText('Elavtal verkar vara under kontroll utifrån ditt svar');
 await expect(safe).toContainText('inte kontrollerat ditt faktiska avtal');
 await expect(safe.getByRole('link',{name:/Se aktuella villkor om du vill/})).toHaveAttribute('href','/elavtal/jamfor-elavtal/');
 await expect(page.getByTestId('cost-check-early-result')).toHaveCount(0);
 await expect(page.locator('#resultat')).toHaveCount(0);
 await expect(page.getByRole('link',{name:'Se din första startpunkt'})).toHaveCount(0);
 await expect(page.locator('a[rel~="sponsored"]')).toHaveCount(0);
 const events=await page.evaluate(()=>(window as any).dataLayer||[]);
 expect(events.filter((item:any)=>item.event==='cost_check_early_result_available')).toHaveLength(0);
 await page.getByRole('button',{name:/Klart – till Bredband/}).click();
 await expect(page.getByRole('heading',{name:'Bredband'})).toBeVisible();
 await expect(page.getByRole('group',{name:'Vad stämmer bäst om bredbandet?'}).getByRole('button').first()).not.toHaveAttribute('aria-pressed','true');
 await expect(page.getByText('Ingen tydlig brist i de områden du kontrollerat hittills')).toHaveCount(0);
 await expect(page.locator('#resultat')).toHaveCount(0);
});

test('an actionable early result never loops back to the category already being answered',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:/Nyligen jämfört – jag har koll på pris och avgifter/i}).click();
 await page.getByRole('button',{name:/Klart – till Bredband/}).click();
 await page.getByRole('button',{name:/Osäker på nivå\/pris eller länge sedan jag jämförde/}).click();
 const early=page.getByTestId('cost-check-early-result');
 await expect(early).toContainText('Bredband kan vara värt att kontrollera nu');
 await expect(early.getByRole('link',{name:/Se alternativ för bredband/})).toHaveAttribute('href','/bredband/bredband-pa-min-adress/');
 await expect(early.getByRole('button',{name:/Fortsätt med mobil/i})).toBeVisible();
 await early.getByRole('button',{name:/Fortsätt med mobil/i}).click();
 await expect(page.getByRole('heading',{name:'Mobilabonnemang'})).toBeVisible();
 await expect(early.getByRole('button',{name:/Svara på frågan om mobil/i})).toBeVisible();
 await expect(early).not.toContainText('Kontrollera även bredband');
 await early.getByRole('button',{name:/Svara på frågan om mobil/i}).click();
 await expect(page.getByRole('group',{name:'Vad stämmer bäst om mobilabonnemanget?'}).getByRole('button').first()).toBeFocused();
});

test('four reassuring answers never create a fabricated affiliate priority or saving',async({page})=>{
 await page.goto('/app/?qa=1');
 for(const phrase of [
 /Nyligen jämfört – jag har koll på pris och avgifter/i,
 /Nyligen jämfört – fart och pris känns rätt/i,
 /Nyligen jämfört – surf och pris passar bra/i,
 /Nyligen jämfört – bra koll på skydd och självrisk/i
 ]){
   await page.getByRole('button',{name:phrase}).click();
   if(await page.getByRole('button',{name:/Klart – till/i}).count()) await page.getByRole('button',{name:/Klart – till/i}).click();
 }
 await expect(page.getByTestId('cost-check-no-issues')).toBeVisible();
 await expect(page.getByTestId('cost-check-no-issues')).toContainText('inte jämfört dina faktiska avtal');
 for(const category of ['El','Bredband','Mobil','Försäkring']) await expect(page.getByTestId('cost-check-no-issues').getByRole('link',{name:new RegExp('^'+category)})).toBeVisible();
 await expect(page.locator('[data-placement="cost_check_result"]')).toHaveCount(0);
 await expect(page.getByText('Flera områden är likvärdiga att kontrollera')).toHaveCount(0);
});

test('saved one-safe-answer session cannot masquerade as a completed result',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.evaluate(()=>localStorage.setItem('sankkostnaden-cost-check-v5',JSON.stringify({
    answers:{el:{fit:0,monthly:0},bredband:{fit:-1,monthly:0},mobil:{fit:-1,monthly:0},forsakring:{fit:-1,monthly:0}},
    scenarioPct:10
 })));
 await page.reload();
 await expect(page.locator('#resultat')).toHaveCount(0);
 await expect(page.getByText('1 av 4 områden klara')).toBeVisible();
 await page.getByRole('button',{name:/Klart – till Bredband/}).click();
 await expect(page.locator('#resultat')).toHaveCount(0);
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

test('household starts with category buttons rather than eight empty fields',async({page})=>{
 await page.goto('/verktyg/hushallskostnadskollen/');
 const picker=page.getByTestId('household-category-picker');
 await expect(picker).toBeVisible();
 await expect(page.locator('input[inputmode="decimal"]')).toHaveCount(0);
 await expect(page.getByTestId('household-known-subtotal')).toHaveCount(0);
 await picker.getByRole('button',{name:/^El/}).click();
 await expect(page.getByLabel('El, kronor per månad')).toBeVisible();
 await expect(page.getByTestId('household-known-subtotal')).toHaveCount(0);
 await expect(page.getByRole('link',{name:/Kontrollera elavtalet/})).toBeVisible();
 await page.getByLabel('El, kronor per månad').fill('750');
 await expect(page.getByTestId('household-known-subtotal')).toContainText('750 kr/mån');
 await expect(page.getByTestId('household-known-subtotal')).toContainText('inte hushållets totala kostnad');
 await picker.getByRole('button',{name:/^Mobil/}).click();
 await page.getByLabel('Mobil, kronor per månad').fill('399');
 await expect(page.getByTestId('household-known-subtotal')).toContainText('1 149 kr/mån');
});

test('household does not erase unentered saved costs in Kostnadskollen',async({page})=>{
 await page.goto('/verktyg/hushallskostnadskollen/');
 await page.evaluate(()=>{
  localStorage.setItem('sankkostnaden-cost-check-v5',JSON.stringify({answers:{el:{monthly:999},bredband:{monthly:555}},source:'previous'}));
 });
 const picker=page.getByTestId('household-category-picker');
 await picker.getByRole('button',{name:/^Mobil/}).click();
 await page.getByLabel('Mobil, kronor per månad').fill('250');
 await page.getByRole('link',{name:/Prioritera mina avtal/i}).click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('sankkostnaden-cost-check-v5')||'{}'));
 expect(saved.answers.el.monthly).toBe(999);
 expect(saved.answers.bredband.monthly).toBe(555);
 expect(saved.answers.mobil.monthly).toBe(250);
});

for(const width of [360,390,430,1024,1440]){
 test('household progressive choices do not overflow '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:850});
  await page.goto('/verktyg/hushallskostnadskollen/');
  await page.getByTestId('household-category-picker').getByRole('button',{name:/^El/}).click();
  await page.getByLabel('El, kronor per månad').fill('900');
  await page.getByRole('button',{name:/Visa fler kostnadskategorier/}).click();
  const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
