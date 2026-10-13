/**
 * P0J editorial guide comparison at normal Chromium CSS pixel viewports.
 * READ ONLY: captures public baseline and source-matched local branch.
 * No partner links clicked, no cookies, no analytics or live writes.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const target=process.env.P0J_SOURCE_URL||'http://127.0.0.1:3000';
const baseline='https://sankkostnaden.se';
const routes=[
 ['bredband','/bredband/fiber/'],
 ['el','/elavtal/rorligt-elpris/'],
 ['mobil','/mobil/5g-abonnemang/'],
 ['forsakring','/forsakring/jamfor-hemforsakring/'],
 ['ekonomi','/ekonomi/samlingslan/'],
 ['kvartspris-unchanged','/elavtal/kvartspris/']
];
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
await fs.mkdir('p0j-visual-compare',{recursive:true});
let problems=0;
for(const width of [390,1440]){
 for(const [kind,root] of [['before-live',baseline],['after-source',target]]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:960},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const [key,route] of routes){
   try{
    const response=await page.goto(root+route+'?qa=1',{waitUntil:'domcontentloaded',timeout:35000});
    if(!response?.ok())throw Error('HTTP '+response?.status());
    await page.locator('h1').first().waitFor({timeout:16000});
    const images=page.locator('main img[src*="images.pexels.com"]');
    for(const img of await images.all()){
     await img.scrollIntoViewIfNeeded();
     await img.evaluate(async(node)=>{
      if(!node.complete||node.naturalWidth===0)
       await Promise.race([node.decode().catch(()=>{}),new Promise(r=>setTimeout(r,11000))]);
     });
    }
    await page.evaluate(()=>scrollTo({top:0,left:0,behavior:'instant'}));
    const data=await page.evaluate(()=>{
     const h=document.querySelector('main h1');
     const hero=document.querySelector('[data-testid="editorial-guide-hero"]');
     const photos=[...document.querySelectorAll('main img[src*="images.pexels.com"]')].slice(0,3);
     const image=(node)=>node?{width:Math.round(node.getBoundingClientRect().width),height:Math.round(node.getBoundingClientRect().height)}:null;
     return {h1:h?.textContent,headingPx:h?getComputedStyle(h).fontSize:null,
      editorial:Boolean(hero),hero:image(hero),
      photos:photos.map(n=>({src:n.getAttribute('src'),naturalWidth:n.naturalWidth,rect:image(n)})),
      summary:!!document.querySelector('#guide-summary'),
      firstAction:document.querySelector('main a[href="#guide-partners"]')?.textContent?.trim()||'none',
      overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth};
    });
    if(kind==='after-source'&&key!=='kvartspris-unchanged'&&(!data.editorial||data.overflow>1||!data.photos.some(x=>x.naturalWidth>0))){problems++;}
    if(kind==='after-source'&&key==='kvartspris-unchanged'&&(data.editorial||data.summary))problems++;
    console.log('P0J_PAGE '+JSON.stringify({width,kind,key,route,...data}));
    await page.screenshot({path:`p0j-visual-compare/${key}-${width}-${kind}.jpg`,fullPage:true,type:'jpeg',quality:75,animations:'disabled',timeout:55000});
   }catch(e){
    console.error('P0J_SCREENSHOT_FAILED',width,kind,key,String(e));
    if(kind==='after-source')problems++;
   }
  }
  await context.close();
 }
}
await browser.close();
console.log('P0J_QA_VISUAL_ERRORS '+problems);
if(problems)process.exitCode=1;
