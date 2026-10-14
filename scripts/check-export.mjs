import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const outDir=path.resolve(process.cwd(),process.env.CHECK_EXPORT_DIR||'out');
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

// Parse the static HTML itself: client hydration must not be needed for SEO.
function decode(value){
  const named={amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:'\u00a0',ndash:'–',mdash:'—',hellip:'…',copy:'©',reg:'®',trade:'™',laquo:'«',raquo:'»',aring:'å',Aring:'Å',auml:'ä',Auml:'Ä',ouml:'ö',Ouml:'Ö',eacute:'é',Eacute:'É'};
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z][a-z\d]+);/gi,(whole,key)=>{
    if(key[0]!=='#') return named[key]??whole;
    const code=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):parseInt(key.slice(1),10);
    return code>0&&code<=0x10ffff?String.fromCodePoint(code):whole;
  });
}
const text=value=>decode(value.replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim();
function attrs(tag){
  const result={};
  const re=/([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for(const match of tag.replace(/^<\/?[\w:-]+/,'').matchAll(re)) result[match[1].toLowerCase()]=decode(match[2]??match[3]??match[4]??'');
  return result;
}
const documents=new Map();
function parseDocument(source,current){
  const markup=source.replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');
  const tags=name=>[...markup.matchAll(new RegExp('<'+name+'\\b[^>]*>','gi'))].map(match=>attrs(match[0]));
  const elements=name=>[...markup.matchAll(new RegExp('<'+name+'\\b[^>]*>([\\s\\S]*?)<\\/'+name+'\\s*>','gi'))].map(match=>text(match[1]));
  const meta=tags('meta');
  const jsonld=[];
  for(const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    if(attrs('<script '+match[1]+'>').type?.toLowerCase()!=='application/ld+json') continue;
    try{jsonld.push(JSON.parse(match[2]));}catch{errors.push(current+': invalid JSON-LD');}
  }
  return {titles:elements('title'),h1:elements('h1'),descriptions:meta.filter(item=>item.name?.toLowerCase()==='description').map(item=>item.content||''),robots:meta.filter(item=>item.name?.toLowerCase()==='robots').map(item=>item.content||''),indexDirectives:meta.filter(item=>/^(robots|googlebot|googlebot-news|bingbot)$/i.test(item.name||'')).map(item=>item.content||''),canonicals:tags('link').filter(item=>(item.rel||'').toLowerCase().split(/\s+/).includes('canonical')).map(item=>item.href||''),anchors:tags('a').filter(item=>'href' in item).map(item=>item.href),jsonld};
}

for(const file of htmlFiles){
  const source=fs.readFileSync(file,'utf8');
  const current=routeFor(file);
  const document=parseDocument(source,current);
  documents.set(file,document);
  if(document.titles.length!==1||!document.titles[0]) errors.push(current+': expected exactly one nonempty title; found '+JSON.stringify(document.titles));
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

const origin='https://sankkostnaden.se';
const blocksIndexing=value=>/(?:^|[\s,:])(noindex|nofollow|none)(?:$|[\s,])/i.test(value);
const sitemapFile=path.join(outDir,'sitemap.xml');
const sitemapRoutes=new Set();
if(!fs.existsSync(sitemapFile)) errors.push('sitemap.xml: missing exported sitemap');
else for(const match of fs.readFileSync(sitemapFile,'utf8').matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)){
  const value=decode(match[1].trim());
  let url;
  try{url=new URL(value);}catch{errors.push('sitemap.xml: invalid URL '+value);continue;}
  if(url.origin!==origin||url.search||url.hash){errors.push('sitemap.xml: expected HTTPS main-domain URL: '+value);continue;}
  const route=url.pathname;
  sitemapRoutes.add(route);
  const file=targetFor(route);
  const doc=file&&documents.get(file);
  if(!doc){errors.push(route+': sitemap URL has no exported HTML');continue;}
  if(doc.canonicals.length!==1||doc.canonicals[0]!==value) errors.push(route+': expected one self canonical '+value+'; found '+JSON.stringify(doc.canonicals));
  if(doc.descriptions.length!==1||doc.descriptions[0].trim().length<20) errors.push(route+': missing or non-meaningful meta description');
  if(!doc.h1.some(value=>value.trim().length>=3)) errors.push(route+': missing or non-meaningful H1');
  if(doc.indexDirectives.some(blocksIndexing)) errors.push(route+': indexable sitemap page has noindex/nofollow robots directive');
}

const robotsFile=path.join(outDir,'robots.txt');
if(!fs.existsSync(robotsFile)) errors.push('robots.txt: missing exported robots file');
else{
  const robots=fs.readFileSync(robotsFile,'utf8');
  if(!robots.includes('Sitemap: '+origin+'/sitemap.xml')) errors.push('robots.txt: missing main-domain sitemap');
  // This release preserves the established Allow / policy for public pages.
  // A new crawl block requires an explicit reviewed baseline change.
  if(/^\s*Disallow\s*:\s*\S+/mi.test(robots)) errors.push('robots.txt: unexpected crawl Disallow rule');
}
const headersFile=path.join(outDir,'_headers');
if(fs.existsSync(headersFile)){
  let pattern;
  for(const line of fs.readFileSync(headersFile,'utf8').split(/\r?\n/)){
    if(!line.trim()||line.trimStart().startsWith('#')) continue;
    if(!/^\s/.test(line)){
      const escaped=line.trim().replace(/[.+?^${}()|[\]\\]/g,'\\$&').replace(/:[\w]+/g,'[^/]+').replace(/\*/g,'.*');
      pattern=new RegExp('^'+escaped+'$');
      continue;
    }
    const header=line.trim().match(/^X-Robots-Tag\s*:\s*(.+)$/i);
    if(header&&blocksIndexing(header[1])) for(const route of sitemapRoutes){
      if(pattern?.test(route)) errors.push(route+': exported _headers blocks indexing with X-Robots-Tag');
    }
  }
}

const fixturePath=path.join(process.cwd(),'tests/fixtures/seo-continuity-baseline.json');
if(!fs.existsSync(fixturePath)) errors.push('SEO continuity: missing baseline fixture');
else{
  const fixture=JSON.parse(fs.readFileSync(fixturePath,'utf8'));
  for(const baseline of fixture.pages){
    const route=baseline.path;
    if(!sitemapRoutes.has(route)) errors.push(route+': established route missing from sitemap');
    const file=targetFor(route);
    const doc=file&&documents.get(file);
    if(!doc){errors.push(route+': established route missing exported HTML');continue;}
    for(const [signal,actual,expected] of [
      ['title',doc.titles,[baseline.title]],
      ['description',doc.descriptions,[baseline.description]],
      ['canonical',doc.canonicals,[baseline.canonical]],
      ['robots',doc.robots,baseline.robots===null?[]:[baseline.robots]],
      ...(baseline.h1===null?[]:[['H1',doc.h1,[baseline.h1]]]),
      ['JSON-LD',doc.jsonld,baseline.structuredData],
    ]) if(!isDeepStrictEqual(actual,expected)) errors.push(route+': SEO continuity changed '+signal);
  }
  const redirectsFile=path.join(outDir,'_redirects');
  const redirectLines=new Set(fs.existsSync(redirectsFile)?fs.readFileSync(redirectsFile,'utf8').split(/\r?\n/).map(line=>line.trim().replace(/\s+/g,' ')):[]);
  for(const line of fixture.redirects) if(!redirectLines.has(line.trim().replace(/\s+/g,' '))) errors.push('_redirects: missing established redirect '+line);

  const reached=new Set();
  const queue=['/'];
  while(queue.length){
    const route=queue.shift();
    const file=targetFor(route);
    if(!file||reached.has(file)) continue;
    reached.add(file);
    const doc=documents.get(file);
    if(!doc) continue;
    for(const raw of doc.anchors){
      let url;
      try{url=new URL(raw,new URL(route,origin));}catch{continue;}
      if(url.origin===origin&&targetFor(url.pathname)) queue.push(url.pathname);
    }
  }
  for(const baseline of fixture.pages){
    const file=targetFor(baseline.path);
    if(file&&!reached.has(file)) errors.push(baseline.path+': established route unreachable from homepage server-HTML links');
  }
}
if(errors.length){
  console.error('Export link / SEO continuity validation failed:');
  for(const e of [...new Set(errors)]) console.error('- '+e);
  process.exit(1);
}
console.log('Export link / SEO continuity validation passed: '+htmlFiles.length+' HTML pages, '+checked+' internal links/anchors and '+sitemapRoutes.size+' indexable routes checked.');
