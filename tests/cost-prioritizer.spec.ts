import { expect, test, type Page } from '@playwright/test';

async function answerAll(page:Page){
  const labels=[
    /Priset har höjts eller känns dyrt/i,
    /Hastighet och pris känns rätt/i,
    /Surf och pris passar mig/i,
    /Jag har koll på mitt försäkringsskydd/i,
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
  await page.getByRole('button',{name:/Priset har höjts eller känns dyrt/i}).click();

  await expect(page.getByText('DU KAN GÅ VIDARE REDAN NU')).toBeVisible();
  await expect(page.locator('a[data-placement="cost_check_quick_path"]')).toHaveCount(1);
  await expect(page.getByRole('button',{name:/Klart – till Bredband/i})).toBeEnabled();
});

test('Cost Check start event is emitted only on the first answer',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/app/');
  await page.getByRole('button',{name:/Priset har höjts eller känns dyrt/i}).click();
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
 await page.getByRole('button',{name:/Priset har höjts eller känns dyrt/i}).click();
 const early=page.getByTestId('cost-check-early-result');
 await expect(early).toBeVisible();
 await expect(early).toContainText('1 AV 4 OMRÅDEN');
 await expect(early).toContainText('inte kontrollerat avtalet');
 await expect(early.getByRole('link',{name:/Se alternativ för el/})).toHaveAttribute('href','/elavtal/jamfor-elavtal/');
 await expect(page.getByTestId('cost-check-next-action').getByRole('link',{name:/Jämför elavtal hos Elskling/})).toHaveAttribute('href',/adt231/);
 await expect(early.getByRole('button',{name:/Fortsätt med bredband/i})).toBeVisible();
 await expect(early).not.toContainText('kr/år');
});

test('up-to-date answer gives modest inline feedback, not a false preliminary verdict',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:/Jag har koll på pris och villkor/i}).click();
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
 await page.getByRole('button',{name:/Jag har koll på pris och villkor/i}).click();
 await page.getByRole('button',{name:/Klart – till Bredband/}).click();
 await page.getByRole('button',{name:/Jag är osäker på om priset är rimligt/}).click();
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
 /Jag har koll på pris och villkor/i,
 /Hastighet och pris känns rätt/i,
 /Surf och pris passar mig/i,
 /Jag har koll på mitt försäkringsskydd/i
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
 await page.getByRole('button',{name:/Jag är osäker på avgifter eller villkor/i}).click();
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
  await page.getByRole('button',{name:/Priset har höjts eller känns dyrt/i}).click();
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

test('Kostnadskollen premium design maintains one useful first action, no fabricated savings',async({page})=>{
 await page.goto('/app/?qa=1');
 const heading=page.getByRole('heading',{level:1,name:'Vilket avtal bör du kontrollera först?'});
 await expect(heading).toBeVisible();
 expect(await heading.evaluate(el=>getComputedStyle(el).color)).toBe('rgb(17, 37, 76)');
 const controls=page.getByRole('group',{name:'Vad stämmer bäst om ditt elavtal?'});
 await expect(controls.getByRole('button')).toHaveCount(3);
 const choice=controls.getByRole('button',{name:/Priset har höjts eller känns dyrt/i});
 await choice.click();
 expect(await choice.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(237, 243, 255)');
 await expect(page.locator('a[data-placement="cost_check_quick_path"]')).toHaveCount(1);
 await expect(page.getByText('Här kan du börja')).toBeVisible();
 await expect(page.locator('#resultat')).not.toContainText('garanterad besparing');
 await page.getByText('Lägg till månadskostnad').click();
 await expect(page.getByRole('spinbutton',{name:/Månadskostnad för El/i})).toBeVisible();
});
for(const width of [360,390,430,1024,1440]){
 test('Kostnadskollen premium blue review at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:860});
  await page.goto('/app/?qa=1');
  const group=page.getByRole('group',{name:'Vad stämmer bäst om ditt elavtal?'});
  await expect(group.getByRole('button')).toHaveCount(3);
  const excess=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(excess).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/kostnadskollen-v5-'+width+'.png',fullPage:true});
 });
}

