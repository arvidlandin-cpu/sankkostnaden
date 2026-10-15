import {test,expect} from '@playwright/test';
import {getActivePartners} from '../lib/partners';

// Exercise internal navigation only; a mistaken external route must never count as an ad click.
test.beforeEach(async({context,baseURL})=>{
 const origin=new URL(baseURL||'https://sankkostnaden.se').origin;
 await context.route('**/*',route=>route.request().isNavigationRequest()&&new URL(route.request().url()).origin!==origin?route.abort():route.continue());
});
for(const width of [360,390,430]){
 test('Broadband has one initial partner decision and keeps all active partners and both fragment targets at '+width,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto('/bredband/?qa=1',{waitUntil:'domcontentloaded'});
  const lane=page.getByTestId('v10-category-lane');
  await expect(lane).toHaveCount(1);
  await expect(page.getByTestId('broadband-market')).toHaveCount(0);
  await expect(page.locator('#v10-category-lane').getByTestId('v10-category-lane')).toHaveCount(1);
  await expect(page.locator('#category-partners').getByTestId('v10-category-lane')).toHaveCount(1);
  const allActive=getActivePartners('bredband',undefined,Infinity);
  expect(await lane.getByTestId('v10-partner-card').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-partner')).sort())).toEqual(allActive.map(p=>p.name).sort());
  await lane.getByRole('button',{name:'Mobilt / 5G',exact:true}).click();
  expect(await lane.getByTestId('v10-partner-card').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-partner')).sort())).toEqual(getActivePartners('bredband','mobile-broadband',Infinity).map(p=>p.name).sort());
  const guide=page.locator('main a[href="/bredband/utan-bindningstid/"]');
  await expect(guide).toHaveAttribute('href','/bredband/utan-bindningstid/');
  await page.goto('/bredband/utan-bindningstid/?qa=1',{waitUntil:'domcontentloaded'});
  await page.getByTestId('editorial-guide-hero').getByRole('link',{name:'Börja med råden',exact:true}).click();
  await expect(page).toHaveURL(/#guide-summary$/);
  const summary=page.locator('#guide-summary');
  await expect(summary.getByTestId('guide-key-takeaways')).toBeVisible();
  expect(await summary.evaluate(node=>node.parentElement?.firstElementChild===node)).toBe(true);
  const gateway=page.locator('.decisionGatewayCompact');
  expect(await gateway.evaluate(node=>Boolean(document.querySelector('#guide-summary')!.compareDocumentPosition(node)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await expect(gateway.getByRole('link',{name:/Hjälp mig välja hastighet/})).toHaveAttribute('href','/bredband/vilken-hastighet-behover-jag/');
  await expect(page.locator('#guide-partners a[rel~=sponsored]').first()).toHaveAttribute('data-category','bredband');
  expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
 });
}
