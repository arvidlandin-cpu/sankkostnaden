import { expect, test, type Page } from '@playwright/test';

async function fillElectricity(page:Page){
  await page.getByRole('button',{name:/Ja, jämför mina erbjudanden/}).click();
  await page.getByLabel('Årsförbrukning i kWh').fill('20000');
  const a=page.getByTestId('electricity-offer-a');
  const b=page.getByTestId('electricity-offer-b');
  await a.getByLabel('Elhandelspris att jämföra').fill('85');
  await a.getByLabel('Fast avgift (skriv 0 om ingen)').fill('49');
  await b.getByLabel('Elhandelspris att jämföra').fill('82');
  await b.getByLabel('Fast avgift (skriv 0 om ingen)').fill('79');
  await a.getByText('Rabatt och namn (valfritt)').click();
  await b.getByText('Rabatt och namn (valfritt)').click();
  await a.getByLabel('Rabatt totalt under 12 mån').fill('600');
  await b.getByLabel('Rabatt totalt under 12 mån').fill('0');
}

async function preventNavigation(locator:any){
  await locator.evaluate((element:any)=>element.addEventListener('click',(event:Event)=>event.preventDefault()));
}

test('calculator and Adtraction click share one funnel session and one EPI click reference',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/verktyg/elavtalskostnad/?src=attribution_qa');

  await fillElectricity(page);
  await page.getByRole('button',{name:/Räkna årskostnaden/i}).click();
  await page.getByTestId('electricity-cost-commercial-cta').click();

  const sponsored=page.locator('a[data-partner="Elskling"]').first();
  await expect(sponsored).toBeVisible();
  const hrefBefore=await sponsored.getAttribute('href');
  expect(hrefBefore).not.toContain('epi=');

  await preventNavigation(sponsored);
  await sponsored.click();

  const hrefAfter=await sponsored.getAttribute('href');
  const tagged=new URL(hrefAfter!);
  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const ready=events.find((item:any)=>item.event==='electricity_cost_ready');
  const continued=events.find((item:any)=>item.event==='electricity_cost_continue');
  const click=events.find((item:any)=>item.event==='affiliate_click'&&item.partner==='Elskling');

  expect(ready?.funnel_session_id).toMatch(/^fs_/);
  expect(continued?.funnel_session_id).toBe(ready.funnel_session_id);
  expect(click?.funnel_session_id).toBe(ready.funnel_session_id);
  expect(click?.local_click_id).toMatch(/^clk_/);
  expect(click?.affiliate_network).toBe('adtraction');
  expect(click?.network_click_tagged).toBe(1);
  expect(tagged.searchParams.get('epi')).toBe(click.local_click_id);
  expect(tagged.searchParams.get('epi2')).toBe(click.funnel_session_id);
});

test('Adtraction deeplink keeps destination url last after EPI tagging',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/mobil/billigaste-mobilabonnemanget/?qa=1');

  const link=page.locator('a[data-partner="Comviq"]').first();
  await expect(link).toHaveCount(1);
  await preventNavigation(link);
  await link.evaluate((element:any)=>element.click());

  const href=await link.getAttribute('href');
  expect(href).toContain('epi=');
  expect(href).toContain('epi2=');
  expect(href!.indexOf('&url=')).toBeGreaterThan(href!.indexOf('&epi2='));
  expect(href!.match(/&url=/g)?.length).toBe(1);
});

test('each standard Adtraction click gets a fresh EPI and local click id',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/billigaste-elavtalet/?qa=1');

  const link=page.locator('a[data-partner="Elskling"]').first();
  await expect(link).toHaveCount(1);
  await preventNavigation(link);

  await link.evaluate((element:any)=>element.click());
  const firstHref=await link.getAttribute('href');
  const firstEpi=new URL(firstHref!).searchParams.get('epi');

  await link.evaluate((element:any)=>element.click());
  const secondHref=await link.getAttribute('href');
  const secondEpi=new URL(secondHref!).searchParams.get('epi');

  const clicks=await page.evaluate(()=>(window as any).dataLayer.filter((item:any)=>item.event==='affiliate_click'&&item.partner==='Elskling'));
  expect(clicks.length).toBeGreaterThanOrEqual(2);
  expect(firstEpi).toBe(clicks[0].local_click_id);
  expect(secondEpi).toBe(clicks[1].local_click_id);
  expect(firstEpi).not.toBe(secondEpi);
  expect(clicks[0].funnel_session_id).toBe(clicks[1].funnel_session_id);
});

test('pre-existing EPI is preserved instead of overwritten',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/billigaste-elavtalet/?qa=1');

  const link=page.locator('a[data-partner="Elskling"]').first();
  await link.evaluate((element:any)=>{
    const url=new URL(element.href);
    url.searchParams.set('epi','existing_reference');
    element.href=url.toString();
    element.addEventListener('click',(event:Event)=>event.preventDefault());
  });

  await link.evaluate((element:any)=>element.click());
  const href=await link.getAttribute('href');
  const url=new URL(href!);
  expect(url.searchParams.get('epi')).toBe('existing_reference');

  const click=await page.evaluate(()=>(window as any).dataLayer.find((item:any)=>item.event==='affiliate_click'&&item.partner==='Elskling'));
  expect(click.network_tag_reason).toBe('existing_epi');
  expect(click.network_click_tagged).toBe(0);
});

