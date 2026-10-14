import {test,expect,type Page,type Locator} from '@playwright/test';
import {getActivePartners,type PartnerCategory,type PartnerIntent} from '../lib/partners';

const categories:PartnerCategory[]=['bredband','el','mobil','forsakring','ekonomi'];
const widths=[360,390,430,1024,1440,1920];
const journey=(page:Page)=>page.getByTestId('cost-map-journey');
const cards=(page:Page)=>journey(page).getByTestId('v10-partner-card');

// Never follow a commercial destination, including a popup, during this suite.
test.beforeEach(async({context,baseURL})=>{
 const origin=new URL(baseURL||'https://sankkostnaden.se').origin;
 await context.route('**/*',route=>{
  const request=route.request();
  if(request.isNavigationRequest()&&new URL(request.url()).origin!==origin)return route.abort();
  return route.continue();
 });
});

async function open(page:Page){
 const response=await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
 expect(response?.ok()).toBeTruthy();
 await expect(journey(page)).toBeVisible();
}
async function reset(page:Page){
 const back=journey(page).getByTestId('cost-map-back');
 if(await back.isVisible())await back.click();
 await expect(journey(page)).toHaveAttribute('data-selected','false');
}
async function select(page:Page,category:PartnerCategory){
 await reset(page);
 await journey(page).getByTestId('v10-category-'+category).click();
 await expect(journey(page)).toHaveAttribute('data-selected','true');
 await expect(cards(page).first()).toBeVisible();
}
async function expectPartners(page:Page,category:PartnerCategory,intent?:PartnerIntent){
 const expected=getActivePartners(category,intent,Number.MAX_SAFE_INTEGER);
 const more=journey(page).getByTestId('cost-map-more');
 if(await more.isVisible())await more.locator('summary').click();
 const links=cards(page);
 await expect(links).toHaveCount(expected.length);
 const names=await links.evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-partner')).sort());
 expect(names).toEqual(expected.map(p=>p.name).sort());
 for(const link of await links.all())await expect(link).toBeVisible();
 for(const partner of expected){
  // Match by metadata rather than copy, position or commercial rank.
  const snapshot=await links.evaluateAll((nodes,name)=>{
   const node=nodes.find(n=>n.getAttribute('data-partner')===name);
   return node?{href:node.getAttribute('href'),category:node.getAttribute('data-category'),intent:node.getAttribute('data-intent'),placement:node.getAttribute('data-placement'),rel:node.getAttribute('rel'),target:node.getAttribute('target'),text:node.textContent}:null;
  },partner.name);
  expect(snapshot).not.toBeNull();
  expect(snapshot!.href).toBe(partner.trackingUrl);
  expect(snapshot!.category).toBe(category);
  expect(partner.intents).toContain(snapshot!.intent);
  if(intent)expect(snapshot!.intent).toBe(intent);
  expect(snapshot!.placement).toMatch(/^cost_map_(comparison|direct|service)$/);
  expect(snapshot!.rel?.split(/\s+/)).toEqual(expect.arrayContaining(['sponsored','nofollow','noopener']));
  expect(snapshot!.target).toBe('_blank');
  expect(snapshot!.text).toMatch(/annons/i);
 }
}
async function tapTarget(locator:Locator){
 const box=await locator.boundingBox();
 expect(box).not.toBeNull();
 expect(box!.width).toBeGreaterThanOrEqual(44);
 expect(box!.height).toBeGreaterThanOrEqual(44);
}

test('Starts without a fabricated quote; all five categories yield genuine, discoverable partners',async({page})=>{
 test.setTimeout(90_000); // Five categories and every active partner are verified in this one journey.
 await open(page);
 await expect(journey(page)).toHaveAttribute('data-selected','false');
 await expect(cards(page)).toHaveCount(0);
 expect(await journey(page).innerText()).not.toMatch(/du sparar\s+[\d,.]+|ditt (?:pris|erbjudande)\s*[:]?\s*\d/i);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/');
 for(const category of categories){
  await select(page,category);
  await expectPartners(page,category,category==='ekonomi'?'loan':undefined);
  await expect(journey(page).locator('input[type="password"],input[type="email"],input[autocomplete="username"]')).toHaveCount(0);
 }
});

