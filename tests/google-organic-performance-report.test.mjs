import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dateRange,
  normalizeGa4Channels,
  normalizeGa4Totals,
  normalizeGscRows,
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
});

test('unconfigured report does not expose credentials',()=>{
  const md=toMarkdown({generatedAt:'2026-10-07T00:00:00Z',configured:false,ga4:null,gsc:null});
  assert.match(md,/GOOGLE_SERVICE_ACCOUNT_JSON saknas/);
  assert.doesNotMatch(md,/private_key|client_email/);
});
