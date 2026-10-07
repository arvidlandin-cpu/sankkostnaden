import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dateRange,
  normalizeGa4Channels,
  normalizeGa4Events,
  normalizeGa4LandingChannels,
  normalizeGa4EventChannels,
  normalizeGa4CommercialPageChannels,
  normalizeGa4Totals,
  normalizeGscRows,
  normalizeGscPairs,
  normalizeGscDateQueryRows,
  normalizeGscTotals,
  toMarkdown,
} from '../scripts/lib/googleOrganicPerformance.mjs';

test('date range is inclusive and ends one day before now',()=>{
  const range=dateRange(30,new Date('2026-10-07T12:00:00Z'),1);
  assert.deepEqual(range,{startDate:'2026-09-07',endDate:'2026-10-06',days:30});
});

test('normalizes GA4 totals and channels',()=>{
  const totals=normalizeGa4Totals({rows:[{metricValues:[{value:'12'},{value:'7'},{value:'8'},{value:'24'}]}]});
  assert.deepEqual(totals,{sessions:12,activeUsers:7,totalUsers:8,pageViews:24});
  const channels=normalizeGa4Channels({rows:[
    {dimensionValues:[{value:'Direct'}],metricValues:[{value:'9'},{value:'5'}]},
    {dimensionValues:[{value:'Organic Search'}],metricValues:[{value:'3'},{value:'2'}]},
  ]});
  assert.equal(channels[1].channel,'Organic Search');
  assert.equal(channels[1].sessions,3);
});

test('normalizes Search Console totals and rows',()=>{
  const totals=normalizeGscTotals({rows:[{clicks:2,impressions:40,ctr:0.05,position:12.3}]});
  assert.equal(totals.clicks,2);
  const rows=normalizeGscRows({rows:[{keys:['hemförsäkring bostadsrätt'],clicks:1,impressions:20,ctr:0.05,position:18.2}]},'query');
  assert.equal(rows[0].query,'hemförsäkring bostadsrätt');
  const pairs=normalizeGscPairs({rows:[{keys:['jämför elavtal','https://sankkostnaden.se/elavtal/jamfor-elavtal/'],clicks:0,impressions:58,ctr:0,position:24.7}]});
  assert.equal(pairs[0].page,'https://sankkostnaden.se/elavtal/jamfor-elavtal/');
});

test('unconfigured report does not expose credentials',()=>{
  const md=toMarkdown({generatedAt:'2026-10-07T00:00:00Z',configured:false,ga4:null,gsc:null});
  assert.match(md,/GOOGLE_SERVICE_ACCOUNT_JSON saknas/);
  assert.doesNotMatch(md,/private_key|client_email/);
});


test('normalizes app funnel events and landing channels',()=>{
  const events=normalizeGa4Events({rows:[
    {dimensionValues:[{value:'cost_check_complete'},{value:'/app/'}],metricValues:[{value:'4'},{value:'3'}]},
  ]});
  assert.equal(events[0].eventName,'cost_check_complete');
  assert.equal(events[0].eventCount,4);
  const landings=normalizeGa4LandingChannels({rows:[
    {dimensionValues:[{value:'/app/'},{value:'Organic Search'}],metricValues:[{value:'7'},{value:'5'},{value:'4'},{value:'0.5714'},{value:'38.5'}]},
  ]});
  assert.equal(landings[0].channel,'Organic Search');
  assert.equal(landings[0].sessions,7);
  assert.equal(landings[0].engagedSessions,4);
  assert.equal(landings[0].engagementRate,0.5714);
  assert.equal(landings[0].averageSessionDuration,38.5);
});


test('normalizes app funnel by traffic channel',()=>{
  const rows=normalizeGa4EventChannels({rows:[
    {dimensionValues:[{value:'cost_check_answer'},{value:'Organic Search'}],metricValues:[{value:'9'},{value:'4'}]},
  ]});
  assert.equal(rows[0].channel,'Organic Search');
  assert.equal(rows[0].eventCount,9);
});


test('normalizes daily Search Console query rows',()=>{
  const rows=normalizeGscDateQueryRows({rows:[
    {keys:['2026-10-06','jämför försäkring'],clicks:0,impressions:7,ctr:0,position:6.8},
    {keys:['2026-10-05','jämför försäkring'],clicks:0,impressions:5,ctr:0,position:7.2},
  ]});
  assert.equal(rows[0].date,'2026-10-05');
  assert.equal(rows[1].query,'jämför försäkring');
});


test('normalizes commercial events by page and channel',()=>{
  const rows=normalizeGa4CommercialPageChannels({rows:[
    {dimensionValues:[{value:'partner_impression'},{value:'/elavtal/billigaste-elavtalet/'},{value:'Organic Search'}],metricValues:[{value:'32'},{value:'11'}]},
    {dimensionValues:[{value:'affiliate_click'},{value:'/elavtal/billigaste-elavtalet/'},{value:'Organic Search'}],metricValues:[{value:'2'},{value:'2'}]},
  ]});
  assert.equal(rows[0].pagePath,'/elavtal/billigaste-elavtalet/');
  assert.equal(rows[0].channel,'Organic Search');
  assert.equal(rows[0].eventCount,32);
  assert.equal(rows[1].eventName,'affiliate_click');
});
