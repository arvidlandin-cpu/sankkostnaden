test('homepage keeps a single editorial footer while inner pages get the global trust footer',async({page})=>{
  await page.goto('/');
  await expect(page.locator('footer')).toHaveCount(1);
  await expect(page.locator('footer.siteFooter')).toHaveCount(0);

  await page.goto('/forsakring/hemforsakring-bostadsratt/');
  await expect(page.locator('footer.siteFooter')).toHaveCount(1);
});

import { expect, test } from '@playwright/test';

test('income protection separates insured ceiling from actual compensation and links original terms',async({page,request})=>{
  const route='/forsakring/trygghetsforsakring/';
  const response=await request.get(route+'?qa=1');
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain('90 procent av den nettolön du förlorar');
  await page.goto(route+'?qa=1');
  const explanation=page.getByTestId('hedvig-income-example').locator('> p').filter({hasText:'Försäkringsbeloppet är ett tak'});
  await expect(explanation).toBeVisible();
  await expect(explanation).toContainText('faktiska fasta utgifter');
  await expect(explanation).toContainText('sjukskrivningsgrad');
  await expect(explanation).toContainText('motsvarande försäkringar hos andra bolag');
  const terms=explanation.getByRole('link',{name:/Hedvigs fullständiga villkor/});
  await expect(terms).toHaveAttribute('href',/^https:\/\/gateway\.hedvig\.com\/external-insurance-documents\/.*TERMS_AND_CONDITIONS.*\.pdf$/);
  expect((await terms.getAttribute('rel'))||'').not.toContain('sponsored');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://sankkostnaden.se'+route);
  const partner=page.locator('#hedvig-trygghet a[data-partner=Hedvig]');
  await expect(partner).toHaveAttribute('rel',/sponsored/);
  await expect(partner).toHaveAttribute('data-intent','income-protection');
  // Inspect source and attribution only; never navigate to the real partner.
});

test('site-wide trust footer exposes method and commercial transparency',async({page})=>{
  await page.goto('/forsakring/hemforsakring-bostadsratt/');
  const footer=page.locator('footer.siteFooter');
  await expect(footer).toBeVisible();
  await expect(footer.getByRole('link',{name:'Så jämför vi'})).toHaveAttribute('href','/sa-jamfor-vi/');
  await expect(footer.getByRole('link',{name:'Affiliateinformation'})).toHaveAttribute('href','/affiliate/');
  await expect(footer.getByRole('link',{name:'Om sajten'})).toHaveAttribute('href','/om/');
  await expect(footer.getByRole('link',{name:'Kontakt'})).toHaveAttribute('href','mailto:kontakt@sankkostnaden.se');
});

test('priority insurance pages keep canonicals and expose protection check',async({page})=>{
  for(const route of [
    {path:'/forsakring/hemforsakring-hyresratt/',canonical:'https://sankkostnaden.se/forsakring/hemforsakring-hyresratt/'},
    {path:'/forsakring/vad-kostar-hemforsakring/',canonical:'https://sankkostnaden.se/forsakring/vad-kostar-hemforsakring/'},
    {path:'/forsakring/jamfor-hemforsakring/',canonical:'https://sankkostnaden.se/forsakring/jamfor-hemforsakring/'},
  ]){
    await page.goto(route.path);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',route.canonical);
    await expect(page.getByRole('link',{name:/Gör skyddskollen/i}).first()).toHaveAttribute('href','/forsakring/hemforsakring-skyddskoll/');
  }
});

test('existing bostadsrätt SEO flow remains intact',async({page})=>{
  await page.goto('/forsakring/hemforsakring-bostadsratt/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/');
  await expect(page.getByRole('heading',{level:1,name:'Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Behöver jag bostadsrättstillägg?'})).toBeVisible();
});

