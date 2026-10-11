import {expect,test} from '@playwright/test';

const routes=[
 '/guide/sank-fasta-kostnader/',
 '/guide/arskoll-fasta-kostnader/',
 '/guide/hushallets-fasta-kostnader-2026/',
 '/guide/sank-kostnader-automatiskt/',
] as const;

for(const path of routes){
 test('guide checklist gives immediate real feedback '+path,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(path+'?qa=1');
  const board=page.getByTestId('interactive-checklist').first();
  await expect(board).toBeVisible();
  const first=board.getByRole('button').first();
  await expect(first).toHaveAttribute('aria-pressed','false');
  const progress=board.getByRole('progressbar');
  await expect(progress).toHaveAttribute('aria-valuenow','0');
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed','true');
  await expect(progress).toHaveAttribute('aria-valuenow','1');
  await first.focus();await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('aria-pressed','false');
  await expect(progress).toHaveAttribute('aria-valuenow','0');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se'+path);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
for(const width of [360,390,430,1024,1440]){
 test('checklist stays readable and has useful next step at '+width+'px',async({page})=>{
  await page.setViewportSize({width,height:width<=430?844:900});
  await page.goto('/guide/arskoll-fasta-kostnader/?qa=1',{waitUntil:'networkidle'});
  const board=page.getByTestId('interactive-checklist');
  await expect(board.getByRole('button')).toHaveCount(6);
  const mainCta=page.locator('.intentActions a.primary').first();
  await expect(mainCta).toBeVisible();
  expect(await mainCta.evaluate(el=>getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
  const next=board.getByRole('link',{name:/Räkna dina faktiska kostnader/});
  await expect(next).toHaveAttribute('href','/verktyg/hushallskostnadskollen/');
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/experience-p0-checklist-'+width+'.png',fullPage:true});
 });
}

test('annual checklist starts with the action rather than a second navy lecture',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/guide/arskoll-fasta-kostnader/?qa=1');
 const article=page.locator('article.article');
 await expect(article.locator('> [data-testid="interactive-checklist"]').first()).toBeVisible();
 expect(await article.locator('.decisionPanel').count()).toBe(0);
 const board=page.getByTestId('interactive-checklist');
 const primary=article.locator('.intentActions a.primary');
 const a=await board.boundingBox(),b=await primary.first().boundingBox();
 expect(a?.y||0).toBeLessThan(b?.y||0);
 await expect(board.getByRole('button')).toHaveCount(6);
});
