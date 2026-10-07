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
