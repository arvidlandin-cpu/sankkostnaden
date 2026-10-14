import test from 'node:test';
import assert from 'node:assert/strict';
import { affiliateFromPerformance,buildDailyReport,dailyReportMarkdown } from '../scripts/lib/dailyReport.mjs';

const at='2026-10-14T07:00:00Z';
const period={from:'2026-09-15',to:'2026-10-14',days:30};
const row={partner:'Partner',advertiserName:'Partner',currency:'SEK',approvedCommission:120,pendingCommission:40,approvedTransactions:2,pendingTransactions:1,deniedTransactions:0,claims:0,otherTransactions:0,matchedTransactions:2,totalTransactions:3};
const performance=changes=>({generatedAt:at,period,rows:[{...row}],...changes});
function setup(){
  const addrevenue=performance({configured:true}),adtraction=performance();
  return {now:at,addrevenue,adtraction,affiliate:affiliateFromPerformance({addrevenue,adtraction}),partnerHealth:{generatedAt:at,networkCounts:{addrevenue:3,adtraction:8},findings:[]},google:{configured:true,generatedAt:at,ga4:{period:{startDate:'2026-09-14',endDate:'2026-10-13',days:30},organic:{sessions:18},totals:{sessions:50},appFunnel:[{eventName:'affiliate_click',eventCount:999}],commercialByPageChannel:[{eventName:'affiliate_click',channel:'Organic Search',eventCount:4},{eventName:'affiliate_click',channel:'Direct',eventCount:6},{eventName:'partner_impression',channel:'Organic Search',eventCount:100}]},gsc:{period:{startDate:'2026-09-14',endDate:'2026-10-13',days:30},totals:{clicks:23,impressions:1200},daily:[{date:'2026-10-11'},{date:'2026-10-12'}]}},decision:{recommendedAction:{type:'VERIFY_DATA',priority:1,reason:'Verifiera källor'}},release:{passed:true,mode:'production',expectedCommit:'abc1234',verifiedAt:at,referenceUrl:'https://sankkostnaden.se/',checks:[{status:200}],assets:[{path:'/_next/static/a.js'}],errors:[]}};
}

test('performance adapter preserves schema, separate currencies and period without API fetch',()=>{
  const report=affiliateFromPerformance({addrevenue:performance({configured:true,rows:[row,{...row,currency:'EUR',approvedCommission:7}]}),adtraction:performance()});
  assert.equal(report.networks.length,2);
  assert.equal(report.totals.length,3);
  assert.equal(report.totals.find(item=>item.network==='addrevenue'&&item.currency==='EUR').approvedCommission,7);
  assert.equal(report.period.days,30);
  assert.equal(report.rows[0].network,'addrevenue');
});

test('performance adapter fails closed for missing/configured false/failed reports even with data',()=>{
  for(const source of [undefined,performance({configured:false}),performance({failed:true}),performance({error:'failure'}),performance({status:'error'})]){
    const report=affiliateFromPerformance({addrevenue:source,adtraction:performance()});
    assert.equal(report.networks[0].configured,false);
    assert.equal(report.rows.some(row=>row.network==='addrevenue'),false);
    assert.equal(report.period,null);
  }
});

test('sitewide organic outbound clicks are distinct from app funnel, inbound GSC and sessions',()=>{
  const report=buildDailyReport(setup());
  assert.equal(report.traffic.organicOutgoingPartnerClicks,4);
  assert.equal(report.traffic.allChannelOutgoingPartnerClicks,10);
  assert.equal(report.traffic.organicSessions,18);
  assert.equal(report.traffic.gscInboundClicks,23);
  assert.equal(report.traffic.latestGscDailyDate,'2026-10-12');
  assert.equal(report.revenue.grandTotal,240);
  assert.equal(report.revenue.pendingTotal,80);
});

test('active tradedoubler or unknown network makes total UNKNOWN but preserves known network rows',()=>{
  for(const network of ['tradedoubler','other']){
    const args=setup();args.partnerHealth.networkCounts[network]=1;
    const report=buildDailyReport(args);
    assert.equal(report.revenue.grandTotal,null);
    assert.equal(report.revenue.status,'UNKNOWN');
    assert.equal(report.revenue.byNetwork.find(row=>row.network===network).approvedCommission,null);
    assert.equal(report.revenue.byNetwork.find(row=>row.network==='adtraction').approvedCommission,120);
  }
});

