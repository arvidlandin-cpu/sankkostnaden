import {expect,test} from '@playwright/test';

const routes=[
 {path:'/bredband/',category:'bredband',help:'/bredband/vilken-hastighet-behover-jag/',compare:'#category-partners',understand:'/bredband/bredband-pa-min-adress/'},
 {path:'/elavtal/',category:'el',help:'/elavtal/vilket-elavtal-passar-mig/',compare:'#jamfor-elavtal',understand:'/elavtal/sa-laser-du-elfakturan/'},
 {path:'/mobil/',category:'mobil',help:'/mobil/hur-mycket-surf-behover-jag/',compare:'#category-partners',understand:'/mobil/familjeabonnemang/'},
 {path:'/forsakring/',category:'forsakring',help:'/forsakring/hemforsakring-skyddskoll/',compare:'#category-partners',understand:'/forsakring/hemforsakring-bostadsratt/'},
 {path:'/ekonomi/',category:'ekonomi',help:'/verktyg/hushallskostnadskollen/',compare:'#category-partners',understand:'/ekonomi/samlingslan/'},
] as const;

for(const route of routes){
 test('one purposeful interactive route for '+route.category,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(route.path+'?qa=1');
  const journey=page.getByTestId('category-journey-'+route.category);
  await expect(journey).toBeVisible();
  const result=journey.getByTestId('category-journey-result');
  const choices=journey.getByRole('group',{name:'Välj hur du vill gå vidare'});
  await expect(choices.getByRole('button',{name:/Jag vill få hjälp/})).toHaveAttribute('aria-pressed','true');
  await expect(result.locator('a')).toHaveAttribute('href',route.help);
  const compare=choices.getByRole('button',{name:/Jag vill jämföra/});
  await compare.click();
  await expect(compare).toHaveAttribute('aria-pressed','true');
  await expect(result.locator('a')).toHaveAttribute('href',route.compare);
  const learn=choices.getByRole('button',{name:/Jag vill förstå/});
  await learn.focus();
  await page.keyboard.press('Enter');
  await expect(learn).toHaveAttribute('aria-pressed','true');
  await expect(result.locator('a')).toHaveAttribute('href',route.understand);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sankkostnaden.se'+route.path);
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
 });
}
for(const width of [360,390,430,1024,1440]){
 test('category UX deck at '+width+'px is readable, visible and responsive',async({page})=>{
  await page.setViewportSize({width,height:width<500?844:900});
  await page.goto('/elavtal/?qa=1',{waitUntil:'networkidle'});
  const flow=page.getByTestId('category-journey-el');
  await expect(flow).toBeVisible();
  const buttons=flow.getByRole('button');
  await expect(buttons).toHaveCount(3);
  for(const btn of await buttons.all()){
   const dims=await btn.evaluate(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
   expect(dims.width).toBeGreaterThan(80);expect(dims.height).toBeGreaterThanOrEqual(44);
  }
  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:'test-results/screenshots/experience-p0-category-el-'+width+'.png',fullPage:true});
 });
}
