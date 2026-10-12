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
  // Full-page browser screenshots are not proof of image quality unless
  // the off-screen responsive images have finished loading. Force each card
  // into the viewport and wait for actual decoded pixels before capture.
  const photos=page.locator('main img[src*="pexels.com"]');
  for(const photo of await photos.all()){
    await photo.scrollIntoViewIfNeeded();
    await photo.evaluate(async(node)=>{const img=node;if(!img.complete||img.naturalWidth===0)await Promise.race([img.decode().catch(()=>{}),new Promise(r=>setTimeout(r,18000))]);});
  }
  const hero=page.locator('[data-testid^="p0h-hero-photo-"]').first();
  if(await hero.count()) {
    await hero.scrollIntoViewIfNeeded();
    await hero.evaluate(async(node)=>{const img=node;if(!img.complete||img.naturalWidth===0)await Promise.race([img.decode().catch(()=>{}),new Promise(r=>setTimeout(r,18000))]);});
  }
  // Give large remote CSS background images the same readiness guarantee.
  const sections=page.locator('[class*="CategorySpotlight_visual__"]');
  for(const visual of await sections.all()){
    const url=await visual.evaluate(node=>{
      const value=getComputedStyle(node).backgroundImage;
      const start=value.indexOf('https://images.pexels.com/');
      if(start<0)return null;
      const end=value.indexOf('"',start);
      return value.slice(start,end>start?end:undefined);
    });
    if(url) await page.evaluate(async u=>await Promise.race([new Promise(r=>{const i=new Image();i.onload=()=>r(true);i.onerror=()=>r(false);i.src=u}),new Promise(r=>setTimeout(()=>r(false),18000))]),url);
  }
  await page.evaluate(()=>scrollTo({top:0,left:0,behavior:'instant'}));
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