test('source errors cannot be hidden by a present aggregate report or stale success rows',()=>{
  for(const name of ['addrevenue','adtraction','affiliate','partnerHealth','google']){
    const args=setup();args[name]={...args[name],error:'secret-value-do-not-echo'};
    const report=buildDailyReport(args);
    assert.equal(report.sources.find(source=>source.name===name).status,'UNKNOWN');
    if(name==='google')assert.equal(report.traffic.organicSessions,null);
    else assert.equal(report.revenue.grandTotal,null);
    assert.equal(JSON.stringify(report).includes('secret-value-do-not-echo'),false);
  }
});

test('missing metrics stay UNKNOWN; an explicit empty event result is a known zero',()=>{
  const args=setup();delete args.google.ga4.commercialByPageChannel;delete args.google.gsc.totals;
  const report=buildDailyReport(args);
  assert.equal(report.traffic.organicOutgoingPartnerClicks,null);
  assert.equal(report.traffic.gscInboundClicks,null);
  args.google.ga4.commercialByPageChannel=[];
  assert.equal(buildDailyReport(args).traffic.organicOutgoingPartnerClicks,0);
  assert.equal(buildDailyReport({now:at}).revenue.grandTotal,null);
});

test('different currencies and mismatched or malformed periods block grand total',()=>{
  for(const change of [{currency:'EUR'},{currency:''}]){
    const args=setup();args.addrevenue.rows=[{...row,...change}];args.affiliate=affiliateFromPerformance(args);
    assert.equal(buildDailyReport(args).revenue.grandTotal,null);
  }
  for(const different of [{from:'2026-09-14',to:'2026-10-13'},{from:'2026-02-30',to:'2026-10-14'}]){
    const args=setup();args.addrevenue.period=different;args.affiliate=affiliateFromPerformance(args);
    assert.equal(args.affiliate.period,null);
    assert.equal(buildDailyReport(args).revenue.grandTotal,null);
  }
});

test('markdown states actual 30-day periods, preliminary data, planned agents and one real decision',()=>{
  const report=buildDailyReport(setup()),md=dailyReportMarkdown(report);
  assert.match(md,/2026-09-14 – 2026-10-13 \(30 dagar\)/);
  assert.match(md,/2026-09-15 – 2026-10-14 \(30 dagar\)/);
  assert.match(md,/2026-10-12/);
  assert.match(md,/preliminära/);
  assert.match(md,/Planerat uppdrag – inte exekverad AI/);
  assert.match(md,/VERIFY_DATA: Verifiera källor/);
  assert.match(md,/fysisk iPhone/);
  assert.equal(report.release.physicalIphoneVerified,null);
  assert.equal(report.release.status,'verified');
  assert.doesNotMatch(md,/gårdagens|konverteringsgrad:|godkänd intäkt per organisk/i);
});

test('output is aggregate-only and never copies raw identifiers, credentials or transaction data',()=>{
  const args=setup();
  args.addrevenue.rows[0]={...row,orderId:'private-order',clickRef:'private-click',email:'private-email',token:'private-token'};
  args.affiliate=affiliateFromPerformance(args);
  args.release.secret='private-release';args.decision.recommendedAction.details={token:'private-detail'};
  const json=JSON.stringify(buildDailyReport(args));
  for(const value of ['private-order','private-click','private-email','private-token','private-release','private-detail'])assert.equal(json.includes(value),false);
});

test('missing or degraded production proof stays UNKNOWN and cannot imply physical-device approval',()=>{
  for(const release of [undefined,{passed:false},{...setup().release,mode:'preview'},{...setup().release,expectedCommit:'not-a-commit'},{...setup().release,checks:[{errors:['private-response']}]},{...setup().release,errors:['private-response']}]){
    const report=buildDailyReport({...setup(),release});
    assert.equal(report.release.status,'UNKNOWN');
    assert.equal(report.release.physicalIphoneVerified??null,null);
    assert.equal(JSON.stringify(report).includes('private-response'),false);
    assert.ok(report.technicalAlerts.some(alert=>alert.startsWith('Release:')));
  }
});

test('nested Google failures, malformed active network counts and missing commission do not become zeros',()=>{
  const args=setup();args.google.ga4.failed=true;
  assert.equal(buildDailyReport(args).traffic.organicOutgoingPartnerClicks,null);
  args.partnerHealth.networkCounts.other='1';
  assert.equal(buildDailyReport(args).revenue.grandTotal,null);
  const second=setup();delete second.addrevenue.rows[0].approvedCommission;
  second.affiliate=affiliateFromPerformance(second);
  assert.equal(buildDailyReport(second).revenue.byNetwork.find(row=>row.network==='addrevenue').approvedCommission,null);
  assert.equal(buildDailyReport(second).revenue.grandTotal,null);
});

