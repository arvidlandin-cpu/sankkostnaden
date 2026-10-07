import fs from 'node:fs/promises';
import path from 'node:path';
import { buildDecisionPacket, toMarkdown } from './lib/autopilotDecision.mjs';

async function readJson(filePath){
  try{
    return JSON.parse(await fs.readFile(filePath,'utf8'));
  }catch(error){
    if(error?.code==='ENOENT') return null;
    throw error;
  }
}

const inputRoot=process.env.AUTOPILOT_INPUT_ROOT||'autopilot-input';
const outDir=process.env.AUTOPILOT_OUT_DIR||'autopilot-report';
const policy=await readJson(process.env.AUTOPILOT_POLICY||'autopilot/policy.json')||{};
const state=await readJson(process.env.AUTOPILOT_STATE||'autopilot/state.json')||{};
const learningLedger=await readJson(process.env.AUTOPILOT_LEARNING_LEDGER||'autopilot/learning-ledger.json')||{};
const now=process.env.AUTOPILOT_NOW?new Date(process.env.AUTOPILOT_NOW):new Date();

const google=await readJson(path.join(inputRoot,'google','google-organic-performance.json'));
const affiliate=await readJson(path.join(inputRoot,'affiliate','affiliate-revenue.json'));
const addrevenue=await readJson(path.join(inputRoot,'addrevenue','addrevenue-performance.json'));
const adtraction=await readJson(path.join(inputRoot,'adtraction','adtraction-performance.json'));
const partnerHealth=await readJson(path.join(inputRoot,'partner-health','partner-health.json'));

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

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'decision.json'),JSON.stringify(packet,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'summary.md'),toMarkdown(packet),'utf8');

console.log(toMarkdown(packet));

if(packet.systemStatus==='BLOCKED'){
  console.error('AUTOPILOT_BLOCKED: required Google/GA4 data is unavailable or stale.');
  process.exitCode=2;
}
