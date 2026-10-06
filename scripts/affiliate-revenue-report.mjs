import fs from 'node:fs/promises';
import path from 'node:path';
import { aggregateTransactions, dateRange, networkTotals, normalizeAddrevenue, normalizeAdtraction, toMarkdown } from './lib/affiliateRevenue.mjs';

const days=Number(process.env.REPORT_DAYS||process.argv[2]||30);
const period=dateRange(days);
const outDir=process.env.REPORT_OUT_DIR||'affiliate-report';
const networks=[];
const normalized=[];

async function fetchJson(url,options={}){
  const response=await fetch(url,options);
  const body=await response.text();
  if(!response.ok) throw new Error(`${response.status} ${response.statusText}: ${body.slice(0,300)}`);
  return body?JSON.parse(body):null;
}

async function fetchAdtraction(){
  const token=process.env.ADTRACTION_API_TOKEN;
  if(!token){
    networks.push({network:'adtraction',configured:false});
    return;
  }
  try{
    const data=await fetchJson('https://api.adtraction.net/v2/partner/transactions/',{
      method:'POST',
      headers:{'X-Token':token,'content-type':'application/json','accept':'application/json'},
      body:JSON.stringify({
        fromDate:period.from+'T00:00:00+0000',
        toDate:period.to+'T23:59:59+0000',
        transactionStatus:0,
      }),
    });
    const items=Array.isArray(data)?data:[];
    normalized.push(...items.map(normalizeAdtraction));
    networks.push({network:'adtraction',configured:true,records:items.length});
  }catch(error){
    networks.push({network:'adtraction',configured:true,error:error instanceof Error?error.message:String(error)});
  }
}

async function fetchAddrevenue(){
  const token=process.env.ADDREVENUE_API_TOKEN;
  if(!token){
    networks.push({network:'addrevenue',configured:false});
    return;
  }
  try{
    const first=new URL('https://addrevenue.io/api/v2/transactions');
    first.searchParams.set('fromDate',period.from);
    first.searchParams.set('toDate',period.to);
    first.searchParams.set('limit','250');
    first.searchParams.set('offset','0');
    first.searchParams.set('orderBy','created DESC');

    let next=first.toString();
    let requests=0;
    let count=0;
    while(next&&requests<100){
      const data=await fetchJson(next,{
        headers:{'Authorization':`Bearer ${token}`,'accept':'application/json'},
      });
      const items=Array.isArray(data?.results)?data.results:[];
      normalized.push(...items.map(normalizeAddrevenue));
      count+=items.length;
      requests+=1;
      const nextLink=typeof data?.links?.next==='string'&&data.links.next.length?data.links.next:null;
      next=nextLink?new URL(nextLink,'https://addrevenue.io').toString():'';
    }
    networks.push({network:'addrevenue',configured:true,records:count});
  }catch(error){
    networks.push({network:'addrevenue',configured:true,error:error instanceof Error?error.message:String(error)});
  }
}

await Promise.all([fetchAdtraction(),fetchAddrevenue()]);

const rows=aggregateTransactions(normalized);
const report={
  generatedAt:new Date().toISOString(),
  period,
  networks:networks.sort((a,b)=>a.network.localeCompare(b.network)),
  totals:networkTotals(rows),
  rows,
};

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'affiliate-revenue.json'),JSON.stringify(report,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'affiliate-revenue.md'),toMarkdown(report),'utf8');

console.log(toMarkdown(report));
if(networks.some(network=>network.error)) process.exitCode=2;
