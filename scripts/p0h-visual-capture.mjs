import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.P0H_BASE_URL || 'http://127.0.0.1:3000';
const targets=[
 ['home','/'],['bredband','/bredband/'],['el','/elavtal/'],['mobil','/mobil/'],['forsakring','/forsakring/'],['ekonomi','/ekonomi/']
];
await fs.mkdir('p0h-visual-captures',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage']});
let bad=false;
for(const width of [390,1440,1920]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1080},deviceScaleFactor:1,reducedMotion:'reduce'});
 const page=await context.newPage();
 for(const [name,path] of targets){
  await page.goto(base+path+'?qa=1',{waitUntil:'domcontentloaded',timeout:30000});
  await page.locator('h1').first().waitFor({timeout:20000});
  const images=await page.evaluate(async()=>{
   const photos=[...document.querySelectorAll('main img[src*="pexels.com"]')];
   for(const image of photos.slice(0,2)){
    if(!image.complete){await Promise.race([image.decode().catch(()=>{}),new Promise(r=>setTimeout(r,9000))]);}
   }
   return photos.slice(0,4).map(img=>({src:img.getAttribute('src'),naturalWidth:img.naturalWidth}));
  });
  const data=await page.evaluate(()=>{
   const h1=document.querySelector('h1');
   const heroPhoto=document.querySelector('section[aria-label="Hitta rätt jämförelse"] img[src*="3875141"]');
   const main=document.querySelector('main');
   const box=(node)=>node?.getBoundingClientRect().toJSON();
   const bg=main?getComputedStyle(main).backgroundColor:'';
   return {viewport:document.documentElement.clientWidth,bodyScrollWidth:document.body.scrollWidth,documentScrollWidth:document.documentElement.scrollWidth,
    h1: h1?.textContent,headingFontSize:h1?getComputedStyle(h1).fontSize:null,
    heroPhoto:box(heroPhoto),main:box(main),background:bg,devicePixelRatio:window.devicePixelRatio};
  });
  const file='p0h-visual-captures/'+name+'-'+width+'px-'+(width===390?'mobile':'desktop')+'.jpg';
  // Full-page desktop and mobile allow checking visual hierarchy, not just one fold.
  await page.screenshot({path:file,type:'jpeg',quality:75,fullPage:true,timeout:50000,animations:'disabled'});
  const clean={name,width,file,...data,images};
  console.log('P0H_VISUAL '+JSON.stringify(clean));
  if(data.documentScrollWidth>data.viewport+1||data.bodyScrollWidth>data.viewport+1){console.error('P0H horizontal overflow',name,width);bad=true;}
  if(name==='home'&&(!data.heroPhoto||data.heroPhoto.width<(width===390?280:400))){console.error('P0H hero is miniature',width);bad=true;}
 }
 await context.close();
}
await browser.close();
if(bad)process.exitCode=1;
