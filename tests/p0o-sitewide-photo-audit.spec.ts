import { test, expect } from '@playwright/test';
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/**
 * P0O 2026-10-13 — complete SOURCE page-family photo census (not proof of
 * subjective customer acceptance). Inspect both desktop + mobile real Chromium
 * rendering, browser image HTTP requests, displayed originals and computed CSS
 * background images; flag duplicated hero layers and image delivery failures.
 *
 * This is a read-only QA test: qa=1, local static export, no fake GA4 visitors.
 */
const root = join(process.cwd(), 'pages');
function walk(dir:string):string[] {
 return readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  const absolute=join(dir,e.name);
  return e.isDirectory()?walk(absolute):[absolute];
 });
}
const routes=[...new Set(walk(root).filter(f=>f.endsWith('.tsx')).map(f=>
 relative(root,f).split(sep).join('/')).filter(f=>!f.startsWith('_')&&!f.startsWith('experiments/')&&!f.includes('['))
 .map(f=>'/'+f.replace(/\.tsx$/,'').replace(/(^|\/)index$/,'')).map(f=>f==='/'?'/':f.replace(/\/+$/,'')+'/'))].sort();
const captureRoutes = new Set([
 '/', '/bredband/','/elavtal/','/mobil/','/forsakring/','/ekonomi/',
 '/bredband/fiber/','/elavtal/rorligt-elpris/','/mobil/5g-abonnemang/',
 '/forsakring/jamfor-hemforsakring/','/ekonomi/samlingslan/',
 '/bredband/vilken-hastighet-behover-jag/','/mobil/hur-mycket-surf-behover-jag/',
 '/elavtal/vilket-elavtal-passar-mig/','/elavtal/kvartspris/',
 // P0Q source-proven legacy family: 16 shared #7019025 CSS-only image pages.
 // Capture only; preserve original DOM, canonical, affiliate markup and SEO cohorts.
 '/affiliate/','/bredband/basta-bredbandet/','/bredband/billigaste-bredbandet/','/bredband/bredband-pa-min-adress/','/cookies/','/elavtal/billigaste-elavtalet/','/elavtal/rorligt-fast-kvartspris/','/elavtal/sa-laser-du-elfakturan/','/guide/arskoll-fasta-kostnader/','/guide/hushallets-fasta-kostnader-2026/','/guide/sank-fasta-kostnader/','/guide/sank-kostnader-automatiskt/','/integritet/','/om/','/sa-jamfor-vi/','/verktyg/hushallskostnadskollen/'
]);
type ImageData={src:string;id:string;naturalWidth:number;displayWidth:number;currentSrc:string;loading:string;complete:boolean;alt:string;visible:boolean};
type BgData={name:string;id:string;background:string;hasImage:boolean;childImageId:string|null;bounds:{width:number;height:number}};
type RouteReport={route:string;width:number;h1:string;images:ImageData[];backgrounds:BgData[];imageRequests:string[];layeredDownloadIds:string[];missingEager:string[];overflow:number};
const idOf=(s:string)=>s.match(/(?:photos\/|pexels-photo-)(\d{5,9})/)?.[1]||'';