test('uncertain broadband answer gives one immediate neutral category path, no fabricated ranking',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:'Byt område'}).click();
 await page.getByRole('button',{name:/^Bredband/}).first().click();
 await page.getByRole('button',{name:/Jag är osäker på om priset är rimligt/}).click();
 const immediate=page.getByTestId('cost-check-next-action');
 await expect(immediate).toBeVisible();
 await expect(immediate.getByRole('link',{name:/Se alternativ för bredband/})).toHaveAttribute('href','/bredband/');
 await expect(immediate.locator('a[rel~="sponsored"]')).toHaveCount(0);
 await expect(page.getByRole('link',{name:'Se din första startpunkt'})).toHaveCount(0);
});

test('high-intent broadband comparison chooses real multi-provider partner rather than arbitrary supplier',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:'Byt område'}).click();
 await page.getByRole('button',{name:/^Bredband/}).first().click();
 await page.getByRole('button',{name:/Priset har höjts eller känns högt/}).click();
 const partner=page.getByTestId('cost-check-next-action').locator('a[data-placement="cost_check_quick_path"]');
 await expect(partner).toHaveAttribute('data-partner','Bredbandsval.se');
 await expect(partner).toHaveAttribute('href',/visit\.bredbandsval\.se/);
 await expect(partner).toHaveAttribute('rel',/sponsored/);
 await expect(page.getByTestId('cost-check-next-action')).toContainText('Partnerlänk');
});

test('high-intent mobile answer remains non-ranking, not an arbitrary partner link',async({page})=>{
 await page.goto('/app/?qa=1');
 await page.getByRole('button',{name:'Byt område'}).click();
 await page.getByRole('button',{name:/^Mobil/}).first().click();
 await page.getByRole('button',{name:/Priset är högt eller avtalet känns gammalt/}).click();
 const immediate=page.getByTestId('cost-check-next-action');
 await expect(immediate.getByRole('link',{name:/Se alternativ för mobil/})).toHaveAttribute('href','/mobil/');
 await expect(immediate.locator('[data-placement="cost_check_quick_path"]')).toHaveCount(0);
 await expect(immediate).toContainText('utan att vi gissar');
});

for(const width of [360,390,430,1024,1440]){
 test('new first-answer quick exit remains usable at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:860});
  await page.goto('/app/?qa=1');
  await page.getByRole('button',{name:/Jag är osäker på avgifter eller villkor/}).click();
  const immediate=page.getByTestId('cost-check-next-action');
  await expect(immediate).toBeVisible();
  await expect(immediate.getByRole('link',{name:/Se alternativ för el/})).toBeVisible();
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}

test('question copy is concise, jargon-free and still offers the same three distinct choices',async({page})=>{
 await page.goto('/app/?qa=1');
 const expected=[
  {label:'Elavtal',question:'Vad stämmer bäst om ditt elavtal?',next:'Bredband'},
  {label:'Bredband',question:'Vad stämmer bäst om bredbandet?',next:'Mobil'},
  {label:'Mobilabonnemang',question:'Vad stämmer bäst om mobilabonnemanget?',next:'Försäkring'},
  {label:'Försäkring',question:'Hur bra koll har du på försäkringarna?',next:null},
 ];
 for(const step of expected){
  const group=page.getByRole('group',{name:step.question});
  const buttons=group.getByRole('button');
  await expect(buttons).toHaveCount(3);
  const labels=await buttons.allTextContents();
  expect(labels.every(label=>label.length<=55 && !label.includes('/') && !label.includes('länge sedan jag jämförde'))).toBe(true);
  await buttons.nth(0).click();
  if(step.next) await page.getByRole('button',{name:new RegExp('Klart – till '+step.next)}).click();
 }
 await expect(page.getByTestId('cost-check-no-issues')).toBeVisible();
});

test('restored Kostnadskollen answers do not create fake starts or completions',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  const eventCount=(eventName:string)=>page.evaluate(name=>((window as any).dataLayer||[]).filter((entry:any)=>entry.event===name).length,eventName);

  await page.goto('/app/');
  await answerAll(page);
  await expect.poll(()=>eventCount('cost_check_start')).toBe(1);
  await expect.poll(()=>eventCount('cost_check_complete')).toBe(1);

  await page.reload();
  await expect(page.locator('#resultat')).toBeVisible();
  expect(await eventCount('cost_check_start')).toBe(0);
  expect(await eventCount('cost_check_complete')).toBe(0);
  expect(await eventCount('cost_check_early_result_available')).toBe(0);

  // The user can deliberately begin a new check; that new journey must still count.
  await page.getByRole('button',{name:'Börja om'}).click();
  await answerAll(page);
  await expect.poll(()=>eventCount('cost_check_start')).toBe(1);
  await expect.poll(()=>eventCount('cost_check_complete')).toBe(1);
});

