import {expect,test} from '@playwright/test';

const sampleRoutes=[
 '/elavtal/kvartspris/',
 '/bredband/utan-bindningstid/',
 '/mobil/familjeabonnemang/',
 '/forsakring/hemforsakring-bostadsratt/',
 '/ekonomi/jamfor-privatlan/',
] as const;

for(const path of sampleRoutes){
 test('living guide reading flow '+path,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(path+'?qa=1');
  const panel=page.getByTestId('guide-reading-flow');
  await expect(panel).toBeVisible();
  await expect(panel.getByTestId('guide-key-takeaways').locator('p').first()).toBeVisible();
  const first=panel.locator('details').first();
  await expect(first).toHaveAttribute('open','');
  await expect(first.locator('div p')).toBeVisible();
  const next=panel.locator('details').nth(1);
  await expect(next).not.toHaveAttribute('open');
  await next.locator('summary').click();
  await expect(next).toHaveAttribute('open','');
  await expect(next.locator('div p')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se'+path);
  const diff=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(diff).toBeLessThanOrEqual(1);
 });
}
for(const width of [360,390,430,1024,1440]){
 test('guide feels like interactive cards at '+width+'px',async({page},info)=>{
  await page.setViewportSize({width,height:width<500?844:900});
  await page.goto('/elavtal/kvartspris/?qa=1',{waitUntil:'networkidle'});
  const flow=page.getByTestId('guide-reading-flow');
  await expect(flow.locator('details')).toHaveCount(5);
  const summary=flow.locator('details').nth(2).locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(flow.locator('details').nth(2)).toHaveAttribute('open','');
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/experience-p0-guide-'+width+'.png',fullPage:true});
 });
}

// The BRF price-answer example belongs to the existing production-facing reading suite.

const route='/forsakring/hemforsakring-bostadsratt/';

for(const width of [360,390,430,1024,1440,1920]){
  test('BRF price answer and worked example remain usable at '+width+'px',async({page},info)=>{
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.setViewportSize({width,height:900});
    await page.goto(route+'?qa=1');
    const example=page.getByTestId('bostadsratt-price-example');
    await expect(example.getByRole('heading',{name:'Vad kostar hemförsäkring för en bostadsrätt?'})).toBeVisible();
    const details=example.locator('details');
    await expect(details).not.toHaveAttribute('open');
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open','');
    await expect(example.getByText('Räkneexempel med antagna belopp.',{exact:true})).toBeVisible();
    await expect(example).toContainText('inga offerter eller aktuella priser från våra partners');
    const table=example.getByRole('table');
    await expect(table).toBeVisible();
    const rows=table.getByRole('row');
    await expect(rows).toHaveCount(5);
    const text=await rows.allTextContents();
    expect(text[1]).toContain('180 kr/mån');
    expect(text[2]).toContain('260 kr/mån');
    const a=6*180+6*260,b=12*230;
    expect(text[3]).toContain(a.toLocaleString('sv-SE').replace(/\s/g,' ')+' kr');
    expect(text[3]).toContain(b.toLocaleString('sv-SE').replace(/\s/g,' ')+' kr');
    await expect(example).toContainText(`${b-a} kr mindre första året`);
    await expect(example).toContainText('Jämför självrisk och åldersavdrag separat.');
    await expect(example).toContainText('ersätter inte din vanliga hemförsäkring');
    const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(await table.evaluate(e=>e.scrollWidth-e.clientWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
    await page.screenshot({path:`test-results/screenshots/brf-price-example-${width}-${info.project.name}.png`,fullPage:true});
  });
}

test('BRF keeps SEO identity, source transparency and the existing cover journey',async({page,request})=>{
  const response=await request.get(route+'?qa=1');
  const html=await response.text();
  // Useful content and the worked example exist without executing JavaScript.
  expect(html).toContain('6 × 180 + 6 × 260 = 2 640 kr');
  expect(html).toContain('Källor kontrollerade 10 november 2026');
  await page.goto(route+'?qa=1');
  await expect(page.locator('h1')).toHaveText('Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://sankkostnaden.se'+route);
  const example=page.getByTestId('bostadsratt-price-example');
  await expect(example.locator('a')).toHaveCount(2);
  for(const link of await example.locator('a').all()){
    await expect(link).toHaveAttribute('href',/^https:\/\/www\.konsumenternas\.se\//);
    expect((await link.getAttribute('rel'))||'').not.toContain('sponsored');
  }
  const check=page.getByTestId('condo-insurance-check');
  await check.getByRole('group').first().getByRole('button',{name:'Ja',exact:true}).click();
  await check.getByRole('group').nth(1).getByRole('button',{name:'Ja',exact:true}).click();
  await expect(check.locator('[aria-live=polite]')).toBeVisible();
  const partners=page.locator('#guide-partners a[data-partner]');
  expect(await partners.count()).toBeGreaterThan(0);
  for(const link of await partners.all()){
    await expect(link).toHaveAttribute('rel',/sponsored/);
    await expect(link).toHaveAttribute('href',/^https:\/\//);
  }
  // Inspect attributes only: never navigate to a real sponsored link.
});

test('unrelated guides do not receive the BRF-specific price example',async({page})=>{
  for(const path of ['/elavtal/kvartspris/','/forsakring/jamfor-hemforsakring/']){
    await page.goto(path+'?qa=1');
    await expect(page.getByTestId('bostadsratt-price-example')).toHaveCount(0);
  }
});
