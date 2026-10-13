/**
 * P0K source-vs-live real-browser evidence: actual 390px and 1440px
 * first view plus completed result, not generative design mockups.
 */
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const source=process.env.P0K_SOURCE_URL||'http://127.0.0.1:3000';
const cases=[
 {key:'bredband',path:'/bredband/vilken-hastighet-behover-jag/',steps:3},
 {key:'mobil',path:'/mobil/hur-mycket-surf-behover-jag/',steps:3},
 {key:'el',path:'/elavtal/vilket-elavtal-passar-mig/',steps:5}
];
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
await fs.mkdir('p0k-visual-compare',{recursive:true});
let problems=0;
for(const width of [390,1440]){
 for(const [kind,host] of [['before-live','https://sankkostnaden.se'],['after-source',source]]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:960},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const check of cases){
   try{
    const response=await page.goto(host+check.path+'?qa=1',{waitUntil:'domcontentloaded',timeout:35000});
    if(!response?.ok())throw Error('HTTP '+response?.status());
    await page.locator('h1').waitFor({timeout:16000});
    if(kind==='after-source'){
     const photo=page.getByTestId('smartselector-hero-photo');
     await photo.waitFor({timeout:18000});
     await photo.evaluate(async(n)=>{if(!n.complete||!n.naturalWidth)await Promise.race([n.decode().catch(()=>{}),new Promise(r=>setTimeout(r,12000))]);});
    }
    const initial=await page.evaluate(()=>{
     const main=document.querySelector('main');
     const hero=main?.querySelector('h1');
     const image=main?.querySelector('img[data-testid="smartselector-hero-photo"]');
     return {h1:hero?.textContent,heroFont:hero?getComputedStyle(hero).fontSize:null,progressive:!!main?.querySelector('[data-testid="smartselector-active-question"]'),
      imageWidth:image?.naturalWidth||0,visibleOptions:main?.querySelector('[data-testid="smartselector-active-question"]')?.querySelectorAll('button[aria-pressed]').length||0,
      overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth};
    });
    if(kind==='after-source'&&(!initial.progressive||initial.imageWidth<width-20||initial.visibleOptions<4||initial.overflow>1))problems++;
    console.log('P0K_BEFORE_AFTER '+JSON.stringify({width,kind,...check,initial}));
    await page.screenshot({path:`p0k-visual-compare/${check.key}-${width}-${kind}-first.jpg`,fullPage:true,type:'jpeg',quality:76,animations:'disabled',timeout:45000});
    if(kind==='after-source'){
     const question=page.getByTestId('smartselector-active-question');
     for(let i=0;i<check.steps;i++){await question.getByRole('button').first().click();}
     await page.getByTestId('smartselector-finished').waitFor();
     const state=await page.evaluate(()=>({
      steps:document.querySelector('[role="progressbar"]')?.getAttribute('aria-valuenow'),
      result:document.querySelector('[data-testid="smartselector-result"] h2')?.textContent,
      sponsored:document.querySelectorAll('main a[rel*="sponsored"]').length,
      overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth
     }));
     if(state.steps!==String(check.steps)||state.overflow>1)problems++;
     console.log('P0K_FINISHED '+JSON.stringify({width,...check,...state}));
     await page.screenshot({path:`p0k-visual-compare/${check.key}-${width}-after-source-result.jpg`,fullPage:true,type:'jpeg',quality:76,animations:'disabled',timeout:45000});
    }
   }catch(err){console.error('P0K_CAPTURE_FAILED '+JSON.stringify({width,kind,check,error:String(err)}));if(kind==='after-source')problems++;}
  }
  await context.close();
 }
}
await browser.close();
console.log('P0K_VISUAL_QA_ERRORS '+problems);
if(problems)process.exitCode=1;
