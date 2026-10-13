import {test,expect} from '@playwright/test';

/**
 * P0H acceptance: true CSS viewports at normal browser zoom, not a 25% desktop
 * zoom masquerading as poor CSS. Human imagery is illustrative, never proof of
 * actual customer satisfaction or a saving claim.
 */
const routes=[
  {url:'/bredband/',category:'bredband'},
  {url:'/elavtal/',category:'el'},
  {url:'/mobil/',category:'mobil'},
  {url:'/forsakring/',category:'forsakring'},
  {url:'/ekonomi/',category:'ekonomi'}
] as const;

for(const width of [360,390,430,1024,1440,1920]){
 test('P0H warm home editorial is legible and not a miniature canvas at '+width+'px',async({page},testInfo)=>{
  await page.setViewportSize({width,height:width<500?844:950});
  await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
  const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
  await expect(hero.getByRole('heading',{level:1,name:/Sänk dina fasta kostnader/})).toBeVisible();
  const photo=hero.locator('img[src*="39997379"]');
  await expect(photo).toBeVisible();
  const picture=await photo.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,naturalWidth:(el as HTMLImageElement).naturalWidth}));
  expect(picture.width).toBeGreaterThan(width<500?280:width<850?500:400);
  expect(picture.height).toBeGreaterThan(width<500?250:width<850?390:470);
  const homeWidth=await hero.locator('[class*=inner]').evaluate(el=>el.getBoundingClientRect().width);
  expect(homeWidth/width).toBeGreaterThan(width>=1440?.74:.85);
  await expect(hero.getByTestId('home-decision-explorer')).toBeVisible();
  // P0N: bottom category dock supplies direct category navigation on phones;
  // only one filled-blue primary action competes on the opening mobile view.
  if(width<=700){
   await expect(page.locator('header a[href="#jamfor"]')).toBeHidden();
   await expect(hero.locator('a[href="/#jamfor"]')).toBeHidden();
   await expect(hero.locator('a[href="/app/"]')).toBeVisible();
   await expect(page.locator('nav[aria-label="Snabbnavigering"]')).toBeVisible();
  }else{
   await expect(page.locator('header a[href="#jamfor"]')).toBeVisible();
   await expect(hero.locator('a[href="/#jamfor"]')).toBeVisible();
  }
  if(width>=1440){
   const firstUse=await hero.locator('#startval').boundingBox();
   expect(firstUse).not.toBeNull();
   expect(firstUse!.y).toBeLessThan(950); // 100% browser viewport, first real choice starts on screen
  }
  const cats=page.locator('#jamfor');
  await expect(cats.getByRole('link')).toHaveCount(5);
  for(const image of await cats.locator('img').all())await expect(image).toHaveAttribute('srcset',/1800w/);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/p0h-warm-home-'+testInfo.project.name+'-'+width+'.png',fullPage:true});
 });
}

test('P0H desktop warm family hero actually loads at readable source resolution',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/?qa=1',{waitUntil:'domcontentloaded'});
 const img=page.locator('section[aria-label="Hitta rätt jämförelse"] img[src*="39997379"]');
 await expect.poll(()=>img.evaluate((node:HTMLImageElement)=>{
  const chosen=Number(new URL(node.currentSrc).searchParams.get('w'))||0;
  return node.complete&&node.naturalWidth>0&&chosen>=node.getBoundingClientRect().width*window.devicePixelRatio*.95;
 }),{timeout:20000}).toBeTruthy();
 const url=await img.getAttribute('src');
 expect(url).toContain('images.pexels.com/photos/39997379');
});

for(const width of [390,1440]){
 for(const route of routes){
  test('P0H warm category landing '+route.category+' at '+width+'px',async({page},info)=>{
   await page.setViewportSize({width,height:width===390?844:950});
   await page.goto(route.url+'?qa=1',{waitUntil:'domcontentloaded'});
   const hero=page.locator('section.guideHero');
   const image=hero.locator('[class*=heroArtwork]');
   const bg=await image.evaluate(el=>getComputedStyle(el).backgroundImage);
   expect(bg).toContain('images.pexels.com/photos/');
   const rect=await image.boundingBox();
   const source=hero.getByTestId('p0h-hero-photo-'+route.category);
   await expect(source).toBeVisible();
   await expect.poll(()=>source.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>0),{timeout:18000}).toBeTruthy();
   expect(rect).not.toBeNull();
   expect(rect!.height).toBeGreaterThan(width===390?160:480);
   if(width===1440){
    const journey=await page.getByTestId('category-journey-'+route.category).boundingBox();
    expect(journey).not.toBeNull();
    expect(journey!.y).toBeLessThan(950); // choices emerge in first normal-zoom viewport
   }
   const insight=page.getByTestId('p0g-insight-'+route.category);
   await expect(insight).toBeVisible();
   if(route.category!=='el'){
    const featurePhoto=await insight.locator('[class*=visual]').first().evaluate(el=>getComputedStyle(el).backgroundImage);
    expect(featurePhoto).toMatch(/images\.pexels\.com/);
   }else{
    const tibber=insight.locator('a[data-placement="electricity_insight_tibber"]');
    await expect(tibber).toHaveAttribute('rel',/sponsored/);
    await expect(insight.getByText('VERKLIGA SPOTPRISER',{exact:false})).toBeVisible();
   }
   const options=insight.locator('[role="group"][aria-label="Välj situation"] button');
   await expect(options).toHaveCount(2);
   await options.last().click();
   await expect(options.last()).toHaveAttribute('aria-pressed','true');
   expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
   await page.screenshot({path:'test-results/screenshots/p0h-warm-'+route.category+'-'+info.project.name+'-'+width+'.png',fullPage:true});
  });
 }
}

test('P0H new photos are not represented as testimonials or fabricated outcomes',async({page})=>{
 await page.goto('/?qa=1');
 const hero=page.locator('section[aria-label="Hitta rätt jämförelse"]');
 await expect(hero.getByRole('heading',{level:1,name:/Sänk dina fasta kostnader/})).toBeVisible();
 await expect(hero.locator('img[src*="39997379"]')).toHaveAttribute('alt','');
 const claims=await hero.textContent();
 expect(claims).not.toMatch(/\d+[.,]?\d*\s?%\s?bespar|våra kunder sparar|garanterad bespar/i);
});
