import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDecisionPacket, toMarkdown } from '../scripts/lib/autopilotDecision.mjs';

const policy={
  version:1,
  thresholds:{
    freshnessHours:36,
    seo:{minImpressions:80,minPosition:3,maxPosition:15,maxCtr:0.015},
    cro:{minOrganicStarts:25,maxCompletionRate:0.45,minOrganicPartnerImpressions:25,maxAffiliateClickRate:0.08},
    attribution:{minSample:3,repairBelowCoverage:0.5},
    commercial:{minPartnerClicks:25},
  },
  limits:{maxConcurrentExperiments:1},
  autonomy:{auto:['TECHNICAL_FIX','ATTRIBUTION_REPAIR','SEO_SNIPPET_TEST','CRO_FRICTION_TEST','REVIEW_ACTIVE_EXPERIMENT']},
};

function google(now='2026-10-08T08:00:00Z'){
  return {
    generatedAt:now,
    configured:true,
    ga4:{
      totals:{sessions:100,activeUsers:80},
      organic:{sessions:20,activeUsers:18},
      appFunnel:[],
      appFunnelByChannel:[],
      commercialByPageChannel:[],
    },
    gsc:{
      totals:{clicks:10,impressions:500,ctr:0.02,position:20},
      queryPages:[],
    },
  };
}

