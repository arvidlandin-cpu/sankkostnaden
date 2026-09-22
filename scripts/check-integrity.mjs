import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const pagesDir=path.join(root,'pages');
const sitemapPath=path.join(root,'public','sitemap.xml');
const robotsPath=path.join(root,'public','robots.txt');
const partnersPath=path.join(root,'lib','partners.ts');
const appPath=path.join(root,'pages','_app.tsx');

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    const full=path.join(dir,e.name);
    return e.isDirectory()?walk(full):[full];
  });
}
function routeFor(file){
  const rel=path.relative(pagesDir,file).replace(/\\/g,'/');
  if(rel.startsWith('_')) return null;
  let route='/'+rel.replace(/\.(tsx|ts|jsx|js)$/,'').replace(/\/index$/,'');
  return route==='/'?'/':route.replace(/\/$/,'');
}
function canonicalFor(route){
  return 'https://sankkostnaden.se'+(route==='/'?'/':route+'/');
}

const errors=[];
const pageFiles=walk(pagesDir).filter(f=>/\.(tsx|ts|jsx|js)$/.test(f)&&!path.basename(f).startsWith('_'));
const routes=[];

for(const file of pageFiles){
  const route=routeFor(file);
  if(!route) continue;
  routes.push(route);
  const src=fs.readFileSync(file,'utf8');
  const canonical=canonicalFor(route);
  if(!src.includes(canonical)) errors.push(`${path.relative(root,file)}: expected canonical URL ${canonical} not found in source`);
  const hasTitle=/<title>[\s\S]*?<\/title>/.test(src)||/\btitle\s*=\s*['"]/.test(src)||/\btitle\s*:\s*['"]/.test(src);
  const hasDescription=/name=['"]description['"]/.test(src)||/\bdescription\s*=\s*['"]/.test(src)||/\bdescription\s*:\s*['"]/.test(src);
  if(!hasTitle) errors.push(`${path.relative(root,file)}: no title metadata found`);
  if(!hasDescription) errors.push(`${path.relative(root,file)}: no meta description found`);
}

const sitemap=fs.readFileSync(sitemapPath,'utf8');
const sitemapRoutes=[...sitemap.matchAll(/<loc>https:\/\/sankkostnaden\.se([^<]*)<\/loc>/g)].map(m=>{
  const raw=m[1]||'/';
  return raw==='/'?'/':raw.replace(/\/$/,'');
});
for(const route of routes) if(!sitemapRoutes.includes(route)) errors.push(`sitemap missing route ${route}`);
for(const route of sitemapRoutes) if(!routes.includes(route)) errors.push(`sitemap contains non-page route ${route}`);
if(new Set(sitemapRoutes).size!==sitemapRoutes.length) errors.push('sitemap contains duplicate routes');

const robots=fs.readFileSync(robotsPath,'utf8');
if(!robots.includes('Sitemap: https://sankkostnaden.se/sitemap.xml')) errors.push('robots.txt missing canonical sitemap URL');

const app=fs.readFileSync(appPath,'utf8');
const measurement='G-E2XTJVY5EX';
const count=(app.match(new RegExp(measurement,'g'))||[]).length;
if(count<2) errors.push(`GA4 measurement ID ${measurement} is not fully configured in _app.tsx`);

const partnerSrc=fs.readFileSync(partnersPath,'utf8');
const entries=[...partnerSrc.matchAll(/\{\s*name:'([^']+)'[\s\S]*?trackingUrl:(null|'[^']*')[\s\S]*?status:'([^']+)'[\s\S]*?\}/g)].map(m=>({
  name:m[1],url:m[2]==='null'?null:m[2].slice(1,-1),status:m[3]
}));
const names=new Set();
const urls=new Map();
for(const p of entries){
  if(names.has(p.name)) errors.push(`duplicate partner name: ${p.name}`);
  names.add(p.name);
  if(p.status==='active'&&!p.url) errors.push(`active partner missing tracking URL: ${p.name}`);
  if(p.status==='active'&&p.url&&!p.url.startsWith('https://')) errors.push(`active partner has non-HTTPS tracking URL: ${p.name}`);
  if(p.status==='active'&&p.url){
    if(urls.has(p.url)) errors.push(`duplicate active tracking URL: ${p.name} and ${urls.get(p.url)}`);
    urls.set(p.url,p.name);
  }
}

if(errors.length){
  console.error('Integrity validation failed:');
  for(const e of errors) console.error('- '+e);
  process.exit(1);
}
console.log(`Integrity validation passed: ${routes.length} pages, metadata/canonicals, sitemap, robots, GA4 and ${entries.filter(p=>p.status==='active').length} active partners checked.`);