for(const viewport of [{width:360,height:800},{width:390,height:844},{width:430,height:932}]){
  test('trust footer and insurance paths have no horizontal overflow @ '+viewport.width+'px',async({page})=>{
    await page.setViewportSize(viewport);
    await page.goto('/forsakring/vad-kostar-hemforsakring/');
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}


// A definition search must get decision help before the explicitly branded example.
test('trygghet definition is server-rendered and distinguishes four kinds of protection',async({page,request})=>{
  const route='/forsakring/trygghetsforsakring/';
  const response=await request.get(route+'?qa=1');
  expect(response.status()).toBe(200);
  const html=await response.text();
  expect(html.match(/<h1\b/g)||[]).toHaveLength(1);
  expect(html).toContain('Vad är en trygghetsförsäkring?');
  expect(html).toContain('Trygghetsförsäkring vid arbetsskada (TFA)');
  expect(html).toContain('Exempel: Hedvig Trygghetsförsäkring');
  await page.goto(route+'?qa=1');
  await expect(page.locator('h1')).toHaveText('Vad är en trygghetsförsäkring?');
  await expect(page).toHaveTitle('Vad är en trygghetsförsäkring? Skydd och villkor 2026 | Sänk Kostnaden');
  await expect(page.locator('meta[name=description]')).toHaveAttribute('content','Vad betyder trygghetsförsäkring? Jämför skydd för fasta kostnader med inkomstförsäkring, låneskydd och TFA. Se ett tydligt märkt exempel från Hedvig.');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://sankkostnaden.se'+route);
  const comparison=page.getByTestId('trygghet-cover-types');
  await expect(comparison.locator('dt')).toHaveText([
    'Skydd för fasta kostnader','Inkomstförsäkring','Låneskydd och betalskydd','Trygghetsförsäkring vid arbetsskada (TFA)',
  ]);
  const income=comparison.locator('[data-cover-type=income]');
  await expect(income).toContainText('arbetslöshet eller sjukskrivning, beroende på produkt');
  await expect(income.getByRole('link')).toHaveAttribute('href','https://www.konsumenternas.se/forsakringar/personforsakringar/inkomstforsakringar/');
  await expect(comparison.locator('[data-cover-type=loan]').getByRole('link')).toHaveAttribute('href','https://konsumenternasbankochfinansbyra.se/lan--betalningar/lan/laneskydd');
  const work=comparison.locator('[data-cover-type=work-injury]');
  await expect(work).toContainText('kan finnas genom jobbet');
  await expect(work.getByRole('link')).toHaveAttribute('href','https://www.afaforsakring.se/forsakring/arbetsskadeforsakring');
  for(const link of await comparison.locator('a').all()){
    expect((await link.getAttribute('rel'))||'').not.toContain('sponsored');
    expect(await link.getAttribute('data-partner')).toBeNull();
  }
  const notice=page.getByTestId('trygghet-commercial-notice');
  await expect(notice).toContainText('kan få ersättning');
  expect(await notice.evaluate(node=>Boolean(node.compareDocumentPosition(document.querySelector('[data-testid="trygghet-cover-types"]')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  expect(await comparison.evaluate(node=>Boolean(node.compareDocumentPosition(document.querySelector('[data-testid="hedvig-income-example"]')!)&Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
});

test('trygghet product figures stay scoped to the labelled Hedvig example and original sponsored route',async({page})=>{
  await page.goto('/forsakring/trygghetsforsakring/?qa=1');
  const comparison=page.getByTestId('trygghet-cover-types');
  const product=page.getByTestId('hedvig-income-example');
  await expect(product.getByRole('heading',{name:'Exempel: Hedvig Trygghetsförsäkring',exact:true})).toBeVisible();
  await expect(comparison).not.toContainText('6 000');
  await expect(comparison).not.toContainText('12 000');
  await expect(comparison).not.toContainText('90 procent');
  await expect(product).toContainText('6 000 eller 12 000 kr per månad');
  await expect(product).toContainText('Skattefri ersättning i upp till 12 månader');
  await expect(product).toContainText('90 procent av den nettolön du förlorar');
  await expect(product).toContainText('inte alla försäkringar som kallas trygghetsförsäkring');
  const partner=product.locator('a[rel~=sponsored]');
  await expect(partner).toHaveCount(1);
  await expect(partner).toHaveAttribute('target','_blank');
  await expect(partner).toHaveAttribute('rel','sponsored nofollow noopener');
  await expect(partner).toHaveAttribute('data-partner','Hedvig');
  await expect(partner).toHaveAttribute('data-category','forsakring');
  await expect(partner).toHaveAttribute('data-intent','income-protection');
  await expect(partner).toHaveAttribute('data-placement','income_protection_guide');
  await expect(partner).toHaveAttribute('data-partner-position','1');
  await expect(partner).toHaveAttribute('href',/^https:\/\//);
  // The internal next step is usable without generating a genuine partner click.
  await comparison.getByRole('link',{name:'Se Hedvig-exemplet nedan',exact:true}).click();
  await expect(page).toHaveURL(/#hedvig-product-example$/);
  await expect(product).toBeInViewport();
});

for(const width of [360,390,430,1024,1440,1920]){
  test('trygghet definition and provider example remain readable at '+width+'px',async({page},info)=>{
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.setViewportSize({width,height:1000});
    await page.goto('/forsakring/trygghetsforsakring/?qa=1');
    await expect(page.getByRole('heading',{level:1})).toHaveText('Vad är en trygghetsförsäkring?');
    await expect(page.getByTestId('trygghet-cover-types')).toBeVisible();
    await expect(page.getByTestId('hedvig-income-example')).toBeVisible();
    expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
    await page.screenshot({path:`test-results/screenshots/trygghet-definition-${width}-${info.project.name}.png`,fullPage:true});
  });
}