test('Addrevenue click receives r subid equal to the local click id',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/forsakring/jamfor-hemforsakring/?qa=1');

  const link=page.locator('a[data-partner="Hedvig"]').first();
  await expect(link).toHaveCount(1);
  const before=await link.getAttribute('href');
  expect(before).not.toContain('&r=');

  await preventNavigation(link);
  await link.evaluate((element:any)=>element.click());

  const after=await link.getAttribute('href');
  const tagged=new URL(after!);
  const click=await page.evaluate(()=>(window as any).dataLayer.find((item:any)=>item.event==='affiliate_click'&&item.partner==='Hedvig'));

  expect(click).toBeTruthy();
  expect(click.affiliate_network).toBe('addrevenue');
  expect(click.network_click_tagged).toBe(1);
  expect(click.network_tag_reason).toBe('tagged');
  expect(tagged.searchParams.get('r')).toBe(click.local_click_id);
});

test('pre-existing Addrevenue r click reference is preserved',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/forsakring/jamfor-hemforsakring/?qa=1');

  const link=page.locator('a[data-partner="Hedvig"]').first();
  await expect(link).toHaveCount(1);
  await link.evaluate((element:any)=>{
    const url=new URL(element.href);
    url.searchParams.set('r','existing_reference');
    element.href=url.toString();
    element.addEventListener('click',(event:Event)=>event.preventDefault());
  });

  await link.evaluate((element:any)=>element.click());
  const href=await link.getAttribute('href');
  const url=new URL(href!);
  expect(url.searchParams.get('r')).toBe('existing_reference');

  const click=await page.evaluate(()=>(window as any).dataLayer.find((item:any)=>item.event==='affiliate_click'&&item.partner==='Hedvig'));
  expect(click.affiliate_network).toBe('addrevenue');
  expect(click.network_click_tagged).toBe(0);
  expect(click.network_tag_reason).toBe('existing_clickref');
});

test('unsupported affiliate network link is not modified',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/bredband/billigaste-bredbandet/?qa=1');

  const link=page.locator('a[data-partner="Bredbandsval.se"]').first();
  await expect(link).toHaveCount(1);
  const before=await link.getAttribute('href');

  await preventNavigation(link);
  await link.evaluate((element:any)=>element.click());

  const after=await link.getAttribute('href');
  expect(after).toBe(before);

  const click=await page.evaluate(()=>(window as any).dataLayer.find((item:any)=>item.event==='affiliate_click'&&item.partner==='Bredbandsval.se'));
  expect(click).toBeTruthy();
  expect(click.affiliate_network).toBe('unknown');
  expect(click.network_click_tagged).toBe(0);
  expect(click.network_tag_reason).toBe('unsupported');
});

test('last click context is session-only and contains no raw calculator values',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/billigaste-elavtalet/?qa=1');
  const sponsored=page.locator('a[data-partner="Elskling"]').first();
  await preventNavigation(sponsored);
  await sponsored.evaluate((element:any)=>element.click());

  const stored=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('sankkostnaden-last-affiliate-click-v1')||'{}'));
  expect(stored.local_click_id).toMatch(/^clk_/);
  expect(stored.partner).toBe('Elskling');
  expect(stored.network).toBe('adtraction');
  expect(stored.page_path).toBe('/elavtal/billigaste-elavtalet/');
  expect(JSON.stringify(stored)).not.toContain('annualKwh');
  expect(JSON.stringify(stored)).not.toContain('monthly');
});


test('mobile matcher answers and affiliate click share one funnel session',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/mobil/billigaste-mobilabonnemanget/?qa=1');

  await page.getByRole('button',{name:'Bara mig'}).click();
  await page.getByRole('button',{name:'Inte viktigt'}).click();

  const sponsored=page.locator('.matchPartnerGrid a[rel~="sponsored"]').first();
  await expect(sponsored).toBeVisible();
  await preventNavigation(sponsored);
  await sponsored.click();

  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const answers=events.filter((item:any)=>item.event==='mobile_match_answer');
  const click=events.find((item:any)=>item.event==='affiliate_click'&&item.placement==='mobile_matcher');

  expect(answers).toHaveLength(2);
  expect(answers[0].funnel_session_id).toMatch(/^fs_/);
  expect(answers[1].funnel_session_id).toBe(answers[0].funnel_session_id);
  expect(click?.funnel_session_id).toBe(answers[0].funnel_session_id);
});

test('guided electricity matcher answer shares funnel session with partner click',async({page})=>{
  await page.addInitScript(()=>{(window as any).dataLayer=[];});
  await page.goto('/elavtal/jamfor-elavtal/?qa=1');

  await page.getByRole('button',{name:'Flera avtal'}).click();
  const link=page.locator('a[data-partner="Elskling"][data-placement="electricity_matcher"]').first();
  await expect(link).toBeVisible();
  await preventNavigation(link);
  await link.click();

  const events=await page.evaluate(()=>(window as any).dataLayer||[]);
  const answer=events.find((item:any)=>item.event==='electricity_match_answer');
  const click=events.find((item:any)=>item.event==='affiliate_click'&&item.partner==='Elskling'&&item.placement==='electricity_matcher');

  expect(answer?.funnel_session_id).toMatch(/^fs_/);
  expect(click?.funnel_session_id).toBe(answer.funnel_session_id);
});
