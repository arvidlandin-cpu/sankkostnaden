import fs from 'node:fs/promises';
import path from 'node:path';
import { buildDecisionPacket, toMarkdown } from './lib/autopilotDecision.mjs';
import { affiliateFromPerformance, buildDailyReport, dailyReportMarkdown } from './lib/dailyReport.mjs';

async function readJson(filePath){
  try{
    return JSON.parse(await fs.readFile(filePath,'utf8'));
  }catch(error){
    if(error?.code==='ENOENT') return null;
    throw error;
  }
}

async function readSource(filePath){
  try{return await readJson(filePath);}
  catch{return {configured:false,failed:true,error:'Unreadable aggregate source report'};}
}

const inputRoot=process.env.AUTOPILOT_INPUT_ROOT||'autopilot-input';
const outDir=process.env.AUTOPILOT_OUT_DIR||'autopilot-report';
const policy=await readJson(process.env.AUTOPILOT_POLICY||'autopilot/policy.json')||{};
const state=await readJson(process.env.AUTOPILOT_STATE||'autopilot/state.json')||{};
const learningLedger=await readJson(process.env.AUTOPILOT_LEARNING_LEDGER||'autopilot/learning-ledger.json')||{};
const releaseContext=await readJson(process.env.AUTOPILOT_RELEASE_CONTEXT||'autopilot/release-context.json');
const now=process.env.AUTOPILOT_NOW?new Date(process.env.AUTOPILOT_NOW):new Date();

const google=await readSource(path.join(inputRoot,'google','google-organic-performance.json'));
const storedAffiliate=await readSource(path.join(inputRoot,'affiliate','affiliate-revenue.json'));
const addrevenue=await readSource(path.join(inputRoot,'addrevenue','addrevenue-performance.json'));
const adtraction=await readSource(path.join(inputRoot,'adtraction','adtraction-performance.json'));
const partnerHealth=await readSource(path.join(inputRoot,'partner-health','partner-health.json'));
const release=await readSource(path.join(inputRoot,'live','production-verification.json'));
// Reuse the network transaction reports: no second collection of the same data.
const affiliate=storedAffiliate||affiliateFromPerformance({addrevenue,adtraction});

const packet=buildDecisionPacket({
  google,
  affiliate,
  addrevenue,
  adtraction,
  partnerHealth,
  policy,
  state,
  learningLedger,
  now,
});

// This is factual release context, not a new growth experiment or proof of uplift.
packet.projectContext=releaseContext?{...releaseContext,checkoutSha:process.env.GITHUB_SHA||null}:null;

packet.sourceHealth.sources.push({source:'production',status:release?.passed===true?'healthy':release?'failed':'missing',required:true});
if(release?.passed!==true){
  packet.systemStatus='BLOCKED';
  packet.sourceHealth.status='blocked';
  packet.recommendedAction={type:'TECHNICAL_FIX',priority:110,reason:'Skarp publicering eller daglig produktionskontroll är inte verifierad. Utred det tekniska felet före nya tillväxtändringar.',autonomous:true,ownerDecisionRequired:false,details:{verificationReport:'live/production-verification.json'}};
}
const daily=buildDailyReport({google,affiliate,addrevenue,adtraction,partnerHealth,decision:packet,release,now});
// The legacy Markdown formatter labels money as SEK. Keep unknown or other
// currencies out of those fields; the owner report retains each currency.
const knownRows=daily.revenue.byNetwork.filter(row=>row.status==='ok');
const knownSek=knownRows.length>0&&knownRows.every(row=>row.currency==='SEK');
packet.northStar.reportedNetworkApprovedCommission=knownSek?knownRows.reduce((n,row)=>n+row.approvedCommission,0):null;
packet.northStar.reportedNetworkApprovedTransactions=knownRows.length?knownRows.reduce((n,row)=>n+row.approvedTransactions,0):null;
packet.northStar.approvedRevenue=daily.revenue.currency==='SEK'?daily.revenue.grandTotal:null;
packet.northStar.pendingRevenue=daily.revenue.currency==='SEK'?daily.revenue.pendingTotal:null;
packet.northStar.approvedTransactions=daily.revenue.status==='complete'?packet.northStar.reportedNetworkApprovedTransactions:null;
packet.northStar.revenueCoverage={status:daily.revenue.status==='complete'?'complete':'partial_or_unknown',reportedNetworks:[...new Set(knownRows.map(row=>row.network))],missingNetworks:[...new Set(daily.revenue.byNetwork.filter(row=>row.status!=='ok').map(row=>row.network))]};
const dailyMarkdown=dailyReportMarkdown(daily);

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'decision.json'),JSON.stringify(packet,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'summary.md'),toMarkdown(packet),'utf8');
await fs.writeFile(path.join(outDir,'daily-report.json'),JSON.stringify(daily,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'daily-report.md'),dailyMarkdown,'utf8');
// Retain the legacy packet as an artifact, publish only one owner-facing report.
await fs.mkdir(path.join(inputRoot,'affiliate'),{recursive:true});
await fs.writeFile(path.join(inputRoot,'affiliate','affiliate-revenue.json'),JSON.stringify(affiliate,null,2)+'\n','utf8');

console.log(dailyMarkdown);

if(packet.systemStatus==='BLOCKED'){
  console.error('AUTOPILOT_BLOCKED: required measurement or production verification is unavailable, stale or failed.');
  process.exitCode=2;
}
