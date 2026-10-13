import {test,expect} from '@playwright/test';

const pages=[
 {url:'/bredband/vilken-hastighet-behover-jag/',photo:'4008771',steps:3,area:'bredband'},
 {url:'/mobil/hur-mycket-surf-behover-jag/',photo:'4254149',steps:3,area:'mobil'},
 {url:'/elavtal/vilket-elavtal-passar-mig/',photo:'8055828',steps:5,area:'el'}
] as const;

for(const width of [390,1440]){
 for(const model of pages){
  test('P0K one question at a time '+model.area+' '+width+'px',async({page},info)=>{
   await page.setViewportSize({width,height:width===390?844:960});
   await page.goto(model.url+'?qa=1',{waitUntil:'domcontentloaded'});
   const flow=page.getByTestId('smartselector-flow');
   await expect(flow.getByRole('heading',{level:1})).toBeVisible();
   const photo=flow.getByTestId('smartselector-hero-photo');
   await expect(photo).toBeVisible();
   await expect(photo).toHaveAttribute('alt','');
   await expect(photo).toHaveAttribute('src',new RegExp(model.photo));
   await expect.poll(()=>photo.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>=(width===390?360:700)),{timeout:25000}).toBeTruthy();
   const progress=flow.getByRole('progressbar');
   await expect(progress).toHaveAttribute('aria-valuenow','0');
   const first=flow.getByTestId('smartselector-active-question');
   await expect(first).toHaveCount(1);
   const heading=await first.getByRole('heading',{level:2}).textContent();
   await first.getByRole('button').first().click();
   await expect(progress).toHaveAttribute('aria-valuenow','1');
   await flow.getByRole('button',{name:'Föregående'}).click();
   await expect(first.getByRole('heading',{level:2})).toHaveText(heading||'');
   await expect(first.getByRole('button').first()).toHaveAttribute('aria-pressed','true');
   await first.getByRole('button').first().click();
   await expect(progress).toHaveAttribute('aria-valuenow','1');
   await first.getByRole('button',{name:/Vet inte – hoppa över/}).click();
   await expect(progress).toHaveAttribute('aria-valuenow','2');
   for(let i=2;i<model.steps;i++){await first.getByRole('button').first().click();}
   await expect(flow.getByTestId('smartselector-finished')).toBeVisible();
   await expect(progress).toHaveAttribute('aria-valuenow',String(model.steps));
   await expect(flow.getByTestId('smartselector-result')).toContainText('ungefärlig');
   await expect(flow.getByTestId('smartselector-result').getByRole('link')).not.toHaveCount(0);
   await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href',new RegExp(model.url.replaceAll('/','\\/')));
   if(model.area==='el'||model.area==='bredband'){
     const direct=flow.locator('a[data-placement="smart_selector_result"]');
     await expect(direct).toBeVisible();
     await expect(direct).toHaveAttribute('rel',/sponsored/);
     await expect(direct).toHaveAttribute('href',/^https?:\/\//);
   }
   const overflow=await page.evaluate(()=>Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-document.documentElement.clientWidth);
   expect(overflow).toBeLessThanOrEqual(1);
   await page.screenshot({path:`test-results/screenshots/p0k-${model.area}-${width}-result-${info.project.name}.png`,fullPage:true});
   await flow.getByRole('button',{name:/Gör om snabbkollen/}).click();
   await expect(progress).toHaveAttribute('aria-valuenow','0');
   await expect(flow.getByTestId('smartselector-active-question')).toBeVisible();
   await expect(flow.getByTestId('smartselector-finished')).toHaveCount(0);
  });
 }
}

test('P0K skipping everything does not fabricate a personalized needs profile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/mobil/hur-mycket-surf-behover-jag/?qa=1');
 const flow=page.getByTestId('smartselector-flow');
 for(let i=0;i<3;i++)await flow.getByRole('button',{name:/Vet inte – hoppa över/}).click();
 const result=flow.getByTestId('smartselector-result');
 await expect(result).toContainText('INGA SVAR ANGIVNA');
 await expect(result).not.toContainText('Du behöver sannolikt inte fri surf');
 await expect(result.getByRole('link',{name:/Se jämförelsealternativ/})).toHaveAttribute('href','/mobil/');
 await expect(flow.locator('a[data-placement="smart_selector_result"]')).toHaveCount(0);
});

test('P0K comparison route is available before any optional need answers',async({page})=>{
 await page.goto('/bredband/vilken-hastighet-behover-jag/?qa=1');
 const flow=page.getByTestId('smartselector-flow');
 await expect(flow.getByRole('link',{name:/Jag vill jämföra direkt/})).toHaveAttribute('href','/bredband/');
 await expect(flow.getByTestId('smartselector-active-question').getByRole('button')).toHaveCount(5);
});