test('partly restored Kostnadskollen only records a completion after a real new answer',async({page})=>{
  await page.addInitScript(()=>{
    (window as any).dataLayer=[];
    window.localStorage.setItem('sankkostnaden-cost-check-v5',JSON.stringify({
      answers:{
        el:{monthly:0,fit:-1},
        bredband:{monthly:0,fit:0},
        mobil:{monthly:0,fit:0},
        forsakring:{monthly:0,fit:0},
      },
      scenarioPct:10,
    }));
  });
  await page.goto('/app/');
  const count=(name:string)=>page.evaluate(key=>((window as any).dataLayer||[]).filter((entry:any)=>entry.event===key).length,name);
  await expect(page.getByRole('group',{name:'Vad stämmer bäst om ditt elavtal?'})).toBeVisible();
  expect(await count('cost_check_start')).toBe(0);
  expect(await count('cost_check_complete')).toBe(0);
  await page.getByRole('button',{name:/Priset har höjts eller känns dyrt/i}).click();
  await expect.poll(()=>count('cost_check_start')).toBe(1);
  await expect.poll(()=>count('cost_check_complete')).toBe(1);
});

/* P0D: after an immediately useful answer, the output must stay in the same
   blue/navy product as the initial question, including the "nothing to switch"
   outcome. All captures are actual renders, not CSS-only assertions. */
for(const width of [360,390,430,1024,1440]){
 test('P0D CostCheck early/no-issue results share the blue system at '+width+'px',async({page},info)=>{
  await page.setViewportSize({width,height:width<=430?844:900});
  await page.goto('/app/?qa=1');
  await page.getByRole('button',{name:/Priset har höjts eller känns dyrt/i}).click();
  const firstResult=page.getByTestId('cost-check-early-result');
  await expect(firstResult).toBeVisible();
  const colors=await firstResult.evaluate(el=>{
    const st=getComputedStyle(el);
    return {background:st.backgroundImage,border:st.borderColor};
  });
  expect(colors.background).toContain('rgb(241, 245, 255)');
  expect(colors.border).toBe('rgb(217, 226, 241)');
  const earlyOverflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(earlyOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:`test-results/screenshots/p0d-costcheck-early-${info.project.name}-${width}.png`,fullPage:true});

  await page.getByRole('button',{name:'Börja om'}).click();
  const flow=[
   {group:'Vad stämmer bäst om ditt elavtal?',next:'Bredband'},
   {group:'Vad stämmer bäst om bredbandet?',next:'Mobil'},
   {group:'Vad stämmer bäst om mobilabonnemanget?',next:'Försäkring'},
   {group:'Hur bra koll har du på försäkringarna?',next:null},
  ];
  for(const step of flow){
    const choices=page.getByRole('group',{name:step.group}).getByRole('button');
    await choices.first().click();
    if(step.next)await page.getByRole('button',{name:new RegExp('Klart – till '+step.next)}).click();
  }
  const noIssue=page.getByTestId('cost-check-no-issues');
  await expect(noIssue).toBeVisible();
  const firstExit=noIssue.getByRole('link').first();
  await expect(firstExit).toBeVisible();
  expect(await firstExit.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(241, 245, 255)');
  const noIssueOverflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(noIssueOverflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:`test-results/screenshots/p0d-costcheck-safe-${info.project.name}-${width}.png`,fullPage:true});
 });
}

test('P0D remaining CostCheck progress/score accents use navy tokens rather than olive',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/app/?qa=1');
  const progress=page.locator('[class*="progressRail"] button b').first();
  await expect(progress).toBeVisible();
  expect(await progress.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(241, 245, 255)');
  await page.getByRole('button',{name:/Priset har höjts eller känns dyrt/i}).click();
  await expect(page.getByTestId('cost-check-early-result')).toBeVisible();
  await page.screenshot({path:'test-results/screenshots/p0d-costcheck-progress-navy-390.png',fullPage:true});
});