test('an active experiment blocks new growth experiments before review date',()=>{
  const g=google();
  g.gsc.queryPages=[{query:'billigaste elavtalet',page:'https://sankkostnaden.se/elavtal/',impressions:200,clicks:0,ctr:0,position:8}];
  const packet=buildDecisionPacket({
    google:g,
    policy,
    state:{activeExperiment:{id:'x',type:'SEO_SNIPPET_TEST',target:'/forsakring/',startedAt:'2026-10-07T10:00:00Z',earliestReviewAt:'2026-10-15T08:00:00Z',status:'running'}},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.type,'WAITING_FOR_EXPERIMENT');
  assert.equal(packet.guardrails.activeExperimentBlocksGrowth,true);
});

test('review becomes the next autonomous action when the active experiment matures',()=>{
  const packet=buildDecisionPacket({
    google:google('2026-10-16T08:00:00Z'),
    policy,
    state:{activeExperiment:{id:'x',type:'SEO_SNIPPET_TEST',target:'/forsakring/',startedAt:'2026-10-07T10:00:00Z',earliestReviewAt:'2026-10-15T08:00:00Z',status:'running'}},
    now:new Date('2026-10-16T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.type,'REVIEW_ACTIVE_EXPERIMENT');
  assert.equal(packet.recommendedAction.autonomous,true);
});

test('attribution repair overrides the experiment wait gate',()=>{
  const packet=buildDecisionPacket({
    google:google(),
    adtraction:{
      generatedAt:'2026-10-08T08:00:00Z',
      attributionCoverage:{clicks:10,taggedClicks:2,tagCoverage:0.2,status:'warning'},
      totals:{totalClicks:10},
      rows:[],
    },
    policy,
    state:{activeExperiment:{id:'x',type:'SEO_SNIPPET_TEST',target:'/forsakring/',startedAt:'2026-10-07T10:00:00Z',earliestReviewAt:'2026-10-15T08:00:00Z',status:'running'}},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.type,'ATTRIBUTION_REPAIR');
  assert.equal(packet.recommendedAction.autonomous,true);
});

test('low CTR ranking signal can trigger a bounded SEO snippet test',()=>{
  const g=google();
  g.gsc.queryPages=[{query:'billigaste elavtalet',page:'https://sankkostnaden.se/elavtal/',impressions:200,clicks:1,ctr:0.005,position:7.5}];
  const packet=buildDecisionPacket({
    google:g,
    policy,
    state:{},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.type,'SEO_SNIPPET_TEST');
  assert.equal(packet.recommendedAction.details.query,'billigaste elavtalet');
});

test('organic funnel sample can trigger a CRO friction test',()=>{
  const g=google();
  g.ga4.appFunnelByChannel=[
    {eventName:'cost_check_start',channel:'Organic Search',eventCount:40,totalUsers:35},
    {eventName:'cost_check_complete',channel:'Organic Search',eventCount:10,totalUsers:10},
    {eventName:'partner_impression',channel:'Organic Search',eventCount:10,totalUsers:10},
    {eventName:'affiliate_click',channel:'Organic Search',eventCount:2,totalUsers:2},
  ];
  const packet=buildDecisionPacket({
    google:g,
    policy,
    state:{},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.type,'CRO_FRICTION_TEST');
  assert.equal(packet.recommendedAction.details.kind,'completion');
});

test('missing Google data blocks optimization instead of guessing',()=>{
  const packet=buildDecisionPacket({
    policy,
    state:{},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  assert.equal(packet.systemStatus,'BLOCKED');
  assert.equal(packet.recommendedAction.type,'TECHNICAL_FIX');
});

test('markdown never includes raw credentials and reports the north star',()=>{
  const packet=buildDecisionPacket({
    google:google(),
    affiliate:{
      generatedAt:'2026-10-08T08:00:00Z',
      totals:[{network:'addrevenue',approvedCommission:500,approvedTransactions:1,pendingCommission:0}],
    },
    addrevenue:{generatedAt:'2026-10-08T08:00:00Z',totals:{clicks:5},rows:[]},
    adtraction:{generatedAt:'2026-10-08T08:00:00Z',totals:{totalClicks:5},rows:[]},
    policy,
    state:{},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  const markdown=toMarkdown(packet);
  assert.match(markdown,/Godkänd affiliateintäkt/);
  assert.match(markdown,/500/);
  assert.doesNotMatch(markdown,/private_key|API_TOKEN|GOOGLE_SERVICE_ACCOUNT_JSON/);
});


test('review calculates a KEEP verdict from enough post-change GSC data',()=>{
  const g=google('2026-10-16T08:00:00Z');
  g.gsc.focusQueryDaily=[
    {date:'2026-10-08',query:'jämför försäkring',clicks:1,impressions:15,ctr:1/15,position:7.2},
    {date:'2026-10-09',query:'jämför försäkring',clicks:1,impressions:20,ctr:0.05,position:7.8},
  ];
  const packet=buildDecisionPacket({
    google:g,
    policy:{...policy,thresholds:{...policy.thresholds,experimentReview:{minPostImpressions:30,minCtrLift:0.01,maxPositionLossToKeep:2.5,materialPositionLoss:3}}},
    state:{activeExperiment:{id:'x',type:'SEO_SNIPPET_TEST',query:'jämför försäkring',target:'/forsakring/',startedAt:'2026-10-07T10:00:00Z',earliestReviewAt:'2026-10-15T08:00:00Z',status:'running',baseline:{impressions:31,clicks:0,ctr:0,position:7.6}}},
    now:new Date('2026-10-16T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.type,'REVIEW_ACTIVE_EXPERIMENT');
  assert.equal(packet.recommendedAction.details.evaluation.verdict,'KEEP');
  assert.equal(packet.recommendedAction.details.evaluation.post.impressions,35);
});

test('review stays insufficient when post-change impressions are too few',()=>{
  const g=google('2026-10-16T08:00:00Z');
  g.gsc.focusQueryDaily=[
    {date:'2026-10-08',query:'jämför försäkring',clicks:1,impressions:10,ctr:0.1,position:7.2},
  ];
  const packet=buildDecisionPacket({
    google:g,
    policy:{...policy,thresholds:{...policy.thresholds,experimentReview:{minPostImpressions:30,minCtrLift:0.01,maxPositionLossToKeep:2.5,materialPositionLoss:3}}},
    state:{activeExperiment:{id:'x',type:'SEO_SNIPPET_TEST',query:'jämför försäkring',target:'/forsakring/',startedAt:'2026-10-07T10:00:00Z',earliestReviewAt:'2026-10-15T08:00:00Z',status:'running',baseline:{impressions:31,clicks:0,ctr:0,position:7.6}}},
    now:new Date('2026-10-16T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.details.evaluation.verdict,'INSUFFICIENT_DATA');
});


test('early-stage repeated top-10 query can trigger a metadata experiment before 80 impressions',()=>{
  const g=google();
  g.gsc.queryPages=[{query:'vad menas med kvartspris på el',page:'https://sankkostnaden.se/elavtal/kvartspris/',impressions:28,clicks:0,ctr:0,position:9.1}];
  g.gsc.focusQueryDaily=[
    {date:'2026-10-01',query:'vad menas med kvartspris på el',impressions:5,clicks:0,ctr:0,position:9},
    {date:'2026-10-02',query:'vad menas med kvartspris på el',impressions:7,clicks:0,ctr:0,position:9.2},
    {date:'2026-10-03',query:'vad menas med kvartspris på el',impressions:8,clicks:0,ctr:0,position:9.1},
    {date:'2026-10-04',query:'vad menas med kvartspris på el',impressions:8,clicks:0,ctr:0,position:9.1},
  ];
  const p={...policy,thresholds:{...policy.thresholds,seo:{...policy.thresholds.seo,earlyStage:{minImpressions:25,maxPosition:10,maxCtr:0.005,minDistinctDays:4}},contentUtility:{minImpressions:100,minPosition:16,maxPosition:40,maxClicks:1}},autonomy:{auto:[...policy.autonomy.auto,'CONTENT_UTILITY_UPGRADE']}};
  const packet=buildDecisionPacket({google:g,policy:p,state:{},learningLedger:{completedExperiments:[]},now:new Date('2026-10-08T08:00:00Z')});
  assert.equal(packet.recommendedAction.type,'SEO_SNIPPET_TEST');
  assert.equal(packet.recommendedAction.details.mode,'early_stage');
});

test('recently completed SEO query stays on cooldown',()=>{
  const g=google();
  g.gsc.queryPages=[{query:'vad menas med kvartspris på el',page:'https://sankkostnaden.se/elavtal/kvartspris/',impressions:28,clicks:0,ctr:0,position:9.1}];
  g.gsc.focusQueryDaily=[
    {date:'2026-10-01',query:'vad menas med kvartspris på el',impressions:5,clicks:0,ctr:0,position:9},
    {date:'2026-10-02',query:'vad menas med kvartspris på el',impressions:7,clicks:0,ctr:0,position:9.2},
    {date:'2026-10-03',query:'vad menas med kvartspris på el',impressions:8,clicks:0,ctr:0,position:9.1},
    {date:'2026-10-04',query:'vad menas med kvartspris på el',impressions:8,clicks:0,ctr:0,position:9.1},
  ];
  const p={...policy,limits:{...policy.limits,seoCooldownDays:14},thresholds:{...policy.thresholds,seo:{...policy.thresholds.seo,earlyStage:{minImpressions:25,maxPosition:10,maxCtr:0.005,minDistinctDays:4}},contentUtility:{minImpressions:100,minPosition:16,maxPosition:40,maxClicks:1}},autonomy:{auto:[...policy.autonomy.auto,'CONTENT_UTILITY_UPGRADE']}};
  const packet=buildDecisionPacket({
    google:g,policy:p,state:{},
    learningLedger:{completedExperiments:[{type:'SEO_SNIPPET_TEST',query:'vad menas med kvartspris på el',completedAt:'2026-10-05T08:00:00Z'}]},
    now:new Date('2026-10-08T08:00:00Z')
  });
  assert.equal(packet.recommendedAction.type,'WAITING_FOR_SIGNAL');
});

test('high-impression reach-zone page can trigger an original utility upgrade',()=>{
  const g=google();
  g.gsc.pages=[{page:'https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/',impressions:243,clicks:0,ctr:0,position:29.8}];
  const p={...policy,thresholds:{...policy.thresholds,contentUtility:{minImpressions:100,minPosition:16,maxPosition:40,maxClicks:1}},autonomy:{auto:[...policy.autonomy.auto,'CONTENT_UTILITY_UPGRADE']}};
  const packet=buildDecisionPacket({google:g,policy:p,state:{},now:new Date('2026-10-08T08:00:00Z')});
  assert.equal(packet.recommendedAction.type,'CONTENT_UTILITY_UPGRADE');
  assert.equal(packet.recommendedAction.autonomous,true);
});


test('sitewide organic partner friction can trigger a page CRO test',()=>{
  const g=google();
  g.ga4.commercialByPageChannel=[
    {eventName:'partner_impression',pagePath:'/elavtal/billigaste-elavtalet/',channel:'Organic Search',eventCount:40,totalUsers:10},
    {eventName:'affiliate_click',pagePath:'/elavtal/billigaste-elavtalet/',channel:'Organic Search',eventCount:1,totalUsers:1},
  ];
  const p={
    ...policy,
    thresholds:{
      ...policy.thresholds,
      cro:{...policy.thresholds.cro,minPagePartnerImpressions:30,minPagePartnerUsers:8,maxPageAffiliateClickRate:0.08},
      contentUtility:{minImpressions:100,minPosition:16,maxPosition:40,maxClicks:1}
    },
    autonomy:{auto:[...policy.autonomy.auto,'PAGE_COMMERCIAL_CRO_TEST']}
  };
  const packet=buildDecisionPacket({google:g,policy:p,state:{},now:new Date('2026-10-08T08:00:00Z')});
  assert.equal(packet.recommendedAction.type,'PAGE_COMMERCIAL_CRO_TEST');
  assert.equal(packet.recommendedAction.details.pagePath,'/elavtal/billigaste-elavtalet/');
  assert.equal(packet.recommendedAction.autonomous,true);
});

test('sitewide commercial CRO ignores tiny organic samples',()=>{
  const g=google();
  g.ga4.commercialByPageChannel=[
    {eventName:'partner_impression',pagePath:'/elavtal/billigaste-elavtalet/',channel:'Organic Search',eventCount:30,totalUsers:2},
    {eventName:'affiliate_click',pagePath:'/elavtal/billigaste-elavtalet/',channel:'Organic Search',eventCount:0,totalUsers:0},
  ];
  const p={
    ...policy,
    thresholds:{
      ...policy.thresholds,
      cro:{...policy.thresholds.cro,minPagePartnerImpressions:30,minPagePartnerUsers:8,maxPageAffiliateClickRate:0.08},
      contentUtility:{minImpressions:100,minPosition:16,maxPosition:40,maxClicks:1}
    },
    autonomy:{auto:[...policy.autonomy.auto,'PAGE_COMMERCIAL_CRO_TEST']}
  };
  const packet=buildDecisionPacket({google:g,policy:p,state:{},now:new Date('2026-10-08T08:00:00Z')});
  assert.notEqual(packet.recommendedAction.type,'PAGE_COMMERCIAL_CRO_TEST');
});

test('cancelled test is not a running lock and is not given a review date',()=>{
  const g=google();
  g.gsc.queryPages=[
    {query:'jämför försäkring',page:'https://sankkostnaden.se/forsakring/jamfor-forsakring/',impressions:100,clicks:0,ctr:0,position:8},
    {query:'vad menas med kvartspris på el',page:'https://sankkostnaden.se/elavtal/kvartspris/',impressions:90,clicks:0,ctr:0,position:9},
  ];
  const p={...policy,limits:{maxConcurrentExperiments:2,maxConcurrentSeoExperiments:1,...policy.limits}};
  const packet=buildDecisionPacket({
    google:g,policy:p,
    state:{activeExperiment:null,activeExperiments:[]},
    learningLedger:{cancelledExperiments:[{type:'SEO_SNIPPET_TEST',query:'jämför försäkring',cancelledAt:'2026-10-08'}]},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  assert.equal(packet.activeExperiments.length,0);
  assert.equal(packet.recommendedAction.type,'SEO_SNIPPET_TEST');
  assert.equal(packet.recommendedAction.details.query,'vad menas med kvartspris på el');
});

test('one active insurance experiment permits unrelated electricity opportunity with two slots',()=>{
  const g=google();
  g.gsc.queryPages=[
    {query:'billigaste elavtalet',page:'https://sankkostnaden.se/elavtal/billigaste-elavtalet/',impressions:150,clicks:0,ctr:0,position:8},
    {query:'jämför hemförsäkring',page:'https://sankkostnaden.se/forsakring/jamfor-hemforsakring/',impressions:160,clicks:0,ctr:0,position:7},
  ];
  const p={...policy,limits:{...policy.limits,maxConcurrentExperiments:2,maxConcurrentSeoExperiments:1}};
  const packet=buildDecisionPacket({
    google:g,policy:p,
    state:{activeExperiments:[{id:'insurance-ui',type:'PAGE_COMMERCIAL_CRO_TEST',target:'/forsakring/',status:'running',earliestReviewAt:'2026-10-15T08:00:00Z'}]},
    now:new Date('2026-10-08T08:00:00Z'),
  });
  assert.equal(packet.recommendedAction.type,'SEO_SNIPPET_TEST');
  assert.equal(packet.recommendedAction.details.query,'billigaste elavtalet');
  assert.equal(packet.guardrails.activeExperimentBlocksGrowth,false);
  assert.equal(packet.activeExperiments.length,1);
});

test('shared category is blocked and full experiment slots gate growth',()=>{
  const g=google();
  g.gsc.queryPages=[{query:'jämför försäkring',page:'https://sankkostnaden.se/forsakring/jamfor-forsakring/',impressions:150,clicks:0,ctr:0,position:8}];
  const p={...policy,limits:{...policy.limits,maxConcurrentExperiments:2,maxConcurrentSeoExperiments:1}};
  const state={activeExperiments:[
    {id:'insurance-ui',type:'PAGE_COMMERCIAL_CRO_TEST',target:'/forsakring/',status:'running',earliestReviewAt:'2026-10-15T08:00:00Z'},
    {id:'electricity-calc',type:'CONTENT_UTILITY_UPGRADE',target:'/elavtal/',status:'running',earliestReviewAt:'2026-10-15T08:00:00Z'},
  ]};
  const packet=buildDecisionPacket({google:g,policy:p,state,now:new Date('2026-10-08T08:00:00Z')});
  assert.equal(packet.recommendedAction.type,'WAITING_FOR_EXPERIMENT');
  assert.equal(packet.guardrails.activeExperimentBlocksGrowth,true);
  assert.equal(packet.guardrails.activeExperimentCount,2);
});

test('autopilot summary includes factual release context without treating it as proven revenue',()=>{
 const packet=buildDecisionPacket({
   google:google('2026-10-09T07:00:00Z'),
   policy,
   state:{activeExperiments:[]},
   now:new Date('2026-10-09T07:00:00Z'),
 });
 packet.projectContext={
   updatedAt:'2026-10-09',
   latestVerifiedMainCommit:'a067020d',
   checkoutSha:'abcdef012345',
   shipped:[{pr:74,scope:'15-minute spot prices'},{pr:75,scope:'Electricity shift scenario'}],
   decisionContext:{
     design:'Blue/navy and minimal, one choice at a time.',
     pricing:'Spot prices do not imply provider price rankings.',
   },
   unresolved:['Cloudflare deployment unverified','Approved revenue unverified'],
 };
 const markdown=toMarkdown(packet);
 assert.match(markdown,/## Aktuellt produktläge/);
 assert.match(markdown,/#74 15-minute spot prices/);
 assert.match(markdown,/#75 Electricity shift scenario/);
 assert.match(markdown,/Cloudflare deployment unverified/);
 assert.match(markdown,/Spot prices do not imply provider price rankings/);
 assert.equal(packet.recommendedAction.type,'WAITING_FOR_SIGNAL');
});