test('Need filters change the actual partner set and preserve intent-specific deep links',async({page})=>{
 await open(page);
 for(const [category,filters] of [
  ['bredband',[['fiber','fiber'],['mobile','mobile-broadband']]],
  ['forsakring',[['home','home'],['pet','pet'],['travel','travel']]],
 ] as const){
  await select(page,category);
  const sets:string[][]=[];
  for(const [id,intent] of filters){
   const filter=journey(page).getByTestId('v10-filter-'+id);
   await filter.click();
   await expect(filter).toHaveAttribute('aria-pressed','true');
   await expectPartners(page,category,intent);
   sets.push(await cards(page).evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-partner')||'').sort()));
  }
  expect(new Set(sets.map(set=>JSON.stringify(set))).size).toBe(filters.length);
 }
});

test('Cost Map preserves one funnel, fresh network click references and the new intent after filtering',async({page})=>{
 await page.addInitScript(()=>{(window as any).dataLayer=[];});
 await open(page);
 const clickWithoutLeaving=async(name:string)=>{
  const link=cards(page).filter({has:page.locator('strong',{hasText:new RegExp('^'+name+'$')})});
  await expect(link).toHaveCount(1);
  await expect(link).toBeVisible();
  // Exercise the real capture/React handlers without contacting an affiliate network.
  await link.evaluate(node=>{
   node.addEventListener('click',event=>event.preventDefault(),{once:true});
   (node as HTMLAnchorElement).click();
  });
  return new URL((await link.getAttribute('href'))!);
 };
 await select(page,'el');
 const electricity=await clickWithoutLeaving('Elskling');
 await reset(page);
 await select(page,'forsakring');
 await journey(page).getByTestId('v10-filter-home').click();
 await journey(page).getByTestId('cost-map-more').locator('summary').click();
 const home=await clickWithoutLeaving('Hedvig');
 await journey(page).getByTestId('v10-filter-pet').click();
 const petLink=cards(page).filter({has:page.locator('strong',{hasText:/^Hedvig$/})});
 expect(new URL((await petLink.getAttribute('href'))!).searchParams.has('r')).toBe(false);
 const pet=await clickWithoutLeaving('Hedvig');
 const events=await page.evaluate(()=>(window as any).dataLayer||[]);
 const clicks=events.filter((event:any)=>event.event==='affiliate_click');
 expect(clicks).toHaveLength(3);
 const [elClick,homeClick,petClick]=clicks;
 expect(elClick.funnel_session_id).toMatch(/^fs_/);
 for(const click of clicks){
  expect(click.funnel_session_id).toBe(elClick.funnel_session_id);
  expect(click.local_click_id).toMatch(/^clk_/);
  expect(click.network_click_tagged).toBe(1);
  expect(click.placement).toMatch(/^cost_map_/);
 }
 expect(electricity.searchParams.get('epi')).toBe(elClick.local_click_id);
 expect(electricity.searchParams.get('epi2')).toBe(elClick.funnel_session_id);
 expect(home.searchParams.get('r')).toBe(homeClick.local_click_id);
 expect(pet.searchParams.get('r')).toBe(petClick.local_click_id);
 expect(petClick.local_click_id).not.toBe(homeClick.local_click_id);
 expect([elClick.category,homeClick.category,petClick.category]).toEqual(['el','forsakring','forsakring']);
 expect([elClick.intent,homeClick.intent,petClick.intent]).toEqual(['compare','home','pet']);
 expect(events.filter((event:any)=>event.event==='v10_partner_selected')).toHaveLength(3);
 await expect(page).toHaveURL(/\/?\?qa=1$/);
});

test('Mobile keyboard selection moves focus to results and reset returns to the selected category',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await open(page);
 const button=journey(page).getByTestId('v10-category-bredband');
 await button.focus();await page.keyboard.press('Enter');
 await expect(journey(page).getByTestId('cost-map-panel-title')).toBeFocused();
 const reset=journey(page).getByTestId('cost-map-back');
 await reset.focus();await page.keyboard.press('Space');
 await expect(journey(page)).toHaveAttribute('data-selected','false');
 await expect(button).toBeFocused();
 await expect(cards(page)).toHaveCount(0);
});

test('Every category exposes working internal guide and voluntary tool routes',async({page})=>{
 await open(page);
 const destinations=new Set<string>();
 for(const category of categories){
  await select(page,category);
  for(const id of ['v11-route-guide','v11-route-tool']){
   const link=journey(page).getByTestId(id);
   await expect(link).toBeVisible();
   const href=await link.getAttribute('href');
   expect(href).toMatch(/^\/(?:bredband|elavtal|mobil|forsakring|ekonomi|verktyg)\/.+/);
   destinations.add(href!);
  }
 }
 // Navigate internal pages with qa=1 so QA cannot contaminate production analytics.
 for(const href of destinations){
  const response=await page.goto(href+(href.includes('?')?'&':'?')+'qa=1',{waitUntil:'domcontentloaded'});
  expect(response?.ok(),href).toBeTruthy();
  await expect(page.locator('main h1')).toHaveCount(1);
 }
});

for(const width of widths){
 test('Responsive journey keeps controls reachable and does not overflow at '+width,async({page})=>{
  test.setTimeout(90_000); // Five complete category/reset journeys, including mobile focus and scrolling.
  await page.setViewportSize({width,height:width<600?844:960});
  await open(page);
  for(const category of categories){
   await reset(page);
   await tapTarget(journey(page).getByTestId('v10-category-'+category));
   await select(page,category);
   await tapTarget(journey(page).getByTestId('cost-map-back'));
   await tapTarget(cards(page).first());
   for(const filter of await journey(page).locator('button[data-testid^="v10-filter-"]').all())await tapTarget(filter);
   const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
   expect(overflow,category+' at '+width).toBeLessThanOrEqual(1);
  }
 });
}

test('Reduced motion retains useful keyboard navigation and stable result focus',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.setViewportSize({width:390,height:844});
 await open(page);
 await select(page,'el');
 await expect(journey(page).getByTestId('cost-map-panel-title')).toBeFocused();
 await expect(journey(page).getByTestId('cost-map-panel')).toBeInViewport();
 await expect(cards(page).first()).toBeVisible();
});

test('Without JavaScript, category pages remain reachable through real links',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});
 try{
  const page=await context.newPage();
  const response=await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
  expect(response?.ok()).toBeTruthy();
  for(const href of ['/bredband/','/elavtal/','/mobil/','/forsakring/','/ekonomi/']){
   await expect(page.locator('main a[href="'+href+'"]').first()).toBeVisible();
  }
 }finally{await context.close();}
});
