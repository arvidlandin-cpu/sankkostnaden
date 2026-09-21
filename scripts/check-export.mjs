import fs from 'node:fs';
import path from 'node:path';

const outDir=path.join(process.cwd(),'out');
if(!fs.existsSync(outDir)){console.error('Missing out/');process.exit(1)}

function walk(dir){
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    const full=path.join(dir,e.name);
    return e.isDirectory()?walk(full):[full];
  });
}
function routeFor(file){
  const rel=path.relative(outDir,file).replace(/\\/g,'/');
  if(rel==='index.html') return '/';
  if(rel.endsWith('/index.html')) return '/'+rel.slice(0,-10);
  return '/'+rel.replace(/\.html$/,'/');
}
function targetFor(pathname){
  const clean=decodeURIComponent(pathname).replace(/^\/+|\/+$/g,'');
  if(!clean) return path.join(outDir,'index.html');
  const tries=[path.join(outDir,clean),path.join(outDir,clean,'index.html'),path.join(outDir,clean+'.html')];
  return tries.find(p=>fs.existsSync(p)&&fs.statSync(p).isFile())||null;
}
function hasAnchor(file,fragment){
  if(!fragment) return true;
  const html=fs.readFileSync(file,'utf8');
  return html.includes('id="'+fragment+'"')||html.includes("id='"+fragment+"'")||html.includes('name="'+fragment+'"')||html.includes("name='"+fragment+"'");
}

const htmlFiles=walk(outDir).filter(f=>f.endsWith('.html'));
const errors=[];
let checked=0;

for(const file of htmlFiles){
  const source=fs.readFileSync(file,'utf8');
  const current=routeFor(file);
  const base=new URL(current,'https://sankkostnaden.se');
  const re=/\shref=["']([^"']+)["']/g;
  let m;
  while((m=re.exec(source))){
    const raw=m[1].replace(/&amp;/g,'&');
    if(!raw||raw==='#'){errors.push(current+': dead href '+(raw||'(empty)'));continue}
    if(/^(mailto:|tel:|javascript:|data:)/i.test(raw)) continue;
    let url;
    try{url=new URL(raw,base)}catch{errors.push(current+': invalid href '+raw);continue}
    if(url.hostname!=='sankkostnaden.se') continue;
    checked++;
    const target=targetFor(url.pathname);
    if(!target){errors.push(current+': missing target '+url.pathname+' from '+raw);continue}
    const fragment=decodeURIComponent(url.hash.replace(/^#/,''));
    if(fragment&&!hasAnchor(target,fragment)) errors.push(current+': missing #'+fragment+' in '+url.pathname);
  }
}
if(errors.length){
  console.error('Export link validation failed:');
  for(const e of [...new Set(errors)]) console.error('- '+e);
  process.exit(1);
}
console.log('Export link validation passed: '+htmlFiles.length+' HTML pages and '+checked+' internal links/anchors checked.');
