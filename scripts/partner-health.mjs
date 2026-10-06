import fs from 'node:fs/promises';
import path from 'node:path';
import dns from 'node:dns/promises';

const partnersPath=process.env.PARTNERS_FILE||'lib/partners.ts';
const outDir=process.env.PARTNER_HEALTH_OUT_DIR||'partner-health';
const doDns=process.env.PARTNER_HEALTH_DNS!=='0';
const today=process.env.PARTNER_HEALTH_TODAY||new Date().toISOString().slice(0,10);
const staleDays=Number(process.env.PARTNER_HEALTH_STALE_DAYS||45);

function daysSince(date){
  if(!date) return null;
  const a=new Date(date+'T00:00:00Z');
  const b=new Date(today+'T00:00:00Z');
  return Math.floor((b.getTime()-a.getTime())/86400000);
}

function classify(url){
  try{
    const u=new URL(url);
    if(u.hostname==='addrevenue.io'||u.hostname==='www.addrevenue.io') return 'addrevenue';
    if(u.pathname==='/t/t'&&u.searchParams.has('a')&&u.searchParams.has('as')&&u.searchParams.get('t')==='2'&&u.searchParams.get('tk')==='1') return 'adtraction';
    if(
      (u.hostname==='visit.bredbandsval.se'&&u.pathname==='/click'&&u.searchParams.has('p')&&u.searchParams.has('a')) ||
      (u.hostname==='clk.tradedoubler.com'&&u.pathname==='/click'&&u.searchParams.has('p')&&u.searchParams.has('a'))
    ) return 'tradedoubler';
    return 'other';
  }catch{
    return 'invalid';
  }
}

function parsePartners(source){
  const rows=[];
  for(const line of source.split(/\r?\n/)){
    if(!line.includes("name:'")||!line.includes("status:'")) continue;
    const name=line.match(/name:'([^']+)'/)?.[1];
    const status=line.match(/status:'([^']+)'/)?.[1];
    const category=line.match(/category:'([^']+)'/)?.[1]||'unknown';
    const tracking=line.match(/trackingUrl:(null|'([^']*)')/);
    const trackingUrl=tracking?.[1]==='null'?null:tracking?.[2]||null;
    const checked=line.match(/linkCheckedAt:'([^']+)'/)?.[1]||null;
    const domain=line.match(/domain:'([^']+)'/)?.[1]||null;
    if(name&&status) rows.push({name,status,category,trackingUrl,linkCheckedAt:checked,domain});
  }
  return rows;
}

const source=await fs.readFile(partnersPath,'utf8');
const partners=parsePartners(source);
const active=partners.filter(p=>p.status==='active');
const findings=[];
const hosts=new Map();

for(const partner of active){
  if(!partner.trackingUrl){
    findings.push({severity:'error',partner:partner.name,issue:'active partner missing tracking URL'});
    continue;
  }
  let url;
  try{url=new URL(partner.trackingUrl);}catch{
    findings.push({severity:'error',partner:partner.name,issue:'invalid tracking URL'});
    continue;
  }
  if(url.protocol!=='https:') findings.push({severity:'error',partner:partner.name,issue:'tracking URL is not HTTPS'});
  const network=classify(partner.trackingUrl);
  if(network==='invalid') findings.push({severity:'error',partner:partner.name,issue:'could not classify malformed URL'});
  if(!hosts.has(url.hostname)) hosts.set(url.hostname,{hostname:url.hostname,partners:[],network});
  hosts.get(url.hostname).partners.push(partner.name);

  const age=daysSince(partner.linkCheckedAt);
  if(age===null) findings.push({severity:'warning',partner:partner.name,issue:'missing linkCheckedAt'});
  else if(age>staleDays) findings.push({severity:'warning',partner:partner.name,issue:`linkCheckedAt is ${age} days old`});
}

const dnsChecks=[];
if(doDns){
  for(const item of hosts.values()){
    try{
      const resolved=await dns.lookup(item.hostname);
      dnsChecks.push({...item,ok:true,address:resolved.address});
    }catch(error){
      dnsChecks.push({...item,ok:false,error:error instanceof Error?error.message:String(error)});
      findings.push({severity:'warning',partner:item.partners.join(', '),issue:`tracking host DNS lookup failed: ${item.hostname}`});
    }
  }
}

const networkCounts={};
for(const partner of active){
  const network=partner.trackingUrl?classify(partner.trackingUrl):'missing';
  networkCounts[network]=(networkCounts[network]||0)+1;
}

const attributionCoverage={
  adtraction:{join:'verified',reference:'epi / epi2'},
  addrevenue:{join:'verified',reference:'r -> clickRef'},
  tradedoubler:{join:'network_only',reference:'no verified Sänk Kostnaden sub-ID join'},
  other:{join:'unknown',reference:'unknown'},
  missing:{join:'none',reference:'missing tracking URL'},
};
const attributionCounts=Object.entries(networkCounts).map(([network,count])=>({
  network,
  count,
  ...(attributionCoverage[network]||{join:'unknown',reference:'unknown'}),
}));

const report={
  generatedAt:new Date().toISOString(),
  checkedOn:today,
  activePartners:active.length,
  networkCounts,
  attributionCounts,
  findings,
  dnsChecks,
};

const lines=[
  '# Partner health',
  '',
  `Checked: ${today}`,
  `Active partners: **${active.length}**`,
  '',
  '## Tracking networks',
  '',
  ...Object.entries(networkCounts).sort().map(([network,count])=>`- ${network}: **${count}**`),
  '',
  '## Attribution coverage',
  '',
  ...attributionCounts.sort((a,b)=>a.network.localeCompare(b.network)).map(item=>`- ${item.network}: **${item.count}** partner(s) · ${item.join} · ${item.reference}`),
  '',
];

if(findings.length){
  lines.push('## Findings','');
  for(const finding of findings) lines.push(`- **${finding.severity.toUpperCase()}** · ${finding.partner}: ${finding.issue}`);
  lines.push('');
}else{
  lines.push('No partner-health findings.','');
}

if(doDns){
  lines.push('## DNS reachability (no affiliate URLs requested)','');
  for(const check of dnsChecks) lines.push(`- ${check.ok?'OK':'WARN'} · ${check.hostname} · ${check.network} · ${check.partners.join(', ')}`);
  lines.push('');
}

lines.push('The health check never requests an affiliate tracking URL, so it does not manufacture affiliate clicks. It only parses link structure, checks review age and optionally resolves tracking host DNS.','');

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'partner-health.json'),JSON.stringify(report,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'partner-health.md'),lines.join('\n'),'utf8');

console.log(lines.join('\n'));
if(findings.some(f=>f.severity==='error')) process.exitCode=2;
