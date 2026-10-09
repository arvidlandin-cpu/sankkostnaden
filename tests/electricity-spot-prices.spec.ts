import { expect, test } from '@playwright/test';
import { calculateSpotShiftScenario } from '../lib/spotShiftScenario';

test('electricity spot chart shows real-data controls or a clear unavailable state',async({page})=>{
 await page.goto('/elavtal/?qa=1');
 const section=page.getByTestId('electricity-spot-prices');
 await expect(section.getByRole('heading',{name:'Se när elen är billigare'})).toBeVisible();
 await expect(section.getByLabel('Välj elområde')).toBeVisible();
 await expect(section.getByRole('button',{name:'I dag'})).toBeVisible();
 await expect(section.getByRole('button',{name:'I morgon'})).toBeVisible();
 await expect(section.getByRole('link',{name:'Elpriset just nu.se'})).toHaveAttribute('href','https://www.elprisetjustnu.se/elpris-api');
});

for(const width of [360,390,430,1024,1440]){
 test('responsive price module at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:850});
  await page.goto('/elavtal/?qa=1');
  await expect(page.getByTestId('electricity-spot-prices')).toBeVisible();
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}

function mockSpotDay(priceMode: 'spread' | 'flat' = 'spread') {
 const date = new Date();
 const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
 const start = Date.parse(day + 'T00:00:00Z');
 const records = Array.from({ length: 96 }, (_, i) => ({
  start: new Date(start + i * 900000).toISOString(),
  end: new Date(start + (i + 1) * 900000).toISOString(),
  sekPerKwh: priceMode === 'flat' ? 0.6 : i < 8 ? 0.2 : i >= 88 ? 1.2 : 0.6,
 }));
 return { day, records };
}

test('shift scenario is deterministic, bounded, and does not invent annual savings', () => {
 const { records } = mockSpotDay();
 const answer = calculateSpotShiftScenario(records, 2);
 expect(answer?.cheapAverageSek).toBeCloseTo(0.2, 6);
 expect(answer?.expensiveAverageSek).toBeCloseTo(1.2, 6);
 expect(answer?.spotDifferenceSek).toBeCloseTo(2, 6);
 expect(calculateSpotShiftScenario(records, 0)?.spotDifferenceSek).toBe(0);
 expect(calculateSpotShiftScenario(records, 10)?.spotDifferenceSek).toBeCloseTo(10, 6);
 expect(calculateSpotShiftScenario(records, 11)).toBeNull();
 expect(calculateSpotShiftScenario(records, -1)).toBeNull();
 expect(calculateSpotShiftScenario(records, Number.NaN)).toBeNull();
 expect(calculateSpotShiftScenario(records.slice(1), 2)).toBeNull();
 expect(calculateSpotShiftScenario(mockSpotDay('flat').records, 8)?.spotDifferenceSek).toBe(0);
 const negative = records.map((r, i) => ({ ...r, sekPerKwh: i < 8 ? -0.2 : i >= 88 ? 0.2 : 0 }));
 expect(calculateSpotShiftScenario(negative, 5)?.spotDifferenceSek).toBeCloseTo(2, 6);
 expect(calculateSpotShiftScenario(records.slice(0, 92), 2)).not.toBeNull();
 const dstAutumn = records.concat(records.slice(0, 4));
 expect(calculateSpotShiftScenario(dstAutumn, 2)).not.toBeNull();
});

test('day-specific live spot slider changes transparently and stays optional',async({page})=>{
 const {day,records}=mockSpotDay();
 await page.route('**/spot-prices/latest.json',route=>route.fulfill({
  status:200,contentType:'application/json',
  body:JSON.stringify({source:'Elpriset just nu.se',days:{[day]:{SE3:records}}}),
 }));
 await page.goto('/elavtal/?qa=1');
 const container=page.getByTestId('spot-shift-scenario');
 const reveal=container.getByRole('button',{name:/Vad händer om du flyttar el/i});
 await expect(reveal).toHaveAttribute('aria-expanded','false');
 await expect(container.getByTestId('spot-shift-result')).toHaveCount(0);
 await reveal.click();
 await expect(reveal).toHaveAttribute('aria-expanded','true');
 await expect(container.getByTestId('spot-shift-result')).toHaveText('2,00 kr');
 const input=container.getByRole('slider',{name:'Flyttad förbrukning'});
 await input.focus();
 await input.press('End');
 await expect(container.getByTestId('spot-shift-result')).toHaveText('10,00 kr');
 await input.press('Home');
 await expect(container.getByTestId('spot-shift-result')).toHaveText('0,00 kr');
 await expect(container).toContainText('Ingen prognos eller garanterad besparing.');
 await expect(container).toContainText('moms');
 await expect(container).toContainText('inte månad eller år');
 await reveal.click();
 await expect(reveal).toHaveAttribute('aria-expanded','false');
 await expect(container.getByTestId('spot-shift-result')).toHaveCount(0);
});

test('no shift-savings figure is shown if current spot data is absent',async({page})=>{
 await page.route('**/spot-prices/latest.json',route=>route.fulfill({
  status:200,contentType:'application/json',
  body:JSON.stringify({source:'Elpriset just nu.se',days:{}}),
 }));
 await page.goto('/elavtal/?qa=1');
 await expect(page.getByTestId('spot-shift-scenario')).toHaveCount(0);
 await expect(page.getByText('Priserna är inte tillgängliga just nu.')).toBeVisible();
});


for(const width of [360,390,430,1024,1440]){
 test('expanded shift scenario stays legible at '+width+'px',async({page})=>{
  const {day,records}=mockSpotDay();
  await page.setViewportSize({width,height:860});
  await page.route('**/spot-prices/latest.json',route=>route.fulfill({
   status:200,contentType:'application/json',
   body:JSON.stringify({source:'Elpriset just nu.se',days:{[day]:{SE3:records}}}),
  }));
  await page.goto('/elavtal/?qa=1');
  const container=page.getByTestId('spot-shift-scenario');
  await container.getByRole('button',{name:/Vad händer om du flyttar el/i}).click();
  await expect(container.getByTestId('spot-shift-result')).toHaveText('2,00 kr');
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/spot-shift-'+width+'.png',fullPage:true});
 });
}