test('P0O complete image census and mobile/desktop representative photographic evidence', async({browser})=>{
 test.setTimeout(22*60*1000);
 const out='test-results/p0o-sitewide-image-evidence';
 mkdirSync(out,{recursive:true});
 const records:RouteReport[]=[];
 const errs:string[]=[];
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:920},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  const requests:string[]=[];
  page.on('request',req=>{const u=req.url();if(u.includes('images.pexels.com/photos/'))requests.push(u)});
  for(const route of routes){
   requests.length=0;
   try{
    const response=await page.goto(route+'?qa=1',{waitUntil:'domcontentloaded',timeout:25000});
    if(!response?.ok())throw new Error('HTTP '+response?.status());
    const pageDetails=await page.evaluate(()=>{
     const visible=(el:Element)=>{
      const rect=el.getBoundingClientRect();
      const cs=getComputedStyle(el);
      return rect.width>0&&rect.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity)>0;
     };
     const idOf=(s:string)=>s.match(/(?:photos\/|pexels-photo-)(\d{5,9})/)?.[1]||'';
     const imgs=[...document.querySelectorAll('img[src]')].filter(x=>x.getAttribute('src')?.includes('pexels')||x.getAttribute('src')?.includes('tibber')||x.getAttribute('src')?.includes('wikimedia')).map(node=>{
      const im=node as HTMLImageElement;const rect=im.getBoundingClientRect();
      return {src:im.src,id:idOf(im.currentSrc||im.src),naturalWidth:im.naturalWidth,displayWidth:Math.round(rect.width),currentSrc:im.currentSrc,loading:im.loading,complete:im.complete,alt:im.alt,visible:visible(im)};
     });
     const backgrounds=[...document.querySelectorAll('body *')].flatMap(node=>{
      const cs=getComputedStyle(node);const bg=cs.backgroundImage;
      if(!bg.includes('images.pexels.com/photos/'))return [];
      if(!visible(node))return [];
      const children=[...node.querySelectorAll('img[src*="pexels"]')] as HTMLImageElement[];
      const rect=node.getBoundingClientRect();
      return [{name:(node.getAttribute('class')||node.tagName).slice(0,95),id:idOf(bg),background:bg.slice(0,380),
       hasImage:children.length>0,childImageId:children.length?idOf(children[0].currentSrc||children[0].src):null,
       bounds:{width:Math.round(rect.width),height:Math.round(rect.height)}}];
     });
     return {h1:document.querySelector('h1')?.textContent?.trim().slice(0,130)||'',images:imgs,backgrounds,
      overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth};
    });
    // Check eager, image-backed hero photographs after the image request settles.
    const eager=page.locator('img[src*="pexels"][loading="eager"]');
    if(await eager.count()){
     await expect.poll(async()=>{
      const status=await eager.evaluateAll(imgs=>imgs.map(im=>({complete:(im as HTMLImageElement).complete,width:(im as HTMLImageElement).naturalWidth})));
      return status.every(v=>v.complete&&v.width>0);
     },{timeout:13000,intervals:[400,900,1600,2500]}).toBeTruthy().catch(()=>null);
    }
    // Re-evaluate eager image metadata to distinguish late deliveries.
    const delivered=await page.locator('img[src*="pexels"]').evaluateAll(imgs=>
     imgs.map(im=>({src:(im as HTMLImageElement).currentSrc||((im as HTMLImageElement).src),width:(im as HTMLImageElement).naturalWidth,complete:(im as HTMLImageElement).complete,loading:(im as HTMLImageElement).loading})));
    const missingEager=delivered.filter(im=>im.loading==='eager'&&(!im.width||!im.complete)).map(im=>im.src);
    for(const image of pageDetails.images){
     const now=delivered.find(z=>z.src===image.currentSrc||z.src===image.src);
     if(now){image.naturalWidth=now.width;image.complete=now.complete}
    }
    const requestedIds=[...new Set(requests.map(idOf).filter(Boolean))];
    const layeredDownloadIds=pageDetails.backgrounds.filter(bg=>bg.hasImage&&requestedIds.includes(bg.id)).map(bg=>bg.id);
    const record={route,width,...pageDetails,imageRequests:requestedIds,layeredDownloadIds,missingEager};
    records.push(record);
    if(pageDetails.overflow>1)errs.push(width+' '+route+' horizontal overflow '+pageDetails.overflow+'px');
    if(missingEager.length)errs.push(width+' '+route+' eager photo load missing '+missingEager.map(idOf).join(','));
    if(captureRoutes.has(route)){
      const safe=route==='/'?'home':route.replace(/\W+/g,'-').replace(/^-|-$/g,'');
      await page.screenshot({path:join(out,safe+'-'+width+'-firstscreen.jpeg'),type:'jpeg',quality:78,fullPage:false,animations:'disabled'});
      await page.screenshot({path:join(out,safe+'-'+width+'-fullpage.jpeg'),type:'jpeg',quality:64,fullPage:true,animations:'disabled'});
    }
   }catch(error){
    errs.push(width+' '+route+' '+String(error).slice(0,240));
    console.error('P0O_ROUTE_EXCEPTION '+JSON.stringify({route,width,error:String(error).slice(0,240)}));
   }
  }
  await context.close();
 }
 const allIds=[...new Set(records.flatMap(x=>[...x.images.map(i=>i.id),...x.backgrounds.map(i=>i.id)]).filter(Boolean))].sort();
 const used:Record<string,string[]>={};
 for(const row of records)for(const id of [...new Set([...row.images.map(i=>i.id),...row.backgrounds.map(i=>i.id)].filter(Boolean))]){
  (used[id]??=[]).push(row.route+' '+row.width);
 }
 const repeatedHero=records.filter(r=>r.backgrounds.some(bg=>bg.hasImage));
 const actuallyRequestedLayer=records.filter(r=>r.layeredDownloadIds.length>0);
 const summary={date:'2026-10-13',source:'current GitHub built static site, local browser with real remote Pexels',sourceRouteCount:routes.length,viewportCount:2,
   routeWidthChecks:records.length,expectedRouteWidthChecks:routes.length*2,uniqueImageIds:allIds,
   imageReferencesById:used,distinctPhotographicSurfaces:records.reduce((a,r)=>a+r.images.length+r.backgrounds.length,0),
   cssBackgroundUnderRealImage:repeatedHero.map(r=>({route:r.route,width:r.width,backgrounds:r.backgrounds.filter(bg=>bg.hasImage)})),
   networkRequestedCssBackgroundUnderRealImage:actuallyRequestedLayer.map(r=>({route:r.route,width:r.width,ids:r.layeredDownloadIds})),
   errors:errs,selectedVisualSampleRoutes:[...captureRoutes]};
 writeFileSync(join(out,'sitewide-photo-manifest.json'),JSON.stringify({summary,records},null,2)+'\n');
 console.log('P0O_IMAGE_AUDIT_SUMMARY '+JSON.stringify({...summary,imageReferencesById:undefined,cssBackgroundUnderRealImage:summary.cssBackgroundUnderRealImage.slice(0,18),
   networkRequestedCssBackgroundUnderRealImage:summary.networkRequestedCssBackgroundUnderRealImage.slice(0,18),errors:errs.slice(0,35)}));
 console.log('P0O_IMAGE_ID_REUSE '+JSON.stringify(used));
 if(records.length<routes.length*2)throw new Error('Not all page/viewport pairs reached: '+records.length+'/'+routes.length*2);
 if(errs.length)throw new Error('Actual image delivery/overflow issues: '+errs.slice(0,12).join('; '));
});