test('transient readiness polling errors do not override successful terminal production verification',()=>{
  const args=setup();
  args.release.checks=[{kind:'readiness-origin',errors:['Initial deployment unavailable']},{kind:'readiness-origin',errors:[]},{kind:'metadata',errors:[]}];
  assert.equal(buildDailyReport(args).release.status,'verified');
  args.release.checks.push({kind:'metadata',errors:['Canonical mismatch']});
  assert.equal(buildDailyReport(args).release.status,'UNKNOWN');
});

test('successful explicit zero totals establish a known zero without inventing missing outcomes',()=>{
  const zero={currency:'SEK',approvedCommission:0,pendingCommission:0,approvedTransactions:0,pendingTransactions:0};
  const args=setup();
  args.addrevenue=performance({configured:true,rows:[],totals:zero});
  args.adtraction=performance({rows:[],totals:zero});
  args.affiliate=affiliateFromPerformance(args);
  assert.equal(args.affiliate.rows.length,2);
  assert.equal(buildDailyReport(args).revenue.grandTotal,0);
  for(const change of [{totals:undefined},{totals:{...zero,approvedCommission:1}},{totals:{...zero,currency:''}},{configured:false},{failed:true},{error:'network unavailable'}]){
    const second=setup();
    second.addrevenue=performance({configured:true,rows:[],totals:zero,...change});
    second.affiliate=affiliateFromPerformance(second);
    assert.equal(buildDailyReport(second).revenue.grandTotal,null);
  }
  args.adtraction.totals={...zero,currency:'EUR'};
  args.affiliate=affiliateFromPerformance(args);
  assert.equal(buildDailyReport(args).revenue.grandTotal,null);
});

test('GSC diagnostics use actual schema, sort top five and preserve actual CTR and average position',()=>{
  const args=setup();
  args.google.gsc.totals={clicks:23,impressions:1200,ctr:0.0192,position:12.4};
  args.google.gsc.queries=Array.from({length:7},(_,index)=>({query:'bredband alternativ '+String.fromCharCode(65+index),clicks:index,impressions:100+index,ctr:0.02,position:10+index}));
  args.google.gsc.pages=[{page:'https://sankkostnaden.se/bredband/?sensitive=private#section',clicks:9,impressions:250,ctr:0.036,position:7.2}];
  const report=buildDailyReport(args),md=dailyReportMarkdown(report);
  assert.equal(report.traffic.gscCtr,0.0192);
  assert.equal(report.traffic.gscPosition,12.4);
  assert.equal(report.traffic.topGscQueries.length,5);
  assert.equal(report.traffic.topGscQueries[0].clicks,6);
  assert.equal(report.traffic.topGscLandingPages[0].page,'/bredband/');
  assert.match(md,/genomsnittlig position: 12.4/);
  assert.match(md,/position 7.2/);
  assert.doesNotMatch(md,/sensitive=|private#/);
});

test('GA4 app-only landings and pageviews never masquerade as sitewide landing pages',()=>{
  const args=setup();
  args.google.ga4.appLandingChannels=[{landingPage:'/app/',channel:'Organic Search',sessions:400}];
  args.google.ga4.pages=[{path:'/bredband/',pageViews:800,activeUsers:500}];
  const report=buildDailyReport(args);
  assert.equal(report.traffic.topGa4LandingPages,null);
  assert.match(report.traffic.ga4LandingPagesNotice,/endast \/app\//);
  assert.equal(report.traffic.topGscQueries,null);
  assert.equal(report.traffic.topGscLandingPages,null);
  assert.equal(report.traffic.gscCtr,null);
  assert.equal(report.traffic.gscPosition,null);
});

test('GSC diagnostics do not publish personal identifiers, missing metrics as zero or data from a failed source',()=>{
  const args=setup();
  args.google.gsc.queries=[{query:'billigt bredband',clicks:1},{query:'person@example.com',clicks:99},{query:'ring 070 123 45 67',clicks:99}];
  args.google.gsc.pages=[{page:'https://other.example/private',clicks:100}];
  args.google.gsc.totals.ctr=2;
  args.google.gsc.totals.position=-1;
  const report=buildDailyReport(args);
  assert.equal(report.traffic.topGscQueries.length,1);
  assert.equal(report.traffic.topGscQueries[0].impressions,null);
  assert.equal(report.traffic.topGscQueries[0].ctr,null);
  assert.equal(report.traffic.topGscLandingPages.length,0);
  assert.equal(report.traffic.gscCtr,null);
  assert.equal(report.traffic.gscPosition,null);
  assert.doesNotMatch(JSON.stringify(report),/person@example|070 123|other.example/);
  args.google.gsc.error='failed';
  const failed=buildDailyReport(args);
  assert.equal(failed.traffic.topGscQueries,null);
  assert.equal(failed.traffic.gscCtr,null);
});
