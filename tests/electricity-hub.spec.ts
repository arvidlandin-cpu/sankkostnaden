import { expect, test } from '@playwright/test';

const route='/elavtal/?qa=1';

test('electricity hub shows meaningful choices and all actual partner options without mandatory questions',async({page})=>{
 await page.goto(route);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/elavtal/');
 await expect(page.getByRole('heading',{level:1,name:/Jämför elavtal utan att gissa/i})).toBeVisible();
 const section=page.getByTestId('electricity-market');
 await expect(section.getByRole('heading',{level:2,name:'Välj hur du vill jämföra'})).toBeVisible();
 await expect(section.getByText('13 aktiva samarbetspartners')).toBeVisible();
 await expect(section.getByRole('heading',{name:'Jämför flera elbolag på ett ställe'})).toBeVisible();
 await expect(section.getByRole('heading',{name:'Våra aktiva elbolag'})).toBeVisible();
 const comparison=page.locator('a[data-placement="electricity_hub_comparison"]');
 await expect(comparison).toHaveCount(1);
 await expect(comparison).toHaveAttribute('data-partner','Elskling');
 await expect(comparison).toHaveAttribute('rel',/sponsored/);
 await expect(comparison).toHaveAttribute('target','_blank');
 const suppliers=page.locator('a[data-placement="electricity_hub_supplier"]');
 await expect(suppliers).toHaveCount(12);
 for(const supplier of await suppliers.all()){
  await expect(supplier).toHaveAttribute('rel',/sponsored/);
  await expect(supplier).toHaveAttribute('target','_blank');
  await expect(supplier).toHaveAttribute('data-category','el');
 }
 await expect(section.getByText(/ordningen är alfabetisk/i)).toBeVisible();
 await expect(section.getByText(/inte hela marknaden/i).last()).toBeVisible();
 await expect(section.getByRole('link',{name:/Räkna hela årskostnaden/i})).toHaveAttribute('href','/verktyg/elavtalskostnad/?src=elavtal');
 await expect(section.getByRole('link',{name:/Få hjälp att välja/i})).toHaveAttribute('href','/elavtal/vilket-elavtal-passar-mig/');
 expect(await page.locator('button').filter({hasText:/Flera avtal|Direkt till bolag|Ursprung viktigt/}).count()).toBe(0);
});

test('electricity company list is alphabetical, not a hidden commission ranking',async({page})=>{
 await page.goto(route);
 const names=await page.locator('[data-placement="electricity_hub_supplier"]').evaluateAll(anchors=>anchors.map(a=>a.getAttribute('data-partner')||''));
 expect(names).toHaveLength(12);
 expect(names).toEqual([...names].sort((a,b)=>a.localeCompare(b,'sv')));
});


test('Tibber has the supplied Adtraction tracking link and receives click attribution',async({page})=>{
 await page.addInitScript(()=>{(window as any).dataLayer=[];});
 await page.goto(route);
 const tibber=page.locator('a[data-placement="electricity_hub_supplier"][data-partner="Tibber"]');
 await expect(tibber).toHaveCount(1);
 const before=await tibber.getAttribute('href');
 expect(before).toBe('https://go.adt242.com/t/t?a=1590956516&as=2111115937&t=2&tk=1');
 await expect(tibber).toHaveAttribute('rel',/sponsored/);
 await tibber.evaluate((element:HTMLAnchorElement)=>element.addEventListener('click',event=>event.preventDefault()));
 await tibber.click();
 const tagged=new URL((await tibber.getAttribute('href'))!);
 const events=await page.evaluate(()=>(window as any).dataLayer||[]);
 const click=events.find((item:any)=>item.event==='affiliate_click'&&item.partner==='Tibber');
 expect(click?.affiliate_network).toBe('adtraction');
 expect(click?.network_click_tagged).toBe(1);
 expect(click?.local_click_id).toMatch(/^clk_/);
 expect(tagged.searchParams.get('a')).toBe('1590956516');
 expect(tagged.searchParams.get('as')).toBe('2111115937');
 expect(tagged.searchParams.get('epi')).toBe(click.local_click_id);
 expect(tagged.searchParams.get('epi2')).toBe(click.funnel_session_id);
});

for(const viewport of [
 {width:360,height:800},{width:390,height:844},{width:430,height:932},
 {width:1024,height:768},{width:1440,height:900},
]){
 test('electricity redesigned decision path remains usable at '+viewport.width+'px',async({page},testInfo)=>{
  await page.setViewportSize(viewport);
  await page.goto(route);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const anchor=page.getByRole('link',{name:/Se aktiva elalternativ/i});
  await expect(anchor).toBeVisible();
  await anchor.click();
  await expect(page).toHaveURL(/#jamfor-elavtal$/);
  const section=page.getByTestId('electricity-market');
  await expect(section.getByRole('heading',{name:'Välj hur du vill jämföra'})).toBeVisible();
  const first=page.locator('a[data-placement="electricity_hub_comparison"]');
  const box=await first.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(220);
  await page.screenshot({path:`test-results/screenshots/masterplan-electricity-${testInfo.project.name}-${viewport.width}.png`,fullPage:true});
 });
}
