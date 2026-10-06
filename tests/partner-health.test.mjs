import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('partner health audit parses active partners without requesting links',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'partner-health-'));
  const file=path.join(dir,'partners.ts');
  await writeFile(file,`
export const partners=[
 { name:'A', domain:'a.se', category:'mobil', trackingUrl:'https://go.adt242.com/t/t?a=1&as=2&t=2&tk=1', status:'active', linkCheckedAt:'2026-10-01', intents:['compare'] },
 { name:'B', domain:'b.se', category:'forsakring', trackingUrl:'https://addrevenue.io/t?a=1&c=2', status:'active', linkCheckedAt:'2026-10-01', intents:['home'] },
 { name:'Bredbandsval.se', domain:'bredbandsval.se', category:'bredband', trackingUrl:'https://visit.bredbandsval.se/click?p=390345&a=3498422', status:'active', linkCheckedAt:'2026-10-01', intents:['compare'] },
 { name:'C', category:'mobil', trackingUrl:null, status:'pending', intents:['compare'] },
];
`,'utf8');

  const result=spawnSync(process.execPath,['scripts/partner-health.mjs'],{
    cwd:process.cwd(),
    env:{...process.env,PARTNERS_FILE:file,PARTNER_HEALTH_OUT_DIR:path.join(dir,'out'),PARTNER_HEALTH_DNS:'0',PARTNER_HEALTH_TODAY:'2026-10-06'},
    encoding:'utf8',
  });
  assert.equal(result.status,0,result.stderr||result.stdout);
  const report=JSON.parse(await readFile(path.join(dir,'out','partner-health.json'),'utf8'));
  assert.equal(report.activePartners,3);
  assert.equal(report.networkCounts.adtraction,1);
  assert.equal(report.networkCounts.addrevenue,1);
  assert.equal(report.networkCounts.tradedoubler,1);
  assert.equal(report.attributionCounts.find(row=>row.network==='adtraction').join,'verified');
  assert.equal(report.attributionCounts.find(row=>row.network==='addrevenue').join,'verified');
  assert.equal(report.attributionCounts.find(row=>row.network==='tradedoubler').join,'network_only');
  assert.equal(report.dnsChecks.length,0);
  assert.equal(report.findings.length,0);
});

test('partner health audit fails for malformed active tracking links',async()=>{
  const dir=await mkdtemp(path.join(tmpdir(),'partner-health-'));
  const file=path.join(dir,'partners.ts');
  await writeFile(file,`
export const partners=[
 { name:'Broken', category:'mobil', trackingUrl:'not-a-url', status:'active', linkCheckedAt:'2026-10-01', intents:['compare'] },
];
`,'utf8');

  const result=spawnSync(process.execPath,['scripts/partner-health.mjs'],{
    cwd:process.cwd(),
    env:{...process.env,PARTNERS_FILE:file,PARTNER_HEALTH_OUT_DIR:path.join(dir,'out'),PARTNER_HEALTH_DNS:'0',PARTNER_HEALTH_TODAY:'2026-10-06'},
    encoding:'utf8',
  });
  assert.equal(result.status,2);
});
