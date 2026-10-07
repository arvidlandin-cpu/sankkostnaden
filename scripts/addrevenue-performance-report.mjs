import fs from 'node:fs/promises';
import path from 'node:path';
import {
  aggregatePerformance,
  aggregateTotals,
  attributionCoverage,
  dateRange,
  normalizeStats,
  normalizeTransaction,
  toMarkdown,
} from './lib/addrevenuePerformance.mjs';

const days=Number(process.env.REPORT_DAYS||process.argv[2]||30);
const period=dateRange(days);
const outDir=process.env.REPORT_OUT_DIR||'addrevenue-performance-report';
const token=process.env.ADDREVENUE_API_TOKEN;
const attributionSince=process.env.ATTRIBUTION_TRACKING_SINCE||'2026-10-06T14:37:00Z';

async function fetchJson(url,options={}){
  const response=await fetch(url,options);
  const body=await response.text();
  if(!response.ok) throw new Error(`${response.status} ${response.statusText}: ${body.slice(0,300)}`);
  return body?JSON.parse(body):null;
}

async function fetchAll(firstUrl,headers){
  let next=firstUrl;
  const rows=[];
  let pages=0;
  while(next&&pages<100){
    const data=await fetchJson(next,{headers});
    rows.push(...(Array.isArray(data?.results)?data.results:[]));
    const nextLink=typeof data?.links?.next==='string'&&data.links.next.length?data.links.next:null;
    next=nextLink?new URL(nextLink,'https://addrevenue.io').toString():'';
    pages+=1;
  }
  return rows;
}

let report;
if(!token){
  report={
    generatedAt:new Date().toISOString(),
    period,
    configured:false,
    source:'Addrevenue API v2',
    totals:aggregateTotals([]),
    attributionCoverage:attributionCoverage([],attributionSince),
    rows:[],
  };
}else{
  const headers={'Authorization':`Bearer ${token}`,'accept':'application/json'};

  const statsUrl=new URL('https://addrevenue.io/api/v2/stats');
  statsUrl.searchParams.set('fromDate',period.from);
  statsUrl.searchParams.set('toDate',period.to);
  statsUrl.searchParams.set('groupBy','advertiser,program');
  statsUrl.searchParams.set('currency','SEK');

  const txUrl=new URL('https://addrevenue.io/api/v2/transactions');
  txUrl.searchParams.set('fromDate',period.from);
  txUrl.searchParams.set('toDate',period.to);
  txUrl.searchParams.set('limit','250');
  txUrl.searchParams.set('orderBy','created DESC');

  const [statsData,transactionData]=await Promise.all([
    fetchJson(statsUrl.toString(),{headers}),
    fetchAll(txUrl.toString(),headers),
  ]);

  const statsRows=(Array.isArray(statsData?.results)?statsData.results:[]).map(normalizeStats);
  const transactions=transactionData.map(normalizeTransaction);
  const rows=aggregatePerformance(statsRows,transactions);

  report={
    generatedAt:new Date().toISOString(),
    period,
    configured:true,
    source:'Addrevenue API v2 stats + transactions',
    totals:aggregateTotals(rows),
    attributionCoverage:attributionCoverage(transactions,attributionSince),
    rows,
  };
}

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'addrevenue-performance.json'),JSON.stringify(report,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'addrevenue-performance.md'),toMarkdown(report),'utf8');
console.log(toMarkdown(report));
