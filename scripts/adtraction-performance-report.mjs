import fs from 'node:fs/promises';
import path from 'node:path';
import {
  aggregatePerformance,
  aggregateTotals,
  attributionCoverage,
  dateRange,
  normalizeAdtractionClick,
  normalizeAdtractionTransaction,
  toMarkdown,
} from './lib/adtractionPerformance.mjs';

const days=Number(process.env.REPORT_DAYS||process.argv[2]||30);
const period=dateRange(days);
const outDir=process.env.REPORT_OUT_DIR||'adtraction-performance-report';
const token=process.env.ADTRACTION_API_TOKEN;
const attributionSince=process.env.ATTRIBUTION_TRACKING_SINCE||'2026-10-06T14:24:38Z';

async function fetchJson(url,options={}){
  const response=await fetch(url,options);
  const body=await response.text();
  if(!response.ok) throw new Error(`${response.status} ${response.statusText}: ${body.slice(0,300)}`);
  return body?JSON.parse(body):null;
}

if(!token) throw new Error('ADTRACTION_API_TOKEN is not configured');

const headers={'X-Token':token,'content-type':'application/json','accept':'application/json'};
const fromDate=period.from+'T00:00:00+0000';
const toDate=period.to+'T23:59:59+0000';

const [transactionData,clickData]=await Promise.all([
  fetchJson('https://api.adtraction.net/v2/partner/transactions/',{
    method:'POST',
    headers,
    body:JSON.stringify({fromDate,toDate,transactionStatus:0}),
  }),
  fetchJson('https://api.adtraction.net/v2/partner/clicks/',{
    method:'POST',
    headers,
    body:JSON.stringify({
      fromDate,
      toDate,
      currency:'SEK',
      market:'SE',
      commissionOnly:false,
    }),
  }),
]);

const transactions=(Array.isArray(transactionData)?transactionData:[]).map(normalizeAdtractionTransaction);
const clicks=(Array.isArray(clickData)?clickData:[]).map(normalizeAdtractionClick);
const rows=aggregatePerformance(transactions,clicks);
const totals=aggregateTotals(transactions,clicks);
const coverage=attributionCoverage(clicks,attributionSince);

const report={
  generatedAt:new Date().toISOString(),
  period,
  source:'Adtraction API v2 partner transactions + clicks',
  totals,
  attributionCoverage:coverage,
  rows,
};

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'adtraction-performance.json'),JSON.stringify(report,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'adtraction-performance.md'),toMarkdown(report),'utf8');

console.log(toMarkdown(report));
