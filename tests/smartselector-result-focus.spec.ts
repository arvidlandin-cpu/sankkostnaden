import {test,expect} from '@playwright/test';

for(const width of [360,390,430]){
 test('Need profile and disclosed next step stay in view; retry and back preserve focus at '+width,async({page,context,baseURL})=>{
  const origin=new URL(baseURL||'https://sankkostnaden.se').origin;
  await context.route('**/*',route=>route.request().isNavigationRequest()&&new URL(route.request().url()).origin!==origin?route.abort():route.continue());
  await page.setViewportSize({width,height:844});
  await page.goto('/bredband/vilken-hastighet-behover-jag/?qa=1',{waitUntil:'domcontentloaded'});
  const question=page.getByTestId('smartselector-active-question');
  const firstHeading=question.getByRole('heading',{level:2});
  await expect(firstHeading).not.toBeFocused();
  const title=await firstHeading.innerText();
  await question.getByRole('button').first().click();
  await page.getByRole('button',{name:'Föregående',exact:true}).click();
  await expect(firstHeading).toHaveText(title);
  await expect(firstHeading).toBeFocused();
  await question.getByRole('button').first().click();
  await question.getByRole('button',{name:'Vet inte – hoppa över',exact:true}).click();
  await question.getByRole('button').first().click();
  const result=page.getByTestId('smartselector-result');
  const heading=result.getByTestId('smartselector-result-heading');
  await expect(heading).toBeFocused();
  await expect(result).toContainText('Du hoppade över 1 fråga');
  const partner=result.locator('a[data-placement="smart_selector_result"]');
  await expect(partner).toHaveAttribute('rel',/sponsored/);
  await expect(partner).toHaveAttribute('data-partner','Bredbandsval.se');
  await expect(result.getByText('Annons · Vi kan få ersättning via partnerlänken.',{exact:true})).toBeVisible();
  for(const target of [heading,partner]){
   const rect=await target.boundingBox();
   expect(rect).not.toBeNull();
   expect(rect!.y).toBeGreaterThanOrEqual(0);
   expect(rect!.y+rect!.height).toBeLessThanOrEqual(844);
  }
  await page.keyboard.press('Tab');
  await expect(partner).toBeFocused();
  await page.getByRole('button',{name:'Ändra senaste svaret',exact:true}).click();
  await expect(firstHeading).toBeFocused();
  await question.getByRole('button').first().click();
  await expect(heading).toBeFocused();
  await page.getByRole('button',{name:'Gör om snabbkollen',exact:true}).click();
  await expect(firstHeading).toHaveText(title);
  await expect(firstHeading).toBeFocused();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
  await expect(partner).toHaveCount(0);
 });
}
